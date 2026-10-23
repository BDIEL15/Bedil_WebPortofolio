const samples = Array.from({ length: 17 }, (_, row) => {
  const latitude = (row / 16) * Math.PI;
  const radius = Math.sin(latitude) * 180;
  return Array.from({ length: 32 }, (_, column) => {
    const angle = (column / 32) * Math.PI * 2 + row * 0.12;
    const depth = Math.sin(angle);
    return {
      x: Number((300 + Math.cos(angle) * radius).toFixed(2)),
      y: Number((300 + Math.cos(latitude) * 180 + depth * 24).toFixed(2)),
      opacity: Number((0.2 + (depth + 1) * 0.3).toFixed(2)),
      glyph: ['.', ':', '+', '*'][Math.floor((depth + 1) * 1.49)],
    };
  });
}).flat();

export function SignalField({ sampleId }: { sampleId: string }) {
  return <svg viewBox="0 0 600 600" fill="none" className="orbital-field" aria-hidden="true">
    <defs><clipPath id={sampleId}><circle cx="370" cy="270" r="112" /></clipPath></defs>
    <circle cx="300" cy="300" r="196" fill="#121b1c" />
    <g className="signal-points" fill="#a4beb4">
      {samples.map((point, index) => <rect key={index} x={point.x} y={point.y} width="2.6" height="2.6" opacity={point.opacity} />)}
    </g>
    <g stroke="#638b86" strokeWidth="1.6">
      <ellipse cx="300" cy="300" rx="244" ry="66" transform="rotate(-28 300 300)" />
      <path d="M120 300C180 220 240 380 300 300S420 220 480 300" />
    </g>
    <g className="signal-ascii" clipPath={`url(#${sampleId})`}>
      <circle cx="370" cy="270" r="112" fill="#0c1011" />
      {samples.filter((_, index) => index % 2 === 0).map((point, index) => <text key={index} x={point.x} y={point.y} fill="#dfb689" opacity={point.opacity} fontSize="13" textAnchor="middle">{point.glyph}</text>)}
    </g>
    <g className="orbiting-point"><circle cx="509" cy="187" r="5" fill="#dfb689" /><circle cx="509" cy="187" r="12" stroke="#dfb689" strokeWidth="2" /></g>
    <circle cx="300" cy="300" r="5" fill="#e9e2d3" />
  </svg>;
}
