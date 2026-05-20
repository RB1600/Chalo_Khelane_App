import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
  Pressable,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCHEDULE = [
  { id: "1", title: "Semi-Final 1", date: "Friday, 15 May", time: "9:00 AM - 1:00 PM" },
  { id: "2", title: "Semi-Final 2", date: "Friday, 16 May", time: "9:00 AM - 1:00 PM" },
  { id: "3", title: "Semi-Final 3", date: "Friday, 17 May", time: "9:00 AM - 1:00 PM" },
];

const REQUIREMENTS = [
  "Minimum 2 years of cricket refereeing experience",
  "Knowledge of ICC cricket rules and regulations.",
  "Ability to handle pressure situations.",
  "Good physical fitness.",
  "Certification from recognized cricket association (preferred).",
];

const BENEFITS = [
  "Certificate of participation.",
  "Networking opportunities with professional cricket organizers.",
  "Meals and refreshments provided.",
  "Free tournament merchandise.",
];

const PROFILES = [
  { id: "p1", title: "Cricket Referee", sport: "Cricket", level: "Intermediate", rating: 4.8 },
  { id: "p2", title: "Cricket Referee", sport: "Cricket", level: "Intermediate", rating: 4.8 },
  { id: "p3", title: "Football Commentator", sport: "Football", level: "Professional", rating: 4.9 },
];

const COVER_MAX = 500;

const STATUS_BANNERS = {
  Shortlist: {
    bg: "#E0EBFF",
    title: "Shortlisted",
    message: "Great news! You've been shortlisted. The organizer may contact you soon.",
  },
  Pending: {
    bg: "#FFF4D1",
    title: "Pending Review",
    message: "Your application is under review. We'll notify you when there's an update.",
  },
  Accepted: {
    bg: "#D7F4E1",
    title: "Accepted",
    message: "Congratulations! Your application has been accepted by the organizer.",
  },
  Rejected: {
    bg: "#FFE2E2",
    title: "Rejected",
    message: "Unfortunately, your application was not selected this time.",
  },
};

const JobDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const [bookmarked, setBookmarked] = useState(false);

  const status = route.params?.status;
  const banner = status ? STATUS_BANNERS[status] : null;
  const alreadyApplied = !!status;
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState("p1");
  const [cover, setCover] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const openApply = () => setApplyOpen(true);
  const closeApply = () => setApplyOpen(false);

  const handleSubmit = () => {
    setApplyOpen(false);
    setCover("");
    setSelectedProfileId("p1");
    setSuccessOpen(true);
  };

  const closeSuccess = () => setSuccessOpen(false);

  const renderBullet = (text, key) => (
    <View key={key} style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
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
        <Text style={styles.headerTitle}>Job Details</Text>
        <TouchableOpacity
          onPress={() => setBookmarked((p) => !p)}
          style={styles.bookmarkBtn}
        >
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color="#1F1F1F"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.headerBorder} />

      {/* Status banner shown when viewing an existing application */}
      {banner && (
        <View style={[styles.statusBanner, { backgroundColor: banner.bg }]}>
          <Text style={styles.statusBannerTitle}>{banner.title}</Text>
          <Text style={styles.statusBannerMessage}>{banner.message}</Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: alreadyApplied ? 30 : 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Job Header */}
        <View style={styles.jobHeaderRow}>
          <View style={styles.logoWrap}>
            <Image
              source={require("../../../assets/cricket-avatar.jpg")}
              style={styles.logo}
            />
          </View>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.jobTitle}>Referee Needed</Text>
            <Text style={styles.jobSubtitle}>Ionix Sports Club</Text>
          </View>
          <View style={styles.sportBadge}>
            <Text style={styles.sportBadgeText}>Cricket</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.managerName}>Sager Talekar (Manager)</Text>
          <Text style={styles.addressText}>
            H.A. School, PBA SPORTS, near PBA SPORTS Welfare Centre, Hindustan Antibiotics Colony, Pimpri Colony, Pune, Pimpri-Chinchwad, Maharashtra 411018
          </Text>
        </View>

        {/* Earnings Card */}
        <View style={styles.earningCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.earningRate}>₹2,500 per match</Text>
            <Text style={styles.earningMatches}>3 matches</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.estimatedLabel}>Estimated Earnings</Text>
            <Text style={styles.estimatedAmount}>₹7,500</Text>
          </View>
        </View>

        {/* Job Description */}
        <Text style={styles.sectionHeading}>Job Description</Text>
        <Text style={styles.bodyText}>
          You'll design intuitive interfaces, improve user experience, solve usability issues, and create clean visuals to ensure a seamless platform for millions of users.
        </Text>

        {/* About this Job */}
        <Text style={styles.sectionHeading}>About this Job</Text>
        <Text style={styles.bodyText}>
          Urban Company is hiring a UI/UX Designer to help shape and improve digital experience.
        </Text>

        {/* Match Schedule */}
        <Text style={styles.sectionHeading}>Match Schedule</Text>
        {SCHEDULE.map((m) => (
          <View key={m.id} style={styles.scheduleCard}>
            <View style={styles.calIconWrap}>
              <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.scheduleTitle}>{m.title}</Text>
              <Text style={styles.scheduleDate}>{m.date}</Text>
            </View>
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color="#6F6F6F" />
              <Text style={styles.timeText}>{m.time}</Text>
            </View>
          </View>
        ))}

        {/* Requirements */}
        <Text style={styles.sectionHeading}>Requirements</Text>
        <View style={styles.bulletList}>
          {REQUIREMENTS.map((r, i) => renderBullet(r, `req-${i}`))}
        </View>

        {/* Benefits & Perks */}
        <Text style={styles.sectionHeading}>Benefits & Perks</Text>
        <View style={styles.bulletList}>
          {BENEFITS.map((b, i) => renderBullet(b, `ben-${i}`))}
        </View>

        {/* Organizer */}
        <View style={styles.orgRow}>
          <View style={styles.orgAvatar}>
            <Text style={styles.orgAvatarText}>MPL</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.orgName}>Mumbai Premier League</Text>
            <Text style={styles.orgDesc}>
              Professional cricket tournament organizer with 5+ years experience
            </Text>
          </View>
        </View>

        <View style={styles.orgStatsRow}>
          <View style={styles.orgStat}>
            <FontAwesome name="star" size={14} color="#F5B400" />
            <Text style={styles.orgStatBold}> 4.8</Text>
          </View>
          <View style={styles.orgStat}>
            <Text style={styles.orgStatBold}>24 </Text>
            <Text style={styles.orgStatLight}>Events</Text>
          </View>
          <View style={styles.orgStat}>
            <Text style={styles.orgStatBold}>98% </Text>
            <Text style={styles.orgStatLight}>Success Rate</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Apply Button (hidden when already applied) */}
      {!alreadyApplied && (
        <View
          style={[
            styles.applyBar,
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 },
          ]}
        >
          <TouchableOpacity style={styles.applyBtn} activeOpacity={0.9} onPress={openApply}>
            <Text style={styles.applyBtnText}>Apply for this Job</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Apply for Job Bottom Sheet */}
      <Modal
        visible={applyOpen}
        transparent
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={closeApply}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeApply} />

        <View style={styles.sheetAnchor} pointerEvents="box-none">
          {/* Floating close button */}
          <View style={styles.closeFabRow}>
            <TouchableOpacity style={styles.closeFab} onPress={closeApply} activeOpacity={0.85}>
              <Ionicons name="close" size={20} color="#1F1F1F" />
            </TouchableOpacity>
          </View>

          <View style={styles.applySheet}>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.applyTitle}>Apply for Job</Text>
              <View style={styles.applyDivider} />

              {/* Job summary */}
              <View style={styles.applyJobRow}>
                <View style={styles.applyLogoWrap}>
                  <Image
                    source={require("../../../assets/cricket-avatar.jpg")}
                    style={styles.applyLogo}
                  />
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.applyJobTitle}>Referee Needed</Text>
                  <Text style={styles.applyJobSubtitle}>Ionix Sports Club</Text>
                </View>
                <Text style={styles.applyJobRate}>₹7,500 /-</Text>
              </View>

              <Text style={styles.applySectionHeading}>Select professional Profile</Text>

              {PROFILES.map((p) => {
                const selected = selectedProfileId === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.profileCard, selected && styles.profileCardSelected]}
                    activeOpacity={0.85}
                    onPress={() => setSelectedProfileId(p.id)}
                  >
                    <View
                      style={[
                        styles.profileIconWrap,
                        selected ? styles.profileIconWrapSelected : null,
                      ]}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={22}
                        color={selected ? "#15A765" : "#3B82F6"}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.profileTitle}>{p.title}</Text>
                      <View style={styles.profileMetaRow}>
                        <Text style={styles.profileMetaText}>{p.sport}</Text>
                        <Text style={styles.profileMetaDot}>•</Text>
                        <Text style={styles.profileMetaText}>{p.level}</Text>
                      </View>
                    </View>
                    <View style={styles.profileRating}>
                      <FontAwesome name="star" size={13} color="#F5B400" />
                      <Text style={styles.profileRatingText}>{p.rating}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <Text style={styles.applySectionHeading}>
                Cover Message<Text style={styles.applySectionMuted}>(Optional)</Text>
              </Text>
              <TextInput
                style={styles.coverInput}
                placeholder={"Introduce yourself and explain why you're a good fit for this job..."}
                placeholderTextColor="#9A9A9A"
                value={cover}
                onChangeText={(v) => setCover(v.slice(0, COVER_MAX))}
                multiline
                textAlignVertical="top"
              />
              <Text style={styles.charCounter}>{cover.length}/{COVER_MAX} characters</Text>

              <Text style={styles.noteText}>
                *Your application will be sent to Mumbai Premier League. They typically respond within 24-48 hours.
              </Text>
            </ScrollView>

            <View style={styles.applyDivider} />

            {/* Action bar */}
            <View style={[styles.actionBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85} onPress={closeApply}>
                <Ionicons name="close" size={22} color="#1F1F1F" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} activeOpacity={0.9} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Submit Application</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={successOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={closeSuccess}
      >
        <Pressable style={styles.successBackdrop} onPress={closeSuccess}>
          <Pressable style={styles.successCard} onPress={() => {}}>
            <View style={styles.successIconWrap}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark" size={42} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.successTitle}>Application Submitted!</Text>
            <Text style={styles.successMessage}>
              Your application has been sent to Mumbai Premier League. You'll hear back within 24-48 hours.
            </Text>
            <TouchableOpacity style={styles.successBtn} activeOpacity={0.9} onPress={closeSuccess}>
              <Text style={styles.successBtnText}>Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
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
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1F1F1F",
    marginLeft: 2,
  },
  bookmarkBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBorder: {
    height: 1,
    backgroundColor: "#EFEFEF",
  },
  // Status banner
  statusBanner: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  statusBannerTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
    marginBottom: 4,
  },
  statusBannerMessage: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#1F1F1F",
    textAlign: "center",
    lineHeight: 17,
  },
  scroll: {
    flex: 1,
  },
  // Job header row
  jobHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    marginRight: 12,
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  jobSubtitle: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: 2,
  },
  sportBadge: {
    backgroundColor: "#EEEAFB",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  sportBadgeText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#5B4FCF",
  },
  // Manager + address
  section: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  managerName: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
    marginBottom: 6,
  },
  addressText: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    lineHeight: 19,
  },
  // Earnings Card
  earningCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: "#E6F7EC",
    borderRadius: 12,
    padding: 14,
  },
  earningRate: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    color: "#15A765",
  },
  earningMatches: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#15A765",
    marginTop: 4,
  },
  estimatedLabel: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#15A765",
  },
  estimatedAmount: {
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    color: "#15A765",
    marginTop: 2,
  },
  // Sections
  sectionHeading: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
    marginTop: 22,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  bodyText: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#4A4A4A",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  // Schedule
  scheduleCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: "#F4F5F7",
    borderRadius: 12,
    padding: 12,
  },
  calIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#E0EBFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  scheduleTitle: {
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  scheduleDate: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: 2,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#4A4A4A",
  },
  // Bullets
  bulletList: {
    paddingHorizontal: 16,
  },
  bulletRow: {
    flexDirection: "row",
    paddingVertical: 3,
  },
  bulletDot: {
    fontSize: 14,
    color: "#1F1F1F",
    marginRight: 8,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#1F1F1F",
    lineHeight: 20,
  },
  // Organizer
  orgRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 22,
  },
  orgAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  orgAvatarText: {
    fontSize: 13,
    fontFamily: "Montserrat_700Bold",
    color: "#FFFFFF",
  },
  orgName: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  orgDesc: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: 4,
    lineHeight: 17,
  },
  orgStatsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 18,
    alignItems: "center",
  },
  orgStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  orgStatBold: {
    fontSize: 13,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  orgStatLight: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
  },
  // Apply bar
  applyBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  applyBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#15A765",
    justifyContent: "center",
    alignItems: "center",
  },
  applyBtnText: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#FFFFFF",
  },
  // Apply for Job Sheet
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
  applySheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 18,
    height: Dimensions.get("window").height * 0.86,
  },
  applyTitle: {
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
    marginBottom: 12,
  },
  applyDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
  },
  applyJobRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 6,
  },
  applyLogoWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    marginRight: 12,
  },
  applyLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  applyJobTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  applyJobSubtitle: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: 2,
  },
  applyJobRate: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#15A765",
  },
  applySectionHeading: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
    marginTop: 18,
    marginBottom: 10,
  },
  applySectionMuted: {
    fontSize: 15,
    fontFamily: "Montserrat_500Medium",
    color: "#7A7A7A",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F5F7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  profileCardSelected: {
    backgroundColor: "#E6F7EC",
    borderColor: "#15A765",
  },
  profileIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#E0EBFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileIconWrapSelected: {
    backgroundColor: "#FFFFFF",
  },
  profileTitle: {
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  profileMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  profileMetaText: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
  },
  profileMetaDot: {
    fontSize: 12,
    color: "#1F1F1F",
  },
  profileRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  profileRatingText: {
    fontSize: 13,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  coverInput: {
    backgroundColor: "#EFF0F2",
    borderRadius: 12,
    padding: 14,
    minHeight: 110,
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#1F1F1F",
  },
  charCounter: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: 6,
  },
  noteText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#1E88F5",
    lineHeight: 18,
    marginTop: 14,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    gap: 10,
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#15A765",
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#FFFFFF",
  },
  // Success Modal
  successBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  successCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 22,
    alignItems: "center",
  },
  successIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E6F7EC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#15A765",
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
    marginBottom: 8,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  successBtn: {
    alignSelf: "stretch",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#15A765",
    justifyContent: "center",
    alignItems: "center",
  },
  successBtnText: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#FFFFFF",
  },
});

export default JobDetails;
