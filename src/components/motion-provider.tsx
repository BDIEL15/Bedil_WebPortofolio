'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const MotionContext = createContext({ paused: true });
export function useMotion() { return useContext(MotionContext); }

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(true);
  const pathname = usePathname();
  const reading = pathname.startsWith('/writing/');
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stored = false;
    try { stored = localStorage.getItem('observatory-paused') === 'true'; } catch { /* Storage may be unavailable. */ }
    setPaused(query.matches || stored);
    const change = () => { if (query.matches) setPaused(true); };
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  const effectivePause = paused || reading;
  return <MotionContext value={{ paused: effectivePause }}>
    <div className="observatory" data-paused={effectivePause}>
      {children}
      <div className="motion-controls">
        <button type="button" aria-pressed={effectivePause} disabled={reading} onClick={() => {
          setPaused(!paused);
          try { localStorage.setItem('observatory-paused', String(!paused)); } catch { /* Preference remains in memory. */ }
        }}><span aria-hidden="true">{effectivePause ? '▷' : 'Ⅱ'}</span> {effectivePause ? 'Motion paused' : 'Pause motion'}</button>
      </div>
    </div>
  </MotionContext>;
}
