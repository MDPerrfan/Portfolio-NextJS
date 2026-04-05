'use client';
import React, { useEffect, useRef } from 'react';

export default function DaylightBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let clouds = [];

    const sun = {
      x: window.innerWidth * 0.85,
      y: window.innerHeight * 0.2,
      radius: 55,
      glow: 60
    };

    // ===== Canvas Size =====
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // ===== Create Clouds =====
    const createClouds = () => {
      clouds = [];
      const count = Math.floor(canvas.width / 250);

      for (let i = 0; i < count; i++) {
        const baseX = Math.random() * canvas.width;
        const baseY = Math.random() * canvas.height * 0.6;

        clouds.push({
          baseX,
          x: baseX,
          y: baseY,
          size: 40 + Math.random() * 60,
          offset: Math.random() * Math.PI * 2,
          speed: 0.002 + Math.random() * 0.003
        });
      }
    };
    const pixelSize = 4; // Size of each "pixel" for dithering
    // ===== Draw Sun =====
    const drawPixelCircle = (centerX, centerY, radius, color) => {
      ctx.fillStyle = color;
      for (let y = -radius; y <= radius; y += pixelSize) {
        for (let x = -radius; x <= radius; x += pixelSize) {
          if (x * x + y * y <= radius * radius) {
            ctx.fillRect(
              Math.floor((centerX + x) / pixelSize) * pixelSize,
              Math.floor((centerY + y) / pixelSize) * pixelSize,
              pixelSize,
              pixelSize
            );
          }
        }
      }
    };

    const drawSun = () => {
      // Outer Glow (Dithered effect)
      drawPixelCircle(sun.x, sun.y, sun.radius + 16, 'rgba(255, 220, 120, 0.4)');
      // Main Sun Body
      drawPixelCircle(sun.x, sun.y, sun.radius, '#ffb300');
      // Highlight
      drawPixelCircle(sun.x - 8, sun.y - 8, sun.radius * 0.5, '#fff8b0');
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

      // subtle bottom shadow (depth)
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.beginPath();
      ctx.ellipse(
        x + size * 0.5,
        y + size * 0.5,
        size * 0.9,
        size * 0.25,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    };
    // rocket (pointing RIGHT) 
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
      x: 0,
      y: 0,
      angle: 0,       // current heading (radians)
      speed: 2.4,     // px per frame
      mode: 'cruise',// 'cruise' | 'loop' | 'wait'
      loopTurned: 0,    // how many radians turned so far in loop
      loopDir: 1,    // +1 clockwise, -1 counter-clockwise
      turnRate: 0.045,// radians per frame during loop
      cruiseTimer: 0,   // frames until next loop
      waitTimer: 0,    // frames to wait off-screen before reappearing
    };

    const randomCruiseTime = () => 180 + Math.floor(Math.random() * 180);

    const spawnRocket = () => {
      const W = canvas.width;
      const H = canvas.height;
      // Pick a random edge to spawn from
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) { // left
        rkt.x = -60; rkt.y = H * (0.1 + Math.random() * 0.7);
        rkt.angle = (Math.random() - 0.5) * 0.5; // mostly rightward
      } else if (edge === 1) { // right
        rkt.x = W + 60; rkt.y = H * (0.1 + Math.random() * 0.7);
        rkt.angle = Math.PI + (Math.random() - 0.5) * 0.5;
      } else if (edge === 2) { // top
        rkt.x = W * (0.1 + Math.random() * 0.8); rkt.y = -60;
        rkt.angle = Math.PI * 0.5 + (Math.random() - 0.5) * 0.5;
      } else { // bottom
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
        // Fly straight-ish
        rkt.x += Math.cos(rkt.angle) * rkt.speed;
        rkt.y += Math.sin(rkt.angle) * rkt.speed;
        rkt.cruiseTimer--;

        if (rkt.cruiseTimer <= 0) {
          // Kick off a loop — pick clockwise or counter randomly
          rkt.mode = 'loop';
          rkt.loopTurned = 0;
          rkt.loopDir = Math.random() > 0.5 ? 1 : -1;
        }

        // If drifted off-screen, reset after a pause
        const pad = 150;
        if (rkt.x < -pad || rkt.x > canvas.width + pad ||
          rkt.y < -pad || rkt.y > canvas.height + pad) {
          rkt.mode = 'wait';
          rkt.waitTimer = 140 + Math.floor(Math.random() * 160);
        }

      } else if (rkt.mode === 'loop') {
        // Turn continuously — this IS the loop
        rkt.angle += rkt.loopDir * rkt.turnRate;
        rkt.loopTurned += rkt.turnRate;
        rkt.x += Math.cos(rkt.angle) * rkt.speed;
        rkt.y += Math.sin(rkt.angle) * rkt.speed;

        // Full circle done → back to cruise
        if (rkt.loopTurned >= Math.PI * 2) {
          rkt.mode = 'cruise';
          rkt.cruiseTimer = randomCruiseTime();
        }
      }
    };
    // ── Smoke trail ───────────────────────────────────────────────────────────
    const trail = [];
    const addSmoke = (x, y, angle) => {
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
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    };
    // ===== Animation =====
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
sky.addColorStop(0, '#62c1e5');  // deeper mid-sky blue
sky.addColorStop(1, '#cfecf7');  // deeper horizon blue
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
      // Move & draw clouds
      clouds.forEach((cloud) => {
        cloud.offset += cloud.speed;

        // ←→ movement within ~40px range
        cloud.x = cloud.baseX + Math.sin(cloud.offset) * 20;

        drawCloud(cloud);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // ===== Resize =====
    const handleResize = () => {
      setCanvasSize();
      createClouds();
    };

    // ===== Init =====
    setCanvasSize();
    createClouds();
    animate();

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
        pointerEvents: 'none'
      }}
    />
  );
};

