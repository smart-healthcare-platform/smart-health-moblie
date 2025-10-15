import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Đang tải...' }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#10b981" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  text: {
    marginTop: 12,
    fontSize: 15,
    color: '#6b7280',
  },
});
