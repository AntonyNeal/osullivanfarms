import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Wind } from 'lucide-react';

// Family-friendly weather widget with Aussie charm
export default function AussieWeatherWidget() {
  const [time, setTime] = useState(new Date());
  const [weather] = useState({
    temp: 28,
    condition: 'Sunny',
    humidity: 45,
    wind: 'Light & Variable',
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'Sunny':
        return <Sun className="w-8 h-8 text-wattle-gold animate-pulse" />;
      case 'Cloudy':
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'Rainy':
        return <CloudRain className="w-8 h-8 text-sky-blue" />;
      default:
        return <Sun className="w-8 h-8 text-wattle-gold" />;
    }
  };

  const getAussieGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "G'day! Beautiful morning";
    if (hour < 18) return 'Arvo delight';
    return 'Bonzer evening';
  };

  return (
    <div className="service-card-neo p-6 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bebas text-wattle-gold">{getAussieGreeting()}</h3>
          <p className="text-sm font-space-mono text-eucalyptus">Echuca, VIC</p>
        </div>
        {getWeatherIcon()}
      </div>

      <div className="grid grid-cols-2 gap-4 text-gray-300">
        <div>
          <p className="text-3xl font-bebas text-digital-matrix">{weather.temp}°C</p>
          <p className="text-xs text-gray-500">{weather.condition}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-playfair">
            <Wind className="w-4 h-4 inline mr-1" />
            {weather.wind}
          </p>
          <p className="text-xs text-gray-500 mt-1">Humidity: {weather.humidity}%</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-eucalyptus">
        <p className="text-center text-digital-matrix font-space-mono text-lg">
          {time.toLocaleTimeString('en-AU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })}
        </p>
        <p className="text-center text-xs text-gray-500 mt-1">Perfect day for farming! 🌾</p>
      </div>
    </div>
  );
}
