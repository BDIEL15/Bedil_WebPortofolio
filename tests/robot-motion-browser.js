async page => {
  const context=await page.context().browser().newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
  await context.addInitScript(()=>{
    window.__motionFrames=[];
    const clear=WebGL2RenderingContext.prototype.clear;
    WebGL2RenderingContext.prototype.clear=function(mask){
      if((mask&this.COLOR_BUFFER_BIT)&&!this.getParameter(this.FRAMEBUFFER_BINDING))window.__motionFrames.push(performance.now());
      return clear.call(this,mask);
    };
  });
  const p=await context.newPage();p.setDefaultTimeout(15000);
  const errors=[];p.on('pageerror',error=>errors.push(error.message));
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  const state=value=>p.locator(`.scene-live[data-robot-motion=${value}]`).waitFor();
  const count=()=>p.evaluate(()=>window.__motionFrames.length);
  const pixels=async(clip)=>{
    const cover=await p.addStyleTag({content:'.page-shell,.scene-caption,.motion-controls,nextjs-portal{visibility:hidden!important}.scene:after,.scene-scrim{opacity:0!important;transition:none!important}'});
    try{return clip?await p.screenshot({clip}):await p.locator('.workshop-canvas').screenshot();}finally{await cover.evaluate(el=>el.remove());}
  };
  try {
    await p.goto('http://127.0.0.1:3000/projects');await state('playing');
    await p.addStyleTag({content:'nextjs-portal{display:none!important}'});
    await p.waitForTimeout(1000);
    const before=await pixels(),start=await count();
    await p.waitForTimeout(800);const after=await pixels(),frames=await count()-start;
    assert(!before.equals(after),'Robot pixels never move with a fixed camera');
    const sample=await p.evaluate(start=>{const times=window.__motionFrames.slice(start-1);return {duration:times.at(-1)-times[0],frames:times.length-1};},start);
    assert(frames>2&&sample.frames<=Math.ceil(sample.duration/1000*31)+2,`Animation does not respect a roughly 30Hz render cap: ${JSON.stringify(sample)}`);
    await p.getByRole('button',{name:'Pause motion',exact:true}).click();await state('paused');
    const frozen=await pixels(),paused=await count();await p.waitForTimeout(500);
    const pausedAfter=await pixels();
    assert(await count()===paused,'Paused robot keeps rendering');
    assert(frozen.equals(pausedAfter),'Pause does not freeze actual robot pixels');
    await p.getByRole('button',{name:'Motion paused',exact:true}).click();await state('playing');
    await p.waitForTimeout(300);assert(!(await pixels()).equals(frozen),'Resume did not animate the rig');
    await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
    await state('hidden');const hidden=await count();await p.waitForTimeout(500);assert(await count()===hidden,'Hidden tab keeps rendering');
    await p.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
    await state('playing');
    for(const label of ['Home','About','Experience']) {
      await p.locator('nav').getByRole('link',{name:label,exact:true}).click();
      await p.locator(`.scene-live[data-camera-view=${label.toLowerCase()}][data-camera-motion=idle]`).waitFor();await state('playing');
      const settled=await count();await p.waitForTimeout(500);assert(await count()>settled+2,`Workbench stops animating on ${label}`);
      if(label==='Home'||label==='About') {
        const clip=label==='Home'?{x:200,y:510,width:370,height:210}:{x:580,y:540,width:430,height:260};
        const first=await pixels(clip);await p.waitForTimeout(1000);const second=await pixels(clip);
        assert(!first.equals(second),`${label==='Home'?'Monitor':'Notebook'} pixels never animate`);
        if(label==='Home') {
          const robotClip={x:990,y:450,width:350,height:350};const rig=await pixels(robotClip);await p.waitForTimeout(800);
          assert(!rig.equals(await pixels(robotClip)),'Home robot pixels never move');
        }
        if(label==='About') {
          await p.locator('.scene-live[data-notebook-motion=playing]').waitFor();
          await p.getByRole('button',{name:'Pause motion',exact:true}).click();
          const still=await pixels(clip);await p.waitForTimeout(400);assert(still.equals(await pixels(clip)),'Notebook does not freeze on pause');
          await p.getByRole('button',{name:'Motion paused',exact:true}).click();
        }
      }
    }
    await p.locator('nav').getByRole('link',{name:'Projects',exact:true}).click();await state('playing');
    await p.emulateMedia({reducedMotion:'reduce'});await state('paused');
    await p.locator('.scene-live[data-camera-motion=idle]').waitFor();
    const reduced=await count();await p.waitForTimeout(500);assert(await count()===reduced,`Reduced motion keeps rendering: ${await count()-reduced} extra frames`);
    await p.getByRole('button',{name:'Motion paused',exact:true}).click();await p.waitForTimeout(250);
    assert(await count()===reduced,'Explicit Play bypassed reduced-motion robot fallback');
    await p.evaluate(()=>localStorage.setItem('observatory-static','true'));await p.reload();await p.locator('.scene[data-state=static]').waitFor();
    assert(await p.locator('.scene-live canvas').count()===0,'Static mode retains animated canvas');
    const portrait=await context.newPage();await portrait.setViewportSize({width:390,height:844});
    await portrait.goto('http://127.0.0.1:3000/projects');
    // Static preference belongs to the context, so explicitly restore 3D for this viewport.
    await portrait.locator('.scene[data-state=static]').waitFor();
    await portrait.evaluate(()=>localStorage.removeItem('observatory-static'));await portrait.reload();
    await portrait.locator('.scene-live[data-robot-motion=playing]').waitFor();
    const portraitStart=await portrait.evaluate(()=>window.__motionFrames.length);await portrait.waitForTimeout(600);
    assert(await portrait.evaluate(()=>window.__motionFrames.length)>portraitStart+2,'Portrait robot does not render motion');
    await portrait.getByRole('button',{name:'Hide text',exact:true}).click();
    await portrait.locator('.scene-live[data-camera-view=overview][data-camera-motion=idle][data-robot-motion=playing]').waitFor();
    assert(await portrait.locator('.workshop-canvas').evaluate(el=>el.style.touchAction)==='none','Animated overview lost automatic exploration');
    await portrait.getByRole('button',{name:'Show text',exact:true}).click();
    await portrait.locator('.scene-live[data-camera-view=projects][data-camera-motion=idle]').waitFor();
    assert(await portrait.locator('.workshop-canvas').evaluate(el=>el.style.touchAction)==='pan-y pinch-zoom','Animated portrait did not restore native scrolling');
    await portrait.close();
    assert(errors.length===0,errors.join('; '));
    return {passed:['Actual robot pixels move with fixed camera; rendered frame cap','Pause freezes pixels and renders; resume moves again','Hidden tab stops the loop; Home/About/Experience keep the workbench alive; monitor/notebook pixels animate and notebook pause freezes','Dynamic reduced motion and explicit Play respect static robot','Static mode disposes the renderer','Portrait motion, automatic Hide Text exploration and restored native scroll'],framesDuringSample:frames,pageErrors:errors};
  } finally {await context.close();}
}
