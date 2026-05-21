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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OrderDelivered = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const product = route.params?.product || {
    title: "Puma Football Jersey",
    description: "Minimal wear, works perfectly",
    badges: ["Used", "Good Condition"],
    price: "₹800/-",
    originalPrice: "₹3,999",
    image: require("../../../assets/Football.png"),
  };

  const [rating, setRating] = React.useState(4);

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
        <Text style={styles.headerTitle}>Booking Confirmation</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Confirmation card */}
        <View style={styles.confirmCard}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.confirmTitle}>Order Delivered Successfully</Text>
          <Text style={styles.confirmSubtitle}>
            Your item has been delivered. Enjoy your game!
          </Text>
        </View>

        {/* Product card */}
        <View style={styles.productCard}>
          <View style={styles.productImageWrap}>
            <Image source={product.image} style={styles.productImage} resizeMode="cover" />
          </View>
          <View style={styles.productContent}>
            <Text style={styles.productTitle} numberOfLines={1}>
              {product.title}
            </Text>
            <Text style={styles.productDescription} numberOfLines={1}>
              {product.description}
            </Text>
            <View style={styles.badgeRow}>
              {(product.badges || []).map((b) => (
                <View key={b} style={styles.badge}>
                  <Text style={styles.badgeText}>{b}</Text>
                </View>
              ))}
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceFinal}>{product.price}</Text>
              {product.originalPrice && (
                <Text style={styles.priceOriginal}>{product.originalPrice}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Rating */}
        <Text style={styles.ratingHeading}>How was your experience?</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.7}
              onPress={() => setRating(i)}
              hitSlop={4}
            >
              <Ionicons
                name={i <= rating ? "star" : "star-outline"}
                size={36}
                color={i <= rating ? "#F5B400" : "#D1D5DB"}
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Back to Equipment Store */}
      <View
        style={[
          styles.footerWrap,
          { paddingBottom: (insets.bottom || 0) + 14 },
        ]}
      >
        <TouchableOpacity
          style={styles.backToStoreBtn}
          activeOpacity={0.9}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.backToStoreText}>Back to Equipment Store</Text>
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

  // Confirmation card
  confirmCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    marginBottom: 14,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#15A765",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  confirmTitle: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 18,
    color: "#1F1F1F",
    textAlign: "center",
    marginBottom: 6,
  },
  confirmSubtitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 18,
  },

  // Product card
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 10,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  productImageWrap: {
    width: 96,
    height: 96,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productContent: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: "space-between",
  },
  productTitle: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 15,
    color: "#1F1F1F",
  },
  productDescription: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
  },
  badge: {
    backgroundColor: "#E6F7EE",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 4,
  },
  badgeText: {
    fontFamily: "Montserrat_500Medium",
    fontWeight: "500",
    fontSize: 10,
    color: "#15A765",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  priceFinal: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 16,
    color: "#1F1F1F",
  },
  priceOriginal: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },

  // Rating
  ratingHeading: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 16,
    color: "#1F1F1F",
    textAlign: "center",
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  // Footer
  footerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
  },
  backToStoreBtn: {
    height: 54,
    backgroundColor: "#15A765",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  backToStoreText: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default OrderDelivered;
