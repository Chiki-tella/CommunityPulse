import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IssueCard from '../components/IssueCard';
import { COLORS, SIZES } from '../constants/theme';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('myArea'); // 'myArea' or 'all'

  useEffect(() => {
    let q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let issuesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // In-memory filtering (could also be done via compound queries if indexed)
      if (user?.role === 'official') {
        // Officials only see their department
        issuesData = issuesData.filter(issue => issue.category === user.department);
      } else {
        // Citizens can toggle filtering
        if (filterType === 'myArea' && user?.district) {
          // Fallback location.district matching if locationName isn't used perfectly
          // or if the issue stores locationName as something else. For our purposes, 
          // we assume issue.district must match user.district if implemented, but Since 
          // "ReportIssueScreen" uses reverse geocoding, we might struggle to precisely string match.
          // Let's filter conservatively. If an issue has a District field we'd match that, 
          // but for now let's just use `locationName` roughly containing district.
          issuesData = issuesData.filter(issue => 
            issue.locationName?.toLowerCase().includes(user.district.toLowerCase()) || 
            issue.district === user.district
          );
        }
      }

      setIssues(issuesData);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [filterType, user]);

  const onRefresh = () => {
    setRefreshing(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <View>
            <Text style={styles.headerTitle}>CommunityPulse</Text>
            <Text style={styles.headerSubtitle}>
              {user?.role === 'official' ? `${user?.department} Issues` : 'Community Feed'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {user?.role === 'citizen' && (
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterButton, filterType === 'myArea' && styles.filterButtonActive]}
              onPress={() => setFilterType('myArea')}
            >
              <Text style={[styles.filterText, filterType === 'myArea' && styles.filterTextActive]}>My Area ({user?.district})</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
              onPress={() => setFilterType('all')}
            >
              <Text style={[styles.filterText, filterType === 'all' && styles.filterTextActive]}>Country</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={issues}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IssueCard 
            issue={item} 
            onPress={() => navigation.navigate('IssueDetail', { issue: item })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📢</Text>
            <Text style={styles.emptyText}>No issues reported yet</Text>
            <Text style={styles.emptySubtext}>Be the first to report an issue!</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('ReportIssue')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
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
    zIndex: 10
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 4
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6
  },
  filterButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  filterText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    fontWeight: '500'
  },
  filterTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold'
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
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileIcon: {
    fontSize: 20
  },
  list: {
    padding: 16
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16
  },
  emptyText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: SIZES.md,
    color: COLORS.textLight
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  fabText: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: 'bold'
  }
});
