import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OrderConfirmed = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const orderId = route.params?.orderId || "INX123456";
  const productName = route.params?.product || "Puma Football Jersey";
  const totalPaid = route.params?.total || 850;
  const deliveryBy = route.params?.deliveryBy || "14 May";
  const productImage =
    route.params?.image || require("../../../assets/Football.png");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#15A765" />

      <ScrollView
        style={{ flex: 1, backgroundColor: "#15A765" }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Green hero section */}
        <View style={[styles.hero, { paddingTop: insets.top + 30 }]}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={36} color="#15A765" />
          </View>
          <Text style={styles.heroTitle}>Order Confirmed</Text>
          <Text style={styles.heroSubtitle}>
            Your order has been placed successfully and{"\n"}
            is being processed by INOX
          </Text>
        </View>

        {/* White content area */}
        <View style={styles.contentWrap}>
          {/* Product image */}
          <View style={styles.imageWrap}>
            <Image source={productImage} style={styles.image} resizeMode="contain" />
            <View style={styles.dots}>
              <View style={styles.dot} />
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
            </View>
          </View>

          {/* Order details table */}
          <View style={styles.detailsTable}>
            <Row label="Order ID" value={orderId} />
            <Row label="Product" value={productName} />
            <Row label="Total Paid" value={`₹${totalPaid}`} />
            <Row label="Delivery By" value={deliveryBy} />
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

          {/* Bottom buttons */}
          <View style={styles.bottomRow}>
            <TouchableOpacity
              style={styles.trackBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("OrderTracking", { orderId })}
            >
              <Text style={styles.trackBtnText}>Track Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detailBtn}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("OrderDelivered")}
            >
              <Text style={styles.detailBtnText}>Order detail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15A765",
  },

  // Hero
  hero: {
    backgroundColor: "#15A765",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  checkCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  heroTitle: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 22,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 18,
    opacity: 0.95,
  },

  // White content
  contentWrap: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 14,
    marginTop: -4,
  },

  imageWrap: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "80%",
    height: "85%",
  },
  dots: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    alignSelf: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
  },
  dotActive: {
    backgroundColor: "#1F1F1F",
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Details table
  detailsTable: {
    paddingVertical: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  rowLabel: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#4B5563",
  },
  rowValue: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 14,
    color: "#1F1F1F",
  },

  // Help card
  helpCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 14,
    padding: 16,
    marginTop: 6,
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

  // Bottom buttons
  bottomRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
    marginBottom: 8,
  },
  trackBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#15A765",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  trackBtnText: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 15,
    color: "#15A765",
  },
  detailBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#15A765",
    alignItems: "center",
    justifyContent: "center",
  },
  detailBtnText: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 15,
    color: "#FFFFFF",
  },
});

export default OrderConfirmed;
