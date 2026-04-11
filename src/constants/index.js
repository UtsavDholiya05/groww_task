export const COLORS = {
  primary: '#0066FF',
  primaryLight: '#E3F2FD',
  secondary: '#6C63FF',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#000000',
  textSecondary: '#666666',
  border: '#EEEEEE',
  error: '#FF4444',
  success: '#00C853',
  green: '#00C853',
  red: '#FF4444',
  darkBg: '#121212',
  darkSurface: '#1E1E1E',
  darkText: '#FFFFFF',
  darkTextSecondary: '#AAAAAA',
};

export const CATEGORIES = [
  { id: 'index', name: 'Index Funds', query: 'index' },
  { id: 'bluechip', name: 'Bluechip Funds', query: 'bluechip' },
  { id: 'tax', name: 'Tax Saver (ELSS)', query: 'tax' },
  { id: 'largecap', name: 'Large Cap Funds', query: 'large cap' },
];

export const API_BASE_URL = 'https://api.mfapi.in';
export const DEBOUNCE_DELAY = 300;
