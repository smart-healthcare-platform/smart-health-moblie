// types/TimeSlot.ts
export type TimeSlotStatus = "available" | "booked" | "off" | "expired";

export interface TimeSlot {
  id: string
  startTime: string // original start_time từ API (ISO)
  date: string      // "yyyy-mm-dd"
  time: string      // "HH:mm"
  status: TimeSlotStatus
}