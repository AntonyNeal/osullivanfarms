import { Helmet } from 'react-helmet-async';
import { useTenant } from '../core/hooks/useTenant';
import '../styles/neo-australian.css';

export default function Prices() {
  const { content } = useTenant();

  return (
    <>
      <Helmet>
        <title>Pricing - O'Sullivan Farms | Australian Agricultural Products</title>
        <meta
          name="description"
          content="Competitive pricing on premium Australian hay, straw, and agricultural transport services. Fair dinkum value for Aussie farmers."
        />
      </Helmet>

      <div className="py-12 bg-gray-900 text-white min-h-screen relative overflow-hidden">
        {/* Topographical Grid Overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `
                 linear-gradient(var(--digital-matrix) 1px, transparent 1px),
                 linear-gradient(90deg, var(--digital-matrix) 1px, transparent 1px)
               `,
            backgroundSize: '50px 50px',
          }}
        ></div>

        {/* Scan Line Effect */}
        <div className="scan-line"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Hero Header */}
          <div className="text-center mb-12 aussie-pride">
            <h1 className="text-5xl md:text-7xl font-bebas mb-4 text-wattle-gold glitch">
              🇦🇺 PRICING 🇦🇺
            </h1>
            <p className="text-xl md:text-2xl font-space-mono text-digital-matrix mb-2">
              36°08'39.6"S 144°45'36.0"E | ECHUCA, VICTORIA
            </p>
            <p className="text-lg text-eucalyptus font-playfair italic">
              Fair Dinkum Value | Aussie Quality | No Hidden Costs
            </p>
          </div>

          {/* HAY PRODUCTION PRICING */}
          <section className="mb-16">
            <h2 className="text-4xl font-bebas mb-8 text-center text-wattle-gold">
              🌾 HAY PRODUCTION PRICING
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Lucerne Hay */}
              <div className="service-card-neo pulse-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bebas text-wattle-gold">LUCERNE HAY</h3>
                  <span className="text-3xl">🍃</span>
                </div>
                <div className="border-t border-eucalyptus pt-4 mb-4">
                  <p className="text-4xl font-bebas text-digital-matrix mb-2">$420</p>
                  <p className="text-gray-400 font-space-mono text-sm">PER TONNE</p>
                </div>
                <ul className="space-y-2 text-gray-300 font-playfair mb-6">
                  <li>✓ Premium protein-rich feed</li>
                  <li>✓ Horse & cattle quality</li>
                  <li>✓ Small square bales (8-wire)</li>
                  <li>✓ Dust extracted & tested</li>
                  <li>✓ Minimum 5 tonne order</li>
                </ul>
                <div className="digital-coords text-xs">MURRAY VALLEY GROWN | SEASON 2024/25</div>
              </div>

              {/* Oaten Hay */}
              <div className="service-card-neo pulse-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bebas text-wattle-gold">OATEN HAY</h3>
                  <span className="text-3xl">🌾</span>
                </div>
                <div className="border-t border-eucalyptus pt-4 mb-4">
                  <p className="text-4xl font-bebas text-digital-matrix mb-2">$340</p>
                  <p className="text-gray-400 font-space-mono text-sm">PER TONNE</p>
                </div>
                <ul className="space-y-2 text-gray-300 font-playfair mb-6">
                  <li>✓ All-purpose feed solution</li>
                  <li>✓ Dairy & sheep ideal</li>
                  <li>✓ 8x4x3 large squares</li>
                  <li>✓ Consistent quality grade</li>
                  <li>✓ Minimum 10 tonne order</li>
                </ul>
                <div className="digital-coords text-xs">VICTORIAN HARVEST | CERTIFIED AUSSIE</div>
              </div>

              {/* Wheaten Hay */}
              <div className="service-card-neo pulse-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bebas text-wattle-gold">WHEATEN HAY</h3>
                  <span className="text-3xl">🌻</span>
                </div>
                <div className="border-t border-eucalyptus pt-4 mb-4">
                  <p className="text-4xl font-bebas text-digital-matrix mb-2">$320</p>
                  <p className="text-gray-400 font-space-mono text-sm">PER TONNE</p>
                </div>
                <ul className="space-y-2 text-gray-300 font-playfair mb-6">
                  <li>✓ Cost-effective roughage</li>
                  <li>✓ Beef cattle favourite</li>
                  <li>✓ Round or square bales</li>
                  <li>✓ Weather-protected storage</li>
                  <li>✓ Minimum 15 tonne order</li>
                </ul>
                <div className="digital-coords text-xs">
                  BULK PRICING AVAILABLE | CALL FOR QUOTE
                </div>
              </div>
            </div>
          </section>

          {/* TRANSPORT SERVICES */}
          <section className="mb-16">
            <h2 className="text-4xl font-bebas mb-8 text-center text-wattle-gold">
              🚛 TRANSPORT SERVICES
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Local Delivery */}
              <div className="service-card-neo pulse-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bebas text-wattle-gold">LOCAL DELIVERY</h3>
                  <span className="text-3xl">🦘</span>
                </div>
                <div className="border-t border-eucalyptus pt-4 mb-4">
                  <p className="text-4xl font-bebas text-digital-matrix mb-2">$180</p>
                  <p className="text-gray-400 font-space-mono text-sm">UP TO 100KM RADIUS</p>
                </div>
                <ul className="space-y-2 text-gray-300 font-playfair mb-6">
                  <li>✓ Same-day delivery available</li>
                  <li>✓ GPS-tracked B-doubles</li>
                  <li>✓ Load weight up to 30 tonnes</li>
                  <li>✓ Unloading assistance included</li>
                  <li>✓ Echuca | Shepparton | Bendigo region</li>
                </ul>
                <div className="digital-coords text-xs">FLAT RATE | NO FUEL SURCHARGE</div>
              </div>

              {/* Interstate Freight */}
              <div className="service-card-neo pulse-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bebas text-wattle-gold">INTERSTATE FREIGHT</h3>
                  <span className="text-3xl">🛣️</span>
                </div>
                <div className="border-t border-eucalyptus pt-4 mb-4">
                  <p className="text-4xl font-bebas text-digital-matrix mb-2">$2.20</p>
                  <p className="text-gray-400 font-space-mono text-sm">PER KM | PER TONNE</p>
                </div>
                <ul className="space-y-2 text-gray-300 font-playfair mb-6">
                  <li>✓ NSW | SA | QLD destinations</li>
                  <li>✓ Full load 30+ tonne capacity</li>
                  <li>✓ Scheduled weekly runs</li>
                  <li>✓ Real-time tracking updates</li>
                  <li>✓ Competitive group booking rates</li>
                </ul>
                <div className="digital-coords text-xs">QUOTE REQUIRED | PHONE OR EMAIL</div>
              </div>
            </div>
          </section>

          {/* STRAW & BEDDING */}
          <section className="mb-16">
            <h2 className="text-4xl font-bebas mb-8 text-center text-wattle-gold">
              🏵️ STRAW & BEDDING
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Wheat Straw */}
              <div className="service-card-neo pulse-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bebas text-wattle-gold">WHEAT STRAW</h3>
                  <span className="text-3xl">🌾</span>
                </div>
                <div className="border-t border-eucalyptus pt-4 mb-4">
                  <p className="text-4xl font-bebas text-digital-matrix mb-2">$120</p>
                  <p className="text-gray-400 font-space-mono text-sm">PER TONNE</p>
                </div>
                <ul className="space-y-2 text-gray-300 font-playfair mb-6">
                  <li>✓ Premium animal bedding</li>
                  <li>✓ Low dust & clean cut</li>
                  <li>✓ Small squares 8-wire</li>
                  <li>✓ Stables & poultry farms</li>
                  <li>✓ Minimum 3 tonne order</li>
                </ul>
                <div className="digital-coords text-xs">YEAR-ROUND SUPPLY | BULK DISCOUNTS</div>
              </div>

              {/* Barley Straw */}
              <div className="service-card-neo pulse-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bebas text-wattle-gold">BARLEY STRAW</h3>
                  <span className="text-3xl">🌿</span>
                </div>
                <div className="border-t border-eucalyptus pt-4 mb-4">
                  <p className="text-4xl font-bebas text-digital-matrix mb-2">$100</p>
                  <p className="text-gray-400 font-space-mono text-sm">PER TONNE</p>
                </div>
                <ul className="space-y-2 text-gray-300 font-playfair mb-6">
                  <li>✓ Economical bedding option</li>
                  <li>✓ Composting & mulch grade</li>
                  <li>✓ Round bales available</li>
                  <li>✓ Garden & landscaping use</li>
                  <li>✓ Minimum 5 tonne order</li>
                </ul>
                <div className="digital-coords text-xs">
                  FARM PICKUP AVAILABLE | SAVE ON FREIGHT
                </div>
              </div>
            </div>
          </section>

          {/* FLOCK MANAGEMENT BETA */}
          <section className="mb-16">
            <div className="service-card-neo pulse-border cyber-border">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bebas text-wattle-gold mb-4">
                  🐑 FLOCK MANAGEMENT SYSTEM - BETA
                </h2>
                <p className="text-xl text-digital-matrix font-space-mono">
                  EARLY ACCESS PROGRAM | LIMITED SPOTS
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bebas text-eucalyptus mb-4">BETA PRICING</h3>
                  <div className="mb-6">
                    <p className="text-5xl font-bebas text-digital-matrix mb-2">$49</p>
                    <p className="text-gray-400 font-space-mono text-sm">PER MONTH | BETA RATE</p>
                    <p className="text-sm text-gray-500 italic mt-2">
                      Regular price $149/month after beta
                    </p>
                  </div>
                  <ul className="space-y-2 text-gray-300 font-playfair">
                    <li>✓ Digital flock tracking</li>
                    <li>✓ Health & vaccination records</li>
                    <li>✓ GPS pasture mapping</li>
                    <li>✓ Feed consumption analytics</li>
                    <li>✓ Priority beta support</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-bebas text-eucalyptus mb-4">PROGRAM BENEFITS</h3>
                  <ul className="space-y-3 text-gray-300 font-playfair">
                    <li>
                      🎯 <strong>Lock in beta pricing</strong> - Keep $49/month rate for 24 months
                    </li>
                    <li>
                      🚀 <strong>Feature requests</strong> - Direct input on development
                    </li>
                    <li>
                      🇦🇺 <strong>Aussie farmer community</strong> - Beta tester network
                    </li>
                    <li>
                      📊 <strong>Free data migration</strong> - From existing systems
                    </li>
                    <li>
                      💚 <strong>Lifetime discount</strong> - 50% off after beta ends
                    </li>
                  </ul>
                  <div className="mt-6">
                    <a href="/contact" className="btn-aussie-primary inline-block">
                      🦘 APPLY FOR BETA ACCESS
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-eucalyptus">
                <p className="text-center text-gray-400 text-sm font-space-mono">
                  ONLY 50 BETA SPOTS AVAILABLE | 32 REMAINING | CLOSES JAN 2025
                </p>
              </div>
            </div>
          </section>

          {/* PAYMENT & TERMS */}
          <section className="mb-16">
            <h2 className="text-4xl font-bebas mb-8 text-center text-wattle-gold">
              💳 PAYMENT & TERMS
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="service-card-neo">
                <h3 className="text-xl font-bebas text-eucalyptus mb-4">PAYMENT OPTIONS</h3>
                <ul className="space-y-2 text-gray-300 font-playfair text-sm">
                  <li>✓ 30-day account (approved customers)</li>
                  <li>✓ Credit card (Visa, Mastercard)</li>
                  <li>✓ Direct bank transfer</li>
                  <li>✓ Cash on delivery</li>
                  <li>✓ Livestock exchange program</li>
                </ul>
              </div>
              <div className="service-card-neo">
                <h3 className="text-xl font-bebas text-eucalyptus mb-4">DISCOUNTS</h3>
                <ul className="space-y-2 text-gray-300 font-playfair text-sm">
                  <li>
                    🌾 <strong>5%</strong> - Orders over 50 tonnes
                  </li>
                  <li>
                    🌾 <strong>10%</strong> - Orders over 100 tonnes
                  </li>
                  <li>
                    🌾 <strong>15%</strong> - Annual contracts
                  </li>
                  <li>
                    🦘 <strong>20%</strong> - Farm pickup (no freight)
                  </li>
                  <li>
                    🇦🇺 <strong>Loyalty rewards</strong> - Repeat customers
                  </li>
                </ul>
              </div>
              <div className="service-card-neo">
                <h3 className="text-xl font-bebas text-eucalyptus mb-4">GUARANTEES</h3>
                <ul className="space-y-2 text-gray-300 font-playfair text-sm">
                  <li>✓ Quality tested & certified</li>
                  <li>✓ Weight guarantee (+/- 2%)</li>
                  <li>✓ Delivery timeframe guarantee</li>
                  <li>✓ Full refund if not satisfied</li>
                  <li>✓ 100% Australian owned</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <div className="text-center cyber-border p-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-wattle-gold mb-4">
              READY TO ORDER?
            </h2>
            <p className="text-xl text-gray-300 font-playfair mb-8 max-w-2xl mx-auto">
              Get a custom quote for your operation. Fair dinkum pricing, Aussie quality, no hidden
              costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-aussie-primary text-lg">
                🦘 REQUEST QUOTE
              </a>
              <a href="tel:+61354800123" className="btn-aussie-secondary text-lg">
                📞 CALL (03) 5480 0123
              </a>
            </div>
            <p className="text-sm text-gray-500 font-space-mono mt-6">
              PROUDLY AUSTRALIAN OWNED & OPERATED | ECHUCA, VICTORIA
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
