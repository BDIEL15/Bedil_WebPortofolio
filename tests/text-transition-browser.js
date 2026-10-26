async page=>{
  const contexts=[],errors=[],report=[],browser=page.context().browser();
  const assert=(value,message)=>{if(!value)throw Error(message);};
  async function setup(options={},native=true){
    const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference',...options});contexts.push(context);
    await context.addInitScript(native=>{
      window.__copyEvents=[];window.__copyDraws=[];
      const clear=WebGL2RenderingContext.prototype.clear;
      WebGL2RenderingContext.prototype.clear=function(mask){if((mask&this.COLOR_BUFFER_BIT)&&!this.getParameter(this.FRAMEBUFFER_BINDING))window.__copyDraws.push(performance.now());return clear.call(this,mask);};
      if(!native){Object.defineProperty(document,'startViewTransition',{value:undefined});return;}
      const start=document.startViewTransition?.bind(document);if(!start)return;
      document.startViewTransition=callback=>{
        const transition=start(async()=>{await callback();if(window.__skipNextCopy){window.__skipNextCopy=false;transition.skipTransition();}}),began=performance.now();
        transition.ready.then(()=>window.__copyEvents.push({kind:'ready',began,time:performance.now(),animations:document.getAnimations().filter(a=>a.animationName?.startsWith('copy-')).map(a=>({name:a.animationName,frames:a.effect.getKeyframes()}))})).catch(()=>{});
        transition.updateCallbackDone.then(()=>window.__copyEvents.push({kind:'updated',began,time:performance.now()})).catch(()=>{});
        transition.finished.then(()=>window.__copyEvents.push({kind:'finished',began,time:performance.now()})).catch(()=>{});return transition;
      };
    },native);
    const p=await context.newPage();p.setDefaultTimeout(15000);p.on('pageerror',error=>errors.push(p.url()+': '+error.message));return p;
  }
  const idle=(p,view)=>p.locator(`.scene-live[data-camera-view=${view}][data-camera-motion=idle]`).waitFor();
  try{
    for(const [size,options]of [['desktop',{}],['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}]]){
      const p=await setup(options);await p.goto('http://127.0.0.1:3000/');await idle(p,'home');
      const header=await p.locator('nav').boundingBox();
      await p.locator('nav').getByRole('link',{name:'About',exact:true}).click();await p.waitForURL('**/about');
      await p.waitForFunction(()=>window.__copyEvents.some(e=>e.kind==='ready'));
      const samples=[];
      for(let n=0;n<6;n++){
        samples.push(await p.locator('h1').evaluate(el=>({top:el.getBoundingClientRect().top,transform:getComputedStyle(el).transform,parentTransform:getComputedStyle(el.closest('.page-transition')).transform})));
        if(n===1||n===4)await p.screenshot({path:`.taste-skill/lab-views/soft-text-${size}-${n}.png`});
        await p.waitForTimeout(60);
      }
      assert(Math.max(...samples.map(s=>s.top))-Math.min(...samples.map(s=>s.top))<.5,'Heading jumps vertically while entering');
      assert(samples.every(s=>s.transform==='none'&&s.parentTransform==='none'),'Stacked text translation remains');
      const native=await p.evaluate(()=>window.__copyEvents.find(e=>e.kind==='ready'));
      assert(native.animations.some(a=>a.name==='copy-out')&&native.animations.some(a=>a.name==='copy-in'),'Outgoing/incoming crossfade missing');
      assert(native.animations.every(a=>a.frames.every(f=>!f.transform||f.transform==='none')),'Snapshot animation moves the text');
      assert(Math.abs((await p.locator('nav').boundingBox()).y-header.y)<1,'Navigation moves between Home/About');
      await idle(p,'about');
      const start=await p.evaluate(()=>window.__copyDraws.length);
      await p.locator('nav').getByRole('link',{name:'Projects',exact:true}).click();
      await p.waitForTimeout(160);await p.locator('nav').getByRole('link',{name:'Writing',exact:true}).click();
      await p.waitForTimeout(100);await p.locator('nav').getByRole('link',{name:'Cabinet',exact:true}).click();await idle(p,'cabinet');
      const frames=await p.evaluate(start=>window.__copyDraws.slice(start),start);
      assert(frames.length>15,'Text crossfade freezes the shared scene');
      report.push(`${size}: outgoing/incoming opacity only, stable heading/nav, rapid clicks stay interactive and ${frames.length} rendered frames during rapid travel.`);
      const routes=[['Home','/','home'],['About','/about','about'],['Projects','/projects','projects'],['Experience','/experience','experience'],['Writing','/writing','writing'],['Cabinet','/cabinet','cabinet']];
      for(const [from,fromPath]of routes){
        if(new URL(p.url()).pathname!==fromPath){await p.locator('nav').getByRole('link',{name:from,exact:true}).click();await p.waitForURL(url=>url.pathname===fromPath);await p.waitForTimeout(750);}
        for(const [to,toPath,view]of routes.filter(route=>route[1]!==fromPath)){
          await p.locator('nav').getByRole('link',{name:to,exact:true}).click();await p.waitForURL(url=>url.pathname===toPath);
          await p.waitForFunction(()=>document.getAnimations().some(a=>a.animationName?.startsWith('copy-'))||document.querySelector('#main').getAnimations().some(a=>a.playState==='running'));
          assert(await p.locator('.scene-live').getAttribute('data-camera-motion')==='moving',`${size} ${from} → ${to}: camera cut`);
          assert(await p.locator('.scene-live').getAttribute('data-camera-view')===view,`${size} ${from} → ${to}: wrong camera target`);
          await p.waitForTimeout(750);
          await p.locator('nav').getByRole('link',{name:from,exact:true}).click();await p.waitForURL(url=>url.pathname===fromPath);await p.waitForTimeout(750);
        }
      }
      report.push(`${size}: all 30 directed page pairs include text animation and a camera flight, including every return to Home.`);
      await p.locator('nav').getByRole('link',{name:'Cabinet',exact:true}).click();await idle(p,'cabinet');
      await p.locator('nav').getByRole('link',{name:'Writing',exact:true}).click();await idle(p,'writing');
      await p.locator('nav').getByRole('link',{name:'Cabinet',exact:true}).click();await idle(p,'cabinet');
      await p.goBack();await p.waitForURL('**/writing');await idle(p,'writing');
      await p.locator('nav').getByRole('link',{name:'Experience',exact:true}).focus();await p.keyboard.press('Enter');await p.waitForURL('**/experience');
      await p.getByRole('button',{name:'Pause motion',exact:true}).click();await idle(p,'experience');
      await p.waitForTimeout(100);assert(await p.evaluate(()=>document.getAnimations().filter(a=>a.animationName?.startsWith('copy-')).length)===0,'Pause leaves native snapshots animating');
      await p.emulateMedia({reducedMotion:'reduce'});const events=await p.evaluate(()=>window.__copyEvents.length);
      await p.locator('nav').getByRole('link',{name:'Home',exact:true}).click();await idle(p,'home');
      assert(await p.evaluate(()=>window.__copyEvents.length)===events,'Reduced motion starts native fade');
      await p.context().close();
    }
    const fallback=await setup({},false);await fallback.goto('http://127.0.0.1:3000/');await idle(fallback,'home');
    await fallback.locator('nav').getByRole('link',{name:'About',exact:true}).click();await fallback.waitForURL('**/about');
    assert(await fallback.locator('#main').evaluate(el=>el.getAnimations().some(a=>a.effect.getKeyframes().some(f=>Number(f.opacity)===0))),'No-API incoming fade missing');
    await idle(fallback,'about');await fallback.goBack();await idle(fallback,'home');
    assert(await fallback.locator('h1').evaluate(el=>getComputedStyle(el).transform==='none'),'Fallback heading moves');
    report.push('Keyboard/history/pause/reduced and browser without View Transitions keep readable stationary content.');
    const skipped=await setup();await skipped.goto('http://127.0.0.1:3000/');await idle(skipped,'home');
    await skipped.evaluate(()=>window.__skipNextCopy=true);
    await skipped.locator('nav').getByRole('link',{name:'About',exact:true}).click();await skipped.waitForURL('**/about');
    await skipped.waitForFunction(()=>document.querySelector('#main').getAnimations().some(a=>a.effect.getKeyframes().some(f=>Number(f.opacity)===0)));
    await skipped.screenshot({path:'.taste-skill/lab-views/cut-native-fallback.png'});
    await idle(skipped,'about');
    report.push('Skipped native capture receives an incoming fallback fade rather than a hard cut.');
    const slow=await setup();await slow.goto('http://127.0.0.1:3000/');await idle(slow,'home');
    await slow.route('**/writing/does-not-exist**',async route=>{await new Promise(resolve=>setTimeout(resolve,900));await route.continue();});
    await slow.evaluate(()=>{const a=document.createElement('a');a.href='/writing/does-not-exist?slow=1';a.textContent='Slow route check';document.querySelector('main').append(a);});
    await slow.getByRole('link',{name:'Slow route check'}).click();
    await slow.waitForFunction(()=>window.__copyEvents.some(e=>e.kind==='updated'));
    const update=await slow.evaluate(()=>window.__copyEvents.find(e=>e.kind==='updated'));
    assert(update.time-update.began<800,'Slow route holds the native render snapshot');
    await slow.getByRole('heading',{name:'Out of view.',exact:true}).waitFor();
    report.push('Delayed 404 request releases native capture before the network response; no indefinite snapshot gate.');
    const hidden=await setup();await hidden.goto('http://127.0.0.1:3000/');await idle(hidden,'home');
    await hidden.evaluate(()=>{
      document.querySelector('nav a[href="/about"]').click();
      Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));
    });
    await hidden.waitForURL('**/about');await idle(hidden,'about');
    await hidden.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
    report.push('Hiding the document before native capture finishes skips motion but preserves the selected navigation.');
    assert(errors.length===0,errors.join('; '));return {passed:report,pageErrors:errors};
  }catch(error){
    error.message+='\nProgress: '+JSON.stringify(report)+'\nPages: '+JSON.stringify(await Promise.all(contexts.flatMap(context=>context.pages()).map(async p=>({url:p.url(),state:await p.evaluate(()=>({events:window.__copyEvents,paused:document.querySelector('.observatory')?.dataset.paused})).catch(()=>null)}))));
    throw error;
  }finally{for(const context of contexts)await context.close();}
}
