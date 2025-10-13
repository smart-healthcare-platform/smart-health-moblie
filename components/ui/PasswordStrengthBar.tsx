import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PasswordStrengthBarProps {
  password: string;
}

const getPasswordStrength = (pwd: string) => {
  if (pwd.length === 0) return { strength: 0, text: '', color: '' };
  if (pwd.length < 6) return { strength: 25, text: 'Yếu', color: '#ef4444' };
  if (pwd.length < 8) return { strength: 50, text: 'Trung bình', color: '#f59e42' };
  if (pwd.length < 12) return { strength: 75, text: 'Mạnh', color: '#3b82f6' };
  return { strength: 100, text: 'Rất mạnh', color: '#22c55e' };
};

const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ password }) => {
  const { strength, text, color } = getPasswordStrength(password);
  if (!password) return null;
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Độ mạnh mật khẩu:</Text>
        <Text style={{ color, fontWeight: 'bold', marginLeft: 8 }}>{text}</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.bar, { width: `${strength}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
  },
  barBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: 6,
    borderRadius: 4,
  },
});

export default PasswordStrengthBar;
