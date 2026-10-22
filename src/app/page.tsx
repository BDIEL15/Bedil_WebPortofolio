import Link from 'next/link';
import { InterestLine } from '@/components/interest-line';
import { getExperiences, getProfile } from '@/lib/content';

export default async function About() {
  const [profile, experiences] = await Promise.all([getProfile(), getExperiences()]);
  return <>
    <section className="introduction" aria-labelledby="about-title">
      <h1 id="about-title">hey, i'm<br />{profile.name}</h1>
      <InterestLine phrases={profile.interests} description={profile.interestsDescription} />
      <p className="intro-copy">{profile.intro}</p><p>{profile.bio}</p>
      <Link className="text-link" href="/projects">Explore my work <span aria-hidden="true">↗</span></Link>
    </section>
    <section className="experience" aria-labelledby="experience-title"><h2 id="experience-title">Along the way</h2><p className="section-intro">In the lab and beyond.</p>
      <ul>{experiences.map(item => <li key={item.id}><div><h3>{item.organization}</h3><p>{item.role}</p></div>{item.year && <span>{item.year}</span>}</li>)}</ul>
    </section>
    <section className="elsewhere" aria-labelledby="explore-title"><h2 id="explore-title">A space to explore</h2><p>Work, notes, and a few things worth keeping. The collection will grow as material is ready to share.</p><div className="explore-links"><Link href="/writing">Writing <span aria-hidden="true">↗</span></Link><Link href="/cabinet">Cabinet <span aria-hidden="true">↗</span></Link></div></section>
  </>;
}
