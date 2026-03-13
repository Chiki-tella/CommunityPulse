import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { formatTimeAgo, getCategoryIcon } from '../utils/helpers';

export default function IssueCard({ issue, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryIcon}>{getCategoryIcon(issue.category)}</Text>
          <Text style={styles.categoryText}>{issue.category}</Text>
        </View>
        <Text style={styles.time}>{formatTimeAgo(issue.createdAt)}</Text>
      </View>
      
      <Text style={styles.title}>{issue.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{issue.description}</Text>
      
      {issue.imageUrl && (
        <Image source={{ uri: issue.imageUrl }} style={styles.image} />
      )}
      
      <View style={styles.footer}>
        <Text style={styles.location}>📍 {issue.locationName || 'Unknown location'}</Text>
        <View style={styles.confirmations}>
          <Text style={styles.confirmIcon}>✓</Text>
          <Text style={styles.confirmCount}>{issue.confirmations || 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 4
  },
  categoryText: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    textTransform: 'capitalize',
    fontWeight: '500'
  },
  time: {
    fontSize: SIZES.xs,
    color: COLORS.textLight
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4
  },
  description: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginBottom: 12,
    lineHeight: 20
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  location: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    flex: 1
  },
  confirmations: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  confirmIcon: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4
  },
  confirmCount: {
    color: COLORS.success,
    fontSize: SIZES.sm,
    fontWeight: 'bold'
  }
});
