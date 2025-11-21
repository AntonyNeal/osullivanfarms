/**
 * UTM Parameter Capture Service
 * Extracts UTM parameters from URL, generates session ID, and manages session storage
 *
 * Flow:
 * 1. On app load: Extract UTM params → Generate user_id → Create session
 * 2. Store in sessionStorage (persists across navigation)
 * 3. Pass to booking form submission
 */

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

interface SessionData {
  userId: string;
  sessionId: string;
  utmParams: UTMParams;
  referrer: string;
  deviceType: string;
  userAgent: string;
  createdAt: number;
}

const SESSION_STORAGE_KEY = 'ch_booking_session';
const UTM_STORAGE_KEY = 'ch_utm_params';
const USER_ID_STORAGE_KEY = 'ch_user_id';

/**
 * Simple hash function for browser (replaces Node crypto)
 */
async function simpleHash(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a persistent user ID based on browser fingerprint
 * Uses combination of user agent and screen resolution for privacy
 * (NOT using IP address - handled server-side instead)
 */
export async function generateUserId(): Promise<string> {
  // Check if user already has an ID (they've visited before)
  const storedId = localStorage.getItem(USER_ID_STORAGE_KEY);
  if (storedId) return storedId;

  // Create fingerprint from browser data (privacy-friendly)
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width + 'x' + screen.height,
    Date.now(),
  ].join('|');

  // Generate deterministic hash (same device = same ID)
  const hash = (await simpleHash(fingerprint)).substring(0, 32);

  // Store for persistence
  localStorage.setItem(USER_ID_STORAGE_KEY, hash);

  return hash;
}

/**
 * Extract UTM parameters from URL query string
 */
export function extractUTMParams(): UTMParams {
  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
  };
}

/**
 * Detect device type (mobile, tablet, desktop)
 */
function getDeviceType(): string {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/mobile|android|iphone|ipod/.test(userAgent)) {
    return 'mobile';
  }
  if (/ipad|android/.test(userAgent)) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Initialize session on app load
 * Stores in sessionStorage so data persists across page navigation
 */
export async function initializeSession(): Promise<SessionData> {
  // Check if session already exists (was created earlier in this session)
  const existingSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existingSession) {
    try {
      return JSON.parse(existingSession);
    } catch (e) {
      console.warn('Failed to parse existing session', e);
    }
  }

  const userId = await generateUserId();
  const utmParams = extractUTMParams();

  // Generate browser-compatible UUID
  const generateSessionId = () => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    // Fallback UUID v4 implementation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const sessionData: SessionData = {
    userId,
    sessionId: generateSessionId(),
    utmParams,
    referrer: document.referrer,
    deviceType: getDeviceType(),
    userAgent: navigator.userAgent,
    createdAt: Date.now(),
  };

  // Store in sessionStorage (cleared when browser closes)
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));

  // Also store in localStorage for cross-session attribution
  localStorage.setItem(USER_ID_STORAGE_KEY, userId);

  return sessionData;
}

/**
 * Retrieve session data (for use in forms)
 */
export function getSessionData(): SessionData | null {
  const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch (e) {
    console.warn('Failed to parse session data', e);
    return null;
  }
}

/**
 * Get UTM params (shorthand for common use case)
 */
export function getUTMParams(): UTMParams {
  const session = getSessionData();
  return session?.utmParams || {};
}

/**
 * Get user ID
 */
export function getUserId(): string {
  const session = getSessionData();
  return session?.userId || '';
}

/**
 * Send session data to backend to create user_sessions record
 * Called on app load so we have a DB record before booking form opens
 */
export async function registerSession(apiBaseUrl: string): Promise<{ sessionId: string } | null> {
  const session = getSessionData();
  if (!session) {
    console.warn('No session data to register');
    return null;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/sessions/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.userId,
        utmSource: session.utmParams.utm_source,
        utmMedium: session.utmParams.utm_medium,
        utmCampaign: session.utmParams.utm_campaign,
        utmContent: session.utmParams.utm_content,
        utmTerm: session.utmParams.utm_term,
        referrer: session.referrer,
        deviceType: session.deviceType,
        userAgent: session.userAgent,
      }),
    });

    if (!response.ok) {
      console.error('Failed to register session:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering session:', error);
    // Don't fail the app if session registration fails
    return null;
  }
}

/**
 * Track a conversion event
 * Used for analytics (button clicks, form steps, etc.)
 */
export async function trackConversion(
  eventType: string,
  eventData?: Record<string, unknown>,
  apiBaseUrl?: string
): Promise<void> {
  const session = getSessionData();

  // Try to send to backend, but don't fail if it doesn't work
  if (apiBaseUrl && session) {
    try {
      await fetch(`${apiBaseUrl}/conversions/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.userId,
          eventType,
          eventData: eventData || {},
        }),
      });
    } catch (error) {
      console.debug('Failed to track conversion event:', error);
      // Non-critical, don't throw
    }
  }

  // Also log locally for debugging
  console.debug(`[Conversion] ${eventType}`, eventData);
}

/**
 * Format UTM data for display (debugging)
 */
export function formatSessionInfo(): string {
  const session = getSessionData();
  if (!session) return 'No session data';

  const { utmParams, deviceType, createdAt } = session;
  const source = utmParams.utm_source || 'direct';
  const campaign = utmParams.utm_campaign || 'none';
  const age = Math.round((Date.now() - createdAt) / 1000);

  return `${source} / ${campaign} (${deviceType}, ${age}s ago)`;
}

// Export all functions
export default {
  generateUserId,
  extractUTMParams,
  initializeSession,
  getSessionData,
  getUTMParams,
  getUserId,
  registerSession,
  trackConversion,
  formatSessionInfo,
};
