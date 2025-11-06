import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import BookingModal from '../components/BookingModal';

export default function Prices() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Prices - Claire Hamilton</title>
        <meta
          name="description"
          content="Investment in unforgettable experiences with Claire Hamilton - transparent pricing for discerning individuals."
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
                Investment
              </h1>
              <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300 mx-auto mb-8 sm:mb-12" />
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 leading-relaxed font-normal">
                Quality time deserves genuine investment. Every experience is crafted with care,
                attention, and absolute discretion.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* GFE Rates */}
              <div className="mb-12">
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-8 text-center"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Girlfriend Experience (GFE) Rates
                </h2>
                <div className="bg-gradient-to-br from-rose-50 to-white border-2 border-rose-200 p-8 rounded-lg shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Incall Rates</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">60 mins</span>
                          <span className="text-xl font-semibold text-rose-600">$650</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">90 mins</span>
                          <span className="text-xl font-semibold text-rose-600">$900</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">2 hours</span>
                          <span className="text-xl font-semibold text-rose-600">$1,200</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">3 hours</span>
                          <span className="text-xl font-semibold text-rose-600">$1,700</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">
                            Dinner Date (2hrs food + 2hrs intimacy)
                          </span>
                          <span className="text-xl font-semibold text-rose-600">$2,000</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">Overnight (10 hours)</span>
                          <span className="text-xl font-semibold text-rose-600">$4,000</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-lg text-gray-800">Social only (1 hour)</span>
                          <span className="text-xl font-semibold text-rose-600">$400</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Outcall Rates</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">60 mins</span>
                          <span className="text-xl font-semibold text-rose-600">$650</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">90 mins</span>
                          <span className="text-xl font-semibold text-rose-600">$900</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">2 hours</span>
                          <span className="text-xl font-semibold text-rose-600">$1,200</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">3 hours</span>
                          <span className="text-xl font-semibold text-rose-600">$1,700</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">
                            Dinner Date (2hrs food + 2hrs intimacy)
                          </span>
                          <span className="text-xl font-semibold text-rose-600">$2,000</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">Overnight (10 hours)</span>
                          <span className="text-xl font-semibold text-rose-600">$4,000</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-lg text-gray-800">Social only (1 hour)</span>
                          <span className="text-xl font-semibold text-rose-600">$400</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PSE Rates */}
              <div className="mb-12">
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-8 text-center"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Pornstar Experience (PSE) Rates
                </h2>
                <div className="bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 p-8 rounded-lg shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Incall Rates</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">60 mins</span>
                          <span className="text-xl font-semibold text-pink-600">$750</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">90 mins</span>
                          <span className="text-xl font-semibold text-pink-600">$1,050</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">2 hours</span>
                          <span className="text-xl font-semibold text-pink-600">$1,400</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">3 hours</span>
                          <span className="text-xl font-semibold text-pink-600">$2,000</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">
                            Dinner Date (2hrs food + 2hrs intimacy)
                          </span>
                          <span className="text-xl font-semibold text-pink-600">$2,300</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">Overnight (10 hours)</span>
                          <span className="text-xl font-semibold text-pink-600">$6,000</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">Couples</span>
                          <span className="text-xl font-semibold text-pink-600">
                            $1,000 per hour
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-lg text-gray-800">Doubles</span>
                          <span className="text-xl font-semibold text-pink-600">$900 per hour</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Outcall Rates</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">60 mins</span>
                          <span className="text-xl font-semibold text-pink-600">$750</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">90 mins</span>
                          <span className="text-xl font-semibold text-pink-600">$1,050</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">2 hours</span>
                          <span className="text-xl font-semibold text-pink-600">$1,400</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">3 hours</span>
                          <span className="text-xl font-semibold text-pink-600">$2,000</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">
                            Dinner Date (2hrs food + 2hrs intimacy)
                          </span>
                          <span className="text-xl font-semibold text-pink-600">$2,300</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">Overnight (10 hours)</span>
                          <span className="text-xl font-semibold text-pink-600">$6,000</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-lg text-gray-800">Couples</span>
                          <span className="text-xl font-semibold text-pink-600">
                            $1,000 per hour
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-lg text-gray-800">Doubles</span>
                          <span className="text-xl font-semibold text-pink-600">$900 per hour</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extras */}
              <div className="mb-12">
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-8 text-center"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Extras
                </h2>
                <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Pegging</h3>
                      <p className="text-2xl font-bold text-gray-800">$150</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Keep my panties</h3>
                      <p className="text-2xl font-bold text-gray-800">$150</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Kink &amp; BDSM</h3>
                      <p className="text-lg text-gray-800">Light to moderate - Enquire</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    Additional extras may be provided at my discretion. Some may incur an extra fee.
                  </p>
                </div>
              </div>

              {/* Booking Information */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 sm:p-8 rounded">
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 sm:mb-6"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Booking Information
                </h3>
                <ul className="space-y-3 sm:space-y-4 text-lg text-gray-800">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3">•</span>
                    <span>Screening is always required for safety</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3">•</span>
                    <span>Deposit via Beem confirms your booking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3">•</span>
                    <span>Remaining balance settled in cash at the start</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3">•</span>
                    <span>24 hours notice required, pre-bookings preferred</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3">•</span>
                    <span>All rates in Australian Dollars (AUD)</span>
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
                Ready to Book?
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 leading-relaxed font-normal mb-10 sm:mb-12">
                Reach out to discuss your ideal experience and confirm availability.
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
