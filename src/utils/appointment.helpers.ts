import { AppointmentStatus, AppointmentType, AppointmentCategory } from '../types/appointment';

/**
 * Helper functions for displaying appointment data in Vietnamese
 */

/**
 * Chuyển đổi AppointmentStatus sang tiếng Việt
 */
export const getStatusDisplayText = (status: AppointmentStatus | string): string => {
  const statusMap: Record<string, string> = {
    [AppointmentStatus.PENDING]: 'Chờ xác nhận',
    [AppointmentStatus.CONFIRMED]: 'Đã xác nhận',
    [AppointmentStatus.CHECKED_IN]: 'Đã check-in',
    [AppointmentStatus.IN_PROGRESS]: 'Đang khám',
    [AppointmentStatus.COMPLETED]: 'Hoàn thành',
    [AppointmentStatus.CANCELLED]: 'Đã hủy',
    [AppointmentStatus.NO_SHOW]: 'Không đến',
  };
  
  return statusMap[status] || status;
};

/**
 * Lấy màu sắc cho từng trạng thái
 */
export const getStatusColor = (status: AppointmentStatus | string): string => {
  const colorMap: Record<string, string> = {
    [AppointmentStatus.PENDING]: '#f59e0b', // amber
    [AppointmentStatus.CONFIRMED]: '#3b82f6', // blue
    [AppointmentStatus.CHECKED_IN]: '#8b5cf6', // purple
    [AppointmentStatus.IN_PROGRESS]: '#06b6d4', // cyan
    [AppointmentStatus.COMPLETED]: '#10b981', // green
    [AppointmentStatus.CANCELLED]: '#ef4444', // red
    [AppointmentStatus.NO_SHOW]: '#6b7280', // gray
  };
  
  return colorMap[status] || '#6b7280';
};

/**
 * Lấy background color (lighter version) cho status badge
 */
export const getStatusBackgroundColor = (status: AppointmentStatus | string): string => {
  const colorMap: Record<string, string> = {
    [AppointmentStatus.PENDING]: '#fef3c7', // amber-100
    [AppointmentStatus.CONFIRMED]: '#dbeafe', // blue-100
    [AppointmentStatus.CHECKED_IN]: '#ede9fe', // purple-100
    [AppointmentStatus.IN_PROGRESS]: '#cffafe', // cyan-100
    [AppointmentStatus.COMPLETED]: '#d1fae5', // green-100
    [AppointmentStatus.CANCELLED]: '#fee2e2', // red-100
    [AppointmentStatus.NO_SHOW]: '#f3f4f6', // gray-100
  };
  
  return colorMap[status] || '#f3f4f6';
};

/**
 * Chuyển đổi AppointmentType sang tiếng Việt
 */
export const getTypeDisplayText = (type: AppointmentType | string): string => {
  const typeMap: Record<string, string> = {
    [AppointmentType.ONLINE]: 'Trực tuyến',
    [AppointmentType.OFFLINE]: 'Tại phòng khám',
  };
  
  return typeMap[type] || type;
};

/**
 * Chuyển đổi AppointmentCategory sang tiếng Việt
 */
export const getCategoryDisplayText = (category: AppointmentCategory | string): string => {
  const categoryMap: Record<string, string> = {
    [AppointmentCategory.NEW]: 'Khám bệnh',
    [AppointmentCategory.FOLLOW_UP]: 'Tái khám',
  };
  
  return categoryMap[category] || category;
};

/**
 * Chuyển đổi PaymentStatus sang tiếng Việt
 */
export const getPaymentStatusDisplayText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'UNPAID': 'Chưa thanh toán',
    'PENDING': 'Đang xử lý',
    'PAID': 'Đã thanh toán',
    'REFUNDED': 'Đã hoàn tiền',
  };
  
  return statusMap[status] || status;
};

/**
 * Lấy màu cho payment status
 */
export const getPaymentStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'UNPAID': '#ef4444', // red
    'PENDING': '#f59e0b', // amber
    'PAID': '#10b981', // green
    'REFUNDED': '#6b7280', // gray
  };
  
  return colorMap[status] || '#6b7280';
};

/**
 * Format giá tiền VND
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format ngày giờ hiển thị
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Format chỉ ngày
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Format chỉ giờ
 */
export const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Kiểm tra appointment có thể cancel không
 */
