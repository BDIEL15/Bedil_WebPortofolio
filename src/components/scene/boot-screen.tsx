'use client';

import {useLayoutEffect,useRef} from 'react';
import {bootSteps,paintWorkspace,workspaceSize,terminalFrame} from '@/lib/scene/workspace-screen';

export function BootScreen({phase,active,onSkip,onPrepare,onComplete}:{phase:number;active:boolean;onSkip:()=>void;onPrepare:()=>void;onComplete:()=>void}){
  const canvas=useRef<HTMLCanvasElement>(null);
  const latest=useRef({phase,onPrepare,onComplete});latest.current={phase,onPrepare,onComplete};
  useLayoutEffect(()=>{
    const element=canvas.current,ink=active?element?.getContext('2d'):null;if(!element||!ink)return;
    const screen=element.parentElement;if(screen)delete screen.dataset.unlocked;
    let frame=0,last:number|undefined,seconds=0,readyAt:number|null=null,prepared=false,signature='';
    const resize=()=>{signature='';};
    const tick=(now:number)=>{
      // Heavy preparation may pause a frame; never fast-forward over typed characters.
      seconds+=last===undefined?0:Math.max(0,Math.min((now-last)/1000,.03));last=now;
      if(latest.current.phase===3&&readyAt===null)readyAt=seconds;
      const sample=terminalFrame(seconds,latest.current.phase,readyAt),key=JSON.stringify(sample)+latest.current.phase;
      if(key!==signature){paintWorkspace(ink,'boot',0,latest.current.phase,innerWidth/innerHeight,sample);element.dataset.ready='true';signature=key;}
      if(sample.prepared&&!prepared){prepared=true;latest.current.onPrepare();}
      if(sample.complete){if(screen)screen.dataset.unlocked='true';latest.current.onComplete();return;}
      frame=requestAnimationFrame(tick);
    };
    tick(performance.now());window.addEventListener('resize',resize);
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);if(screen)delete screen.dataset.unlocked;};
  },[active]);
  return <>
    <div className="boot-screen">
      {active&&<canvas ref={canvas} className="boot-canvas" width={workspaceSize.width} height={workspaceSize.height} aria-hidden="true"/>}
      <div className="boot-placeholder" aria-hidden="true"><p>abdiel@personal-lab: ~</p><p>▍</p></div>
      <p className="sr-only" role="status" aria-live="polite">Preparing personal lab. {bootSteps[phase]}.</p>
      <div className="boot-confirmation" aria-hidden="true"/>
    </div>
    <button type="button" className="boot-skip" onClick={onSkip}>Skip intro <span aria-hidden="true">↗</span></button>
  </>;
}
