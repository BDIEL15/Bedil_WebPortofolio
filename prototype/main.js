import {createLensing} from './lensing.js';
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const defaults=()=>({source:true,foreground:true,earth:true,panel:true,brightness:1,time:.485,playing:!reducedMotion.matches});
const state=defaults();
const $=s=>document.querySelector(s);
const play=$('#play');
function updatePlay(){play.textContent=state.playing?'pause':'play';play.setAttribute('aria-pressed',String(state.playing));}
updatePlay();
for(const input of document.querySelectorAll('input[type=checkbox]'))input.addEventListener('change',()=>state[input.name]=input.checked);
$('#brightness').addEventListener('input',e=>{state.brightness=Number(e.target.value);$('#brightness-value').value=state.brightness.toFixed(2);});
$('#time').addEventListener('input',e=>{state.time=Number(e.target.value);state.playing=false;updatePlay();$('#time-value').value=`${(state.time*100).toFixed(1)}%`;});
play.addEventListener('click',()=>{state.playing=!state.playing;updatePlay();});
$('#reset').addEventListener('click',()=>{Object.assign(state,defaults());for(const input of document.querySelectorAll('input[type=checkbox]'))input.checked=true;$('#brightness').value=1;$('#brightness-value').value='1.00';$('#time').value=state.time;updatePlay();});
const show=hidden=>{document.documentElement.toggleAttribute('data-text-hidden',hidden);$('#hide-text').setAttribute('aria-pressed',String(hidden));$('#restore-text').hidden=!hidden;(hidden?$('#restore-text'):$('#hide-text')).focus();};
$('#hide-text').addEventListener('click',()=>show(true));$('#restore-text').addEventListener('click',()=>show(false));
const copy={
  about:{title:'a small universe',paragraphs:['A portfolio concept for people who like building things, asking questions, and looking a little closer.','Behind these words, a blue galaxy sends its light past a closer, heavier galaxy. Gravity bends the path. From Earth, a single source becomes a pair of images, then a ring.','Drag the space around the text to change your viewpoint. Open the controls to move the foreground galaxy through alignment and watch the light curve rise.']},
  projects:{title:'things to build',paragraphs:['This starter keeps one scene across its sample sections. The reference switches to a robotics scene on its projects route.','Start with a point lens, a procedural spiral, and a moving foreground mass. Add your own projects here as you develop the concept.','The observer panel and the curved rays use the same normalized lens position, so the diagram and image move together.']},
  writing:{title:'notes on light',paragraphs:['The renderer traces each image-plane pixel backward into the source plane. This avoids tracing millions of individual light particles.','The equation is β = θ − (θ − θL) / |θ − θL|² in Einstein-radius units. Surface brightness is sampled from a procedural galaxy at β.','The light curve uses the analytic magnification of a point source. It illustrates alignment; it does not integrate the full extended spiral image.']},
  cabinet:{title:'a curious cabinet',paragraphs:['Keep your experiments here: a shader study, a simulation, a small thing that made you stop and look.','Try pausing at 50% time. The two galaxies almost align, producing arcs around the foreground galaxy.','The reference has an IceCube detector scene on this route. That scene is outside this lensing MVP.']}
};
function route(){const key=location.hash.slice(1)||'about',entry=copy[key]||copy.about;$('#heading').textContent=entry.title;$('#content').replaceChildren(...entry.paragraphs.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));for(const a of document.querySelectorAll('nav a')){if(a.hash===`#${copy[key]?key:'about'}`)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}}
window.addEventListener('hashchange',route);route();
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){state.playing=false;updatePlay();}});
try{
  const dispose=createLensing($('#universe'),state,$('#curve'),(p,mag)=>{if(document.activeElement!==$('#time'))$('#time').value=p;$('#time-value').value=`${(p*100).toFixed(1)}%`;$('#magnification').value=`${mag.toFixed(2)}×`;});
  window.addEventListener('pagehide',dispose,{once:true});
}catch(error){$('#fallback').hidden=false;console.error(error);}
