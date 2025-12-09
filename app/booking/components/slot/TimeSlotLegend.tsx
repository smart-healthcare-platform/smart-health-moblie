import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TimeSlotLegend() {
  return (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: '#d1fae5' }]} />
        <Text style={styles.legendText}>Có thể đặt</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: '#fee2e2' }]} />
        <Text style={styles.legendText}>Đã đặt</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: '#fef3c7' }]} />
        <Text style={styles.legendText}>Nghỉ</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
