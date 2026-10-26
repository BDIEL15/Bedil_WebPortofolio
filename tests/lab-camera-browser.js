async page => {
  const origin='http://127.0.0.1:3000';
  const browser=page.context().browser();
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  await context.addInitScript(()=>{
    window.__cameraFrames=[];window.__labFrames=0;
    const locations=new WeakSet();
    const get=WebGL2RenderingContext.prototype.getUniformLocation;
    WebGL2RenderingContext.prototype.getUniformLocation=function(program,name){
      const location=get.call(this,program,name);if(location&&name==='viewMatrix')locations.add(location);return location;
    };
    const upload=WebGL2RenderingContext.prototype.uniformMatrix4fv;
    WebGL2RenderingContext.prototype.uniformMatrix4fv=function(location,transpose,data,...rest){
      if(locations.has(location)&&!this.getParameter(this.FRAMEBUFFER_BINDING)){
        const value=Array.from(data),last=window.__cameraFrames.at(-1);
        if(!last||value.some((v,i)=>Math.abs(v-last.value[i])>1e-7))window.__cameraFrames.push({time:performance.now(),value});
      }
      return upload.call(this,location,transpose,data,...rest);
    };
    const clear=WebGL2RenderingContext.prototype.clear;
    WebGL2RenderingContext.prototype.clear=function(mask){
      if((mask&this.COLOR_BUFFER_BIT)&&!this.getParameter(this.FRAMEBUFFER_BINDING))window.__labFrames++;
      return clear.call(this,mask);
    };
  });
  const p=await context.newPage();p.setDefaultTimeout(15000);
  const errors=[];p.on('pageerror',error=>errors.push(error.message));
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  const ready=()=>p.locator('.scene[data-state=ready]').waitFor();
  const idle=view=>p.locator(`.scene-live[data-camera-view=${view}][data-camera-motion=idle]`).waitFor();
  const moving=()=>p.locator('.scene-live[data-camera-motion=moving]').waitFor();
  const matrix=()=>p.evaluate(()=>window.__cameraFrames.at(-1)?.value);
  const matches=(a,b)=>a&&b&&a.every((v,i)=>Math.abs(v-b[i])<1e-5);
  const nav=label=>p.locator('nav').getByRole('link',{name:label,exact:true}).click();
  const report=[];
  try {
    await p.goto(origin);await ready();await idle('home');
    await p.getByRole('button',{name:'Pause motion',exact:true}).waitFor();
    await p.evaluate(()=>{window.__firstCanvas=document.querySelector('.workshop-canvas');});
    assert(await p.getByRole('button',{name:'Inspect as ASCII'}).count()===0,'ASCII control was not removed');
    const home=await matrix();assert(home,'Actual view matrix was not captured');
    const first=await p.evaluate(()=>window.__cameraFrames.length);
    await nav('Projects');await moving();await idle('projects');
    const projects=await matrix();
    const samples=await p.evaluate(start=>window.__cameraFrames.slice(start),first);
    assert(samples.length>2,'Route transition has no actual intermediate camera frames');
    assert(!matches(home,projects),'Projects reuses the seated Home pose');
    assert(await p.locator('.workshop-canvas').evaluate(el=>el===window.__firstCanvas),'Route replaced renderer');
    report.push(`Home → Projects: ${samples.length} distinct rendered view matrices, shared renderer and different destination.`);

    await p.getByRole('button',{name:'Hide text',exact:true}).click();await moving();await idle('overview');
    const overview=await matrix();assert(!matches(overview,projects),'Hide text did not move the camera');
    assert(await p.getByRole('navigation').count()===0,'Hidden content remains accessible');
    assert(await p.getByRole('button',{name:'Show text',exact:true}).evaluate(el=>el===document.activeElement),'Show text lost focus');
    let settled=await p.evaluate(()=>window.__labFrames);
    await p.waitForTimeout(300);assert(await p.evaluate(()=>window.__labFrames)>settled,'Visible Projects robot did not animate in overview');
    assert(await p.locator('.workshop-canvas').evaluate(el=>el.style.touchAction)==='none','Hide Text did not enable automatic exploration');
    const box=await p.locator('.workshop-canvas').boundingBox();
    await p.mouse.move(box.x+box.width*.7,box.y+box.height*.45);await p.mouse.down();
    await p.mouse.move(box.x+box.width*.78,box.y+box.height*.5,{steps:8});await p.mouse.up();
    assert(!matches(overview,await matrix()),'Hide Text did not accept mouse orbit without Explore click');
    await p.getByRole('button',{name:'Reset view',exact:true}).click();await idle('overview');
    assert(matches(overview,await matrix()),'Reset did not restore the active workspace overview');
    await p.getByRole('button',{name:'Show text',exact:true}).click();await moving();await idle('projects');
    assert(matches(projects,await matrix()),'Show text did not restore Projects pose');
    report.push('Hide Text rises to overview with robot motion, hidden/inert content and focus preserved; Show Text restores active route.');

    await p.getByRole('button',{name:'Hide text',exact:true}).click();await moving();
    await p.mouse.move(box.x+box.width*.7,box.y+box.height*.45);await p.mouse.down();
    await p.mouse.move(box.x+box.width*.78,box.y+box.height*.5,{steps:4});await p.mouse.up();
    await idle('overview');
    assert(!matches(overview,await matrix()),'Immediate drag did not interrupt the overview transition');
    await p.getByRole('button',{name:'Show text',exact:true}).focus();await p.keyboard.press('Escape');await idle('projects');
    assert(await p.getByRole('navigation').count()===1,'Escape outside canvas did not restore reading');
    assert(matches(projects,await matrix()),'Escape after immediate drag did not restore Projects pose');
    assert(await p.getByRole('button',{name:'Hide text',exact:true}).evaluate(el=>el===document.activeElement),'Global Escape lost toggle focus');
    report.push('Immediate drag interrupts Hide Text camera motion; Escape outside canvas restores reading pose and focus.');

    await nav('Home');await moving();await p.waitForTimeout(120);await nav('Projects');await idle('projects');
    assert(matches(projects,await matrix()),'Rapid route retarget did not settle at Projects');
    await p.getByRole('button',{name:'Hide text',exact:true}).click();await moving();await p.waitForTimeout(100);
    await p.getByRole('button',{name:'Show text',exact:true}).click();await p.waitForTimeout(100);
    await p.getByRole('button',{name:'Hide text',exact:true}).click();await idle('overview');
    assert(matches(overview,await matrix()),'Rapid focus toggle did not settle at overview');
    await p.getByRole('button',{name:'Show text',exact:true}).click();await idle('projects');
    await p.goBack();await idle('home');await p.goForward();await idle('projects');
    assert(matches(projects,await matrix()),'History did not restore Projects');
    report.push('Mid-flight route/focus retargets and browser back/forward settle at the requested destination.');

    await p.getByRole('button',{name:'Hide text',exact:true}).click();await moving();
    await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
    await idle('overview');settled=await p.evaluate(()=>window.__labFrames);
    await p.waitForTimeout(250);assert(await p.evaluate(()=>window.__labFrames)===settled,'Hidden tab kept rendering');
    await p.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
    await p.getByRole('button',{name:'Show text',exact:true}).click();await idle('projects');
    report.push('Simulated hidden tab settles the in-flight camera once and stops rendering.');

    await p.getByRole('button',{name:'Hide text',exact:true}).click();await moving();
    await p.getByRole('button',{name:'Pause motion',exact:true}).click();await idle('overview');
    settled=await p.evaluate(()=>window.__labFrames);await p.waitForTimeout(300);
    assert(await p.evaluate(()=>window.__labFrames)===settled,'Pause did not settle camera rendering');
    await p.getByRole('button',{name:'Show text',exact:true}).click();await idle('projects');
    await nav('Home');await idle('home');
    await p.goto(origin+'/about?preview=1');await ready();await idle('about');
    await p.evaluate(()=>window.scrollTo({top:250,behavior:'instant'}));await p.waitForTimeout(100);
    const scroll=await p.evaluate(()=>window.scrollY);assert(scroll>0,'Reading position was not scrolled');
    await p.getByRole('button',{name:'Hide text',exact:true}).click();await idle('overview');
    await p.getByRole('button',{name:'Show text',exact:true}).click();await idle('about');
    assert(Math.abs(await p.evaluate(()=>window.scrollY)-scroll)<2,'Show Text lost reading position');
    report.push('Pause settles at destination without a running loop; Show Text restores the prior reading scroll position.');
    await nav('Home');await idle('home');

    await p.getByRole('button',{name:'Motion paused',exact:true}).click();
    await p.getByRole('button',{name:'Hide text',exact:true}).click();await moving();await p.emulateMedia({reducedMotion:'reduce'});await idle('overview');
    await p.getByRole('button',{name:'Show text',exact:true}).click();await idle('home');
    assert(await p.locator('.scene').getAttribute('data-motion')==='paused','Reduced motion did not settle camera');
    await nav('Projects');await idle('projects');
    await p.evaluate(()=>localStorage.setItem('observatory-static','true'));await p.reload();
    await p.locator('.scene[data-state=static]').waitFor();
    assert(await p.locator('.scene-poster img').evaluate(el=>el.complete&&el.naturalWidth>0&&el.currentSrc.includes('lab-projects')),'Projects static poster missing');
    await p.getByRole('button',{name:'Hide text',exact:true}).click();
    await p.waitForFunction(()=>document.querySelector('.scene-poster img').currentSrc.includes('overview'));
    assert(await p.locator('.scene-poster img').evaluate(el=>el.complete&&el.naturalWidth>0),'Overview static poster missing');
    await p.getByRole('button',{name:'Show text',exact:true}).click();
    await p.evaluate(()=>localStorage.removeItem('observatory-static'));await p.reload();await ready();await idle('projects');
    assert(matches(projects,await matrix()),'Retry did not start at the active route');
    report.push('Live reduced-motion change snaps safely; route/overview posters and re-enable use the current route.');

    const direct=await context.newPage();await direct.goto(origin+'/projects');
    await direct.locator('.scene-live[data-camera-view=projects][data-camera-motion=idle]').waitFor();
    const directMatrices=await direct.evaluate(()=>window.__cameraFrames.map(frame=>frame.value));
    assert(directMatrices.length>0&&directMatrices.every(value=>matches(value,projects)),'Direct Projects load flies through Home');
    await direct.close();

    const mobile=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
    try {
      const touch=await mobile.newPage();await touch.goto(origin+'/projects');
      await touch.locator('.scene[data-state=ready]').waitFor();
      await touch.getByRole('button',{name:'Hide text',exact:true}).tap();
      await touch.locator('.scene-live[data-camera-view=overview][data-camera-motion=idle]').waitFor();
      assert(await touch.locator('.workshop-canvas').evaluate(el=>el.style.touchAction)==='none','Hide Text did not automatically enable exploration');
      assert(await touch.locator('.workshop-canvas').evaluate(el=>el.style.touchAction)==='none','Explore did not enable orbit');
      await touch.getByRole('button',{name:'Show text',exact:true}).tap();
      await touch.locator('.scene-live[data-camera-view=projects][data-camera-motion=idle]').waitFor();
      assert(await touch.locator('.workshop-canvas').evaluate(el=>el.style.touchAction)==='pan-y pinch-zoom','Show Text did not restore native scroll');
    } finally { await mobile.close(); }

    const noGL=await browser.newContext({viewport:{width:390,height:844}});
    try {
      await noGL.addInitScript(()=>{
        const original=HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'||type==='webgl2'?null:original.call(this,type,...args);};
      });
      const fallback=await noGL.newPage();await fallback.goto(origin+'/projects');
      await fallback.locator('.scene[data-state=fallback]').waitFor();
      await fallback.getByRole('button',{name:'Hide text',exact:true}).click();
      await fallback.waitForFunction(()=>{const image=document.querySelector('.scene-poster img');return image.complete&&image.naturalWidth>0&&image.currentSrc.includes('overview');});
      await fallback.getByRole('button',{name:'Show text',exact:true}).click();
      assert(await fallback.getByRole('heading',{name:'Projects',exact:true}).isVisible(),'No-WebGL Show Text lost content');
    } finally { await noGL.close(); }
    report.push('Hide Text automatically enables touch exploration and Show Text restores native scroll; WebGL-blocked Projects/overview posters work.');
    assert(errors.length===0,errors.join('; '));
    return {passed:report,directProjectsInitialPose:true,pageErrors:errors};
  } finally { await context.close(); }
}
