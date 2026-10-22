export function SceneHost() {
  return <aside className="scene" aria-label="Digital Observatory illustration">
    <div className="scene-art" aria-hidden="true">
      <svg viewBox="0 0 600 600" fill="none" className="orbital-field">
        <circle cx="300" cy="300" r="185" fill="#121b1c" />
        <g stroke="#638b86" strokeWidth="1.6">
          <ellipse cx="300" cy="300" rx="228" ry="84" transform="rotate(-30 300 300)" />
          <ellipse cx="300" cy="300" rx="220" ry="106" transform="rotate(38 300 300)" />
          <ellipse cx="300" cy="300" rx="112" ry="202" transform="rotate(20 300 300)" />
        </g>
        <g fill="#a4beb4">
          {Array.from({ length: 72 }, (_, i) => {
            const angle = i * 2.399963;
            const radius = 35 + Math.sqrt(i / 72) * 145;
            return <rect key={i} x={300 + Math.cos(angle) * radius} y={300 + Math.sin(angle) * radius} width={i % 5 === 0 ? 4 : 2} height={i % 5 === 0 ? 4 : 2} opacity={0.3 + (i % 4) * 0.15} />;
          })}
        </g>
        <g className="orbiting-point"><circle cx="496" cy="250" r="5" fill="#dfb689" /><circle cx="496" cy="250" r="12" stroke="#dfb689" strokeWidth="2" /></g>
        <circle cx="300" cy="300" r="7" fill="#e9e2d3" />
      </svg>
    </div>
    <div className="scene-caption"><p>Digital Observatory</p><span>A quiet space for systems & ideas.</span></div>
  </aside>;
}
