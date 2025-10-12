import { apiAuth } from '../lib/axios';
import { Appointment, AppointmentDetailForDoctor, AppointmentResponse, CreateAppointmentPayload } from '../types';

export const appointmentService = {
  // Tạo appointment mới
  async create(payload: CreateAppointmentPayload): Promise<Appointment> {
    const res = await apiAuth.post<{ success: boolean; message: string; data: Appointment }>("/appointments", payload)
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to create appointment")
    }
    return res.data.data
  },

  async getAll(): Promise<Appointment[]> {
    const res = await apiAuth.get<{ success: boolean; data: Appointment[] }>("/appointments")
    if (!res.data.success) return []
    return res.data.data
  },

  async getDetailsAppointmentForDoctor(id: string): Promise<AppointmentDetailForDoctor> {
    const res = await apiAuth.get<{ success: boolean; data: AppointmentDetailForDoctor }>(`/appointments/${id}`)
    if (!res.data.success) {
      throw new Error(`Appointment ${id} not found`)
    }
    return res.data.data
  },


  async getByPatientId(
    patientId: string,
    page = 1,
    limit = 3,
    search = "",
    status: 'confirmed' | 'completed' | 'cancelled' | 'all' = "all",
    dateRange: 'today' | 'week' | 'month' | 'year' | 'all' = "all",
  ): Promise<AppointmentResponse> {
    const res = await apiAuth.get<{ success: boolean; data: AppointmentResponse }>(
      `/appointments/patient/${patientId}`,
      { params: { page, limit, search, status, dateRange } }
    );
    if (!res.data.success) {
      throw new Error(`Appointment ${patientId} not found`);
    }
    return res.data.data;
  },

  async getByDoctorId(
    doctorId: string,
    page = 1,
    limit = 10,
    status: 'confirmed' | 'completed' | 'cancelled' | 'all' = "all",
    start?: string,   
    end?: string     
  ): Promise<Appointment[]> {
    const res = await apiAuth.get<{ success: boolean; data: Appointment[] }>(
      `/appointments/doctor/${doctorId}`,
      { params: { page, limit, status, start, end } }
    );
    if (!res.data.success) {
      throw new Error(`Appointments for doctor ${doctorId} not found`);
    }
    return res.data.data;
  },


  async getByDateRange(start: string, end: string): Promise<Appointment[]> {
    const res = await apiAuth.get<{ success: boolean; data: Appointment[] }>(
      `/appointments`,
      { params: { start, end } }
    );
    if (!res.data.success) return []
    return res.data.data
  },

  async update(id: string, payload: Partial<CreateAppointmentPayload>): Promise<Appointment> {
    const res = await apiAuth.patch<{ success: boolean; data: Appointment }>(`/appointments/${id}`, payload)
    if (!res.data.success) {
      throw new Error(`Failed to update appointment ${id}`)
    }
    return res.data.data
  },

  async remove(id: string): Promise<void> {
    const res = await apiAuth.delete<{ success: boolean; message: string }>(`/appointments/${id}`)
    if (!res.data.success) {
      throw new Error(res.data.message || `Failed to delete appointment ${id}`)
    }
  },
}