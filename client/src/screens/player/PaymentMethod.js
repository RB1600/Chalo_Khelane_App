import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const METHODS = [
  {
    id: "upi",
    title: "UPI",
    subtitle: "Google Pay, PhonePe, Paytm",
    iconLib: "Ionicons",
    icon: "phone-portrait-outline",
  },
  {
    id: "card",
    title: "Card",
    subtitle: "Credit or Debit card",
    iconLib: "Ionicons",
    icon: "card-outline",
  },
  {
    id: "wallet",
    title: "Wallet",
    subtitle: "Digital wallets",
    iconLib: "Ionicons",
    icon: "wallet-outline",
  },
  {
    id: "cod",
    title: "Cash on Delivery (COD)",
    subtitle: "Pay directly at the Delivery time",
    iconLib: "MaterialCommunityIcons",
    icon: "lightning-bolt",
  },
];

const PaymentMethod = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const total = route.params?.total || 850;
  const [selected, setSelected] = useState("upi");

  const renderIcon = (m) => {
    const color = "#15A765";
    if (m.iconLib === "MaterialCommunityIcons") {
      return <MaterialCommunityIcons name={m.icon} size={22} color={color} />;
    }
    return <Ionicons name={m.icon} size={22} color={color} />;
  };

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
        <Text style={styles.headerCartLabel}>Cart</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 6 }}
        showsVerticalScrollIndicator={false}
      >
        {METHODS.map((m) => {
          const isSelected = selected === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              style={[styles.methodCard, isSelected && styles.methodCardSelected]}
              activeOpacity={0.85}
              onPress={() => setSelected(m.id)}
            >
              <View style={styles.iconBox}>{renderIcon(m)}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodTitle}>{m.title}</Text>
                <Text style={styles.methodSubtitle}>{m.subtitle}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footerWrap,
          { paddingBottom: (insets.bottom || 0) + 14 },
        ]}
      >
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total}/-</Text>
        </View>
        <TouchableOpacity
          style={styles.placeOrderBtn}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("OrderConfirmed", {
              total,
              paymentMethod: selected,
            })
          }
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
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
  headerCartLabel: {
    fontFamily: "Montserrat_500Medium",
    fontWeight: "500",
    fontSize: 15,
    color: "#1F1F1F",
  },

  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  methodCardSelected: {
    borderColor: "#15A765",
    borderWidth: 1.5,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  methodTitle: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 15,
    color: "#1F1F1F",
  },
  methodSubtitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  footerWrap: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  totalLabel: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    color: "#1F1F1F",
  },
  totalValue: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 17,
    color: "#1F1F1F",
  },
  placeOrderBtn: {
    height: 54,
    backgroundColor: "#15A765",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  placeOrderText: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default PaymentMethod;
