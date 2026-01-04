import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Filter, FileText, CreditCard, Percent, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { toast } from 'sonner';

interface FinancialReportsProps {
  orders: any[];
  products: any[];
}

export function FinancialReports({ orders, products }: FinancialReportsProps) {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // Calculate financial statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const completedOrders = orders.filter(o => o.status === 'Yetkazildi');
  const completedRevenue = completedOrders.reduce((sum, order) => sum + order.amount, 0);
  const pendingRevenue = orders.filter(o => o.status === 'Kutilmoqda').reduce((sum, order) => sum + order.amount, 0);
  
  // Calculate profit (assuming 30% profit margin)
  const profitMargin = 0.30;
  const totalProfit = completedRevenue * profitMargin;
  const averageOrderValue = completedOrders.length > 0 ? completedRevenue / completedOrders.length : 0;

  // Top selling products
  const productSales: { [key: string]: number } = {};
  orders.forEach(order => {
    if (order.items) {
      order.items.forEach((item: any) => {
        productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
      });
    }
  });

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, quantity]) => ({ name, quantity }));

  // Monthly revenue data
  const monthlyData = [
    { month: 'Yanvar', revenue: 12500000, profit: 3750000, orders: 45 },
    { month: 'Fevral', revenue: 15800000, profit: 4740000, orders: 58 },
    { month: 'Mart', revenue: 18200000, profit: 5460000, orders: 67 },
    { month: 'Aprel', revenue: 16900000, profit: 5070000, orders: 62 },
    { month: 'May', revenue: 21300000, profit: 6390000, orders: 78 },
    { month: 'Iyun', revenue: 24500000, profit: 7350000, orders: 89 },
  ];

  // Revenue by category
  const categoryRevenue = [
    { name: 'Elektronika', value: 35, amount: 15500000 },
    { name: 'Moda', value: 25, amount: 11000000 },
    { name: 'Uy-roʻzgʻor', value: 20, amount: 8800000 },
    { name: 'Sport', value: 12, amount: 5300000 },
    { name: 'Boshqalar', value: 8, amount: 3500000 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Payment methods
  const paymentMethods = [
    { method: 'Plastik karta', count: 145, amount: 28500000, percentage: 65 },
    { method: 'Naqd pul', count: 67, amount: 13200000, percentage: 30 },
    { method: 'Click/Payme', count: 23, amount: 2200000, percentage: 5 },
  ];

  const generateInvoice = () => {
    toast.success('Invoice PDF yaratilmoqda...');
    // Here you would generate PDF
  };

  const exportReport = () => {
    toast.success('Hisobot eksport qilinmoqda...');
    // Here you would export data
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Moliyaviy hisobotlar</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Daromad va xarajatlar tahlili
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateInvoice}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Invoice yaratish</span>
          </button>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Eksport</span>
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <Calendar className="w-5 h-5 text-gray-400" />
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="daily">Kunlik</option>
          <option value="weekly">Haftalik</option>
          <option value="monthly">Oylik</option>
          <option value="yearly">Yillik</option>
        </select>
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
        />
        <span className="text-gray-500">-</span>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
        />
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Financial Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Jami</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {(completedRevenue / 1000000).toFixed(1)} mln
          </h3>
          <p className="text-emerald-100 text-sm">Jami daromad</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">+12.5% o'sish</span>
          </div>
        </div>

        {/* Profit */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Percent className="w-8 h-8" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Foyda</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {(totalProfit / 1000000).toFixed(1)} mln
          </h3>
          <p className="text-blue-100 text-sm">Sof foyda (30%)</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">+8.3% o'sish</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="w-8 h-8" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">O'rtacha</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {(averageOrderValue / 1000).toFixed(0)}k
          </h3>
          <p className="text-purple-100 text-sm">Buyurtma qiymati</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">+5.2% o'sish</span>
          </div>
        </div>

        {/* Pending Revenue */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Kutilmoqda</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {(pendingRevenue / 1000000).toFixed(1)} mln
          </h3>
          <p className="text-orange-100 text-sm">Kutilayotgan daromad</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs">{orders.filter(o => o.status === 'Kutilmoqda').length} ta buyurtma</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Oylik daromad va foyda
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Daromad" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="profit" name="Foyda" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Revenue Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-blue-600" />
            Kategoriya bo'yicha daromad
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryRevenue}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryRevenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">
            Eng ko'p sotiladigan mahsulotlar
          </h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-emerald-600">#{index + 1}</span>
                  <span className="text-gray-900 dark:text-white">{product.name}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {product.quantity} ta
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">
            To'lov usullari
          </h3>
          <div className="space-y-3">
            {paymentMethods.map((method, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{method.method}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{method.count} ta</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-emerald-600">
                    {(method.amount / 1000000).toFixed(1)} mln
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{method.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tax & Invoice Settings */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          Soliq va Invoice sozlamalari
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              QQS (%) 
            </label>
            <input
              type="number"
              defaultValue="12"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kompaniya nomi
            </label>
            <input
              type="text"
              defaultValue="Veluna Market LLC"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              STIR
            </label>
            <input
              type="text"
              defaultValue="123456789"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <button
          onClick={() => toast.success('Sozlamalar saqlandi!')}
          className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Saqlash
        </button>
      </div>
    </div>
  );
}
