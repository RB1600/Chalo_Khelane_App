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
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SAMPLE_PROS = [
  {
    id: "1",
    name: "Rajesh Kumar",
    role: "Cricket Referee",
    rating: 4.8,
    level: "Intermediate",
    location: "Mumbai",
    sport: "Cricket",
    licenses: ["ICC Level 2 Umpire", "UEFA B License"],
    rate: "₹1,200/-",
    rateUnit: "per hour",
    note: "Weekend only",
    avatar: require("../../../assets/person.webp"),
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    role: "Cricket Referee",
    rating: 4.8,
    level: "Intermediate",
    location: "Mumbai",
    sport: "Cricket",
    licenses: ["ICC Level 2 Umpire", "UEFA B License"],
    rate: "₹1,200/-",
    rateUnit: "per hour",
    note: "Weekend only",
    avatar: require("../../../assets/person.webp"),
  },
  {
    id: "3",
    name: "Rajesh Kumar",
    role: "Cricket Referee",
    rating: 4.8,
    level: "Intermediate",
    location: "Mumbai",
    sport: "Cricket",
    licenses: [],
    rate: "₹1,200/-",
    rateUnit: "per hour",
    note: "Weekend only",
    avatar: require("../../../assets/cricket-avatar.jpg"),
  },
];

