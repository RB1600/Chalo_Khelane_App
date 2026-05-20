import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";

const { width } = Dimensions.get("window");

const Planner = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const [activeRole, setActiveRole] = useState("All");
  const [activeView, setActiveView] = useState("Month"); // List, Week, Month
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const roles = ["All", "Player", "Umpire", "Coach", "Organizer"];
  const views = ["Month", "Week", "List"];

  const [activitiesList, setActivitiesList] = useState([
    {
      id: "1",
      title: "Sport Zone Arena",
      sport: "Box Cricket",
      time: "3:30 – 5:00 PM",
      location: "Tathawade, Pune",
      date: "2026-05-04",
      type: "Turf Booking",
      color: "#34C759",
      tag: "Match"
    },
    {
      id: "2",
      title: "Elite Soccer Turf",
      sport: "Football",
      time: "7:00 – 8:30 PM",
      location: "Wakad, Pune",
      date: "2026-05-05",
      type: "Practice Session",
      color: "#AF52DE",
      tag: "Practice"
    },
    {
      id: "3",
      title: "Umpire Briefing",
      sport: "Cricket",
      time: "10:00 – 11:30 AM",
      location: "PCA Ground",
      date: "2026-05-05",
      type: "Umpire Duty",
      color: "#007AFF",
      tag: "Meeting"
    },
    {
      id: "4",
      title: "Quarter Finals",
      sport: "Tennis",
      time: "4:00 – 6:00 PM",
      location: "Club House",
      date: "2026-05-08",
      type: "Match Scheduled",
      color: "#FFCC00",
      tag: "Tournament"
    },
    {
      id: "5",
      title: "Personal Fitness",
      sport: "Gym",
      time: "06:00 – 07:30 AM",
      location: "Gold Gym",
      date: "2026-05-12",
      type: "Personal Note",
      color: "#8E8E93",
      tag: "Fitness"
    },
    {
      id: "6",
      title: "Coach Strategy Meeting",
      sport: "Football",
      time: "08:00 PM",
      location: "Office",
      date: "2026-05-04",
      type: "Coach",
      color: "#FF9500",
      tag: "Strategy"
    }
  ]);

  useEffect(() => {
    if (route.params?.newNote) {
      setActivitiesList(prev => {
        const existingIndex = prev.findIndex(item => item.id === route.params.newNote.id);
        if (existingIndex >= 0) {
          const updatedList = [...prev];
          updatedList[existingIndex] = route.params.newNote;
          return updatedList;
        } else {
          return [...prev, route.params.newNote];
        }
      });
      // Clear the param so it doesn't trigger again on subsequent renders
      navigation.setParams({ newNote: undefined });
    }
  }, [route.params?.newNote]);

  const activityTypes = [
    { label: "Turf Booking", color: "#34C759" },
    { label: "Practice Session", color: "#CB30E0" },
    { label: "Match Scheduled", color: "#FFCC00" },
    { label: "Tournament", color: "#FF8D28" },
    { label: "Umpire Duty", color: "#0088FF" },
    { label: "Personal Note", color: "#AEAEB2" },
  ];

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="chevron-left" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerTitleRow}>
        <Text style={styles.headerTitle}>My Planner</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddNote", { selectedDate })}>
          <MaterialIcons name="add" size={24} color="#666666" />
        </TouchableOpacity>
      </View>

      <Text style={styles.headerSubtitle}>Stay on top of your games & plans</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>05</Text>
          <Text style={styles.summaryLabel}>Activities</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>01</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>03</Text>
          <Text style={styles.summaryLabel}>This Week</Text>
        </View>
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filterSection}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleScroll}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role}
            style={[styles.roleTag, activeRole === role && styles.activeRoleTag]}
            onPress={() => setActiveRole(role)}
          >
            <Text style={[styles.roleTagText, activeRole === role && styles.activeRoleTagText]}>{role}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.viewTabs}>
        {views.map((view) => (
          <TouchableOpacity
            key={view}
            style={[styles.viewTab, activeView === view && styles.activeViewTab]}
            onPress={() => setActiveView(view)}
          >
            <Text style={[styles.viewTabText, activeView === view && styles.activeViewTabText]}>{view}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderListView = () => {
    // Filter activities by selected date and active role
    const filteredActivities = activitiesList.filter(item => {
      const isCorrectDate = item.date === selectedDate;
      if (activeRole === "All") return isCorrectDate;
      return isCorrectDate && item.type.includes(activeRole);
    });

    return (
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.dateHeader}>{selectedDate}</Text>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.activityCard,
                activeView === "List" && styles.listActivityCard
              ]}
            >
              {activeView === "List" && (
                <View style={[styles.listTypeIndicator, { backgroundColor: item.color }]} />
              )}

              <View style={styles.activityInfo}>
                <View style={styles.activityHeader}>
                  <Text style={[styles.activitySport, { color: "#15A765" }]}>{item.sport}</Text>
                  {activeView !== "List" && (
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagText}>{item.tag || "Group stage"}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.activityTitle}>{item.title}</Text>

                <View style={styles.activityDetailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color="#8D848F" />
                    <Text style={styles.detailText}>{item.time}</Text>
                  </View>
                  {activeView !== "List" && (
                    <View style={[styles.detailItem, { marginLeft: 16 }]}>
                      <Ionicons name="location-outline" size={16} color="#8D848F" />
                      <Text style={styles.detailText} numberOfLines={1}>{item.location}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No activities for this date</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderMonthView = () => {
    // Merge selection and activity markers
    const markedDates = activitiesList.reduce((acc, item) => {
      acc[item.date] = { marked: true, dotColor: item.color };
      return acc;
    }, {});

    // Add selection styling (solid green circle)
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#15A765',
      selectedTextColor: '#ffffff'
    };

    return (
      <ScrollView style={styles.content}>
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => {
              if (selectedDate === day.dateString) {
                const dayActivities = activitiesList.filter(item => item.date === day.dateString);
                if (dayActivities.length > 0) {
                  navigation.navigate("DaySchedule", { selectedDate: day.dateString, activities: dayActivities });
                }
              } else {
                setSelectedDate(day.dateString);
              }
            }}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6bcbf',
              selectedDayBackgroundColor: '#15A765',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#15A765',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#15A765',
              selectedDotColor: '#ffffff',
              arrowColor: '#666',
              monthTextColor: '#1A181B',
              textDayFontFamily: 'Montserrat_500Medium',
              textMonthFontFamily: 'Montserrat_500Medium',
              textDayHeaderFontFamily: 'Montserrat_500Medium',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 12,
              'stylesheet.day.basic': {
                selected: {
                  backgroundColor: '#15A765',
                  borderRadius: 20,
                },
                selectedText: {
                  color: '#ffffff',
                }
              }
            }}
          />
        </View>

        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Activity Type</Text>
          <View style={styles.legendGrid}>
            {activityTypes.map((type) => (
              <View key={type.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: type.color }]} />
                <Text style={styles.legendLabel}>{type.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderWeekView = () => {
    const current = new Date(selectedDate);
    const dayOfWeek = current.getDay(); // 0 (Sun) to 6 (Sat)
    const sunday = new Date(current);
    sunday.setDate(current.getDate() - dayOfWeek);

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      const dateString = d.toISOString().split("T")[0];
      return {
        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
        date: d.getDate().toString().padStart(2, "0"),
        fullDate: dateString,
        active: dateString === selectedDate
      };
    });

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.weekStripContainer}>
          <View style={styles.weekStrip}>
            {days.map((d) => (
              <TouchableOpacity
                key={d.fullDate}
                style={[styles.weekDay, d.active && styles.activeWeekDay]}
                onPress={() => setSelectedDate(d.fullDate)}
              >
                <Text style={[styles.weekDayName, d.active && styles.activeWeekDayText]}>{d.day}</Text>
                <Text style={[styles.weekDayNumber, d.active && styles.activeWeekDayText]}>{d.date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {renderListView()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilters()}
      {activeView === "List" && renderListView()}
      {activeView === "Month" && renderMonthView()}
      {activeView === "Week" && renderWeekView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#15A765",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
  },
  addButton: {
    borderRadius: 27,
    padding: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#fff",
    marginBottom: 16,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#FCFCFD",
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#EEF1FA",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1A181B",
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#666666",
    marginTop: 4,
  },
  filterSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  roleScroll: {
    paddingBottom: 16,
  },
  roleTag: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: "#F7F7F7",
    marginRight: 10,
  },
  activeRoleTag: {
    backgroundColor: "#E8F7F0",
  },
  roleTagText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#8D848F",
  },
  activeRoleTagText: {
    color: "#15A765",
  },
  viewTabs: {
    flexDirection: "row",
    backgroundColor: "#F7F7F7",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 30,
    padding: 4,
    marginBottom: 16,
  },
  viewTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 30,
  },
  activeViewTab: {
    backgroundColor: "#15A765",
  },
  viewTabText: {
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    color: "#1A181B",
  },
  activeViewTabText: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dateHeader: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#554E56",
    marginBottom: 8,
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    padding: 10,
    borderColor: "#EFEFEF",
    flexDirection: "row",
    overflow: "hidden",
  },
  listActivityCard: {
    padding: 10,
    paddingLeft: 0,
  },
  listTypeIndicator: {
    width: 6,
    height: "100%",
    borderRadius: 8,
    marginRight: 14,
    marginLeft: 12,
    alignSelf: "center",
  },
  activityInfo: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activitySport: {
    fontSize: 10,
    fontFamily: "Montserrat_500Medium",
  },
  tagBadge: {
    backgroundColor: "#E7F7DD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 60,
  },
  tagText: {
    fontSize: 10,
    fontFamily: "Poppins_400Regular",
    color: "#645E66",

  },
  activityTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1A181B",
    marginBottom: 8,
  },
  activityDetailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#645E66",
    marginLeft: 6,
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  legendContainer: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    padding: 16,
    marginBottom: 40,
  },
  legendTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#38343B",
    marginBottom: 10,
  },
  legendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 4,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 60,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#3E3840",
  },
  weekStripContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  weekStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    padding: 4,
  },
  weekDay: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12.79,
    borderRadius: 11,
  },
  activeWeekDay: {
    backgroundColor: "#E7F7DD",
  },
  weekDayName: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#007AFF",
    lineHeight: 14,
    marginBottom: 4,
    textTransform: "capitalize",
  },
  weekDayNumber: {
    fontSize: 18,
    fontFamily: "Montserrat_500Medium",
    color: "#1A181B",
    lineHeight: 16,
  },
  activeWeekDayText: {
    // Keep colors same as non-active but could adjust if needed
  },
  emptyContainer: {
    paddingTop: 90,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#666666",
  },
});

export default Planner;
