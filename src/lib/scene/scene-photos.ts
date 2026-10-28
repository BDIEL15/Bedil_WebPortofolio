import * as THREE from 'three';
import sources from '../../data/scene-photo-slots.json';

export type ScenePhoto={id:keyof typeof sources;material:THREE.MeshBasicMaterial;aspect:number};
export function isScenePhotoPath(value:string) {return /^\/photos\/[a-zA-Z0-9_/-]+\.(webp|png|jpe?g)$/.test(value)&&!value.includes('..');}
/** Only public, owner-approved photos belong in this config; empty slots retain their neutral mounts. */
export function loadScenePhotos(slots:ScenePhoto[],own:(texture:THREE.Texture)=>void,redraw:()=>void) {
  let disposed=false;
  const images:HTMLImageElement[]=[];
  for(const slot of slots) {
    const src=sources[slot.id] as string|null;
    if(!src||!isScenePhotoPath(src))continue;
    const image=new Image();images.push(image);
    image.onload=()=>{
      if(disposed||!image.naturalWidth||!image.naturalHeight)return;
      const texture=new THREE.Texture(image);texture.colorSpace=THREE.SRGBColorSpace;
      const aspect=image.naturalWidth/image.naturalHeight;
      if(aspect>slot.aspect){texture.repeat.x=slot.aspect/aspect;texture.offset.x=(1-texture.repeat.x)/2;}
      else{texture.repeat.y=aspect/slot.aspect;texture.offset.y=(1-texture.repeat.y)/2;}
      texture.needsUpdate=true;own(texture);slot.material.map=texture;slot.material.transparent=true;slot.material.needsUpdate=true;redraw();
    };
    image.onerror=()=>{}; // A missing replacement leaves the neutral mount intact.
    image.src=src;
  }
  return ()=>{disposed=true;for(const image of images){image.onload=null;image.onerror=null;image.removeAttribute('src');}};
}
