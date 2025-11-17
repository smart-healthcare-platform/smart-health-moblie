import { AppointmentType } from "./enums/appointment-type.enum";
import { AppointmentStatus } from "./enums/appointment-status.enum";
import { AppointmentCategory } from "./enums/appointment-category.enum";

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  slotId: string;
  status: AppointmentStatus;
  type: AppointmentType;
  category: AppointmentCategory;
  notes: string;
  createdAt: string;
  updatedAt: string;
  startAt: string;
  endAt?: string;
  followUpId?: string;
  paymentStatus?: "UNPAID" | "PENDING" | "PAID" | "REFUNDED";
  paymentId?: string | null;
  paidAmount?: number | null;
  paidAt?: string | null;
  checkedInAt?: string | null;
  consultationFee?: number;
}

export interface Patient {
  id: string;
  fullName: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  diagnosis: string;
  symptoms?: string;
  doctorNotes?: string;
  prescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentDetail extends Appointment {
  patient: Patient;
  medicalRecord?: MedicalRecord;
}

export interface AppointmentFilters {
  dateRange: {
    start: string;
    end: string;
  };
  status?: AppointmentStatus[];
  type?: AppointmentType[];
  doctorId?: string;
  department?: string;
}

export type ViewMode = "table" | "calendar";