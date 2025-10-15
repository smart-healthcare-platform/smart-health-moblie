import { apiAuth } from '../lib/axios';

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
};
