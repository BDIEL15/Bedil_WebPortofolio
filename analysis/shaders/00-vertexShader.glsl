
  uniform vec2 uLens;
  uniform float uDepth;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    vec2 d = p.xz - uLens;
    float well = uDepth / (1.0 + dot(d, d) / 1.6);
    p.y -= well;
    float edge = (1.0 - smoothstep(9.0, 15.0, abs(p.x)))
      * smoothstep(-18.0, -12.0, p.z)
      * (1.0 - smoothstep(7.0, 12.0, p.z));
    vAlpha = edge * (1.0 + 1.1 * well);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
