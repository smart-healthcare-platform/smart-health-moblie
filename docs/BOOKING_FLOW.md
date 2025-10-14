# Booking Flow - Mobile Implementation

## 📋 Tổng quan

Luồng đặt lịch khám bệnh được triển khai hoàn chỉnh cho mobile app, đồng bộ 100% với website về logic và UI/UX được tối ưu cho trải nghiệm mobile.

## 🎯 Cấu trúc luồng (4 Steps)

```
booking.tsx (Main Container)
├── step-1.tsx → Chọn bác sĩ
├── step-2.tsx → Chọn ngày & giờ khám
├── step-3.tsx → Thông tin bệnh nhân
└── step-4.tsx → Xác nhận & Submit
```

## 🔄 Redux State Management

```typescript
BookingState {
  doctor: Doctor | DoctorDetail | null
  slot_id: string | null
  slot_start_time: string | null
  date: string | null
  time: string | null
  formData: PatientFormData
}
```

### Actions sử dụng:
- `setDoctor(doctor)` - Set bác sĩ được chọn
- `setDate(isoString)` - Set ngày khám (reset slot)
- `setSlot(timeSlot)` - Set slot ID, time, start_time
- `setFormData(data)` - Update form data
- `resetBooking()` - Reset toàn bộ state

## 📱 Chi tiết từng Step

### Step 1: Chọn bác sĩ (`step-1.tsx`)

**Features:**
- ✅ Search với debounce (500ms)
- ✅ List bác sĩ với pagination (limit 20)
- ✅ Selected state highlighting (green border + badge)
- ✅ Avatar placeholder fallback
- ✅ Display: name, specialty, degree, experience years

**Redux Actions:** `setDoctor`

**API:** `doctorService.getPublicDoctors(page, limit, search)`

---

### Step 2: Chọn ngày & giờ (`step-2.tsx`)

**Features:**
- ✅ `react-native-calendars` với marked dates
- ✅ Chỉ hiện ngày bác sĩ có lịch (green dots)
- ✅ Time slot grid với status colors:
  - 🟢 Available (green)
  - 🔴 Booked (red)
  - 🟡 Off (yellow)
  - ⚫ Expired (gray)
- ✅ Selected state cho slot
- ✅ Legend giải thích màu sắc

**Redux Actions:** `setDate`, `setSlot`

**API:** `doctorService.getDoctorSlots(doctorId)`

**Logic:**
1. Fetch tất cả slots của bác sĩ
2. Extract available dates
3. Filter slots theo ngày được chọn
4. Sort theo time
5. Display với colors theo status

---

### Step 3: Thông tin bệnh nhân (`step-3.tsx`)

**Features:**
- ✅ Auto-fill từ `user.profile` (auth state)
- ✅ Readonly fields: fullName, phone, birthDate, gender, address
- ✅ Editable field: notes (multiline textarea)
- ✅ Info box hướng dẫn update profile
- ✅ Icons cho mỗi field

**Redux Actions:** `setFormData`

**Validation:** Check required fields trước khi next
- fullName, phone, birthDate, gender phải có

---

### Step 4: Xác nhận & Submit (`step-4.tsx`)

**Features:**
- ✅ Summary cards:
  - Doctor info với avatar
  - Date & Time với icons
  - Patient info full details
- ✅ Warning box (đến đúng giờ)
- ✅ Read-only display
- ✅ Format dates theo locale vi-VN

**Submit Action:** Gọi `appointmentService.create(payload)`

**Payload Structure:**
```typescript
{
  doctorId: string
  slotId: string
  userId: string
  date: ISO string
  type: "Khám bệnh"
  notes: string
  doctorName: string
  startAt: ISO string
}
```

---

## 🎨 UI/UX Design Principles

### Timeline Stepper
- 4 circles với icons
- Active: green background
- Completed: darker green
- Inactive: gray
- Connecting lines between steps

### Color Scheme
- Primary: `#10b981` (Emerald 500)
- Dark: `#059669` (Emerald 600)
- Light: `#d1fae5` (Emerald 100)
- Success: Green gradient
- Error: Red tones

