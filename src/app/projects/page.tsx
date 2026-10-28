import { EmptyState } from '@/components/empty-state';
import { getProjects } from '@/lib/content';
import {SampleCollection} from '@/components/sample-collection';
import {PreviewNote} from '@/components/preview-note';
import {isUiPreview,previewMetadata,samples,type PreviewSearch} from '@/lib/ui-preview';
export function generateMetadata({searchParams}:{searchParams:PreviewSearch}) {return previewMetadata('Projects','Technical and creative work by Abdiel Deandra EL Dzaky.',searchParams);}
export default async function Projects({searchParams}:{searchParams:PreviewSearch}) {
  const [items,preview]=await Promise.all([getProjects(),isUiPreview(searchParams)]);
  return <section className="collection collection-projects"><header className="collection-heading" id="projects-heading"><h1>Projects</h1><p className="collection-intro">Things made with curiosity.<br/>Software, robotics, and a little visual thinking.</p></header><div className="collection-scroll" role="region" aria-labelledby="projects-heading" tabIndex={0}><PreviewNote active={preview}/>{preview?<SampleCollection items={samples.projects} variant="projects"/>:items.length?<SampleCollection sample={false} variant="projects" items={items.map(item=>({id:item.id,title:item.title,category:'Project',kind:'signal',summary:item.summary,tags:[],intro:item.summary,sections:[]}))}/>:<EmptyState title="Work is being gathered." description="There are no published projects here yet. Each one will have its own context, contribution, and process when it is ready to share."/>}</div></section>;
}
