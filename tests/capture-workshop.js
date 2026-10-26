async page => {
  await page.goto('http://127.0.0.1:3000/projects');
  await page.evaluate(() => { localStorage.setItem('observatory-paused','true'); localStorage.removeItem('observatory-static'); });
  await page.reload();
  await page.locator('.scene[data-state=ready]').waitFor({ timeout:20000 });
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    await page.setViewportSize({width,height});
    await page.waitForTimeout(500);
    const cover=await page.addStyleTag({content:'.page-shell,.scene-caption,.motion-controls,nextjs-portal{visibility:hidden!important}.scene:after,.scene-scrim{opacity:0!important;transition:none!important}'});
    await page.locator('.workshop-canvas').screenshot({path:`.taste-skill/workshop/poster-${name}.png`});
    await cover.evaluate(el=>el.remove());
    await page.screenshot({path:`.taste-skill/workshop/projects-${name}.png`,fullPage:true});
    await page.getByRole('link',{name:'About',exact:true}).click();
    await page.waitForURL('http://127.0.0.1:3000/');
    await page.waitForTimeout(300);
    await page.screenshot({path:`.taste-skill/workshop/about-${name}.png`,fullPage:true});
    await page.getByRole('link',{name:'Projects',exact:true}).click();
  }
  await page.setViewportSize({width:768,height:1024});
  await page.waitForTimeout(300);
  const cover=await page.addStyleTag({content:'.page-shell,.scene-caption,.motion-controls,nextjs-portal{visibility:hidden!important}.scene:after,.scene-scrim{opacity:0!important;transition:none!important}'});
  await page.locator('.workshop-canvas').screenshot({path:'.taste-skill/workshop/poster-tablet.png'});
  await cover.evaluate(el=>el.remove());
  await page.screenshot({path:'.taste-skill/workshop/projects-tablet.png',fullPage:true});
  console.log('Workshop stills and scene-only posters captured.');
}
