import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Animation sequence
    const timer1 = setTimeout(() => setShowLogo(true), 500);
    const timer2 = setTimeout(() => setShowText(true), 1200);
    const timer3 = setTimeout(() => setFadeOut(true), 3000);
    const timer4 = setTimeout(onAnimationComplete, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onAnimationComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 bg-gradient-to-br from-primary-500 via-accent-600 to-primary-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        {/* Animated Logo Circle */}
        <div className={`relative mb-8 transition-all duration-1000 ${
          showLogo ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}>
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-spin"></div>
            {/* Inner pulsing circle */}
            <div className="absolute inset-2 bg-white/20 rounded-full animate-pulse"></div>
            {/* Center logo */}
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-2xl font-bold text-transparent bg-gradient-to-br from-primary-600 to-accent-600 bg-clip-text font-caveat">
                K
              </span>
            </div>
          </div>
        </div>

        {/* Animated Text */}
        <div className={`transition-all duration-1000 delay-300 ${
          showText ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-wider font-caveat">
            <span className="inline-block animate-bounce delay-0">K</span>
            <span className="inline-block animate-bounce delay-100">n</span>
            <span className="inline-block animate-bounce delay-200">o</span>
            <span className="inline-block animate-bounce delay-300">t</span>
            <span className="inline-block animate-bounce delay-500">a</span>
            <span className="inline-block animate-bounce delay-700">r</span>
            <span className="inline-block animate-bounce delay-1000">a</span>
          </h1>
          <p className="text-xl text-white/90 font-light tracking-wide animate-fade-in font-inter">
            Crafting Elegance, One Accessory at a Time
          </p>
        </div>

        {/* Loading indicator */}
        <div className={`mt-12 transition-all duration-500 ${
          showText ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="w-16 h-1 bg-white/30 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
