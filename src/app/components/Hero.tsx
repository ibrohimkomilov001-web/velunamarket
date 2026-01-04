import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
  active: boolean;
}

interface HeroProps {
  onStartShopping: () => void;
  onViewCategories: () => void;
}

export function Hero({ onStartShopping, onViewCategories }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);

  // Load banners from localStorage
  useEffect(() => {
    const loadedBanners = localStorage.getItem('veluna_banners');
    if (loadedBanners) {
      const allBanners: Banner[] = JSON.parse(loadedBanners);
      // Only show active banners
      const activeBanners = allBanners.filter(b => b.active);
      setBanners(activeBanners);
    }
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  // If no active banners, show default message
  if (banners.length === 0) {
    return (
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-white mb-4">
              Reklama bannerlari yuklanmoqda...
            </h1>
            <p className="text-xl mb-8 text-emerald-50">
              Admin panel orqali bannerlar qo'shilishi kutilmoqda
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-gray-900">
      {/* Banner Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="min-w-full relative"
            onClick={() => banner.link && window.open(banner.link, '_blank')}
            style={{ cursor: banner.link ? 'pointer' : 'default' }}
          >
            <div className="relative h-[400px] md:h-[500px]">
              <img 
                src={banner.image} 
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
              
              {/* Banner Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                      {banner.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-6 text-white/90 drop-shadow-md">
                      {banner.subtitle}
                    </p>
                    {banner.link && (
                      <div className="inline-block px-6 py-3 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg">
                        Batafsil ko'rish
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-10 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-10 active:scale-95"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
