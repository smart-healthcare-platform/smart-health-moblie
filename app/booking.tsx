import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  FileText,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react-native';
import { RootState } from '../src/redux';
import { resetBooking, setDate, setSlot, setFormData } from '../src/redux/slices/bookingSlice';
import { appointmentService } from '../src/services/appointment.service';
import { CreateAppointmentPayload } from '../src/types/appointment';
import { useBookingValidation } from '../hooks/booking/useBookingValidation';

// Lazy import components
const DoctorSelectionStep = require('./booking/step-1').default;
const DateTimeSelectionStep = require('./booking/step-2').default;
const PatientInfoStep = require('./booking/step-3').default;
const BookingSummaryStep = require('./booking/step-4').default;

const steps = [
  { id: 1, title: 'Chọn bác sĩ', icon: User },
  { id: 2, title: 'Chọn lịch', icon: CalendarIcon },
  { id: 3, title: 'Thông tin', icon: FileText },
  { id: 4, title: 'Xác nhận', icon: CheckCircle },
];

export default function BookingScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { doctor, slot_id, slot_start_time, formData, date } = useSelector(
    (state: RootState) => state.booking
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // 🎯 Use validation hook
  const { canProceedToStep, getValidationErrors, isBookingValid } = useBookingValidation();

  // Reset booking khi vào màn hình
  useEffect(() => {
    dispatch(resetBooking());
  }, []);

  // Kiểm tra có thể next step không - Sử dụng hook
  const canProceed = () => {
    return canProceedToStep(currentStep);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      // Validate trước khi next
      if (!canProceed()) {
        const errors = getValidationErrors(currentStep);
        Alert.alert('Thông tin chưa đầy đủ', errors.join('\\n'));
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleConfirmBooking = async () => {
    // Validate toàn bộ booking data trước khi submit
    if (!isBookingValid()) {
      const errors = getValidationErrors(4);
      Alert.alert('Lỗi', errors.join('\\n'));
      return;
    }

    if (!doctor || !slot_id || !slot_start_time || !user) {
      Alert.alert('Lỗi', 'Thiếu thông tin đặt lịch');
      return;
    }

    setLoading(true);
    
    // Get patient info from user
    const patientId = user.referenceId || user.id;
    const patientName = formData.fullName || (user.role === 'PATIENT' && user.profile?.fullName) || '';
    
    // Validate patient name is provided
    if (!patientName || patientName.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên bệnh nhân');
      setLoading(false);
      return;
    }
    
    // Map Vietnamese category labels to backend enums
    const appointmentCategory = formData.type === 'Tái khám' ? 'FOLLOW_UP' : 'NEW';
    
    const payload: CreateAppointmentPayload = {
      doctorId: doctor.id,
      doctorName: doctor.display_name || doctor.full_name,
      slotId: slot_id,
      startAt: slot_start_time,
      patientId: patientId,
      patientName: patientName,
      type: 'OFFLINE', // Mobile app only supports offline appointments
      category: appointmentCategory,
      notes: formData.notes || '',
      followUpId: formData.followUpId,
    };

    console.log('=== Booking Payload ===');
    console.log('Doctor:', { id: doctor.id, name: doctor.display_name || doctor.full_name });
    console.log('Patient:', { id: patientId, name: patientName });
    console.log('Slot:', { id: slot_id, startAt: slot_start_time });
    console.log('Full payload:', JSON.stringify(payload, null, 2));
    console.log('=====================');

    try {
      await appointmentService.create(payload);
      dispatch(resetBooking());
      setSuccessModalVisible(true);
    } catch (err: any) {
      console.error('=== Booking Error Details ===');
      console.error('Error:', err);
      console.error('Response status:', err.response?.status);
      console.error('Response data:', JSON.stringify(err.response?.data, null, 2));
      console.error('Response headers:', err.response?.headers);
      console.error('Request payload was:', JSON.stringify(payload, null, 2));
      console.error('============================');
      
      // Enhanced error messages
      let errorTitle = 'Lỗi đặt lịch';
      let errorMessage = 'Đặt lịch thất bại. Vui lòng thử lại.';
      
      if (err.response?.status === 409) {
        errorTitle = 'Lịch đã được đặt';
        errorMessage = 'Khung giờ này đã có người đặt. Vui lòng chọn giờ khác.';
      } else if (err.response?.status === 400) {
        errorTitle = 'Thông tin không hợp lệ';
        errorMessage = err.response?.data?.message || 'Vui lòng kiểm tra lại thông tin.';
      } else if (err.response?.status === 401) {
        errorTitle = 'Phiên đăng nhập hết hạn';
        errorMessage = 'Vui lòng đăng nhập lại để tiếp tục.';
      } else if (err.response?.status === 500) {
        errorTitle = 'Lỗi server';
        errorMessage = 'Server đang gặp sự cố. Vui lòng thử lại sau ít phút.';
      } else if (err.message?.includes('timeout')) {
        errorTitle = 'Timeout';
        errorMessage = 'Kết nối bị timeout. Vui lòng kiểm tra mạng và thử lại.';
      } else if (err.message?.includes('Network')) {
        errorTitle = 'Lỗi mạng';
        errorMessage = 'Không thể kết nối. Vui lòng kiểm tra internet.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      Alert.alert(errorTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    router.push('/appointment-history');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <DoctorSelectionStep />;
      case 2:
        return <DateTimeSelectionStep />;
      case 3:
        return <PatientInfoStep />;
      case 4:
        return <BookingSummaryStep />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#10b981', '#059669']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt lịch khám</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* Timeline Steps */}
      <View style={styles.timeline}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <View key={step.id} style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineCircle,
                  isActive && styles.timelineCircleActive,
                  isCompleted && styles.timelineCircleCompleted,
                ]}
              >
                <Icon
                  size={16}
                  color={isActive || isCompleted ? '#fff' : '#9ca3af'}
                />
              </View>
              <Text
                style={[
                  styles.timelineText,
                  (isActive || isCompleted) && styles.timelineTextActive,
                ]}
              >
                {step.title}
              </Text>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    isCompleted && styles.timelineLineCompleted,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {currentStep < 4 ? (
          <TouchableOpacity
            style={[
              styles.nextButton,
              !canProceed() && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!canProceed()}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 3 ? 'Xem lại thông tin' : 'Tiếp tục'}
            </Text>
            <ChevronRight size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
            onPress={handleConfirmBooking}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <CheckCircle size={20} color="#fff" />
                <Text style={styles.confirmButtonText}>Xác nhận đặt lịch</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <CheckCircle size={48} color="#10b981" />
            </View>
            <Text style={styles.modalTitle}>Đặt lịch thành công!</Text>
            <Text style={styles.modalText}>
              Yêu cầu đặt lịch đã được ghi nhận. Chúng tôi sẽ gửi thông báo sớm nhất đến bạn!
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSuccessClose}
            >
              <Text style={styles.modalButtonText}>Xem lịch hẹn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  timelineItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  timelineCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  timelineCircleActive: {
    backgroundColor: '#10b981',
  },
  timelineCircleCompleted: {
    backgroundColor: '#059669',
  },
  timelineText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  timelineTextActive: {
    color: '#10b981',
    fontWeight: '600',
  },
  timelineLine: {
    position: 'absolute',
    top: 16,
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: '#e5e7eb',
    zIndex: -1,
  },
  timelineLineCompleted: {
    backgroundColor: '#10b981',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  bottomActions: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
