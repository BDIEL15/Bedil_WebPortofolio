import * as THREE from 'three';
import {vertexShader,fragmentShader,gridVertex,gridFragment} from './shaders.js';

export const lensX=p=>{const q=2*p-1;return 7.5*(.3*q+.7*q*q*q);};
export const magnification=u=>(u*u+2)/(u*Math.sqrt(u*u+4));
const smooth=(a,b,t)=>THREE.MathUtils.smoothstep(t,a,b);

export function createLensing(host,state,chart,onProgress=()=>{}) {
  const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor('#0c0b0a'); host.prepend(renderer.domElement);
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(32,1,.1,400);
  const target=new THREE.Vector3(-.6,.7,-2), home=new THREE.Vector3(7.5,6.8,15);
  const sphere=new THREE.Spherical().setFromVector3(home.clone().sub(target));
  const orbit={x:0,y:0,tx:0,ty:0};
  const resources=new Set();
  const keep=x=>(resources.add(x),x);
  const glowTexture=(()=>{
    const c=document.createElement('canvas');c.width=c.height=128;
    const ctx=c.getContext('2d'),g=ctx.createRadialGradient(64,64,0,64,64,64);
    g.addColorStop(0,'#fff');g.addColorStop(.12,'#ffffffb3');g.addColorStop(.4,'#ffffff1f');g.addColorStop(1,'#ffffff00');
    ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return keep(new THREE.CanvasTexture(c));
  })();
  const glow=(color,size,opacity=1)=>{
    const s=new THREE.Sprite(keep(new THREE.SpriteMaterial({map:glowTexture,color,opacity,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false})));
    s.scale.setScalar(size);return s;
  };
  const gridPoints=[];
  for(let x=-15;x<=15;x++)for(let z=-18;z<12;z+=.2)gridPoints.push(x,0,z,x,0,z+.2);
  for(let z=-18;z<=12;z++)for(let x=-15;x<15;x+=.2)gridPoints.push(x,0,z,x+.2,0,z);
  const gridMaterial=keep(new THREE.ShaderMaterial({uniforms:{uLens:{value:new THREE.Vector2()},uDepth:{value:1.5}},vertexShader:gridVertex,fragmentShader:gridFragment,transparent:true,depthWrite:false}));
  const grid=new THREE.LineSegments(keep(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(gridPoints,3))),gridMaterial);scene.add(grid);
  const stars=[];let seed=25;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<1400;i++)stars.push((random()-.5)*100,random()*55-10,(random()-.5)*100);
  scene.add(new THREE.Points(keep(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(stars,3))),keep(new THREE.PointsMaterial({color:'#e9e2d3',size:.018,opacity:.45,transparent:true,depthWrite:false}))));
  const source=new THREE.Group();source.position.set(0,2.6,-10);source.add(glow('#9cc0ff',1.6,.4));
  // Spiral sprite generated locally; no remote galaxy image is required.
  const spiralCanvas=document.createElement('canvas');spiralCanvas.width=spiralCanvas.height=256;
  const ctx=spiralCanvas.getContext('2d');ctx.translate(128,128);ctx.rotate(-.35);ctx.scale(1,.5);
  for(let arm=0;arm<2;arm++)for(let i=0;i<800;i++){
    const f=random(),r=8+108*f,a=arm*Math.PI+2.1*Math.log(r/8)+(random()-.5)*.5;
    ctx.fillStyle=`rgba(190,215,255,${.5*(1-f)+.1})`;ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,1+random()*1.5,0,Math.PI*2);ctx.fill();
  }
  const spiral=new THREE.Sprite(keep(new THREE.SpriteMaterial({map:keep(new THREE.CanvasTexture(spiralCanvas)),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false})));spiral.scale.setScalar(1.7);source.add(spiral,glow('#fff1dc',.25));scene.add(source);
  const lens=new THREE.Group();lens.add(glow('#f0a860',3.2,.55),glow('#f0a860',1.6,.85),glow('#fff1dc',.45));scene.add(lens);
  const earth=new THREE.Group();earth.position.set(0,2.6,6);earth.add(glow('#7fb2ff',1.15,.35));
  // Original uses earth_small.glb. This prototype uses an original procedural sphere.
  const globe=new THREE.Mesh(keep(new THREE.SphereGeometry(.36,32,24)),keep(new THREE.MeshStandardMaterial({color:'#75a6bd',roughness:.85,metalness:.05})));
  globe.rotation.z=.41;earth.add(globe);scene.add(earth,new THREE.AmbientLight('#ffffff',.5));
  const sun=new THREE.DirectionalLight('#fff4e6',2.4);sun.position.set(2,4,10);scene.add(sun);
  const uniforms={uLens:{value:new THREE.Vector2()},uStrength:{value:1},uBrightness:{value:1},uSource:{value:1},uForeground:{value:1}};
  const panel=new THREE.Mesh(keep(new THREE.PlaneGeometry(4.6,3.1)),keep(new THREE.ShaderMaterial({uniforms,vertexShader,fragmentShader,transparent:true,depthWrite:false})));
  panel.position.set(4.6,3,-11);panel.lookAt(home);scene.add(panel);
  const border=new THREE.LineLoop(keep(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.3,-1.55,0),new THREE.Vector3(2.3,-1.55,0),new THREE.Vector3(2.3,1.55,0),new THREE.Vector3(-2.3,1.55,0)])),keep(new THREE.LineBasicMaterial({color:'#e9e2d3',transparent:true,opacity:.35})));panel.add(border);
  const makeRay=()=>{
    const geometry=keep(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array(96*3),3)));
    const line=new THREE.Line(geometry,keep(new THREE.LineBasicMaterial({color:'#d98b5f',transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false})));line.frustumCulled=false;scene.add(line);return line;
  };
  const rays=[makeRay(),makeRay()];
  const ray=(line,bend)=>{
    const from=source.position,to=earth.position,attr=line.geometry.attributes.position;
    const pre=from.clone().lerp(bend,.88),post=bend.clone().lerp(to,.12);
    for(let i=0;i<96;i++){
      const t=i/95,p=new THREE.Vector3();
      if(t<.4)p.copy(from).lerp(pre,t/.4);
      else if(t<.6){const q=(t-.4)/.2;p.copy(pre).multiplyScalar((1-q)**2).addScaledVector(bend,2*q*(1-q)).addScaledVector(post,q*q);}
      else p.copy(post).lerp(to,(t-.6)/.4);
      attr.setXYZ(i,p.x,p.y,p.z);
    }attr.needsUpdate=true;
  };
  const labels={source:source.position.clone(),foreground:new THREE.Vector3(),earth:earth.position.clone(),panel:new THREE.Vector3(2.3,1.55,0)};
  const labelNodes=Object.fromEntries(Object.keys(labels).map(key=>[key,host.querySelector(`[data-label="${key}"]`)]));
  let width=1,height=1,fitDistance=1,drag=null,raf=0,last=0,lastUI=0,disposed=false,lastSignature='';
  const resize=()=>{
    width=Math.max(host.clientWidth,1);height=Math.max(host.clientHeight,1);renderer.setSize(width,height,false);camera.aspect=width/height;
    // Reference's camera fitter: preserve a 2:1 composition, cap FOV at 50°,
    // then move the camera back to fit narrow screens.
    const tangent=2/camera.aspect*Math.tan(THREE.MathUtils.degToRad(16)),cap=Math.tan(THREE.MathUtils.degToRad(25));
    camera.fov=camera.aspect>=2?32:THREE.MathUtils.radToDeg(2*Math.atan(Math.min(tangent,cap)));
    fitDistance=camera.aspect>=2?1:Math.max(1,tangent/cap);
    camera.aspect<1?camera.setViewOffset(width,height,.12*width,0,width,height):camera.clearViewOffset();camera.updateProjectionMatrix();
  };
  const ro=new ResizeObserver(resize);ro.observe(host);resize();
  const down=e=>{if(e.button!==0||e.target.closest('a,button,input,label,summary,details,[data-no-orbit]'))return;drag=[e.clientX,e.clientY];document.documentElement.dataset.orbiting='';};
  const move=e=>{if(!drag)return;orbit.tx=THREE.MathUtils.clamp(orbit.tx-(e.clientX-drag[0])*.005,-.7,.7);orbit.ty=THREE.MathUtils.clamp(orbit.ty-(e.clientY-drag[1])*.004,.3-sphere.phi,1.42-sphere.phi);drag=[e.clientX,e.clientY];};
  const up=()=>{drag=null;delete document.documentElement.dataset.orbiting;};
  const reset=e=>{if(!e.target.closest('[data-no-orbit],button,input,a'))orbit.tx=orbit.ty=0;};
  window.addEventListener('pointerdown',down);window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);window.addEventListener('dblclick',reset);
  const context=chart.getContext('2d');
  const curve=Array.from({length:401},(_,i)=>magnification(Math.hypot(lensX(i/400),.105)/.7)),peak=Math.max(...curve);
  function drawChart(p){
    const dpr=Math.min(devicePixelRatio,2),w=156,h=72;
    if(chart.width!==w*dpr){chart.width=w*dpr;chart.height=h*dpr;}
    context.setTransform(dpr,0,0,dpr,0,0);context.clearRect(0,0,w,h);
    context.strokeStyle='#e9e2d333';context.lineWidth=1;context.beginPath();context.moveTo(.5,0);context.lineTo(.5,h-.5);context.lineTo(w,h-.5);context.stroke();
      const trace=(limit,color)=>{context.strokeStyle=color;context.beginPath();for(let i=0;i<=limit;i++){const x=1+i/400*(w-2),y=3+(h-6)*(1-((state.foreground?curve[i]:1)-1)/(peak-1));i?context.lineTo(x,y):context.moveTo(x,y);}context.stroke();};
    trace(400,'#e9e2d329');trace(Math.round(p*400),'#d98b5f');
  }
  function render(now){
    if(disposed)return;raf=requestAnimationFrame(render);
    const dt=last?Math.min((now-last)/1000,.1):0;last=now;
    if(state.playing&&!document.hidden)state.time=(state.time+dt/24)%1;
    const textHidden=document.documentElement.hasAttribute('data-text-hidden');
    const signature=JSON.stringify(state)+width+','+height+','+orbit.tx+','+orbit.ty+','+textHidden;
    if(!state.playing&&signature===lastSignature&&Math.abs(orbit.x-orbit.tx)<1e-5&&Math.abs(orbit.y-orbit.ty)<1e-5)return;
    lastSignature=signature;
    const p=state.time,x=lensX(p),fade=smooth(0,.06,p)*(1-smooth(.94,1,p));
    const active=state.foreground?fade:0;
    lens.position.set(x,2.705,-1.5);lens.visible=state.foreground;lens.children.forEach((s,i)=>s.material.opacity=[.55,.85,1][i]*fade*state.brightness);
    source.visible=state.source;earth.visible=state.earth;panel.visible=state.panel;
    uniforms.uLens.value.set(x/.7,.15);uniforms.uStrength.value=active;uniforms.uBrightness.value=state.brightness;uniforms.uSource.value=Number(state.source);uniforms.uForeground.value=active;
    gridMaterial.uniforms.uLens.value.set(x,-1.5);gridMaterial.uniforms.uDepth.value=1.5*active;
    const separation=Math.hypot(x,.105),u=separation/.7,root=Math.sqrt(u*u+4);
    rays.forEach((line,i)=>{
      const image=.7*(u+(i?1:-1)*root)/2;
      ray(line,new THREE.Vector3(x/separation*image,2.6+.105/separation*image,-1.5));
      line.visible=state.source&&state.earth&&state.foreground;line.material.opacity=(i?.8:.45)*fade;
    });
    globe.rotation.y=state.time*24*.15;
    orbit.x+=(orbit.tx-orbit.x)*.12;orbit.y+=(orbit.ty-orbit.y)*.12;
    camera.position.setFromSpherical(new THREE.Spherical(sphere.radius*fitDistance,sphere.phi+orbit.y,sphere.theta+orbit.x)).add(target);camera.lookAt(target);
    renderer.render(scene,camera);
    labels.foreground.set(x,-1.5*active,-1.5);
    const protectedRects=textHidden?[]:[...document.querySelectorAll('main [data-no-orbit]')].map(el=>el.getBoundingClientRect());
    for(const [key,pos]of Object.entries(labels)){
      const el=labelNodes[key];if(!el)continue;
      const screen=(key==='panel'?panel.localToWorld(pos.clone()):pos.clone()).project(camera);
      const px=THREE.MathUtils.clamp((screen.x*.5+.5)*width,el.offsetWidth/2+10,width-el.offsetWidth/2-10),py=(-screen.y*.5+.5)*height;
      el.style.transform=`translate(${px}px,${py}px) translate(-50%,8px)`;
      const overlaps=protectedRects.some(r=>px+el.offsetWidth/2>r.left&&px-el.offsetWidth/2<r.right&&py+el.offsetHeight+8>r.top&&py+8<r.bottom);
      el.style.opacity=screen.z<1&&({source:state.source,foreground:state.foreground,earth:state.earth,panel:state.panel}[key])?(overlaps?'.1':'1'):'0';
    }
    drawChart(p);if(now-lastUI>100||!state.playing){onProgress(p,state.foreground?magnification(u):1);lastUI=now;}
  }raf=requestAnimationFrame(render);
  return ()=>{disposed=true;cancelAnimationFrame(raf);ro.disconnect();up();window.removeEventListener('pointerdown',down);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);window.removeEventListener('dblclick',reset);resources.forEach(r=>r.dispose());renderer.dispose();renderer.domElement.remove();};
}
