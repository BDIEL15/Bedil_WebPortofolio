export function sphereSamples(count = 2400): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - ((i + 0.5) / count) * 2;
    const radius = Math.sqrt(1 - y * y);
    positions.set([Math.cos(i * goldenAngle) * radius, y, Math.sin(i * goldenAngle) * radius], i * 3);
  }
  return positions;
}
