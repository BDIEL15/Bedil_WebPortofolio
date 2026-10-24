import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildPersonalLab } from './personal-lab';
import { gsap } from 'gsap';
import { labCameraPose, type LabView } from './lab-camera';

export type PersonalLabScene = {
  setView(view: LabView, overview: boolean): void;
  setPaused(value: boolean): void;
  setExploring(value: boolean): void;
  rotate(direction: number): void;
  reset(): void;
  dispose(): void;
};
type InitialView = { view: LabView; overview: boolean; paused: boolean };

// Home is event-driven; only the visible, unpaused Projects robot has a frame loop.
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
  let transition: gsap.core.Timeline | null = null;
  let observer: ResizeObserver | undefined;
  let environment: THREE.WebGLRenderTarget | undefined;
  let model: ReturnType<typeof buildPersonalLab> | undefined;
  let robotTime=0, lastRobotFrame: number | null=null, robotRunning=false;
  const key=new THREE.DirectionalLight('#ffe5bd',3.2);
  key.position.set(-3,7,6);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);
  Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-4,near:.5,far:22});
  key.shadow.normalBias=.025;key.shadow.bias=-.0002;

  function track() {
    scene.traverse(object=>{
      if(object instanceof THREE.DirectionalLight || object instanceof THREE.SpotLight){shadowLights.add(object);object.shadow.autoUpdate=false;}
      if (!(object instanceof THREE.Mesh || object instanceof THREE.LineSegments))return;
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
    disposed=true;transition?.kill();transition=null;renderer.setAnimationLoop(null);
    document.removeEventListener('visibilitychange',visibilityChanged);
    delete host.dataset.cameraMotion;delete host.dataset.cameraView;delete host.dataset.robotMotion;
    signal.removeEventListener('abort',dispose);observer?.disconnect();controls.removeEventListener('change',cameraChanged);controls.removeEventListener('start',controlsStarted);controls.dispose();
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
  function syncRobotMotion() {
    if(disposed)return;
    const play=!disposed&&!!model&&view==='projects'&&!paused&&!document.hidden&&!transition;
    host.dataset.robotMotion=play?'playing':view!=='projects'?'inactive':paused?'paused':document.hidden?'hidden':'transition';
    if(play===robotRunning)return;
    robotRunning=play;lastRobotFrame=null;
    renderer.setAnimationLoop(play?animateRobot:null);
  }
  function animateRobot(time:number) {
    if(!robotRunning||disposed)return;
    if(lastRobotFrame!==null&&time-lastRobotFrame<1000/30-.5)return;
    const delta=lastRobotFrame===null?0:Math.min((time-lastRobotFrame)/1000,.1);
    lastRobotFrame=time;robotTime+=delta;model?.animateRobot(robotTime);
    // Home shadows stay cached; only the robotics spotlight follows the moving rig.
    if(model)model.robotLight.shadow.needsUpdate=true;
    renderer.shadowMap.needsUpdate=true;draw();
  }
  function stopTransition() { transition?.kill();transition=null;host.dataset.cameraMotion='idle'; }
  function constrain() {
    const offset=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    controls.minAzimuthAngle=offset.theta-(overview?.5:.3);controls.maxAzimuthAngle=offset.theta+(overview?.5:.3);
    controls.minPolarAngle=Math.max(.2,offset.phi-.2);controls.maxPolarAngle=Math.min(Math.PI-.2,offset.phi+.2);
  }
  function cameraChanged() { if(!transition)draw(); }
  function controlsStarted(){if(transition){stopTransition();constrain();syncRobotMotion();}}
  function moveToView(animate: boolean) {
    if(disposed)return;
    stopTransition();
    if(robotRunning){robotRunning=false;lastRobotFrame=null;renderer.setAnimationLoop(null);}
    host.dataset.robotMotion='transition';
    const pose=labCameraPose(view,width/height,overview);
    const fog=scene.fog as THREE.FogExp2;
    const fogDensity=overview?(width/height<1.1?.012:.025):.042;
    host.dataset.cameraView=overview?'overview':view;
    controls.enabled=exploring;
    controls.minAzimuthAngle=-Infinity;controls.maxAzimuthAngle=Infinity;
    controls.minPolarAngle=.01;controls.maxPolarAngle=Math.PI-.01;
    const finish=()=>{
      transition=null;host.dataset.cameraMotion='idle';
      constrain();controls.saveState();controls.enabled=exploring;
      syncRobotMotion();
    };
    if(!animate || paused || document.hidden) {
      camera.position.set(...pose.position);controls.target.set(...pose.target);camera.fov=pose.fov;
      fog.density=fogDensity;camera.updateProjectionMatrix();controls.update();finish();draw();return;
    }
    host.dataset.cameraMotion='moving';
    transition=gsap.timeline({
      defaults:{duration:overview?1.15:camera.position.distanceTo(new THREE.Vector3(...pose.position))>14?1.6:1.25,ease:'power3.inOut'},
      onUpdate:()=>{camera.updateProjectionMatrix();controls.update();draw();},
      onComplete:finish,
    });
    transition.to(camera.position,{x:pose.position[0],y:pose.position[1],z:pose.position[2]},0)
      .to(controls.target,{x:pose.target[0],y:pose.target[1],z:pose.target[2]},0)
      .to(camera,{fov:pose.fov},0)
      .to(fog,{density:fogDensity},0);
  }
  function visibilityChanged(){if(document.hidden&&transition)moveToView(false);syncRobotMotion();}
  try {
    if(signal.aborted)throw new DOMException('Aborted','AbortError');
    renderer.debug.onShaderError=()=>{throw new Error('Lab shader unavailable');};
    scene.add(key,new THREE.HemisphereLight('#d9cfb3','#292019',1.25));
    const rim=new THREE.DirectionalLight('#b1c9bb',1.05);rim.position.set(4,5,-1);scene.add(rim);
    const pmrem=new THREE.PMREMGenerator(renderer);
    const room=new RoomEnvironment();environment=pmrem.fromScene(room,.04);
    scene.environment=environment.texture;scene.environmentIntensity=.22;room.dispose();pmrem.dispose();
    model=buildPersonalLab();scene.add(model.lab);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(50,50),new THREE.MeshStandardMaterial({color:'#201c16',roughness:1}));
    floor.rotation.x=-Math.PI/2;floor.position.y=-.195;floor.receiveShadow=true;scene.add(floor);
    track();
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
      moveToView(false);
    }
    resize();controls.addEventListener('change',cameraChanged);
    controls.addEventListener('start',controlsStarted);
    document.addEventListener('visibilitychange',visibilityChanged);
    observer=new ResizeObserver(resize);observer.observe(host);
    if(disposed)throw new Error('Lab initialization failed');
    return {
      setPaused(value){if(disposed)return;paused=value;if(paused&&transition)moveToView(false);syncRobotMotion();},
      setView(nextView,nextOverview){if(view===nextView&&overview===nextOverview)return;view=nextView;overview=nextOverview;moveToView(true);},
      setExploring(value){if(!disposed){exploring=value;controls.enabled=value;renderer.domElement.style.touchAction=value?'none':'pan-y pinch-zoom';}},
      rotate(direction){if(!disposed){if(transition){stopTransition();constrain();controls.enabled=exploring;syncRobotMotion();}const offset=camera.position.clone().sub(controls.target).applyAxisAngle(new THREE.Vector3(0,1,0),direction*.12);camera.position.copy(controls.target).add(offset);controls.update();draw();}},
      reset(){moveToView(true);},
      dispose,
    };
  }catch(error){track();dispose();throw error;}
}
