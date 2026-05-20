import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Website_SERVER_URL from '../../api/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SIDEBAR_WIDTH = width * 0.75;

const menuItems = [
    {
        id: 1,
        label: 'My Profile',
        icon: 'person-outline',
        iconLib: 'Ionicons',
        route: 'My Profile',
    },
    {
        id: 2,
        label: 'News',
        icon: 'newspaper-outline',
        iconLib: 'Ionicons',
        route: 'News',
    },
    {
        id: 3,
        label: 'Trainers',
        icon: 'people-circle-outline',
        iconLib: 'Ionicons',
        route: 'FindTrainers',
    },
    {
        id: 4,
        label: 'Browse Job/ My\nApplication',
        icon: 'briefcase-outline',
        iconLib: 'Ionicons',
        route: 'BrowseJobs',
    },
    {
        id: 5,
        label: 'My Orders',
        icon: 'cube-outline',
        iconLib: 'Ionicons',
        route: 'MyBookings',
    },
    {
        id: 6,
        label: 'My Sales',
        icon: 'bar-chart-outline',
        iconLib: 'Ionicons',
        route: 'MySales',
    },
    {
        id: 7,
        label: 'Invitations',
        icon: 'mail-outline',
        iconLib: 'Ionicons',
        route: 'Invitations',
    },
];

const Sidebar = ({ onClose }) => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();

    const handleNavigate = (route) => {
        if (onClose) onClose();

        // Handle cross-stack navigation for specific routes
        if (route === 'Invitations') {
            navigation.navigate('Profile', { screen: 'Invitations' });
        } else if (route === 'My Profile') {
            navigation.navigate('Profile', { screen: 'My Profile' });
        } else {
            navigation.navigate(route);
        }
    };

    const renderIcon = (item) => {
        const size = 24;
        const color = '#FFFFFF';
        return <Ionicons name={item.icon} size={size} color={color} />;
    };

    return (
        <LinearGradient
            colors={['#15A765', '#018348']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Top Action Bar: Close & Translate */}
            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.topBarBtn}
                    onPress={onClose}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.topBarBtn}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="translate" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Profile Section at top */}
            <View style={styles.profileSection}>
                <Image
                    source={
                        user?.profileImage
                            ? {
                                uri: `${Website_SERVER_URL.Wbsite_SERVER_URL}/uploads/${user.profileImage}`,
                            }
                            : require('../../../assets/Profile.png')
                    }
                    style={styles.avatar}
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName} numberOfLines={1}>
                        {user?.name || 'Player'}
                    </Text>
                    <Text style={styles.profileRole} numberOfLines={1}>
                        {user?.role || 'Player'}
                    </Text>
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Menu Items */}
            <ScrollView
                style={styles.menuScroll}
                contentContainerStyle={styles.menuContent}
                showsVerticalScrollIndicator={false}
            >
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.menuItem}
                        activeOpacity={0.7}
                        onPress={() => handleNavigate(item.route)}
                    >
                        <View style={styles.menuIconWrapper}>
                            {renderIcon(item)}
                        </View>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <MaterialIcons
                            name="chevron-right"
                            size={24}
                            color="#FFFFFF"
                            style={styles.chevron}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Bottom version text */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Chalo Khelane v1.0</Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SIDEBAR_WIDTH,
        borderTopLeftRadius: 30,
        overflow: 'hidden',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    topBarBtn: {
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    profileInfo: {
        marginLeft: 10,
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        fontFamily: 'Montserrat_500Medium',
        color: '#FFFFFF',
    },
    profileRole: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#FFFFFF',
        textTransform: 'capitalize',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginHorizontal: 16,
    },
    menuScroll: {
        flex: 1,
    },
    menuContent: {
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    menuIconWrapper: {
        alignItems: 'center',
        marginRight: 14,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Montserrat_500Medium',
        color: '#FFFFFF',
    },
    chevron: {
        marginLeft: 4,
    },
    footer: {
        paddingBottom: 24,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        color: '#FFFFFF',
    },
});

export default Sidebar;
