import type {
  AvailabilityFetchParams,
  AvailabilityResponse,
  NextAvailability,
} from '../types/availability.types';

/**
 * Fetch dummy next available slot
 * Replace this with real API calls when ready
 */
export async function fetchDummyNextAvailability(
  params: AvailabilityFetchParams = {}
): Promise<AvailabilityResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Generate a dummy "next available" slot
  // Example: 2 hours from now
  const now = new Date();
  const nextSlot = new Date(now);

  // Add 2 hours as an example
  nextSlot.setHours(now.getHours() + 2);
  nextSlot.setMinutes(0);
  nextSlot.setSeconds(0);

  // If it's after 5 PM, push to tomorrow at 9 AM
  if (nextSlot.getHours() >= 17) {
    nextSlot.setDate(nextSlot.getDate() + 1);
    nextSlot.setHours(9);
    nextSlot.setMinutes(0);
  }

  const duration = params.duration || 60;
  const endSlot = new Date(nextSlot);
  endSlot.setMinutes(nextSlot.getMinutes() + duration);

  return {
    nextSlot: {
      start: nextSlot.toISOString(),
      end: endSlot.toISOString(),
    },
    available: true,
  };
}

/**
 * Parse availability response into user-friendly format
 */
export function parseNextAvailability(response: AvailabilityResponse): NextAvailability | null {
  if (!response.available || !response.nextSlot) {
    return null;
  }

  const slotDate = new Date(response.nextSlot.start);
  const now = new Date();

  // Calculate time until slot
  const msUntil = slotDate.getTime() - now.getTime();
  const hoursUntil = Math.floor(msUntil / (1000 * 60 * 60));
  const daysUntil = Math.floor(hoursUntil / 24);

  // Format time
  const time = slotDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Generate display text
  let displayText: string;

  if (daysUntil === 0) {
    if (hoursUntil === 0) {
      displayText = 'Available now';
    } else if (hoursUntil === 1) {
      displayText = 'Available in 1 hour';
    } else {
      displayText = `Available in ${hoursUntil} hours`;
    }
  } else if (daysUntil === 1) {
    displayText = `Available tomorrow at ${time}`;
  } else {
    const dateStr = slotDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    displayText = `Available ${dateStr}`;
  }

  return {
    date: slotDate,
    time,
    daysUntil,
    hoursUntil,
    displayText,
  };
}
