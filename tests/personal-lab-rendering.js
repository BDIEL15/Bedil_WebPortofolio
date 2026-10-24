async page => {
  const context = await page.context().browser().newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    window.__labFrames = 0;
    const clear = WebGL2RenderingContext.prototype.clear;
    WebGL2RenderingContext.prototype.clear = function(mask) {
      if ((mask & this.COLOR_BUFFER_BIT) && !this.getParameter(this.FRAMEBUFFER_BINDING)) window.__labFrames++;
      return clear.call(this, mask);
    };
  });
  const probe = await context.newPage();
  const assert = (value, message) => { if (!value) throw new Error(message); };
  await probe.goto('http://127.0.0.1:3000/');
  await probe.locator('.scene[data-state=ready]').waitFor();
  await probe.waitForTimeout(400);
  const count = () => probe.evaluate(() => window.__labFrames);
  const initial = await count();
  assert(initial > 0, 'Probe must observe actual rendered frames');
  await probe.waitForTimeout(1000);
  const idleDelta = await count() - initial;
  assert(idleDelta === 0, 'Static proof keeps rendering while idle');
  await probe.getByRole('button', { name: 'Explore view', exact: true }).click();
  await probe.getByRole('button', { name: 'Rotate right', exact: true }).click();
  const interactionDelta = await count() - initial;
  assert(interactionDelta > 0, 'Camera interaction did not render');
  await probe.getByRole('button', { name: 'Exit exploration', exact: true }).click();
  const settled = await count();
  await probe.waitForTimeout(400);
  assert(await count() === settled, 'Renderer did not settle after interaction');
  await probe.setViewportSize({ width: 768, height: 1024 });
  await probe.waitForTimeout(350);
  assert(await count() > settled, 'Resize did not render new framing');
  await context.close();
  return { idleDelta, interactionDelta, condition: 'Chromium touch-size emulation; event-driven static study. No animated FPS or physical-device performance claim.' };
}
