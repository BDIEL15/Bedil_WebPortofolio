'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [['/', 'Home'], ['/about', 'About'], ['/projects', 'Projects'], ['/experience', 'Experience'], ['/writing', 'Writing'], ['/cabinet', 'Cabinet']] as const;
export function Navigation() {
  const pathname = usePathname();
  return <nav aria-label="Main navigation">{links.map(([href, label]) => <Link key={href} href={href} aria-current={(!href.includes('#') && (href === '/' ? pathname === '/' : pathname.startsWith(href))) ? 'page' : undefined}>{label}</Link>)}</nav>;
}
