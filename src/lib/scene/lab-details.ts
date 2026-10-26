import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { bakeStaticGroup } from './bake-static';

type Palette=Record<'wood'|'darkWood'|'metal'|'ivory'|'sand'|'paper'|'green'|'black'|'copper'|'orange',THREE.MeshStandardMaterial>;

/** Original study geometry: electronics from the workbench reference, hobbies selected by the owner. */
export function buildLabDetails(m:Palette) {
  const details=new THREE.Group();details.name='personal-lab-details';
  function box(p:THREE.Group,w:number,h:number,d:number,x:number,y:number,z:number,material:THREE.Material=m.ivory) {
    const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,1,Math.min(.018,w*.12,h*.12,d*.12)),material);
    mesh.position.set(x,y,z);p.add(mesh);return mesh;
  }
  function cylinder(p:THREE.Group,r:number,h:number,x:number,y:number,z:number,material:THREE.Material=m.metal,front=false) {
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),material);mesh.position.set(x,y,z);if(front)mesh.rotation.x=Math.PI/2;p.add(mesh);return mesh;
  }
  function tube(p:THREE.Group,points:number[][],radius=.014,material:THREE.Material=m.black) {
    const curve=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)));
    const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(32,points.length*3),radius,6,false),material);p.add(mesh);return mesh;
  }
  function texture(w:number,h:number,paint:(ink:CanvasRenderingContext2D)=>void) {
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    const ink=canvas.getContext('2d');if(!ink)throw new Error('Lab detail texture unavailable');paint(ink);
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;return map;
  }
  const rack=new THREE.Group();rack.name='shelf-electronics';details.add(rack);
  const screens=texture(1024,256,ink=>{
    for(let i=0;i<4;i++) {
      const x=i*256;ink.fillStyle=i===2?'#c8c1a4':'#172c28';ink.fillRect(x,0,256,256);
      ink.strokeStyle=i===2?'#57634d':'#456350';ink.lineWidth=1;
      for(let n=32;n<256;n+=32){ink.beginPath();ink.moveTo(x+n,0);ink.lineTo(x+n,256);ink.moveTo(x,n);ink.lineTo(x+256,n);ink.stroke();}
      ink.fillStyle=i===2?'#3e493b':'#d2c391';ink.font='36px sans-serif';
      if(i===1){ink.fillText('12.00 V',x+18,91);ink.fillText('0.35 A',x+18,165);}
      else if(i===2){ink.beginPath();ink.arc(x+128,170,95,Math.PI,Math.PI*2);ink.stroke();ink.beginPath();ink.moveTo(x+128,170);ink.lineTo(x+171,96);ink.stroke();ink.font='22px sans-serif';ink.fillText('SIGNAL',x+80,221);}
      else{ink.strokeStyle='#d3bc76';ink.lineWidth=3;ink.beginPath();for(let n=0;n<256;n++){const y=126+Math.sin(n*.053)*42+(i===3?Math.sin(n*.15)*12:0);n?ink.lineTo(x+n,y):ink.moveTo(x+n,y);}ink.stroke();}
    }
  });
  const screenMaterial=new THREE.MeshBasicMaterial({map:screens,toneMapped:false});
  function instrument(x:number,y:number,w:number,h:number,mode:number) {
    const unit=new THREE.Group();unit.position.set(x,y,-1.02);rack.add(unit);
    box(unit,w,h,.46,0,h/2,0,m.sand);box(unit,w-.025,h-.025,.025,0,h/2,.243,m.ivory);
    box(unit,w*.56,h*.69,.026,-w*.15,h*.53,.264,m.black);
    const screen=new THREE.Mesh(new THREE.PlaneGeometry(w*.51,h*.60),screenMaterial);screen.position.set(-w*.15,h*.53,.279);unit.add(screen);
    const uv=screen.geometry.getAttribute('uv');for(let i=0;i<uv.count;i++)uv.setX(i,(uv.getX(i)+mode)/4);
    for(const [kx,ky,r]of [[w*.32,h*.68,.05],[w*.26,h*.30,.027],[w*.39,h*.30,.027]])cylinder(unit,r,.035,kx,ky,.28,m.metal,true);
    for(const side of [-1,1])cylinder(unit,.022,.035,side*w*.15,.065,.28,side<0?m.orange:m.black,true);
    for(let n=0;n<5;n++)box(unit,.005,.07,.003,w*.25+n*.034,h*.48,.259,m.metal);
    for(const side of [-1,1])box(unit,.13,.035,.28,side*w*.32,.018,0,m.black);
  }
  instrument(-3.37,3.61,1.18,.50,1);
  instrument(3.55,3.61,.82,.43,1);
  // A compact parts organizer closes the gap between hobbies and the scope.
  box(rack,.52,.42,.38,1.48,3.82,-1.01,m.metal);
  for(let row=0;row<3;row++)for(let col=0;col<2;col++) {
    const x=1.355+col*.25,y=3.685+row*.135;
    box(rack,.225,.115,.035,x,y,-.81,m.sand);box(rack,.085,.020,.025,x,y-.02,-.785,m.ivory);
  }
  bakeStaticGroup(rack);
  const drawers=new THREE.Group();drawers.name='bench-parts-drawers';details.add(drawers);
  box(drawers,.72,.66,.57,-3.67,1.67,-.55,m.metal);
  for(let row=0;row<3;row++)for(let col=0;col<2;col++) {
    const x=-3.85+col*.36,y=1.46+row*.21;
    box(drawers,.32,.18,.045,x,y,-.25,m.sand);box(drawers,.13,.035,.04,x,y-.025,-.215,m.ivory);
  }
  bakeStaticGroup(drawers);
  const wires=new THREE.Group();wires.name='test-leads-and-cables';details.add(wires);
  for(let n=0;n<2;n++) {
    const points:number[][]=[];
    for(let i=0;i<=64;i++){const a=i/64*Math.PI*4;points.push([2.94+Math.cos(a)*(.10+n*.012),3.91+Math.sin(a)*(.17+n*.01),-.69+n*.022+i*.001]);}
    tube(wires,points,.012,n===1?m.orange:m.black);
  }
  tube(wires,[[2.94,4.13,-1.36],[2.94,4.12,-.72],[2.94,4.06,-.65],[3.0,4.08,-.63]],.012,m.metal);
  tube(wires,[[-3.547,3.675,-.717],[-3.83,3.58,-.7],[-3.99,2.6,-.98],[-3.95,1.46,-1.04],[-3.0,1.38,-1.02]],.019);
  tube(wires,[[3.427,3.675,-.717],[4.10,3.5,-.78],[4.14,2.1,-1.12],[3.48,1.39,-.83],[2.08,1.40,-.45]],.017,m.orange);
  bakeStaticGroup(wires);

  const hobby=new THREE.Group();hobby.name='hobby-display';hobby.position.set(-.35,3.61,-1.08);details.add(hobby);
  const camera=new THREE.Group();camera.name='hobby-camera';camera.position.set(-.83,0,.02);hobby.add(camera);
  box(camera,.61,.34,.28,0,.17,0,m.black);box(camera,.62,.065,.29,0,.37,0,m.sand);
  box(camera,.21,.10,.21,.04,.43,-.015,m.metal);box(camera,.11,.06,.01,.04,.43,.096,m.black);
  cylinder(camera,.17,.20,.04,.20,.22,m.metal,true);cylinder(camera,.135,.065,.04,.20,.34,m.black,true);
  const glass=new THREE.MeshStandardMaterial({color:'#234b44',metalness:.55,roughness:.18});cylinder(camera,.106,.009,.04,.20,.378,glass,true);
  const lensRing=new THREE.Mesh(new THREE.TorusGeometry(.079,.004,6,32),m.metal);lensRing.position.set(.04,.20,.386);camera.add(lensRing);
  const aperture=new THREE.Mesh(new THREE.CircleGeometry(.044,6),m.black);aperture.position.set(.04,.20,.389);camera.add(aperture);
  for(let n=0;n<20;n++) {
    const a=n/20*Math.PI*2;const ridge=box(camera,.009,.025,.009,.04+Math.cos(a)*.148,.20+Math.sin(a)*.148,.367,m.sand);ridge.rotation.z=a-Math.PI/2;
  }
  cylinder(camera,.04,.025,-.22,.415,.025,m.metal);cylinder(camera,.035,.025,.22,.415,.025,m.orange);
  tube(camera,[[-.3,.3,0],[-.38,.12,.13],[-.32,.05,.20],[.24,.05,.23],[.35,.10,.14],[.30,.3,0]],.012);
  const toy=new THREE.Group();toy.name='power-figure';toy.position.set(.05,0,0);toy.scale.setScalar(.62);hobby.add(toy);
  const skin=new THREE.MeshStandardMaterial({color:'#e5bea3',roughness:.76});
  const hair=new THREE.MeshStandardMaterial({color:'#d7b797',roughness:.78});
  const jacket=new THREE.MeshStandardMaterial({color:'#3c5265',roughness:.78});
  const red=new THREE.MeshStandardMaterial({color:'#a24437',roughness:.65});
  function sphere(p:THREE.Group,r:number,x:number,y:number,z:number,material:THREE.Material,sx=1,sy=1,sz=1) {
    const mesh=new THREE.Mesh(new THREE.SphereGeometry(r,20,12),material);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);p.add(mesh);return mesh;
  }
  cylinder(toy,.24,.035,0,.018,0,m.metal);
  for(const side of [-1,1]) {
    box(toy,.11,.10,.20,side*.09,.085,.035,m.black);
    cylinder(toy,.046,.30,side*.085,.27,0,m.metal);
  }
  cylinder(toy,.13,.29,0,.55,0,m.ivory);box(toy,.26,.25,.14,0,.54,-.055,jacket);
  box(toy,.032,.23,.016,0,.56,.13,m.black).rotation.z=-.08;
  cylinder(toy,.045,.08,0,.735,0,skin);
  sphere(toy,.19,0,.91,0,hair,1,1.1,.87);sphere(toy,.155,0,.90,.065,skin,1,1.08,.8);
  for(const side of [-1,1]) {
    const lock=new THREE.Mesh(new THREE.ConeGeometry(.07,.44,8),hair);lock.rotation.z=Math.PI+side*.10;lock.position.set(side*.15,.80,-.015);toy.add(lock);
    const horn=new THREE.Mesh(new THREE.ConeGeometry(.035,.18,12),red);horn.position.set(side*.10,1.13,0);horn.rotation.z=side*-.15;toy.add(horn);
    sphere(toy,.025,side*.060,.92,.189,red,1,.72,.15);
    box(toy,.008,.036,.008,side*.060,.92,.194,m.orange);box(toy,.03,.008,.008,side*.060,.92,.194,m.orange);
    const arm=cylinder(toy,.047,.25,side*.17,.56,0,jacket);arm.rotation.z=side*-.38;
    sphere(toy,.043,side*.215,.43,.01,skin);
  }
  for(let n=0;n<4;n++) {
    const fringe=new THREE.Mesh(new THREE.ConeGeometry(.048,.20,6),hair);fringe.rotation.z=Math.PI;fringe.position.set(-.105+n*.07,1.01,.15);toy.add(fringe);
  }
  box(toy,.055,.009,.008,.006,.85,.19,m.black);
  // Portable cassette player and two tapes, with separate reel windows.
  const player=new THREE.Group();player.name='hobby-audio-player';player.position.set(.65,0,.02);hobby.add(player);
  box(player,.41,.34,.21,0,.17,0,m.sand);box(player,.34,.23,.022,0,.18,.115,m.ivory);
  box(player,.27,.10,.012,0,.21,.132,m.black);
  for(const x of [-.07,.07]){cylinder(player,.034,.008,x,.21,.141,m.paper,true);cylinder(player,.012,.006,x,.21,.148,m.black,true);}
  for(let n=0;n<4;n++)box(player,.045,.018,.055,-.12+n*.08,.34,0,n===0?m.orange:m.metal);
  tube(player,[[-.27,.24,.01],[-.28,.52,.01],[0,.65,.01],[.28,.52,.01],[.27,.24,.01]],.022);
  for(const x of [-.27,.27])box(player,.085,.15,.085,x,.25,.01,m.black);
  for(let n=0;n<2;n++) {
    const tape=new THREE.Group();tape.name='audio-cassette';tape.rotation.z=n?-.08:.04;tape.position.set(1.18+n*.07,.16*Math.abs(Math.sin(tape.rotation.z))-.005*Math.cos(tape.rotation.z),.12-n*.13);hobby.add(tape);
    box(tape,.32,.21,.045,0,.11,0,m.black);box(tape,.28,.11,.008,0,.13,.027,n?m.paper:m.orange);
    box(tape,.16,.05,.008,0,.125,.033,m.black);
    for(const x of [-.06,.06])cylinder(tape,.027,.01,x,.125,.043,m.ivory,true);
    box(tape,.17,.045,.008,0,.042,.027,m.sand);
  }
  bakeStaticGroup(hobby);
  return {details,hobby};
}
