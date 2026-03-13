// CommunityPulse Theme
export const COLORS = {
  primary: '#1E3A8A', // Deep blue
  secondary: '#F97316', // Orange accent
  success: '#10B981', // Green
  background: '#F8FAFC',
  white: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  
  // Category colors
  water: '#3B82F6',
  roads: '#F97316',
  waste: '#10B981',
  electricity: '#FBBF24',
  safety: '#EF4444',
  education: '#8B5CF6',
  other: '#6B7280'
};

export const CATEGORIES = [
  { id: 'water', label: 'Water', icon: '💧', color: COLORS.water },
  { id: 'roads', label: 'Roads', icon: '🛣️', color: COLORS.roads },
  { id: 'waste', label: 'Waste', icon: '🗑️', color: COLORS.waste },
  { id: 'electricity', label: 'Electricity', icon: '⚡', color: COLORS.electricity },
  { id: 'safety', label: 'Safety', icon: '🚨', color: COLORS.safety },
  { id: 'education', label: 'Education', icon: '📚', color: COLORS.education },
  { id: 'other', label: 'Other', icon: '📋', color: COLORS.other }
];

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System'
};

export const SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32
};
