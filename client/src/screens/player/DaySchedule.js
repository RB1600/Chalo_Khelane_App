import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Share,
} from "react-native";
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const parseTime = (timeStr) => {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  }
  return null;
};

const parseTimeRange = (timeStr) => {
  if (!timeStr || timeStr === "All Day") return null;

  const str = timeStr.replace(/–/g, '-').toUpperCase();
  const parts = str.split('-').map(s => s.trim());
  
  if (parts.length === 1) {
    const start = parseTime(parts[0]);
    if (start === null) return null;
    return { start, end: start + 60 };
  } else if (parts.length === 2) {
    let startStr = parts[0];
    let endStr = parts[1];
    
    if (!startStr.includes('AM') && !startStr.includes('PM')) {
      const endPeriod = endStr.includes('PM') ? 'PM' : (endStr.includes('AM') ? 'AM' : '');
      startStr = `${startStr} ${endPeriod}`;
    }
    
    const start = parseTime(startStr);
    const end = parseTime(endStr);
    if (start !== null && end !== null) {
      return { start, end: end <= start ? end + 24 * 60 : end };
    }
  }
  return null;
};

const DaySchedule = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { selectedDate, activities: passedActivities } = route.params || {};

  // Parse date for display
  const displayDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    : "Thursday, 23 April";

  const defaultActivities = passedActivities && passedActivities.length > 0 ? passedActivities : [
    {
      id: "1",
      sport: "Box Cricket",
      title: "Sport Zone",
      time: "3:30 – 5:00 PM",
      location: "Tathawade, Pimpri-Chinchwad...",
      users: "You, Rahul, +7 more.",
      tag: "Group stage",
    },
    {
      id: "2",
      title: "Practice Session",
      time: "3:30 – 5:00 PM",
      location: "Tathawade, Pimpri-Chinchwad...",
      description: "Morning practice at local ground. Focus on batting technique..",
      tag: "Group stage",
    },
  ];

  const [activities, setActivities] = useState(defaultActivities);

  useEffect(() => {
    if (passedActivities && passedActivities.length > 0 && activities.length === defaultActivities.length) {
      setActivities(passedActivities);
    }
  }, []);

  // Handle updated activities returned from AddNote
  useEffect(() => {
    if (route.params?.updatedActivities) {
      setActivities(route.params.updatedActivities);
    }
  }, [route.params?.updatedActivities]);

  const conflicts = React.useMemo(() => {
    const overlapping = [];
    const parsedActivities = activities.map(act => ({
      ...act,
      timeRange: parseTimeRange(act.time)
    }));

    for (let i = 0; i < parsedActivities.length; i++) {
      for (let j = i + 1; j < parsedActivities.length; j++) {
        const act1 = parsedActivities[i];
        const act2 = parsedActivities[j];
        
        if (act1.timeRange && act2.timeRange) {
          if (act1.timeRange.start < act2.timeRange.end && act2.timeRange.start < act1.timeRange.end) {
            overlapping.push({ act1, act2 });
          }
        }
      }
    }
    return overlapping;
  }, [activities]);

  const handleEdit = (item) => {
    navigation.navigate("AddNote", {
      activity: item,
      selectedDate,
      currentActivities: activities,
      returnToDaySchedule: true,
    });
  };

  const handleShare = async (item) => {
    try {
      const message = `${item.title} ${item.sport ? `(${item.sport})` : ''} at ${item.time}. Location: ${item.location || 'Not specified'}`;
      await Share.share({
        message: message,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Delete Activity",
      "Are you sure you want to delete this activity?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setActivities(prev => prev.filter(act => act.id !== item.id));
          }
        }
      ]
    );
  };

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialIcons name="chevron-left" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{displayDate}</Text>
      <Text style={styles.headerSubtitle}>{activities.length} Activities Schedule</Text>
    </View>
  );

  const renderActivityCard = (item) => (
    <View key={item.id} style={styles.activityCard}>
      <View style={styles.cardHeaderRow}>
        <View>
          {item.sport ? (
            <Text style={styles.activitySport}>{item.sport}</Text>
          ) : null}
          <Text style={styles.activityTitle}>{item.title}</Text>
        </View>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="time-outline" size={16} color="#8D848F" />
        <Text style={styles.detailText}>{item.time}</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={16} color="#8D848F" />
        <Text style={styles.detailText}>{item.location}</Text>
      </View>

      {item.users && (
        <View style={styles.detailRow}>
          <Feather name="users" size={16} color="#8D848F" />
          <Text style={styles.detailText}>{item.users}</Text>
        </View>
      )}

      {item.description && (
        <View style={[styles.detailRow, { alignItems: 'flex-start' }]}>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Feather name="edit" size={16} color="#666666" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={() => handleShare(item)}>
          <Ionicons name="share-social-outline" size={16} color="#155DFC" />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
          <Feather name="trash-2" size={16} color="#E7000B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#15A765" />
      {renderHeader()}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activities.map(renderActivityCard)}

        {/* Time Conflict Banner */}
        {conflicts.length > 0 && (
          <View style={styles.conflictBanner}>
            <View style={styles.conflictIconContainer}>
              <Ionicons name="alert-circle-outline" size={20} color="#9F0712" />
            </View>
            <View style={styles.conflictContent}>
              <Text style={styles.conflictTitle}>Time Conflict Detected</Text>
              <Text style={styles.conflictDescription}>
                Your <Text style={styles.conflictBold}>{conflicts[0].act1.title} ({conflicts[0].act1.time})</Text> overlaps with <Text style={styles.conflictBold}>{conflicts[0].act2.title} ({conflicts[0].act2.time})</Text>
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Add Another Activity Button - Sticky Bottom */}
      <View style={[styles.footerContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
        <TouchableOpacity
          style={styles.addActivityButton}
          onPress={() => navigation.navigate("AddNote", {
            selectedDate,
            currentActivities: activities,
            returnToDaySchedule: true,
          })}
        >
          <Feather name="plus" size={20} color="#666666" />
          <Text style={styles.addActivityText}>Add Another Activity</Text>
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
  header: {
    backgroundColor: "#15A765",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  backButton: {
    marginBottom: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#fff",
  },
  scrollContent: {
    padding: 16,
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",

  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  activitySport: {
    fontSize: 10,
    fontFamily: "Montserrat_500Medium",
    color: "#15A765",
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1A181B",
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
    lineHeight: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#645E66",
    marginLeft: 6,
  },
  descriptionText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#645E66",
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#666666",
    marginLeft: 8,
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#155DFC",
    marginLeft: 8,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  conflictBanner: {
    flexDirection: "row",
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FB2C36",
    padding: 16,
    marginBottom: 16,
  },
  conflictIconContainer: {
    marginRight: 8,
  },
  conflictContent: {
    flex: 1,
  },
  conflictTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#9F0712",
    marginBottom: 4,
  },
  conflictDescription: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#C10007",
  },
  conflictBold: {
    fontFamily: "Montserrat_600SemiBold",
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "#fff",
  },
  addActivityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D1D5DC",
    borderRadius: 14,
    borderStyle: "dashed",
    marginBottom: 8,
  },
  addActivityText: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#4A5565",
    lineHeight: 24,
    letterSpacing: -0.31,
    marginLeft: 8,
  },
});

export default DaySchedule;
