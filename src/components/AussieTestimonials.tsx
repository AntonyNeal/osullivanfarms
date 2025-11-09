import { useState, useEffect } from 'react';
import { Star, MapPin } from 'lucide-react';

const testimonials = [
  {
    name: 'Blue Heeler Barry',
    location: 'Wagga Wagga, NSW',
    avatar: '🐕',
    rating: 5,
    quote:
      "Best hay in the Murray! My cattle are happier than a dog with two tails. The O'Sullivans deliver on time, every time. Fair dinkum legends!",
    service: 'Premium Lucerne Hay',
  },
  {
    name: 'Shearing Sheila',
    location: 'Bendigo, VIC',
    avatar: '✂️',
    rating: 5,
    quote:
      "Been buying from these blokes for three seasons now. Quality's always spot-on, and they actually answer the phone! None of this 'she'll be right' business - they deliver excellence.",
    service: 'Oaten Hay & Transport',
  },
  {
    name: 'Outback Owen',
    location: 'Swan Hill, VIC',
    avatar: '🤠',
    rating: 5,
    quote:
      'Straight-shooting folks who know their stuff. GPS tracking on deliveries is bonzer - I can plan my day without sitting around like a shag on a rock. Top shelf service!',
    service: 'B-Double Transport',
  },
  {
    name: 'Dusty Dan',
    location: 'Echuca Region',
    avatar: '🚜',
    rating: 5,
    quote:
      "Third generation farmer here. The O'Sullivans remind me of the old days - handshake means something. Modern tech meets old-school values. Beauty!",
    service: 'Wheaten Hay Production',
  },
  {
    name: 'Stockyard Steve',
    location: 'Deniliquin, NSW',
    avatar: '🐄',
    rating: 5,
    quote:
      "Tried their new flock management beta system - bloody ripper! Even this old-timer can use it. Finally, farm tech that doesn't make you want to chuck it in the creek!",
    service: 'Flock Management Beta',
  },
  {
    name: 'Sunrise Sally',
    location: 'Kyabram, VIC',
    avatar: '🌅',
    rating: 5,
    quote:
      "Family-run operation that treats you like family. When I needed emergency hay during the dry spell, they came through at 3am. That's Australian spirit right there!",
    service: 'Emergency Supply',
  },
];

export default function AussieTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection('right');
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const navigate = (newDirection: 'left' | 'right') => {
    setDirection(newDirection);
    if (newDirection === 'left') {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }
  };

  const current = testimonials[currentIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bebas text-wattle-gold mb-2">WHAT THE LOCALS SAY</h2>
        <p className="text-eucalyptus font-space-mono">Real reviews from real Aussie farmers</p>
      </div>

      <div className="service-card-neo pulse-border p-8 md:p-12 relative">
        {/* Avatar Circle */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-eucalyptus to-sky-blue flex items-center justify-center text-5xl border-4 border-wattle-gold shadow-lg">
            {current.avatar}
          </div>
        </div>

        <div className="mt-8 text-center">
          {/* Rating */}
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-wattle-gold text-wattle-gold" />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-xl font-playfair text-gray-200 italic mb-6 leading-relaxed">
            "{current.quote}"
          </blockquote>

          {/* Name & Location */}
          <div className="mb-2">
            <p className="text-lg font-bebas text-wattle-gold">{current.name}</p>
            <p className="text-sm text-eucalyptus flex items-center justify-center gap-1">
              <MapPin className="w-4 h-4" />
              {current.location}
            </p>
          </div>

          {/* Service Badge */}
          <div className="inline-block mt-4 px-4 py-2 bg-eucalyptus/20 rounded-full">
            <p className="text-xs font-space-mono text-digital-matrix">{current.service}</p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 left-4 right-4 flex justify-between transform -translate-y-1/2">
          <button
            onClick={() => navigate('left')}
            className="w-10 h-10 rounded-full bg-eucalyptus/20 hover:bg-eucalyptus/40 text-wattle-gold flex items-center justify-center transition-all hover:scale-110"
            aria-label="Previous testimonial"
          >
            ‹
          </button>
          <button
            onClick={() => navigate('right')}
            className="w-10 h-10 rounded-full bg-eucalyptus/20 hover:bg-eucalyptus/40 text-wattle-gold flex items-center justify-center transition-all hover:scale-110"
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 'right' : 'left');
                setCurrentIndex(index);
              }}
              className={`h-1 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-wattle-gold w-8'
                  : 'bg-eucalyptus/30 w-6 hover:bg-eucalyptus/60'
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-400 font-playfair italic">
          Over 200+ happy farmers across Victoria and Southern NSW 🇦🇺
        </p>
      </div>
    </div>
  );
}
