import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import BookingModal from '../components/BookingModal';

export default function FlyMeToYou() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Fly Me To You - Claire Hamilton</title>
        <meta
          name="description"
          content="Travel companion services with Claire Hamilton - experience luxury companionship anywhere in the world."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-24 md:py-32 bg-gradient-to-b from-rose-50 via-white to-rose-50/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 mb-6 sm:mb-8 tracking-tight"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Fly Me To You
              </h1>
              <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300 mx-auto mb-8 sm:mb-12" />
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 leading-relaxed font-normal">
                Wherever you are in the world, exceptional companionship can be just a flight away.
                Let&apos;s create unforgettable memories together, no matter the destination.
              </p>
            </div>
          </div>
        </section>

        {/* Tour Schedule */}
        <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2
                className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-12 text-center"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Upcoming Tours
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-rose-400">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Melbourne</h3>
                  <p className="text-lg text-gray-700 mb-2">November 28-29, 2025</p>
                  <p className="text-gray-600">A quick single night trip</p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-pink-400">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Sydney</h3>
                  <p className="text-lg text-gray-700 mb-2">November 30 - December 3, 2025</p>
                  <p className="text-gray-600">
                    Taking expressions of interest. Tour will only go ahead with sufficient
                    prebookings.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-rose-400">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Melbourne</h3>
                  <p className="text-lg text-gray-700 mb-2">January 17-24, 2026</p>
                  <p className="text-gray-600">Staying near Richmond. Preference for incalls.</p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-lg text-gray-700 italic">
                  &quot;EVERYBODY NEEDS A LITTLE TOUCH OF SCARLET BLUE. ®&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Services */}
        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
                {/* Domestic Travel */}
                <div className="bg-gradient-to-br from-rose-50 to-white border-2 border-rose-200 p-8 sm:p-10 rounded-lg shadow-lg">
                  <h2
                    className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6 sm:mb-8 tracking-tight"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    Fly Me To You
                  </h2>
                  <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 leading-relaxed font-normal mb-6 sm:mb-8">
                    Available for travel to Sydney CBD, Melbourne, and Brisbane.
                  </p>
                  <ul className="space-y-3 sm:space-y-4 text-lg sm:text-xl md:text-2xl text-gray-700">
                    <li className="flex items-start">
                      <span className="text-rose-500 mr-3">✓</span>
                      <span>All travel costs covered by client</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-500 mr-3">✓</span>
                      <span>4- or 5-star hotel accommodation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-500 mr-3">✓</span>
                      <span>Within 10 minutes of CBD</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-500 mr-3">✓</span>
                      <span>Flexible scheduling</span>
                    </li>
                  </ul>
                </div>

                {/* Preferences */}
                <div className="bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 p-8 sm:p-10 rounded-lg shadow-lg">
                  <h2
                    className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6 sm:mb-8 tracking-tight"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    My Preferences
                  </h2>
                  <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 leading-relaxed font-normal mb-6 sm:mb-8">
                    As I thrive on deeper connections, longer dates are preferred and prioritized.
                  </p>
                  <ul className="space-y-3 sm:space-y-4 text-lg sm:text-xl md:text-2xl text-gray-700">
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-3">♥</span>
                      <span>Show me your favorite restaurant, bar, or coffee spot</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-3">♥</span>
                      <span>As an early riser, I adore pre-work encounters</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-3">♥</span>
                      <span>Coffee and pastries in bed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-3">♥</span>
                      <span>Deep conversations and genuine connection</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* What's Included */}
              <div className="mt-12 sm:mt-16 bg-white border-2 border-rose-200 p-8 sm:p-10 rounded-lg shadow-lg">
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6 sm:mb-8 tracking-tight text-center"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Travel Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-rose-600 mb-4">
                      Incalls
                    </h3>
                    <ul className="space-y-2 sm:space-y-3 text-lg sm:text-xl md:text-2xl text-gray-700">
                      <li className="flex items-start">
                        <span className="text-rose-500 mr-3">•</span>
                        <span>Private, comfortable space included</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-rose-500 mr-3">•</span>
                        <span>Upscale venue available (cost added to deposit)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-rose-500 mr-3">•</span>
                        <span>Discreet and convenient locations</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-rose-600 mb-4">
                      Outcalls
                    </h3>
                    <ul className="space-y-2 sm:space-y-3 text-lg sm:text-xl md:text-2xl text-gray-700">
                      <li className="flex items-start">
                        <span className="text-rose-500 mr-3">•</span>
                        <span>4- or 5-star hotels within 10 minutes of Canberra CBD</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-rose-500 mr-3">•</span>
                        <span>Luxury accommodation arrangements</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-rose-500 mr-3">•</span>
                        <span>Premium travel experience</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Booking Requirements */}
              <div className="mt-12 sm:mt-16 bg-rose-50/50 border-l-4 border-rose-400 p-6 sm:p-8 rounded">
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 sm:mb-6"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Booking Information
                </h3>
                <ul className="space-y-3 sm:space-y-4 text-lg sm:text-xl md:text-2xl text-gray-800">
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-3">•</span>
                    <span>Available by appointment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-3">•</span>
                    <span>24 hours notice required</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-3">•</span>
                    <span>Pre-bookings preferred, but can accommodate short notice</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-3">•</span>
                    <span>Available 7 days a week, 24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-3">•</span>
                    <span>Flexible hours by appointment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 sm:py-24 bg-gradient-to-b from-rose-50/30 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2
                className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-6 sm:mb-8 tracking-tight"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Plan Your Journey
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 leading-relaxed font-normal mb-10 sm:mb-12">
                Let&apos;s discuss your travel plans and create an unforgettable experience
                together.
              </p>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center px-10 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium rounded-sm hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label="Send inquiry"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Send Inquiry
              </button>
            </div>
          </div>
        </section>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
