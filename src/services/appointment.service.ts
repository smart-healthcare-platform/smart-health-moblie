import { apiAuth } from '../lib/axios';
import { 
  Appointment, 
  AppointmentDetail, 
  AppointmentResponse,
  CreateAppointmentPayload 
} from '../types/appointment';

export interface CheckInResponse {
  appointment: Appointment;
  message: string;
}

export interface CreatePaymentResponse {
  paymentUrl: string;
  paymentId: string;
  appointmentId: string;
}

export interface FollowUpSuggestion {
  id: string;
  medicalRecordId: string;
  doctorId: string;
  patientId: string;
  suggestedDate: string;
  reason: string;
  notes?: string;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export const appointmentService = {
  // ==================== APPOINTMENT CRUD ====================
  
  /**
   * Tạo appointment mới
   */
  async create(payload: CreateAppointmentPayload): Promise<Appointment> {
    const res = await apiAuth.post<{ success: boolean; message: string; data: Appointment }>(
      "/appointments", 
      payload
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to create appointment");
    }
    return res.data.data;
  },

  /**
   * Lấy tất cả appointments
   */
  async getAll(): Promise<Appointment[]> {
    const res = await apiAuth.get<{ success: boolean; data: Appointment[] }>(
      "/appointments"
    );
    if (!res.data.success) return [];
    return res.data.data;
  },

  /**
   * Lấy chi tiết appointment cho bác sĩ
   */
  async getDetailsAppointmentForDoctor(id: string): Promise<AppointmentDetail> {
    const res = await apiAuth.get<{ success: boolean; data: AppointmentDetail }>(
      `/appointments/get-by-id/${id}`
    );
    if (!res.data.success) {
      throw new Error(`Appointment ${id} not found`);
    }
    return res.data.data;
  },

  /**
   * Cập nhật appointment
   */
  async update(id: string, payload: Partial<CreateAppointmentPayload>): Promise<Appointment> {
    const res = await apiAuth.patch<{ success: boolean; data: Appointment }>(
      `/appointments/${id}`, 
      payload
    );
    if (!res.data.success) {
      throw new Error(`Failed to update appointment ${id}`);
    }
    return res.data.data;
  },

  /**
   * Xóa appointment
   */
  async remove(id: string): Promise<void> {
    const res = await apiAuth.delete<{ success: boolean; message: string }>(
      `/appointments/${id}`
    );
    if (!res.data.success) {
      throw new Error(res.data.message || `Failed to delete appointment ${id}`);
    }
  },

  // ==================== QUERY BY PATIENT/DOCTOR ====================

  /**
   * Lấy appointments theo patient ID với phân trang và filter
   */
  async getByPatientId(
    patientId: string,
    page = 1,
    limit = 10,
    search = "",
    status: 'confirmed' | 'completed' | 'cancelled' | 'all' = "all",
    dateRange: 'today' | 'week' | 'month' | 'year' | 'all' = "all",
  ): Promise<AppointmentResponse> {
    const res = await apiAuth.get<{ success: boolean; data: AppointmentResponse }>(
      `/appointments/patient/${patientId}`,
      { params: { page, limit, search, status, dateRange } }
    );
    if (!res.data.success) {
      throw new Error(`Failed to get appointments for patient ${patientId}`);
    }
    return res.data.data;
  },

  /**
   * Lấy appointments theo doctor ID
   */
  async getByDoctorId(
    doctorId: string,
    start?: string,
    end?: string
  ): Promise<Appointment[]> {
    const res = await apiAuth.get<{ success: boolean; data: Appointment[] }>(
      `/appointments/doctor/${doctorId}`,
      { params: { start, end } }
    );
    if (!res.data.success) {
      throw new Error(`Failed to get appointments for doctor ${doctorId}`);
    }
    return res.data.data;
  },

  /**
   * Lấy appointments của doctor theo khoảng thời gian (alias)
   */
  async getForDoctorByDateRange(
    doctorId: string, 
    start: string, 
    end: string
  ): Promise<Appointment[]> {
    return this.getByDoctorId(doctorId, start, end);
  },

  /**
   * Lấy appointments theo khoảng thời gian
   */
  async getByDateRange(start: string, end: string): Promise<Appointment[]> {
    const res = await apiAuth.get<{ success: boolean; data: Appointment[] }>(
      `/appointments`,
      { params: { start, end } }
    );
    if (!res.data.success) return [];
    return res.data.data;
  },

  /**
   * Lấy appointments hôm nay
   */
  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date();
    const start = today.toISOString().split("T")[0] + "T00:00:00Z";
    const end = today.toISOString().split("T")[0] + "T23:59:59Z";

    const res = await apiAuth.get<{ success: boolean; data: Appointment[] }>(
      "/appointments",
      { params: { start, end } }
    );
    if (!res.data.success) return [];
    return res.data.data;
  },

  // ==================== PAYMENT & CHECK-IN ====================

  /**
   * Tạo payment request cho appointment
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
    );

    if (!res.data.success) {
      throw new Error(res.data.message || "Không thể tạo yêu cầu thanh toán");
    }

    return res.data.data;
  },

  /**
   * Check-in bệnh nhân tại cơ sở y tế
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
    );

    if (!res.data.success) {
      throw new Error(res.data.message || "Không thể check-in");
    }

    return res.data.data;
  },

  // ==================== FOLLOW-UP SUGGESTIONS ====================

  /**
   * Lấy danh sách đề xuất tái khám pending của bệnh nhân
   */
  async getPendingFollowUpByPatient(patientId: string): Promise<FollowUpSuggestion[]> {
    const res = await apiAuth.get<{ success: boolean; data: FollowUpSuggestion[] }>(
      `/appointments/follow-up-suggestions/patient/${patientId}/pending`
    );

    if (!res.data.success) {
      throw new Error(`Không thể lấy danh sách tái khám pending cho bệnh nhân ${patientId}`);
    }

    return res.data.data;
  },

  /**
   * Lấy thông tin cuộc hẹn trước đó (nếu là tái khám)
   */
  async getPreviousAppointment(appointmentId: string): Promise<AppointmentDetail | null> {
    const res = await apiAuth.get<{ success: boolean; data: AppointmentDetail | null }>(
      `/appointments/${appointmentId}/previous`
    );

    if (!res.data.success) {
      throw new Error(`Không thể lấy cuộc hẹn trước của appointment ${appointmentId}`);
    }

    return res.data.data;
  },
};