// Rebuild the presentation asset from pinned, Apache-2.0 ROS-Industrial meshes.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

const revision = '45f4769d826cf3ac62a65495f2db67b78b0c81df';
const source = `https://raw.githubusercontent.com/ros-industrial/abb/${revision}/abb_irb52_support/`;
const cache = new URL('../.taste-skill/robot-source/', import.meta.url);
const output = new URL('../public/models/', import.meta.url);
await mkdir(cache, { recursive: true });
await mkdir(output, { recursive: true });

async function get(path, name) {
  const file = new URL(name, cache);
  try { return await readFile(file); } catch {
    const response = await fetch(source + path);
    assert.ok(response.ok, `Source download: ${path} (${response.status})`);
    const bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(file, bytes);
    return bytes;
  }
}

// GLTFExporter uses browser FileReader even for an untextured binary export.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); });
  }
};

const robot = new THREE.Group();
robot.name = 'IRB52';
robot.rotation.x = -Math.PI / 2;
const shell = new THREE.MeshStandardMaterial({ name: 'Warm porcelain', color: '#b9b6a9', roughness: 0.38, metalness: 0.36 });
const wrist = new THREE.MeshStandardMaterial({ name: 'Anodised graphite', color: '#343b3a', roughness: 0.36, metalness: 0.65 });
const names = ['base_link', 'link_1', 'link_2', 'link_3', 'link_4', 'link_5', 'link_6'];
const offsets = [[0,0,0], [0,0,.4865], [.15,0,0], [0,0,.475], [0,0,0], [.6,0,0], [.065,0,0]];
let parent = robot;
let triangles = 0;
for (const [index, name] of names.entries()) {
  const family = name === 'link_2' ? 'irb52_7_120' : 'irb52';
  const bytes = await get(`meshes/${family}/visual/${name}.stl`, `${name}.stl`);
  const raw = new STLLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  const geometry = mergeVertices(raw, 1e-5);
  triangles += geometry.index.count / 3;
  assert.ok(geometry.attributes.position.count > 0);
  const joint = new THREE.Group();
  joint.name = name;
  joint.position.fromArray(offsets[index]);
  const mesh = new THREE.Mesh(geometry, index >= 5 ? wrist : shell);
  mesh.name = `${name}_surface`;
  if (name === 'link_4') mesh.position.x = .6;
  joint.add(mesh);
  parent.add(joint);
  parent = joint;
  raw.dispose();
}
robot.getObjectByName('link_2').rotation.y = -.45;
robot.getObjectByName('link_3').rotation.y = .9;
robot.getObjectByName('link_5').rotation.y = .45;
robot.updateMatrixWorld(true);
const bounds = new THREE.Box3().setFromObject(robot).getSize(new THREE.Vector3());
assert.ok(bounds.y > .7 && bounds.y < 2 && triangles < 40000, 'Plausible dimensions/triangle budget');
const glb = await new GLTFExporter().parseAsync(robot, { binary: true, onlyVisible: true });
assert.ok(glb instanceof ArrayBuffer && glb.byteLength < 2000000, 'Presentation GLB must stay below 2 MB');
await writeFile(new URL('irb52.glb', output), Buffer.from(glb));
await writeFile(new URL('LICENSE-IRB52.txt', output), await get('LICENSE', 'LICENSE'));
await writeFile(new URL('NOTICE-IRB52.txt', output), `ABB IRB 52 presentation model\nSource: https://github.com/ros-industrial/abb/tree/${revision}/abb_irb52_support\nAuthors listed by the source package: Michael Ripperger; Levi Armstrong (SwRI); ROS-Industrial community.\nLicense: Apache-2.0; see LICENSE-IRB52.txt.\nChanges: STL links indexed and assembled from URDF offsets, converted to glTF/Y-up, posed, and assigned presentation materials. No textures or branding added. This illustration is not a project or robot owned by Abdiel.\n`);
console.log(JSON.stringify({ revision, bytes: glb.byteLength, triangles, meshes: names.length, textures: 0, bounds: bounds.toArray() }));
