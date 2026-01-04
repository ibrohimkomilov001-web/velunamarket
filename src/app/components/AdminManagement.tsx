import { useState, useEffect } from 'react';
import { Users, Shield, Plus, Edit2, Trash2, Search, Lock, Unlock, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'manager' | 'moderator' | 'viewer';
  permissions: string[];
  active: boolean;
  createdDate: string;
  lastLogin?: string;
  avatar?: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'products' | 'orders' | 'users' | 'settings' | 'reports';
}

export function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer' as Admin['role'],
    permissions: [] as string[]
  });

  const allPermissions: Permission[] = [
    // Products
    { id: 'products.view', name: 'Mahsulotlarni ko\'rish', description: 'Barcha mahsulotlarni ko\'rish', category: 'products' },
    { id: 'products.create', name: 'Mahsulot qo\'shish', description: 'Yangi mahsulot qo\'shish', category: 'products' },
    { id: 'products.edit', name: 'Mahsulot tahrirlash', description: 'Mavjud mahsulotni tahrirlash', category: 'products' },
    { id: 'products.delete', name: 'Mahsulot o\'chirish', description: 'Mahsulotni o\'chirish', category: 'products' },
    
    // Orders
    { id: 'orders.view', name: 'Buyurtmalarni ko\'rish', description: 'Barcha buyurtmalarni ko\'rish', category: 'orders' },
    { id: 'orders.edit', name: 'Buyurtma tahrirlash', description: 'Buyurtma holatini o\'zgartirish', category: 'orders' },
    { id: 'orders.cancel', name: 'Buyurtma bekor qilish', description: 'Buyurtmani bekor qilish', category: 'orders' },
    
    // Users
    { id: 'users.view', name: 'Foydalanuvchilarni ko\'rish', description: 'Foydalanuvchilar ro\'yxati', category: 'users' },
    { id: 'users.edit', name: 'Foydalanuvchi tahrirlash', description: 'Foydalanuvchi ma\'lumotlarini tahrirlash', category: 'users' },
    { id: 'users.block', name: 'Foydalanuvchi bloklash', description: 'Foydalanuvchini bloklash/blokdan chiqarish', category: 'users' },
    
    // Settings
    { id: 'settings.view', name: 'Sozlamalarni ko\'rish', description: 'Sayt sozlamalarini ko\'rish', category: 'settings' },
    { id: 'settings.edit', name: 'Sozlamalar tahrirlash', description: 'Sayt sozlamalarini o\'zgartirish', category: 'settings' },
    
    // Reports
    { id: 'reports.view', name: 'Hisobotlarni ko\'rish', description: 'Moliyaviy va boshqa hisobotlar', category: 'reports' },
    { id: 'reports.export', name: 'Hisobotlarni eksport', description: 'Hisobotlarni yuklab olish', category: 'reports' },
  ];

  const rolePermissions = {
    super_admin: allPermissions.map(p => p.id),
    manager: allPermissions.filter(p => p.id !== 'settings.edit').map(p => p.id),
    moderator: allPermissions.filter(p => 
      p.category === 'products' || p.category === 'orders' || p.id === 'users.view'
    ).map(p => p.id),
    viewer: allPermissions.filter(p => p.id.includes('view')).map(p => p.id),
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = () => {
    const saved = localStorage.getItem('veluna_admins');
    if (saved) {
      setAdmins(JSON.parse(saved));
    } else {
      const defaultAdmins: Admin[] = [
        {
          id: 1,
          name: 'Ibrohim Komilov',
          email: 'ibrohimkomilov001@gmail.com',
          role: 'super_admin',
          permissions: rolePermissions.super_admin,
          active: true,
          createdDate: '2024-01-01',
          lastLogin: '2024-06-15 10:30',
          avatar: '👨‍💼'
        },
        {
          id: 2,
          name: 'Aziz Karimov',
          email: 'aziz@veluna.uz',
          role: 'manager',
          permissions: rolePermissions.manager,
          active: true,
          createdDate: '2024-02-15',
          lastLogin: '2024-06-14 15:20',
          avatar: '👨'
        },
        {
          id: 3,
          name: 'Malika Tosheva',
          email: 'malika@veluna.uz',
          role: 'moderator',
          permissions: rolePermissions.moderator,
          active: true,
          createdDate: '2024-03-20',
          lastLogin: '2024-06-13 09:15',
          avatar: '👩'
        },
      ];
      setAdmins(defaultAdmins);
      localStorage.setItem('veluna_admins', JSON.stringify(defaultAdmins));
    }
  };

  const saveAdmins = (newAdmins: Admin[]) => {
    setAdmins(newAdmins);
    localStorage.setItem('veluna_admins', JSON.stringify(newAdmins));
  };

  const addAdmin = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Barcha maydonlarni to\'ldiring!');
      return;
    }

    const newAdmin: Admin = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      permissions: rolePermissions[formData.role],
      active: true,
      createdDate: new Date().toISOString().split('T')[0],
      avatar: '👤'
    };

    saveAdmins([...admins, newAdmin]);
    toast.success('Admin qo\'shildi!');
    resetForm();
  };

  const updateAdmin = () => {
    if (!editingAdmin) return;

    const updated = admins.map(a =>
      a.id === editingAdmin.id
        ? { ...a, ...formData, permissions: rolePermissions[formData.role] }
        : a
    );

    saveAdmins(updated);
    toast.success('Admin yangilandi!');
    resetForm();
  };

  const deleteAdmin = (id: number) => {
    if (id === 1) {
      toast.error('Super Admin\'ni o\'chirish mumkin emas!');
      return;
    }

    if (confirm('Admin\'ni o\'chirmoqchimisiz?')) {
      saveAdmins(admins.filter(a => a.id !== id));
      toast.success('Admin o\'chirildi!');
    }
  };

  const toggleStatus = (id: number) => {
    if (id === 1) {
      toast.error('Super Admin\'ni o\'chirib bo\'lmaydi!');
      return;
    }

    const updated = admins.map(a =>
      a.id === id ? { ...a, active: !a.active } : a
    );
    saveAdmins(updated);
    toast.success('Status o\'zgartirildi!');
  };

  const editAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      role: admin.role,
      permissions: admin.permissions
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'viewer',
      permissions: []
    });
    setEditingAdmin(null);
    setShowAddModal(false);
  };

  const getRoleBadge = (role: Admin['role']) => {
    switch (role) {
      case 'super_admin':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'manager':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'moderator':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRoleName = (role: Admin['role']) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'manager': return 'Manager';
      case 'moderator': return 'Moderator';
      default: return 'Ko\'ruvchi';
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: admins.length,
    active: admins.filter(a => a.active).length,
    superAdmins: admins.filter(a => a.role === 'super_admin').length,
    managers: admins.filter(a => a.role === 'manager').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin boshqaruvi</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Adminlar va ruxsatlar tizimi
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Yangi admin</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Jami adminlar</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Faol</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-purple-600">{stats.superAdmins}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Super Admin</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.managers}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Manager</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Admin qidirish..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Admins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAdmins.map((admin) => (
          <div
            key={admin.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{admin.avatar}</div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{admin.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{admin.email}</p>
                </div>
              </div>
              <button
                onClick={() => toggleStatus(admin.id)}
                className={`p-2 rounded-lg transition-colors ${
                  admin.active
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-600'
                }`}
              >
                {admin.active ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </button>
            </div>

            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge(admin.role)}`}>
                {getRoleName(admin.role)}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{admin.permissions.length} ta ruxsat</span>
              </div>
              <div>📅 Yaratilgan: {admin.createdDate}</div>
              {admin.lastLogin && (
                <div>🕒 Oxirgi kirish: {admin.lastLogin}</div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => editAdmin(admin)}
                className="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm"
              >
                Tahrirlash
              </button>
              <button
                onClick={() => deleteAdmin(admin.id)}
                className="flex-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm"
              >
                O'chirish
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingAdmin ? 'Admin tahrirlash' : 'Yangi admin qo\'shish'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ism
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Aziz Karimov"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@veluna.uz"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Parol {editingAdmin && '(bo\'sh qoldiring agar o\'zgartirmoqchi bo\'lmasangiz)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Admin['role'] })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="viewer">Ko'ruvchi (Faqat ko'rish)</option>
                  <option value="moderator">Moderator (Mahsulot va buyurtmalar)</option>
                  <option value="manager">Manager (Deyarli barcha huquqlar)</option>
                  <option value="super_admin">Super Admin (Barcha huquqlar)</option>
                </select>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Ruxsatlar ({rolePermissions[formData.role].length} ta)
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {allPermissions
                    .filter(p => rolePermissions[formData.role].includes(p.id))
                    .map(permission => (
                      <div key={permission.id} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <div>
                          <div className="text-gray-900 dark:text-white">{permission.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {permission.description}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={editingAdmin ? updateAdmin : addAdmin}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {editingAdmin ? 'Saqlash' : 'Qo\'shish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
