'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useMotion } from './motion-provider';

// Adapted from React Bits' Split Text concept: one short word reveal, readable SSR.
export default function SplitText({ text, tag = 'h1', id, className = '' }: {
  text: string; tag?: 'h1' | 'h2' | 'p'; id?: string; className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const played = useRef(false);
  const { paused, reduced } = useMotion();
  useEffect(() => {
    if (paused || reduced || played.current || !ref.current) return;
    played.current = true;
    const context = gsap.context(() => {
      gsap.fromTo('.split-word', { y: 6 }, {
        y: 0, duration: .35, stagger: .025, ease: 'power2.out', clearProps: 'all',
      });
    }, ref);
    // Revert immediately on pause/preference change; never freeze invisible words.
    return () => context.revert();
  }, [paused, reduced]);
  const Tag = tag;
  return <Tag ref={ref} id={id} className={className} aria-label={text}>
    {text.split(' ').map((word, index) => <span key={index} aria-hidden="true"><span className="split-word">{word}</span>{index < text.split(' ').length - 1 ? ' ' : ''}</span>)}
  </Tag>;
}
