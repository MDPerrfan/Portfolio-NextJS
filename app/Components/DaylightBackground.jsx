'use client';
import React, { useEffect, useRef } from 'react';

export default function DaylightBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let clouds = [];
    let lastTime = 0;
    let sunCache = null; // ← pre-rendered sun lives here

    // ── Detect mobile once ────────────────────────────────────────────────────
    const isMobile = () => window.innerWidth < 768;

    // ── Target FPS: 30 on mobile, 60 on desktop ───────────────────────────────
    const FRAME_MS = () => (isMobile() ? 1000 / 30 : 1000 / 60);

    const sun = {
      x: window.innerWidth * 0.85,
      y: window.innerHeight * 0.2,
      radius: 55,
    };

    // ===== Canvas Size =====
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      sun.x = canvas.width * 0.85;
      sun.y = canvas.height * 0.2;
    };

    // ===== Pre-render Sun to OffscreenCanvas (runs ONCE) =====================
    //
    // FIX: Previously, drawPixelCircle() ran a nested double for-loop on EVERY
    // animation frame — ~1,712 fillRect() calls per frame = 102,720 ops/sec.
    // Now we draw the sun pixel-art exactly once into an offscreen canvas and
    // reuse it every frame with a single ctx.drawImage() call.
    //
    const buildSunCache = () => {
      const size = (sun.radius + 20) * 2 + 8; // enough padding for glow
      const off = document.createElement('canvas');
      off.width = size;
      off.height = size;
      const oc = off.getContext('2d');
      const cx = size / 2;
      const cy = size / 2;
      const ps = 4; // pixel size for dithering

      const drawPixelCircle = (centerX, centerY, radius, color) => {
        oc.fillStyle = color;
        for (let y = -radius; y <= radius; y += ps) {
          for (let x = -radius; x <= radius; x += ps) {
            if (x * x + y * y <= radius * radius) {
              oc.fillRect(
                Math.floor((centerX + x) / ps) * ps,
                Math.floor((centerY + y) / ps) * ps,
                ps,
                ps
              );
            }
          }
        }
      };

      // Outer glow
      drawPixelCircle(cx, cy, sun.radius + 16, 'rgba(255, 220, 120, 0.4)');
      // Main body
      drawPixelCircle(cx, cy, sun.radius, '#ffb300');
      // Highlight
      drawPixelCircle(cx - 8, cy - 8, sun.radius * 0.5, '#fff8b0');

      return { offscreen: off, size, cx, cy };
    };

    // ===== Create Clouds =====
    const createClouds = () => {
      clouds = [];
      // Fewer clouds on mobile to save draw calls
      const count = isMobile()
        ? Math.max(2, Math.floor(canvas.width / 400))
        : Math.floor(canvas.width / 250);

      for (let i = 0; i < count; i++) {
        const baseX = Math.random() * canvas.width;
        const baseY = Math.random() * canvas.height * 0.6;
        clouds.push({
          baseX,
          x: baseX,
          y: baseY,
          size: 40 + Math.random() * 60,
          offset: Math.random() * Math.PI * 2,
          speed: 0.002 + Math.random() * 0.003,
        });
      }
    };

    // ===== Draw Sun (1 drawImage call instead of 1,712 fillRects) ============
    const drawSun = () => {
      if (!sunCache) return;
      const { offscreen, size } = sunCache;
      ctx.drawImage(offscreen, sun.x - size / 2, sun.y - size / 2);
    };

    // ===== Draw 3D Cloud =====
    const drawCloud = (cloud) => {
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      const { x, y, size } = cloud;

      ctx.beginPath();
      ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
      ctx.arc(x + size * 0.5, y - size * 0.3, size * 0.7, 0, Math.PI * 2);
      ctx.arc(x + size * 1.1, y, size * 0.6, 0, Math.PI * 2);
      ctx.arc(x + size * 0.5, y + size * 0.3, size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Subtle bottom shadow
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.beginPath();
      ctx.ellipse(x + size * 0.5, y + size * 0.5, size * 0.9, size * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    // ===== Rocket =====
    const drawRocket = () => {
      const u = 5;
      const flicker = Math.random() > 0.4;
      if (flicker) {
        ctx.fillStyle = 'rgba(255,80,0,0.6)';
        ctx.fillRect(-u * 9, -u * 1.5, u * 4, u * 3);
        ctx.fillStyle = 'rgba(255,60,0,0.4)';
        ctx.fillRect(-u * 11, -u, u * 3, u * 2);
      } else {
        ctx.fillStyle = 'rgba(255,90,0,0.55)';
        ctx.fillRect(-u * 10, -u * 2, u * 5, u * 4);
      }
      ctx.fillStyle = '#FFE000';
      ctx.fillRect(-u * 8, -u, u * 3, u * 2);
      ctx.fillStyle = '#E8E8F0';
      ctx.fillRect(-u * 5, -u * 2, u * 8, u * 4);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(u * 3, -u * 2, u * 2, u * 4);
      ctx.fillRect(u * 5, -u * 1.5, u * 2, u * 3);
      ctx.fillRect(u * 7, -u, u, u * 2);
      ctx.fillStyle = '#7DD3FC';
      ctx.fillRect(-u, -u * 1.2, u * 2, u * 2.4);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(-u, -u * 1.2, u, u * 1.2);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(-u * 3, -u * 2, u * 1.5, u * 4);
      ctx.fillRect(-u * 4, -u * 4, u * 3, u * 2);
      ctx.fillRect(-u * 3, -u * 3, u * 2, u);
      ctx.fillRect(-u * 4, u * 2, u * 3, u * 2);
      ctx.fillRect(-u * 3, u * 2, u * 2, u);
      ctx.fillStyle = '#AAAAB8';
      ctx.fillRect(-u * 5, -u * 2, u * 1.5, u * 4);
    };

    const rkt = {
      x: 0, y: 0, angle: 0,
      speed: 2.4,
      mode: 'cruise',
      loopTurned: 0, loopDir: 1, turnRate: 0.045,
      cruiseTimer: 0, waitTimer: 0,
    };

    const randomCruiseTime = () => 180 + Math.floor(Math.random() * 180);

    const spawnRocket = () => {
      const W = canvas.width;
      const H = canvas.height;
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) {
        rkt.x = -60; rkt.y = H * (0.1 + Math.random() * 0.7);
        rkt.angle = (Math.random() - 0.5) * 0.5;
      } else if (edge === 1) {
        rkt.x = W + 60; rkt.y = H * (0.1 + Math.random() * 0.7);
        rkt.angle = Math.PI + (Math.random() - 0.5) * 0.5;
      } else if (edge === 2) {
        rkt.x = W * (0.1 + Math.random() * 0.8); rkt.y = -60;
        rkt.angle = Math.PI * 0.5 + (Math.random() - 0.5) * 0.5;
      } else {
        rkt.x = W * (0.1 + Math.random() * 0.8); rkt.y = H + 60;
        rkt.angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 0.5;
      }
      rkt.mode = 'cruise';
      rkt.cruiseTimer = randomCruiseTime();
    };

    spawnRocket();

    const updateRocket = () => {
      if (rkt.mode === 'wait') {
        rkt.waitTimer--;
        if (rkt.waitTimer <= 0) spawnRocket();
        return;
      }
      if (rkt.mode === 'cruise') {
        rkt.x += Math.cos(rkt.angle) * rkt.speed;
        rkt.y += Math.sin(rkt.angle) * rkt.speed;
        rkt.cruiseTimer--;
        if (rkt.cruiseTimer <= 0) {
          rkt.mode = 'loop';
          rkt.loopTurned = 0;
          rkt.loopDir = Math.random() > 0.5 ? 1 : -1;
        }
        const pad = 150;
        if (rkt.x < -pad || rkt.x > canvas.width + pad ||
          rkt.y < -pad || rkt.y > canvas.height + pad) {
          rkt.mode = 'wait';
          rkt.waitTimer = 140 + Math.floor(Math.random() * 160);
        }
      } else if (rkt.mode === 'loop') {
        rkt.angle += rkt.loopDir * rkt.turnRate;
        rkt.loopTurned += rkt.turnRate;
        rkt.x += Math.cos(rkt.angle) * rkt.speed;
        rkt.y += Math.sin(rkt.angle) * rkt.speed;
        if (rkt.loopTurned >= Math.PI * 2) {
          rkt.mode = 'cruise';
          rkt.cruiseTimer = randomCruiseTime();
        }
      }
    };

    // ── Smoke trail ───────────────────────────────────────────────────────────
    const trail = [];

    const addSmoke = (x, y, angle) => {
      // Cap trail length on mobile to prevent unbounded array growth
      if (isMobile() && trail.length > 15) return;
      trail.push({
        x: x - Math.cos(angle) * 30 + (Math.random() - 0.5) * 6,
        y: y - Math.sin(angle) * 30 + (Math.random() - 0.5) * 6,
        r: 3 + Math.random() * 4,
        life: 1,
        decay: 0.018 + Math.random() * 0.01,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.3 - Math.random() * 0.3,
      });
    };

    const drawSmoke = () => {
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.x += p.vx; p.y += p.vy; p.r += 0.15; p.life -= p.decay;
        if (p.life <= 0) { trail.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(200,210,230,${0.32 * p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // ===== Animation Loop (throttled to 30fps on mobile) =====================
    //
    // FIX: Previously ran at full 60fps on all devices. Now we check elapsed
    // time and skip frames on mobile to halve CPU usage.
    //
    const animate = (timestamp) => {
      // Throttle: skip frame if not enough time has passed
      if (timestamp - lastTime < FRAME_MS()) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      sky.addColorStop(0, '#62c1e5');
      sky.addColorStop(1, '#cfecf7');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw pre-rendered sun (1 drawImage instead of 1,712 fillRects)
      drawSun();

      updateRocket();

      if (rkt.mode !== 'wait') {
        if (Math.random() > 0.45) addSmoke(rkt.x, rkt.y, rkt.angle);
        drawSmoke();
        ctx.save();
        ctx.translate(rkt.x, rkt.y);
        ctx.rotate(rkt.angle);
        drawRocket();
        ctx.restore();
      }

      clouds.forEach((cloud) => {
        cloud.offset += cloud.speed;
        cloud.x = cloud.baseX + Math.sin(cloud.offset) * 20;
        drawCloud(cloud);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // ===== Resize =====
    const handleResize = () => {
      setCanvasSize();
      // Rebuild sun cache at new sun position after resize
      sunCache = buildSunCache();
      createClouds();
    };

    // ===== Init =====
    setCanvasSize();
    sunCache = buildSunCache(); // ← build once
    createClouds();
    animationFrameId = requestAnimationFrame(animate);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        willChange: 'transform', // hints GPU to isolate this layer
      }}
    />
  );
}