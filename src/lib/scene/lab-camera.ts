export type LabView = 'home' | 'projects' | 'about' | 'experience' | 'writing' | 'cabinet';
// Static 404 HTML uses Home; only server-approved article paths may select Writing.
export function labViewForPath(pathname:string,publishedWritingPaths:readonly string[]=[]):LabView {
  return pathname==='/about'?'about':pathname==='/experience'?'experience':pathname==='/projects'?'projects':pathname==='/cabinet'?'cabinet':pathname==='/writing'||publishedWritingPaths.includes(pathname)?'writing':'home';
}
export function labPoster(view:LabView,overview:boolean) {
  return overview?'lab-overview':view==='home'?'personal-lab':`lab-${view}`;
}
export type LabCameraPose = { position: [number, number, number]; target: [number, number, number]; fov: number };
function portraitFov(aspect:number,base:number,minimum:number,maximum:number,widening=100) {
  return Math.min(maximum,Math.max(minimum,base+Math.max(0,.46-aspect)*widening-Math.max(0,aspect-.46)*60));
}
export function labIntroPose(aspect:number):LabCameraPose {
  // Fill the viewport with the physical 16:9 monitor, matching the HTML canvas crop.
  const fov=45,distance=Math.min(.9,1.6/aspect)/(2*Math.tan(fov*Math.PI/360))*.995;
  const normal=[Math.sin(.15),0,Math.cos(.15)],target:[number,number,number]=[-1.65+normal[0]*.062,2.065,-.75+normal[2]*.062];
  return {position:[target[0]+normal[0]*distance,target[1],target[2]+normal[2]*distance],target,fov};
}
const workbenchBounds={min:[-4.3,-.195,-1.65],max:[4.3,4.8,1.6],target:[0,2.25,-.15]} as const;
export const labViewBounds={home:workbenchBounds,projects:workbenchBounds,about:workbenchBounds,experience:workbenchBounds,writing:workbenchBounds,cabinet:workbenchBounds};

export function labCameraPose(view: LabView, aspect: number, overview = false): LabCameraPose {
  const portrait = aspect < 1.1;
  if (!overview) {
    if(view==='writing') return portrait
      ? {position:[2.65,3.3,4.95],target:[2.57,2.94,-1.3],fov:portraitFov(aspect,62,46,74)}
      : {position:[3.85,3.25,2.85],target:[2.07,2.92,-1.35],fov:41};
    if(view==='cabinet') return portrait
      ? {position:[-.2,4.30,4.2],target:[-.2,3.94,-1.05],fov:portraitFov(aspect,65,50,79,125)}
      : {position:[1.15,4.25,2.45],target:[-.64,3.94,-1.0],fov:39};
    if(view==='about') return portrait
      ? {position:[-1.98,3.7,3.45],target:[-1.98,1.40,.65],fov:portraitFov(aspect,58,40,72,120)}
      : {position:[-.45,3.15,2.25],target:[-2.37,1.43,.59],fov:37};
    if(view==='experience') return portrait
      ? {position:[-1.93,3.8,2.8],target:[-1.93,2.97,-1.3],fov:portraitFov(aspect,64,48,76,90)}
      : {position:[-.1,3.6,1.0],target:[-2.5,2.92,-1.3],fov:41};
    if (view === 'projects') return portrait
      ? { position: [3.3,2.8,4.8], target: [2.12,1.9,0], fov: Math.min(48,37+Math.max(0,.46-aspect)*80) }
      : { position: [4.1,2.8,2.6], target: [1.25,2.19,-.05], fov: 41 };
    return portrait
      ? {position:[0,2.9,6.7],target:[0,2.7,-.9],fov:Math.min(58,50+Math.max(0,aspect-.46)*28)}
      : {position:[0,2.85,5.50],target:[0,2.6,-1.0],fov:42};
  }
  const bounds = labViewBounds[view];
  const target: [number, number, number] = [...bounds.target];
  const direction = portrait ? [.72, .42, .55] : [.38, .31, .87];
  const length = Math.hypot(...direction);
  const [dx, dy, dz] = direction.map(value => value / length);
  const horizontal = Math.hypot(dx, dz);
  const right = [dz / horizontal, 0, -dx / horizontal];
  const up = [-dy * dx / horizontal, horizontal, -dy * dz / horizontal];
  const fov = portrait ? 48 : 42;
  const tanY = Math.tan(fov * Math.PI / 360);
  const tanX = tanY * Math.max(.2, aspect);
  let distance = 0;
  // Fit the workbench/wall, rather than shrinking it to include the surrounding floor.
  for (const x of [bounds.min[0],bounds.max[0]]) for (const y of [bounds.min[1],bounds.max[1]]) for (const z of [bounds.min[2],bounds.max[2]]) {
    const point = [x-target[0], y-target[1], z-target[2]];
    const depth = point[0] * dx + point[1] * dy + point[2] * dz;
    const px = point.reduce((sum, value, index) => sum + value * right[index], 0);
    const py = point.reduce((sum, value, index) => sum + value * up[index], 0);
    distance = Math.max(distance, depth + Math.abs(px) / (.9 * tanX), depth + Math.abs(py) / (.9 * tanY));
  }
  return { position: [target[0] + dx * distance, target[1] + dy * distance, target[2] + dz * distance], target, fov };
}
