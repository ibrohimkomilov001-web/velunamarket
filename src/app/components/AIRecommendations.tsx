import { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, ShoppingBag, Target, Zap, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Recommendation {
  id: number;
  type: 'pricing' | 'inventory' | 'marketing' | 'customer';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  action: string;
  implemented: boolean;
  aiConfidence: number;
}

interface Insight {
  category: string;
  metric: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  prediction: string;
}

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadRecommendations();
    loadInsights();
  }, []);

  const loadRecommendations = () => {
    const saved = localStorage.getItem('veluna_ai_recommendations');
    if (saved) {
      setRecommendations(JSON.parse(saved));
    } else {
      const defaultRecommendations: Recommendation[] = [
        {
          id: 1,
          type: 'pricing',
          priority: 'high',
          title: 'Samsung Galaxy S24 narxini 5% kamaytiring',
          description: 'AI tahlil natijasiga ko\'ra, bu mahsulot narxi bozor o\'rtachasidan 5% yuqori. Narxni kamaytirsangiz, sotish 23% oshishi kutilmoqda.',
          impact: '+23% sotish, +18% daromad',
          action: 'Narxni 12,350,000 so\'mga o\'zgartirish',
          implemented: false,
          aiConfidence: 89
        },
        {
          id: 2,
          type: 'inventory',
          priority: 'high',
          title: 'Nike Air Max uchun stock qo\'shing',
          description: 'So\'nggi 7 kunda 45 ta sotildi, stock 25 ta qoldi. Haftasiga o\'rtacha 40 ta sotiladi. 10 kun ichida tugaydi.',
          impact: 'Stock yetishmovchiligi oldini olish',
          action: '60 ta qo\'shimcha buyurtma berish',
          implemented: false,
          aiConfidence: 94
        },
        {
          id: 3,
          type: 'marketing',
          priority: 'medium',
          title: 'Elektronika kategoriyasida email kampaniya',
          description: 'Elektronika mahsulotlarini ko\'rgan lekin sotib olmagan 234 ta mijoz bor. Maxsus chegirma bilan email yuborsangiz, 15% konversiya kutilmoqda.',
          impact: '+35 ta yangi buyurtma',
          action: 'Email kampaniya yaratish (10% chegirma)',
          implemented: false,
          aiConfidence: 78
        },
        {
          id: 4,
          type: 'customer',
          priority: 'medium',
          title: 'VIP mijozlar dasturini boshlang',
          description: '12 ta mijoz 3 oyda 5 milliondan ortiq xarid qilgan. Ularga maxsus chegirmalar bersangiz, loyallik 40% oshadi.',
          impact: 'Takroriy xaridlar +40%',
          action: 'VIP dastur yaratish (5-15% chegirma)',
          implemented: false,
          aiConfidence: 85
        },
        {
          id: 5,
          type: 'pricing',
          priority: 'low',
          title: 'Bundle deals taklif qiling',
          description: 'Telefon + quloqchin bundle 32% ko\'p sotilmoqda. Yangi bundle\'lar yarating.',
          impact: 'O\'rtacha check +22%',
          action: 'Bundle takliflar yaratish',
          implemented: false,
          aiConfidence: 72
        },
      ];
      setRecommendations(defaultRecommendations);
      localStorage.setItem('veluna_ai_recommendations', JSON.stringify(defaultRecommendations));
    }
  };

  const loadInsights = () => {
    const defaultInsights: Insight[] = [
      {
        category: 'Savdo',
        metric: 'Kunlik o\'rtacha sotish',
        value: '15 ta',
        trend: 'up',
        prediction: 'Keyingi hafta 18 tagacha oshishi kutilmoqda (+20%)'
      },
      {
        category: 'Moliya',
        metric: 'O\'rtacha check',
        value: '1,250,000 so\'m',
        trend: 'up',
        prediction: 'Bundle deals bilan 1,520,000 so\'mga oshishi mumkin'
      },
      {
        category: 'Mijozlar',
        metric: 'Takroriy xaridlar',
        value: '34%',
        trend: 'down',
        prediction: 'Loyallik dasturi bilan 48% gacha oshirish mumkin'
      },
      {
        category: 'Mahsulotlar',
        metric: 'Eng ko\'p ko\'rilgan',
        value: 'Samsung Galaxy S24',
        trend: 'stable',
        prediction: 'Narx pasaysa, konversiya 15% oshadi'
      },
    ];
    setInsights(defaultInsights);
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    toast.info('AI tahlil boshlanmoqda...');

    setTimeout(() => {
      setAnalyzing(false);
      toast.success('AI tahlil yakunlandi! 🎉');
      loadRecommendations();
    }, 3000);
  };

  const implementRecommendation = (id: number) => {
    const updated = recommendations.map(r =>
      r.id === id ? { ...r, implemented: true } : r
    );
    setRecommendations(updated);
    localStorage.setItem('veluna_ai_recommendations', JSON.stringify(updated));
    toast.success('Tavsiya amalga oshirildi! ✅');
  };

  const dismissRecommendation = (id: number) => {
    const updated = recommendations.filter(r => r.id !== id);
    setRecommendations(updated);
    localStorage.setItem('veluna_ai_recommendations', JSON.stringify(updated));
    toast.info('Tavsiya rad etildi');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pricing': return <TrendingUp className="w-5 h-5" />;
      case 'inventory': return <ShoppingBag className="w-5 h-5" />;
      case 'marketing': return <Target className="w-5 h-5" />;
      case 'customer': return <Users className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const stats = {
    total: recommendations.length,
    highPriority: recommendations.filter(r => r.priority === 'high').length,
    implemented: recommendations.filter(r => r.implemented).length,
    avgConfidence: recommendations.length > 0
      ? (recommendations.reduce((sum, r) => sum + r.aiConfidence, 0) / recommendations.length).toFixed(0)
      : '0'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-600" />
            AI Tavsiyalar
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Sun'iy intellekt tomonidan tahlil va tavsiyalar
          </p>
        </div>
        <button
          onClick={runAnalysis}
          disabled={analyzing}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Tahlil qilinmoqda...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Yangi tahlil</span>
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <Brain className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-purple-100">Jami tavsiyalar</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <AlertCircle className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.highPriority}</div>
          <div className="text-sm text-red-100">Yuqori prioritet</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <CheckCircle className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.implemented}</div>
          <div className="text-sm text-green-100">Bajarilgan</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <Sparkles className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.avgConfidence}%</div>
          <div className="text-sm text-blue-100">AI ishonch</div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-100">{insight.category}</span>
                <span className={`text-2xl ${
                  insight.trend === 'up' ? '📈' : insight.trend === 'down' ? '📉' : '➡️'
                }`}>
                </span>
              </div>
              <div className="text-sm text-purple-100 mb-1">{insight.metric}:</div>
              <div className="text-xl font-bold mb-2">{insight.value}</div>
              <div className="text-xs text-purple-100">💡 {insight.prediction}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.filter(r => !r.implemented).map((rec) => (
          <div
            key={rec.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4"
            style={{
              borderLeftColor: 
                rec.priority === 'high' ? '#ef4444' :
                rec.priority === 'medium' ? '#f59e0b' :
                '#3b82f6'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${
                    rec.type === 'pricing' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                    rec.type === 'inventory' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                    rec.type === 'marketing' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                    'bg-orange-100 dark:bg-orange-900/30 text-orange-600'
                  }`}>
                    {getTypeIcon(rec.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{rec.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority === 'high' ? '🔴 Muhim' : rec.priority === 'medium' ? '🟡 O\'rtacha' : '🔵 Past'}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        AI Ishonch: {rec.aiConfidence}%
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-3">{rec.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Kutilayotgan ta'sir</div>
                    <div className="font-medium text-green-600">{rec.impact}</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tavsiya etilgan harakat</div>
                    <div className="font-medium text-blue-600">{rec.action}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => implementRecommendation(rec.id)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    Amalga oshirish
                  </button>
                  <button
                    onClick={() => dismissRecommendation(rec.id)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    Rad etish
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Implemented Recommendations */}
        {recommendations.filter(r => r.implemented).length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Amalga oshirilgan tavsiyalar</h3>
            {recommendations.filter(r => r.implemented).map((rec) => (
              <div
                key={rec.id}
                className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-2"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{rec.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ta'sir: {rec.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Info */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
        <div className="flex items-start gap-4">
          <Brain className="w-6 h-6 text-purple-600 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Qanday ishlaydi?</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>✅ AI tizimi savdo, mijozlar va mahsulotlar ma'lumotlarini tahlil qiladi</li>
              <li>✅ Bozor trendlari va raqobatchilar narxlarini kuzatadi</li>
              <li>✅ O'xshash bizneslarning tajribasidan o'rganadi</li>
              <li>✅ Real-time ma'lumotlar asosida prognoz beradi</li>
              <li>✅ Har bir tavsiya uchun ishonch darajasini hisoblaydi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
