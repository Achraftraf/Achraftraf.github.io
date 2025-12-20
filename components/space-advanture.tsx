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

interface SpaceAdventureGameProps {
  handleClose?: () => void;
}

export default function SpaceAdventureGame({ handleClose }: SpaceAdventureGameProps) {
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
  const isMouseActive = useRef(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const lastShootTime = useRef(0);
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

  const generateStar = useCallback((): GameItem => ({
    id: Math.random(),
    x: Math.random() * (gameWidth - 5),
    y: -5,
    speed: (1 + Math.random() * 0.5) * (slowMo ? 0.5 : 1),
  }), [slowMo]);

  const generateObstacle = useCallback((): GameItem => ({
    id: Math.random(),
    x: Math.random() * (gameWidth - 8),
    y: -5,
    speed: (1.5 + level * 0.2) * (slowMo ? 0.5 : 1),
  }), [level, slowMo]);

  const generateGem = useCallback((): GameItem => ({
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
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.02
        })).filter(p => p.life > 0)
      );

      setBullets(prev =>
        prev
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

      setGems(prev =>
        prev.filter(g => {
          const magnetRange = magnet ? 12 : 0;
          const hit =
            Math.abs(g.x - positionX) < playerSize + magnetRange &&
            Math.abs(g.y - positionY) < playerSize + magnetRange;
          if (hit) {
            setScore(s => s + 10 * (1 + combo));
            setCombo(c => c + 1);
            createParticles(g.x, g.y, "#3b82f6", 8);
          }
          return !hit;
        })
      );

      setPowerUps(prev =>
        prev.filter(p => {
          const hit =
            Math.abs(p.x - positionX) < playerSize + 3 &&
            Math.abs(p.y - positionY) < playerSize + 3;
          if (hit) {
            createParticles(p.x, p.y, "#8b5cf6", 12);
            if (p.type === "shield") {
              setShield(true);
              setTimeout(() => setShield(false), 5000);
            }
            if (p.type === "slowmo") {
              setSlowMo(true);
              setTimeout(() => setSlowMo(false), 3000);
            }
            if (p.type === "magnet") {
              setMagnet(true);
              setTimeout(() => setMagnet(false), 4000);
            }
          }
          return !hit;
        })
      );

      setObstacles(prev => {
        let hit = false;
        let destroyedIds = new Set<number>();

        bullets.forEach(bullet => {
          prev.forEach(o => {
            const bulletHit =
              Math.abs(bullet.x - o.x) < 4 &&
              Math.abs(bullet.y - o.y) < 4;
            if (bulletHit && !destroyedIds.has(o.id)) {
              destroyedIds.add(o.id);
              createParticles(o.x, o.y, "#fbbf24", 20);
              setScore(s => s + 50);
              setBullets(b => b.filter(bul => bul.id !== bullet.id));
            }
          });
        });

        prev.forEach(o => {
          const collision =
            Math.abs(o.x - positionX) < playerSize + 2 &&
            Math.abs(o.y - positionY) < playerSize + 2;
          if (collision && !hit && !destroyedIds.has(o.id)) {
            hit = true;
            destroyedIds.add(o.id);
            setCombo(0);
            createParticles(o.x, o.y, "#ef4444", 15);

            if (shield) {
              setShield(false);
            } else {
              setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) {
                  setGameOver(true);
                  if (score > highScore) setHighScore(score);
                }
                return newLives;
              });
              setShakeScreen(true);
              setTimeout(() => setShakeScreen(false), 200);
            }
          }
        });

        return prev.filter(o => !destroyedIds.has(o.id));
      });

      setScore(prev => {
        const newScore = prev + 1;
        if (newScore % 1000 === 0) setLevel(l => l + 1);
        return newScore;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [
    gameStarted,
    gameOver,
    positionX,
    positionY,
    level,
    combo,
    shield,
    magnet,
    slowMo,
    score,
    highScore,
    bullets,
    generateStar,
    generateObstacle,
    generateGem,
    generatePowerUp
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full max-w-5xl h-[90vh] sm:h-[85vh] bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-gray-900/80">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Space Adventure</h2>
          </div>
          {handleClose && (
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 rounded-full bg-gray-700/50 text-gray-400 hover:bg-gray-700/70 hover:text-white transition-all"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-2 sm:gap-4 px-3 sm:px-6 py-2 sm:py-3 bg-gray-800/50 border-b border-white/10 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            <span className="text-white font-bold">{score}</span>
          </div>
          <div className="text-gray-400">
            Best: <span className="text-indigo-400 font-semibold">{highScore}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Level</span>
            <span className="text-purple-400 font-bold">{level}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
            <span className="text-white">Lives</span>
            <div className="flex gap-0.5 ml-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            <span className="text-gray-400">Combo</span>
            <span className="text-yellow-400 font-bold">x{combo}</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-gray-400 text-xs hidden sm:inline">Power-Ups:</span>
            <div className="flex gap-1">
              {shield && <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />}
              {slowMo && <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />}
              {magnet && <Gem className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />}
              {!shield && !slowMo && !magnet && (
                <span className="text-gray-500 text-xs">None</span>
              )}
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative overflow-hidden">
          {!gameStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <Rocket className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-400 mb-4 animate-bounce" />
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Ready to Play?</h3>
              <div className="text-center text-gray-300 mb-6 sm:mb-8 space-y-2 text-xs sm:text-sm max-w-md">
                <p>
                  Control your ship using <span className="text-indigo-400 font-semibold">🖱 Mouse Movement</span>{' '}
                  <span className="text-gray-500">or</span>{' '}
                  <span className="text-purple-400 font-semibold">⬆ ⬇ ⬅ ➡ Arrow Keys</span>
                </p>
                <p className="text-gray-400">
                  <span className="text-blue-400 font-semibold">Click</span> or{' '}
                  <span className="text-blue-400 font-semibold">Spacebar</span> to Shoot
                </p>
              </div>
              <button
                onClick={startGame}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-indigo-500/50 hover:scale-105 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                Start Game
              </button>
            </div>
          ) : (
            <div
              ref={gameAreaRef}
              className={`relative w-full h-full bg-gradient-to-b from-black via-purple-950/20 to-black cursor-crosshair ${
                shakeScreen ? 'animate-shake' : ''
              }`}
              style={{ userSelect: 'none' }}
            >
              {/* Particles */}
              {particles.map(p => (
                <div
                  key={p.id}
                  className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full pointer-events-none"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    backgroundColor: p.color,
                    opacity: p.life,
                  }}
                />
              ))}

              {/* Stars */}
              {stars.map(s => (
                <Star
                  key={s.id}
                  className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 text-white opacity-70"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                />
              ))}

              {/* Gems */}
              {gems.map(g => (
                <Gem
                  key={g.id}
                  className="absolute w-4 h-4 sm:w-5 sm:h-5 text-blue-400 animate-pulse"
                  style={{ left: `${g.x}%`, top: `${g.y}%` }}
                />
              ))}

              {/* Bullets */}
              {bullets.map(b => (
                <div
                  key={b.id}
                  className="absolute w-1 h-3 sm:w-1.5 sm:h-4 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"
                  style={{ left: `${b.x}%`, top: `${b.y}%` }}
                />
              ))}

              {/* Power-ups */}
              {powerUps.map(p => (
                <div
                  key={p.id}
                  className="absolute w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center animate-pulse"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  {p.type === "shield" && (
                    <Shield className="w-full h-full text-blue-400" />
                  )}
                  {p.type === "slowmo" && (
                    <Zap className="w-full h-full text-purple-400" />
                  )}
                  {p.type === "magnet" && (
                    <Gem className="w-full h-full text-green-400" />
                  )}
                </div>
              ))}

              {/* Obstacles */}
              {obstacles.map(o => (
                <Flame
                  key={o.id}
                  className="absolute w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse"
                  style={{ left: `${o.x}%`, top: `${o.y}%` }}
                />
              ))}

              {/* Player */}
              <div
                className="absolute transition-all duration-75"
                style={{
                  left: `${positionX}%`,
                  top: `${positionY}%`,
                  width: `${playerSize}%`,
                  height: `${playerSize}%`,
                }}
              >
                {shield && (
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping" />
                )}
                <Rocket className="w-full h-full text-indigo-400 drop-shadow-lg transform rotate-0" />
              </div>

              {/* Game Over Overlay */}
              {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                  <div className="bg-gray-900/95 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-sm mx-4 text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Game Over</h3>
                    <div className="space-y-2 mb-4 sm:mb-6">
                      <p className="text-gray-300">
                        Score: <span className="text-yellow-400 font-bold text-lg sm:text-xl">{score}</span>
                      </p>
                      <p className="text-gray-300">
                        Level: <span className="text-purple-400 font-bold">{level}</span>
                      </p>
                      {score === highScore && score > 0 && (
                        <div className="mt-3 sm:mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <p className="text-yellow-400 font-bold text-sm sm:text-base">🏆 NEW HIGH SCORE! 🏆</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={startGame}
                      className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                      Play Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls Help */}
        {gameStarted && !gameOver && (
          <div className="px-3 sm:px-6 py-2 bg-gray-800/50 border-t border-white/10 text-center text-[10px] sm:text-xs text-gray-400">
            Use <span className="text-purple-400 font-semibold">Arrow Keys</span>{' '}
            <span className="text-gray-600">or</span>{' '}
            <span className="text-indigo-400 font-semibold">Mouse</span> to control{' '}
            <span className="text-gray-600">•</span>{' '}
            <span className="text-blue-400 font-semibold">Spacebar/Click</span> to shoot
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}