import 'server-only';
import samples from '@/data/ui-preview.json';
import type { Metadata } from 'next';

export type PreviewSearch = Promise<{[key:string]:string|string[]|undefined}>;
export async function isUiPreview(searchParams:PreviewSearch) { return (await searchParams).preview==='1'; }
export async function previewMetadata(title:string,description:string,searchParams:PreviewSearch):Promise<Metadata> {
  return {title:{absolute:'abdiel'},description,...(await isUiPreview(searchParams)?{robots:{index:false,follow:false}}:{})};
}
export {samples};
