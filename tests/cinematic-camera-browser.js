async page => {
  const browser=page.context().browser(),contexts=new Set(),errors=[],report=[];
  const assert=(value,message)=>{if(!value)throw Error(message);};
  async function setup(options={}) {
    const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference',...options});contexts.add(context);
    await context.addInitScript(()=>{
      window.__cinemaFrames=[];window.__cinemaDraws=0;
      const locations=new WeakSet(),get=WebGL2RenderingContext.prototype.getUniformLocation,upload=WebGL2RenderingContext.prototype.uniformMatrix4fv,clear=WebGL2RenderingContext.prototype.clear;
      WebGL2RenderingContext.prototype.getUniformLocation=function(program,name){const value=get.call(this,program,name);if(value&&name==='viewMatrix')locations.add(value);return value;};
      WebGL2RenderingContext.prototype.uniformMatrix4fv=function(location,transpose,data,...rest){
        if(locations.has(location)&&!this.getParameter(this.FRAMEBUFFER_BINDING)) {
          const m=Array.from(data),last=window.__cinemaFrames.at(-1);
          if(!last||m.some((v,i)=>Math.abs(v-last.matrix[i])>1e-7))window.__cinemaFrames.push({time:performance.now(),entry:document.querySelector('.scene-live')?.dataset.cameraEntry,matrix:m,position:[-(m[0]*m[12]+m[1]*m[13]+m[2]*m[14]),-(m[4]*m[12]+m[5]*m[13]+m[6]*m[14]),-(m[8]*m[12]+m[9]*m[13]+m[10]*m[14])]});
        }
        return upload.call(this,location,transpose,data,...rest);
      };
      WebGL2RenderingContext.prototype.clear=function(mask){if((mask&this.COLOR_BUFFER_BIT)&&!this.getParameter(this.FRAMEBUFFER_BINDING))window.__cinemaDraws++;return clear.call(this,mask);};
    });
    const p=await context.newPage();p.setDefaultTimeout(15000);p.on('pageerror',error=>errors.push(p.url()+': '+error.message));return p;
  }
  const ready=p=>p.locator('.scene[data-state=ready]').waitFor();
  const close=async p=>{contexts.delete(p.context());await p.context().close();};
  const idle=(p,view='home')=>p.locator(`.scene-live[data-camera-view=${view}][data-camera-motion=idle]`).waitFor();
  const origin='http://127.0.0.1:3000';
  try {
    for(const [size,options]of [['desktop',{}],['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}]]) {
      const p=await setup(options);await p.goto(origin);await ready(p);
      await p.locator('.scene-live[data-camera-entry=playing][data-camera-flight=intro]').waitFor();
      assert(await p.locator('.reading-content[inert]').count()===1,'Opening must protect hidden reading content');
      assert(await p.getByRole('button',{name:'Skip intro'}).isVisible(),'Opening needs a usable Skip control');
      assert(await p.locator('.workshop-canvas').evaluate(el=>el.style.touchAction)==='pan-y pinch-zoom','Opening hijacks native scroll');
      await p.screenshot({path:`.taste-skill/lab-views/cinema-opening-${size}-start.png`});
      await p.waitForTimeout(650);await p.screenshot({path:`.taste-skill/lab-views/cinema-opening-${size}-middle.png`});
      await idle(p);await p.locator('.scene-live[data-camera-entry=complete]').waitFor();
      const frames=await p.evaluate(()=>window.__cinemaFrames.filter(frame=>frame.entry==='playing'));
      assert(frames.length>12,'Opening has too few distinct actual camera frames');
      assert(frames[0].position[2]<frames.at(-1).position[2]-2,'Opening does not pull away from the monitor');
      assert(frames[0].position[1]<frames.at(-1).position[1]-.25,'Opening does not rise into the Home composition');
      await p.screenshot({path:`.taste-skill/lab-views/cinema-opening-${size}-end.png`});
      const start=await p.evaluate(()=>window.__cinemaFrames.length);
      await p.locator('nav').getByRole('link',{name:'Projects',exact:true}).click();
      await p.locator('.scene-live[data-camera-motion=moving]').waitFor();await p.waitForTimeout(330);
      await p.locator('nav').getByRole('link',{name:'Writing',exact:true}).click();await p.waitForTimeout(220);
      await p.locator('nav').getByRole('link',{name:'Cabinet',exact:true}).click();await idle(p,'cabinet');
      const jumps=await p.evaluate(start=>window.__cinemaFrames.slice(Math.max(0,start-1)).flatMap((frame,i,all)=>i&&frame.time-all[i-1].time<120?[Math.hypot(...frame.position.map((v,j)=>v-all[i-1].position[j]))]:[]),start);
      assert(jumps.length>12&&Math.max(...jumps)<1,'Rapid retarget causes a camera jump');
      const homeStart=await p.evaluate(()=>window.__cinemaFrames.length);
      await p.locator('nav').getByRole('link',{name:'Home',exact:true}).click();await idle(p);
      assert(await p.evaluate(start=>window.__cinemaFrames.length-start>12,homeStart),'Returning Home cuts instead of rendering a camera journey');
      assert(await p.locator('.scene-live').getAttribute('data-camera-entry')==='complete','Route navigation replays opening');
      await p.getByRole('button',{name:'Use static view',exact:true}).click();await p.locator('.scene[data-state=static]').waitFor();
      await p.getByRole('button',{name:'Enable 3D',exact:true}).click();await ready(p);await idle(p);
      assert(await p.locator('.scene-live').getAttribute('data-camera-entry')==='skipped','Re-enable replays opening');
      report.push(`${size}: monitor pullback/rise, inert reading content and Skip during opening, rapid retarget without large frame jumps; return Home has >12 distinct camera frames, no opening replay on routes/static re-enable.`);
      await close(p);
    }
    const resized=await setup();await resized.goto(origin);await idle(resized);
    await resized.locator('nav').getByRole('link',{name:'Projects',exact:true}).click();
    await resized.locator('.scene-live[data-camera-motion=moving]').waitFor();await resized.waitForTimeout(200);
    await resized.setViewportSize({width:1423,height:1000});await resized.waitForTimeout(100);
    assert(await resized.locator('.scene-live').getAttribute('data-camera-motion')==='moving','Viewport width change cuts camera flight to the destination');
    await idle(resized,'projects');await close(resized);
    report.push('Width changes during travel retarget from the current camera pose without cutting the flight.');
    const paused=await setup();await paused.goto(origin);await ready(paused);
    await paused.locator('.scene-live[data-camera-entry=playing]').waitFor();
    await paused.evaluate(()=>document.querySelector('.motion-controls button').click());await idle(paused);
    const count=await paused.evaluate(()=>window.__cinemaDraws);await paused.waitForTimeout(400);
    assert(await paused.evaluate(()=>window.__cinemaDraws)===count,'Paused opening keeps drawing');
    await paused.getByRole('button',{name:'Motion paused',exact:true}).click();
    assert(await paused.locator('.scene-live').getAttribute('data-camera-motion')==='idle','Resume replays interrupted opening');
    await close(paused);
    const hidden=await setup();await hidden.goto(origin);await ready(hidden);await hidden.locator('.scene-live[data-camera-entry=playing]').waitFor();
    await hidden.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});await idle(hidden);
    const hiddenCount=await hidden.evaluate(()=>window.__cinemaDraws);await hidden.waitForTimeout(300);
    assert(await hidden.evaluate(()=>window.__cinemaDraws)===hiddenCount,'Hidden opening keeps drawing');
    await hidden.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
    await close(hidden);
    const reduced=await setup({reducedMotion:'reduce'});await reduced.goto(origin);await ready(reduced);await idle(reduced);
    assert(await reduced.locator('.scene-live').getAttribute('data-camera-entry')==='skipped','Reduced motion starts opening');
    await close(reduced);
    const stored=await setup();await stored.context().addInitScript(()=>localStorage.setItem('observatory-paused','true'));await stored.goto(origin);await ready(stored);await idle(stored);
    assert(await stored.locator('.scene-live').getAttribute('data-camera-entry')==='skipped','Stored pause starts opening');
    await close(stored);
    const direct=await setup();await direct.goto(origin+'/writing');await ready(direct);await idle(direct,'writing');
    assert(await direct.locator('.scene-live').getAttribute('data-camera-entry')==='skipped','Direct Writing plays Home opening');
    report.push('Pause/hidden settle opening and stop draws; resume does not replay. Reduced motion/stored pause/direct Writing skip opening.');
    assert(errors.length===0,errors.join('; '));return {passed:report,pageErrors:errors};
  } finally {for(const context of contexts)await context.close();}
}
