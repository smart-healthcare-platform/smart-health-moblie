import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface DoctorSearchProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export default function DoctorSearch({ 
  value, 
  onChange, 
  placeholder = 'Tìm kiếm bác sĩ...' 
}: DoctorSearchProps) {
  return (
    <View style={styles.searchContainer}>
      <Search size={20} color="#6b7280" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        placeholderTextColor="#9ca3af"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange('')} style={styles.clearIcon}>
          <X size={20} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  clearIcon: {
    padding: 4,
  },
});
