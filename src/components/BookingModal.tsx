import type { MouseEvent } from 'react';
import { BookingForm } from './BookingForm';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40" onClick={handleBackdropClick} />
      <div className="fixed inset-0 overflow-y-auto z-50">
        <div className="flex items-start justify-center min-h-screen pt-6 px-4">
          <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
              aria-label="Close booking modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="p-8">
              <BookingForm onCancel={onClose} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
