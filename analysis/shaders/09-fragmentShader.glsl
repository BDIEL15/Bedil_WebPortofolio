
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float a = 1.0 - smoothstep(0.0, 0.5, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(uColor, a * a * vAlpha * uOpacity);
  }
