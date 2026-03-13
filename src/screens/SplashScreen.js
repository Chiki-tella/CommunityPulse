import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🏘️</Text>
      <Text style={styles.title}>CommunityPulse</Text>
      <Text style={styles.tagline}>Amplifying Community Voices</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    fontSize: 80,
    marginBottom: 20
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8
  },
  tagline: {
    fontSize: SIZES.md,
    color: COLORS.white,
    opacity: 0.9
  }
});
