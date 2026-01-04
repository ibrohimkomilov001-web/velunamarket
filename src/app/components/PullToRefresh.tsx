import { useState, useRef, useEffect, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
}

export function PullToRefresh({ children, onRefresh, disabled = false }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const THRESHOLD = 80; // Pull distance needed to trigger refresh
  const MAX_PULL = 120;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only start if at the top of the page
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const distance = Math.min(currentY.current - startY.current, MAX_PULL);

      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault();
        setPullDistance(distance);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      if (pullDistance >= THRESHOLD && !isRefreshing) {
        setIsRefreshing(true);
        setPullDistance(THRESHOLD);

        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }

      setIsPulling(false);
      setPullDistance(0);
      startY.current = 0;
      currentY.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, isRefreshing, pullDistance, onRefresh, disabled]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const rotation = progress * 360;

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Pull indicator */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-center transition-all duration-200"
        style={{
          top: pullDistance > 0 ? Math.min(pullDistance - 40, 40) : -50,
          opacity: pullDistance > 10 ? 1 : 0,
        }}
      >
        <div
          className={`
            w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg 
            flex items-center justify-center border border-gray-200 dark:border-gray-700
            ${isRefreshing ? 'animate-spin' : ''}
          `}
          style={{
            transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
          }}
        >
          <RefreshCw 
            className={`w-5 h-5 ${
              pullDistance >= THRESHOLD 
                ? 'text-emerald-500' 
                : 'text-gray-400 dark:text-gray-500'
            }`} 
          />
        </div>
      </div>

      {/* Refreshing text */}
      {isRefreshing && (
        <div 
          className="fixed left-1/2 -translate-x-1/2 z-50 text-sm text-emerald-600 dark:text-emerald-400 font-medium"
          style={{ top: 60 }}
        >
          Yangilanmoqda...
        </div>
      )}

      {/* Content with pull effect */}
      <div
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance * 0.5}px)` : undefined,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
