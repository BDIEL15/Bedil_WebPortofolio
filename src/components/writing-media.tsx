import {ProjectGallery} from './project-gallery';

const base='/writing/ime-ftui-2026';

export function CalculusPreview() {
  return <section className="writing-media" aria-label="Calculus solutions PDF preview">
    <p className="writing-media-note">Calculus solutions · PDF, 5 pages</p>
    <ProjectGallery smooth label="Calculus solutions" itemLabel="Page" aspectRatio="595.276 / 841.89" media={Array.from({length:5},(_,i)=>({src:`${base}/calculus-page-${i+1}.webp`,alt:`Calculus solutions in LaTeX — page ${i+1}`,width:893,height:1263}))}/>
    <p className="writing-media-links"><a href={`${base}/pembahasan-soal.pdf`} target="_blank" rel="noopener noreferrer">Open full PDF ↗</a><a href={`${base}/pembahasan-soal.pdf`} download>Download PDF</a></p>
  </section>;
}

export function FeedPreview() {
  const slides=[['cover','Cover — A light blue spirit beneath the Rotunda sky'],['slide-1','Slide 1 — The roar of the light blue wolf'],['slide-2','Slide 2 — For those who placed their hopes in us'],['slide-3','Slide 3 — Keeping the meaning of family alive']];
  return <section className="writing-media writing-feed" aria-label="Kominfo feed designs">
    <p className="writing-media-note">Kominfo assignment · 4 slides</p>
    <ProjectGallery smooth label="Kominfo feed designs" itemLabel="Slide" aspectRatio="4 / 5" media={slides.map(([file,alt])=>({src:`${base}/${file}.png`,alt,width:1080,height:1350}))}/>
    <p className="writing-media-note">Swipe or use the arrows · Click to view full size.</p>
  </section>;
}

export const writingComponents={CalculusPreview,FeedPreview};
