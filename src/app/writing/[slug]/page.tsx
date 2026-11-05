import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPublishedWriting, getWritingBySlug } from '@/lib/content';
import {writingComponents} from '@/components/writing-media';

export const dynamicParams = false;
export async function generateStaticParams() { return (await getPublishedWriting()).map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getWritingBySlug((await params).slug);
  if (!item) notFound();
  return { title: { absolute: 'abdiel' }, description: item.description };
}
export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getWritingBySlug((await params).slug);
  if (!item) notFound();
  return <article className="article" lang={item.lang}><header className="article-heading"><Link className="text-link" href="/writing">← All writing</Link><h1 id="article-title">{item.title}</h1><time dateTime={item.publishedAt}>{item.publishedAt}</time></header><div className="article-scroll" role="region" aria-labelledby="article-title" tabIndex={0}><div className="prose"><MDXRemote source={item.content} components={writingComponents} options={{ mdxOptions: { format: item.format as 'md' | 'mdx' } }} /></div></div></article>;
}
