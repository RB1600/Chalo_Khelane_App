// config/api.js — Central API configuration
//
// Single source of truth lives in src/config/env.js (ACTIVE_ENV switch).
// This file just re-exports those URLs so the legacy code that reads from
// here stays in sync with the rest of the app and never gets a stale LAN IP.

import { SERVER_URL as ENV_SERVER_URL, BASE_URL as ENV_BASE_URL, UPLOADS_URL as ENV_UPLOADS_URL } from "../config/env";

const Wbsite_SERVER_URL = ENV_SERVER_URL;
const SERVER_URL = ENV_SERVER_URL;
const BASE_URL = ENV_BASE_URL;
const UPLOADS_URL = ENV_UPLOADS_URL;

// API endpoints based on your existing routes
const ENDPOINTS = {
  TURFS: {
    BASE: `${BASE_URL}/turfs`,
    BY_ID: (id) => `${BASE_URL}/turfs/${id}`,
    OWNER: `${BASE_URL}/turfs/owner`,
    REVIEWS: (id) => `${BASE_URL}/turfs/${id}/reviews`,
    TOGGLE_STATUS: (id) => `${BASE_URL}/turfs/${id}/toggle-status`,

    // Get certified trainers for a specific turf
    CERTIFIED_TRAINERS: (turfId) =>
      `${BASE_URL}/trainer/certified-trainers/${turfId}`,
  },

  USER: {
    BASE: `${BASE_URL}/users`,
    FAVORITES: `${BASE_URL}/users/favorites`,
    TOGGLE_FAVORITE: `${BASE_URL}/users/favorites/toggle`,
    CHECK_FAVORITE: `${BASE_URL}/users/favorites/check`,
    USER_FAVORITES: (userId) => `${BASE_URL}/users/user-favorites/${userId}`,
    SEARCH: (query) => `${BASE_URL}/users/search?q=${query}`, // Add search endpoint
    VALIDATE_PLAYERS: `${BASE_URL}/players/users/validate-players`,
  },

  // Add turf booking endpoints
  TURF_BOOKINGS: {
    CREATE: `${BASE_URL}/players/turf-bookings/create`,
    USER_BOOKINGS: (userId) =>
      `${BASE_URL}/players/turf-bookings/user/${userId}`,
    TURF_BOOKINGS: (turfId) =>
      `${BASE_URL}/players/turf-bookings/turf/${turfId}`,
    BY_ID: (bookingId) => `${BASE_URL}/players/turf-booking/${bookingId}`,
    CANCEL: `${BASE_URL}/players/turf-bookings/cancel`,
    AVAILABILITY: (turfId) => `${BASE_URL}/players/turf-availability/${turfId}`,
  },

  // Tournament endpoints
  TOURNAMENTS: {
    BASE: `${BASE_URL}/tournaments`,
    BY_ID: (id) => `${BASE_URL}/tournaments/${id}`,
  },

  // Payment and booking endpoints
  PAYMENTS: {
    CREATE_ORDER: `${BASE_URL}/players/create-order`,
    VERIFY_PAYMENT: `${BASE_URL}/players/verify-payment`,
    PAYMENT_STATUS: (orderId) =>
      `${BASE_URL}/players/payment-status/${orderId}`,
  },

  BOOKINGS: {
    CREATE: `${BASE_URL}/players/bookings/create`,
    BY_USER: (userId) => `${BASE_URL}/players/bookings/user/${userId}`,
    BY_ID: (id) => `${BASE_URL}/players/booking/${id}`,
    STATUS: `${BASE_URL}/players/bookings/status`,
    CANCEL: `${BASE_URL}/players/bookings/cancel`,
  },

  // Authentication endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    VERIFY: `${BASE_URL}/auth/verify`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,
  },

  // Profile endpoints
  PROFILE: {
    GET: `${BASE_URL}/users/profile`,
    UPDATE: `${BASE_URL}/users/profile`,
    UPLOAD_PHOTO: `${BASE_URL}/users/profile/photo`,
  },
};

export default {
  SERVER_URL,
  BASE_URL,
  UPLOADS_URL,
  ENDPOINTS,
  Wbsite_SERVER_URL
};