export const canCancelAppointment = (
  status: AppointmentStatus | string,
  startAt: string
): boolean => {
  // Không thể cancel nếu đã hoàn thành, đã hủy, hoặc no-show
  const nonCancellableStatuses = [
    AppointmentStatus.COMPLETED,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.NO_SHOW,
  ];
  
  if (nonCancellableStatuses.includes(status as AppointmentStatus)) {
    return false;
  }
  
  // Không thể cancel nếu quá thời gian (ví dụ: trong vòng 2 giờ trước giờ hẹn)
  try {
    const appointmentTime = new Date(startAt).getTime();
    const now = new Date().getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    
    return appointmentTime - now > twoHoursInMs;
  } catch {
    return false;
  }
};

/**
 * Kiểm tra appointment có thể reschedule không
 */
export const canRescheduleAppointment = (
  status: AppointmentStatus | string,
  startAt: string
): boolean => {
  // Chỉ có thể reschedule appointment pending hoặc confirmed
  const rescheduleableStatuses = [
    AppointmentStatus.PENDING,
    AppointmentStatus.CONFIRMED,
  ];
  
  if (!rescheduleableStatuses.includes(status as AppointmentStatus)) {
    return false;
  }
  
  // Không thể reschedule nếu quá gần giờ hẹn
  try {
    const appointmentTime = new Date(startAt).getTime();
    const now = new Date().getTime();
    const fourHoursInMs = 4 * 60 * 60 * 1000;
    
    return appointmentTime - now > fourHoursInMs;
  } catch {
    return false;
  }
};

/**
 * Kiểm tra có thể tạo conversation với bác sĩ không
 */
export const canMessageDoctor = (status: AppointmentStatus | string): boolean => {
  // Có thể nhắn tin khi appointment đã confirmed trở đi
  const messageableStatuses = [
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.CHECKED_IN,
    AppointmentStatus.IN_PROGRESS,
    AppointmentStatus.COMPLETED,
  ];
  
  return messageableStatuses.includes(status as AppointmentStatus);
};

/**
 * Lấy thông báo phù hợp cho từng trạng thái
 */
export const getStatusMessage = (status: AppointmentStatus | string): string => {
  const messageMap: Record<string, string> = {
    [AppointmentStatus.PENDING]: 'Vui lòng đợi xác nhận từ phòng khám',
    [AppointmentStatus.CONFIRMED]: 'Lịch hẹn đã được xác nhận. Vui lòng đến đúng giờ',
    [AppointmentStatus.CHECKED_IN]: 'Bạn đã check-in. Vui lòng chờ đến lượt khám',
    [AppointmentStatus.IN_PROGRESS]: 'Bác sĩ đang khám bệnh',
    [AppointmentStatus.COMPLETED]: 'Lịch khám đã hoàn thành',
    [AppointmentStatus.CANCELLED]: 'Lịch hẹn đã bị hủy',
    [AppointmentStatus.NO_SHOW]: 'Bạn đã không đến khám',
  };
  
  return messageMap[status] || '';
};

/**
 * Tính thời gian còn lại đến lịch hẹn
 */
export const getTimeUntilAppointment = (startAt: string): string => {
  try {
    const appointmentTime = new Date(startAt).getTime();
    const now = new Date().getTime();
    const diffMs = appointmentTime - now;
    
    if (diffMs < 0) {
      return 'Đã qua';
    }
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `Còn ${diffDays} ngày`;
    } else if (diffHours > 0) {
      return `Còn ${diffHours} giờ`;
    } else if (diffMinutes > 0) {
      return `Còn ${diffMinutes} phút`;
    } else {
      return 'Sắp tới';
    }
  } catch {
    return '';
  }
};

/**
 * Backward compatibility: Hỗ trợ old format từ app cũ
 */
export const getAppointmentTypeDisplay = (
  type: string, 
  category?: string
): string => {
  // Nếu type là tiếng Việt (old format) thì return luôn
  if (type === 'Khám bệnh' || type === 'Tái khám') {
    return type;
  }
  
  // Ưu tiên hiển thị category (NEW/FOLLOW_UP) nếu có
  if (category) {
    return getCategoryDisplayText(category);
  }
  
  // Fallback hiển thị type (ONLINE/OFFLINE)
  return getTypeDisplayText(type);
};