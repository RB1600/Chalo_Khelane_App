import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import Website_SERVER_URL from "../../api/api";

const AddNote = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const activityToEdit = route.params?.activity;
  const returnToDaySchedule = route.params?.returnToDaySchedule;
  const currentActivities = route.params?.currentActivities || [];

  const initialDate = activityToEdit?.date || route.params?.selectedDate || new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState(activityToEdit?.title || "");
  const [location, setLocation] = useState(activityToEdit?.location || "");
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(activityToEdit?.time || "");
  const [note, setNote] = useState(activityToEdit?.description || "");
  const [reminder, setReminder] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const searchTimeout = useRef(null);
  const [suggestedTurfs, setSuggestedTurfs] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleLocationChange = (text) => {
    setLocation(text);
    if (!text.trim()) {
      setShowSuggestions(false);
      setSuggestedTurfs([]);
      return;
    }

    setShowSuggestions(true);
    setLocationLoading(true);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(`${Website_SERVER_URL.Wbsite_SERVER_URL}/api/search?query=${encodeURIComponent(text)}`);
        const data = await response.json();
        setSuggestedTurfs(data.turfs || []);
      } catch (error) {
        console.error("Location search error:", error);
      } finally {
        setLocationLoading(false);
      }
    }, 500);
  };

  const selectLocation = (turfName) => {
    setLocation(turfName);
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (!title) return;

    const newNote = {
      id: activityToEdit ? activityToEdit.id : Date.now().toString(),
      title: title,
      sport: activityToEdit ? activityToEdit.sport : "Personal Note",
      time: time || "All Day",
      location: location || "Local",
      date: date,
      type: activityToEdit ? activityToEdit.type : "Personal Note",
      color: activityToEdit ? activityToEdit.color : "#8E8E93",
      tag: activityToEdit ? activityToEdit.tag : "Note",
      description: note
    };

    if (returnToDaySchedule) {
      // Update or add into the current activities list and return to DaySchedule
      const existingIndex = currentActivities.findIndex(item => item.id === newNote.id);
      let updatedActivities;
      if (existingIndex >= 0) {
        updatedActivities = [...currentActivities];
        updatedActivities[existingIndex] = newNote;
      } else {
        updatedActivities = [...currentActivities, newNote];
      }
      navigation.navigate("DaySchedule", { selectedDate: date, updatedActivities });
    } else {
      navigation.navigate("Planner", { newNote: newNote });
    }
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color="#666666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{activityToEdit ? "Edit Note" : "Add Note"}</Text>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Practice at 6AM"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
          />
        </View>

        <View style={[styles.inputGroup, { zIndex: 10 }]}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.autocompleteContainer}>
            <TextInput
              style={styles.input}
              placeholder="E.g. PCA Ground"
              value={location}
              onChangeText={handleLocationChange}
              placeholderTextColor="#999"
              onFocus={() => {
                if (location && suggestedTurfs.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            {showSuggestions && (
              <View style={styles.suggestionsDropdown}>
                {locationLoading ? (
                  <ActivityIndicator size="small" color="#15A765" style={{ padding: 10 }} />
                ) : suggestedTurfs.length > 0 ? (
                  suggestedTurfs.map((turf) => (
                    <TouchableOpacity
                      key={turf._id}
                      style={styles.suggestionItem}
                      onPress={() => selectLocation(turf.name)}
                    >
                      <MaterialIcons name="place" size={20} color="#15A765" />
                      <View style={styles.suggestionTextContainer}>
                        <Text style={styles.suggestionName}>{turf.name}</Text>
                        <Text style={styles.suggestionSub}>{turf.address?.area || turf.address?.city || ""}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noSuggestionText}>No turfs found</Text>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
            <Text style={[styles.inputText, !date && { color: "#999" }]}>{date || "Select date"}</Text>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time</Text>
          <TouchableOpacity style={styles.dateSelector} onPress={() => setShowTimePicker(true)}>
            <Text style={[styles.inputText, !time && { color: "#999" }]}>{time || "Add time"}</Text>
            <MaterialIcons name="access-time" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Note</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add detailed note"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
            textAlignVertical="top"
          />
        </View>

        <Text style={styles.label}>Set Reminder</Text>
        <View style={styles.reminderGroup}>
          <View>
            <Text style={styles.reminderSub}>Switch toggle on</Text>
          </View>
          <Switch
            value={reminder}
            onValueChange={setReminder}
            trackColor={{ false: "#D1D1D6", true: "#15A765" }}
            thumbColor={Platform.OS === "ios" ? "#fff" : reminder ? "#fff" : "#f4f3f4"}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{activityToEdit ? "Update & Continue" : "Save & Continue"}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(date)}
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
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#1A181B",
    marginLeft: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#1A181B",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#433C45",
  },
  inputText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#433C45",
  },
  dateSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textArea: {
    height: 120,
  },
  reminderGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 16,
    padding: 16,
    marginBottom: 40,
  },
  reminderSub: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#8D848F",
  },
  footer: {
    paddingHorizontal: 16,
  },
  saveButton: {
    backgroundColor: "#15A765",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    lineHeight: 16,
    color: "#fff",
  },
  autocompleteContainer: {
    position: 'relative',
    zIndex: 1,
  },
  suggestionsDropdown: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 16,
    marginTop: 4,
    maxHeight: 200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionTextContainer: {
    marginLeft: 10,
  },
  suggestionName: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#1A181B",
  },
  suggestionSub: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#645E66",
  },
  noSuggestionText: {
    padding: 12,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#999",
    textAlign: 'center',
  },
});

export default AddNote;
