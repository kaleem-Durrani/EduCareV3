import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { ThemeMode, ThemeColors } from '../types';
import { getThemeColors, DEFAULT_THEME_MODE, THEME_STORAGE_KEY } from '../config/theme';
import { log, logError } from '../config/env';

export interface UseThemeReturn {
  themeMode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isLoading: boolean;
}

export const useTheme = (): UseThemeReturn => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from storage
  useEffect(() => {
    initializeTheme();
  }, []);

  const initializeTheme = async () => {
    try {
      log('Initializing theme...');
      
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      
      if (storedTheme) {
        const parsedTheme = storedTheme as ThemeMode;
        setThemeModeState(parsedTheme);
        log('Theme restored from storage:', parsedTheme);
      } else {
        // Use system preference if no stored theme
        const systemTheme = systemColorScheme === 'dark' ? 'dark' : 'light';
        setThemeModeState(systemTheme);
        log('Using system theme:', systemTheme);
      }
    } catch (error) {
      logError('Failed to initialize theme:', error);
      setThemeModeState(DEFAULT_THEME_MODE);
    } finally {
      setIsLoading(false);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      log('Theme saved:', mode);
    } catch (error) {
      logError('Failed to save theme:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  // Get current theme colors
  const colors = getThemeColors(themeMode);
  const isDark = themeMode === 'dark';

  return {
    themeMode,
    colors,
    isDark,
    toggleTheme,
    setThemeMode,
    isLoading,
  };
};
