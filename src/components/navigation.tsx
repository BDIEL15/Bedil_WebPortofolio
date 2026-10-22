'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [['/', 'About'], ['/projects', 'Projects'], ['/writing', 'Writing'], ['/cabinet', 'Cabinet']] as const;
export function Navigation() {
  const pathname = usePathname();
  return <nav aria-label="Main navigation">{links.map(([href, label]) => <Link key={href} href={href} aria-current={(href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'page' : undefined}>{label}</Link>)}</nav>;
}
