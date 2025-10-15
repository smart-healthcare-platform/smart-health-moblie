import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/redux';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface StepValidation {
  step1: ValidationResult;
  step2: ValidationResult;
  step3: ValidationResult;
  step4: ValidationResult;
}

/**
 * Custom hook để validate booking data cho từng step
 * 
 * @returns {Object} validation - Object chứa validation cho mỗi step
 * @returns {Function} canProceedToStep - Function kiểm tra có thể next step không
 * @returns {Function} getValidationErrors - Get validation errors cho step hiện tại
 */
export function useBookingValidation() {
  const { doctor, slot_id, slot_start_time, formData, date } = useSelector(
    (state: RootState) => state.booking
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // Validate Step 1: Doctor Selection
  const step1Validation = useMemo((): ValidationResult => {
    const errors: string[] = [];

    if (!doctor) {
      errors.push('Vui lòng chọn bác sĩ');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [doctor]);

  // Validate Step 2: Date & Time Selection
  const step2Validation = useMemo((): ValidationResult => {
    const errors: string[] = [];

    if (!date) {
      errors.push('Vui lòng chọn ngày khám');
    }

    if (!slot_id) {
      errors.push('Vui lòng chọn giờ khám');
    }

    if (!slot_start_time) {
      errors.push('Thiếu thông tin thời gian khám');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [date, slot_id, slot_start_time]);

  // Validate Step 3: Patient Info
  const step3Validation = useMemo((): ValidationResult => {
    const errors: string[] = [];

    if (!formData.fullName || formData.fullName.trim() === '') {
      errors.push('Vui lòng nhập họ và tên');
    }

    if (!formData.phone || formData.phone.trim() === '') {
      errors.push('Vui lòng nhập số điện thoại');
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.push('Số điện thoại không hợp lệ (10-11 số)');
    }

    if (!formData.birthDate) {
      errors.push('Vui lòng nhập ngày sinh');
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 0 || age > 150) {
        errors.push('Ngày sinh không hợp lệ');
      }
    }

    if (!formData.gender) {
      errors.push('Vui lòng chọn giới tính');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [formData]);

  // Validate Step 4: Booking Summary (Final validation)
  const step4Validation = useMemo((): ValidationResult => {
    const errors: string[] = [];

    // Kiểm tra tất cả step trước đó đã valid
    if (!step1Validation.isValid) {
      errors.push(...step1Validation.errors);
    }

    if (!step2Validation.isValid) {
      errors.push(...step2Validation.errors);
    }

    if (!step3Validation.isValid) {
      errors.push(...step3Validation.errors);
    }

    // Kiểm tra user đã đăng nhập
    if (!user) {
      errors.push('Bạn cần đăng nhập để đặt lịch');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [step1Validation, step2Validation, step3Validation, user]);

  // Tổng hợp validation cho tất cả steps
  const validation: StepValidation = useMemo(() => ({
    step1: step1Validation,
    step2: step2Validation,
    step3: step3Validation,
    step4: step4Validation,
  }), [step1Validation, step2Validation, step3Validation, step4Validation]);

  /**
   * Kiểm tra có thể proceed đến step tiếp theo không
   * @param currentStep - Step hiện tại (1-4)
   * @returns boolean
   */
  const canProceedToStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return step1Validation.isValid;
      case 2:
        return step2Validation.isValid;
      case 3:
        return step3Validation.isValid;
      case 4:
        return step4Validation.isValid;
      default:
        return false;
    }
  };

  /**
   * Lấy validation errors cho step hiện tại
   * @param currentStep - Step hiện tại (1-4)
   * @returns string[] - Array of error messages
   */
  const getValidationErrors = (currentStep: number): string[] => {
    switch (currentStep) {
      case 1:
        return step1Validation.errors;
      case 2:
        return step2Validation.errors;
      case 3:
        return step3Validation.errors;
      case 4:
        return step4Validation.errors;
      default:
        return [];
    }
  };

  /**
   * Kiểm tra toàn bộ booking data có valid không
   * @returns boolean
   */
  const isBookingValid = (): boolean => {
    return step1Validation.isValid &&
           step2Validation.isValid &&
           step3Validation.isValid &&
           step4Validation.isValid;
  };

  return {
    validation,
    canProceedToStep,
    getValidationErrors,
    isBookingValid,
  };
}
