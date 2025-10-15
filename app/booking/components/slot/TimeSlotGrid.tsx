import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Clock } from 'lucide-react-native';
import { TimeSlot } from '../../../../src/types';

interface TimeSlotGridProps {
  timeSlots: TimeSlot[];
  selectedSlotId: string | null;
  onSlotSelect: (slot: TimeSlot) => void;
  loading?: boolean;
}

export default function TimeSlotGrid({
  timeSlots,
  selectedSlotId,
  onSlotSelect,
  loading = false,
}: TimeSlotGridProps) {
  const getSlotStyle = (slot: TimeSlot) => {
    const isSelected = selectedSlotId === slot.id;
    const isDisabled = slot.status !== 'available';

    if (isSelected) return styles.slotSelected;
    if (isDisabled) {
      if (slot.status === 'booked') return styles.slotBooked;
      if (slot.status === 'off') return styles.slotOff;
      return styles.slotExpired;
    }
    return styles.slotAvailable;
  };

  const getSlotTextStyle = (slot: TimeSlot) => {
    const isSelected = selectedSlotId === slot.id;
    const isDisabled = slot.status !== 'available';

    if (isSelected) return styles.slotTextSelected;
    if (isDisabled) return styles.slotTextDisabled;
    return styles.slotTextAvailable;
  };

  return (
    <View style={styles.slotsCard}>
      <View style={styles.cardHeader}>
        <Clock size={20} color="#10b981" />
        <Text style={styles.cardTitle}>Chọn giờ khám</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải giờ khám...</Text>
        </View>
      ) : timeSlots.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có lịch khám trong ngày này</Text>
        </View>
      ) : (
        <View style={styles.slotsGrid}>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[styles.slot, getSlotStyle(slot)]}
              onPress={() => onSlotSelect(slot)}
              disabled={slot.status !== 'available'}
            >
              <Text style={[styles.slotText, getSlotTextStyle(slot)]}>
                {slot.time}
              </Text>
              {slot.status === 'off' && (
                <Text style={styles.slotSubtext}>Nghỉ</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  slotsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slot: {
    width: '31%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  slotAvailable: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  slotSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  slotBooked: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
  },
  slotOff: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde047',
  },
  slotExpired: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  slotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  slotTextAvailable: {
    color: '#059669',
  },
  slotTextSelected: {
    color: '#fff',
  },
  slotTextDisabled: {
    color: '#9ca3af',
  },
  slotSubtext: {
    fontSize: 10,
    color: '#92400e',
    marginTop: 2,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
