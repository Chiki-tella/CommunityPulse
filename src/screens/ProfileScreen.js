import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    reportsCount: 0,
    confirmationsCount: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const reportsQuery = query(
        collection(db, 'issues'),
        where('userId', '==', user.uid)
      );
      const reportsSnapshot = await getDocs(reportsQuery);

      const confirmationsQuery = query(
        collection(db, 'confirmations'),
        where('userId', '==', user.uid)
      );
      const confirmationsSnapshot = await getDocs(confirmationsQuery);

      setStats({
        reportsCount: reportsSnapshot.size,
        confirmationsCount: confirmationsSnapshot.size
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const impactScore = stats.reportsCount * 10 + stats.confirmationsCount * 5;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.reportsCount}</Text>
          <Text style={styles.statLabel}>My Reports</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.confirmationsCount}</Text>
          <Text style={styles.statLabel}>Confirmed Issues</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{impactScore}</Text>
          <Text style={styles.statLabel}>Impact Score</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Activity</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            // Navigate to user's reports
            Alert.alert('Coming Soon', 'This feature will be available soon');
          }}
        >
          <Text style={styles.menuIcon}>📝</Text>
          <Text style={styles.menuText}>My Reports</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            Alert.alert('Coming Soon', 'This feature will be available soon');
          }}
        >
          <Text style={styles.menuIcon}>✓</Text>
          <Text style={styles.menuText}>Confirmed Issues</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            Alert.alert('Coming Soon', 'This feature will be available soon');
          }}
        >
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuText}>Notifications</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            Alert.alert('Coming Soon', 'This feature will be available soon');
          }}
        >
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Help & Support</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            Alert.alert('About', 'CommunityPulse v1.0.0\n\nAmplifying Community Voices');
          }}
        >
          <Text style={styles.menuIcon}>ℹ️</Text>
          <Text style={styles.menuText}>About</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>CommunityPulse v1.0.0</Text>
        <Text style={styles.footerSubtext}>Making communities better together</Text>
      </View>
    </ScrollView>
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
    elevation: 3
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  profileCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white
  },
  name: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4
  },
  email: {
    fontSize: SIZES.md,
    color: COLORS.textLight
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statValue: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4
  },
  statLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    textAlign: 'center'
  },
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24
  },
  menuText: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.textLight
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: 'bold'
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20
  },
  footerText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginBottom: 4
  },
  footerSubtext: {
    fontSize: SIZES.xs,
    color: COLORS.textLight
  }
});
