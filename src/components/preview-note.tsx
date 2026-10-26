import Link from 'next/link';

export function PreviewNote({active}:{active:boolean}) {
  return active?<aside className="preview-note" aria-label="Layout preview"><span><strong>Layout preview</strong><br/>Sample content for design review.</span><Link href="?preview=0">View real content <span aria-hidden="true">↗</span></Link></aside>:<Link className="preview-invitation" href="?preview=1">Preview a filled-in layout <span aria-hidden="true">↗</span></Link>;
}
