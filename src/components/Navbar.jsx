import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const links = ['Home', 'About', 'Projects', 'Skills', 'Contact'];

/* ── animated particle canvas ── */
function ParticleField({ canvasEl }) {
  useEffect(() => {
    if (!canvasEl) return;
    const W = canvasEl.offsetWidth;
    const H = canvasEl.offsetHeight;
    canvasEl.width  = W;
    canvasEl.height = H;
    const ctx = canvasEl.getContext('2d');

    const nodes = Array.from({ length: 32 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  1.2 + Math.random() * 1.4,
      pulse: Math.random() * Math.PI * 2,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 90) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(139,92,246,${0.45 * (1 - d / 90)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      nodes.forEach(n => {
        n.pulse += 0.03;
        const glow = 0.5 + 0.5 * Math.sin(n.pulse);
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (1 + 0.3 * glow), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${0.5 + 0.3 * glow})`; ctx.fill();
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [canvasEl]);
  return null;
}

/* ── tilt-on-hover card wrapper ── */
function TiltCard({ children, style, ...rest }) {
  const ref   = useRef(null);
  const rotX  = useMotionValue(0);
  const rotY  = useMotionValue(0);
  const sX    = useSpring(rotX, { stiffness: 260, damping: 22 });
  const sY    = useSpring(rotY, { stiffness: 260, damping: 22 });

  const onMove = (e) => {
    const r  = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left)  / r.width  - 0.5;
    const ny = (e.clientY - r.top)   / r.height - 0.5;
    rotX.set(-ny * 12);
    rotY.set( nx * 12);
  };
  const onLeave = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ ...style, rotateX: sX, rotateY: sY, transformStyle: 'preserve-3d', perspective: 600 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ── flag image with shimmer fallback ── */
function FlagImage({ src, alt, accent }) {
  const [loaded, setLoaded] = useState(false);
  const [error,  setError]  = useState(false);

  return (
    <div style={{
      width: 52, height: 36,
      borderRadius: 8,
      overflow: 'hidden',
      border: `1.5px solid ${accent}50`,
      flexShrink: 0,
      position: 'relative',
      background: !loaded && !error
        ? `linear-gradient(90deg, ${accent}15, ${accent}30, ${accent}15)`
        : error
        ? `${accent}20`
        : 'transparent',
      boxShadow: `0 2px 12px ${accent}30`,
    }}>
      {!error && (
        <img
          src={src} alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />
      )}
      {error && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
          letterSpacing: '0.12em', color: accent, opacity: 0.7,
        }}>
          {alt.toUpperCase()}
        </div>
      )}
    </div>
  );
}

/* ── dodge card wrapper ── */
function DodgeCard({ children, mousePos, style, label, labelSide = 'right' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18 });
  const sy = useSpring(y, { stiffness: 180, damping: 18 });
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const REPEL_RADIUS = 100;
    const MAX_SHIFT    = 170;

    const rect = ref.current.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = mousePos.x - cx;
    const dy   = mousePos.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < REPEL_RADIUS && dist > 0) {
      const force = 1 - dist / REPEL_RADIUS;
      const push  = force * MAX_SHIFT;
      x.set(-(dx / dist) * push);
      y.set(-(dy / dist) * push);
      setShowLabel(force > 0.3);
    } else {
      x.set(0);
      y.set(0);
      setShowLabel(false);
    }
  }, [mousePos, x, y]);

  return (
    <motion.div ref={ref} style={{ ...style, x: sx, y: sy, position: 'relative' }}>
      {children}
      {showLabel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: '50%', transform: 'translateY(-50%)',
            [labelSide === 'right' ? 'left' : 'right']: 'calc(100% + 10px)',
            fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
            letterSpacing: '0.15em', whiteSpace: 'nowrap',
            color: 'rgba(139,92,246,0.55)',
            pointerEvents: 'none',
          }}
        >
          {label}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [resumeOpen,  setResumeOpen]  = useState(false);
  const [activeLink,  setActiveLink]  = useState(null);
  const [netCanvas,   setNetCanvas]   = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [mousePos,    setMousePos]    = useState({ x: -9999, y: -9999 });
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setResumeOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  /* track mouse globally so cards dodge even before hovering them directly */
  useEffect(() => {
    const onMove  = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const onLeave = ()  => setMousePos({ x: -9999, y: -9999 });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleDownload = (lang) => {
    setDownloading(lang);
    setTimeout(() => setDownloading(null), 2200);
  };

  const cvOptions = [
    {
      lang: 'French',
      label: 'cv',
      sub: 'Version française',
      file: '/cv_issra.pdf',
      flag: '/fr.png',
      accent: '#8b5cf6',
      accentAlt: '#a78bfa',
      bars: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
      dodgeLabel: 'catch me if you can →',
      labelSide: 'right',
    },
    {
      lang: 'English',
      label: 'Resume',
      sub: 'English version',
      file: '/Issra_Mrabet_CV_EN.pdf',
      flag: '/eng.png',
      accent: '#06b6d4',
      accentAlt: '#22d3ee',
      bars: ['#06b6d4', '#22d3ee', '#67e8f9'],
      dodgeLabel: '← catch me if you can',
      labelSide: 'left',
    },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          padding: '0 40px', height: 70,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          background: scrolled ? 'rgba(4,4,15,0.85)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(139,92,246,0.12)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        {/* ── Logo ── */}
        <motion.div
          onClick={() => scrollTo('home')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.06em',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, var(--violet) 0%, var(--cyan) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            position: 'relative',
          }}
        >
          IM
          <motion.div style={{
            position: 'absolute', bottom: -2, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, var(--violet), var(--cyan))',
            borderRadius: 2, opacity: 0.5,
          }} />
        </motion.div>

        {/* ── Desktop Links ── */}
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {links.map((l, i) => (
            <motion.button
              key={l}
              onClick={() => scrollTo(l)}
              onHoverStart={() => setActiveLink(l)}
              onHoverEnd={() => setActiveLink(null)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1,  y: 0 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: [0.16,1,0.3,1] }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: '0.76rem',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: activeLink === l ? 'var(--white)' : 'var(--muted)',
                transition: 'color 0.2s',
                position: 'relative', padding: '4px 0',
              }}
            >
              {l}
              <motion.div
                animate={{ scaleX: activeLink === l ? 1 : 0, opacity: activeLink === l ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', bottom: -1, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg, var(--violet), var(--cyan))',
                  transformOrigin: 'left',
                }}
              />
            </motion.button>
          ))}

          {/* ── Resume Pill + Dropdown ── */}
          <div ref={dropRef} style={{ position: 'relative' }}>
            <motion.button
              onClick={() => setResumeOpen(v => !v)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.74rem',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '9px 22px', borderRadius: 100,
                border: `1px solid ${resumeOpen ? 'var(--cyan)' : 'var(--violet)'}`,
                color: resumeOpen ? 'var(--cyan)' : 'var(--violet)',
                background: resumeOpen
                  ? 'rgba(6,182,212,0.07)'
                  : 'rgba(139,92,246,0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: resumeOpen
                  ? '0 0 20px rgba(6,182,212,0.15)'
                  : '0 0 20px rgba(139,92,246,0.1)',
              }}
            >
              Resume
              <motion.span
                animate={{ rotate: resumeOpen ? 180 : 0 }}
                transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
                style={{ display: 'inline-block', fontSize: '0.55rem', lineHeight: 1 }}
              >▼</motion.span>
            </motion.button>

            <AnimatePresence>
              {resumeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -16, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0,   scale: 1    }}
                  exit={{    opacity: 0, y: -16, scale: 0.94 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 14px)', right: 0,
                    width: 310, borderRadius: 20,
                    /* overflow:hidden removed so dodging cards aren't clipped */
                    overflow: 'visible',
                    background: 'rgba(6,5,20,0.97)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    boxShadow: '0 28px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.05), 0 0 60px rgba(139,92,246,0.07)',
                  }}
                >
                  {/* particle header — needs its own overflow:hidden */}
                  <div style={{ position: 'relative', height: 80, overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                    <canvas
                      ref={el => { if (el && el !== netCanvas) setNetCanvas(el); }}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                    />
                    {netCanvas && <ParticleField canvasEl={netCanvas} />}
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 3,
                    }}>
                      <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '0.8rem',
                        letterSpacing: '0.3em', textTransform: 'uppercase',
                        color: 'rgba(200,180,255,0.9)',
                      }}>
                        Download CV
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                        letterSpacing: '0.2em', color: 'rgba(139,92,246,0.5)',
                      }}>
                        SELECT YOUR LANGUAGE
                      </div>
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: 32,
                      background: 'linear-gradient(transparent, rgba(6,5,20,0.97))',
                    }} />
                  </div>

                  <div style={{ height: 1, background: 'rgba(139,92,246,0.1)', margin: '0 18px' }} />

                  {/* CV Cards */}
                  <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {cvOptions.map((cv, idx) => (
                      <DodgeCard
                        key={cv.lang}
                        mousePos={mousePos}
                        label={cv.dodgeLabel}
                        labelSide={cv.labelSide}
                        style={{ borderRadius: 14 }}
                      >
                        <TiltCard style={{ borderRadius: 14 }}>
                          <motion.a
                            href={cv.file}
                            download
                            onClick={() => { handleDownload(cv.lang); setResumeOpen(false); }}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.08, duration: 0.35, ease: [0.16,1,0.3,1] }}
                            whileHover={{ backgroundColor: `${cv.accent}14` }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 14,
                              padding: '14px 16px',
                              borderRadius: 14,
                              background: `${cv.accent}09`,
                              border: `1px solid ${cv.accent}22`,
                              textDecoration: 'none',
                              cursor: 'pointer',
                              transition: 'border-color 0.25s, background 0.25s',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = `${cv.accent}55`}
                            onMouseLeave={e => e.currentTarget.style.borderColor = `${cv.accent}22`}
                          >
                            <div style={{
                              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                              background: `linear-gradient(90deg, transparent, ${cv.accent}60, transparent)`,
                            }} />

                            <motion.div
                              whileHover={{ scale: 1.08, rotateZ: -2 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                            >
                              <FlagImage src={cv.flag} alt={cv.lang} accent={cv.accent} />
                            </motion.div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.05rem',
                                letterSpacing: '0.04em',
                                color: cv.accentAlt,
                                marginBottom: 2,
                              }}>
                                {cv.label}
                              </div>
                              <div style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.6rem',
                                letterSpacing: '0.1em',
                                color: 'var(--muted)',
                                marginBottom: 8,
                              }}>
                                {cv.sub}
                              </div>
                              <div style={{ display: 'flex', gap: 3 }}>
                                {cv.bars.map((b, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.15 + i * 0.07, duration: 0.4, ease: [0.16,1,0.3,1] }}
                                    style={{
                                      height: 3,
                                      borderRadius: 2,
                                      background: b,
                                      width: i === 0 ? 28 : i === 1 ? 18 : 12,
                                      transformOrigin: 'left',
                                      opacity: 0.7,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>

                            <motion.div
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.92 }}
                              style={{
                                width: 32, height: 32,
                                borderRadius: '50%',
                                background: `${cv.accent}18`,
                                border: `1px solid ${cv.accent}45`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: cv.accentAlt,
                                fontSize: '0.9rem',
                                flexShrink: 0,
                                transition: 'background 0.2s, border-color 0.2s',
                              }}
                            >
                              {downloading === cv.lang ? (
                                <motion.span
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                  style={{ display: 'inline-block', fontSize: '0.7rem' }}
                                >
                                  ◌
                                </motion.span>
                              ) : (
                                <motion.span
                                  animate={{ y: [0, 2, 0] }}
                                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                                >
                                  ↓
                                </motion.span>
                              )}
                            </motion.div>
                          </motion.a>
                        </TiltCard>
                      </DodgeCard>
                    ))}
                  </div>

                  <div style={{
                    padding: '0 18px 14px',
                    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                    letterSpacing: '0.12em', textAlign: 'center',
                    color: 'rgba(139,92,246,0.3)',
                  }}>
                    PDF · Last updated 2025
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile Hamburger ── */}
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', flexDirection: 'column', gap: 5 }}
          className="hamburger"
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{
                rotate:    menuOpen ? (i === 0 ? 45  : i === 2 ? -45 : 0) : 0,
                y:         menuOpen ? (i === 0 ? 7   : i === 2 ? -7  : 0) : 0,
                opacity:   menuOpen && i === 1 ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
              style={{ width: 22, height: 2, background: 'var(--white)', borderRadius: 2 }}
            />
          ))}
        </motion.button>
      </motion.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
            style={{
              position: 'fixed', top: 70, left: 0, right: 0,
              background: 'rgba(4,4,15,0.97)', backdropFilter: 'blur(24px)',
              zIndex: 999, padding: '28px 40px',
              display: 'flex', flexDirection: 'column', gap: 20,
              borderBottom: '1px solid rgba(139,92,246,0.15)',
            }}
          >
            {links.map((l, i) => (
              <motion.button
                key={l}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => scrollTo(l)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'var(--font-mono)', fontSize: '1rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                {l}
              </motion.button>
            ))}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {cvOptions.map(cv => (
                <a key={cv.lang} href={cv.file} download style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 16px', borderRadius: 100,
                  border: `1px solid ${cv.accent}40`,
                  color: cv.accentAlt,
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                  textDecoration: 'none', letterSpacing: '0.1em',
                  background: `${cv.accent}08`,
                }}>
                  <img src={cv.flag} alt={cv.lang} style={{ width: 20, height: 14, borderRadius: 3, objectFit: 'cover' }} />
                  {cv.lang} ↓
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          nav > div:nth-child(2) { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}