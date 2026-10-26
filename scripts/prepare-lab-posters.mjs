// Capture all camera views first with tests/capture-lab-views.js.
// sharp is already installed by Next.js; no new image dependency is added.
import sharp from 'sharp';

for (const [view,prefix] of [['home','personal-lab'],['projects','lab-projects'],['overview','lab-overview'],['about','lab-about'],['experience','lab-experience'],['writing','lab-writing'],['cabinet','lab-cabinet']]) for (const name of ['desktop', 'tablet', 'mobile']) {
  const input = `.taste-skill/lab-views/poster-${view}-${name}.png`;
  const output = `public/scene/${prefix}-${name}.webp`;
  const result = await sharp(input).webp({ quality: 84 }).toFile(output);
  console.log(`${output}: ${result.width}×${result.height}, ${result.size} bytes`);
}
