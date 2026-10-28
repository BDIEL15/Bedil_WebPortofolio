import Link from 'next/link';
import Image from 'next/image';
import { getAbout } from '@/lib/content';
import SplitText from '@/components/SplitText';
import {isUiPreview,previewMetadata,type PreviewSearch} from '@/lib/ui-preview';

export function generateMetadata({searchParams}:{searchParams:PreviewSearch}) {return previewMetadata('About','About Abdiel Deandra EL Dzaky, Computer Engineering student at Universitas Indonesia.',searchParams);}
export default async function About({searchParams}:{searchParams:PreviewSearch}) {
  const [about, preview] = await Promise.all([getAbout(), isUiPreview(searchParams)]);
  return <section className="story-page about-page" aria-labelledby="about-page-title">
    <div className="about-heading">
      <div className="about-portrait-frame"><Image className="about-portrait" src={about.portrait.src} alt={about.portrait.alt} width={about.portrait.width} height={about.portrait.height} sizes="(max-width: 699px) 104px, 144px" /></div>
      <SplitText tag="h1" id="about-page-title" text={about.heading} />
    </div>
    <div className="about-copy">{about.paragraphs.map((paragraph, index) => <p key={paragraph} className={index === 0 ? 'story-lead' : undefined}>{paragraph}</p>)}</div>
    <div className="about-explore">
      <p>Still curious about me? Try exploring these.</p>
      <nav className="about-explore-links" aria-label="Explore more about Abdiel">
        {['Projects', 'Experience', 'Writing', 'Cabinet'].map((label, index) => <span key={label}>{index > 0 && <span className="about-link-divider" aria-hidden="true">/</span>}<Link href={'/' + label.toLowerCase() + (preview ? '?preview=1' : '')}>{label}</Link></span>)}
      </nav>
    </div>
  </section>;
}
