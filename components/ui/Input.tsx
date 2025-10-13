import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
 value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'number-pad' | 'phone-pad' | 'name-phone-pad' | 'decimal-pad' | 'twitter' | 'web-search' | 'visible-password';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  keyboardType,
  autoCapitalize,
  autoCorrect,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.errorInput : null]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#374151', // gray-700
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200
    borderRadius: 12, // rounded-xl
    paddingVertical: 12, // py-3
    paddingHorizontal: 16, // px-4
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // bg-white/50
  },
  errorInput: {
    borderColor: '#ef4444', // red-500
  },
  errorText: {
    color: '#ef4444', // red-500
    fontSize: 12,
    marginTop: 5,
  },
});

export default Input;