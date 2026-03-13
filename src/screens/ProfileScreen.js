import { collection, getDocs, query, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, Image } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../services/firebase';

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUserPhoto, updateProfileDetails } = useAuth();
  const [stats, setStats] = useState({
    reportsCount: 0,
    confirmationsCount: 0
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editDistrict, setEditDistrict] = useState(user?.district || '');
  const [editDepartment, setEditDepartment] = useState(user?.department || '');
  const [uploading, setUploading] = useState(false);

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

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need camera roll permissions to update your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `profiles/${user.uid}_${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      
      await updateUserPhoto(downloadURL);
      Alert.alert('Success', 'Profile picture updated successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updates = {
        name: editName,
        district: editDistrict
      };
      if (user.role === 'official') {
        updates.department = editDepartment;
      }
      await updateProfileDetails(updates);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const impactScore = stats.reportsCount * 10 + stats.confirmationsCount * 5;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <TouchableOpacity style={styles.avatarContainer} onPress={handlePickImage} disabled={uploading}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <View style={styles.editAvatarBadge}>
            <Text style={styles.editAvatarIcon}>📷</Text>
          </View>
        </TouchableOpacity>
        
        {isEditing ? (
          <View style={styles.editForm}>
            <TextInput style={styles.input} value={editName} onChangeText={setEditName} placeholder="Full Name" />
            <TextInput style={styles.input} value={editDistrict} onChangeText={setEditDistrict} placeholder="District" />
            {user?.role === 'official' && (
              <TextInput style={styles.input} value={editDepartment} onChangeText={setEditDepartment} placeholder="Department" />
            )}
            <View style={styles.editActions}>
              <TouchableOpacity style={[styles.editBtn, styles.cancelBtn]} onPress={() => setIsEditing(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.editBtn, styles.saveBtn]} onPress={handleSaveProfile}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{user?.name || 'User'}</Text>
              {user?.role === 'official' && user?.isVerified && (
                <Text style={styles.verifiedBadge}>✓</Text>
              )}
            </View>
            <Text style={styles.email}>{user?.email}</Text>
            
            <View style={styles.badgesRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>Role: {user?.role}</Text>
              </View>
              {user?.district && (
                <View style={styles.badge}>
                  <Text style={styles.badgeLabel}>📍 {user?.district}</Text>
                </View>
              )}
            </View>
            {user?.role === 'official' && user?.department && (
              <View style={[styles.badge, { marginTop: 8 }]}>
                <Text style={styles.badgeLabel}>{user?.department}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.editProfileBtn} onPress={() => setIsEditing(true)}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
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
  avatarContainer: {
    position: 'relative',
    marginBottom: 16
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white
  },
  editAvatarIcon: {
    fontSize: 12
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  name: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  verifiedBadge: {
    fontSize: SIZES.md,
    color: COLORS.white,
    backgroundColor: COLORS.success,
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    overflow: 'hidden',
    lineHeight: 20,
    marginLeft: 8
  },
  email: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginBottom: 16
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  badge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  badgeLabel: {
    fontSize: SIZES.xs,
    color: COLORS.text,
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  editProfileBtn: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  editProfileText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: SIZES.sm
  },
  editForm: {
    width: '100%',
    gap: 12
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: SIZES.sm
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8
  },
  editBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelBtn: {
    backgroundColor: COLORS.textLight
  },
  saveBtn: {
    backgroundColor: COLORS.primary
  },
  btnText: {
    color: COLORS.white,
    fontWeight: 'bold'
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
