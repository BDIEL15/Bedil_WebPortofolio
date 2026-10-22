
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = 1.0 - smoothstep(0.0, 0.5, d);
    float core = 1.0 - smoothstep(0.12, 0.2, d);
    gl_FragColor = vec4(vColor * (glow * glow * 0.8 + core * 0.6), vAlpha * glow);
  }
