import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Download, Filter, TrendingUp, DollarSign, ShoppingBag, Users, Package, Award } from 'lucide-react';

interface AnalyticsProps {
  products: any[];
  orders: any[];
  users: any[];
  stats: any;
  onExport: () => void;
}

export function AdvancedAnalytics({ products, orders, users, stats, onExport }: AnalyticsProps) {
  const categoryData = [
    { name: 'Elektronika', value: products.filter(p => p.category === 'electronics').length, color: '#8B5CF6' },
    { name: 'Kiyim', value: products.filter(p => p.category === 'fashion').length, color: '#EC4899' },
    { name: 'Uy-ro\'zg\'or', value: products.filter(p => p.category === 'home').length, color: '#10B981' },
    { name: 'Sport', value: products.filter(p => p.category === 'sports').length, color: '#F59E0B' },
    { name: 'Kitoblar', value: products.filter(p => p.category === 'books').length, color: '#3B82F6' },
    { name: 'Go\'zallik', value: products.filter(p => p.category === 'beauty').length, color: '#EF4444' },
  ];

  const topProducts = [...products]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Professional Analitika</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">To'liq hisobotlar va statistika</p>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
        >
          <Download className="w-4 h-4" />
          Eksport qilish
        </button>
      </div>

      {/* Advanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="w-7 h-7" />
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">vs o'tgan oy</p>
              <div className="flex items-center gap-1 text-sm font-bold mt-1">
                <TrendingUp className="w-4 h-4" />
                <span>+15.3%</span>
              </div>
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Jami daromad</p>
          <p className="text-4xl font-bold mb-2">{((stats.totalRevenue || 0) / 1000000).toFixed(2)}M</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-sm">
            <div className="flex justify-between">
              <span className="opacity-80">Bugungi:</span>
              <span className="font-bold">{((stats.todayRevenue || 0) / 1000).toFixed(0)}K so'm</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">Konversiya</p>
              <div className="flex items-center gap-1 text-sm font-bold mt-1">
                <span>68.5%</span>
              </div>
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">O'rtacha buyurtma</p>
          <p className="text-4xl font-bold mb-2">{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders / 1000).toFixed(0) : '0'}K</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-sm">
            <div className="flex justify-between">
              <span className="opacity-80">Kutilmoqda:</span>
              <span className="font-bold">{stats.pendingOrders || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Users className="w-7 h-7" />
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">Yangi</p>
              <div className="flex items-center gap-1 text-sm font-bold mt-1">
                <TrendingUp className="w-4 h-4" />
                <span>+12</span>
              </div>
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Foydalanuvchilar</p>
          <p className="text-4xl font-bold mb-2">{users.length}</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-sm">
            <div className="flex justify-between">
              <span className="opacity-80">Faol:</span>
              <span className="font-bold">{users.filter((u: any) => !u.blocked).length}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Package className="w-7 h-7" />
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">Sotildi</p>
              <div className="flex items-center gap-1 text-sm font-bold mt-1">
                <span>{products.reduce((sum, p) => sum + (p.sold || 0), 0)}</span>
              </div>
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Mahsulotlar</p>
          <p className="text-4xl font-bold mb-2">{products.length}</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-sm">
            <div className="flex justify-between">
              <span className="opacity-80">Omborda:</span>
              <span className="font-bold">{products.reduce((sum, p) => sum + (p.stock || 0), 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts - Revenue & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg dark:text-white">Daromad dinamikasi</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">So'nggi 7 kun</p>
            </div>
            <select className="px-3 py-1.5 border dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white">
              <option>7 kun</option>
              <option>30 kun</option>
              <option>90 kun</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={[
              { name: '14.12', revenue: 2100000, orders: 8 },
              { name: '15.12', revenue: 2800000, orders: 11 },
              { name: '16.12', revenue: 2500000, orders: 9 },
              { name: '17.12', revenue: 3200000, orders: 13 },
              { name: '18.12', revenue: 2800000, orders: 10 },
              { name: '19.12', revenue: 4100000, orders: 15 },
              { name: '20.12', revenue: stats.todayRevenue, orders: stats.todayOrders },
            ]}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value: any) => [(value / 1000).toFixed(0) + 'K so\'m', 'Daromad']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg dark:text-white">Buyurtmalar statistikasi</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status bo'yicha</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Kutilmoqda', count: stats.pendingOrders },
              { name: 'Yo\'lda', count: orders.filter((o: any) => o.status === 'Yo\'lda').length },
              { name: 'Yetkazildi', count: stats.completedOrders },
              { name: 'Bekor', count: orders.filter((o: any) => o.status === 'Bekor qilindi').length },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {[
                  { color: '#F59E0B' },
                  { color: '#3B82F6' },
                  { color: '#10B981' },
                  { color: '#EF4444' },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg mb-4 dark:text-white">Kategoriyalar bo'yicha sotuv</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Elektronika', sales: products.filter(p => p.category === 'electronics').reduce((sum, p) => sum + (p.sold || 0), 0), revenue: products.filter(p => p.category === 'electronics').reduce((sum, p) => sum + (p.sold || 0) * p.price, 0) },
              { name: 'Kiyim', sales: products.filter(p => p.category === 'fashion').reduce((sum, p) => sum + (p.sold || 0), 0), revenue: products.filter(p => p.category === 'fashion').reduce((sum, p) => sum + (p.sold || 0) * p.price, 0) },
              { name: 'Uy', sales: products.filter(p => p.category === 'home').reduce((sum, p) => sum + (p.sold || 0), 0), revenue: products.filter(p => p.category === 'home').reduce((sum, p) => sum + (p.sold || 0) * p.price, 0) },
              { name: 'Sport', sales: products.filter(p => p.category === 'sports').reduce((sum, p) => sum + (p.sold || 0), 0), revenue: products.filter(p => p.category === 'sports').reduce((sum, p) => sum + (p.sold || 0) * p.price, 0) },
              { name: 'Kitob', sales: products.filter(p => p.category === 'books').reduce((sum, p) => sum + (p.sold || 0), 0), revenue: products.filter(p => p.category === 'books').reduce((sum, p) => sum + (p.sold || 0) * p.price, 0) },
              { name: 'Go\'zallik', sales: products.filter(p => p.category === 'beauty').reduce((sum, p) => sum + (p.sold || 0), 0), revenue: products.filter(p => p.category === 'beauty').reduce((sum, p) => sum + (p.sold || 0) * p.price, 0) },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis yAxisId="left" stroke="#8B5CF6" />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value: any, name: string) => {
                  if (name === 'revenue') return [(value / 1000000).toFixed(1) + 'M so\'m', 'Daromad'];
                  return [value + ' dona', 'Sotildi'];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="sales" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Sotildi" />
              <Bar yAxisId="right" dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} name="Daromad" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg mb-4 dark:text-white">Mahsulotlar taqsimoti</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-lg dark:text-white">Top 5 mahsulotlar</h3>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                  'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  #{index + 1}
                </div>
                <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-lg shadow" />
                <div className="flex-1">
                  <p className="font-medium dark:text-white">{product.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">📦 {product.sold} ta</span>
                    <span className="text-sm font-bold text-purple-600">💰 {((product.sold || 0) * product.price / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-lg dark:text-white">Top 5 mijozlar</h3>
          </div>
          <div className="space-y-3">
            {[...users].sort((a: any, b: any) => b.totalSpent - a.totalSpent).slice(0, 5).map((user: any, index: number) => (
              <div key={user.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                  'bg-gradient-to-br from-green-500 to-blue-500'
                }`}>
                  #{index + 1}
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium dark:text-white">{user.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">🛒 {user.orders} buyurtma</span>
                    <span className="text-sm font-bold text-green-600">💰 {(user.totalSpent / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold dark:text-white">Konversiya darajasi</h3>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tashrif buyuruvchilar</span>
              <span className="font-bold dark:text-white">2,450</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Buyurtmalar</span>
              <span className="font-bold dark:text-white">{stats.totalOrders}</span>
            </div>
            <div className="pt-3 border-t dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium dark:text-white">Konversiya</span>
                <span className="text-2xl font-bold text-blue-600">
                  {((stats.totalOrders / 2450) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, ((stats.totalOrders / 2450) * 100)))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold dark:text-white">Mijozlar loyalligi</h3>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Yangi mijozlar</span>
              <span className="font-bold dark:text-white">{Math.floor(users.length * 0.3)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Qaytgan mijozlar</span>
              <span className="font-bold dark:text-white">{Math.floor(users.length * 0.7)}</span>
            </div>
            <div className="pt-3 border-t dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium dark:text-white">Qaytish darajasi</span>
                <span className="text-2xl font-bold text-purple-600">70%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full w-[70%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold dark:text-white">Buyurtma bajarish</h3>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">O'rtacha vaqt</span>
              <span className="font-bold dark:text-white">2.5 kun</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Bajarildi</span>
              <span className="font-bold dark:text-white">{stats.completedOrders}</span>
            </div>
            <div className="pt-3 border-t dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium dark:text-white">Muvaffaqiyat</span>
                <span className="text-2xl font-bold text-green-600">
                  {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(0) : '0'}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(0) : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Category Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-lg mb-4 dark:text-white">Kategoriya bo'yicha batafsil hisobot</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <tr>
                <th className="text-left p-4 dark:text-white font-bold">Kategoriya</th>
                <th className="text-left p-4 dark:text-white font-bold">Mahsulotlar</th>
                <th className="text-left p-4 dark:text-white font-bold">Sotildi</th>
                <th className="text-left p-4 dark:text-white font-bold">Daromad</th>
                <th className="text-left p-4 dark:text-white font-bold">O'rtacha narx</th>
                <th className="text-left p-4 dark:text-white font-bold">Ulush</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Elektronika', key: 'electronics', color: '#8B5CF6' },
                { name: 'Kiyim', key: 'fashion', color: '#EC4899' },
                { name: 'Uy-ro\'zg\'or', key: 'home', color: '#10B981' },
                { name: 'Sport', key: 'sports', color: '#F59E0B' },
                { name: 'Kitoblar', key: 'books', color: '#3B82F6' },
                { name: 'Go\'zallik', key: 'beauty', color: '#EF4444' },
              ].map(cat => {
                const catProducts = products.filter(p => p.category === cat.key);
                const sold = catProducts.reduce((sum, p) => sum + (p.sold || 0), 0);
                const revenue = catProducts.reduce((sum, p) => sum + (p.sold || 0) * p.price, 0);
                const avgPrice = catProducts.length > 0 ? catProducts.reduce((sum, p) => sum + p.price, 0) / catProducts.length : 0;
                const totalRevenue = products.reduce((sum, p) => sum + (p.sold || 0) * p.price, 0);
                const share = totalRevenue > 0 ? (revenue / totalRevenue * 100) : 0;

                return (
                  <tr key={cat.key} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                        <span className="font-medium dark:text-white">{cat.name}</span>
                      </div>
                    </td>
                    <td className="p-4 dark:text-white font-medium">{catProducts.length}</td>
                    <td className="p-4 dark:text-white">{sold} dona</td>
                    <td className="p-4 font-bold text-purple-600">{(revenue / 1000000).toFixed(2)}M so'm</td>
                    <td className="p-4 dark:text-white">{(avgPrice / 1000).toFixed(0)}K so'm</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-3 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${share.toFixed(0)}%`,
                              backgroundColor: cat.color
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold dark:text-white w-14 text-right">{share.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}