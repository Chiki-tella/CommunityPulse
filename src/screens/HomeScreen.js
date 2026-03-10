import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen({ navigation }) {
    // Dummy data for initial display
    const reports = [
        { id: '1', title: 'Pothole on Main St', category: 'Roads', description: 'Deep pothole causing traffic issues', confirmations: 12, image: null },
        { id: '2', title: 'Streetlight out', category: 'Electricity', description: 'Corner of 5th and Madison is completely dark', confirmations: 5, image: null },
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={reports}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {item.image ? (
                            <Image source={{ uri: item.image }} style={styles.thumbnail} />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <Ionicons name="image-outline" size={24} color="gray" />
                            </View>
                        )}
                        <View style={styles.cardContent}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.category}>{item.category}</Text>
                            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                            <View style={styles.stats}>
                                <Ionicons name="people" size={16} color="#2f95dc" />
                                <Text style={styles.confirmations}>{item.confirmations} Confirmations</Text>
                            </View>
                        </View>
                    </View>
                )}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('Report')}
            >
                <Ionicons name="add" size={24} color="white" />
                <Text style={styles.fabText}>Report Issue</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    card: { flexDirection: 'row', backgroundColor: 'white', margin: 10, borderRadius: 8, padding: 10, elevation: 2 },
    thumbnail: { width: 80, height: 80, borderRadius: 4 },
    placeholderImage: { width: 80, height: 80, borderRadius: 4, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
    cardContent: { flex: 1, marginLeft: 10, justifyContent: 'space-between' },
    title: { fontSize: 16, fontWeight: 'bold' },
    category: { fontSize: 12, color: 'white', backgroundColor: '#2f95dc', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
    description: { fontSize: 14, color: '#666', marginTop: 4 },
    stats: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    confirmations: { marginLeft: 4, fontSize: 12, color: '#666' },
    fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#2f95dc', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, elevation: 4 },
    fabText: { color: 'white', fontWeight: 'bold', marginLeft: 8 }
});