const HireProfessional = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selectedPro, setSelectedPro] = useState(null);
  const [hireFormOpen, setHireFormOpen] = useState(false);
  const [form, setForm] = useState({
    eventName: "",
    eventDate: "",
    location: "",
    duration: "",
    offerPayment: "",
    description: "",
  });

  const openProfile = (pro) => setSelectedPro(pro);
  const closeProfile = () => setSelectedPro(null);
  const openHireForm = () => setHireFormOpen(true);
  const closeHireForm = () => setHireFormOpen(false);

  const profileVisible = !!selectedPro && !hireFormOpen;

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const renderProCard = (pro) => (
    <TouchableOpacity
      key={pro.id}
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => openProfile(pro)}
    >
      <View style={styles.topRow}>
        <Image source={pro.avatar} style={styles.avatar} />

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1, paddingRight: 6 }}>
              <Text style={styles.name}>{pro.name}</Text>
              <Text style={styles.role}>{pro.role}</Text>
              <View style={styles.ratingRow}>
                <FontAwesome name="star" size={12} color="#F5B400" />
                <Text style={styles.ratingText}>{pro.rating}</Text>
              </View>
            </View>
            <View style={styles.sportBadge}>
              <Text style={styles.sportBadgeText}>{pro.sport}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="shield-outline" size={14} color="#6F6F6F" />
          <Text style={styles.metaText}>{pro.level}</Text>
        </View>
        <View style={[styles.metaItem, { marginLeft: 24 }]}>
          <Ionicons name="location-outline" size={14} color="#6F6F6F" />
          <Text style={styles.metaText}>{pro.location}</Text>
        </View>
      </View>

      {pro.licenses.length > 0 && (
        <View style={styles.licenseRow}>
          {pro.licenses.map((lic, i) => (
            <View key={`${pro.id}-lic-${i}`} style={styles.licenseChip}>
              <Text style={styles.licenseText}>{lic}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.bottomRow}>
        <View style={styles.rateWrap}>
          <Text style={styles.rate}>{pro.rate} </Text>
          <Text style={styles.rateUnit}>{pro.rateUnit}</Text>
        </View>
        <Text style={styles.note}>{pro.note}</Text>
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
        <Text style={styles.headerTitle}>Hire Professional</Text>
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
        <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
          <MaterialCommunityIcons name="tune-variant" size={20} color="#1F1F1F" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {SAMPLE_PROS.map(renderProCard)}
      </ScrollView>

      {/* Profile Bottom Sheet */}
      <Modal
        visible={profileVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={closeProfile}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeProfile} />

        <View style={styles.sheetAnchor} pointerEvents="box-none">
          {/* Floating close button above the sheet */}
          <View style={styles.closeFabRow}>
            <TouchableOpacity
              style={styles.closeFab}
              onPress={closeProfile}
              activeOpacity={0.85}
            >
              <Ionicons name="close" size={20} color="#1F1F1F" />
            </TouchableOpacity>
          </View>

          <View style={styles.sheet}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
              bounces={false}
            >
              <Text style={styles.sheetCaption}>Profile</Text>

              {/* Header */}
              <View style={styles.profileHeader}>
                <Image source={selectedPro?.avatar} style={styles.profileAvatar} />
                <View style={{ flex: 1 }}>
                  <View style={styles.profileTopRow}>
                    <View style={{ flex: 1, paddingRight: 6 }}>
                      <Text style={styles.profileName}>{selectedPro?.name}</Text>
                      <Text style={styles.profileRole}>{selectedPro?.role}</Text>
                      <View style={styles.profileSubRow}>
                        <Text style={styles.profileJobs}>45 Job Completed</Text>
                        <View style={styles.profileRating}>
                          <FontAwesome name="star" size={13} color="#F5B400" />
                          <Text style={styles.profileRatingText}>{selectedPro?.rating}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.sportBadge}>
                      <Text style={styles.sportBadgeText}>{selectedPro?.sport}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Rate */}
              <View style={styles.priceRow}>
                <Text style={styles.priceAmount}>{selectedPro?.rate}</Text>
                <Text style={styles.priceUnit}> per hour / Negotiable</Text>
              </View>

              <View style={styles.sheetDivider} />

              {/* Stat cards */}
              <View style={styles.statRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>{selectedPro?.level}</Text>
                  <Text style={styles.statSub}>Experience</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>Pune</Text>
                  <Text style={styles.statSub}>Locations</Text>
                </View>
              </View>

              {/* Availability schedule */}
              <View style={styles.availCard}>
                <Text style={styles.availTitle}>Availability</Text>
                <View style={styles.availChipsRow}>
                  <View style={styles.dayChip}>
                    <Text style={styles.dayChipText}>Mon</Text>
                  </View>
                  <View style={styles.dayChip}>
                    <Text style={styles.dayChipText}>Fri</Text>
                  </View>
                  <View style={styles.weekendChip}>
                    <Text style={styles.weekendChipText}>Weekend Only</Text>
                  </View>
                </View>
              </View>

              {/* About */}
              <Text style={styles.sectionHeading}>Availability</Text>
              <Text style={styles.aboutText}>
                Experienced cricket referee with 3+ years of professional experience. Specialized in local and state-level tournaments.
              </Text>

              {/* Certifications */}
              <Text style={styles.sectionHeading}>Certifications</Text>
              <View style={styles.certRow}>
                <View style={styles.certChip}>
                  <Text style={styles.certText}>ICC Level 2 Umpire</Text>
                </View>
                <View style={styles.certChip}>
                  <Text style={styles.certText}>UEFA B License</Text>
                </View>
              </View>

              <View style={styles.sheetDivider} />
            </ScrollView>

            {/* Action bar */}
            <View style={[styles.actionBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85}>
                <MaterialCommunityIcons name="text-box-outline" size={22} color="#1F1F1F" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.hireBtn} activeOpacity={0.9} onPress={openHireForm}>
                <Text style={styles.hireBtnText}>Hire Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Send Hire Request Sheet */}
      <Modal
        visible={hireFormOpen}
        transparent
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={closeHireForm}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeHireForm} />

        <View style={styles.sheetAnchor} pointerEvents="box-none">
          {/* Floating close button above the sheet */}
          <View style={styles.closeFabRow}>
            <TouchableOpacity
              style={styles.closeFab}
              onPress={closeHireForm}
              activeOpacity={0.85}
            >
              <Ionicons name="close" size={20} color="#1F1F1F" />
            </TouchableOpacity>
          </View>

          <View style={styles.hireSheet}>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.hireFormTitle}>Send Hire Request</Text>

              {/* Pro Summary Card */}
              <View style={styles.proSummary}>
                <Image source={selectedPro?.avatar} style={styles.proSummaryAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.proSummaryName}>{selectedPro?.name}</Text>
                  <Text style={styles.proSummaryRole}>{selectedPro?.role}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.proSummaryRate}>₹2,500</Text>
                  <Text style={styles.proSummaryUnit}>per match</Text>
                </View>
              </View>

              {/* Form Fields */}
              <Text style={styles.fieldLabel}>Event name</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g., Football Jersey, Cricket Bat"
                placeholderTextColor="#9A9A9A"
                value={form.eventName}
                onChangeText={(v) => updateField("eventName", v)}
              />

              <Text style={styles.fieldLabel}>Event Date</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g., Football Jersey, Cricket Bat"
                placeholderTextColor="#9A9A9A"
                value={form.eventDate}
                onChangeText={(v) => updateField("eventDate", v)}
              />

              <Text style={styles.fieldLabel}>Location</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g., Football Jersey, Cricket Bat"
                placeholderTextColor="#9A9A9A"
                value={form.location}
                onChangeText={(v) => updateField("location", v)}
              />

              <Text style={styles.fieldLabel}>Duration</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g., Football Jersey, Cricket Bat"
                placeholderTextColor="#9A9A9A"
                value={form.duration}
                onChangeText={(v) => updateField("duration", v)}
              />

              <Text style={styles.fieldLabel}>Offer Payment</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g., Football Jersey, Cricket Bat"
                placeholderTextColor="#9A9A9A"
                value={form.offerPayment}
                onChangeText={(v) => updateField("offerPayment", v)}
              />
              <Text style={styles.fieldHint}>Suggested: ₹2,500 per match</Text>

              <Text style={styles.fieldLabel}>
                Description<Text style={styles.fieldLabelMuted}>(Optional)</Text>
              </Text>
              <TextInput
                style={[styles.fieldInput, styles.fieldTextarea]}
                placeholder="Add details about condition & usage"
                placeholderTextColor="#9A9A9A"
                value={form.description}
                onChangeText={(v) => updateField("description", v)}
                multiline
                textAlignVertical="top"
              />

              <Text style={styles.noteText}>
                *Your request will be sent to Amit Sharma. They can accept, reject, or negotiate the terms.
              </Text>
            </ScrollView>

            <View style={styles.formDivider} />

            {/* Action bar */}
            <View style={[styles.actionBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85} onPress={closeHireForm}>
                <Ionicons name="close" size={22} color="#1F1F1F" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.hireBtn} activeOpacity={0.9}>
                <Text style={styles.hireBtnText}>Send Request</Text>
              </TouchableOpacity>
            </View>
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
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1F1F1F",
    marginLeft: 2,
  },
  // search
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 4,
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
  scroll: {
    flex: 1,
  },
  // card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  topRow: {
    flexDirection: "row",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    backgroundColor: "#F2F2F2",
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  role: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1F1F1F",
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#6F6F6F",
  },
  licenseRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  licenseChip: {
    backgroundColor: "#FBEAF1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  licenseText: {
    fontSize: 11,
    fontFamily: "Montserrat_500Medium",
    color: "#C2185B",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  rateWrap: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  rate: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#15A765",
  },
  rateUnit: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
  },
  note: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#7A7A7A",
  },
  // Profile sheet
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
    paddingTop: 16,
    maxHeight: Dimensions.get("window").height * 0.88,
  },
  hireSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 18,
    height: Dimensions.get("window").height * 0.88,
  },
  sheetCaption: {
    fontSize: 13,
    fontFamily: "Montserrat_500Medium",
    color: "#6F6F6F",
    marginBottom: 12,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: "#F2F2F2",
  },
  profileTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  profileName: {
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  profileRole: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: 2,
  },
  profileSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 14,
  },
  profileJobs: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
  },
  profileRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  profileRatingText: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1F1F1F",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 14,
  },
  priceAmount: {
    fontSize: 24,
    fontFamily: "Montserrat_700Bold",
    color: "#15A765",
  },
  priceUnit: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
  },
  sheetDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 14,
  },
  statRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F4F5F7",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statTitle: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  statSub: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: 4,
  },
  availCard: {
    backgroundColor: "#F4F5F7",
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  availTitle: {
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
    marginBottom: 10,
  },
  availChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayChip: {
    backgroundColor: "#E2F4EA",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dayChipText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#1A8E4A",
  },
  weekendChip: {
    backgroundColor: "#C5E9D2",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  weekendChipText: {
    fontSize: 12,
    fontFamily: "Montserrat_600SemiBold",
    color: "#15A765",
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
    marginTop: 18,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#4A4A4A",
    lineHeight: 20,
  },
  certRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  certChip: {
    backgroundColor: "#F3EAFB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  certText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#5B4FCF",
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
  hireBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#15A765",
    justifyContent: "center",
    alignItems: "center",
  },
  hireBtnText: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#FFFFFF",
  },
  // Hire Form sheet
  hireFormTitle: {
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
    marginBottom: 14,
  },
  proSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F5F7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  proSummaryAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
  },
  proSummaryName: {
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    color: "#1F1F1F",
  },
  proSummaryRole: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: 2,
  },
  proSummaryRate: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: "#15A765",
  },
  proSummaryUnit: {
    fontSize: 11,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1F1F1F",
    marginBottom: 8,
    marginTop: 6,
  },
  fieldLabelMuted: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#7A7A7A",
  },
  fieldInput: {
    backgroundColor: "#EFF0F2",
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 44,
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#1F1F1F",
    marginBottom: 14,
  },
  fieldTextarea: {
    borderRadius: 14,
    height: 90,
    paddingTop: 12,
    paddingBottom: 12,
  },
  fieldHint: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#6F6F6F",
    marginTop: -6,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#1E88F5",
    lineHeight: 18,
    marginTop: 6,
  },
  formDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginTop: 4,
  },
});

export default HireProfessional;
