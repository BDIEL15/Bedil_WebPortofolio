import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sphereSamples } from '../src/lib/scene/signal-math';
import { readFile } from 'node:fs/promises';
import * as THREE from 'three';
import { buildPersonalLab } from '../src/lib/scene/personal-lab';
import { labCameraPose, labViewBounds, labViewForPath, labPoster } from '../src/lib/scene/lab-camera';
import { robotPose } from '../src/lib/scene/robot-motion';

test('robot motion loops with bounded, smooth joint angles and no seam jump', () => {
  assert.deepEqual(robotPose(0),robotPose(16));
  for(let time=0;time<=32;time+=.025) {
    const pose=robotPose(time);
    assert.ok(Object.values(pose).every(Number.isFinite));
    assert.ok(Math.abs(pose.yaw)<=.121&&Math.abs(pose.shoulder)<=.131&&Math.abs(pose.elbow)<=.221&&Math.abs(pose.wrist)<=.061);
    assert.ok(pose.grip>=0&&pose.grip<=.026);
  }
  for(const time of [0,4,8,12,16]) {
    const before=robotPose(time-.001),after=robotPose(time+.001);
    for(const key of Object.keys(before) as (keyof typeof before)[])assert.ok(Math.abs(before[key]-after[key])<1e-7,'Joint seam is discontinuous');
  }
});

test('camera views are distinct and overview contains the lab at desktop and portrait sizes', () => {
  for (const aspect of [320/844,390/844,768/1024,1440/900,2560/1080]) {
    const home=labCameraPose('home',aspect),projects=labCameraPose('projects',aspect),overview=labCameraPose('home',aspect,true);
    assert.notDeepEqual(home,projects);
    assert.ok(overview.position[1]>home.position[1], 'Overview must rise above the seated eye line');
    assert.notDeepEqual(overview,labCameraPose('projects',aspect,true), 'Each workspace needs its own overview');
    for(const pose of [home,projects,overview]) assert.ok([...pose.position,...pose.target,pose.fov].every(Number.isFinite));
    const poses=['home','projects','about','experience'].map(view=>labCameraPose(view as keyof typeof labViewBounds,aspect));
    assert.equal(new Set(poses.map(pose=>JSON.stringify(pose))).size,4,'Reading/robotics/documentation need distinct cameras');
    for(const view of ['home','projects','about','experience'] as const) {
      const pose=labCameraPose(view,aspect,true),bounds=labViewBounds[view];
      const camera=new THREE.PerspectiveCamera(pose.fov,aspect,.1,60);
      camera.position.set(...pose.position);camera.lookAt(...pose.target);camera.updateMatrixWorld(true);
      for(const x of [bounds.min[0],bounds.max[0]])for(const y of [bounds.min[1],bounds.max[1]])for(const z of [bounds.min[2],bounds.max[2]]) {
        const point=new THREE.Vector3(x,y,z).project(camera);
        assert.ok(Math.abs(point.x)<=.901&&Math.abs(point.y)<=.901&&point.z>-1&&point.z<1, `Overview clips ${view} at aspect ${aspect}`);
      }
    }
  }
});

test('route and poster selection include both new corners and preserve reading fallback',()=>{
  for(const view of ['about','experience'] as const) {
    assert.equal(labViewForPath('/'+view),view);
    assert.equal(labPoster(view,false),'lab-'+view);
    assert.equal(labPoster(view,true),'lab-'+view+'-overview');
  }
  assert.equal(labViewForPath('/writing/example'),'home');
});

