import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const types = { project: ['projects', 'json'], cabinet: ['cabinet', 'json'], writing: ['writing', 'md'] };
const [type, slug, ...extra] = process.argv.slice(2);

try {
  if (!Object.hasOwn(types, type ?? '') || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? '') || extra.length) {
    throw new Error('Gunakan: npm run content:new -- <project|cabinet|writing> <slug-huruf-kecil>');
  }
  const [folder, extension] = types[type];
  const template = fileURLToPath(new URL(`../templates/content/${type}.${extension}`, import.meta.url));
  const target = path.join(process.cwd(), 'src/content', folder, `${slug}.${extension}`);
  // Both writing extensions resolve to the same public slug.
  await mkdir(path.dirname(target), { recursive: true });
  if (type === 'writing' && (await readdir(path.dirname(target))).includes(`${slug}.mdx`)) {
    throw new Error(`Draft ${slug}.mdx sudah ada; pilih slug lain.`);
  }
  const source = (await readFile(template, 'utf8')).replaceAll('__SLUG__', slug);
  await writeFile(target, source, { flag: 'wx' });
  console.log(`Draft dibuat: ${path.relative(process.cwd(), target)}\nEdit isinya, lalu jalankan npm run content:check. Status masih draft.`);
} catch (error) {
  console.error(error.code === 'EEXIST' ? 'File sudah ada; tidak ditimpa. Pilih slug lain.' : error.message);
  process.exitCode = 1;
}