### Components
- **Cards:** White background, rounded 12px, shadow elevation 2
- **Buttons:** 
  - Next: Green gradient, white text
  - Disabled: Gray background
  - Loading: ActivityIndicator
- **Inputs:** 
  - Editable: White bg, border
  - Readonly: Gray bg, no interaction

### Typography
- Title: 22px, bold
- Subtitle: 14px, gray
- Card title: 16px, semibold
- Body text: 14-15px

---

## 🔐 Auth & Validation

### Login Required
- Steps 3-4 require `user` to be logged in
- Step 3 auto-fills from `user.profile`
- Check `user.role === 'PATIENT'`

### Validation Logic
```typescript
canProceed() {
  Step 1: !!doctor
  Step 2: !!slot_id && !!slot_start_time && !!date
  Step 3: fullName && phone && birthDate && gender
  Step 4: true (always can confirm if reached)
}
```

---

## 📡 API Integration

### Endpoints Used
1. `GET /public/doctors` - List doctors với search/pagination
2. `GET /public/doctors/appointment-slots/:doctorId` - Get available slots
3. `POST /appointments` - Create appointment (authenticated)

### Error Handling
- Network errors: Alert dialog
- Validation errors: Disabled next button
- Success: Modal → Navigate to appointment-history

---

## 🚀 Navigation Flow

```
Doctors List (doctors.tsx)
  → Click "Đặt lịch" 
  → setDoctor() → navigate('/booking')

Doctor Detail (doctors/[id].tsx)
  → Click "Đặt lịch khám"
  → setDoctor() → navigate('/booking')

Booking (booking.tsx)
  → Step 1-4 progression
  → Success → navigate('/appointment-history')
  → Back from Step 1 → router.back()
```

---

## ✨ Key Features

1. **State Persistence:** Redux persists state across steps
2. **Back Navigation:** Can go back and edit previous steps
3. **Smart Validation:** Disable next button if required data missing
4. **Auto-fill:** Patient info từ profile giảm nhập liệu
5. **Visual Feedback:** 
   - Loading states
   - Selected states
   - Success/Error modals
6. **Responsive:** Optimized cho mobile screen sizes
7. **Accessibility:** Icons + text labels cho clarity

---

## 🐛 Known Issues & Future Enhancements

### Potential Issues:
- [ ] Timezone handling (currently uses ISO strings)
- [ ] Calendar locale - cần configure vi-VN
- [ ] Slot refresh sau khi book (cần invalidate cache)

### Enhancements:
- [ ] Add payment integration
- [ ] Add appointment reminders
- [ ] Add rescheduling flow
- [ ] Add cancellation flow
- [ ] Add favorites doctors
- [ ] Add slot availability notifications

---

## 📦 Dependencies

```json
{
  "react-native-calendars": "^1.x",
  "expo-linear-gradient": "^x",
  "@reduxjs/toolkit": "^x",
  "react-redux": "^x",
  "expo-router": "^x",
  "lucide-react-native": "^x"
}
```

---

## 🧪 Testing Checklist

- [ ] Step 1: Search doctors, select doctor
- [ ] Step 2: Select date, select time slot
- [ ] Step 3: View auto-filled info, add notes
- [ ] Step 4: Review summary, confirm booking
- [ ] Success modal appears, navigates to history
- [ ] Back navigation works from any step
- [ ] Error handling (network, validation)
- [ ] Redux state persists across steps
- [ ] UI responds to loading states

---

## 💡 Tips for Developers

1. **Debug Redux:** Use Redux DevTools để track state changes
2. **Test API:** Check Network tab for API responses
3. **Test Slots:** Ensure backend returns correct slot statuses
4. **Profile Data:** Ensure user profile has all required fields
5. **Dates:** Check timezone conversions carefully

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. User đã login chưa?
2. Profile có đầy đủ info chưa?
3. Doctor có slots available không?
4. Network connection ổn định không?
5. Redux state được update đúng không?
