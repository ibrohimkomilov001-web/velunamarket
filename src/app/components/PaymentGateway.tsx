import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  type: 'card' | 'ewallet' | 'cash';
  enabled: boolean;
  merchantId?: string;
  apiKey?: string;
  secretKey?: string;
  commission: number;
  transactions: number;
  revenue: number;
}

interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
  time: string;
  commission: number;
  customer: string;
}

export function PaymentGateway() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load payment methods
    const savedMethods = localStorage.getItem('veluna_payment_methods');
    if (savedMethods) {
      setPaymentMethods(JSON.parse(savedMethods));
    } else {
      const defaultMethods: PaymentMethod[] = [
        {
          id: 'click',
          name: 'Click',
          logo: '💳',
          type: 'ewallet',
          enabled: true,
          merchantId: '',
          apiKey: '',
          secretKey: '',
          commission: 1.5,
          transactions: 145,
          revenue: 28500000
        },
        {
          id: 'payme',
          name: 'Payme',
          logo: '📱',
          type: 'ewallet',
          enabled: true,
          merchantId: '',
          apiKey: '',
          commission: 2.0,
          transactions: 123,
          revenue: 24300000
        },
        {
          id: 'uzcard',
          name: 'UzCard',
          logo: '💳',
          type: 'card',
          enabled: true,
          merchantId: '',
          commission: 1.2,
          transactions: 234,
          revenue: 45600000
        },
        {
          id: 'humo',
          name: 'Humo',
          logo: '💳',
          type: 'card',
          enabled: true,
          commission: 1.2,
          transactions: 189,
          revenue: 38200000
        },
        {
          id: 'visa',
          name: 'Visa / MasterCard',
          logo: '💳',
          type: 'card',
          enabled: true,
          commission: 2.5,
          transactions: 98,
          revenue: 19600000
        },
        {
          id: 'cash',
          name: 'Naqd pul',
          logo: '💵',
          type: 'cash',
          enabled: true,
          commission: 0,
          transactions: 67,
          revenue: 13200000
        },
      ];
      setPaymentMethods(defaultMethods);
      localStorage.setItem('veluna_payment_methods', JSON.stringify(defaultMethods));
    }

    // Load transactions
    const savedTransactions = localStorage.getItem('veluna_payment_transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      const defaultTransactions: Transaction[] = [
        {
          id: 'TXN001',
          orderId: 'ORD-1234',
          amount: 1250000,
          method: 'Click',
          status: 'success',
          date: '2024-06-15',
          time: '14:30',
          commission: 18750,
          customer: 'Aziz Karimov'
        },
        {
          id: 'TXN002',
          orderId: 'ORD-1235',
          amount: 850000,
          method: 'Payme',
          status: 'success',
          date: '2024-06-15',
          time: '15:45',
          commission: 17000,
          customer: 'Malika Tosheva'
        },
        {
          id: 'TXN003',
          orderId: 'ORD-1236',
          amount: 2100000,
          method: 'UzCard',
          status: 'pending',
          date: '2024-06-15',
          time: '16:20',
          commission: 25200,
          customer: 'Jasur Aliyev'
        },
      ];
      setTransactions(defaultTransactions);
      localStorage.setItem('veluna_payment_transactions', JSON.stringify(defaultTransactions));
    }
  };

  const toggleMethod = (id: string) => {
    const updated = paymentMethods.map(m =>
      m.id === id ? { ...m, enabled: !m.enabled } : m
    );
    setPaymentMethods(updated);
    localStorage.setItem('veluna_payment_methods', JSON.stringify(updated));
    toast.success('To\'lov usuli yangilandi!');
  };

  const configureMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setShowConfig(true);
  };

  const saveConfig = (config: any) => {
    if (!selectedMethod) return;

    const updated = paymentMethods.map(m =>
      m.id === selectedMethod.id ? { ...m, ...config } : m
    );
    setPaymentMethods(updated);
    localStorage.setItem('veluna_payment_methods', JSON.stringify(updated));
    toast.success('Sozlamalar saqlandi!');
    setShowConfig(false);
    setSelectedMethod(null);
  };

  const stats = {
    totalRevenue: paymentMethods.reduce((sum, m) => sum + m.revenue, 0),
    totalTransactions: paymentMethods.reduce((sum, m) => sum + m.transactions, 0),
    totalCommission: paymentMethods.reduce((sum, m) => sum + (m.revenue * m.commission / 100), 0),
    successRate: transactions.length > 0
      ? ((transactions.filter(t => t.status === 'success').length / transactions.length) * 100).toFixed(1)
      : '0'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">To'lov tizimlari</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          To'lov shlyuzlari va tranzaksiyalar
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
          <DollarSign className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-emerald-100">Jami daromad</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <TrendingUp className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          <div className="text-sm text-blue-100">Tranzaksiyalar</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <CreditCard className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{(stats.totalCommission / 1000).toFixed(0)}k</div>
          <div className="text-sm text-orange-100">Komissiya</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <CheckCircle className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.successRate}%</div>
          <div className="text-sm text-purple-100">Muvaffaqiyat</div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">To'lov usullari</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border-2 rounded-lg transition-all ${
                method.enabled
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{method.logo}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {method.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Komissiya: {method.commission}%
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleMethod(method.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    method.enabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {method.enabled ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Tranzaksiyalar:</span>
                  <div className="font-bold text-gray-900 dark:text-white">{method.transactions}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Daromad:</span>
                  <div className="font-bold text-emerald-600">
                    {(method.revenue / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>

              {method.type !== 'cash' && (
                <button
                  onClick={() => configureMethod(method)}
                  className="w-full px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm"
                >
                  Sozlash
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white">So'nggi tranzaksiyalar</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Mijoz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Usul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Summa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Komissiya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Sana
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {txn.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {txn.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {txn.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                    {txn.amount.toLocaleString()} so'm
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {txn.commission.toLocaleString()} so'm
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      txn.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      txn.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {txn.status === 'success' ? '✅ Muvaffaqiyatli' :
                       txn.status === 'pending' ? '⏳ Kutilmoqda' :
                       '❌ Xatolik'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {txn.date} {txn.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Info */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 mt-1" />
          <div>
            <h3 className="font-bold mb-2">To'lov tizimlarini ulash</h3>
            <p className="text-sm text-blue-100 mb-3">
              Click, Payme va boshqa to'lov tizimlarini ishlatish uchun ularning rasmiy saytlarida ro'yxatdan o'ting va API kalitlarini oling.
            </p>
            <div className="space-y-1 text-sm">
              <p>• <strong>Click:</strong> https://click.uz/business</p>
              <p>• <strong>Payme:</strong> https://payme.uz/business</p>
              <p>• <strong>Uzum:</strong> https://uzum.uz/business</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfig && selectedMethod && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedMethod.name} sozlamalari
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Merchant ID
                </label>
                <input
                  type="text"
                  defaultValue={selectedMethod.merchantId}
                  placeholder="Merchant ID ni kiriting"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  defaultValue={selectedMethod.apiKey}
                  placeholder="API kalitni kiriting"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secret Key
                </label>
                <input
                  type="password"
                  defaultValue={selectedMethod.secretKey}
                  placeholder="Maxfiy kalitni kiriting"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Komissiya (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={selectedMethod.commission}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowConfig(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={() => saveConfig({})}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