test('lab props have finite bounded geometry, separated keycaps and supported desk objects', context => {
  // Geometry-only check; actual CanvasTexture appearance is checked in the browser.
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const ink = new Proxy({} as Record<string, unknown>, { get: (target, name: string) => target[name] ?? (() => {}) });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: {
    createElement: () => ({ width: 0, height: 0, getContext: () => ink }),
  } });
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const instances = new Set<THREE.InstancedMesh>();
  try {
    const { lab, keyboard, projects, animateRobot } = buildPersonalLab();
    lab.updateMatrixWorld(true);
    let triangles = 0, meshes = 0;
    lab.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      meshes++;
      geometries.add(object.geometry);
      if (object instanceof THREE.InstancedMesh) instances.add(object);
      const position = object.geometry.getAttribute('position');
      for (let i = 0; i < position.count; i++) assert.ok(Number.isFinite(position.getX(i) + position.getY(i) + position.getZ(i)));
      triangles += (object.geometry.index?.count ?? position.count) / 3 * (object instanceof THREE.InstancedMesh ? object.count : 1);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material);
        for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
      }
    });
    assert.ok(triangles < 150_000, `Triangle budget exceeded: ${triangles}`);
    assert.ok(meshes < 350, `Mesh budget exceeded: ${meshes}`);
    assert.ok(lab.getObjectByName('about-reading-corner')&&lab.getObjectByName('experience-documentation-corner'),'Both physical story corners must be built');
    const story=lab.getObjectByName('story-corners');assert.ok(story);
    const storyBounds=new THREE.Box3().setFromObject(story);
    assert.ok(storyBounds.max.x<-4.8&&storyBounds.min.x>=-16.1,'Story props must occupy the new physical areas, not overlap Home');
    assert.ok(storyBounds.min.y>=-.195&&storyBounds.max.y<=4.65,'Story furniture must remain above the room floor and inside overview bounds');
    const robot=projects.getObjectByName('robotics-study-arm');assert.ok(robot,'Projects needs a distinct robot object');
    const robotBounds=new THREE.Box3().setFromObject(robot);
    assert.ok(robotBounds.min.x>5&&robotBounds.min.y>=1.377,'Robot must be in the separate bay, supported by its mounting pad');
    const tool=robot.getObjectByName('robot-tool');assert.ok(tool);
    const firstPose=new THREE.Vector3().setFromMatrixPosition(tool.matrixWorld);
    let travel=0;
    for(let time=0;time<=16;time+=.125) {
      animateRobot(time);lab.updateMatrixWorld(true);
      const bounds=new THREE.Box3().setFromObject(robot);
      assert.ok(bounds.min.y>=1.377&&bounds.max.y<4.45&&bounds.min.x>5.15&&bounds.max.x<11.85,'Moving robot leaves workspace');
      const toolPosition=new THREE.Vector3().setFromMatrixPosition(tool.matrixWorld);
      travel=Math.max(travel,toolPosition.distanceTo(firstPose));
      const up=new THREE.Vector3(0,1,0).transformDirection(tool.matrixWorld);
      assert.ok(up.y>.999,'Gripper must remain upright through linked motion');
      const tips=new THREE.Box3().setFromObject(tool);
      assert.ok(tips.min.y>1.67,'Gripper enters the sample/fixture');
    }
    assert.ok(travel>.15,'Robot sweep must visibly move the tool');
    animateRobot(0);
    assert.ok(new THREE.Box3().setFromObject(projects.getObjectByName('robotics-keyboard')!).min.y>=1.34,'Terminal keyboard penetrates tabletop');
    const keys = keyboard.getObjectByName('keycaps');
    assert.ok(keys instanceof THREE.InstancedMesh);
    assert.equal(keys.count, 61, 'ANSI 60% keyboard');
    keys.geometry.computeBoundingBox();
    const boxes: THREE.Box3[] = [];
    for (let i = 0; i < keys.count; i++) {
      const matrix = new THREE.Matrix4(); keys.getMatrixAt(i, matrix);
      const bounds: THREE.Box3 = keys.geometry.boundingBox!.clone().applyMatrix4(matrix);
      assert.ok(bounds.min.x >= -.94 && bounds.max.x <= .94, 'Key extends outside the case');
      for (const other of boxes) assert.ok(!bounds.intersectsBox(other), 'Keycaps intersect');
      boxes.push(bounds);
    }
    assert.ok(Math.max(...boxes.map(box => box.max.x - box.min.x)) > .65, 'Spacebar must span several key units');
    for (const name of ['monitor-base', 'keyboard-case', 'keyboard-coil']) {
      const object = lab.getObjectByName(name);
      assert.ok(object, name);
      assert.ok(new THREE.Box3().setFromObject(object).min.y >= 1.36, `${name} penetrates the desk/mat`);
    }
    const coil = lab.getObjectByName('keyboard-coil') as THREE.Mesh<THREE.TubeGeometry>;
    assert.ok(coil.geometry.parameters.tubularSegments >= 7 * 24, 'Seven-turn cable is undersampled');
    context.diagnostic(`${meshes} meshes, ${triangles} rendered triangles, ${geometries.size} shared geometries, ${textures.size} generated textures`);
  } finally {
    for (const instance of instances) instance.dispose();
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    for (const texture of textures) texture.dispose();
    if (previous) Object.defineProperty(globalThis, 'document', previous);
    else Reflect.deleteProperty(globalThis, 'document');
  }
});

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
