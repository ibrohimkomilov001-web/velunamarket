import { useState, useEffect } from 'react';
import { Star, Check, X, Eye, Trash2, Search, Filter, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: number;
  productId: number;
  productName: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  helpful: number;
  images?: string[];
}

export function ReviewsModeration() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    const saved = localStorage.getItem('veluna_reviews');
    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      const demoReviews: Review[] = [
        {
          id: 1,
          productId: 1,
          productName: 'Samsung Galaxy S24',
          userName: 'Aziz Karimov',
          userEmail: 'aziz@example.com',
          rating: 5,
          comment: 'Ajoyib telefon! Kamera sifati zo\'r, batareya uzoq vaqt ishlaydi.',
          date: '2024-06-15',
          status: 'pending',
          helpful: 12
        },
        {
          id: 2,
          productId: 2,
          productName: 'Nike Air Max',
          userName: 'Malika Tosheva',
          userEmail: 'malika@example.com',
          rating: 4,
          comment: 'Qulay va zamonaviy. Lekin narx biroz baland.',
          date: '2024-06-14',
          status: 'approved',
          helpful: 8
        },
        {
          id: 3,
          productId: 3,
          productName: 'Artel LED TV',
          userName: 'Spam User',
          userEmail: 'spam@example.com',
          rating: 1,
          comment: 'Juda yomon! Bu yerda reklama link: www.spam.com',
          date: '2024-06-13',
          status: 'rejected',
          helpful: 0
        },
      ];
      setReviews(demoReviews);
      localStorage.setItem('veluna_reviews', JSON.stringify(demoReviews));
    }
  };

  const saveReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    localStorage.setItem('veluna_reviews', JSON.stringify(newReviews));
  };

  const approveReview = (id: number) => {
    const updated = reviews.map(r =>
      r.id === id ? { ...r, status: 'approved' as const } : r
    );
    saveReviews(updated);
    toast.success('Sharh tasdiqlandi!');
  };

  const rejectReview = (id: number) => {
    const updated = reviews.map(r =>
      r.id === id ? { ...r, status: 'rejected' as const } : r
    );
    saveReviews(updated);
    toast.error('Sharh rad etildi!');
  };

  const deleteReview = (id: number) => {
    if (confirm('Sharhni o\'chirmoqchimisiz?')) {
      saveReviews(reviews.filter(r => r.id !== id));
      toast.success('Sharh o\'chirildi!');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || review.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    avgRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sharhlar moderatsiyasi</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Foydalanuvchi sharhlarini boshqarish
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Jami sharhlar</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Kutilmoqda</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tasdiqlangan</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Rad etilgan</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold text-yellow-600 flex items-center gap-1">
            <Star className="w-5 h-5 fill-current" />
            {stats.avgRating}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">O'rtacha reyting</div>
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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">Barchasi</option>
          <option value="pending">⏳ Kutilmoqda</option>
          <option value="approved">✅ Tasdiqlangan</option>
          <option value="rejected">❌ Rad etilgan</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4"
            style={{
              borderLeftColor: 
                review.status === 'approved' ? '#10b981' :
                review.status === 'rejected' ? '#ef4444' :
                '#f59e0b'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{review.productName}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span>{review.userName}</span>
                  <span>•</span>
                  <span>{review.userEmail}</span>
                  <span>•</span>
                  <span>{review.date}</span>
                </div>
                <p className="text-gray-900 dark:text-white mb-3">{review.comment}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>👍 {review.helpful} foydali deb topildi</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    review.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    review.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {review.status === 'approved' ? 'Tasdiqlangan' :
                     review.status === 'rejected' ? 'Rad etilgan' :
                     'Kutilmoqda'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {review.status !== 'approved' && (
                  <button
                    onClick={() => approveReview(review.id)}
                    className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    title="Tasdiqlash"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
                {review.status !== 'rejected' && (
                  <button
                    onClick={() => rejectReview(review.id)}
                    className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title="Rad etish"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => deleteReview(review.id)}
                  className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  title="O'chirish"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Hech qanday sharh topilmadi</p>
        </div>
      )}
    </div>
  );
}
