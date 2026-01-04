import { useState, useEffect } from 'react';
import { Activity, User, Package, ShoppingBag, Settings, Search, Filter, Calendar, Download } from 'lucide-react';

interface LogEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  type: 'user' | 'product' | 'order' | 'settings' | 'system';
  ip?: string;
}

export function ActivityLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'user' | 'product' | 'order' | 'settings' | 'system'>('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const saved = localStorage.getItem('veluna_activity_log');
    if (saved) {
      setLogs(JSON.parse(saved));
    } else {
      const demoLogs: LogEntry[] = [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          user: 'admin@veluna.uz',
          action: 'Mahsulot qo\'shildi',
          details: 'Samsung Galaxy S24 mahsuloti qo\'shildi',
          type: 'product',
          ip: '192.168.1.1'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'admin@veluna.uz',
          action: 'Buyurtma holati o\'zgartirildi',
          details: 'Buyurtma #1234 "Yetkazildi" holatiga o\'tkazildi',
          type: 'order',
          ip: '192.168.1.1'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: 'user@example.com',
          action: 'Ro\'yxatdan o\'tdi',
          details: 'Yangi foydalanuvchi ro\'yxatdan o\'tdi',
          type: 'user',
          ip: '192.168.1.45'
        },
        {
          id: 4,
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          user: 'admin@veluna.uz',
          action: 'Sozlamalar o\'zgartirildi',
          details: 'Sayt sozlamalari yangilandi',
          type: 'settings',
          ip: '192.168.1.1'
        },
        {
          id: 5,
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          user: 'system',
          action: 'Backup yaratildi',
          details: 'Avtomatik backup yaratildi',
          type: 'system',
          ip: 'localhost'
        },
      ];
      setLogs(demoLogs);
      localStorage.setItem('veluna_activity_log', JSON.stringify(demoLogs));
    }
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-log-${new Date().toISOString()}.json`;
    link.click();
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="w-5 h-5" />;
      case 'product': return <Package className="w-5 h-5" />;
      case 'order': return <ShoppingBag className="w-5 h-5" />;
      case 'settings': return <Settings className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'user': return 'from-blue-500 to-blue-600';
      case 'product': return 'from-green-500 to-green-600';
      case 'order': return 'from-purple-500 to-purple-600';
      case 'settings': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: logs.length,
    user: logs.filter(l => l.type === 'user').length,
    product: logs.filter(l => l.type === 'product').length,
    order: logs.filter(l => l.type === 'order').length,
    settings: logs.filter(l => l.type === 'settings').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Harakatlar tarixi</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Barcha admin harakatlari logi
          </p>
        </div>
        <button
          onClick={exportLogs}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Eksport</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Jami</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.user}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Foydalanuvchi</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-green-600">{stats.product}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Mahsulot</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-purple-600">{stats.order}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Buyurtma</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-orange-600">{stats.settings}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Sozlamalar</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Qidirish..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">Barchasi</option>
          <option value="user">👤 Foydalanuvchi</option>
          <option value="product">📦 Mahsulot</option>
          <option value="order">🛍️ Buyurtma</option>
          <option value="settings">⚙️ Sozlamalar</option>
          <option value="system">🖥️ Sistema</option>
        </select>
      </div>

      {/* Logs Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <div
              key={log.id}
              className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${getColor(log.type)} flex items-center justify-center text-white`}>
                {getIcon(log.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {log.action}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                    {formatDate(log.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {log.details}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>👤 {log.user}</span>
                  {log.ip && <span>🌐 {log.ip}</span>}
                  <span className={`px-2 py-0.5 rounded-full ${
                    log.type === 'user' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                    log.type === 'product' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                    log.type === 'order' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                    log.type === 'settings' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {log.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Hech qanday harakat topilmadi</p>
          </div>
        )}
      </div>
    </div>
  );
}
