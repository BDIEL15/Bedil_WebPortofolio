import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState } from '@/components/empty-state';
import { getPublishedWriting } from '@/lib/content';
export const metadata: Metadata = { title: 'Writing', description: 'Notes and explorations by Abdiel Deandra EL Dzaky.' };
export default async function Writing() {
  const items = await getPublishedWriting();
  return <section className="collection"><h1>Writing</h1><p className="collection-intro">Notes from the process of figuring things out.</p>{items.length ? <ul className="content-list">{items.map(item => <li key={item.id}><time dateTime={item.publishedAt}>{item.publishedAt}</time><h2><Link href={`/writing/${item.slug}`}>{item.title}</Link></h2><p>{item.description}</p></li>)}</ul> : <EmptyState title="No published notes yet." description="This space is reserved for writing that is ready to be read. Drafts stay in the notebook until then." />}</section>;
}
