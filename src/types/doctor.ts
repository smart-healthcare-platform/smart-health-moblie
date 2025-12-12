export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Doctor {
  id: string;
  full_name: string;
  display_name?: string;
  avatar: string;
  specialty: string;
  experience_years: number;
  bio: string;
  active: boolean;
  degree: string;
}
export interface DoctorDetail {
  id: string
  full_name: string
  email: string
  phone: string
  gender: string
  date_of_birth: string
  avatar: string
  specialty: string
  experience_years: number
  bio: string
  active: boolean
  created_at: string
  updated_at: string
  display_name?:string
  certificates: Array<{
    id: string
    doctor_id: string
    type: 'degree' | 'license'
    title: string
    field: string | null
    graduation_year: string | null
    issued_date: Date | null
    expiry_date: Date | null
    certificate_file: string
    created_at: string
  }>

  ratings: Array<{
    id: string
    doctor_id: string
    rating: number
    comment: string
    patient_id: string
    created_at: string
  }>

  availabilities: Array<{
    id: string
    doctor_id: string
    day_of_week: string
    start_time: string
    end_time: string
    created_at: string
  }>

  blocks: Array<{
    id: string
    doctor_id: string
    start_time: string
    end_time: string
    reason: string
    created_at: string
  }>

  slots: Array<{
    id: string
    doctor_id: string
    start_time: string
    end_time: string
    status: 'available' | 'booked' | 'cancelled'
    patient_id: string | null
    created_at: string
    updated_at: string
  }>
}