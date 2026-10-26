'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

export function HomeNavigation({links}:{links:{label:string;icon:string;href:string}[]}) {
  const router=useRouter();
  useEffect(()=>{
    const redirect=()=>{if(location.hash==='#experience')router.replace('/experience'+location.search);};
    redirect();window.addEventListener('hashchange',redirect);
    return ()=>window.removeEventListener('hashchange',redirect);
  },[router]);
  return <div className="home-links" role="group" aria-label="Find me online">{links.map(link=>{
    const external=link.href.startsWith('https://');
    return <a key={link.icon} className="social-link" href={link.href} target={external?'_blank':undefined} rel={external?'noopener noreferrer':undefined} aria-label={link.label+(external?' (opens in a new tab)':'')}>
      <span className="social-icon" aria-hidden="true" style={{maskImage:`url(/icons/${link.icon}.svg)`,WebkitMaskImage:`url(/icons/${link.icon}.svg)`}}/>
      <span className="social-label" aria-hidden="true">{link.label}</span>
    </a>;
  })}</div>;
}
