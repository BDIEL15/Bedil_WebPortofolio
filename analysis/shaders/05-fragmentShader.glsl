
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uAxisFade;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vAxis;
  void main() {
    float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 3.0);
    float axis = mix(1.0, 0.25 + 0.75 * vAxis, uAxisFade);
    gl_FragColor = vec4(uColor, uOpacity * rim * axis);
  }
