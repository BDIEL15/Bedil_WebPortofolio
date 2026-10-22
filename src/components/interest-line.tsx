'use client';

import { useEffect, useState } from 'react';
import { useMotion } from './motion-provider';

export function InterestLine({ phrases, description }: { phrases: string[]; description: string }) {
  const { paused } = useMotion();
  const [typing, setTyping] = useState({ index: 0, length: phrases[0].length, deleting: true });
  useEffect(() => {
    if (paused) return;
    const phrase = phrases[typing.index];
    const delay = typing.length === phrase.length ? 2200 : typing.length === 0 ? 400 : typing.deleting ? 45 : 85;
    const timeout = setTimeout(() => {
      setTyping(current => {
        if (current.deleting && current.length === 0) return { index: (current.index + 1) % phrases.length, length: 0, deleting: false };
        if (!current.deleting && current.length === phrase.length) return { ...current, deleting: true };
        return { ...current, length: current.length + (current.deleting ? -1 : 1) };
      });
    }, delay);
    return () => clearTimeout(timeout);
  }, [paused, phrases, typing]);
  return <p className="interest-line"><span className="sr-only">{description}</span><span aria-hidden="true">{paused ? phrases[0] : phrases[typing.index].slice(0, typing.length)}<span className="cursor">_</span></span></p>;
}
