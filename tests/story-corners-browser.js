async page=>{
  const browser=page.context().browser();
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
  await context.addInitScript(()=>{
    window.__storyFrames=0;window.__storyView=null;
    const locations=new WeakSet(),get=WebGL2RenderingContext.prototype.getUniformLocation,upload=WebGL2RenderingContext.prototype.uniformMatrix4fv,clear=WebGL2RenderingContext.prototype.clear;
    WebGL2RenderingContext.prototype.getUniformLocation=function(program,name){const location=get.call(this,program,name);if(location&&name==='viewMatrix')locations.add(location);return location;};
    WebGL2RenderingContext.prototype.uniformMatrix4fv=function(location,transpose,data,...rest){if(locations.has(location)&&!this.getParameter(this.FRAMEBUFFER_BINDING))window.__storyView=Array.from(data);return upload.call(this,location,transpose,data,...rest);};
    WebGL2RenderingContext.prototype.clear=function(mask){if((mask&this.COLOR_BUFFER_BIT)&&!this.getParameter(this.FRAMEBUFFER_BINDING))window.__storyFrames++;return clear.call(this,mask);};
  });
  const p=await context.newPage();p.setDefaultTimeout(15000);
  const errors=[];p.on('pageerror',error=>errors.push(error.message));
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  const idle=view=>p.locator(`.scene-live[data-camera-view=${view}][data-camera-motion=idle]`).waitFor();
  const matrix=()=>p.evaluate(()=>window.__storyView);
  const same=(a,b)=>a&&b&&a.every((v,i)=>Math.abs(v-b[i])<1e-5);
  const nav=label=>p.locator('nav').getByRole('link',{name:label,exact:true}).click();
  const report=[];
  const views=[['About','about'],['Experience','experience'],['Writing','writing'],['Cabinet','cabinet']];
  try {
    await p.goto('http://127.0.0.1:3000/');await idle('home');
    const home=await matrix();await p.evaluate(()=>window.__storyCanvas=document.querySelector('.workshop-canvas'));
    const poses={};
    for(const [label,view] of views) {
      await nav(label);await idle(view);poses[view]=await matrix();
      assert(!same(home,poses[view]),`${label} reuses Home camera`);
      assert(await p.locator('.workshop-canvas').evaluate(el=>el===window.__storyCanvas),'Story navigation replaces renderer');
      if(view==='experience') {
    assert(await p.locator('.role-list li').count()===3,'Published roles missing');
    assert(await p.locator('.role-list li').first().locator('.role-year').count()===0,'Unknown lab period invented');
    assert(await p.locator('.role-year').allTextContents().then(values=>values.every(value=>value==='2026')),'Unexpected role year');
      }
      if(view==='writing'||view==='cabinet') {
        assert(await p.locator('.content-list li').count()===0,'Unpublished collection entries invented');
        assert(await p.locator('.empty-state').isVisible(),'Honest empty state missing');
      }
      const frames=await p.evaluate(()=>window.__storyFrames);await p.waitForTimeout(350);
      assert(await p.evaluate(()=>window.__storyFrames)>frames,`${label} stopped workbench activity`);
      await p.getByRole('button',{name:'Hide text',exact:true}).click();await idle('overview');
      assert(!same(poses[view],await matrix()),`${label} overview did not move`);
      assert(await p.locator('.workshop-canvas').evaluate(el=>el.style.touchAction)==='none','Hide Text did not enable exploration');
      const overview=await matrix();await p.getByRole('button',{name:'Rotate right',exact:true}).click();
      assert(!same(overview,await matrix()),'Story overview rotation does not render');
      await p.getByRole('button',{name:'Reset view',exact:true}).click();await idle('overview');
      assert(same(overview,await matrix()),'Reset did not restore story overview');
      await p.keyboard.press('Escape');await idle(view);
      assert(same(poses[view],await matrix()),'Escape did not restore story reading camera');
      assert(await p.getByRole('button',{name:'Hide text',exact:true}).evaluate(el=>el===document.activeElement),'Escape lost toggle focus');
    }
    assert(new Set(Object.values(poses).map(value=>JSON.stringify(value))).size===4,'Story/collection routes have the same camera');
    report.push('Distinct physical route cameras, one renderer, continuous workbench activity, per-corner overview/orbit/reset/Escape, truthful published roles.');
    await p.goBack();await idle('writing');assert(same(poses.writing,await matrix()),'History lost Writing view');
    await p.goForward();await idle('cabinet');
    for(const view of ['about','experience','writing','cabinet']) {
      const direct=await context.newPage();direct.on('pageerror',error=>errors.push(error.message));
      await direct.goto('http://127.0.0.1:3000/'+view);await direct.locator(`.scene-live[data-camera-view=${view}][data-camera-motion=idle]`).waitFor();
      assert(same(poses[view],await direct.evaluate(()=>window.__storyView)),'Direct route has wrong initial camera');await direct.close();
    }
    report.push('History Writing/Cabinet and direct four story/collection routes start at the correct camera.');
    await p.setViewportSize({width:390,height:844});await p.emulateMedia({reducedMotion:'reduce'});
    for(const [label,view] of views) {
      await nav(label);await idle(view);
      await p.evaluate(()=>window.scrollTo({top:250,behavior:'instant'}));const y=await p.evaluate(()=>scrollY);assert(y>0,'Portrait page must allow native scrolling');
      await p.getByRole('button',{name:'Hide text',exact:true}).click();await idle('overview');
      await p.getByRole('button',{name:'Show text',exact:true}).click();await idle(view);
      assert(Math.abs(await p.evaluate(()=>scrollY)-y)<2,'Story page lost reading position');
      assert(await p.locator('.workshop-canvas').evaluate(el=>el.style.touchAction)==='pan-y pinch-zoom','Show Text did not restore native scrolling');
      await p.evaluate(()=>localStorage.setItem('observatory-static','true'));await p.reload();await p.locator('.scene[data-state=static]').waitFor();
      await p.waitForFunction(view=>{const el=document.querySelector('.scene-poster img');return el.complete&&el.naturalWidth>0&&el.currentSrc.includes('lab-'+view);},view);
      assert(await p.locator('.scene-poster img').evaluate((el,view)=>el.complete&&el.naturalWidth>0&&el.currentSrc.includes('lab-'+view),view),'Wrong story static poster for '+view);
      await p.getByRole('button',{name:'Hide text',exact:true}).click();
      await p.waitForFunction(view=>{const el=document.querySelector('.scene-poster img');return el.complete&&el.naturalWidth>0&&el.currentSrc.includes('lab-overview');},view);
      await p.keyboard.press('Escape');await p.evaluate(()=>localStorage.removeItem('observatory-static'));await p.reload();await idle(view);
    }
    report.push('Portrait reduced-motion, scroll restoration, static/overview posters and re-enable.');
    const noGL=await browser.newContext({viewport:{width:390,height:844}});
    try {
      await noGL.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'||type==='webgl2'?null:get.call(this,type,...args);};});
      const fallback=await noGL.newPage();fallback.on('pageerror',error=>errors.push(error.message));
      for(const view of ['about','experience','writing','cabinet']) {
        await fallback.goto('http://127.0.0.1:3000/'+view);await fallback.locator('.scene[data-state=fallback]').waitFor();
        assert(await fallback.locator('h1').isVisible(),'No-WebGL story content missing');
        await fallback.getByRole('button',{name:'Hide text',exact:true}).click();
        await fallback.waitForFunction(view=>{const el=document.querySelector('.scene-poster img');return el.complete&&el.naturalWidth>0&&el.currentSrc.includes('lab-overview');},view);
        await fallback.keyboard.press('Escape');assert(await fallback.locator('h1').isVisible(),'No-WebGL Escape lost story content');
      }
    } finally {await noGL.close();}
    report.push('WebGL-blocked story/collection routes retain HTML, active overview posters and Escape recovery.');
    assert(errors.length===0,errors.join('; '));
    return {passed:report,pageErrors:errors};
  }finally{await context.close();}
}
