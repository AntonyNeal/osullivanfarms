import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { BookingModalProps } from '../types/booking.types';

interface BookingModalState {
  currentStep: number;
  selectedDate: Date | null;
  selectedTime: string | null;
  duration: number;
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentMethod: string | null;
  isProcessing: boolean;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [state, setState] = useState<BookingModalState>({
    currentStep: 1,
    selectedDate: null,
    selectedTime: null,
    duration: 1,
    clientInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    paymentMethod: null,
    isProcessing: false,
  });

  const modalRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="bg-gray-900 rounded-lg shadow-2xl border-2 border-[var(--wattle-gold)] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        style={{
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.05)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b-2 border-[var(--wattle-gold)] p-6 flex justify-between items-center">
          <h2
            id="modal-title"
            className="text-3xl font-bold text-[var(--wattle-gold)] uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Book Your Hay Delivery
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--wattle-gold)] hover:text-[var(--digital-matrix)] transition-all hover:scale-110 hover:rotate-90 duration-300"
            aria-label="Close booking modal"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all border-2 ${
                    state.currentStep === step
                      ? 'bg-[var(--outback-red)] text-white border-[var(--wattle-gold)] shadow-lg animate-pulse'
                      : state.currentStep > step
                        ? 'bg-[var(--eucalyptus)] text-white border-[var(--digital-matrix)]'
                        : 'bg-gray-800 text-gray-500 border-gray-700'
                  }`}
                  style={{
                    boxShadow:
                      state.currentStep === step
                        ? '0 0 20px rgba(184, 48, 44, 0.5)'
                        : state.currentStep > step
                          ? '0 0 15px rgba(0, 255, 65, 0.3)'
                          : 'none',
                  }}
                >
                  {state.currentStep > step ? '✓' : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-1 transition-all ${
                      state.currentStep > step
                        ? 'bg-gradient-to-r from-[var(--digital-matrix)] to-[var(--wattle-gold)]'
                        : 'bg-gray-800'
                    }`}
                    style={{
                      boxShadow:
                        state.currentStep > step ? '0 0 10px rgba(0, 255, 65, 0.5)' : 'none',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {state.currentStep === 1 && (
              <div>
                <h3
                  className="text-2xl font-bold text-[var(--wattle-gold)] mb-2 uppercase tracking-wide"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Select a Date
                </h3>
                <p className="text-gray-300 mb-6 italic" style={{ fontFamily: 'var(--font-body)' }}>
                  Choose your preferred delivery date. We deliver 7 days a week, rain, hail or
                  shine! 🦘
                </p>
                <div
                  className="bg-gray-800/50 border-2 border-[var(--digital-matrix)] rounded-lg p-8 text-center text-[var(--digital-matrix)] relative overflow-hidden"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(0, 255, 65, 0.1)',
                  }}
                >
                  <div className="relative z-10">
                    <p className="text-lg mb-2" style={{ fontFamily: 'var(--font-tech)' }}>
                      Calendar implementation coming soon
                    </p>
                    <p className="text-sm text-gray-400">Fair dinkum delivery scheduling 📅</p>
                  </div>
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--digital-matrix) 2px, var(--digital-matrix) 4px)',
                    }}
                  ></div>
                </div>
              </div>
            )}

            {state.currentStep === 2 && (
              <div>
                <h3
                  className="text-2xl font-bold text-[var(--wattle-gold)] mb-2 uppercase tracking-wide"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Select Quantity & Type
                </h3>
                <p className="text-gray-300 mb-6 italic" style={{ fontFamily: 'var(--font-body)' }}>
                  Choose your hay type and quantity. Premium Aussie hay, grown on our land! 🌾
                </p>
                <div
                  className="bg-gray-800/50 border-2 border-[var(--wattle-gold)] rounded-lg p-8 text-center text-[var(--wattle-gold)] relative overflow-hidden"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(255, 215, 0, 0.1)',
                  }}
                >
                  <div className="relative z-10">
                    <p className="text-lg mb-2" style={{ fontFamily: 'var(--font-tech)' }}>
                      Hay selection coming soon
                    </p>
                    <p className="text-sm text-gray-400">100% Australian. 100% Quality. 🇦🇺</p>
                  </div>
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(90deg, transparent, transparent 2px, var(--wattle-gold) 2px, var(--wattle-gold) 4px)',
                    }}
                  ></div>
                </div>
              </div>
            )}

            {state.currentStep === 3 && (
              <div>
                <h3
                  className="text-2xl font-bold text-[var(--wattle-gold)] mb-2 uppercase tracking-wide"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Review & Contact Details
                </h3>
                <p className="text-gray-300 mb-6 italic" style={{ fontFamily: 'var(--font-body)' }}>
                  Review your order and provide your details. We&apos;ll sort you out, no worries!
                  📋
                </p>
                <div
                  className="bg-gray-800/50 border-2 border-[var(--sky-blue)] rounded-lg p-8 text-center text-[var(--sky-blue)] relative overflow-hidden"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(1, 33, 105, 0.2)',
                  }}
                >
                  <div className="relative z-10">
                    <p className="text-lg mb-2" style={{ fontFamily: 'var(--font-tech)' }}>
                      Order summary coming soon
                    </p>
                    <p className="text-sm text-gray-400">Proudly Australian owned & operated 🦘</p>
                  </div>
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(45deg, transparent, transparent 10px, var(--sky-blue) 10px, var(--sky-blue) 12px)',
                    }}
                  ></div>
                </div>
              </div>
            )}

            {state.currentStep === 4 && (
              <div>
                <h3
                  className="text-2xl font-bold text-[var(--wattle-gold)] mb-2 uppercase tracking-wide"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Fair Dinkum Payment
                </h3>
                <p className="text-gray-300 mb-6 italic" style={{ fontFamily: 'var(--font-body)' }}>
                  Complete your booking. Fair prices, honest service - that&apos;s the Aussie way!
                  💳
                </p>
                <div
                  className="bg-gray-800/50 border-2 border-[var(--outback-red)] rounded-lg p-8 text-center text-[var(--outback-red)] relative overflow-hidden"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(184, 48, 44, 0.2)',
                  }}
                >
                  <div className="relative z-10">
                    <p className="text-lg mb-2" style={{ fontFamily: 'var(--font-tech)' }}>
                      Payment processing coming soon
                    </p>
                    <p className="text-sm text-gray-400">Secure & trusted by Aussie farmers 🌾</p>
                  </div>
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, var(--outback-red) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  currentStep: Math.max(1, prev.currentStep - 1),
                }))
              }
              disabled={state.currentStep === 1}
              className="px-8 py-3 border-2 border-gray-600 rounded-lg font-bold text-gray-300 hover:bg-gray-800 hover:border-[var(--wattle-gold)] hover:text-[var(--wattle-gold)] disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-wider"
              style={{
                fontFamily: 'var(--font-heading)',
                boxShadow: state.currentStep !== 1 ? '0 0 10px rgba(255, 215, 0, 0.2)' : 'none',
              }}
            >
              Back
            </button>
            <button
              onClick={() => {
                if (state.currentStep === 4) {
                  // Process booking
                  setState((prev) => ({ ...prev, isProcessing: true }));
                  setTimeout(() => {
                    onClose();
                  }, 1000);
                } else {
                  setState((prev) => ({
                    ...prev,
                    currentStep: Math.min(4, prev.currentStep + 1),
                  }));
                }
              }}
              disabled={state.isProcessing}
              className="px-8 py-3 bg-[var(--outback-red)] text-white rounded-lg font-bold hover:bg-[var(--wattle-gold)] hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider border-2 border-[var(--wattle-gold)] relative overflow-hidden group"
              style={{
                fontFamily: 'var(--font-heading)',
                boxShadow: '0 0 20px rgba(184, 48, 44, 0.5)',
              }}
            >
              <span className="relative z-10">
                {state.currentStep === 4
                  ? state.isProcessing
                    ? 'Processing...'
                    : 'Complete Booking'
                  : 'Next'}
              </span>
              <div className="absolute inset-0 bg-[var(--digital-matrix)] opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
