import { useState, useEffect, useCallback } from 'react';
import { doctorService } from '../../src/services/doctor.service';
import { TimeSlot } from '../../src/types';

export function useTimeSlots(doctorId: string | null | undefined, selectedDate: string | null) {
  const [allSlots, setAllSlots] = useState<TimeSlot[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all slots for the doctor
  const fetchSlots = useCallback(async () => {
    if (!doctorId) {
      setAllSlots([]);
      setAvailableDates([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const slots = await doctorService.getDoctorSlots(doctorId);
      setAllSlots(slots);

      // Extract unique dates from slots
      const dates = Array.from(new Set(slots.map((s) => s.date)));
      setAvailableDates(dates);
    } catch (err: any) {
      console.error('Failed to fetch slots:', err);
      
      // Detailed error messages based on error type
      let errorMessage = 'Không thể tải lịch khám. Vui lòng thử lại.';
      
      if (err.response?.status === 404) {
        errorMessage = 'Không tìm thấy lịch khám của bác sĩ này.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
      } else if (err.message?.includes('timeout')) {
        errorMessage = 'Kết nối bị timeout. Vui lòng kiểm tra mạng.';
      } else if (err.message?.includes('Network')) {
        errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.';
      }
      
      setError(errorMessage);
      setAllSlots([]);
      setAvailableDates([]);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  // Filter slots for selected date
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }

    const dateStr = selectedDate.split('T')[0];
    const slotsForDay = allSlots
      .filter((s) => s.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));

    setTimeSlots(slotsForDay);
  }, [selectedDate, allSlots]);

  // Fetch slots when doctor changes
  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return {
    allSlots,
    availableDates,
    timeSlots,
    loading,
    error,
    refetch: fetchSlots,
  };
}
