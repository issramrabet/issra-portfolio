
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

/*
  ADD THIS TO YOUR index.html <head>:
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,300;9..40,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  UPDATE YOUR CSS VARIABLES:
  --font-display: 'Bricolage Grotesque', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
*/

const roles = [
  'AI Engineer',
  'Computer Vision Dev',
  'Deep Learning Builder',
  'Machine Learning Enthusiast',
  'Competitive Coder',
];

function TypeWriter({ words }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index];
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((index + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, words]);

  return (
    <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
      {displayed}
      <span className="type-cursor" />
    </span>
  );
}

export default function Hero() {
  const canvasRef      = useRef(null);
  const mousePos       = useRef({ x: -999, y: -999 });
  const lerpPos        = useRef({ x: -999, y: -999 });
  const prevPos        = useRef({ x: -999, y: -999 });
  const velocity       = useRef(0);
  const currentRadius  = useRef(0);
  const rafRef         = useRef(null);
  const realImgRef     = useRef(null);
  const robotImgRef    = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const particlesInit = async (engine) => { await loadSlim(engine); };

  useEffect(() => {
    const realImg = new Image(), robotImg = new Image();
    let loaded = 0;
    const onLoad = () => {
      if (++loaded === 2) {
        realImgRef.current = realImg;
        robotImgRef.current = robotImg;
        setImagesLoaded(true);
      }
    };
    realImg.onload = onLoad; robotImg.onload = onLoad;
    realImg.src = '/issra.png'; robotImg.src = '/robot.png';
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const drawCover = (c, img, W, H) => {
      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const sw = img.naturalWidth * scale, sh = img.naturalHeight * scale;
      c.drawImage(img, (W - sw) / 2, (H - sh) / 2, sw, sh);
    };

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      lerpPos.current.x += (mousePos.current.x - lerpPos.current.x) * 0.095;
      lerpPos.current.y += (mousePos.current.y - lerpPos.current.y) * 0.095;
      velocity.current *= 0.88;
      ctx.clearRect(0, 0, W, H);
      drawCover(ctx, realImgRef.current, W, H);
      const rect = canvas.getBoundingClientRect();
      const cx = lerpPos.current.x - rect.left;
      const cy = lerpPos.current.y - rect.top;
      const isNear = cx >= -120 && cx <= W + 120 && cy >= -120 && cy <= H + 120;
      if (isNear) {
        const dist = Math.sqrt((cx - W/2)**2 + (cy - H/2)**2);
        const proximity = Math.max(0, 1 - dist / (Math.sqrt(W*W + H*H) / 1.4));
        const targetR = 120 + proximity * 90 + Math.min(velocity.current * 2.8, 200);
        currentRadius.current += (targetR - currentRadius.current) * 0.1;
        const off = document.createElement('canvas');
        off.width = W; off.height = H;
        const oc = off.getContext('2d');
        drawCover(oc, robotImgRef.current, W, H);
        const mg = oc.createRadialGradient(cx, cy, 0, cx, cy, currentRadius.current);
        mg.addColorStop(0,    'rgba(0,0,0,1)');
        mg.addColorStop(0.35, 'rgba(0,0,0,0.98)');
        mg.addColorStop(0.6,  'rgba(0,0,0,0.7)');
        mg.addColorStop(0.82, 'rgba(0,0,0,0.25)');
        mg.addColorStop(0.93, 'rgba(0,0,0,0.05)');
        mg.addColorStop(1,    'rgba(0,0,0,0)');
        oc.globalCompositeOperation = 'destination-in';
        oc.fillStyle = mg; oc.fillRect(0, 0, W, H);
        ctx.drawImage(off, 0, 0);
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(139,92,246,0.75)'; ctx.fill(); ctx.restore();
      } else {
        currentRadius.current *= 0.9;
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, [imagesLoaded]);

  useEffect(() => {
    const onMove = (e) => {
      const dx = e.clientX - prevPos.current.x, dy = e.clientY - prevPos.current.y;
      velocity.current = Math.min(Math.sqrt(dx*dx + dy*dy), 40);
      prevPos.current = { x: e.clientX, y: e.clientY };
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  /* stagger delays */
  const fade = (delay) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <>
      <div id="home" className="grid-bg" style={{ minHeight: '100vh', position: 'relative' }}>

        {/* ── Particles ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
              background: { color: { value: 'transparent' } },
              fpsLimit: 60,
              particles: {
                color: { value: ['#8b5cf6', '#06b6d4', '#ec4899'] },
                links: { enable: true, color: '#8b5cf6', distance: 120, opacity: 0.10, width: 1 },
                move: { enable: true, speed: 0.4, random: true, outModes: 'bounce' },
                number: { value: 45, density: { enable: true, area: 900 } },
                opacity: { value: { min: 0.08, max: 0.35 } },
                size: { value: { min: 1, max: 2 } },
              },
              interactivity: {
                events: { onHover: { enable: true, mode: 'repulse' }, onClick: { enable: true, mode: 'push' } },
                modes: { repulse: { distance: 80, duration: 0.4 }, push: { quantity: 2 } },
              },
              detectRetina: true,
            }}
          />
        </div>

        {/* ── Ambient glow ── */}
        <div style={{
          position: 'absolute', top: '15%', left: '5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
        }} />

        {/* ── IMAGE PANEL (unchanged) ── */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', top: 0, right: 0, width: '52%', height: '100%', zIndex: 1, cursor: 'none' }}
        >
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '45%', pointerEvents: 'none', background: 'linear-gradient(to right, #04040f, transparent)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '25%', pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent, #04040f)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '10%', pointerEvents: 'none', background: 'linear-gradient(to top, transparent, #04040f)' }} />
          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            style={{
              position: 'absolute', bottom: '22%', right: '8%',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '10px 16px',
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              color: 'var(--violet)', whiteSpace: 'nowrap',
              boxShadow: '0 8px 32px rgba(139,92,246,0.15)',
              zIndex: 3, backdropFilter: 'blur(12px)',
            }}
          >
            Got a project in mind? <a href="#contact" style={{ textDecoration: 'underline', color: 'var(--cyan)' }}>Let's talk!</a>
          </motion.div>
        </motion.div>

        {/* ── TEXT PANEL ── */}
        <div style={{
          position: 'relative', zIndex: 2,
          minHeight: '100vh',
          display: 'flex', alignItems: 'center',
          padding: '120px 48px 80px',
          maxWidth: 660,
        }}>
          <div style={{ width: '100%' }}>

          

            {/* name */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Bricolage Grotesque', var(--font-display), sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(52px, 8vw, 108px)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                color: '#e8e8f0',
                marginBottom: 8,
              }}
            >
              Issra
            </motion.h1>

            {/* surname — lighter weight, slightly muted */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Bricolage Grotesque', var(--font-display), sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(52px, 8vw, 108px)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                color: 'rgba(232,232,240,0.28)',
                marginBottom: 28,
                position: 'relative',
                overflow: 'hidden',
                display: 'inline-block',
              }}
            >
              Mrabet.
              {/* shimmer sweep stays — it's the one nice effect */}
              <motion.div
                initial={{ x: '-120%' }}
                animate={{ x: '220%' }}
                transition={{ delay: 1.2, duration: 1.1, ease: [0.4, 0, 0.2, 1], repeat: Infinity, repeatDelay: 4 }}
                style={{
                  position: 'absolute', top: 0, left: 0, width: '35%', height: '100%',
                  background: 'linear-gradient(105deg, transparent 20%, rgba(139,92,246,0.5) 45%, rgba(6,182,212,0.6) 55%, transparent 80%)',
                  pointerEvents: 'none', mixBlendMode: 'screen', filter: 'blur(5px)',
                }}
              />
            </motion.h1>

            {/* typewriter role */}
            <motion.div {...fade(0.58)} style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', marginBottom: 24 }}>
              <TypeWriter words={roles} />
            </motion.div>

            {/* bio — DM Sans, not mono */}
            <motion.p {...fade(0.72)} style={{
              fontFamily: "'DM Sans', var(--font-body), sans-serif",
              fontWeight: 300,
              color: 'rgba(255,255,255,0.38)',
              fontSize: '1rem',
              lineHeight: 1.85,
              maxWidth: 440,
              marginBottom: 44,
              letterSpacing: '0.01em',
            }}>
              1st-year Engineering student at ENISo. Building AI systems that see, understand, and act in the real world. Passionate about computer vision, deep learning, and full-stack development. Always eager to learn and create impactful projects.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fade(0.88)} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: '14px 32px', borderRadius: 100,
                  background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
                  border: 'none', color: '#fff',
                  fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: 'pointer', boxShadow: '0 0 30px var(--violet-glow)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 0 50px var(--violet-glow)'; }}
                onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 0 30px var(--violet-glow)'; }}
              >
                View Projects →
              </button>
              <a href="/cv_issra.pdf" download style={{
                padding: '14px 32px', borderRadius: 100,
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--muted)', fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--violet)'; e.target.style.color = 'var(--white)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)'; }}
              >
                Download CV ↓
              </a>
            </motion.div>

     

          </div>
        </div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          style={{
            position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 3,
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.25em' }}>SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: 1, height: 36, background: 'linear-gradient(180deg, var(--violet), transparent)' }}
          />
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        @media (max-width: 768px) {
          #home { min-height: auto !important; }
          #home > div[style*="position: relative"][style*="zIndex: 2"] {
            max-width: 100% !important;
            padding-top: 55vw !important;
            padding-bottom: 60px !important;
            text-align: center;
          }
          #home > div[style*="position: absolute"][style*="width: 52%"] {
            width: 100% !important;
            height: 50vw !important;
          }
        }
      `}</style>
    </>
  );
}