'use client';

import {useLayoutEffect} from 'react';
import {usePathname} from 'next/navigation';
import {useMotion} from './motion-provider';

/** Animate real boxes; display:contents cannot carry the reading-content fade. */
export function HomeArrival(){
  const pathname=usePathname(),{ready,paused,reduced}=useMotion();
  useLayoutEffect(()=>{
    const root=document.documentElement;
    if(!root.dataset.homeArrival||root.dataset.homeArrival==='done')return;
    if(pathname!=='/'){root.dataset.homeArrival='done';return;}
    if(!ready)return;
    let alive=true,started=false,finished=false;
    const animations:Animation[]=[];
    const finish=()=>{
      if(finished)return;finished=true;
      for(const animation of animations)animation.cancel();
      root.dataset.homeArrival='done';
    };
    if(paused||reduced||document.hidden){finish();return;}
    const begin=()=>{
      if(started||finished||['loading','handoff','flight'].includes(root.dataset.labBoot??''))return;
      started=true;root.dataset.homeArrival='running';
      const steps:[string,number,number][]=[['.site-header',0,650],['.home-intro h1',0,900],['.home-intro .interest-line',100,900],['.home-intro .intro-copy',220,900]];
      document.querySelectorAll('.home-intro .social-link').forEach((_,index)=>steps.push([`.home-intro .social-link:nth-child(${index+1})`,360+index*45,800]));
      for(const [selector,delay,duration]of steps){
        const element=document.querySelector<HTMLElement>(selector);
        if(element?.animate)animations.push(element.animate([{opacity:0},{opacity:1}],{delay,duration,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));
      }
      void Promise.allSettled(animations.map(animation=>animation.finished)).then(()=>{if(alive)finish();});
    };
    const focus=(event:FocusEvent)=>{
      const target=event.target;
      if(target instanceof HTMLElement&&(target.id==='main'||target.closest('.home-intro,.site-header')))finish();
    };
    const hidden=()=>{if(document.hidden)finish();};
    const observer=new MutationObserver(begin);observer.observe(root,{attributes:true,attributeFilter:['data-lab-boot']});
    document.addEventListener('focusin',focus);document.addEventListener('visibilitychange',hidden);begin();
    return ()=>{
      alive=false;observer.disconnect();document.removeEventListener('focusin',focus);document.removeEventListener('visibilitychange',hidden);
      for(const animation of animations)animation.cancel();
      // Strict Mode/policy changes can restart or immediately settle an interrupted entrance.
      if(started&&!finished)root.dataset.homeArrival='pending';
    };
  },[pathname,ready,paused,reduced]);
  return null;
}
