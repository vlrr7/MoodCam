import { useEffect, useRef } from 'react';
import { Emotion } from '../adapters/ModelAdapter';
import { useStore } from '../state/useStore';

interface EmotionEffectsProps {
  emotion: Emotion | null;
  confidence: number;
}

// Particle system for confetti effect
class ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = Math.random() * -8 - 2;
    this.color = ['#f59e0b', '#f97316', '#eab308', '#84cc16', '#22c55e'][Math.floor(Math.random() * 5)];
    this.size = Math.random() * 4 + 2;
    this.life = 0;
    this.maxLife = Math.random() * 100 + 100;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.life++;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = 1 - (this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  }

  isDead() {
    return this.life >= this.maxLife;
  }
}

// Heart particles for love/happy emotions
class HeartParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  scale: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = Math.random() * -6 - 1;
    this.life = 0;
    this.maxLife = Math.random() * 80 + 80;
    this.scale = Math.random() * 0.5 + 0.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05; // lighter gravity
    this.life++;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = 1 - (this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ef4444';
    ctx.scale(this.scale, this.scale);
    
    // Draw heart shape
    ctx.beginPath();
    ctx.moveTo(this.x / this.scale, (this.y / this.scale) + 2);
    ctx.bezierCurveTo(
      (this.x / this.scale) - 3, (this.y / this.scale) - 2,
      (this.x / this.scale) - 6, (this.y / this.scale) + 1,
      (this.x / this.scale), (this.y / this.scale) + 6
    );
    ctx.bezierCurveTo(
      (this.x / this.scale) + 6, (this.y / this.scale) + 1,
      (this.x / this.scale) + 3, (this.y / this.scale) - 2,
      (this.x / this.scale), (this.y / this.scale) + 2
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.life >= this.maxLife;
  }
}

// Tear particles for sad emotions
class TearParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = Math.random() * 3 + 1;
    this.life = 0;
    this.maxLife = Math.random() * 100 + 100;
    this.size = Math.random() * 3 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.life++;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = 1 - (this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#3b82f6';
    
    // Draw tear shape
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.size, this.size * 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.life >= this.maxLife;
  }
}

// Lightning particles for fear emotions
class LightningParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  segments: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = Math.random() * -8 - 2;
    this.life = 0;
    this.maxLife = Math.random() * 30 + 20;
    this.segments = Math.floor(Math.random() * 3) + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2;
    this.life++;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = 1 - (this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    
    // Draw lightning bolt
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    for (let i = 0; i < this.segments; i++) {
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      ctx.lineTo(this.x + offsetX, this.y + offsetY);
    }
    ctx.stroke();
    ctx.restore();
  }

  isDead() {
    return this.life >= this.maxLife;
  }
}

// Fire particles for angry emotions
class FireParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = Math.random() * -4 - 2;
    this.life = 0;
    this.maxLife = Math.random() * 60 + 40;
    this.size = Math.random() * 4 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05;
    this.life++;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = 1 - (this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Draw fire particle
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    gradient.addColorStop(0, '#ef4444');
    gradient.addColorStop(0.5, '#f97316');
    gradient.addColorStop(1, '#fbbf24');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.life >= this.maxLife;
  }
}

// Sparkle particles for surprise emotions
class SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  rotation: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = Math.random() * -8 - 2;
    this.life = 0;
    this.maxLife = Math.random() * 40 + 30;
    this.size = Math.random() * 3 + 1;
    this.rotation = 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1;
    this.rotation += 0.2;
    this.life++;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = 1 - (this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#14b8a6';
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    // Draw sparkle (star shape)
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.moveTo(0, -this.size);
      ctx.lineTo(-this.size * 0.3, -this.size * 0.3);
      ctx.lineTo(-this.size, 0);
      ctx.lineTo(-this.size * 0.3, this.size * 0.3);
      ctx.lineTo(0, this.size);
    }
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.life >= this.maxLife;
  }
}

// Poison particles for disgust emotions
class PoisonParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = Math.random() * -5 - 1;
    this.life = 0;
    this.maxLife = Math.random() * 80 + 60;
    this.size = Math.random() * 3 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.08;
    this.life++;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = 1 - (this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#22c55e';
    
    // Draw poison bubble
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Add bubble highlight
    ctx.fillStyle = '#84cc16';
    ctx.beginPath();
    ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.life >= this.maxLife;
  }
}

// Neutral particles (simple dots)
class NeutralParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = Math.random() * -3 - 1;
    this.life = 0;
    this.maxLife = Math.random() * 60 + 40;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05;
    this.life++;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = 1 - (this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#6b7280';
    
    // Draw simple dot
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.life >= this.maxLife;
  }
}

