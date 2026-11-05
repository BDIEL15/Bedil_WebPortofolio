async page=>{
  const failures=[],checks=[],errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const check=(ok,label)=>{checks.push({ok,label});if(!ok)failures.push(label);};
  await page.goto('http://127.0.0.1:3000/about');
  await page.evaluate(()=>{localStorage.setItem('observatory-static','true');localStorage.setItem('observatory-paused','true');});
  for(const [width,height]of [[1440,1000],[768,1024],[390,844],[320,568],[844,390]]){
    await page.setViewportSize({width,height});
    for(const route of ['about','experience','writing','cabinet','writing/dua-pilihan-satu-perjalanan']){
      await page.goto('http://127.0.0.1:3000/'+route);
      await page.locator('h1').waitFor({state:'visible'});await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(()=>document.documentElement.style.getPropertyValue('--reading-top'));
      if(await page.locator('.collection-scroll').count())await page.waitForFunction(()=>document.querySelector('.collection').style.getPropertyValue('--collection-height'));
      const result=await page.evaluate(()=>{
        const el=document.querySelector('.story-page,.collection,.article'),r=el.getBoundingClientRect(),main=document.querySelector('main'),ms=getComputedStyle(main);
        const text=document.querySelector('.about-copy,.experience-entry,.article-scroll,.content-list,.cabinet-item');
        return {offset:(r.left+r.right-innerWidth)/2,width:r.width,overflow:document.documentElement.scrollWidth-innerWidth,textAlign:text?getComputedStyle(text).textAlign:'left',clip:ms.clipPath};
      });
      check(Math.abs(result.offset)<=4,`${route}/${width}: content centered (offset ${result.offset})`);
      check(result.overflow<=1,`${route}/${width}: no horizontal overflow`);
      check(result.textAlign!=='center',`${route}/${width}: running copy left aligned`);
      if(route.includes('/'))check(result.clip!=='none',`${route}/${width}: article respects reading boundary`);
      const area=page.locator('.collection-scroll');
      if(await area.count()){
        const before=await page.locator('.collection-heading').boundingBox();
        await area.focus();await page.keyboard.press('End');
        const after=await page.locator('.collection-heading').boundingBox();
        check(Math.abs(before.y-after.y)<1,`${route}/${width}: heading remains stationary`);
      }
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:3000/projects');
  const first=page.locator('[data-project-id=arduimania]');await first.focus();await page.keyboard.press('Enter');
  await page.locator('dialog[open]').waitFor();
  const order=await page.locator('dialog').evaluate(d=>{
    const title=d.querySelector('h2').getBoundingClientRect(),media=d.querySelector('.project-gallery').getBoundingClientRect();
    return {title:title.top,media:media.top};
  });
  check(order.title<order.media,'project title precedes media');
  check(await page.locator('dialog .project-gallery-controls button').count()===0,'single photo has no redundant arrows');
  await page.keyboard.press('Escape');check(await first.evaluate(el=>el===document.activeElement),'dialog returns focus');
  await page.goto('http://127.0.0.1:3000/');await page.locator('h1').waitFor({state:'visible'});
  await page.getByRole('button',{name:'Hide text',exact:true}).click();
  check(!/drag|arrow keys/i.test(await page.locator('.scene-art').getAttribute('aria-label')),'static mode does not promise rotation');
  await page.getByRole('button',{name:'Show text',exact:true}).click();
  check(errors.length===0,'no runtime page errors: '+errors.join('; '));
  if(failures.length)throw Error(JSON.stringify({failures,passed:checks.length-failures.length}));
  return {passed:checks.length,errors};
}
