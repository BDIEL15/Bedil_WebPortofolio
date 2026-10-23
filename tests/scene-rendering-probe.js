async page => {
  const context=await page.context().browser().newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});
  await context.addInitScript(()=>{
    window.__sceneFrames=[];
    const original=WebGL2RenderingContext.prototype.clear;
    WebGL2RenderingContext.prototype.clear=function(mask){
      if ((mask & this.COLOR_BUFFER_BIT) && !this.getParameter(this.FRAMEBUFFER_BINDING)) window.__sceneFrames.push(performance.now());
      return original.call(this,mask);
    };
  });
  const probe=await context.newPage();
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  await probe.goto('http://127.0.0.1:3000/');
  await probe.locator('.scene[data-state=ready]').waitFor();
  await probe.waitForTimeout(350);
  await probe.evaluate(()=>{window.__sceneFrames=[];});
  await probe.waitForTimeout(2000);
  const frames=await probe.evaluate(()=>window.__sceneFrames);
  const fps=(frames.length-1)/((frames.at(-1)-frames[0])/1000);
  assert(fps>0 && fps<=35,'Expected bounded live scene');
  await probe.getByRole('button',{name:'Pause motion'}).click();
  await probe.waitForTimeout(100);
  const count=()=>probe.evaluate(()=>window.__sceneFrames.length);
  const paused=await count();
  await probe.waitForTimeout(400);
  const pausedDelta=await count()-paused;
  assert(pausedDelta===0,'Paused loop keeps rendering');
  await probe.getByRole('button',{name:'Motion paused'}).click();
  await probe.evaluate(()=>{
    Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const hidden=await count();
  await probe.waitForTimeout(400);
  const hiddenDelta=await count()-hidden;
  assert(hiddenDelta===0,'Hidden document keeps rendering');
  await context.close();
  return {measuredFramesPerSecond:Math.round(fps*10)/10,pausedDelta,simulatedHiddenDocumentDelta:hiddenDelta,condition:'Local Chromium, 390x844 emulation, main framebuffer clears, 2 second sample; not physical device performance.'};
}
