'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const MotionContext = createContext({ paused: true, reduced: false, focusView: false, exitFocus: () => {} });
export function useMotion() { return useContext(MotionContext); }

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [focusView, setFocusView] = useState(false);
  const pathname = usePathname();
  const reading = pathname.startsWith('/writing/');
  useEffect(() => { setFocusView(false); }, [pathname]);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    let stored = false;
    try { stored = localStorage.getItem('observatory-paused') === 'true'; } catch { /* Storage may be unavailable. */ }
    setPaused(query.matches || stored);
    setReady(true);
    const change = () => {
      setReduced(query.matches);
      if (query.matches) setPaused(true);
    };
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  const effectivePause = paused || reading;
  return <MotionContext value={{ paused: effectivePause, reduced, focusView, exitFocus: () => setFocusView(false) }}>
    <div className="observatory" data-paused={effectivePause} data-focus-view={focusView}>
      {children}
      <div className="motion-controls">
        <button type="button" aria-pressed={effectivePause} disabled={!ready || reading} onClick={() => {
          setPaused(!paused);
          try { localStorage.setItem('observatory-paused', String(!paused)); } catch { /* Preference remains in memory. */ }
        }}><span aria-hidden="true">{effectivePause ? '▷' : 'Ⅱ'}</span> {effectivePause ? 'Motion paused' : 'Pause motion'}</button>
        <button id="focus-view-toggle" type="button" disabled={!ready} aria-pressed={focusView} onClick={() => setFocusView(value => !value)}>{focusView ? 'Show text' : 'Hide text'}</button>
      </div>
    </div>
  </MotionContext>;
}

export function ReadingContent({ children }: { children: React.ReactNode }) {
  const { focusView } = useMotion();
  return <div className="reading-content" hidden={focusView} inert={focusView}>{children}</div>;
}
