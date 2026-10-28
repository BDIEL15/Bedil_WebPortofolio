async page=>{
  const browser=page.context().browser(),contexts=[],errors=[],report=[];
  const assert=(value,message)=>{if(!value)throw Error(message);};
  const origin='http://127.0.0.1:3000',order=['digital-laboratory','exercise-2026','ime-2026','gdgoc-ui-2026','aignite-2025'];
  try{
    for(const [name,width,height]of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['small',320,844]]){
      const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference'});contexts.push(context);
      await context.addInitScript(()=>localStorage.setItem('observatory-paused','true'));
      const p=await context.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));
      await p.goto(origin+'/experience?preview=1');await p.locator('.scene[data-state=ready]').waitFor();
      const rows=p.locator('.experience-timeline>li');
      assert(JSON.stringify(await rows.evaluateAll(nodes=>nodes.map(n=>n.dataset.experienceId)))===JSON.stringify(order),'Role priority changed');
      assert(await rows.first().locator('h2').innerText()==='Laboratory Assistant','Role is not the primary heading');
      assert((await rows.first().locator('.experience-period').innerText())==='Jul 2026 — Present','Supplied lab period missing');
      assert(await p.locator('.organization-logo').count()===5,'Organization logos missing');
      assert(await p.locator('.experience-achievements li').count()===3,'AIgnite achievements missing');
      const marks=await p.locator('.organization-mark').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().left));
      assert(Math.max(...marks)-Math.min(...marks)<1,'Organization marks do not align');
      assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow @${width}`);
      await p.locator('main').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
      if(name!=='small')await p.screenshot({path:`.taste-skill/experience-${name}-content.png`});
      const cover=await p.addStyleTag({content:'.page-shell{visibility:hidden!important}'});
      assert(await p.locator('.nav-indicator').evaluate(el=>getComputedStyle(el).visibility)==='hidden','Nav marker leaks into scene-only captures');
      await cover.evaluate(el=>el.remove());
      await p.evaluate(()=>localStorage.setItem('observatory-static','true'));await p.reload();await p.locator('.scene[data-state=static]').waitFor();
      await p.waitForFunction(()=>{const img=document.querySelector('.scene-poster img');return img.complete&&img.naturalWidth>0;});
      assert(await p.locator('.scene-poster img').evaluate(el=>el.currentSrc.includes('lab-experience')),'Wrong static Experience poster');
      assert(await rows.count()===5,'Static view removes experience content');
      report.push(`${name}: priority, role/company/year hierarchy, aligned logos, supplied periods and achievements, overflow, capture hygiene and static content pass.`);
      await context.close();
    }
    for(const mode of ['no-js','no-webgl']){
      const context=await browser.newContext({javaScriptEnabled:mode!=='no-js'});contexts.push(context);
      if(mode==='no-webgl')await context.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:original.call(this,type,...args);};});
      const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(origin+'/experience');
      if(mode==='no-webgl')await p.locator('.scene[data-state=fallback]').waitFor();
      assert(await p.locator('.experience-timeline>li').count()===5,`${mode} loses roles`);
      assert(await p.locator('nav a').count()===6,`${mode} loses navigation`);
      await context.close();
    }
    assert(errors.length===0,errors.join('; '));return {passed:report,pageErrors:errors};
  }finally{for(const context of contexts)await context.close();}
}
