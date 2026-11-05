async page=>{
  await page.goto('http://127.0.0.1:3000/about');
  await page.evaluate(()=>{localStorage.setItem('observatory-static','true');localStorage.setItem('observatory-paused','true');});
  const rows=[];
  for(const [width,height] of [[1440,1000],[390,844]]){
    await page.setViewportSize({width,height});
    for(const route of ['','about','projects','experience','writing','cabinet','writing/dua-pilihan-satu-perjalanan']){
      await page.goto('http://127.0.0.1:3000/'+route);
      await page.locator('h1').waitFor({state:'visible'});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(200);
      const name=route.replaceAll('/','-')||'home';
      await page.screenshot({path:`analysis/qa/portfolio-composition/before-${name}-${width}.png`});
      rows.push(await page.evaluate(({route,width})=>{
        const el=document.querySelector('.story-page,.collection,.article,.home-intro'),r=el.getBoundingClientRect();
        return {route,width,left:r.left,right:r.right,blockWidth:r.width,centerOffset:(r.left+r.right-innerWidth)/2};
      },{route,width}));
    }
  }
  return rows;
}
