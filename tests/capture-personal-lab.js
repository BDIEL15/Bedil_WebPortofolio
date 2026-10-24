async page => {
  await page.goto('http://127.0.0.1:3000/');
  await page.evaluate(()=>{localStorage.setItem('observatory-paused','true');localStorage.removeItem('observatory-static');});
  await page.reload();
  await page.locator('.scene[data-state=ready]').waitFor({timeout:30000});
  await page.evaluate(()=>document.fonts.ready);
  for(const [name,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844]]) {
    await page.setViewportSize({width,height});
    await page.waitForTimeout(250);
    const cover=await page.addStyleTag({content:'.page-shell,.scene-caption,.motion-controls,nextjs-portal{visibility:hidden!important}.scene:after{opacity:0!important;transition:none!important}'});
    await page.locator('.workshop-canvas').screenshot({path:`.taste-skill/personal-lab/poster-${name}.png`});
    await cover.evaluate(el=>el.remove());
    await page.screenshot({path:`.taste-skill/personal-lab/home-${name}.png`});
  }
  console.log('Home visual proof and scene-only posters captured at three viewports.');
}
