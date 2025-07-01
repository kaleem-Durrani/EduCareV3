import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme as useThemeHook, UseThemeReturn } from '../hooks/useTheme';

// Create context
const ThemeContext = createContext<UseThemeReturn | undefined>(undefined);

// Theme Provider Props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeValue = useThemeHook();

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): UseThemeReturn => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export default
export default ThemeContext;
