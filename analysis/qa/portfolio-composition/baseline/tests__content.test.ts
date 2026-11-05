import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getCabinetItems, getExperiences, getFeaturedExperiences, getProfile, getProjects, getPublishedWriting, getWritingBySlug } from '../src/lib/content/files';
import { parseContent, publishedOnly, writingSchema } from '../src/lib/content/schema';
import { compileMDX } from 'next-mdx-remote/rsc';
import { renderToStaticMarkup } from 'react-dom/server';
import {writingComponents} from '../src/components/writing-media';
import {access} from 'node:fs/promises';
import path from 'node:path';

test('real profile and only published content cross the public boundary', async () => {
  assert.equal((await getProfile()).name, 'Abdiel Deandra EL Dzaky');
  const experiences = await getExperiences();
  assert.ok(experiences.every(role => role.status === 'published'));
  const featured=await getFeaturedExperiences();
  assert.deepEqual(featured, experiences.slice(0, 3).map(({id,organization,role,year})=>({id,organization,role,year})));
  assert.ok(featured.every(role=>!('status' in role)),'Scene receives selected public fields only');
  for (const items of [await getProjects(), await getCabinetItems(), await getPublishedWriting()]) {
    assert.ok(items.every(item => item.status === 'published'));
    assert.ok(items.every(item => !item.slug.endsWith('-draft')));
  }
  assert.equal(await getWritingBySlug('writing-draft'), undefined);
  assert.equal(await getWritingBySlug('../profile'), undefined);
});
test('Markdown and trusted MDX render on the server', async () => {
  for (const format of ['md', 'mdx'] as const) {
    const result = await compileMDX({ source: '## A real heading\n\nA **strong** paragraph.', options: { mdxOptions: { format } } });
    const html = renderToStaticMarkup(result.content);
    assert.match(html, /<h2>A real heading<\/h2>/);
    assert.match(html, /<strong>strong<\/strong>/);
  }
});
test('duplicate slugs and invalid publication metadata fail', () => {
  const item = { id: 'a', slug: 'same', status: 'draft' };
  assert.throws(() => publishedOnly([item, { ...item, id: 'b' }]), /Duplicate content slug/);
  const article = { id: 'a', slug: 'article', title: 'Title', description: 'Description', status: 'published', lang: 'en', topics: [] };
  for (const date of [undefined, '2026-02-30', '2099-01-01', 'invalid']) {
    assert.throws(() => parseContent(writingSchema, { ...article, publishedAt: date }, 'test.mdx'), /test.mdx/);
  }
});

test('published Indonesian story renders registered media and all local attachments exist', async () => {
  const article=await getWritingBySlug('dua-pilihan-satu-perjalanan');
  assert.ok(article);
  assert.equal(article.lang,'id');
  assert.equal(typeof writingComponents.CalculusPreview,'function');
  assert.equal(typeof writingComponents.FeedPreview,'function');
  // Next/Image needs Next's runtime; verify MDX registration here and media rendering in the browser.
  const result=await compileMDX({source:article.content,components:{CalculusPreview:()=> 'PDF preview slot',FeedPreview:()=> 'Feed preview slot'}});
  const html=renderToStaticMarkup(result.content);
  assert.match(html,/PDF preview slot/);
  assert.match(html,/Feed preview slot/);
  const assets=['pembahasan-soal.pdf','cover.png','slide-1.png','slide-2.png','slide-3.png',...Array.from({length:5},(_,i)=>`calculus-page-${i+1}.webp`)];
  await Promise.all(assets.map(file=>access(path.join(process.cwd(),'public/writing/ime-ftui-2026',file))));
});

test('Cabinet publishes the complete deduplicated collection with local covers and safe music URLs', async()=>{
  const items=await getCabinetItems();
  assert.equal(items.length,27);
  const music=items.filter(item=>item.kind==='music');
  assert.equal(music.length,19);
  assert.equal(new Set(music.map(item=>item.href)).size,19);
  assert.equal(music.filter(item=>item.spotifyType==='album').length,1);
  assert.equal(music.filter(item=>item.preview).length,18);
  await Promise.all(items.map(item=>access(path.join(process.cwd(),'public',item.image!))));
  for(const item of music)assert.match(item.href!,/^https:\/\/open\.spotify\.com\/(track|album)\/[a-zA-Z0-9]{22}$/);
});
