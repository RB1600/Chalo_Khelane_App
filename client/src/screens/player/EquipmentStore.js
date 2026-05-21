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
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const SPORT_FILTERS = [
  { key: "All", label: "All" },
  { key: "Donate", label: "Donate" },
  { key: "Football", label: "Football" },
  { key: "Badminton", label: "Badminton" },
  { key: "Basketball", label: "Basketball" },
  { key: "Cricket", label: "Cricket" },
  { key: "Tennis", label: "Tennis" },
];

const PRODUCTS = [
  {
    id: "p1",
    title: "Puma Football Jersey",
    description: "Minimal wear, works perfectly",
    detailDescription:
      "Lightly used jersey with breathable fabric and a comfortable fit. Ideal for matches and training sessions.",
    badges: ["Used", "Good Condition"],
    detailBadges: ["Breathable", "Sweat Resistant", "Qyt :2"],
    originalPrice: "₹3,999",
    price: "₹800/-",
    qty: 2,
    sport: "Football",
    brand: "Puma",
    size: "Medium",
    seller: { name: "Rahul Verma", subtitle: "Verified Player", avatar: null },
    image: require("../../../assets/Football.png"),
    favorited: true,
  },
  {
    id: "p2",
    title: "Wilson Pickleball Kit",
    description: "Almost new, rarely used",
    isKit: true,
    detailTitle: "Pickleball Kit (Head)",
    detailDescription:
      "Lightly used pickleball kit with minimal wear. Professionally inspected by INOX and ready for play.",
    badges: ["Lightly Used", "Ready to Play"],
    kitFeatures: ["2 Paddles", "3 Pickleballs", "Kit bag"],
    originalPrice: "₹3,999",
    price: "₹800/-",
    qty: 2,
    rating: 4.5,
    sport: "Tennis",
    brand: "Head",
    size: "Standard",
    productDetails: [
      { label: "Brand", value: "Head" },
      { label: "Material", value: "Graphite + Polymer Core" },
      { label: "Grip Size", value: "Standard" },
      { label: "Weight", value: "Lightweight" },
      { label: "Condition", value: "Like New" },
      { label: "Usage", value: "2-3 months" },
      { label: "Warranty", value: "INOX Assured warranty" },
    ],
    seller: { name: "Rahul Verma", subtitle: "Verified Player", avatar: null },
    image: require("../../../assets/TT.png"),
    favorited: false,
  },
  {
    id: "p3",
    title: "Nike Football Boots",
    description: "Lightly used, well-maintained gear",
    detailDescription:
      "Well-maintained Nike football boots. Lightly used and donated to a fellow player in need.",
    badges: ["For Donation", "Good Condition"],
    detailBadges: ["For Donation", "Good Condition"],
    price: "Free",
    qty: 1,
    sport: "Football",
    brand: "Nike",
    size: "UK 9",
    seller: { name: "Amit Sharma", subtitle: "Verified Player", avatar: null },
    image: require("../../../assets/Football.png"),
    favorited: false,
  },
  {
    id: "p4",
    title: "Cricket Kit",
    description: "Good grip and performance",
    isKit: true,
    detailTitle: "Cricket Kit (CA PRO)",
    detailDescription:
      "Complete cricket kit with bat, pads and gloves. Good grip, excellent performance and inspected by INOX.",
    badges: ["Used", "Good Condition"],
    kitFeatures: ["Bat", "Pads", "Gloves"],
    originalPrice: "₹5,999",
    price: "₹2,500/-",
    qty: 1,
    rating: 4.6,
    sport: "Cricket",
    brand: "CA",
    size: "Senior",
    productDetails: [
      { label: "Brand", value: "CA" },
      { label: "Material", value: "English Willow" },
      { label: "Grip Size", value: "Standard" },
      { label: "Weight", value: "Medium" },
      { label: "Condition", value: "Like New" },
      { label: "Usage", value: "1 season" },
      { label: "Warranty", value: "INOX Assured warranty" },
    ],
    seller: { name: "Vikram Patel", subtitle: "Verified Player", avatar: null },
    image: require("../../../assets/Cricket.png"),
    favorited: false,
  },
];

