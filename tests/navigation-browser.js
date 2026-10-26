async page=>{
  const browser=page.context().browser(),contexts=[],errors=[],report=[];
  const assert=(value,message)=>{if(!value)throw Error(message);};
  const origin='http://127.0.0.1:3000';
  async function aligned(p){
    await p.waitForFunction(()=>{
      const pill=document.querySelector('.nav-indicator'),active=document.querySelector('nav a[aria-current]');
      if(!pill||!active)return false;
      const a=pill.getBoundingClientRect(),b=active.getBoundingClientRect();
      return ['x','y','width','height'].every(key=>Math.abs(a[key]-b[key])<1);
    });
  }
  try{
    for(const [size,width,height]of [['desktop',1440,900],['tablet',768,1000],['mobile',390,844],['small',320,700]]){
      const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference'});contexts.push(context);
      const p=await context.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));
      await p.goto(origin+'/?preview=1');await p.locator('.scene[data-state=ready]').waitFor();await aligned(p);
      await p.locator('html:not([data-lab-boot])').waitFor();
      assert(await p.locator('.home-details,#experience').count()===0,'Home Experience returned');
      assert(!await p.locator('footer').isVisible(),'Home footer strip returned');
      assert(await p.locator('.home-links a').count()===4,'Home social links missing');
      assert(JSON.stringify(await p.locator('.home-links a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href'))))===JSON.stringify(['https://github.com/BDIEL15','https://www.linkedin.com/in/abdieldeandra/','https://www.instagram.com/abdiel.deandra','mailto:abdiel.deandra@gmail.com']),'Social destinations changed');
      assert(await p.locator('.home-links a[target="_blank"][rel="noopener noreferrer"]').count()===3,'External social links need isolated tabs');
      assert(await p.locator('.social-link').evaluateAll(nodes=>nodes.every(n=>n.getAttribute('aria-label')&&n.clientWidth>=44&&n.clientHeight>=44)),'Social links need accessible labels and touch targets');
      for(const icon of ['github','linkedin','instagram','email'])assert((await p.request.get(origin+'/icons/'+icon+'.svg')).ok(),`Missing local SVG: ${icon}`);
      await p.locator('.social-link').first().focus();
      assert(await p.locator('.social-link').first().locator('.social-label').isVisible(),'Keyboard tooltip missing');
      assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Home overflows');
      assert(await p.locator('.site-header').evaluate(el=>getComputedStyle(el).position)==='fixed','Header is not fixed');
      if(size!=='small')await p.screenshot({path:`.taste-skill/header-home-${size}.png`});
      await p.evaluate(()=>{
        window.__pillFrames=[];const pill=document.querySelector('.nav-indicator'),animate=pill.animate.bind(pill);
        pill.animate=(...args)=>{window.__pillFrames.push(args[0]);return animate(...args);};
      });
      await p.locator('nav').getByRole('link',{name:'Cabinet',exact:true}).click();await p.waitForURL('**/cabinet?preview=1');
      const clearance=await p.locator('.site-header').evaluate(el=>({bottom:el.getBoundingClientRect().bottom,clip:parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-snapshot-clearance'))}));
      assert(clearance.clip>=clearance.bottom+10,'Native content snapshots can cover the fixed header');
      await aligned(p);
      assert(await p.evaluate(()=>window.__pillFrames.length)>0,'Click does not animate marker');
      assert(await p.evaluate(()=>window.__pillFrames.every(frames=>frames.every(f=>Object.keys(f).every(k=>k==='transform')))),'Marker animates layout properties');
      const head=await p.locator('.site-header').boundingBox();
      await p.evaluate(()=>window.scrollTo({top:600,behavior:'instant'}));assert(await p.evaluate(()=>scrollY)>0,'Collection not scrollable');
      const after=await p.locator('.site-header').boundingBox();assert(Math.abs(head.y-after.y)<.5,'Header scrolls away');
      const main=await p.locator('main').boundingBox();assert(main.y+600>head.y+head.height,'Header covers starting content');
      if(size!=='small')await p.screenshot({path:`.taste-skill/header-scrolled-${size}.png`});
      await p.locator('nav').getByRole('link',{name:'About',exact:true}).click();
      await p.waitForTimeout(60);await p.locator('nav').getByRole('link',{name:'Writing',exact:true}).click();
      await p.waitForTimeout(60);await p.locator('nav').getByRole('link',{name:'Projects',exact:true}).click();
      await p.waitForURL('**/projects?preview=1');await aligned(p);
      // A canceled route need not enter history; create two committed entries for Back/Forward.
      await p.locator('nav').getByRole('link',{name:'Writing',exact:true}).click();await p.waitForURL('**/writing?preview=1');await aligned(p);
      await p.locator('nav').getByRole('link',{name:'Projects',exact:true}).click();await p.waitForURL('**/projects?preview=1');await aligned(p);
      await p.goBack();await p.waitForURL('**/writing?preview=1');await aligned(p);
      await p.goForward();await p.waitForURL('**/projects?preview=1');await aligned(p);
      await p.locator('nav').getByRole('link',{name:'Home',exact:true}).focus();await p.keyboard.press('Enter');
      await p.waitForURL('**/?preview=1');await aligned(p);
      await p.getByRole('button',{name:'Pause motion',exact:true}).click();
      const paused=await p.evaluate(()=>window.__pillFrames.length);
      await p.locator('nav').getByRole('link',{name:'Experience',exact:true}).click();await p.waitForURL('**/experience?preview=1');await aligned(p);
      assert(await p.evaluate(()=>window.__pillFrames.length)===paused,'Pause still animates marker');
      await p.getByRole('button',{name:'Motion paused',exact:true}).click();await p.emulateMedia({reducedMotion:'reduce'});
      await p.locator('nav').getByRole('link',{name:'Home',exact:true}).click();await p.waitForURL('**/?preview=1');await aligned(p);
      assert(await p.evaluate(()=>window.__pillFrames.length)===paused,'Reduced motion animates marker');
      await p.setViewportSize({width:width===1440?390:1440,height});await aligned(p);
      report.push(`${size}: clean Home, fixed header through scroll, transform-only active marker, rapid/history/keyboard/preview, pause/reduced and resize pass.`);
      await context.close();
    }
    const legacy=await browser.newContext();contexts.push(legacy);const p=await legacy.newPage();
    await p.goto(origin+'/?preview=1#experience');await p.waitForURL('**/experience?preview=1');
    assert(await p.locator('.experience-page').isVisible(),'Legacy bookmark does not reach Experience');
    const noJs=await browser.newContext({javaScriptEnabled:false});contexts.push(noJs);const fallback=await noJs.newPage();await fallback.goto(origin);
    assert(await fallback.locator('nav a[aria-current=page]').innerText()==='Home','No-JS active link missing');
    assert(await fallback.locator('.home-links a').count()===4,'No-JS social links missing');
    assert(await fallback.locator('nav a[aria-current=page]').evaluate(el=>getComputedStyle(el).backgroundColor)!=='rgba(0, 0, 0, 0)','No-JS active background missing');
    assert(errors.length===0,errors.join('; '));return {passed:report,pageErrors:errors};
  }finally{for(const context of contexts)await context.close();}
}
