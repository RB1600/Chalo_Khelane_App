import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TextInput,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgUri } from "react-native-svg";
import { Asset } from "expo-asset";

const { width } = Dimensions.get("window");

// Load local SVG assets
const whistleUri = Asset.fromModule(require("../../../assets/whistle .svg")).uri;
const scorerUri = Asset.fromModule(require("../../../assets/scorer.svg")).uri;
const cameramanUri = Asset.fromModule(require("../../../assets/cameraman.svg")).uri;
const commentatorUri = Asset.fromModule(require("../../../assets/commentator.svg")).uri;
const eventstaffUri = Asset.fromModule(require("../../../assets/eventstaff.svg")).uri;
const physiotherapyUri = Asset.fromModule(require("../../../assets/Physiotherapy.svg")).uri;
const photographerUri = Asset.fromModule(require("../../../assets/photographer.svg")).uri;
const groundstaffUri = Asset.fromModule(require("../../../assets/Groundstaff.svg")).uri;
const coachUri = Asset.fromModule(require("../../../assets/coach.svg")).uri;
const lightbulbUri = Asset.fromModule(require("../../../assets/lightbulb.svg")).uri;

const ROLES = [
  {
    id: "referee",
    label: "Referee/ Umpire",
    uri: whistleUri,
  },
  {
    id: "coach",
    label: "Trainer/ Coach",
    uri: coachUri,
  },
  {
    id: "scorer",
    label: "Scorer",
    uri: scorerUri,
  },
  {
    id: "cameraman",
    label: "Cameraman",
    uri: cameramanUri,
  },
  {
    id: "commentator",
    label: "Commentator",
    uri: commentatorUri,
  },
  {
    id: "event_staff",
    label: "Event Staff",
    uri: eventstaffUri,
  },
  {
    id: "physiotherapist",
    label: "Physiotherapist",
    uri: physiotherapyUri,
  },
  {
    id: "photographer",
    label: "Photographer",
    uri: photographerUri,
  },
  {
    id: "ground_staff",
    label: "Ground Staff",
    uri: groundstaffUri,
  },
];

const SPORTS_OPTIONS = [
  "Cricket",
  "Football",
  "Badminton",
  "Basketball",
  "Table Tennis",
  "Tennis",
  "Volleyball",
  "Hockey",
  "Kabaddi",
  "Swimming",
  "Tennis", // Tennis listed twice as in the mockup image
];

const EXPERIENCE_LEVELS = [
  { id: "fresher", label: "Fresher", duration: "0-1 year" },
  { id: "intermediate", label: "Intermediate", duration: "1-3 years" },
  { id: "professional", label: "Professional", duration: "3-5 years" },
  { id: "experienced", label: "Experienced", duration: "5+ Years" },
];

const AVAILABILITY_OPTIONS = [
  { id: "full_time", label: "Full Time", icon: "briefcase-outline" },
  { id: "part_time", label: "Part Time", icon: "time-outline" },
  { id: "weekends_only", label: "Weekends Only", icon: "calendar-outline" },
  { id: "event_based", label: "Event Based", icon: "star-outline" },
  { id: "flexible_hours", label: "Flexible Hours", icon: "refresh-circle-outline" },
];

const RATE_TYPES = [
  { id: "per_hour", label: "Per Hour", icon: "time-outline" },
  { id: "per_match", label: "Per Match", icon: "trophy-outline" },
  { id: "per_day", label: "Per Day", icon: "calendar-outline" },
];

const CreateProfessionalProfileScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedSports, setSelectedSports] = useState(["Cricket"]); // Cricket pre-selected to match mockup
  const [city, setCity] = useState("");
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedRateType, setSelectedRateType] = useState(null);
  const [rateAmount, setRateAmount] = useState("");
  const [experienceText, setExperienceText] = useState("");
  const [certificateName, setCertificateName] = useState("");

  const toggleAvailability = (id) => {
    setSelectedAvailability((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      if (selectedRole) setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (selectedExperience) setCurrentStep(4);
    } else if (currentStep === 4) {
      if (selectedRateType && rateAmount.trim()) setCurrentStep(5);
    } else if (currentStep === 5) {
      if (experienceText.trim()) setCurrentStep(6);
    } else if (currentStep === 6) {
      console.log("Profile created:", {
        selectedRole,
        selectedSports,
        city,
        selectedExperience,
        selectedAvailability,
        selectedRateType,
        rateAmount,
        experienceText,
        certificateName,
      });
    }
  };

  const toggleSportSelection = (sport, index) => {
    // Unique identifier combining name and index to support duplicate entries like "Tennis"
    const identifier = `${sport}-${index}`;
    setSelectedSports((prev) =>
      prev.includes(identifier)
        ? prev.filter((x) => x !== identifier)
        : [...prev, identifier]
    );
  };

  const isSportSelected = (sport, index) => {
    const identifier = `${sport}-${index}`;
    // Support pre-selecting "Cricket" when empty or initial load
    if (sport === "Cricket" && selectedSports.includes("Cricket")) {
      return true;
    }
    return selectedSports.includes(identifier) || selectedSports.includes(sport);
  };

  const renderIcon = (role) => {
    const color = selectedRole === role.id ? "#15A765" : "#333333";
    return (
      <SvgUri
        uri={role.uri}
        width={24}
        height={24}
        color={color}
      />
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#0A0A0A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Professional Profile</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stepper Progress */}
        {currentStep !== 6 && (
        <View style={styles.stepperContainer}>
          {/* Step 1 */}
          {currentStep > 1 ? (
            <View style={styles.completedStepCircle}>
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </View>
          ) : (
            <View style={styles.activeStepOuterRing}>
              <View style={styles.activeStepCircle}>
                <Text style={styles.activeStepText}>1</Text>
              </View>
            </View>
          )}

          <View style={[styles.stepperLine, currentStep > 1 && styles.stepperLineCompleted]} />

          {/* Step 2 */}
          {currentStep > 2 ? (
            <View style={styles.completedStepCircle}>
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </View>
          ) : currentStep === 2 ? (
            <View style={styles.activeStepOuterRing}>
              <View style={styles.activeStepCircle}>
                <Text style={styles.activeStepText}>2</Text>
              </View>
            </View>
          ) : (
            <View style={styles.inactiveStepCircle}>
              <Text style={styles.inactiveStepText}>2</Text>
            </View>
          )}

          <View style={[styles.stepperLine, currentStep > 2 && styles.stepperLineCompleted]} />

          {/* Step 3 */}
          {currentStep > 3 ? (
            <View style={styles.completedStepCircle}>
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </View>
          ) : currentStep === 3 ? (
            <View style={styles.activeStepOuterRing}>
              <View style={styles.activeStepCircle}>
                <Text style={styles.activeStepText}>3</Text>
              </View>
            </View>
          ) : (
            <View style={styles.inactiveStepCircle}>
              <Text style={styles.inactiveStepText}>3</Text>
            </View>
          )}

          <View style={[styles.stepperLine, currentStep > 3 && styles.stepperLineCompleted]} />

          {/* Step 4 */}
          {currentStep > 4 ? (
            <View style={styles.completedStepCircle}>
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </View>
          ) : currentStep === 4 ? (
            <View style={styles.activeStepOuterRing}>
              <View style={styles.activeStepCircle}>
                <Text style={styles.activeStepText}>4</Text>
              </View>
            </View>
          ) : (
            <View style={styles.inactiveStepCircle}>
              <Text style={styles.inactiveStepText}>4</Text>
            </View>
          )}

          <View style={[styles.stepperLine, currentStep > 4 && styles.stepperLineCompleted]} />

          {/* Step 5 */}
          {currentStep === 5 ? (
            <View style={styles.activeStepOuterRing}>
              <View style={styles.activeStepCircle}>
                <Text style={styles.activeStepText}>5</Text>
              </View>
            </View>
          ) : (
            <View style={styles.inactiveStepCircle}>
              <Text style={styles.inactiveStepText}>5</Text>
            </View>
          )}
        </View>
        )}

        {currentStep === 1 && (
          <>
            {/* Step 1 Heading */}
            <View style={styles.headingSection}>
              <Text style={styles.titleText}>Select Your Professional Role</Text>
              <Text style={styles.subtitleText}>Choose the primary service you want to offer</Text>
            </View>

            {/* Grid of Roles */}
            <View style={styles.gridContainer}>
              {ROLES.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <TouchableOpacity
                    key={role.id}
                    style={[
                      styles.roleCard,
                      isSelected && styles.roleCardSelected,
                    ]}
                    onPress={() => setSelectedRole(role.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconContainer}>{renderIcon(role)}</View>
                    <Text
                      style={[
                        styles.roleLabel,
                        isSelected && styles.roleLabelSelected,
                      ]}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Tip Box */}
            <View style={styles.tipBox}>
              <SvgUri
                uri={lightbulbUri}
                width={20}
                height={20}
                color="#1877F2"
                style={styles.tipIcon}
              />
              <Text style={styles.tipText}>
                <Text style={styles.tipTextBold}>Tip: </Text>
                You can create multiple professional profiles for different roles.
              </Text>
            </View>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Step 2 Heading */}
            <View style={styles.headingSection}>
              <Text style={styles.titleText}>Sports & Location</Text>
              <Text style={styles.subtitleText}>Select sports you can work with and your city</Text>
            </View>

            {/* Languages Known Section (Chips) */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Languages Known</Text>
                <Text style={styles.selectedCountText}>
                  {selectedSports.length} selected
                </Text>
              </View>

              <View style={styles.chipsContainer}>
                {SPORTS_OPTIONS.map((sport, index) => {
                  const isSelected = isSportSelected(sport, index);
                  return (
                    <TouchableOpacity
                      key={`${sport}-${index}`}
                      style={[
                        styles.chipButton,
                        isSelected && styles.chipButtonActive,
                      ]}
                      onPress={() => toggleSportSelection(sport, index)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {sport}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Location Input Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Location</Text>
              <TextInput
                style={styles.cityInput}
                placeholder="Enter your city"
                placeholderTextColor="#9CA3AF"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </>
        )}

        {currentStep === 3 && (
          <>
            {/* Step 3 Heading */}
            <View style={styles.headingSection}>
              <Text style={styles.titleText}>Experience & Availability</Text>
              <Text style={styles.subtitleText}>
                Tell us about your experience level and availability
              </Text>
            </View>

            {/* Experience level */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Experience level</Text>
              <View style={{ gap: 12 }}>
                {EXPERIENCE_LEVELS.map((level) => {
                  const isSelected = selectedExperience === level.id;
                  return (
                    <TouchableOpacity
                      key={level.id}
                      style={[
                        styles.expCard,
                        isSelected && styles.expCardSelected,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => setSelectedExperience(level.id)}
                    >
                      <Text
                        style={[
                          styles.expTitle,
                          isSelected && styles.expTitleSelected,
                        ]}
                      >
                        {level.label}
                      </Text>
                      <Text style={styles.expDuration}>{level.duration}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Availability */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Availability</Text>
              <View style={styles.availGrid}>
                {AVAILABILITY_OPTIONS.map((opt) => {
                  const isSelected = selectedAvailability.includes(opt.id);
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.availCard,
                        isSelected && styles.availCardSelected,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => toggleAvailability(opt.id)}
                    >
                      <Ionicons
                        name={opt.icon}
                        size={22}
                        color={isSelected ? "#15A765" : "#4B5563"}
                      />
                      <Text
                        style={[
                          styles.availLabel,
                          isSelected && styles.availLabelSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        )}

        {currentStep === 4 && (
          <>
            {/* Step 4 Heading */}
            <View style={styles.headingSection}>
              <Text style={styles.titleText}>Pricing Setup</Text>
              <Text style={styles.subtitleText}>Set your rates & pricing structure</Text>
            </View>

            {/* Rate Type */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Rate Type</Text>
              <View style={styles.rateTypeRow}>
                {RATE_TYPES.map((rt) => {
                  const isSelected = selectedRateType === rt.id;
                  return (
                    <TouchableOpacity
                      key={rt.id}
                      style={[
                        styles.rateTypeCard,
                        isSelected && styles.rateTypeCardSelected,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => setSelectedRateType(rt.id)}
                    >
                      <Ionicons
                        name={rt.icon}
                        size={26}
                        color={isSelected ? "#15A765" : "#4B5563"}
                      />
                      <Text
                        style={[
                          styles.rateTypeLabel,
                          isSelected && styles.rateTypeLabelSelected,
                        ]}
                      >
                        {rt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Your Rate */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Your Rate</Text>
              <TextInput
                style={styles.rateInput}
                placeholder="Enter amount in ₹"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={rateAmount}
                onChangeText={setRateAmount}
              />
            </View>

            {/* Open to Negotiation banner */}
            <View style={styles.negotiationBanner}>
              <Text style={styles.negotiationTitle}>Open to Negotiation</Text>
              <Text style={styles.negotiationBody}>
                Allow clients to discuss and negotiate rates based on event requirements
              </Text>
            </View>
          </>
        )}

        {currentStep === 5 && (
          <>
            {/* Step 5 Heading */}
            <View style={styles.headingSection}>
              <Text style={styles.titleText}>Experience & Portfolio</Text>
              <Text style={styles.subtitleText}>Add details to build trust and credibility</Text>
            </View>

            {/* Tell us about your experience */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Tell us about your experience</Text>
              <TextInput
                style={styles.experienceTextarea}
                placeholder={"Describe your experience, notable events you've worked on, skills, etc."}
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                maxLength={500}
                value={experienceText}
                onChangeText={setExperienceText}
              />
              <Text style={styles.charCount}>{experienceText.length}/500 characters</Text>
            </View>

            {/* Certification (Optional) */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Certification (Optional)</Text>
              <TouchableOpacity
                style={styles.uploadBox}
                activeOpacity={0.85}
                onPress={() => {
                  /* file picker hook-up TBD */
                  setCertificateName(certificateName ? "" : "certificate.pdf");
                }}
              >
                <Ionicons name="ribbon-outline" size={26} color="#4B5563" />
                <Text style={styles.uploadText}>
                  {certificateName || "Upload certificates"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.charCount}>{certificateName.length}/500 characters</Text>
            </View>

            {/* Get Verified banner */}
            <View style={styles.verifiedBanner}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#1C64F2"
                style={{ marginTop: 1, marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.verifiedTitle}>Get Verified</Text>
                <Text style={styles.verifiedBody}>
                  Upload government ID and relevant certifications to get a verified
                  badge. Verified professionals get 3x more job requests!
                </Text>
              </View>
            </View>
          </>
        )}

        {currentStep === 6 && (
          <>
            {/* Preview Heading */}
            <View style={styles.headingSection}>
              <Text style={styles.titleText}>Preview</Text>
              <Text style={styles.subtitleText}>Add details to build trust and credibility</Text>
            </View>

            <View style={styles.previewBody} />
          </>
        )}

        {/* Continue Button(s) */}
        {currentStep === 3 || currentStep === 4 || currentStep === 5 || currentStep === 6 ? (
          (() => {
            const stepDisabled =
              currentStep === 3
                ? !selectedExperience
                : currentStep === 4
                ? !selectedRateType || !rateAmount.trim()
                : currentStep === 5
                ? !experienceText.trim()
                : false;
            const ctaLabel =
              currentStep === 5 || currentStep === 6 ? "Create Profile" : "Continue";
            return (
              <View style={styles.bottomRow}>
                <TouchableOpacity
                  style={styles.backSquareBtn}
                  onPress={handleBack}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-back" size={22} color="#15A765" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.continueButtonRow,
                    stepDisabled && styles.continueButtonDisabled,
                  ]}
                  onPress={handleContinue}
                  disabled={stepDisabled}
                  activeOpacity={0.85}
                >
                  <Text style={styles.continueButtonText}>{ctaLabel}</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#FFFFFF"
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              </View>
            );
          })()
        ) : (
          <TouchableOpacity
            style={[
              styles.continueButton,
              currentStep === 1 && !selectedRole && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={currentStep === 1 && !selectedRole}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 18,
    color: "#0A0A0A",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    marginTop: 8,
    marginBottom: 24,
  },
  completedStepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#15A765",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStepOuterRing: {
    borderWidth: 1.5,
    borderColor: "#FF8D28",
    borderRadius: 24,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  activeStepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF8D28",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStepText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  inactiveStepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveStepText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
  },
  stepperLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#EFF1F5",
    marginHorizontal: 8,
  },
  stepperLineCompleted: {
    backgroundColor: "#15A765",
  },
  headingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    color: "#0A0A0A",
    fontWeight: "600",
  },
  subtitleText: {
    fontSize: 14,
    color: "#8E9AA0",
    marginTop: 4,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  roleCard: {
    width: (width - 52) / 2,
    height: 104,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFF1F5",
    padding: 16,
    marginBottom: 12,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  roleCardSelected: {
    borderColor: "#15A765",
    borderWidth: 1.5,
    backgroundColor: "#F0FDF4",
  },
  iconContainer: {
    alignSelf: "flex-start",
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0A0A0A",
  },
  roleLabelSelected: {
    color: "#15A765",
    fontWeight: "600",
  },
  tipBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#1C64F2",
    lineHeight: 18,
  },
  tipTextBold: {
    fontWeight: "700",
  },
  continueButton: {
    backgroundColor: "#15A765",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
  },
  continueButtonDisabled: {
    backgroundColor: "#A7F3D0",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // Step 2 specific styles
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A0A0A",
    marginBottom: 8,
  },
  selectedCountText: {
    fontSize: 14,
    color: "#1877F2",
    fontWeight: "500",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chipButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 4,
  },
  chipButtonActive: {
    backgroundColor: "#EAFDF4",
    borderWidth: 1,
    borderColor: "#15A765",
  },
  chipText: {
    color: "#6B7280",
    fontSize: 14,
  },
  chipTextActive: {
    color: "#15A765",
    fontWeight: "600",
  },
  cityInput: {
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    height: 56,
    paddingHorizontal: 20,
    fontSize: 15,
    color: "#0A0A0A",
  },

  // ── Step 3: Experience & Availability ──
  expCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFF1F5",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  expCardSelected: {
    borderColor: "#15A765",
    borderWidth: 1.5,
    backgroundColor: "#F0FDF4",
  },
  expTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A0A0A",
    marginBottom: 2,
  },
  expTitleSelected: {
    color: "#15A765",
  },
  expDuration: {
    fontSize: 13,
    color: "#8E9AA0",
  },
  availGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  availCard: {
    width: (width - 52) / 2,
    minHeight: 88,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFF1F5",
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  availCardSelected: {
    borderColor: "#15A765",
    borderWidth: 1.5,
    backgroundColor: "#F0FDF4",
  },
  availLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0A0A0A",
    marginTop: 8,
  },
  availLabelSelected: {
    color: "#15A765",
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  backSquareBtn: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#15A765",
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonRow: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#15A765",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Step 4: Pricing Setup ──
  rateTypeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  rateTypeCard: {
    flex: 1,
    minHeight: 88,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFF1F5",
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "flex-start",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  rateTypeCardSelected: {
    borderColor: "#15A765",
    borderWidth: 1.5,
    backgroundColor: "#F0FDF4",
  },
  rateTypeLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0A0A0A",
    marginTop: 10,
  },
  rateTypeLabelSelected: {
    color: "#15A765",
    fontWeight: "600",
  },
  rateInput: {
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#0A0A0A",
  },
  negotiationBanner: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 24,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
  },
  negotiationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C64F2",
    marginBottom: 4,
  },
  negotiationBody: {
    fontSize: 13,
    color: "#1C64F2",
    lineHeight: 18,
  },

  // ── Step 5: Experience & Portfolio ──
  experienceTextarea: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    minHeight: 110,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 14,
    color: "#0A0A0A",
    lineHeight: 20,
  },
  charCount: {
    fontSize: 12,
    color: "#8E9AA0",
    marginTop: 6,
  },
  uploadBox: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    minHeight: 96,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  uploadText: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 8,
  },
  verifiedBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 24,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
  },
  verifiedTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C64F2",
    marginBottom: 4,
  },
  verifiedBody: {
    fontSize: 13,
    color: "#1C64F2",
    lineHeight: 18,
  },

  // ── Step 6: Preview ──
  previewBody: {
    minHeight: 360,
  },
});

export default CreateProfessionalProfileScreen;
