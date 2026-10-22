import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('analysis/client');
const source = fs.readFileSync(path.join(root, '_next/static/chunks/app/layout-113c514e53b9114b.js'), 'utf8');
fs.mkdirSync('analysis/shaders', {recursive:true});
const shaders = [...source.matchAll(/(vertexShader|fragmentShader):("(?:\\.|[^"\\])*")/g)].map((m,i)=>{
  const name = `${String(i).padStart(2,'0')}-${m[1]}.glsl`;
  fs.writeFileSync('analysis/shaders/'+name, JSON.parse(m[2]));
  return {name, offset:m.index, length:m[0].length};
});
fs.writeFileSync('analysis/shaders/index.json',JSON.stringify(shaders,null,2));
console.log(JSON.stringify(shaders));
for(const name of fs.readdirSync(path.join(root,'_next/static/chunks'))){
  if(!name.endsWith('.js'))continue;
  const text=fs.readFileSync(path.join(root,'_next/static/chunks',name),'utf8');
  for(const m of text.matchAll(/.{0,80}(?:REVISION|__THREE__|Three\.js|revision:|revision=).{0,100}/g))console.log(name,m.index,m[0]);
}
const bundle=JSON.parse(fs.readFileSync('analysis/rea-evidence.json','utf8'));
console.log('Evidence top-level keys',Object.keys(bundle));
function walk(o){
  if(!o||typeof o!=='object')return;
  if(o.screenshot?.value?.data_base64){fs.writeFileSync('analysis/reference-desktop.png',Buffer.from(o.screenshot.value.data_base64,'base64'));}
  for(const v of Object.values(o))if(v&&typeof v==='object')walk(v);
}
walk(bundle);
