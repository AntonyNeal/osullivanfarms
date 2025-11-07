import { useState, useEffect } from 'react';
import { Calendar, ArrowUp, Instagram, Twitter, MessageSquare, AlertCircle } from 'lucide-react';
import { SDKTests } from '../components/SDKTests';

// Mock social media posts data
const mockSocialPosts = [
  {
    platform: 'instagram',
    caption: "New photos from last week's shoot 📸✨",
    bookings: 5,
    views: 2847,
    image: '🌸',
  },
  {
    platform: 'twitter',
    caption: 'Available in Sydney next weekend! DM to book',
    bookings: 8,
    views: 1523,
    image: '🗓️',
  },
  {
    platform: 'tiktok',
    caption: 'Behind the scenes makeup routine 💄',
    bookings: 12,
    views: 5921,
    image: '💋',
  },
];

export default function AdminDashboard() {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      // Could update stats here
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* SECTION 1: HERO FEATURE - Social Attribution Dashboard */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-8 sm:p-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Know Exactly What Brings You Business
            </h1>
            <p className="text-xl sm:text-2xl text-purple-200 mb-12">
              See which social posts drive bookings in real-time
            </p>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* LEFT SIDE: Social Feed Preview */}
              <div className="lg:col-span-3 space-y-4">
                <h3 className="text-lg font-semibold text-purple-200 mb-4">Your Social Posts</h3>
                {mockSocialPosts.map((post, idx) => (
                  <div
                    key={idx}
                    className={`bg-white/10 backdrop-blur-md border ${
                      hoveredPost === idx ? 'border-rose-400' : 'border-white/20'
                    } rounded-lg p-4 transition-all duration-300 cursor-pointer hover:bg-white/15`}
                    onMouseEnter={() => setHoveredPost(idx)}
                    onMouseLeave={() => setHoveredPost(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{post.image}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {post.platform === 'instagram' && (
                            <Instagram className="w-4 h-4 text-pink-400" />
                          )}
                          {post.platform === 'twitter' && (
                            <Twitter className="w-4 h-4 text-blue-400" />
                          )}
                          {post.platform === 'tiktok' && (
                            <div className="w-4 h-4 bg-gradient-to-br from-cyan-400 to-pink-400 rounded" />
                          )}
                          <span className="text-xs text-purple-200 capitalize">
                            {post.platform}
                          </span>
                        </div>
                        <p className="text-white text-sm mb-3">{post.caption}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-purple-300">{post.views} views</span>
                          <div className="flex items-center gap-1 px-3 py-1 bg-rose-500/80 rounded-full">
                            <span className="text-white font-bold text-sm">{post.bookings}</span>
                            <span className="text-white text-xs">bookings</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT SIDE: Analytics Dashboard */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-purple-200 mb-4">Platform Performance</h3>
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-purple-300" />
                        <span className="text-white font-medium">Direct DMs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">+24%</span>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white">12 bookings</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-cyan-400 to-pink-400 rounded" />
                        <span className="text-white font-medium">TikTok</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">+18%</span>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white">8 bookings</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Twitter className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium">Twitter</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">+12%</span>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white">5 bookings</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-white font-medium">Reddit</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">+8%</span>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white">2 bookings</p>
                  </div>
                </div>

                <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-rose-600/50">
                  See Your Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: FEATURE GROUPS */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        {/* GROUP 1: BUSINESS INTELLIGENCE */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <span>📊</span> BUSINESS INTELLIGENCE
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Features that help you understand and grow your business
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-lg p-6 hover:border-blue-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">Social Attribution</h3>
              <p className="text-slate-300 text-sm mb-4">
                See EXACTLY which social posts bring in bookings
              </p>
              <div className="mt-auto">
                <div className="bg-blue-900/30 rounded p-2">
                  <div className="text-xs text-blue-300">Latest: TikTok post → 12 bookings</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg p-6 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">Platform Performance</h3>
              <p className="text-slate-300 text-sm mb-4">
                Compare Twitter, TikTok, Reddit, Direct - see what works
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-500 h-2 rounded-full w-4/5" />
                  </div>
                  <span className="text-xs text-slate-400">TikTok</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full w-2/3" />
                  </div>
                  <span className="text-xs text-slate-400">Direct</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-indigo-500/30 rounded-lg p-6 hover:border-indigo-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-white mb-3">Conversion Tracking</h3>
              <p className="text-slate-300 text-sm mb-4">
                Know your conversion rates per campaign and platform
              </p>
              <div className="bg-indigo-900/30 rounded p-2">
                <div className="text-2xl font-bold text-indigo-300">12.4%</div>
                <div className="text-xs text-indigo-400">Avg conversion rate</div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-violet-500/30 rounded-lg p-6 hover:border-violet-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-white mb-3">A/B Testing</h3>
              <p className="text-slate-300 text-sm mb-4">
                Test different website designs automatically
              </p>
              <div className="flex gap-2">
                <div className="flex-1 bg-violet-900/30 rounded p-2 text-center">
                  <div className="text-xs text-violet-300">Design A</div>
                  <div className="text-sm font-bold text-white">8.2%</div>
                </div>
                <div className="flex-1 bg-violet-900/50 rounded p-2 text-center border border-violet-400">
                  <div className="text-xs text-violet-300">Design B</div>
                  <div className="text-sm font-bold text-white">11.5%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GROUP 2: CLIENT EXPERIENCE */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <span>⚡</span> CLIENT EXPERIENCE
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Features that enhance the booking and client interaction experience
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="text-4xl mb-3">🔔</div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Notifications</h3>
              <p className="text-cyan-100 text-sm">Get notified instantly when someone books</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-lg p-6 hover:border-green-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Deposits</h3>
              <p className="text-green-100 text-sm">See deposit payments land in real-time</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6 hover:border-blue-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-lg font-bold text-white mb-2">Google Calendar Sync</h3>
              <p className="text-blue-100 text-sm">Syncs with your Google Calendar automatically</p>
            </div>

            <div className="bg-gradient-to-br from-teal-900/40 to-teal-800/20 border border-teal-500/30 rounded-lg p-6 hover:border-teal-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="text-lg font-bold text-white mb-2">Auto Reminders</h3>
              <p className="text-teal-100 text-sm">
                Send automatic reminders to clients (reduce no-shows)
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 border border-indigo-500/30 rounded-lg p-6 hover:border-indigo-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-lg font-bold text-white mb-2">Mobile Updates</h3>
              <p className="text-indigo-100 text-sm">Update availability from your phone anytime</p>
            </div>
          </div>
        </div>

        {/* GROUP 3: YOUR CONTROL */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <span>🎯</span> YOUR CONTROL
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Features that give you control over your time and availability
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 rounded-lg p-6 hover:border-red-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
              <div className="text-4xl mb-3">🚫</div>
              <h3 className="text-lg font-bold text-white mb-2">Personal Time Blocking</h3>
              <p className="text-red-100 text-sm">Block out personal time with one click</p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-500/30 rounded-lg p-6 hover:border-orange-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-City Availability</h3>
              <p className="text-orange-100 text-sm">
                Set different availability for different cities
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border border-amber-500/30 rounded-lg p-6 hover:border-amber-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20">
              <div className="text-4xl mb-3">💵</div>
              <h3 className="text-lg font-bold text-white mb-2">Custom Pricing</h3>
              <p className="text-amber-100 text-sm">
                Set different rates for different services/cities
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4: SDK DIAGNOSTICS */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <span>🧪</span> SDK DIAGNOSTICS
          </h2>
          <p className="text-gray-400 mb-8 text-lg">Test API connectivity and SDK functionality</p>
          <SDKTests />
        </div>

        {/* SECTION 5: CALL-TO-ACTION */}
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl overflow-hidden shadow-2xl p-8 sm:p-12 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Connect your accounts and start seeing which posts bring you business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button className="px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-rose-600/50 flex items-center justify-center gap-2">
              <Instagram className="w-5 h-5" />
              Connect Social Media
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white font-bold text-lg rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Connect Google Calendar
            </button>
          </div>
          <div className="text-purple-300 text-sm">
            <a href="#" className="hover:text-white transition-colors underline">
              View Live Demo
            </a>
            <span className="mx-3">•</span>
            <span>Used by 50+ providers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
