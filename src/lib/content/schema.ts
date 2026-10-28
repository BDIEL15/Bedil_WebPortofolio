import { z } from 'zod';

const text = z.string().trim().min(1);
const base = z.object({ id: text, slug: text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: text, status: z.enum(['draft', 'published']) });
export const profileSchema = z.object({ name: text, headline: text, intro: text, bio: text, interests: z.array(text).min(1), interestsDescription: text, education:z.object({course:text,institution:text}).optional(), focusAreas:z.array(text).optional(), socialLinks:z.array(z.object({label:text,icon:z.enum(['github','linkedin','instagram','email']),href:z.string().url().refine(value=>value.startsWith('https://')||value.startsWith('mailto:'),'Use HTTPS or mailto links')})).default([]) });
export const aboutSchema = z.object({ heading: text, paragraphs: z.array(text).min(1), portrait: z.object({ src: text.regex(/^\/photos\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/), alt: text, width: z.number().int().positive(), height: z.number().int().positive() }) });
export const experienceSchema = z.array(z.object({
  id: text, organization: text, role: text, year: text.optional(), status: z.enum(['draft', 'published']),
  organizationName: text.optional(), period: text.optional(), employmentType: text.optional(), location: text.optional(),
  logo: text.regex(/^\/logos\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/).optional(), description: text.optional(),
  skills: z.array(text).optional(), achievements: z.array(text).optional(),
}));
export const projectSchema = base.extend({ summary: text });
export const cabinetSchema = base.extend({ note: text, kind: text });
export const writingSchema = base.extend({ description: text, lang: z.literal('en'), topics: z.array(text), publishedAt: text.optional(), updatedAt: text.optional() }).superRefine((item, ctx) => {
  if (item.status === 'published' && !item.publishedAt) ctx.addIssue({ code: 'custom', path: ['publishedAt'], message: 'Required for published writing' });
  for (const key of ['publishedAt', 'updatedAt'] as const) {
    const value = item[key];
    if (value && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value || value > new Date().toISOString().slice(0, 10))) {
      ctx.addIssue({ code: 'custom', path: [key], message: 'Use a valid date, not in the future (YYYY-MM-DD)' });
    }
  }
});

export function parseContent<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) throw new Error(`${file}: ${result.error.message}`);
  return result.data;
}

export function publishedOnly<T extends { id: string; slug: string; status: string }>(items: T[]): T[] {
  for (const key of ['id', 'slug'] as const) {
    if (new Set(items.map(item => item[key])).size !== items.length) throw new Error(`Duplicate content ${key}`);
  }
  return items.filter(item => item.status === 'published');
}
