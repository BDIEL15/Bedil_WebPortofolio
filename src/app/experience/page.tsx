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
    <p className="experience-intro">Roles across the lab, software, and student communities.</p>
    <ol className="role-list experience-timeline" aria-label="Selected experience in priority order">{roles.map(role=><li key={role.id} data-experience-id={role.id}>
      <span className="organization-mark" aria-hidden="true">{role.organization.split(/\s+/).slice(0,2).map(word=>word[0]).join('')}</span>
      <div className="experience-entry"><h2>{role.role}</h2><p className="experience-organization-name">{role.organization}</p>{role.year&&<p className="experience-period"><span className="sr-only">Year: </span><time className="role-year" dateTime={role.year}>{role.year}</time></p>}</div>
    </li>)}</ol>
    <Link className="text-link" href="/about">More about me <span aria-hidden="true">↗</span></Link>
  </section>;
}
