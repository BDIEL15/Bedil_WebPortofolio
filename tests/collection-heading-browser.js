async page=>{
 const errors=[],results=[];page.on('pageerror',e=>errors.push(e.message));
 const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
 for(const [width,height] of [[1440,1000],[768,1024],[390,844],[844,390]]){
  await page.setViewportSize({width,height});
  for(const route of ['projects','experience','writing','cabinet']){
   await page.goto(`http://127.0.0.1:3000/${route}?preview=1`);
   await page.locator('.collection-scroll').waitFor();await page.waitForTimeout(800);
   const before=await page.evaluate(()=>{const r=e=>{const b=e.getBoundingClientRect();return {top:b.top,bottom:b.bottom}};return {heading:r(document.querySelector('.collection-heading')),nav:r(document.querySelector('.site-header')),scroll:r(document.querySelector('.collection-scroll')),footer:r(document.querySelector('footer')),overflow:document.documentElement.scrollWidth>innerWidth}});
   assert(before.heading.top>=before.nav.bottom,`${route}/${width}: header overlap`);
   assert(before.scroll.bottom<=before.footer.top,`${route}/${width}: footer overlap`);
   assert(before.scroll.bottom-before.scroll.top>60,`${route}/${width}: list too short`);
   assert(!before.overflow,`${route}/${width}: horizontal overflow`);
   await page.locator('.collection-scroll').evaluate(el=>el.scrollTop=el.scrollHeight);
   await page.waitForTimeout(100);
   const after=await page.locator('.collection-heading').boundingBox();
   assert(Math.abs(after.y-before.heading.top)<1,`${route}/${width}: title moved`);
   assert(await page.evaluate(()=>scrollY)===0,`${route}/${width}: document scrolled`);
   results.push({route,width,height,scrollTop:await page.locator('.collection-scroll').evaluate(el=>el.scrollTop)});
   if(route==='projects'&&[1440,390].includes(width))await page.screenshot({path:`.taste-skill/pinned-${width}.png`});
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:3000/projects?preview=1');
 const area=page.locator('.collection-scroll');await area.focus();await page.keyboard.press('End');await page.waitForTimeout(150);
 assert(await area.evaluate(el=>el.scrollTop)>0,'Keyboard cannot scroll');
 await area.evaluate(el=>el.scrollTop=0);await page.locator('.showcase-card').first().click();await page.locator('dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');await page.waitForTimeout(200);
 assert(await page.locator('dialog').evaluate(el=>!el.open),'Dialog failed to close');
 await page.getByRole('link',{name:'Writing',exact:true}).click();await page.waitForURL('**/writing?preview=1');
 assert(await page.locator('.collection-scroll').evaluate(el=>el.scrollTop)===0,'Route retained old list scroll');
 assert(errors.length===0,errors.join('\n'));return {results,pageErrors:errors};
}
