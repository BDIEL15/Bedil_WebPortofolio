import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { robotPose } from './robot-motion';
import { buildStoryCorners, type ExperienceBadge } from './story-corners';
import { buildLabDetails } from './lab-details';
import {codingFrame,paintWorkspace,workspaceSize} from './workspace-screen';

/** Original, illustrative geometry. Reference photographs are never loaded as assets. */
export function buildPersonalLab(experiences:readonly ExperienceBadge[]=[]) {
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
  const materials = { metal, ivory, sand, black, copper, orange, green, paper };

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
  const pegMap = texture(1536,640,ink=>{
    ink.fillStyle='#393c33'; ink.fillRect(0,0,1536,640);
    for(let y=16;y<640;y+=30) for(let x=16;x<1536;x+=30) {
      ink.fillStyle='#252b25'; ink.beginPath();ink.arc(x,y,3,0,Math.PI*2);ink.fill();
      ink.strokeStyle='#55584b';ink.lineWidth=1;ink.beginPath();ink.arc(x,y+.6,3,0,Math.PI);ink.stroke();
    }
  });
  const pegboard = new THREE.MeshStandardMaterial({map:pegMap,roughness:.94});
  // One physical workbench; every route looks at objects on this surface.
  box(8.4,4.84,.13,0,2.23,-1.55,darkWood,lab,false);
  box(8.1,3.4,.06,0,2.75,-1.43,pegboard,lab,false);
  box(8.2,.18,2.85,0,1.25,0,wood).name='main-workbench';
  box(8.2,.06,.06,0,1.27,1.45,darkWood);
  for(const x of [-3.75,3.75])for(const z of [-1.05,1.05])box(.10,1.35,.10,x,.495,z,metal);
  box(7.5,.08,.08,0,.25,-1.05,metal);
  box(8.2,.12,.62,0,3.55,-1.08,wood).name='main-shelf';
  for(const x of [-3.75,3.75]) {
    box(.05,.65,.05,x,3.18,-1.47,metal);
    box(.05,.05,.48,x,3.47,-1.10,metal);
  }
  const strip=new THREE.MeshStandardMaterial({color:'#ffe2a0',emissive:'#ffb959',emissiveIntensity:2.2,roughness:1});
  box(4.8,.035,.12,0,3.465,-1.1,metal);
  box(4.7,.012,.08,0,3.442,-1.1,strip);
  for(let i=0;i<4;i++) {
    const book=new THREE.Group(),height=.43+(i%3)*.08;
    book.position.set(-2.62+i*.15,3.61+height/2,-1.08);lab.add(book);
    const cover=[green,orange,sand,black][i%4];
    box(.085,height-.025,.30,0,0,0,paper,book);
    for(const side of [-1,1])box(.012,height,.34,side*.05,0,0,cover,book);
    box(.11,height,.018,0,0,.16,cover,book);
    box(.075,.012,.004,0,height*.27,.173,paper,book,false);
  }
  // One shelf instrument; screens are an illustrative study, not live measurements.
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
  instrument(2.3,3.88,-1.02,.65);
  // Monitor and stand on the left, with a quiet original screen graphic.
  const monitor=new THREE.Group();monitor.name='desk-monitor';monitor.position.set(-1.65,2.065,-.75);monitor.rotation.y=.15;lab.add(monitor);
  const monitorBezel=black.clone();monitorBezel.emissive.set('#c9dab1');monitorBezel.emissiveIntensity=0;
  box(1.75,1.06,.11,0,0,0,monitorBezel,monitor).name='monitor-bezel';
  function setUnlockGlow(strength:number){monitorBezel.emissiveIntensity=Math.max(0,Math.min(.3,strength));}
  box(1.65,.96,.08,0,0,-.075,metal,monitor);
  rod(new THREE.Vector3(0,-.69,-.1),new THREE.Vector3(0,-.47,-.03),.045,metal,monitor);
  box(.58,.035,.36,0,-.70,.02,metal,monitor).name='monitor-base';
  const monitorMap=texture(workspaceSize.width,workspaceSize.height,ink=>paintWorkspace(ink,'code'));
  const monitorInk=(monitorMap.image as HTMLCanvasElement).getContext('2d')!;
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(1.6,.9),new THREE.MeshBasicMaterial({map:monitorMap,toneMapped:false}));
  screen.name='workspace-screen';screen.position.z=.062;monitor.add(screen);
  let bootMode=false,bootAspect=16/9,lastScreen='';
  function setBootMode(value:boolean,aspect=16/9){bootMode=value;bootAspect=aspect;lastScreen='';animateMonitor(0);}
  function animateMonitor(seconds:number) {
    const frame=codingFrame(seconds),signature=bootMode?'boot':frame.text+frame.cursor;
    if(signature!==lastScreen){paintWorkspace(monitorInk,bootMode?'boot':'code',seconds,3,bootAspect);monitorMap.needsUpdate=true;lastScreen=signature;}
    animateKeyboard(bootMode?0:seconds,bootMode);
  }
  box(.018,.008,.004,.71,-.49,.058,green,monitor,false);
  // An articulated task lamp, with a real warm light aimed at the work surface.
  const lamp=new THREE.Group();lamp.position.set(-3.60,1.385,.18);lab.add(lamp);
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
  const mat=box(2.4,.018,1.58,0,1.354,.35,new THREE.MeshStandardMaterial({map:matMap,roughness:1}),lab,false);
  mat.name='cutting-mat';
  const keyboard=new THREE.Group();keyboard.name='mechanical-keyboard';keyboard.position.set(0,1.44,.68);keyboard.rotation.set(-.06,0,0);lab.add(keyboard);
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
  const matrix=new THREE.Matrix4(),restKeys:THREE.Matrix4[]=[],keyIndices=new Map<string,number>();let key=0;
  const legends=texture(1536,576,ink=>{
    ink.clearRect(0,0,1536,576);ink.fillStyle='#49473c';ink.textAlign='center';ink.textBaseline='middle';
    rows.forEach((row,rowIndex)=>{
      let left=-.8925;
      for(const [text,units] of row) {
        const width=units*.119-.011,x=left+units*.119/2,z=-.256+rowIndex*.128;
        matrix.makeScale(width/.108,1,1);matrix.setPosition(x,.0715,z);keys.setMatrixAt(key,matrix);
        restKeys.push(matrix.clone());keyIndices.set(text,key);
        keys.setColorAt(key,new THREE.Color(key===0?'#bb713e':units>1&&text?'#aaa38e':'#e6dec7'));
        ink.font=text.length>1?'17px sans-serif':'24px sans-serif';
        ink.fillText(text,(x/1.785+.5)*1536,(z/.64+.5)*576-8);
        left+=units*.119;key++;
      }
    });
  });
  keys.instanceMatrix.needsUpdate=true;
  keys.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  let previousKey:number|undefined;
  function animateKeyboard(seconds:number,rest=false){
    const frame=codingFrame(seconds),active=rest||frame.press===0?undefined:keyIndices.get(frame.key??'__none');
    if(previousKey!==undefined)keys.setMatrixAt(previousKey,restKeys[previousKey]);
    if(active!==undefined){matrix.copy(restKeys[active]);matrix.elements[13]-=.012*frame.press;keys.setMatrixAt(active,matrix);}
    if(previousKey!==undefined||active!==undefined)keys.instanceMatrix.needsUpdate=true;
    previousKey=active;
  }
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
  // Small working clusters enrich the desk without filling the pegboard reading area.
  const details=new THREE.Group();details.name='workbench-details';lab.add(details);
  const mouse=new THREE.Group();mouse.name='desk-mouse';mouse.position.set(1.20,1.34,1.02);details.add(mouse);
  box(.34,.014,.58,0,.007,0,green,mouse);
  const mouseShell=new THREE.Mesh(new THREE.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI/2),ivory);
  mouseShell.scale.set(.13,.13,.23);mouseShell.position.y=.018;mouseShell.castShadow=true;mouse.add(mouseShell);
  box(.008,.007,.14,0,.144,-.06,black,mouse,false);
  const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.028,.028,.045,16),metal);
  wheel.rotation.z=Math.PI/2;wheel.position.set(0,.139,-.10);mouse.add(wheel);
  const circuit=new THREE.Group();circuit.name='circuit-study';circuit.position.set(-.12,1.34,-.94);circuit.rotation.y=-.12;details.add(circuit);
  for(const x of [-.31,.31])for(const z of [-.19,.19])box(.04,.035,.04,x,.018,z,metal,circuit,false);
  box(.73,.025,.48,0,.048,0,green,circuit);
  box(.21,.065,.23,0,.093,0,black,circuit);
  for(const side of [-1,1])for(let i=0;i<7;i++)box(.045,.018,.014,side*.125,.085,-.09+i*.03,copper,circuit,false);
  box(.12,.065,.11,-.27,.092,0,metal,circuit);
  for(const x of [.22,.28])box(.024,.055,.30,x,.088,0,black,circuit,false);
  cable([[-.27,.105,.17],[-.18,.19,.21],[.12,.19,.18],[.22,.12,.12]],orange,.009,circuit);
  const tools=new THREE.Group();tools.name='bench-tool-cup';tools.position.set(-3.02,1.34,.80);details.add(tools);
  const cup=new THREE.Mesh(new THREE.CylinderGeometry(.14,.12,.25,24,1,true),metal);
  cup.material=metal.clone();cup.material.side=THREE.DoubleSide;cup.position.y=.125;cup.castShadow=true;tools.add(cup);
  const cupBottom=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.012,24),metal);cupBottom.position.y=.006;tools.add(cupBottom);
  for(const [i,x] of [-.07,.02,.07].entries()) {
    rod(new THREE.Vector3(x,.04,0),new THREE.Vector3(x+(i-1)*.025,.43+i*.035,.02),.012,metal,tools);
    rod(new THREE.Vector3(x+(i-1)*.025,.32+i*.035,.02),new THREE.Vector3(x+(i-1)*.035,.53+i*.035,.025),.032,i===1?orange:black,tools);
  }
  const tray=new THREE.Group();tray.name='parts-tray';tray.position.set(2.94,1.34,.97);details.add(tray);
  box(.48,.025,.55,0,.013,0,sand,tray);
  for(const x of [-.225,0,.225])box(.025,.065,.55,x,.045,0,sand,tray);
  for(const z of [-.26,.26])box(.48,.065,.025,0,.045,z,sand,tray);
  for(let i=0;i<4;i++)box(.075,.045,.065,i<2?-.11:.11,.045,(i%2)*.17-.10,i<2?black:copper,tray);
  const {details:extraDetails}=buildLabDetails({...materials,wood,darkWood});lab.add(extraDetails);
  const shelfFill=new THREE.PointLight('#ffd393',4,4.5,1.7);shelfFill.position.set(0,3.35,-.8);lab.add(shelfFill);

  // Robot and fixture are a compact group on the same tabletop.
  const bay=new THREE.Group();bay.name='robotics-tools';bay.position.set(1.95,1.34,-.05);bay.scale.setScalar(.7);lab.add(bay);
  const enamel=new THREE.MeshStandardMaterial({color:'#d8d6c8',roughness:.34,metalness:.18});
  const machined=new THREE.MeshStandardMaterial({color:'#8d968d',roughness:.3,metalness:.82});
  box(2.1,.045,1.30,0,.0225,.15,metal,bay);
  const robot=new THREE.Group();robot.name='robotics-study-arm';robot.position.set(0,.055,0);bay.add(robot);
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
  // Illustrative fixture only; the animation does not claim to pick up the sample.
  box(.52,.05,.47,.88,.07,.56,sand,bay);
  box(.14,.15,.14,.88,.17,.56,orange,bay);
  for(const x of [.66,1.10])box(.04,.025,.04,x,.11,.56,metal,bay);
  const bayLight=new THREE.SpotLight('#ffe0a8',14,8,.65,.65,1.3);
  bayLight.position.set(-1.5,5,3);bayLight.target.position.set(0,1.3,0);bay.add(bayLight,bayLight.target);
  const {story,about,experience,animateWriting,photoSlots}=buildStoryCorners({...materials,wood,darkWood},experiences);lab.add(story);
  animateMonitor(0);
  return { lab, keyboard, projects:bay, about, experience, robot, robotLight:bayLight, animateRobot, animateMonitor, setBootMode,setUnlockGlow, animateWriting, photoSlots, materials };
}
