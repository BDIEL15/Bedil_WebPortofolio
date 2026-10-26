import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildPersonalLab } from './personal-lab';
import { loadScenePhotos } from './scene-photos';
import { labCameraPose, labIntroPose, type LabCameraPose, type LabView } from './lab-camera';
import { createLabFlight, sampleLabFlight, stillCameraVelocity, type LabFlight, type LabFlightKind } from './lab-camera-motion';
import type { ExperienceBadge } from './story-corners';

export type PersonalLabScene = {
  setView(view: LabView, overview: boolean): void;
  setPaused(value: boolean): void;
  setExploring(value: boolean): void;
  rotate(direction: number): void;
  reset(): void;
  startIntro(): void;
  skipIntro(): void;
  dispose(): void;
};
export type BootProgress='workspace'|'graphics'|'ready';
type EntryState='waiting'|'playing'|'revealing'|'complete'|'interrupted';
type InitialView = { view: LabView; overview: boolean; paused: boolean; experiences:readonly ExperienceBadge[];intro:boolean;onProgress?:(stage:BootProgress)=>void;onEntry?:(state:EntryState)=>void };

// One shared, capped loop keeps the workbench alive; pause/hidden/static stop it.
export async function createPersonalLabScene(host: HTMLElement, onFailure: () => void, signal: AbortSignal, initial: InitialView): Promise<PersonalLabScene> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  renderer.domElement.className = 'workshop-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.setClearColor('#14120f');
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2('#14120f', .042);
  const camera = new THREE.PerspectiveCamera(37,1,.1,60);
  const controls = new OrbitControls(camera,renderer.domElement);
  controls.enabled=false; controls.enableZoom=false; controls.enablePan=false;
  controls.enableDamping=false; controls.rotateSpeed=.35;
  controls.minPolarAngle=1.35; controls.maxPolarAngle=1.68;
  controls.minAzimuthAngle=-.3; controls.maxAzimuthAngle=.3;
  renderer.domElement.style.touchAction='pan-y pinch-zoom';
  const geometries=new Set<THREE.BufferGeometry>();
  const materials=new Set<THREE.Material>();
  const textures=new Set<THREE.Texture>();
  const instances=new Set<THREE.InstancedMesh>();
  const shadowLights=new Set<THREE.DirectionalLight | THREE.SpotLight>();
  let disposed=false, width=1, height=1;
  let view=initial.view, overview=initial.overview, paused=initial.paused, exploring=false;
  let transition:LabFlight|null=null,flightTime=0,flightFogFrom=.042,flightFogTo=.042;
  let introWaiting=initial.intro,warming=true,introRevealed=false,introEditor=false;
  const flightSample={pose:labCameraPose(initial.view,1),velocity:stillCameraVelocity()};
  host.dataset.cameraEntry='skipped';
  let observer: ResizeObserver | undefined;
  let environment: THREE.WebGLRenderTarget | undefined;
  let stopPhotoLoading:(()=>void)|undefined;
  let model: ReturnType<typeof buildPersonalLab> | undefined;
  let sceneTime=0, notebookTime=0, lastMotionFrame: number | null=null, motionRunning=false,lastShadowTime=-Infinity;
  const key=new THREE.DirectionalLight('#ffe5bd',3.2);
  key.position.set(-3,7,6);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);
  Object.assign(key.shadow.camera,{left:-5,right:5,top:6,bottom:-2,near:.5,far:20});
  key.shadow.normalBias=.025;key.shadow.bias=-.0002;

  function track() {
    scene.traverse(object=>{
      if(object instanceof THREE.DirectionalLight || object instanceof THREE.SpotLight){shadowLights.add(object);object.shadow.autoUpdate=false;}
      if (!(object instanceof THREE.Mesh || object instanceof THREE.Line))return;
      geometries.add(object.geometry);
      if(object instanceof THREE.InstancedMesh)instances.add(object);
      for(const material of Array.isArray(object.material)?object.material:[object.material]) {
        materials.add(material);
        for(const value of Object.values(material))if(value instanceof THREE.Texture)textures.add(value);
      }
    });
  }
  function dispose() {
    if(disposed)return;
    disposed=true;transition=null;renderer.setAnimationLoop(null);
    document.removeEventListener('visibilitychange',visibilityChanged);
    delete host.dataset.cameraMotion;delete host.dataset.cameraView;delete host.dataset.cameraEntry;delete host.dataset.cameraFlight;delete host.dataset.robotMotion;delete host.dataset.notebookMotion;
    stopPhotoLoading?.();signal.removeEventListener('abort',dispose);observer?.disconnect();controls.removeEventListener('change',cameraChanged);controls.removeEventListener('start',controlsStarted);controls.dispose();
    renderer.domElement.removeEventListener('webglcontextlost',contextLost);
    for(const instance of instances)instance.dispose();
    for(const resource of geometries)resource.dispose();
    for(const resource of materials)resource.dispose();
    for(const resource of textures)resource.dispose();
    environment?.dispose();for(const light of shadowLights)light.shadow.dispose();
    renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();
  }
  function fail(){if(!disposed){dispose();onFailure();}}
  function contextLost(event:Event){event.preventDefault();fail();}
  signal.addEventListener('abort',dispose,{once:true});
  function draw(){if(!disposed){try{renderer.render(scene,camera);}catch{fail();}}}
  async function preparationFrame(){
    if(signal.aborted||disposed)throw new DOMException('Aborted','AbortError');
    await new Promise<void>((resolve,reject)=>{
      const abort=()=>{cancelAnimationFrame(frame);reject(new DOMException('Aborted','AbortError'));};
      const frame=requestAnimationFrame(()=>{signal.removeEventListener('abort',abort);resolve();});
      signal.addEventListener('abort',abort,{once:true});
    });
  }
  function syncMotion() {
    if(disposed)return;
    const play=!!model&&!paused&&!document.hidden&&!introWaiting&&!warming;
    host.dataset.robotMotion=play?'playing':paused?'paused':document.hidden?'hidden':'inactive';
    host.dataset.notebookMotion=view==='about'?host.dataset.robotMotion:'inactive';
    model?.animateWriting(notebookTime,view==='about');
    if(play===motionRunning)return;
    motionRunning=play;lastMotionFrame=null;
    renderer.setAnimationLoop(play?animateScene:null);
  }
  function animateScene(time:number) {
    if(!motionRunning||disposed)return;
    const frameRate=transition?60:30;
    if(lastMotionFrame!==null&&time-lastMotionFrame<1000/frameRate-.5)return;
    const delta=lastMotionFrame===null?0:Math.min((time-lastMotionFrame)/1000,.1);
    lastMotionFrame=time;sceneTime+=delta;
    if(transition) {
      flightTime=Math.min(transition.duration,flightTime+delta);
      applyPose(sampleLabFlight(transition,flightTime,flightSample).pose);
      const t=flightTime/transition.duration,blend=t*t*t*(t*(6*t-15)+10);
      if(transition.kind==='intro'){
        model?.setUnlockGlow(.3*Math.exp(-flightTime*2.6));
        if(flightTime>.4&&!introEditor){introEditor=true;model?.setBootMode(false);}
        if(t>.65&&!introRevealed){introRevealed=true;initial.onEntry?.('revealing');}
      }
      (scene.fog as THREE.FogExp2).density=flightFogFrom+(flightFogTo-flightFogFrom)*blend;
      if(flightTime>=transition.duration)finishTransition();
    }
    if(view==='about')notebookTime+=delta;
    model?.animateRobot(sceneTime);model?.animateMonitor(sceneTime);model?.animateWriting(notebookTime,view==='about');
    // Camera flight can render at 60Hz without rebuilding the shared shadow map at 60Hz.
    if(!transition||sceneTime-lastShadowTime>=1/30-.001){
      key.shadow.needsUpdate=true;renderer.shadowMap.needsUpdate=true;lastShadowTime=sceneTime;
    }
    draw();
  }
  function stopTransition(completed=false) {
    if(transition?.kind==='intro'){
      host.dataset.cameraEntry=completed?'complete':'interrupted';model?.setBootMode(false);model?.setUnlockGlow(0);
      initial.onEntry?.(completed?'complete':'interrupted');
    }
    transition=null;host.dataset.cameraMotion='idle';host.dataset.cameraFlight='none';
    flightSample.velocity=stillCameraVelocity();
  }
  function constrain() {
    const offset=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    controls.minAzimuthAngle=offset.theta-(overview?.5:.3);controls.maxAzimuthAngle=offset.theta+(overview?.5:.3);
    controls.minPolarAngle=Math.max(.2,offset.phi-.2);controls.maxPolarAngle=Math.min(Math.PI-.2,offset.phi+.2);
  }
  function cameraChanged() { if(!transition)draw(); }
  function controlsStarted(){if(transition){stopTransition();constrain();syncMotion();}}
  function applyPose(pose:LabCameraPose) {
    camera.position.set(...pose.position);controls.target.set(...pose.target);camera.fov=pose.fov;
    camera.updateProjectionMatrix();controls.update();
  }
  function finishTransition() {
    stopTransition(true);constrain();controls.saveState();controls.enabled=exploring;syncMotion();
  }
  function moveToView(animate:boolean,kind:LabFlightKind=overview?'overview':'route') {
    if(disposed)return;
    if(introWaiting){introWaiting=false;model?.setBootMode(false);host.dataset.cameraEntry='interrupted';initial.onEntry?.('interrupted');}
    const velocity=transition?structuredClone(flightSample.velocity):stillCameraVelocity();
    stopTransition();
    syncMotion();
    const pose=labCameraPose(view,width/height,overview);
    const fog=scene.fog as THREE.FogExp2;
    const fogDensity=overview?(width/height<1.1?.012:.025):.042;
    host.dataset.cameraView=overview?'overview':view;
    controls.enabled=exploring;
    controls.minAzimuthAngle=-Infinity;controls.maxAzimuthAngle=Infinity;
    controls.minPolarAngle=.01;controls.maxPolarAngle=Math.PI-.01;
    if(!animate || paused || document.hidden) {
      fog.density=fogDensity;applyPose(pose);finishTransition();draw();return;
    }
    const from:LabCameraPose={position:camera.position.toArray(),target:controls.target.toArray(),fov:camera.fov};
    transition=createLabFlight(from,pose,velocity,kind,width/height<1.1);flightTime=0;
    host.dataset.cameraMotion='moving';host.dataset.cameraFlight=kind;
    if(kind==='intro'){host.dataset.cameraEntry='playing';introRevealed=false;introEditor=false;initial.onEntry?.('playing');}
    // Fog follows the same flight clock; no second animation ticker or React state per frame.
    flightFogFrom=fog.density;flightFogTo=fogDensity;
    draw();
  }
  function visibilityChanged(){if(document.hidden&&transition)moveToView(false);syncMotion();}
  try {
    if(signal.aborted)throw new DOMException('Aborted','AbortError');
    renderer.debug.onShaderError=()=>{throw new Error('Lab shader unavailable');};
    scene.add(key,new THREE.HemisphereLight('#d9cfb3','#292019',1.25));
    const rim=new THREE.DirectionalLight('#b1c9bb',1.05);rim.position.set(4,5,-1);scene.add(rim);
    const pmrem=new THREE.PMREMGenerator(renderer);
    const room=new RoomEnvironment();environment=pmrem.fromScene(room,.04);
    scene.environment=environment.texture;scene.environmentIntensity=.22;room.dispose();pmrem.dispose();
    await preparationFrame();
    model=buildPersonalLab(initial.experiences);scene.add(model.lab);
    initial.onProgress?.('workspace');
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(50,50),new THREE.MeshStandardMaterial({color:'#201c16',roughness:1}));
    floor.rotation.x=-Math.PI/2;floor.position.y=-.195;floor.receiveShadow=true;scene.add(floor);
    track();await preparationFrame();
    stopPhotoLoading=loadScenePhotos(model.photoSlots,texture=>textures.add(texture),draw);
    host.append(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost',contextLost);
    function resize() {
      if(disposed)return;
      const nextWidth=Math.max(1,host.clientWidth),nextHeight=Math.max(1,host.clientHeight);
      const portrait=nextWidth/nextHeight < 1.1;
      const ratio=Math.min(devicePixelRatio||1,portrait?1.25:1.75);
      if(width===nextWidth&&height===nextHeight&&renderer.getPixelRatio()===ratio)return;
      width=nextWidth;height=nextHeight;
      renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);
      camera.aspect=width/height;renderer.shadowMap.needsUpdate=true;
      for(const light of shadowLights)light.shadow.needsUpdate=true;
      if(introWaiting) {
        model?.setBootMode(true,width/height);applyPose(labIntroPose(width/height));
        host.dataset.cameraEntry='waiting';host.dataset.cameraView=view;host.dataset.cameraMotion='idle';host.dataset.cameraFlight='none';draw();
      } else moveToView(transition!==null,transition?.kind);
    }
    resize();controls.addEventListener('change',cameraChanged);
    controls.addEventListener('start',controlsStarted);
    document.addEventListener('visibilitychange',visibilityChanged);
    observer=new ResizeObserver(resize);observer.observe(host);
    await preparationFrame();
    renderer.compile(scene,camera);
    // Warm the room behind the terminal, including materials outside the monitor crop.
    applyPose(labCameraPose('home',width/height,true));draw();
    if(introWaiting)applyPose(labIntroPose(width/height));else applyPose(labCameraPose(view,width/height,overview));
    initial.onProgress?.('graphics');
    await preparationFrame();
    if(signal.aborted||disposed)throw new DOMException('Aborted','AbortError');
    draw();
    if(disposed)throw new Error('Lab initialization failed');
    warming=false;syncMotion();initial.onProgress?.('ready');
    return {
      startIntro(){if(!introWaiting||disposed)return;introWaiting=false;moveToView(true,'intro');},
      skipIntro(){if(disposed)return;introWaiting=false;model?.setBootMode(false);model?.setUnlockGlow(0);if(transition?.kind==='intro')stopTransition();host.dataset.cameraEntry='interrupted';moveToView(false);syncMotion();},
      setPaused(value){if(disposed)return;paused=value;if(paused&&transition)moveToView(false);syncMotion();},
      setView(nextView,nextOverview){if(view===nextView&&overview===nextOverview)return;view=nextView;overview=nextOverview;moveToView(true);},
      setExploring(value){if(!disposed){exploring=value;controls.enabled=value;renderer.domElement.style.touchAction=value?'none':'pan-y pinch-zoom';}},
      rotate(direction){if(!disposed){if(transition){stopTransition();constrain();controls.enabled=exploring;syncMotion();}const offset=camera.position.clone().sub(controls.target).applyAxisAngle(new THREE.Vector3(0,1,0),direction*.12);camera.position.copy(controls.target).add(offset);controls.update();draw();}},
      reset(){moveToView(true,'reset');},
      dispose,
    };
  }catch(error){track();dispose();throw error;}
}
