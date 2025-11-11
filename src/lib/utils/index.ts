import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';

// Utility for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export const formatDate = (date: string | Date, format = 'MMM DD, YYYY') => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date, format = 'MMM DD, YYYY HH:mm') => {
  return dayjs(date).format(format);
};

export const formatRelativeTime = (date: string | Date) => {
  const now = dayjs();
  const target = dayjs(date);
  const diffInHours = now.diff(target, 'hour');

  if (diffInHours < 1) {
    const diffInMinutes = now.diff(target, 'minute');
    return diffInMinutes <= 1 ? 'just now' : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = now.diff(target, 'day');
    return diffInDays === 1 ? 'yesterday' : `${diffInDays} days ago`;
  }
};

// Currency formatting
export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Number formatting
export const formatNumber = (num: number, decimals = 2) => {
  return num.toFixed(decimals);
};

// String utilities
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number) => {
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

// Validation helpers
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Local storage helpers
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
};

export const removeFromStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

// Permission checking utility
export const hasPermission = (
  userPermissions: string[],
  resource: string,
  action: string
): boolean => {
  return userPermissions.includes(`${resource}:${action}`) ||
         userPermissions.includes(`${resource}:*`) ||
         userPermissions.includes(`*:${action}`) ||
         userPermissions.includes('*:*');
};

// Role checking utility
export const hasRole = (userRoles: string[], role: string): boolean => {
  return userRoles.includes(role) || userRoles.includes('superadmin');
};

// API error handling
export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};