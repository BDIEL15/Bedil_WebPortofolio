async page=>{
  const browser=page.context().browser(),contexts=[],errors=[],report=[];
  const assert=(value,message)=>{if(!value)throw Error(message);};
  const origin='http://127.0.0.1:3000';
  try{
    for(const [size,width,height]of [['desktop',1440,900],['tablet',768,1000],['mobile',390,844],['small',320,844]]){
      const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference'});contexts.push(context);
      const p=await context.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));
      for(const [route,count]of [['projects',3],['writing',3],['cabinet',4],['about',0]]){
        await p.goto(`${origin}/${route}?preview=1`);await p.locator('.scene[data-state=ready]').waitFor();
        await p.locator('[aria-label="Layout preview"]').waitFor();
        assert(await p.locator('meta[name=robots]').getAttribute('content').then(v=>v.includes('noindex')),'Preview must be noindex');
        assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} overflows @${width}`);
        assert(await p.locator('nav a[href*="preview=1"]').count()===6,'Preview mode lost from navigation');
        assert(await p.locator('.showcase-card').count()===count,`${route} wrong sample count`);
        if(size!=='small'){
          await p.screenshot({path:`.taste-skill/ui-${route}-${size}-fold.png`});
          await p.locator('h1').scrollIntoViewIfNeeded();await p.screenshot({path:`.taste-skill/ui-${route}-${size}-content.png`});
        }
        if(count){
          const card=p.locator('.showcase-card').first();await card.focus();await p.keyboard.press('Enter');
          await p.locator('dialog[open]').waitFor();
          assert(await p.locator('dialog h2').innerText(), 'Detail title missing');
          assert(await p.locator('dialog').evaluate(el=>el.contains(document.activeElement)),'Modal focus is outside dialog');
          assert(await p.evaluate(()=>document.body.style.overflow==='hidden'),'Background scroll not locked');
          const box=await p.locator('dialog').boundingBox();assert(box.x>=0&&box.width<=width,`Dialog clipped @${width}`);
          await p.locator('nav a').first().evaluate(el=>el.focus());
          assert(!await p.locator('nav a').first().evaluate(el=>el===document.activeElement),'Underlying navigation accepts focus through modal');
          for(let n=0;n<6;n++){await p.keyboard.press('Tab');assert(await p.locator('dialog').evaluate(el=>el.contains(document.activeElement)||document.activeElement===document.body),'Focus reached underlying content');}
          if(size!=='small')await p.screenshot({path:`.taste-skill/ui-${route}-${size}-detail.png`});
          await p.locator('dialog').evaluate(el=>el.scrollTop=el.scrollHeight);
          const closeBox=await p.getByRole('button',{name:'Close detail',exact:true}).boundingBox();
          assert(closeBox.y>=0&&closeBox.y+closeBox.height<=height,'Close button scrolls out of the dialog');
          await p.keyboard.press('Escape');await p.locator('dialog[open]').waitFor({state:'hidden'});
          await p.waitForFunction(()=>document.body.style.overflow!=='hidden');
          assert(await card.evaluate(el=>el===document.activeElement),'Closing dialog loses trigger focus');
          assert(await p.evaluate(()=>document.body.style.overflow!=='hidden'),'Scroll lock remains after close');
          await card.click();await p.getByRole('button',{name:'Close detail',exact:true}).click();
          await p.locator('dialog[open]').waitFor({state:'hidden'});
          await card.click();await p.locator('dialog[open]').waitFor();await p.mouse.click(2,2);
          await p.locator('dialog[open]').waitFor({state:'hidden'});
        }
      }
      const radius=await p.getByRole('button',{name:'Hide text',exact:true}).evaluate(el=>({radius:getComputedStyle(el).borderRadius,height:el.clientHeight}));
      assert(parseFloat(radius.radius)>=radius.height/2,'Control is still square');
      await p.locator('nav').getByRole('link',{name:'Projects',exact:true}).click();await p.waitForURL('**/projects?preview=1');
      await p.getByRole('link',{name:'View real content'}).click();await p.waitForURL('**/projects?preview=0');
      assert(await p.locator('.showcase-card').count()===0,'Sample cards leak into real content');
      assert(!(await p.content()).includes('A small robotics study'),'Sample payload leaks into real content');
      await p.getByRole('link',{name:'Preview a filled-in layout'}).click();await p.locator('.showcase-card').first().waitFor();
      if(size==='mobile'){
        await p.emulateMedia({reducedMotion:'reduce'});await p.locator('.showcase-card').first().click();
        assert(await p.locator('dialog').evaluate(el=>getComputedStyle(el).animationName)==='none','Reduced motion animates dialog');
        await p.keyboard.press('Escape');
      }
      report.push(`${size}: four layouts, sample isolation/noindex, native dialog keyboard/focus/scroll, soft controls and overflow pass.`);
      await context.close();
    }
    const noJs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});contexts.push(noJs);
    const p=await noJs.newPage();await p.goto(origin+'/projects?preview=0');
    assert(await p.getByRole('heading',{name:'Projects',exact:true}).isVisible(),'No-JS real content missing');
    assert(await p.locator('nav a').count()===6,'No-JS navigation missing');
    assert(errors.length===0,errors.join('; '));return {passed:report,pageErrors:errors};
  }finally{for(const context of contexts)await context.close();}
}
