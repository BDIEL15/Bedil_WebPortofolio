'use client';

import Link from 'next/link';
import {Suspense,useEffect,useLayoutEffect,useRef} from 'react';
import { usePathname,useSearchParams } from 'next/navigation';
import {useMotion} from './motion-provider';

const links = [['/', 'Home'], ['/about', 'About'], ['/projects', 'Projects'], ['/experience', 'Experience'], ['/writing', 'Writing'], ['/cabinet', 'Cabinet']] as const;
function NavigationLinks({writingPaths,preview}:{writingPaths:string[];preview?:string|null}) {
  const pathname = usePathname();
  const {paused,reduced}=useMotion();
  const nav=useRef<HTMLElement>(null),indicator=useRef<HTMLSpanElement>(null);
  const movement=useRef<Animation|null>(null),destination=useRef(''),target=useRef<HTMLAnchorElement|null>(null);
  const policy=useRef({paused,reduced});policy.current={paused,reduced};
  function move(link:HTMLAnchorElement|null,animate:boolean) {
    const parent=nav.current,pill=indicator.current;
    if(!parent||!pill)return;
    document.documentElement.style.setProperty('--nav-snapshot-clearance',Math.ceil((parent.parentElement?.getBoundingClientRect().bottom??parent.getBoundingClientRect().bottom)+12)+'px');
    if(!link){movement.current?.cancel();destination.current='';target.current=null;delete parent.dataset.indicatorReady;return;}
    const bounds=parent.getBoundingClientRect(),end=link.getBoundingClientRect(),from=pill.getBoundingClientRect();
    const x=end.left-bounds.left,y=end.top-bounds.top,key=[x,y,end.width,end.height].join(':');
    target.current=link;
    if(destination.current===key)return;
    const visible=parent.dataset.indicatorReady==='true';destination.current=key;
    movement.current?.cancel();movement.current=null;
    Object.assign(pill.style,{width:end.width+'px',height:end.height+'px',transform:`translate3d(${x}px,${y}px,0)`});
    parent.dataset.indicatorReady='true';
    if(animate&&visible&&!policy.current.paused&&!policy.current.reduced&&!document.hidden) {
      movement.current=pill.animate([
        {transform:`translate3d(${from.left-bounds.left}px,${from.top-bounds.top}px,0) scale(${from.width/end.width},${from.height/end.height})`},
        {transform:`translate3d(${x}px,${y}px,0) scale(1,1)`},
      ],{duration:460,easing:'cubic-bezier(.22,1,.36,1)'});
    }
  }
  useLayoutEffect(()=>{move(nav.current?.querySelector<HTMLAnchorElement>('a[aria-current]')??null,true);},[pathname]);
  useLayoutEffect(()=>{if(paused||reduced){movement.current?.cancel();movement.current=null;}},[paused,reduced]);
  useEffect(()=>{
    const parent=nav.current;if(!parent)return;
    const align=()=>move(target.current?.isConnected?target.current:parent.querySelector('a[aria-current]'),false);
    const observer=new ResizeObserver(align);observer.observe(parent);parent.querySelectorAll('a').forEach(link=>observer.observe(link));
    let alive=true;void document.fonts.ready.then(()=>{if(alive)align();});
    const hidden=()=>{if(document.hidden){movement.current?.cancel();movement.current=null;}};
    document.addEventListener('visibilitychange',hidden);
    return ()=>{alive=false;observer.disconnect();document.removeEventListener('visibilitychange',hidden);movement.current?.cancel();};
  },[]);
  return <nav ref={nav} aria-label="Main navigation"><span ref={indicator} className="nav-indicator" aria-hidden="true"/>{links.map(([href, label]) => <Link key={href} href={href+(preview==='1'?'?preview=1':'')} aria-current={pathname===href||(href==='/writing'&&writingPaths.includes(pathname))?'page':undefined}>{label}</Link>)}</nav>;
}
function PreviewNavigation({writingPaths}:{writingPaths:string[]}) {return <NavigationLinks writingPaths={writingPaths} preview={useSearchParams().get('preview')}/>;}
export function Navigation({writingPaths}:{writingPaths:string[]}) {return <Suspense fallback={<NavigationLinks writingPaths={writingPaths}/>}><PreviewNavigation writingPaths={writingPaths}/></Suspense>;}
