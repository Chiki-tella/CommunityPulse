# 📱 CommunityPulse - App Structure

## 🎯 Overview
Complete Android MVP for community issue reporting with Firebase backend.

## 📂 Project Structure

```
CommunityPulse/
├── App.js                          # Main app entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
│
├── src/
│   ├── components/                 # Reusable components
│   │   └── IssueCard.js           # Issue display card
│   │
│   ├── screens/                    # All app screens
│   │   ├── SplashScreen.js        # Launch screen (2s delay)
│   │   ├── WelcomeScreen.js       # Onboarding (3 slides)
│   │   ├── AuthScreen.js          # Login/Signup
│   │   ├── HomeScreen.js          # Community feed
│   │   ├── ReportIssueScreen.js   # Report new issue
│   │   ├── MapScreen.js           # Map with markers
│   │   ├── IssueDetailScreen.js   # Issue details
│   │   └── ProfileScreen.js       # User profile
│   │
│   ├── navigation/
│   │   └── AppNavigator.js        # Stack + Tab navigation
│   │
│   ├── services/
│   │   └── firebase.js            # Firebase initialization
│   │
│   ├── context/
│   │   └── AuthContext.js         # Auth state management
│   │
│   ├── utils/
│   │   └── helpers.js             # Helper functions
│   │
│   ├── constants/
│   │   └── theme.js               # Colors, categories, fonts
│   │
│   └── config/
│       └── firebase.config.js     # Firebase credentials ⚠️ UPDATE THIS
│
└── assets/                         # Images and icons
```

## 🎨 Screens Breakdown

### 1. SplashScreen
- **Purpose**: Brand introduction
- **Duration**: 2 seconds
- **Elements**: Logo (🏘️), app name, tagline
- **Navigation**: Auto → WelcomeScreen

### 2. WelcomeScreen (Onboarding)
- **Purpose**: Explain app features
- **Slides**: 3 slides with swipe
  - Slide 1: Report issues
  - Slide 2: View map
  - Slide 3: Help community
- **Navigation**: Continue → AuthScreen

### 3. AuthScreen
- **Purpose**: User authentication
- **Features**:
  - Toggle between Login/Signup
  - Email + Password fields
  - Name field (signup only)
  - Firebase authentication
- **Navigation**: Success → MainTabs

### 4. HomeScreen (Tab 1)
- **Purpose**: Community feed
- **Features**:
  - Real-time issue list
  - Pull to refresh
  - Issue cards with:
    - Category badge
    - Title & description
    - Image (if available)
    - Location
    - Confirmation count
    - Time posted
  - Floating Action Button (FAB) to report
- **Navigation**: 
  - Tap card → IssueDetailScreen
  - FAB → ReportIssueScreen
  - Profile icon → ProfileScreen

### 5. MapScreen (Tab 2)
- **Purpose**: Geographic visualization
- **Features**:
  - Interactive map (react-native-maps)
  - Color-coded markers by category
  - Category filter buttons
  - Issue counter
  - No API key needed for Android
- **Navigation**: Tap marker → IssueDetailScreen

### 6. ReportIssueScreen (Tab 3)
- **Purpose**: Submit new issue
- **Form Fields**:
  - Title (required)
  - Description (required)
  - Category (required) - 7 options
  - Photo (optional) - from gallery
  - Location (auto-detected)
- **Process**:
  1. Get GPS location
  2. User fills form
  3. Upload image to Firebase Storage
  4. Save issue to Firestore
- **Navigation**: Success → Back to HomeScreen

### 7. ProfileScreen (Tab 4)
- **Purpose**: User dashboard
- **Features**:
  - Profile avatar (first letter)
  - Name & email
  - Statistics:
    - My Reports count
    - Confirmed Issues count
    - Impact Score (calculated)
  - Menu items:
    - My Reports
    - Confirmed Issues
    - Notifications
    - Help & Support
    - About
  - Logout button
- **Navigation**: Logout → AuthScreen

