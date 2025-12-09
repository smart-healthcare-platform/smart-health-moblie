import { AppointmentStatus, AppointmentType, AppointmentCategory, PaymentStatus } from './appointment-enums';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  slotId: string;
  status: AppointmentStatus;
  type: AppointmentType;
  notes: string;
  createdAt: string;
  updatedAt: string;
  startAt: string;
  followUpId?: string;
  paymentStatus?: PaymentStatus;
  paymentId?: string | null;
  paidAmount?: number | null;
  paidAt?: string | null;
  checkedInAt?: string | null;
  consultationFee?: number;
  prescriptionId?: string | null;
}

export interface AppointmentDetail extends Appointment {
  patient: {
    id: string;
    fullName: string;
    gender: "male" | "female" | "other";
    dateOfBirth: string;
    address: string;
  };
  medicalRecord?: {
    id: string;
    diagnosis: string;
    treatment: string;
    prescription?: string;
  };
}

export interface AppointmentResponse {
  appointments: Appointment[];
  total: number;
  page: number;
  limit: number;
}

export type ViewMode = "table" | "calendar";

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

export interface CreateAppointmentPayload {
  doctorId: string;
  doctorName: string;
  slotId: string;
  startAt: string;
  endAt?: string;
  patientId: string;
  patientName: string;
  followUpId?: string;
  notes?: string;
  type?: AppointmentType;
  category?: AppointmentCategory;
}

export interface AppointmentDetailForDoctor {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  slotId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  startAt: string;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: string;
    fullName: string;
    gender: "male" | "female" | "other";
    dateOfBirth: string;
    address: string;
  };
}

// Payment Types
export interface CreatePaymentRequest {
  paymentMethod: "MOMO" | "VNPAY";
}

export interface CreatePaymentResponse {
  success: boolean;
  appointmentId: string;
  paymentId: string;
  paymentUrl: string;
  amount: number;
  expiredAt: string;
}

export interface CheckInRequest {
  notes?: string;
}

export interface CheckInResponse {
  success: boolean;
  message: string;
  appointmentId: string;
  checkedInAt: string;
  paymentStatus: PaymentStatus;
  requiresPayment: boolean;
  appointment: AppointmentDetail;
}