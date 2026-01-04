import { useState, useEffect } from 'react';
import { Truck, MapPin, Plus, Edit2, Trash2, Users, DollarSign, Clock, Package } from 'lucide-react';
import { toast } from 'sonner';

interface ShippingZone {
  id: number;
  name: string;
  regions: string[];
  price: number;
  freeShippingThreshold: number;
  estimatedDays: string;
  active: boolean;
}

interface Courier {
  id: number;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  zone: string;
  activeOrders: number;
  completedOrders: number;
  rating: number;
  active: boolean;
}

export function ShippingManager() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [showAddZone, setShowAddZone] = useState(false);
  const [showAddCourier, setShowAddCourier] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load shipping zones
    const savedZones = localStorage.getItem('veluna_shipping_zones');
    if (savedZones) {
      setZones(JSON.parse(savedZones));
    } else {
      const defaultZones: ShippingZone[] = [
        {
          id: 1,
          name: 'Toshkent shahri',
          regions: ['Chilonzor', 'Yunusobod', 'Sergeli', 'Yakkasaroy'],
          price: 15000,
          freeShippingThreshold: 300000,
          estimatedDays: '1-2',
          active: true
        },
        {
          id: 2,
          name: 'Toshkent viloyati',
          regions: ['Olmaliq', 'Angren', 'Chirchiq', 'Bekobod'],
          price: 25000,
          freeShippingThreshold: 500000,
          estimatedDays: '2-3',
          active: true
        },
        {
          id: 3,
          name: 'Boshqa viloyatlar',
          regions: ['Samarqand', 'Buxoro', 'Farg\'ona', 'Namangan'],
          price: 50000,
          freeShippingThreshold: 1000000,
          estimatedDays: '3-5',
          active: true
        },
      ];
      setZones(defaultZones);
      localStorage.setItem('veluna_shipping_zones', JSON.stringify(defaultZones));
    }

    // Load couriers
    const savedCouriers = localStorage.getItem('veluna_couriers');
    if (savedCouriers) {
      setCouriers(JSON.parse(savedCouriers));
    } else {
      const defaultCouriers: Courier[] = [
        {
          id: 1,
          name: 'Alisher Ergashev',
          phone: '+998 90 123 45 67',
          email: 'alisher@veluna.uz',
          vehicle: 'Mototsikl',
          zone: 'Toshkent shahri',
          activeOrders: 5,
          completedOrders: 234,
          rating: 4.8,
          active: true
        },
        {
          id: 2,
          name: 'Sardor Karimov',
          phone: '+998 91 234 56 78',
          email: 'sardor@veluna.uz',
          vehicle: 'Avtomobil',
          zone: 'Toshkent viloyati',
          activeOrders: 3,
          completedOrders: 189,
          rating: 4.6,
          active: true
        },
        {
          id: 3,
          name: 'Jasur Toshev',
          phone: '+998 93 345 67 89',
          email: 'jasur@veluna.uz',
          vehicle: 'Yuk mashinasi',
          zone: 'Boshqa viloyatlar',
          activeOrders: 7,
          completedOrders: 156,
          rating: 4.9,
          active: true
        },
      ];
      setCouriers(defaultCouriers);
      localStorage.setItem('veluna_couriers', JSON.stringify(defaultCouriers));
    }
  };

  const deleteZone = (id: number) => {
    if (confirm('Zonani o\'chirmoqchimisiz?')) {
      const updated = zones.filter(z => z.id !== id);
      setZones(updated);
      localStorage.setItem('veluna_shipping_zones', JSON.stringify(updated));
      toast.success('Zona o\'chirildi!');
    }
  };

  const toggleZoneStatus = (id: number) => {
    const updated = zones.map(z =>
      z.id === id ? { ...z, active: !z.active } : z
    );
    setZones(updated);
    localStorage.setItem('veluna_shipping_zones', JSON.stringify(updated));
    toast.success('Status o\'zgartirildi!');
  };

  const deleteCourier = (id: number) => {
    if (confirm('Kurerni o\'chirmoqchimisiz?')) {
      const updated = couriers.filter(c => c.id !== id);
      setCouriers(updated);
      localStorage.setItem('veluna_couriers', JSON.stringify(updated));
      toast.success('Kurer o\'chirildi!');
    }
  };

  const toggleCourierStatus = (id: number) => {
    const updated = couriers.map(c =>
      c.id === id ? { ...c, active: !c.active } : c
    );
    setCouriers(updated);
    localStorage.setItem('veluna_couriers', JSON.stringify(updated));
    toast.success('Kurer statusi o\'zgartirildi!');
  };

  const stats = {
    totalZones: zones.length,
    activeZones: zones.filter(z => z.active).length,
    totalCouriers: couriers.length,
    activeCouriers: couriers.filter(c => c.active).length,
    activeDeliveries: couriers.reduce((sum, c) => sum + c.activeOrders, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Yetkazib berish boshqaruvi</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Zonalar va kurerlar boshqaruvi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow">
          <MapPin className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.totalZones}</div>
          <div className="text-sm text-blue-100">Jami zonalar</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow">
          <Truck className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.totalCouriers}</div>
          <div className="text-sm text-green-100">Jami kurerlar</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow">
          <Package className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.activeDeliveries}</div>
          <div className="text-sm text-orange-100">Faol yetkazish</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow">
          <Users className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.activeCouriers}</div>
          <div className="text-sm text-purple-100">Faol kurerlar</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-4 rounded-xl shadow">
          <Clock className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">1-5</div>
          <div className="text-sm text-pink-100">Kun (o'rtacha)</div>
        </div>
      </div>

      {/* Shipping Zones */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Yetkazib berish zonalari
          </h3>
          <button
            onClick={() => setShowAddZone(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi zona</span>
          </button>
        </div>

        <div className="space-y-4">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {zone.name}
                    </h4>
                    <button
                      onClick={() => toggleZoneStatus(zone.id)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        zone.active
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                    >
                      {zone.active ? 'Faol' : 'Nofaol'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {zone.regions.map((region, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs rounded"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Narx:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {zone.price.toLocaleString()} so'm
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Bepul:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {zone.freeShippingThreshold.toLocaleString()}+ so'm
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Muddat:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {zone.estimatedDays} kun
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toast.info('Tahrirlash funksiyasi')}
                    className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteZone(zone.id)}
                    className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Couriers */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-green-600" />
            Kurerlar
          </h3>
          <button
            onClick={() => setShowAddCourier(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi kurer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {couriers.map((courier) => (
            <div
              key={courier.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {courier.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    📱 {courier.phone}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🚗 {courier.vehicle}
                  </p>
                </div>
                <button
                  onClick={() => toggleCourierStatus(courier.id)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    courier.active
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-400 text-white'
                  }`}
                >
                  {courier.active ? 'Faol' : 'Nofaol'}
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs rounded">
                  {courier.zone}
                </span>
                <span className="text-sm text-yellow-600 flex items-center gap-1">
                  ⭐ {courier.rating}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Faol:</span>
                  <span className="ml-1 font-medium text-orange-600">
                    {courier.activeOrders}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Bajarilgan:</span>
                  <span className="ml-1 font-medium text-green-600">
                    {courier.completedOrders}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toast.info('Tahrirlash funksiyasi')}
                  className="flex-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => deleteCourier(courier.id)}
                  className="flex-1 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 rounded text-xs hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
