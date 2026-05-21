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

const CreateProfessionalProfileScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedSports, setSelectedSports] = useState(["Cricket"]); // Cricket pre-selected to match mockup
  const [city, setCity] = useState("");

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      if (selectedRole) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // Logic for Step 2 completion
      console.log("Step 2 completed:", { selectedSports, city });
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
          {currentStep === 2 ? (
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

          <View style={styles.stepperLine} />

          {/* Step 3 */}
          <View style={styles.inactiveStepCircle}>
            <Text style={styles.inactiveStepText}>3</Text>
          </View>

          <View style={styles.stepperLine} />

          {/* Step 4 */}
          <View style={styles.inactiveStepCircle}>
            <Text style={styles.inactiveStepText}>4</Text>
          </View>

          <View style={styles.stepperLine} />

          {/* Step 5 */}
          <View style={styles.inactiveStepCircle}>
            <Text style={styles.inactiveStepText}>5</Text>
          </View>
        </View>

        {currentStep === 1 ? (
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
        ) : (
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

        {/* Continue Button */}
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
});

export default CreateProfessionalProfileScreen;
