import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import '../styles/neo-australian.css';

export default function ConceptsLanding() {
  return (
    <>
      <Helmet>
        <title>Platform Concepts - O&apos;Sullivan Farms</title>
        <meta
          name="description"
          content="Explore two innovative concepts for your farm business platform"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-700 text-white py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30">
                <span className="text-4xl">🎉</span>
                <span className="text-2xl font-bold">Congratulations!</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to Your <span className="text-yellow-300">Platform Owner</span> Journey
            </h1>

            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
              You&apos;re now stepping into a new role as a platform owner. Below are two concept
              pieces designed specifically for your farm business - each showcasing different
              opportunities for growth and innovation.
            </p>
          </div>
        </div>

        {/* Concepts Grid */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Concept 1: Hay Booking Platform */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-aussie-green to-green-600 text-white p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-6xl">🌾</span>
                  <span className="px-4 py-2 bg-aussie-gold text-aussie-green rounded-full text-sm font-bold">
                    CONCEPT #1
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-2">Hay Booking Platform</h2>
                <p className="text-green-100 text-lg">O&apos;Sullivan Farms Direct</p>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">The Opportunity</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    A professional booking platform for your hay delivery business. This concept
                    demonstrates how we can run targeted, low-cost ads to drive local farms directly
                    to your website.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Key Features</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <svg
                        className="w-6 h-6 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Online booking & payment system</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-6 h-6 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Lead capture & customer management</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-6 h-6 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Automated email notifications</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-6 h-6 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Mobile-friendly interface</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Marketing Strategy</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Run cheap, targeted Facebook/Google ads to local farms. Direct them straight to
                    your booking platform. Turn ad spend into direct bookings.
                  </p>
                </div>

                <Link
                  to="/hay-booking"
                  className="block w-full bg-gradient-to-r from-aussie-green to-green-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Explore Hay Platform →
                </Link>
              </div>
            </div>

            {/* Concept 2: SheepSheet */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-6xl">🐑</span>
                  <span className="px-4 py-2 bg-teal-200 text-teal-900 rounded-full text-sm font-bold">
                    CONCEPT #2
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-2">SheepSheet</h2>
                <p className="text-emerald-100 text-lg">Farm Management System</p>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">The Vision</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    A generic, professional sheep farm management platform based on your spreadsheet
                    data. This concept shows the potential for a broader SaaS product that could
                    serve multiple farms.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Key Features</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <svg
                        className="w-6 h-6 text-emerald-600 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Mob tracking & management</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-6 h-6 text-emerald-600 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Individual sheep records</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-6 h-6 text-emerald-600 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Health & breeding tracking</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-6 h-6 text-emerald-600 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Offline-capable mobile app</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">The Potential</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Transform your spreadsheet workflow into a modern web app. Built from your
                    actual data and processes - ready to scale beyond just your farm.
                  </p>
                </div>

                <Link
                  to="/sheep-sheet"
                  className="block w-full bg-gradient-to-r from-emerald-700 to-teal-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Explore SheepSheet →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Two Concepts. Endless Possibilities.
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              These are working prototypes built to demonstrate what&apos;s possible. Each
              represents a different path forward - or we can combine elements from both. The choice
              is yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/hay-booking"
                className="px-8 py-4 bg-aussie-gold text-aussie-green rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
              >
                View Hay Platform
              </Link>
              <Link
                to="/sheep-sheet"
                className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-500 transition-all duration-300 transform hover:scale-105"
              >
                View SheepSheet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
