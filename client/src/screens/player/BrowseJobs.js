import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const SAMPLE_JOBS = [
  {
    id: "1",
    title: "Referee Needed",
    venue: "Andheri Sports Complex",
    manager: "Amit Sharma (Manager)",
    location: "Baner, Pune",
    sport: "Cricket",
    date: "14 Oct",
    applicants: 8,
    rate: "₹799/-",
    rateUnit: "per hour",
  },
  {
    id: "2",
    title: "Referee Needed",
    venue: "Andheri Sports Complex",
    manager: "Amit Sharma (Manager)",
    location: "Baner, Pune",
    sport: "Cricket",
    date: "14 Oct",
    applicants: 8,
    rate: "₹799/-",
    rateUnit: "per hour",
  },
  {
    id: "3",
    title: "Referee Needed",
    venue: "Andheri Sports Complex",
    manager: "Amit Sharma (Manager)",
    location: "Baner, Pune  Andheri Sports Complex",
    sport: "Cricket",
    date: "14 Oct",
    applicants: 8,
    rate: "₹799/-",
    rateUnit: "per hour",
  },
];

const ROLE_OPTIONS = ["All", "Referee", "Coach", "Cameraman", "Commentator", "Scorer"];
const SPORT_OPTIONS = ["All", "Cricket", "Football", "Badminton", "Basketboll"];

