export const COLORS = {
  // Primary - Modern Vibrant Teal (Tech-forward & Fresh)
  primary: '#06B6D4',
  primaryDark: '#0891B2',
  primaryLight: '#CFFAFE',
  primaryVeryLight: '#ECFDF5',
  
  // Secondary - Deep Navy (Trustworthy & Professional)
  secondary: '#1F2937',
  secondaryLight: '#E5E7EB',
  secondaryVeryLight: '#F3F4F6',
  
  // Accent - Vibrant Rose/Pink (Modern Appeal)
  accent: '#EC4899',
  accentLight: '#FBF4FA',
  accentVeryLight: '#FDF2F8',
  
  // Tertiary - Warm Sunset Orange (Engagement)
  tertiary: '#F97316',
  tertiaryLight: '#FEF3C7',
  tertiaryVeryLight: '#FFFBEB',
  
  // Semantic colors - Vibrant & Clear
  success: '#10B981',
  successLight: '#D1FAE5',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F97316',
  warningLight: '#FFEDD5',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  
  // Backgrounds - Clean & Modern
  background: '#FFFFFF',
  surface: '#F9FAFB',
  surfaceLight: '#F3F4F6',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(6, 182, 212, 0.1)',
  
  // Text colors - Clear Hierarchy
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  placeholder: '#D1D5DB',
  border: '#E5E7EB',
  divider: '#F3F4F6',
  
  // Dark mode - Modern Dark Theme
  darkBg: '#111827',
  darkSurface: '#1F2937',
  darkSurfaceLight: '#374151',
  darkText: '#F9FAFB',
  darkTextSecondary: '#D1D5DB',
  darkBorder: '#4B5563',
  darkDivider: '#374151',
  
  // Gradient accents
  gradientStart: '#06B6D4',
  gradientEnd: '#1F2937',
  
  // Legacy support
  green: '#06B6D4',
  red: '#EF4444',
  blue: '#3B82F6',
  orange: '#F97316',
  pink: '#EC4899',
};

export const TYPOGRAPHY = {
  sizes: {
    xs: 11,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
  },
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const CATEGORIES = [
  { id: 'index', name: 'Index Funds', query: 'index' },
  { id: 'bluechip', name: 'Bluechip Funds', query: 'bluechip' },
  { id: 'tax', name: 'Tax Saver (ELSS)', query: 'tax' },
  { id: 'largecap', name: 'Large Cap Funds', query: 'large cap' },
];

export const API_BASE_URL = 'https://api.mfapi.in';
export const DEBOUNCE_DELAY = 300;
