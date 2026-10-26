async page=>{
  const errors=[],report=[],assert=(value,message)=>{if(!value)throw Error(message);};
  page.on('pageerror',error=>errors.push(error.message));
  for(const [name,width]of [['desktop',1440],['mobile',390]]){
    await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:3000/');
    await page.evaluate(()=>{localStorage.removeItem('observatory-static');localStorage.setItem('observatory-paused','true');});await page.reload();
    await page.locator('.scene[data-state=ready]').waitFor();
    assert(await page.getByRole('button',{name:'Explore view',exact:true}).isVisible(),'Home Explore missing');
    assert(await page.getByRole('button',{name:'Use static view',exact:true}).isVisible(),'Home static missing');
    for(const route of ['About','Projects','Experience','Writing','Cabinet']){
      await page.locator('nav').getByRole('link',{name:route,exact:true}).click();await page.waitForURL('**/'+route.toLowerCase());
      assert(await page.locator('.scene-caption').count()===0,`${route}: redundant reading controls`);
      if(route==='Experience')await page.screenshot({path:`.taste-skill/home-controls-${name}-experience.png`});
      await page.getByRole('button',{name:'Hide text',exact:true}).click();
      await page.locator('.scene[data-exploring=true]').waitFor();
      assert(await page.getByRole('button',{name:'Rotate left',exact:true}).isVisible(),`${route}: exploration controls missing`);
      assert(await page.locator('.static-control').count()===0,`${route}: static control outside Home`);
      await page.locator('.scene-art').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('Escape');
      assert(await page.getByRole('navigation').isVisible(),`${route}: Escape does not restore reading`);
    }
    await page.locator('nav').getByRole('link',{name:'Home',exact:true}).click();await page.waitForURL('http://127.0.0.1:3000/');
    await page.getByRole('button',{name:'Use static view',exact:true}).click();await page.locator('.scene[data-state=static]').waitFor();
    await page.locator('nav').getByRole('link',{name:'Projects',exact:true}).click();await page.waitForURL('**/projects');
    assert(await page.locator('.scene-caption').count()===0,'Static preference exposes controls outside Home');
    assert(await page.locator('.scene[data-state=static]').count()===1,'Static preference lost on route');
    await page.locator('nav').getByRole('link',{name:'Home',exact:true}).click();await page.waitForURL('http://127.0.0.1:3000/');
    await page.getByRole('button',{name:'Enable 3D',exact:true}).click();await page.locator('.scene[data-state=ready]').waitFor();
    report.push(`${name}: controls only on Home; five other routes retain Hide Text, rotation, Escape and static preference`);
  }
  assert(errors.length===0,errors.join('; '));return {passed:report,pageErrors:errors};
}
