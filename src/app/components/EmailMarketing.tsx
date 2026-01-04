import { useState, useEffect } from 'react';
import { Mail, Send, Users, TrendingUp, Calendar, Eye, Download, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  content: string;
  recipients: number;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledDate?: string;
  sentDate?: string;
  opens: number;
  clicks: number;
  openRate: number;
  clickRate: number;
}

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  type: 'promotion' | 'newsletter' | 'notification';
}

interface Subscriber {
  id: number;
  email: string;
  name: string;
  subscribed: boolean;
  subscribedDate: string;
  tags: string[];
}

export function EmailMarketing() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'subscribers'>('campaigns');
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    recipientType: 'all',
    scheduledDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load campaigns
    const savedCampaigns = localStorage.getItem('veluna_email_campaigns');
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns));
    } else {
      const demoCampaigns: EmailCampaign[] = [
        {
          id: 1,
          name: 'Yangi yil aksiyasi',
          subject: '🎄 50% chegirma - Yangi yil maxsus taklifi!',
          content: 'Hurmatli mijozlar! Yangi yil bayramida barcha mahsulotlarga 50% chegirma...',
          recipients: 1245,
          status: 'sent',
          sentDate: '2024-06-10',
          opens: 892,
          clicks: 234,
          openRate: 71.6,
          clickRate: 18.8
        },
        {
          id: 2,
          name: 'Haftalik newsletter',
          subject: '📰 Bu haftaning eng yaxshi takliflari',
          content: 'Salom! Bu haftada yangi mahsulotlar va maxsus chegirmalar...',
          recipients: 1245,
          status: 'scheduled',
          scheduledDate: '2024-06-20',
          opens: 0,
          clicks: 0,
          openRate: 0,
          clickRate: 0
        },
      ];
      setCampaigns(demoCampaigns);
      localStorage.setItem('veluna_email_campaigns', JSON.stringify(demoCampaigns));
    }

    // Load templates
    const savedTemplates = localStorage.getItem('veluna_email_templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      const demoTemplates: EmailTemplate[] = [
        {
          id: 1,
          name: 'Aksiya shablon',
          subject: '🎉 Maxsus taklif!',
          content: `
            <h2>Hurmatli {{name}},</h2>
            <p>Sizga maxsus taklif!</p>
            <p>Promokod: {{promo_code}}</p>
            <p>Chegirma: {{discount}}%</p>
          `,
          type: 'promotion'
        },
        {
          id: 2,
          name: 'Newsletter shablon',
          subject: '📰 Yangiliklar',
          content: `
            <h2>Salom {{name}}!</h2>
            <p>Bu hafta yangiliklari...</p>
          `,
          type: 'newsletter'
        },
      ];
      setTemplates(demoTemplates);
      localStorage.setItem('veluna_email_templates', JSON.stringify(demoTemplates));
    }

    // Load subscribers
    const savedSubscribers = localStorage.getItem('veluna_email_subscribers');
    if (savedSubscribers) {
      setSubscribers(JSON.parse(savedSubscribers));
    } else {
      const demoSubscribers: Subscriber[] = [
        {
          id: 1,
          email: 'aziz@example.com',
          name: 'Aziz Karimov',
          subscribed: true,
          subscribedDate: '2024-01-15',
          tags: ['vip', 'electronics']
        },
        {
          id: 2,
          email: 'malika@example.com',
          name: 'Malika Tosheva',
          subscribed: true,
          subscribedDate: '2024-02-20',
          tags: ['fashion']
        },
      ];
      setSubscribers(demoSubscribers);
      localStorage.setItem('veluna_email_subscribers', JSON.stringify(demoSubscribers));
    }
  };

  const sendCampaign = (campaignId: number) => {
    toast.success('Email kampaniyasi yuborilmoqda...');
    // Here you would integrate with an email service like SendGrid, Mailchimp, etc.
    setTimeout(() => {
      const updated = campaigns.map(c =>
        c.id === campaignId
          ? { ...c, status: 'sent' as const, sentDate: new Date().toISOString().split('T')[0] }
          : c
      );
      setCampaigns(updated);
      localStorage.setItem('veluna_email_campaigns', JSON.stringify(updated));
      toast.success('Email kampaniyasi yuborildi! ✅');
    }, 2000);
  };

  const createCampaign = () => {
    if (!formData.name || !formData.subject || !formData.content) {
      toast.error('Barcha maydonlarni to\'ldiring!');
      return;
    }

    const newCampaign: EmailCampaign = {
      id: Date.now(),
      name: formData.name,
      subject: formData.subject,
      content: formData.content,
      recipients: subscribers.filter(s => s.subscribed).length,
      status: formData.scheduledDate ? 'scheduled' : 'draft',
      scheduledDate: formData.scheduledDate || undefined,
      opens: 0,
      clicks: 0,
      openRate: 0,
      clickRate: 0
    };

    const updated = [...campaigns, newCampaign];
    setCampaigns(updated);
    localStorage.setItem('veluna_email_campaigns', JSON.stringify(updated));
    toast.success('Kampaniya yaratildi!');
    setShowNewCampaign(false);
    setFormData({ name: '', subject: '', content: '', recipientType: 'all', scheduledDate: '' });
  };

  const deleteCampaign = (id: number) => {
    if (confirm('Kampaniyani o\'chirmoqchimisiz?')) {
      const updated = campaigns.filter(c => c.id !== id);
      setCampaigns(updated);
      localStorage.setItem('veluna_email_campaigns', JSON.stringify(updated));
      toast.success('Kampaniya o\'chirildi!');
    }
  };

  const stats = {
    totalSubscribers: subscribers.filter(s => s.subscribed).length,
    totalCampaigns: campaigns.length,
    sentCampaigns: campaigns.filter(c => c.status === 'sent').length,
    avgOpenRate: campaigns.length > 0
      ? (campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length).toFixed(1)
      : '0',
    avgClickRate: campaigns.length > 0
      ? (campaigns.reduce((sum, c) => sum + c.clickRate, 0) / campaigns.length).toFixed(1)
      : '0',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Marketing</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Email kampaniyalar va obuna boshqaruvi
          </p>
        </div>
        <button
          onClick={() => setShowNewCampaign(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi kampaniya</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <Users className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
          <div className="text-sm text-blue-100">Obunachi</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <Mail className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
          <div className="text-sm text-green-100">Kampaniyalar</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <Send className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.sentCampaigns}</div>
          <div className="text-sm text-purple-100">Yuborilgan</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <Eye className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.avgOpenRate}%</div>
          <div className="text-sm text-orange-100">Open Rate</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
          <TrendingUp className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.avgClickRate}%</div>
          <div className="text-sm text-pink-100">Click Rate</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'campaigns'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Kampaniyalar
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'templates'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Shablonlar
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'subscribers'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Obunachilar
        </button>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {campaign.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'sent' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {campaign.status === 'sent' ? '✅ Yuborilgan' :
                       campaign.status === 'scheduled' ? '⏰ Rejalashtirilgan' :
                       '📝 Qoralama'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    📧 {campaign.subject}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>👥 {campaign.recipients} ta qabul qiluvchi</span>
                    {campaign.status === 'sent' && (
                      <>
                        <span>📖 {campaign.opens} ochildi ({campaign.openRate}%)</span>
                        <span>🖱️ {campaign.clicks} bosdi ({campaign.clickRate}%)</span>
                        <span>📅 {campaign.sentDate}</span>
                      </>
                    )}
                    {campaign.status === 'scheduled' && (
                      <span>🕒 {campaign.scheduledDate}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {campaign.status !== 'sent' && (
                    <button
                      onClick={() => sendCampaign(campaign.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Yuborish</span>
                    </button>
                  )}
                  <button
                    onClick={() => toast.info('Tahrirlash funksiyasi')}
                    className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCampaign(campaign.id)}
                    className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {template.subject}
              </p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs ${
                  template.type === 'promotion' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                  template.type === 'newsletter' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {template.type}
                </span>
                <button
                  onClick={() => {
                    setFormData({ ...formData, subject: template.subject, content: template.content });
                    setShowNewCampaign(true);
                  }}
                  className="text-sm text-emerald-600 hover:underline"
                >
                  Ishlatish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Ism
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Obuna sanasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Teglar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {subscriber.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {subscriber.subscribedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {subscriber.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        subscriber.subscribed
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {subscriber.subscribed ? 'Faol' : 'Nofaol'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {showNewCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Yangi kampaniya yaratish
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kampaniya nomi
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Yangi yil aksiyasi"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mavzu
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="🎄 50% chegirma - Yangi yil maxsus taklifi!"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Xabar matni
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Xabar matnini kiriting..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rejalashtirish (ixtiyoriy)
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewCampaign(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={createCampaign}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Yaratish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
