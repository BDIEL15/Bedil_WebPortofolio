async page=>{
  const browser=page.context().browser(),contexts=[],errors=[],report=[];
  const assert=(value,message)=>{if(!value)throw Error(message);};
  async function setup(options={}){
    const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference',...options});contexts.push(context);
    await context.addInitScript(()=>{
      // Hold only the handoff for deterministic screenshots; the product uses 360ms.
      const timeout=window.setTimeout.bind(window);window.setTimeout=(fn,ms,...args)=>timeout(fn,ms===360?1200:ms,...args);
      window.__bootStages=[];
      window.__terminalCommands=[];
      const fill=CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText=function(value,...args){
        if(this.canvas.classList.contains('boot-canvas')&&String(value).startsWith('$')&&window.__terminalCommands.at(-1)?.text!==value)window.__terminalCommands.push({text:value,time:performance.now()});
        return fill.call(this,value,...args);
      };
      new MutationObserver(()=>{const stage=document.documentElement.dataset.labBoot;window.__bootStages.push(stage??'off');}).observe(document,{subtree:true,attributes:true,attributeFilter:['data-lab-boot']});
    });
    const p=await context.newPage();p.setDefaultTimeout(20000);p.on('pageerror',error=>errors.push(error.message));return p;
  }
  try{
    for(const [name,width,height]of [['desktop',1440,1000],['mobile',390,844]]){
      const p=await setup({viewport:{width,height}});
      await p.goto('http://127.0.0.1:3000/',{waitUntil:'commit'});
      await p.locator('html[data-lab-boot=handoff]').waitFor();
      assert(await p.locator('.boot-screen').getAttribute('data-unlocked')==='true','Success outline fires before terminal completion or is missing');
      assert(await p.locator('.boot-confirmation').evaluate(el=>getComputedStyle(el).animationName)==='workspace-confirmation','Success outline is not animated');
      assert(await p.locator('.scene-live').evaluate(el=>getComputedStyle(el).opacity)==='1','Handoff exposes the Home poster behind the terminal');
      assert(await p.locator('.reading-content[inert]').count()===1,'Boot exposes background keyboard targets');
      await p.screenshot({path:`.taste-skill/boot-${name}-terminal.png`});
      await p.locator('html[data-lab-boot=flight]').waitFor();
      await p.waitForTimeout(600);await p.screenshot({path:`.taste-skill/boot-${name}-pullback.png`});
      await p.locator('.scene-live[data-camera-entry=complete]').waitFor();
      await p.locator('html:not([data-lab-boot])').waitFor();
      assert(await p.locator('.reading-content[inert]').count()===0,'Completed boot leaves content inert');
      assert(await p.evaluate(()=>document.body.style.overflow!=='hidden'),'Completed boot leaves scroll locked');
      assert(await p.locator('.site-header nav').isVisible(),'Home navigation not revealed');
      assert(await p.locator('.scene-live canvas').count()===1,'Opening added a second renderer');
      await p.screenshot({path:`.taste-skill/boot-${name}-home.png`});
      const stages=await p.evaluate(()=>window.__bootStages);
      const commands=await p.evaluate(()=>window.__terminalCommands);
      assert(commands.length>=8,'Initial terminal command does not type visibly');
      assert(commands.at(-1).text==='$ boot observatory','Typed command is incomplete at handoff');
      assert(commands.at(-1).time-commands[0].time>=500,'Command is printed instantly');
      assert(commands.every((entry,index)=>index===0||entry.text.length-commands[index-1].text.length<=1),'Typing skips characters after a stalled frame');
      for(const stage of ['handoff','flight','revealing','off'])assert(stages.includes(stage),`Missing boot stage ${stage}`);
      await p.reload();await p.locator('.scene[data-state=ready]').waitFor();
      assert(!await p.locator('html[data-lab-boot]').count(),'Opening repeats in the same session');
      await p.locator('.site-header nav').getByRole('link',{name:'Projects',exact:true}).click();await p.waitForURL('**/projects');
      await p.locator('.site-header nav').getByRole('link',{name:'Home',exact:true}).click();await p.waitForURL('http://127.0.0.1:3000/');
      assert(!await p.locator('html[data-lab-boot]').count(),'Returning Home replays loading');
      report.push(`${name}: terminal handoff, monitor pullback, reveal, one renderer, scroll/focus cleanup, reload and navigation pass`);
      await p.context().close();
    }
    const skip=await setup();await skip.goto('http://127.0.0.1:3000/');
    await skip.getByRole('button',{name:'Skip intro'}).click();await skip.locator('html:not([data-lab-boot])').waitFor();
    await skip.locator('.scene[data-state=ready]').waitFor();assert(await skip.locator('.site-header nav').isVisible(),'Skip hides navigation');
    await skip.locator('.scene-live[data-camera-motion=idle]').waitFor();
    const escape=await setup();await escape.goto('http://127.0.0.1:3000/');await escape.locator('html[data-lab-boot=flight]').waitFor();
    await escape.keyboard.press('Escape');await escape.locator('html:not([data-lab-boot])').waitFor();
    await escape.waitForFunction(()=>document.activeElement?.id==='main');
    const liveReduced=await setup();await liveReduced.goto('http://127.0.0.1:3000/');await liveReduced.locator('html[data-lab-boot=flight]').waitFor();
    await liveReduced.emulateMedia({reducedMotion:'reduce'});await liveReduced.locator('html:not([data-lab-boot])').waitFor();
    assert(await liveReduced.locator('.scene-live').getAttribute('data-camera-motion')==='idle','Live reduced-motion change keeps flying');
    const hidden=await setup();await hidden.goto('http://127.0.0.1:3000/');await hidden.locator('html[data-lab-boot=flight]').waitFor();
    await hidden.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
    await hidden.locator('html:not([data-lab-boot])').waitFor();
    assert(await hidden.locator('.scene-live').getAttribute('data-camera-motion')==='idle','Hidden boot keeps flying');
    for(const mode of ['reduced','paused','static','direct','no-webgl','no-js']){
      const p=await setup({reducedMotion:mode==='reduced'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});
      if(mode==='paused'||mode==='static')await p.context().addInitScript(mode=>localStorage.setItem('observatory-'+mode,'true'),mode);
      if(mode==='no-webgl')await p.context().addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:get.call(this,type,...args);};});
      await p.goto('http://127.0.0.1:3000/'+(mode==='direct'?'writing':''));
      if(mode==='no-webgl')await p.locator('.scene[data-state=fallback]').waitFor();
      else if(mode!=='no-js')await p.locator('.scene[data-state]').waitFor();
      await p.locator('html:not([data-lab-boot])').waitFor();assert(await p.locator('.site-header nav').isVisible(),`${mode}: content is blocked`);
      await p.context().close();
    }
    report.push('Skip, hidden tab, reduced motion, saved pause/static, direct route, WebGL failure and no-JS remain usable');
    const earlyTimeout=await setup();
    await earlyTimeout.context().addInitScript(()=>{const timeout=window.setTimeout.bind(window);window.setTimeout=(fn,ms,...args)=>timeout(fn,ms===12000?300:ms,...args);});
    await earlyTimeout.goto('http://127.0.0.1:3000/');await earlyTimeout.locator('.scene[data-state=fallback]').waitFor();
    await earlyTimeout.waitForTimeout(1000);assert(await earlyTimeout.locator('.scene[data-state=fallback]').count()===1,'Timeout before typed command restarts loading');
    await earlyTimeout.getByRole('button',{name:'Try 3D again'}).click();await earlyTimeout.locator('.scene[data-state=ready]').waitFor();
    assert(!await earlyTimeout.locator('html[data-lab-boot]').count(),'Explicit retry replays typing');
    const delayed=await setup();
    const html=await (await delayed.request.get('http://127.0.0.1:3000/')).text();
    const initialScripts=new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match=>new URL(match[1],'http://127.0.0.1:3000').pathname));
    let held=0;
    await delayed.route('**/*',async route=>{
      if(route.request().resourceType()==='script'&&!initialScripts.has(new URL(route.request().url()).pathname)){held++;await new Promise(resolve=>setTimeout(resolve,3000));}
      await route.continue().catch(()=>{});
    });
    await delayed.context().addInitScript(()=>{const timeout=window.setTimeout.bind(window);window.setTimeout=(fn,ms,...args)=>timeout(fn,ms===12000?1500:ms,...args);});
    await delayed.goto('http://127.0.0.1:3000/');await delayed.locator('.scene[data-state=fallback]').waitFor();
    assert(held>0,'Slow module fixture did not delay any import');
    await delayed.locator('html:not([data-lab-boot])').waitFor();assert(await delayed.locator('.site-header nav').isVisible(),'Timed-out loader traps the visitor');
    await delayed.waitForTimeout(3500);assert(await delayed.locator('.scene-live canvas').count()===0,'Late module revived an aborted renderer');
    report.push('Loading deadline releases content; a late module cannot revive the aborted scene');
    for(const width of [1440,390]){
      const firstPaint=await setup({viewport:{width,height:844}});
      await firstPaint.route('**/*',route=>route.request().resourceType()==='script'?route.abort():route.continue());
      await firstPaint.goto('http://127.0.0.1:3000/');
      assert(await firstPaint.locator('.boot-placeholder').isVisible(),'First-paint terminal missing before hydration');
      const inset=await firstPaint.locator('.boot-placeholder p').first().evaluate(el=>el.getBoundingClientRect().left);
      const expected=Math.min(38*Math.max(width/768,844/432),width*.08);
      assert(Math.abs(inset-expected)<1,'First-paint text uses a different anchor from the canvas');
      await firstPaint.screenshot({path:`.taste-skill/boot-placeholder-${width}.png`});await firstPaint.context().close();
    }
    report.push('First-paint terminal anchors match the canvas on desktop/mobile before hydration');
    assert(errors.length===0,errors.join('; '));return {passed:report,pageErrors:errors};
  }catch(error){error.message+='\n'+JSON.stringify({report,errors,pages:await Promise.all(contexts.flatMap(context=>context.pages()).map(async p=>({url:p.url(),state:await p.evaluate(()=>({stages:window.__bootStages,hidden:document.hidden,root:document.documentElement.dataset.labBoot,scene:document.querySelector('.scene')?.dataset.state,entry:document.querySelector('.scene-live')?.dataset.cameraEntry})).catch(()=>null)})))});throw error;
  }finally{for(const context of contexts)await context.close();}
}
