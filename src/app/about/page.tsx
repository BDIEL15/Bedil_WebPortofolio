import Link from 'next/link';
import { getProfile } from '@/lib/content';
import SplitText from '@/components/SplitText';
import {PreviewNote} from '@/components/preview-note';
import {isUiPreview,previewMetadata,type PreviewSearch} from '@/lib/ui-preview';

export function generateMetadata({searchParams}:{searchParams:PreviewSearch}) {return previewMetadata('About','About Abdiel Deandra EL Dzaky, Computer Engineering student at Universitas Indonesia.',searchParams);}
export default async function About({searchParams}:{searchParams:PreviewSearch}) {
  const [profile,preview]=await Promise.all([getProfile(),isUiPreview(searchParams)]);
  return <section className="story-page about-page" aria-labelledby="about-page-title">
    <SplitText tag="h1" id="about-page-title" text="About me" />
    <p className="story-name">{profile.name}</p>
    <p className="story-lead">{profile.intro}</p>
    <p>{profile.bio}</p>
    <dl className="about-facts">{profile.education&&<div><dt>Studying</dt><dd>{profile.education.course}<br/>{profile.education.institution}</dd></div>}{profile.focusAreas&&<div><dt>Exploring</dt><dd>{profile.focusAreas.map(area=><div key={area}>{area}</div>)}</dd></div>}</dl>
    <PreviewNote active={preview}/>
    {preview&&<div className="about-preview"><div className="portrait-space" role="img" aria-label="Placeholder for a real portrait, no photo supplied"><span aria-hidden="true">a.</span><p>Your photo,<br/>your little corner.</p><small>Portrait placeholder</small></div><div><h2>A little more human.</h2><p>A space for your own story: the things you notice, what keeps you curious, and life beyond the workbench.</p><p className="sample-caption">Sample layout. Personal copy and photo are still to come.</p></div></div>}
    <div className="story-links"><Link className="text-link soft-link" href={'/experience'+(preview?'?preview=1':'')}>In the lab &amp; beyond <span aria-hidden="true">↗</span></Link><Link className="text-link" href={'/projects'+(preview?'?preview=1':'')}>Explore my work <span aria-hidden="true">↗</span></Link></div>
  </section>;
}
