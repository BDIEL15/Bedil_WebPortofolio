import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sphereSamples } from '../src/lib/scene/signal-math';
import { readFile } from 'node:fs/promises';
import * as THREE from 'three';
import { buildPersonalLab } from '../src/lib/scene/personal-lab';
import { labCameraPose, labIntroPose, labViewBounds, labViewForPath, labPoster } from '../src/lib/scene/lab-camera';
import { createLabFlight, sampleLabFlight, stillCameraVelocity } from '../src/lib/scene/lab-camera-motion';
import { robotPose } from '../src/lib/scene/robot-motion';
import { notebookMotion, notebookSegments } from '../src/lib/scene/notebook-motion';
import { isScenePhotoPath, loadScenePhotos } from '../src/lib/scene/scene-photos';
import photoSources from '../src/data/scene-photo-slots.json';
import { getFeaturedExperiences } from '../src/lib/content/files';
import {codingFrame,codingPeriod,terminalFrame} from '../src/lib/scene/workspace-screen';

test('terminal types before preparation and waits for both actual readiness and the last line',()=>{
  assert.equal(terminalFrame(0,0,null).command,'');
  const partial=terminalFrame(.3,0,null);assert.ok(partial.command.length>0&&partial.command.length<18);assert.equal(partial.prepared,false);
  assert.equal(terminalFrame(.8,0,null).prepared,true);
  assert.equal(terminalFrame(20,2,null).complete,false);
  assert.equal(terminalFrame(20,2,null).tail,'');
  assert.equal(terminalFrame(20,3,20).tail,'');
  assert.ok(terminalFrame(20.2,3,20).tail.length>0);
  const finished=terminalFrame(21,3,20);assert.equal(finished.complete,true);assert.equal(finished.cursor,false);assert.equal(finished.rows,4);
});

test('workspace typing shares bounded key strokes, corrections and quiet pauses',()=>{
  assert.deepEqual(codingFrame(0),codingFrame(codingPeriod));
  let pressed=0,quiet=0,corrected=false,last='';
  for(let time=0;time<codingPeriod;time+=.02){
    const frame=codingFrame(time);assert.ok(frame.press>=0&&frame.press<=1);
    if(frame.press>.5)pressed++;else quiet++;
    if(frame.text.length<last.length)corrected=true;last=frame.text;
  }
  assert.ok(pressed>20&&quiet>100&&corrected,'Typing needs visible strokes, thinking pauses and an actual correction');
});

test('public photo replacements crop, retain their mount on failure and ignore late loads after cleanup',()=>{
  assert.ok(isScenePhotoPath('/photos/lab-2026.webp'));
  for(const path of ['https://example.com/a.jpg','/photos/../private.jpg','/photos/a.svg','/photos/a%2fb.jpg'])assert.ok(!isScenePhotoPath(path));
  const previous=Object.getOwnPropertyDescriptor(globalThis,'Image');
  const images:FakeImage[]=[];
  class FakeImage {
    src='';naturalWidth=800;naturalHeight=400;onload:(()=>void)|null=null;onerror:(()=>void)|null=null;
    constructor(){images.push(this);}
    removeAttribute(){this.src='';}
  }
  Object.defineProperty(globalThis,'Image',{configurable:true,value:FakeImage});
  const sources=photoSources as Record<string,string|null>,old=sources['digital-laboratory'],oldOther=sources['exercise-2026'],oldPortrait=sources['memory-01'];
  const placeholder=new THREE.Texture(),material=new THREE.MeshBasicMaterial({map:placeholder}),other=new THREE.MeshBasicMaterial({map:placeholder}),portrait=new THREE.MeshBasicMaterial({map:placeholder});
  const owned:THREE.Texture[]=[];let redraws=0,cleanup:(()=>void)|undefined;
  try {
    sources['digital-laboratory']='/photos/lab.webp';sources['exercise-2026']='/photos/missing.jpg';sources['memory-01']='/photos/portrait.jpg';
    cleanup=loadScenePhotos([{id:'digital-laboratory',aspect:1.5,material},{id:'exercise-2026',aspect:1.5,material:other},{id:'memory-01',aspect:1.5,material:portrait}],texture=>owned.push(texture),()=>redraws++);
      images[0].onload!();assert.equal(material.map,owned[0]);assert.equal(material.transparent,true);assert.equal(owned[0].repeat.x,.75);assert.equal(owned[0].offset.x,.125);
    images[1].onerror!();assert.equal(other.map,placeholder);assert.equal(redraws,1);
    images[2].naturalWidth=400;images[2].naturalHeight=800;images[2].onload!();assert.equal(portrait.map,owned[1]);assert.equal(owned[1].repeat.y,1/3);assert.equal(owned[1].offset.y,(1-1/3)/2);
    const late=images[0].onload!;cleanup();late();assert.equal(redraws,2);assert.equal(images[0].onload,null);assert.equal(images[0].src,'');
  } finally {
    cleanup?.();sources['digital-laboratory']=old;sources['exercise-2026']=oldOther;sources['memory-01']=oldPortrait;
    for(const texture of owned)texture.dispose();placeholder.dispose();material.dispose();other.dispose();portrait.dispose();
    if(previous)Object.defineProperty(globalThis,'Image',previous);else Reflect.deleteProperty(globalThis,'Image');
  }
});

