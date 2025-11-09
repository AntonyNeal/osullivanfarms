import { useState, useEffect } from 'react';

// Family-friendly floating Aussie mascot - alternates between farm animals
export default function FloatingAussieMascot() {
  const [currentMascot, setCurrentMascot] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const mascots = [
    { emoji: '🦘', name: 'Skippy', message: "G'day mate!" },
    { emoji: '🐨', name: 'Koby', message: 'No worries!' },
    { emoji: '🐑', name: 'Shaun', message: 'Fair dinkum!' },
    { emoji: '🪃', name: 'Boomer', message: "She'll be right!" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMascot((prev) => (prev + 1) % mascots.length);
        setIsVisible(true);
      }, 500);
    }, 15000);

    return () => clearInterval(interval);
  }, [mascots.length]);

  const current = mascots[currentMascot];

  return (
    <div
      className={`fixed bottom-24 right-8 z-40 transition-all duration-500 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
      }`}
      style={{ pointerEvents: 'none' }}
    >
      {/* Speech Bubble */}
      <div className="relative mb-2 animate-bounce">
        <div className="bg-wattle-gold text-gray-900 px-4 py-2 rounded-lg shadow-lg font-bebas text-sm relative">
          {current.message}
          {/* Speech bubble tail */}
          <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-wattle-gold" />
        </div>
      </div>

      {/* Mascot */}
      <div className="flex justify-end">
        <div
          className="text-6xl animate-pulse cursor-pointer transition-transform hover:scale-110"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(255, 215, 0, 0.5))',
            pointerEvents: 'auto',
          }}
          title={current.name}
        >
          {current.emoji}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
