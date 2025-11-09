import { useState, useEffect } from 'react';
import { Calendar, ArrowUp, Truck, TrendingUp, AlertCircle, Package } from 'lucide-react';
import SDKTests from '../components/SDKTests';
import '../styles/neo-australian.css';

// Mock farm operations data - Admin dashboard for O'Sullivan Farms
const mockRecentOrders = [
  {
    customer: 'Blue Heeler Barry',
    product: 'Premium Lucerne Hay',
    quantity: 15,
    revenue: 6300,
    location: 'Wagga Wagga, NSW',
    status: 'delivered',
    icon: '�',
  },
  {
    customer: 'Shearing Sheila',
    product: 'Oaten Hay + Transport',
    quantity: 25,
    revenue: 8680,
    location: 'Bendigo, VIC',
    status: 'in-transit',
    icon: '�',
  },
  {
    customer: 'Outback Owen',
    product: 'B-Double Transport Service',
    quantity: 30,
    revenue: 180,
    location: 'Swan Hill, VIC',
    status: 'scheduled',
    icon: '�',
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
    <div className="min-h-screen bg-gray-900 relative">
      {/* Topographical Grid */}
      <div className="topo-grid" />

      {/* SECTION 1: HERO FEATURE - Farm Operations Dashboard */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl mx-auto relative z-10">
        <div className="cyber-border rounded-2xl overflow-hidden bg-gradient-to-br from-eucalyptus/20 to-sky-blue/20">
          <div className="p-8 sm:p-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bebas text-wattle-gold mb-4 aussie-pride">
              🇦🇺 FARM OPERATIONS COMMAND CENTER 🇦🇺
            </h1>
            <p className="text-xl sm:text-2xl text-eucalyptus mb-12 font-playfair">
              Track production, orders, and deliveries in real-time
            </p>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* LEFT SIDE: Recent Orders */}
              <div className="lg:col-span-3 space-y-4">
                <h3 className="text-lg font-bebas text-wattle-gold mb-4">RECENT ORDERS</h3>
                {mockRecentOrders.map((order, idx) => (
                  <div
                    key={idx}
                    className={`service-card-neo ${
                      hoveredPost === idx ? 'pulse-border' : ''
                    } transition-all duration-300 cursor-pointer`}
                    onMouseEnter={() => setHoveredPost(idx)}
                    onMouseLeave={() => setHoveredPost(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{order.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-eucalyptus font-space-mono capitalize">
                            {order.location}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'delivered'
                                ? 'bg-digital-matrix/20 text-digital-matrix'
                                : order.status === 'in-transit'
                                  ? 'bg-wattle-gold/20 text-wattle-gold'
                                  : 'bg-sky-blue/20 text-sky-blue'
                            }`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-white text-sm mb-1 font-bebas">{order.customer}</p>
                        <p className="text-gray-400 text-sm mb-3 font-playfair">{order.product}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-400 font-space-mono">
                            {order.quantity} tonnes
                          </span>
                          <div className="flex items-center gap-1 px-3 py-1 bg-digital-matrix/20 rounded-full">
                            <span className="text-digital-matrix font-bebas text-sm">
                              ${order.revenue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT SIDE: Analytics Dashboard */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bebas text-wattle-gold mb-4">PRODUCTION METRICS</h3>
                <div className="space-y-3">
                  <div className="service-card-neo">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-eucalyptus" />
                        <span className="text-white font-bebas">Orders This Month</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4 text-digital-matrix" />
                        <span className="text-digital-matrix text-sm font-space-mono">+24%</span>
                      </div>
                    </div>
                    <p className="text-3xl font-bebas text-wattle-gold">47 orders</p>
                  </div>

                  <div className="service-card-neo">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-eucalyptus" />
                        <span className="text-white font-bebas">Active Deliveries</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4 text-digital-matrix" />
                        <span className="text-digital-matrix text-sm font-space-mono">+18%</span>
                      </div>
                    </div>
                    <p className="text-3xl font-bebas text-wattle-gold">12 trucks</p>
                  </div>

                  <div className="service-card-neo">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-eucalyptus" />
                        <span className="text-white font-bebas">Monthly Revenue</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4 text-digital-matrix" />
                        <span className="text-digital-matrix text-sm font-space-mono">+12%</span>
                      </div>
                    </div>
                    <p className="text-3xl font-bebas text-wattle-gold">$124,800</p>
                  </div>

                  <div className="service-card-neo">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-eucalyptus" />
                        <span className="text-white font-bebas">Inventory Alert</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-wattle-gold text-sm font-space-mono">Low Stock</span>
                      </div>
                    </div>
                    <p className="text-3xl font-bebas text-wattle-gold">Lucerne Hay</p>
                  </div>
                </div>

                <a
                  href="/contact"
                  className="btn-aussie-primary w-full mt-6 text-center inline-block"
                >
                  📊 VIEW FULL ANALYTICS
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: FEATURE GROUPS */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto relative z-10">
        {/* GROUP 1: FARM OPERATIONS */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bebas text-wattle-gold mb-4 flex items-center gap-3">
            <span>�</span> FARM OPERATIONS
          </h2>
          <p className="text-gray-400 mb-8 text-lg font-playfair">
            Tools to manage production, inventory, and quality control
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="service-card-neo hover:pulse-border transition-all duration-300">
              <div className="text-4xl mb-4">�</div>
              <h3 className="text-xl font-bebas text-wattle-gold mb-3">Production Tracking</h3>
              <p className="text-gray-300 text-sm mb-4 font-playfair">
                Track hay bales cut, moisture levels, and quality grades
              </p>
              <div className="mt-auto">
                <div className="bg-eucalyptus/20 rounded p-2">
                  <div className="text-xs text-eucalyptus font-space-mono">
                    Today: 250 bales cut
                  </div>
                </div>
              </div>
            </div>

            <div className="service-card-neo hover:pulse-border transition-all duration-300">
              <div className="text-4xl mb-4">�</div>
              <h3 className="text-xl font-bebas text-wattle-gold mb-3">Inventory Management</h3>
              <p className="text-gray-300 text-sm mb-4 font-playfair">
                Real-time stock levels for lucerne, oaten, wheaten hay
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-digital-matrix to-eucalyptus h-2 rounded-full w-4/5" />
                  </div>
                  <span className="text-xs text-gray-400 font-space-mono">Lucerne</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-digital-matrix to-eucalyptus h-2 rounded-full w-2/3" />
                  </div>
                  <span className="text-xs text-gray-400 font-space-mono">Oaten</span>
                </div>
              </div>
            </div>

            <div className="service-card-neo hover:pulse-border transition-all duration-300">
              <div className="text-4xl mb-4">🌡️</div>
              <h3 className="text-xl font-bebas text-wattle-gold mb-3">Quality Control</h3>
              <p className="text-gray-300 text-sm mb-4 font-playfair">
                Monitor moisture content, weed seed levels, protein %
              </p>
              <div className="bg-eucalyptus/20 rounded p-2">
                <div className="text-2xl font-bebas text-digital-matrix">12.4%</div>
                <div className="text-xs text-eucalyptus font-space-mono">Avg moisture</div>
              </div>
            </div>

            <div className="service-card-neo hover:pulse-border transition-all duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bebas text-wattle-gold mb-3">Yield Analytics</h3>
              <p className="text-gray-300 text-sm mb-4 font-playfair">
                Compare seasons, paddocks, and varieties
              </p>
              <div className="flex gap-2">
                <div className="flex-1 bg-eucalyptus/20 rounded p-2 text-center">
                  <div className="text-xs text-eucalyptus font-space-mono">2024</div>
                  <div className="text-sm font-bebas text-white">8.2t/ha</div>
                </div>
                <div className="flex-1 bg-eucalyptus/30 rounded p-2 text-center border border-digital-matrix">
                  <div className="text-xs text-eucalyptus font-space-mono">2025</div>
                  <div className="text-sm font-bebas text-white">11.5t/ha</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GROUP 2: CUSTOMER & DELIVERY */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bebas text-wattle-gold mb-4 flex items-center gap-3">
            <span>🚛</span> CUSTOMER & DELIVERY
          </h2>
          <p className="text-gray-400 mb-8 text-lg font-playfair">
            Tools to manage orders, deliveries, and customer relationships
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="service-card-neo hover:pulse-border transition-all duration-300">
              <div className="text-4xl mb-3">�</div>
              <h3 className="text-lg font-bebas text-wattle-gold mb-2">Order Notifications</h3>
              <p className="text-gray-300 text-sm font-playfair">
                Get notified instantly when orders come in
              </p>
            </div>

            <div className="service-card-neo hover:pulse-border transition-all duration-300">
              <div className="text-4xl mb-3">�</div>
              <h3 className="text-lg font-bebas text-wattle-gold mb-2">Payment Tracking</h3>
              <p className="text-gray-300 text-sm font-playfair">
                Track deposits and payments in real-time
              </p>
            </div>

            <div className="service-card-neo hover:pulse-border transition-all duration-300">
              <div className="text-4xl mb-3">�️</div>
              <h3 className="text-lg font-bebas text-wattle-gold mb-2">GPS Delivery Tracking</h3>
              <p className="text-gray-300 text-sm font-playfair">
                Track B-doubles with live GPS updates
              </p>
            </div>

            <div className="service-card-neo hover:pulse-border transition-all duration-300">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="text-lg font-bebas text-wattle-gold mb-2">Auto Reminders</h3>
              <p className="text-gray-300 text-sm font-playfair">
                Automatic delivery notifications to customers
              </p>
            </div>

            <div className="service-card-neo hover:pulse-border transition-all duration-300">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-lg font-bebas text-wattle-gold mb-2">Mobile Management</h3>
              <p className="text-gray-300 text-sm font-playfair">
                Update orders from your phone anytime
              </p>
            </div>
          </div>
        </div>

        {/* GROUP 3: BUSINESS CONTROL */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bebas text-wattle-gold mb-4 flex items-center gap-3">
            <span>⚙️</span> BUSINESS CONTROL
          </h2>
          <p className="text-gray-400 mb-8 text-lg font-playfair">
            Tools that give you control over pricing and operations
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="service-card-neo hover:pulse-border transition-all duration-300">
              <div className="text-4xl mb-3">🌾</div>
              <h3 className="text-lg font-bebas text-wattle-gold mb-2">Product Management</h3>
              <p className="text-gray-300 text-sm font-playfair">
                Manage hay types, grades, and availability
              </p>
            </div>

            <div className="service-card-neo hover:pulse-border transition-all duration-300">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="text-lg font-bebas text-wattle-gold mb-2">Delivery Zones</h3>
              <p className="text-gray-300 text-sm font-playfair">
                Set different rates for different regions
              </p>
            </div>

            <div className="service-card-neo hover:pulse-border transition-all duration-300">
              <div className="text-4xl mb-3">�</div>
              <h3 className="text-lg font-bebas text-wattle-gold mb-2">Dynamic Pricing</h3>
              <p className="text-gray-300 text-sm font-playfair">
                Adjust prices based on season and supply
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
        <div className="bg-gradient-to-br from-outback-red/40 to-eucalyptus/20 rounded-2xl cyber-border overflow-hidden shadow-2xl p-8 sm:p-12 text-center">
          <h3 className="text-3xl sm:text-4xl font-bebas text-wattle-gold mb-4 aussie-pride">
            🇦🇺 READY TO DIGITIZE YOUR FARM? 🇦🇺
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-playfair">
            Connect your business systems and start managing deliveries like a true-blue legend
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button className="btn-aussie-primary flex items-center justify-center gap-2 text-lg">
              <Truck className="w-5 h-5" />
              Connect Logistics Platform
            </button>
            <button className="btn-aussie-secondary flex items-center justify-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              Connect Accounting System
            </button>
          </div>
          <div className="text-gray-400 text-sm font-playfair">
            <a href="#" className="hover:text-wattle-gold transition-colors underline">
              View Live Dashboard Demo
            </a>
            <span className="mx-3">•</span>
            <span>Trusted by 200+ Aussie Farmers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
