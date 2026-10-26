async page=>{
  const browser=page.context().browser(),contexts=[],errors=[],report=[];
  const assert=(value,message)=>{if(!value)throw Error(message);};
  async function setup(options={}){
    const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference',...options});contexts.push(context);
    await context.addInitScript(()=>{
      window.__arrivals=[];const animate=Element.prototype.animate;
      Element.prototype.animate=function(frames,options){const animation=animate.call(this,frames,options);if(this.matches('.site-header,.home-intro h1,.home-intro .interest-line,.home-intro .intro-copy,.home-intro .social-link'))window.__arrivals.push({element:this,frames,options,animation});return animation;};
    });
    const p=await context.newPage();p.setDefaultTimeout(20000);p.on('pageerror',error=>errors.push(error.message));return p;
  }
  try{
    for(const [name,width,height]of [['desktop',1440,1000],['mobile',390,844]]){
      const p=await setup({viewport:{width,height}});await p.goto('http://127.0.0.1:3000/',{waitUntil:'commit'});
      await p.waitForFunction(()=>window.__arrivals.length===8);
      const before=await p.locator('.home-intro h1').boundingBox();await p.waitForTimeout(160);
      assert(await p.evaluate(()=>Number(getComputedStyle(document.querySelector('.home-intro h1')).opacity)>Number(getComputedStyle(document.querySelector('.social-link')).opacity)),'Heading/social reveal is not staggered');
      const after=await p.locator('.home-intro h1').boundingBox();assert(Math.abs(before.y-after.y)<.5,'Arrival moves the heading');
      await p.screenshot({path:`.taste-skill/home-arrival-${name}-mid.png`});
      const timings=await p.evaluate(()=>window.__arrivals.map(entry=>({delay:entry.options.delay,frames:entry.frames})));
      assert(timings.every(entry=>entry.frames.every(frame=>Object.keys(frame).every(key=>key==='opacity'))),'Arrival animates layout/transform');
      assert(JSON.stringify(timings.map(entry=>entry.delay))===JSON.stringify([0,0,100,220,360,405,450,495]),'Arrival order changed');
      // Natural camera completion removes this attribute; arrival must own its own lifetime.
      await p.evaluate(()=>delete document.documentElement.dataset.labBoot);
      assert(await p.evaluate(()=>window.__arrivals.some(entry=>entry.animation.playState==='running')),'Removing boot state cuts the text fade');
      await p.locator('html[data-home-arrival=done]').waitFor();
      assert(await p.locator('.home-intro h1').evaluate(el=>getComputedStyle(el).opacity)==='1','Heading remains hidden');
      await p.screenshot({path:`.taste-skill/home-arrival-${name}.png`});
      await p.locator('nav').getByRole('link',{name:'Projects',exact:true}).click();await p.waitForURL('**/projects');
      await p.locator('nav').getByRole('link',{name:'Home',exact:true}).click();await p.waitForURL('http://127.0.0.1:3000/');
      assert(await p.evaluate(()=>window.__arrivals.length)===8,'Route return duplicates the cold-entry animation');
      await p.reload();await p.locator('html[data-home-arrival=done]').waitFor();
      assert(await p.evaluate(()=>window.__arrivals.length)===8,'Cached session loses initial document reveal');
      report.push(`${name}: staggered opacity, stable heading, independent lifetime, no route replay and cached-session cold-entry reveal pass`);
      await p.context().close();
    }
    for(const mode of ['reduced','paused','no-js']){
      const p=await setup({reducedMotion:mode==='reduced'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});
      if(mode==='paused')await p.context().addInitScript(()=>localStorage.setItem('observatory-paused','true'));
      await p.goto('http://127.0.0.1:3000/');assert(await p.locator('.home-intro h1').isVisible(),`${mode}: hidden heading`);
      assert(await p.locator('.home-intro h1').evaluate(el=>getComputedStyle(el).opacity)==='1',`${mode}: opacity hidden`);
      if(mode!=='no-js')assert(await p.evaluate(()=>window.__arrivals.length)===0,`${mode}: animation ignores preference`);
    }
    const paused=await setup();await paused.goto('http://127.0.0.1:3000/');await paused.waitForFunction(()=>window.__arrivals.length===8);
    await paused.getByRole('button',{name:'Pause motion',exact:true}).click();await paused.locator('html[data-home-arrival=done]').waitFor();
    assert(await paused.evaluate(()=>window.__arrivals.every(entry=>entry.animation.playState!=='running')),'Pause leaves arrival running');
    report.push('Reduced motion, saved pause, no-JS and pause during reveal keep text visible');
    assert(errors.length===0,errors.join('; '));return {passed:report,pageErrors:errors};
  }finally{for(const context of contexts)await context.close();}
}
