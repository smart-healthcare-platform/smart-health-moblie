import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';

interface SocialButtonProps {
  title: string;
  icon?: React.ReactNode;
  color?: string;
  onPress: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ title, icon, color = '#e5e7eb', onPress }) => {
  return (
    <TouchableOpacity style={[styles.button, { borderColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  text: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
});

export default SocialButton;
