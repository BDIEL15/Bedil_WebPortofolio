export type LabView = 'home' | 'projects' | 'about' | 'experience';
export function labViewForPath(pathname:string):LabView {
  return pathname==='/about'?'about':pathname==='/experience'?'experience':pathname==='/projects'?'projects':'home';
}
export function labPoster(view:LabView,overview:boolean) {
  return view==='home'?(overview?'lab-overview':'personal-lab'):`lab-${view}${overview?'-overview':''}`;
}
export type LabCameraPose = { position: [number, number, number]; target: [number, number, number]; fov: number };
export const labViewBounds = {
  home: { min: [-4.5,0,-1.6], max: [4.5,4.75,1.5], target: [0,2.2,0] },
  projects: { min: [5.15,0,-1.6], max: [11.85,4.45,1.5], target: [8.5,2.1,0] },
  about: { min: [-10,0,-1.65], max: [-4.85,4.65,1.4], target: [-7.4,2.1,0] },
  experience: { min: [-16.1,0,-1.65], max: [-10.7,4.2,.8], target: [-13.4,2.1,-.3] },
} as const;

export function labCameraPose(view: LabView, aspect: number, overview = false): LabCameraPose {
  const portrait = aspect < 1.1;
  if (!overview) {
    if(view==='about') return portrait
      ? {position:[-4.5,4.9,6.9],target:[-7.0,1.9,-.25],fov:44}
      : {position:[-3.5,4.5,5.1],target:[-7.05,2.0,-.25],fov:43};
    if(view==='experience') return portrait
      ? {position:[-12.0,3.9,7.7],target:[-13.4,1.9,-1.0],fov:56}
      : {position:[-9.9,3.3,5.5],target:[-14.15,2.45,-1.0],fov:44};
    if (view === 'projects') return portrait
      ? { position: [11.3,3.8,7.6], target: [9.3,2.3,-.2], fov: 46 }
      : { position: [12.8,3.9,6.5], target: [8.7,2.15,-.15], fov: 43 };
    return { position: [portrait ? -.3 : .1, 2.65, portrait ? 4.9 : 4.1], target: [portrait ? -.3 : .1, 2.45, -1.4], fov: portrait ? 42 : 44 };
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
