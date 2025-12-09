import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setDate, setSlot } from '../../src/redux/slices/bookingSlice';
import { TimeSlot } from '../../src/types';
import { RootState } from '../../src/redux';
import { useTimeSlots } from '../../hooks/booking/useTimeSlots';
import CalendarView from './components/slot/CalendarView';
import TimeSlotGrid from './components/slot/TimeSlotGrid';
import TimeSlotLegend from './components/slot/TimeSlotLegend';
import ErrorState from './components/common/ErrorState';

export default function DateTimeSelectionStep() {
  const dispatch = useDispatch();
  const { doctor, date: dateStr, slot_id } = useSelector(
    (state: RootState) => state.booking
  );

  const {
    availableDates,
    timeSlots,
    loading,
    error,
    refetch,
  } = useTimeSlots(doctor?.id, dateStr);

  const handleDateSelect = (date: string) => {
    dispatch(setDate(date));
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.status === 'available') {
      dispatch(setSlot(slot));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn ngày & giờ khám</Text>
      <Text style={styles.subtitle}>
        Chọn ngày có dấu chấm xanh là ngày bác sĩ có lịch
      </Text>

      {error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <>
          <CalendarView
            availableDates={availableDates}
            selectedDate={dateStr}
            onDateSelect={handleDateSelect}
            loading={loading}
          />

          {dateStr ? (
            <>
              <TimeSlotLegend />
              <TimeSlotGrid
                timeSlots={timeSlots}
                selectedSlotId={slot_id}
                onSlotSelect={handleSlotSelect}
                loading={loading}
              />
            </>
          ) : (
            <View style={styles.emptyStateCard}>
              <CalendarIcon size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>
                Vui lòng chọn ngày trước để xem giờ khám
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  emptyStateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
