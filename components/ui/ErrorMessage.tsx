import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorMessageProps {
  message?: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fef2f2', // red-50
    borderLeftWidth: 4,
    borderColor: '#ef4444', // red-400
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#b91c1c', // red-700
    fontSize: 12,
    marginLeft: 8,
  },
});

export default ErrorMessage;
