import { useState, useEffect } from 'react';
import { AlertTriangle, Package, TrendingDown, TrendingUp, Bell, Search, Filter, Download, Plus, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

interface InventoryManagerProps {
  products: any[];
  onUpdateProduct: (id: number, stock: number) => void;
}

interface StockAlert {
  id: number;
  productId: number;
  productName: string;
  currentStock: number;
  minStock: number;
  status: 'critical' | 'low' | 'ok';
}

export function InventoryManager({ products, onUpdateProduct }: InventoryManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'low' | 'ok'>('all');
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [showAddSupplier, setShowAddSupplier] = useState(false);

  useEffect(() => {
    checkStockLevels();
    loadSuppliers();
  }, [products]);

  const checkStockLevels = () => {
    const alerts: StockAlert[] = products.map(product => {
      const minStock = 10; // Minimum stock threshold
      const criticalStock = 5; // Critical stock threshold
      
      let status: 'critical' | 'low' | 'ok' = 'ok';
      if (product.stock <= criticalStock) {
        status = 'critical';
      } else if (product.stock <= minStock) {
        status = 'low';
      }

      return {
        id: Date.now() + product.id,
        productId: product.id,
        productName: product.name,
        currentStock: product.stock,
        minStock: minStock,
        status
      };
    });

    setStockAlerts(alerts);

    // Send notification for critical items
    const criticalItems = alerts.filter(a => a.status === 'critical');
    if (criticalItems.length > 0) {
      toast.error(`⚠️ ${criticalItems.length} ta mahsulot tugamoqda!`, {
        duration: 5000
      });
    }
  };

  const loadSuppliers = () => {
    const saved = localStorage.getItem('veluna_suppliers');
    if (saved) {
      setSuppliers(JSON.parse(saved));
    } else {
      const defaultSuppliers = [
        { id: 1, name: 'Samsung Electronics Uz', contact: '+998 71 123 45 67', products: 15, rating: 4.8 },
        { id: 2, name: 'Fashion Import Ltd', contact: '+998 71 987 65 43', products: 45, rating: 4.5 },
        { id: 3, name: 'Home & Garden Supply', contact: '+998 71 555 12 34', products: 28, rating: 4.7 },
      ];
      setSuppliers(defaultSuppliers);
      localStorage.setItem('veluna_suppliers', JSON.stringify(defaultSuppliers));
    }
  };

  const updateStock = (productId: number, newStock: number) => {
    onUpdateProduct(productId, newStock);
    toast.success('Stock yangilandi!');
    checkStockLevels();
  };

  const orderStock = (productId: number) => {
    toast.success('Buyurtma yuborildi!');
    // Here you would create a supplier order
  };

  const filteredAlerts = stockAlerts.filter(alert => {
    const matchesSearch = alert.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || alert.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: products.length,
    critical: stockAlerts.filter(a => a.status === 'critical').length,
    low: stockAlerts.filter(a => a.status === 'low').length,
    ok: stockAlerts.filter(a => a.status === 'ok').length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ombor boshqaruvi</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Mahsulotlar zaxirasi va ogohlantirishlar
          </p>
        </div>
        <button
          onClick={() => toast.success('Hisobot yuklab olinmoqda...')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Hisobot</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.total}</h3>
          <p className="text-emerald-100 text-sm">Jami mahsulotlar</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8" />
            {stats.critical > 0 && (
              <span className="bg-white text-red-600 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                ⚠️
              </span>
            )}
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.critical}</h3>
          <p className="text-red-100 text-sm">Kritik holat</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.low}</h3>
          <p className="text-orange-100 text-sm">Kam qolgan</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold mb-1">
            {(stats.totalValue / 1000000).toFixed(1)}M
          </h3>
          <p className="text-blue-100 text-sm">Ombor qiymati</p>
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
            placeholder="Mahsulot qidirish..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">Barchasi</option>
          <option value="critical">🔴 Kritik</option>
          <option value="low">🟡 Kam</option>
          <option value="ok">🟢 Yaxshi</option>
        </select>
      </div>

      {/* Stock Alerts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mahsulot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Zaxira
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Minimal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Harakatlar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {alert.productName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {alert.status === 'critical' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <AlertTriangle className="w-3 h-3" />
                        Kritik
                      </span>
                    )}
                    {alert.status === 'low' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                        <TrendingDown className="w-3 h-3" />
                        Kam
                      </span>
                    )}
                    {alert.status === 'ok' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <TrendingUp className="w-3 h-3" />
                        Yaxshi
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-lg font-bold ${
                      alert.status === 'critical' ? 'text-red-600' :
                      alert.status === 'low' ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {alert.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {alert.minStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newStock = prompt(`Yangi stock miqdori (${alert.productName}):`, alert.currentStock.toString());
                          if (newStock) {
                            updateStock(alert.productId, parseInt(newStock));
                          }
                        }}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm"
                      >
                        Yangilash
                      </button>
                      {alert.status !== 'ok' && (
                        <button
                          onClick={() => orderStock(alert.productId)}
                          className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-sm"
                        >
                          Buyurtma
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suppliers */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Ta'minotchilar</h3>
          <button
            onClick={() => setShowAddSupplier(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Qo'shish</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {supplier.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                📞 {supplier.contact}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {supplier.products} ta mahsulot
                </span>
                <span className="text-sm font-medium text-yellow-600">
                  ⭐ {supplier.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock History Chart (Placeholder) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">
          Stock harakatlari tarixi
        </h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-400">Stock harakatlari grafigi (Tez orada)</p>
        </div>
      </div>
    </div>
  );
}