### 8. IssueDetailScreen
- **Purpose**: Full issue information
- **Features**:
  - Large image display
  - Category badge
  - Full description
  - Location name + map preview
  - Reporter name
  - Confirmation counter
  - Confirm button (one per user)
  - Share button
- **Navigation**: Back → Previous screen

## 🎨 Design System

### Colors
```javascript
primary: '#1E3A8A'      // Deep blue
secondary: '#F97316'    // Orange
success: '#10B981'      // Green
background: '#F8FAFC'   // Light gray
white: '#FFFFFF'
text: '#1F2937'         // Dark gray
textLight: '#6B7280'    // Medium gray
border: '#E5E7EB'       // Light border
error: '#EF4444'        // Red
```

### Categories
1. 💧 Water - Blue (#3B82F6)
2. 🛣️ Roads - Orange (#F97316)
3. 🗑️ Waste - Green (#10B981)
4. ⚡ Electricity - Yellow (#FBBF24)
5. 🚨 Safety - Red (#EF4444)
6. 📚 Education - Purple (#8B5CF6)
7. 📋 Other - Gray (#6B7280)

## 🔥 Firebase Structure

### Collections

**users/**
```javascript
{
  uid: "user123",
  name: "John Doe",
  email: "john@example.com",
  createdAt: "2024-01-01T00:00:00.000Z",
  reportsCount: 5,
  confirmationsCount: 12
}
```

**issues/**
```javascript
{
  id: "issue123",
  title: "Broken road near market",
  description: "Large pothole causing problems...",
  category: "roads",
  imageUrl: "https://...",
  location: {
    latitude: 40.7128,
    longitude: -74.0060
  },
  locationName: "New York",
  userId: "user123",
  userName: "John Doe",
  confirmations: 5,
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

**confirmations/**
```javascript
{
  id: "confirm123",
  issueId: "issue123",
  userId: "user456",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### Storage Structure
```
issues/
  ├── 1234567890.jpg
  ├── 1234567891.jpg
  └── ...
```

## 🔐 Permissions Required

### Android (app.json)
- ACCESS_FINE_LOCATION - GPS for issue location
- ACCESS_COARSE_LOCATION - Approximate location
- CAMERA - Take photos
- READ_EXTERNAL_STORAGE - Select photos
- WRITE_EXTERNAL_STORAGE - Save photos

## 🚀 Navigation Flow

```
App Launch
  ↓
SplashScreen (2s)
  ↓
WelcomeScreen (3 slides)
  ↓
AuthScreen (Login/Signup)
  ↓
MainTabs
  ├── HomeScreen
  │     ├→ IssueDetailScreen
  │     └→ ReportIssueScreen
  ├── MapScreen
  │     └→ IssueDetailScreen
  ├── ReportIssueScreen
  └── ProfileScreen
        └→ Logout → AuthScreen
```

## 📦 Key Dependencies

- `firebase` - Backend services
- `@react-navigation/native` - Navigation
- `@react-navigation/bottom-tabs` - Tab navigation
- `@react-navigation/native-stack` - Stack navigation
- `react-native-maps` - Map display
- `expo-image-picker` - Photo selection
- `expo-location` - GPS location

## 🎯 Key Features

✅ Real-time updates (Firestore listeners)
✅ Image upload to cloud storage
✅ GPS location tagging
✅ Category filtering
✅ Issue confirmation system
✅ User statistics tracking
✅ Share functionality
✅ Pull to refresh
✅ Responsive design
✅ Clean, modern UI

## 🔧 Configuration Needed

1. **Firebase Config** (Required)
   - Update `src/config/firebase.config.js`
   - Add your Firebase project credentials

2. **Google Maps API** (Optional)
   - Works without API key on Android
   - Add to `app.json` if you want Google Maps styling

## 📱 Testing Checklist

- [ ] Sign up new user
- [ ] Login existing user
- [ ] Report issue with photo
- [ ] Report issue without photo
- [ ] View issues on map
- [ ] Filter map by category
- [ ] Confirm an issue
- [ ] View issue details
- [ ] Share an issue
- [ ] Check profile stats
- [ ] Logout

## 🎉 Ready to Use!

Just update Firebase config and run `npm start`!
