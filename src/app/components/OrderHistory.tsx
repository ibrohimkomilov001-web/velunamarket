import { X, Package, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { OrderTracking } from './OrderTracking';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled' | 'shipped';
  total: number;
  items: {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
}

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export function OrderHistory({ isOpen, onClose, orders }: OrderHistoryProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, label: 'Kutilmoqda', color: 'text-yellow-600 bg-yellow-100' };
      case 'processing':
        return { icon: Package, label: 'Jarayonda', color: 'text-blue-600 bg-blue-100' };
      case 'delivered':
        return { icon: CheckCircle, label: 'Yetkazilgan', color: 'text-green-600 bg-green-100' };
      case 'cancelled':
        return { icon: XCircle, label: 'Bekor qilingan', color: 'text-red-600 bg-red-100' };
      case 'shipped':
        return { icon: Package, label: 'Yuborilgan', color: 'text-gray-600 bg-gray-100' };
      default:
        return { icon: Package, label: 'Noma\'lum', color: 'text-gray-600 bg-gray-100' };
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full md:max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2>Buyurtmalar tarixi</h2>
          
          {/* YANGI: Desktop uchun X tugmasi */}
          <button
            onClick={onClose}
            className="hidden md:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Yopish"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Order list or detail */}
        <div className="flex-1 overflow-y-auto">
          {selectedOrder ? (
            // Order detail view
            <div className="p-4 space-y-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex items-center gap-2 text-emerald-600 mb-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Orqaga
              </button>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Buyurtma raqami</p>
                    <p>#{selectedOrder.id}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${getStatusInfo(selectedOrder.status).color}`}>
                    {getStatusInfo(selectedOrder.status).label}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Sana: {selectedOrder.date}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Mahsulotlar</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm mb-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Miqdor: {item.quantity}</p>
                        <p className="text-emerald-600 text-sm mt-1">
                          {item.price.toLocaleString()} so'm
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Mahsulotlar</span>
                  <span>{selectedOrder.total.toLocaleString()} so'm</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Yetkazib berish</span>
                  <span>25,000 so'm</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span>Jami</span>
                  <span className="text-emerald-600 text-lg">
                    {(selectedOrder.total + 25000).toLocaleString()} so'm
                  </span>
                </div>
              </div>

              {/* Order Tracking */}
              {selectedOrder.status !== 'cancelled' && (
                <OrderTracking 
                  orderId={selectedOrder.id}
                  status={selectedOrder.status}
                  estimatedDelivery="18 Dekabr, 2024"
                />
              )}
            </div>
          ) : (
            // Order list view
            <div className="p-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Buyurtmalar yo'q</p>
                  <p className="text-sm mt-2">Birinchi buyurtmangizni bering</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="mb-1">Buyurtma #{order.id}</p>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusInfo.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            <span>{statusInfo.label}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <ImageWithFallback
                              key={idx}
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-600">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {order.items.length} mahsulot
                          </span>
                          <span className="text-emerald-600">
                            {order.total.toLocaleString()} so'm
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}