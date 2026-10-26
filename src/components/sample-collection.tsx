'use client';

import {useEffect,useId,useRef,useState} from 'react';
import {CollectionArt} from './collection-art';

export type CollectionItem={id:string;title:string;category:string;kind:string;summary:string;tags:string[];intro:string;sections:{heading:string;text:string}[]};
export function SampleCollection({items,variant,sample=true}:{items:CollectionItem[];variant:'projects'|'writing'|'cabinet';sample?:boolean}) {
  const [selected,setSelected]=useState<CollectionItem|null>(null);
  const dialog=useRef<HTMLDialogElement>(null),titleId=useId();
  useEffect(()=>{
    if(!selected||!dialog.current)return;
    const element=dialog.current,overflow=document.body.style.overflow;
    element.showModal();document.body.style.overflow='hidden';
    return ()=>{element.close();document.body.style.overflow=overflow;};
  },[selected]);
  return <><noscript><p>Sample details need JavaScript. Real content and navigation remain available.</p></noscript><ul className={`showcase showcase-${variant}`}>
    {items.map(item=><li key={item.id}><button type="button" className="showcase-card" onClick={()=>setSelected(item)} aria-haspopup="dialog">
      {variant!=='writing'&&<div className="card-picture"><CollectionArt kind={item.kind}/>{sample&&<span className="sample-stamp">Illustrative sample</span>}</div>}
      <div className="card-copy"><span className="card-category">{sample?'Sample · ':''}{item.category}</span><h2>{item.title}<span className="card-arrow" aria-hidden="true">↗</span></h2><p>{item.summary}</p>{variant==='projects'&&<span className="card-tags">{item.tags.join(' / ')}</span>}{variant==='writing'&&<span className="card-read">Read sample <span aria-hidden="true">↗</span></span>}</div>
    </button></li>)}
  </ul>
  <dialog ref={dialog} className={`detail-dialog detail-${variant}`} aria-labelledby={titleId} onClose={()=>setSelected(null)} onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close();}}>
    {selected&&<article><div className="dialog-toolbar"><span>{sample?'Sample content · layout preview':selected.category}</span><button type="button" onClick={()=>dialog.current?.close()} aria-label="Close detail">Close <span aria-hidden="true">×</span></button></div>
      {variant!=='writing'&&<div className="detail-picture"><CollectionArt kind={selected.kind}/></div>}
      <div className="detail-copy"><p className="card-category">{selected.category}</p><h2 id={titleId}>{selected.title}</h2><p className="detail-intro">{selected.intro}</p>{selected.sections.map(section=><section key={section.heading}><h3>{section.heading}</h3><p>{section.text}</p></section>)}{sample&&<p className="detail-footnote">An interface example. Real stories and media will replace this content.</p>}</div>
    </article>}
  </dialog></>;
}
