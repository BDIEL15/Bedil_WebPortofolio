async page=>{
  const errors=[],results=[],assert=(ok,message)=>{if(!ok)throw Error(message);};
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:3000/about');
  await page.evaluate(()=>{localStorage.setItem('observatory-static','true');localStorage.setItem('observatory-paused','true');});
  for(const [width,height] of [[1440,1000],[390,844]]){
    await page.setViewportSize({width,height});
    for(const route of ['','about','projects','experience','writing','cabinet','writing/dua-pilihan-satu-perjalanan']){
      const response=await page.goto('http://127.0.0.1:3000/'+route);
      assert(response.status()===200,`${route}: HTTP ${response.status()}`);
      await page.locator('h1').waitFor({state:'visible'});await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(()=>document.documentElement.style.getPropertyValue('--reading-top'));
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
      assert(overflow<=1,`${route}/${width}: overflow`);
      if(route==='experience'){
        assert((await page.locator('[data-experience-id=exercise-2026]').innerText()).includes('UI development for the Exertion 2026 website'),'Confirmed EXERCISE copy missing');
        assert(!(await page.locator('[data-experience-id=gdgoc-ui-2026]').innerText()).includes('achievements'),'GDGoC has invented achievements');
      }
      await page.screenshot({path:`analysis/qa/portfolio-composition/final-${route.replaceAll('/','-')||'home'}-${width}.png`});
      results.push({route,width,status:response.status(),overflow});
    }
  }
  await page.goto('http://127.0.0.1:3000/projects');
  const card=page.locator('[data-project-id=arduimania]');await card.click();await page.locator('dialog[open]').waitFor();
  await page.screenshot({path:'analysis/qa/portfolio-composition/final-project-detail-390.png'});
  await page.keyboard.press('Escape');assert(await card.evaluate(el=>el===document.activeElement),'Production dialog lost focus');
  await page.goto('http://127.0.0.1:3000/experience');
  await page.evaluate(()=>localStorage.setItem('observatory-static','false'));await page.reload();
  await page.locator('.scene[data-state=ready]').waitFor({timeout:20000});
  const badgeResources=await page.evaluate(()=>performance.getEntriesByType('resource').filter(e=>/-id-512\.webp/.test(e.name)).map(e=>e.name));
  assert(badgeResources.length===3,'3D badge derivative images were not loaded');
  await page.screenshot({path:'analysis/qa/portfolio-composition/final-experience-3d-390.png'});
  await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(150);
  await page.screenshot({path:'analysis/qa/portfolio-composition/final-experience-3d-1440.png'});
  await page.evaluate(()=>window.__compositionCanvas=document.querySelector('.scene-live canvas'));
  await page.locator('.site-header nav').getByRole('link',{name:'Home',exact:true}).click();
  await page.waitForURL('http://127.0.0.1:3000/');await page.locator('.scene[data-state=ready]').waitFor();
  assert(await page.evaluate(()=>window.__compositionCanvas===document.querySelector('.scene-live canvas')),'3D renderer recreated during client navigation');
  assert(errors.length===0,errors.join('; '));
  return {results,badgeResources,dialogFocus:true,pageErrors:errors};
}
