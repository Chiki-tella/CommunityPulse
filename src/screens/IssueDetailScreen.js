import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { CATEGORIES, COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { formatTimeAgo } from '../utils/helpers';

export default function IssueDetailScreen({ route, navigation }) {
  const { issue } = route.params;
  const { user } = useAuth();
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [confirmCount, setConfirmCount] = useState(issue.confirmations || 0);
  const [issueStatus, setIssueStatus] = useState(issue.status || 'pending');
  const [acknowledgedBy, setAcknowledgedBy] = useState(issue.acknowledgedBy || null);

  useEffect(() => {
    checkIfConfirmed();
  }, []);

  const checkIfConfirmed = async () => {
    const q = query(
      collection(db, 'confirmations'),
      where('issueId', '==', issue.id),
      where('userId', '==', user.uid)
    );
    const snapshot = await getDocs(q);
    setHasConfirmed(!snapshot.empty);
  };

  const handleConfirm = async () => {
    if (hasConfirmed) {
      Alert.alert('Already confirmed', 'You have already confirmed this issue');
      return;
    }

    try {
      await addDoc(collection(db, 'confirmations'), {
        issueId: issue.id,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });

      const newCount = confirmCount + 1;
      await updateDoc(doc(db, 'issues', issue.id), {
        confirmations: newCount
      });

      setConfirmCount(newCount);
      setHasConfirmed(true);
      Alert.alert('Success', 'Issue confirmed!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleOfficialAction = async (status) => {
    try {
      await updateDoc(doc(db, 'issues', issue.id), {
        status: status, // 'received' or 'declined'
        acknowledgedBy: user.name,
        officialId: user.uid
      });
      setIssueStatus(status);
      setAcknowledgedBy(user.name);
      Alert.alert('Success', `Issue marked as ${status}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update issue status');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this community issue: ${issue.title}\n\nLocation: ${issue.locationName}\nCategory: ${issue.category}\n\nHelp make our community better!`
      });
    } catch (error) {
      console.log(error);
    }
  };

  const category = CATEGORIES.find(c => c.id === issue.category);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Text style={styles.shareButton}>Share 📤</Text>
        </TouchableOpacity>
      </View>

      {issue.imageUrl && (
        <Image source={{ uri: issue.imageUrl }} style={styles.image} />
      )}

      <View style={styles.content}>
        <View style={styles.tagsRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>{category?.icon}</Text>
            <Text style={styles.categoryText}>{issue.category}</Text>
          </View>
          {issueStatus !== 'pending' && (
            <View style={[styles.statusBadge, issueStatus === 'received' ? styles.statusReceived : styles.statusDeclined]}>
              <Text style={[styles.statusText, issueStatus === 'received' ? styles.textSuccess : styles.textError]}>
                {issueStatus.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{issue.title}</Text>
        <Text style={styles.time}>{formatTimeAgo(issue.createdAt)}</Text>
        
        {acknowledgedBy && (
          <View style={styles.acknowledgedBox}>
            <Text style={styles.acknowledgedText}>
              {issueStatus === 'received' ? '✅ Received by' : '❌ Declined by'}: Official {acknowledgedBy}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{issue.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.locationText}>📍 {issue.locationName}</Text>
          
          {issue.location && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: issue.location.latitude,
                longitude: issue.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: issue.location.latitude,
                  longitude: issue.location.longitude
                }}
              />
            </MapView>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reporter</Text>
          <Text style={styles.reporterText}>👤 {issue.userName || 'Anonymous'}</Text>
        </View>

        <View style={styles.confirmSection}>
          <View style={styles.confirmInfo}>
            <Text style={styles.confirmCount}>{confirmCount}</Text>
            <Text style={styles.confirmLabel}>Confirmations</Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.confirmButton,
              hasConfirmed && styles.confirmButtonDisabled
            ]}
            onPress={handleConfirm}
            disabled={hasConfirmed}
          >
            <Text style={styles.confirmButtonText}>
              {hasConfirmed ? '✓ Confirmed' : 'Confirm Issue'}
            </Text>
          </TouchableOpacity>
        </View>

        {user?.role === 'official' && user?.isVerified && issueStatus === 'pending' && (
          <View style={styles.officialActions}>
            <Text style={styles.officialActionsTitle}>Official Actions</Text>
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => handleOfficialAction('declined')}
              >
                <Text style={styles.actionButtonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.receiveButton]}
                onPress={() => handleOfficialAction('received')}
              >
                <Text style={styles.actionButtonText}>Receive Issue</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50
  },
  backButton: {
    fontSize: SIZES.md,
    color: COLORS.primary,
    fontWeight: '500'
  },
  shareButton: {
    fontSize: SIZES.md,
    color: COLORS.primary,
    fontWeight: '500'
  },
  image: {
    width: '100%',
    height: 300
  },
  content: {
    padding: 20
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusReceived: {
    backgroundColor: COLORS.success + '20',
  },
  statusDeclined: {
    backgroundColor: COLORS.error + '20',
  },
  statusText: {
    fontSize: SIZES.sm,
    fontWeight: 'bold',
  },
  textSuccess: {
    color: COLORS.success,
  },
  textError: {
    color: COLORS.error,
  },
  acknowledgedBox: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary
  },
  acknowledgedText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '500'
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6
  },
  categoryText: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    textTransform: 'capitalize',
    fontWeight: '600'
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8
  },
  time: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginBottom: 24
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8
  },
  description: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    lineHeight: 24
  },
  locationText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    marginBottom: 12
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden'
  },
  reporterText: {
    fontSize: SIZES.md,
    color: COLORS.text
  },
  confirmSection: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center'
  },
  confirmInfo: {
    alignItems: 'center',
    marginBottom: 16
  },
  confirmCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.success
  },
  confirmLabel: {
    fontSize: SIZES.md,
    color: COLORS.textLight
  },
  confirmButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center'
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.border
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: 'bold'
  },
  officialActions: {
    marginTop: 24,
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 16,
  },
  officialActionsTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center'
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  declineButton: {
    backgroundColor: COLORS.error,
  },
  receiveButton: {
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.md
  }
});
