import { apiNoAuth } from "../lib/axios"
import { TimeSlot, TimeSlotStatus } from "../types/timeSlot"
import { Doctor, DoctorDetail, PaginatedResponse } from "../types"

export const doctorService = {
  async getPublicDoctors(page = 1, limit = 6, search = "") {
    const res = await apiNoAuth.get<{ data: PaginatedResponse<Doctor> }>("/public/doctors", { params: { page, limit, search } })
    console.log(res.data)
    return res.data.data
  },

  async getDoctorById(id: string): Promise<DoctorDetail> {
    const res = await apiNoAuth.get<{ data: DoctorDetail }>(`/public/doctors/${id}`)
    return res.data.data
  },

  async getDoctorSlots(doctorId: string): Promise<TimeSlot[]> {
    try {
      const res = await apiNoAuth.get<{ success: boolean; data: any[] }>(
        `/public/doctors/appointment-slots/${doctorId}`
      )
      if (!res.data.success) return []

      console.log('🔍 [DEBUG] Sample slot from backend:', res.data.data[0]);

      const slots: TimeSlot[] = res.data.data.map((s) => {
        let date: string;
        let time: string;
        
        // Support both formats:
        // 1. ISO format: "2025-01-15T10:00:00.000Z"
        // 2. Space-separated: "2025-01-15 10:00:00"
        if (s.start_time.includes("T")) {
          // ISO format - extract date directly to avoid timezone issues
          date = s.start_time.split("T")[0]; // "2025-01-15"
          const start = new Date(s.start_time);
          time = start.toLocaleTimeString("vi-VN", { hour12: false, hour: "2-digit", minute: "2-digit" });
          console.log(`📅 [ISO] start_time: ${s.start_time} → date: ${date}, time: ${time}`);
        } else {
          // Space-separated format (like website)
          const [dateStr, timeStr] = s.start_time.split(" ");
          date = dateStr; // "2025-01-15"
          time = timeStr.slice(0, 5); // "10:00"
          console.log(`📅 [SPACE] start_time: ${s.start_time} → date: ${date}, time: ${time}`);
        }
        
        return {
          id: s.id,
          startTime: s.start_time,
          date: date,
          time: time,
          status: mapStatus(s.status),
        }
      })

      console.log('✅ [DEBUG] Total slots parsed:', slots.length);
      console.log('✅ [DEBUG] Unique dates:', Array.from(new Set(slots.map(s => s.date))));

      return slots
    } catch (err) {
      console.error("Error fetching doctor slots:", err)
      return []
    }
  }
}

// map API status -> TimeSlotStatus
function mapStatus(status: string): TimeSlotStatus {
  switch (status) {
    case "available": return "available"
    case "booked": return "booked"
    case "off": return "off"
    case "expired": return "expired"
    default: return "expired"
  }
}