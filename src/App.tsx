import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Services from './pages/Services';
import Prices from './pages/Prices';
import FlyMeToYou from './pages/FlyMeToYou';
import BookingModal from './components/BookingModal';
import { initializeSession, registerSession, trackConversion } from './utils/utm.service';

function App() {
  const location = useLocation();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    // Initialize UTM tracking and session on app load
    const initTracking = async () => {
      try {
        // Initialize local session data (sync)
        const session = initializeSession();
        console.debug('Session initialized:', session.userId);

        // Register session with backend (async, non-blocking)
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
        await registerSession(apiBaseUrl);

        // Track page view
        await trackConversion('page_view', { page: 'home' }, apiBaseUrl);
      } catch (error) {
        console.debug('Error initializing tracking:', error);
        // Don't fail the app if tracking fails
      }
    };

    initTracking();
  }, []);

  return (
    <>
      <Helmet>
        <title>Claire Hamilton</title>
        <meta name="description" content="Claire Hamilton - Melbourne Companion" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-rose-100">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 xl:py-6">
            <nav className="flex justify-between items-center max-w-7xl mx-auto">
              <Link
                to="/"
                className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-light text-gray-900 tracking-tight hover:text-rose-600 transition-colors whitespace-nowrap"
              >
                Claire Hamilton
              </Link>
              <div className="flex space-x-4 sm:space-x-6 lg:space-x-8 xl:space-x-10 items-center text-sm sm:text-base lg:text-lg xl:text-xl">
                <Link
                  to="/about"
                  className={`font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                    location.pathname === '/about'
                      ? 'text-rose-600'
                      : 'text-gray-900 hover:text-rose-600'
                  }`}
                  aria-label="About page"
                >
                  About
                </Link>
                <Link
                  to="/gallery"
                  className={`font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                    location.pathname === '/gallery'
                      ? 'text-rose-600'
                      : 'text-gray-900 hover:text-rose-600'
                  }`}
                  aria-label="Gallery page"
                >
                  Gallery
                </Link>
                <Link
                  to="/prices"
                  className={`font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                    location.pathname === '/prices'
                      ? 'text-rose-600'
                      : 'text-gray-900 hover:text-rose-600'
                  }`}
                  aria-label="Prices page"
                >
                  Prices
                </Link>
                <Link
                  to="/services"
                  className={`font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                    location.pathname === '/services'
                      ? 'text-rose-600'
                      : 'text-gray-900 hover:text-rose-600'
                  }`}
                  aria-label="Services page"
                >
                  Services
                </Link>
                <Link
                  to="/fly-me-to-you"
                  className={`font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                    location.pathname === '/fly-me-to-you'
                      ? 'text-rose-600'
                      : 'text-gray-900 hover:text-rose-600'
                  }`}
                  aria-label="Fly Me To You page"
                >
                  Fly Me To You
                </Link>
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg font-semibold hover:from-rose-700 hover:to-rose-800 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 whitespace-nowrap text-xs sm:text-sm lg:text-base"
                  aria-label="Book an appointment now"
                >
                  Book Now
                </button>
              </div>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/services" element={<Services />} />
          <Route path="/fly-me-to-you" element={<FlyMeToYou />} />
        </Routes>

        {/* Footer - Hidden on home page to maximize photo impact */}
        {location.pathname !== '/' && (
          <footer className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 mb-8 sm:mb-12 lg:mb-16">
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold mb-4 sm:mb-6">
                      Claire Hamilton
                    </h3>
                    <p className="text-gray-300 mb-4 sm:text-base lg:text-lg">
                      Real curves. Real connection. Ultimate GFE.
                    </p>
                    <p className="text-gray-300 text-sm sm:text-base">
                      Independent escort based in Canberra, Australia
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold mb-4 sm:mb-6">
                      Contact
                    </h3>
                    <div className="space-y-2 sm:space-y-3 text-gray-300 sm:text-base lg:text-lg">
                      <p>SMS Only: 0403 977 680</p>
                      <p>Email: contact.clairehamilton@proton.me</p>
                      <p>WhatsApp: +61 403 977 680</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold mb-4 sm:mb-6">
                      Follow Me
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <a
                        href="#"
                        className="block text-gray-300 hover:text-pink-400 transition-colors sm:text-base lg:text-lg"
                      >
                        Twitter
                      </a>
                      <a
                        href="#"
                        className="block text-gray-300 hover:text-pink-400 transition-colors sm:text-base lg:text-lg"
                      >
                        OnlyFans (Free)
                      </a>
                      <a
                        href="#"
                        className="block text-gray-300 hover:text-pink-400 transition-colors sm:text-base lg:text-lg"
                      >
                        Bluesky
                      </a>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-8 sm:pt-12 lg:pt-16 text-center">
                  <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                    © 2025 Claire Hamilton. All rights reserved. | Privacy & Discretion Guaranteed
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}

export default App;
