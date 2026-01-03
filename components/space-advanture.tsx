"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Star, Heart, Zap, Shield, Target, Flame, Sparkles } from 'lucide-react';

type GameItem = { id: number; x: number; y: number; speed: number; size: number; };
type Enemy = { id: number; x: number; y: number; speed: number; size: number; type: 'basic' | 'fast' | 'tank' | 'boss'; hp: number; maxHp: number; };
type Bullet = { id: number; x: number; y: number; damage: number; };
type PowerUp = { id: number; x: number; y: number; type: 'shield' | 'rapidfire' | 'multishot' | 'score2x'; speed: number; };
type Particle = { id: number; x: number; y: number; vx: number; vy: number; life: number; color: string; size: number; };

export default function SpaceAdventureGame({ handleClose }: { handleClose?: () => void }) {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const [shake, setShake] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(true);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [hasShield, setHasShield] = useState(false);
  const [rapidFire, setRapidFire] = useState(false);
  const [multiShot, setMultiShot] = useState(false);
  const [scoreMultiplier, setScoreMultiplier] = useState(1);
  const [wave, setWave] = useState(1);

  const player = useRef({ x: 50, y: 80, targetX: 50, targetY: 80, rot: 0 });
  const entities = useRef({
    stars: [] as GameItem[],
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    powerUps: [] as PowerUp[],
    particles: [] as Particle[],
    nebula: [] as GameItem[],
    lastTime: 0,
    lastShot: 0,
    difficulty: 1
  });

  const requestRef = useRef<number | undefined>(undefined);
  const gameArea = useRef<HTMLDivElement>(null);
  const keys = useRef<Set<string>>(new Set());
  const [, setTick] = useState(0);
  const comboTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpening(false), 800);
    // Initialize nebula background
    for (let i = 0; i < 6; i++) {
      entities.current.nebula.push({
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.03 + Math.random() * 0.08,
        size: 100 + Math.random() * 150
      });
    }
    return () => clearTimeout(timer);
  }, []);

  const createFX = (x: number, y: number, color: string, n = 20, speed = 4) => {
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 0.5 + Math.random() * speed;
      entities.current.particles.push({
        id: Math.random(), x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 1.0, color,
        size: 1.5 + Math.random() * 4
      });
    }
  };

  const addCombo = () => {
    setCombo(c => {
      const newCombo = c + 1;
      setMaxCombo(mc => Math.max(mc, newCombo));
      return newCombo;
    });

    if (comboTimeout.current) clearTimeout(comboTimeout.current);
    comboTimeout.current = setTimeout(() => setCombo(0), 2000);
  };

  const spawnEnemy = () => {
    const diff = entities.current.difficulty;
    const rand = Math.random();
    let type: Enemy['type'] = 'basic';
    let hp = 1;
    let size = 28;
    let speed = 0.9 + Math.random() * 0.6;

    // Boss every 2000 points
    if (score > 0 && score % 2000 === 0 && entities.current.enemies.filter(e => e.type === 'boss').length === 0) {
      type = 'boss';
      hp = 15 + wave * 5;
      size = 70;
      speed = 0.5;
    } else if (rand < 0.12 * diff) {
      type = 'tank';
      hp = 3;
      size = 38;
      speed = 0.6;
    } else if (rand < 0.3 * diff) {
      type = 'fast';
      hp = 1;
      size = 22;
      speed = 1.6 + Math.random();
    }

    entities.current.enemies.push({
      id: Math.random(),
      x: Math.random() * 100,
      y: -5,
      speed,
      size,
      type,
      hp,
      maxHp: hp
    });
  };

  const spawnPowerUp = (x: number, y: number) => {
    if (Math.random() < 0.35) {
      const types: PowerUp['type'][] = ['shield', 'rapidfire', 'multishot', 'score2x'];
      entities.current.powerUps.push({
        id: Math.random(),
        x, y,
        type: types[Math.floor(Math.random() * types.length)],
        speed: 0.6
      });
    }
  };

  const activatePowerUp = (type: PowerUp['type']) => {
    createFX(player.current.x, player.current.y, '#fbbf24', 35, 6);

    switch (type) {
      case 'shield':
        setHasShield(true);
        setTimeout(() => setHasShield(false), 10000);
        break;
      case 'rapidfire':
        setRapidFire(true);
        setTimeout(() => setRapidFire(false), 12000);
        break;
      case 'multishot':
        setMultiShot(true);
        setTimeout(() => setMultiShot(false), 15000);
        break;
      case 'score2x':
        setScoreMultiplier(2);
        setTimeout(() => setScoreMultiplier(1), 18000);
        break;
    }
  };

  const shootBullet = () => {
    const now = Date.now();
    const fireRate = rapidFire ? 80 : 220;

    if (now - entities.current.lastShot < fireRate) return;
    entities.current.lastShot = now;

    const damage = multiShot ? 2 : 1;

    if (multiShot) {
      entities.current.bullets.push(
        { id: Math.random(), x: player.current.x - 4, y: player.current.y - 5, damage },
        { id: Math.random(), x: player.current.x, y: player.current.y - 5, damage },
        { id: Math.random(), x: player.current.x + 4, y: player.current.y - 5, damage }
      );
    } else {
      entities.current.bullets.push({ id: Math.random(), x: player.current.x, y: player.current.y - 5, damage });
    }

    createFX(player.current.x, player.current.y - 5, '#22d3ee', 6, 2);
  };

  const update = useCallback((time: number) => {
    const dt = entities.current.lastTime ? (time - entities.current.lastTime) / 16.67 : 1;
    entities.current.lastTime = time;

    // Difficulty scaling
    entities.current.difficulty = 1 + Math.floor(score / 1000) * 0.25;

    const moveSpeed = 1.6;
    if (keys.current.has("arrowleft") || keys.current.has("a")) player.current.targetX -= moveSpeed * dt;
    if (keys.current.has("arrowright") || keys.current.has("d")) player.current.targetX += moveSpeed * dt;
    if (keys.current.has("arrowup") || keys.current.has("w")) player.current.targetY -= moveSpeed * dt;
    if (keys.current.has("arrowdown") || keys.current.has("s")) player.current.targetY += moveSpeed * dt;
    if (keys.current.has(" ")) shootBullet();

    player.current.targetX = Math.max(8, Math.min(92, player.current.targetX));
    player.current.targetY = Math.max(12, Math.min(88, player.current.targetY));

    const prevX = player.current.x;
    player.current.x += (player.current.targetX - player.current.x) * 0.2 * dt;
    player.current.y += (player.current.targetY - player.current.y) * 0.2 * dt;
    player.current.rot = (player.current.x - prevX) * 12;

    const state = entities.current;

    // Update entities
    state.nebula.forEach(n => { n.y += n.speed * dt; if (n.y > 110) n.y = -10; });
    state.stars.forEach(s => s.y += s.speed * dt);
    state.enemies.forEach(e => {
      e.y += e.speed * dt;
      if (e.type === 'boss') {
        e.x += Math.sin(e.y * 0.04) * 0.4 * dt;
      } else if (e.type === 'fast') {
        e.x += Math.sin(time * 0.003) * 0.3 * dt;
      }
    });
    state.bullets.forEach(b => b.y -= 6.5 * dt);
    state.powerUps.forEach(p => p.y += p.speed * dt);
    state.particles.forEach(p => {
      p.x += p.vx * 0.3 * dt;
      p.y += p.vy * 0.3 * dt;
      p.life -= 0.018 * dt;
    });

    // Spawn stars
    if (Math.random() < 0.3) {
      state.stars.push({
        id: Math.random(),
        x: Math.random() * 100,
        y: -5,
        speed: 0.6 + Math.random() * 2.8,
        size: 0.8 + Math.random() * 2.2
      });
    }

    // Spawn enemies
    const spawnChance = 0.018 + entities.current.difficulty * 0.006;
    if (Math.random() < spawnChance) spawnEnemy();

    // Collision: Player vs Enemies
    state.enemies = state.enemies.filter(e => {
      if (Math.hypot(player.current.x - e.x, player.current.y - e.y) < (e.size + 24) / 3.5) {
        if (hasShield) {
          setHasShield(false);
          createFX(e.x, e.y, '#3b82f6', 30, 5);
          setScore(s => s + 15 * scoreMultiplier);
          return false;
        } else {
          setLives(l => {
            if (l <= 1) setGameOver(true);
            return l - 1;
          });
          setShake(s => s + 1);
          setTimeout(() => setShake(s => Math.max(0, s - 1)), 250);
          createFX(e.x, e.y, '#ff4d4d', 35, 6);
          setCombo(0);
          return false;
        }
      }
      return e.y < 110;
    });

    // Collision: Bullets vs Enemies
    state.bullets = state.bullets.filter(b => {
      let hit = false;
      state.enemies = state.enemies.filter(e => {
        if (Math.hypot(b.x - e.x, b.y - e.y) < e.size / 2 + 4) {
          hit = true;
          e.hp -= b.damage;

          if (e.hp <= 0) {
            const points = e.type === 'boss' ? 500 : e.type === 'tank' ? 100 : e.type === 'fast' ? 75 : 50;
            setScore(s => s + points * scoreMultiplier);
            addCombo();
            createFX(e.x, e.y, e.type === 'boss' ? '#fbbf24' : e.type === 'tank' ? '#fb923c' : '#22d3ee', e.type === 'boss' ? 60 : 30, e.type === 'boss' ? 8 : 5);
            if (e.type === 'boss') {
              setWave(w => w + 1);
              spawnPowerUp(e.x, e.y);
            } else if (Math.random() < 0.18) {
              spawnPowerUp(e.x, e.y);
            }
            return false;
          } else {
            createFX(e.x, e.y, '#fb923c', 10, 3);
          }
        }
        return true;
      });
      return !hit && b.y > -5;
    });

    // Collision: Player vs PowerUps
    state.powerUps = state.powerUps.filter(p => {
      if (Math.hypot(player.current.x - p.x, player.current.y - p.y) < 18) {
        activatePowerUp(p.type);
        return false;
      }
      return p.y < 110;
    });

    state.stars = state.stars.filter(s => s.y < 110);
    state.particles = state.particles.filter(p => p.life > 0);

    setTick(t => t + 1);
    requestRef.current = requestAnimationFrame(update);
  }, [hasShield, rapidFire, multiShot, scoreMultiplier, score, wave]);

  useEffect(() => {
    if (gameStarted && !gameOver && !isOpening) {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameStarted, gameOver, isOpening, update]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const handleCloseClick = () => {
    setIsClosing(true);
    setTimeout(() => handleClose?.(), 800);
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameStarted(true);
    setCombo(0);
    setMaxCombo(0);
    setWave(1);
    setHasShield(false);
    setRapidFire(false);
    setMultiShot(false);
    setScoreMultiplier(1);
    entities.current.enemies = [];
    entities.current.bullets = [];
    entities.current.powerUps = [];
    entities.current.particles = [];
    entities.current.difficulty = 1;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden perspective-[1200px]">
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-700 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleCloseClick}
      />

      <div
        ref={gameArea}
        onMouseMove={(e) => {
          const rect = gameArea.current?.getBoundingClientRect();
          if (rect) {
            player.current.targetX = ((e.clientX - rect.left) / rect.width) * 100;
            player.current.targetY = ((e.clientY - rect.top) / rect.height) * 100;
          }
        }}
        onClick={() => gameStarted && !gameOver && shootBullet()}
        className={`
          relative w-full max-w-3xl h-[85vh] max-h-[750px]
          bg-[#05070a] rounded-[3rem] border border-white/10 overflow-hidden
          shadow-[0_50px_100px_rgba(0,0,0,0.8)]
          ${shake > 0 ? 'animate-shake' : ''}
          ${isClosing ? 'animate-genie-close' : isOpening ? 'animate-genie-open' : ''}
        `}
      >
        {/* Nebula Background */}
        {entities.current.nebula.map(n => (
          <div
            key={n.id}
            className="absolute rounded-full blur-3xl opacity-15"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              width: `${n.size}px`,
              height: `${n.size}px`,
              background: `radial-gradient(circle, ${['#6366f1', '#8b5cf6', '#3b82f6'][Math.floor(n.id * 3) % 3]} 0%, transparent 70%)`
            }}
          />
        ))}

        {/* Starfield */}
        {entities.current.stars.map(s => (
          <div
            key={s.id}
            className="absolute bg-white rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: 0.3 + s.speed / 5,
              boxShadow: `0 0 ${s.size * 3}px rgba(255,255,255,0.3)`
            }}
          />
        ))}

        {/* HUD */}
        <div className="absolute top-6 inset-x-6 flex justify-between items-start z-50 pointer-events-none">
          <div className="space-y-2">
            <div className="px-6 py-2 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10">
              <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest block">Score</span>
              <span className="text-3xl font-black text-white">{score.toLocaleString()}</span>
            </div>

            {combo > 1 && (
              <div className="px-4 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl border border-yellow-400/40 animate-pulse">
                <span className="text-sm font-black text-yellow-300">COMBO ×{combo}</span>
              </div>
            )}

            {scoreMultiplier > 1 && (
              <div className="px-4 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl border border-green-400/40">
                <span className="text-xs font-bold text-green-300">SCORE ×{scoreMultiplier}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  size={24}
                  className={`${i < lives ? 'text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-white/10'} transition-all duration-300`}
                />
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              {hasShield && (
                <div className="px-3 py-1 bg-blue-500/25 backdrop-blur-xl rounded-lg border border-blue-400/40 flex items-center gap-2">
                  <Shield size={14} className="text-blue-300" />
                  <span className="text-xs font-bold text-blue-200">SHIELD</span>
                </div>
              )}
              {rapidFire && (
                <div className="px-3 py-1 bg-red-500/25 backdrop-blur-xl rounded-lg border border-red-400/40 flex items-center gap-2">
                  <Zap size={14} className="text-red-300" />
                  <span className="text-xs font-bold text-red-200">RAPID</span>
                </div>
              )}
              {multiShot && (
                <div className="px-3 py-1 bg-purple-500/25 backdrop-blur-xl rounded-lg border border-purple-400/40 flex items-center gap-2">
                  <Target size={14} className="text-purple-300" />
                  <span className="text-xs font-bold text-purple-200">MULTI</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Particles */}
        {entities.current.particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.life * 0.9,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`
            }}
          />
        ))}

        {/* Enemies */}
        {entities.current.enemies.map(e => (
          <div
            key={e.id}
            className="absolute transition-transform"
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {e.type === 'boss' ? (
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-40 animate-pulse" style={{ width: e.size, height: e.size }} />
                <svg width={e.size} height={e.size} viewBox="0 0 70 70" className="relative drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                  <circle cx="35" cy="35" r="32" fill="#dc2626" stroke="#ef4444" strokeWidth="3" />
                  <circle cx="35" cy="35" r="24" fill="#991b1b" />
                  <circle cx="26" cy="28" r="5" fill="#fca5a5" />
                  <circle cx="44" cy="28" r="5" fill="#fca5a5" />
                  <path d="M 22 42 Q 35 50 48 42" stroke="#fca5a5" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path d="M 10 20 L 5 10 L 15 15 Z" fill="#ef4444" />
                  <path d="M 60 20 L 65 10 L 55 15 Z" fill="#ef4444" />
                </svg>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-2 bg-gray-800 rounded-full overflow-hidden border border-white/20">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all"
                    style={{ width: `${(e.hp / e.maxHp) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <svg width={e.size} height={e.size} viewBox="0 0 40 40" className={`${e.type === 'fast' ? 'animate-spin-slow' : ''} drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]`}>
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill={e.type === 'tank' ? '#f97316' : e.type === 'fast' ? '#eab308' : '#ef4444'}
                  stroke={e.type === 'tank' ? '#fb923c' : e.type === 'fast' ? '#fde047' : '#fca5a5'}
                  strokeWidth="2"
                />
                <circle cx="20" cy="20" r="10" fill={e.type === 'tank' ? '#ea580c' : e.type === 'fast' ? '#ca8a04' : '#dc2626'} />
                {e.type === 'tank' && (
                  <>
                    <rect x="4" y="18" width="6" height="4" rx="1" fill="#fb923c" />
                    <rect x="30" y="18" width="6" height="4" rx="1" fill="#fb923c" />
                    <rect x="18" y="4" width="4" height="6" rx="1" fill="#fb923c" />
                  </>
                )}
                {e.type === 'fast' && (
                  <>
                    <circle cx="14" cy="14" r="2" fill="#fef08a" />
                    <circle cx="26" cy="14" r="2" fill="#fef08a" />
                    <circle cx="14" cy="26" r="2" fill="#fef08a" />
                    <circle cx="26" cy="26" r="2" fill="#fef08a" />
                  </>
                )}
              </svg>
            )}
          </div>
        ))}

        {/* Power-ups */}
        {entities.current.powerUps.map(p => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
              animation: 'float 2s ease-in-out infinite'
            }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm border-2 shadow-lg ${p.type === 'shield' ? 'bg-blue-500/30 border-blue-300 shadow-blue-500/50' :
              p.type === 'rapidfire' ? 'bg-red-500/30 border-red-300 shadow-red-500/50' :
                p.type === 'multishot' ? 'bg-purple-500/30 border-purple-300 shadow-purple-500/50' :
                  'bg-yellow-500/30 border-yellow-300 shadow-yellow-500/50'
              }`}>
              {p.type === 'shield' && <Shield size={20} className="text-blue-200" />}
              {p.type === 'rapidfire' && <Zap size={20} className="text-red-200" />}
              {p.type === 'multishot' && <Target size={20} className="text-purple-200" />}
              {p.type === 'score2x' && <Sparkles size={20} className="text-yellow-200" />}
            </div>
          </div>
        ))}

        {/* Bullets */}
        {entities.current.bullets.map(b => (
          <div
            key={b.id}
            className="absolute"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="w-1.5 h-8 bg-gradient-to-t from-cyan-400 to-blue-300 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.9)]" />
          </div>
        ))}

        {/* Player */}
        {gameStarted && !gameOver && (
          <div
            className="absolute transition-transform duration-75 pointer-events-none"
            style={{
              left: `${player.current.x}%`,
              top: `${player.current.y}%`,
              transform: `translate(-50%, -50%) rotate(${player.current.rot}deg)`
            }}
          >
            {/* Shield Effect */}
            {hasShield && (
              <div className="absolute inset-0 -m-10">
                <div className="w-20 h-20 rounded-full border-4 border-blue-400/40 animate-ping" />
                <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-blue-300/60" style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }} />
              </div>
            )}

            {/* Engine Flames */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-2 h-16 bg-gradient-to-b from-cyan-400 via-blue-400 to-transparent blur-sm animate-engine" />
              <div className="w-2 h-16 bg-gradient-to-b from-blue-400 via-purple-400 to-transparent blur-sm animate-engine-alt" />
            </div>

            {/* Rocket SVG */}
            <svg width="30" height="50" viewBox="0 0 40 60" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] relative z-10">
              <defs>
                <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>

              {/* Main body */}
              <path d="M20 0C10 15 5 35 5 50H35C35 35 30 15 20 0Z" fill="url(#rocketGrad)" />

              {/* Inner detail */}
              <path d="M20 5C14 20 10 35 10 45H30C30 35 26 20 20 5Z" fill="#f1f5f9" />

              {/* Cockpit */}
              <circle cx="20" cy="22" r="6" fill="#38bdf8" opacity="0.9" />
              <circle cx="20" cy="22" r="4" fill="#7dd3fc" />

              {/* Wings */}
              <path d="M5 35L0 55L5 50Z" fill="#ef4444" />
              <path d="M35 35L40 55L35 50Z" fill="#ef4444" />

              {/* Details */}
              <rect x="18" y="32" width="4" height="8" rx="1" fill="#3b82f6" />
              <rect x="18" y="42" width="4" height="4" rx="1" fill="#60a5fa" />
            </svg>
          </div>
        )}

        {/* Menus */}
        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-[60] bg-black/50 backdrop-blur-xl">
            <div className="text-center space-y-6 px-8">
              <h1 className="text-7xl font-black text-white italic tracking-tight drop-shadow-2xl">
                {gameOver ? "Mission Complete" : "Void Runner"}
              </h1>

              {gameOver && (
                <div className="space-y-3">
                  <p className="text-5xl font-black text-white">{score.toLocaleString()}</p>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Final Score</p>
                  {maxCombo > 1 && (
                    <p className="text-xl text-yellow-400">Best Combo: ×{maxCombo}</p>
                  )}
                  <p className="text-lg text-cyan-400">Wave: {wave}</p>
                </div>
              )}

              {!gameOver && (
                <div className="space-y-4 text-sm text-gray-400 max-w-md">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white/10 rounded">WASD</kbd>
                      <span>Move</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white/10 rounded">SPACE</kbd>
                      <span>Shoot</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-cyan-400 font-semibold mb-2">Power-ups</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Shield size={14} className="text-blue-400" />
                        <span>Shield</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-red-400" />
                        <span>Rapid Fire</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target size={14} className="text-purple-400" />
                        <span>Multi-Shot</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-yellow-400" />
                        <span>Score ×2</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={resetGame}
                className="mt-8 px-16 py-5 bg-white text-black text-xl font-black rounded-full hover:scale-110 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all duration-300 shadow-2xl"
              >
                {gameOver ? "REBOOT" : "LAUNCH"}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes genie-open {
          0% {
            opacity: 0;
            transform: translate3d(0, 45%, -600px) scale(0.1, 0.05);
            filter: brightness(2) blur(15px);
            border-radius: 100%;
          }
          40% {
            opacity: 1;
            transform: translate3d(0, 10%, -200px) scale(0.6, 1.2);
            filter: brightness(1.3) blur(4px);
          }
          70% {
            transform: translate3d(0, -5%, 0) scale(1.05, 0.9);
            filter: brightness(1.1) blur(1px);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1, 1);
            filter: brightness(1) blur(0px);
            border-radius: 3rem;
          }
        }

        @keyframes genie-close {
          0% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1, 1);
            filter: brightness(1) blur(0px);
          }
          30% {
            transform: translate3d(0, -10%, 0) scale(1.1, 0.8);
            filter: brightness(1.2) blur(1px);
          }
          100% {
            opacity: 0;
            transform: translate3d(0, 50%, -800px) scale(0.05, 0.01);
            filter: brightness(4) blur(20px);
          }
        }

        .animate-genie-open {
          animation: genie-open 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: center bottom;
        }
        
        .animate-genie-close {
          animation: genie-close 0.75s cubic-bezier(0.7, 0, 0.84, 0) forwards;
          transform-origin: center bottom;
        }

        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-8px, 5px) rotate(-2deg); }
          50% { transform: translate(8px, -5px) rotate(2deg); }
          75% { transform: translate(-6px, 4px) rotate(-1deg); }
        }
        
        .animate-shake {
          animation: shake 0.25s ease-in-out;
        }

        @keyframes engine {
          0%, 100% { height: 14px; opacity: 0.7; }
          50% { height: 22px; opacity: 1; }
        }
        
        @keyframes engine-alt {
          0%, 100% { height: 18px; opacity: 0.6; }
          50% { height: 26px; opacity: 0.9; }
        }
        
        .animate-engine {
          animation: engine 0.12s ease-in-out infinite;
        }
        
        .animate-engine-alt {
          animation: engine-alt 0.12s ease-in-out infinite 0.06s;
        }

        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}