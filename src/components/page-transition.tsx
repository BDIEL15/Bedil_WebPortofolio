'use client';

import { usePathname } from 'next/navigation';
import { useMotion } from './motion-provider';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { paused, reduced } = useMotion();
  return <div key={pathname} className="page-transition" data-animate={!paused && !reduced}>{children}</div>;
}
