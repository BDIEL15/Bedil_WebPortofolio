import type { Metadata } from 'next';
import { EmptyState } from '@/components/empty-state';
import { getProjects } from '@/lib/content';
export const metadata: Metadata = { title: 'Projects', description: 'Technical and creative work by Abdiel Deandra EL Dzaky.' };
export default async function Projects() {
  const items = await getProjects();
  return <section className="collection"><h1>Projects</h1><p className="collection-intro">Systems, software, and visual work.</p>{items.length ? <ul className="content-list">{items.map(item => <li key={item.id}><h2>{item.title}</h2><p>{item.summary}</p></li>)}</ul> : <EmptyState title="Work is being gathered." description="There are no published projects here yet. Each one will have its own context, contribution, and process when it is ready to share." />}</section>;
}
