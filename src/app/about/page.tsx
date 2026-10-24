import type { Metadata } from 'next';
import Link from 'next/link';
import { getProfile } from '@/lib/content';
import SplitText from '@/components/SplitText';

export const metadata:Metadata={title:'About',description:'About Abdiel Deandra EL Dzaky, Computer Engineering student at Universitas Indonesia.'};
export default async function About() {
  const profile=await getProfile();
  return <section className="story-page about-page" aria-labelledby="about-page-title">
    <SplitText tag="h1" id="about-page-title" text="About me" />
    <p className="story-name">{profile.name}</p>
    <p className="story-lead">{profile.intro}</p>
    <p>{profile.bio}</p>
    <div className="story-links"><Link className="text-link" href="/experience">In the lab &amp; beyond <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/projects">Explore my work <span aria-hidden="true">↗</span></Link></div>
  </section>;
}
