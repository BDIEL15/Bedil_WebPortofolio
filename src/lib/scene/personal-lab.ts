import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { robotPose } from './robot-motion';
import { buildStoryCorners } from './story-corners';

/** Original, illustrative geometry. Reference photographs are never loaded as assets. */
export function buildPersonalLab() {
  const lab = new THREE.Group();
  lab.name = 'personal-electronics-lab';
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const roundedBoxes = new Map<string, THREE.BufferGeometry>();
  const metal = new THREE.MeshStandardMaterial({ color: '#282b27', metalness: .58, roughness: .53 });
  const ivory = new THREE.MeshStandardMaterial({ color: '#c3bc9e', metalness: .06, roughness: .72 });
  const sand = new THREE.MeshStandardMaterial({ color: '#8c826a', roughness: .84 });
  const black = new THREE.MeshStandardMaterial({ color: '#151a18', roughness: .63 });
  const copper = new THREE.MeshStandardMaterial({ color: '#b36d3e', roughness: .46, metalness: .55 });
  const orange = new THREE.MeshStandardMaterial({ color: '#bb713e', roughness: .62 });
  const green = new THREE.MeshStandardMaterial({ color: '#345246', roughness: .84 });
  const paper = new THREE.MeshStandardMaterial({ color: '#c4b492', roughness: .92 });
  const red = new THREE.MeshStandardMaterial({ color: '#903e2c', roughness: .64 });
  const materials = { metal, ivory, sand, black, copper, orange, green, paper, red };

  function texture(width: number, height: number, paint: (ink: CanvasRenderingContext2D) => void) {
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ink = canvas.getContext('2d');
    if (!ink) throw new Error('Lab texture unavailable');
    paint(ink);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    return map;
  }
  function box(w: number, h: number, d: number, x: number, y: number, z: number, material = ivory, parent: THREE.Object3D = lab, rounded = true) {
    // Build bevels in world units; scaling one rounded cube stretched every edge.
    const key = `${w}/${h}/${d}`;
    let geometry = rounded ? roundedBoxes.get(key) : cube;
    if (!geometry) {
      geometry = new RoundedBoxGeometry(w, h, d, 2, Math.min(.025, Math.min(w,h,d)*.18));
      roundedBoxes.set(key, geometry);
    }
    const mesh = new THREE.Mesh(geometry, material);
    if (!rounded) mesh.scale.set(w, h, d);
    mesh.position.set(x, y, z);
    mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function rod(a: THREE.Vector3, b: THREE.Vector3, radius: number, material = metal, parent: THREE.Object3D = lab) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 12), material);
    mesh.position.copy(a).add(b).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());
    mesh.castShadow = true; parent.add(mesh); return mesh;
  }
  function cable(points: number[][], material = black, radius = .017, parent: THREE.Object3D = lab) {
    const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
    const segments = Math.min(320, Math.max(48, points.length*4));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 8, false),material);
    mesh.castShadow = true; parent.add(mesh); return mesh;
  }
  function label(text: string, w: number, h: number, x: number, y: number, z: number, color = '#a7b9a6', ground = '#12211d', parent: THREE.Object3D = lab) {
    const map = texture(512,256,ink => {
      ink.fillStyle = ground; ink.fillRect(0,0,512,256);
      ink.fillStyle = color; ink.font = '30px sans-serif'; ink.textAlign = 'center'; ink.textBaseline = 'middle'; ink.fillText(text,256,128);
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,toneMapped:false}));
    mesh.position.set(x,y,z); parent.add(mesh); return mesh;
  }
  const woodMap = texture(1024,256,ink => {
    ink.fillStyle = '#765137'; ink.fillRect(0,0,1024,256);
    let seed = 73;
    for (let i=0;i<180;i++) {
      seed = (seed*16807)%2147483647;
      const y = seed%256;
      ink.strokeStyle = i%3===0 ? '#61442e' : '#866044'; ink.globalAlpha = .28;
      ink.lineWidth = i%5===0 ? 2 : .6;
      ink.beginPath(); ink.moveTo(0,y); ink.bezierCurveTo(260,y+4,620,y-3,1024,y+2); ink.stroke();
    }
    ink.globalAlpha = 1;
  });
  const wood = new THREE.MeshStandardMaterial({map:woodMap,color:'#b6aa95',roughness:.65});
  const darkWood = new THREE.MeshStandardMaterial({color:'#49372a',roughness:.92});
  // Texture aspect matches the board so its holes remain circular.
  const pegMap = texture(1536,512,ink=>{
    ink.fillStyle='#393c33'; ink.fillRect(0,0,1536,512);
    for(let y=16;y<512;y+=30) for(let x=16;x<1536;x+=30) {
      ink.fillStyle='#252b25'; ink.beginPath();ink.arc(x,y,3,0,Math.PI*2);ink.fill();
      ink.strokeStyle='#55584b';ink.lineWidth=1;ink.beginPath();ink.arc(x,y+.6,3,0,Math.PI);ink.stroke();
    }
  });
  const pegboard = new THREE.MeshStandardMaterial({map:pegMap,roughness:.94});
  // A compact room, composed as a workbench rather than an endless industrial stage.
  box(9,.16,5.8,0,-.1,0,darkWood,lab,false);
  box(8.7,4.75,.13,0,2.3,-1.55,darkWood,lab,false);
  box(8.35,2.8,.06,0,2.45,-1.43,pegboard,lab,false);
  box(8.6,.18,2.85,0,1.25,0,wood);
  box(8.6,.08,.06,0,1.27,1.45,darkWood);
  for (const x of [-3.75,3.75]) for(const z of [-1.05,1.05]) box(.1,1.17,.1,x,.58,z,metal);
  box(7.55,.08,.08,0,.28,-1.05,metal);
  // Shelf and storage: density at the edges keeps the centre available for the intro.
  box(8.4,.12,.74,0,3.87,-1.02,wood);
  for(const x of [-3.65,3.65]) {
    box(.055,.75,.055,x,3.48,-1.34,metal);
    box(.055,.055,.56,x,3.79,-1.08,metal);
  }
  const strip = new THREE.MeshStandardMaterial({color:'#ffe2a0',emissive:'#ffb959',emissiveIntensity:2.2,roughness:1});
  box(5.8,.035,.13,0,3.785,-1.1,metal);
  box(5.7,.012,.085,0,3.762,-1.1,strip);
  for (let row=0;row<3;row++) for(let column=0;column<3;column++) {
    const x=-3.15+column*.41, y=4.08+row*.18;
    box(.38,.15,.43,x,y,-1.04,black);
    box(.34,.115,.035,x,y,-.79,sand);
    box(.11,.025,.025,x,y-.01,-.758,metal);
  }
  for(let i=0;i<7;i++) {
    const book=new THREE.Group(),height=.43+(i%3)*.08;
    book.position.set(2.4+i*.14,3.93+height/2,-1.04);lab.add(book);
    const cover=[green,orange,sand,black][i%4];
    box(.085,height-.025,.32,0,0,0,paper,book);
    for(const side of [-1,1])box(.012,height,.36,side*.05,0,0,cover,book);
    box(.11,height,.018,0,0,.17,cover,book);
    for(const y of [-height*.32,height*.32])box(.075,.008,.004,0,y,.182,paper,book,false);
  }
  // Two generic instruments; screens are an illustrative study, not live measurements.
  function instrument(x:number,y:number,z:number,scale=1) {
    const group=new THREE.Group();group.position.set(x,y,z);group.scale.setScalar(scale);lab.add(group);
    box(1.34,.71,.72,0,0,0,sand,group);
    box(1.29,.66,.035,0,0,.367,ivory,group);
    box(.81,.48,.025,-.2,.04,.396,black,group);
    const screen=texture(512,256,ink=>{
      ink.fillStyle='#12231d';ink.fillRect(0,0,512,256);
      ink.strokeStyle='#32493c';ink.lineWidth=1;
      for(let a=0;a<512;a+=51){ink.beginPath();ink.moveTo(a,0);ink.lineTo(a,256);ink.stroke();}
      for(let a=0;a<256;a+=51){ink.beginPath();ink.moveTo(0,a);ink.lineTo(512,a);ink.stroke();}
      ink.strokeStyle='#d4ba77';ink.lineWidth=3;ink.beginPath();
      for(let a=0;a<=512;a++){const y=128+Math.sin(a*.035)*38; a ? ink.lineTo(a,y) : ink.moveTo(a,y);}ink.stroke();
      ink.fillStyle='#9dac8c';ink.font='16px monospace';ink.fillText('SIGNAL STUDY',16,25);
    });
    const display=new THREE.Mesh(new THREE.PlaneGeometry(.72,.39),new THREE.MeshBasicMaterial({map:screen,toneMapped:false}));
    display.position.set(-.2,.04,.411);group.add(display);
    for(const [kx,ky,radius] of [[.42,.15,.073],[.34,-.06,.037],[.52,-.06,.037]]) {
      const knob=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,.055,24),metal);
      knob.rotation.x=Math.PI/2;knob.position.set(kx,ky,.421);group.add(knob);
      box(.009,.026,.006,kx,ky+radius*.55,.452,paper,group,false);
    }
    for(const [index,px] of [-.37,-.05].entries()) {
      const socket=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.065,20),metal);
      socket.rotation.x=Math.PI/2;socket.position.set(px,-.264,.415);group.add(socket);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.028,.009,8,20),index?black:orange);
      ring.position.set(px,-.264,.451);group.add(ring);
    }
    for(let i=0;i<6;i++)box(.009,.09,.004,.28+i*.045,-.23,.387,metal,group,false);
    for(const px of [-.48,.48])box(.14,.075,.39,px,-.37,-.03,black,group);
    for(let i=0;i<7;i++)box(.004,.012,.34,-.674,.15-i*.036,-.04,black,group,false);
    return group;
  }
  instrument(1.95,4.27,-1.02,.83);
  instrument(-1.35,4.24,-1.02,.75);
  const scope=instrument(2.76,1.78,-.84,1.07); scope.rotation.y=-.12;
  // Monitor and stand on the left, with a quiet original screen graphic.
  const monitor=new THREE.Group();monitor.position.set(-2.15,2.08,-.68);monitor.rotation.y=.15;lab.add(monitor);
  box(1.75,1.06,.11,0,0,0,black,monitor);
  box(1.65,.96,.08,0,0,-.075,metal,monitor);
  rod(new THREE.Vector3(0,-.69,-.1),new THREE.Vector3(0,-.47,-.03),.045,metal,monitor);
  box(.58,.035,.36,0,-.70,.02,metal,monitor).name='monitor-base';
  const monitorMap=texture(768,432,ink=>{
    ink.fillStyle='#182b28';ink.fillRect(0,0,768,432);
    ink.fillStyle='#7f9c86';ink.font='22px sans-serif';ink.fillText('a place for ideas',38,55);
    ink.strokeStyle='#739685';ink.lineWidth=2;
    ink.beginPath();ink.arc(540,225,100,0,Math.PI*2);ink.stroke();
    ink.beginPath();ink.ellipse(540,225,150,30,-.45,0,Math.PI*2);ink.stroke();
    ink.fillStyle='#dab77d';ink.beginPath();ink.arc(632,168,7,0,Math.PI*2);ink.fill();
    for(let i=0;i<8;i++){ink.fillStyle=i===0?'#b89b6d':'#3b574a';ink.fillRect(40,119+i*27,100+(i%3)*40,5);}
  });
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(1.6,.9),new THREE.MeshBasicMaterial({map:monitorMap,toneMapped:false}));
  screen.position.z=.062;monitor.add(screen);
  box(.018,.008,.004,.71,-.49,.058,green,monitor,false);
  // An articulated task lamp, with a real warm light aimed at the work surface.
  const lamp=new THREE.Group();lamp.position.set(-3.65,1.36,.2);lab.add(lamp);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.27,.31,.09,32),metal);lamp.add(base);
  rod(new THREE.Vector3(0,.04,0),new THREE.Vector3(-.15,1.16,-.25),.033,metal,lamp);
  rod(new THREE.Vector3(-.15,1.16,-.25),new THREE.Vector3(.5,1.55,-.24),.033,metal,lamp);
  const head=new THREE.Group();head.position.set(.54,1.47,-.2);head.rotation.set(.45,0,-.25);lamp.add(head);
  const shadeMaterial=metal.clone();shadeMaterial.side=THREE.DoubleSide;
  const shade=new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(.27,-.14),new THREE.Vector2(.25,-.08),new THREE.Vector2(.14,.1),new THREE.Vector2(.055,.14)],32),shadeMaterial);
  head.add(shade);
  const lip=new THREE.Mesh(new THREE.TorusGeometry(.27,.012,8,32),metal);
  lip.rotation.x=Math.PI/2;lip.position.y=-.14;head.add(lip);
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(.065,16,8),strip);bulb.position.y=-.08;head.add(bulb);
  const warm=new THREE.SpotLight('#ffc66d',20,7,Math.PI/3,.75,1.2);
  warm.position.set(0,-.12,0);warm.target.position.set(.4,-1.4,.5);head.add(warm,warm.target);
  // Cutting mat and a compact mechanical keyboard, with batched keycaps.
  const matMap=texture(1024,512,ink=>{
    ink.fillStyle='#27453a';ink.fillRect(0,0,1024,512);ink.strokeStyle='#73917b';ink.globalAlpha=.3;
    for(let x=16;x<1024;x+=32){ink.beginPath();ink.moveTo(x,16);ink.lineTo(x,496);ink.stroke();}
    for(let y=16;y<512;y+=32){ink.beginPath();ink.moveTo(16,y);ink.lineTo(1008,y);ink.stroke();}
    ink.globalAlpha=.65;ink.fillStyle='#adba9b';ink.font='11px monospace';
    for(let i=1;i<31;i++)ink.fillText(String(i),16+i*32,12);
  });
  const mat=box(3.55,.018,1.68,.4,1.354,.35,new THREE.MeshStandardMaterial({map:matMap,roughness:1}),lab,false);
  mat.name='cutting-mat';
  const keyboard=new THREE.Group();keyboard.name='mechanical-keyboard';keyboard.position.set(-.48,1.44,.68);keyboard.rotation.set(-.06,.07,0);lab.add(keyboard);
  box(1.93,.1,.77,0,0,0,black,keyboard).name='keyboard-case';
  box(1.88,.025,.72,0,.035,0,metal,keyboard);
  const rows: [string,number][][] = [
    [['Esc',1],...Array.from('1234567890-=').map(c=>[c,1] as [string,number]),['Back',2]],
    [['Tab',1.5],...Array.from('QWERTYUIOP[]').map(c=>[c,1] as [string,number]),['\\',1.5]],
    [['Caps',1.75],...Array.from("ASDFGHJKL;'").map(c=>[c,1] as [string,number]),['Enter',2.25]],
    [['Shift',2.25],...Array.from('ZXCVBNM,./').map(c=>[c,1] as [string,number]),['Shift',2.75]],
    [['Ctrl',1.25],['Meta',1.25],['Alt',1.25],['',6.25],['Alt',1.25],['Fn',1.25],['Menu',1.25],['Ctrl',1.25]],
  ];
  const keyGeometry=new RoundedBoxGeometry(.108,.055,.108,2,.008);
  const keyMaterial=ivory.clone();keyMaterial.color.set('#ffffff');
  const keys=new THREE.InstancedMesh(keyGeometry,keyMaterial,rows.flat().length);
  keys.name='keycaps';keys.castShadow=true;keys.receiveShadow=true;keyboard.add(keys);
  const matrix=new THREE.Matrix4();let key=0;
  const legends=texture(1536,576,ink=>{
    ink.clearRect(0,0,1536,576);ink.fillStyle='#49473c';ink.textAlign='center';ink.textBaseline='middle';
    rows.forEach((row,rowIndex)=>{
      let left=-.8925;
      for(const [text,units] of row) {
        const width=units*.119-.011,x=left+units*.119/2,z=-.256+rowIndex*.128;
        matrix.makeScale(width/.108,1,1);matrix.setPosition(x,.0715,z);keys.setMatrixAt(key,matrix);
        keys.setColorAt(key,new THREE.Color(key===0?'#bb713e':units>1&&text?'#aaa38e':'#e6dec7'));
        ink.font=text.length>1?'17px sans-serif':'24px sans-serif';
        ink.fillText(text,(x/1.785+.5)*1536,(z/.64+.5)*576-8);
        left+=units*.119;key++;
      }
    });
  });
  keys.instanceMatrix.needsUpdate=true;
  const legendPlane=new THREE.Mesh(new THREE.PlaneGeometry(1.785,.64),new THREE.MeshBasicMaterial({map:legends,transparent:true,depthWrite:false,toneMapped:false}));
  legendPlane.rotation.x=-Math.PI/2;legendPlane.position.y=.1005;keyboard.add(legendPlane);
  box(.09,.035,.035,-.1,.012,-.396,metal,keyboard);
  // Coiled keyboard cable, then two loose test leads across the mat.
  const coil:number[][]=[];
  for(let i=0;i<=168;i++) {
    const s=i/168,a=s*Math.PI*14;
    coil.push([-.3+s*.585+Math.cos(a)*.0264,1.45+Math.sin(a)*.06,-.14-s*.286+Math.cos(a)*.054]);
  }
  keyboard.updateMatrixWorld(true);
  const usb=new THREE.Vector3(-.1,.012,-.418).applyMatrix4(keyboard.matrixWorld);
  cable([usb.toArray(),[-.57,1.43,.04],coil[0]],black,.018);
  cable(coil,black,.014).name='keyboard-coil';
  const coilEnd=new THREE.Vector3(...coil[coil.length-1]);
  const connectorEnd=coilEnd.clone().add(new THREE.Vector3(.144,0,-.07));
  rod(coilEnd,connectorEnd,.031,metal).name='cable-connector';
  monitor.updateMatrixWorld(true);
  const monitorPort=new THREE.Vector3(.35,-.43,-.13).applyMatrix4(monitor.matrixWorld);
  cable([connectorEnd.toArray(),[.8,1.38,-.65],[.4,1.38,-1.1],[-1.75,1.38,-1.12],monitorPort.toArray()],black,.018);
  scope.updateMatrixWorld(true);
  for(const [index,px] of [-.37,-.05].entries()) {
    const port=new THREE.Vector3(px,-.264,.46).applyMatrix4(scope.matrixWorld);
    const color=index?black:red;
    const end=new THREE.Vector3(index?2.8:1.86,1.4,1.05);
    cable([port.toArray(),[port.x,1.39,-.08],[index?3.1:1.82,1.39,.4],end.toArray()],color,.018);
    const tip=new THREE.Vector3(index?2.52:2.08,1.4,.8);
    rod(end,tip,.026,color);
    rod(tip,tip.clone().add(new THREE.Vector3(index?-.10:.08,0,-.10)),.008,metal);
  }
  // Notebook, board, tools and a handful of components: illustrative, no invented work.
  const notebook=new THREE.Group();notebook.position.set(1.24,1.4,.58);notebook.rotation.y=-.17;lab.add(notebook);
  box(.61,.045,.83,.006,0,0,paper,notebook);
  for(const y of [-.03,.03])box(.65,.014,.87,0,y,0,green,notebook);
  box(.024,.065,.85,-.313,0,0,green,notebook);
  const note=label('LAB NOTES',.32,.13,-.02,.038,-.15,'#c4b492','#345246',notebook);note.rotation.x=-Math.PI/2;
  box(.018,.003,.85,.235,.039,0,black,notebook,false);
  for(let i=0;i<3;i++)box(.002,.002,.78,.312,-.012+i*.011,0,sand,notebook,false);
  rod(new THREE.Vector3(1.67,1.385,.25),new THREE.Vector3(1.61,1.385,.84),.015,black);
  rod(new THREE.Vector3(1.61,1.385,.84),new THREE.Vector3(1.6,1.385,.91),.008,metal);
  box(.56,.025,.4,2.31,1.37,.85,green);
  box(.17,.045,.16,2.31,1.4,.84,black);
  for(let i=0;i<6;i++)for(const z of [.68,1.02])box(.025,.055,.025,2.08+i*.08,1.41,z,copper);
  // Pegboard edges: tools and hanging wire, leaving the middle deliberately calm.
  for(let i=0;i<4;i++) {
    const x=-3.45+i*.3;
    const handle=new THREE.Mesh(new THREE.CapsuleGeometry(.038,.28,4,12),i%2?orange:black);
    handle.position.set(x,3.0,-1.27);handle.castShadow=true;lab.add(handle);
    rod(new THREE.Vector3(x,3.15,-1.27),new THREE.Vector3(x,3.43,-1.27),.009,metal);
    box(.026,.055,.006,x,3.445,-1.27,metal);
    rod(new THREE.Vector3(x,3.14,-1.4),new THREE.Vector3(x,3.14,-1.215),.009,metal);
  }
  for(let i=0;i<3;i++) {
    const torus=new THREE.Mesh(new THREE.TorusGeometry(.23+i*.022,.013,6,48),i===1?red:black);
    torus.position.set(3.5,2.97,-1.26+i*.014);lab.add(torus);
  }
  for(let i=0;i<3;i++) {
    const storage=box(.46,.24,.52,3.35,1.5+i*.25,-.76,ivory);
    box(.34,.16,.025,3.35,1.5+i*.25,-.48,sand);
    storage.name=`parts-drawer-${i}`;
  }
  for(let i=0;i<3;i++)box(.66,.08,.54,-3.08,1.4+i*.085,.65,[orange,paper,green][i]);
  // Two warm sources under the shelf, in addition to the task lamp.
  for(const x of [-1.9,1.9]) {
    const light=new THREE.PointLight('#ffd393',5.5,5,1.7);light.position.set(x,3.67,-.78);lab.add(light);
  }

  // A second physical workspace, not a route-specific replacement for the Home desk.
  const bay=new THREE.Group();bay.name='projects-bay';bay.position.x=8.5;lab.add(bay);
  const enamel=new THREE.MeshStandardMaterial({color:'#d8d6c8',roughness:.34,metalness:.18});
  const machined=new THREE.MeshStandardMaterial({color:'#8d968d',roughness:.3,metalness:.82});
  const paint=new THREE.MeshStandardMaterial({color:'#253731',roughness:.9});
  box(6.7,.16,5.3,0,-.1,0,darkWood,bay,false);
  box(6.4,4.4,.13,0,2.1,-1.55,paint,bay,false);
  box(6.2,.18,2.85,0,1.25,0,wood,bay).name='robotics-workbench';
  for(const x of [-2.65,2.65])for(const z of [-1.05,1.05])box(.11,1.17,.11,x,.58,z,metal,bay);
  box(5.4,.08,.08,0,.3,-1.05,metal,bay);
  box(6.2,.12,.65,0,3.95,-1.04,wood,bay);
  box(4.7,.035,.13,0,3.865,-1.1,metal,bay);
  box(4.6,.012,.085,0,3.842,-1.1,strip,bay);
  label('ROBOTICS STUDY',2.2,.32,.85,3.43,-1.465,'#b8b69a','#253731',bay);
  box(2.6,.026,1.72,1,1.355,.12,metal,bay);
  box(2.45,.008,1.57,1,1.373,.12,black,bay,false);

  const robot=new THREE.Group();robot.name='robotics-study-arm';robot.position.set(.55,1.38,-.26);bay.add(robot);
  function cylinder(radius:number,height:number,x:number,y:number,z:number,material:THREE.MeshStandardMaterial,parent:THREE.Object3D=robot) {
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,32),material);
    mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  cylinder(.37,.075,0,.0375,0,metal);
  cylinder(.30,.04,0,.095,0,machined);
  const turret=new THREE.Group();turret.name='robot-turret';turret.position.y=.115;robot.add(turret);
  cylinder(.265,.14,0,.07,0,enamel,turret);
  cylinder(.27,.018,0,.15,0,metal,turret);
  box(.31,.27,.30,0,.27,0,enamel,turret);
  const joints:THREE.Group[]=[];
  const lengths=[.95,1.16,.66], rest=[.50,-1.77,-1.42];
  let parent:THREE.Object3D=turret;
  // Local +Y links share real hinge pivots, so housings/cables follow each joint.
  for(let i=0;i<3;i++) {
    const joint=new THREE.Group();joint.name=['robot-shoulder','robot-elbow','robot-wrist'][i];
    joint.position.y=i===0?.42:lengths[i-1];parent.add(joint);joints.push(joint);
    const radius=[.20,.17,.135][i], length=lengths[i];
    const housing=cylinder(radius,.32,0,0,0,metal,joint);housing.rotation.x=Math.PI/2;
    for(const side of [-1,1]) {
      const bearing=cylinder(radius*.84,.025,0,0,side*.17,machined,joint);bearing.rotation.x=Math.PI/2;
    }
    const cap=cylinder(radius*.70,.032,0,0,.195,orange,joint);cap.rotation.x=Math.PI/2;
    const hub=cylinder(radius*.27,.038,0,0,.219,machined,joint);hub.rotation.x=Math.PI/2;
    const body=new THREE.Mesh(new THREE.CylinderGeometry(radius*.62,radius*.83,length-radius*1.55,24),enamel);
    body.position.y=length*.5;body.castShadow=true;body.receiveShadow=true;joint.add(body);
    cylinder(radius*.75+.004,.045,0,length*.5,0,machined,joint);
    cable([[0,.05,-.21],[-.07,.20,-.22],[-.09,length*.68,-.17],[0,length,-.19]],black,.022,joint);
    parent=joint;
  }
  const tool=new THREE.Group();tool.name='robot-tool';tool.position.y=lengths[2];parent.add(tool);
  const flange=cylinder(.115,.21,0,0,0,metal,tool);flange.rotation.x=Math.PI/2;
  const face=cylinder(.09,.025,0,0,.12,machined,tool);face.rotation.x=Math.PI/2;
  box(.30,.13,.24,0,-.16,0,enamel,tool);
  box(.26,.05,.27,0,-.225,0,metal,tool);
  const fingers:THREE.Group[]=[];
  for(const side of [-1,1]) {
    const finger=new THREE.Group();finger.name=side<0?'robot-finger-left':'robot-finger-right';tool.add(finger);fingers.push(finger);
    box(.045,.24,.13,0,-.35,0,machined,finger);
    box(.075,.055,.13,-side*.017,-.465,0,metal,finger);
    box(.014,.075,.12,-side*.048,-.43,0,black,finger);
  }
  const bolts=new THREE.InstancedMesh(new THREE.CylinderGeometry(.017,.017,.014,6),machined,8);
  bolts.name='robot-base-fasteners';bolts.castShadow=true;
  const boltMatrix=new THREE.Matrix4();let bolt=0;
  for(let i=0;i<8;i++) {
    const angle=i*Math.PI/4;boltMatrix.makeTranslation(Math.cos(angle)*.32,.081,Math.sin(angle)*.32);bolts.setMatrixAt(bolt++,boltMatrix);
  }
  robot.add(bolts);
  function animateRobot(seconds:number) {
    const pose=robotPose(seconds);turret.rotation.y=pose.yaw;
    joints[0].rotation.z=rest[0]+pose.shoulder;
    joints[1].rotation.z=rest[1]+pose.elbow;
    joints[2].rotation.z=rest[2]+pose.wrist;
    tool.rotation.z=-(joints[0].rotation.z+joints[1].rotation.z+joints[2].rotation.z);
    fingers.forEach((finger,i)=>{finger.position.x=(i===0?-1:1)*(.12+pose.grip);});
  }
  animateRobot(0);
  // A generic fixture and sample block; these are scene props, never published work.
  box(.7,.06,.64,1.5,1.407,.64,sand,bay);
  box(.19,.20,.19,1.5,1.537,.64,orange,bay);
  for(const x of [1.21,1.79])box(.065,.035,.065,x,1.4545,.64,metal,bay);

  const display=new THREE.Group();display.position.set(-1.9,2.11,-.72);display.rotation.y=.17;bay.add(display);
  box(1.4,.95,.1,0,0,0,black,display);
  box(.5,.04,.36,0,-.74,.03,metal,display);
  rod(new THREE.Vector3(0,-.72,-.04),new THREE.Vector3(0,-.43,-.02),.04,metal,display);
  const diagram=texture(768,512,ink=>{
    ink.fillStyle='#12231e';ink.fillRect(0,0,768,512);
    ink.fillStyle='#a7b79b';ink.font='24px sans-serif';ink.fillText('MOTION / FORM',42,55);
    ink.strokeStyle='#718c76';ink.lineWidth=5;ink.beginPath();ink.moveTo(200,410);ink.lineTo(200,330);ink.lineTo(150,180);ink.lineTo(410,130);ink.lineTo(500,265);ink.stroke();
    for(const [x,y] of [[200,330],[150,180],[410,130],[500,265]]){ink.fillStyle='#d0aa72';ink.beginPath();ink.arc(x,y,12,0,Math.PI*2);ink.fill();}
    ink.strokeStyle='#455f50';ink.lineWidth=2;ink.beginPath();ink.arc(360,310,190,Math.PI,Math.PI*1.8);ink.stroke();
  });
  const diagramScreen=new THREE.Mesh(new THREE.PlaneGeometry(1.27,.81),new THREE.MeshBasicMaterial({map:diagram,toneMapped:false}));
  diagramScreen.position.z=.054;display.add(diagramScreen);
  const terminalKeys=keyboard.clone();terminalKeys.name='robotics-keyboard';terminalKeys.scale.setScalar(.48);terminalKeys.position.set(-1.8,1.39,.43);terminalKeys.rotation.set(-.06,.10,0);bay.add(terminalKeys);
  for(const x of [-2.9,-2.3])for(const y of [1.46,1.71]) {
    box(.52,.24,.62,x,y,-.87,sand,bay);
    box(.46,.18,.018,x,y,-.55,enamel,bay);
    box(.13,.025,.032,x,y,-.526,metal,bay);
  }
  box(.94,.07,.62,-1.42,1.375,.96,paper,bay);
  const log=label('ROBOTICS / NOTES',.7,.2,-1.42,1.412,.96,'#65604b','#c4b492',bay);log.rotation.x=-Math.PI/2;
  const bayLight=new THREE.SpotLight('#ffe0a8',32,12,.67,.6,1.3);
  bayLight.position.set(-1.5,6,4);bayLight.target.position.set(.55,1.7,0);bayLight.castShadow=true;
  bayLight.shadow.mapSize.set(1024,1024);bayLight.shadow.normalBias=.02;bay.add(bayLight,bayLight.target);
  const shelfLight=new THREE.PointLight('#ffd393',4,5,1.7);shelfLight.position.set(0,3.7,-.9);bay.add(shelfLight);
  const {story,about,experience}=buildStoryCorners({...materials,wood,darkWood});lab.add(story);
  return { lab, keyboard, projects:bay, about, experience, robot, robotLight:bayLight, animateRobot, materials };
}
