import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const categoryColors = {
    Water: 'blue',
    Roads: 'gray',
    Waste: 'brown',
    Electricity: 'yellow',
    Safety: 'red',
    Education: 'purple',
    Other: 'green'
};

export default function MapScreen() {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dummy data for markers
    const reports = [
        { id: '1', title: 'Pothole on Main St', category: 'Roads', location: { latitude: 37.78825, longitude: -122.4324 } },
        { id: '2', title: 'Streetlight out', category: 'Electricity', location: { latitude: 37.78925, longitude: -122.4344 } },
    ];

    useEffect(() => {
        (async () => {
            if (Platform.OS === 'web') {
                setLoading(false);
                return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLoading(false);
                return;
            }
            try {
                let loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                });
            } catch (e) {
                console.log(e);
            }
            setLoading(false);
        })();
    }, []);

    if (Platform.OS === 'web') {
        return (
            <View style={styles.webContainer}>
                <Text style={styles.webText}>Maps are not supported on the web version.</Text>
                <Text style={styles.webText}>Please run on an Android device or emulator.</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2f95dc" />
                <Text style={styles.loadingText}>Fetching location...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={location || {
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation
            >
                {reports.map(report => (
                    <Marker
                        key={report.id}
                        coordinate={report.location}
                        title={report.title}
                        description={report.category}
                        pinColor={categoryColors[report.category] || 'red'}
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, color: 'gray' },
    webContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    webText: { fontSize: 16, textAlign: 'center', color: 'gray', marginTop: 10 }
});
