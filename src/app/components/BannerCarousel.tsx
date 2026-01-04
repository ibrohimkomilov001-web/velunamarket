import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
  active: boolean;
  order: number;
}

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    // Load banners from localStorage
    const savedBanners = localStorage.getItem('veluna_banners');
    if (savedBanners) {
      const allBanners: Banner[] = JSON.parse(savedBanners);
      // Filter only active banners and sort by order
      const activeBanners = allBanners.filter(b => b.active).sort((a, b) => a.order - b.order);
      setBanners(activeBanners);
    } else {
      // Default banners
      const defaultBanners: Banner[] = [
        { 
          id: 1, 
          title: 'Yangi yil aksiyasi', 
          subtitle: '50% gacha chegirma', 
          image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop', 
          active: true, 
          order: 1 
        },
        { 
          id: 2, 
          title: 'Smartfonlar', 
          subtitle: 'Eng yangi modellar', 
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=500&fit=crop', 
          active: true, 
          order: 2 
        },
        { 
          id: 3, 
          title: 'Kiyim-kechak', 
          subtitle: 'Moda va stil', 
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop', 
          active: true, 
          order: 3 
        },
      ];
      setBanners(defaultBanners);
      localStorage.setItem('veluna_banners', JSON.stringify(defaultBanners));
    }
  }, []);

  // Update banners when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedBanners = localStorage.getItem('veluna_banners');
      if (savedBanners) {
        const allBanners: Banner[] = JSON.parse(savedBanners);
        const activeBanners = allBanners.filter(b => b.active).sort((a, b) => a.order - b.order);
        setBanners(activeBanners);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen to custom event for same-tab updates
    window.addEventListener('bannersUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bannersUpdated', handleStorageChange);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    rtl: false, // O'ngdan chapga aylanish uchun
    fade: false,
    cssEase: 'ease-in-out',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        }
      }
    ]
  };

  if (banners.length === 0) {
    return (
      <div className="w-full h-64 md:h-96 bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center">
        <p className="text-white text-xl">Bannerlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="w-full banner-carousel-container">
      <style>
        {`
          .banner-carousel-container .slick-slider {
            position: relative;
          }
          
          .banner-carousel-container .slick-list {
            overflow: hidden;
          }
          
          .banner-carousel-container .slick-track {
            display: flex;
          }
          
          .banner-carousel-container .slick-slide {
            height: auto;
          }
          
          .banner-carousel-container .slick-slide > div {
            height: 100%;
          }
          
          .banner-carousel-container .slick-prev,
          .banner-carousel-container .slick-next {
            z-index: 10;
            width: 40px;
            height: 40px;
          }
          
          .banner-carousel-container .slick-prev {
            left: 20px;
          }
          
          .banner-carousel-container .slick-next {
            right: 20px;
          }
          
          .banner-carousel-container .slick-prev:before,
          .banner-carousel-container .slick-next:before {
            font-size: 40px;
            opacity: 0.8;
          }
          
          .banner-carousel-container .slick-prev:hover:before,
          .banner-carousel-container .slick-next:hover:before {
            opacity: 1;
          }
          
          .banner-carousel-container .slick-dots {
            bottom: 20px;
          }
          
          .banner-carousel-container .slick-dots li button:before {
            font-size: 12px;
            color: white;
            opacity: 0.5;
          }
          
          .banner-carousel-container .slick-dots li.slick-active button:before {
            color: white;
            opacity: 1;
          }
          
          @media (max-width: 768px) {
            .banner-carousel-container .slick-prev,
            .banner-carousel-container .slick-next {
              display: none !important;
            }
          }
        `}
      </style>
      
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <div className="relative w-full h-64 md:h-96 lg:h-[500px]">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="container mx-auto px-4 md:px-8">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg">
                      {banner.title}
                    </h2>
                    <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-6 drop-shadow-lg">
                      {banner.subtitle}
                    </p>
                    {banner.link && (
                      <a
                        href={banner.link}
                        className="inline-block bg-white text-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors font-medium shadow-lg"
                      >
                        Ko'rish
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
