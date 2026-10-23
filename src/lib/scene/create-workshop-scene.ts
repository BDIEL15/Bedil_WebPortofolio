import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export type WorkshopScene = {
  setPaused(value: boolean): void;
  setInspecting(value: boolean): void;
  setExploring(value: boolean): void;
  rotate(direction: number): void;
  reset(): void;
  dispose(): void;
};

export async function createWorkshopScene(host: HTMLElement, onFailure: () => void, signal: AbortSignal): Promise<WorkshopScene> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.domElement.className = 'workshop-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.setClearColor('#0c0b0a');
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2('#0c0b0a', .073);
  const camera = new THREE.PerspectiveCamera(37, 1, .1, 65);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = false;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = false;
  controls.minPolarAngle = .6;
  controls.maxPolarAngle = 1.5;
  controls.minAzimuthAngle = -.65;
  controls.maxAzimuthAngle = .65;
  controls.rotateSpeed = .4;
  renderer.domElement.style.touchAction = 'pan-y pinch-zoom';
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  let disposed = false, paused = true, inView = true, time = 0, last = 0;
  let observer: ResizeObserver | undefined;
  let intersection: IntersectionObserver | undefined;
  let environment: THREE.WebGLRenderTarget | undefined;
  let shoulder: THREE.Object3D | undefined;
  let wrist: THREE.Object3D | undefined;
  let width = 1, height = 1;
  let reconcile: () => void = () => {};
  const ascii = document.createElement('canvas');
  ascii.className = 'scene-ascii';
  ascii.setAttribute('aria-hidden', 'true');
  ascii.hidden = true;
  const ink = ascii.getContext('2d');
  const inspectionPoints: { position: THREE.Vector3; normal: THREE.Vector3; owner: THREE.Mesh }[] = [];
  const bench = new THREE.Group();
  scene.add(bench);

  function track(root: THREE.Object3D) {
    root.traverse(object => {
      if (!(object instanceof THREE.Mesh || object instanceof THREE.LineSegments)) return;
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material);
        for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
      }
    });
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    renderer.setAnimationLoop(null);
    signal.removeEventListener('abort', dispose);
    observer?.disconnect(); intersection?.disconnect(); controls.dispose();
    document.removeEventListener('visibilitychange', reconcile);
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    for (const item of geometries) item.dispose();
    for (const item of materials) item.dispose();
    for (const item of textures) item.dispose();
    environment?.dispose();
    key.shadow.map?.dispose();
    renderer.dispose(); renderer.forceContextLoss();
    renderer.domElement.remove(); ascii.remove();
  }
  function fail() { if (!disposed) { dispose(); onFailure(); } }
  function contextLost(event: Event) { event.preventDefault(); fail(); }
  signal.addEventListener('abort', dispose, { once: true });
  const key = new THREE.DirectionalLight('#ffecd4', 3.4);
  key.position.set(-3, 8, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 6, bottom: -6, near: .5, far: 22 });
  key.shadow.normalBias = .025;
  key.shadow.bias = -.00015;
  key.shadow.radius = 3;

  try {
    if (signal.aborted) { dispose(); throw new DOMException('Aborted', 'AbortError'); }
    renderer.debug.onShaderError = () => { throw new Error('Workshop shader unavailable'); };
    scene.add(key, new THREE.HemisphereLight('#c6d5d2', '#15120e', 1.2));
    const rim = new THREE.DirectionalLight('#b5d2ca', 1.8);
    rim.position.set(5, 4, -4); scene.add(rim);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture; scene.environmentIntensity = .35;
    room.dispose(); pmrem.dispose();

    const metal = new THREE.MeshStandardMaterial({ color: '#363936', roughness: .52, metalness: .72 });
    const top = new THREE.MeshStandardMaterial({ color: '#333531', roughness: .78, metalness: .25 });
    const brass = new THREE.MeshStandardMaterial({ color: '#a57447', roughness: .4, metalness: .65 });
    const dark = new THREE.MeshStandardMaterial({ color: '#141715', roughness: .55, metalness: .45 });
    function box(w: number, h: number, d: number, x: number, y: number, z: number, material: THREE.Material, parent = bench) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
    }
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: '#181b16', roughness: .97, metalness: .05 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const grid = new THREE.GridHelper(50, 75, '#7b7b68', '#7b7b68');
    grid.position.y = .008;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = .2;
    scene.add(grid);
    box(2.25, .095, 1.5, 0, 1.22, 0, top);
    // A restrained steel workbench, grounded by its frame and contact shadows.
    for (const x of [-.99, .99]) {
      for (const z of [-.61, .61]) {
        box(.065, 1.17, .065, x, .585, z, metal);
        box(.11, .035, .11, x, .018, z, dark);
      }
      box(.045, .055, 1.24, x, .25, 0, metal);
    }
    box(1.98, .06, .045, 0, 1.04, -.61, metal);
    box(.4, .025, .37, -.1, 1.28, 0, dark);
    // Small calibration blocks are original scene props, not portfolio project evidence.
    box(.16, .16, .16, -.72, 1.35, .26, brass);
    box(.22, .04, .22, -.72, 1.29, .26, dark);
    for (const x of [-.25, .05]) for (const z of [-.13,.13]) {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(.014,.014,.025,8), metal);
      bolt.position.set(x,1.3,z); bench.add(bolt);
    }
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(.2,1.3,-.1), new THREE.Vector3(.65,1.3,-.45), new THREE.Vector3(1.12,1.08,-.48),
      new THREE.Vector3(1.14,.3,-.53), new THREE.Vector3(1,.02,-1), new THREE.Vector3(.3,.016,-1.3), new THREE.Vector3(-.4,.016,-1.2),
    ]);
    const cable = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 40, .015, 6, false), dark); bench.add(cable);
    // An original observation camera balances the workbench across the reading area.
    const observation = new THREE.Group();
    observation.position.set(-3.35,0,.65);
    const cameraHead = new THREE.Group();
    cameraHead.position.set(0,.95,0); cameraHead.rotation.set(-.12,1.12,0);
    observation.add(cameraHead);
    const enamel = new THREE.MeshStandardMaterial({ color:'#a5aaa0', roughness:.36, metalness:.45 });
    box(.36,.23,.28,0,0,0,enamel,cameraHead);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(.085,.085,.17,32),dark);
    lens.rotation.x = Math.PI/2; lens.position.z = .19; cameraHead.add(lens);
    const lensRim = new THREE.Mesh(new THREE.TorusGeometry(.075,.012,8,32),brass);
    lensRim.position.z = .28; cameraHead.add(lensRim);
    const glass = new THREE.Mesh(new THREE.CircleGeometry(.061,32),new THREE.MeshStandardMaterial({color:'#182426',roughness:.12,metalness:.8}));
    glass.position.z = .283; cameraHead.add(glass);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(.018,.022,.7,12),metal);
    mast.position.y = .53; observation.add(mast);
    for (let i=0;i<3;i++) {
      const angle = i*Math.PI*2/3;
      const foot = new THREE.Vector3(Math.cos(angle)*.34,.035,Math.sin(angle)*.34);
      const hub = new THREE.Vector3(0,.5,0);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(.012,.018,foot.distanceTo(hub),8),metal);
      leg.position.copy(foot).add(hub).multiplyScalar(.5);
      leg.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),hub.clone().sub(foot).normalize());
      observation.add(leg);
    }
    observation.traverse(object=>{if(object instanceof THREE.Mesh){object.castShadow=true;object.receiveShadow=true;}});
    scene.add(observation);
    track(scene);
    host.append(renderer.domElement, ascii);
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    const response = await fetch('/models/irb52.glb', { signal });
    if (!response.ok) throw new Error('Robot model unavailable');
    const bytes = await response.arrayBuffer();
    if (disposed) throw new DOMException('Aborted', 'AbortError');
    const gltf = await new GLTFLoader().parseAsync(bytes, '');
    track(gltf.scene);
    if (disposed) {
      // parseAsync cannot be cancelled; release resources produced after its owner left.
      gltf.scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) material.dispose();
        }
      });
      throw new DOMException('Aborted', 'AbortError');
    }
    const robot = gltf.scene;
    robot.scale.setScalar(1.25); robot.position.set(-.1, 1.3, 0); robot.rotation.y = .2;
    bench.add(robot);
    const flange = robot.getObjectByName('link_6');
    if (flange) {
      const gripper = new THREE.Group(); gripper.position.x = .04;
      box(.08,.1,.13,.04,0,0,dark,gripper);
      box(.14,.035,.025,.13,0,-.055,metal,gripper);
      box(.14,.035,.025,.13,0,.055,metal,gripper);
      flange.add(gripper); track(gripper);
    }
    shoulder = robot.getObjectByName('link_1'); wrist = robot.getObjectByName('link_5');
    robot.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true; object.receiveShadow = true;
      const positions = object.geometry.attributes.position;
      const normals = object.geometry.attributes.normal;
      const step = Math.max(1, Math.floor(positions.count / 400));
      for (let i = 0; i < positions.count; i += step) inspectionPoints.push({ position: new THREE.Vector3().fromBufferAttribute(positions, i), normal: new THREE.Vector3().fromBufferAttribute(normals, i), owner: object });
    });
    const point = new THREE.Vector3();
    const worldNormal = new THREE.Vector3();
    const toCamera = new THREE.Vector3();
    const normalMatrix = new THREE.Matrix3();
    let occupied = new Set<number>();
    function drawAscii() {
      if (!ink || ascii.hidden) return;
      ink.clearRect(0, 0, width, height);
      const center = robot.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(.3,.9,0)).project(camera);
      const cx = (center.x+1)*width/2, cy = (1-center.y)*height/2, radius = Math.min(width*.15, 125);
      ink.save(); ink.beginPath(); ink.arc(cx,cy,radius,0,Math.PI*2); ink.clip();
      ink.fillStyle = '#0c0b0a'; ink.fillRect(cx-radius,cy-radius,radius*2,radius*2);
      ink.fillStyle = '#d9b085'; ink.font = '11px monospace'; occupied = new Set();
      for (const sample of inspectionPoints) {
        point.copy(sample.position).applyMatrix4(sample.owner.matrixWorld);
        normalMatrix.getNormalMatrix(sample.owner.matrixWorld);
        worldNormal.copy(sample.normal).applyNormalMatrix(normalMatrix);
        toCamera.copy(camera.position).sub(point).normalize();
        const facing = worldNormal.dot(toCamera);
        if (facing <= 0) continue;
        point.project(camera);
        if (point.z < -1 || point.z > 1) continue;
        const x = (point.x+1)*width/2, y = (1-point.y)*height/2;
        const column = Math.round(x/8), row = Math.round(y/10), cell = row*Math.ceil(width/8)+column;
        if (occupied.has(cell) || (x-cx)**2+(y-cy)**2 > radius**2) continue;
        occupied.add(cell); ink.globalAlpha = .35+facing*.65;
        ink.fillText('.:+#'[Math.min(3,Math.floor(facing*4))],column*8,row*10);
      }
      ink.restore();
    }
    function draw() { if (!disposed) { try { renderer.render(scene, camera); drawAscii(); } catch { fail(); } } }
    function resize() {
      if (disposed) return;
      width = Math.max(1,host.clientWidth); height = Math.max(1,host.clientHeight);
      const mobile = width / height < 1.1;
      const ratio = Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.75);
      renderer.setPixelRatio(ratio); renderer.setSize(width,height,false);
      camera.aspect = width/height;
      camera.fov = mobile ? 43 : 37;
      camera.updateProjectionMatrix();
      // Portrait is composed below the reading area; desktop keeps the bench beside it.
      bench.position.set(mobile ? (width < 700 ? .85 : 1.55) : 3.15,0,mobile ? -1 : -.5);
      observation.position.set(mobile ? -1.5 : -3.35,0,mobile ? -.1 : .65);
      camera.position.set(0,mobile ? 4.8 : 3.5,mobile ? 11.8 : 10.2);
      controls.target.set(0,mobile ? 3.2 : 1.05,0);
      controls.update(); controls.saveState();
      ascii.width = Math.round(width*ratio); ascii.height = Math.round(height*ratio);
      ink?.setTransform(ratio,0,0,ratio,0,0);
      draw();
    }
    function frame(now: number) {
      if (disposed || (last && now-last < 1000/30)) return;
      time += last ? Math.min((now-last)/1000,.05) : 0; last = now;
      if (shoulder) shoulder.rotation.z = Math.sin(time*.22)*.09;
      if (wrist) wrist.rotation.y = .45 + Math.sin(time*.32)*.08;
      draw();
    }
    reconcile = () => {
      if (disposed) return;
      last = 0;
      renderer.setAnimationLoop(!paused && inView && !document.hidden ? frame : null);
    };
    resize();
    controls.addEventListener('change', draw);
    observer = new ResizeObserver(resize); observer.observe(host);
    intersection = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; reconcile(); }); intersection.observe(host);
    document.addEventListener('visibilitychange', reconcile);
    if (disposed) throw new Error('Workshop initialization failed');
    return {
      setPaused(value) { paused = value; reconcile(); draw(); },
      setInspecting(value) { ascii.hidden = !value; draw(); },
      setExploring(value) { if (!disposed) { controls.enabled = value; renderer.domElement.style.touchAction = value ? 'none' : 'pan-y pinch-zoom'; } },
      rotate(direction) {
        if (disposed) return;
        const offset = camera.position.clone().sub(controls.target).applyAxisAngle(new THREE.Vector3(0,1,0),direction*.15);
        camera.position.copy(controls.target).add(offset); controls.update(); draw();
      },
      reset() { if (!disposed) { controls.reset(); draw(); } },
      dispose,
    };
  } catch (error) { dispose(); throw error; }
}
