# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two independent Node projects living side by side, with no top-level package or workspace tooling:

- [client/](client/) — Expo / React Native mobile app (`chalo-khelne`, Expo SDK 54, RN 0.81, React 19, New Architecture enabled).
- [server/](server/) — Express + Mongoose REST API with Socket.io (`server`, Node CommonJS).

There is no monorepo root. Run commands from inside `client/` or `server/`. The client talks to the server over HTTP/WebSocket; the URL is hardcoded in client config (see "Pointing the client at a backend" below).

## Common commands

All commands assume you've `cd`'d into the right project first.

### Server ([server/](server/))

```
npm install
npm start                                     # nodemon server.js, port 3003 by default
node createSuperAdmin.js <email> <password>   # one-off: bootstrap a SuperAdmin
node scripts/seedRbac.js                      # seed RBAC permissions + roles (see scripts/)
node scripts/<seed-or-migrate-script>.js      # other seeds/migrations live in server/scripts/
npx jest tests/multiSport.test.js --verbose   # run the multi-sport scoring tests (jest is NOT in package.json — install once: npm i -D jest)
```

There is no lint command and `npm test` is the default placeholder. The single existing test file is [server/tests/multiSport.test.js](server/tests/multiSport.test.js) and requires Jest to be installed manually.

### Client ([client/](client/))

```
npm install
npm start            # expo start --lan (Metro bundler, scan QR with Expo Go / dev client)
npm run android      # expo start --android
npm run ios          # expo start --ios
npm run web          # expo start --web
```

EAS builds (Android) are configured in [client/eas.json](client/eas.json) with three channels: `development` (APK, internal), `preview` (APK, internal), `production` (AAB, auto-incremented). OTA updates ship via Expo Updates (`runtimeVersion.policy: appVersion`).

### Pointing the client at a backend

There are **two** client-side configs for the API base URL and they don't agree — be aware before changing one:

- [client/src/api/api.js](client/src/api/api.js) — toggled by changing the `Wbsite_SERVER_URL` constant at the top. Currently set to a LAN IP (`http://192.168.1.24:3003`). Most legacy code reads from here.
- [client/src/config/env.js](client/src/config/env.js) — `ACTIVE_ENV` switch between `development` / `staging` / `production`. Currently `production` (`https://chalokhelne.com`).

When wiring up a new screen, prefer importing from `config/env`. When debugging "why is the app hitting prod?", check both files.

## Server architecture

### Entry point and route mounting

[server/server.js](server/server.js) is the only entrypoint. It:

1. Sets fallback DNS (8.8.8.8) to work around SRV resolution issues on Windows/MongoDB Atlas.
2. Loads env, connects Mongoose, then on connect drops a legacy unique index on `invitations` (`senderId_1_receiverId_1_tournamentId_1`) — this is intentional, removing it without replacement will cause E11000 errors to come back.
3. Conditionally serves HTTPS when `USE_SSL=true` AND `NODE_ENV=production` AND the configured cert/key paths exist; otherwise plain HTTP.
4. Mounts ~40 route files under `/api/*` (see the long `app.use(...)` list).
5. Attaches Socket.io to the same HTTP(S) server via [server/socket/socketHandler.js](server/socket/socketHandler.js).

Routes are mounted directly; there is no API versioning. The two route files [server/routes/playerRoutes.js](server/routes/playerRoutes.js) and [server/routes/tournamentRoutes.js](server/routes/tournamentRoutes.js) are extremely large (>20kB each) and act as catch-alls for "things a player does" / "tournament + match flow" — search inside them rather than assuming a route lives in a more specific file.

`server/cron/notificationCron.js` defines a node-cron job but **is not currently imported by `server.js`** — it's dead code unless someone re-wires it.

### Auth: three account models, two parallel middlewares

The server has **three separate Mongoose models for accounts**, not a single users table:

- `User` ([server/Modal/User.js](server/Modal/User.js)) — mobile-app users (Players, Trainers, Referees, ClubAdmins, etc.) with a string `role` field.
- `Manager` (in [server/Modal/ClubManager.js](server/Modal/ClubManager.js)) — club managers, separate collection.
- `Superadminmodel` ([server/Modal/Superadminmodel.js](server/Modal/Superadminmodel.js)) — separate again.

