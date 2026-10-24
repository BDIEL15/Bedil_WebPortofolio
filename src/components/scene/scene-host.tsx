'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMotion } from '../motion-provider';
import type { PersonalLabScene } from '@/lib/scene/create-personal-lab-scene';
import { labPoster, labViewForPath } from '@/lib/scene/lab-camera';

type SceneStatus = 'poster' | 'loading' | 'ready' | 'fallback' | 'static';

export function SceneHost() {
  const id = useId();
  const pathname = usePathname();
  const { paused, reduced, focusView, exitFocus } = useMotion();
  const view=labViewForPath(pathname);
  const poster=labPoster(view,focusView);
  const liveHost = useRef<HTMLDivElement>(null);
  const engine = useRef<PersonalLabScene | null>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<SceneStatus>('poster');
  const [staticView, setStaticView] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [exploring, setExploring] = useState(false);
  const exploration = exploring || focusView;
  const latest = useRef({ paused: paused || reduced, view, overview: focusView, exploring: exploration });
  latest.current = { paused: paused || reduced, view, overview: focusView, exploring: exploration };
  useEffect(() => {
    try { setStaticView(localStorage.getItem('observatory-static') === 'true'); } catch { /* Storage is optional. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    setExploring(false);
  }, [pathname]);
  useEffect(() => { setExploring(false); }, [focusView]);
  useEffect(() => {
    if (!ready) return;
    if (staticView) { setStatus('static'); return; }
    let cancelled = false;
    let owned: PersonalLabScene | null = null;
    const controller = new AbortController();
    setStatus('loading');
    import('@/lib/scene/create-personal-lab-scene').then(async ({ createPersonalLabScene }) => {
      if (cancelled || !liveHost.current) return;
      const created = await createPersonalLabScene(liveHost.current, () => {
        owned = null; engine.current = null; setStatus('fallback'); setExploring(false);
      }, controller.signal, latest.current);
      if (cancelled) { created.dispose(); return; }
      owned = created;
      engine.current = created;
      created.setPaused(latest.current.paused);
      created.setView(latest.current.view, latest.current.overview);
      created.setExploring(latest.current.exploring);
      if (engine.current === created) setStatus('ready');
    }).catch(() => { if (!cancelled) { setStatus('fallback'); setExploring(false); } });
    return () => { cancelled = true; controller.abort(); owned?.dispose(); engine.current = null; };
  }, [ready, staticView, attempt]);
  useEffect(() => { engine.current?.setPaused(paused || reduced); }, [paused, reduced]);
  useEffect(() => { engine.current?.setView(view, focusView); }, [view, focusView]);
  useEffect(() => { engine.current?.setExploring(exploration); }, [exploration]);

  const interactive = status === 'ready';
  return <><aside className="scene" aria-label="Personal electronics lab" data-state={status} data-exploring={interactive && exploration} data-motion={paused || reduced ? 'paused' : 'interactive'}>
    <div id={id} className="scene-art" tabIndex={interactive && exploration ? 0 : undefined}
      role="img" aria-label={exploration ? 'Electronics lab. Drag or use left and right arrow keys to rotate; Escape returns to reading.' : view==='about'?'An illustrated reading desk with an open notebook, books, pencil and warm task lamp.':view==='experience'?'An illustrated documentation pegboard with three clipped sheets, books and a pencil cup.':view === 'projects' ? 'An illustrative robotics workbench with an articulated arm, gripper, fixture and diagram monitor.' : 'A warm electronics workbench with shelves, instruments, a task lamp, mechanical keyboard and coiled cables.'}
      onKeyDown={event => {
        if (!exploring && !focusView) return;
        if (event.key === 'Escape') {
          event.stopPropagation();
          setExploring(false);
          if (focusView) { exitFocus(); document.getElementById('focus-view-toggle')?.focus(); }
          else document.getElementById(id + '-explore')?.focus();
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); engine.current?.rotate(event.key === 'ArrowLeft' ? -1 : 1); }
      }}
      >
      <div className="scene-poster"><picture><source media="(max-width: 699px)" srcSet={`/scene/${poster}-mobile.webp`} /><source media="(max-aspect-ratio: 11/10)" srcSet={`/scene/${poster}-tablet.webp`} /><img src={`/scene/${poster}-desktop.webp`} alt="" width="1440" height="1000" /></picture></div>
      <div className="scene-live" ref={liveHost} />
    </div>
    </aside>
    <div className="scene-caption">
      <div className="scene-heading"><p>{focusView ? 'Workbench overview' : view==='about'?'Reading corner':view==='experience'?'Documentation corner':view === 'projects' ? 'Projects corner' : 'At the workbench'}</p><span role="status">{status === 'fallback' || status === 'static' ? 'Static view' : '3D view'}</span></div>
      <p className="scene-description">{view==='about'?'Notes, books, and room to learn.':view==='experience'?'An illustrated documentation board.':view === 'projects' ? 'An illustrative robotics study.' : 'An illustrated electronics lab.'}</p>
      <div className="scene-actions">
        {!focusView && <button type="button" id={id + '-explore'} disabled={!interactive} aria-pressed={exploring} onClick={() => setExploring(value => !value)}>{exploring ? 'Exit exploration' : 'Explore view'}</button>}
      </div>
      {interactive && exploration && <div className="view-controls"><p>Drag the scene, or use these controls.</p><div>
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
