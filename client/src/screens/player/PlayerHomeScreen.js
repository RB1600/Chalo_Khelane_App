import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  Text,
  TextInput,
  Dimensions,
  FlatList,
  Alert,
  ActivityIndicator,
  Share,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import TOURNAMENTS from "../../api/tournaments";
import Website_SERVER_URL from "../../api/api";
import { useNotifications } from "../../context/NotificationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AUTH from "../../api/auth";
import POSTS from "../../api/posts";
import Sidebar from "./Sidebar";

const PlayerHomeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user, logout, updateUser } = useAuth();
  const { unreadCount: unreadNotifications } = useNotifications();
  const [favorites, setFavorites] = useState({});
  const scaleAnim = useRef({}).current;
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  // Sidebar state
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarX = useRef(new Animated.Value(-windowWidth)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const windowWidth = Dimensions.get("window").width;
  const notificationPanelX = useRef(new Animated.Value(windowWidth)).current;

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState({
    tournaments: true,
    posts: true,
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    turfs: [],
    tournaments: [],
    users: [],
    trainers: [],
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchFreshUserData();
    fetchTournaments();
  }, []);

  const fetchFreshUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (token && user?.id) {
        const response = await fetch(AUTH.ENDPOINTS.CURRENT_USER, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        });

        if (response.ok) {
          const freshUser = await response.json();
          await updateUser(freshUser);
        }
      }
    } catch (error) {
      console.warn("Could not fetch fresh user data:", error);
    }
  };

  const toggleNotifications = () => {
    if (!notificationsVisible) {
      fetchNotificationsData();
    }

    navigation.getParent()?.setOptions({
      tabBarStyle: notificationsVisible
        ? { display: "flex" }
        : { display: "none" },
    });

    Animated.timing(notificationPanelX, {
      toValue: notificationsVisible ? windowWidth : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setNotificationsVisible(!notificationsVisible);
  };

  const openSidebar = () => {
    setSidebarVisible(true);
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });
    Animated.parallel([
      Animated.timing(sidebarX, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSidebar = () => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "flex" },
    });
    Animated.parallel([
      Animated.timing(sidebarX, {
        toValue: -windowWidth,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setSidebarVisible(false));
  };

  const fetchNotificationsData = async () => {
    if (!user?.id) return;
    setNotificationsLoading(true);
    try {
      const response = await fetch(TOURNAMENTS.ENDPOINTS.NOTIFICATIONS.USER(user.id));
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(TOURNAMENTS.ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId), { method: "PUT" });
      setNotifications(notifications.map((n) => n._id === notificationId ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await fetch(TOURNAMENTS.ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ(user.id), { method: "PUT" });
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const fetchTournaments = async () => {
    setLoading((prev) => ({ ...prev, tournaments: true }));
    try {
      const response = await fetch(TOURNAMENTS.ENDPOINTS.BASE);
      const data = await response.json();
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const processed = data
        .filter((t) => {
          const d = new Date(t.startDate || t.selectedDate || t.createdAt);
          d.setHours(0, 0, 0, 0);
          return d >= now || isNaN(d.getTime());
        })
        .map((t) => ({
          id: t._id,
          name: t.title,
          type: t.sportsType || "Tournament",
          date: formatDate(t.startDate || t.selectedDate),
          imageUri: t.tournamentLogo ? `${Website_SERVER_URL.Wbsite_SERVER_URL}/uploads/tournaments/${t.tournamentLogo}` : null,
        }));
      setTournaments(processed);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading((prev) => ({ ...prev, tournaments: false }));
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setIsSearching(false);
      setSearchResults({ turfs: [], tournaments: [], users: [], trainers: [] });
      return;
    }

    setIsSearching(true);
    setSearchLoading(true);

    // Debounce search
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(`${Website_SERVER_URL.Wbsite_SERVER_URL}/api/search?query=${encodeURIComponent(text)}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setSearchLoading(false);
      }
    }, 500);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <FlatList
        data={[]}
        keyExtractor={() => "home"}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Image
                  source={user?.profileImage ? { uri: `${Website_SERVER_URL.Wbsite_SERVER_URL}/uploads/${user.profileImage}` } : require("../../../assets/Profile.png")}
                  style={styles.profilePic}
                />
                <View style={styles.headerTextContainer}>
                  <Text style={styles.userName}>{user?.name || "Aarav Mehta"}</Text>
                  <TouchableOpacity style={styles.locationContainer}>
                    <Text style={styles.locationText}>{user?.address?.area || "Pimpri Colony"}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconButton} onPress={openSidebar}>
                  <MaterialIcons name="menu" size={28} color="#8D848F" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Planner")}>
                  <MaterialIcons name="event-note" size={28} color="#8D848F" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Notifications")}>
                  <MaterialIcons name="notifications-none" size={28} color="#8D848F" />
                  {unreadNotifications > 0 && <View style={styles.notificationDot} />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
              <MaterialIcons name="search" size={24} color="#666666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search sports, turfs or players"
                placeholderTextColor="#666666"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch("")}>
                  <MaterialIcons name="close" size={20} color="#666" style={{ marginRight: 8 }} />
                </TouchableOpacity>
              )}
              <View style={styles.searchDivider} />
              <TouchableOpacity>
                <MaterialIcons name="mic-none" size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            {/* Hero Banner */}
            <View style={styles.sliderContainer}>
              <Image source={require("../../../assets/PlayesHomeBanner.png")} style={styles.bannerImage} />
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Events")}>
                <View style={styles.actionTextContent}>
                  <Text style={styles.actionTitle}>Play Now</Text>
                  <Text style={styles.actionSubtitle}>Join open games or invite squad</Text>
                </View>
                <Image source={require("../../../assets/PlayNow3D.png")} style={styles.actionImage} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("TurfList")}>
                <View style={styles.actionTextContent}>
                  <Text style={styles.actionTitle}>Book Turf</Text>
                  <Text style={styles.actionSubtitle}>Book premium turfs near you</Text>
                </View>
                <Image source={require("../../../assets/BookTurf3D.png")} style={styles.actionImageGoal} />
              </TouchableOpacity>
            </View>

            {/* Explore Sports */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore Sports</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsList} contentContainerStyle={{ paddingRight: 16 }}>
              {[
                { name: "Basketball", icon: require("../../../assets/Basketball.png") },
                { name: "Football", icon: require("../../../assets/Football.png") },
                { name: "Cricket", icon: require("../../../assets/Cricket.png") },
                { name: "Basketball", icon: require("../../../assets/Basketball.png") },
                { name: "Football", icon: require("../../../assets/Football.png") },
                { name: "Cricket", icon: require("../../../assets/Cricket.png") },
              ].map((item, index) => (
                <TouchableOpacity key={index} style={styles.sportItem}>
                  <View style={styles.sportIconContainer}>
                    <Image source={item.icon} style={styles.sportIcon} />
                  </View>
                  <Text style={styles.sportName}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Popular Turfs Near You (Horizontal) */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Turfs Near You</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalTurfList} contentContainerStyle={{ paddingRight: 16 }}>
              {(tournaments.length > 0 ? tournaments : [1, 2, 3]).map((item, index) => (
                <TouchableOpacity key={index} style={styles.turfCard} onPress={() => item.id && navigation.navigate("Tournament Details", { tournamentId: item.id, item: item })}>
                  <View style={styles.turfImageContainer}>
                    <Image source={item.imageUri ? { uri: item.imageUri } : require("../../../assets/TurnImageNew.jpg")} style={styles.turfImage} />
                    <View style={styles.ratingBadge}>
                      <MaterialIcons name="star" size={12} color="#FFB300" />
                      <Text style={styles.ratingText}>3.5</Text>
                    </View>
                  </View>
                  <Text style={styles.distanceText}>3km away</Text>
                  <Text style={styles.turfName} numberOfLines={1}>{item.name || "GreenField Arena"}</Text>
                  <Text style={styles.turfLocation}>Pune, Maharashtra</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Popular Turfs List */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Turfs Near You</Text>
            </View>
            <View style={styles.verticalList}>
              {[
                { title: "5-a-side Football", loc: "Pune, Maharashtra" },
                { title: "Box Cricket League", loc: "Pune, Maharashtra" },
                { title: "Badminton Doubles", loc: "Pune, Maharashtra" },
              ].map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <View>
                    <Text style={styles.listItemTitle}>{item.title}</Text>
                    <Text style={styles.listItemLoc}>{item.loc}</Text>
                  </View>
                  <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Join Now</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Promotional Banners */}
            <View style={styles.promotionalContainer}>
              <View style={[styles.promoCard, { backgroundColor: '#8BC34A' }]}>
                <ImageBackground source={require("../../../assets/GoldCoinBgImage.jpg")} style={styles.promoBg} imageStyle={{ borderRadius: 16 }}>
                  <Text style={styles.promoTitle}>Employee Rewards</Text>
                  <Text style={styles.promoSubtitle} numberOfLines={5}>
                    Join the exclusive rewards program and earn coins for every match.
                  </Text>
                  <Image source={require("../../../assets/GoldCoinBg.png")} style={styles.promoCoins} />
                </ImageBackground>
              </View>
              <View style={styles.promoCardBlue}>
                <Image source={require("../../../assets/GameAndFun.png")} style={styles.promoFullImage} />
              </View>
            </View>
          </View>
        }
      />

      {/* Search Results Overlay - Moved outside FlatList to prevent scroll conflicts */}
      {isSearching && (
        <View style={styles.searchResultsOverlay}>
          {searchLoading ? (
            <View style={styles.searchStatusContainer}>
              <ActivityIndicator size="small" color="#15A765" />
              <Text style={styles.searchStatusText}>Searching...</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.searchResultsScroll}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
            >
              {/* Turfs Section */}
              {searchResults.turfs?.length > 0 && (
                <View style={styles.searchSection}>
                  <Text style={styles.searchSectionTitle}>Turfs</Text>
                  {searchResults.turfs.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      style={styles.searchResultItem}
                      onPress={() => {
                        setIsSearching(false);
                        navigation.navigate("TurfDetails", { turfId: item._id });
                      }}
                    >
                      <MaterialIcons name="place" size={20} color="#15A765" />
                      <View style={styles.searchResultText}>
                        <Text style={styles.searchResultName}>{item.name}</Text>
                        <Text style={styles.searchResultSub}>{item.address?.area || item.address?.city || "Location"}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Tournaments Section */}
              {searchResults.tournaments?.length > 0 && (
                <View style={styles.searchSection}>
                  <Text style={styles.searchSectionTitle}>Tournaments</Text>
                  {searchResults.tournaments.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      style={styles.searchResultItem}
                      onPress={() => {
                        setIsSearching(false);
                        navigation.navigate("Tournament Details", { tournamentId: item._id });
                      }}
                    >
                      <MaterialIcons name="emoji-events" size={20} color="#FFB300" />
                      <View style={styles.searchResultText}>
                        <Text style={styles.searchResultName}>{item.title}</Text>
                        <Text style={styles.searchResultSub}>{item.sportsType || "Tournament"}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Players Section */}
              {searchResults.users?.length > 0 && (
                <View style={styles.searchSection}>
                  <Text style={styles.searchSectionTitle}>Players</Text>
                  {searchResults.users.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      style={styles.searchResultItem}
                      onPress={() => {
                        setIsSearching(false);
                        navigation.navigate("PlayerProfile", { playerId: item._id });
                      }}
                    >
                      <Image
                        source={item.profileImage ? { uri: `${Website_SERVER_URL.Wbsite_SERVER_URL}/uploads/${item.profileImage}` } : require("../../../assets/Profile.png")}
                        style={styles.searchResultProfile}
                      />
                      <View style={styles.searchResultText}>
                        <Text style={styles.searchResultName}>{item.name}</Text>
                        <Text style={styles.searchResultSub}>{item.role || "Player"}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* No Results */}
              {Object.values(searchResults).every(arr => arr.length === 0) && (
                <View style={styles.searchStatusContainer}>
                  <Text style={styles.searchStatusText}>No results found for "{searchQuery}"</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      )}
      </View>

      <Animated.View style={[styles.notificationPanel, { transform: [{ translateX: notificationPanelX }] }]}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>Notifications</Text>
          <TouchableOpacity onPress={toggleNotifications}>
            <MaterialIcons name="close" size={24} color="#1A181B" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Sidebar Overlay */}
      {sidebarVisible && (
        <View style={styles.sidebarOverlay} pointerEvents="box-none">
          {/* Backdrop */}
          <Animated.View
            style={[styles.sidebarBackdrop, { opacity: backdropOpacity }]}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={closeSidebar}
            />
          </Animated.View>

          {/* Sidebar Panel */}
          <Animated.View
            style={[
              styles.sidebarPanel,
              { transform: [{ translateX: sidebarX }] },
            ]}
          >
            <Sidebar onClose={closeSidebar} />
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    flexDirection: "row",
  },
  sidebarBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sidebarPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 20,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 120
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  headerTextContainer: {
    justifyContent: "center"
  },
  userName: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#1A181B"
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  locationText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#645E66",
    marginRight: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconButton: {
    marginLeft: 24,
    position: "relative"
  },
  notificationDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4D4D",
    borderWidth: 1.5,
    borderColor: "#fff"
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    height: 50,
    borderColor: "#EEEEFF",
    borderRadius: 53,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#666666"
  },
  searchDivider: {
    width: 1,
    backgroundColor: "#FFFFFF",
  },
  sliderContainer: {
    height: 163,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  quickActionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
    overflow: "visible",
    gap: 12
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    overflow: "visible",
    position: "relative",
    zIndex: 1
  },
  actionTextContent: {
    flex: 1,
    zIndex: 1
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1A181B",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#666666",
    width: "67%",
    paddingEnd: 5,
  },
  actionImage: {
    width: 98,
    height: 69,
    position: "absolute",
    right: -10,
    bottom: 0,
    resizeMode: "contain",
    zIndex: 100
  },
  actionImageGoal: {
    width: 98,
    height: 69,
    position: "absolute",
    right: -15,
    bottom: -10,
    resizeMode: "contain",
    zIndex: 100
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Montserrat_500Medium",
    color: "#1A181B"
  },
  sportsList: {
    paddingLeft: 16,
    marginBottom: 24
  },
  sportItem: {
    alignItems: "center",
    marginRight: 16,
    width: 130,
    height: 85,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
  },
  sportIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
    resizeMode: "contain"
  },
  sportName: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#1A181B",
  },
  horizontalTurfList: {
    paddingLeft: 16,
    marginBottom: 30
  },
  turfCard: {
    width: 145,
    marginRight: 16
  },
  turfImageContainer: {
    width: "100%",
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 6,
    position: "relative"
  },
  turfImage: {
    width: "100%",
    height: "100%"
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 16,
    shadowColor: "#0B083847",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 4,
  },
  ratingText: {
    fontSize: 10,
    fontFamily: "Poppins_400Regular",
    color: "#1A181B",
    marginLeft: 2
  },
  distanceText: {
    fontSize: 11,
    fontFamily: "Montserrat_500Medium",
    color: "#666666",
    marginBottom: 6
  },
  turfName: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#1A181B",
    marginBottom: 2
  },
  turfLocation: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#666"
  },
  verticalList: {
    paddingHorizontal: 16,
    marginBottom: 24
  },
  listItem: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EEEEFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    boxShadow: "0px 10px 20px 0px #8B96BA1A",
  },
  listItemTitle: {
    fontSize: 18,
    fontFamily: "Montserrat_500Medium",
    color: "#0A0A0A",
    marginBottom: 4
  },
  listItemLoc: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#666666"
  },
  joinButton: {
    backgroundColor: "#15A765",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins_400Regular"
  },
  promotionalContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 16,
    overflow: "visible"

  },
  promoCard: {
    flex: 1,
    height: 190,
    borderRadius: 16,
    overflow: "visible"
  },
  promoBg: {
    flex: 1,
    padding: 14
  },
  promoTitle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 4
  },
  promoSubtitle: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    lineHeight: 18,
    opacity: 0.9
  },
  promoCardBlue: {
    flex: 1,
    height: 190,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#0D47A1"
  },
  promoFullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  promoCoins: {
    width: 243,
    height: 199,
    position: "absolute",
    right: -40,
    bottom: -40,
    resizeMode: "contain",
    zIndex: 1
  },
  notificationPanel: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: "85%",
    height: "100%",
    backgroundColor: "#fff",
    elevation: 20,
    zIndex: 100,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30
  },
  notificationHeader: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#1A181B"
  },
  searchResultsOverlay: {
    position: "absolute",
    top: 160,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    maxHeight: 350,
    zIndex: 9999,
    elevation: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
  },
  searchResultsScroll: {
    padding: 8,
  },
  searchStatusContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  searchStatusText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#666",
  },
  searchSection: {
    marginBottom: 16,
  },
  searchSectionTitle: {
    fontSize: 12,
    fontFamily: "Montserrat_600SemiBold",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 10,
    marginBottom: 8,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
    marginBottom: 6,
  },
  searchResultProfile: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  searchResultText: {
    marginLeft: 12,
    flex: 1,
  },
  searchResultName: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1A181B",
  },
  searchResultSub: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#666",
  },
});

export default PlayerHomeScreen;
