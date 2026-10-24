import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

type Palette = Record<'wood'|'darkWood'|'metal'|'ivory'|'paper'|'green'|'black'|'copper'|'orange', THREE.MeshStandardMaterial>;

/** Original reading/documentation vignettes. Graphics are illustrative, never certificates or owner work. */
export function buildStoryCorners(m:Palette) {
  function box(parent:THREE.Group,w:number,h:number,d:number,x:number,y:number,z:number,material:THREE.Material) {
    const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(.018,Math.min(w,h,d)*.15)),material);
    mesh.position.set(x,y,z);parent.add(mesh);return mesh;
  }
  function cylinder(parent:THREE.Group,r:number,h:number,x:number,y:number,z:number,material:THREE.Material) {
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;
  }
  function texture(w:number,h:number,paint:(ink:CanvasRenderingContext2D)=>void) {
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    const ink=canvas.getContext('2d');if(!ink)throw new Error('Story texture unavailable');paint(ink);
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;return map;
  }
  function surface(parent:THREE.Group,w:number,h:number,x:number,y:number,z:number,map:THREE.Texture) {
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,toneMapped:false}));
    mesh.position.set(x,y,z);parent.add(mesh);return mesh;
  }
  // Static props share material batches; adding corners does not add a draw call per book/clip.
  function bake(root:THREE.Group) {
    root.updateMatrixWorld(true);
    const batches=new Map<THREE.Material,THREE.BufferGeometry[]>(),meshes:THREE.Mesh[]=[];
    root.traverse(object=>{
      if(!(object instanceof THREE.Mesh))return;
      const material=object.material as THREE.Material;
      const transformed=object.geometry.clone().applyMatrix4(object.matrixWorld);
      const geometry=transformed.index?transformed.toNonIndexed():transformed;
      if(geometry!==transformed)transformed.dispose();
      const list=batches.get(material)??[];list.push(geometry);batches.set(material,list);meshes.push(object);
    });
    for(const mesh of meshes){mesh.geometry.dispose();mesh.removeFromParent();}
    for(const [material,geometries] of batches) {
      const geometry=mergeGeometries(geometries);for(const source of geometries)source.dispose();
      if(!geometry)throw new Error('Story geometry could not be batched');
      const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);
    }
  }
  const about=new THREE.Group();about.name='about-reading-corner';
  box(about,5.1,.16,4.3,0,-.1,0,m.darkWood);
  box(about,5.1,4.3,.13,0,2.05,-1.55,m.darkWood);
  box(about,4.8,.16,2.65,0,1.25,0,m.wood);
  for(const x of [-2,2])for(const z of [-.95,.95])box(about,.10,1.17,.10,x,.58,z,m.metal);
  box(about,4.4,.09,.08,0,.35,-.95,m.metal);
  box(about,4.8,.10,.60,0,3.86,-1.12,m.wood);
  for(let i=0;i<6;i++) {
    const h=.50+(i%3)*.09,x=-1.85+i*.18;
    box(about,.14,h,.36,x,3.91+h/2,-1.1,[m.green,m.paper,m.orange][i%3]);
    box(about,.08,.025,.008,x,3.91+h*.73,-.914,m.ivory);
  }
  // Open book: two slightly raised leaves, supported by the binding and cover.
  box(about,2.0,.045,1.30,.45,1.36,.30,m.green);
  const notes=texture(1024,640,ink=>{
    ink.fillStyle='#d8cfb8';ink.fillRect(0,0,1024,640);
    ink.fillStyle='#625e4c';ink.font='28px sans-serif';ink.fillText('NOTES & IDEAS',65,75);
    ink.strokeStyle='#aca48e';ink.lineWidth=2;
    for(let y=135;y<590;y+=43){ink.beginPath();ink.moveTo(65,y);ink.lineTo(420,y);ink.stroke();}
    ink.strokeStyle='#63796a';ink.lineWidth=5;
    ink.beginPath();ink.arc(748,300,135,0,Math.PI*2);ink.stroke();
    ink.beginPath();ink.ellipse(748,300,180,55,-.45,0,Math.PI*2);ink.stroke();
    ink.fillStyle='#ae754d';ink.beginPath();ink.arc(856,207,12,0,Math.PI*2);ink.fill();
    ink.fillStyle='#625e4c';ink.font='22px sans-serif';ink.fillText('a place to learn',630,545);
  });
  for(const side of [-1,1]) {
    const leaf=box(about,.94,.035,1.18,.45+side*.47,1.40,.30,m.paper);leaf.rotation.z=side*-.045;
    const page=surface(about,.92,1.16,0,0,0,notes);leaf.add(page);page.position.set(0,.019,0);page.rotation.x=-Math.PI/2;
    const uv=page.geometry.getAttribute('uv');for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*.5+(side<0?0:.5));
  }
  box(about,.035,.012,1.25,.45,1.44,.30,m.copper);
  // Folded notebook and pencil: identifiable objects, no invented personal memorabilia.
  box(about,.74,.12,1.0,-1.28,1.40,.15,m.ivory).rotation.y=.18;
  box(about,.77,.025,1.04,-1.28,1.475,.15,m.orange).rotation.y=.18;
  const pencil=cylinder(about,.018,.64,1.75,1.365,.70,m.copper);pencil.rotation.z=Math.PI/2;pencil.rotation.y=-.2;
  const tip=new THREE.Mesh(new THREE.ConeGeometry(.018,.07,8),m.black);tip.position.set(1.75-.35*Math.cos(.2),1.365,.70-.35*Math.sin(.2));tip.rotation.z=Math.PI/2;tip.rotation.y=-.2;about.add(tip);
  // A sculpted task lamp gives the paper a local warm pool of light.
  cylinder(about,.28,.07,1.55,1.375,-.55,m.metal);
  const stem=cylinder(about,.025,1.26,1.55,2.04,-.55,m.metal);stem.rotation.z=.12;
  const shade=new THREE.Mesh(new THREE.ConeGeometry(.30,.34,32,1,true),m.green);
  shade.position.set(1.48,2.72,-.52);about.add(shade);
  const light=new THREE.PointLight('#ffdb9d',8,4,1.6);light.position.set(1.48,2.52,-.52);about.add(light);

  const experience=new THREE.Group();experience.name='experience-documentation-corner';
  box(experience,5.3,.16,3.5,0,-.1,-.25,m.darkWood);
  box(experience,5.3,4.3,.13,0,2.05,-1.55,m.darkWood);
  box(experience,4.95,3.15,.07,0,2.55,-1.44,m.green);
  box(experience,5,.12,1.85,0,1.20,-.24,m.wood);
  for(const x of [-2.1,2.1])for(const z of [-.95,.43])box(experience,.09,1.12,.09,x,.56,z,m.metal);
  box(experience,5.1,.10,.50,0,4.02,-1.20,m.wood);
  const docs=texture(1536,768,ink=>{
    const titles=['LAB','SOFTWARE','COMMUNITY'];
    for(let i=0;i<3;i++) {
      const x=i*512;ink.fillStyle='#d2c8ae';ink.fillRect(x,0,512,768);
      ink.fillStyle='#425a4d';ink.font='34px sans-serif';ink.fillText(titles[i],x+48,105);
      ink.strokeStyle='#9a967f';ink.lineWidth=2;
      for(let y=550;y<700;y+=40){ink.beginPath();ink.moveTo(x+48,y);ink.lineTo(x+420-(y%3)*30,y);ink.stroke();}
      ink.strokeStyle='#355747';ink.lineWidth=6;
      if(i===0) {
        ink.strokeRect(x+180,250,150,150);
        for(const y of [280,325,370]){ink.beginPath();ink.moveTo(x+100,y);ink.lineTo(x+180,y);ink.moveTo(x+330,y);ink.lineTo(x+410,y);ink.stroke();}
        ink.fillStyle='#a87548';ink.beginPath();ink.arc(x+210,280,9,0,Math.PI*2);ink.fill();
      } else if(i===1) {
        ink.beginPath();ink.moveTo(x+175,245);ink.lineTo(x+100,330);ink.lineTo(x+175,415);ink.moveTo(x+335,245);ink.lineTo(x+410,330);ink.lineTo(x+335,415);ink.moveTo(x+285,245);ink.lineTo(x+230,415);ink.stroke();
      } else {
        for(const [px,py] of [[135,305],[256,255],[377,305]]) {
          ink.beginPath();ink.arc(x+px,py,28,0,Math.PI*2);ink.stroke();
          ink.beginPath();ink.arc(x+px,py+85,50,Math.PI,Math.PI*2);ink.stroke();
        }
        ink.strokeStyle='#a87548';ink.beginPath();ink.moveTo(x+135,435);ink.lineTo(x+377,435);ink.stroke();
      }
    }
  });
  // One atlas/material for all three sheets; UI carries the actual published roles.
  const sheetMaterial=new THREE.MeshBasicMaterial({map:docs,toneMapped:false});
  for(let i=0;i<3;i++) {
    const x=-1.53+i*1.53,y=2.75+(i%2)*.15;
    box(experience,1.26,1.82,.045,x,y,-1.34,m.ivory);
    const sheet=new THREE.Mesh(new THREE.PlaneGeometry(1.18,1.72),sheetMaterial);sheet.position.set(x,y,-1.311);
    const uv=sheet.geometry.getAttribute('uv');for(let n=0;n<uv.count;n++)uv.setX(n,(uv.getX(n)+i)/3);experience.add(sheet);
    box(experience,.20,.13,.045,x,y+.88,-1.285,m.metal);
    cylinder(experience,.035,.035,x,y+.95,-1.28,m.copper).rotation.x=Math.PI/2;
  }
  for(let i=0;i<3;i++)box(experience,.90,.08,.70,-1.45,1.31+i*.09,-.12,[m.paper,m.green,m.orange][i]);
  cylinder(experience,.14,.34,1.68,1.43,-.2,m.metal);
  for(let i=0;i<4;i++)cylinder(experience,.014,.48,1.60+i*.05,1.70,-.2,[m.copper,m.ivory][i%2]).rotation.z=(i-1.5)*.08;
  const boardLight=new THREE.PointLight('#ffdfaa',7,5,1.7);boardLight.position.set(0,3.8,.1);experience.add(boardLight);
  about.position.x=-7.4;experience.position.x=-13.4;
  const story=new THREE.Group();story.name='story-corners';story.add(about,experience);bake(story);
  const key=new THREE.SpotLight('#ffe3b6',50,15,.85,.65,1.5);key.position.set(-10.5,7,4);key.target.position.set(-10.5,1.8,-.6);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);key.shadow.normalBias=.02;
  story.add(key,key.target);
  return {story,about,experience};
}
