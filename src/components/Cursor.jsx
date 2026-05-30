import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 20}px, ${ring.current.y - 20}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    const onEnterLink = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '60px';
        ringRef.current.style.height = '60px';
        ringRef.current.style.borderColor = 'var(--cyan)';
        ringRef.current.style.mixBlendMode = 'difference';
      }
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };
    const onLeaveLink = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '40px';
        ringRef.current.style.height = '40px';
        ringRef.current.style.borderColor = 'var(--violet)';
        ringRef.current.style.mixBlendMode = 'normal';
      }
      if (dotRef.current) dotRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(animate);

    const links = document.querySelectorAll('a, button, .project-card, .magnetic-btn');
    links.forEach(l => {
      l.addEventListener('mouseenter', onEnterLink);
      l.addEventListener('mouseleave', onLeaveLink);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--violet)',
          pointerEvents: 'none',
          zIndex: 99999,
          boxShadow: '0 0 10px var(--violet-glow)',
          transition: 'opacity 0.2s ease',
        }}
      />
      {/* Trailing ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid var(--violet)',
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: 0.6,
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease',
        }}
      />
    </>
  );
}
