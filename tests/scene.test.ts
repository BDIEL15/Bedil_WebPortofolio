import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sphereSamples } from '../src/lib/scene/signal-math';
import { readFile } from 'node:fs/promises';

test('local robot GLB includes all seven links, a bounded mesh budget, and its license', async () => {
  const asset = await readFile(new URL('../public/models/irb52.glb', import.meta.url));
  assert.equal(asset.readUInt32LE(0), 0x46546c67);
  assert.equal(asset.readUInt32LE(4), 2);
  assert.equal(asset.readUInt32LE(8), asset.length);
  assert.ok(asset.length < 2_000_000);
  const length = asset.readUInt32LE(12);
  const model = JSON.parse(asset.subarray(20,20+length).toString());
  for (const name of ['base_link','link_1','link_2','link_3','link_4','link_5','link_6']) {
    assert.ok(model.nodes.some((node:{name:string})=>node.name===name), `Missing robot link ${name}`);
  }
  assert.equal(model.meshes.length,7);
  assert.equal(model.images?.length ?? 0,0);
  const triangles = model.meshes.reduce((sum:number,mesh:{primitives:{indices:number}[]})=>sum+mesh.primitives.reduce((total,p)=>total+model.accessors[p.indices].count/3,0),0);
  assert.equal(triangles,26060);
  assert.match(await readFile(new URL('../public/models/LICENSE-IRB52.txt',import.meta.url),'utf8'),/Apache License/);
});

test('signal point samples are deterministic, finite and distributed on a unit sphere', () => {
  const samples = sphereSamples();
  assert.equal(samples.length, 7200);
  assert.deepEqual(samples, sphereSamples());
  const bounds = [Infinity, -Infinity];
  for (let i = 0; i < samples.length; i += 3) {
    const [x, y, z] = samples.slice(i, i + 3);
    assert.ok(Number.isFinite(x + y + z));
    assert.ok(Math.abs(Math.hypot(x, y, z) - 1) < 1e-6);
    bounds[0] = Math.min(bounds[0], y); bounds[1] = Math.max(bounds[1], y);
  }
  assert.ok(bounds[0] < -0.99 && bounds[1] > 0.99);
});
