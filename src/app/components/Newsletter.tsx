import { Mail, Check } from 'lucide-react';
import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-white mb-4">Yangiliklar va chegirmalardan xabardor bo'ling!</h2>
          <p className="text-emerald-50 mb-6">
            Email manzilingizni qoldiring va maxsus takliflar hamda yangi mahsulotlar haqida birinchilardan xabar oling
          </p>

          {isSubscribed ? (
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg flex items-center justify-center gap-2">
              <Check className="w-6 h-6" />
              <span>Rahmat! Siz muvaffaqiyatli obuna bo'ldingiz!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email manzilingiz"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors whitespace-nowrap"
              >
                Obuna bo'lish
              </button>
            </form>
          )}

          <p className="text-xs text-emerald-100 mt-4">
            Biz sizning ma'lumotlaringizni himoya qilamiz va spam yubormaymiz
          </p>
        </div>
      </div>
    </div>
  );
}