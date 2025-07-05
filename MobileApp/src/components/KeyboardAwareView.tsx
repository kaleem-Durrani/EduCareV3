import React from 'react';
import { KeyboardAvoidingView, Platform, ViewStyle } from 'react-native';

interface KeyboardAwareViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  behavior?: 'height' | 'position' | 'padding';
  keyboardVerticalOffset?: number;
  enabled?: boolean;
}

export const KeyboardAwareView: React.FC<KeyboardAwareViewProps> = ({
  children,
  style = { flex: 1 },
  behavior,
  keyboardVerticalOffset,
  enabled = true,
}) => {
  // Default behavior based on platform
  const defaultBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const defaultOffset = Platform.OS === 'ios' ? 0 : 20;

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <KeyboardAvoidingView
      style={style}
      behavior={behavior || defaultBehavior}
      keyboardVerticalOffset={keyboardVerticalOffset ?? defaultOffset}
      enabled={enabled}
    >
      {children}
    </KeyboardAvoidingView>
  );
};
