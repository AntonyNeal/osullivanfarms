import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { NextAvailability } from '../types/availability.types';
import { availabilityProvider } from '../services/availability/provider';
import { parseNextAvailability } from '../services/availability/dummyData';
import './MobileCTABar.css';

interface MobileCTABarProps {
  ctaText?: string; // Button text (default: "Book Now")
  ctaAction: () => void; // What happens when button clicked
  serviceId?: string; // Optional service identifier
  hideWhenModalOpen?: boolean; // Hide when modal/overlay active
  autoRefreshInterval?: number; // Refresh availability in ms (0 = disabled)
  modalOpenEventName?: string; // Custom event name for modal open
  modalCloseEventName?: string; // Custom event name for modal close
  children?: ReactNode; // Optional custom content
}

export default function MobileCTABar({
  ctaText = 'Book Your Hay',
  ctaAction,
  serviceId,
  hideWhenModalOpen = true,
  autoRefreshInterval = 300000, // 5 minutes default
  modalOpenEventName = 'modalOpened',
  modalCloseEventName = 'modalClosed',
}: MobileCTABarProps) {
  // State
  const [nextAvailability, setNextAvailability] = useState<NextAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch next availability
  const fetchNextSlot = useCallback(async () => {
    try {
      const response = await availabilityProvider.fetchNextAvailability({
        serviceId,
      });

      const parsed = parseNextAvailability(response);
      setNextAvailability(parsed);
    } catch (error) {
      console.error('[MobileCTABar] Error fetching availability:', error);
      setNextAvailability(null);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  // Initial fetch
  useEffect(() => {
    fetchNextSlot();
  }, [fetchNextSlot]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefreshInterval > 0) {
      const interval = setInterval(fetchNextSlot, autoRefreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefreshInterval, fetchNextSlot]);

  // Listen for modal open/close events
  useEffect(() => {
    if (!hideWhenModalOpen) return;

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    window.addEventListener(modalOpenEventName, handleModalOpen);
    window.addEventListener(modalCloseEventName, handleModalClose);

    return () => {
      window.removeEventListener(modalOpenEventName, handleModalOpen);
      window.removeEventListener(modalCloseEventName, handleModalClose);
    };
  }, [hideWhenModalOpen, modalOpenEventName, modalCloseEventName]);

  // Don't render if modal is open and hideWhenModalOpen is true
  if (hideWhenModalOpen && isModalOpen) {
    return null;
  }

  return (
    <div className="mobile-cta-bar" role="complementary" aria-label="Booking call to action">
      {/* Availability Info */}
      <div className="availability-info" aria-live="polite" aria-atomic="true">
        {loading ? (
          <div className="availability-loading">
            <span className="loading-icon">🌾</span>
            <span>Checking delivery slots...</span>
          </div>
        ) : nextAvailability ? (
          <div className="availability-text">
            <span className="availability-icon">�</span>
            <span>{nextAvailability.displayText}</span>
          </div>
        ) : (
          <div className="availability-text">
            <span className="availability-icon">🇦🇺</span>
            <span>Fair dinkum delivery</span>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <button
        className="cta-button"
        onClick={ctaAction}
        type="button"
        aria-label={`${ctaText} - ${nextAvailability?.displayText || 'Check availability'}`}
      >
        {ctaText}
      </button>
    </div>
  );
}
