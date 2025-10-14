import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Clock, Calendar as CalendarIcon } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setDate, setSlot } from '../../src/redux/slices/bookingSlice';
import { doctorService } from '../../src/services/doctor.service';
import { TimeSlot } from '../../src/types';
import { RootState } from '../../src/redux';

export default function DateTimeSelectionStep() {
  const dispatch = useDispatch();
  const { doctor, date: dateStr, slot_id } = useSelector(
    (state: RootState) => state.booking
  );

  const [allSlots, setAllSlots] = useState<TimeSlot[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!doctor) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const slots = await doctorService.getDoctorSlots(doctor.id);
        setAllSlots(slots);
        const dates = Array.from(new Set(slots.map((s) => s.date)));
        setAvailableDates(dates);
      } catch (err) {
        console.error('Failed to fetch slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [doctor]);

  useEffect(() => {
    if (!dateStr) {
      setTimeSlots([]);
      return;
    }

    const slotsForDay = allSlots
      .filter((s) => s.date === dateStr.split('T')[0])
      .sort((a, b) => a.time.localeCompare(b.time));

    setTimeSlots(slotsForDay);
  }, [dateStr, allSlots]);

  const handleDateSelect = (day: any) => {
    const selectedDate = new Date(day.dateString);
    dispatch(setDate(selectedDate.toISOString()));
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.status === 'available') {
      dispatch(setSlot(slot));
    }
  };

  const markedDates = availableDates.reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: '#10b981',
      selected: dateStr?.split('T')[0] === date,
      selectedColor: '#10b981',
    };
    return acc;
  }, {} as any);

  const getSlotStyle = (slot: TimeSlot) => {
    const isSelected = slot_id === slot.id;
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
    const isSelected = slot_id === slot.id;
    const isDisabled = slot.status !== 'available';

    if (isSelected) return styles.slotTextSelected;
    if (isDisabled) return styles.slotTextDisabled;
    return styles.slotTextAvailable;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Chọn ngày & giờ khám</Text>
      <Text style={styles.subtitle}>
        Chọn ngày có dấu chấm xanh là ngày bác sĩ có lịch
      </Text>

      {/* Calendar */}
      <View style={styles.calendarCard}>
        <View style={styles.cardHeader}>
          <CalendarIcon size={20} color="#10b981" />
          <Text style={styles.cardTitle}>Chọn ngày khám</Text>
        </View>

        {loadingSlots ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.loadingText}>Đang tải lịch...</Text>
          </View>
        ) : (
          <Calendar
            markedDates={markedDates}
            onDayPress={handleDateSelect}
            minDate={new Date().toISOString().split('T')[0]}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#6b7280',
              selectedDayBackgroundColor: '#10b981',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#10b981',
              dayTextColor: '#1e293b',
              textDisabledColor: '#d1d5db',
              dotColor: '#10b981',
              selectedDotColor: '#ffffff',
              arrowColor: '#10b981',
              monthTextColor: '#1e293b',
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
          />
        )}
      </View>

      {/* Time Slots */}
      {dateStr && (
        <View style={styles.slotsCard}>
          <View style={styles.cardHeader}>
            <Clock size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Chọn giờ khám</Text>
          </View>

          {/* Legend */}
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

          {loadingSlots ? (
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
                  onPress={() => handleSlotSelect(slot)}
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
      )}

      {!dateStr && (
        <View style={styles.emptyStateCard}>
          <CalendarIcon size={48} color="#d1d5db" />
          <Text style={styles.emptyStateText}>
            Vui lòng chọn ngày trước để xem giờ khám
          </Text>
        </View>
      )}
    </ScrollView>
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
  calendarCard: {
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
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
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
