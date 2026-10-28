import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getExperiences } from '@/lib/content';
import SplitText from '@/components/SplitText';

export const metadata:Metadata={title:{absolute:'abdiel'},description:'Lab and student organization roles of Abdiel Deandra EL Dzaky.'};
export default async function Experience() {
  const roles=await getExperiences();
  return <section className="story-page experience-page collection" aria-labelledby="experience-page-title">
    <header className="collection-heading">
    <SplitText tag="h1" id="experience-page-title" text="Experience" />
    <p className="story-lead">In the lab &amp; beyond.</p>
    <p className="experience-intro">Roles across the lab, software, and student communities.</p>
    </header>
    <div className="collection-scroll" role="region" aria-labelledby="experience-page-title" tabIndex={0}>
    <ol className="role-list experience-timeline" aria-label="Selected experience in priority order">{roles.map(role=><li key={role.id} data-experience-id={role.id}>
      {role.logo ? <Image className="organization-mark organization-logo" src={role.logo} alt="" width={52} height={52} sizes="(max-width: 699px) 44px, 52px" /> : <span className="organization-mark" aria-hidden="true">{role.organization.split(/\s+/).slice(0,2).map(word=>word[0]).join('')}</span>}
      <div className="experience-entry">
        <h2>{role.role}</h2>
        <p className="experience-organization-name">{role.organizationName ?? role.organization}{role.employmentType && <span className="experience-employment"> · {role.employmentType}</span>}</p>
        {(role.period || role.year) && <p className="experience-period">{role.period ?? <time className="role-year" dateTime={role.year}>{role.year}</time>}</p>}
        {role.location && <p className="experience-location">{role.location}</p>}
        {role.description && <p className="experience-description">{role.description}</p>}
        {role.achievements && <div className="experience-achievements"><h3>Key achievements</h3><ul>{role.achievements.map(achievement => <li key={achievement}>{achievement}</li>)}</ul></div>}
        {role.skills && <ul className="experience-skills" aria-label="Skills">{role.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>}
      </div>
    </li>)}</ol>
    <Link className="text-link" href="/about">More about me <span aria-hidden="true">↗</span></Link>
    </div>
  </section>;
}
