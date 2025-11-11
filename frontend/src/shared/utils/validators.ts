/**
 * Validation Utilities
 */

export const isPositiveNumber = (value: number): boolean => {
  return value > 0;
};

export const isValidYear = (year: number): boolean => {
  return year >= 2020 && year <= 2050;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};