JWT payloads come in two shapes: User-style (`decoded.id`) and Manager-style (`decoded.userId`). Every middleware that resolves a token tolerates both via `decoded.id || decoded.userId`. SuperAdmin tokens carry `role:"superadmin"` and an email but no id. Preserve this pattern when touching auth code.

Two middleware layers exist in parallel:

- **Legacy** ([server/middleware/authMiddleware.js](server/middleware/authMiddleware.js)) — `managerAuth`, `authenticate`, `allowUserOrManager`. This is what nearly all routes actually use.
- **RBAC** ([server/middleware/rbacMiddleware.js](server/middleware/rbacMiddleware.js)) — `unifiedAuth` + `requirePermission` / `requireAnyPermission` / `requireAuthority` / `requireRole`, backed by `Permission` and `Role` models and seeded via [server/scripts/seedRbac.js](server/scripts/seedRbac.js). **As of this writing it is not yet wired into any route file** — `unifiedAuth` has zero callers outside the middleware itself. It exists to migrate to, not in active enforcement.

Lower `authorityLevel` = higher authority (SuperAdmin=0, ClubAdmin=1, Manager=2, …). The legacy role string on `User.role` is mapped to RBAC slugs by `mapLegacyRole()`.

### Multi-sport scoring: MatchFactory is mandatory

The match domain has been migrated to support multiple sports (sets-based, time-based, innings-based, single-score). The big rule:

> **All match creation MUST go through [server/factories/MatchFactory.js](server/factories/MatchFactory.js).**

Every match schema (`Tournnamentmatch`, `DirectKnockoutMatch`, `SuperMatch`, `KnockoutMatch`, `TeamKnockoutMatches`) extends `BASE_MATCH_FIELDS` from [server/Modal/shared/BaseMatchFields.js](server/Modal/shared/BaseMatchFields.js), which:

- Adds `sportName`, `scoringType`, `matchResult`, `status` to every match.
- Installs a `pre("save")` hook that **rejects any new document without `_createdViaFactory: true`**. Bypassing the factory is by design impossible for `.save()`-based creation (but `insertMany` is allowed through with only a log warning).

Supporting pieces:

- [server/utils/matchFormatUtils.js](server/utils/matchFormatUtils.js) — `getScoringType(sportName)`, field whitelists per scoring type, `freezeMatchFormat`, `SAFE_DEFAULTS` (legacy only).
- [server/utils/matchUtils.js](server/utils/matchUtils.js) — read side: `readMatchResult`, `getScoreDisplay`, `getWinner`, `isCompleted`. **All score reads MUST go through these helpers**, not direct field access.
- [server/utils/validateMatchResult.js](server/utils/validateMatchResult.js) — validation per scoring type.
- [server/utils/sportFieldConfig.js](server/utils/sportFieldConfig.js) — drives dynamic form rendering; mirrored in the client.

`Tournament` schemas carry a `sportTracks[]` sub-array so one tournament can host multiple sports, each with its own format, rules, and stage progression — and legacy root-level scalars (`sportsType`, `matchFormat`, `category`, etc.) are still read as fallback via `sportTrackUtils`. Don't remove those root fallbacks without a migration.

### File uploads

[server/middleware/uploads.js](server/middleware/uploads.js) uses local-disk multer storage rooted at `server/uploads/{profiles,certificates,identity-docs,tournaments,events,turfs,qrcodes}`. The static mount is `app.use("/uploads", express.static(...))`. 5MB cap. Cloudinary is configured ([server/Config/Cloudinary.js](server/Config/Cloudinary.js)) but the bulk of uploads currently go to the local disk; mixing the two is intentional.

### Real-time (Socket.io)

[server/socket/socketHandler.js](server/socket/socketHandler.js) authenticates the same JWT shapes as HTTP routes. Clients join rooms named:

