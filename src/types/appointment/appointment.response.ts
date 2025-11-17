import { AppointmentDetail } from "./appointment.type";

export interface AppointmentResponse {
  appointments: AppointmentDetail[];
  total: number;
  page: number;
  limit: number;
}