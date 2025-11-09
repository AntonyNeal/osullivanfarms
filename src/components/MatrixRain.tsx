import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  opacity?: number;
}

export default function MatrixRain({ opacity = 0.1 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Characters to display - includes Australian symbols
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$★';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = canvas.width / fontSize;

    // Array to track the y-position of each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // Start at random positions above viewport
    }

    // Colors - mix of green and gold
    const colors = ['#00FF41', '#FFD700'];

    function draw() {
      if (!ctx || !canvas) return;

      // Black background with slight opacity for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set font
      ctx.font = fontSize + 'px monospace';

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Randomly select green or gold
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = color;

        // Random character
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Reset drop to top after it goes below viewport
        if (y > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }

        // Increment y position (slow fall: 3-5s per screen)
        drops[i] += 0.3;
      }
    }

    // Animate
    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-rain-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: opacity,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
}
