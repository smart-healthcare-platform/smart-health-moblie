# 🚀 Kế hoạch Refactor Booking Flow - Mobile

## Mục tiêu

Cải tiến booking flow của mobile app để:
1. ✅ **Bảo mật**: Thêm auth guard như website
2. ✅ **Maintainability**: Tách component, extract hooks
3. ✅ **Consistency**: Đồng bộ logic với website
4. ✅ **UX**: Pagination, validation, error handling

---

## 📋 Overview các thay đổi

### Phase 1: Component Extraction (2-3 giờ)
- Tách component từ step files
- Tạo thư mục `app/booking/components/`
- Move styles sang component files

### Phase 2: Auth Guard (1 giờ)
- Tạo HOC `withPatientRole`
- Apply cho Step 3 & 4

### Phase 3: Custom Hooks (1-2 giờ)
- Extract `useDoctors`
- Extract `useTimeSlots`

### Phase 4: Pagination & Validation (1 giờ)
- Implement pagination cho Step 1
- Add validation logic

### Phase 5: Error Handling (1 giờ)
- Error states cho mọi API calls
- Retry mechanism

---

## 📁 Cấu trúc file mới

```
app/booking/
├── components/
│   ├── doctor/
│   │   ├── DoctorList.tsx           # [NEW] FlatList logic
│   │   ├── DoctorCard.tsx           # [NEW] Single doctor item
│   │   └── DoctorSearch.tsx         # [NEW] Search bar
│   ├── slot/
│   │   ├── CalendarView.tsx         # [NEW] Wrapper cho react-native-calendars
│   │   ├── TimeSlotGrid.tsx         # [NEW] Time slots grid
│   │   └── TimeSlotLegend.tsx       # [NEW] Color legend
│   ├── form/
│   │   ├── PatientInfoForm.tsx      # [NEW] Form fields
│   │   └── BookingSummaryCard.tsx   # [NEW] Summary display
│   └── common/
│       ├── LoadingState.tsx         # [NEW] Loading spinner
│       └── ErrorState.tsx           # [NEW] Error display
├── hooks/
│   ├── useDoctors.ts                # [NEW] Fetch & pagination
│   ├── useTimeSlots.ts              # [NEW] Slot filtering
│   └── useBookingValidation.ts      # [NEW] Validation logic
├── hocs/
│   └── withPatientRole.tsx          # [NEW] Auth guard
├── step-1.tsx                       # [REFACTOR] ~50 lines
├── step-2.tsx                       # [REFACTOR] ~50 lines
├── step-3.tsx                       # [REFACTOR] ~30 lines
└── step-4.tsx                       # [REFACTOR] ~30 lines
```

---

## 🔧 Chi tiết Implementation

## Phase 1: Component Extraction

### 1.1. Tạo DoctorList Component

**File**: `app/booking/components/doctor/DoctorList.tsx`

```tsx
import React from 'react';
import { FlatList, ActivityIndicator, View, Text } from 'react-native';
import { Doctor } from '@/types';
import DoctorCard from './DoctorCard';

interface DoctorListProps {
  doctors: Doctor[];
  loading: boolean;
  selectedDoctor: Doctor | null;
  onDoctorSelect: (doctor: Doctor) => void;
}

export default function DoctorList({
  doctors,
  loading,
  selectedDoctor,
  onDoctorSelect,
}: DoctorListProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Đang tải danh sách bác sĩ...</Text>
      </View>
    );
  }

  if (doctors.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không tìm thấy bác sĩ nào</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={doctors}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <DoctorCard
          doctor={item}
          isSelected={selectedDoctor?.id === item.id}
          onSelect={onDoctorSelect}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContent: {
    paddingBottom: 16,
  },
});
```

---

### 1.2. Tạo DoctorCard Component

**File**: `app/booking/components/doctor/DoctorCard.tsx`

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { User, HeartPulse, Shield, Calendar } from 'lucide-react-native';
import { Doctor } from '@/types';

interface DoctorCardProps {
  doctor: Doctor;
  isSelected: boolean;
  onSelect: (doctor: Doctor) => void;
}

