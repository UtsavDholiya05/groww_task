export const COLORS = {
  // Primary - Modern Groww Green
  primary: '#00D09C',
  primaryDark: '#00A67E',
  primaryLight: '#E8F8F4',
  
  // Secondary colors
  secondary: '#6C63FF',
  secondaryLight: '#F0EBFF',
  
  // Semantic colors
  success: '#00D09C',
  error: '#FF4757',
  warning: '#FFA502',
  info: '#2E86DE',
  
  // Backgrounds
  background: '#FFFFFF',
  surface: '#F8F9FA',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 208, 156, 0.1)',
  
  // Text colors
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#E0E0E0',
  
  // Dark mode
  darkBg: '#0F1419',
  darkSurface: '#1A1F2E',
  darkText: '#FFFFFF',
  darkTextSecondary: '#B0B0B0',
  darkBorder: '#2A2F3E',
  
  // Legacy support
  green: '#00D09C',
  red: '#FF4757',
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
