import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { db } from '../services/firebase';

export default function AdminScreen() {
  const [pendingOfficials, setPendingOfficials] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPendingOfficials();
  }, []);

  const fetchPendingOfficials = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'official'),
        where('isVerified', '==', false)
      );
      const snapshot = await getDocs(q);
      const officials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPendingOfficials(officials);
    } catch (error) {
      console.error('Error fetching pending officials:', error);
      Alert.alert('Error', 'Failed to load pending officials');
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPendingOfficials();
  };

  const approveOfficial = async (userId, userEmail, userName) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isVerified: true
      });
      
      Alert.alert(
        'Success', 
        `${userName} has been approved as an official. Do you want to notify them via email?`,
        [
          { text: 'No', onPress: () => fetchPendingOfficials() },
          { 
            text: 'Yes, Send Email', 
            onPress: () => {
              const subject = encodeURIComponent('CommunityPulse: Official Account Approved!');
              const body = encodeURIComponent(`Hello ${userName},\n\nYour CommunityPulse official account has been approved by an administrator! You can now log in and start receiving issues.\n\nThank you for serving the community.`);
              Linking.openURL(`mailto:${userEmail}?subject=${subject}&body=${body}`);
              fetchPendingOfficials();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error approving official:', error);
      Alert.alert('Error', 'Failed to approve official');
    }
  };

  const renderOfficialCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{item.department}</Text>
        </View>
        <Text style={styles.district}>District: {item.district}</Text>
      </View>
      <TouchableOpacity 
        style={styles.approveButton}
        onPress={() => approveOfficial(item.id, item.email, item.name)}
      >
        <Text style={styles.approveButtonText}>Approve</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Pending Official Approvals</Text>
      </View>

      <FlatList
        data={pendingOfficials}
        keyExtractor={(item) => item.id}
        renderItem={renderOfficialCard}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✓</Text>
            <Text style={styles.emptyText}>All Caught Up!</Text>
            <Text style={styles.emptySubtext}>No pending official approvals.</Text>
          </View>
        }
      />
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
    marginBottom: 8
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
  list: {
    padding: 16
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardInfo: {
    flex: 1,
    marginRight: 16
  },
  name: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4
  },
  email: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginBottom: 8
  },
  badgeContainer: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4
  },
  badgeText: {
    color: COLORS.white,
    fontSize: SIZES.xs,
    fontWeight: 'bold'
  },
  district: {
    fontSize: SIZES.xs,
    color: COLORS.textLight
  },
  approveButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  approveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.sm
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
    color: COLORS.success
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
  }
});
