import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTenant } from '../core/hooks/useTenant';
import BookingModal from '../components/BookingModal';
import MatrixRain from '../components/MatrixRain';
import SouthernCross from '../components/SouthernCross';
import AussieWeatherWidget from '../components/AussieWeatherWidget';
import FloatingAussieMascot from '../components/FloatingAussieMascot';
import '../styles/neo-australian.css';

export default function Home() {
  const { content } = useTenant();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

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

            /* Delay animations for particles */
            .delay-100 { animation-delay: 0.1s; }
            .delay-200 { animation-delay: 0.2s; }
            .delay-300 { animation-delay: 0.3s; }

            /* Allow scrolling on home page */
            html, body {
              overflow-y: auto;
              overflow-x: hidden;
              margin: 0;
              padding: 0;
            }

            /* Ensure images cover the full area properly */
            .home-page img {
              object-position: center;
            }

            /* Hide scroll bar for cleaner look */
            html::-webkit-scrollbar,
            body::-webkit-scrollbar {
              width: 8px;
            }
            
            html::-webkit-scrollbar-track,
            body::-webkit-scrollbar-track {
              background: #1a1a1a;
            }
            
            html::-webkit-scrollbar-thumb,
            body::-webkit-scrollbar-thumb {
              background: var(--wattle-gold);
              border-radius: 4px;
            }
            
            html {
              scrollbar-width: thin;
              scrollbar-color: var(--wattle-gold) #1a1a1a;
            }
          `}
        </style>
      </Helmet>

      <div className="home-page bg-black min-h-screen overflow-y-auto">
        {/* Full-Screen Hero Section with Peter Rabbit Background */}
        <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
          {/* Static Peter Rabbit Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img
              src="/images/peter-rabbit.jpg"
              alt="Peter Rabbit in the Garden - O'Sullivan Farms"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center 40%', filter: 'brightness(0.85)' }}
            />
          </div>

          {/* Lighter Dark Overlay - More transparent to see Peter */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

          {/* Matrix Rain Effect - Subtle */}
          <MatrixRain opacity={0.05} />

          {/* Southern Cross Constellation */}
          <SouthernCross />

          {/* Scan Line Effect */}
          <div className="scan-line" />

          {/* Topographical Grid */}
          <div className="topo-grid" />

          {/* Vignette Effect - Focus on Peter */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%)',
            }}
          />

          {/* Content Overlay - Neo-Australian Style */}
          <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center h-full neo-hero">
            {/* Australian Flag Icons */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-5xl drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">🇦🇺</span>
              <div>
                <h1
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light mb-2 leading-none tracking-tight glitch-continuous"
                  style={{
                    fontFamily: 'var(--heading-font)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textShadow: '0 4px 20px rgba(0,0,0,1), 0 0 30px rgba(255,215,0,0.3)',
                  }}
                >
                  {content.name}
                </h1>
              </div>
              <span className="text-5xl drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">🇦🇺</span>
            </div>

            {/* Tagline */}
            <p
              className="tagline text-2xl sm:text-3xl md:text-4xl italic mb-3 max-w-4xl mx-auto"
              style={{
                fontFamily: 'var(--body-font)',
                textShadow: '0 3px 15px rgba(0,0,0,1), 0 0 20px rgba(255,215,0,0.2)',
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
            <p className="digital-coords mb-8">
              36°08&apos;39.6&quot;S 144°45&apos;36.0&quot;E | ECHUCA, VICTORIA
            </p>

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

        {/* Interactive Sections Below Hero */}
        <div
          className="py-16 px-4 relative z-10 overflow-hidden"
          style={{
            background: 'linear-gradient(to bottom, #1a1a1a 0%, #111827 100%)',
          }}
        >
          {/* Smooth Transition Overlay - lighter blend */}
          <div
            className="absolute top-0 left-0 right-0 h-32 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)',
            }}
          />

          {/* Garden Soil/Earth Texture Base - subtler */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(139, 90, 43, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 80% 30%, rgba(101, 67, 33, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 50% 80%, rgba(44, 95, 45, 0.25) 0%, transparent 60%)
              `,
            }}
          />

          {/* Organic Garden Row Pattern - very subtle */}
          <div className="absolute inset-0 opacity-8">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    90deg, 
                    transparent 0px, 
                    rgba(44, 95, 45, 0.3) 2px, 
                    transparent 4px,
                    transparent 60px
                  )
                `,
                backgroundSize: '60px 100%',
              }}
            />
          </div>

          {/* Vegetation/Grass Gradient from bottom - lighter */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(44, 95, 45, 0.15) 0%, transparent 50%)',
            }}
          />

          {/* Enhanced Background with natural earth tones - lighter */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute inset-0 bg-gradient-to-br from-eucalyptus/30 via-transparent to-sky-blue/20" />
          </div>

          {/* Subtle Matrix Rain - cyberpunk overlay */}
          <div className="absolute inset-0 opacity-5">
            <MatrixRain opacity={0.3} />
          </div>

          {/* Vegetable/Garden themed particles (carrots, lettuce theme) */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute top-10 left-10 w-2 h-2 bg-eucalyptus rounded-full animate-pulse"
              style={{ boxShadow: '0 0 10px rgba(44, 95, 45, 0.8)' }}
            />
            <div
              className="absolute top-20 right-20 w-2 h-2 bg-wattle-gold rounded-full animate-pulse delay-100"
              style={{ boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)' }}
            />
            <div
              className="absolute bottom-20 left-1/4 w-2 h-2 bg-eucalyptus rounded-full animate-pulse delay-200"
              style={{ boxShadow: '0 0 10px rgba(44, 95, 45, 0.8)' }}
            />
            <div
              className="absolute bottom-40 right-1/3 w-2 h-2 bg-digital-matrix rounded-full animate-pulse delay-300"
              style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.8)' }}
            />
            <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-wattle-gold rounded-full animate-pulse delay-150" />
            <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-eucalyptus rounded-full animate-pulse delay-250" />
          </div>

          {/* Organic shapes suggesting garden patches */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-40 h-40 bg-eucalyptus rounded-full blur-3xl" />
            <div className="absolute bottom-32 right-20 w-60 h-60 bg-sky-blue rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-wattle-gold rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Weather & Stats Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              <div className="flex flex-col justify-center">
                <AussieWeatherWidget />
              </div>
              <div className="cyber-border p-8 bg-gray-950/80 flex flex-col justify-center backdrop-blur-sm">
                <h3
                  className="text-3xl font-bebas text-center text-aussie-gold mb-8 uppercase tracking-wider"
                  style={{
                    textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 1)',
                  }}
                >
                  BY THE NUMBERS 🇦🇺
                </h3>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="service-card-neo p-6 border-2 border-aussie-gold/50">
                    <p
                      className="text-4xl font-bebas text-aussie-gold mb-2"
                      style={{ textShadow: '0 0 15px rgba(255, 215, 0, 0.6)' }}
                    >
                      1,200+
                    </p>
                    <p className="text-sm text-white font-space-mono font-bold">Tonnes Delivered</p>
                  </div>
                  <div className="service-card-neo p-6 border-2 border-aussie-gold/50">
                    <p
                      className="text-4xl font-bebas text-aussie-gold mb-2"
                      style={{ textShadow: '0 0 15px rgba(255, 215, 0, 0.6)' }}
                    >
                      200+
                    </p>
                    <p className="text-sm text-white font-space-mono font-bold">Happy Farmers</p>
                  </div>
                  <div className="service-card-neo p-6 border-2 border-aussie-gold/50">
                    <p
                      className="text-4xl font-bebas text-aussie-gold mb-2"
                      style={{ textShadow: '0 0 15px rgba(255, 215, 0, 0.6)' }}
                    >
                      24/7
                    </p>
                    <p className="text-sm text-white font-space-mono font-bold">GPS Tracking</p>
                  </div>
                  <div className="service-card-neo p-6 border-2 border-aussie-gold/50">
                    <p
                      className="text-4xl font-bebas text-aussie-gold mb-2"
                      style={{ textShadow: '0 0 15px rgba(255, 215, 0, 0.6)' }}
                    >
                      100%
                    </p>
                    <p className="text-sm text-white font-space-mono font-bold">Aussie Owned</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="cyber-border p-12 bg-gray-950/80 backdrop-blur-sm text-center border-4 border-aussie-gold">
              <h2
                className="text-4xl font-bebas text-aussie-gold mb-4 aussie-pride uppercase tracking-wider"
                style={{
                  textShadow: '0 0 25px rgba(255, 215, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 1)',
                }}
              >
                READY TO GET STARTED?
              </h2>
              <p className="text-xl text-white mb-8 font-playfair font-bold">
                Calculate your feed costs or book a delivery in minutes!
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/calculator" className="btn-aussie-primary">
                  🧮 Use Calculator
                </Link>
                <Link to="/services#booking" className="btn-aussie-secondary">
                  📋 Book Delivery
                </Link>
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
