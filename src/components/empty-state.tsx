import Link from 'next/link';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty-state"><h2>{title}</h2><p>{description}</p><Link className="text-link" href="/">Back to About <span aria-hidden="true">↗</span></Link></div>;
}
