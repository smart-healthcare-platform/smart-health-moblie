import { AppointmentStatus, AppointmentType, PaymentStatus } from '../types/appointment-enums';

/**
 * Map AppointmentStatus enum to Vietnamese label
 */
export const getStatusLabel = (status: AppointmentStatus): string => {
  const statusMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: 'Chờ xác nhận',
    [AppointmentStatus.CONFIRMED]: 'Đã xác nhận',
    [AppointmentStatus.IN_PROGRESS]: 'Đang khám',
    [AppointmentStatus.COMPLETED]: 'Hoàn thành',
    [AppointmentStatus.CANCELLED]: 'Đã hủy',
    [AppointmentStatus.NO_SHOW]: 'Không đến',
    [AppointmentStatus.CHECKED_IN]: 'Đã check-in',
  };
  return statusMap[status] || status;
};

/**
 * Map AppointmentStatus to color for UI
 */
export const getStatusColor = (status: AppointmentStatus): string => {
  const colorMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: '#f59e0b',
    [AppointmentStatus.CONFIRMED]: '#3b82f6',
    [AppointmentStatus.IN_PROGRESS]: '#8b5cf6',
    [AppointmentStatus.COMPLETED]: '#10b981',
    [AppointmentStatus.CANCELLED]: '#ef4444',
    [AppointmentStatus.NO_SHOW]: '#6b7280',
    [AppointmentStatus.CHECKED_IN]: '#06b6d4',
  };
  return colorMap[status] || '#9ca3af';
};

/**
 * Map AppointmentType enum to Vietnamese label
 */
export const getTypeLabel = (type: AppointmentType): string => {
  const typeMap: Record<AppointmentType, string> = {
    [AppointmentType.ONLINE]: 'Khám online',
    [AppointmentType.OFFLINE]: 'Khám tại phòng khám',
  };
  return typeMap[type] || type;
};

/**
 * Map AppointmentType to color for UI
 */
export const getTypeColor = (type: AppointmentType): string => {
  const colorMap: Record<AppointmentType, string> = {
    [AppointmentType.ONLINE]: '#3b82f6',
    [AppointmentType.OFFLINE]: '#10b981',
  };
  return colorMap[type] || '#9ca3af';
};

/**
 * Map PaymentStatus enum to Vietnamese label
 */
export const getPaymentStatusLabel = (status: PaymentStatus): string => {
  const statusMap: Record<PaymentStatus, string> = {
    [PaymentStatus.UNPAID]: 'Chưa thanh toán',
    [PaymentStatus.PENDING]: 'Đang xử lý',
    [PaymentStatus.PAID]: 'Đã thanh toán',
    [PaymentStatus.REFUNDED]: 'Đã hoàn tiền',
  };
  return statusMap[status] || status;
};

/**
 * Map PaymentStatus to color for UI
 */
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const colorMap: Record<PaymentStatus, string> = {
    [PaymentStatus.UNPAID]: '#ef4444',
    [PaymentStatus.PENDING]: '#f59e0b',
    [PaymentStatus.PAID]: '#10b981',
    [PaymentStatus.REFUNDED]: '#6b7280',
  };
  return colorMap[status] || '#9ca3af';
};

/**
 * Check if appointment can be cancelled
 */
export const canCancelAppointment = (status: AppointmentStatus): boolean => {
  return [
    AppointmentStatus.PENDING,
    AppointmentStatus.CONFIRMED,
  ].includes(status);
};

/**
 * Check if appointment can be checked in
 */
export const canCheckInAppointment = (status: AppointmentStatus): boolean => {
  return status === AppointmentStatus.CONFIRMED;
};

/**
 * Check if appointment requires payment
 */
export const requiresPayment = (
  status: AppointmentStatus,
  paymentStatus?: PaymentStatus
): boolean => {
  if (!paymentStatus) return false;
  
  return (
    [AppointmentStatus.CONFIRMED, AppointmentStatus.CHECKED_IN].includes(status) &&
    [PaymentStatus.UNPAID, PaymentStatus.PENDING].includes(paymentStatus)
  );
};

/**
 * Check if appointment can start chat with doctor
 */
export const canStartChat = (status: AppointmentStatus): boolean => {
  return [
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.CHECKED_IN,
    AppointmentStatus.IN_PROGRESS,
    AppointmentStatus.COMPLETED,
  ].includes(status);
};

/**
 * Format appointment date and time
 */
export const formatAppointmentDateTime = (startAt: string): { date: string; time: string } => {
  const date = new Date(startAt);
  
  const dateStr = date.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  
  const timeStr = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return { date: dateStr, time: timeStr };
};

/**
 * Get status configuration for UI rendering
 */
export const getStatusConfig = (status: AppointmentStatus) => {
  return {
    label: getStatusLabel(status),
    color: getStatusColor(status),
  };
};

/**
 * Get type configuration for UI rendering
 */
export const getTypeConfig = (type: AppointmentType) => {
  return {
    label: getTypeLabel(type),
    color: getTypeColor(type),
  };
};