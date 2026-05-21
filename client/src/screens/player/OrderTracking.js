import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DEFAULT_STEPS = [
  { key: "confirmed", label: "Order Confirmed", date: "12 May, 10:30 AM", done: true },
  { key: "packed", label: "Packed by INOX", date: "12 May, 04:15 PM", done: false },
  { key: "shipped", label: "Shipped", date: "13 May, 09:20 AM", done: false },
  { key: "out_for_delivery", label: "Out for Delivery", date: "14 May, 08:00 AM", done: false },
];

const OrderTracking = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const orderId = route.params?.orderId || "INOX12345";
  const steps = route.params?.steps || DEFAULT_STEPS;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color="#1F1F1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Order ID box */}
        <View style={styles.idBox}>
          <Text style={styles.idLabel}>Order Id</Text>
          <Text style={styles.idValue}>{orderId}</Text>
        </View>

        {/* Timeline card */}
        <View style={styles.timelineCard}>
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            return (
              <View key={step.key} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  {step.done ? (
                    <View style={styles.circleDone}>
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </View>
                  ) : (
                    <View style={styles.circleEmpty} />
                  )}
                  {!isLast && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.stepLabel}>{step.label}</Text>
                  <Text style={styles.stepDate}>{step.date}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Need help card */}
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need help?</Text>
          <Text style={styles.helpSubtitle}>Your item is safe. Reach out for updates</Text>
          <View style={styles.helpActionsRow}>
            <TouchableOpacity style={styles.helpActionBtn} activeOpacity={0.85}>
              <Ionicons name="call-outline" size={18} color="#1C64F2" />
              <Text style={styles.helpActionText}>+91 98765 43210</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpActionBtn} activeOpacity={0.85}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#1C64F2" />
              <Text style={styles.helpActionText}>Chat with us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  headerTitle: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 17,
    color: "#1F1F1F",
  },

  // ID box
  idBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
  },
  idLabel: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#6B7280",
  },
  idValue: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 14,
    color: "#1F1F1F",
  },

  // Timeline
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 16,
    paddingRight: 18,
    marginBottom: 14,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineLeft: {
    width: 24,
    alignItems: "center",
  },
  circleDone: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#15A765",
    alignItems: "center",
    justifyContent: "center",
  },
  circleEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    minHeight: 38,
    backgroundColor: "#D1D5DB",
    marginVertical: 2,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 14,
    paddingBottom: 22,
  },
  stepLabel: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 15,
    color: "#1F1F1F",
  },
  stepDate: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  // Help card
  helpCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 14,
    padding: 16,
  },
  helpTitle: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 15,
    color: "#1F1F1F",
  },
  helpSubtitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  helpActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  helpActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "#EDEFF2",
  },
  helpActionText: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 13,
    color: "#1C64F2",
  },
});

export default OrderTracking;
