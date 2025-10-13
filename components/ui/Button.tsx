import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
 variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', disabled = false }) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.button, styles.secondaryButton];
      case 'destructive':
        return [styles.button, styles.destructiveButton];
      default:
        return [styles.button, styles.primaryButton];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.text, styles.secondaryText];
      case 'destructive':
        return [styles.text, styles.destructiveText];
      default:
        return [styles.text, styles.primaryText];
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[getTextStyle(), disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#3b82f6', // blue-500
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb', // gray-200
  },
  destructiveButton: {
    backgroundColor: '#ef4444', // red-500
  },
  disabledButton: {
    backgroundColor: '#9ca3af', // gray-400
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#1f2937', // gray-800
  },
  destructiveText: {
    color: '#fff',
  },
  disabledText: {
    color: '#4b5563', // gray-600
  },
});

export default Button;