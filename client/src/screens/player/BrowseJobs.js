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
    role: "Referee",
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
    title: "Coach Needed",
    role: "Coach",
    venue: "Powai Sports Arena",
    manager: "Vikram Patel (Manager)",
    location: "Powai, Mumbai",
    sport: "Football",
    date: "18 Oct",
    applicants: 5,
    rate: "₹1,200/-",
    rateUnit: "per hour",
  },
  {
    id: "3",
    title: "Cameraman Needed",
    role: "Cameraman",
    venue: "DY Patil Stadium",
    manager: "Neha Iyer (Manager)",
    location: "Navi Mumbai",
    sport: "Cricket",
    date: "22 Oct",
    applicants: 12,
    rate: "₹999/-",
    rateUnit: "per hour",
  },
  {
    id: "4",
    title: "Commentator Needed",
    role: "Commentator",
    venue: "Pune Badminton Hall",
    manager: "Rohan Joshi (Manager)",
    location: "Kothrud, Pune",
    sport: "Badminton",
    date: "25 Oct",
    applicants: 3,
    rate: "₹1,500/-",
    rateUnit: "per hour",
  },
  {
    id: "5",
    title: "Scorer Needed",
    role: "Scorer",
    venue: "NCA Ground",
    manager: "Priya Singh (Manager)",
    location: "Bandra, Mumbai",
    sport: "Cricket",
    date: "28 Oct",
    applicants: 7,
    rate: "₹699/-",
    rateUnit: "per hour",
  },
];

const ROLE_OPTIONS = ["All", "Referee", "Coach", "Cameraman", "Commentator", "Scorer"];
const SPORT_OPTIONS = ["All", "Cricket", "Football", "Badminton", "Basketboll"];

const APPLICATION_STATS = [
  { label: "Total", value: "24" },
  { label: "Pending", value: "12" },
  { label: "Accepted", value: "08" },
  { label: "Rejected", value: "04" },
];

const APPLICATIONS = [
  {
    id: "a1",
    title: "Referee Needed",
    venue: "Andheri Sports Complex",
    appliedOn: "5 May",
    rate: "₹799/-",
    rateUnit: "per hour",
    status: "Shortlist",
  },
  {
    id: "a2",
    title: "Referee Needed",
    venue: "Andheri Sports Complex",
    appliedOn: "5 May",
    rate: "₹799/-",
    rateUnit: "per hour",
    status: "Pending",
  },
  {
    id: "a3",
    title: "Referee Needed",
    venue: "Andheri Sports Complex",
    appliedOn: "5 May",
    rate: "₹799/-",
    rateUnit: "per hour",
    status: "Accepted",
  },
  {
    id: "a4",
    title: "Referee Needed",
    venue: "Andheri Sports Complex",
    appliedOn: "5 May",
    rate: "₹799/-",
    rateUnit: "per hour",
    status: "Rejected",
  },
];

const STATUS_STYLES = {
  Shortlist: { bg: "#E0EBFF", text: "#2563EB" },
  Pending: { bg: "#FFF4D1", text: "#C68B00" },
  Accepted: { bg: "#D7F4E1", text: "#1A8E4A" },
  Rejected: { bg: "#FFE2E2", text: "#D7263D" },
};

const SUB_TABS = [
  { key: "applications", label: "Applications", icon: "document-text-outline" },
  { key: "requests", label: "Requests", icon: "mail-outline", dot: true },
  { key: "myProfile", label: "My Profile", icon: "person-outline" },
];

const REQUESTS = [
  {
    id: "r1",
    title: "Birthday Cricket Match",
    fromName: "Rahul Sharma",
    role: "Referee",
    location: "Andheri Sports Complex",
    date: "15 May 2026",
    rate: "₹1,500/-",
    isNew: true,
  },
  {
    id: "r2",
    title: "Football Tournament",
    fromName: "Elite Sports Club",
    role: "Commentator",
    location: "Powai Ground",
    date: "20 May 2026",
    rate: "₹2,000/-",
    isNew: true,
  },
];

