import { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Services from './pages/Services';
import Prices from './pages/Prices';
import FlyMeToYou from './pages/FlyMeToYou';
import { initializeSession, registerSession, trackConversion } from './utils/utm.service';

function App() {
  const location = useLocation();

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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <nav className="flex justify-between items-center">
              <Link
                to="/"
                className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-900 tracking-tight hover:text-rose-600 transition-colors"
              >
                Claire Hamilton
              </Link>
              <div className="flex space-x-4 sm:space-x-6 lg:space-x-8 items-center text-sm sm:text-base lg:text-lg">
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
          <footer className="bg-gray-900 text-white py-12 px-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Claire Hamilton</h3>
                    <p className="text-gray-300 mb-4">
                      Real curves. Real connection. Ultimate GFE.
                    </p>
                    <p className="text-gray-300 text-sm">
                      Independent escort based in Canberra, Australia
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Contact</h3>
                    <div className="space-y-2 text-gray-300">
                      <p>SMS Only: 0403 977 680</p>
                      <p>Email: contact.clairehamilton@proton.me</p>
                      <p>WhatsApp: +61 403 977 680</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Follow Me</h3>
                    <div className="space-y-2">
                      <a
                        href="#"
                        className="block text-gray-300 hover:text-pink-400 transition-colors"
                      >
                        Twitter
                      </a>
                      <a
                        href="#"
                        className="block text-gray-300 hover:text-pink-400 transition-colors"
                      >
                        OnlyFans (Free)
                      </a>
                      <a
                        href="#"
                        className="block text-gray-300 hover:text-pink-400 transition-colors"
                      >
                        Bluesky
                      </a>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                  <p className="text-gray-400 text-sm">
                    © 2025 Claire Hamilton. All rights reserved. | Privacy & Discretion Guaranteed
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}

export default App;
