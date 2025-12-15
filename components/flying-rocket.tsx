import { useEffect, useRef, useState, useCallback } from "react";
import { Rocket, Sparkles, Star, Zap } from "lucide-react";

interface FlyingRocketProps {
  onCatch: () => void;
}

export default function FlyingRocket({ onCatch }: FlyingRocketProps) {
  const [visible, setVisible] = useState(true);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; angle: number }>>([]);
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [missed, setMissed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [missCount, setMissCount] = useState(0);
  const [speedBoost, setSpeedBoost] = useState(false);

  const positionRef = useRef({ x: 50, y: 40 });
  const angleRef = useRef(0);
  const directionRef = useRef(Math.random() * 360);
  const speedRef = useRef(0.2);
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const particleIdRef = useRef(0);
  const starIdRef = useRef(0);
  const lastParticleTime = useRef(0);
  const rocketElementRef = useRef<HTMLDivElement>(null);
  const exhaustRef = useRef<HTMLDivElement>(null);

  const updateRocketPosition = useCallback(() => {
    if (rocketElementRef.current) {
      const { x, y } = positionRef.current;
      rocketElementRef.current.style.left = `${x}%`;
      rocketElementRef.current.style.top = `${y}%`;
      rocketElementRef.current.style.transform = `translate(-50%, -50%)`;

      const innerElement = rocketElementRef.current.querySelector('.rocket-inner') as HTMLElement;
      if (innerElement) {
        innerElement.style.transform = `rotate(${angleRef.current}deg)`;
      }

      if (exhaustRef.current) {
        const pulse = Math.sin(timeRef.current * 0.2) * 0.3 + 1;
        exhaustRef.current.style.transform = `translateX(-50%) rotate(${-angleRef.current}deg) translateY(18px) scale(${pulse})`;
      }
    }
  }, []);

  const createStarBurst = (x: number, y: number) => {
    const newStars = Array.from({ length: 6 }, (_, i) => ({
      id: starIdRef.current++,
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 4,
    }));
    setStars(prev => [...prev, ...newStars]);
    setTimeout(() => {
      setStars(prev => prev.filter(s => !newStars.find(ns => ns.id === s.id)));
    }, 800);
  };

  const animate = useCallback(() => {
    timeRef.current += 1;

    const wobbleX = Math.sin(timeRef.current * 0.04) * 4 + Math.cos(timeRef.current * 0.07) * 2;
    const wobbleY = Math.cos(timeRef.current * 0.035) * 4 + Math.sin(timeRef.current * 0.06) * 2;

    directionRef.current +=
      Math.sin(timeRef.current * 0.005) * 0.6 +
      Math.cos(timeRef.current * 0.008) * 0.4;

    const rad = (directionRef.current * Math.PI) / 180;
    const nx = positionRef.current.x + Math.cos(rad) * speedRef.current + wobbleX * 0.07;
    const ny = positionRef.current.y + Math.sin(rad) * speedRef.current + wobbleY * 0.07;

    let nextX = nx;
    let nextY = ny;

    if (nx < 8 || nx > 92) {
      directionRef.current = 180 - directionRef.current + (Math.random() - 0.5) * 20;
      speedRef.current = 0.2 + Math.random() * 0.04;
      nextX = Math.max(8, Math.min(nx, 92));
      createStarBurst(nextX, nextY);
    }
    if (ny < 8 || ny > 82) {
      directionRef.current = -directionRef.current + (Math.random() - 0.5) * 20;
      speedRef.current = 0.2 + Math.random() * 0.04;
      nextY = Math.max(8, Math.min(ny, 82));
      createStarBurst(nextX, nextY);
    }

    positionRef.current = { x: nextX, y: nextY };

    const targetAngle = directionRef.current;
    const angleDiff = targetAngle - angleRef.current;
    angleRef.current += angleDiff * 0.15;

    updateRocketPosition();

    if (timeRef.current - lastParticleTime.current > 3) {
      lastParticleTime.current = timeRef.current;
      setParticles((prev) => {
        const newParticle = {
          id: particleIdRef.current++,
          x: nextX + (Math.random() - 0.5) * 2,
          y: nextY + (Math.random() - 0.5) * 2,
          angle: angleRef.current + (Math.random() - 0.5) * 30
        };
        return [...prev.slice(-12), newParticle];
      });
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [updateRocketPosition]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    const tooltipTimer = setTimeout(() => setShowTooltip(true), 2000);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      clearTimeout(tooltipTimer);
    };
  }, [animate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => prev.slice(-8));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleCatch = () => {
    createStarBurst(positionRef.current.x, positionRef.current.y);
    setVisible(false);
    setTimeout(() => onCatch(), 400);
  };

  const handleMiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMissCount((prev) => prev + 1);
    setMissed(true);
    setShowTooltip(false);

    if ((missCount + 1) % 2 === 0) {
      speedRef.current = Math.min(speedRef.current + 0.05, 1.2);
      setSpeedBoost(true);
      setTimeout(() => setSpeedBoost(false), 2000);
    }

    directionRef.current += (Math.random() - 0.5) * 120;
    createStarBurst(positionRef.current.x, positionRef.current.y);

    setTimeout(() => {
      setMissed(false);
      setShowTooltip(true);
    }, 500);
  };

  if (!visible) return null;

  return (
    <>
      {particles.map((particle, index) => {
        const opacity = (index + 1) / particles.length;
        const scale = 0.3 + opacity * 0.7;
        return (
          <div
            key={particle.id}
            className="fixed pointer-events-none z-[99] will-change-transform"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: opacity * 0.5,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${particle.angle}deg)`,
              transition: 'opacity 0.6s ease-out, transform 0.4s ease-out',
            }}
          >
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 blur-[2px]"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-white/30 animate-ping" style={{ animationDuration: '1s' }}></div>
            </div>
          </div>
        );
      })}

      {stars.map((star) => (
        <div
          key={star.id}
          className="fixed pointer-events-none z-[99] animate-star-burst"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
        >
          <Sparkles className="w-3 h-3 text-yellow-300" />
        </div>
      ))}

      <div
        ref={rocketElementRef}
        className={`fixed z-[100] transition-all duration-300 ease-out will-change-transform ${missed ? 'scale-90 opacity-70' : 'scale-100'
          }`}
        style={{
          left: '50%',
          top: '40%',
        }}
      >
        <button
          onClick={handleCatch}
          onMouseDown={handleMiss}
          className="group cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200 relative"
          aria-label="Catch the flying rocket"
        >
          <div className="relative">
            <div className="absolute -inset-7 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-60 animate-spin-slow"></div>
            <div className="absolute -inset-5 rounded-full bg-gradient-to-r from-pink-500/15 via-blue-500/15 to-purple-500/15 blur-lg opacity-50 animate-spin-reverse"></div>
            <div className="absolute -inset-4 rounded-full bg-blue-500/10 animate-pulse-glow"></div>

            <div className="absolute -inset-6 animate-spin-slow">
              <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 text-blue-300 animate-twinkle" />
            </div>
            <div className="absolute -inset-6 animate-spin-reverse" style={{ animationDuration: '4s' }}>
              <Star className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 text-pink-300 animate-twinkle" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute -inset-6 animate-spin-slow" style={{ animationDuration: '5s' }}>
              <Zap className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-purple-300 animate-twinkle" style={{ animationDelay: '1s' }} />
            </div>

            <div className="rocket-inner relative p-3.5 rounded-full shadow-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-600 border-2 border-white/30 transition-all duration-150 overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-white/20 via-transparent to-transparent"></div>

              <div className="relative">
                <Rocket className="w-9 h-9 text-white relative z-10 drop-shadow-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" strokeWidth={2.5} />
              </div>

              <div
                ref={exhaustRef}
                className="absolute -bottom-0.5 left-1/2 w-4 h-6 pointer-events-none"
                style={{
                  transform: 'translateX(-50%) translateY(18px)',
                }}
              >
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-red-500 to-transparent rounded-full blur-sm opacity-70 animate-flame"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-orange-400 to-transparent rounded-full blur-[2px] opacity-60 animate-flame" style={{ animationDelay: '0.1s' }}></div>
                </div>
              </div>
            </div>

            {showTooltip && !missed && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap animate-float">
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-2 rounded-full shadow-2xl border-2 border-white/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                  <span className="relative text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                    Catch me!
                    <Star className="w-3.5 h-3.5 animate-pulse" />
                  </span>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-pink-600"></div>
                </div>
              </div>
            )}

            {missed && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap animate-miss-bounce">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                  Missed! 💨
                </div>
              </div>
            )}
          </div>
        </button>
      </div>

      {speedBoost && (
        <div className="fixed top-4 right-4 z-[100] animate-speed-enter">
          <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-4 py-2 rounded-full shadow-2xl border-2 border-white/30 animate-pulse-fast">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-shimmer"></div>
            <span className="relative text-white font-bold text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 animate-bounce" />
              SPEED BOOST!
              <Zap className="w-4 h-4 animate-bounce" style={{ animationDelay: '0.1s' }} />
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
        @keyframes flame {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.7; }
          50% { transform: scaleY(1.3) scaleX(0.9); opacity: 0.9; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes star-burst {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
        }
        @keyframes miss-bounce {
          0%, 100% { transform: translate(-50%, 0); }
          25% { transform: translate(-50%, -10px); }
          50% { transform: translate(-50%, 0); }
          75% { transform: translate(-50%, -5px); }
        }
        @keyframes speed-enter {
          0% { opacity: 0; transform: scale(0.5) translateY(-20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse-fast {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-spin-slow { animation: spin-slow 6s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 8s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-flame { animation: flame 0.3s ease-in-out infinite; }
        .animate-float { animation: float 2s ease-in-out infinite; }
        .animate-star-burst { animation: star-burst 0.8s ease-out forwards; }
        .animate-miss-bounce { animation: miss-bounce 0.6s ease-out; }
        .animate-speed-enter { animation: speed-enter 0.4s ease-out; }
        .animate-pulse-fast { animation: pulse-fast 0.6s ease-in-out infinite; }
      `}</style>
    </>
  );
}