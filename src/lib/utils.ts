import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AxiosError } from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getError(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    // If we have a specific error message that isn't just "Validation error"
    if (data?.error && data.error !== 'Validation error') return data.error;

    // Check for validation details
    if (data?.details && Array.isArray(data.details) && data.details.length > 0) {
      const first = data.details[0];
      return first.message || first.summary || data.error || fallback;
    }

    return data?.error || data?.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
