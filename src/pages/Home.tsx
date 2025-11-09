import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect, type MouseEvent } from 'react';
import { useTenant } from '../core/hooks/useTenant';
import BookingModal from '../components/BookingModal';
import MatrixRain from '../components/MatrixRain';
import SouthernCross from '../components/SouthernCross';
import InteractiveHayCalculator from '../components/InteractiveHayCalculator';
import AussieWeatherWidget from '../components/AussieWeatherWidget';
import FloatingAussieMascot from '../components/FloatingAussieMascot';
import '../styles/neo-australian.css';

export default function Home() {
  const { content, photos } = useTenant();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  // Get hero images from tenant photos config
  const heroImages = photos?.hero?.variants
    ? Object.values(photos.hero.variants).map((v) => v.url)
    : photos?.hero?.control
      ? [typeof photos.hero.control === 'string' ? photos.hero.control : photos.hero.control.url]
      : [];

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleIndicatorMouseDown = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    goToImage(index);
  };

  const handleIndicatorMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const delta = e.clientX - dragStart;
    if (Math.abs(delta) > 30) {
      // Dragged more than 30px
      if (delta > 0) {
        // Dragged right - go to previous image
        setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
      } else {
        // Dragged left - go to next image
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }
      setDragStart(e.clientX);
    }
  };

  const handleIndicatorMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <Helmet>
        <title>
          {content.name} - {content.tagline}
        </title>
        <meta name="description" content={`${content.name} - ${content.shortBio}`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <style>
          {`
            @keyframes gentle-pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.95; transform: scale(1.02); }
            }

            /* Hide scroll bar globally when on home page */
            html, body {
              overflow: hidden;
              margin: 0;
              padding: 0;
            }

            /* Ensure images cover the full area properly */
            .home-page img {
              object-position: center;
            }

            /* Additional scroll bar hiding */
            html::-webkit-scrollbar,
            body::-webkit-scrollbar {
              display: none;
            }
            html {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
      </Helmet>

      <div className="home-page bg-black fixed inset-0 overflow-hidden">
        {/* Full-Screen Hero Section with Photo Carousel */}
        <section className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
          {/* Carousel Container */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {heroImages.map((image, index) => {
              let transformClass = '';
              let zIndex = 0;

              if (index === currentImageIndex) {
                transformClass = 'translate-x-0';
                zIndex = 10;
              } else if (index < currentImageIndex) {
                transformClass = '-translate-x-full';
                zIndex = 5;
              } else {
                transformClass = 'translate-x-full';
                zIndex = 5;
              }

              return (
                <img
                  key={index}
                  src={image}
                  alt="O'Sullivan Farms Australian Agriculture"
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out ${transformClass}`}
                  style={{ zIndex, backgroundColor: '#1a1a1a' }}
                />
              );
            })}
          </div>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

          {/* Matrix Rain Effect */}
          <MatrixRain opacity={0.1} />

          {/* Southern Cross Constellation */}
          <SouthernCross />

          {/* Scan Line Effect */}
          <div className="scan-line" />

          {/* Topographical Grid */}
          <div className="topo-grid" />

          {/* Content Overlay - Neo-Australian Style */}
          <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center h-full neo-hero">
            {/* Australian Flag Icons */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-5xl">🇦🇺</span>
              <div>
                <h1
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] leading-none tracking-tight glitch-continuous"
                  style={{
                    fontFamily: 'var(--heading-font)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {content.name}
                </h1>
              </div>
              <span className="text-5xl">🇦🇺</span>
            </div>

            {/* Tagline */}
            <p
              className="tagline text-2xl sm:text-3xl md:text-4xl italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mb-3 max-w-4xl mx-auto"
              style={{
                fontFamily: 'var(--body-font)',
              }}
            >
              {content.tagline}
            </p>

            {/* Patriotic Slogan */}
            <p className="aussie-pride text-xl sm:text-2xl mb-4">
              100% AUSTRALIAN. 100% QUALITY. NO COMPROMISE.
            </p>

            {/* Sub-tagline */}
            <p className="text-lg sm:text-xl text-green-400 mb-2 font-semibold">
              🦘 Built on Australian soil, powered by Australian grit 🦘
            </p>

            {/* GPS Coordinates */}
            <p className="digital-coords mb-8">36°08'39.6"S 144°45'36.0"E | ECHUCA, VICTORIA</p>

            <div className="flex gap-4 sm:gap-6 justify-center flex-wrap px-4 mb-8">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="btn-aussie-primary glitch-hover"
                aria-label="Book now"
              >
                <span>🦘 BOOK NOW</span>
              </button>
              <Link
                to="/services"
                className="btn-aussie-secondary glitch-hover"
                aria-label="View services"
              >
                <span>VIEW SERVICES →</span>
              </Link>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 text-sm digital-coords">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>SYSTEM ONLINE | ACCEPTING BOOKINGS</span>
            </div>
          </div>
        </section>

        {/* Carousel Indicators - Cyberpunk Style */}
        <div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-3 justify-center select-none pointer-events-auto"
          onMouseMove={handleIndicatorMouseMove}
          onMouseUp={handleIndicatorMouseUp}
          onMouseLeave={handleIndicatorMouseUp}
        >
          {heroImages.map((_, index) => (
            <button
              key={index}
              onMouseDown={(e) => handleIndicatorMouseDown(e, index)}
              className={`rounded-full transition-all duration-300 cursor-pointer focus:outline-none flex-shrink-0 ${
                index === currentImageIndex
                  ? 'bg-gradient-to-r from-green-400 to-yellow-400 w-3 h-3'
                  : 'bg-white/30 w-2 h-2 hover:bg-yellow-400/60'
              }`}
              style={{
                boxShadow:
                  index === currentImageIndex
                    ? '0 0 10px var(--digital-matrix), 0 0 20px var(--wattle-gold)'
                    : '0 2px 4px rgba(0,0,0,0.3)',
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Interactive Sections Below Hero */}
      <div className="bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Calculator & Weather Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <InteractiveHayCalculator />
            </div>
            <div className="flex flex-col justify-center">
              <AussieWeatherWidget />
            </div>
          </div>

          {/* Quick Stats Cyber Panel */}
          <div className="cyber-border p-8 bg-gray-950/50">
            <h3 className="text-3xl font-bebas text-center text-wattle-gold mb-8">
              BY THE NUMBERS 🇦🇺
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="service-card-neo p-6">
                <p className="text-4xl font-bebas text-digital-matrix mb-2">1,200+</p>
                <p className="text-sm text-gray-400 font-space-mono">Tonnes Delivered</p>
              </div>
              <div className="service-card-neo p-6">
                <p className="text-4xl font-bebas text-digital-matrix mb-2">200+</p>
                <p className="text-sm text-gray-400 font-space-mono">Happy Farmers</p>
              </div>
              <div className="service-card-neo p-6">
                <p className="text-4xl font-bebas text-digital-matrix mb-2">24/7</p>
                <p className="text-sm text-gray-400 font-space-mono">GPS Tracking</p>
              </div>
              <div className="service-card-neo p-6">
                <p className="text-4xl font-bebas text-digital-matrix mb-2">100%</p>
                <p className="text-sm text-gray-400 font-space-mono">Aussie Owned</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        provider={{
          id: 'osullivanfarms',
          name: content.name,
          specialty: content.tagline,
          isVerified: true,
        }}
        hourlyRate={250}
        platformFeePercentage={15}
      />

      <FloatingAussieMascot />
    </>
  );
}
