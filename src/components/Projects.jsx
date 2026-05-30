import { useState, useRef, useCallback, useEffect } from 'react';
import { projects } from '../data/projects';
import ProjectModal from './ProjectModal';

/* ─────────────────────────────────────────────
   3-D FOLDER CARD
   Z-layer stack (translateZ):
     0px  → back wall (deepest, folder rear)
     4–10px → papers (inside the folder cavity)
     20px → front face (covers paper bottoms)
     20px → tab
     22px → content card (floats on front face)
   Papers peek ABOVE the folder opening on hover.
───────────────────────────────────────────── */

const FOLDER_COLORS = [
  { body: '#6c3fc8', dark: '#4a28a0', side: '#62528e', tab: '#8a5de0', shine: '#b090f0', shadow: 'rgba(80,30,200,0.4)' },
  { body: '#1e5ec4', dark: '#1244a0', side: '#0a2e80', tab: '#3ae0c4', shine: '#7ab4f8', shadow: 'rgba(18,56,200,0.4)' },
  { body: '#14167a', dark: '#0a6ca1', side: '#063c2e', tab: '#ad72e1', shine: '#e0cff0', shadow: 'rgba(8,100,78,0.4)' },
  { body: '#8030b0', dark: '#601890', side: '#440870', tab: '#aa50d0', shine: '#d080f8', shadow: 'rgba(110,20,190,0.4)' },
];

const PAPER_SETS = [
  ['#ede4ff', '#e0d2fc', '#d0bcf8'],
  ['#deeaff', '#ccdaf8', '#b8c8f0'],
  ['#d8f5ec', '#c0ecda', '#a4e0c4'],
  ['#f0e0ff', '#e4ccf8', '#d4b0f4'],
];

/* Individual paper sheet */
function Paper({ color, left, width, zDepth, restTop, hoverTop, hovered, delay }) {
  const lines = [26, 40, 54, 68, 82];
  return (
    <div
      style={{
        position: 'absolute',
        left,
        width,
        top: hovered ? hoverTop : restTop,
        height: 115,
        background: color,
        borderRadius: '7px 7px 0 0',
        transform: `translateZ(${zDepth}px)`,
        transition: `top 0.42s cubic-bezier(0.34, 1.5, 0.64, 1) ${delay}ms`,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* ruled lines */}
      {lines.map(y => (
        <div
          key={y}
          style={{
            position: 'absolute',
            top: y,
            left: 12,
            right: 12,
            height: 1.5,
            borderRadius: 2,
            background: 'rgba(80,50,160,0.1)',
          }}
        />
      ))}
      {/* header squiggle */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: '30%',
          height: 8,
          borderRadius: 3,
          background: 'rgba(70,40,160,0.12)',
        }}
      />
    </div>
  );
}

