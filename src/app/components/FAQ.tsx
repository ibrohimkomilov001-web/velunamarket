import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'Qanday qilib buyurtma berish mumkin?',
    answer: 'Mahsulotni tanlang, "Savatga" tugmasini bosing va "Rasmiylashtirish" bo\'limida barcha ma\'lumotlarni kiriting.',
  },
  {
    question: 'Yetkazib berish qancha vaqt oladi?',
    answer: 'Toshkent shahrida 1-2 kun ichida, boshqa viloyatlarda 2-5 kun ichida yetkazib beramiz.',
  },
  {
    question: 'To\'lov usullari qanday?',
    answer: 'Naqd pul (yetkazib berishda), plastik karta orqali to\'lov qabul qilamiz.',
  },
  {
    question: 'Mahsulotni qaytarish mumkinmi?',
    answer: 'Ha, 14 kun ichida sifatli mahsulotlarni qaytarish mumkin.',
  },
  {
    question: 'Cashback qanday ishlaydi?',
    answer: 'Har bir xaridingizdan 5% cashback oling va keyingi xaridlarda ishlating.',
  },
  {
    question: 'Promo kodlarni qayerdan topish mumkin?',
    answer: 'Email orqali yangiliklar obunasi va bildirishnomalar orqali maxsus promo kodlar yuboramiz.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl md:text-3xl mb-2 dark:text-white">Ko'p beriladigan savollar</h2>
          <p className="text-gray-600 dark:text-gray-400">Sizni qiziqtirgan savollarga javoblar</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="pr-4 dark:text-white">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-400 text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Boshqa savol bormi?</p>
          <button className="text-emerald-600 hover:underline">
            Bizga yozing →
          </button>
        </div>
      </div>
    </section>
  );
}
