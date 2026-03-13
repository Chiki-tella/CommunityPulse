# CommunityPulse Setup Checklist

Use this checklist to ensure everything is configured correctly.

## ✅ Pre-Setup (Already Done)

- [x] Dependencies installed
- [x] Project structure created
- [x] All screens implemented
- [x] Navigation configured
- [x] Authentication system ready
- [x] UI/UX enhanced

## 🔧 Configuration Required

### 1. Firebase Setup

- [ ] Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
- [ ] Get Firebase config (apiKey, authDomain, etc.)
- [ ] Update `src/services/firebase.js` with your config
- [ ] Enable Authentication → Email/Password
- [ ] Create Firestore Database (test mode)
- [ ] Enable Storage (test mode)

**Time Required**: ~5 minutes

### 2. Google Maps Setup (Optional but Recommended)

- [ ] Get Google Maps API key from [console.cloud.google.com](https://console.cloud.google.com/)
- [ ] Enable "Maps SDK for Android"
- [ ] Update `app.json` with your API key (replace `YOUR_GOOGLE_MAPS_API_KEY_HERE`)

**Time Required**: ~3 minutes

### 3. Test the App

- [ ] Run `npm start`
- [ ] Open on Android device or emulator
- [ ] Test welcome screens
- [ ] Test sign up
- [ ] Test login
- [ ] Test report submission
- [ ] Test map view
- [ ] Test profile view

**Time Required**: ~10 minutes

## 📋 Feature Testing Checklist

### Authentication
- [ ] Sign up with new email works
- [ ] Login with existing account works
- [ ] Logout works
- [ ] User stays logged in after app restart

### Report Issue
- [ ] Can enter title and description
- [ ] Can select category
- [ ] "Other" category shows custom input
- [ ] Can select District → Sector → Cell
- [ ] Can add photo from gallery
- [ ] Can attach GPS location
- [ ] Submit button works
- [ ] Report appears in home feed

### Home Screen
- [ ] Shows list of reports
- [ ] Pull-to-refresh works
- [ ] Shows empty state when no reports
- [ ] Displays location info (Cell, Sector, District)
- [ ] Shows confirmation count
- [ ] FAB button navigates to Report screen

### Map Screen
- [ ] Map loads correctly
- [ ] Shows markers for reports with GPS
- [ ] Markers are color-coded by category
- [ ] Tapping marker shows info
- [ ] User location shows (if permission granted)

### Profile Screen
- [ ] Shows user name and email
- [ ] Displays correct report count
- [ ] Displays correct confirmation count
- [ ] Shows community impact section
- [ ] Settings menu items visible
- [ ] Logout button works

## 🎨 Customization Checklist (Optional)

- [ ] Update app name in `app.json`
- [ ] Replace app icon in `assets/images/icon.png`
- [ ] Update splash screen in `assets/images/splash-icon.png`
- [ ] Modify color scheme in `src/constants/Colors.js`
- [ ] Add more districts/sectors if needed
- [ ] Add more issue categories if needed

## 🚀 Deployment Checklist (When Ready)

### Pre-Deployment
- [ ] Test all features thoroughly
- [ ] Update Firebase security rules (production mode)
- [ ] Remove test data from Firestore
- [ ] Update app version in `app.json`
- [ ] Create app icon and splash screen
- [ ] Test on multiple devices

### Build
- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login to Expo: `eas login`
- [ ] Configure build: `eas build:configure`
- [ ] Build APK: `eas build --platform android`

### Publish
- [ ] Create Google Play Console account
- [ ] Prepare store listing (screenshots, description)
- [ ] Upload APK to Google Play
- [ ] Submit for review

## 📝 Documentation Checklist

- [x] `QUICKSTART.md` - Quick setup guide
- [x] `FIREBASE_SETUP.md` - Firebase configuration
- [x] `IMPROVEMENTS.md` - List of changes
- [x] `PROJECT_SUMMARY.md` - Project overview
- [x] `SETUP_CHECKLIST.md` - This file

## ⚠️ Common Issues & Solutions

### Issue: App won't start
**Solution**: 
```bash
npm start -- --clear
```

### Issue: Firebase errors
**Solution**: Check `src/services/firebase.js` config is correct

### Issue: Map not showing
**Solution**: Add Google Maps API key to `app.json`

### Issue: Location permission denied
**Solution**: Grant permissions in device settings

### Issue: Image picker not working
**Solution**: Grant camera/storage permissions

## 🎯 Success Criteria

Your app is ready when:
- ✅ All configuration items checked
- ✅ All feature tests pass
- ✅ No console errors or warnings
- ✅ App runs smoothly on device
- ✅ Firebase services working
- ✅ Users can sign up and report issues

## 📞 Need Help?

1. Check `QUICKSTART.md` for quick solutions
2. Review `FIREBASE_SETUP.md` for Firebase issues
3. Check `IMPROVEMENTS.md` for feature details
4. Review `PROJECT_SUMMARY.md` for overview

---

**Ready to launch? Let's amplify community voices! 📢**
