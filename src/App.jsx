import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Bell, 
  Menu,
  Clock,
  ChevronRight,
  Sprout,
  Wheat,
  Apple,
  Leaf,
  Phone, 
  Lock, 
  ArrowRight, 
  Fingerprint, 
  Globe,
  LogOut,
  User,
  Info,
  Coffee,
  Grape,
  X
} from 'lucide-react';

// --- Expanded Market Data ---
const INITIAL_MARKET_DATA = [
  { id: 1, name: 'Tomato (Desi)', category: 'Vegetables', price: 42.50, unit: 'kg', trend: 'up', change: 2.1, market: 'Azadpur Mandi, Delhi', icon: '🍅' },
  { id: 2, name: 'Onion (Red)', category: 'Vegetables', price: 28.00, unit: 'kg', trend: 'down', change: -1.5, market: 'Lasalgaon, Maharashtra', icon: '🧅' },
  { id: 3, name: 'Potato (Jyoti)', category: 'Vegetables', price: 15.00, unit: 'kg', trend: 'stable', change: 0.0, market: 'Agra, UP', icon: '🥔' },
  { id: 4, name: 'Wheat (Sharbati)', category: 'Grains', price: 2850, unit: 'quintal', trend: 'up', change: 45, market: 'Sehore, MP', icon: '🌾' },
  { id: 5, name: 'Basmati Rice', category: 'Grains', price: 9500, unit: 'quintal', trend: 'up', change: 120, market: 'Karnal, Haryana', icon: '🍚' },
  { id: 6, name: 'Apple (Kinnaur)', category: 'Fruits', price: 120, unit: 'kg', trend: 'down', change: -5, market: 'Shimla, HP', icon: '🍎' },
  { id: 7, name: 'Mango (Alphonso)', category: 'Fruits', price: 850, unit: 'dozen', trend: 'up', change: 50, market: 'Ratnagiri, MH', icon: '🥭' },
  { id: 8, name: 'Cotton (Long)', category: 'Cash Crops', price: 7200, unit: 'quintal', trend: 'down', change: -110, market: 'Rajkot, Gujarat', icon: '☁️' },
  { id: 9, name: 'Sugarcane', category: 'Cash Crops', price: 315, unit: 'quintal', trend: 'stable', change: 0, market: 'Muzaffarnagar, UP', icon: '🎋' },
  { id: 10, name: 'Green Chilli', category: 'Vegetables', price: 55, unit: 'kg', trend: 'up', change: 8, market: 'Guntur, AP', icon: '🌶️' },
  { id: 11, name: 'Turmeric (Erode)', category: 'Spices', price: 14200, unit: 'quintal', trend: 'up', change: 210, market: 'Erode, TN', icon: '🟡' },
  { id: 12, name: 'Garlic', category: 'Vegetables', price: 180, unit: 'kg', trend: 'up', change: 15, market: 'Mandsaur, MP', icon: '🧄' },
  { id: 13, name: 'Moong Dal', category: 'Pulses', price: 8200, unit: 'quintal', trend: 'down', change: -40, market: 'Gulbarga, KA', icon: '🟢' },
  { id: 14, name: 'Grapes (Black)', category: 'Fruits', price: 95, unit: 'kg', trend: 'stable', change: 0, market: 'Nashik, MH', icon: '🍇' },
  { id: 15, name: 'Coffee Beans', category: 'Cash Crops', price: 320, unit: 'kg', trend: 'up', change: 12, market: 'Chikmagalur, KA', icon: '☕' },
  { id: 16, name: 'Cauliflower', category: 'Vegetables', price: 35, unit: 'kg', trend: 'down', change: -4, market: 'Haldwani, UK', icon: '🥦' },
  { id: 17, name: 'Mustard Seeds', category: 'Oilseeds', price: 5400, unit: 'quintal', trend: 'up', change: 65, market: 'Bharatpur, RJ', icon: '🟡' },
  { id: 18, name: 'Banana (Robusta)', category: 'Fruits', price: 450, unit: 'quintal', trend: 'up', change: 25, market: 'Jalgaon, MH', icon: '🍌' }
];

const CATEGORIES = [
  { id: 'All', name: 'All Produce', icon: <Menu size={16} /> },
  { id: 'Vegetables', name: 'Vegetables', icon: <Leaf size={16} /> },
  { id: 'Fruits', name: 'Fruits', icon: <Apple size={16} /> },
  { id: 'Grains', name: 'Grains', icon: <Wheat size={16} /> },
  { id: 'Spices', name: 'Spices', icon: <Coffee size={16} /> },
  { id: 'Cash Crops', name: 'Cash Crops', icon: <Sprout size={16} /> },
];