const BrowseJobs = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("browse");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(["Referee", "Referee", "Referee"]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(["All", "Referee", "Coach", "Cameraman"]);
  const [selectedSports, setSelectedSports] = useState(["All", "Cricket", "Football", "Badminton", "Basketboll"]);

  const removeFilter = (index) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const toggleSport = (sport) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const renderCheckRow = (label, checked, onToggle) => (
    <TouchableOpacity
      key={label}
      style={styles.checkRow}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const renderJobCard = (job) => (
    <View key={job.id} style={styles.jobCard}>
      <View style={styles.jobLogoWrap}>
        <Image
          source={require("../../../assets/cricket-avatar.jpg")}
          style={styles.jobLogo}
        />
      </View>

      <View style={styles.jobContent}>
        <View style={styles.jobTopRow}>
          <View style={{ flex: 1, paddingRight: 6 }}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobVenue} numberOfLines={1}>
              {job.venue}
            </Text>
          </View>
          <View style={styles.sportBadge}>
            <Text style={styles.sportBadgeText}>{job.sport}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.jobMidRow}>
          <View style={{ flex: 1, paddingRight: 6 }}>
            <Text style={styles.jobManager}>{job.manager}</Text>
            <Text style={styles.jobLocation} numberOfLines={1}>
              {job.location}
            </Text>
          </View>
          <Text style={styles.jobDate}>{job.date}</Text>
        </View>

        <View style={styles.jobBottomRow}>
          <Text style={styles.jobApplicants}>{job.applicants} Applicants</Text>
          <View style={styles.rateRow}>
            <Text style={styles.jobRate}>{job.rate} </Text>
            <Text style={styles.jobRateUnit}>{job.rateUnit}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1F1F1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sports Jobs & Opportunities</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrap}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "browse" && styles.tabActive]}
            onPress={() => setActiveTab("browse")}
            activeOpacity={0.85}
          >
            <Text style={[styles.tabText, activeTab === "browse" && styles.tabTextActive]}>
              Browse
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "application" && styles.tabActive]}
            onPress={() => setActiveTab("application")}
            activeOpacity={0.85}
          >
            <Text style={[styles.tabText, activeTab === "application" && styles.tabTextActive]}>
              Application
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Need a Professional Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Need a Professional ?</Text>

          <View style={styles.heroCardsRow}>
            <TouchableOpacity style={styles.browseJobCard} activeOpacity={0.9}>
              <View style={styles.browseJobIconWrap}>
                <Feather name="search" size={26} color="#F26B1F" />
              </View>
              <Text style={styles.browseJobTitle}>Browse Job</Text>
              <Text style={styles.browseJobSubtitle}>Search & Apply</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickHireWrap}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("HireProfessional")}
            >
              <LinearGradient
                colors={["#FF8A3D", "#F26B1F"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickHireCard}
              >
                <View style={styles.quickHireIconWrap}>
                  <Feather name="globe" size={26} color="#FFFFFF" />
                </View>
                <Text style={styles.quickHireTitle}>Quick Hire</Text>
                <Text style={styles.quickHireSubtitle}>Search & Hire Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.heroHelper}>
            Booked a turf? Hire a referee, scorer, or cameraman{"\n"}for your match!
          </Text>
        </View>

        {/* Search + Filter */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name="search" size={18} color="#9A9A9A" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Opportunities"
              placeholderTextColor="#9A9A9A"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            activeOpacity={0.8}
            onPress={() => setFilterOpen(true)}
          >
            <MaterialCommunityIcons name="tune-variant" size={20} color="#1F1F1F" />
          </TouchableOpacity>
        </View>

        {/* Filter chips */}
        <View style={styles.chipsRow}>
          {filters.map((f, idx) => (
            <View key={`${f}-${idx}`} style={styles.chip}>
              <Text style={styles.chipText}>{f}</Text>
              <TouchableOpacity onPress={() => removeFilter(idx)} hitSlop={8}>
                <Ionicons name="close" size={14} color="#1A8E4A" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Job Listings */}
        <View style={styles.jobsList}>
          {SAMPLE_JOBS.map(renderJobCard)}
        </View>
      </ScrollView>

      {/* Filter Bottom Sheet */}
      <Modal
        visible={filterOpen}
        transparent
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setFilterOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setFilterOpen(false)} />

        <View style={styles.sheetAnchor} pointerEvents="box-none">
          {/* Floating close button above the sheet */}
          <View style={styles.closeFabRow}>
            <TouchableOpacity
              style={styles.closeFab}
              onPress={() => setFilterOpen(false)}
              activeOpacity={0.85}
            >
              <Ionicons name="close" size={20} color="#1F1F1F" />
            </TouchableOpacity>
          </View>

          <View style={styles.sheet}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
              bounces={false}
            >
              <Text style={styles.sheetTitle}>Filter by</Text>

              <Text style={styles.sheetSection}>Role</Text>
              {ROLE_OPTIONS.map((role) =>
                renderCheckRow(role, selectedRoles.includes(role), () => toggleRole(role))
              )}

              <View style={styles.sheetDivider} />

              <Text style={styles.sheetSection}>Sports</Text>
              {SPORT_OPTIONS.map((sport) =>
                renderCheckRow(sport, selectedSports.includes(sport), () => toggleSport(sport))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1F1F1F",
    marginLeft: 2,
  },
  // Tabs
  tabsWrap: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 999,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 999,
  },
  tabActive: {
    backgroundColor: "#15A765",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    color: "#7A7A7A",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  // Hero
  heroSection: {
    backgroundColor: "#FFF1EA",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  heroTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
    marginBottom: 12,
  },
  heroCardsRow: {
    flexDirection: "row",
    gap: 12,
  },
  browseJobCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#F26B1F",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  browseJobIconWrap: {
    marginBottom: 8,
  },
  browseJobTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#F26B1F",
    marginBottom: 2,
  },
  browseJobSubtitle: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#F26B1F",
  },
  quickHireWrap: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  quickHireCard: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  quickHireIconWrap: {
    marginBottom: 8,
  },
  quickHireTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  quickHireSubtitle: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#FFFFFF",
  },
  heroHelper: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#7A7A7A",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 17,
  },
  // Search row
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#1F1F1F",
    padding: 0,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
  },
  // Chips
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1A8E4A",
    backgroundColor: "#FFFFFF",
    gap: 6,
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#1A8E4A",
  },
  // Jobs list
  jobsList: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 12,
  },
  jobCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  jobLogoWrap: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
    marginRight: 12,
  },
  jobLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  jobContent: {
    flex: 1,
  },
  jobTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  jobTitle: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  jobVenue: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: 2,
  },
  sportBadge: {
    backgroundColor: "#EEEAFB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  sportBadgeText: {
    fontSize: 11,
    fontFamily: "Montserrat_500Medium",
    color: "#5B4FCF",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 8,
  },
  jobMidRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  jobManager: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1F1F1F",
  },
  jobLocation: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#7A7A7A",
    marginTop: 2,
  },
  jobDate: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#6F6F6F",
  },
  jobBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  jobApplicants: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#6F6F6F",
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  jobRate: {
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    color: "#15A765",
  },
  jobRateUnit: {
    fontSize: 11,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
  },
  // Filter modal
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheetAnchor: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeFabRow: {
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  closeFab: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    maxHeight: Dimensions.get("window").height * 0.78,
  },
  sheetTitle: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#6F6F6F",
    marginBottom: 8,
  },
  sheetSection: {
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1F1F1F",
    marginTop: 8,
    marginBottom: 6,
  },
  sheetDivider: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginVertical: 14,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#15A765",
    borderColor: "#15A765",
  },
  checkLabel: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#1F1F1F",
  },
});

export default BrowseJobs;