const EquipmentStore = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [activeSport, setActiveSport] = useState("All");
  const [favorites, setFavorites] = useState(
    PRODUCTS.reduce((acc, p) => ({ ...acc, [p.id]: p.favorited }), {})
  );
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const toggleFavorite = (id) =>
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAddToCart = (id) => {
    setCartCount((c) => c + 1);
  };

  const visibleProducts = PRODUCTS.filter((p) => {
    if (activeSport !== "All" && activeSport !== "Donate" && p.sport !== activeSport)
      return false;
    if (activeSport === "Donate" && !p.badges.includes("For Donation")) return false;
    const q = search.trim().toLowerCase();
    if (q) {
      const haystack = [p.title, p.description, p.sport].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Equipment Store</Text>
        <TouchableOpacity
          style={styles.headerIconBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Player Profile")}
        >
          <Ionicons name="person-outline" size={22} color="#1F1F1F" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: cartCount > 0 ? 120 : 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Promo banner */}
        <ImageBackground
          source={require("../../../assets/equipment-banner.png")}
          style={styles.banner}
          imageStyle={styles.bannerImageStyle}
          resizeMode="cover"
        >
          {/* Sports equipment occupies left ~40% of the asset, text overlays the right side */}
          <View style={styles.bannerSpacer} />
          <View style={styles.bannerTextWrap}>
            <Text style={styles.bannerTitle}>Play More. Earn More.</Text>
            <Text style={styles.bannerSubtitle}>
              Book games, join matches, and{"\n"}unlock exciting rewards.
            </Text>
            <TouchableOpacity style={styles.bookNowBtn} activeOpacity={0.85}>
              <Text style={styles.bookNowText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sports, turfs or players"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.searchDivider} />
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="mic-outline" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Sport filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {SPORT_FILTERS.map((f) => {
            const active = activeSport === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.chip, active && styles.chipActive]}
                activeOpacity={0.85}
                onPress={() => setActiveSport(f.key)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Products */}
        <View style={styles.productList}>
          {visibleProducts.map((p) => {
            const fav = !!favorites[p.id];
            const isFree = p.price === "Free";
            return (
              <TouchableOpacity
                key={p.id}
                style={styles.productCard}
                activeOpacity={0.9}
                onPress={() => setSelectedProduct(p)}
              >
                <View style={styles.productImageWrap}>
                  <Image source={p.image} style={styles.productImage} resizeMode="cover" />
                </View>

                <View style={styles.productContent}>
                  <View style={styles.productTopRow}>
                    <Text style={styles.productTitle} numberOfLines={1}>
                      {p.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => toggleFavorite(p.id)}
                      activeOpacity={0.7}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={fav ? "heart" : "heart-outline"}
                        size={22}
                        color={fav ? "#EF3F3F" : "#D1D5DB"}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.productDesc} numberOfLines={1}>
                    {p.description}
                  </Text>

                  <View style={styles.badgeRow}>
                    {p.badges.map((b) => (
                      <View key={b} style={styles.badge}>
                        <Text style={styles.badgeText}>{b}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.priceRow}>
                    <View style={styles.priceTextWrap}>
                      {p.originalPrice && (
                        <Text style={styles.priceOriginal}>{p.originalPrice}</Text>
                      )}
                      <Text style={[styles.priceFinal, isFree && styles.priceFree]}>
                        {p.price}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addBtn}
                      activeOpacity={0.85}
                      onPress={() => handleAddToCart(p.id)}
                    >
                      <Ionicons name="add" size={18} color="#FFFFFF" />
                      <Text style={styles.addBtnText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Product detail modal */}
      <Modal
        visible={!!selectedProduct}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSelectedProduct(null)}
        >
          <Pressable
            style={[styles.modalSheet, { paddingTop: insets.top + 60 }]}
            onPress={(e) => e.stopPropagation && e.stopPropagation()}
          >
            <TouchableOpacity
              style={[styles.modalCloseBtn, { top: insets.top + 12 }]}
              onPress={() => setSelectedProduct(null)}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={22} color="#1F1F1F" />
            </TouchableOpacity>

            {selectedProduct && (
              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={{ paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
              >
                {/* Product image */}
                <View style={styles.modalImageWrap}>
                  <Image
                    source={selectedProduct.image}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                  {selectedProduct.isKit ? (
                    <View style={styles.modalRatingBadge}>
                      <Ionicons name="star" size={14} color="#F5B400" />
                      <Text style={styles.modalRatingText}>
                        {selectedProduct.rating?.toFixed(1) || "4.5"}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.modalDots}>
                      <View style={[styles.modalDot, styles.modalDotActive]} />
                      <View style={styles.modalDot} />
                      <View style={styles.modalDot} />
                    </View>
                  )}
                </View>

                {/* Verified badge + heart */}
                <View style={styles.modalVerifiedRow}>
                  <View style={styles.modalVerifiedLeft}>
                    <Ionicons name="checkmark-circle" size={20} color="#15A765" />
                    <Text style={styles.modalVerifiedText}>INOX Verified</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(selectedProduct.id)}
                    activeOpacity={0.7}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={favorites[selectedProduct.id] ? "heart" : "heart-outline"}
                      size={26}
                      color={favorites[selectedProduct.id] ? "#EF3F3F" : "#D1D5DB"}
                    />
                  </TouchableOpacity>
                </View>

                {selectedProduct.isKit ? (
                  <>
                    {/* Kit layout */}
                    <Text style={styles.modalTitle}>
                      {selectedProduct.detailTitle || selectedProduct.title}
                    </Text>

                    {/* Feature pills (gray) */}
                    <View style={styles.modalBadgeRow}>
                      {(selectedProduct.kitFeatures || []).map((b) => (
                        <View key={b} style={styles.modalGrayBadge}>
                          <Text style={styles.modalGrayBadgeText}>{b}</Text>
                        </View>
                      ))}
                    </View>

                    <Text style={styles.modalDescription}>
                      {selectedProduct.detailDescription || selectedProduct.description}
                    </Text>

                    <View style={styles.modalPriceRow}>
                      {selectedProduct.originalPrice && (
                        <Text style={styles.modalOriginalPrice}>
                          {selectedProduct.originalPrice}
                        </Text>
                      )}
                      <Text style={styles.modalFinalPrice}>{selectedProduct.price}</Text>
                    </View>
                    <Text style={styles.modalQty}>Qyt : {selectedProduct.qty}</Text>

                    {/* Product Details table */}
                    <Text style={styles.modalSectionHeading}>Product Details</Text>
                    <View style={styles.detailsTable}>
                      {(selectedProduct.productDetails || []).map((row) => (
                        <View key={row.label} style={styles.detailsRow}>
                          <Text style={styles.detailsLabel}>{row.label}:</Text>
                          <Text style={styles.detailsValue}>{row.value}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Delivery */}
                    <View style={styles.modalDeliveryBlock}>
                      <Text style={styles.modalDeliveryTitle}>Delivered by INOX</Text>
                      <Text style={styles.modalDeliveryBody}>3–5 days delivery</Text>
                    </View>

                    {/* Seller */}
                    <View style={styles.modalSellerRow}>
                      <View style={styles.modalSellerAvatar}>
                        <Ionicons name="person" size={26} color="#9CA3AF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.modalSellerName}>
                          {selectedProduct.seller?.name || "—"}
                        </Text>
                        <Text style={styles.modalSellerSubtitle}>
                          {selectedProduct.seller?.subtitle || ""}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    {/* Default layout (jersey-style) */}
                    <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                    <Text style={styles.modalDescription}>
                      {selectedProduct.detailDescription || selectedProduct.description}
                    </Text>

                    <View style={styles.modalPriceRow}>
                      {selectedProduct.originalPrice && (
                        <Text style={styles.modalOriginalPrice}>
                          {selectedProduct.originalPrice}
                        </Text>
                      )}
                      <Text style={styles.modalFinalPrice}>{selectedProduct.price}</Text>
                    </View>
                    <Text style={styles.modalQty}>Qyt : {selectedProduct.qty}</Text>

                    <View style={styles.modalSellerRow}>
                      <View style={styles.modalSellerAvatar}>
                        <Ionicons name="person" size={26} color="#9CA3AF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.modalSellerName}>
                          {selectedProduct.seller?.name || "—"}
                        </Text>
                        <Text style={styles.modalSellerSubtitle}>
                          {selectedProduct.seller?.subtitle || ""}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.modalBadgeRow}>
                      {(selectedProduct.detailBadges || []).map((b) => (
                        <View key={b} style={styles.modalBadge}>
                          <Text style={styles.modalBadgeText}>{b}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.modalInfoRow}>
                      <View style={styles.modalInfoCard}>
                        <Text style={styles.modalInfoLabel}>Brand</Text>
                        <Text style={styles.modalInfoValue}>{selectedProduct.brand}</Text>
                      </View>
                      <View style={styles.modalInfoCard}>
                        <Text style={styles.modalInfoLabel}>Size</Text>
                        <Text style={styles.modalInfoValue}>{selectedProduct.size}</Text>
                      </View>
                    </View>

                    <View style={styles.modalDeliveryRow}>
                      <Ionicons name="car-outline" size={26} color="#15A765" />
                      <View style={{ marginLeft: 12 }}>
                        <Text style={styles.modalDeliveryTitle}>Delivered by INOX</Text>
                        <Text style={styles.modalDeliveryBody}>3–5 days delivery</Text>
                      </View>
                    </View>
                  </>
                )}
              </ScrollView>
            )}

            {/* Buy Now button */}
            <View
              style={[
                styles.modalBuyWrap,
                { paddingBottom: (insets.bottom || 0) + 14 },
              ]}
            >
              <TouchableOpacity
                style={styles.modalBuyBtn}
                activeOpacity={0.9}
                onPress={() => {
                  if (selectedProduct) handleAddToCart(selectedProduct.id);
                  setSelectedProduct(null);
                  navigation.navigate("Checkout");
                }}
              >
                <Text style={styles.modalBuyBtnText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Cart snackbar */}
      {cartCount > 0 && (
        <View
          pointerEvents="box-none"
          style={[styles.cartSnackbarWrap, { bottom: (insets.bottom || 0) + 92 }]}
        >
          <TouchableOpacity
            style={styles.cartSnackbar}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Checkout")}
          >
            <View style={styles.cartSnackbarLeftWrap}>
              <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
              <Text style={styles.cartSnackbarText}>
                {cartCount} {cartCount === 1 ? "Item" : "Items"} added
              </Text>
            </View>
            <View style={styles.cartSnackbarRightWrap}>
              <Text style={styles.cartSnackbarText}>View Cart</Text>
              <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
      )}
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: "Montserrat_500Medium",
    fontWeight: "500",
    fontSize: 18,
    color: "#1F1F1F",
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  // Promo banner
  banner: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 6,
    minHeight: 160,
    overflow: "hidden",
    borderRadius: 18,
  },
  bannerImageStyle: {
    borderRadius: 18,
  },
  bannerSpacer: {
    width: "38%",
  },
  bannerTextWrap: {
    flex: 1,
    paddingRight: 14,
    paddingVertical: 16,
    justifyContent: "center",
  },
  bannerTitle: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 17,
    color: "#1F1F1F",
  },
  bannerSubtitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    color: "#4B5563",
    marginTop: 4,
    lineHeight: 17,
  },
  bookNowBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 22,
    marginTop: 10,
  },
  bookNowText: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 13,
    color: "#1F1F1F",
  },

  // Search bar
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#1F1F1F",
    paddingVertical: 0,
  },
  searchDivider: {
    width: 1,
    height: 22,
    backgroundColor: "#E5E7EB",
  },

  // Chips
  chipsRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 18,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#E6F7EE",
    borderColor: "#E6F7EE",
  },
  chipText: {
    fontFamily: "Montserrat_500Medium",
    fontWeight: "500",
    fontSize: 13,
    color: "#6B7280",
  },
  chipTextActive: {
    color: "#15A765",
  },

  // Products
  productList: {
    paddingHorizontal: 16,
    gap: 14,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImageWrap: {
    width: 110,
    height: 110,
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
  productTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productTitle: {
    flex: 1,
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 15,
    color: "#1F1F1F",
    paddingRight: 8,
  },
  productDesc: {
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
    justifyContent: "space-between",
    marginTop: 8,
  },
  priceTextWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  priceOriginal: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  priceFinal: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 15,
    color: "#1F1F1F",
  },
  priceFree: {
    fontSize: 16,
    color: "#1F1F1F",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#15A765",
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    gap: 4,
  },
  addBtnText: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 13,
    color: "#FFFFFF",
  },

  // Cart snackbar
  cartSnackbarWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    alignItems: "stretch",
  },
  cartSnackbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#15A765",
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  cartSnackbarLeftWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cartSnackbarRightWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cartSnackbarText: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 15,
    color: "#FFFFFF",
  },

  // ── Product detail modal ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(58, 58, 58, 0.55)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  modalCloseBtn: {
    position: "absolute",
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  modalScroll: {
    paddingHorizontal: 18,
  },
  modalImageWrap: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    height: 360,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  modalImage: {
    width: "80%",
    height: "85%",
  },
  modalDots: {
    position: "absolute",
    bottom: 14,
    flexDirection: "row",
    alignSelf: "center",
    gap: 6,
  },
  modalDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  modalDotActive: {
    backgroundColor: "#FFFFFF",
    width: 9,
    height: 9,
  },
  modalVerifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  modalVerifiedLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  modalVerifiedText: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 14,
    color: "#15A765",
  },
  modalTitle: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 22,
    color: "#1F1F1F",
    marginTop: 6,
  },
  modalDescription: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginTop: 8,
  },
  modalPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  modalOriginalPrice: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  modalFinalPrice: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 20,
    color: "#1F1F1F",
  },
  modalQty: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  modalSellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  modalSellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  modalSellerAvatarImg: {
    width: "100%",
    height: "100%",
  },
  modalSellerName: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 16,
    color: "#1F1F1F",
  },
  modalSellerSubtitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  modalBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  modalBadge: {
    backgroundColor: "#E6F7EE",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 4,
  },
  modalBadgeText: {
    fontFamily: "Montserrat_500Medium",
    fontWeight: "500",
    fontSize: 13,
    color: "#15A765",
  },
  modalInfoRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalInfoCard: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  modalInfoLabel: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 16,
    color: "#1F1F1F",
  },
  modalInfoValue: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  modalDeliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  modalDeliveryTitle: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 16,
    color: "#1F1F1F",
  },
  modalDeliveryBody: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  modalBuyWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
  },
  modalBuyBtn: {
    height: 56,
    backgroundColor: "#15A765",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBuyBtnText: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    fontSize: 17,
    color: "#FFFFFF",
  },

  // Kit-variant modal
  modalRatingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modalRatingText: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 13,
    color: "#1F1F1F",
  },
  modalGrayBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 4,
  },
  modalGrayBadgeText: {
    fontFamily: "Montserrat_500Medium",
    fontWeight: "500",
    fontSize: 12,
    color: "#4B5563",
  },
  modalSectionHeading: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
    fontSize: 17,
    color: "#1F1F1F",
    marginTop: 20,
    marginBottom: 10,
  },
  detailsTable: {
    gap: 8,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsLabel: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#1F1F1F",
    width: 130,
  },
  detailsValue: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#1F1F1F",
    flex: 1,
  },
  modalDeliveryBlock: {
    marginTop: 18,
  },
});

export default EquipmentStore;
