'use client';

import Image from 'next/image';
import {useId,useRef,useState} from 'react';
import {useMotion} from './motion-provider';

export type ProjectMedia={src:string;alt:string;width:number;height:number};

export function ProjectGallery({media,label='Project photos',itemLabel='Photo',aspectRatio,smooth=false}:{media:ProjectMedia[];label?:string;itemLabel?:string;aspectRatio?:string;smooth?:boolean}) {
  const [active,setActive]=useState(0);
  const {userPaused,reduced}=useMotion();
  const track=useRef<HTMLDivElement>(null),trackId=useId();
  const go=(index:number)=>{
    const element=track.current;
    if(element)element.scrollTo({left:Math.max(0,Math.min(media.length-1,index))*element.clientWidth,behavior:smooth&&!userPaused&&!reduced?'smooth':'instant'});
  };
  return <section className="project-gallery" aria-label={label} aria-roledescription={media.length>1?'carousel':undefined}>
    <div className="project-gallery-track" id={trackId} ref={track} tabIndex={media.length>1?0:undefined} aria-label={media.length>1?`${label}; use left and right arrow keys`:label} onScroll={event=>setActive(Math.max(0,Math.min(media.length-1,Math.round(event.currentTarget.scrollLeft/event.currentTarget.clientWidth))))} onKeyDown={event=>{
      if(media.length>1&&(event.key==='ArrowLeft'||event.key==='ArrowRight')){event.preventDefault();event.stopPropagation();go(active+(event.key==='ArrowRight'?1:-1));}
    }}>
      {media.map((photo,index)=><a className="project-gallery-slide" style={aspectRatio?{aspectRatio}:undefined} key={photo.src} href={photo.src} target="_blank" rel="noopener noreferrer" tabIndex={index===active?0:-1} aria-hidden={index!==active} aria-label={'Open full-size image: '+photo.alt}>
        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 760px) 100vw, 760px"/>
      </a>)}
    </div>
    <div className="project-gallery-footer">
      {media.length>1&&<div className="project-gallery-controls">
        <button type="button" aria-label={`Previous ${itemLabel.toLowerCase()}`} aria-controls={trackId} disabled={active===0} onClick={()=>go(active-1)}>←</button>
        <span aria-live="polite" aria-atomic="true">{itemLabel} {active+1} of {media.length}</span>
        <button type="button" aria-label={`Next ${itemLabel.toLowerCase()}`} aria-controls={trackId} disabled={active===media.length-1} onClick={()=>go(active+1)}>→</button>
      </div>}
      <p className="project-gallery-caption">{media[active].alt}</p>
    </div>
  </section>;
}
