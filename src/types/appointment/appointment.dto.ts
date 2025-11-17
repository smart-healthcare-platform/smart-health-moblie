import { AppointmentType } from "./enums/appointment-type.enum";
import { AppointmentCategory } from "./enums/appointment-category.enum";

export interface CreateAppointmentPayload {
  doctorId: string;
  doctorName: string;
  slotId: string;
  startAt: string; // ISO string
  endAt?: string;  // ISO string (optional)
  patientId: string;
  patientName: string;
  followUpId?: string;
  notes?: string;
  type?: AppointmentType;
  category?: AppointmentCategory;
}