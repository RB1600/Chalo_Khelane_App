import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator, Alert, SafeAreaView,
  StatusBar, Platform, KeyboardAvoidingView, ScrollView,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API from "../../api/api";
import INVITATIONS from "../../api/invitations";
import DateTimePicker from "@react-native-community/datetimepicker";

// ── Invitation types ──────────────────────────────────────────────────────────
const INVITE_TYPES = [
  {
    key: "play_with_me",
    label: "Play with me",
    description: 'Casual "Play with me" request for any sport',
    icon: "play",
    iconBg: "#EDE9FE",
    iconColor: "#7C3AED",
  },
  {
    key: "turf_match",
    label: "Turf match",
    description: "Invite to join your turf booking/ground match",
    icon: "location",
    iconBg: "#D1FAE5",
    iconColor: "#059669",
  },
  {
    key: "sports_event",
    label: "Sports event",
    description: "Invite a sports event, camp or workshop",
    icon: "calendar",
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
];

// ── Step indicator ────────────────────────────────────────────────────────────
const StepIndicator = ({ current, total }) => (
  <View style={s.stepRow}>
    {Array.from({ length: total }, (_, i) => {
      const stepNum = i + 1;
      const done = stepNum < current;
      const active = stepNum === current;
      return (
        <React.Fragment key={stepNum}>
          {/* Circle */}
          <View
            style={[
              s.stepCircle,
              done && s.stepDone,
              active && s.stepActive,
            ]}
          >
            {done ? (
              <Ionicons name="checkmark" size={13} color="#FFF" />
            ) : (
              <Text style={[s.stepNum, active && s.stepNumActive]}>
                {stepNum}
              </Text>
            )}
          </View>
          {/* Connector */}
          {stepNum < total && (
            <View style={[s.stepLine, done && s.stepLineDone]} />
          )}
        </React.Fragment>
      );
    })}
  </View>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function InvitePlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { tournamentId, tournamentName } = route.params || {};

  const [step, setStep] = useState(1); // 1, 2, 3, or 4
  const [selectedType, setSelectedType] = useState(null);
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]); // Array of player objects
  const [searchTimer, setSearchTimer] = useState(null);

  // Step 3 Form State
  const [title, setTitle] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [personalNote, setPersonalNote] = useState("");

  // Location/Sport Suggestions
  const [suggestedTurfs, setSuggestedTurfs] = useState([]);
  const [showLocSuggestions, setShowLocSuggestions] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [showSportSuggestions, setShowSportSuggestions] = useState(false);

  // Pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const COMMON_SPORTS = ["Cricket", "Football", "Basketball", "Badminton", "Tennis", "Volleyball"];

  useEffect(() => {
    if (tournamentId && user?._id) fetchSentInvitations();
  }, [tournamentId]);

  const fetchSentInvitations = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const res = await axios.get(INVITATIONS.SENT(user._id || user.id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const ids = new Set(
          res.data.invitations
            .filter(
              (inv) =>
                inv.tournamentId?._id === tournamentId ||
                inv.tournamentId === tournamentId
            )
            .map((inv) => inv.receiverId?._id || inv.receiverId)
        );
        setSentIds(ids);
      }
    } catch (_) { }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (searchTimer) clearTimeout(searchTimer);
    if (text.length < 2) { setPlayers([]); return; }
    const timer = setTimeout(() => searchPlayers(text), 400);
    setSearchTimer(timer);
  };

  const handleLocationChange = (text) => {
    setLocation(text);
    if (!text.trim()) {
      setShowLocSuggestions(false);
      setSuggestedTurfs([]);
      return;
    }
    setShowLocSuggestions(true);
    setLocLoading(true);

    if (searchTimer) clearTimeout(searchTimer);
    const timer = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        const res = await axios.get(
          `${API.SERVER_URL}/api/search?query=${encodeURIComponent(text)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuggestedTurfs(res.data.turfs || []);
      } catch (error) {
        console.error("Location search error:", error);
      } finally {
        setLocLoading(false);
      }
    }, 500);
    setSearchTimer(timer);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate.toISOString().split("T")[0]);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
    }
  };

  const searchPlayers = async (query) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const res = await axios.get(
        `${INVITATIONS.SEARCH_PLAYERS}?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setPlayers(res.data.players.filter((p) => p._id !== user?._id));
      }
    } catch (err) {
      console.error("Search error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayerSelection = (player) => {
    const isSelected = selectedPlayers.find((p) => p._id === player._id);
    if (isSelected) {
      setSelectedPlayers((prev) => prev.filter((p) => p._id !== player._id));
    } else {
      setSelectedPlayers((prev) => [...prev, player]);
    }
  };

  const removePlayerTag = (playerId) => {
    setSelectedPlayers((prev) => prev.filter((p) => p._id !== playerId));
  };

  const handleFinalSubmit = async () => {
    setSending(true);
    try {
      const senderId = user?._id || user?.id;
      if (!senderId || selectedPlayers.length === 0) {
        Alert.alert("Error", "Please select at least one player.");
        return;
      }
      const token = await AsyncStorage.getItem("auth_token");

      // Send all selected players in one bulk request
      const receiver_ids = selectedPlayers.map((p) => p._id);
      
      const res = await axios.post(
        INVITATIONS.SEND,
        {
          sender_id: senderId,
          receiver_ids,
          tournament_id: tournamentId || null,
          invitationType: selectedType?.key,
          tournamentName: title,
          sport,
          eventDate: date,
          startTime: time,
          endTime: "", 
          venue: location,
          message: personalNote,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setStep(5);
      }
    } catch (err) {
      Alert.alert("Failed", err.response?.data?.message || err.message);
    } finally {
      setSending(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedType(null);
    setSearch("");
    setPlayers([]);
    setSelectedPlayers([]);
    setTitle("");
    setSport("");
    setDate("");
    setTime("");
    setLocation("");
    setPersonalNote("");
  };

  const getProfileImage = (player) => {
    if (!player.profileImage) return null;
    const img = player.profileImage.replace(/^uploads[\\/]/, "");
    return `${API.SERVER_URL}/uploads/${img}`;
  };

  // ── Step 1 ──────────────────────────────────────────────────────────────────
  const renderStep1 = () => (
    <View style={{ flex: 1 }}>
      <View style={s.stepMeta}>
        <Text style={s.stepMetaLabel}>Step 1 of 4</Text>
        <Text style={s.stepMetaTitle}>Choose invitation type</Text>
      </View>
      <StepIndicator current={1} total={4} />

      <View style={s.typeList}>
        {INVITE_TYPES.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={s.typeCard}
            activeOpacity={0.7}
            onPress={() => {
              setSelectedType(type);
              setStep(2);
            }}
          >
            <View style={[s.typeIconBox, { backgroundColor: type.iconBg }]}>
              <Ionicons name={type.icon} size={22} color={type.iconColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.typeLabel}>{type.label}</Text>
              <Text style={s.typeDesc}>{type.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // ── Step 2 ──────────────────────────────────────────────────────────────────
  const renderPlayer = ({ item }) => {
    const isSelected = selectedPlayers.find((p) => p._id === item._id);
    const profileImg = getProfileImage(item);
    const sportName = item.sport || item.sportsType || item.role || null;
    const locationStr = [item.address?.area, item.address?.city]
      .filter(Boolean)
      .join(", ");

    return (
      <View style={s.playerCard}>
        {/* Avatar */}
        {profileImg ? (
          <Image source={{ uri: profileImg }} style={s.avatar} />
        ) : (
          <View style={s.avatarFallback}>
            <Ionicons name="person-outline" size={22} color="#9CA3AF" />
          </View>
        )}

        {/* Info */}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.playerName}>{item.name}</Text>
          {locationStr ? (
            <Text style={s.playerLocation}>{locationStr}</Text>
          ) : null}
        </View>

        {/* Sport tag */}
        {sportName && (
          <View style={s.sportTag}>
            <Text style={s.sportTagText}>{sportName}</Text>
          </View>
        )}

        {/* Action */}
        {isSelected ? (
          <TouchableOpacity
            style={s.addedPill}
            onPress={() => togglePlayerSelection(item)}
          >
            <Ionicons name="checkmark" size={13} color="#9CA3AF" />
            <Text style={s.addedText}>Added</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={s.inviteBtn}
            onPress={() => togglePlayerSelection(item)}
          >
            <Ionicons name="add" size={14} color="#FFF" />
            <Text style={s.inviteBtnText}>Invite</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderStep2 = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={s.stepMeta}>
        <Text style={s.stepMetaLabel}>Step 2 of 4</Text>
        <Text style={s.stepMetaTitle}>Who do you want to invite?</Text>
      </View>
      <StepIndicator current={2} total={4} />

      {/* Search */}
      <View style={s.searchBox}>
        <Ionicons name="search-outline" size={17} color="#9CA3AF" />
        <TextInput
          style={s.searchInput}
          value={search}
          onChangeText={handleSearch}
          placeholder="Search players by name or sport..."
          placeholderTextColor="#B0B7C3"
          autoFocus
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => { setSearch(""); setPlayers([]); }}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : players.length === 0 && search.length >= 2 ? (
        <View style={s.center}>
          <Ionicons name="people-outline" size={48} color="#D1D5DB" />
          <Text style={s.emptyText}>No players found</Text>
        </View>
      ) : players.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="search-outline" size={44} color="#D1D5DB" />
          <Text style={s.emptyText}>Search players to invite</Text>
          <Text style={s.emptySubText}>Type at least 2 characters</Text>
        </View>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item._id}
          renderItem={renderPlayer}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom Nav */}
      <View style={s.bottomNav}>
        <TouchableOpacity style={s.backCircleBtn} onPress={() => setStep(1)}>
          <Ionicons name="arrow-back" size={20} color="#10B981" />
        </TouchableOpacity>
        <TouchableOpacity
          style={s.nextBtn}
          onPress={() => {
            if (selectedPlayers.length === 0) {
              Alert.alert("No players selected", "Please select at least one player before proceeding.");
              return;
            }
            setStep(3);
          }}
        >
          <Text style={s.nextBtnText}>Next</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  // ── Step 3 ──────────────────────────────────────────────────────────────────
  const renderStep3 = () => (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 120 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.stepMeta}>
        <Text style={s.stepMetaLabel}>Step 3 of 4</Text>
        <Text style={s.stepMetaTitle}>Fill in the details</Text>
      </View>
      <StepIndicator current={3} total={4} />

      {/* Selected Player Tags */}
      <View style={s.tagsContainer}>
        {selectedPlayers.map((p) => (
          <TouchableOpacity
            key={p._id}
            style={s.playerTag}
            onPress={() => removePlayerTag(p._id)}
          >
            <Text style={s.playerTagText}>{p.name}</Text>
            <Ionicons name="close" size={14} color="#3B82F6" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Form Fields */}
      <View style={s.formContainer}>
        <Text style={s.formLabel}>Invitation Type</Text>
        <View style={s.typeDisplay}>
          <Ionicons
            name={selectedType?.icon || "play"}
            size={18}
            color={selectedType?.iconColor || "#7C3AED"}
          />
          <Text style={s.typeDisplayText}>{selectedType?.label || "Play with me"}</Text>
        </View>

        <Text style={s.formLabel}>Invitation Title</Text>
        <TextInput
          style={s.input}
          placeholder="Enter title"
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={s.formLabel}>Sport</Text>
        <View style={{ zIndex: 5 }}>
          <TextInput
            style={s.input}
            placeholder="Search or enter sport"
            placeholderTextColor="#9CA3AF"
            value={sport}
            onChangeText={(text) => {
              setSport(text);
              setShowSportSuggestions(text.length > 0);
            }}
            onFocus={() => setShowSportSuggestions(sport.length > 0)}
          />
          {showSportSuggestions && (
            <View style={s.suggestionsDropdown}>
              {COMMON_SPORTS.filter(s => s.toLowerCase().includes(sport.toLowerCase())).map((item) => (
                <TouchableOpacity
                  key={item}
                  style={s.suggestionItem}
                  onPress={() => { setSport(item); setShowSportSuggestions(false); }}
                >
                  <Text style={s.suggestionName}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={s.formLabel}>Date</Text>
            <TouchableOpacity style={s.input} onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: date ? "#1F2937" : "#9CA3AF" }}>{date || "dd-mm-yyyy"}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.formLabel}>Time</Text>
            <TouchableOpacity style={s.input} onPress={() => setShowTimePicker(true)}>
              <Text style={{ color: time ? "#1F2937" : "#9CA3AF" }}>{time || "00:00 am/pm"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={s.formLabel}>Location/ Venue</Text>
        <View style={{ zIndex: 10 }}>
          <TextInput
            style={s.input}
            placeholder="Search location"
            placeholderTextColor="#9CA3AF"
            value={location}
            onChangeText={handleLocationChange}
            onFocus={() => setShowLocSuggestions(location.length > 0)}
          />
          {showLocSuggestions && (
            <View style={s.suggestionsDropdown}>
              {locLoading ? (
                <ActivityIndicator size="small" color="#10B981" style={{ padding: 10 }} />
              ) : suggestedTurfs.length > 0 ? (
                suggestedTurfs.map((turf) => (
                  <TouchableOpacity
                    key={turf._id}
                    style={s.suggestionItem}
                    onPress={() => { setLocation(turf.name); setShowLocSuggestions(false); }}
                  >
                    <MaterialIcons name="place" size={18} color="#10B981" />
                    <View style={{ marginLeft: 8 }}>
                      <Text style={s.suggestionName}>{turf.name}</Text>
                      <Text style={s.suggestionSub}>{turf.address?.area || turf.address?.city || ""}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={s.noSuggestionText}>No turfs found</Text>
              )}
            </View>
          )}
        </View>

        <Text style={s.formLabel}>Personal Message</Text>
        <TextInput
          style={[s.input, s.textArea]}
          placeholder="Add detailed note"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          value={personalNote}
          onChangeText={setPersonalNote}
          textAlignVertical="top"
        />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date ? new Date(date) : new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onTimeChange}
        />
      )}
    </ScrollView>
  );

  // ── Step 4 ──────────────────────────────────────────────────────────────────
  const renderStep4 = () => (
    <FlatList
      ListHeaderComponent={() => (
        <View style={{ paddingBottom: 120 }}>
          <View style={s.stepMeta}>
            <Text style={s.stepMetaLabel}>Step 4 of 4</Text>
            <Text style={s.stepMetaTitle}>Review your invitation</Text>
          </View>
          <StepIndicator current={4} total={4} />

          {/* Review Card */}
          <View style={s.reviewCard}>
            {/* Header */}
            <View style={[s.reviewHeader, { backgroundColor: "#F5F3FF" }]}>
              <Ionicons
                name={selectedType?.icon || "play"}
                size={16}
                color={selectedType?.iconColor || "#7C3AED"}
              />
              <Text style={[s.reviewHeaderText, { color: selectedType?.iconColor || "#7C3AED" }]}>
                {selectedType?.label || "Play With Me"}
              </Text>
            </View>

            {/* Content */}
            <View style={s.reviewContent}>
              {/* Players List */}
              <View style={s.reviewPlayers}>
                {selectedPlayers.map((p, index) => (
                  <View key={p._id} style={[s.reviewPlayerRow, index !== 0 && { marginTop: -15 }]}>
                    <View style={s.reviewAvatar}>
                      {getProfileImage(p) ? (
                        <Image source={{ uri: getProfileImage(p) }} style={s.reviewAvatarImg} />
                      ) : (
                        <Ionicons name="person" size={20} color="#9CA3AF" />
                      )}
                    </View>
                    <Text style={s.reviewPlayerName}>{p.name}</Text>
                  </View>
                ))}
              </View>

              {/* Title Section */}
              <View style={s.reviewTitleSection}>
                <Text style={s.reviewTitle}>{title || "Play with me - Saturday"}</Text>
                <Text style={s.reviewLabel}>Invitation name</Text>
              </View>

              {/* Date & Time Pills */}
              <View style={s.reviewPillRow}>
                {date ? (
                  <View style={s.reviewPill}>
                    <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                    <Text style={s.reviewPillText}>{date}</Text>
                  </View>
                ) : null}
                {time ? (
                  <View style={s.reviewPill}>
                    <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                    <Text style={s.reviewPillText}>{time}</Text>
                  </View>
                ) : null}
              </View>

              {/* Location Pill */}
              {location ? (
                <View style={[s.reviewPill, { marginTop: 8 }]}>
                  <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                  <Text style={s.reviewPillText}>{location}</Text>
                </View>
              ) : null}

              {/* Message Box */}
              {personalNote ? (
                <View style={s.reviewMsgBox}>
                  <Text style={s.reviewMsgText}>"{personalNote}"</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      )}
      data={[]}
      renderItem={null}
      style={{ flex: 1 }}
    />
  );

  // ── Step 5 ──────────────────────────────────────────────────────────────────
  const renderStep5 = () => (
    <View style={s.successContainer}>
      <View style={s.successCircle}>
        <Ionicons name="checkmark" size={60} color="#FFF" />
      </View>

      <Text style={s.successTitle}>Invitation Sent!</Text>
      <Text style={s.successSub}>Your invitation has been sent</Text>
      <Text style={s.successInfo}>
        You will be notified when they respond to your invitation.
      </Text>

      <View style={s.successActions}>
        <TouchableOpacity
          style={s.viewInvitesBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={s.viewInvitesBtnText}>View all invitations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.sendAnotherBtn}
          onPress={resetFlow}
        >
          <Text style={s.sendAnotherBtnText}>Send another</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.backHomeLink}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={s.backHomeLinkText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStepNav = () => (
    <View style={s.bottomNav}>
      <TouchableOpacity
        style={s.backCircleBtn}
        onPress={() => setStep(step === 4 ? 3 : step - 1)}
      >
        <Ionicons name={step === 4 ? "pencil" : "arrow-back"} size={20} color="#10B981" />
      </TouchableOpacity>
      <TouchableOpacity
        style={s.nextBtn}
        onPress={() => {
          if (step === 3) {
            setStep(4);
          } else if (step === 4) {
            handleFinalSubmit();
          } else {
            setStep(step + 1);
          }
        }}
        disabled={sending}
      >
        {sending ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <>
            {step === 4 && <Ionicons name="paper-plane" size={18} color="#FFF" style={{ marginRight: 8 }} />}
            <Text style={s.nextBtnText}>{step === 4 ? "Send Invitation" : "Next"}</Text>
            {step !== 4 && <Ionicons name="arrow-forward" size={18} color="#FFF" />}
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      {step < 5 && (
        <View style={s.header}>
          <TouchableOpacity
            style={s.headerBack}
            onPress={() => {
              if (step === 1) navigation.goBack();
              else if (step === 4) setStep(3);
              else setStep(step - 1);
            }}
          >
            <Ionicons name="chevron-back" size={22} color="#1F2937" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Send Invitations</Text>
        </View>
      )}

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
      {step >= 2 && step < 5 && renderStepNav()}
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#FFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 6,
  },
  headerBack: { padding: 2 },
  headerTitle: {
    fontSize: 18,
    color: "#1F2937",
    fontFamily: "Montserrat_700Bold"
  },

  // Step meta
  stepMeta: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 4
  },
  stepMetaLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Poppins_600SemiBold"
  },
  stepMetaTitle: {
    fontSize: 20,
    color: "#111827",
    fontFamily: "Montserrat_700Bold"
  },

  // Step indicator
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  stepDone: {
    backgroundColor: "#10B981",
    borderColor: "#10B981"
  },
  stepActive: {
    backgroundColor: "#F97316",
    borderColor: "#FFEDD5",
    borderWidth: 3,
  },
  stepNum: {
    fontSize: 14,
    color: "#D1D5DB",
    fontFamily: "Montserrat_700Bold"
  },
  stepNumActive: {
    color: "#FFF"
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 4
  },
  stepLineDone: {
    backgroundColor: "#10B981"
  },

  // Type list (Step 1)
  typeList: {
    paddingHorizontal: 16
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  typeIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  typeLabel: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 3,
    fontFamily: "Montserrat_700Bold"
  },
  typeDesc: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
    fontFamily: "Poppins_400Regular"
  },

  // Search (Step 2)
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    padding: 0,
    fontFamily: "Poppins_400Regular"
  },

  // Player card
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6"
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  playerName: {
    fontSize: 15,
    color: "#1F2937",
    fontFamily: "Montserrat_600SemiBold"
  },
  playerLocation: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
    fontFamily: "Poppins_400Regular"
  },

  sportTag: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginRight: 8,
  },
  sportTagText: {
    fontSize: 11,
    color: "#1D4ED8",
    fontFamily: "Poppins_600SemiBold"
  },

  inviteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#10B981",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 10,
  },
  inviteBtnText: {
    color: "#FFF",
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold"
  },

  addedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  addedText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontFamily: "Poppins_600SemiBold"
  },

  // Empty states
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 12,
    fontFamily: "Montserrat_600SemiBold"
  },
  emptySubText: {
    fontSize: 12,
    color: "#D1D5DB",
    marginTop: 4,
    fontFamily: "Poppins_400Regular"
  },

  // Bottom nav (Step 2)
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFF",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  backCircleBtn: {
    width: 54,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  nextBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#10B981",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  nextBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold"
  },

  // Step 3 Styles
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  playerTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  playerTagText: {
    fontSize: 13,
    color: "#3B82F6",
    fontFamily: "Poppins_500Medium"
  },

  formContainer: { paddingHorizontal: 16 },
  formLabel: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    marginTop: 16,
    fontFamily: "Montserrat_600SemiBold"
  },
  typeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F5F3FF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  typeDisplayText: {
    fontSize: 14,
    color: "#1F2937",
    fontFamily: "Poppins_500Medium"
  },

  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1F2937",
    fontFamily: "Poppins_400Regular"
  },
  textArea: {
    height: 100,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "Poppins_400Regular"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },

  // Step 4 Styles
  reviewCard: {
    marginHorizontal: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  reviewHeaderText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Montserrat_700Bold",
  },
  reviewContent: {
    padding: 16,
  },
  reviewPlayers: {
    marginBottom: 20,
  },
  reviewPlayerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFF",
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  reviewAvatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  reviewPlayerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    fontFamily: "Montserrat_600SemiBold",
  },
  reviewTitleSection: {
    marginBottom: 16,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Montserrat_700Bold",
  },
  reviewLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
    fontFamily: "Poppins_400Regular",
  },
  reviewPillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  reviewPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reviewPillText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    fontFamily: "Poppins_500Medium",
  },
  reviewMsgBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  reviewMsgText: {
    fontSize: 13,
    color: "#6B7280",
    fontStyle: "italic",
    lineHeight: 20,
    fontFamily: "Poppins_400Regular",
  },

  // Step 5 Success Styles
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    fontFamily: "Montserrat_700Bold",
  },
  successSub: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
    fontFamily: "Poppins_500Medium",
  },
  successInfo: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
    fontFamily: "Poppins_400Regular",
  },
  successActions: {
    width: "100%",
    gap: 16,
  },
  viewInvitesBtn: {
    backgroundColor: "#10B981",
    height: 54,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  viewInvitesBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Montserrat_700Bold",
  },
  sendAnotherBtn: {
    backgroundColor: "#FFF",
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  sendAnotherBtnText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Montserrat_600SemiBold",
  },
  backHomeLink: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  backHomeLinkText: {
    color: "#9CA3AF",
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Poppins_500Medium",
  },

  // Suggestions
  suggestionsDropdown: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    maxHeight: 200,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  suggestionName: {
    fontSize: 14,
    color: "#1F2937",
    fontFamily: "Montserrat_600SemiBold"
  },
  suggestionSub: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Poppins_400Regular"
  },
  noSuggestionText: {
    padding: 12,
    color: "#9CA3AF",
    textAlign: "center",
    fontFamily: "Poppins_400Regular"
  },
});
