/**
 * Booking API Utilities
 * Mock API functions for booking system integration
 * Replace these with actual API calls when integrating with backend
 */

import type {
  AvailabilityData,
  TimeSlot,
  CreateBookingResponse,
  FetchAvailabilityRequest,
  FetchAvailabilityResponse,
  FetchTimeSlotsRequest,
  FetchTimeSlotsResponse,
  PaymentRequest,
  PaymentResult,
  MockProviderData,
  Provider,
} from '../types/booking.types';
import { generateTimeSlots } from '../utils/dateHelpers';

// ============================================================================
// Mock Data
// ============================================================================

export const MOCK_PROVIDERS: Record<string, MockProviderData> = {
  prov_001: {
    provider: {
      id: 'prov_001',
      name: 'Sarah Johnson',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      specialty: 'Professional Services',
      isVerified: true,
      timezone: 'America/New_York',
      verificationBadges: [
        { type: 'verified', label: 'Verified Professional', icon: '✓' },
        { type: 'award', label: '5-Star Rating', icon: '⭐' },
      ],
    },
    hourlyRate: 200,
    platformFeePercentage: 15,
    availability: generateMockAvailability(new Date()),
    timeSlots: generateMockTimeSlots(),
  },
  prov_002: {
    provider: {
      id: 'prov_002',
      name: 'Marcus Chen',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      specialty: 'Creative Services',
      isVerified: true,
      timezone: 'America/Los_Angeles',
      verificationBadges: [
        { type: 'verified', label: 'Verified Professional' },
        { type: 'premium', label: 'Premium Member' },
      ],
    },
    hourlyRate: 250,
    platformFeePercentage: 15,
    availability: generateMockAvailability(new Date()),
    timeSlots: generateMockTimeSlots(),
  },
  prov_003: {
    provider: {
      id: 'prov_003',
      name: 'Emma Rodriguez',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      specialty: 'Consulting Services',
      isVerified: true,
      timezone: 'America/Chicago',
      verificationBadges: [
        { type: 'verified', label: 'Verified Professional' },
        { type: 'certified', label: 'Certified Expert' },
      ],
    },
    hourlyRate: 300,
    platformFeePercentage: 15,
    availability: generateMockAvailability(new Date()),
    timeSlots: generateMockTimeSlots(),
  },
};

/**
 * Generate mock availability data for a month
 */
function generateMockAvailability(baseDate: Date): AvailabilityData[] {
  const availability: AvailabilityData[] = [];
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  // Generate availability for 60 days
  for (let i = 0; i < 60; i++) {
    const date = new Date(year, month, baseDate.getDate() + i);
    const dayOfWeek = date.getDay();

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }

    // Skip if date is in the past
    const today = new Date();
    if (date < today) {
      continue;
    }

    const isoDate = date.toISOString().split('T')[0];

    // Randomly block some dates (provider unavailable)
    const isBlocked = Math.random() < 0.1;

    // Randomly make some dates fully booked
    const isFullyBooked = !isBlocked && Math.random() < 0.2;

    availability.push({
      date: isoDate,
      availableSlots: isBlocked ? 0 : isFullyBooked ? 0 : Math.floor(Math.random() * 8) + 1,
      isFullyBooked: isFullyBooked,
      isBlocked: isBlocked,
      dayOfWeek: dayOfWeek,
    });
  }

  return availability;
}

/**
 * Generate mock time slots for various dates
 */
function generateMockTimeSlots(): Record<string, TimeSlot[]> {
  const slots: Record<string, TimeSlot[]> = {};
  const baseDate = new Date();

  // Generate slots for next 30 days
  for (let i = 1; i < 31; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);

    const dayOfWeek = date.getDay();

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }

    const isoDate = date.toISOString().split('T')[0];

    // Generate time slots from 9 AM to 5 PM
    const timeSlotStrings = generateTimeSlots(9, 17, 60);

    const daySlots: TimeSlot[] = timeSlotStrings.map((time) => {
      // Randomly mark some slots as booked
      const isBooked = Math.random() < 0.3;

      return {
        startTime: time,
        endTime: addHours(time, 1),
        isAvailable: !isBooked,
        isBooked: isBooked,
        isBuffer: false,
      };
    });

    slots[isoDate] = daySlots;
  }

  return slots;
}

/**
 * Add hours to time string
 */
