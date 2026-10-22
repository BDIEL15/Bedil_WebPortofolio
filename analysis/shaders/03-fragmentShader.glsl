
  uniform vec2 uLens;
  uniform vec2 uHalf;
  uniform float uRho;
  uniform float uLensFade;
  varying vec2 vUv;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
      mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p = p * 2.07 + 13.0;
      a *= 0.5;
    }
    return v;
  }

  // Clumpy, star-forming blue galaxy: what becomes the arc.
  // The same galaxy as the 3D scene's sprite (makeSpiralTexture): two logarithmic arms
  // (θ = kπ + 2.1 ln(r/8)), tilted -0.35 rad and squashed 2:1, a blue halo and a warm core.
  // Coordinates are mapped into that texture's canvas units (outer arm radius 116).
  vec3 sourceGalaxy(vec2 b) {
    vec2 c = vec2(b.x, -b.y) / (uRho * 1.6) * 116.0; // canvas y points down
    float cr = cos(0.35);
    float sr = sin(0.35);
    vec2 p = vec2(c.x * cr - c.y * sr, c.x * sr + c.y * cr); // undo rotate(-0.35)
    p.y *= 2.0; // undo scale(1, 0.5)
    float r = length(p);
    float a = atan(p.y, p.x);

    float phase = a - 2.1 * log(max(r, 1.0) / 8.0);
    float arm = pow(0.5 + 0.5 * cos(2.0 * phase), 6.0);
    float t = clamp((r - 8.0) / 108.0, 0.0, 1.0);
    float fade = 1.0 - smoothstep(100.0, 122.0, r);
    float grain = 0.55 + 0.9 * fbm(p * 0.09 + 7.0);
    vec3 arms = vec3(0.78, 0.87, 1.0) * arm * (0.6 * (1.0 - t) + 0.12) * grain * fade;

    float h = r / 120.0;
    vec3 halo = mix(vec3(0.75, 0.84, 1.0), vec3(0.47, 0.63, 1.0), h) * mix(0.5, 0.0, smoothstep(0.0, 1.0, h)) * 0.6;
    vec3 core = vec3(1.0, 0.95, 0.86) * (1.0 - smoothstep(0.0, 22.0, r));
    return (arms * 1.6 + halo + core) * 1.1;
  }

  // Faint field galaxies and stars, also behind the lens.
  vec3 field(vec2 b) {
    vec2 g = b * 2.2;
    vec2 id = floor(g);
    float h = hash12(id);
    if (h > 0.32) return vec3(0.0);
    vec2 pos = 0.2 + 0.6 * hash22(id + 5.0);
    vec2 d = fract(g) - pos;
    float a = hash12(id + 9.0) * 6.283;
    d = mat2(cos(a), -sin(a), sin(a), cos(a)) * d;
    d.x *= 1.0 + 2.5 * hash12(id + 2.0);
    float size = 0.012 + 0.03 * hash12(id + 4.0);
    vec3 tint = mix(vec3(1.0, 0.72, 0.45), vec3(0.6, 0.78, 1.0), step(0.55, hash12(id + 1.0)));
    return tint * exp(-dot(d, d) / (size * size)) * (0.35 + 0.65 * hash12(id + 6.0));
  }

  // Massive elliptical: the orange glow inside the ring.
  vec3 lensGalaxy(vec2 t) {
    t.x *= 0.9;
    float r = length(t);
    return vec3(1.0, 0.6, 0.3) * (0.5 * exp(-r * 4.2) + 0.18 * exp(-r * 1.6))
      + vec3(1.0, 0.9, 0.7) * exp(-r * r * 260.0) * 1.1;
  }

  void main() {
    vec2 th = (vUv * 2.0 - 1.0) * uHalf;
    vec2 t = th - uLens;
    float t2 = max(dot(t, t), 1e-5);
    vec2 b = th - uLensFade * t / t2;
    vec3 col = sourceGalaxy(b) + field(b) + lensGalaxy(t) * uLensFade;
    vec2 e = abs(vUv - 0.5) * 2.0;
    float vignette = 1.0 - 0.35 * dot(e, e);
    gl_FragColor = vec4(vec3(0.02, 0.022, 0.03) + col * vignette, 0.9);
  }
