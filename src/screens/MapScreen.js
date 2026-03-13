import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { CATEGORIES, COLORS, SIZES } from '../constants/theme';
import { db } from '../services/firebase';

export default function MapScreen({ navigation }) {
  const [issues, setIssues] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });

  useEffect(() => {
    const q = query(collection(db, 'issues'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issuesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(issue => issue.location);
      
      setIssues(issuesData);
      
      if (issuesData.length > 0) {
        setRegion({
          latitude: issuesData[0].location.latitude,
          longitude: issuesData[0].location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredIssues = selectedCategory
    ? issues.filter(issue => issue.category === selectedCategory)
    : issues;

  const getCategoryColor = (category) => {
    const cat = CATEGORIES.find(c => c.id === category);
    return cat?.color || COLORS.primary;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Map</Text>
        <Text style={styles.headerSubtitle}>{filteredIssues.length} issues</Text>
      </View>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {filteredIssues.map((issue) => (
          <Marker
            key={issue.id}
            coordinate={{
              latitude: issue.location.latitude,
              longitude: issue.location.longitude
            }}
            pinColor={getCategoryColor(issue.category)}
            onPress={() => navigation.navigate('IssueDetail', { issue })}
          >
            <View style={[styles.marker, { backgroundColor: getCategoryColor(issue.category) }]}>
              <Text style={styles.markerText}>
                {CATEGORIES.find(c => c.id === issue.category)?.icon || '📋'}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              !selectedCategory && styles.filterButtonActive
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[
              styles.filterButtonText,
              !selectedCategory && styles.filterButtonTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterButton,
                selectedCategory === cat.id && styles.filterButtonActive,
                selectedCategory === cat.id && { backgroundColor: cat.color }
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={styles.filterIcon}>{cat.icon}</Text>
              <Text style={[
                styles.filterButtonText,
                selectedCategory === cat.id && styles.filterButtonTextActive
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  headerSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2
  },
  map: {
    flex: 1
  },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white
  },
  markerText: {
    fontSize: 16
  },
  filterContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 16
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6
  },
  filterButtonText: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    fontWeight: '500'
  },
  filterButtonTextActive: {
    color: COLORS.white
  }
});
