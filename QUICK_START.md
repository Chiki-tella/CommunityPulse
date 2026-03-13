# 🚀 CommunityPulse - Quick Start

## ✅ Current Status
- ✓ All dependencies installed
- ✓ All 8 screens created
- ✓ Navigation configured
- ✓ Firebase integration ready
- ⚠️ **NEXT STEP: Configure Firebase credentials**

## 🔥 Configure Firebase (5 minutes)

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "CommunityPulse"
4. Continue through setup (Google Analytics optional)

### 2. Enable Services

**Authentication:**
- Click "Authentication" in left menu
- Click "Get started"
- Go to "Sign-in method" tab
- Enable "Email/Password"

**Firestore Database:**
- Click "Firestore Database" in left menu
- Click "Create database"
- Select "Start in test mode"
- Choose location closest to you
- Click "Enable"

**Storage:**
- Click "Storage" in left menu
- Click "Get started"
- Start in test mode
- Click "Done"

### 3. Get Your Config

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register app (nickname: "CommunityPulse Web")
6. Copy the `firebaseConfig` object

### 4. Update Config File

Open `src/config/firebase.config.js` and replace with your values:

```javascript
export const firebaseConfig = {
  apiKey: "AIza...",  // Your actual API key
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 🏃 Run the App

```bash
npm start
```

Then press:
- `a` for Android emulator
- Or scan QR code with Expo Go app

## 📱 Test the App

1. **Sign Up**: Create account with email/password
2. **Report Issue**: Tap orange + button, fill form, submit
3. **View Map**: Check Map tab to see your issue
4. **Confirm**: Tap an issue and confirm it
5. **Profile**: View your stats

## 🎯 That's It!

Your app is ready to use. No Google Maps API key needed for Android!

---

**Having issues?** Make sure:
- Firebase config is updated in `src/config/firebase.config.js`
- Authentication, Firestore, and Storage are enabled in Firebase Console
- You're running `npm start` from the project root
