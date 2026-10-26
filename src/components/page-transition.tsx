'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMotion } from './motion-provider';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router=useRouter();
  const { paused, reduced } = useMotion();
  const ref=useRef<HTMLDivElement>(null),previous=useRef(pathname),request=useRef(0);
  const latest=useRef({paused,reduced});latest.current={paused,reduced};
  const active=useRef<ViewTransition|null>(null),fades=useRef<Animation[]>([]);
  const pending=useRef<{id:number;target:string;resolve:()=>void}|null>(null);
  const content=()=>ref.current?.parentElement;
  const fadeIn=()=>{
    for(const fade of fades.current)fade.cancel();fades.current=[];
    for(const element of [content()])if(element) {
      fades.current.push(element.animate([{opacity:0},{opacity:1}],{duration:520,easing:'cubic-bezier(.22,1,.36,1)'}));
    }
  };
  useLayoutEffect(()=>{
    const changed=previous.current!==pathname;previous.current=pathname;
    for(const fade of fades.current)fade.cancel();fades.current=[];
    content()?.style.removeProperty('view-transition-name');
    const native=pending.current?.target===pathname;
    if(native){pending.current?.resolve();pending.current=null;}
    if(paused||reduced||document.hidden){active.current?.skipTransition();pending.current?.resolve();pending.current=null;return;}
    // History and browsers without View Transitions get one stationary incoming fade.
    if(changed&&!native)fadeIn();
  },[pathname,paused,reduced]);
  useEffect(()=>{
    const interrupt=()=>{++request.current;active.current?.skipTransition();pending.current?.resolve();pending.current=null;};
    const navigate=(event:MouseEvent)=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||latest.current.paused||latest.current.reduced||document.hidden||!document.startViewTransition)return;
      const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href]'):null;
      if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
      const url=new URL(link.href);
      if(url.origin!==location.origin)return;
      if(url.pathname===location.pathname){if(active.current)interrupt();return;}
      event.preventDefault();const id=++request.current;
      active.current?.skipTransition();pending.current?.resolve();pending.current=null;
      for(const fade of fades.current)fade.cancel();fades.current=[];
      const main=content();if(main)main.style.viewTransitionName='route-out';
      const transition=document.startViewTransition(async()=>{
        if(id!==request.current)return;
        await new Promise<void>(resolve=>{
          // A slow route must not hold a rendered snapshot over the live scene.
          const guard=window.setTimeout(()=>{transition.skipTransition();if(pending.current?.id===id){pending.current.resolve();pending.current=null;}},350);
          pending.current={id,target:url.pathname,resolve:()=>{clearTimeout(guard);resolve();}};
          router.push(url.pathname+url.search+url.hash);
        });
      });
      active.current=transition;
      void transition.ready.catch(async()=>{
        await transition.updateCallbackDone.catch(()=>{});
        // Native capture can be skipped by the browser after the route has already committed.
        if(id!==request.current||previous.current!==url.pathname||latest.current.paused||latest.current.reduced||document.hidden||fades.current.some(fade=>fade.playState==='running'))return;
        fadeIn();
      });
      void transition.finished.catch(()=>{}).finally(()=>{
        if(active.current===transition){active.current=null;content()?.style.removeProperty('view-transition-name');}
      });
    };
    const hidden=()=>{if(document.hidden){active.current?.skipTransition();pending.current?.resolve();pending.current=null;}};
    document.addEventListener('click',navigate,true);
    window.addEventListener('popstate',interrupt);document.addEventListener('visibilitychange',hidden);
    return ()=>{document.removeEventListener('click',navigate,true);window.removeEventListener('popstate',interrupt);document.removeEventListener('visibilitychange',hidden);interrupt();for(const fade of fades.current)fade.cancel();};
  },[router]);
  return <div key={pathname} ref={ref} className="page-transition">{children}</div>;
}
