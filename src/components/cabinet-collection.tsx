'use client';

import Image from 'next/image';
import {useEffect,useRef,useState} from 'react';
import {useMotion} from './motion-provider';

type CabinetItem={id:string;title:string;note:string;kind:string;image?:string;width?:number;height?:number;href?:string;preview?:string};
export function CabinetCollection({items}:{items:CabinetItem[]}) {
  const audio=useRef<HTMLAudioElement>(null);
  const [playing,setPlaying]=useState<string|null>(null),[error,setError]=useState('');
  const {focusView}=useMotion();
  useEffect(()=>{
    const element=audio.current;
    const stop=()=>{element?.pause();setPlaying(null);};
    const visibility=()=>{if(document.hidden)stop();};
    document.addEventListener('visibilitychange',visibility);
    window.addEventListener('pagehide',stop);
    return ()=>{element?.pause();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',stop);};
  },[]);
  useEffect(()=>{if(focusView){audio.current?.pause();setPlaying(null);}},[focusView]);
  async function toggle(item:CabinetItem) {
    const element=audio.current;if(!element||!item.preview)return;
    setError('');
    if(playing===item.id){element.pause();setPlaying(null);return;}
    element.src=item.preview;setPlaying(item.id);
    try{await element.play();}catch{if(element.src===item.preview){setPlaying(null);setError('This preview is unavailable. You can still listen on Spotify.');}}
  }
  return <>
    <audio ref={audio} preload="none" onEnded={()=>setPlaying(null)} onError={()=>{setPlaying(null);setError('This preview is unavailable. You can still listen on Spotify.');}}/>
    <p className="cabinet-status" role="status">{error|| (playing?`Playing ${items.find(item=>item.id===playing)?.title}`:'')}</p>
    <ul className="cabinet-grid">{items.map(item=><li key={item.id} className="cabinet-item" data-kind={item.kind}>
      <div className="cabinet-cover">
        {item.image&&<Image src={item.image} alt={`${item.title} cover`} width={item.width??300} height={item.height??300} sizes="(max-width:699px) 40vw, 180px"/>}
        {item.preview&&<button className="cabinet-play" type="button" aria-label={`${playing===item.id?'Pause':'Play preview of'} ${item.title}`} aria-pressed={playing===item.id} onClick={()=>toggle(item)}><span aria-hidden="true">{playing===item.id?'Ⅱ':'▶'}</span></button>}
        {item.kind==='music'&&!item.preview&&<span className="cabinet-album">{item.href?.includes('/album/')?'Album':'Spotify'}</span>}
      </div>
      <h2>{item.href?<a href={item.href} target="_blank" rel="noopener noreferrer">{item.title}<span aria-hidden="true"> ↗</span></a>:item.title}</h2>
      <p>{item.note}</p>
    </li>)}</ul>
    <noscript><p>Music previews need JavaScript. You can open each title in Spotify.</p></noscript>
  </>;
}