- `user_<userId>` (auto-joined for personal pushes)
- `conv_<conversationId>`, `match_<matchId>`, `tournament_<tournamentId>`, `forum_<forumId>`, `gchat_<chatId>`

Server-side broadcasts go through `app.get("io").to(room).emit(...)`. Online presence is broadcast on connect/disconnect.

## Client architecture

### Provider stack and routing

[client/App.js](client/App.js) wraps the app in this order: `SafeAreaProvider` → `AuthProvider` → `NotificationProvider` → `ChatProvider` → `OnboardingProvider` → `NavigationContainer`. The container `linking` config maps `chalokhelne://tournament/details/:tournamentId` into both authed and unauthed navigators.

[client/src/navigation/AppNavigator.js](client/src/navigation/AppNavigator.js) is the routing switch:

1. While onboarding status is being fetched (`/onboarding/status?deviceId=...`) it shows a spinner.
2. If onboarding is incomplete → `OnboardingNavigator`.
3. Else if authenticated → role-based navigator (today only `Player` is implemented; everything else falls through to `PlayerNavigator`).
4. Else → `ViewerNavigator` (read-only browsing for unauthenticated users).

Onboarding is keyed by `deviceId` from [client/src/utils/deviceId.js](client/src/utils/deviceId.js), not user id, so the same install does not re-onboard after login.

### Auth context + global 401 handling

[client/src/context/AuthContext.js](client/src/context/AuthContext.js) is the source of truth for `user`/`token` and persists both to AsyncStorage (`auth_token`, `auth_user`). On mount it:

1. Reads stored token, locally decodes the JWT payload and discards it if `exp` has passed.
2. Calls `/api/auth/me` (`AUTH.ENDPOINTS.CURRENT_USER`) to refresh the user; treats 401 as a hard logout.
3. Registers an Expo push token for the user.

[client/src/services/apiClient.js](client/src/services/apiClient.js) is an Axios instance that:

- Attaches `Authorization: Bearer <token>` from AsyncStorage on every request.
- Pre-checks expiry locally (60s buffer) and triggers logout before sending.
- On any 401 response, clears storage and calls a callback registered via `setTokenExpiredHandler()` — `AuthContext` wires its `logout` into that callback on mount.

When adding new API calls, prefer this `apiClient` instance over hand-rolled `fetch`/`axios` so token refresh-on-expiry behaviour stays consistent. Plenty of legacy code still uses raw `fetch` against `AUTH.ENDPOINTS.*`; don't be surprised.

### Notifications

[client/src/services/NotificationService.js](client/src/services/NotificationService.js) holds the navigation ref (set from `App.js`) so push-tap deep links can `navigate(...)` without going through a context. Push tokens are registered to the user on every successful login/restore.

### Theming / fonts

Global Montserrat + Poppins font families are loaded in `App.js`; splash is held with `expo-splash-screen` until they load. The whole app is locked to portrait by default — individual screens that need landscape (e.g. the umpire/referee scorer) self-lock and re-lock portrait on blur. Honour this pattern when adding orientation-sensitive screens.

## Conventions worth knowing

- **`server/Modal/` (sic — not `models/`)** is the canonical folder name for Mongoose schemas. Keep new schemas there.
- **Imports use `require()`** in the server (CommonJS). One file, [server/Config/Cloudinary.js](server/Config/Cloudinary.js), uses `import` — it's an outlier and only runs if someone wires it in.
- **Two legacy auth functions handle slightly different token shapes**; pick `allowUserOrManager` when an endpoint should accept either a User-JWT or Manager-JWT, `managerAuth` for manager-only, `authenticate` for User-only. The new RBAC stack is the destination but not yet wired.
- **MongoDB connection string and JWT secret live in [server/.env](server/.env)** with no `.env.example` — copy from there when setting up a new environment. The repo currently commits this file; treat the secrets in it as compromised, but don't gratuitously rotate without coordination.
- **Filename casing is inconsistent** in `server/controllers/` (note `booking groupcontroller.js` with a literal space, `Tournnamentmatch.js` with a typo) — preserve these names rather than "fixing" them; many `require(...)` paths depend on them.
