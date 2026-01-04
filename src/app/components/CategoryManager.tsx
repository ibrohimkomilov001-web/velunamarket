import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Upload, Image as ImageIcon, Folder, ChevronRight, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: number;
  name: string;
  nameUz: string;
  icon: string;
  image: string;
  productCount: number;
  active: boolean;
  order: number;
  parentId?: number;
  children?: Category[];
}

interface CategoryManagerProps {
  onClose?: () => void;
}

export function CategoryManager({ onClose }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameUz: '',
    icon: '',
    image: '',
    active: true,
    parentId: 0
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const saved = localStorage.getItem('veluna_categories');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      // Default categories
      const defaultCategories: Category[] = [
        { id: 1, name: 'Electronics', nameUz: 'Elektronika', icon: '📱', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500', productCount: 45, active: true, order: 1 },
        { id: 2, name: 'Fashion', nameUz: 'Moda', icon: '👗', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500', productCount: 120, active: true, order: 2 },
        { id: 3, name: 'Home & Garden', nameUz: 'Uy-roʻzgʻor', icon: '🏠', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', productCount: 78, active: true, order: 3 },
        { id: 4, name: 'Sports', nameUz: 'Sport', icon: '⚽', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500', productCount: 56, active: true, order: 4 },
        { id: 5, name: 'Beauty', nameUz: 'Goʻzallik', icon: '💄', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500', productCount: 92, active: true, order: 5 },
        { id: 6, name: 'Books', nameUz: 'Kitoblar', icon: '📚', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500', productCount: 34, active: true, order: 6 },
      ];
      setCategories(defaultCategories);
      localStorage.setItem('veluna_categories', JSON.stringify(defaultCategories));
    }
  };

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem('veluna_categories', JSON.stringify(newCategories));
  };

  const handleAdd = () => {
    if (!formData.name || !formData.nameUz) {
      toast.error('Barcha maydonlarni to\'ldiring!');
      return;
    }

    const newCategory: Category = {
      id: Date.now(),
      name: formData.name,
      nameUz: formData.nameUz,
      icon: formData.icon || '📦',
      image: formData.image || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500',
      productCount: 0,
      active: formData.active,
      order: categories.length + 1,
      parentId: formData.parentId || undefined
    };

    saveCategories([...categories, newCategory]);
    toast.success('Kategoriya qo\'shildi!');
    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameUz: category.nameUz,
      icon: category.icon,
      image: category.image,
      active: category.active,
      parentId: category.parentId || 0
    });
    setShowAddModal(true);
  };

  const handleUpdate = () => {
    if (!editingCategory) return;

    const updated = categories.map(cat =>
      cat.id === editingCategory.id
        ? { ...cat, ...formData }
        : cat
    );

    saveCategories(updated);
    toast.success('Kategoriya yangilandi!');
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (confirm('Kategoriyani o\'chirmoqchimisiz?')) {
      saveCategories(categories.filter(cat => cat.id !== id));
      toast.success('Kategoriya o\'chirildi!');
    }
  };

  const toggleActive = (id: number) => {
    const updated = categories.map(cat =>
      cat.id === id ? { ...cat, active: !cat.active } : cat
    );
    saveCategories(updated);
    toast.success('Status o\'zgartirildi!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameUz: '',
      icon: '',
      image: '',
      active: true,
      parentId: 0
    });
    setEditingCategory(null);
    setShowAddModal(false);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.nameUz.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kategoriyalar boshqaruvi</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Jami: {categories.length} ta kategoriya
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Yangi kategoriya</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Kategoriya qidirish..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative h-32 bg-gray-100 dark:bg-gray-700">
              <img
                src={category.image}
                alt={category.nameUz}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => toggleActive(category.id)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    category.active
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-400 text-white'
                  }`}
                >
                  {category.active ? 'Faol' : 'Nofaol'}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{category.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {category.nameUz}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {category.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span>{category.productCount} ta mahsulot</span>
                <span>#{category.order}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Tahrirlash</span>
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>O'chirish</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name (English) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nomi (English)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Electronics"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Name (Uzbek) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nomi (O'zbekcha)
                </label>
                <input
                  type="text"
                  value={formData.nameUz}
                  onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                  placeholder="Elektronika"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📱"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rasm URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Faol kategoriya
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={editingCategory ? handleUpdate : handleAdd}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCategory ? 'Saqlash' : 'Qo\'shish'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
