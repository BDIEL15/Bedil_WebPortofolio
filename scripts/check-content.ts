import { compileMDX } from 'next-mdx-remote/rsc';
import { getProfile, getExperiences, getProjects, getCabinetItems, getPublishedWriting } from '../src/lib/content/files';

try {
  const [, experiences, projects, cabinet, writing] = await Promise.all([
    getProfile(), getExperiences(), getProjects(), getCabinetItems(), getPublishedWriting(),
  ]);
  for (const article of writing) {
    try {
      await compileMDX({ source: article.content, options: { mdxOptions: { format: article.format as 'md' | 'mdx' } } });
    } catch (error) {
      throw new Error(`writing/${article.slug}: ${(error as Error).message}`);
    }
  }
  console.log(`Konten valid (termasuk metadata draft). Published: ${experiences.length} experience, ${projects.length} project, ${cabinet.length} cabinet, ${writing.length} writing.\nBody tulisan published berhasil dikompilasi. Draft tidak ditampilkan.`);
} catch (error) {
  console.error(`Konten belum siap:\n${(error as Error).message}`);
  process.exitCode = 1;
}
