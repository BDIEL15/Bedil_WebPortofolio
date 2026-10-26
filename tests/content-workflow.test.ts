import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parse as parseYaml } from 'yaml';
import { cabinetSchema, projectSchema, writingSchema } from '../src/lib/content/schema';

test('content command creates valid drafts and refuses overwrite, traversal and unknown types', async () => {
  const workspace = await mkdtemp(path.join(tmpdir(), 'portfolio-content-'));
  const script = path.resolve('scripts/new-content.mjs');
  const run = (...args: string[]) => spawnSync(process.execPath, [script, ...args], { cwd: workspace, encoding: 'utf8' });
  try {
    for (const [type, folder, extension] of [['project', 'projects', 'json'], ['cabinet', 'cabinet', 'json'], ['writing', 'writing', 'md']]) {
      assert.equal(run(type, 'my-story').status, 0);
      const file = path.join(workspace, 'src/content', folder, `my-story.${extension}`);
      const original = await readFile(file, 'utf8');
      if (type === 'project') projectSchema.parse(JSON.parse(original));
      if (type === 'cabinet') cabinetSchema.parse(JSON.parse(original));
      if (type === 'writing') writingSchema.parse(parseYaml(original.split('---')[1]));
      assert.match(original, /draft/);
      assert.ok(!original.includes('__SLUG__'));
      assert.equal(run(type, 'my-story').status, 1);
      assert.equal(await readFile(file, 'utf8'), original);
    }
    await mkdir(path.join(workspace, 'src/content/writing'), { recursive: true });
    await writeFile(path.join(workspace, 'src/content/writing/existing.mdx'), 'keep me');
    assert.equal(run('writing', 'existing').status, 1);
    for (const args of [['project', '../escape'], ['project', 'Upper Case'], ['unknown', 'valid'], ['project']]) {
      assert.equal(run(...args).status, 1);
    }
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});