function FolderCard({ project, colorIdx = 0, onClick }) {
  const folderRef = useRef(null);
  const rafRef    = useRef(null);
  const [hovered, setHovered] = useState(false);
  const c      = FOLDER_COLORS[colorIdx % FOLDER_COLORS.length];
  const papers = PAPER_SETS[colorIdx % PAPER_SETS.length];

  /* paper definitions: [left, width, zDepth, restTop, hoverTop, delay] */
  const paperDefs = [
    { left: '14%', width: '30%', zDepth: 4,  restTop: 30,  hoverTop: -55, delay: 0   },
    { left: '34%', width: '32%', zDepth: 7,  restTop: 35,  hoverTop: -68, delay: 55  },
    { left: '57%', width: '26%', zDepth: 10, restTop: 28,  hoverTop: -48, delay: 110 },
  ];

  const onEnter = useCallback(() => setHovered(true), []);

  const onLeave = useCallback(() => {
    setHovered(false);
    cancelAnimationFrame(rafRef.current);
    if (folderRef.current) {
      folderRef.current.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      folderRef.current.style.transform  = 'rotateX(6deg) rotateY(0deg)';
    }
  }, []);

  const onMove = useCallback((e) => {
    if (!folderRef.current) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const r  = folderRef.current.parentElement.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width  - 0.5;
      const ny = (e.clientY - r.top)  / r.height - 0.5;
      folderRef.current.style.transition = 'transform 0.05s linear';
      folderRef.current.style.transform  = `rotateX(${6 - ny * 18}deg) rotateY(${nx * 18}deg)`;
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      style={{ perspective: '1100px', perspectiveOrigin: '50% 38%', cursor: 'pointer' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      onClick={onClick}
    >
      {/* ── FOLDER ROOT ── */}
      <div
        ref={folderRef}
        style={{
          position: 'relative',
          width: '100%',
          height: 320,
          transformStyle: 'preserve-3d',
          transform: 'rotateX(6deg) rotateY(0deg)',
          transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
        }}
      >

        {/* ① BACK WALL — translateZ: 0, deepest layer */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0, top: 26, bottom: 0,
          borderRadius: '4px 14px 14px 14px',
          background: c.dark,
          transform: 'translateZ(0px)',
        }} />

        {/* ① SIDE EXTRUSIONS — give thickness illusion */}
        <div style={{
          position: 'absolute',
          top: 26, right: -16,
          width: 16, bottom: 0,
          background: c.side,
          transform: 'rotateY(90deg)',
          transformOrigin: 'left center',
          borderRadius: '0 5px 5px 0',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -16, left: 0,
          width: '100%', height: 16,
          background: c.side,
          transform: 'rotateX(-90deg)',
          transformOrigin: 'top center',
          borderRadius: '0 0 8px 8px',
        }} />

        {/* ② PAPERS — translateZ: 4–10px, INSIDE the folder (between back wall and front face) */}
        {paperDefs.map((pd, i) => (
          <Paper
            key={i}
            color={papers[i]}
            left={pd.left}
            width={pd.width}
            zDepth={pd.zDepth}
            restTop={pd.restTop}
            hoverTop={pd.hoverTop}
            hovered={hovered}
            delay={pd.delay}
          />
        ))}

        {/* ③ FRONT FACE — translateZ: 20px — IN FRONT of papers, covers their bottoms */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0, top: 26, bottom: 0,
          borderRadius: '4px 14px 14px 14px',
          background: `linear-gradient(150deg, ${c.body} 0%, ${c.dark} 100%)`,
          transform: 'translateZ(20px)',
          overflow: 'hidden',
        }}>
          {/* subtle vertical ridges texture */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px)',
          }} />
          {/* gloss sweep */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: '72%', height: '52%',
            background: `radial-gradient(ellipse at 28% 18%, ${c.shine}44 0%, transparent 62%)`,
            pointerEvents: 'none',
          }} />
          {/* bottom shimmer */}
          <div style={{
            position: 'absolute', bottom: 0, left: '10%', right: '10%',
            height: 2,
            background: `${c.shine}20`,
            borderRadius: 2,
          }} />
        </div>

        {/* ③ TAB SIDE DEPTH */}
        <div style={{
          position: 'absolute',
          top: 5, left: 16,
          width: '42%', height: 30,
          borderRadius: '10px 10px 0 0',
          background: c.side,
          transform: 'translateZ(4px)',
          opacity: 0.7,
        }} />

        {/* ③ TAB — same z as front face */}
        <div style={{
          position: 'absolute',
          top: 0, left: 16,
          width: '42%', height: 30,
          borderRadius: '10px 10px 0 0',
          background: `linear-gradient(130deg, ${c.tab} 0%, ${c.body} 100%)`,
          transform: 'translateZ(20px)',
          overflow: 'hidden',
          boxShadow: `inset 0 1px 0 ${c.shine}50`,
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 55%)',
          }} />
        </div>

        {/* ④ CONTENT CARD — translateZ: 22px, floats above front face; rises on hover */}
        <div style={{
          position: 'absolute',
          left: 14, right: 14,
          top: 42, bottom: 13,
          borderRadius: 9,
          background: 'rgba(255,255,255,0.1)',
          padding: '13px 12px 11px',
          display: 'flex',
          flexDirection: 'column',
          transform: hovered ? 'translateZ(38px)' : 'translateZ(22px)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1)',
        }}>
          {/* icon */}
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', marginBottom: 9, flexShrink: 0,
          }}>
            {project.icon}
          </div>

          {/* badge */}
          {project.badge && (
            <div style={{
              display: 'inline-block',
              padding: '2px 7px', borderRadius: 100,
              background: 'rgba(255,255,255,0.13)',
              border: '1px solid rgba(255,255,255,0.26)',
              color: 'rgba(230,218,255,0.9)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.53rem', letterSpacing: '0.14em',
              marginBottom: 6, width: 'fit-content',
            }}>
              {project.badge}
            </div>
          )}

          {/* title */}
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem', lineHeight: 1.05,
            color: '#fff', margin: '0 0 2px',
            textShadow: '0 1px 8px rgba(40,10,140,0.5)',
          }}>
            {project.title}
          </h3>

          {/* subtitle */}
          <p style={{
            color: 'rgba(198,180,255,0.85)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem', letterSpacing: '0.08em',
            marginBottom: 7,
          }}>
            {project.subtitle}
          </p>

          {/* description */}
          <p style={{
            color: 'rgba(222,212,255,0.75)',
            fontSize: '0.73rem', lineHeight: 1.6,
            flex: 1, overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}>
            {project.description}
          </p>

          {/* tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 9 }}>
            {project.tech.slice(0, 3).map(t => (
              <span key={t} style={{
                padding: '2px 7px', borderRadius: 100,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(218,208,255,0.9)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.53rem', letterSpacing: '0.05em',
              }}>
                {t}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span style={{
                padding: '2px 7px', borderRadius: 100,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(200,190,255,0.8)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.53rem',
              }}>
                +{project.tech.length - 3}
              </span>
            )}
          </div>

          {/* open hint */}
          <div style={{
            marginTop: 8,
            color: 'rgba(200,185,255,0.85)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.56rem', letterSpacing: '0.12em',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.25s',
          }}>
            Open case study →
          </div>
        </div>

        {/* ground shadow */}
        <div style={{
          position: 'absolute',
          bottom: hovered ? -28 : -14,
          left: '7%', right: '7%',
          height: 22,
          background: c.shadow,
          filter: 'blur(15px)',
          borderRadius: '50%',
          opacity: hovered ? 0.38 : 0.65,
          transition: 'bottom 0.4s ease, opacity 0.4s ease',
          pointerEvents: 'none',
          transform: 'translateZ(-20px)',
        }} />
      </div>
    </div>
  );
}

