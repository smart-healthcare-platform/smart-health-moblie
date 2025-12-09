/**
 * Date Utility Functions
 * Handles date formatting without timezone conversion issues
 */

/**
 * Get current date in YYYY-MM-DD format using local timezone
 * Avoids timezone offset issues from new Date().toISOString()
 * 
 * @returns Date string in format "YYYY-MM-DD"
 * @example
 * getTodayDateString() // "2025-01-15"
 */
export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Convert Date object to YYYY-MM-DD format using local timezone
 * 
 * @param date - Date object to convert
 * @returns Date string in format "YYYY-MM-DD"
 * @example
 * formatDateToString(new Date()) // "2025-01-15"
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse date string (YYYY-MM-DD) to Date object at local midnight
 * Avoids timezone issues from new Date("2025-01-15") which creates UTC date
 * 
 * @param dateString - Date string in format "YYYY-MM-DD"
 * @returns Date object at local midnight
 * @example
 * parseDateString("2025-01-15") // Date object at 2025-01-15 00:00:00 local time
 */
export const parseDateString = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Check if a date string is today or in the future
 * 
 * @param dateString - Date string in format "YYYY-MM-DD"
 * @returns True if date is today or future, false if past
 * @example
 * isTodayOrFuture("2025-01-15") // true if today is <= 2025-01-15
 */
export const isTodayOrFuture = (dateString: string): boolean => {
  const todayStr = getTodayDateString();
  return dateString >= todayStr;
};

/**
 * Check if a date string is in the past
 * 
 * @param dateString - Date string in format "YYYY-MM-DD"
 * @returns True if date is in the past, false otherwise
 */
export const isPast = (dateString: string): boolean => {
  const todayStr = getTodayDateString();
  return dateString < todayStr;
};

/**
 * Format date string to Vietnamese display format
 * 
 * @param dateString - Date string in format "YYYY-MM-DD"
 * @returns Formatted date string like "15/01/2025"
 * @example
 * formatDateToVietnamese("2025-01-15") // "15/01/2025"
 */
export const formatDateToVietnamese = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

/**
 * Format date string to Vietnamese long format with weekday
 * 
 * @param dateString - Date string in format "YYYY-MM-DD"
 * @returns Formatted date string like "Thứ 2, 15/01/2025"
 * @example
 * formatDateToVietnameseLong("2025-01-15") // "Thứ 2, 15/01/2025"
 */
export const formatDateToVietnameseLong = (dateString: string): string => {
  const date = parseDateString(dateString);
  const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const weekday = weekdays[date.getDay()];
  return `${weekday}, ${formatDateToVietnamese(dateString)}`;
};

/**
 * Get date N days from today
 * 
 * @param days - Number of days to add (positive for future, negative for past)
 * @returns Date string in format "YYYY-MM-DD"
 * @example
 * getDateAfterDays(7) // Date 7 days from now
 * getDateAfterDays(-7) // Date 7 days ago
 */
export const getDateAfterDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDateToString(date);
};

/**
 * Extract date from ISO string or space-separated datetime string
 * Handles both formats:
 * - ISO: "2025-01-15T10:00:00.000Z"
 * - Space: "2025-01-15 10:00:00"
 * 
 * @param datetime - Datetime string
 * @returns Date string in format "YYYY-MM-DD"
 * @example
 * extractDateFromDatetime("2025-01-15T10:00:00.000Z") // "2025-01-15"
 * extractDateFromDatetime("2025-01-15 10:00:00") // "2025-01-15"
 */
export const extractDateFromDatetime = (datetime: string): string => {
  if (datetime.includes('T')) {
    return datetime.split('T')[0];
  }
  return datetime.split(' ')[0];
};

/**
 * Check if two date strings are the same day
 * 
 * @param date1 - First date string in format "YYYY-MM-DD"
 * @param date2 - Second date string in format "YYYY-MM-DD"
 * @returns True if same day, false otherwise
 */
export const isSameDay = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

/**
 * Get array of date strings between start and end dates (inclusive)
 * 
 * @param startDate - Start date string in format "YYYY-MM-DD"
 * @param endDate - End date string in format "YYYY-MM-DD"
 * @returns Array of date strings
 * @example
 * getDateRange("2025-01-15", "2025-01-17") // ["2025-01-15", "2025-01-16", "2025-01-17"]
 */
export const getDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = parseDateString(startDate);
  const end = parseDateString(endDate);
  
  const current = new Date(start);
  while (current <= end) {
    dates.push(formatDateToString(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};