export default function DoctorCard({ doctor, isSelected, onSelect }: DoctorCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={() => onSelect(doctor)}
    >
      <View style={styles.header}>
        {doctor.avatar ? (
          <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <User size={28} color="#10b981" />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{doctor.display_name || doctor.full_name}</Text>
          
          <View style={styles.infoRow}>
            <HeartPulse size={14} color="#ef4444" />
            <Text style={styles.specialty}>{doctor.specialty}</Text>
          </View>
          
          {doctor.degree && (
            <View style={styles.infoRow}>
              <Shield size={14} color="#2563eb" />
              <Text style={styles.degree}>{doctor.degree}</Text>
            </View>
          )}
          
          {doctor.experience_years && (
            <View style={styles.infoRow}>
              <Calendar size={14} color="#059669" />
              <Text style={styles.experience}>{doctor.experience_years} năm KN</Text>
            </View>
          )}
        </View>
      </View>

      {isSelected && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedBadgeText}>✓ Đã chọn</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  header: {
    flexDirection: 'row',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#d1fae5',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#ef4444',
  },
  degree: {
    fontSize: 13,
    color: '#2563eb',
  },
  experience: {
    fontSize: 13,
    color: '#059669',
  },
  selectedBadge: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#10b981',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});
```

---

### 1.3. Tạo DoctorSearch Component

**File**: `app/booking/components/doctor/DoctorSearch.tsx`

```tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface DoctorSearchProps {
  value: string;
  onChange: (text: string) => void;
}

export default function DoctorSearch({ value, onChange }: DoctorSearchProps) {
  return (
    <View style={styles.container}>
      <Search size={20} color="#6b7280" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm bác sĩ..."
        value={value}
        onChangeText={onChange}
        placeholderTextColor="#9ca3af"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange('')} style={styles.clearButton}>
          <X size={20} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  clearButton: {
    padding: 4,
  },
});
```

---

### 1.4. Tạo Pagination Component

**File**: `app/booking/components/common/Pagination.tsx`

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !canGoPrev && styles.buttonDisabled]}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
      >
        <ChevronLeft size={20} color={canGoPrev ? '#10b981' : '#d1d5db'} />
        <Text style={[styles.buttonText, !canGoPrev && styles.buttonTextDisabled]}>
          Trước
        </Text>
      </TouchableOpacity>

      <View style={styles.pageInfo}>
        <Text style={styles.pageText}>
          Trang <Text style={styles.pageNumber}>{currentPage}</Text> / {totalPages}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !canGoNext && styles.buttonDisabled]}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        <Text style={[styles.buttonText, !canGoNext && styles.buttonTextDisabled]}>
          Sau
        </Text>
        <ChevronRight size={20} color={canGoNext ? '#10b981' : '#d1d5db'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
    gap: 4,
  },
  buttonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  buttonTextDisabled: {
    color: '#9ca3af',
  },
  pageInfo: {
    paddingHorizontal: 12,
  },
  pageText: {
    fontSize: 14,
    color: '#6b7280',
  },
  pageNumber: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
});
```

---

## Phase 2: Auth Guard

### 2.1. Tạo HOC withPatientRole

**File**: `app/booking/hocs/withPatientRole.tsx`

```tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '@/redux';

export function withPatientRole<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
      // Redirect nếu không phải PATIENT
      if (!user || user.role !== 'PATIENT') {
        router.replace('/login');
      }
    }, [user]);

    // Loading state trong khi kiểm tra
    if (!user) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.text}>Đang kiểm tra quyền truy cập...</Text>
        </View>
      );
    }

    // Chỉ render component khi đã xác thực
    if (user.role !== 'PATIENT') {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>
            ⚠️ Bạn cần đăng nhập với tài khoản bệnh nhân để đặt lịch
          </Text>
        </View>
      );
    }

    return <Component {...props} />;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
  },
});
```

---

## Phase 3: Custom Hooks

### 3.1. useDoctors Hook

**File**: `app/booking/hooks/useDoctors.ts`

```tsx
import { useState, useEffect, useCallback } from 'react';
import { doctorService } from '@/services/doctor.service';
import { Doctor } from '@/types';
import useDebounce from '@/hooks/useDebounce';

export function useDoctors(search: string) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  const debouncedSearch = useDebounce(search, 500);
  const ITEMS_PER_PAGE = 6;

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await doctorService.getPublicDoctors(
        currentPage,
        ITEMS_PER_PAGE,
        debouncedSearch.trim()
      );
      
      setDoctors(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Reset về trang 1 khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  return {
    doctors,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    retry: fetchDoctors,
  };
}
```

---

### 3.2. useTimeSlots Hook

**File**: `app/booking/hooks/useTimeSlots.ts`

```tsx
import { useState, useEffect } from 'react';
import { doctorService } from '@/services/doctor.service';
import { TimeSlot } from '@/types';

export function useTimeSlots(doctorId: string | undefined, selectedDate: string | null) {
  const [allSlots, setAllSlots] = useState<TimeSlot[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all slots khi doctor thay đổi
  useEffect(() => {
    if (!doctorId) {
      setAllSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const slots = await doctorService.getDoctorSlots(doctorId);
        setAllSlots(slots);
      } catch (err) {
        console.error('Failed to fetch slots:', err);
        setError('Không thể tải lịch khám. Vui lòng thử lại.');
        setAllSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [doctorId]);

  // Filter slots theo ngày đã chọn
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }

    const dateOnly = selectedDate.split('T')[0];
    const filtered = allSlots
      .filter((s) => s.date === dateOnly)
      .sort((a, b) => a.time.localeCompare(b.time));

    setTimeSlots(filtered);
  }, [selectedDate, allSlots]);

  // Extract available dates
  const availableDates = Array.from(new Set(allSlots.map((s) => s.date)));

  return {
    timeSlots,
    loading,
    error,
    availableDates,
    retry: () => {
      // Trigger re-fetch by clearing and resetting
      setAllSlots([]);
    },
  };
}
```

---

### 3.3. useBookingValidation Hook

**File**: `app/booking/hooks/useBookingValidation.ts`

```tsx
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';

export function useBookingValidation() {
  const { doctor, date, slot_id, formData } = useSelector(
    (state: RootState) => state.booking
  );

  const canGoToStep2 = !!doctor;
  
  const canGoToStep3 = !!doctor && !!date && !!slot_id;
  
  const canGoToStep4 = 
    !!doctor &&
    !!date &&
    !!slot_id &&
    !!formData.fullName &&
    !!formData.phone &&
    !!formData.birthDate &&
    !!formData.gender;

  const canSubmitBooking = canGoToStep4;

  return {
    canGoToStep2,
    canGoToStep3,
    canGoToStep4,
    canSubmitBooking,
  };
}
```

---

## Phase 4: Refactor Step Files

### 4.1. Refactor step-1.tsx

**File**: `app/booking/step-1.tsx` (NEW VERSION)

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setDoctor } from '@/redux/slices/bookingSlice';
import { RootState } from '@/redux';
import { Doctor } from '@/types';

// Import components
import DoctorSearch from './components/doctor/DoctorSearch';
import DoctorList from './components/doctor/DoctorList';
import Pagination from './components/common/Pagination';
import ErrorState from './components/common/ErrorState';

// Import hooks
import { useDoctors } from './hooks/useDoctors';

export default function DoctorSelectionStep() {
  const dispatch = useDispatch();
  const { doctor: selectedDoctor } = useSelector((state: RootState) => state.booking);
  
  const [search, setSearch] = useState('');
  
  const {
    doctors,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    retry,
  } = useDoctors(search);

  const handleSelectDoctor = (doctor: Doctor) => {
    dispatch(setDoctor(doctor));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn bác sĩ</Text>
      <Text style={styles.subtitle}>Tìm kiếm và chọn bác sĩ phù hợp với bạn</Text>

      <DoctorSearch value={search} onChange={setSearch} />

      {error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : (
        <>
          <DoctorList
            doctors={doctors}
            loading={loading}
            selectedDoctor={selectedDoctor}
            onDoctorSelect={handleSelectDoctor}
          />
          
          {!loading && doctors.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
});
```

**Kết quả**: Giảm từ 283 lines → ~50 lines ✅

---

### 4.2. Apply Auth Guard cho step-3.tsx

**File**: `app/booking/step-3.tsx` (UPDATE)

```tsx
import React, { useEffect } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { User, Phone, Calendar, MapPin, FileText } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData } from '@/redux/slices/bookingSlice';
import { RootState } from '@/redux';

// Import HOC
import { withPatientRole } from './hocs/withPatientRole';

function PatientInfoStep() {
  // ... existing code ...
  
  useEffect(() => {
    if (user && user.role === 'PATIENT' && user.profile) {
      dispatch(setFormData({
        fullName: user.profile.fullName || '',
        birthDate: user.profile.dateOfBirth || '',
        gender: user.profile.gender || '',
        address: user.profile.address || '',
        phone: user.phone || '',
        type: 'Khám bệnh',  // ← THÊM FIELD NÀY
      }));
    }
  }, [user, dispatch]);

  // ... rest of component ...
}

// ← APPLY HOC
export default withPatientRole(PatientInfoStep);
```

---

### 4.3. Apply Auth Guard cho step-4.tsx

**File**: `app/booking/step-4.tsx` (UPDATE)

```tsx
import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
// ... existing imports ...

// Import HOC
import { withPatientRole } from './hocs/withPatientRole';

function BookingSummaryStep() {
  // ... existing code ...
}

// ← APPLY HOC
export default withPatientRole(BookingSummaryStep);
```

---

## Phase 5: Error Handling Components

### 5.1. ErrorState Component

**File**: `app/booking/components/common/ErrorState.tsx`

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <AlertCircle size={48} color="#ef4444" />
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <RefreshCw size={16} color="#fff" />
        <Text style={styles.retryText}>Thử lại</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
```

---

## 📊 Checklist thực hiện

### Phase 1: Components ⏱️ 2-3h
- [ ] Create `app/booking/components/doctor/DoctorList.tsx`
- [ ] Create `app/booking/components/doctor/DoctorCard.tsx`
- [ ] Create `app/booking/components/doctor/DoctorSearch.tsx`
- [ ] Create `app/booking/components/common/Pagination.tsx`
- [ ] Create `app/booking/components/common/ErrorState.tsx`
- [ ] Create `app/booking/components/common/LoadingState.tsx`

### Phase 2: Auth Guard ⏱️ 1h
- [ ] Create `app/booking/hocs/withPatientRole.tsx`
- [ ] Apply HOC to `step-3.tsx`
- [ ] Apply HOC to `step-4.tsx`
- [ ] Test auth redirect logic

### Phase 3: Hooks ⏱️ 1-2h
- [ ] Create `app/booking/hooks/useDoctors.ts`
- [ ] Create `app/booking/hooks/useTimeSlots.ts`
- [ ] Create `app/booking/hooks/useBookingValidation.ts`
- [ ] Test hooks logic

### Phase 4: Refactor Steps ⏱️ 1-2h
- [ ] Refactor `step-1.tsx` to use components & hooks
- [ ] Update `step-2.tsx` to use useTimeSlots
- [ ] Add `type` field to step-3 formData
- [ ] Test all steps flow

### Phase 5: Validation ⏱️ 1h
- [ ] Update `booking.tsx` to use `useBookingValidation`
- [ ] Disable "Next" button when validation fails
- [ ] Add visual feedback for disabled state
- [ ] Test edge cases

---

## 🎯 Expected Outcomes

### Before Refactor
- ❌ 283-375 lines per step file
- ❌ No auth guard
- ❌ No pagination (load 20 items)
- ❌ No error retry
- ❌ Code duplication

### After Refactor
- ✅ ~30-50 lines per step file
- ✅ Auth guard HOC
- ✅ Pagination (6 items/page)
- ✅ Error handling + retry
- ✅ Reusable components
- ✅ Custom hooks
- ✅ Consistent with website

---

## 🚨 Breaking Changes

### API Changes
**Không có** - Vẫn dùng chung services

### Redux Changes
**Nhỏ** - Thêm field `type: 'Khám bệnh'` vào formData

### Navigation Changes
**Không có** - Vẫn dùng Expo Router

### Dependencies
**Không cần thêm** - Chỉ refactor code hiện tại

---

## 📝 Testing Plan

### Unit Tests
- [ ] Test `useDoctors` hook
- [ ] Test `useTimeSlots` hook
- [ ] Test `useBookingValidation` hook
- [ ] Test `withPatientRole` HOC

### Integration Tests
- [ ] Test complete booking flow
- [ ] Test pagination navigation
- [ ] Test auth redirect
- [ ] Test error retry mechanism

### Manual Tests
- [ ] Search doctors
- [ ] Select doctor & navigate
- [ ] Select date & time
- [ ] Fill patient info (logged in)
- [ ] Confirm booking
- [ ] Try access step-3 without login

---

## 📚 Documentation Updates

- [ ] Update `BOOKING_FLOW.md`
- [ ] Add component documentation
- [ ] Add hook documentation
- [ ] Update README with new structure

---

**Ngày tạo**: 2024
**Ước tính thời gian**: 6-8 giờ
**Độ ưu tiên**: HIGH (P0)
