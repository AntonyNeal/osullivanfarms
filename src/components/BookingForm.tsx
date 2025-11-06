import { useState } from 'react';

interface BookingFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function BookingForm({ onCancel, onSuccess }: BookingFormProps) {
  const [step, setStep] = useState<'details' | 'preferences' | 'confirm' | 'success' | 'error'>(
    'details'
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Contact details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Booking preferences
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [bookingLength, setBookingLength] = useState('');
  const [locationType, setLocationType] = useState<'incall' | 'outcall'>('incall');
  const [experienceType, setExperienceType] = useState<'GFE' | 'PSE'>('GFE');
  const [specialRequests, setSpecialRequests] = useState('');
  const [foundVia, setFoundVia] = useState('');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Validate and proceed
  const handleDetailsNext = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name required';
    if (!email.trim()) {
      newErrors.email = 'Email required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep('preferences');
    }
  };

  // Step 2: Validate and proceed
  const handlePreferencesNext = () => {
    const newErrors: Record<string, string> = {};

    if (!preferredDate) newErrors.preferredDate = 'Please select a preferred date';
    if (!preferredTime) newErrors.preferredTime = 'Please select a preferred time';
    if (!bookingLength) newErrors.bookingLength = 'Please select booking length';

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep('confirm');
    }
  };

  // Step 3: Submit inquiry
  const handleConfirm = async () => {
    setLoading(true);
    try {
      // For now, just simulate success since we don't have the backend
      // In production, this would send to Claire's contact system
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      setStep('success');
      onSuccess?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  // Progress bar
  const progressSteps = {
    details: 33,
    preferences: 66,
    confirm: 100,
  };

  const progressWidth = progressSteps[step as keyof typeof progressSteps] || 0;

  return (
    <div>
      {/* Step Indicator */}
      {(step === 'details' || step === 'preferences' || step === 'confirm') && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 text-sm font-light text-gray-600">
            <span>1. Your Details</span>
            <span>2. Preferences</span>
            <span>3. Confirm</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 1: Contact Details */}
      {step === 'details' && (
        <div>
          <h2 className="text-2xl font-light mb-6 text-gray-900">Your Information</h2>

          <div className="mb-4">
            <label className="block text-sm font-light text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-light text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-light text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0400 000 000"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div className="flex gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 font-light rounded-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleDetailsNext}
              className="flex-1 px-6 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-light rounded-sm hover:shadow-lg transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Booking Preferences */}
      {step === 'preferences' && (
        <div>
          <h2 className="text-2xl font-light mb-6 text-gray-900">Booking Preferences</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                Preferred Date *
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                  errors.preferredDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.preferredDate && (
                <p className="text-red-500 text-xs mt-1">{errors.preferredDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                Preferred Time *
              </label>
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                  errors.preferredTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.preferredTime && (
                <p className="text-red-500 text-xs mt-1">{errors.preferredTime}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-light text-gray-700 mb-2">Booking Length *</label>
            <select
              value={bookingLength}
              onChange={(e) => setBookingLength(e.target.value)}
              className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                errors.bookingLength ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select duration</option>
              <option value="60min">60 minutes</option>
              <option value="90min">90 minutes</option>
              <option value="2hr">2 hours</option>
              <option value="3hr">3 hours</option>
              <option value="dinner">Dinner Date (2hrs food + 2hrs intimacy)</option>
              <option value="overnight">Overnight (10 hours)</option>
              <option value="social">Social only (1 hour)</option>
            </select>
            {errors.bookingLength && (
              <p className="text-red-500 text-xs mt-1">{errors.bookingLength}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">Location Type</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as 'incall' | 'outcall')}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="incall">Incall</option>
                <option value="outcall">Outcall</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">Experience Type</label>
              <select
                value={experienceType}
                onChange={(e) => setExperienceType(e.target.value as 'GFE' | 'PSE')}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="GFE">Girlfriend Experience (GFE)</option>
                <option value="PSE">Pornstar Experience (PSE)</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-light text-gray-700 mb-2">Special Requests</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any upgrade requests, preferences, or special notes..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-light text-gray-700 mb-2">
              How did you find me?
            </label>
            <input
              type="text"
              value={foundVia}
              onChange={(e) => setFoundVia(e.target.value)}
              placeholder="Scarlet Blue, website, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('details')}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 font-light rounded-sm hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handlePreferencesNext}
              className="flex-1 px-6 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-light rounded-sm hover:shadow-lg transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 'confirm' && (
        <div>
          <h2 className="text-2xl font-light mb-6 text-gray-900">Confirm Your Inquiry</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-sm p-6 mb-6">
            <p className="text-sm font-light text-gray-600 mb-4">
              Please review your inquiry details:
            </p>
            <div className="space-y-2 text-sm text-gray-700 font-light">
              <p>
                <span className="font-medium">Name:</span> {name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {email}
              </p>
              {phone && (
                <p>
                  <span className="font-medium">Phone:</span> {phone}
                </p>
              )}
              <p>
                <span className="font-medium">Preferred Date & Time:</span> {preferredDate} at{' '}
                {preferredTime}
              </p>
              <p>
                <span className="font-medium">Booking Length:</span> {bookingLength}
              </p>
              <p>
                <span className="font-medium">Location:</span> {locationType}
              </p>
              <p>
                <span className="font-medium">Experience:</span> {experienceType}
              </p>
              {specialRequests && (
                <p>
                  <span className="font-medium">Special Requests:</span> {specialRequests}
                </p>
              )}
              {foundVia && (
                <p>
                  <span className="font-medium">Found via:</span> {foundVia}
                </p>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-4 mb-6">
            <p className="text-sm text-yellow-800 font-light">
              <strong>Important:</strong> Screening is always required for safety. A deposit via
              Beem confirms your booking. The remaining balance is settled in cash at the start of
              our time together.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('preferences')}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 font-light rounded-sm hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-6 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-light rounded-sm hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Inquiry'}
            </button>
          </div>
        </div>
      )}

      {/* Success State */}
      {step === 'success' && (
        <div className="text-center py-8">
          <div className="mb-4 flex justify-center">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-light text-gray-900 mb-2">Inquiry Sent!</h3>
          <p className="text-gray-600 font-light mb-6">
            Your booking inquiry has been sent successfully. Claire will review your request and
            contact you within 24 hours to confirm availability and complete the screening process.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 font-light">
              Confirmation has been sent to <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-gray-600 font-light mt-2">
              Please check your email for next steps and screening requirements.
            </p>
          </div>

          <button
            onClick={onCancel}
            className="px-8 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-light rounded-sm hover:shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      )}

      {/* Error State */}
      {step === 'error' && (
        <div className="text-center py-8">
          <div className="mb-4 flex justify-center">
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-light text-gray-900 mb-2">Booking Failed</h3>
          <p className="text-red-600 font-light mb-6">{errorMessage}</p>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('confirm')}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 font-light rounded-sm hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 font-light rounded-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
