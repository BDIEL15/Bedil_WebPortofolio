import type { Metadata } from 'next';
import Link from 'next/link';
import { getExperiences } from '@/lib/content';
import SplitText from '@/components/SplitText';

export const metadata:Metadata={title:'Experience',description:'Lab and student organization roles of Abdiel Deandra EL Dzaky.'};
export default async function Experience() {
  const roles=await getExperiences();
  return <section className="story-page experience-page" aria-labelledby="experience-page-title">
    <SplitText tag="h1" id="experience-page-title" text="Experience" />
    <p className="story-lead">In the lab &amp; beyond.</p>
    <ul className="role-list">{roles.map(role=><li key={role.id}>
      <div className="role-heading"><h2>{role.organization}</h2>{role.year&&<span className="role-year">{role.year}</span>}</div>
      <p>{role.role}</p>
    </li>)}</ul>
    <Link className="text-link" href="/about">About me <span aria-hidden="true">↗</span></Link>
  </section>;
}
