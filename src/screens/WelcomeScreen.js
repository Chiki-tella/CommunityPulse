import { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    icon: '📢',
    title: 'Report Community Issues',
    description: 'Easily report problems in your neighborhood like broken roads, water shortages, or waste problems.'
  },
  {
    id: 2,
    icon: '🗺️',
    title: 'See Problems on a Map',
    description: 'View reported issues around you and stay informed about your community.'
  },
  {
    id: 3,
    icon: '🤝',
    title: 'Help Your Community Improve',
    description: 'Confirm issues reported by others and help prioritize important problems.'
  }
];

export default function WelcomeScreen({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.replace('Auth');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>{slides[currentSlide].icon}</Text>
        <Text style={styles.title}>{slides[currentSlide].title}</Text>
        <Text style={styles.description}>{slides[currentSlide].description}</Text>
      </View>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentSlide && styles.activeDot
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    fontSize: 100,
    marginBottom: 30
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16
  },
  description: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 24
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: 'bold'
  }
});
