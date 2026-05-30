export default function Footer() {
  return (
    <footer style={{
      padding: '32px clamp(24px, 5vw, 80px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16,
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        IM
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        letterSpacing: '0.1em',
        color: 'var(--muted)',
      }}>
        © 2026 Issra Mrabet · All rights reserved 
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        letterSpacing: '0.1em',
        color: 'var(--muted)',
      }}>
        
      </div>
    </footer>
  );
}
