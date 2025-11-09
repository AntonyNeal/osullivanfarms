import { useState, useEffect } from 'react';

const aussieFacts = [
  {
    icon: '🌾',
    fact: 'Did you know? Australian farmers feed over 60 million people worldwide!',
    caption: "That's a whole lotta tucker, mate!",
  },
  {
    icon: '🦘',
    fact: 'Australia has more kangaroos than people - about 50 million hoppers!',
    caption: "They're the true locals around here",
  },
  {
    icon: '🐑',
    fact: "We've got over 70 million sheep producing the world's finest wool",
    caption: 'Keeping everyone cozy since 1788',
  },
  {
    icon: '🌞',
    fact: 'Aussie farms receive an average of 3,000 hours of sunshine per year',
    caption: 'Natural solar power, no worries!',
  },
  {
    icon: '💧',
    fact: 'Australian farmers are world leaders in water-efficient agriculture',
    caption: 'Every drop counts in the sunburnt country',
  },
  {
    icon: '🚜',
    fact: "The average Aussie farm is 4,331 hectares - that's about 6,000 footy fields!",
    caption: 'Plenty of room to move',
  },
  {
    icon: '🌿',
    fact: "Over 50% of Australia's landmass is dedicated to agriculture",
    caption: 'We take feeding folks seriously',
  },
  {
    icon: '⭐',
    fact: 'Australian agriculture contributes $60 billion to our economy annually',
    caption: "Farming's not just a job, it's our heartbeat",
  },
];

export default function FarmFactsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % aussieFacts.length);
        setIsAnimating(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const currentFact = aussieFacts[currentIndex];

  return (
    <div className="cyber-border p-8 bg-gray-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(var(--digital-matrix) 1px, transparent 1px),
              linear-gradient(90deg, var(--digital-matrix) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
            animation: 'slide 20s linear infinite',
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bebas text-wattle-gold mb-2">🇦🇺 AUSSIE FARM FACTS 🇦🇺</h3>
          <p className="text-sm font-space-mono text-eucalyptus">Fair Dinkum True Stories</p>
        </div>

        <div
          className={`transition-all duration-300 ${
            isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}
        >
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">{currentFact.icon}</div>
            <p className="text-lg font-playfair text-gray-200 mb-3 leading-relaxed">
              {currentFact.fact}
            </p>
            <p className="text-sm font-space-mono text-digital-matrix italic">
              {currentFact.caption}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            {aussieFacts.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setIsAnimating(false);
                  }, 300);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-wattle-gold w-8'
                    : 'bg-eucalyptus hover:bg-wattle-gold'
                }`}
                aria-label={`Go to fact ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(30px) translateY(30px); }
        }
      `}</style>
    </div>
  );
}
