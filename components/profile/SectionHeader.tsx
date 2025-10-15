import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SectionHeaderProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightElement?: React.ReactNode;
}

export default function SectionHeader({ title, icon, rightElement }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {icon && (
          <Ionicons name={icon} size={20} color="#059669" style={styles.icon} />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {rightElement}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 24,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669', // System primary green
  },
});
