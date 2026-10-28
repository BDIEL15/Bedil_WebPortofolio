import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { MotionProvider, ReadingContent } from '@/components/motion-provider';
import { SceneHost } from '@/components/scene/scene-host';
import { PageTransition } from '@/components/page-transition';
import { ReadingFrame } from '@/components/reading-frame';
import {HomeArrival} from '@/components/home-arrival';
import {bootScript} from '@/lib/boot-config';
import { getFeaturedExperiences, getPublishedWriting } from '@/lib/content';
import './globals.css';

export const metadata: Metadata = {
  title: 'abdiel',
  applicationName: 'abdiel',
  description: 'Computer Engineering student at Universitas Indonesia. A personal workbench for software, robotics, and a journey of learning.',
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [writing,experiences]=await Promise.all([getPublishedWriting(),getFeaturedExperiences()]);
  const writingPaths=writing.map(item=>`/writing/${item.slug}`);
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:bootScript}}/></head><body><MotionProvider>
    <ReadingContent><a className="skip-link" href="#main">Skip to content</a>
      <div className="page-shell">
        <ReadingFrame />
        <HomeArrival />
        <header className="site-header"><Navigation writingPaths={writingPaths} /></header>
        <main id="main" tabIndex={-1}><PageTransition>{children}</PageTransition></main>
        <footer><p>Abdiel Deandra EL Dzaky</p><span>Personal lab</span></footer>
      </div>
    </ReadingContent>
    <SceneHost writingPaths={writingPaths} experiences={experiences} />
  </MotionProvider></body></html>;
}
