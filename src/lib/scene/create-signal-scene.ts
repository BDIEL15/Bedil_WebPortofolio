import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { sphereSamples } from './signal-math';

export type SignalScene = {
  setPaused(value: boolean): void;
  setInspecting(value: boolean): void;
  setExploring(value: boolean): void;
  rotate(direction: number): void;
  reset(): void;
  dispose(): void;
};

export function createSignalScene(host: HTMLElement, onFailure: () => void): SignalScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  const canvas = renderer.domElement;
  canvas.className = 'signal-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const ascii = document.createElement('canvas');
  ascii.className = 'scene-ascii';
  ascii.setAttribute('aria-hidden', 'true');
  ascii.hidden = true;
  const ink = ascii.getContext('2d');
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  let disposed = false;
  let paused = true;
  let inspecting = false;
  let inView = true;
  let width = 1;
  let height = 1;
  let time = 0;
  let last = 0;
  let columns = 1;
  let cells = new Uint8Array(1);
  let observer: ResizeObserver | undefined;
  let intersection: IntersectionObserver | undefined;
  let controls: OrbitControls | undefined;

  const ownGeometry = <T extends THREE.BufferGeometry>(value: T): T => { geometries.add(value); return value; };
  const ownMaterial = <T extends THREE.Material>(value: T): T => { materials.add(value); return value; };
  function dispose() {
    if (disposed) return;
    disposed = true;
    renderer.setAnimationLoop(null);
    observer?.disconnect();
    intersection?.disconnect();
    controls?.dispose();
    document.removeEventListener('visibilitychange', reconcile);
    canvas.removeEventListener('webglcontextlost', contextLost);
    for (const resource of geometries) resource.dispose();
    for (const resource of materials) resource.dispose();
    for (const resource of textures) resource.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    ascii.remove();
  }
  function fail() { if (!disposed) { dispose(); onFailure(); } }
  function contextLost(event: Event) { event.preventDefault(); fail(); }
  function reconcile() {
    if (disposed) return;
    last = 0;
    renderer.setAnimationLoop(!paused && inView && !document.hidden ? frame : null);
  }

  let draw: () => void;
  let update: () => void;
  function safeDraw() { if (!disposed) { try { draw(); } catch { fail(); } } }
  function frame(now: number) {
    if (disposed || (last && now - last < 1000 / 30)) return;
    const delta = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    time += delta;
    update();
    safeDraw();
  }

  try {
    if (!ink) throw new Error('ASCII canvas unavailable');
    renderer.debug.onShaderError = () => { throw new Error('Scene shader unavailable'); };
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight('#91b4a8', 0.65));
    const keyLight = new THREE.DirectionalLight('#f5e6cf', 2);
    keyLight.position.set(-3, 4, 5);
    scene.add(keyLight);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 30);
    camera.position.set(0.25, 0.2, 5.3);
    controls = new OrbitControls(camera, canvas);
    controls.enabled = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = false;
    controls.rotateSpeed = 0.55;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI - 0.35;
    canvas.style.touchAction = 'pan-y pinch-zoom';
    controls.saveState();

    const specimen = new THREE.Group();
    specimen.rotation.set(0.1, 0, -0.22);
    scene.add(specimen);
    const core = new THREE.Mesh(ownGeometry(new THREE.SphereGeometry(1.22, 48, 32)), ownMaterial(new THREE.MeshStandardMaterial({ color: '#172e2b', roughness: 1, metalness: 0.1 })));
    specimen.add(core);
    const positions = sphereSamples();
    const colors = new Float32Array(positions.length);
    const teal = new THREE.Color('#7aa69a');
    const warm = new THREE.Color('#e9e2d3');
    const color = new THREE.Color();
    for (let i = 0; i < positions.length; i += 3) {
      color.copy(teal).lerp(warm, Math.max(0, positions[i + 1]) * 0.55);
      color.toArray(colors, i);
      positions[i] *= 1.26; positions[i + 1] *= 1.26; positions[i + 2] *= 1.26;
    }
    const pointsGeometry = ownGeometry(new THREE.BufferGeometry());
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const dot = document.createElement('canvas');
    dot.width = dot.height = 32;
    const dotInk = dot.getContext('2d');
    if (!dotInk) throw new Error('Point texture unavailable');
    dotInk.fillStyle = '#fff'; dotInk.beginPath(); dotInk.arc(16, 16, 13, 0, Math.PI * 2); dotInk.fill();
    const texture = new THREE.CanvasTexture(dot);
    textures.add(texture);
    const points = new THREE.Points(pointsGeometry, ownMaterial(new THREE.PointsMaterial({ size: 0.035, map: texture, transparent: true, alphaTest: 0.2, vertexColors: true, depthWrite: false })));
    specimen.add(points);

    const orbit = new THREE.Group();
    orbit.rotation.set(0.66, 0, -0.42);
    scene.add(orbit);
    const ringPoints = Array.from({ length: 192 }, (_, i) => {
      const phase = (i / 192) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(phase) * 1.65, 0, Math.sin(phase) * 1.65);
    });
    const ring = new THREE.LineLoop(ownGeometry(new THREE.BufferGeometry().setFromPoints(ringPoints)), ownMaterial(new THREE.LineBasicMaterial({ color: '#638b86', transparent: true, opacity: 0.7 })));
    orbit.add(ring);
    const marker = new THREE.Mesh(ownGeometry(new THREE.SphereGeometry(0.026, 12, 8)), ownMaterial(new THREE.MeshBasicMaterial({ color: '#dfb689' })));
    orbit.add(marker);
    const halo = new THREE.Mesh(ownGeometry(new THREE.TorusGeometry(0.06, 0.006, 6, 24)), ownMaterial(new THREE.MeshBasicMaterial({ color: '#dfb689' })));
    marker.add(halo);
    const wavePositions = new Float32Array(193 * 3);
    const waveGeometry = ownGeometry(new THREE.BufferGeometry());
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
    const wave = new THREE.Line(waveGeometry, ownMaterial(new THREE.LineBasicMaterial({ color: '#abc3b8', transparent: true, opacity: 0.65 })));
    wave.rotation.z = 0.24;
    scene.add(wave);

    const projected = new THREE.Vector3();
    const facing = new THREE.Vector3();
    const world = new THREE.Vector3();
    const glyphs = '.:+*';
    function drawAscii() {
      if (!ink || !inspecting) return;
      ink.clearRect(0, 0, width, height);
      const cx = width * 0.63, cy = height * 0.4, radius = width * 0.18;
      ink.save();
      ink.beginPath(); ink.arc(cx, cy, radius, 0, Math.PI * 2); ink.clip();
      ink.fillStyle = '#0c1011'; ink.fillRect(0, 0, width, height);
      ink.fillStyle = '#dfb689';
      cells.fill(0);
      facing.copy(camera.position).normalize();
      for (let i = 0; i < positions.length; i += 3) {
        world.fromArray(positions, i).applyMatrix4(specimen.matrixWorld);
        const depth = world.dot(facing) / 1.26;
        if (depth < 0.12) continue;
        projected.copy(world).project(camera);
        const x = (projected.x + 1) * width / 2, y = (1 - projected.y) * height / 2;
        if (x < 0 || y < 0 || x >= width || y >= height || (x - cx) ** 2 + (y - cy) ** 2 > radius ** 2) continue;
        const column = Math.floor(x / 10), row = Math.floor(y / 12), cell = row * columns + column;
        if (cells[cell]) continue;
        cells[cell] = 1;
        ink.globalAlpha = 0.4 + depth * 0.6;
        ink.fillText(glyphs[Math.min(3, Math.floor(depth * 4))], column * 10, row * 12);
      }
      ink.restore();
    }

    update = () => {
      specimen.rotation.y = time * 0.075;
      marker.position.set(Math.cos(time * 0.24 + 0.6) * 1.65, 0, Math.sin(time * 0.24 + 0.6) * 1.65);
      halo.lookAt(camera.position);
      for (let i = 0; i <= 192; i++) {
        const phase = i / 192 * Math.PI * 2;
        wavePositions[i * 3] = Math.cos(phase) * 1.39;
        wavePositions[i * 3 + 1] = Math.sin(phase * 3 + time * 0.7) * 0.14;
        wavePositions[i * 3 + 2] = Math.sin(phase) * 1.39;
      }
      waveGeometry.attributes.position.needsUpdate = true;
    };
    draw = () => { renderer.render(scene, camera); drawAscii(); };
    controls.addEventListener('change', safeDraw);
    host.append(canvas, ascii);
    canvas.addEventListener('webglcontextlost', contextLost);
    document.addEventListener('visibilitychange', reconcile);
    function resize() {
      if (disposed) return;
      width = Math.max(1, host.clientWidth); height = Math.max(1, host.clientHeight);
      const ratio = Math.min(window.devicePixelRatio || 1, width < 500 ? 1.5 : 2);
      renderer.setPixelRatio(ratio); renderer.setSize(width, height, false);
      camera.aspect = width / height; camera.updateProjectionMatrix();
      ascii.width = Math.round(width * ratio); ascii.height = Math.round(height * ratio);
      ink?.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (ink) { ink.font = '12px Arial, sans-serif'; ink.textAlign = 'center'; ink.textBaseline = 'middle'; }
      columns = Math.ceil(width / 10); cells = new Uint8Array(columns * Math.ceil(height / 12));
      safeDraw();
    }
    update(); resize();
    if (disposed) throw new Error('Scene initialization failed');
    observer = new ResizeObserver(resize); observer.observe(host);
    intersection = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; reconcile(); }, { threshold: 0 });
    intersection.observe(host);

    return {
      setPaused(value) { paused = value; reconcile(); safeDraw(); },
      setInspecting(value) { inspecting = value; ascii.hidden = !value; safeDraw(); },
      setExploring(value) {
        if (disposed || !controls) return;
        controls.enabled = value;
        canvas.style.touchAction = value ? 'none' : 'pan-y pinch-zoom';
      },
      rotate(direction) {
        if (disposed || !controls) return;
        const offset = camera.position.clone().sub(controls.target);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), direction * 0.2);
        camera.position.copy(controls.target).add(offset); controls.update(); safeDraw();
      },
      reset() { if (!disposed) { controls?.reset(); safeDraw(); } },
      dispose,
    };
  } catch (error) { dispose(); throw error; }
}
