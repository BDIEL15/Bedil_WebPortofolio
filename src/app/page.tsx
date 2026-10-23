import Link from 'next/link';
import { InterestLine } from '@/components/interest-line';
import SplitText from '@/components/SplitText';
import { getExperiences, getProfile } from '@/lib/content';

export default async function About() {
  const [profile, experiences] = await Promise.all([getProfile(), getExperiences()]);
  return <>
    <section className="introduction" aria-labelledby="about-title">
      <SplitText tag="h1" id="about-title" text={profile.headline} />
      <InterestLine phrases={profile.interests} description={profile.interestsDescription} />
      <p className="intro-copy">{profile.intro}</p><p>{profile.bio}</p>
      <Link className="text-link" href="/projects">Explore my work <span aria-hidden="true">↗</span></Link>
    </section>
    <section className="experience" aria-labelledby="experience-title"><h2 id="experience-title">In the lab & beyond</h2>
      <ul>{experiences.map(item => <li key={item.id}><span className="experience-role">{item.role}</span><span className="experience-organization">{item.organization}{item.year && <span className="experience-year"> · {item.year}</span>}</span></li>)}</ul>
    </section>
  </>;
}