test('notebook writing reveals bounded strokes and lifts smoothly back to the first line',()=>{
  assert.deepEqual(notebookMotion(0),notebookMotion(12));
  assert.equal(notebookMotion(9).count,notebookSegments.length);
  for(let time=0;time<24;time+=.025) {
    const pose=notebookMotion(time);
    assert.ok(Object.values(pose).every(Number.isFinite));
    assert.ok(pose.count>=0&&pose.count<=notebookSegments.length&&pose.count%2===0);
    assert.ok(pose.x>=-.85&&pose.x<=-.18&&pose.z>=-.33&&pose.z<=.22);
    assert.ok(pose.lift>=0&&pose.lift<=.181&&pose.opacity>=0&&pose.opacity<=1);
  }
  assert.ok(notebookMotion(11.25).lift>.17,'Return must lift the pencil off the page');
  assert.ok(notebookMotion(11.999).opacity<.001,'Ink fades before a new study pass');
});

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
    for(const view of ['projects','about','experience','writing','cabinet'] as const)assert.deepEqual(overview,labCameraPose(view,aspect,true),'All routes explore the same workbench');
    for(const pose of [home,projects,overview]) assert.ok([...pose.position,...pose.target,pose.fov].every(Number.isFinite));
    const poses=['home','projects','about','experience','writing','cabinet'].map(view=>labCameraPose(view as keyof typeof labViewBounds,aspect));
    assert.equal(new Set(poses.map(pose=>JSON.stringify(pose))).size,6,'Each route needs a distinct reading camera');
    for(const view of ['home','projects','about','experience','writing','cabinet'] as const) {
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

test('cinematic flights settle exactly, preserve retarget velocity and keep bounded smooth camera travel',()=>{
  const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-9,`${a} / ${b}`);
  const compare=(a:ReturnType<typeof labCameraPose>,b:ReturnType<typeof labCameraPose>)=>{
    for(const key of ['position','target']as const)for(let i=0;i<3;i++)close(a[key][i],b[key][i]);close(a.fov,b.fov);
  };
  for(const aspect of [320/844,390/844,768/1024,1440/1000,2560/1080]) {
    const home=labCameraPose('home',aspect),intro=labIntroPose(aspect);
    assert.ok(intro.position[2]<home.position[2]-2&&intro.position[1]===2.065,'Opening starts at the monitor before pulling back to Home');
    const poses=['home','projects','about','experience','writing','cabinet'].map(view=>labCameraPose(view as keyof typeof labViewBounds,aspect));
    const overview=labCameraPose('home',aspect,true);
    for(const from of [intro,...poses,overview])for(const to of [...poses,overview]) {
      const flight=createLabFlight(from,to,stillCameraVelocity(),from===intro?'intro':to===overview?'overview':'route',aspect<1.1);
      const sample={pose:structuredClone(from),velocity:stillCameraVelocity()};
      compare(sampleLabFlight(flight,0,sample).pose,from);
      compare(sample.velocity,stillCameraVelocity());
      for(let n=0;n<=60;n++) {
        sampleLabFlight(flight,flight.duration*n/60,sample);
        assert.ok([...sample.pose.position,...sample.pose.target,sample.pose.fov,...sample.velocity.position,...sample.velocity.target,sample.velocity.fov].every(Number.isFinite));
        assert.ok(sample.pose.position[2]>=Math.min(.9,from.position[2])&&sample.pose.position[1]>=Math.min(2.7,from.position[1]),'Flight leaves its clear front corridor');
        assert.ok(sample.pose.fov>30&&sample.pose.fov<85,'Lens breathing must remain subtle');
      }
      compare(sample.pose,to);compare(sample.velocity,stillCameraVelocity());
      for(const progress of [.25,.55,.8])for(const destination of [...poses,overview]) {
        sampleLabFlight(flight,flight.duration*progress,sample);
        const before=structuredClone(sample),retarget=createLabFlight(sample.pose,destination,sample.velocity,destination===overview?'overview':'route',aspect<1.1);
        sampleLabFlight(retarget,0,sample);compare(sample.pose,before.pose);compare(sample.velocity,before.velocity);
        for(let n=1;n<40;n++) {
          sampleLabFlight(retarget,retarget.duration*n/40,sample);
          assert.ok(sample.pose.position[2]>Math.min(.8,from.position[2]-.001)&&sample.pose.position[1]>1.8,'Retarget enters the tabletop/object space: '+sample.pose.position);
          assert.ok(Math.hypot(...sample.pose.position.map((value,i)=>value-sample.pose.target[i]))>.35,'Retarget places the focus behind the near plane');
          assert.ok(sample.pose.fov>25&&sample.pose.fov<85,'Retarget causes an extreme lens jump');
        }
        sampleLabFlight(retarget,retarget.duration,sample);compare(sample.pose,destination);compare(sample.velocity,stillCameraVelocity());
      }
    }
  }
});

