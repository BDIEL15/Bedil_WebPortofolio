async page => {
  page.setDefaultTimeout(12000);
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const report = [];
  const errors = [];
  const resetDifferences = [];
  async function compareReset(reference, actual) {
    const difference = await page.evaluate(async ([left, right]) => {
      async function pixels(value) {
        const image = await createImageBitmap(await (await fetch('data:image/png;base64,' + value)).blob());
        const surface = new OffscreenCanvas(image.width, image.height);
        const context = surface.getContext('2d'); context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height).data;
      }
      const [a, b] = await Promise.all([pixels(left), pixels(right)]);
      if (a.length !== b.length) return { mean: 255, fraction: 1 };
      let total = 0, changed = 0;
      for (let i = 0; i < a.length; i += 4) {
        let pixel = 0;
        for (let channel = 0; channel < 3; channel++) pixel += Math.abs(a[i + channel] - b[i + channel]);
        total += pixel; if (pixel) changed++;
      }
      return { mean: total / (a.length * 0.75), fraction: changed / (a.length / 4) };
    }, [reference.toString('base64'), actual.toString('base64')]);
    resetDifferences.push(difference);
    assert(difference.mean < 0.3 && difference.fraction < 0.02, 'Reset frame differs: ' + JSON.stringify(difference));
  }
  page.on('pageerror', error => errors.push(error.message));
  const origin = 'http://127.0.0.1:3000';
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(origin);
  await page.evaluate(() => { localStorage.setItem('observatory-paused', 'true'); localStorage.removeItem('observatory-static'); });
  await page.reload();
  await page.locator('.scene[data-state=ready]').waitFor();
  await page.waitForTimeout(250);
  await page.mouse.move(0, 0);
  const art = page.locator('.scene-art');
  const canvas = page.locator('.workshop-canvas');
  async function sceneFrame() {
    const cover = await page.addStyleTag({content:'.page-shell,.scene-caption,.motion-controls,nextjs-portal{visibility:hidden!important}.scene:after{opacity:0!important;transition:none!important}'});
    try { return await canvas.screenshot(); } finally { await cover.evaluate(el=>el.remove()); }
  }
  assert(await page.locator('.scene-live canvas').count() === 2, 'Expected one WebGL and one ASCII canvas');
  const still = await sceneFrame();
  await page.waitForTimeout(400);
  assert(still.equals(await sceneFrame()), 'Paused WebGL frame changed');
  await page.getByRole('button', { name: 'Explore view', exact: true }).click();
  await art.focus();
  await page.keyboard.press('ArrowRight');
  assert(!still.equals(await sceneFrame()), 'Keyboard orbit did not change camera');
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await compareReset(still, await sceneFrame());
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width * 0.82, box.y + box.height * 0.65);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.94, box.y + box.height * 0.7, { steps: 8 });
  await page.mouse.up();
  await page.mouse.move(0, 0);
  assert(!still.equals(await sceneFrame()), 'Mouse drag did not orbit');
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await compareReset(still, await sceneFrame());
  await art.focus();
  await page.keyboard.press('Escape');
  assert(await page.getByRole('button', { name: 'Explore view', exact: true }).evaluate(el => el === document.activeElement), 'Escape did not restore focus');
  assert(await canvas.evaluate(el => getComputedStyle(el).touchAction) === 'pan-y pinch-zoom', 'Read mode must preserve scroll and zoom');
  report.push('Real WebGL pixels frozen while paused; keyboard/mouse orbit changes view; reset matches reference with pixel tolerance; Escape restores focus.');
  await page.getByRole('button', { name: 'Motion paused' }).click();
  await page.waitForTimeout(250);
  const moving = await sceneFrame();
  await page.waitForTimeout(450);
  assert(!moving.equals(await sceneFrame()), 'Playing WebGL frame did not animate');
  await page.getByRole('button', { name: 'Pause motion' }).click();
  const frozen = await sceneFrame();
  await page.waitForTimeout(350);
  assert(frozen.equals(await sceneFrame()), 'Pause did not stop actual rendering changes');
  await page.getByRole('button', { name: 'Inspect as ASCII' }).click();
  const patch = await page.locator('.scene-ascii').evaluate(el => {
    const ctx = el.getContext('2d');
    const pixels = ctx.getImageData(0,0,el.width,el.height).data;
    let opaque = 0;
    for (let i=3;i<pixels.length;i+=4) if (pixels[i]) opaque++;
    return { corner:pixels[3], fraction:opaque/(el.width*el.height) };
  });
  assert(patch.corner === 0 && patch.fraction > .001 && patch.fraction < .08, 'ASCII canvas must affect only a local patch: '+JSON.stringify(patch));
  await page.getByRole('button', { name: 'Inspect as ASCII' }).click();
  report.push('Play and pause verified by rendered pixels; ASCII canvas is transparent outside its localized patch.');
  const hide = page.getByRole('button', { name: 'Hide text' });
  await hide.focus(); await page.keyboard.press('Space');
  assert(await page.getByRole('button', { name: 'Show text' }).evaluate(el => el === document.activeElement), 'Restore text control lost focus');
  assert(await page.getByRole('navigation').count() === 0, 'Hidden navigation still accessible');
  assert(await page.locator('.reading-content[hidden][inert]').count() === 1, 'Hidden content must be inert');
  await art.focus(); await page.keyboard.press('Escape');
  assert(await page.getByRole('button', { name: 'Hide text' }).evaluate(el => el === document.activeElement), 'Focus view Escape restore');
  assert(await page.getByRole('navigation').isVisible(), 'Text did not restore');
  await page.evaluate(() => { window.__qaCanvas = document.querySelector('.workshop-canvas'); });
  for (const name of Array.from({length:5},()=>['Projects', 'Writing', 'Cabinet', 'About']).flat()) {
    await page.locator('nav').getByRole('link', { name, exact: true }).click();
    await page.waitForURL(origin+(name==='About' ? '/' : '/'+name.toLowerCase()));
    assert(await canvas.evaluate(el => el === window.__qaCanvas), 'Route navigation replaced shared renderer');
    assert(await page.locator('.workshop-canvas').count() === 1, 'Duplicate WebGL canvases');
  }
  report.push('Hide/show text removes hidden content from access/focus; restore and Escape retain focus; rapid routes reuse one renderer.');
  await canvas.evaluate(el => el.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.locator('.scene[data-state=fallback]').waitFor();
  assert(await page.locator('.scene-live canvas').count() === 0, 'Lost-context canvases not removed');
  assert(await page.locator('.scene-poster img').evaluate(el=>el.complete && el.naturalWidth>0), 'Context loss did not reveal poster');
  assert(await page.getByRole('link', { name: 'Explore my work' }).isVisible(), 'Context loss broke content');
  await page.getByRole('button', { name: 'Try 3D again' }).click();
  await page.locator('.scene[data-state=ready]').waitFor();
  await page.getByRole('button', { name: 'Use static view' }).click();
  await page.locator('.scene[data-state=static]').waitFor();
  assert(await page.locator('.scene-live canvas').count() === 0, 'Static mode leaked canvases');
  await page.reload();
  await page.locator('.scene[data-state=static]').waitFor();
  assert(await page.locator('.scene-live canvas').count() === 0, 'Static preference lost on reload');
  assert(await page.locator('.scene-poster').evaluate(el => getComputedStyle(el).animationName) === 'none', 'Static fallback must not animate');
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.getByRole('button', { name: 'Inspect as ASCII' }).isDisabled(), 'Static poster must not claim interactive ASCII');
  await page.getByRole('button', { name: 'Enable 3D' }).click();
  await page.locator('.scene[data-state=ready]').waitFor();
  assert(await page.locator('.workshop-canvas').count() === 1, 'Retry created duplicate renderer');
  report.push('Context loss disposes canvas and reveals poster; retry succeeds; static mode persists without canvases or active ASCII; re-enable creates one renderer.');

  const browser = page.context().browser();
  const noGL = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await noGL.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      return type === 'webgl' || type === 'webgl2' ? null : original.call(this, type, ...args);
    };
  });
  const fallback = await noGL.newPage();
  await fallback.goto(origin);
  await fallback.locator('.scene[data-state=fallback]').waitFor();
  assert(await fallback.getByRole('heading', { level: 1 }).isVisible(), 'WebGL blocked: missing HTML');
  assert(await fallback.getByRole('button', { name: 'Explore view', exact: true }).isDisabled(), 'Unsupported orbit should be disabled');
  assert(await fallback.getByRole('button', { name: 'Inspect as ASCII' }).isDisabled(), 'WebGL blocked: unavailable ASCII must be disabled');
  assert(await fallback.locator('.scene-poster img').evaluate(el=>el.complete && el.naturalWidth>0), 'WebGL blocked: missing poster');
  await fallback.locator('nav').getByRole('link', { name: 'Projects', exact: true }).click();
  await fallback.getByRole('heading', { name: 'Projects', exact: true }).waitFor();
  assert(await fallback.getByRole('heading', { name: 'Projects', exact: true }).isVisible(), 'WebGL blocked: navigation failed');
  await noGL.close();
  report.push('WebGL disabled at context creation: HTML/navigation and poster work; unavailable controls disabled.');

  const mobile = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const touch = await mobile.newPage();
  await touch.goto(origin);
  await touch.locator('.scene[data-state=ready]').waitFor();
  assert(await touch.locator('.scene').getAttribute('data-motion') === 'paused', 'Reduced motion must start paused');
  assert(await touch.locator('.workshop-canvas').evaluate(el => el.style.touchAction) === 'pan-y pinch-zoom', 'Mobile read mode blocks scroll');
  await touch.getByRole('button', { name: 'Explore view', exact: true }).tap();
  assert(await touch.locator('.workshop-canvas').evaluate(el => el.style.touchAction) === 'none', 'Explicit exploration not active');
  await touch.getByRole('button', { name: 'Reset view', exact: true }).tap();
  await touch.getByRole('button', { name: 'Exit exploration', exact: true }).tap();
  assert(await touch.locator('.workshop-canvas').evaluate(el => el.style.touchAction) === 'pan-y pinch-zoom', 'Mobile exit failed to restore scrolling');
  await mobile.close();
  report.push('Touch emulation: reduced-motion paused frame, scroll-first touch action, explicit Explore, reset and restored scroll after exit.');
  assert(errors.length === 0, errors.join('; '));
  return { passed: report, resetDifferences, pageErrors: errors };
}
