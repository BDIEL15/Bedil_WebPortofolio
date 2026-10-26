import { EmptyState } from '@/components/empty-state';
import { getCabinetItems } from '@/lib/content';
import {SampleCollection} from '@/components/sample-collection';
import {PreviewNote} from '@/components/preview-note';
import {isUiPreview,previewMetadata,samples,type PreviewSearch} from '@/lib/ui-preview';
export function generateMetadata({searchParams}:{searchParams:PreviewSearch}) {return previewMetadata('Cabinet','A corner for cameras, music, and collectibles, curated by Abdiel Deandra EL Dzaky.',searchParams);}
export default async function Cabinet({searchParams}:{searchParams:PreviewSearch}) {
  const [items,preview]=await Promise.all([getCabinetItems(),isUiPreview(searchParams)]);
  return <section className="collection collection-cabinet"><h1>Cabinet</h1><p className="collection-intro">A few things I make room for.<br/>Cameras, listening, and familiar faces.</p><PreviewNote active={preview}/>{preview?<SampleCollection items={samples.cabinet} variant="cabinet"/>:items.length ? <ul className="content-list">{items.map(item => <li key={item.id}><h2>{item.title}</h2><p>{item.note}</p></li>)}</ul> : <EmptyState title="Personal notes are still being gathered." description="The display sets the mood. Photos and stories behind these interests haven't been published yet." />}</section>;
}
