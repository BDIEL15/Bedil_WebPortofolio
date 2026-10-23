'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMotion } from '../motion-provider';
import type { WorkshopScene } from '@/lib/scene/create-workshop-scene';

type SceneStatus = 'poster' | 'loading' | 'ready' | 'fallback' | 'static';

export function SceneHost() {
  const id = useId();
  const pathname = usePathname();
  const { paused, focusView, exitFocus } = useMotion();
  const liveHost = useRef<HTMLDivElement>(null);
  const engine = useRef<WorkshopScene | null>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<SceneStatus>('poster');
  const [staticView, setStaticView] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [inspecting, setInspecting] = useState(false);
  const [exploring, setExploring] = useState(false);
  const activeInspection = inspecting;
  const latest = useRef({ paused, inspecting: activeInspection, exploring: exploring || focusView });
  latest.current = { paused, inspecting: activeInspection, exploring: exploring || focusView };
  useEffect(() => {
    try { setStaticView(localStorage.getItem('observatory-static') === 'true'); } catch { /* Storage is optional. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    setInspecting(false); setExploring(false);
  }, [pathname]);
  useEffect(() => {
    if (!ready) return;
    if (staticView) { setStatus('static'); return; }
    let cancelled = false;
    let owned: WorkshopScene | null = null;
    const controller = new AbortController();
    setStatus('loading');
    import('@/lib/scene/create-workshop-scene').then(async ({ createWorkshopScene }) => {
      if (cancelled || !liveHost.current) return;
      const created = await createWorkshopScene(liveHost.current, () => {
        owned = null; engine.current = null; setStatus('fallback'); setExploring(false);
      }, controller.signal);
      if (cancelled) { created.dispose(); return; }
      owned = created;
      engine.current = created;
      created.setPaused(latest.current.paused);
      created.setInspecting(latest.current.inspecting);
      created.setExploring(latest.current.exploring);
      if (engine.current === created) setStatus('ready');
    }).catch(() => { if (!cancelled) { setStatus('fallback'); setExploring(false); } });
    return () => { cancelled = true; controller.abort(); owned?.dispose(); engine.current = null; };
  }, [ready, staticView, attempt]);
  useEffect(() => { engine.current?.setPaused(paused); }, [paused]);
  useEffect(() => { engine.current?.setInspecting(activeInspection); }, [activeInspection]);
  useEffect(() => { engine.current?.setExploring(exploring || focusView); }, [exploring, focusView]);

  const interactive = status === 'ready';
  return <><aside className="scene" aria-label="Digital Observatory robotics workshop" data-state={status} data-inspecting={activeInspection} data-exploring={exploring || focusView} data-motion={paused ? 'paused' : 'playing'}>
    <div id={id} className="scene-art" tabIndex={interactive && (exploring || focusView) ? 0 : undefined}
      role="img" aria-label={exploring || focusView ? 'A robot arm on a laboratory workbench. Use left and right arrow keys to rotate; Escape exits exploration.' : 'A dim robotics workshop with an industrial arm, workbench and perspective floor.'}
      onKeyDown={event => {
        if (!exploring && !focusView) return;
        if (event.key === 'Escape') {
          setExploring(false);
          if (focusView) { exitFocus(); document.getElementById('focus-view-toggle')?.focus(); }
          else document.getElementById(id + '-explore')?.focus();
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); engine.current?.rotate(event.key === 'ArrowLeft' ? -1 : 1); }
      }}
      >
      <div className="scene-poster"><picture><source media="(max-width: 699px)" srcSet="/scene/workshop-mobile.webp" /><source media="(max-aspect-ratio: 11/10)" srcSet="/scene/workshop-tablet.webp" /><img src="/scene/workshop-desktop.webp" alt="" width="1440" height="1000" /></picture></div>
      <div className="scene-live" ref={liveHost} />
    </div>
    </aside>
    <div className="scene-caption">
      <div className="scene-heading"><p>Robotics study</p><span role="status">{status === 'fallback' || status === 'static' ? 'Static view' : 'Digital Observatory'}</span></div>
      <p className="scene-description">An illustrated workbench · <a href="/models/NOTICE-IRB52.txt">model credits</a></p>
      <div className="scene-actions">
        <button type="button" disabled={!interactive} aria-controls={id} aria-pressed={inspecting} onClick={() => setInspecting(value => !value)}>Inspect as ASCII <span aria-hidden="true">{inspecting ? '−' : '+'}</span></button>
        <button type="button" id={id + '-explore'} disabled={!interactive} aria-pressed={exploring} onClick={() => setExploring(value => !value)}>{exploring ? 'Exit exploration' : 'Explore view'}</button>
      </div>
      {exploring && <div className="view-controls"><p>Drag the scene, or use these controls.</p><div>
        <button type="button" aria-label="Rotate left" onClick={() => engine.current?.rotate(-1)}>←</button>
        <button type="button" onClick={() => engine.current?.reset()}>Reset view</button>
        <button type="button" aria-label="Rotate right" onClick={() => engine.current?.rotate(1)}>→</button>
      </div></div>}
      <button type="button" className="static-control" disabled={!ready} onClick={() => {
        setExploring(false);
        if (status === 'fallback') setAttempt(value => value + 1);
        else {
          const value = !staticView;
          setStaticView(value);
          try { localStorage.setItem('observatory-static', String(value)); } catch { /* Preference remains in memory. */ }
        }
      }}>{status === 'fallback' ? 'Try 3D again' : staticView ? 'Enable 3D' : 'Use static view'}</button>
    </div>
  </>;
}
