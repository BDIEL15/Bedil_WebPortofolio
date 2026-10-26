async page=>{
  const assert=(value,message)=>{if(!value)throw Error(message);},errors=[],report=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const [name,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['small',320,640]]){
    await page.setViewportSize({width,height});
    for(const route of ['about','projects','experience','writing','cabinet','']){
      await page.goto('http://127.0.0.1:3000/'+route+'?preview=1');
      await page.waitForFunction(()=>document.documentElement.style.getPropertyValue('--reading-top'));
      const footer=page.locator('.page-shell>footer'),before=await footer.boundingBox();
      await page.evaluate(()=>window.scrollTo({top:450,behavior:'instant'}));
      await page.waitForTimeout(120);
      const geometry=await page.evaluate(()=>{
        const main=document.querySelector('#main'),header=document.querySelector('.site-header'),footer=document.querySelector('.page-shell>footer');
        const m=main.getBoundingClientRect(),h=header.getBoundingClientRect(),f=footer.getBoundingClientRect(),style=getComputedStyle(main);
        return {top:m.top+parseFloat(style.getPropertyValue('--reading-clip-top')),bottom:m.bottom-parseFloat(style.getPropertyValue('--reading-clip-bottom')),header:h.bottom,footer:f.top,overflow:document.documentElement.scrollWidth>innerWidth};
      });
      assert(geometry.top>=geometry.header+15,`${route}: text enters header @${width}`);
      assert(!geometry.overflow,`${route}: horizontal overflow @${width}`);
      if(route){
        const after=await footer.boundingBox();
        assert(before&&after&&Math.abs(before.y-after.y)<1,`${route}: footer moves @${width}`);
        assert(geometry.bottom<=geometry.footer-15,`${route}: text enters footer @${width}`);
        const controls=await page.locator('.motion-controls').boundingBox();
        assert(!controls||after.y+after.height<=controls.y||after.x+after.width<=controls.x,`Footer overlaps scene controls @${width}`);
      }else assert(!await footer.isVisible(),'Home footer returned');
      if(route==='about'&&name!=='small')await page.screenshot({path:`.taste-skill/reading-frame-${name}.png`});
    }
    await page.goto('http://127.0.0.1:3000/about?preview=1');
    await page.locator('main a').last().focus();await page.waitForTimeout(100);
    const focused=await page.locator('main a').last().boundingBox(),header=await page.locator('.site-header').boundingBox(),footer=await page.locator('.page-shell>footer').boundingBox();
    assert(focused&&header&&footer&&focused.y>=header.y+header.height&&focused.y+focused.height<=footer.y,'Focused link is clipped');
    report.push(`${name}: all six routes, scroll clipping, fixed footer, control clearance, keyboard focus and no overflow pass`);
  }
  assert(errors.length===0,errors.join('; '));return {passed:report,pageErrors:errors};
}
