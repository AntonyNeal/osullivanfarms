import { useState } from 'react';
import { Calculator, TrendingUp, Truck } from 'lucide-react';

export default function InteractiveHayCalculator() {
  const [animals, setAnimals] = useState(20);
  const [weeks, setWeeks] = useState(12);
  const [hayType, setHayType] = useState<'lucerne' | 'oaten' | 'wheaten'>('oaten');

  const prices = {
    lucerne: 420,
    oaten: 340,
    wheaten: 320,
  };

  const kgPerAnimalPerDay = 12;
  const totalKg = animals * weeks * 7 * kgPerAnimalPerDay;
  const totalTonnes = totalKg / 1000;
  const basePrice = totalTonnes * prices[hayType];

  const discount = totalTonnes > 100 ? 0.1 : totalTonnes > 50 ? 0.05 : 0;
  const finalPrice = basePrice * (1 - discount);
  const transportCost = totalTonnes > 30 ? 180 : 0;
  const grandTotal = finalPrice + transportCost;

  return (
    <div className="service-card-neo p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-eucalyptus to-sky-blue mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-3xl font-bebas text-wattle-gold mb-2">HAY CALCULATOR</h3>
        <p className="text-sm font-space-mono text-eucalyptus">
          Work out your feed costs in a jiffy!
        </p>
      </div>

      <div className="space-y-6">
        {/* Animals Slider */}
        <div>
          <label className="flex justify-between text-gray-300 font-playfair mb-2">
            <span>Number of Animals: 🐄</span>
            <span className="font-bebas text-wattle-gold text-xl">{animals}</span>
          </label>
          <input
            type="range"
            min="1"
            max="500"
            value={animals}
            onChange={(e) => setAnimals(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-wattle-gold"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>500</span>
          </div>
        </div>

        {/* Weeks Slider */}
        <div>
          <label className="flex justify-between text-gray-300 font-playfair mb-2">
            <span>Weeks of Feed: 📅</span>
            <span className="font-bebas text-wattle-gold text-xl">{weeks}</span>
          </label>
          <input
            type="range"
            min="1"
            max="52"
            value={weeks}
            onChange={(e) => setWeeks(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-wattle-gold"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 week</span>
            <span>1 year</span>
          </div>
        </div>

        {/* Hay Type Selection */}
        <div>
          <label className="block text-gray-300 font-playfair mb-3">Hay Type: 🌾</label>
          <div className="grid grid-cols-3 gap-3">
            {(['lucerne', 'oaten', 'wheaten'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setHayType(type)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  hayType === type
                    ? 'border-wattle-gold bg-wattle-gold/20 text-wattle-gold'
                    : 'border-eucalyptus/30 text-gray-400 hover:border-eucalyptus hover:bg-eucalyptus/10'
                }`}
              >
                <p className="font-bebas text-sm capitalize">{type}</p>
                <p className="text-xs font-space-mono">${prices[type]}/t</p>
              </button>
            ))}
          </div>
        </div>

        {/* Results Panel */}
        <div className="cyber-border p-6 bg-gray-950/50">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-digital-matrix" />
            <h4 className="font-bebas text-xl text-wattle-gold">YOUR ESTIMATE</h4>
          </div>

          <div className="space-y-3 text-gray-300 font-playfair">
            <div className="flex justify-between">
              <span>Total Hay Needed:</span>
              <span className="font-bebas text-digital-matrix">
                {totalTonnes.toFixed(1)} tonnes
              </span>
            </div>

            <div className="flex justify-between">
              <span>Base Price:</span>
              <span className="font-space-mono text-sm">
                ${basePrice.toLocaleString('en-AU', { minimumFractionDigits: 0 })}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-digital-matrix">
                <span>🎉 Bulk Discount ({discount * 100}%):</span>
                <span className="font-space-mono text-sm">
                  -${(basePrice * discount).toLocaleString('en-AU', { minimumFractionDigits: 0 })}
                </span>
              </div>
            )}

            {transportCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Local Delivery:
                </span>
                <span className="font-space-mono text-sm">${transportCost}</span>
              </div>
            )}

            <div className="border-t border-eucalyptus pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bebas text-wattle-gold">TOTAL:</span>
                <span className="text-3xl font-bebas text-digital-matrix">
                  ${grandTotal.toLocaleString('en-AU', { minimumFractionDigits: 0 })}
                </span>
              </div>
              <p className="text-xs text-gray-500 text-right mt-1">
                ≈ ${(grandTotal / totalTonnes).toFixed(0)}/tonne delivered
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-eucalyptus/10 rounded-lg">
            <p className="text-sm text-gray-300 text-center font-playfair italic">
              💡 Fair dinkum pricing - no hidden costs, no worries!
            </p>
          </div>
        </div>

        <a href="/contact" className="btn-aussie-primary w-full text-center inline-block">
          🦘 REQUEST THIS QUOTE
        </a>
      </div>
    </div>
  );
}
