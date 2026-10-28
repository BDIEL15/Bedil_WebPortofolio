import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPublishedWriting, getWritingBySlug } from '@/lib/content';

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
  return <article className="article"><Link className="text-link" href="/writing">← All writing</Link><h1>{item.title}</h1><time dateTime={item.publishedAt}>{item.publishedAt}</time><div className="prose"><MDXRemote source={item.content} options={{ mdxOptions: { format: item.format as 'md' | 'mdx' } }} /></div></article>;
}
