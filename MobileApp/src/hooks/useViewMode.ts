import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ViewMode = 'tiles' | 'list';

const STORAGE_KEY = '@educare_view_mode';

export const useViewMode = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('tiles');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved view mode on mount
  useEffect(() => {
    loadViewMode();
  }, []);

  const loadViewMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedMode && (savedMode === 'tiles' || savedMode === 'list')) {
        setViewMode(savedMode as ViewMode);
      }
    } catch (error) {
      console.error('Failed to load view mode:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleViewMode = async () => {
    const newMode: ViewMode = viewMode === 'tiles' ? 'list' : 'tiles';
    setViewMode(newMode);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newMode);
    } catch (error) {
      console.error('Failed to save view mode:', error);
    }
  };

  const setViewModeDirectly = async (mode: ViewMode) => {
    setViewMode(mode);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save view mode:', error);
    }
  };

  return {
    viewMode,
    isLoading,
    toggleViewMode,
    setViewMode: setViewModeDirectly,
  };
};
