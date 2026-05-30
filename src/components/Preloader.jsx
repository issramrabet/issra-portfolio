import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => {
        if (c >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setTimeout(onDone, 600);
          }, 300);
          return 100;
        }
        return c + Math.floor(Math.random() * 8) + 1;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg)',
            zIndex: 100000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
          }}
        >
          {/* Initials */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(80px, 15vw, 140px)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            IM
          </motion.div>

          {/* Count */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--muted)',
            letterSpacing: '0.2em',
          }}>
            {String(count).padStart(3, '0')}
          </div>

          {/* Progress bar */}
          <div style={{
            width: 200,
            height: 1,
            background: 'var(--surface-2)',
            borderRadius: 1,
            overflow: 'hidden',
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--violet), var(--cyan))',
                originX: 0,
              }}
              animate={{ width: `${count}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
