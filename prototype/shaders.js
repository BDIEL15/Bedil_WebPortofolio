// Independently written starter shaders. Exact recovered shaders are in analysis/shaders/.
export const vertexShader = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
export const fragmentShader = /* glsl */`
precision highp float;
varying vec2 vUv;
uniform vec2 uLens;
uniform float uStrength, uBrightness, uSource, uForeground;
float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p) {
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.0),f.x),f.y);
}
vec3 galaxy(vec2 p) {
  // Procedural two-arm spiral; coordinates in Einstein-radius units.
  p=mat2(cos(.35),-sin(.35),sin(.35),cos(.35))*p;
  p.y*=2.0;
  float r=length(p), a=atan(p.y,p.x);
  float arm=pow(.5+.5*cos(2.0*(a-2.1*log(max(r,.003)/.025))),6.0);
  float grain=.5+noise(p*190.0);
  vec3 disk=vec3(.46,.67,1.)*(arm*.9*grain+ .12)*exp(-r*7.0);
  vec3 core=vec3(1.,.94,.8)*exp(-r*r*2500.0);
  return disk+core;
}
void main() {
  vec2 theta=(vUv*2.0-1.0)*vec2(3.412903,2.3);
  vec2 d=theta-uLens;
  // Inverse ray mapping for a normalized, softened point-mass thin lens.
  vec2 beta=theta-uStrength*d/max(dot(d,d),1e-5);
  vec3 color=galaxy(beta)*uSource;
  float r=length(d);
  color+=uForeground*vec3(1.,.58,.28)*(.48*exp(-4.2*r)+.18*exp(-1.6*r));
  color+=uForeground*vec3(1.,.9,.7)*exp(-260.0*r*r);
  vec2 cell=floor(beta*3.0), local=fract(beta*3.0)-.5;
  color+=vec3(.4,.5,.7)*step(.94,hash(cell))*exp(-dot(local,local)*1800.0)*uSource;
  float vignette=1.0-.35*dot(vUv*2.0-1.0,vUv*2.0-1.0);
  gl_FragColor=vec4(vec3(.008)+color*uBrightness*vignette,.96);
}`;
export const gridVertex = /* glsl */`
uniform vec2 uLens; uniform float uDepth; varying float vAlpha;
void main(){
  vec3 p=position; vec2 d=p.xz-uLens;
  float well=uDepth/(1.0+dot(d,d)/1.6); p.y-=well;
  vAlpha=(1.0-smoothstep(9.0,15.0,abs(p.x)))*smoothstep(-18.0,-12.0,p.z)*(1.0-smoothstep(7.0,12.0,p.z));
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
}`;
export const gridFragment = /* glsl */`
varying float vAlpha;
void main(){gl_FragColor=vec4(vec3(.914,.886,.827),.15*vAlpha);}`;
