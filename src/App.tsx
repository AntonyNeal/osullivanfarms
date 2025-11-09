import { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTenant } from './core/hooks/useTenant';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Prices from './pages/Prices';
import AdminDashboard from './pages/AdminDashboard';
import BookingModal from './components/BookingModal';
import MobileCTABar from './components/MobileCTABar';
import { initializeSession, registerSession, trackConversion } from './utils/utm.service';
import './styles/neo-australian.css';

function App() {
  const location = useLocation();
  const { content, loading } = useTenant();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const clickCountRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle booking modal open
  const handleBookingOpen = () => {
    setIsBookingOpen(true);
    window.dispatchEvent(new CustomEvent('modalOpened'));
  };

  // Handle booking modal close
  const handleBookingClose = () => {
    setIsBookingOpen(false);
    window.dispatchEvent(new CustomEvent('modalClosed'));
  };

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

  // Show loading state while tenant data is being fetched
  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{content.name}</title>
        <meta name="description" content={content.shortBio || content.bio} />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Navigation Header */}
        <header
          className={`sticky top-0 z-50 ${location.pathname === '/' ? 'bg-transparent backdrop-blur-md border-b-0' : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-rose-100'}`}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 xl:py-6">
            <nav className="max-w-7xl mx-auto">
              {/* Mobile Layout */}
              <div className="lg:hidden flex justify-between items-center">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    // If on admin page, go home on any click
                    if (location.pathname === '/admin') {
                      window.location.href = '/';
                      return;
                    }

                    // Otherwise, use triple-click to access admin
                    clickCountRef.current += 1;
                    const newCount = clickCountRef.current;

                    if (newCount === 3) {
                      clickCountRef.current = 0;
                      if (resetTimerRef.current) {
                        clearTimeout(resetTimerRef.current);
                        resetTimerRef.current = null;
                      }
                      window.location.href = '/admin';
                    } else {
                      // Clear existing timer
                      if (resetTimerRef.current) {
                        clearTimeout(resetTimerRef.current);
                      }

                      // Set new timer to reset counter after 500ms
                      resetTimerRef.current = setTimeout(() => {
                        clickCountRef.current = 0;
                        resetTimerRef.current = null;
                      }, 500);
                    }
                  }}
                  className={`text-xl sm:text-2xl font-light ${location.pathname === '/' ? 'text-white' : 'text-gray-900'} tracking-tight hover:text-wattle-gold transition-colors whitespace-nowrap cursor-pointer select-none`}
                  style={
                    location.pathname === '/' ? { textShadow: '0 2px 8px rgba(0,0,0,0.8)' } : {}
                  }
                  title={
                    location.pathname === '/admin'
                      ? 'Click to return home'
                      : 'Triple-click for surprise!'
                  }
                >
                  {content.name}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      handleBookingOpen();
                    }}
                    className="px-3 py-2 bg-gradient-to-r from-eucalyptus to-sky-blue text-white rounded-lg font-semibold hover:from-wattle-gold hover:to-eucalyptus transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-wattle-gold focus:ring-offset-2 text-sm cursor-pointer"
                    aria-label="Book an appointment now"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMobileMenuOpen(!isMobileMenuOpen);
                    }}
                    className={`p-2 ${location.pathname === '/' ? 'text-white' : 'text-gray-900'} hover:text-wattle-gold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-wattle-gold focus:ring-offset-2 rounded-lg`}
                    style={
                      location.pathname === '/'
                        ? { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }
                        : {}
                    }
                    aria-label="Toggle mobile menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isMobileMenuOpen ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:flex justify-between items-center">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    // If on admin page, go home on any click
                    if (location.pathname === '/admin') {
                      window.location.href = '/';
                      return;
                    }

                    // Otherwise, use triple-click to access admin
                    clickCountRef.current += 1;
                    const newCount = clickCountRef.current;

                    if (newCount === 3) {
                      clickCountRef.current = 0;
                      if (resetTimerRef.current) {
                        clearTimeout(resetTimerRef.current);
                        resetTimerRef.current = null;
                      }
                      window.location.href = '/admin';
                    } else {
                      // Clear existing timer
                      if (resetTimerRef.current) {
                        clearTimeout(resetTimerRef.current);
                      }

                      // Set new timer to reset counter after 500ms
                      resetTimerRef.current = setTimeout(() => {
                        clickCountRef.current = 0;
                        resetTimerRef.current = null;
                      }, 500);
                    }
                  }}
                  className={`text-3xl xl:text-4xl font-light ${location.pathname === '/' ? 'text-white' : 'text-gray-900'} tracking-tight hover:text-wattle-gold transition-colors whitespace-nowrap cursor-pointer select-none`}
                  style={
                    location.pathname === '/' ? { textShadow: '0 2px 8px rgba(0,0,0,0.8)' } : {}
                  }
                  title={
                    location.pathname === '/admin'
                      ? 'Click to return home'
                      : 'Triple-click for surprise!'
                  }
                >
                  {content.name}
                </div>

                {/* Desktop Navigation */}
                <div className="flex space-x-6 xl:space-x-8 items-center">
                  <Link
                    to="/about"
                    className={`font-medium transition-colors duration-300 focus:outline-none focus:text-wattle-gold ${
                      location.pathname === '/about'
                        ? 'text-wattle-gold'
                        : location.pathname === '/'
                          ? 'text-white hover:text-wattle-gold'
                          : 'text-gray-900 hover:text-wattle-gold'
                    }`}
                    style={
                      location.pathname === '/' ? { textShadow: '0 2px 4px rgba(0,0,0,0.8)' } : {}
                    }
                    aria-label="About page"
                  >
                    About
                  </Link>
                  <Link
                    to="/prices"
                    className={`font-medium transition-colors duration-300 focus:outline-none focus:text-wattle-gold ${
                      location.pathname === '/prices'
                        ? 'text-wattle-gold'
                        : location.pathname === '/'
                          ? 'text-white hover:text-wattle-gold'
                          : 'text-gray-900 hover:text-wattle-gold'
                    }`}
                    style={
                      location.pathname === '/' ? { textShadow: '0 2px 4px rgba(0,0,0,0.8)' } : {}
                    }
                    aria-label="Prices page"
                  >
                    Prices
                  </Link>
                  <Link
                    to="/services"
                    className={`font-medium transition-colors duration-300 focus:outline-none focus:text-wattle-gold ${
                      location.pathname === '/services'
                        ? 'text-wattle-gold'
                        : location.pathname === '/'
                          ? 'text-white hover:text-wattle-gold'
                          : 'text-gray-900 hover:text-wattle-gold'
                    }`}
                    style={
                      location.pathname === '/' ? { textShadow: '0 2px 4px rgba(0,0,0,0.8)' } : {}
                    }
                    aria-label="Services page"
                  >
                    Services
                  </Link>
                  <button
                    onClick={() => {
                      handleBookingOpen();
                    }}
                    className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-eucalyptus to-sky-blue text-white rounded-lg font-semibold hover:from-wattle-gold hover:to-eucalyptus transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-wattle-gold focus:ring-offset-2 whitespace-nowrap text-xs sm:text-sm lg:text-base cursor-pointer"
                    aria-label="Book an appointment now"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50">
                <div className="px-4 py-6 space-y-4">
                  <Link
                    to="/about"
                    className={`block font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                      location.pathname === '/about'
                        ? 'text-rose-600'
                        : 'text-gray-900 hover:text-rose-600'
                    }`}
                    aria-label="About page"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/prices"
                    className={`block font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                      location.pathname === '/prices'
                        ? 'text-rose-600'
                        : 'text-gray-900 hover:text-rose-600'
                    }`}
                    aria-label="Prices page"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Prices
                  </Link>
                  <Link
                    to="/services"
                    className={`block font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                      location.pathname === '/services'
                        ? 'text-rose-600'
                        : 'text-gray-900 hover:text-rose-600'
                    }`}
                    aria-label="Services page"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Services
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/services" element={<Services />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        {/* Footer - Hidden on home page and admin page */}
        {location.pathname !== '/' && location.pathname !== '/admin' && (
          <footer className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 mb-8 sm:mb-12 lg:mb-16">
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold mb-4 sm:mb-6">
                      {content.name}
                    </h3>
                    <p className="text-gray-300 mb-4 sm:text-base lg:text-lg">{content.tagline}</p>
                    <p className="text-gray-300 text-sm sm:text-base">{content.shortBio}</p>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold mb-4 sm:mb-6">
                      Contact
                    </h3>
                    <div className="space-y-2 sm:space-y-3 text-gray-300 sm:text-base lg:text-lg">
                      <p>Phone: (03) 5480 0123</p>
                      <p>Email: sales@osullivanfarms.com.au</p>
                      <p>Location: Echuca, Victoria</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold mb-4 sm:mb-6">
                      Connect
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <a
                        href="https://www.facebook.com/osullivanfarms"
                        className="block text-gray-300 hover:text-wattle-gold transition-colors sm:text-base lg:text-lg"
                      >
                        Facebook
                      </a>
                      <a
                        href="https://www.instagram.com/osullivanfarms"
                        className="block text-gray-300 hover:text-wattle-gold transition-colors sm:text-base lg:text-lg"
                      >
                        Instagram
                      </a>
                      <a
                        href="https://twitter.com/osullivanfarms"
                        className="block text-gray-300 hover:text-wattle-gold transition-colors sm:text-base lg:text-lg"
                      >
                        Twitter/X
                      </a>
                    </div>
                  </div>
                </div>
                <div className="border-t border-eucalyptus pt-8 sm:pt-12 lg:pt-16 text-center">
                  <p className="text-wattle-gold text-base sm:text-lg lg:text-xl font-bebas mb-2">
                    🇦🇺 PROUDLY AUSTRALIAN OWNED & OPERATED 🇦🇺
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                    © 2025 {content.name}. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleBookingClose}
        provider={{
          id: 'default',
          name: 'Service Provider',
        }}
        hourlyRate={100}
        platformFeePercentage={0.1}
      />
      {location.pathname !== '/admin' && (
        <MobileCTABar ctaText="Book Now" ctaAction={handleBookingOpen} />
      )}
    </>
  );
}

export default App;
