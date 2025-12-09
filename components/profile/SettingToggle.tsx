import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingToggleProps {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  description?: string;
}

export default function SettingToggle({
  label,
  value,
  onToggle,
  icon,
  description,
}: SettingToggleProps) {
  return (
    <View style={styles.container}>
      {icon && (
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#3b82f6" />
        </View>
      )}
      
      <View style={styles.contentContainer}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#d1d5db', true: '#a7f3d0' }} // Light green when active
        thumbColor={value ? '#059669' : '#f3f4f6'} // System green thumb
        ios_backgroundColor="#d1d5db"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0fdf4', // Light green tint
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0fdf4', // Light green background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
});
