import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AxiosError } from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getError(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.error || error.response?.data?.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
