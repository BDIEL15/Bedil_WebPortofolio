import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { z } from 'zod';
import { cabinetSchema, experienceSchema, parseContent, profileSchema, projectSchema, publishedOnly, writingSchema } from './schema';

const root = path.join(process.cwd(), 'src/content');
async function json(file: string) { return JSON.parse(await readFile(path.join(root, file), 'utf8')); }
async function collection<T extends { id: string; slug: string; status: string }>(folder: string, schema: z.ZodType<T>) {
  const files = (await readdir(path.join(root, folder))).filter(file => file.endsWith('.json')).sort();
  return publishedOnly(await Promise.all(files.map(async file => parseContent(schema, await json(`${folder}/${file}`), `${folder}/${file}`))));
}
export async function getProfile() { return parseContent(profileSchema, await json('profile.json'), 'profile.json'); }
export async function getExperiences() { return parseContent(experienceSchema, await json('experiences.json'), 'experiences.json').filter(item => item.status === 'published'); }
// File order is the owner's display priority; only the first three published roles enter the scene.
export async function getFeaturedExperiences() {
  return (await getExperiences()).slice(0,3).map(({id,organization,role,year})=>({id,organization,role,year}));
}
export function getProjects() { return collection('projects', projectSchema); }
export function getCabinetItems() { return collection('cabinet', cabinetSchema); }
export async function getPublishedWriting() {
  const files = (await readdir(path.join(root, 'writing'))).filter(file => /\.mdx?$/.test(file)).sort();
  const entries = await Promise.all(files.map(async file => {
    const source = await readFile(path.join(root, 'writing', file), 'utf8');
    const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(source);
    if (!match) throw new Error(`writing/${file}: YAML frontmatter is required`);
    const data: unknown = parseYaml(match[1]);
    const content = match[2];
    return { ...parseContent(writingSchema, data, `writing/${file}`), content, format: file.endsWith('.mdx') ? 'mdx' : 'md' };
  }));
  return publishedOnly(entries).sort((a, b) => b.publishedAt!.localeCompare(a.publishedAt!));
}
export async function getWritingBySlug(slug: string) { return (await getPublishedWriting()).find(item => item.slug === slug); }