const MARKETS = [
  'All Markets', 'Azadpur Mandi, Delhi', 'Lasalgaon, Maharashtra', 
  'Agra, UP', 'Sehore, MP', 'Karnal, Haryana', 'Nashik, MH', 'Guntur, AP',
  'Chennai, Tamil Nadu'
];

const buildPriceHistory = (item, points = 10) => {
  const history = [];
  const trendBias = item.trend === 'up' ? 1 : item.trend === 'down' ? -1 : 0;

  for (let i = points - 1; i >= 0; i -= 1) {
    const drift = i * 0.006 * item.price * trendBias;
    const wave = Math.sin((item.id + i) * 0.9) * item.price * 0.012;
    const value = Math.max(1, item.price - drift + wave);
    history.push(Number(value.toFixed(2)));
  }

  return history;
};

// --- Sub-Component: Login ---
const LoginPage = ({ onLogin }) => {
  const [loginMethod, setLoginMethod] = useState('phone');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-50" />

      <div className="absolute top-6 right-6">
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-emerald-500 transition-colors">
          <Globe size={16} /> English
        </button>
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl p-8 sm:p-10 z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-emerald-600 p-4 rounded-3xl shadow-lg shadow-emerald-200 mb-4">
            <Sprout className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900">AgriRates</h1>
          <p className="text-slate-500 font-medium mt-2 text-center">Smart Price Intelligence for Farmers</p>
          <p className="text-emerald-700 font-semibold mt-1 text-sm">Chennai, Tamil Nadu</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <Info className="text-emerald-600 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-emerald-800 leading-relaxed">
            <span className="font-bold">Access:</span> Enter any phone number to login to the live mandi price dashboard.
          </p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
          <button onClick={() => setLoginMethod('phone')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${loginMethod === 'phone' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>OTP Login</button>
          <button onClick={() => setLoginMethod('password')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${loginMethod === 'password' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>Password</button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-bold border-r border-slate-100 pr-3 my-3">+91</span>
              <input type="tel" defaultValue="9876543210" placeholder="98765 43210" className="w-full pl-16 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-lg tracking-wider" />
            </div>
          </div>

          <button 
            onClick={onLogin}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group transition-all active:scale-95"
          >
            {loginMethod === 'phone' ? 'Get OTP' : 'Login Now'}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100">
          <button onClick={onLogin} className="w-full flex items-center justify-center gap-3 text-slate-600 font-semibold hover:text-emerald-600 transition-colors">
            <Fingerprint size={24} /> Login with Biometrics
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Dashboard ---
const Dashboard = ({ onLogout }) => {
  const [marketData, setMarketData] = useState(INITIAL_MARKET_DATA);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('All Markets');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => prevData.map(item => {
        if (Math.random() > 0.85) {
          const drift = (Math.random() - 0.5) * (item.price * 0.01);
          const newPrice = Math.max(1, item.price + drift);
          let newTrend = 'stable';
          let diff = newPrice - item.price;
          if (diff > 0.05) newTrend = 'up';
          else if (diff < -0.05) newTrend = 'down';
          return { ...item, price: newPrice, trend: newTrend, change: Math.abs(diff) };
        }
        return item;
      }));
      setLastUpdated(new Date());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = useMemo(() => {
    return marketData.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMarket = selectedMarket === 'All Markets' || item.market.includes(selectedMarket.split(',')[0]);
      return matchesCategory && matchesSearch && matchesMarket;
    });
  }, [marketData, activeCategory, searchQuery, selectedMarket]);

  const selectedStockHistory = useMemo(() => {
    if (!selectedStock) return [];
    return buildPriceHistory(selectedStock, 12);
  }, [selectedStock]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-emerald-200/20 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] rounded-full bg-amber-200/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-screen">
        <header className="flex items-center justify-between mb-8 bg-white/50 p-4 rounded-3xl backdrop-blur-sm border border-white">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-600/30">
              <Sprout className="text-white" size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                Agri<span className="text-emerald-600">Rates</span>
              </h1>
              <p className="text-xs font-bold text-emerald-600/80 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Live Now
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-slate-100 text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="relative group">
               <button className="flex items-center gap-2 p-1.5 pr-4 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-all">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <span className="text-sm font-bold text-slate-700 hidden sm:block">S. Kumar</span>
              </button>
              <div className="absolute right-0 top-full mt-2 pt-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto transform group-hover:translate-y-0 translate-y-2 z-50">
                <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden min-w-[180px]">
                   <button className="w-full px-6 py-4 flex items-center gap-3 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                    <User size={18} /> Profile
                  </button>
                  <button 
                    onClick={onLogout}
                    className="w-full px-6 py-4 flex items-center gap-3 text-rose-600 font-bold hover:bg-rose-50 border-t border-slate-50 transition-colors"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-8 space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all"
                placeholder="Search for crops (e.g. Rice, Tomato)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-4 rounded-2xl shadow-sm border border-slate-200 min-w-[240px]">
              <MapPin size={20} className="text-emerald-600 shrink-0" />
              <select 
                className="bg-transparent w-full text-base font-bold outline-none cursor-pointer text-slate-700" 
                value={selectedMarket} 
                onChange={(e) => setSelectedMarket(e.target.value)}
              >
                {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar gap-3 flex-grow">
              {CATEGORIES.map(category => (
                <button 
                  key={category.id} 
                  onClick={() => setActiveCategory(category.id)} 
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${activeCategory === category.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-200'}`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        <main className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredData.length > 0 ? filteredData.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedStock(item)}
                className="group bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-50 group-hover:bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl transition-colors">{item.icon}</div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{item.name}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{item.category}</p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-xl ${item.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : item.trend === 'down' ? 'text-rose-600 bg-rose-50' : 'text-slate-400 bg-slate-50'}`}>
                    {item.trend === 'up' ? <TrendingUp size={24} /> : item.trend === 'down' ? <TrendingDown size={24} /> : <Minus size={24} />}
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-1">CURRENT STOCK PRICE</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">₹{item.price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                      <span className="text-sm font-bold text-slate-400">/{item.unit}</span>
                    </div>
                  </div>
                  <div className={`text-right ${item.trend === 'up' ? 'text-emerald-600' : item.trend === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest">Change</p>
                    <p className="text-sm font-black">{item.trend === 'stable' ? '0.00' : `${item.trend === 'up' ? '+' : '-'}₹${item.change.toFixed(2)}`}</p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={14} className="text-emerald-600" />
                    <span className="text-xs font-bold truncate max-w-[150px]">{item.market}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStock(item);
                    }}
                    className="p-2 bg-slate-50 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No results found</h3>
                <p className="text-slate-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedStock && (
        <div
          onClick={() => setSelectedStock(null)}
          className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Rate Trend</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{selectedStock.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedStock.market}</p>
              </div>
              <button
                onClick={() => setSelectedStock(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <svg viewBox="0 0 600 220" className="w-full h-56">
                {selectedStockHistory.map((_, i) => (
                  <line
                    key={`grid-${i}`}
                    x1={40 + i * 48}
                    y1={20}
                    x2={40 + i * 48}
                    y2={180}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}
                <line x1="40" y1="180" x2="560" y2="180" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="40" y1="20" x2="40" y2="180" stroke="#94a3b8" strokeWidth="1.5" />
                <polyline
                  fill="none"
                  stroke={selectedStock.trend === 'down' ? '#e11d48' : '#059669'}
                  strokeWidth="4"
                  points={selectedStockHistory
                    .map((value, i) => {
                      const min = Math.min(...selectedStockHistory);
                      const max = Math.max(...selectedStockHistory);
                      const range = max - min || 1;
                      const x = 40 + i * 48;
                      const y = 180 - ((value - min) / range) * 160;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="mt-3 flex items-center justify-between text-sm font-semibold">
                <span className="text-slate-500">Previous</span>
                <span className={selectedStock.trend === 'down' ? 'text-rose-600' : selectedStock.trend === 'up' ? 'text-emerald-600' : 'text-slate-600'}>
                  {selectedStock.trend === 'up' ? 'Rate Increased' : selectedStock.trend === 'down' ? 'Rate Reduced' : 'No Major Change'}
                </span>
                <span className="text-slate-500">Current</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">Current Stock Price</p>
              <p className="text-xl font-black text-slate-900">
                ₹{selectedStock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm text-slate-500 font-bold">/{selectedStock.unit}</span>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Bottom Nav (Simulated) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50">
        <button className="text-emerald-600 flex flex-col items-center gap-1"><Sprout size={20} /><span className="text-[10px] font-bold">Rates</span></button>
        <button className="text-slate-400 flex flex-col items-center gap-1"><TrendingUp size={20} /><span className="text-[10px] font-bold">Trends</span></button>
        <button className="text-slate-400 flex flex-col items-center gap-1"><User size={20} /><span className="text-[10px] font-bold">Account</span></button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

// --- Main App Entry ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}
