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

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden flex flex-col">
        {/* Topographical Grid */}
        <div className="topo-grid" />

        {/* Calculator Section - Centered */}
        <section className="relative flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-5xl w-full mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-7xl font-bebas text-wattle-gold mb-4 aussie-pride glitch-hover">
                🧮 HAY CALCULATOR 🧮
              </h1>
              <p className="text-xl md:text-2xl font-space-mono text-digital-matrix mb-2">
                36°08&apos;39.6&quot;S 144°45&apos;36.0&quot;E | ECHUCA, VICTORIA
              </p>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-playfair italic">
                Work out your feed costs in a jiffy! Australian hay prices, calculated for Aussie
                conditions.
              </p>
            </div>
            <InteractiveHayCalculator />
          </div>
        </section>
      </div>
    </>
  );
}
