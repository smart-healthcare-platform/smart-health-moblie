export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
  CHECKED_IN = "CHECKED_IN",
}

export enum AppointmentType {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export enum AppointmentCategory {
  CONSULTATION = "CONSULTATION",
  FOLLOW_UP = "FOLLOW_UP",
  EMERGENCY = "EMERGENCY",
  CHECKUP = "CHECKUP",
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PENDING = "PENDING",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  MOMO = "MOMO",
  VNPAY = "VNPAY",
  CASH = "CASH",
}