test('route and poster selection include both new corners and preserve reading fallback',()=>{
  for(const view of ['about','experience','writing','cabinet'] as const) {
    assert.equal(labViewForPath('/'+view),view);
    assert.equal(labPoster(view,false),'lab-'+view);
    assert.equal(labPoster(view,true),'lab-overview');
  }
  assert.equal(labViewForPath('/writing/example',['/writing/example']),'writing');
  assert.equal(labViewForPath('/writing/writing-draft',['/writing/example']),'home');
  assert.equal(labViewForPath('/writing/does-not-exist',['/writing/example']),'home');
});

test('lab props have finite bounded geometry, separated keycaps and supported desk objects', async context => {
  // Geometry-only check; actual CanvasTexture appearance is checked in the browser.
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const ink = new Proxy({measureText:(text:string)=>({width:text.length*10})} as Record<string, unknown>, { get: (target, name: string) => target[name] ?? (() => {}) });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: {
    createElement: () => ({ width: 0, height: 0, getContext: () => ink }),
  } });
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const instances = new Set<THREE.InstancedMesh>();
  try {
    const featured=await getFeaturedExperiences();
    const { lab, keyboard, projects, animateRobot,animateMonitor,setBootMode,setUnlockGlow, photoSlots } = buildPersonalLab(featured);
    lab.updateMatrixWorld(true);
    assert.equal(photoSlots.length,5);assert.equal(new Set(photoSlots.map(slot=>slot.id)).size,5);
    for(const slot of photoSlots)assert.ok(slot.material.map instanceof THREE.CanvasTexture,'Empty photo mounts must remain neutral');
    let triangles = 0, meshes = 0;
    lab.traverse(object => {
      if (!(object instanceof THREE.Mesh || object instanceof THREE.Line)) return;
      if(object instanceof THREE.Mesh)meshes++;
      geometries.add(object.geometry);
      if (object instanceof THREE.InstancedMesh) instances.add(object);
      const position = object.geometry.getAttribute('position');
      for (let i = 0; i < position.count; i++) assert.ok(Number.isFinite(position.getX(i) + position.getY(i) + position.getZ(i)));
      if(object instanceof THREE.Mesh)triangles += (object.geometry.index?.count ?? position.count) / 3 * (object instanceof THREE.InstancedMesh ? object.count : 1);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material);
        for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
      }
    });
    assert.ok(triangles < 150_000, `Triangle budget exceeded: ${triangles}`);
    assert.ok(meshes < 350, `Mesh budget exceeded: ${meshes}`);
    let deskCount=0,keyboards=0;
    lab.traverse(object=>{if(object.name==='main-workbench')deskCount++;if(object.name==='keycaps')keyboards++;});
    assert.equal(deskCount,1,'One physical workbench for all routes');assert.equal(keyboards,1,'Do not duplicate keyboards per route');
    const bezel=lab.getObjectByName('monitor-bezel') as THREE.Mesh<THREE.BufferGeometry,THREE.MeshStandardMaterial>;
    const keyboardCase=keyboard.getObjectByName('keyboard-case') as THREE.Mesh<THREE.BufferGeometry,THREE.MeshStandardMaterial>;
    assert.notEqual(bezel.material,keyboardCase.material,'Unlock glow must not affect shared desk materials');
    setUnlockGlow(10);assert.equal(bezel.material.emissiveIntensity,.3);assert.equal(keyboardCase.material.emissive.getHex(),0);
    setUnlockGlow(0);assert.equal(bezel.material.emissiveIntensity,0);
    assert.ok(lab.getObjectByName('main-shelf'),'One retained shelf');
    assert.equal(lab.getObjectByName('electronics-racks'),undefined,'The removed second-tier rack must not return');
    const electronics=lab.getObjectByName('shelf-electronics');assert.ok(electronics);
    const electronicsBounds=new THREE.Box3().setFromObject(electronics);
    assert.ok(electronicsBounds.min.y>=3.6099&&electronicsBounds.max.y<4.2,'Electronics must be supported on the retained shelf');
    const badges:THREE.Object3D[]=[];lab.traverse(object=>{if(object.name==='experience-badge')badges.push(object);});
    assert.deepEqual(badges.map(badge=>badge.userData.experienceId),featured.map(role=>role.id),'Badge order follows the first three published JSON experiences');
    const badgeBoxes=badges.map(badge=>new THREE.Box3().setFromObject(badge));
    for(let i=1;i<badgeBoxes.length;i++)assert.ok(badgeBoxes[i-1].min.x>badgeBoxes[i].max.x,'Owner priority runs from the former IME slot on the right toward the left, with visible separation');
    const blockers:THREE.Mesh[]=[];
    for(const name of ['desk-monitor','main-shelf'])lab.getObjectByName(name)!.traverse(object=>{if(object instanceof THREE.Mesh)blockers.push(object);});
    for(const aspect of [320/844,390/844,768/1024,1440/1000,2560/1080]) {
      const pose=labCameraPose('experience',aspect),origin=new THREE.Vector3(...pose.position),ray=new THREE.Raycaster();
      const badgeCamera=new THREE.PerspectiveCamera(pose.fov,aspect,.1,60);badgeCamera.position.copy(origin);badgeCamera.lookAt(...pose.target);badgeCamera.updateMatrixWorld(true);
      const screenOrder=badges.map(badge=>new THREE.Box3().setFromObject(badge).getCenter(new THREE.Vector3()).project(badgeCamera).x);
      for(let i=1;i<screenOrder.length;i++)assert.ok(screenOrder[i-1]>screenOrder[i],'Lab-first priority must occupy the rightmost visible slot in the Experience POV');
      for(const badge of badges)for(const y of [.24,0,-.32]) {
        const point=badge.localToWorld(new THREE.Vector3(0,y,.07)),direction=point.clone().sub(origin);
        ray.set(origin,direction.clone().normalize());ray.far=direction.length()-.01;
        assert.equal(ray.intersectObjects(blockers,false).length,0,'Monitor/shelf must not cover name-tag photo or identity at '+aspect+' / '+badge.userData.experienceId);
      }
    }
    for(const name of ['desk-mouse','circuit-study','bench-tool-cup','parts-tray']) {
      const prop=lab.getObjectByName(name);assert.ok(prop,name);
      const bounds=new THREE.Box3().setFromObject(prop);
      assert.ok(bounds.min.y>=1.3399&&bounds.min.x>=-3.4&&bounds.max.x<=3.4&&bounds.min.z>=-1.425&&bounds.max.z<=1.425,`${name} must stay supported on the shared tabletop`);
    }
    const fullBounds=new THREE.Box3().setFromObject(lab),room=labViewBounds.home;
    assert.ok(fullBounds.min.x>=room.min[0]&&fullBounds.max.x<=room.max[0]&&fullBounds.min.y>=room.min[1]&&fullBounds.max.y<=room.max[1]&&fullBounds.min.z>=room.min[2]&&fullBounds.max.z<=room.max[2],`All props must remain in the compact workbench: ${fullBounds.min.toArray()} / ${fullBounds.max.toArray()}`);
    const story=lab.getObjectByName('story-corners');assert.ok(story);
    const storyBounds=new THREE.Box3().setFromObject(story);
    assert.ok(storyBounds.min.x>-4.2&&storyBounds.max.x<4.2,'Notes and documents must stay on the shared pegboard/tabletop');
    assert.ok(storyBounds.min.y>=1.34-1e-7&&storyBounds.max.y<=3.6,'Story props belong on the tabletop/pegboard, with no extra furniture: '+storyBounds.min.toArray()+' / '+storyBounds.max.toArray());
    const pinboard=lab.getObjectByName('writing-pinboard');assert.ok(pinboard);
    const pinBounds=new THREE.Box3().setFromObject(pinboard);
    assert.ok(pinBounds.min.x>.9&&pinBounds.max.x<4.2&&pinBounds.min.y>2.2&&pinBounds.max.y<3.6&&pinBounds.min.z> -1.43&&pinBounds.max.z< -1.25,'Writing notes must sit against the right pegboard, clear of the intro centre');
    const shelf=lab.getObjectByName('hobby-display');assert.ok(shelf);
    const shelfBounds=new THREE.Box3().setFromObject(shelf);
    assert.ok(shelfBounds.min.y>=3.6099&&shelfBounds.max.y<4.47&&shelfBounds.min.x> -1.7&&shelfBounds.max.x<1.2,'Hobby display must be supported by the single shelf: '+shelfBounds.min.toArray()+' / '+shelfBounds.max.toArray());
    for(const [view,object] of [['about',lab.getObjectByName('about-reading-corner')!],['writing',pinboard],['cabinet',shelf],['experience',lab.getObjectByName('experience-lanyards')!]] as const) {
      const bounds=new THREE.Box3().setFromObject(object);
      for(const aspect of [320/844,390/844,768/1024,1440/1000,2560/1080]) {
        const pose=labCameraPose(view,aspect),camera=new THREE.PerspectiveCamera(pose.fov,aspect,.1,60);
        camera.position.set(...pose.position);camera.lookAt(...pose.target);camera.updateMatrixWorld(true);
        for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]) {
          const point=new THREE.Vector3(x,y,z).project(camera);
          assert.ok(Math.abs(point.x)<.99&&Math.abs(point.y)<.99,view+' hero clipped at '+aspect+': '+point.x+'/'+point.y);
        }
      }
    }
    const robot=projects.getObjectByName('robotics-study-arm');assert.ok(robot,'Projects needs a distinct robot object');
    const robotBounds=new THREE.Box3().setFromObject(robot);
    assert.ok(robotBounds.min.x>.8&&robotBounds.max.x<3.4&&robotBounds.min.y>=1.377,'Robot must be supported on the shared tabletop');
    const tool=robot.getObjectByName('robot-tool');assert.ok(tool);
    const firstPose=new THREE.Vector3().setFromMatrixPosition(tool.matrixWorld);
    const projectCameras=[320/844,390/844,768/1024,1440/1000].map(aspect=>{
      const pose=labCameraPose('projects',aspect),camera=new THREE.PerspectiveCamera(pose.fov,aspect,.1,60);
      camera.position.set(...pose.position);camera.lookAt(...pose.target);camera.updateMatrixWorld(true);return camera;
    });
    let travel=0;
    for(let time=0;time<=16;time+=.125) {
      animateRobot(time);lab.updateMatrixWorld(true);
      const bounds=new THREE.Box3().setFromObject(robot);
      assert.ok(bounds.min.y>=1.377&&bounds.max.y<3.5&&bounds.min.x>.8&&bounds.max.x<3.4,'Moving robot leaves its tabletop area');
      for(const camera of projectCameras)for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]) {
        const point=new THREE.Vector3(x,y,z).project(camera);
        assert.ok(Math.abs(point.x)<=.99&&Math.abs(point.y)<=.99,`Projects clips the animated robot at aspect ${camera.aspect}, time ${time}: ${point.x}/${point.y}`);
      }
      const toolPosition=new THREE.Vector3().setFromMatrixPosition(tool.matrixWorld);
      travel=Math.max(travel,toolPosition.distanceTo(firstPose));
      const up=new THREE.Vector3(0,1,0).transformDirection(tool.matrixWorld);
      assert.ok(up.y>.999,'Gripper must remain upright through linked motion');
      const tips=new THREE.Box3().setFromObject(tool);
      assert.ok(tips.min.y>1.67,'Gripper enters the sample/fixture');
    }
    assert.ok(travel>.15,'Robot sweep must visibly move the tool');
    animateRobot(0);
    assert.equal(projects.getObjectByName('robotics-keyboard'),undefined,'Use the one existing keyboard');
    const keys = keyboard.getObjectByName('keycaps');
    assert.ok(keys instanceof THREE.InstancedMesh);
    assert.equal(keys.count, 61, 'ANSI 60% keyboard');
    let strokeTime=0;
    for(let time=0;time<codingPeriod;time+=.01)if(codingFrame(time).key==='A'&&codingFrame(time).press>.8){strokeTime=time;break;}
    assert.ok(strokeTime>0,'Expected an A stroke in the illustrative editor');
    animateMonitor(strokeTime);
    let depressed=0;
    for(let i=0;i<keys.count;i++){const value=new THREE.Matrix4();keys.getMatrixAt(i,value);if(value.elements[13]<.07)depressed++;}
    assert.equal(depressed,1,'The editor stroke must depress exactly one keycap');
    setBootMode(true);
    for(let i=0;i<keys.count;i++){const value=new THREE.Matrix4();keys.getMatrixAt(i,value);assert.ok(Math.abs(value.elements[13]-.0715)<1e-6,'Boot must release all keycaps');}
    setBootMode(false);
    const display=lab.getObjectByName('workspace-screen') as THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
    const version=display.material.map!.version;animateMonitor(0);animateMonitor(.01);
    assert.equal(display.material.map!.version,version,'Unchanged editor text must not upload another texture');
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
      assert.ok(new THREE.Box3().setFromObject(object).min.y >= (name==='monitor-base'?1.34:1.36), `${name} penetrates the desk/mat`);
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
