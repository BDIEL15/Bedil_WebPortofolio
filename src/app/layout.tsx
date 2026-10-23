import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { MotionProvider, ReadingContent } from '@/components/motion-provider';
import { SceneHost } from '@/components/scene/scene-host';
import { PageTransition } from '@/components/page-transition';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Abdiel Deandra EL Dzaky — Digital Observatory', template: '%s — Abdiel Deandra EL Dzaky' },
  description: 'Computer Engineering student at Universitas Indonesia. A personal observatory for software, robotics, and visual explorations.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><body><MotionProvider>
    <ReadingContent><a className="skip-link" href="#main">Skip to content</a>
      <div className="page-shell">
        <header className="site-header"><Navigation /></header>
        <main id="main" tabIndex={-1}><PageTransition>{children}</PageTransition></main>
        <footer><p>Abdiel Deandra EL Dzaky</p><span>Digital Observatory</span></footer>
      </div>
    </ReadingContent>
    <SceneHost />
  </MotionProvider></body></html>;
}