const BrowseJobs = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("browse");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState("applications");

  const ROLE_VALUES = ROLE_OPTIONS.filter((r) => r !== "All");
  const SPORT_VALUES = SPORT_OPTIONS.filter((s) => s !== "All");

  const toggleSelection = (option, list, allValues, setList) => {
    if (option === "All") {
      const allSelected = allValues.every((v) => list.includes(v));
      setList(allSelected ? [] : allValues);
      return;
    }
    setList((prev) =>
      prev.includes(option) ? prev.filter((x) => x !== option) : [...prev, option]
    );
  };

  const isOptionChecked = (option, list, allValues) => {
    if (option === "All") return allValues.length > 0 && allValues.every((v) => list.includes(v));
    return list.includes(option);
  };

  const toggleRole = (role) => toggleSelection(role, selectedRoles, ROLE_VALUES, setSelectedRoles);
  const toggleSport = (sport) => toggleSelection(sport, selectedSports, SPORT_VALUES, setSelectedSports);

  const activeChips = [
    ...selectedRoles.map((label) => ({ label, type: "role" })),
    ...selectedSports.map((label) => ({ label, type: "sport" })),
  ];

  const removeChip = (chip) => {
    if (chip.type === "role") {
      setSelectedRoles((prev) => prev.filter((r) => r !== chip.label));
    } else {
      setSelectedSports((prev) => prev.filter((s) => s !== chip.label));
    }
  };

  const filteredJobs = SAMPLE_JOBS.filter((job) => {
    if (selectedRoles.length > 0 && !selectedRoles.includes(job.role)) return false;
    if (selectedSports.length > 0 && !selectedSports.includes(job.sport)) return false;
    const q = search.trim().toLowerCase();
    if (q) {
      const haystack = [
        job.title,
        job.role,
        job.venue,
        job.manager,
        job.location,
        job.sport,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

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

  const renderRequestCard = (req) => (
    <View key={req.id} style={styles.reqCard}>
      <View style={styles.reqHeaderRow}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.reqTitle}>{req.title}</Text>
          <Text style={styles.reqFrom}>from {req.fromName}</Text>
        </View>
        {req.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        )}
      </View>

      <View style={styles.reqMetaRow}>
        <Ionicons name="briefcase-outline" size={18} color="#6F6F6F" />
        <Text style={styles.reqMetaLabel}>Role: </Text>
        <Text style={styles.reqMetaValue}>{req.role}</Text>
      </View>
      <View style={styles.reqMetaRow}>
        <Ionicons name="location-outline" size={18} color="#6F6F6F" />
        <Text style={styles.reqMetaValue}>{req.location}</Text>
      </View>
      <View style={styles.reqMetaRow}>
        <Ionicons name="calendar-outline" size={18} color="#6F6F6F" />
        <Text style={styles.reqMetaValue}>{req.date}</Text>
      </View>

      <Text style={styles.reqRate}>{req.rate}</Text>

      <View style={styles.reqActions}>
        <TouchableOpacity style={styles.rejectBtn} activeOpacity={0.8}>
          <Ionicons name="close" size={22} color="#D7263D" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.9}>
          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
          <Text style={styles.acceptBtnText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderApplicationCard = (app) => {
    const status = STATUS_STYLES[app.status] || STATUS_STYLES.Pending;
    return (
      <View key={app.id} style={styles.appCard}>
        <View style={styles.appTopRow}>
          <View style={styles.appLogoWrap}>
            <Image
              source={require("../../../assets/cricket-avatar.jpg")}
              style={styles.appLogo}
            />
          </View>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.appTitle}>{app.title}</Text>
            <Text style={styles.appVenue} numberOfLines={1}>
              {app.venue}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusBadgeText, { color: status.text }]}>{app.status}</Text>
          </View>
        </View>

        <View style={styles.appDivider} />

        <View style={styles.appBottomRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.appAppliedOn}>Applied on {app.appliedOn}</Text>
            <View style={styles.appRateRow}>
              <Text style={styles.appRate}>{app.rate} </Text>
              <Text style={styles.appRateUnit}>{app.rateUnit}</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate("JobDetails", { jobId: app.id, status: app.status })}
          >
            <Text style={styles.viewDetailsLink}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderJobCard = (job) => (
    <TouchableOpacity
      key={job.id}
      style={styles.jobCard}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("JobDetails", { jobId: job.id })}
    >
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
    </TouchableOpacity>
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

      {activeTab === "application" ? (
        <View style={{ flex: 1 }}>
          {/* Sub-tabs */}
          <View style={styles.subTabsRow}>
            {SUB_TABS.map((t) => {
              const active = activeSubTab === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  style={styles.subTab}
                  activeOpacity={0.8}
                  onPress={() => setActiveSubTab(t.key)}
                >
                  <View style={styles.subTabInner}>
                    <View style={styles.subTabIconWrap}>
                      <Ionicons
                        name={t.icon}
                        size={16}
                        color={active ? "#15A765" : "#7A7A7A"}
                      />
                      {t.dot && <View style={styles.subTabDot} />}
                    </View>
                    <Text
                      style={[styles.subTabText, active && styles.subTabTextActive]}
                      numberOfLines={1}
                    >
                      {t.label}
                    </Text>
                  </View>
                  {active && <View style={styles.subTabUnderline} />}
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.subTabsDivider} />

          <ScrollView
            style={{ flex: 1, backgroundColor: "#FFFFFF" }}
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          >
            {activeSubTab === "applications" && (
              <>
                {/* Stats row */}
                <View style={styles.statsBg}>
                  <View style={styles.statsRow}>
                    {APPLICATION_STATS.map((s) => (
                      <View key={s.label} style={styles.statBox}>
                        <Text style={styles.statValue}>{s.value}</Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Application cards */}
                <View style={styles.appList}>
                  {APPLICATIONS.map(renderApplicationCard)}
                </View>
              </>
            )}

            {activeSubTab === "requests" && (
              <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
                {/* Info banner */}
                <View style={styles.infoBanner}>
                  <Ionicons name="mail-outline" size={22} color="#1E88F5" style={{ marginTop: 2 }} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.infoTitle}>Personal Hiring Request</Text>
                    <Text style={styles.infoMessage}>
                      Players and organizers can directly request your services for their events
                    </Text>
                  </View>
                </View>

                {/* Request cards */}
                <View style={{ marginTop: 14, gap: 14 }}>
                  {REQUESTS.map(renderRequestCard)}
                </View>
              </View>
            )}

            {activeSubTab === "myProfile" && (
              <View style={styles.subTabEmpty}>
                <Ionicons name="person-circle-outline" size={48} color="#CCCCCC" />
                <Text style={styles.subTabEmptyText}>My Profile coming soon</Text>
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
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
        {activeChips.length > 0 && (
          <View style={styles.chipsRow}>
            {activeChips.map((chip) => (
              <View key={`${chip.type}-${chip.label}`} style={styles.chip}>
                <Text style={styles.chipText}>{chip.label}</Text>
                <TouchableOpacity onPress={() => removeChip(chip)} hitSlop={8}>
                  <Ionicons name="close" size={14} color="#1A8E4A" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Job Listings */}
        <View style={styles.jobsList}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map(renderJobCard)
          ) : (
            <View style={styles.emptyResults}>
              <Ionicons name="search-outline" size={40} color="#CCCCCC" />
              <Text style={styles.emptyResultsTitle}>No opportunities found</Text>
              <Text style={styles.emptyResultsHint}>
                Try a different search or clear the filters
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      )}

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
                renderCheckRow(
                  role,
                  isOptionChecked(role, selectedRoles, ROLE_VALUES),
                  () => toggleRole(role)
                )
              )}

              <View style={styles.sheetDivider} />

              <Text style={styles.sheetSection}>Sports</Text>
              {SPORT_OPTIONS.map((sport) =>
                renderCheckRow(
                  sport,
                  isOptionChecked(sport, selectedSports, SPORT_VALUES),
                  () => toggleSport(sport)
                )
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
  // Application tab
  subTabsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  subTab: {
    flex: 1,
    paddingTop: 6,
  },
  subTabInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 6,
  },
  subTabIconWrap: {
    position: "relative",
  },
  subTabDot: {
    position: "absolute",
    top: -2,
    right: -3,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#E53935",
  },
  subTabText: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    color: "#7A7A7A",
  },
  subTabTextActive: {
    color: "#15A765",
  },
  subTabUnderline: {
    height: 2,
    backgroundColor: "#15A765",
    borderRadius: 2,
    marginHorizontal: 4,
  },
  subTabsDivider: {
    height: 1,
    backgroundColor: "#EFEFEF",
  },
  statsBg: {
    backgroundColor: "#F4F5F7",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#6F6F6F",
    marginTop: 4,
  },
  appList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  appCard: {
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
  appTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  appLogoWrap: {
    width: 52,
    height: 52,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    marginRight: 12,
  },
  appLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  appTitle: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  appVenue: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: "Montserrat_600SemiBold",
  },
  appDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 10,
  },
  appBottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  appAppliedOn: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#6F6F6F",
  },
  appRateRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  appRate: {
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    color: "#15A765",
  },
  appRateUnit: {
    fontSize: 11,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
  },
  viewDetailsLink: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1E88F5",
    textDecorationLine: "underline",
  },
  // Requests sub-tab
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E8F2FE",
    borderRadius: 12,
    padding: 14,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    color: "#1E88F5",
    marginBottom: 4,
  },
  infoMessage: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#1E88F5",
    lineHeight: 17,
  },
  reqCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  reqHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reqTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  reqFrom: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: 2,
  },
  newBadge: {
    backgroundColor: "#E0EBFF",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  newBadgeText: {
    fontSize: 12,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1E88F5",
  },
  reqMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  reqMetaLabel: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginLeft: 8,
  },
  reqMetaValue: {
    fontSize: 13,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
    marginLeft: 6,
    flexShrink: 1,
  },
  reqRate: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#15A765",
    marginTop: 10,
  },
  reqActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  rejectBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D7263D",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  acceptBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#15A765",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  acceptBtnText: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#FFFFFF",
  },
  // Sub-tab empty state
  subTabEmpty: {
    paddingTop: 80,
    alignItems: "center",
  },
  subTabEmptyText: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#9A9A9A",
    marginTop: 12,
  },
  emptyResults: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyResultsTitle: {
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    color: "#6F6F6F",
    marginTop: 12,
  },
  emptyResultsHint: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#9A9A9A",
    marginTop: 4,
  },
});

export default BrowseJobs;
