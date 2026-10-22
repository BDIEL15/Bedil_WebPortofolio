import type { Metadata } from 'next';
import { EmptyState } from '@/components/empty-state';
import { getCabinetItems } from '@/lib/content';
export const metadata: Metadata = { title: 'Cabinet', description: 'A personal collection, curated by Abdiel Deandra EL Dzaky.' };
export default async function Cabinet() {
  const items = await getCabinetItems();
  return <section className="collection"><h1>Cabinet</h1><p className="collection-intro">Things worth keeping close.</p>{items.length ? <ul className="content-list">{items.map(item => <li key={item.id}><h2>{item.title}</h2><p>{item.note}</p></li>)}</ul> : <EmptyState title="The shelves are still open." description="No objects or references have been published yet. This will be a small collection with a personal note behind each choice." />}</section>;
}
