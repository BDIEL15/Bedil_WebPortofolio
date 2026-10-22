
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vAxis;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vAxis = position.y + 0.5; // 0 at a cone's base, 1 at its apex
    gl_Position = projectionMatrix * mv;
  }
