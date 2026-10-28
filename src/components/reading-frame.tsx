'use client';

import {useLayoutEffect} from 'react';
import {usePathname} from 'next/navigation';

/** Measure reading chrome; collections keep their own scroll area below a stationary heading. */
export function ReadingFrame() {
  const pathname=usePathname();
  useLayoutEffect(()=>{
    const main=document.getElementById('main'),header=document.querySelector<HTMLElement>('.site-header'),footer=document.querySelector<HTMLElement>('.page-shell>footer');
    if(!main||!header||!footer)return;
    let frame=0;
    const update=()=>{
      frame=0;
      const bounds=main.getBoundingClientRect(),top=header.getBoundingClientRect().bottom+16;
      const bottom=getComputedStyle(footer).display==='none'?innerHeight:footer.getBoundingClientRect().top-16;
      main.style.setProperty('--reading-clip-top',Math.max(0,top-bounds.top)+'px');
      main.style.setProperty('--reading-clip-bottom',Math.max(0,bounds.bottom-bottom)+'px');
      const collection=main.querySelector<HTMLElement>('.collection:has(>.collection-scroll)');
      if(collection)collection.style.setProperty('--collection-height',Math.max(0,bottom-collection.getBoundingClientRect().top)+'px');
      document.documentElement.style.setProperty('--reading-top',top+'px');
      document.documentElement.style.setProperty('--reading-bottom',innerHeight-bottom+'px');
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    const focus=(event:FocusEvent)=>{
      const target=event.target;
      if(target instanceof HTMLElement&&main.contains(target)&&!target.closest('dialog'))target.scrollIntoView({block:'nearest',behavior:'instant'});
    };
    const observer=new ResizeObserver(schedule);[main,header,footer].forEach(el=>observer.observe(el));
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
    main.addEventListener('focusin',focus);update();
    return ()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);main.removeEventListener('focusin',focus);};
  },[pathname]);
  return null;
}
