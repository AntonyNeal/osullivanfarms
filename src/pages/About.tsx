import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { useTenant } from '../core/hooks/useTenant';
import AussieTestimonials from '../components/AussieTestimonials';
import FarmFactsCarousel from '../components/FarmFactsCarousel';
import '../styles/neo-australian.css';

export default function About() {
  const { content } = useTenant();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>About {content.name} - Family Owned Australian Farm</title>
        <meta
          name="description"
          content="Learn about O'Sullivan Farms - Family-operated agricultural business in Echuca, VIC. Premium hay production, reliable transport, and innovative sheep flock management solutions."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative">
        {/* Topographical Grid */}
        <div className="topo-grid" />

        {/* Hero Section */}
        <section className="relative py-20 px-4 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl mb-6 aussie-pride glitch-hover">
              🇦🇺 ABOUT {content.name.toUpperCase()} 🇦🇺
            </h1>
            <p
              className="text-2xl md:text-3xl text-yellow-400 italic mb-8"
              style={{ fontFamily: 'var(--body-font)' }}
            >
              Family owned, Aussie proud. Building on tradition since day one.
            </p>
            <p
              className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--body-font)' }}
            >
              {content.bio}
            </p>
            <p className="text-green-400 mt-6 digital-coords">
              ECHUCA, VICTORIA | 36°08'39.6"S 144°45'36.0"E
            </p>
          </div>
        </section>

        {/* Values & Operations */}
        <section className="py-16 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl mb-12 text-center aussie-pride glitch-hover">
              OUR OPERATION
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="service-card-neo p-8 pulse-border">
                <h3
                  className="text-2xl font-bold text-yellow-400 mb-4"
                  style={{ fontFamily: 'var(--heading-font)' }}
                >
                  DAILY OPERATIONS
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">{'>'}</span>
                    <span>Modern hay production with traditional Australian farming values</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">{'>'}</span>
                    <span>B-double transport fleet serving Victoria and southern NSW</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">{'>'}</span>
                    <span>Quality testing on every cut - no compromises on standards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">{'>'}</span>
                    <span>GPS-tracked deliveries for complete transparency</span>
                  </li>
                </ul>
              </div>
              <div className="service-card-neo p-8 pulse-border">
                <h3
                  className="text-2xl font-bold text-yellow-400 mb-4"
                  style={{ fontFamily: 'var(--heading-font)' }}
                >
                  AUSSIE VALUES
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">{'>'}</span>
                    <span>
                      <strong className="text-yellow-400">Quality:</strong> Premium Australian
                      produce, every time
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">{'>'}</span>
                    <span>
                      <strong className="text-yellow-400">Reliability:</strong> On-time delivery,
                      fair dinkum service
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">{'>'}</span>
                    <span>
                      <strong className="text-yellow-400">Innovation:</strong> Digital tools for
                      modern farming challenges
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">{'>'}</span>
                    <span>
                      <strong className="text-yellow-400">Community:</strong> Supporting Australian
                      agriculture together
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p
                className="text-gray-400 italic text-lg"
                style={{ fontFamily: 'var(--body-font)' }}
              >
                Built on Australian soil, powered by Australian grit. Every bale, every load, every
                service reflects our commitment to excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials - Aussie Farmers */}
        <section className="py-16 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl mb-12 text-center aussie-pride glitch-hover">
              AUSSIE FARMERS TRUST O'SULLIVAN
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="service-card-neo p-6 hover:scale-105 transition-transform">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-2xl">{'★'.repeat(5)}</div>
                  <span className="ml-3 text-sm text-green-400 digital-coords">
                    MURRAY, VIC - NOV 2025
                  </span>
                </div>
                <p className="text-gray-300 italic" style={{ fontFamily: 'var(--body-font)' }}>
                  &quot;Fair dinkum quality hay, every single time. Been buying from O'Sullivan for
                  3 seasons now - consistent cuts, reliable delivery, and they actually answer the
                  phone. That's worth its weight in gold out here.&quot;
                </p>
              </div>

              <div className="service-card-neo p-6 hover:scale-105 transition-transform">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-2xl">{'★'.repeat(5)}</div>
                  <span className="ml-3 text-sm text-green-400 digital-coords">
                    DENILIQUIN, NSW - OCT 2025
                  </span>
                </div>
                <p className="text-gray-300 italic" style={{ fontFamily: 'var(--body-font)' }}>
                  &quot;Transport service is spot-on. GPS tracking means I know exactly when my
                  load's arriving. No more waiting around all day. Professional operation from start
                  to finish.&quot;
                </p>
              </div>

              <div className="service-card-neo p-6 hover:scale-105 transition-transform">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-2xl">{'★'.repeat(5)}</div>
                  <span className="ml-3 text-sm text-green-400 digital-coords">
                    BENDIGO, VIC - SEP 2025
                  </span>
                </div>
                <p className="text-gray-300 italic" style={{ fontFamily: 'var(--body-font)' }}>
                  &quot;Straight shooters. Quality product, honest pricing, and they'll go the extra
                  mile to help you out. That's the Australian way of doing business, and O'Sullivan
                  gets it right.&quot;
                </p>
              </div>

              <div className="service-card-neo p-6 hover:scale-105 transition-transform">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-2xl">{'★'.repeat(5)}</div>
                  <span className="ml-3 text-sm text-green-400 digital-coords">
                    SHEPPARTON, VIC - AUG 2025
                  </span>
                </div>
                <p className="text-gray-300 italic" style={{ fontFamily: 'var(--body-font)' }}>
                  &quot;The flock management system they're building is exactly what we need.
                  Finally, someone who understands real farm problems and builds real solutions.
                  Can't wait for the full release.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Aussie Testimonials */}
        <section className="py-16 px-4 relative z-10">
          <AussieTestimonials />
        </section>

        {/* Farm Facts */}
        <section className="py-16 px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <FarmFactsCarousel />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div
              className="cyber-border rounded-2xl p-12 text-center"
              style={{ background: 'rgba(184, 48, 44, 0.9)' }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6 aussie-pride">
                PROUDLY AUSTRALIAN OWNED & OPERATED
              </h2>
              <p
                className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--body-font)' }}
              >
                If you're looking for premium hay, reliable transport, or innovative farm management
                solutions - let's have a yarn about how we can help your operation.
              </p>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="btn-aussie-primary glitch-hover"
              >
                <Calendar className="w-5 h-5 mr-2 inline" />
                <span>🦘 GET IN TOUCH</span>
              </button>
            </div>
          </div>
        </section>
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
    </>
  );
}
