# CommunityPulse 🌍

CommunityPulse is a community issue reporting platform that empowers people in local communities to report problems in their area so their voices can be heard.

This project is an MVP (Minimum Viable Product) built as an Android mobile app using React Native, Expo, and Firebase.

## 🚀 Features

- **Home Feed:** View a list of recently reported issues with thumbnails and confirmation counts.
- **Report an Issue:** Easily submit a report by providing a title, description, category, photo (via device camera/gallery), and GPS location.
- **Issue Map:** View all community reports on an interactive map. Markers are color-coded based on the issue category.
- **User Profile:** A simple profile screen displaying user statistics such as total issues reported and confirmed.
- **Firebase Integration:** Ready to connect to Firebase for authentication, Firestore database, and Cloud Storage.

## 🛠️ Technology Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Navigation:** [React Navigation](https://reactnavigation.org/) (Bottom Tabs)
- **Maps:** `react-native-maps` for Google Maps integration
- **Device Sensors:** `expo-image-picker` (Photos) and `expo-location` (GPS Tracking)
- **Backend:** Firebase (Auth, Firestore, Storage)

## 📦 Project Structure

The codebase is organized inside the `src/` directory to keep things structured and scalable.

```
cp/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens (Home, Map, ReportIssue, Profile)
│   ├── navigation/       # React Navigation setup (AppNavigator.js)
│   ├── services/         # External services (firebase.js)
│   ├── context/          # React Context API (Global State)
│   └── utils/            # Helper functions
├── App.js                # App entry point
├── app.json              # Expo configuration
└── package.json          # Project dependencies
```

## ⚙️ Getting Started

Follow these steps to run the application on your local machine.

### Prerequisites

- Node.js installed
- Android Studio (for emulator testing) or physical Android device with the **Expo Go** app.

### 1. Install Dependencies

Clone the repository and install the required npm packages:

```bash
npm install
```

### 2. Configure Firebase

Before running the application, you need to configure your Firebase credentials.
Open `src/services/firebase.js` and ensure your Firebase keys are correctly set up. 

### 3. Start the Application

Run the Expo development server:

```bash
npm start
```

#### Running on a Device
1. Install the **Expo Go** app on your Android device from the Play Store.
2. Ensure your phone and development machine are on the same Wi-Fi network.
3. Scan the QR code displayed in the terminal using the Expo Go app.

#### Running on an Emulator
1. Open Android Studio and launch your Android Virtual Device (AVD).
2. In the terminal running `npm start`, press `a` to open the app in the Android emulator.

## ⚠️ Known Limitations (MVP)

- Authentication logic and real database connections are currently mocked or set up as a skeleton. Full Firebase rules and authentication components will need to be wired up for production use.
- The Map View relies on internal React Native code and **is not supported on Web**. It must be run on an Android/iOS device or emulator.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