function addHours(timeString: string, hours: number): string {
  const [h, m] = timeString.split(':').map(Number);
  const newHour = (h + hours) % 24;
  return `${String(newHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Fetch availability for a specific month
 * Mock implementation - replace with actual API call
 */
export async function fetchAvailability(
  request: FetchAvailabilityRequest
): Promise<FetchAvailabilityResponse> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const providerData = MOCK_PROVIDERS[request.providerId];

      if (!providerData) {
        resolve({
          success: false,
          data: [],
          error: 'Provider not found',
        });
        return;
      }

      // Filter availability for requested month
      const filtered = providerData.availability.filter((item) => {
        const date = new Date(item.date);
        return date.getMonth() === request.month - 1 && date.getFullYear() === request.year;
      });

      resolve({
        success: true,
        data: filtered,
      });
    }, 500);
  });
}

/**
 * Fetch time slots for a specific date and duration
 * Mock implementation - replace with actual API call
 */
export async function fetchTimeSlots(
  request: FetchTimeSlotsRequest
): Promise<FetchTimeSlotsResponse> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const providerData = MOCK_PROVIDERS[request.providerId];

      if (!providerData) {
        resolve({
          success: false,
          data: [],
          error: 'Provider not found',
        });
        return;
      }

      let slots = providerData.timeSlots[request.date] || [];

      // Filter slots based on duration (must have consecutive available slots)
      if (request.duration > 1) {
        const filteredSlots: TimeSlot[] = [];

        for (let i = 0; i < slots.length - (request.duration - 1); i++) {
          let canFitDuration = true;

          for (let j = 0; j < request.duration; j++) {
            if (!slots[i + j] || slots[i + j].isBooked) {
              canFitDuration = false;
              break;
            }
          }

          if (canFitDuration) {
            filteredSlots.push(slots[i]);
          }
        }

        slots = filteredSlots;
      }

      resolve({
        success: true,
        data: slots,
      });
    }, 300);
  });
}

/**
 * Process payment
 * Mock implementation - replace with actual payment gateway integration
 */
export async function processPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
  return new Promise((resolve) => {
    // Simulate network delay and payment processing
    setTimeout(() => {
      // Simulate occasional failures (10% chance)
      if (Math.random() < 0.1) {
        resolve({
          success: false,
          bookingId: '',
          bookingReference: '',
          amount: paymentRequest.amount,
          method: paymentRequest.paymentMethod,
          status: 'failed',
          error: 'Payment declined. Please check your payment details and try again.',
        });
        return;
      }

      const bookingId = `booking_${Date.now()}`;
      const bookingReference = `BK-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      resolve({
        success: true,
        bookingId: bookingId,
        bookingReference: bookingReference,
        transactionId: `txn_${Date.now()}`,
        amount: paymentRequest.amount,
        method: paymentRequest.paymentMethod,
        status: 'completed',
        message: 'Payment processed successfully',
        nextSteps: [
          'Provider has 24 hours to accept your booking',
          'You will receive a confirmation email shortly',
          'Upon acceptance, you will be contacted with payment instructions',
        ],
      });
    }, 2000); // Simulate longer payment processing
  });
}

/**
 * Create booking (after payment)
 * Mock implementation - replace with actual API call
 */
export async function createBooking(bookingReference: string): Promise<CreateBookingResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        bookingId: `booking_${Date.now()}`,
        bookingReference: bookingReference,
        status: 'pending',
        message: 'Booking created successfully. Waiting for provider acceptance.',
      });
    }, 500);
  });
}

/**
 * Get provider details
 * Mock implementation - replace with actual API call
 */
export async function getProvider(providerId: string): Promise<Provider | null> {
  const providerData = MOCK_PROVIDERS[providerId];
  return providerData ? providerData.provider : null;
}

/**
 * Validate availability (check if date/time is still available before payment)
 * Mock implementation - replace with actual API call
 */
export async function validateAvailability(
  providerId: string,
  date: string,
  startTime: string,
  duration: number
): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const providerData = MOCK_PROVIDERS[providerId];

      if (!providerData) {
        resolve(false);
        return;
      }

      const slots = providerData.timeSlots[date];

      if (!slots) {
        resolve(false);
        return;
      }

      // Check if requested slot and duration are available
      const startIndex = slots.findIndex((slot) => slot.startTime === startTime);

      if (startIndex === -1) {
        resolve(false);
        return;
      }

      let isAvailable = true;
      for (let i = 0; i < duration; i++) {
        if (!slots[startIndex + i] || slots[startIndex + i].isBooked) {
          isAvailable = false;
          break;
        }
      }

      resolve(isAvailable);
    }, 200);
  });
}

/**
 * Send confirmation email
 * Mock implementation - replace with actual email service
 */
export async function sendConfirmationEmail(
  email: string,
  bookingReference: string
): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Confirmation email sent to:', email);
      console.log('Booking Reference:', bookingReference);
      resolve(true);
    }, 300);
  });
}

/**
 * Get booking details
 * Mock implementation - replace with actual API call
 */
export async function getBookingDetails(bookingReference: string): Promise<{
  bookingReference: string;
  status: string;
  createdAt: string;
  providerResponse: string;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        bookingReference: bookingReference,
        status: 'pending',
        createdAt: new Date().toISOString(),
        providerResponse: 'awaiting',
      });
    }, 300);
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create retry wrapper for API calls
 */
export function withRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const attempt = (attemptNumber: number) => {
      apiCall()
        .then(resolve)
        .catch((error) => {
          if (attemptNumber < maxRetries) {
            setTimeout(() => {
              attempt(attemptNumber + 1);
            }, delay);
          } else {
            reject(error);
          }
        });
    };

    attempt(1);
  });
}

/**
 * Cache API responses
 */
const responseCache = new Map<
  string,
  { data: PaymentResult | FetchAvailabilityResponse | FetchTimeSlotsResponse; timestamp: number }
>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function withCache<
  T extends PaymentResult | FetchAvailabilityResponse | FetchTimeSlotsResponse,
>(key: string, apiCall: () => Promise<T>): Promise<T> {
  const cached = responseCache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return Promise.resolve(cached.data as T);
  }

  return apiCall().then((data) => {
    responseCache.set(key, { data, timestamp: Date.now() });
    return data;
  });
}

export function clearCache(): void {
  responseCache.clear();
}

// ============================================================================
// Error Handling
// ============================================================================

export class BookingAPIError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'BookingAPIError';
  }
}

export function handleAPIError(error: unknown): BookingAPIError {
  if (error instanceof BookingAPIError) {
    return error;
  }

  if (error instanceof Error && 'response' in error) {
    const responseError = error as Error & {
      response: { status: number; data?: { message?: string } };
    };
    return new BookingAPIError(
      String(responseError.response.status),
      responseError.response.data?.message || 'An error occurred',
      responseError.response.status
    );
  }

  if (error instanceof Error) {
    return new BookingAPIError('UNKNOWN_ERROR', error.message);
  }

  return new BookingAPIError('UNKNOWN_ERROR', 'An unknown error occurred');
}
