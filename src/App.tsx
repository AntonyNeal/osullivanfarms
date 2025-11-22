import { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTenant } from './core/hooks/useTenant';
// Hay booking pages - on ice
// import Home from './pages/Home';
// import About from './pages/About';
// import Services from './pages/Services';
// import Prices from './pages/Prices';
// import Calculator from './pages/Calculator';
import AdminDashboard from './pages/AdminDashboard';
import SheepSheet from './pages/SheepSheet';
// import ConceptsLanding from './pages/ConceptsLanding';
// import BookingModal from './components/BookingModal';
// import MobileCTABar from './components/MobileCTABar';
import { initializeSession, registerSession, trackConversion } from './utils/utm.service';
import './styles/neo-australian.css';

function App() {
  const location = useLocation();
  const { content, loading } = useTenant();
  // const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const clickCountRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle booking modal open - commented out for hay booking on ice
  // const handleBookingOpen = () => {
  //   setIsBookingOpen(true);
  //   window.dispatchEvent(new CustomEvent('modalOpened'));
  // };

  // Handle booking modal close - commented out for hay booking on ice
  // const handleBookingClose = () => {
  //   setIsBookingOpen(false);
  //   window.dispatchEvent(new CustomEvent('modalClosed'));
  // };

  useEffect(() => {
    // Initialize UTM tracking and session on app load
    const initTracking = async () => {
      try {
        // Initialize local session data (async)
        const session = await initializeSession();
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
        {/* Navigation Header - Hidden for SheepSheet (now at root) */}
        {location.pathname !== '/' && !location.pathname.startsWith('/mob') && (
          <header
            className={`sticky top-0 z-50 ${location.pathname === '/' ? 'bg-aussie-green/90 backdrop-blur-md border-b-4 border-aussie-gold' : 'bg-aussie-green/95 backdrop-blur-sm shadow-lg border-b-4 border-aussie-gold'}`}
            style={{
              boxShadow: '0 4px 30px rgba(255, 215, 0, 0.4), inset 0 0 30px rgba(0, 255, 65, 0.1)',
              background:
                location.pathname === '/'
                  ? 'linear-gradient(135deg, #006747 0%, #008751 50%, #006747 100%)'
                  : 'linear-gradient(135deg, #006747 0%, #008751 100%)',
            }}
          >
            <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 xl:py-6">
              <nav className="max-w-7xl mx-auto">
                {/* Mobile Layout */}
                <div className="lg:hidden flex justify-between items-center">
                  <div
                    onClick={() => {
                      const newCount = ++clickCountRef.current;

                      if (newCount === 3) {
                        clickCountRef.current = 0;
                        if (resetTimerRef.current) {
                          clearTimeout(resetTimerRef.current);
                          resetTimerRef.current = null;
                        }
                        window.location.href = '/admin';
                      } else if (newCount === 1) {
                        // Single click - navigate to home
                        window.location.href = '/';

                        // Clear existing timer
                        if (resetTimerRef.current) {
                          clearTimeout(resetTimerRef.current);
                        }

                        // Set new timer to reset counter after 500ms
                        resetTimerRef.current = setTimeout(() => {
                          clickCountRef.current = 0;
                          resetTimerRef.current = null;
                        }, 500);
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
                    className={`text-xl sm:text-2xl font-bold text-aussie-gold tracking-wider hover:text-white transition-all duration-300 whitespace-nowrap cursor-pointer select-none uppercase`}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      textShadow:
                        '0 0 15px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 204, 0, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.8)',
                    }}
                    title={
                      location.pathname === '/admin' ? 'Click to return home' : 'Click to go home'
                    }
                  >
                    {content.name}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        // handleBookingOpen(); // Hay booking on ice
                      }}
                      className="px-4 py-2 bg-aussie-gold text-aussie-green rounded-lg font-bold hover:bg-white hover:text-aussie-green transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-sm cursor-pointer uppercase tracking-wide border-3 border-white"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 4px 15px rgba(0, 0, 0, 0.3)',
                      }}
                      aria-label="Book your hay delivery"
                    >
                      BOOK NOW
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMobileMenuOpen(!isMobileMenuOpen);
                      }}
                      className={`p-2 text-aussie-gold hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded-lg`}
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
                      }}
                      aria-label="Toggle mobile menu"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                  {/* Glass Morphism Logo Button */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      // If on admin page, go home on any click
                      if (location.pathname === '/admin') {
                        window.location.href = '/';
                        return;
                      }

                      // Count clicks for triple-click easter egg
                      clickCountRef.current += 1;
                      const newCount = clickCountRef.current;

                      if (newCount === 3) {
                        clickCountRef.current = 0;
                        if (resetTimerRef.current) {
                          clearTimeout(resetTimerRef.current);
                          resetTimerRef.current = null;
                        }
                        window.location.href = '/admin';
                      } else if (newCount === 1) {
                        // Single click - navigate to home
                        window.location.href = '/';

                        // Clear existing timer
                        if (resetTimerRef.current) {
                          clearTimeout(resetTimerRef.current);
                        }

                        // Set new timer to reset counter after 500ms
                        resetTimerRef.current = setTimeout(() => {
                          clickCountRef.current = 0;
                          resetTimerRef.current = null;
                        }, 500);
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
                    className="px-8 py-4 rounded-xl cursor-pointer select-none transition-all duration-300 hover:scale-105"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(0, 135, 81, 0.3) 0%, rgba(0, 103, 71, 0.4) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '3px solid',
                      borderImage:
                        'linear-gradient(135deg, var(--aussie-gold) 0%, var(--wattle-gold) 50%, var(--aussie-gold) 100%) 1',
                      boxShadow:
                        '0 0 30px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 215, 0, 0.1), inset 0 4px 10px rgba(255, 255, 255, 0.1)',
                    }}
                    title={
                      location.pathname === '/admin' ? 'Click to return home' : 'Click to go home'
                    }
                  >
                    <div
                      className="text-4xl xl:text-5xl font-bold text-aussie-gold tracking-wider hover:text-white transition-all duration-300 whitespace-nowrap uppercase"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        textShadow:
                          '0 0 15px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 204, 0, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.8)',
                      }}
                    >
                      {content.name}
                    </div>
                  </div>

                  {/* Desktop Navigation */}
                  <div className="flex space-x-6 xl:space-x-8 items-center">
                    <button
                      onClick={() => {
                        // handleBookingOpen(); // Hay booking on ice
                      }}
                      className="px-8 lg:px-10 py-4 lg:py-5 bg-aussie-gold text-aussie-green rounded-lg font-bold hover:bg-white hover:text-aussie-green transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-4 whitespace-nowrap text-xl lg:text-2xl cursor-pointer uppercase tracking-wide border-4 border-white"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        boxShadow: '0 0 25px rgba(255, 215, 0, 0.8), 0 4px 15px rgba(0, 0, 0, 0.3)',
                      }}
                      aria-label="Book your hay delivery"
                    >
                      BOOK NOW
                    </button>

                    {/* Hamburger Menu Button - Desktop */}
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="p-4 text-aussie-gold hover:text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-aussie-gold rounded-lg"
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
                      }}
                      aria-label="Open menu"
                    >
                      <svg
                        className="h-12 w-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                      >
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
              </nav>

              {/* Trucker Windshield Mobile Menu - Full Screen Holographic Overlay */}
              {isMobileMenuOpen && (
                <>
                  {/* Windshield Glass Effect - Transparent overlay */}
                  <div
                    className="fixed inset-0 z-50 animate-slide-down"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(0, 135, 81, 0.95) 0%, rgba(0, 103, 71, 0.98) 100%)',
                      backdropFilter: 'blur(10px)',
                      boxShadow:
                        'inset 0 0 100px rgba(255, 215, 0, 0.1), inset 0 4px 20px rgba(255, 255, 255, 0.1)',
                    }}
                    onClick={(e) => {
                      if (e.target === e.currentTarget) setIsMobileMenuOpen(false);
                    }}
                  >
                    {/* Windshield reflection effects */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
                      }}
                    />

                    {/* Rain/scratches effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                      <div
                        className="absolute top-10 left-1/4 w-px h-32 bg-white/30"
                        style={{ transform: 'rotate(-15deg)' }}
                      />
                      <div
                        className="absolute top-1/3 right-1/4 w-px h-24 bg-white/20"
                        style={{ transform: 'rotate(20deg)' }}
                      />
                    </div>

                    {/* Content Container */}
                    <div className="relative h-full flex flex-col items-center justify-center px-8 py-20">
                      {/* Close button - Top right corner like sun visor */}
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="absolute top-8 right-8 text-aussie-gold hover:text-white transition-all duration-300 transform hover:rotate-90 p-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-aussie-gold"
                        style={{
                          fontSize: '4rem',
                          textShadow: '0 0 30px rgba(255, 215, 0, 1)',
                          fontWeight: 'bold',
                        }}
                        aria-label="Close menu"
                      >
                        ✕
                      </button>

                      {/* Logo at top */}
                      <div
                        className="mb-16 text-center"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '3rem',
                          color: 'var(--aussie-gold)',
                          textShadow:
                            '0 0 40px rgba(255, 215, 0, 1), 0 0 80px rgba(255, 215, 0, 0.6)',
                          letterSpacing: '0.3em',
                        }}
                      >
                        O&apos;SULLIVAN FARMS
                      </div>

                      {/* Big Holographic Buttons */}
                      <div className="space-y-8 w-full max-w-2xl px-4">
                        <Link
                          to="/"
                          className="hologram-button block"
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{
                            fontFamily: 'var(--font-heading)',
                          }}
                        >
                          <span className="hologram-icon">🏠</span>
                          <span className="hologram-text">HOME</span>
                        </Link>

                        <Link
                          to="/about"
                          className="hologram-button block"
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{
                            fontFamily: 'var(--font-heading)',
                          }}
                        >
                          <span className="hologram-icon">🇦🇺</span>
                          <span className="hologram-text">ABOUT</span>
                        </Link>

                        <Link
                          to="/services"
                          className="hologram-button block"
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{
                            fontFamily: 'var(--font-heading)',
                          }}
                        >
                          <span className="hologram-icon">🚜</span>
                          <span className="hologram-text">SERVICES</span>
                        </Link>

                        <Link
                          to="/prices"
                          className="hologram-button block"
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{
                            fontFamily: 'var(--font-heading)',
                          }}
                        >
                          <span className="hologram-icon">💰</span>
                          <span className="hologram-text">PRICES</span>
                        </Link>

                        <Link
                          to="/calculator"
                          className="hologram-button block"
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{
                            fontFamily: 'var(--font-heading)',
                          }}
                        >
                          <span className="hologram-icon">🧮</span>
                          <span className="hologram-text">CALCULATOR</span>
                        </Link>

                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            // handleBookingOpen(); // Hay booking on ice
                          }}
                          className="hologram-button block w-full border-4 border-aussie-gold"
                          style={{
                            fontFamily: 'var(--font-heading)',
                            background:
                              'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%)',
                          }}
                        >
                          <span className="hologram-icon">📞</span>
                          <span className="hologram-text">BOOK NOW</span>
                        </button>
                      </div>

                      {/* Bottom tagline */}
                      <div
                        className="mt-12 text-center text-aussie-gold/80 text-sm italic"
                        style={{
                          fontFamily: 'var(--font-body)',
                          textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                        }}
                      >
                        Fair Dinkum Farming • 100% Aussie Owned
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </header>
        )}

        <Routes>
          <Route path="/*" element={<SheepSheet />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Hay booking routes - on ice */}
          {/* <Route path="/hay-booking" element={<Home />} /> */}
          {/* <Route path="/about" element={<About />} /> */}
          {/* <Route path="/prices" element={<Prices />} /> */}
          {/* <Route path="/services" element={<Services />} /> */}
          {/* <Route path="/calculator" element={<Calculator />} /> */}
        </Routes>

        {/* Footer - Hidden on home page, admin page, and sheep-sheet */}
        {location.pathname !== '/' &&
          location.pathname !== '/admin' &&
          !location.pathname.startsWith('/sheep-sheet') && (
            <footer className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8">
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 mb-8 sm:mb-12 lg:mb-16">
                    <div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold mb-4 sm:mb-6">
                        {content.name}
                      </h3>
                      <p className="text-gray-300 mb-4 sm:text-base lg:text-lg">
                        {content.tagline}
                      </p>
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

      {/* Hay booking components - on ice */}
      {/* <BookingModal
        isOpen={isBookingOpen}
        onClose={handleBookingClose}
        provider={{
          id: 'default',
          name: 'Service Provider',
        }}
        hourlyRate={100}
        platformFeePercentage={0.1}
      /> */}
      {/* <MobileCTABar ctaText="Book Now" ctaAction={handleBookingOpen} /> */}
    </>
  );
}

export default App;
/* Build 2025-11-22 21:03:57 */
