import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BookingModal from '../components/BookingModal';

const heroImages = [
  'https://pbs.twimg.com/media/G3hgK2hX0AAB8RL.jpg:large',
  'https://pbs.twimg.com/media/G3Gh-hdbUAAQTDo.jpg:large',
  'https://pbs.twimg.com/media/G3qlG5VWwAAkv0w.jpg:large',
  'https://pbs.twimg.com/media/G4OoP7-WoAA4YbX.jpg:large',
  'https://pbs.twimg.com/media/G22stVEaYAAuqaG.jpg:large',
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 15000); // Slowed down from 9000ms to 15000ms for better photo impact

    return () => clearInterval(interval);
  }, []);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <Helmet>
        <title>Claire Hamilton - Canberra Companion</title>
        <meta
          name="description"
          content="Claire Hamilton - Real curves. Real connection. Ultimate GFE. Independent escort based in Canberra, Australia."
        />
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
          `}
        </style>
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Full-Screen Hero Section with Photo Carousel */}
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
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
                  alt="Claire Hamilton"
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out ${transformClass}`}
                  style={{ zIndex }}
                />
              );
            })}
          </div>

          {/* Dark Overlay - Subtle for photo impact */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-rose-900/20 to-black/40" />

          {/* Content Overlay - Elegant and readable */}
          <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
            <h1
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light mb-6 sm:mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] leading-none tracking-tight animate-pulse"
              style={{
                textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                fontFamily: '"Playfair Display", serif',
                animation: 'gentle-pulse 4s ease-in-out infinite',
              }}
            >
              Claire Hamilton
            </h1>
            <p
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] mb-10 sm:mb-12 md:mb-16 max-w-4xl mx-auto leading-relaxed font-light"
              style={{
                textShadow: '1px 1px 6px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
                fontFamily: '"Crimson Text", serif',
              }}
            >
              Real curves. Real connection. Ultimate GFE.
            </p>
            <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="group relative px-10 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-red-800/60 to-red-900/70 text-white rounded-lg text-lg sm:text-xl font-bold tracking-wide hover:shadow-2xl hover:from-red-800/80 hover:to-red-900/90 transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2 backdrop-blur-sm border border-red-700/50"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  boxShadow:
                    '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
                aria-label="Book an appointment now"
              >
                Book Now
                <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </button>
              <Link
                to="/gallery"
                className="group px-10 sm:px-12 py-4 sm:py-5 border-2 border-rose-300 text-rose-100 rounded-lg text-lg sm:text-xl font-semibold tracking-wide hover:bg-rose-50/20 hover:border-rose-200 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-rose-400 focus:ring-offset-2 backdrop-blur-sm"
                aria-label="View photo gallery"
              >
                View Gallery
                <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Carousel Indicators - Now Clickable */}
          <div className="absolute bottom-6 z-20 flex gap-3 justify-center w-full">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white/50 border-2 ${
                  index === currentImageIndex
                    ? 'bg-white/20 border-white w-6'
                    : 'bg-transparent border-white/60 w-2 hover:bg-white/10 hover:border-white'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </section>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
