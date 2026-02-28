'use client';
import React, { useEffect, useRef } from 'react';

const DaylightBackground = () => {
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

    // ===== Animation =====
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      sky.addColorStop(0, '#87ceeb');
      sky.addColorStop(1, '#dff6ff');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawSun();

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

export default DaylightBackground;