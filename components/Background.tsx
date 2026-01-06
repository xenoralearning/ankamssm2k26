
import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Silhouettes of athletic motions
    // We'll use a mix of icons and path-like abstractions
    const athletes: any[] = [];
    const count = 15;

    const athleteIcons = [
      '🏃', '🏋️', '👟', '💨', '⚡', '🏆'
    ];
    
    // Abstract silhouettes using custom drawing might be heavy, 
    // we use clean emojis with low opacity for the requested motions
    for (let i = 0; i < count; i++) {
      athletes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() * 0.4 + 0.1) * (i % 2 === 0 ? 1 : -1),
        vy: (Math.random() * 0.4 + 0.1) * (i % 2 === 0 ? 1 : -1),
        size: Math.random() * 60 + 30,
        icon: athleteIcons[i % athleteIcons.length],
        alpha: Math.random() * 0.04 + 0.01,
        parallax: Math.random() * 0.3 + 0.1
      });
    }

    const draw = () => {
      // Background Gradient: #020617 (Dark) -> #0F172A -> #1E40AF (Deep Blue)
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#020617');
      gradient.addColorStop(0.5, '#0F172A');
      gradient.addColorStop(1, '#1E40AF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw floating elements
      athletes.forEach(a => {
        ctx.save();
        ctx.globalAlpha = a.alpha;
        ctx.font = `${a.size}px Arial`;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(a.icon, a.x, a.y);
        ctx.restore();

        a.x += a.vx * a.parallax;
        a.y += a.vy * a.parallax;

        // Wrap around screen
        if (a.x > width + 100) a.x = -100;
        if (a.x < -100) a.x = width + 100;
        if (a.y > height + 100) a.y = -100;
        if (a.y < -100) a.y = height + 100;
      });

      // Subtle light beams
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const offset = (Date.now() / 40 + i * 500) % (width * 2);
        ctx.moveTo(offset - width, 0);
        ctx.lineTo(offset, height);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
    />
  );
};

export default Background;
