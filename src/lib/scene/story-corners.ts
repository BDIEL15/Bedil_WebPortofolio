import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { bakeStaticGroup as bake } from './bake-static';
import type { ScenePhoto } from './scene-photos';
import photoSources from '../../data/scene-photo-slots.json';
import { notebookMotion, notebookSegments } from './notebook-motion';

type Palette = Record<'wood'|'darkWood'|'sand'|'metal'|'ivory'|'paper'|'green'|'black'|'copper'|'orange', THREE.MeshStandardMaterial>;
export type ExperienceBadge={id:string;organization:string;role:string;year?:string};

/** Shared-workbench props only. These illustrations are not owner projects or certificates. */
export function buildStoryCorners(m:Palette,experiences:readonly ExperienceBadge[]) {
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
  const about=new THREE.Group();about.name='about-reading-corner';about.position.set(-1.98,1.34,.65);about.scale.setScalar(.62);about.rotation.y=.07;
  box(about,2,.045,1.3,0,.0225,0,m.green);
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
    const leaf=box(about,.94,.035,1.18,side*.47,.06,0,m.paper);leaf.rotation.z=side*-.045;
    const page=surface(about,.92,1.16,0,0,0,notes);leaf.add(page);page.position.set(0,.019,0);page.rotation.x=-Math.PI/2;
    const uv=page.geometry.getAttribute('uv');for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*.5+(side<0?0:.5));
  }
  box(about,.035,.012,1.25,0,.10,0,m.copper);
  const pencil=cylinder(about,.018,.64,-.9,.018,.6,m.copper);pencil.rotation.z=Math.PI/2;
  const tip=new THREE.Mesh(new THREE.ConeGeometry(.018,.07,8),m.black);tip.position.set(-1.25,.018,.6);tip.rotation.z=Math.PI/2;about.add(tip);

  const photoSlots:ScenePhoto[]=[];
  const mount=texture(400,300,ink=>{
    ink.fillStyle='#b9b19c';ink.fillRect(0,0,400,300);ink.strokeStyle='#817f6e';ink.lineWidth=3;
    for(const [x,y,sx,sy] of [[30,30,1,1],[370,30,-1,1],[30,270,1,-1],[370,270,-1,-1]]){ink.beginPath();ink.moveTo(x+sx*30,y);ink.lineTo(x,y);ink.lineTo(x,y+sy*30);ink.stroke();}
    ink.fillStyle='#666c5e';ink.font='24px sans-serif';ink.textAlign='center';ink.fillText('PHOTO',200,158);
  });
  function photo(parent:THREE.Group,id:ScenePhoto['id'],w:number,h:number,x:number,y:number,z:number) {
    const material=new THREE.MeshBasicMaterial({map:mount,toneMapped:false});
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);mesh.position.set(x,y,z);parent.add(mesh);
    photoSlots.push({id,material,aspect:w/h});
  }
  const experience=new THREE.Group();experience.name='experience-lanyards';
  const badgeColors=['#365a50','#4d6070','#795f48'];
  const badgeAtlas=texture(1200,600,ink=>{
    for(const [i,role] of experiences.entries()) {
      const x=i*400;ink.fillStyle='#e0d7c3';ink.fillRect(x,0,400,600);
      ink.fillStyle=badgeColors[i];ink.fillRect(x,0,10,600);ink.fillRect(x+10,0,390,42);
      ink.textAlign='left';ink.fillStyle='#e8e2d4';ink.font='17px sans-serif';ink.fillText('EXPERIENCE',x+30,28);
      ink.fillStyle=badgeColors[i];ink.font='bold 29px sans-serif';ink.fillText(role.organization,x+30,96,340);
      ink.fillStyle='#bcb5a2';ink.fillRect(x+30,120,340,1);
      ink.fillStyle='#c9c2b0';ink.fillRect(x+74,138,252,232);
      ink.fillStyle='#353e35';ink.font='26px sans-serif';ink.fillText('Abdiel Deandra',x+30,422);ink.fillText('EL Dzaky',x+30,455);
      ink.fillStyle=badgeColors[i];ink.font='22px sans-serif';ink.fillText(role.role,x+30,507,340);
      ink.fillStyle='#bcb5a2';ink.fillRect(x+30,541,340,1);
      if(role.year){ink.fillStyle='#5d665b';ink.font='21px sans-serif';ink.fillText(role.year,x+30,578);}
    }
  });
  for(const [i,role] of experiences.entries()) {
    const badge=new THREE.Group();badge.name='experience-badge';badge.userData.experienceId=role.id;
    // The owner places the highest-priority badge in the former IME slot nearest the camera.
    const slot=2-i;
    badge.position.set(-2.68+slot*.75,2.86,-1.30);badge.scale.setScalar(.70);badge.rotation.z=(slot-1)*.025;experience.add(badge);
    const ribbonMaterial=new THREE.MeshStandardMaterial({color:badgeColors[i],roughness:1,side:THREE.DoubleSide});
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.025,.55,0),new THREE.Vector3(-.13,.72,-.02),new THREE.Vector3(0,.79,-.035),new THREE.Vector3(.13,.72,-.02),new THREE.Vector3(.025,.55,0)]);
    const points:number[]=[],indices:number[]=[];
    for(let n=0;n<=40;n++) {
      const p=curve.getPoint(n/40),t=curve.getTangent(n/40),length=Math.hypot(t.x,t.y);
      for(const side of [-1,1])points.push(p.x-side*t.y/length*.024,p.y+side*t.x/length*.024,.01);
      if(n<40){const k=n*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}
    }
    const strapGeometry=new THREE.BufferGeometry();strapGeometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));strapGeometry.setIndex(indices);strapGeometry.computeVertexNormals();badge.add(new THREE.Mesh(strapGeometry,ribbonMaterial));
    box(badge,.66,.96,.045,0,0,.025,m.metal);
    box(badge,.63,.93,.022,0,0,.048,m.ivory);
    const face=surface(badge,.60,.90,0,0,.061,badgeAtlas);
    const uv=face.geometry.getAttribute('uv');for(let n=0;n<uv.count;n++)uv.setX(n,(uv.getX(n)+i)/3);
    if(Object.hasOwn(photoSources,role.id))photo(badge,role.id as ScenePhoto['id'],.36,.33,0,.069,.064);
    box(badge,.14,.022,.008,0,.461,.061,m.black);
    box(badge,.08,.11,.035,0,.50,.04,m.metal);
    box(badge,.025,.075,.014,0,.51,.065,m.sand);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.035,.007,6,16),m.copper);ring.position.set(0,.572,.035);badge.add(ring);
    // Small peg anchors the loop to the board; the metal clip meets the punched holder slot.
    cylinder(badge,.022,.08,0,.79,-.035,m.copper).rotation.x=Math.PI/2;
  }
  const memories=new THREE.Group();memories.name='photo-mounts';
  for(let i=0;i<2;i++) {
    const frame=new THREE.Group();frame.position.set(-3.63,2.48+i*.62,-1.29);frame.rotation.z=i?-.08:.055;memories.add(frame);
    box(frame,.49,.41,.025,0,0,0,m.paper);photo(frame,i?'memory-02':'memory-01',.42,.30,0,.022,.014);
    box(frame,.11,.045,.012,0,.205,.02,m.sand);
  }
  const story=new THREE.Group();story.name='story-corners';
  bake(about);for(const badge of experience.children)bake(badge as THREE.Group);bake(memories);story.add(about,experience,memories);
  const pinboard=new THREE.Group();pinboard.name='writing-pinboard';pinboard.position.set(0,0,-1.365);story.add(pinboard);
  const sketches=texture(1536,640,ink=>{
    for(let page=0;page<3;page++) {
      const x=page*512;ink.fillStyle='#d4c9ad';ink.fillRect(x,0,512,640);
      ink.fillStyle='#59634f';ink.font='30px sans-serif';ink.fillText(['FIELD NOTES','IDEAS','SKETCHES'][page],x+48,74);
      ink.strokeStyle='#8d927b';ink.lineWidth=2;
      for(let row=0;row<4;row++){ink.beginPath();ink.moveTo(x+48,470+row*32);ink.lineTo(x+400-row%2*85,470+row*32);ink.stroke();}
      ink.strokeStyle='#496556';ink.lineWidth=4;
      if(page===1) {
        ink.beginPath();ink.arc(x+256,267,92,0,Math.PI*2);ink.stroke();
        ink.beginPath();ink.ellipse(x+256,267,143,36,-.45,0,Math.PI*2);ink.stroke();
      } else if(page===0) {
        ink.strokeRect(x+183,203,146,146);
        for(const y of [230,276,322]){ink.beginPath();ink.moveTo(x+95,y);ink.lineTo(x+183,y);ink.moveTo(x+329,y);ink.lineTo(x+417,y);ink.stroke();}
      }
      if(page===2){ink.beginPath();for(let n=0;n<350;n++){const y=280+Math.sin(n*.04)*70;n?ink.lineTo(x+80+n,y):ink.moveTo(x+80+n,y);}ink.stroke();}
      ink.fillStyle='#b27b4e';ink.beginPath();ink.arc(x+280,240,9,0,Math.PI*2);ink.fill();
    }
  });
  for(let i=0;i<3;i++) {
    const sheet=new THREE.Group();sheet.position.set(1.29+i*.68,2.97,0);sheet.rotation.z=(i-1)*-.035;pinboard.add(sheet);
    box(sheet,.54,.70,.018,0,0,0,m.paper);
    const drawing=surface(sheet,.52,.68,0,0,.011,sketches);
    const uv=drawing.geometry.getAttribute('uv');for(let n=0;n<uv.count;n++)uv.setX(n,(uv.getX(n)+i)/3);
    box(sheet,.075,.09,.04,0,.385,.055,m.metal);
    cylinder(sheet,.019,.025,0,.43,.055,m.copper).rotation.x=Math.PI/2;
  }
  const cordCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(.96,3.40,.055),new THREE.Vector3(1.98,3.37,.055),new THREE.Vector3(2.99,3.40,.055)]);
  pinboard.add(new THREE.Mesh(new THREE.TubeGeometry(cordCurve,40,.007,6,false),m.copper));
  const chalk=texture(768,640,ink=>{
    ink.fillStyle='#203b32';ink.fillRect(0,0,768,640);ink.fillStyle='#d1d5be';ink.font='32px serif';ink.fillText('FIELDS & MOTION',48,62);
    ink.font='37px serif';for(const [i,line] of ['F = ma','E = ½mv²','V = IR','ω = 2πf','∇ · E = ρ / ε₀','∇ · B = 0'].entries()){ink.globalAlpha=.70+i*.035;ink.fillText(line,58+(i%2)*25,145+i*75);}
    ink.globalAlpha=.18;ink.strokeStyle='#cfdbc4';for(let i=0;i<15;i++){ink.beginPath();ink.moveTo(40+i*43,610);ink.lineTo(60+i*43,601);ink.stroke();}ink.globalAlpha=1;
  });
  box(pinboard,1.31,1.11,.05,3.49,2.87,.01,m.darkWood);
  surface(pinboard,1.22,1.02,3.49,2.87,.037,chalk);
  box(pinboard,1.35,.045,.11,3.49,2.305,.04,m.wood);
  box(pinboard,.16,.026,.025,3.18,2.34,.06,m.paper);
  bake(pinboard);
  // Keep moving objects outside the static material batches.
  const writing=new THREE.Group();writing.name='notebook-writing';writing.position.copy(about.position);writing.rotation.copy(about.rotation);writing.scale.copy(about.scale);story.add(writing);
  const writingGeometry=new THREE.BufferGeometry().setFromPoints(notebookSegments.map(([x,z])=>new THREE.Vector3(x,.082+(x+.47)*Math.sin(.045),z)));
  const inkMaterial=new THREE.LineBasicMaterial({color:'#4c5142',transparent:true});
  const ink=new THREE.LineSegments(writingGeometry,inkMaterial);ink.name='notebook-ink';writing.add(ink);
  const pen=new THREE.Group();pen.name='writing-pencil';writing.add(pen);
  cylinder(pen,.018,.38,0,.27,0,m.orange);
  const woodTip=new THREE.Mesh(new THREE.ConeGeometry(.018,.09,8),m.paper);woodTip.rotation.z=Math.PI;woodTip.position.y=.035;pen.add(woodTip);
  const graphite=new THREE.Mesh(new THREE.ConeGeometry(.006,.025,8),m.black);graphite.rotation.z=Math.PI;graphite.position.y=.009;pen.add(graphite);
  cylinder(pen,.019,.025,0,.47,0,m.metal);
  pen.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(.45,.88,.15).normalize());
  pen.traverse(object=>{if(object instanceof THREE.Mesh)object.castShadow=true;});
  function animateWriting(seconds:number,active:boolean) {
    const pose=notebookMotion(seconds);pen.visible=active;
    writingGeometry.setDrawRange(0,pose.count);inkMaterial.opacity=pose.opacity;
    pen.position.set(pose.x,.086+(pose.x+.47)*Math.sin(.045)+pose.lift,pose.z);
  }
  animateWriting(0,false);
  return {story,about,experience,animateWriting,photoSlots};
}
