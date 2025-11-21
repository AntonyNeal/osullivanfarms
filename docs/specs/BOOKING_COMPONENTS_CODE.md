/\*\*

- Complete Booking Component System - Implementation Files
- Copy each component code into its respective .tsx file
  \*/

// ============================================================================
// FILE: src/components/StepIndicator.tsx
// ============================================================================
/\*
import type { StepIndicatorProps } from '../types/booking.types';

const DEFAULT_STEPS = ['Select Date', 'Choose Time', 'Review Details', 'Payment'];

export function StepIndicator({
currentStep,
totalSteps = 4,
stepLabels = DEFAULT*STEPS,
compact = false
}: StepIndicatorProps) {
return (
<div className="flex items-center justify-center gap-2 md:gap-4 mb-8 px-4">
{Array.from({ length: totalSteps }).map((*, index) => {
const stepNum = index + 1;
const isActive = currentStep === stepNum;
const isCompleted = currentStep > stepNum;

        return (
          <div key={stepNum} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full font-semibold text-sm md:text-base transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isCompleted ? <span>✓</span> : stepNum}
              </div>
              {!compact && (
                <p className={`text-xs md:text-sm font-medium mt-2 text-center max-w-20 ${isActive ? 'text-blue-600' : 'text-slate-600'}`}>
                  {stepLabels[index]}
                </p>
              )}
            </div>
            {stepNum < totalSteps && (
              <div className={`w-8 md:w-12 h-1 mx-1 md:mx-2 ${isCompleted ? 'bg-green-600' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>

);
}
\*/

// ============================================================================
// FILE: src/components/BookingButton.tsx
// ============================================================================
/\*
import { useState } from 'react';
import { Calendar, Loader } from 'lucide-react';
import type { BookingButtonProps } from '../types/booking.types';

export function BookingButton({
providerId,
providerName,
providerImage,
hourlyRate,
platformFeePercentage,
variant = 'primary',
size = 'md',
fullWidth = false,
disabled = false,
customText,
className = '',
onBookingStart,
}: BookingButtonProps) {
const [isLoading, setIsLoading] = useState(false);

const handleClick = () => {
setIsLoading(true);
onBookingStart?.();
setTimeout(() => setIsLoading(false), 500);
};

const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses = {
primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500',
outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
};

const sizeClasses = {
sm: 'px-3 py-1.5 text-sm',
md: 'px-4 py-2 text-base',
lg: 'px-6 py-3 text-lg',
};

const widthClass = fullWidth ? 'w-full' : '';

return (
<button
onClick={handleClick}
disabled={disabled || isLoading}
className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
aria-label={`Book appointment with ${providerName}`}
type="button" >
{isLoading ? (
<>
<Loader className="w-4 h-4 animate-spin" />
<span>Loading...</span>
</>
) : (
<>
<Calendar className="w-4 h-4" />
<span>{customText || 'Book Appointment'}</span>
</>
)}
</button>
);
}
\*/

// ============================================================================
// FILE: src/components/CalendarView.tsx
// ============================================================================
/\*
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCalendarGrid, formatDateMonth, getDayOfWeekAbbr, formatDateISO, isSameDay, isPastDate } from '../utils/dateHelpers';
import type { CalendarViewProps } from '../types/booking.types';

export function CalendarView({
selectedDate,
currentMonth,
availability,
isLoading,
onDateSelect,
onMonthChange,
minDate,
maxDate,
}: CalendarViewProps) {
const calendarDays = getCalendarGrid(currentMonth);
const isCurrentMonth = (date: Date) => date.getMonth() === currentMonth.getMonth();

const getDateAvailability = (date: Date) => {
const dateString = formatDateISO(date);
return availability.find((a) => a.date === dateString);
};

const getPastDate = (date: Date) => {
return isPastDate(date);
};

const handlePrevMonth = () => {
onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
};

const handleNextMonth = () => {
onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
};

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

return (
<div className="w-full">
<div className="mb-6">
<div className="flex items-center justify-between mb-4">
<h2 className="text-xl font-semibold text-slate-900">{formatDateMonth(currentMonth)}</h2>
<div className="flex gap-2">
<button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Previous month"
            >
<ChevronLeft className="w-5 h-5" />
</button>
<button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Next month"
            >
<ChevronRight className="w-5 h-5" />
</button>
</div>
</div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-slate-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            const dateStr = formatDateISO(date);
            const isInCurrentMonth = isCurrentMonth(date);
            const isPast = getPastDate(date);
            const availability_item = getDateAvailability(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isAvailable = availability_item && !availability_item.isFullyBooked && !availability_item.isBlocked;

            return (
              <button
                key={index}
                onClick={() => isAvailable && onDateSelect(date)}
                disabled={!isInCurrentMonth || isPast || !isAvailable || isLoading}
                className={`py-2 px-1 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg'
                    : isAvailable
                      ? 'bg-white border border-slate-200 text-slate-900 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                } ${!isInCurrentMonth ? 'text-slate-300' : ''}`}
                title={
                  availability_item
                    ? `${availability_item.availableSlots} slots available`
                    : 'No availability'
                }
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}
    </div>

);
}
\*/

// ============================================================================
// FILE: src/components/booking.css
// ============================================================================
/\*
@keyframes fadeIn {
from {
opacity: 0;
}
to {
opacity: 1;
}
}

@keyframes slideInDown {
from {
transform: translateY(-20px);
opacity: 0;
}
to {
transform: translateY(0);
opacity: 1;
}
}

@keyframes slideOutUp {
from {
transform: translateY(0);
opacity: 1;
}
to {
transform: translateY(-20px);
opacity: 0;
}
}

@keyframes scaleInCheckmark {
from {
transform: scale(0) rotate(-45deg);
opacity: 0;
}
to {
transform: scale(1) rotate(0);
opacity: 1;
}
}

@keyframes spin {
from {
transform: rotate(0deg);
}
to {
transform: rotate(360deg);
}
}

.booking-modal-backdrop {
animation: fadeIn 0.3s ease-out;
}

.booking-modal-content {
animation: slideInDown 0.3s ease-out;
}

.booking-modal-backdrop.exiting {
animation: fadeIn 0.3s ease-in reverse;
}

.booking-modal-content.exiting {
animation: slideInDown 0.3s ease-in reverse;
}

.booking-step-enter {
animation: fadeIn 0.25s ease-out;
}

.booking-step-enter-delayed-1 {
animation: fadeIn 0.25s ease-out 0.05s backwards;
}

.booking-step-enter-delayed-2 {
animation: fadeIn 0.25s ease-out 0.1s backwards;
}

.booking-checkmark {
animation: scaleInCheckmark 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.booking-spinner {
animation: spin 1s linear infinite;
}

.booking-focus-ring:focus {
outline: none;
box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1), 0 0 0 2px rgba(37, 99, 235, 0.5);
}
\*/

export const COMPONENTS_CREATED = 'Copy the code above into individual .tsx and .css files';
