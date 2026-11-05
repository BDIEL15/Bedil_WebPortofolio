import {getCabinetItems} from '@/lib/content';
import {CabinetCollection} from '@/components/cabinet-collection';
import {previewMetadata,type PreviewSearch} from '@/lib/ui-preview';

export function generateMetadata({searchParams}:{searchParams:PreviewSearch}) {
  return previewMetadata('Cabinet','Music, books, films, and games that Abdiel makes room for.',searchParams);
}
export default async function Cabinet() {
  const items=(await getCabinetItems()).sort((a,b)=>a.order-b.order);
  return <section className="collection collection-cabinet">
    <header className="collection-heading" id="cabinet-heading"><h1>Cabinet</h1><p className="collection-intro">A few things I make room for.<br/>Music, stories, and worlds I return to.</p><p className="cabinet-hint">Tap play for a little music. Titles open in Spotify.</p></header>
    <div className="collection-scroll" role="region" aria-labelledby="cabinet-heading" tabIndex={0}><CabinetCollection items={items}/></div>
  </section>;
}
