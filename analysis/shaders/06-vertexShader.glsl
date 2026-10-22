
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uScale;
  uniform vec2 uFog;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / -mv.z;
    vColor = aColor;
    vAlpha = 1.0 - smoothstep(uFog.x, uFog.y, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
