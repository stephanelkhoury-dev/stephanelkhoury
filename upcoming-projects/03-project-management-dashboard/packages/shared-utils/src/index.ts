import { z } from 'zod';
import { format, parseISO } from 'date-fns';

// Validation schemas
export const emailSchema = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Date formatting utilities
export const formatters = {
  date: (date: string | Date) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM dd, yyyy');
  },
  datetime: (date: string | Date) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM dd, yyyy HH:mm');
  },
  time: (date: string | Date) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'HH:mm');
  }
};

// Error handling
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Type guards
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

// String utilities
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

// Array utilities
export const chunk = <T>(arr: T[], size: number): T[][] => {
  return arr.reduce((chunks, item, i) => {
    if (i % size === 0) {
      chunks.push([item]);
    } else {
      chunks[chunks.length - 1].push(item);
    }
    return chunks;
  }, [] as T[][]);
};

// Object utilities
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

// Async utilities
export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay);
  }
};
