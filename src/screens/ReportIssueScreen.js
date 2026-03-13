import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CATEGORIES, COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../services/firebase';

export default function ReportIssueScreen({ navigation }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const address = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude
    });

    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      name: address[0]?.city || address[0]?.region || 'Unknown location'
    });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera roll permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `issues/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    if (!title || !description || !category) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      await addDoc(collection(db, 'issues'), {
        title,
        description,
        category,
        imageUrl,
        location: location ? {
          latitude: location.latitude,
          longitude: location.longitude
        } : null,
        locationName: location?.name || 'Unknown',
        userId: user.uid,
        userName: user.name || 'Anonymous',
        confirmations: 0,
        createdAt: new Date().toISOString()
      });

      Alert.alert('Success', 'Issue reported successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Issue</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Issue Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Broken road near market"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the issue in detail..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  category === cat.id && { 
                    backgroundColor: cat.color,
                    borderColor: cat.color
                  }
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[
                  styles.categoryLabel,
                  category === cat.id && { color: COLORS.white }
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Photo (Optional)</Text>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>📷</Text>
                <Text style={styles.imagePlaceholderText}>Tap to upload photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.locationBox}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>
              {location ? location.name : 'Getting location...'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Text>
        </TouchableOpacity>
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
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  backButton: {
    fontSize: SIZES.md,
    color: COLORS.primary,
    fontWeight: '500'
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text
  },
  form: {
    padding: 20
  },
  inputContainer: {
    marginBottom: 24
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: SIZES.md,
    color: COLORS.text
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    marginBottom: 8
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 6
  },
  categoryLabel: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    fontWeight: '500'
  },
  imageButton: {
    borderRadius: 12,
    overflow: 'hidden'
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12
  },
  imagePlaceholder: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imagePlaceholderIcon: {
    fontSize: 40,
    marginBottom: 8
  },
  imagePlaceholderText: {
    fontSize: SIZES.md,
    color: COLORS.textLight
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 8
  },
  locationText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    flex: 1
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  submitButtonDisabled: {
    opacity: 0.6
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: 'bold'
  }
});
