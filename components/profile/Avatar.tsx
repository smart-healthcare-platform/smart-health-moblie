import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvatarProps {
  uri?: string;
  name: string;
  size?: 'small' | 'medium' | 'large';
  editable?: boolean;
  onEdit?: () => void;
}

const SIZES = {
  small: 50,
  medium: 80,
  large: 120,
};

const ICON_SIZES = {
  small: 14,
  medium: 20,
  large: 24,
};

export default function Avatar({ 
  uri, 
  name, 
  size = 'medium', 
  editable = false,
  onEdit 
}: AvatarProps) {
  const avatarSize = SIZES[size];
  const iconSize = ICON_SIZES[size];

  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <View style={[styles.container, { width: avatarSize, height: avatarSize }]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
          <Text style={[styles.initials, { fontSize: avatarSize / 2.5 }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}

      {editable && (
        <TouchableOpacity
          style={[styles.editButton, { width: iconSize * 2, height: iconSize * 2 }]}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Ionicons name="camera" size={iconSize} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    backgroundColor: '#f0f0f0',
  },
  placeholder: {
    backgroundColor: '#059669', // System primary green
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#059669', // System primary green
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
