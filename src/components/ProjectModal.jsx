import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-card"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          style={{ borderColor: project.color + '40' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--muted)',
              fontSize: '1rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.color = 'var(--white)'; e.target.style.borderColor = 'var(--violet)'; }}
            onMouseLeave={e => { e.target.style.color = 'var(--muted)'; e.target.style.borderColor = 'var(--border)'; }}
          >
            ✕
          </button>

          {/* Icon + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: project.glow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              border: `1px solid ${project.color}40`,
            }}>
              {project.icon}
            </div>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                letterSpacing: '0.03em',
                color: project.color,
              }}>
                {project.title}
              </h3>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                {project.subtitle}
              </div>
            </div>
          </div>

          {project.badge && (
            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: 100,
              background: `${project.color}20`,
              border: `1px solid ${project.color}50`,
              color: project.color,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              marginBottom: 24,
            }}>
              {project.badge}
            </div>
          )}

          <div style={{ height: 1, background: 'var(--border)', margin: '24px 0' }} />

          <p style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '1rem', marginBottom: 32 }}>
            {project.description}
          </p>

          {/* Tech stack */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase' }}>
              Tech Stack
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {project.tech.map(t => (
                <span key={t} style={{
                  padding: '5px 12px',
                  borderRadius: 100,
                  background: `${project.color}15`,
                  border: `1px solid ${project.color}40`,
                  color: project.color,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* GitHub button */}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 28px',
              borderRadius: 100,
              background: 'transparent',
              border: `1px solid ${project.color}`,
              color: project.color,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = project.color;
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = `0 0 30px ${project.glow}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = project.color;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
