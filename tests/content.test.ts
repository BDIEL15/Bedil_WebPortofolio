import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getCabinetItems, getExperiences, getProfile, getProjects, getPublishedWriting, getWritingBySlug } from '../src/lib/content/files';
import { parseContent, publishedOnly, writingSchema } from '../src/lib/content/schema';
import { compileMDX } from 'next-mdx-remote/rsc';
import { renderToStaticMarkup } from 'react-dom/server';

test('real profile and only published content cross the public boundary', async () => {
  assert.equal((await getProfile()).name, 'Abdiel Deandra EL Dzaky');
  assert.equal((await getExperiences()).length, 3);
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
