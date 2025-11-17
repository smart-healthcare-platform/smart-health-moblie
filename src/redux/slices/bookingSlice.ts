import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PatientFormData, Doctor, DoctorDetail, TimeSlot } from "../../types";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: string;
  address: string;
  notes: string
}

interface BookingState {
  doctor: Doctor | DoctorDetail | null;
  slot_id: string | null;
  slot_start_time: string | null;
  date: string | null;
  time: string | null;
  formData: PatientFormData;
}

const initialState: BookingState = {
  slot_id: null,
  doctor: null,
  date: null,
  time: null,
  slot_start_time: null,
  formData: {
    fullName: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    address: "",
    notes: "",
    type: "",
    followUpId: undefined,
  },
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setDoctor: (state, action: PayloadAction<Doctor | DoctorDetail>) => {
      state.doctor = action.payload;
    },
    setDate(state, action: PayloadAction<string>) {
      state.date = action.payload
      // reset slot khi đổi ngày
      state.slot_id = null
      state.time = null
    },
    setSlot(state, action: PayloadAction<TimeSlot>) {
      state.slot_id = action.payload.id;
      state.time = action.payload.time;
      state.slot_start_time = action.payload.startTime;
    },
    setFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetBooking: () => initialState,
  },
});

export const { setDoctor, setDate, setSlot, setFormData, resetBooking } =
  bookingSlice.actions;
export default bookingSlice.reducer;