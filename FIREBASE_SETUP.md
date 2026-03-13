# Firebase Setup Guide for CommunityPulse

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `CommunityPulse`
4. Follow the setup wizard

## Step 2: Register Your Android App

1. In Firebase Console, click the Android icon
2. Enter your Android package name (from `app.json`)
3. Download `google-services.json`
4. Place it in your project root (optional for Expo)

## Step 3: Get Your Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click on your web app or create one
4. Copy the `firebaseConfig` object

## Step 4: Update Firebase Configuration

Open `src/services/firebase.js` and replace the placeholder config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 5: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get Started"
3. Enable "Email/Password" sign-in method

## Step 6: Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Start in "Test mode" (for development)
4. Choose a location close to your users

## Step 7: Enable Storage

1. Go to "Storage"
2. Click "Get Started"
3. Start in "Test mode" (for development)

## Step 8: Set Up Security Rules (Production)

### Firestore Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{reportId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### Storage Rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reports/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 9: Test Your Setup

Run your app:
```bash
npm start
```

Try:
1. Sign up with a new account
2. Report an issue with a photo
3. View it on the map and home screen

## Troubleshooting

- If authentication fails, check your Firebase config
- If images don't upload, verify Storage is enabled
- If data doesn't save, check Firestore rules
- For location issues, ensure permissions are granted on device

## Google Maps Setup (for MapScreen)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Maps SDK for Android"
3. Create an API key
4. Add it to `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```
