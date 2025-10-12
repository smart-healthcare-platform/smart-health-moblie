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

      const slots: TimeSlot[] = res.data.data.map((s) => {
        const start = new Date(s.start_time);
        return {
          id: s.id,
          startTime: s.start_time,
          date: start.toISOString().split("T")[0],
          time: start.toLocaleTimeString("vi-VN", { hour12: false, hour: "2-digit", minute: "2-digit" }),
          status: mapStatus(s.status),
        }
      })

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