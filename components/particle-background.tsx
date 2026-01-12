"use client";
import { useEffect, useRef } from "react";

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;
    let particles: Particle[] = [];

    // Brand palette: Blue-500, Teal-500, Cyan-400
    const colors = ["#3b82f6", "#14b8a6", "#22d3ee"];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      x!: number;
      y!: number;
      speed!: number;
      size!: number;
      color!: string;
      baseAlpha!: number;

      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * canvas!.width;
        // If initial, scatter everywhere. If resetting, start just above the top.
        this.y = initial ? Math.random() * canvas!.height : -10;

        // Size variation for depth
        this.size = Math.random() * 2 + 1; // 1px to 3px

        // Speed linked to size for parallax effect (bigger = faster/closer)
        this.speed = this.size * 0.4 + 0.2;

        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.baseAlpha = Math.random() * 0.4 + 0.2; // Slightly more transparent for softness
      }

      update() {
        this.y += this.speed;

        // Reset when fully off screen
        if (this.y > canvas!.height + 10) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.baseAlpha;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    // Initialize particles based on screen area to keep consistent density
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(
        100,
        Math.floor((canvas.width * canvas.height) / 12000)
      );

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    // Re-init on resize to prevent clustering or sparsity
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      resizeCanvas();
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initParticles, 100);
    };
    window.removeEventListener("resize", resizeCanvas); // Remove old listener
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Connections
      particles.forEach((p1, i) => {
        // Only connect to a subset to save performance and reduce clutter
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;

          // Optimization: fast check on x distance before extensive math
          if (Math.abs(dx) > 120) return;

          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            // Calculate opacity based on distance
            const alpha = 0.15 * (1 - distance / 120);

            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`; // Blueish connections
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      // Slightly reduced opacity for subtle background effect
      style={{ opacity: 0.8 }}
    />
  );
};
