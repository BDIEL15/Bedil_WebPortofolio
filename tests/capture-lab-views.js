async page => {
  await page.goto('http://127.0.0.1:3000/');
  await page.evaluate(() => { localStorage.setItem('observatory-paused','true');localStorage.removeItem('observatory-static'); });
  await page.reload();
  for (const mode of ['home','projects','overview','projects-overview','about','experience','about-overview','experience-overview','writing','cabinet','writing-overview','cabinet-overview']) {
    const route=mode==='overview'||mode==='home'?'':mode.replace('-overview','');
    await page.goto('http://127.0.0.1:3000/' + route);
    await page.locator('.scene[data-state=ready]').waitFor({timeout:30000});
    await page.waitForLoadState('networkidle');
    if (mode.endsWith('overview')) await page.getByRole('button',{name:'Hide text',exact:true}).click();
    for (const [size,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844]]) {
      await page.setViewportSize({width,height});
      await page.waitForTimeout(200);
      await page.locator('.scene-live[data-camera-motion=idle]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      const cover=await page.addStyleTag({content:'.page-shell,.scene-caption,.motion-controls,nextjs-portal{visibility:hidden!important}.scene:after,.scene-scrim{opacity:0!important;transition:none!important}'});
      await page.locator('.workshop-canvas').screenshot({path:`.taste-skill/lab-views/poster-${mode}-${size}.png`});
      await cover.evaluate(el=>el.remove());
      await page.waitForTimeout(300);
      await page.screenshot({path:`.taste-skill/lab-views/${mode}-${size}.png`});
    }
  }
}
