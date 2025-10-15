import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Calendar as CalendarIcon } from 'lucide-react-native';

interface CalendarViewProps {
  availableDates: string[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  loading?: boolean;
}

export default function CalendarView({
  availableDates,
  selectedDate,
  onDateSelect,
  loading = false,
}: CalendarViewProps) {
  const markedDates = availableDates.reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: '#10b981',
      selected: selectedDate?.split('T')[0] === date,
      selectedColor: '#10b981',
    };
    return acc;
  }, {} as any);

  const handleDayPress = (day: any) => {
    const selectedDate = new Date(day.dateString);
    onDateSelect(selectedDate.toISOString());
  };

  return (
    <View style={styles.calendarCard}>
      <View style={styles.cardHeader}>
        <CalendarIcon size={20} color="#10b981" />
        <Text style={styles.cardTitle}>Chọn ngày khám</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải lịch...</Text>
        </View>
      ) : (
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDayPress}
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
  );
}

const styles = StyleSheet.create({
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
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
});