export default function EmotionEffects({ emotion, confidence }: EmotionEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<(ConfettiParticle | HeartParticle | TearParticle | LightningParticle | FireParticle | SparkleParticle | PoisonParticle | NeutralParticle)[]>([]);
  const animationRef = useRef<number>();
  const { muted } = useStore();

  useEffect(() => {
    if (!emotion || confidence < 0.7) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles based on emotion
    const particleCount = Math.min(Math.floor(confidence * 50), 30);
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = canvas.height * 0.3; // Start from top third
      
      switch (emotion) {
        case 'happy':
          particlesRef.current.push(new ConfettiParticle(x, y));
          break;
        case 'sad':
          particlesRef.current.push(new TearParticle(x, y));
          break;
        case 'angry':
          particlesRef.current.push(new FireParticle(x, y));
          break;
        case 'fear':
          particlesRef.current.push(new LightningParticle(x, y));
          break;
        case 'surprise':
          particlesRef.current.push(new SparkleParticle(x, y));
          break;
        case 'disgust':
          particlesRef.current.push(new PoisonParticle(x, y));
          break;
        case 'neutral':
          particlesRef.current.push(new NeutralParticle(x, y));
          break;
      }
    }

    // Play sound effect
    if (!muted) {
      playEmotionSound(emotion);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update();
        particle.draw(ctx);
        return !particle.isDead();
      });

      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    // Cleanup after 3 seconds
    const cleanup = setTimeout(() => {
      particlesRef.current = [];
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }, 3000);

    return () => {
      clearTimeout(cleanup);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [emotion, confidence, muted]);

  const playEmotionSound = (emotion: Emotion) => {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };

    const playChord = (frequencies: number[], duration: number, type: OscillatorType = 'sine', volume: number = 0.05) => {
      frequencies.forEach(freq => {
        playTone(freq, duration, type, volume);
      });
    };

    switch (emotion) {
      case 'happy':
        // Play cheerful major chord progression
        playTone(523.25, 0.2); // C5
        setTimeout(() => playTone(659.25, 0.2), 100); // E5
        setTimeout(() => playTone(783.99, 0.3), 200); // G5
        setTimeout(() => playChord([523.25, 659.25, 783.99], 0.4), 300); // C major chord
        break;
        
      case 'sad':
        // Play melancholic minor progression
        playTone(440, 0.4); // A4
        setTimeout(() => playTone(392, 0.4), 200); // G4
        setTimeout(() => playTone(349.23, 0.5), 400); // F4
        setTimeout(() => playTone(293.66, 0.6), 600); // D4
        break;
        
      case 'angry':
        // Play harsh, aggressive sounds
        playTone(110, 0.3, 'sawtooth', 0.15); // Low A2
        setTimeout(() => playTone(146.83, 0.2, 'sawtooth', 0.12), 100); // D3
        setTimeout(() => playTone(220, 0.4, 'sawtooth', 0.1), 200); // A3
        setTimeout(() => playTone(110, 0.5, 'sawtooth', 0.08), 400); // Low rumble
        break;
        
      case 'fear':
        // Play eerie, tremolo effect with dissonance
        for (let i = 0; i < 8; i++) {
          setTimeout(() => {
            playTone(220 + i * 15, 0.08, 'sine', 0.06);
            playTone(221 + i * 15, 0.08, 'sine', 0.04); // Slight detune for dissonance
          }, i * 60);
        }
        break;
        
      case 'surprise':
        // Play quick ascending arpeggio
        playTone(440, 0.1); // A4
        setTimeout(() => playTone(554.37, 0.1), 50); // C#5
        setTimeout(() => playTone(659.25, 0.1), 100); // E5
        setTimeout(() => playTone(783.99, 0.1), 150); // G5
        setTimeout(() => playTone(880, 0.2), 200); // A5
        setTimeout(() => playTone(1174.66, 0.3), 250); // D6
        break;
        
      case 'disgust':
        // Play descending chromatic with harsh timbre
        playTone(440, 0.2, 'sawtooth', 0.08);
        setTimeout(() => playTone(415.30, 0.2, 'sawtooth', 0.08), 100);
        setTimeout(() => playTone(392, 0.2, 'sawtooth', 0.08), 200);
        setTimeout(() => playTone(369.99, 0.2, 'sawtooth', 0.08), 300);
        setTimeout(() => playTone(349.23, 0.3, 'sawtooth', 0.08), 400);
        break;
        
      case 'neutral':
        // Play calm, centered tone
        playTone(440, 0.4); // A4
        setTimeout(() => playTone(440, 0.3), 200); // Gentle repetition
        break;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  );
}