/* ─── SECTION ─── */
export default function Projects() {
  const [selected, setSelected] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 100);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)', background: 'var(--bg-2)' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            color: 'var(--violet)',
            textTransform: 'uppercase',
          }}>
            01. Projects
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)', maxWidth: 80 }} />
        </div>

        <h2 className="reveal" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(42px, 6vw, 72px)',
          lineHeight: 0.95,
          letterSpacing: '-0.01em',
          marginBottom: 16,
        }}>
          Things I've <span className="gradient-text">Built</span>
        </h2>

        <p className="reveal" style={{ color: 'var(--muted)', fontSize: '1rem', marginBottom: 64, maxWidth: 560 }}>
          Hover to open. Click to explore.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 44,
        }}>
          {projects.map((project, i) => (
            <div key={project.id} className="reveal">
              <FolderCard
                project={project}
                colorIdx={i}
                onClick={() => setSelected(project)}
              />
            </div>
          ))}

          {/* placeholder */}
          <div
            style={{
              height: 320,
              border: '2px dashed var(--border)',
              borderRadius: 18,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              opacity: 0.28,
              transition: 'opacity 0.2s',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              color: 'var(--muted)',
              textAlign: 'center',
              cursor: 'default',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.55')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.28')}
          >
            <span style={{ fontSize: '1.8rem' }}>＋</span>
            <span>More projects<br />coming soon</span>
          </div>
        </div>
      </div>

      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}