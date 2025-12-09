import { apiAuth } from '../lib/axios';
import {
  Appointment,
  AppointmentDetail,
  AppointmentDetailForDoctor,
  AppointmentResponse,
  CreateAppointmentPayload,
  CreatePaymentRequest,
  CreatePaymentResponse,
  CheckInRequest,
  CheckInResponse,
} from '../types';

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

  // ✅ Fixed endpoint to match backend
  async getDetailsAppointmentForDoctor(id: string): Promise<AppointmentDetailForDoctor> {
    const res = await apiAuth.get<{ success: boolean; data: AppointmentDetailForDoctor }>(`/appointments/get-by-id/${id}`)
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

  /**
   * 🆕 Tạo payment request cho appointment
   * @param appointmentId - ID của appointment cần thanh toán
   * @param paymentMethod - Phương thức thanh toán (MOMO | VNPAY)
   * @returns Payment response with paymentUrl for redirect
   */
  async createPayment(
    appointmentId: string,
    paymentMethod: "MOMO" | "VNPAY"
  ): Promise<CreatePaymentResponse> {
    const res = await apiAuth.post<{ success: boolean; message: string; data: CreatePaymentResponse }>(
      `/appointments/${appointmentId}/create-payment`,
      { paymentMethod }
    )

    if (!res.data.success) {
      throw new Error(res.data.message || "Không thể tạo yêu cầu thanh toán")
    }

    return res.data.data
  },

  /**
   * 🆕 Check-in bệnh nhân tại cơ sở y tế
   * @param appointmentId - ID của appointment
   * @param notes - Ghi chú khi check-in (optional)
   * @returns Check-in response with updated appointment
   */
  async checkIn(
    appointmentId: string,
    notes?: string
  ): Promise<CheckInResponse> {
    const res = await apiAuth.post<{ success: boolean; message: string; data: CheckInResponse }>(
      `/appointments/${appointmentId}/check-in`,
      { notes }
    )

    if (!res.data.success) {
      throw new Error(res.data.message || "Không thể check-in")
    }

    return res.data.data
  },

  async getPreviousAppointment(appointmentId: string): Promise<AppointmentDetail | null> {
    const res = await apiAuth.get<{ success: boolean; data: AppointmentDetail | null }>(
      `/appointments/${appointmentId}/previous`
    )

    if (!res.data.success) {
      throw new Error(`Không thể lấy cuộc hẹn trước của appointment ${appointmentId}`)
    }

    return res.data.data
  },
}