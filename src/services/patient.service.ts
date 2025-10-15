import { apiAuth } from '../lib/axios';
import { UpdatePatientDto } from '../types/patient';

export const patientService = {
  /**
   * Get patient profile by user ID
   * @param userId - User ID
   * @returns Patient profile data
   */
  getByUserId: async (userId: string) => {
    // Changed endpoint to match website: /patients/by-user/{userId}
    const res = await apiAuth.get(`/patients/by-user/${userId}`);
    return res.data.data;
  },

  /**
   * Update patient profile
   * @param patientId - Patient ID
   * @param data - Profile update data
   * @returns Updated patient data
   */
  updateProfile: async (patientId: string, data: UpdatePatientDto) => {
    const res = await apiAuth.put(`/patients/${patientId}`, data);
    return res.data.data;
  },

  /**
   * Upload patient avatar
   * @param patientId - Patient ID
   * @param file - Image file (FormData)
   * @returns Avatar URL
   */
  uploadAvatar: async (patientId: string, formData: FormData) => {
    const res = await apiAuth.post(`/patients/${patientId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  /**
   * Get patient medical history
   * @param patientId - Patient ID
   * @param params - Filter parameters (optional)
   * @returns Medical records list
   */
  getMedicalHistory: async (patientId: string, params?: { startDate?: string; endDate?: string; type?: string }) => {
    const res = await apiAuth.get(`/patients/${patientId}/medical-history`, { params });
    return res.data.data;
  },

  /**
   * Get patient prescriptions
   * @param patientId - Patient ID
   * @returns Prescriptions list
   */
  getPrescriptions: async (patientId: string) => {
    const res = await apiAuth.get(`/patients/${patientId}/prescriptions`);
    return res.data.data;
  },
};

