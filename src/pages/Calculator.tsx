import { Helmet } from 'react-helmet-async';
import InteractiveHayCalculator from '../components/InteractiveHayCalculator';
import '../styles/neo-australian.css';

export default function Calculator() {
  return (
    <>
      <Helmet>
        <title>Hay Calculator - O&apos;Sullivan Farms | Calculate Feed Costs</title>
        <meta
          name="description"
          content="Interactive hay calculator for Australian farmers. Calculate feed costs for your livestock with real-time pricing on lucerne, oaten, and wheaten hay. Fair dinkum pricing - no hidden costs!"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        {/* Topographical Grid */}
        <div className="topo-grid" />

        {/* Hero Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bebas text-wattle-gold mb-6 aussie-pride glitch-hover">
              🧮 HAY CALCULATOR 🧮
            </h1>
            <p className="text-xl md:text-2xl font-space-mono text-digital-matrix mb-4">
              36°08&apos;39.6&quot;S 144°45&apos;36.0&quot;E | ECHUCA, VICTORIA
            </p>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-playfair italic">
              Work out your feed costs in a jiffy! Australian hay prices, calculated for Aussie
              conditions.
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="relative py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <InteractiveHayCalculator />
          </div>
        </section>

        {/* Info Section */}
        <section className="relative py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="service-card-neo p-8">
              <h2 className="text-3xl font-bebas text-wattle-gold mb-6 text-center">
                HOW IT WORKS
              </h2>

              <div className="grid md:grid-cols-2 gap-8 text-gray-300 font-playfair">
                <div>
                  <h3 className="text-xl font-bebas text-eucalyptus mb-3">🐄 Step 1: Animals</h3>
                  <p>
                    Tell us how many head of cattle, sheep, or horses you&apos;re feeding. Works for
                    any livestock!
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bebas text-eucalyptus mb-3">📅 Step 2: Duration</h3>
                  <p>
                    How many weeks do you need to feed them? From 1 week to a full year - we&apos;ve
                    got you covered.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bebas text-eucalyptus mb-3">🌾 Step 3: Hay Type</h3>
                  <p>
                    Choose from premium Lucerne (high protein), Oaten (balanced), or Wheaten
                    (economical). All top-quality Australian hay.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bebas text-eucalyptus mb-3">💰 Step 4: Quote</h3>
                  <p>
                    Get instant pricing with volume discounts automatically applied. Transport costs
                    included. No hidden fees!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Features */}
        <section className="relative py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bebas text-wattle-gold mb-12 text-center aussie-pride">
              FAIR DINKUM PRICING
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="service-card-neo p-6 text-center hover:scale-105 transition-transform">
                <div className="text-5xl mb-4">💵</div>
                <h3 className="text-2xl font-bebas text-eucalyptus mb-3">Volume Discounts</h3>
                <p className="text-gray-300 font-playfair">
                  5% off orders over 50 tonnes, 10% off over 100 tonnes. Automatic savings!
                </p>
              </div>

              <div className="service-card-neo p-6 text-center hover:scale-105 transition-transform">
                <div className="text-5xl mb-4">🚚</div>
                <h3 className="text-2xl font-bebas text-eucalyptus mb-3">Transport Included</h3>
                <p className="text-gray-300 font-playfair">
                  Delivery costs calculated upfront. No surprises. GPS tracking on all B-doubles.
                </p>
              </div>

              <div className="service-card-neo p-6 text-center hover:scale-105 transition-transform">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bebas text-eucalyptus mb-3">Live Pricing</h3>
                <p className="text-gray-300 font-playfair">
                  Prices updated daily based on market conditions. Always get the best rate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-outback-red/40 to-eucalyptus/20 cyber-border rounded-lg p-12">
              <h2 className="text-4xl font-bebas text-wattle-gold mb-6 aussie-pride">
                READY TO ORDER?
              </h2>
              <p className="text-xl text-gray-300 mb-8 font-playfair">
                Use the calculator above to get your quote, then give us a call or send through a
                booking request. We&apos;ll have your hay on the way faster than a kangaroo on a hot
                tin roof!
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a href="tel:+61400000000" className="btn-aussie-primary">
                  📞 Call Now
                </a>
                <a href="/services#booking" className="btn-aussie-secondary">
                  📋 Book Delivery
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
