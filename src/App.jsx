import { useState, useEffect, lazy, Suspense } from 'react';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';

// ── Critical sections load immediately ──────────────────────────────
import Hero from './components/Hero';
import About from './components/About';

// ── Heavy sections lazy-loaded → React Suspense ─────────────────────
// This keeps initial bundle small & fast. Three.js only loads when needed.
const Projects = lazy(() => import('./components/Projects'));
const Skills   = lazy(() => import('./components/Skills'));
const Contact  = lazy(() => import('./components/Contact'));
const Footer   = lazy(() => import('./components/Footer'));

// ── Thin section skeleton shown while lazy chunk loads ───────────────
function SectionFallback({ label }) {
  return (
    <div style={{
      minHeight: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.75rem',
      letterSpacing: '0.25em',
      color: 'var(--muted)',
      textTransform: 'uppercase',
    }}>
      <span style={{
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--violet)',
          boxShadow: '0 0 8px var(--violet)',
          animation: 'pulse 1.2s infinite',
          display: 'inline-block',
        }} />
        Loading {label}...
      </span>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  // Lenis ultra-smooth scroll — only after preloader done
  useEffect(() => {
    if (loading) return;
    let lenis;
    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.4,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
      });
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    });
    return () => { if (lenis) lenis.destroy(); };
  }, [loading]);

  return (
    <>
      <Cursor />
      <Preloader onDone={() => setLoading(false)} />

      {!loading && (
        <>
          <div className="scanline" />
          <Navbar />

          <main>
            {/* Immediately rendered — no lazy */}
            <Hero />
            <About />

            {/* Lazy-loaded with Suspense boundaries */}
            <Suspense fallback={<SectionFallback label="Projects" />}>
              <Projects />
            </Suspense>

            <Suspense fallback={<SectionFallback label="3D Skills" />}>
              <Skills />
            </Suspense>

            <Suspense fallback={<SectionFallback label="Contact" />}>
              <Contact />
            </Suspense>

            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </main>
        </>
      )}
    </>
  );
}