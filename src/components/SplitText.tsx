// The page transition owns the reveal; headings stay still and readable in SSR.
export default function SplitText({ text, tag = 'h1', id, className = '' }: {
  text: string; tag?: 'h1' | 'h2' | 'p'; id?: string; className?: string;
}) {
  const Tag = tag;
  return <Tag id={id} className={className}>{text}</Tag>;
}
