import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import BookingModal from '../components/BookingModal';

export default function About() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>About Claire Hamilton - Canberra Companion</title>
        <meta
          name="description"
          content="Learn about Claire Hamilton - 32-year-old petite auburn-haired sweetheart with soft curves and a love for genuine connection."
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
        <section className="bg-gradient-to-br from-rose-50 to-pink-50 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-4xl md:text-6xl font-light text-gray-900 mb-6"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              About Claire
            </h1>
            <p
              className="text-xl md:text-2xl text-gray-700 italic mb-8"
              style={{ fontFamily: '"Crimson Text", serif' }}
            >
              Hi there, I&apos;m Claire. Your 32-year-old petite auburn-haired sweetheart with soft
              curves, a cheeky spark, and a love for genuine connection.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              I&apos;m all about slow-burning chemistry, sensual kisses, deep conversations, and
              playful moments that will stay with you forever. I melt for neck kisses, deep voices,
              and arms wrapped tightly around my waist. If you&apos;re after warmth, depth, and a
              touch of wicked fun, I might just be your new favourite escape.
            </p>
          </div>
        </section>

        {/* Personal Interests */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-light text-gray-900 mb-8 text-center"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              My Interests & Lifestyle
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Daily Life</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Early riser who enjoys strong coffee and morning walks with my dog</li>
                  <li>
                    • Loves rooftop bars with a view and conversations that spiral delightfully
                    off-track
                  </li>
                  <li>
                    • Brunch is basically a religion, and I&apos;ll never say no to a cocktail
                    that&apos;s smoky, stirred, or made with flair
                  </li>
                  <li>
                    • My free time is spent chasing live music, splitting desserts, or getting
                    delightfully lost in a great chat
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Favorites</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>
                    • <strong>Perfume:</strong> YSL Black Opium Over Red
                  </li>
                  <li>
                    • <strong>Music:</strong> Everything from alt-pop to moody string quartets
                  </li>
                  <li>
                    • <strong>Style:</strong> Classic lingerie and beautiful things
                  </li>
                  <li>
                    • <strong>Passion:</strong> Stories that stay with you and exploring new cities
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600 italic">
                Want to get me talking? Ask about my favourite TV show, or dare me to fall in love
                with a city you swear I&apos;d adore. And if it sounds like I&apos;m a bit of a
                romantic? Guilty.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-light text-gray-900 mb-12 text-center"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              What Clients Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="group relative bg-white border-2 border-rose-200 p-6 rounded-sm hover:shadow-2xl transition-all duration-500 hover:border-rose-400">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">{'★'.repeat(5)}</div>
                  <span className="ml-2 text-sm text-gray-500">Dave - November 4, 2025</span>
                </div>
                <p className="text-gray-700 italic">
                  &quot;From the very first moment, Claire had a way of dissolving every barrier.
                  Conversation flowed easily, laughter came naturally, and what might have been a
                  first encounter instead felt like the continuation of something already familiar.
                  Claire isn&apos;t someone you meet once; she&apos;s someone you return to.&quot;
                </p>
              </div>

              <div className="group relative bg-white border-2 border-rose-200 p-6 rounded-sm hover:shadow-2xl transition-all duration-500 hover:border-rose-400">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">{'★'.repeat(5)}</div>
                  <span className="ml-2 text-sm text-gray-500">Stan - October 27, 2025</span>
                </div>
                <p className="text-gray-700 italic">
                  &quot;Claire offers warmth &amp; comfort from the moment she opened the door. Even
                  though this was our 2nd time together it was still amazing. Building on our first
                  visit, and a slightly longer time together, Claire gave me experiences that I will
                  not forget.&quot;
                </p>
              </div>

              <div className="group relative bg-white border-2 border-rose-200 p-6 rounded-sm hover:shadow-2xl transition-all duration-500 hover:border-rose-400">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">{'★'.repeat(5)}</div>
                  <span className="ml-2 text-sm text-gray-500">Joe - September 18, 2025</span>
                </div>
                <p className="text-gray-700 italic">
                  &quot;Claire was absolutely incredible. Made me feel at ease from the first
                  message to when we met. I&apos;m not one to kiss and tell but all I can say is
                  I&apos;ll be returning again next week.&quot;
                </p>
              </div>

              <div className="group relative bg-white border-2 border-rose-200 p-6 rounded-sm hover:shadow-2xl transition-all duration-500 hover:border-rose-400">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">{'★'.repeat(5)}</div>
                  <span className="ml-2 text-sm text-gray-500">Andy - August 18, 2025</span>
                </div>
                <p className="text-gray-700 italic">
                  &quot;I had the absolute pleasure of seeing Claire last night for the first time,
                  I can tell you right now it will not be the last time I see her. Claire is a
                  stunningly beautiful woman that radiates sexuality...&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-pink-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
              Ready for Something Real?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              If you&apos;ve made it this far and you&apos;re craving something slow, sensual, and
              grounded in connection — I&apos;d love to meet you.
            </p>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium rounded-sm hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Your Experience
            </button>
          </div>
        </section>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
