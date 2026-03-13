import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    orderBy,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';

export const createIssue = async (issueData, imageUri, userId) => {
  try {
    let imageUrl = null;

    // Upload image if provided
    if (imageUri) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = `issues/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Create issue document
    const issueRef = await addDoc(collection(db, 'issues'), {
      ...issueData,
      imageUrl,
      userId,
      confirmations: 0,
      createdAt: new Date().toISOString(),
      status: 'open'
    });

    // Update user's report count
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      reportsCount: increment(1)
    });

    return issueRef.id;
  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
};

export const getIssues = async () => {
  try {
    const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting issues:', error);
    throw error;
  }
};

export const getIssueById = async (issueId) => {
  try {
    const docRef = doc(db, 'issues', issueId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting issue:', error);
    throw error;
  }
};

export const confirmIssue = async (issueId, userId) => {
  try {
    // Check if user already confirmed
    const confirmationsRef = collection(db, 'confirmations');
    const q = query(
      confirmationsRef, 
      where('issueId', '==', issueId),
      where('userId', '==', userId)
    );
    const existingConfirmation = await getDocs(q);

    if (!existingConfirmation.empty) {
      throw new Error('You have already confirmed this issue');
    }

    // Add confirmation
    await addDoc(confirmationsRef, {
      issueId,
      userId,
      createdAt: new Date().toISOString()
    });

    // Update issue confirmation count
    const issueRef = doc(db, 'issues', issueId);
    await updateDoc(issueRef, {
      confirmations: increment(1)
    });

    // Update user's confirmation count
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      confirmationsCount: increment(1)
    });

    return true;
  } catch (error) {
    console.error('Error confirming issue:', error);
    throw error;
  }
};

export const getUserIssues = async (userId) => {
  try {
    const q = query(
      collection(db, 'issues'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user issues:', error);
    throw error;
  }
};
