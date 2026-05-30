import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const socials = [
  {
    name: 'GitHub',
    url: 'https://github.com/IssraMrabet',
    color: '#f0f6ff',
    bg: 'linear-gradient(135deg, #24292e 0%, #0d1117 100%)',
    border: 'rgba(240,246,255,0.22)',
    label: '@IssraMrabet',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/issra-mrabet',
    color: '#fff',
    bg: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
    border: 'rgba(10,102,194,0.45)',
    label: 'Issra Mrabet',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/issra_mrabet/',
    color: '#fff',
    bg: 'linear-gradient(135deg, #833ab4 0%, #e1306c 55%, #f77737 100%)',
    border: 'rgba(225,48,108,0.38)',
    label: '@issra',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/issramrabet',
    color: '#fff',
    bg: 'linear-gradient(135deg, #1877f2 0%, #0d5bbf 100%)',
    border: 'rgba(24,119,242,0.4)',
    label: 'Issra Mrabet',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/21650437756',
    color: '#fff',
    bg: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
    border: 'rgba(37,211,102,0.38)',
    label: '+216 50 437 756',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    name: 'Email',
    url: 'mailto:issra.mrabet@eniso.u-sousse.tn',
    color: '#fff',
    bg: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    border: 'rgba(124,58,237,0.4)',
    label: 'issra.mrabet@...',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
];

// Cards are 150px wide, gap between centers ~115px so they overlap nicely
const fanPositions = [
  { rotate: -28, x: -290, y: 55 },
  { rotate: -14, x: -172, y: 12 },
  { rotate:  -4, x:  -60, y: -14 },
  { rotate:   4, x:   60, y: -14 },
  { rotate:  14, x:  172, y:  12 },
  { rotate:  28, x:  290, y:  55 },
];

// ── Particle background ───────────────────────────────────────────
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const pts = [];
    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 70; i++) {
      pts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.3,
        o: Math.random() * 0.35 + 0.08,
      });
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

// ── Main ─────────────────────────────────────────────────────────
export default function Contact() {
  const [hoveredId, setHoveredId] = useState(null);
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [message,   setMessage]   = useState('');
  const [sendState, setSendState] = useState('idle');

  function handleSend() {
    if (!name.trim() || !email.trim() || !message.trim()) { setSendState('error'); return; }
    setSendState('sending');
    setTimeout(() => {
      setSendState('sent');
      setName(''); setEmail(''); setMessage('');
    }, 1400);
  }

  return (
    <section
      id="contact"
      style={{
        padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px)',
        background: 'var(--bg-2)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      <Particles />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 28 }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--border)', maxWidth: 80 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.3em', color: 'var(--violet)', textTransform: 'uppercase' }}>
            03. Contact
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)', maxWidth: 80 }} />
        </motion.div>

    

        {/* ── Badge fan ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            position: 'relative',
            height: 340,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            marginBottom: 12,
            zIndex: 2,
          }}
        >
          {socials.map((s, i) => {
            const pos       = fanPositions[i];
            const isHovered = hoveredId === s.name;
            return (
              <motion.a
                key={s.name}
                href={s.url}
                target={s.name !== 'Email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredId(s.name)}
                onMouseLeave={() => setHoveredId(null)}
                initial={{ x: pos.x, y: pos.y, rotate: pos.rotate }}
                animate={{
                  x:      isHovered ? pos.x * 1.07 : pos.x,
                  y:      isHovered ? pos.y - 55    : pos.y,
                  rotate: isHovered ? pos.rotate * 0.25 : pos.rotate,
                  scale:  isHovered ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: 150,
                  height: 210,
                  borderRadius: 22,
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 14,
                  color: s.color,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  zIndex: isHovered ? 30 : i < 3 ? 6 - i : i,
                  boxShadow: isHovered
                    ? `0 30px 70px ${s.border}, 0 0 0 1px ${s.border}`
                    : '0 10px 36px rgba(0,0,0,0.5)',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
              >
                {s.icon}
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  opacity: 0.9,
                }}>
                  {s.name}
                </span>
                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'absolute',
                        bottom: -30,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6rem',
                        color: 'rgba(255,255,255,0.5)',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                      }}
                    >
                      {s.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.05 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(64px,9vw,130px)',
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            marginBottom: 24,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Find <span className="gradient-text">me on</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 540, margin: '0 auto 48px' }}
        >
          I’m always excited to meet new people, explore fresh ideas, and work on interesting projects. Reach out ! Let's connect and create something meaningful.
        </motion.p>

        {/* Message form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(139,92,246,0.22)',
            borderRadius: 22,
            padding: '28px 32px',
            maxWidth: 560,
            margin: '0 auto 24px',
            textAlign: 'left',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
            letterSpacing: '0.22em', color: 'var(--violet)',
            textTransform: 'uppercase', display: 'block', marginBottom: 16,
          }}>
            Send a message
          </span>

          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name" style={inputStyle}
            />
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Your email" type="email"
              style={{ ...inputStyle, flex: 1.4 }}
            />
          </div>

          <textarea
            value={message} onChange={e => setMessage(e.target.value)}
            placeholder="What are you working on?" rows={3}
            style={{ ...inputStyle, resize: 'none', width: '100%' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: statusColor(sendState) }}>
              {statusText(sendState)}
            </span>
            <button
              onClick={handleSend}
              disabled={sendState === 'sending' || sendState === 'sent'}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                border: 'none', borderRadius: 10, color: '#fff',
                padding: '11px 26px', fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em',
                cursor: sendState === 'sent' ? 'default' : 'pointer',
                opacity: sendState === 'sending' ? 0.7 : 1,
                transition: 'opacity 0.15s, transform 0.1s',
              }}
            >
              {sendState === 'sending' ? 'Sending…' : sendState === 'sent' ? '✓ Sent!' : 'Send →'}
            </button>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--muted)' }}
        >
           Sousse, Tunisia · +216 97 095 046
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>
    </section>
  );
}

const inputStyle = {
  flex: 1,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(139,92,246,0.18)',
  borderRadius: 10,
  color: 'var(--text)',
  padding: '10px 14px',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s',
};

function statusText(s) {
  if (s === 'error')   return '⚠ Please fill all fields.';
  if (s === 'sending') return 'Sending to issra.mrabet@eniso…';
  if (s === 'sent')    return '✅ Message delivered!';
  return '';
}

function statusColor(s) {
  if (s === 'error') return '#f59e0b';
  if (s === 'sent')  return '#34d399';
  return 'var(--violet)';
}