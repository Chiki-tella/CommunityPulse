import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReportIssueScreen from '../screens/ReportIssueScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
                    else if (route.name === 'Report') iconName = focused ? 'add-circle' : 'add-circle-outline';
                    else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2f95dc',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Community Reports' }} />
            <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Issue Map' }} />
            <Tab.Screen name="Report" component={ReportIssueScreen} options={{ title: 'Report Issue' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
        </Tab.Navigator>
    );
}
