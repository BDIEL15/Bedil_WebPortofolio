import Link from 'next/link';
import { InterestLine } from '@/components/interest-line';
import SplitText from '@/components/SplitText';
import { getExperiences, getProfile } from '@/lib/content';

export default async function Home() {
  const [profile, experiences] = await Promise.all([getProfile(), getExperiences()]);
  return <>
    <section className="introduction home-intro" aria-labelledby="home-title">
      <SplitText tag="h1" id="home-title" text={profile.headline} />
      <InterestLine phrases={profile.interests} description={profile.interestsDescription} />
      <p className="intro-copy">{profile.intro}</p>
      <div className="home-links"><Link className="text-link" href="/about">About me <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/projects">Projects <span aria-hidden="true">↗</span></Link></div>
    </section>
    <div className="home-details"><section id="about" className="home-about" aria-labelledby="about-title"><h2 id="about-title">About me</h2><p>{profile.name}</p><p>{profile.bio}</p></section>
    <section id="experience" className="experience" aria-labelledby="experience-title"><h2 id="experience-title">In the lab & beyond</h2>
      <ul>{experiences.map(item => <li key={item.id}><span className="experience-role">{item.role}</span><span className="experience-organization">{item.organization}{item.year && <span className="experience-year"> · {item.year}</span>}</span></li>)}</ul>
    </section></div>
  </>;
}
