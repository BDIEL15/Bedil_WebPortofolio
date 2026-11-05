'use client';

import { useCallback,useEffect,useLayoutEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMotion } from '../motion-provider';
import type { PersonalLabScene } from '@/lib/scene/create-personal-lab-scene';
import { labPoster, labViewForPath } from '@/lib/scene/lab-camera';
import type { ExperienceBadge } from '@/lib/scene/story-corners';
import {BootScreen} from './boot-screen';
import {bootSessionKey} from '@/lib/boot-config';

type SceneStatus = 'poster' | 'loading' | 'ready' | 'fallback' | 'static';
const sceneCopy={
  home:['At the workbench','An illustrated electronics lab.'],
  projects:['Projects corner','An illustrative robotics study.'],
  about:['Reading corner','Notes, books, and room to learn.'],
  experience:['Experience lanyards','Illustrative lanyards and mounts for real photos.'],
  writing:['Writing pegboard','Hanging papers and a physics chalkboard behind the robot.'],
  cabinet:['Hobby shelf','A camera, a stylized Power figure, a portable player, and audio cassettes.'],
};

export function SceneHost({writingPaths,experiences}:{writingPaths:string[];experiences:ExperienceBadge[]}) {
  const id = useId();
  const pathname = usePathname();
  const { paused, reduced, ready:motionReady,booting,setBooting,focusView, exitFocus } = useMotion();
  const view=labViewForPath(pathname,writingPaths);
  const poster=labPoster(view,focusView);
  const liveHost = useRef<HTMLDivElement>(null);
  const engine = useRef<PersonalLabScene | null>(null);
  const entryHandled=useRef(false);
  const eligible=useRef<boolean|null>(null),bootStageRef=useRef('off'),loadAbort=useRef<AbortController|null>(null),handoffFrame=useRef(0);
  const [bootStage,setBootStage]=useState('off'),[bootPhase,setBootPhase]=useState(0);
  const [prepared,setPrepared]=useState(false);
  const terminalDone=useRef(false);
  const loadingExpired=useRef(false);
  const canPrepare=bootStage==='off'||prepared;
  const stage=useCallback((value:string)=>{
    bootStageRef.current=value;setBootStage(value);
    if(value==='off')delete document.documentElement.dataset.labBoot;else document.documentElement.dataset.labBoot=value;
  },[]);
  const maybeHandoff=useCallback(()=>{
    if(!terminalDone.current||!engine.current||bootStageRef.current!=='loading')return;
    handoffFrame.current=requestAnimationFrame(()=>{
      handoffFrame.current=requestAnimationFrame(()=>{if(bootStageRef.current==='loading')stage('handoff');});
    });
  },[stage]);
  const terminalComplete=useCallback(()=>{terminalDone.current=true;maybeHandoff();},[maybeHandoff]);
  const prepare=useCallback(()=>setPrepared(true),[]);
  const endBoot=useCallback(()=>{stage('off');setBooting(false);},[stage,setBooting]);
  const skipBoot=useCallback(()=>{
    engine.current?.skipIntro();endBoot();
    requestAnimationFrame(()=>document.getElementById('main')?.focus({preventScroll:true}));
  },[endBoot]);
  useLayoutEffect(()=>{
    eligible.current??=document.documentElement.dataset.labBoot==='loading';
    if(eligible.current){stage('loading');setBooting(true);try{sessionStorage.setItem(bootSessionKey,'seen');}catch{/* Optional session storage. */}}
    return ()=>{delete document.documentElement.dataset.labBoot;setBooting(false);};
  },[setBooting,stage]);
  useLayoutEffect(()=>{
    if(!booting)return;
    const previous=document.body.style.overflow;document.body.style.overflow='hidden';
    return ()=>{document.body.style.overflow=previous;};
  },[booting]);
  useEffect(()=>{
    if(bootStage==='loading'){
      const timer=setTimeout(()=>{loadingExpired.current=true;loadAbort.current?.abort();setStatus('fallback');endBoot();},12000);
      return ()=>clearTimeout(timer);
    }
    if(bootStage==='handoff'){
      const timer=setTimeout(()=>{if(bootStageRef.current==='handoff'){stage('flight');engine.current?.startIntro();}},360);
      return ()=>clearTimeout(timer);
    }
  },[bootStage,endBoot,stage]);
  useEffect(()=>{
    if(bootStageRef.current!=='off'&&(pathname!=='/'||focusView||(motionReady&&(paused||reduced))))skipBoot();
  },[pathname,focusView,motionReady,paused,reduced,skipBoot]);
  useEffect(()=>{
    const interrupt=(event:KeyboardEvent)=>{if(event.key==='Escape'&&bootStageRef.current!=='off')skipBoot();};
    const hidden=()=>{if(document.hidden&&bootStageRef.current!=='off')skipBoot();};
    document.addEventListener('keydown',interrupt);document.addEventListener('visibilitychange',hidden);
    return ()=>{document.removeEventListener('keydown',interrupt);document.removeEventListener('visibilitychange',hidden);};
  },[skipBoot]);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<SceneStatus>('poster');
  const [staticView, setStaticView] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [exploring, setExploring] = useState(false);
  const exploration = exploring || focusView;
  const latest = useRef({ paused: paused || reduced, view, overview: focusView, exploring: exploration, experiences, intro:pathname==='/' });
  latest.current = { paused: paused || reduced, view, overview: focusView, exploring: exploration, experiences, intro:pathname==='/' };
  useEffect(() => {
    try { setStaticView(localStorage.getItem('observatory-static') === 'true'); } catch { /* Storage is optional. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    setExploring(false);
  }, [pathname]);
  useEffect(() => { setExploring(false); }, [focusView]);
  useEffect(() => {
    if (!ready||!canPrepare) return;
    if(loadingExpired.current){setStatus('fallback');return;}
    if (staticView) { entryHandled.current=true;setStatus('static');endBoot(); return; }
    let cancelled = false;
    let owned: PersonalLabScene | null = null;
    const controller = new AbortController();
    loadAbort.current=controller;
    setStatus('loading');
    import('@/lib/scene/create-personal-lab-scene').then(async ({ createPersonalLabScene }) => {
      if (cancelled || controller.signal.aborted || !liveHost.current) return;
      const introRequested=!entryHandled.current&&bootStageRef.current!=='off';
      const created = await createPersonalLabScene(liveHost.current, () => {
        owned = null; engine.current = null; setStatus('fallback'); setExploring(false);endBoot();
      }, controller.signal, {...latest.current,intro:introRequested,
        onProgress:progress=>{if(!cancelled)setBootPhase(progress==='workspace'?1:progress==='graphics'?2:3);},
        onEntry:state=>{
          if(cancelled||bootStageRef.current==='off')return;
          if(state==='playing')stage('flight');
          if(state==='revealing'){stage('revealing');setBooting(false);}
          if(state==='complete'||state==='interrupted')endBoot();
        },
      });
      if (cancelled||controller.signal.aborted) { created.dispose(); return; }
      owned = created;
      entryHandled.current=true;
      engine.current = created;
      created.setPaused(latest.current.paused);
      created.setView(latest.current.view, latest.current.overview);
      created.setExploring(latest.current.exploring);
      if (engine.current === created) setStatus('ready');
      if(bootStageRef.current==='loading')maybeHandoff();else if(introRequested)created.skipIntro();
    }).catch(() => { if (!cancelled) { setStatus('fallback'); setExploring(false);endBoot(); } });
    return () => { cancelled = true;cancelAnimationFrame(handoffFrame.current);controller.abort(); owned?.dispose(); engine.current = null; };
  }, [ready,canPrepare, staticView, attempt,endBoot,setBooting,stage,maybeHandoff]);
  useEffect(() => { engine.current?.setPaused(paused || reduced); }, [paused, reduced]);
  useEffect(() => { engine.current?.setView(view, focusView); }, [view, focusView]);
  useEffect(() => { engine.current?.setExploring(exploration); }, [exploration]);

  const interactive = status === 'ready';
  const homeControls = pathname === '/';
  return <>{pathname==='/'&&<BootScreen phase={bootPhase} active={bootStage==='loading'||bootStage==='handoff'} onSkip={skipBoot} onPrepare={prepare} onComplete={terminalComplete}/>}<aside className="scene" aria-label="Personal electronics lab" data-state={status} data-exploring={interactive && exploration} data-motion={paused || reduced ? 'paused' : 'interactive'}>
    <div id={id} className="scene-art" tabIndex={interactive && exploration ? 0 : undefined}
      role="img" aria-label={exploration ? 'Electronics lab. Drag or use left and right arrow keys to rotate; Escape returns to reading.' : view==='about'?'An illustrated reading desk with an open notebook, books, pencil and warm task lamp.':view==='experience'?'An illustrated pegboard with lanyard name tags for selected published experiences and replaceable photo mounts.':view === 'projects' ? 'An illustrative robotics workbench with an articulated arm, gripper, fixture and diagram monitor.' : 'A warm electronics workbench with one shelf, instruments, a task lamp, mechanical keyboard and coiled cables.'}
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
    <div className="scene-scrim" aria-hidden="true" />
    </aside>
    {(homeControls || (interactive && exploration)) && <div className="scene-caption">
      <div className="scene-heading sr-only"><p>{focusView ? 'Workbench overview' : sceneCopy[view][0]}</p><span role="status">{status === 'fallback' || status === 'static' ? 'Static view' : '3D view'}</span></div>
      <p className="scene-description sr-only">{sceneCopy[view][1]}</p>
      <div className="scene-actions">
        {homeControls && !focusView && <button type="button" id={id + '-explore'} disabled={!interactive} aria-pressed={exploring} onClick={() => setExploring(value => !value)}>{exploring ? 'Exit exploration' : 'Explore view'}</button>}
      </div>
      {interactive && exploration && <div className="view-controls"><p>Drag the scene, or use these controls.</p><div>
        <button type="button" aria-label="Rotate left" onClick={() => engine.current?.rotate(-1)}>←</button>
        <button type="button" onClick={() => engine.current?.reset()}>Reset view</button>
        <button type="button" aria-label="Rotate right" onClick={() => engine.current?.rotate(1)}>→</button>
      </div></div>}
      {homeControls && <button type="button" className="static-control" disabled={!ready} onClick={() => {
        setExploring(false);
        if (status === 'fallback') {loadingExpired.current=false;setAttempt(value => value + 1);}
        else {
          const value = !staticView;
          setStaticView(value);
          try { localStorage.setItem('observatory-static', String(value)); } catch { /* Preference remains in memory. */ }
        }
      }}>{status === 'fallback' ? 'Try 3D again' : staticView ? 'Enable 3D' : 'Use static view'}</button>}
    </div>}
  </>;
}
