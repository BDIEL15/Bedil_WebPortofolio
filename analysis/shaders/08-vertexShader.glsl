
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vAlpha = 0.6 + 0.4 * sin(uTime * 0.7 + aPhase);
    gl_PointSize = aSize * uPixelRatio;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
