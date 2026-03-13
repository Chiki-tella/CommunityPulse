# CommunityPulse - Setup Guide

## 🏘️ About
CommunityPulse is a community reporting platform that allows people to report local problems in their communities so their voices can be heard and issues can be solved.

## ✅ What's Already Done
- ✓ All dependencies installed
- ✓ Complete folder structure created
- ✓ All 8 screens implemented
- ✓ Firebase integration ready
- ✓ Navigation setup complete
- ✓ Authentication system ready
- ✓ Map integration (no API key needed for Android)

## 🚀 Quick Start

### Step 1: Configure Firebase (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "CommunityPulse"
3. Enable these services:
   - **Authentication** → Sign-in method → Enable "Email/Password"
   - **Firestore Database** → Create database → Start in test mode
   - **Storage** → Get started → Start in test mode

4. Get your Firebase config:
   - Project Settings → Scroll down → Click Web icon (</>)
   - Copy the config values

5. Update `src/config/firebase.config.js` with your values:
```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 2: Run the App

```bash
npm start
```

Then:
- Press `a` for Android emulator
- Or scan QR code with Expo Go app on your phone

## 📱 Features Implemented

### 1. Splash Screen ✓
- App logo and tagline
- Auto-navigates to welcome screen

### 2. Welcome/Onboarding (3 slides) ✓
- Report issues
- View map
- Help community

### 3. Authentication ✓
- Email/password login
- Sign up with name
- Firebase authentication

### 4. Home Screen ✓
- Community feed of issues
- Real-time updates
- Issue cards with details
- Floating action button to report

### 5. Report Issue Screen ✓
- Title and description
- Category selection (7 categories)
- Photo upload
- Auto GPS location
- Submit to Firebase

### 6. Map Screen ✓
- Interactive map with markers
- Color-coded by category
- Filter by category
- Tap marker to view details

### 7. Issue Detail Screen ✓
- Full issue information
- Photo display
- Location map
- Confirm issue button
- Share functionality
- Confirmation counter

### 8. Profile Screen ✓
- User info
- Statistics (reports, confirmations, impact score)
- Settings menu
- Logout

## 🎨 Design Features

- ✓ Deep blue primary color (#1E3A8A)
- ✓ Orange accent (#F97316)
- ✓ Clean, modern UI
- ✓ Rounded cards
- ✓ Category icons and colors
- ✓ Bottom tab navigation
- ✓ Responsive design

## 📦 Project Structure

```
src/
├── components/
│   └── IssueCard.js          # Reusable issue card component
├── screens/
│   ├── SplashScreen.js        # App launch screen
│   ├── WelcomeScreen.js       # Onboarding slides
│   ├── AuthScreen.js          # Login/Signup
│   ├── HomeScreen.js          # Community feed
│   ├── ReportIssueScreen.js   # Report new issue
│   ├── MapScreen.js           # Map view
│   ├── IssueDetailScreen.js   # Issue details
│   └── ProfileScreen.js       # User profile
├── navigation/
│   └── AppNavigator.js        # Navigation setup
├── services/
│   └── firebase.js            # Firebase initialization
├── context/
│   └── AuthContext.js         # Authentication state
├── utils/
│   └── helpers.js             # Helper functions
├── constants/
│   └── theme.js               # Colors, categories, fonts
└── config/
    └── firebase.config.js     # Firebase credentials (UPDATE THIS!)
```

## 🔧 Configuration Files

### Firebase Security Rules (Optional but Recommended)

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /issues/{issueId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    match /confirmations/{confirmId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /issues/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

## 📝 Testing the App

1. **Sign Up**: Create a new account
2. **Report Issue**: 
   - Tap the orange + button
   - Fill in title, description
   - Select category
   - Upload photo (optional)
   - Submit
3. **View on Map**: Check the Map tab to see your issue
4. **Confirm Issue**: Tap an issue and confirm it
5. **Check Profile**: View your stats

## 🗺️ About Maps

The app uses `react-native-maps` which works on Android without any API key! The default map provider is used. If you want Google Maps styling later, you can add a Google Maps API key to `app.json`.

## 🔥 Firebase Collections

The app automatically creates these collections:

- **users**: User profiles
- **issues**: Reported issues
- **confirmations**: Issue confirmations

No manual setup needed - they're created on first use!

## 🎯 Categories

- 💧 Water
- 🛣️ Roads
- 🗑️ Waste
- ⚡ Electricity
- 🚨 Safety
- 📚 Education
- 📋 Other

## 🐛 Troubleshooting

**Firebase errors?**
- Make sure you updated `src/config/firebase.config.js`
- Check that Authentication, Firestore, and Storage are enabled

**Map not showing?**
- Maps work by default on Android
- Make sure location permissions are granted

**Image upload failing?**
- Check Storage is enabled in Firebase
- Grant camera/photo permissions

## 📱 Building for Production

```bash
# Build Android APK
npx eas build --platform android --profile preview

# Build for Play Store
npx eas build --platform android --profile production
```

## 🎉 You're All Set!

Just update the Firebase config and run `npm start`. The app is ready to go!

---

**Need help?** Check the Firebase console for any errors in Authentication, Firestore, or Storage.
