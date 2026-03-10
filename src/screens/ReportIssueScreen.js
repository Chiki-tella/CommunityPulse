import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { collection, addDoc } from 'firebase/firestore'; 
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '../services/firebase';

const CATEGORIES = ['Water', 'Roads', 'Waste', 'Electricity', 'Safety', 'Education', 'Other'];

export default function ReportIssueScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Permission to access location was denied');
            return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        Alert.alert('Location Attached', 'Your current location has been attached to the report.');
    };

    const submitReport = async () => {
        if (!title || !description || !category) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }

        setLoading(true);
        try {
            // Simulate submission since Firebase is not fully configured with real keys yet
            // let imageUrl = null;
            // if (image) {
            //   const response = await fetch(image);
            //   const blob = await response.blob();
            //   const storageRef = ref(storage, `reports/${Date.now()}.jpg`);
            //   await uploadBytes(storageRef, blob);
            //   imageUrl = await getDownloadURL(storageRef);
            // }
            // 
            // await addDoc(collection(db, 'reports'), {
            //   title,
            //   description,
            //   category,
            //   location,
            //   imageUrl,
            //   confirmations: 1,
            //   createdAt: new Date(),
            // });

            // Since dummy credentials are used, we just pretend it succeeds
            setTimeout(() => {
                setLoading(false);
                Alert.alert('Success', 'Report submitted successfully!', [
                    { text: 'OK', onPress: () => navigation.navigate('Home') }
                ]);
            }, 1500);
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.label}>Issue Title *</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Broken water pipe"
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the issue in detail"
                multiline
                numberOfLines={4}
            />

            <Text style={styles.label}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {CATEGORIES.map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.categoryChip, category === cat && styles.categoryChipSelected]}
                        onPress={() => setCategory(cat)}
                    >
                        <Text style={[styles.categoryText, category === cat && styles.categoryTextSelected]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.label}>Attach Photo</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                    <View style={styles.imagePickerContent}>
                        <Ionicons name="camera" size={32} color="gray" />
                        <Text style={styles.imagePickerText}>Tap to add photo</Text>
                    </View>
                )}
            </TouchableOpacity>

            <Text style={styles.label}>Location</Text>
            <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
                <Ionicons name="location" size={20} color={location ? "green" : "#2f95dc"} />
                <Text style={[styles.locationText, location && { color: 'green' }]}>
                    {location ? "Location Attached ✓" : "Attach Current GPS Location"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={submitReport} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>Submit Report</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 20 },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginTop: 12 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
    textArea: { height: 100, textAlignVertical: 'top' },
    categoryScroll: { flexDirection: 'row', marginBottom: 16 },
    categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8 },
    categoryChipSelected: { backgroundColor: '#2f95dc' },
    categoryText: { color: '#333' },
    categoryTextSelected: { color: 'white', fontWeight: 'bold' },
    imagePicker: { height: 150, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, borderStyle: 'dashed', overflow: 'hidden' },
    imagePickerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    imagePickerText: { marginTop: 8, color: 'gray' },
    previewImage: { width: '100%', height: '100%' },
    locationButton: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginTop: 8 },
    locationText: { marginLeft: 8, color: '#2f95dc', fontSize: 16 },
    submitButton: { backgroundColor: '#2f95dc', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30 },
    submitText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
