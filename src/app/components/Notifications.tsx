import { X, Bell, Tag, TrendingDown, Gift, Percent } from 'lucide-react';

interface Notification {
  id: string;
  type: 'discount' | 'sale' | 'gift' | 'promo';
  title: string;
  message: string;
  date: string;
  read: boolean;
  discount?: number;
}

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function Notifications({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead,
  onMarkAllAsRead 
}: NotificationsProps) {
  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'discount':
        return { icon: TrendingDown, color: 'bg-red-100 text-red-600' };
      case 'sale':
        return { icon: Tag, color: 'bg-orange-100 text-orange-600' };
      case 'gift':
        return { icon: Gift, color: 'bg-purple-100 text-purple-600' };
      case 'promo':
        return { icon: Percent, color: 'bg-blue-100 text-blue-600' };
      default:
        return { icon: Bell, color: 'bg-gray-100 text-gray-600' };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Notifications panel */}
      <div className="fixed right-0 top-0 h-full w-full md:max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2>Bildirishnomalar</h2>
            
            {/* YANGI: Desktop uchun X tugmasi */}
            <button
              onClick={onClose}
              className="hidden md:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Yopish"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              Hammasini o'qilgan deb belgilash
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Bildirishnomalar yo'q</p>
              <p className="text-sm mt-2">Yangi chegirmalar haqida xabar beramiz</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const iconInfo = getNotificationIcon(notification.type);
                const Icon = iconInfo.icon;

                return (
                  <div
                    key={notification.id}
                    onClick={() => onMarkAsRead(notification.id)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-emerald-50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconInfo.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={!notification.read ? '' : 'text-gray-800'}>
                            {notification.title}
                            {notification.discount && (
                              <span className="ml-2 inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                                -{notification.discount}%
                              </span>
                            )}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">{notification.date}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}