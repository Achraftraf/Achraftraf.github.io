import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Rocket, Star, Gem, Zap, Play, X, Trophy, Heart, Shield, Flame } from 'lucide-react';

type GameItem = {
  id: number;
  x: number;
  y: number;
  speed: number;
};

type PowerUp = GameItem & {
  type: 'shield' | 'slowmo' | 'magnet';
};

type Bullet = {
  id: number;
  x: number;
  y: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
};

export default function SpaceAdventureGame() {
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(80);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [stars, setStars] = useState<GameItem[]>([]);
  const [obstacles, setObstacles] = useState<GameItem[]>([]);
  const [gems, setGems] = useState<GameItem[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [shield, setShield] = useState(false);
  const [slowMo, setSlowMo] = useState(false);
  const [magnet, setMagnet] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);

  const keysPressed = useRef<Set<string>>(new Set());
  const mousePosition = useRef<{ x: number; y: number } | null>(null);
  const isMouseActive = useRef<boolean>(false);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const lastShootTime = useRef<number>(0);
  const shootCooldown = 200;

  const gameWidth = 100;
  const gameHeight = 100;
  const playerSize = 6;
  const moveSpeed = 1.7;
  const mouseSmoothing = 0.2;

  const createParticles = (x: number, y: number, color: string, count: number = 10) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        color,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const shootBullet = useCallback(() => {
    const now = Date.now();
    if (now - lastShootTime.current < shootCooldown) return;
    
    lastShootTime.current = now;
    setBullets(prev => [...prev, {
      id: Math.random(),
      x: positionX + playerSize / 2 - 0.5,
      y: positionY - 2
    }]);
    createParticles(positionX + playerSize / 2, positionY, "#60a5fa", 5);
  }, [positionX, positionY]);

  const generateStar = useCallback(() => ({
    id: Math.random(),
    x: Math.random() * (gameWidth - 5),
    y: -5,
    speed: (1 + Math.random() * 0.5) * (slowMo ? 0.5 : 1),
  }), [slowMo]);

  const generateObstacle = useCallback(() => ({
    id: Math.random(),
    x: Math.random() * (gameWidth - 8),
    y: -5,
    speed: (1.5 + level * 0.2) * (slowMo ? 0.5 : 1),
  }), [level, slowMo]);

  const generateGem = useCallback(() => ({
    id: Math.random(),
    x: Math.random() * (gameWidth - 5),
    y: -5,
    speed: (1.2 + level * 0.1) * (slowMo ? 0.5 : 1),
  }), [level, slowMo]);

  const generatePowerUp = useCallback((): PowerUp => {
    const types: ('shield' | 'slowmo' | 'magnet')[] = ['shield', 'slowmo', 'magnet'];
    return {
      id: Math.random(),
      x: Math.random() * (gameWidth - 6),
      y: -5,
      speed: 1 * (slowMo ? 0.5 : 1),
      type: types[Math.floor(Math.random() * types.length)],
    };
  }, [slowMo]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["arrowleft", "arrowright", "arrowup", "arrowdown"].includes(key)) {
        e.preventDefault();
        keysPressed.current.add(key);
        isMouseActive.current = false;
      }
      if (key === " " || key === "spacebar") {
        e.preventDefault();
        shootBullet();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStarted, gameOver, shootBullet]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
      
      isMouseActive.current = true;
      mousePosition.current = { 
        x: Math.max(2, Math.min(gameWidth - playerSize - 2, mouseX - playerSize / 2)), 
        y: Math.max(2, Math.min(gameHeight - playerSize - 2, mouseY - playerSize / 2))
      };
    };

    const onMouseLeave = () => {
      mousePosition.current = null;
      isMouseActive.current = false;
    };

    const onClick = () => {
      shootBullet();
    };

    const gameArea = gameAreaRef.current;
    if (gameArea) {
      gameArea.addEventListener("mousemove", onMouseMove);
      gameArea.addEventListener("mouseleave", onMouseLeave);
      gameArea.addEventListener("click", onClick);
      return () => {
        gameArea.removeEventListener("mousemove", onMouseMove);
        gameArea.removeEventListener("mouseleave", onMouseLeave);
        gameArea.removeEventListener("click", onClick);
      };
    }
  }, [gameStarted, gameOver, shootBullet]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setPositionX(prev => {
        if (!isMouseActive.current && keysPressed.current.size > 0) {
          let x = prev;
          if (keysPressed.current.has("arrowleft")) x = Math.max(2, prev - moveSpeed);
          if (keysPressed.current.has("arrowright")) x = Math.min(gameWidth - playerSize - 2, prev + moveSpeed);
          return x;
        }
        
        if (isMouseActive.current && mousePosition.current !== null) {
          return prev + (mousePosition.current.x - prev) * mouseSmoothing;
        }
        
        return prev;
      });

      setPositionY(prev => {
        if (!isMouseActive.current && keysPressed.current.size > 0) {
          let y = prev;
          if (keysPressed.current.has("arrowup")) y = Math.max(2, prev - moveSpeed);
          if (keysPressed.current.has("arrowdown")) y = Math.min(gameHeight - playerSize - 2, prev + moveSpeed);
          return y;
        }
        
        if (isMouseActive.current && mousePosition.current !== null) {
          return prev + (mousePosition.current.y - prev) * mouseSmoothing;
        }
        
        return prev;
      });

      setParticles(prev =>
        prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.02 }))
            .filter(p => p.life > 0)
      );

      setBullets(prev => prev
        .map(b => ({ ...b, y: b.y - 3 }))
        .filter(b => b.y > -5)
      );

      setStars(prev => {
        const updated = prev.map(s => ({ ...s, y: s.y + s.speed })).filter(s => s.y < 105);
        if (Math.random() < 0.3) updated.push(generateStar());
        return updated;
      });

      setObstacles(prev => {
        const updated = prev.map(o => ({ ...o, y: o.y + o.speed })).filter(o => o.y < 105);
        if (Math.random() < 0.015 + level * 0.008) updated.push(generateObstacle());
        return updated;
      });

      setGems(prev => {
        const updated = prev.map(g => ({ ...g, y: g.y + g.speed })).filter(g => g.y < 105);
        if (Math.random() < 0.03) updated.push(generateGem());
        return updated;
      });

      setPowerUps(prev => {
        const updated = prev.map(p => ({ ...p, y: p.y + p.speed })).filter(p => p.y < 105);
        if (Math.random() < 0.005) updated.push(generatePowerUp());
        return updated;
      });

      setGems(prev => prev.filter(g => {
        const magnetRange = magnet ? 12 : 0;
        const hit = Math.abs(g.x - positionX) < playerSize + magnetRange &&
                    Math.abs(g.y - positionY) < playerSize + magnetRange;

        if (hit) {
          setScore(s => s + 10 * (1 + combo));
          setCombo(c => c + 1);
          createParticles(g.x, g.y, "#3b82f6", 8);
        }
        return !hit;
      }));

      setPowerUps(prev => prev.filter(p => {
        const hit = Math.abs(p.x - positionX) < playerSize + 3 &&
                    Math.abs(p.y - positionY) < playerSize + 3;

        if (hit) {
          createParticles(p.x, p.y, "#8b5cf6", 12);
          if (p.type === "shield") setShield(true), setTimeout(() => setShield(false), 5000);
          if (p.type === "slowmo") setSlowMo(true), setTimeout(() => setSlowMo(false), 3000);
          if (p.type === "magnet") setMagnet(true), setTimeout(() => setMagnet(false), 4000);
        }

        return !hit;
      }));

      setObstacles(prev => {
        let hit = false;
        let destroyedIds = new Set<number>();

        bullets.forEach(bullet => {
          prev.forEach(o => {
            const bulletHit = Math.abs(bullet.x - o.x) < 4 && Math.abs(bullet.y - o.y) < 4;
            if (bulletHit && !destroyedIds.has(o.id)) {
              destroyedIds.add(o.id);
              createParticles(o.x, o.y, "#fbbf24", 20);
              setScore(s => s + 50);
              setBullets(b => b.filter(bul => bul.id !== bullet.id));
            }
          });
        });

        prev.forEach(o => {
          const c = Math.abs(o.x - positionX) < playerSize + 2 &&
                    Math.abs(o.y - positionY) < playerSize + 2;

          if (c && !hit && !destroyedIds.has(o.id)) {
            hit = true;
            destroyedIds.add(o.id);
            setCombo(0);
            createParticles(o.x, o.y, "#ef4444", 15);

            if (shield) {
              setShield(false);
            } else {
              setLives(l => {
                const nl = l - 1;
                if (nl <= 0) {
                  setGameOver(true);
                  if (score > highScore) setHighScore(score);
                }
                return nl;
              });

              setShakeScreen(true);
              setTimeout(() => setShakeScreen(false), 200);
            }
          }
        });

        return prev.filter(o => !destroyedIds.has(o.id));
      });

      setScore(prev => {
        const n = prev + 1;
        if (n % 1000 === 0) setLevel(l => l + 1);
        return n;
      });

    }, 30);

    return () => clearInterval(interval);
  }, [
    gameStarted, gameOver, positionX, positionY, level, combo,
    shield, magnet, slowMo, score, highScore, bullets,
    generateStar, generateObstacle, generateGem, generatePowerUp
  ]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPositionX(50);
    setPositionY(80);
    setStars([]);
    setObstacles([]);
    setGems([]);
    setPowerUps([]);
    setBullets([]);
    setParticles([]);
    setLevel(1);
    setLives(3);
    setCombo(0);
    setShield(false);
    setSlowMo(false);
    setMagnet(false);
    keysPressed.current.clear();
    mousePosition.current = null;
    isMouseActive.current = false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden select-none">
      
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
                  <Rocket className="w-10 h-10 text-blue-600 relative" />
                </div>
                Space Adventure
              </h1>
              <p className="text-gray-500 text-sm mt-1 font-medium">
                Arrow Keys + Mouse Control
              </p>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-1">
                {score}
              </div>
              <div className="text-gray-500 text-xs font-medium">Best: {highScore}</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <div className="text-gray-500 text-xs mb-1 font-medium">Level</div>
              <div className="text-2xl font-bold text-gray-900">{level}</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <div className="text-gray-500 text-xs mb-1 flex items-center gap-1 font-medium">
                <Heart className="w-3 h-3" /> Lives
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 transition-all duration-300 ${
                      i < lives ? "text-red-500 fill-red-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <div className="text-gray-500 text-xs mb-1 flex items-center gap-1 font-medium">
                <Flame className="w-3 h-3 text-orange-500" /> Combo
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                x{combo}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <div className="text-gray-500 text-xs mb-1 font-medium">Power-Ups</div>
              <div className="flex gap-2">
                {shield && <Shield className="w-5 h-5 text-blue-500 fill-blue-500" />}
                {slowMo && <Zap className="w-5 h-5 text-yellow-500" />}
                {magnet && <Gem className="w-5 h-5 text-purple-500" />}
                {!shield && !slowMo && !magnet && (
                  <span className="text-gray-400 text-xs">None</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          {!gameStarted ? (
            <div className="bg-gradient-to-b from-slate-50 via-white to-gray-50 p-16 text-center" style={{ height: "600px" }}>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-violet-500/30 rounded-full blur-3xl"></div>
                  <Rocket className="w-32 h-32 text-blue-600 relative" />
                </div>
                
                <h2 className="text-5xl text-gray-900 font-bold mb-4">Ready to Play?</h2>

                <p className="text-gray-600 mb-8 max-w-md mx-auto font-medium leading-relaxed">
                  Control your ship using
                  <br />
                  <strong className="text-blue-600">🖱 Mouse Movement</strong>
                  {' or '}
                  <strong className="text-violet-600">⬆ ⬇ ⬅ ➡ Arrow Keys</strong>
                  <br />
                  <strong className="text-orange-600">Click or Spacebar to Shoot</strong>
                </p>

                <button
                  onClick={startGame}
                  className="group bg-gradient-to-r from-blue-600 to-violet-600 text-white px-12 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Play className="inline w-6 h-6 mr-2 group-hover:translate-x-1 transition-transform" />
                  Start Game
                </button>
              </div>
            </div>
          ) : (
            <div
              ref={gameAreaRef}
              className={`relative bg-gradient-to-b from-slate-50 via-white to-gray-50 overflow-hidden select-none ${
                shakeScreen ? "animate-shake" : ""
              }`}
              style={{ height: "600px", userSelect: 'none', WebkitUserSelect: 'none' }}
            >

              {particles.map(p => (
                <div
                  key={p.id}
                  className="absolute rounded-full"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: "8px",
                    height: "8px",
                    backgroundColor: p.color,
                    opacity: p.life * 0.8,
                    boxShadow: `0 0 16px ${p.color}`,
                  }}
                />
              ))}

              {stars.map(s => (
                <Star
                  key={s.id}
                  className="absolute text-gray-300 fill-gray-300"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: "12px",
                    height: "12px",
                  }}
                />
              ))}

              {gems.map(g => (
                <Gem
                  key={g.id}
                  className="absolute text-blue-500"
                  style={{
                    left: `${g.x}%`,
                    top: `${g.y}%`,
                    width: "28px",
                    height: "28px",
                    filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
                  }}
                />
              ))}

              {bullets.map(b => (
                <div
                  key={b.id}
                  className="absolute bg-blue-400 rounded-full"
                  style={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: "8px",
                    height: "16px",
                    boxShadow: '0 0 12px rgba(96, 165, 250, 0.8)',
                  }}
                />
              ))}

              {powerUps.map(p => (
                <div
                  key={p.id}
                  className="absolute"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: "32px",
                    height: "32px",
                  }}
                >
                  {p.type === "shield" && (
                    <Shield className="w-8 h-8 text-blue-500" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }} />
                  )}
                  {p.type === "slowmo" && (
                    <Zap className="w-8 h-8 text-yellow-500" style={{ filter: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.5))' }} />
                  )}
                  {p.type === "magnet" && (
                    <Trophy className="w-8 h-8 text-purple-500" style={{ filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))' }} />
                  )}
                </div>
              ))}

              {obstacles.map(o => (
                <Zap
                  key={o.id}
                  className="absolute text-red-500 fill-red-500"
                  style={{
                    left: `${o.x}%`,
                    top: `${o.y}%`,
                    width: "36px",
                    height: "36px",
                    filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))',
                  }}
                />
              ))}

              <div
                className="absolute transition-all duration-75"
                style={{
                  left: `${positionX}%`,
                  top: `${positionY}%`,
                  width: "52px",
                  height: "52px",
                }}
              >
                {shield && (
                  <div 
                    className="absolute rounded-full border-4 border-blue-500 opacity-60"
                    style={{ width: "70px", height: "70px", left: "-9px", top: "-9px" }}
                  />
                )}

                <Rocket
                  className="absolute text-blue-600"
                  style={{
                    width: "52px",
                    height: "52px",
                    transform: "rotate(-45deg)",
                    filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))",
                  }}
                />
              </div>

              {gameOver && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center bg-white p-12 rounded-3xl border-2 border-gray-200 shadow-2xl">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-2xl"></div>
                      <Trophy className="w-24 h-24 text-yellow-500 mx-auto relative" />
                    </div>
                    
                    <h3 className="text-6xl font-bold text-gray-900 mb-4">Game Over</h3>

                    <p className="text-blue-600 text-3xl font-bold mb-2">Score: {score}</p>
                    <p className="text-gray-600 text-xl mb-4 font-medium">Level: {level}</p>

                    {score === highScore && score > 0 && (
                      <p className="text-yellow-600 font-bold mb-4">🏆 NEW HIGH SCORE! 🏆</p>
                    )}

                    <button
                      onClick={startGame}
                      className="mt-6 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      Play Again
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {gameStarted && !gameOver && (
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-t border-gray-200 p-4 text-center select-none">
            <p className="text-gray-600 text-sm font-medium select-none">
              Use <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-semibold">Arrow Keys</span>  
              {' or '}
              <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded font-semibold">Mouse</span> to control
              {' • '}
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded font-semibold">Spacebar/Click</span> to shoot
            </p>
          </div>
        )}

      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(2px, -2px); }
          75% { transform: translate(-2px, -2px); }
        }
        
        .animate-shake {
          animation: shake 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}