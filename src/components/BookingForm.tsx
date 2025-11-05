import { useState } from 'react';

interface BookingFormProps {
  onCancel?: () => void;
  onSuccess?: (appointmentId: string) => void;
}

export function BookingForm({ onCancel, onSuccess }: BookingFormProps) {
  const [step, setStep] = useState<'details' | 'datetime' | 'confirm' | 'success' | 'error'>(
    'details'
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Patient details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'unknown'>('unknown');

  // Appointment details
  const [appointmentType, setAppointmentType] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');
  const [appointmentId, setAppointmentId] = useState('');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Validate and proceed
  const handleDetailsNext = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name required';
    if (!lastName.trim()) newErrors.lastName = 'Last name required';
    if (!email.trim()) {
      newErrors.email = 'Email required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep('datetime');
    }
  };

  // Step 2: Validate and proceed
  const handleDatetimeNext = () => {
    const newErrors: Record<string, string> = {};

    if (!appointmentType) newErrors.appointmentType = 'Please select a service';
    if (!appointmentDate) newErrors.appointmentDate = 'Please select a date';
    if (!appointmentTime) newErrors.appointmentTime = 'Please select a time';

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep('confirm');
    }
  };

  // Step 3: Submit booking
  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Construct ISO datetime
      const startDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 1);

      const payload = {
        patient: {
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          dateOfBirth: dateOfBirth || undefined,
          gender,
        },
        appointmentDetails: {
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          minutesDuration: 60,
          notes: notes || undefined,
        },
      };

      // Call booking API
      const response = await fetch(
        import.meta.env.VITE_HALAXY_BOOKING_FUNCTION_URL || '/api/create-halaxy-booking',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.success && result.appointmentId) {
        setAppointmentId(result.appointmentId);
        setStep('success');
        onSuccess?.(result.appointmentId);
      } else {
        setErrorMessage(result.error || 'Booking failed. Please try again.');
        setStep('error');
      }
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
    datetime: 66,
    confirm: 100,
  };

  const progressWidth = progressSteps[step as keyof typeof progressSteps] || 0;

  return (
    <div>
      {/* Step Indicator */}
      {(step === 'details' || step === 'datetime' || step === 'confirm') && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 text-sm font-light text-gray-600">
            <span>1. Your Details</span>
            <span>2. Date & Time</span>
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

      {/* Step 1: Patient Details */}
      {step === 'details' && (
        <div>
          <h2 className="text-2xl font-light mb-6 text-gray-900">Your Information</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
                className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-light text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.smith@example.com"
              className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-light text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0400 000 000"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value as 'male' | 'female' | 'other' | 'unknown')
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="unknown">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
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

      {/* Step 2: Date & Time */}
      {step === 'datetime' && (
        <div>
          <h2 className="text-2xl font-light mb-6 text-gray-900">Select Date & Time</h2>

          <div className="mb-4">
            <label className="block text-sm font-light text-gray-700 mb-2">Service *</label>
            <select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                errors.appointmentType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a service</option>
              <option value="dinner-date">Dinner Date - $300</option>
              <option value="social-event">Social Event - $400</option>
              <option value="travel-companion">Travel Companion - $500</option>
              <option value="private-moment">Private Moment - $500</option>
            </select>
            {errors.appointmentType && (
              <p className="text-red-500 text-xs mt-1">{errors.appointmentType}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                  errors.appointmentDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.appointmentDate && (
                <p className="text-red-500 text-xs mt-1">{errors.appointmentDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">Time *</label>
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                  errors.appointmentTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.appointmentTime && (
                <p className="text-red-500 text-xs mt-1">{errors.appointmentTime}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-light text-gray-700 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or details..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
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
              onClick={handleDatetimeNext}
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
          <h2 className="text-2xl font-light mb-6 text-gray-900">Confirm Your Booking</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-sm p-6 mb-6">
            <p className="text-sm font-light text-gray-600 mb-4">
              Please review your booking details:
            </p>
            <div className="space-y-2 text-sm text-gray-700 font-light">
              <p>
                <span className="font-medium">Name:</span> {firstName} {lastName}
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
                <span className="font-medium">Service:</span> {appointmentType}
              </p>
              <p>
                <span className="font-medium">Date & Time:</span> {appointmentDate} at{' '}
                {appointmentTime}
              </p>
              {notes && (
                <p>
                  <span className="font-medium">Notes:</span> {notes}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('datetime')}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 font-light rounded-sm hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-6 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-light rounded-sm hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
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
          <h3 className="text-2xl font-light text-gray-900 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 font-light mb-6">
            Your appointment has been successfully booked.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 font-light">
              Confirmation has been sent to <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-gray-600 font-light mt-2">
              <span className="font-medium">Appointment ID:</span> {appointmentId}
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
