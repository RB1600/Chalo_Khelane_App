import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CART_ITEMS = [
  {
    id: "c1",
    title: "Puma Football Jersey",
    description: "Minimal wear, works perfectly",
    badges: ["Used", "Good Condition", "Qyt:3"],
    originalPrice: "₹3,999",
    price: "₹800/-",
    qty: 2,
    image: require("../../../assets/Football.png"),
  },
];

const ADDRESS = {
  name: "Rahul Verma",
  line:
    "Flat 402, Green Heights Society, Near City Sports Complex, Baner, Pune, Maharashtra - 411045",
  phone: "+91 98765 43210",
};

const Checkout = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(CART_ITEMS);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((it) =>
          it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
        )
    );
  };

  const productTotal = 800;
  const deliveryFee = 50;
  const total = productTotal + deliveryFee;

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

      <View style={styles.titleWrap}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.subtitle}>Check your gear and proceed</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cart items */}
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemImageWrap}>
              <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemDescription} numberOfLines={1}>
                {item.description}
              </Text>

              <View style={styles.itemBadgeRow}>
                {item.badges.map((b) => (
                  <View key={b} style={styles.itemBadge}>
                    <Text style={styles.itemBadgeText}>{b}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.itemPriceRow}>
                <View style={styles.itemPriceWrap}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    {item.originalPrice && (
                      <Text style={styles.itemOriginalPrice}>{item.originalPrice}</Text>
                    )}
                    <Text style={styles.itemFinalPrice}>{item.price}</Text>
                  </View>
                  <Text style={styles.itemQty}>Qyt : {item.qty}</Text>
                </View>

                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => updateQty(item.id, -1)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="remove" size={16} color="#1F1F1F" />
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => updateQty(item.id, 1)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={16} color="#1F1F1F" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Price Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Price Summary</Text>
          <View style={styles.priceRowLine}>
            <Text style={styles.priceLabel}>Product price</Text>
            <Text style={styles.priceValue}>₹{productTotal}/-</Text>
          </View>
          <View style={styles.priceRowLine}>
            <Text style={styles.priceLabel}>Delivery fee</Text>
            <Text style={styles.priceValue}>₹{deliveryFee}/-</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceRowLine}>
            <Text style={styles.priceTotalLabel}>Total</Text>
            <Text style={styles.priceTotalValue}>₹{total}/-</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.sectionCard}>
          <View style={styles.addressHeaderRow}>
            <Text style={styles.sectionHeading}>Delivery Address</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressName}>{ADDRESS.name}</Text>
          <Text style={styles.addressLine}>{ADDRESS.line}</Text>
          <View style={styles.phoneRow}>
            <Ionicons name="call" size={16} color="#15A765" />
            <Text style={styles.phoneText}>{ADDRESS.phone}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Proceed to Pay */}
      <View
        style={[
          styles.proceedWrap,
          { paddingBottom: (insets.bottom || 0) + 14 },
        ]}
      >
        <TouchableOpacity
          style={styles.proceedBtn}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("PaymentMethod", { total })}
        >
          <Text style={styles.proceedBtnText}>Proceed to Pay</Text>
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
    paddingBottom: 4,
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
  titleWrap: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
  },
  title: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 26,
    color: "#1F1F1F",
  },
  subtitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  // Item card
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 10,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImageWrap: {
    width: 110,
    height: 110,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemContent: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: "space-between",
  },
  itemTitle: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 15,
    color: "#1F1F1F",
  },
  itemDescription: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  itemBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
  },
  itemBadge: {
    backgroundColor: "#E6F7EE",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 4,
  },
  itemBadgeText: {
    fontFamily: "Montserrat_500Medium",
    fontWeight: "500",
    fontSize: 10,
    color: "#15A765",
  },
  itemPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  itemPriceWrap: {
    flex: 1,
  },
  itemOriginalPrice: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 11,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  itemFinalPrice: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 14,
    color: "#1F1F1F",
  },
  itemQty: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    height: 32,
    paddingHorizontal: 4,
  },
  stepperBtn: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 14,
    color: "#1F1F1F",
    minWidth: 18,
    textAlign: "center",
  },

  // Section card
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeading: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 16,
    color: "#1F1F1F",
    marginBottom: 12,
  },

  // Price summary rows
  priceRowLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  priceLabel: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#4B5563",
  },
  priceValue: {
    fontFamily: "Montserrat_500Medium",
    fontWeight: "500",
    fontSize: 14,
    color: "#1F1F1F",
  },
  priceDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 8,
  },
  priceTotalLabel: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 16,
    color: "#1F1F1F",
  },
  priceTotalValue: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 16,
    color: "#1F1F1F",
  },

  // Address card
  addressHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  changeLink: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 14,
    color: "#15A765",
  },
  addressName: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 14,
    color: "#1F1F1F",
    marginBottom: 4,
  },
  addressLine: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  phoneText: {
    fontFamily: "Montserrat_500Medium",
    fontWeight: "500",
    fontSize: 13,
    color: "#1F1F1F",
  },

  // Proceed button
  proceedWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
  },
  proceedBtn: {
    height: 54,
    backgroundColor: "#15A765",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  proceedBtnText: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default Checkout;
