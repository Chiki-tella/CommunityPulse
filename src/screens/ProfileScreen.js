import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Ionicons name="person-circle-outline" size={100} color="#ccc" />
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>john.doe@example.com</Text>
            <View style={styles.stats}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Reported</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>45</Text>
                    <Text style={styles.statLabel}>Confirmed</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', paddingTop: 40 },
    name: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
    email: { fontSize: 16, color: 'gray', marginTop: 4 },
    stats: { flexDirection: 'row', marginTop: 40, width: '100%', justifyContent: 'space-evenly' },
    statBox: { alignItems: 'center' },
    statNumber: { fontSize: 24, fontWeight: 'bold', color: '#2f95dc' },
    statLabel: { fontSize: 14, color: '#666' }
});
