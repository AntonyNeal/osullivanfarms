import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BookingModal from '../components/BookingModal';
import { useTenant } from '../core/hooks/useTenant';
import '../styles/neo-australian.css';

export default function Services() {
  const { content, loading } = useTenant();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Services - {content.name}</title>
        <meta name="description" content={`Professional services offered by ${content.name}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Topographical Grid */}
        <div className="topo-grid" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 aussie-pride glitch-hover">
              🇦🇺 OUR SERVICES 🇦🇺
            </h1>
            <p
              className="text-2xl text-yellow-400 max-w-3xl mx-auto"
              style={{ fontFamily: 'var(--body-font)' }}
            >
              {content.tagline}
            </p>
            <p className="text-green-400 mt-3 digital-coords">
              AUSTRALIAN GROWN | AUSSIE BRED | LOCAL KNOWLEDGE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {content.services.map((service) => (
              <div
                key={service.id}
                className="service-card-neo rounded-2xl overflow-hidden hover:shadow-xl transition-all glitch-hover pulse-border"
              >
                <div className="p-8 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className="text-3xl font-bold text-white"
                      style={{ fontFamily: 'var(--heading-font)' }}
                    >
                      {service.name}
                    </h3>
                    {service.priceDisplay && (
                      <span className="text-2xl font-semibold text-yellow-400 digital-coords">
                        {service.priceDisplay}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-300 mb-4" style={{ fontFamily: 'var(--body-font)' }}>
                    {service.description}
                  </p>

                  <p className="text-sm text-green-400 mb-6 digital-coords">
                    <strong>AVAILABILITY:</strong> {service.duration}
                  </p>

                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full btn-aussie-primary glitch-hover"
                  >
                    <span>{service.price === 0 ? '🦘 REQUEST QUOTE' : '🦘 INQUIRE NOW'}</span>
                  </button>

                  {service.featured && (
                    <div className="mt-4 text-center">
                      <span
                        className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold"
                        style={{ fontFamily: 'var(--heading-font)' }}
                      >
                        ⭐ FEATURED SERVICE
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className="cyber-border rounded-2xl p-8 text-white text-center relative"
            style={{ background: 'rgba(184, 48, 44, 0.8)' }}
          >
            <h2 className="text-4xl font-bold mb-4 aussie-pride">CUSTOM SOLUTIONS AVAILABLE</h2>
            <p className="text-xl mb-6 text-yellow-100" style={{ fontFamily: 'var(--body-font)' }}>
              Need something specific? We can tailor our services to meet your agricultural needs.
            </p>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="btn-aussie-secondary glitch-hover"
            >
              <span>🇦🇺 GET IN TOUCH</span>
            </button>
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          provider={{
            id: 'osullivanfarms',
            name: content.name,
            specialty: content.tagline,
            isVerified: true,
          }}
          hourlyRate={250}
          platformFeePercentage={15}
        />
      )}
    </>
  );
}
