import Link from 'next/link';
import { EmptyState } from '@/components/empty-state';
import { getPublishedWriting } from '@/lib/content';
import {SampleCollection} from '@/components/sample-collection';
import {PreviewNote} from '@/components/preview-note';
import {isUiPreview,previewMetadata,samples,type PreviewSearch} from '@/lib/ui-preview';
export function generateMetadata({searchParams}:{searchParams:PreviewSearch}) {return previewMetadata('Writing','Notes and explorations by Abdiel Deandra EL Dzaky.',searchParams);}
export default async function Writing({searchParams}:{searchParams:PreviewSearch}) {
  const [items,preview]=await Promise.all([getPublishedWriting(),isUiPreview(searchParams)]);
  return <section className="collection collection-writing" data-sparse={!preview && items.length<=2}><header className="collection-heading" id="writing-heading"><h1>Writing</h1><p className="collection-intro">Notes, questions, and things worth keeping.<br/>{' '}From the process of figuring things out.</p></header><div className="collection-scroll" role="region" aria-labelledby="writing-heading" tabIndex={0}>{(preview || !items.length) && <PreviewNote active={preview}/>}{preview?<SampleCollection items={samples.writing} variant="writing"/>:items.length ? <ul className="content-list">{items.map(item => <li key={item.id}><h2><Link href={`/writing/${item.slug}`}>{item.title}</Link></h2><time dateTime={item.publishedAt}>{item.publishedAt}</time></li>)}</ul> : <EmptyState title="No published notes yet." description="This space is reserved for writing that is ready to be read. Drafts stay in the notebook until then." />}{!preview && <p className="writing-upcoming">More writing is on the way.</p>}</div></section>;
}
