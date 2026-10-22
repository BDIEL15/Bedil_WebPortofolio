import type { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { MotionProvider } from '@/components/motion-provider';
import { SceneHost } from '@/components/scene/scene-host';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Abdiel Deandra EL Dzaky — Digital Observatory', template: '%s — Abdiel Deandra EL Dzaky' },
  description: 'Computer Engineering student at Universitas Indonesia. A personal observatory for software, robotics, and visual explorations.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><MotionProvider>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><Link href="/" className="wordmark" aria-label="Abdiel, About">abdiel<span aria-hidden="true">.</span></Link><Navigation /></header>
    <div className="page-layout"><main id="main" tabIndex={-1}>{children}<footer><p>Abdiel Deandra EL Dzaky</p><span>Digital Observatory</span></footer></main><SceneHost /></div>
  </MotionProvider></body></html>;
}
