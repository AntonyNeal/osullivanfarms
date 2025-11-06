import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import BookingModal from '../components/BookingModal';

export default function Services() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Services - Claire Hamilton</title>
        <meta
          name="description"
          content="Explore the sophisticated services offered by Claire Hamilton - dinner dates, social events, travel companion, and private moments."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-24 md:py-32 bg-gradient-to-b from-rose-50 via-white to-rose-50/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 mb-6 sm:mb-8 tracking-tight"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Services
              </h1>
              <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300 mx-auto mb-8 sm:mb-12" />
              <p className="text-xl sm:text-2xl md:text-2xl text-gray-800 leading-relaxed font-light mb-6">
                A sophisticated and elegant companion, crafted for discerning individuals who
                appreciate the finer things in life. With an innate understanding of genuine
                connection, warmth, intelligence, and an irresistible free spirit.
              </p>
              <p className="text-xl sm:text-2xl md:text-2xl text-gray-700 leading-relaxed font-light italic">
                Every moment is an invitation to experience luxury through presence and the art of
                being truly seen.
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
                {/* GFE Service */}
                <div className="group relative bg-white border-2 border-rose-200 p-8 sm:p-10 rounded-sm hover:shadow-2xl transition-all duration-500 hover:border-rose-400">
                  <div className="absolute top-0 left-0 w-1 h-16 bg-gradient-to-b from-rose-400 to-transparent" />
                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 sm:mb-6 tracking-tight"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    Girlfriend Experience (GFE)
                  </h3>
                  <p className="text-lg sm:text-xl md:text-xl text-gray-800 leading-relaxed font-normal mb-6">
                    A sensual, connected girlfriend-style encounter. Warm, cheeky, affectionate, and
                    completely unrushed. Think soft kisses, playful teasing, deep eye contact, and
                    that delicious feeling of being truly wanted. It&apos;s intimacy with depth.
                    Tender, sexy, and real.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Services Include:</h4>
                  <ul className="space-y-2 text-gray-700 mb-6">
                    <li>• Kissing</li>
                    <li>• Cuddling, connection and flirting</li>
                    <li>• Covered oral on you</li>
                    <li>• Oral on me</li>
                    <li>• Sensual body massage/body slide</li>
                    <li>• Protected sex in multiple positions</li>
                  </ul>
                  <div className="mt-6 flex items-center text-rose-500 text-base sm:text-lg font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Book your GFE experience</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>

                {/* PSE Service */}
                <div className="group relative bg-white border-2 border-rose-200 p-8 sm:p-10 rounded-sm hover:shadow-2xl transition-all duration-500 hover:border-rose-400">
                  <div className="absolute top-0 left-0 w-1 h-16 bg-gradient-to-b from-rose-400 to-transparent" />
                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 sm:mb-6 tracking-tight"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    Pornstar Experience (PSE)
                  </h3>
                  <p className="text-lg sm:text-xl md:text-xl text-gray-800 leading-relaxed font-normal mb-6">
                    Get ready for a wild, no-holds-barred encounter where your dirtiest dreams
                    become reality. This steamy, cheeky experience will bring all your fantasies to
                    life. High-energy, playful and daring. Memories you&apos;ll replay in your head
                    again and again.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Services Include:</h4>
                  <ul className="space-y-2 text-gray-700 mb-6">
                    <li>• Everything in GFE plus:</li>
                    <li>• Covered deepthroat</li>
                    <li>• Gagging, face-fucking, rougher play</li>
                    <li>• Spanking (both)</li>
                    <li>• Choking on you</li>
                    <li>• Dirty talk</li>
                    <li>• Roleplay</li>
                    <li>• Toys (on you or me)</li>
                    <li>• COB (Cum on Body)</li>
                    <li>• Outfit requests</li>
                    <li>• Light restraints on you</li>
                  </ul>
                  <div className="mt-6 flex items-center text-rose-500 text-base sm:text-lg font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Book your PSE experience</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>
              </div>

              {/* Extras Section */}
              <div className="mt-12 bg-gray-50 p-8 rounded-lg">
                <h3
                  className="text-2xl md:text-3xl font-light text-gray-900 mb-6 text-center"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Available Extras
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Pegging</h4>
                    <p className="text-gray-600">$150</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Keep my panties</h4>
                    <p className="text-gray-600">$150</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Kink &amp; BDSM</h4>
                    <p className="text-gray-600">Light to moderate - Enquire</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Additional extras may be provided at my discretion. Some may incur an extra fee.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 sm:py-24 bg-gradient-to-b from-rose-50/30 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2
                className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-6 sm:mb-8 tracking-tight"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Ready to Begin?
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 leading-relaxed font-normal mb-10 sm:mb-12">
                Let&apos;s discuss how we can create an unforgettable experience tailored to your
                desires and expectations.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="inline-flex items-center px-10 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium rounded-sm hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label="Send inquiry"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Send Inquiry
                </button>
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="inline-flex items-center px-10 sm:px-12 py-4 sm:py-5 border-2 border-rose-400 text-rose-600 font-medium rounded-sm hover:bg-rose-50 hover:border-rose-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label="Schedule call"
                >
                  Schedule Call
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
