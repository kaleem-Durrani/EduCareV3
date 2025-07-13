// Theme configuration for EduCare Mobile App
// Tailored for a school management application

import { ThemeColors, ThemeMode } from '../types';

// Light theme colors - Professional and clean for school environment
const lightTheme: ThemeColors = {
  // Background colors
  background: '#f8fafc', // Very light gray-blue
  surface: '#ffffff',    // Pure white
  card: '#ffffff',       // Pure white
  
  // Primary colors - Professional blue suitable for education
  primary: '#2563eb',      // Blue-600
  primaryLight: '#3b82f6', // Blue-500
  primaryDark: '#1d4ed8',  // Blue-700
  
  // Secondary colors - Complementary teal
  secondary: '#0891b2',     // Cyan-600
  secondaryLight: '#06b6d4', // Cyan-500
  secondaryDark: '#0e7490',  // Cyan-700
  
  // Text colors
  textPrimary: '#1f2937',   // Gray-800
  textSecondary: '#4b5563', // Gray-600
  textMuted: '#9ca3af',     // Gray-400
  textOnPrimary: '#ffffff', // White
  textOnSecondary: '#ffffff', // White
  
  // Border colors
  border: '#e5e7eb',        // Gray-200
  borderLight: '#f3f4f6',   // Gray-100
  
  // Status colors
  success: '#059669',       // Emerald-600
  warning: '#d97706',       // Amber-600
  error: '#dc2626',         // Red-600
  info: '#2563eb',          // Blue-600
  
  // Header colors
  headerBackground: '#ffffff',
  headerText: '#1f2937',
  
  // Tab colors
  tabBackground: '#ffffff',
  tabActive: '#2563eb',
  tabInactive: '#6b7280',
  
  // Shadow colors
  shadow: '#00000060',      // Very light black with opacity
};

// Dark theme colors - Easy on eyes for evening use
const darkTheme: ThemeColors = {
  // Background colors
  background: '#0f172a',    // Slate-900
  surface: '#1e293b',       // Slate-800
  card: '#334155',          // Slate-700
  
  // Primary colors - Softer blue for dark mode
  primary: '#3b82f6',       // Blue-500
  primaryLight: '#60a5fa',  // Blue-400
  primaryDark: '#2563eb',   // Blue-600
  
  // Secondary colors - Softer teal
  secondary: '#06b6d4',     // Cyan-500
  secondaryLight: '#22d3ee', // Cyan-400
  secondaryDark: '#0891b2',  // Cyan-600
  
  // Text colors
  textPrimary: '#f1f5f9',   // Slate-100
  textSecondary: '#cbd5e1', // Slate-300
  textMuted: '#64748b',     // Slate-500
  textOnPrimary: '#ffffff', // White
  textOnSecondary: '#ffffff', // White
  
  // Border colors
  border: '#475569',        // Slate-600
  borderLight: '#64748b',   // Slate-500
  
  // Status colors - Slightly muted for dark mode
  success: '#10b981',       // Emerald-500
  warning: '#f59e0b',       // Amber-500
  error: '#ef4444',         // Red-500
  info: '#3b82f6',          // Blue-500
  
  // Header colors
  headerBackground: '#1e293b',
  headerText: '#f1f5f9',
  
  // Tab colors
  tabBackground: '#1e293b',
  tabActive: '#3b82f6',
  tabInactive: '#94a3b8',
  
  // Shadow colors
  shadow: '#000000',      // Darker shadow for dark mode
};

// Theme configuration object
export const themes: Record<ThemeMode, ThemeColors> = {
  light: lightTheme,
  dark: darkTheme,
};

// Helper function to get theme colors
export const getThemeColors = (mode: ThemeMode): ThemeColors => {
  return themes[mode];
};

// Default theme mode
export const DEFAULT_THEME_MODE: ThemeMode = 'light';

// Storage key for theme preference
export const THEME_STORAGE_KEY = '@educare_theme_mode';
