async page => {
  const assert = (value,message)=>{if(!value)throw new Error(message);};
  const origin='http://127.0.0.1:3000';
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(origin);
  await page.evaluate(()=>{localStorage.setItem('observatory-paused','false');localStorage.removeItem('observatory-static');});
  await page.reload();
  await page.locator('.scene[data-state=ready]').waitFor();
  await page.getByRole('button',{name:'Pause motion'}).click();
  assert(await page.locator('h1').getAttribute('aria-label')==="hey, i'm Abdiel Deandra EL Dzaky",'Accessible full name');
  assert(await page.locator('.split-word').evaluateAll(nodes=>nodes.every(el=>getComputedStyle(el).opacity==='1')),'Paused reveal hides words');
  assert(await page.locator('.page-transition').evaluate(el=>getComputedStyle(el).animationName)==='none','Paused route entrance');
  const canvas=page.locator('.workshop-canvas');
  async function sceneFrame() {
    const cover=await page.addStyleTag({content:'.page-shell,.scene-caption,.motion-controls,nextjs-portal{visibility:hidden!important}.scene:after{opacity:0!important;transition:none!important}'});
    try{return await canvas.screenshot();}finally{await cover.evaluate(el=>el.remove());}
  }
  const before=await sceneFrame();
  await page.getByRole('link',{name:'Projects',exact:true}).click();
  await page.waitForURL(origin+'/projects');
  assert(before.equals(await sceneFrame()),'Navigation resets or blanks shared scene');
  await page.getByRole('button',{name:'Motion paused'}).click();
  await page.getByRole('link',{name:'About',exact:true}).click();
  await page.waitForURL(origin+'/');
  await page.getByRole('heading',{name:"hey, i'm Abdiel Deandra EL Dzaky",exact:true}).waitFor();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('.observatory').dataset.paused==='true');
  assert(await page.locator('.split-word').evaluateAll(nodes=>nodes.every(el=>getComputedStyle(el).opacity==='1')),'Dynamic reduction hides words');
  await page.goBack();
  await page.getByRole('heading',{name:'Projects',exact:true}).waitFor();
  assert(await canvas.count()===1,'Back navigation duplicates renderer');

  const browser=page.context().browser();
  const failing=await browser.newContext();
  await failing.route('**/models/irb52.glb',route=>route.abort());
  const blocked=await failing.newPage();
  await blocked.goto(origin+'/projects');
  await blocked.locator('.scene[data-state=fallback]').waitFor();
  assert(await blocked.getByRole('heading',{name:'Projects',exact:true}).isVisible(),'Asset failure blocks content');
  assert(await blocked.locator('.scene-live canvas').count()===0,'Asset failure leaks canvases');
  await failing.close();

  const delayed=await browser.newContext();
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  let requested=false;
  await delayed.route('**/models/irb52.glb',async route=>{requested=true;await gate;await route.continue().catch(()=>{});});
  const pending=await delayed.newPage();
  await pending.goto(origin);
  await pending.getByRole('button',{name:'Use static view'}).waitFor();
  while(!requested)await pending.waitForTimeout(50);
  await pending.getByRole('button',{name:'Use static view'}).click();
  release();
  await pending.locator('.scene[data-state=static]').waitFor();
  await pending.waitForTimeout(250);
  assert(await pending.locator('.scene-live canvas').count()===0,'Late model resurrects disposed scene');
  await delayed.close();
  assert(errors.length===0,errors.join(';'));
  return {passed:['Full accessible headline; pause/reduced motion leave all words visible.','Shared paused scene pixels survive navigation; back navigation keeps one renderer.','Failed GLB preserves HTML and disposes canvases.','Static mode during pending model load aborts/disposes without late resurrection.'],pageErrors:errors};
}
