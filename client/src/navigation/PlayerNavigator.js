import React from "react";
import {
  StyleSheet,
  Platform,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import {
  getFocusedRouteNameFromRoute,
  useNavigationState,
  useIsFocused,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import PlayerHomeScreen from "../screens/player/PlayerHomeScreen";
import PlayerProfileScreen from "../screens/player/PlayerProfileScreen";
import PlayerVenueDetails from "../screens/player/PlayerVenueDetails";
import PlayerVenue from "../screens/player/PlayerVenue";
import TournamentDetails from "../screens/player/TournamentDetails";
import RegistrationDetails from "../screens/player/RegistrationDetails";
import Event from "../screens/player/Event";
import GroupStage from "../screens/player/GroupStage";
import TeamKnockouts from "../screens/player/TeamKnockouts";
import BookingScreen from "../screens/player/BookingScreen";
import BookingConfirmation from "../screens/player/BookingConfirmation";
import AllTournamentsScreen from "../screens/player/AllTournamentsScreen";
import SocialScreen from "../screens/player/SocialScreen";
import EditProfileScreen from "../screens/player/EditPlayerProfileScreen";
import FAQScreen from "../screens/player/FAQS";
import PrivacyPolicyScreen from "../screens/player/PrivacyPolicy";
import TermsCondition from "../screens/player/TermsConditions";
import MyBooking from "../screens/player/MyBookings";
import FavoriteVenue from "../screens/player/FavoriteVenue";
import PaymentHistory from "../screens/player/PaymentHistory";
import MyEventScreen from "../screens/player/MyEvents";
import MyEventDetailsScreen from "../screens/player/MyEventDetails";
import ComingSoonScreen from "../screens/player/ComingSoonScreen";
import VenueBookingScreen from "../screens/player/VenueBookingScreen";
import VenueBookingConfirmation from "../screens/player/VenueBookingConfirmation";
import PlayerPaymentScreen from "../screens/player/PlayerPaymentScreen";
import TournamentFeeSummary from "../screens/player/TournamentFeeSummary";
import PaymentStatusScreen from "../screens/player/PaymentStausScreen";
import PlayersManager from "../screens/player/PlayersManager";
import TournamentLeaderboardDetail from "../screens/player/TournamentLeaderboardDetail";
import Profile from "../screens/player/Profile";
import DonationListScreen from "../screens/player/DonationListScreen";
import DonationDetailScreen from "../screens/player/DonationDetailScreen";
import CreateListingScreen from "../screens/player/CreateListingScreen";
import EquipmentHubScreen from "../screens/player/EquipmentHubScreen";
import MyListingsScreen from "../screens/player/MyListingsScreen";
import MyClaimsScreen from "../screens/player/MyClaimsScreen";
import ChatListScreen from "../screens/player/ChatListScreen";
import ChatConversationScreen from "../screens/player/ChatConversationScreen";
import ChatSearchScreen from "../screens/player/ChatSearchScreen";
import GroupChatListScreen from "../screens/player/GroupChatListScreen";
import InvitePlayerScreen from "../screens/player/InvitePlayerScreen";
import InvitationsScreen from "../screens/player/InvitationsScreen";
import NotificationsScreen from "../screens/player/NotificationsScreen";
import RoleHub from "../screens/player/RoleHub";
import ServiceProfileSetup from "../screens/player/ServiceProfileSetup";
import BrowseTournamentJobs from "../screens/player/BrowseTournamentJobs";
import BrowseJobs from "../screens/player/BrowseJobs";
import HireProfessional from "../screens/player/HireProfessional";
import JobDetails from "../screens/player/JobDetails";
import RefereeAssignmentsScreen from "../screens/referee/RefereeAssignmentsScreen";
import RefereeMatchScorer from "../screens/referee/RefereeMatchScorer";
import TournamentHistory from "../screens/player/TournamentHistory";
import Planner from "../screens/player/Planner";
import AddNote from "../screens/player/AddNote";
import DaySchedule from "../screens/player/DaySchedule";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home stack navigator for Player
const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="PlayerHome">
      <Stack.Screen
        name="TurfDetails"
        component={PlayerVenueDetails}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="PlayerHome"
        component={PlayerHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="InvitePlayer"
        component={InvitePlayerScreen}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="PlayerProfile"
        component={PlayerProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Planner"
        component={Planner}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="DaySchedule"
        component={DaySchedule}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="AddNote"
        component={AddNote}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="FAQScreen"
        component={FAQScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FavouriteVenue"
        component={FavoriteVenue}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyEventScreen"
        component={MyEventScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyEventDetails"
        component={MyEventDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyBookings"
        component={MyBooking}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HelpSupportScreen"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermsConditionsScreen"
        component={TermsCondition}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tournament Details"
        component={TournamentDetails}
        options={{ headerShown: true, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="PaymentHistoryScreen"
        component={PaymentHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmation}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="TurfConfirmation"
        component={VenueBookingConfirmation}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="TurfList"
        component={PlayerVenue}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TurfBooking"
        component={VenueBookingScreen}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />

      {/* Sidebar: Sports Jobs & Opportunities */}
      <Stack.Screen name="BrowseJobs" component={BrowseJobs} options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
      <Stack.Screen name="HireProfessional" component={HireProfessional} options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
      <Stack.Screen name="JobDetails" component={JobDetails} options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />

      {/* Service Role screens (reachable from TournamentDetails → Apply as Staff) */}
      <Stack.Screen name="BrowseTournamentJobsHome" component={BrowseTournamentJobs} options={{ headerShown: false }} />
      <Stack.Screen name="RoleHubHome" component={RoleHub} options={{ headerShown: false }} />
      <Stack.Screen name="ServiceProfileSetupHome" component={ServiceProfileSetup} options={{ headerShown: false }} />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />

      <Stack.Screen
        name="TournamentLeaderboardDetail"
        component={TournamentLeaderboardDetail}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="RefereeMatchScorer"
        component={RefereeMatchScorer}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="RegistrationDetails"
        component={RegistrationDetails}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="Booking Screen"
        component={BookingScreen}
        options={{ headerShown: true, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="Payment Method"
        component={TournamentFeeSummary}
        options={{ headerShown: true, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="Cash Payment"
        component={PaymentStatusScreen}
        options={{ headerShown: true, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="Online Payment"
        component={PlayerPaymentScreen}
        options={{ headerShown: true, tabBarStyle: { display: 'none' } }}
      />
    </Stack.Navigator>
  );
};

const TournamentsStack = () => {
  return (
    <Stack.Navigator initialRouteName="AllTournaments">
      <Stack.Screen
        name="AllTournaments"
        component={AllTournamentsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupStage"
        component={GroupStage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TeamKnockouts"
        component={TeamKnockouts}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="BrowseTournamentJobsHome" component={BrowseTournamentJobs} options={{ headerShown: false }} />
      <Stack.Screen name="ServiceProfileSetupHome" component={ServiceProfileSetup} options={{ headerShown: false }} />
      <Stack.Screen name="RoleHubHome" component={RoleHub} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const EventStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="EventScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="EventScreen"
        component={Event}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tournament Details"
        component={TournamentDetails}
        options={({ navigation }) => ({
          headerShown: true,
          // Hide tab bar when navigating to this screen
          tabBarStyle: { display: 'none' },
        })}
      />
      <Stack.Screen
        name="RegistrationDetails"
        component={RegistrationDetails}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="GroupStage"
        component={PlayersManager}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="TeamKnockouts"
        component={TeamKnockouts}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="InvitePlayer"
        component={InvitePlayerScreen}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="Invitations"
        component={InvitationsScreen}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="Booking Screen"
        component={BookingScreen}
        options={{ headerShown: true, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="Payment Method"
        component={TournamentFeeSummary}
        options={{ headerShown: true, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="Cash Payment"
        component={PaymentStatusScreen}
        options={{ headerShown: true, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="Online Payment"
        component={PlayerPaymentScreen}
        options={{ headerShown: true, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmation}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="Tournament Leaderboard"
        component={TournamentLeaderboardDetail}
        options={{ headerShown: true, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="RefereeMatchScorer"
        component={RefereeMatchScorer}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen name="BrowseTournamentJobsHome" component={BrowseTournamentJobs} options={{ headerShown: false }} />
      <Stack.Screen name="ServiceProfileSetupHome" component={ServiceProfileSetup} options={{ headerShown: false }} />
      <Stack.Screen name="RoleHubHome" component={RoleHub} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const PlayStack = () => {
  return (
    <Stack.Navigator initialRouteName="Play">
      <Stack.Screen
        name="Play"
        component={PlayerVenue}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TurfDetails"
        component={PlayerVenueDetails}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="TurfBooking"
        component={VenueBookingScreen}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="TurfConfirmation"
        component={VenueBookingConfirmation}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
      {/* Add other player home-related screens here */}
    </Stack.Navigator>
  );
};

// const TrainerStack = () => {
//   return (
//     <Stack.Navigator initialRouteName="FindTrainers">
//       <Stack.Screen
//         name="FindTrainers"
//         component={FindTrainersScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="TrainerProfile"
//         component={TrainerProfileScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="TrainerSessions"
//         component={TrainerSessionsScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="BookTraining"
//         component={BookTrainingScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="SessionDetails"
//         component={SessionDetailsScreen}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// };

// Social stack navigator
const SocialStack = () => {
  return (
    <Stack.Navigator initialRouteName="SocialHome">
      <Stack.Screen
        name="SocialHome"
        component={SocialScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ComingSoon"
        component={ComingSoonScreen}
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      />
    </Stack.Navigator>
  );
};

// Chat stack navigator
const ChatStack = () => {
  return (
    <Stack.Navigator initialRouteName="ChatList">
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatConversation"
        component={ChatConversationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatSearch"
        component={ChatSearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupChatList"
        component={GroupChatListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupChatConversation"
        component={ChatConversationScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Profile stack navigator for Player
const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="Player Profile">
      <Stack.Screen
        name="Player Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="My Profile"
        component={PlayerProfileScreen}
        options={{ headerShown: true, tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="FAQ'S"
        component={FAQScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Privacy & Policy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Terms and Conditions"
        component={TermsCondition}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Payment History"
        component={PaymentHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventScreen"
        component={Event}
        options={{ headerShown: true }}
      />
      {/* Equipment Exchange / Donation screens */}
      <Stack.Screen
        name="EquipmentHub"
        component={EquipmentHubScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DonationList"
        component={DonationListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DonationDetail"
        component={DonationDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateListing"
        component={CreateListingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyListings"
        component={MyListingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyClaims"
        component={MyClaimsScreen}
        options={{ headerShown: false }}
      />
      {/* Career Stats */}
      <Stack.Screen
        name="TournamentHistory"
        component={TournamentHistory}
        options={{ headerShown: false }}
      />
      {/* Service Role screens */}
      <Stack.Screen
        name="RoleHub"
        component={RoleHub}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceProfileSetup"
        component={ServiceProfileSetup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BrowseTournamentJobs"
        component={BrowseTournamentJobs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RefereeAssignments"
        component={RefereeAssignmentsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RefereeMatchScorer"
        component={RefereeMatchScorer}
        options={{ headerShown: false }}
      />
      {/* Invitation screens */}
      <Stack.Screen
        name="Invitations"
        component={InvitationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InvitePlayer"
        component={InvitePlayerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const PaymentStack = () => {
  return (
    <Stack.Navigator initialRouteName="PlayerProfile">
      <Stack.Screen
        name="Payment History"
        component={PaymentHistory}
        options={{ headerShown: true }}
      />
      {/* Add other player profile-related screens here */}
    </Stack.Navigator>
  );
};

// Custom Tab Bar component
const CustomTabBar = ({ state, descriptors, navigation, insets }) => {
  const route = state.routes[state.index];
  const focusedRoute = getFocusedRouteNameFromRoute(route);
  const focusedOptions = descriptors[route.key].options;

  // Check if current screen explicitly requested to hide tab bar
  if (focusedOptions?.tabBarStyle?.display === "none") {
    return null;
  }

  // Define screens where tab bar SHOULD be visible (all others will hide it)
  const showOnScreens = [
    "PlayerHome",
    "EventScreen",
    "SocialHome",
    "ChatList",
    "Player Profile",
    undefined // When it's the initial route of the stack
  ];

  if (focusedRoute && !showOnScreens.includes(focusedRoute)) {
    return null;
  }

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        paddingBottom: insets?.bottom || 0,
        paddingTop: 8,
      }}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          // console.log("route", route.key);

          let iconName;
          if (route.name === "Home") {
            iconName = isFocused ? "home" : "home-outline";
          } else if (route.name === "Events") {
            iconName = isFocused ? "calendar" : "calendar-outline";
          } else if (route.name === "Social") {
            iconName = isFocused ? "people" : "people-outline";
          } else if (route.name === "Chat") {
            iconName = isFocused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Profile") {
            iconName = isFocused ? "person" : "person-outline";
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            // Prevent multiple rapid taps
            if (event.defaultPrevented) return;

            // Always navigate to the initial screen of the tab's stack
            switch (route.name) {
              case "Home":
                navigation.navigate("Home", { screen: "PlayerHome" });
                break;
              case "Events":
                navigation.navigate("Events", { screen: "EventScreen" });
                break;
              case "Social":
                navigation.navigate("Social", { screen: "SocialHome" });
                break;
              case "Chat":
                navigation.navigate("Chat", { screen: "ChatList" });
                break;
              case "Profile":
                navigation.navigate("Profile", { screen: "Player Profile" });
                break;
              default:
                navigation.navigate(route.name);
                break;
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <View
                style={[styles.tabContent, isFocused && styles.activeTabPill]}
              >
                <Ionicons
                  name={iconName}
                  size={24}
                  color={isFocused ? "#15A765" : "#5D5D5D"}
                />
                <Text
                  style={[styles.label, isFocused ? styles.activeLabel : null]}
                >
                  {route.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Main tab navigator for Player
const PlayerNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} insets={insets} />}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Events" component={EventStack} />
      <Tab.Screen name="Social" component={SocialStack} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    borderColor: "#ECF4EB",
    borderWidth: 1,
    boxShadow: "0px 0px 18.4px 0px #BDBDDB4D",
    elevation: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    bottom: 5,
    marginHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 24,
  },
  activeTabPill: {
    backgroundColor: "#E8F7F0",
  },
  label: {
    fontSize: 10,
    fontFamily: "Montserrat_600SemiBold",
    color: "#5D5D5D",
  },
  activeLabel: {
    color: "#15A765",
    fontFamily: "Montserrat_600SemiBold",
  },
});

export default PlayerNavigator;
