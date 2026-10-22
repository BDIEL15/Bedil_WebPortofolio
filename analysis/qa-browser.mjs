import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {Browser} from 'file:///C:/Users/abdie/.codex/skills/taste-skill/scripts/lib/cdp.mjs';
const browser=await Browser.launch();const results=[];
try{
  for(const [width,height] of [[1440,900],[768,1024],[390,844]]){
    const page=await browser.newPage({width,height,reducedMotion:true});
    const errors=[];browser.on(page.sessionId,'Runtime.consoleAPICalled',p=>{if(p.type==='error')errors.push(p.args.map(a=>a.value||a.description).join(' '));});
    await page.goto('http://127.0.0.1:4173/',{settleMs:1000});
    const initial=await page.eval(()=>({canvas:!!document.querySelector('#universe canvas'),fallback:!document.querySelector('#fallback').hidden,overflow:document.documentElement.scrollWidth>innerWidth,paused:document.querySelector('#play').textContent==='play'}));
    assert(initial.canvas&&!initial.fallback&&!initial.overflow&&initial.paused,JSON.stringify(initial));
    const screenshot=()=>page.screenshot({format:'png',clip:{x:0,y:0,width,height:Math.min(height,450)}});
    const before=createHash('sha256').update(await screenshot()).digest('hex');
    await page.eval(()=>{document.querySelector('#controls').open=true;const el=document.querySelector('#time');el.value='.2';el.dispatchEvent(new Event('input',{bubbles:true}));});
    await new Promise(r=>setTimeout(r,250));
    assert.equal(await page.eval(()=>document.querySelector('#time-value').value),'20.0%');
    const after=createHash('sha256').update(await screenshot()).digest('hex');assert.notEqual(before,after);
    await page.eval(()=>{const el=document.querySelector('#brightness');el.value='1.7';el.dispatchEvent(new Event('input',{bubbles:true}));});
    assert.equal(await page.eval(()=>document.querySelector('#brightness-value').value),'1.70');
    for(const name of ['source','foreground','earth','panel']){
      await page.eval(name=>document.querySelector(`input[name="${name}"]`).click(),name);
      await new Promise(r=>setTimeout(r,80));
      const key={source:'source',foreground:'foreground',earth:'earth',panel:'panel'}[name];
      assert.equal(await page.eval(key=>document.querySelector(`[data-label="${key}"]`).style.opacity,key),'0');
      await page.eval(name=>document.querySelector(`input[name="${name}"]`).click(),name);
    }
    await page.eval(()=>document.querySelector('#hide-text').click());assert(await page.eval(()=>document.documentElement.hasAttribute('data-text-hidden')));
    await page.eval(()=>document.querySelector('#restore-text').click());assert(!(await page.eval(()=>document.documentElement.hasAttribute('data-text-hidden'))));
    for(const route of ['projects','writing','cabinet','about']){await page.eval(route=>document.querySelector(`nav a[href="#${route}"]`).click(),route);await new Promise(r=>setTimeout(r,60));assert.equal(await page.eval(()=>document.querySelector('nav [aria-current]').hash),'#'+route);}
    await page.eval(()=>document.querySelector('#play').click());const t=await page.eval(()=>+document.querySelector('#time').value);await new Promise(r=>setTimeout(r,400));assert((await page.eval(()=>+document.querySelector('#time').value))>t);
    await page.eval(()=>document.querySelector('#reset').click());assert.equal(await page.eval(()=>document.querySelector('#brightness').value),'1');
    await page.eval(()=>{document.querySelector('#controls').open=false;document.activeElement.blur();});
    await page.screenshot({path:`analysis/qa/verified-${width}.png`,format:'png'});
    await page.eval(()=>document.querySelector('#controls').open=true);
    await page.screenshot({path:`analysis/qa/controls-${width}.png`,format:'png'});
    assert.deepEqual(page.consoleErrors,[]);assert.deepEqual(errors,[]);
    results.push({width,height,initial,checks:['time scrub updates output and rendered image','brightness input','all visibility toggles','hide/restore text','all hash navigation','play advances time','reset restores defaults'],errors});
  }
  fs.writeFileSync('analysis/qa/functional-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await browser.close();}
