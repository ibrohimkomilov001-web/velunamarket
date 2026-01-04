import { useState } from 'react';
import { Upload, Download, FileText, Database, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';

interface ImportExportProps {
  products: any[];
  orders: any[];
  users: any[];
  onImportProducts: (products: any[]) => void;
}

export function DataImportExport({ products, orders, users, onImportProducts }: ImportExportProps) {
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null);

  // Export to CSV
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('Ma\'lumot yo\'q!');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Handle special characters
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${filename} eksport qilindi! ✅`);
  };

  // Export to JSON
  const exportToJSON = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('Ma\'lumot yo\'q!');
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${filename} eksport qilindi! ✅`);
  };

  // Export all data (Backup)
  const exportBackup = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      data: {
        products,
        orders,
        users,
        categories: JSON.parse(localStorage.getItem('veluna_categories') || '[]'),
        banners: JSON.parse(localStorage.getItem('veluna_banners') || '[]'),
        promoCodes: JSON.parse(localStorage.getItem('veluna_promo_codes') || '[]'),
        settings: JSON.parse(localStorage.getItem('veluna_site_settings') || '{}'),
      }
    };

    const jsonContent = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `veluna-backup-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('To\'liq backup yaratildi! 🎉');
  };

  // Import from CSV
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>, type: 'products' | 'csv') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportProgress(0);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (type === 'csv') {
          // Parse CSV
          const lines = content.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          const data = [];

          for (let i = 1; i < lines.length; i++) {
            setImportProgress((i / lines.length) * 100);
            
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const obj: any = {};
            
            headers.forEach((header, index) => {
              obj[header] = values[index];
            });
            
            data.push(obj);
          }

          // Convert to products format
          const importedProducts = data.map((item, index) => ({
            id: Date.now() + index,
            name: item.name || item.Name || 'Unknown',
            price: parseFloat(item.price || item.Price || '0'),
            originalPrice: parseFloat(item.originalPrice || item['Original Price'] || '0'),
            category: item.category || item.Category || 'electronics',
            stock: parseInt(item.stock || item.Stock || '0'),
            image: item.image || item.Image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
            rating: parseFloat(item.rating || item.Rating || '4.5'),
            reviews: parseInt(item.reviews || item.Reviews || '0'),
            inStock: (parseInt(item.stock || item.Stock || '0')) > 0,
            description: item.description || item.Description || ''
          }));

          setTimeout(() => {
            onImportProducts(importedProducts);
            setImportResults({ success: importedProducts.length, failed: 0 });
            setImporting(false);
            toast.success(`${importedProducts.length} ta mahsulot import qilindi! ✅`);
          }, 1000);

        } else {
          // Parse JSON
          const data = JSON.parse(content);
          
          if (Array.isArray(data)) {
            onImportProducts(data);
            setImportResults({ success: data.length, failed: 0 });
            toast.success(`${data.length} ta mahsulot import qilindi! ✅`);
          } else if (data.data?.products) {
            // Backup file
            onImportProducts(data.data.products);
            
            // Restore other data
            if (data.data.categories) {
              localStorage.setItem('veluna_categories', JSON.stringify(data.data.categories));
            }
            if (data.data.banners) {
              localStorage.setItem('veluna_banners', JSON.stringify(data.data.banners));
            }
            if (data.data.promoCodes) {
              localStorage.setItem('veluna_promo_codes', JSON.stringify(data.data.promoCodes));
            }
            
            toast.success('Backup tiklandi! 🎉');
          }
          
          setImporting(false);
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Import xatolik! Fayl formatini tekshiring.');
        setImporting(false);
        setImportResults({ success: 0, failed: 1 });
      }
    };

    if (type === 'csv') {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const sampleData = `name,price,originalPrice,category,stock,image,rating,reviews,description
Samsung Galaxy S24,12999000,14999000,electronics,25,https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500,4.8,156,Eng so'nggi Samsung telefoni
Nike Air Max,850000,1200000,fashion,40,https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500,4.6,89,Qulay va zamonaviy krossovka
Apple MacBook Pro,25000000,28000000,electronics,15,https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500,4.9,234,Professional laptop`;

    const blob = new Blob([sampleData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample-products.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Namuna CSV yuklab olindi!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Import / Export</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Ma'lumotlarni import va eksport qilish
        </p>
      </div>

      {/* Import Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Import qilish
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CSV Import */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">CSV dan import</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Mahsulotlarni CSV formatida yuklash
            </p>
            <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              Fayl tanlash
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleFileImport(e, 'csv')}
                className="hidden"
                disabled={importing}
              />
            </label>
            <button
              onClick={downloadSampleCSV}
              className="block mt-3 mx-auto text-sm text-blue-600 hover:underline"
            >
              Namuna CSV yuklab olish
            </button>
          </div>

          {/* JSON Import */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
            <Database className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">JSON dan import</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Backup faylni tiklash
            </p>
            <label className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
              Fayl tanlash
              <input
                type="file"
                accept=".json"
                onChange={(e) => handleFileImport(e, 'products')}
                className="hidden"
                disabled={importing}
              />
            </label>
          </div>
        </div>

        {/* Import Progress */}
        {importing && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-blue-600 font-medium">Import qilinmoqda...</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${importProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {importProgress.toFixed(0)}% bajarildi
            </p>
          </div>
        )}

        {/* Import Results */}
        {importResults && !importing && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-600 font-medium">Import muvaffaqiyatli!</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ {importResults.success} ta muvaffaqiyatli
                  {importResults.failed > 0 && ` • ❌ ${importResults.failed} ta xato`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-emerald-600" />
          Eksport qilish
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Products CSV */}
          <button
            onClick={() => exportToCSV(products, 'products')}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all text-left"
          >
            <FileText className="w-8 h-8 text-emerald-600 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Mahsulotlar (CSV)
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {products.length} ta mahsulot
            </p>
          </button>

          {/* Orders CSV */}
          <button
            onClick={() => exportToCSV(orders, 'orders')}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all text-left"
          >
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Buyurtmalar (CSV)
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {orders.length} ta buyurtma
            </p>
          </button>

          {/* Users CSV */}
          <button
            onClick={() => exportToCSV(users, 'users')}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all text-left"
          >
            <FileText className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Foydalanuvchilar (CSV)
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {users.length} ta foydalanuvchi
            </p>
          </button>

          {/* Full Backup */}
          <button
            onClick={exportBackup}
            className="p-4 border-2 border-dashed border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:shadow-lg transition-all text-left"
          >
            <Database className="w-8 h-8 text-emerald-600 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              To'liq Backup
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Barcha ma'lumotlar
            </p>
          </button>
        </div>

        {/* Export Info */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-white mb-1">Eslatma:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>CSV format Excel va Google Sheets bilan mos</li>
                <li>JSON format to'liq backup uchun ishlatiladi</li>
                <li>Import qilishdan oldin backup oling</li>
                <li>Katta fayllar uchun import vaqt talab qilishi mumkin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
