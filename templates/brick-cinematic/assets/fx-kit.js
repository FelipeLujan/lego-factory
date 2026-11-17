/* ============================================================================
   FX KIT (brick-cinematic template): environments + effects for the brick-game look.
   Loaded by index.html after brick-kit.js. Do not edit for one video.

   In scene.js build(ctx):   const X = FXKIT.setup(ctx);
     sky        X.sky(parent, preset|opts) -> dome (opts: zenith, horizon, ground, sunDir, sunColor, sunSize, haze, clouds, cloudColor, cloudShade, stars)
                X.skyEnv(name, preset|opts)  -> makes a reflection map that matches that sky (use look.env = name)
                X.SKIES.{day, golden, overcast, night, space}  presets
     ground     X.ground(parent, {size, y, colors:[a,b,c], studs, rough, repeat, seed, kind:"flats"|"sand"|"concrete"|"grass"})
     water      X.ocean(parent, {size, y, color, deep, rough}) -> mesh; call X.tickOcean(mesh, t) each frame
     particles  X.particles(parent, {max, blend:"add"|"smoke"}) -> sys; sys.begin(); X.emit(sys, t, opts) ...; sys.end()
     flame      X.flame(parent, {r, len, core, edge}) -> mesh (Raptor-style plume with shock diamonds); X.setFlame(mesh, t, {len, power})
     debris     X.debris(parent, {n, colors, size}) -> obj; X.burst(obj, t, t0, [x,y,z], {speed, up, gravity, spin})  brick pieces flying
     space      X.stars(parent, {n, r}), X.earth(parent, {r}) -> {group, globe, clouds, atmo}; X.glowShell(geo, color, power)
     shapes     X.roundBox(w, h, d, r, seg)  (bevelled brick-like box)
     BRICK LOOK X.brickWater(parent, {nx, nz, tile, x, z, y, color}) + X.tickBrickWater(w, t, fx)  translucent tiles that bob (water is ALWAYS tiles in this style)
                X.tileOcean(parent, {size, y, color, tile})  tiled water to the horizon
                X.brickClouds(parent, {n, area, y, size})   clouds built from white bricks
                X.puffs(parent, {max}) + X.emitPuffs(P, t, opts)  round white bricks: steam, smoke, splash (mix with soft X.particles)
   Everything is a pure function of t (no Math.random). FX objects go on layer 2 (skipped by the DOF depth pass).
   ============================================================================ */
(function () {
  function rand(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  const clamp01 = (x) => Math.max(0, Math.min(1, x));

  function setup(ctx) {
    const { THREE, renderer } = ctx;
    const X = { rand };
    ctx.waitFor = ctx.waitFor || [];
    const fxLayer = (o) => { o.traverse((m) => m.layers.set(2)); return o; };
    X.fxLayer = fxLayer;

    // ------------------------------------------------------------------ textures
    const ANISO = renderer.capabilities.getMaxAnisotropy();
    function canvasTex(w, h, draw, srgb) {
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      draw(c.getContext("2d"), w, h, c);
      const t = new THREE.CanvasTexture(c); t.anisotropy = ANISO; if (srgb !== false) t.encoding = THREE.sRGBEncoding;
      return t;
    }
    X.canvasTex = canvasTex;
    const loader = new THREE.TextureLoader();
    function loadTex(url, srgb) {
      let res; const p = new Promise((r) => (res = r)); ctx.waitFor.push(p);
      const t = loader.load(url, () => res(), undefined, () => { console.warn("FXKIT: could not load", url); res(); });
      t.anisotropy = ANISO; if (srgb !== false) t.encoding = THREE.sRGBEncoding;
      return t;
    }
    X.loadTex = loadTex;
    // normal map from a height function h(u,v) in 0..1 (tileable if h is)
    function normalTex(size, h, strength) {
      return canvasTex(size, size, (g, W, H) => {
        const hf = new Float32Array(W * H);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) hf[y * W + x] = h(x / W, y / H);
        const img = g.createImageData(W, H);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          const l = hf[y * W + ((x - 1 + W) % W)], r = hf[y * W + ((x + 1) % W)], u = hf[((y - 1 + H) % H) * W + x], d = hf[((y + 1) % H) * W + x];
          let nx = (l - r) * strength, ny = (d - u) * strength, nz = 1; const L = Math.hypot(nx, ny, nz); nx /= L; ny /= L; nz /= L;
          const i = (y * W + x) * 4; img.data[i] = (nx * 0.5 + 0.5) * 255; img.data[i + 1] = (ny * 0.5 + 0.5) * 255; img.data[i + 2] = (nz * 0.5 + 0.5) * 255; img.data[i + 3] = 255;
        }
        g.putImageData(img, 0, 0);
      }, false);
    }
    X.normalTex = normalTex;
    // one brick stud per tile (bevelled cylinder) -> tile this with repeat = size / 0.4
    X.studNormal = normalTex(64, (u, v) => { const r = Math.hypot(u - 0.5, v - 0.5); return r < 0.27 ? 1 : r < 0.32 ? 1 - (r - 0.27) / 0.05 : 0; }, 6);
    // value noise for canvas painting
    function vnoise(x, y, seed) {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      const h = (a, b) => rand(a * 57.3 + b * 131.7 + seed * 7.1);
      const s = (k) => k * k * (3 - 2 * k);
      const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
      return a + (b - a) * s(xf) + (c - a) * s(yf) + (a - b - c + d) * s(xf) * s(yf);
    }
    function fbm(x, y, seed, oct) { let v = 0, a = 0.5, f = 1; for (let i = 0; i < (oct || 5); i++) { v += a * vnoise(x * f, y * f, seed + i * 13); f *= 2.03; a *= 0.5; } return v; }
    X.fbm = fbm;

    // ------------------------------------------------------------------ LDraw parts (real brick geometry; assets/ldraw-parts.js)
    // X.ld(name, scale) -> BufferGeometry (Y-up, origin = top surface of the part, 1 stud pitch = 20 * scale). null if missing.
    const LDC = {};
    const unb = (s, T) => { const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return new T(u.buffer); };
    X.ld = (name, scale) => {
      const P = window.LDRAW_PARTS && window.LDRAW_PARTS[name]; if (!P) return null;
      if (!LDC[name]) { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(unb(P.p, Float32Array), 3)); g.setAttribute("normal", new THREE.BufferAttribute(unb(P.n, Int8Array), 3, true)); g.setIndex(new THREE.BufferAttribute(unb(P.i, Uint32Array), 1)); LDC[name] = g; }
      const g = LDC[name].clone(); if (scale) g.scale(scale, scale, scale); return g;
    };
    X.hasLD = () => !!window.LDRAW_PARTS;

    // ------------------------------------------------------------------ big flat planes: depth-fight guard (R11)
    // Ground, sea and water-bed planes overlap each other by a few cm. With near 0.1 / far 20000 the depth buffer
    // cannot separate them past a few hundred metres, so the lower plane bled through the upper one as thin bright
    // horizontal lines (the "white streaks" across sea and sky). Every big plane registers here; each frame the
    // visible ones are ranked by world height and the LOWER planes get a bigger polygon offset (pushed back), so the
    // higher plane always wins and all of them stay behind real geometry (plates, tiles, hulls) standing on them.
    const FLATS = []; let flatFrame = -1; const _fw = new THREE.Vector3();
    const flatVisible = (m) => { for (let o = m; o; o = o.parent) if (!o.visible) return false; return true; };
    function flatRank(r) {
      const fr = r.info.render.frame; if (fr === flatFrame) return; flatFrame = fr;
      const live = FLATS.filter(flatVisible);
      live.forEach((m) => { m.updateWorldMatrix(true, false); m.userData.fxWorldY = _fw.setFromMatrixPosition(m.matrixWorld).y; });
      live.sort((a, b) => b.userData.fxWorldY - a.userData.fxWorldY);
      live.forEach((m, i) => { const k = i + 1; m.material.polygonOffsetFactor = 1.5 * k; m.material.polygonOffsetUnits = 6 * k; });
    }
    X.flatPlane = (m) => { m.material.polygonOffset = true; m.material.polygonOffsetFactor = 1.5; m.material.polygonOffsetUnits = 6; FLATS.push(m); const prev = m.onBeforeRender; m.onBeforeRender = function (r, s, c, g, mat, grp) { flatRank(r); if (prev) prev.call(this, r, s, c, g, mat, grp); }; return m; };

    // ------------------------------------------------------------------ shapes
    function roundBox(w, h, d, r, seg) { // a bevelled box: brick-like highlights on every edge
      seg = seg || 3; r = Math.min(r, w / 2, h / 2, d / 2);
      const g = new THREE.BoxGeometry(w, h, d, seg * 2, seg * 2, seg * 2);
      const p = g.attributes.position, v = new THREE.Vector3(), inner = new THREE.Vector3(w / 2 - r, h / 2 - r, d / 2 - r);
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i);
        const c = new THREE.Vector3(Math.max(-inner.x, Math.min(inner.x, v.x)), Math.max(-inner.y, Math.min(inner.y, v.y)), Math.max(-inner.z, Math.min(inner.z, v.z)));
        const n = v.clone().sub(c); if (n.lengthSq() > 1e-12) n.normalize().multiplyScalar(r); v.copy(c).add(n); p.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals(); return g;
    }
    X.roundBox = roundBox;

    // ------------------------------------------------------------------ sky
    const NOISE_GLSL = `
      float h3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      float n3(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.0-2.0*f);
        return mix(mix(mix(h3(i+vec3(0,0,0)), h3(i+vec3(1,0,0)), f.x), mix(h3(i+vec3(0,1,0)), h3(i+vec3(1,1,0)), f.x), f.y),
                   mix(mix(h3(i+vec3(0,0,1)), h3(i+vec3(1,0,1)), f.x), mix(h3(i+vec3(0,1,1)), h3(i+vec3(1,1,1)), f.x), f.y), f.z); }
      float fbm3(vec3 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 6; i++){ v += a * n3(p); p = p * 2.02 + 3.1; a *= 0.5; } return v; }`;
    X.SKIES = {
      day:      { zenith: "#2f6fc4", mid: "#79aee6", horizon: "#c4def5", ground: "#8fa6b8", sunDir: [-0.4, 0.55, -0.6], sunColor: "#fff4e0", sunSize: 0.9, haze: 0.5, clouds: 0.35, cloudColor: "#ffffff", cloudShade: "#9fb1c6" },
      golden:   { zenith: "#3b6cc0", mid: "#b8a6d6", horizon: "#ffd3a6", ground: "#a08a70", sunDir: [-0.75, 0.16, -0.62], sunColor: "#ffd7a0", sunSize: 1.2, haze: 0.7, clouds: 0.25, cloudColor: "#fff1dc", cloudShade: "#b48c78" },
      overcast: { zenith: "#7d8794", mid: "#a3abb4", horizon: "#c3c9cf", ground: "#8d9296", sunDir: [0.3, 0.6, -0.5], sunColor: "#f2f2f2", sunSize: 0.0, haze: 0.9, clouds: 0.95, cloudColor: "#d8dce0", cloudShade: "#6f7781" },
      night:    { zenith: "#03060f", horizon: "#1b2a48", ground: "#05070b", sunDir: [0.2, -0.3, -1], sunColor: "#9fb8ff", sunSize: 0.0, haze: 0.3, clouds: 0.15, cloudColor: "#2a3550", cloudShade: "#0d1220", stars: 1 },
      orbit:    { zenith: "#000000", horizon: "#3d78c8", ground: "#2a62a8", sunDir: [-0.6, 0.3, -0.7], sunColor: "#ffffff", sunSize: 1.0, haze: 0.4, clouds: 0, cloudColor: "#000000", cloudShade: "#000000", stars: 0 }, // reflections in orbit: earthshine below, sun
      space:    { zenith: "#000000", horizon: "#000000", ground: "#000000", sunDir: [-0.6, 0.3, -0.7], sunColor: "#ffffff", sunSize: 0.6, haze: 0, clouds: 0, cloudColor: "#000000", cloudShade: "#000000", stars: 1 },
    };
    function skyMat(o) {
      o = Object.assign({}, X.SKIES.day, typeof o === "string" ? X.SKIES[o] : o || {});
      const col = (c) => new THREE.Color(c);
      return new THREE.ShaderMaterial({
        uniforms: { uZen: { value: col(o.zenith) }, uMid: { value: col(o.mid || o.horizon) }, uHor: { value: col(o.horizon) }, uGnd: { value: col(o.ground) }, uSun: { value: new THREE.Vector3().fromArray(o.sunDir).normalize() },
          uSunC: { value: col(o.sunColor) }, uSunS: { value: o.sunSize }, uHaze: { value: o.haze }, uCl: { value: o.clouds }, uClC: { value: col(o.cloudColor) }, uClS: { value: col(o.cloudShade) },
          uStars: { value: o.stars || 0 }, uTime: { value: 0 } },
        vertexShader: "varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w * 0.99999; }",
        fragmentShader: NOISE_GLSL + `
          uniform vec3 uZen, uMid, uHor, uGnd, uSun, uSunC, uClC, uClS; uniform float uSunS, uHaze, uCl, uStars, uTime; varying vec3 vDir;
          void main(){
            vec3 d = normalize(vDir); float y = d.y;
            float yy = pow(smoothstep(-0.04, 0.96, y), 0.72);
            vec3 up = yy < 0.36 ? mix(uHor, uMid, yy / 0.36) : mix(uMid, uZen, (yy - 0.36) / 0.64);
            vec3 c = mix(up, uGnd, smoothstep(0.02, -0.22, y));
            float sd = max(dot(d, uSun), 0.0);
            c += uSunC * (pow(sd, 8.0) * 0.35 * uHaze + pow(sd, 64.0) * 0.6 * uHaze);
            if (uSunS > 0.0) c += uSunC * smoothstep(0.9993 - 0.0006 * uSunS, 0.9997, sd) * 30.0;
            if (uCl > 0.0 && y > -0.02) {
              vec3 q = d / max(y + 0.12, 0.05);           // flatten into a cloud layer
              q.xz += vec2(uTime * 0.004, uTime * 0.0015);
              float n = fbm3(vec3(q.x * 1.6, 0.0, q.z * 1.6));
              float cov = smoothstep(1.0 - uCl, 1.0 - uCl + 0.35, n);
              float lit = clamp(0.55 + 0.6 * (fbm3(vec3(q.x * 1.6 + uSun.x * 0.15, 1.7, q.z * 1.6 + uSun.z * 0.15)) - n) * 3.0, 0.0, 1.0);
              vec3 cc = mix(uClS, uClC, lit) + uSunC * pow(sd, 6.0) * 0.4 * cov;
              float fade = smoothstep(-0.02, 0.12, y);
              c = mix(c, cc, cov * fade * 0.95);
            }
            if (uStars > 0.0) { vec3 s = floor(d * 420.0); float r = h3(s); c += vec3(smoothstep(0.9965, 1.0, r)) * 2.2 * uStars * smoothstep(-0.05, 0.1, y + 0.2); }
            gl_FragColor = vec4(c, 1.0);
          }`,
        side: THREE.BackSide, depthWrite: false, fog: false,
      });
    }
    X.sky = (parent, o) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), skyMat(o));
      m.scale.setScalar(1500); m.frustumCulled = false; m.renderOrder = -10; parent.add(m); fxLayer(m);
      m.onBeforeRender = (r, s, cam) => { m.position.copy(cam.position); };
      return m;
    };
    X.skyEnv = (name, o) => ctx.makeEnv(name, (env) => { const m = new THREE.Mesh(new THREE.SphereGeometry(50, 64, 32), skyMat(o)); env.add(m); });

    // ------------------------------------------------------------------ ground
    X.ground = (parent, o) => {
      o = Object.assign({ size: 400, y: 0, colors: ["#8a7a5a", "#6f6a48", "#a3916b"], studs: true, pitch: 0.8, rough: 0.8, repeat: 1, seed: 1, kind: "flats", res: 1024 }, o || {}); // pitch: stud spacing (big terrain: 2-3)
      const map = canvasTex(o.res, o.res, (g, W, H) => {
        const img = g.createImageData(W, H), C = o.colors.map((c) => new THREE.Color(c));
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          const u = x / W * 8, v = y / H * 8;
          let n = fbm(u, v, o.seed, 6), m = fbm(u * 3.1, v * 3.1, o.seed + 40, 3);
          let wet = 0;
          if (o.kind === "flats") { const ch = Math.abs(fbm(u * 0.9, v * 0.9, o.seed + 21, 5) - 0.5), ch2 = Math.abs(fbm(u * 2.1 + 3, v * 2.1, o.seed + 33, 4) - 0.5); wet = Math.max(1 - Math.min(1, ch / 0.03), 0.8 * (1 - Math.min(1, ch2 / 0.018))); } // meandering tidal channels
          if (o.kind === "concrete") { n = 0.5 + (m - 0.5) * 0.3 + ((x % (W / 8) < 2 || y % (H / 8) < 2) ? -0.25 : 0); }
          const a = clamp01(n * 1.6 - 0.3), c = C[0].clone().lerp(C[1], a).lerp(C[2], clamp01((m - 0.55) * 3));
          if (wet > 0) c.lerp(new THREE.Color(o.water || "#6f8e98"), clamp01(wet * 1.4)).lerp(new THREE.Color("#d8d2b8"), clamp01((wet - 0.05) * 3) * clamp01((0.45 - wet) * 4) * 0.5); // water + pale mud banks
          const i = (y * W + x) * 4; img.data[i] = c.r * 255; img.data[i + 1] = c.g * 255; img.data[i + 2] = c.b * 255; img.data[i + 3] = 255;
        }
        g.putImageData(img, 0, 0);
      }, false);
      map.encoding = THREE.LinearEncoding; map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.set(o.repeat, o.repeat);
      const mat = new THREE.MeshStandardMaterial({ map, roughness: o.rough, metalness: 0 });
      if (o.studs && o.size < 1500) { const n = X.studNormal.clone(); n.needsUpdate = true; n.wrapS = n.wrapT = THREE.RepeatWrapping; n.repeat.set(o.size / o.pitch, o.size / o.pitch); mat.normalMap = n; mat.normalScale.set(0.8, 0.8); }
      const m = new THREE.Mesh(new THREE.PlaneGeometry(o.size, o.size), mat);
      m.rotation.x = -Math.PI / 2; m.position.y = o.y; m.receiveShadow = true; parent.add(m); X.flatPlane(m);
      return m;
    };

    // ------------------------------------------------------------------ ocean
    const waveN = normalTex(256, (u, v) => {
      let h = 0; for (let k = 0; k < 7; k++) { const a = rand(k) * 6.283, f = 1 + Math.floor(rand(k + 9) * 4), ph = rand(k + 20) * 6.283; h += Math.sin((Math.cos(a) * u + Math.sin(a) * v) * f * 6.283 * Math.round(1 + k * 0.6) + ph) / (1 + k * 0.5); }
      return h * 0.25 + fbm(u * 8, v * 8, 3, 3) * 0.3;
    }, 3.5);
    waveN.wrapS = waveN.wrapT = THREE.RepeatWrapping;
    X.ocean = (parent, o) => {
      o = Object.assign({ size: 6000, y: 0, color: "#1d5866", rough: 0.07, repeat: 600 }, o || {});
      const n1 = waveN.clone(); n1.needsUpdate = true; n1.repeat.set(o.repeat, o.repeat);
      const mat = new THREE.MeshPhysicalMaterial({ color: o.color, roughness: o.rough, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, normalMap: n1, normalScale: new THREE.Vector2(0.35, 0.35), envMapIntensity: 1.2 });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(o.size, o.size, 1, 1), mat);
      m.rotation.x = -Math.PI / 2; m.position.y = o.y; m.receiveShadow = true; parent.add(m); X.flatPlane(m);
      return m;
    };
    X.tickOcean = (m, t) => { const n = m.material.normalMap; n.offset.set(t * 0.012, t * 0.007); };

    // ------------------------------------------------------------------ BRICK WATER (the brick-game look: translucent tiles that bob)
    // Near the camera: real instanced tiles (X.brickWater). To the horizon: X.tileOcean, a flat plane with a tile-grid normal map.
    const tileN = normalTex(128, (u, v) => { const e = Math.min(u, 1 - u, v, 1 - v); return e < 0.035 ? e / 0.035 : 1; }, 5);
    tileN.wrapS = tileN.wrapT = THREE.RepeatWrapping;
    X.tileOcean = (parent, o) => {
      o = Object.assign({ size: 8000, y: -0.12, color: "#2a86c9", tile: 1.2, rough: 0.12, vary: 0.22 }, o || {});
      const n = tileN.clone(); n.needsUpdate = true; n.repeat.set(o.size / o.tile, o.size / o.tile);
      const mat = new THREE.MeshPhysicalMaterial({ color: o.color, roughness: o.rough, clearcoat: 0.6, clearcoatRoughness: 0.22, normalMap: n, normalScale: new THREE.Vector2(0.28, 0.28), envMapIntensity: 0.85 });
      // R11: per-tile colour variation (matches X.brickWater) + tile relief fades out with distance, so the far
      // tile grid never beats against the pixel grid (moire / glinting lines near the horizon).
      const fadeN = o.tile * 400, fadeF = o.tile * 900; // plus a per-pixel footprint fade (tile < ~6-18 px)
      mat.onBeforeCompile = (sh) => {
        sh.uniforms.uTileFade = { value: new THREE.Vector2(fadeN, fadeF) }; sh.uniforms.uTileVary = { value: o.vary };
        sh.fragmentShader = sh.fragmentShader
          .replace("uniform float opacity;", "uniform float opacity; uniform vec2 uTileFade; uniform float uTileVary; float tH(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }")
          .replace("#include <map_fragment>", "#include <map_fragment>\n vec2 tFw = fwidth(vUv); float tFade = (1.0 - smoothstep(1.0 / 18.0, 1.0 / 6.0, max(tFw.x, tFw.y))) * (1.0 - smoothstep(uTileFade.x, uTileFade.y, length(vViewPosition))); vec2 tCell = floor(vUv); float tv = tH(tCell); diffuseColor.rgb *= 1.0 + uTileVary * (tv - 0.5) * tFade + 0.18 * step(0.94, tv) * tFade;")
          .replace("mapN.xy *= normalScale;", "mapN.xy *= normalScale * tFade;");
      };
      mat.customProgramCacheKey = () => "tileOcean-r11";
      const m = new THREE.Mesh(new THREE.PlaneGeometry(o.size, o.size), mat); m.rotation.x = -Math.PI / 2; m.position.y = o.y; m.receiveShadow = true; parent.add(m); X.flatPlane(m);
      return m;
    };
    // R11 FAR-FADE for repeated small geometry (water tiles, studs). When one repeat spans only a few pixels its bevels
    // and gaps beat against the pixel grid: moire bands and rows of glints that read as thin white horizontal lines
    // across the sea (MSAA cannot fix that). Per instance, from its on-screen footprint (distance AND grazing angle),
    // bevel normals fade to flat, grout gaps close (gap), studs sink into their plate (sink) and bobbing tiles settle
    // onto one plane (flatY = the water's rest height), so far rows never expose their side faces as lines.
    X.farFade = (mat, o) => {
      o = Object.assign({ pitch: 1, px0: 16, px1: 5, gap: 0, sink: 0 }, o || {});
      const prev = mat.onBeforeCompile, key0 = mat.customProgramCacheKey ? mat.customProgramCacheKey() : "";
      mat.onBeforeCompile = (sh, r) => {
        if (prev) prev(sh, r);
        sh.uniforms.uFF = { value: new THREE.Vector4(o.pitch, o.px0, o.px1, 1920) };
        sh.vertexShader = sh.vertexShader
          .replace("#include <common>", "#include <common>\nuniform vec4 uFF; varying float vFar;")
          .replace("#include <begin_vertex>", `#include <begin_vertex>
            vec4 ffC = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            #ifdef USE_INSTANCING
              ffC = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            #endif
            vec3 ffD = ffC.xyz - cameraPosition; float ffL = max(length(ffD), 1e-3);
            float ffFoot = ffL * (2.0 / (projectionMatrix[1][1] * uFF.w)) / max(abs(ffD.y) / ffL, 0.035);
            vFar = 1.0 - smoothstep(uFF.z, uFF.y, uFF.x / ffFoot);
            transformed.xz *= 1.0 + ${o.gap.toFixed(4)} * vFar;
            transformed.y *= 1.0 - ${o.sink.toFixed(4)} * vFar;
            ${o.flatY == null ? "" : `#ifdef USE_INSTANCING
              transformed.y += (${(+o.flatY).toFixed(4)} - instanceMatrix[3].y) * vFar / max(length(instanceMatrix[1].xyz), 0.05);
            #endif`}`);
        sh.fragmentShader = sh.fragmentShader
          .replace("#include <common>", "#include <common>\nvarying float vFar;")
          .replace("#include <normal_fragment_begin>", "#include <normal_fragment_begin>\n normal = normalize(mix(normal, normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz), vFar)); geometryNormal = normal;");
      };
      mat.customProgramCacheKey = () => key0 + "|ff" + o.gap + "," + o.sink + "," + o.px0 + "," + o.flatY;
      return mat;
    };
    // R11 tile: a closed bevelled 2x2 tile with the bottom groove (the LDraw 3068b mesh has an open underside whose
    // inside faces showed through the translucent tops as a repeating dark "glyph" pattern).
    function waterTileGeo(t) {
      const top = roundBox(t * 0.965, t * 0.16, t * 0.965, t * 0.04, 2); top.translate(0, t * 0.02, 0);
      const grv = roundBox(t * 0.92, t * 0.045, t * 0.92, t * 0.012, 1); grv.translate(0, -t * 0.0775, 0);
      const parts = [top.toNonIndexed(), grv.toNonIndexed()], g = new THREE.BufferGeometry();
      for (const k of ["position", "normal", "uv"]) {
        const n = parts.reduce((s, p) => s + p.attributes[k].array.length, 0), arr = new Float32Array(n); let off = 0;
        parts.forEach((p) => { arr.set(p.attributes[k].array, off); off += p.attributes[k].array.length; });
        g.setAttribute(k, new THREE.BufferAttribute(arr, parts[0].attributes[k].itemSize));
      }
      return g;
    }
    X.brickWater = (parent, o) => {
      o = Object.assign({ nx: 90, nz: 90, tile: 1.2, x: 0, z: 0, y: 0, color: "#2f8fd0", foam: "#f4fbff", opacity: 0.82, vary: 1, seed: 0 }, o || {});
      const geo = waterTileGeo(o.tile);
      const mat = new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.1, clearcoat: 0.6, clearcoatRoughness: 0.1, transparent: o.opacity < 0.999, opacity: o.opacity, specularIntensity: 0.55, envMapIntensity: 1.0 });
      X.farFade(mat, { pitch: o.tile, gap: 0.04, flatY: o.y });
      const N = o.nx * o.nz, im = new THREE.InstancedMesh(geo, mat, N); im.receiveShadow = true; im.frustumCulled = false;
      const base = new THREE.Color(o.color), hsl = { h: 0, s: 0, l: 0 }; base.getHSL(hsl);
      const cols = new Array(N); // varied translucent blues: most tiles +-9% value, a few lighter / deeper tiles
      for (let i = 0; i < N; i++) {
        const r1 = rand(i * 1.37 + o.seed * 31.7 + 5), r2 = rand(i * 2.71 + o.seed * 17.3 + 9);
        const dl = ((r1 - 0.5) * 0.16 + (r2 > 0.93 ? 0.1 : r2 < 0.06 ? -0.08 : 0)) * o.vary;
        cols[i] = new THREE.Color().setHSL(hsl.h + (r2 - 0.5) * 0.025 * o.vary, Math.min(1, hsl.s * (1 + (r1 - 0.5) * 0.15 * o.vary)), Math.max(0.02, Math.min(0.95, hsl.l * (1 + dl * 1.6))));
        im.setColorAt(i, cols[i]);
      }
      const bed = new THREE.Mesh(new THREE.PlaneGeometry(o.nx * o.tile, o.nz * o.tile), new THREE.MeshStandardMaterial({ color: "#0d3a5c", roughness: 1 }));
      bed.rotation.x = -Math.PI / 2; bed.position.set(o.x, o.y - 0.9, o.z); parent.add(bed); parent.add(im); X.flatPlane(bed);
      return { im, o, base, cols, foamC: new THREE.Color(o.foam), bed };
    };
    // fx(x, z, t) -> [dy, foam 0..1] adds splashes / rings / downwash on top of the gentle swell. Tiles fly up when dy is big.
    const _wc = new THREE.Color();
    X.tickBrickWater = (Wt, t, fx) => {
      const { im, o } = Wt; let i = 0;
      const halfW = (o.nx * o.tile) * 0.5, halfD = (o.nz * o.tile) * 0.5;
      for (let a = 0; a < o.nx; a++) for (let b = 0; b < o.nz; b++) {
        const x = o.x + (a - o.nx / 2 + 0.5) * o.tile, z = o.z + (b - o.nz / 2 + 0.5) * o.tile;
        const ex = Math.abs(x - o.x) / Math.max(halfW, 1e-3), ez = Math.abs(z - o.z) / Math.max(halfD, 1e-3);
        const edge = o.feather === false ? 1 : 1 - clamp01((Math.max(ex, ez) - 0.78) / 0.22);
        const A = (o.amp == null ? 1 : o.amp) * edge, fq = 1.2 / o.tile; // amp: swell height; feathers smoothly into far tileOcean
        let dy = A * (0.12 * Math.sin(x * 0.35 * fq + t * 1.6) + 0.09 * Math.sin(z * 0.27 * fq - t * 1.2 + x * 0.1 * fq) + 0.05 * Math.sin((x + z) * 0.8 * fq + t * 2.3));
        let foam = 0, tilt = 0;
        if (fx) { const r = fx(x, z, t); dy += r[0] * edge; foam = (r[1] || 0) * edge; tilt = (r[2] || 0) * edge; }
        const dropEdge = o.feather === false ? 0 : (1 - edge) * 0.18;
        _p.set(x, o.y + dy - dropEdge, z); _e.set(tilt * Math.sin(x * 3.1), 0, tilt * Math.cos(z * 2.7)); _q.setFromEuler(_e); _s.set(1, 0.25 + 0.75 * edge, 1);
        _m.compose(_p, _q, _s); im.setMatrixAt(i, _m);
        _wc.copy(Wt.cols ? Wt.cols[i] : Wt.base).lerp(Wt.foamC, clamp01(foam)); im.setColorAt(i, _wc); i++;
      }
      im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true;
    };

    // ------------------------------------------------------------------ BRICK CLOUDS + BRICK PUFFS
    // clouds: clusters of white bevelled bricks (instanced). puffs: round white bricks that grow and drift (launch steam, splash).
    X.brickClouds = (parent, o) => {
      o = Object.assign({ n: 14, area: 900, y: 120, size: 6, seed: 3, color: "#ffffff", shade: 0.0, center: [0, 0, 0], keepOutR: 0, keepOutCenter: [0, 0], keepOut2: null }, o || {});
      let geo = roundBox(2, 1, 1, 0.1, 2); const per = 26;
      const realB = X.ld("3001", 0.025); if (realB) { realB.translate(0, 0.3, 0); geo = realB; } // real 2x4 bricks
      const im = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: o.color, roughness: 0.62, emissive: o.color, emissiveIntensity: 0.03 }), o.n * per);
      let k = 0; const r = (i) => rand(i * 3.3 + o.seed * 17);
      for (let c = 0; c < o.n; c++) {
        const cx = o.center[0] + (r(c * 7 + 1) - 0.5) * o.area, cz = o.center[2] + (r(c * 7 + 2) - 0.5) * o.area, cy = o.y + (r(c * 7 + 3) - 0.5) * o.y * 0.4, s = o.size * (0.6 + r(c * 7 + 4) * 0.9);
        for (let j = 0; j < per; j++) {
          const q = (u) => rand(c * 131 + j * 7.7 + u + o.seed);
          const lx = Math.round((q(1) - 0.5) * 6) * 1.0, ly = Math.floor(q(2) * q(2) * 3), lz = Math.round((q(3) - 0.5) * 3);
          if (Math.abs(lx) + ly * 1.6 > 4) continue;
          const bx = cx + lx * s, by = cy + ly * s, bz = cz + lz * s;
          if (o.keepOutR > 0 && Math.hypot(bx - o.keepOutCenter[0], bz - o.keepOutCenter[1]) < o.keepOutR + s * 2.2) continue;
          if (o.keepOut2 && Math.hypot(bx - o.keepOut2[0], bz - o.keepOut2[1]) < o.keepOut2[2] + s * 2.2) continue;
          _p.set(bx, by, bz); _q.identity(); _s.setScalar(s * (0.9 + q(4) * 0.5)); _m.compose(_p, _q, _s); im.setMatrixAt(k++, _m);
        }
      }
      im.count = k; im.castShadow = false; parent.add(im);
      return im;
    };
    X.puffs = (parent, o) => {
      o = Object.assign({ max: 400, color: "#f2f2ee", rough: 0.65, emissiveIntensity: 0.02 }, o || {});
      let g = new THREE.CylinderGeometry(1, 1, 0.66, 20); // a round 1x1 brick, scaled up
      let stud = new THREE.CylinderGeometry(0.42, 0.42, 0.22, 16); stud.translate(0, 0.44, 0);
      const real = X.ld("3062b", 0.1); if (real) { real.translate(0, 1.2, 0); g = real; stud = new THREE.BufferGeometry(); stud.setAttribute("position", new THREE.BufferAttribute(new Float32Array(9), 3)); } // real LDraw round brick
      const mat = new THREE.MeshStandardMaterial({ color: o.color, roughness: o.rough, emissive: o.color, emissiveIntensity: o.emissiveIntensity });
      const a = new THREE.InstancedMesh(g, mat, o.max), b = new THREE.InstancedMesh(stud, mat, o.max);
      a.count = b.count = 0; a.visible = b.visible = false;
      a.frustumCulled = b.frustumCulled = false; a.castShadow = true; parent.add(a); parent.add(b);
      return { a, b, n: 0, max: o.max,
        begin() { this.n = 0; },
        push(x, y, z, s, rx, ry, rz) { if (this.n >= this.max || s < 0.01) return; _p.set(x, y, z); _e.set(rx || 0, ry || 0, rz || 0); _q.setFromEuler(_e); _s.setScalar(s); _m.compose(_p, _q, _s); this.a.setMatrixAt(this.n, _m); this.b.setMatrixAt(this.n, _m); this.n++; },
        end() { this.a.count = this.b.count = this.n; this.a.instanceMatrix.needsUpdate = this.b.instanceMatrix.needsUpdate = true; this.a.visible = this.b.visible = this.n > 0; } };
    };
    // deterministic puff emitter (same timing model as X.emit); size grows with age
    X.emitPuffs = (P, t, o) => {
      const rate = o.rate || 20, life = o.life || 3, seed = o.seed || 0, drag = o.drag ?? 0.8, t0 = o.t0 ?? -1e9, t1 = o.t1 ?? 1e9;
      const iA = Math.max(Math.ceil((Math.max(t0, t - life) - t0) * rate), 0), iB = Math.floor((Math.min(t, t1) - t0) * rate);
      for (let i = iA; i <= iB; i++) {
        const tb = t0 + i / rate, age = t - tb; if (age < 0 || age > life) continue;
        const k = age / life, r = (j) => rand(i * 19.31 + j * 4.1 + seed * 77.7);
        const p = o.origin(tb, i, r), v = o.vel(tb, i, r), dd = (1 - Math.exp(-drag * age)) / drag;
        const s = (o.size[0] + (o.size[1] - o.size[0]) * Math.sqrt(k)) * (0.7 + 0.6 * r(4)) * (k > 0.85 ? (1 - k) / 0.15 : 1);
        const rot = o.rot ? o.rot(tb, age, i, r) : [(r(5) - 0.5) * 0.8, r(6) * 3, 0];
        P.push(p[0] + v[0] * dd, p[1] + v[1] * dd + 0.5 * (o.gravity || 0) * age * age, p[2] + v[2] * dd, s, rot[0], rot[1], rot[2] || 0);
      }
    };

    // ------------------------------------------------------------------ billboard particles (instanced quads)
    const PVS = `
      attribute vec3 iPos; attribute vec4 iCol; attribute vec3 iSz; // size, rotation, seed
      varying vec2 vUv; varying vec4 vCol; varying float vSeed; varying float vFog; varying vec3 vN0;
      void main(){
        vUv = uv; vCol = iCol; vSeed = iSz.z;
        vec4 mv = modelViewMatrix * vec4(iPos, 1.0);
        float c = cos(iSz.y), s = sin(iSz.y); vec2 p = mat2(c, s, -s, c) * position.xy;
        mv.xy += p * iSz.x; vFog = -mv.z; vN0 = vec3(p, 0.0);
        gl_Position = projectionMatrix * mv; }`;
    const PFS = NOISE_GLSL + `
      uniform float uAdd; uniform vec3 uSunV, uFogC; uniform float uFogN, uFogF;
      varying vec2 vUv; varying vec4 vCol; varying float vSeed; varying float vFog; varying vec3 vN0;
      void main(){
        vec2 p = vUv * 2.0 - 1.0; float r = length(p);
        float n = fbm3(vec3(p * 2.2, vSeed * 13.0));
        float a = smoothstep(1.0, 0.25, r + (n - 0.5) * 0.9);
        float f = clamp((vFog - uFogN) / max(uFogF - uFogN, 0.001), 0.0, 1.0);
        if (uAdd > 0.5) { float core = smoothstep(0.9, 0.0, r); gl_FragColor = vec4(vCol.rgb * (a * 0.7 + core * 0.6) * vCol.a * (1.0 - f), 1.0); return; }
        vec3 nrm = normalize(vec3(p * 0.9 + (n - 0.5) * 0.8, sqrt(max(0.0, 1.0 - r * r)) + 0.2));
        float lit = 0.5 + 0.65 * max(dot(nrm, uSunV), 0.0) + 0.15 * nrm.y;
        vec3 c = vCol.rgb * lit;
        c = mix(c, uFogC, f);
        gl_FragColor = vec4(c, a * vCol.a);
      }`;
    X.particles = (parent, o) => {
      o = Object.assign({ max: 800, blend: "smoke" }, o || {});
      const geo = new THREE.InstancedBufferGeometry();
      const base = new THREE.PlaneGeometry(1, 1);
      geo.index = base.index; geo.attributes.position = base.attributes.position; geo.attributes.uv = base.attributes.uv;
      const P = new Float32Array(o.max * 3), Cc = new Float32Array(o.max * 4), S = new Float32Array(o.max * 3);
      geo.setAttribute("iPos", new THREE.InstancedBufferAttribute(P, 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute("iCol", new THREE.InstancedBufferAttribute(Cc, 4).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute("iSz", new THREE.InstancedBufferAttribute(S, 3).setUsage(THREE.DynamicDrawUsage));
      const add = o.blend === "add";
      const mat = new THREE.ShaderMaterial({ uniforms: { uAdd: { value: add ? 1 : 0 }, uSunV: { value: new THREE.Vector3(0, 1, 0) }, uFogC: { value: new THREE.Color() }, uFogN: { value: 1e6 }, uFogF: { value: 1e7 } },
        vertexShader: PVS, fragmentShader: PFS, transparent: true, depthWrite: false, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending });
      const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; mesh.renderOrder = add ? 5 : 4; parent.add(mesh); fxLayer(mesh);
      const sv = new THREE.Vector3();
      mesh.onBeforeRender = (r, scene, cam) => {
        const sun = ctx.lights.sun; sv.copy(sun.position).sub(sun.target.position).normalize().transformDirection(cam.matrixWorldInverse); mat.uniforms.uSunV.value.copy(sv);
        if (scene.fog && scene.fog.near < 1e5) { mat.uniforms.uFogC.value.copy(scene.fog.color); mat.uniforms.uFogN.value = scene.fog.near; mat.uniforms.uFogF.value = scene.fog.far; } else { mat.uniforms.uFogN.value = 1e6; mat.uniforms.uFogF.value = 1e7; }
      };
      const sys = { mesh, n: 0, max: o.max,
        begin() { this.n = 0; },
        push(x, y, z, size, r, g, b, a, rot, seed) { if (this.n >= this.max) return; const i = this.n++; P[i * 3] = x; P[i * 3 + 1] = y; P[i * 3 + 2] = z; Cc[i * 4] = r; Cc[i * 4 + 1] = g; Cc[i * 4 + 2] = b; Cc[i * 4 + 3] = a; S[i * 3] = size; S[i * 3 + 1] = rot || 0; S[i * 3 + 2] = seed || 0; },
        end() { geo.instanceCount = this.n; for (const k of ["iPos", "iCol", "iSz"]) geo.attributes[k].needsUpdate = true; mesh.visible = this.n > 0; },
      };
      return sys;
    };
    // Deterministic emitter. Particle i is born at tb = t0 + i / rate and lives `life` seconds.
    //  origin(tb) -> [x,y,z]   vel(tb, i, r) -> [vx,vy,vz]  (r = rand fn for this particle)
    //  size: [start, end]  color(k, i) -> [r,g,b,a] with k = age/life   gravity (y accel)  drag (1/s)  jitter (position spread)
    X.emit = (sys, t, o) => {
      const rate = o.rate || 30, life = o.life || 2, seed = o.seed || 0, drag = o.drag ?? 0.6, grav = o.gravity || 0, jit = o.jitter || 0;
      const t0 = o.t0 ?? -1e9, t1 = o.t1 ?? 1e9;
      const iA = Math.max(Math.ceil((Math.max(t0, t - life) - t0) * rate), 0), iB = Math.floor((Math.min(t, t1) - t0) * rate);
      for (let i = iB; i >= iA; i--) { // newest last-drawn ordering doesn't matter much; oldest drawn last looks better for smoke
        const tb = t0 + i / rate, age = t - tb; if (age < 0 || age > life) continue;
        const k = age / life, r = (j) => rand(i * 17.13 + j * 3.7 + seed * 101.3);
        const p = o.origin(tb, i, r), v = o.vel ? o.vel(tb, i, r) : [0, 0, 0];
        const dd = drag > 0 ? (1 - Math.exp(-drag * age)) / drag : age;
        const x = p[0] + v[0] * dd + (r(1) - 0.5) * jit, y = p[1] + v[1] * dd + 0.5 * grav * age * age + (r(2) - 0.5) * jit, z = p[2] + v[2] * dd + (r(3) - 0.5) * jit;
        const sz = (o.size[0] + (o.size[1] - o.size[0]) * Math.sqrt(k)) * (0.75 + 0.5 * r(4));
        const c = o.color(k, i, r);
        sys.push(x, y, z, sz, c[0], c[1], c[2], c[3], r(5) * 6.283 + age * (r(6) - 0.5) * 0.6, r(7));
      }
    };

    // ------------------------------------------------------------------ engine flame (Raptor plume with shock diamonds)
    X.flame = (parent, o) => {
      o = Object.assign({ r: 0.6, len: 8, core: "#fff3d6", edge: "#ff8a3a", diamonds: 1 }, o || {});
      const geo = new THREE.CylinderGeometry(o.r * 0.9, o.r * 1.6, 1, 24, 32, true); geo.translate(0, -0.5, 0); // top at 0, extends to -1
      const mat = new THREE.ShaderMaterial({
        uniforms: { uCore: { value: new THREE.Color(o.core) }, uEdge: { value: new THREE.Color(o.edge) }, uPow: { value: 1 }, uTime: { value: 0 }, uDia: { value: o.diamonds }, uLen: { value: o.len } },
        vertexShader: "varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
        fragmentShader: NOISE_GLSL + `uniform vec3 uCore, uEdge; uniform float uPow, uTime, uDia, uLen; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
          void main(){ float y = 1.0 - vUv.y; // 0 at nozzle, 1 at tail
            float fres = pow(abs(dot(normalize(vN), normalize(vV))), 1.6);
            float n = fbm3(vec3(vUv.x * 6.0, y * uLen * 0.6 - uTime * 9.0, uTime * 2.0));
            float dia = uDia * smoothstep(0.55, 1.0, sin(y * uLen * 1.6) * 0.5 + 0.5) * (1.0 - y);
            float body = fres * (1.0 - smoothstep(0.15, 1.0, y)) * (0.7 + 0.5 * n);
            vec3 c = mix(uCore, uEdge, smoothstep(0.0, 0.55, y)) * (body * 3.0 + dia * 2.5);
            gl_FragColor = vec4(c * uPow, 1.0); }`,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      });
      const m = new THREE.Mesh(geo, mat); m.scale.y = o.len; m.renderOrder = 6; parent.add(m); fxLayer(m);
      return m;
    };
    X.setFlame = (m, t, o) => { const u = m.material.uniforms; u.uTime.value = t; u.uPow.value = o.power ?? 1; if (o.len) { m.scale.y = o.len; u.uLen.value = o.len; } if (o.width) { m.scale.x = m.scale.z = o.width; } m.visible = (o.power ?? 1) > 0.01; };

    // ------------------------------------------------------------------ brick debris
    X.debris = (parent, o) => {
      o = Object.assign({ n: 160, colors: ["#c8cbd0", "#9aa0a6", "#1b1b1b", "#e8e8e8"], size: 0.6 }, o || {});
      let B = roundBox(1, 0.6, 0.5, 0.06, 2);
      let stud = new THREE.CylinderGeometry(0.14, 0.14, 0.1, 12); stud.translate(0, 0.35, 0);
      const realParts = ["3004", "3003", "3039", "3023", "3005", "4073"].map((n) => X.ld(n, 0.025)).filter(Boolean);
      const meshes = o.colors.map((c, ci) => {
        if (realParts.length) { B = realParts[ci % realParts.length]; stud = realParts[(ci + 2) % realParts.length]; } // real LDraw bricks: two shapes per colour
        const mat = new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.3, clearcoat: 0.6, metalness: c === "#c8cbd0" ? 0.5 : 0 });
        const im = new THREE.InstancedMesh(B, mat, Math.ceil(o.n / o.colors.length)); im.castShadow = true; im.frustumCulled = false; parent.add(im);
        const is = new THREE.InstancedMesh(stud, mat, Math.ceil(o.n / o.colors.length)); is.frustumCulled = false; parent.add(is);
        return [im, is];
      });
      return { meshes, n: o.n, size: o.size };
    };
    const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _ms = new THREE.Matrix4();
    X.burst = (D, t, t0, at, o) => {
      o = Object.assign({ speed: 30, up: 0.6, gravity: -14, spin: 6, floor: -1e9, life: 6, spread: 1 }, o || {});
      const age = t - t0, on = age >= 0 && age < o.life;
      D.meshes.forEach(([im, is], ci) => {
        const N = im.count;
        for (let j = 0; j < N; j++) {
          const i = j * D.meshes.length + ci, r = (k) => rand(i * 13.7 + k * 5.3 + 77);
          if (!on) { _m.makeScale(1e-4, 1e-4, 1e-4); im.setMatrixAt(j, _m); is.setMatrixAt(j, _m); continue; }
          const th = r(1) * 6.283, ph = Math.acos(1 - 2 * r(2)) * o.spread, sp = o.speed * (0.35 + r(3));
          const vx = Math.sin(ph) * Math.cos(th) * sp, vz = Math.sin(ph) * Math.sin(th) * sp, vy = (Math.cos(ph) * 0.5 + o.up) * sp;
          const dr = 0.35, dd = (1 - Math.exp(-dr * age)) / dr;
          let y = at[1] + vy * dd + 0.5 * o.gravity * age * age; y = Math.max(o.floor, y);
          _p.set(at[0] + vx * dd, y, at[2] + vz * dd);
          _e.set(r(4) * 6 + age * o.spin * (r(5) - 0.5), r(6) * 6 + age * o.spin * (r(7) - 0.5), r(8) * 6); _q.setFromEuler(_e);
          const s = D.size * (0.5 + r(9)) * Math.min(1, age * 12) * (y <= o.floor ? Math.max(0, 1 - (age - 1) * 0.5) : 1);
          _s.set(s * (1 + r(10)), s, s * (0.8 + r(11) * 0.6)); _m.compose(_p, _q, _s); im.setMatrixAt(j, _m); is.setMatrixAt(j, _m);
        }
        im.instanceMatrix.needsUpdate = true; is.instanceMatrix.needsUpdate = true; im.visible = is.visible = on;
      });
    };

    // ------------------------------------------------------------------ space
    X.stars = (parent, o) => {
      o = Object.assign({ n: 4000, r: 1200 }, o || {});
      const P = new Float32Array(o.n * 3), C = new Float32Array(o.n * 3);
      for (let i = 0; i < o.n; i++) {
        const u = rand(i * 3.1) * 2 - 1, th = rand(i * 7.7) * 6.283, s = Math.sqrt(1 - u * u);
        P[i * 3] = s * Math.cos(th) * o.r; P[i * 3 + 1] = u * o.r; P[i * 3 + 2] = s * Math.sin(th) * o.r;
        const b = 0.4 + Math.pow(rand(i * 9.1), 6) * 3, w = rand(i * 2.3);
        C[i * 3] = b * (0.85 + 0.15 * w); C[i * 3 + 1] = b * 0.92; C[i * 3 + 2] = b * (1.1 - 0.2 * w);
      }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(P, 3)); g.setAttribute("color", new THREE.BufferAttribute(C, 3));
      const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 2.2, sizeAttenuation: false, vertexColors: true, fog: false, depthWrite: false }));
      pts.frustumCulled = false; pts.renderOrder = -9; parent.add(pts); fxLayer(pts);
      pts.onBeforeRender = (r, s, cam) => pts.position.copy(cam.position);
      return pts;
    };
    X.glowShell = (geo, color, power, inside) => new THREE.Mesh(geo, new THREE.ShaderMaterial({
      uniforms: { uC: { value: new THREE.Color(color) }, uP: { value: power || 3 }, uI: { value: 1 } },
      vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
      fragmentShader: inside
        ? "uniform vec3 uC; uniform float uP, uI; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(clamp(1.0 - abs(dot(vN, vV)), 0.0, 1.0), uP); float g = pow(clamp(dot(vN, vV) * -1.0 + 0.0, 0.0, 1.0), 0.6); gl_FragColor = vec4(uC * uI * (f * 2.0), 1.0); }"
        : "uniform vec3 uC; uniform float uP, uI; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(clamp(1.0 - abs(dot(vN, vV)), 0.0, 1.0), uP); gl_FragColor = vec4(uC * uI * f * 2.0, 1.0); }",
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: inside ? THREE.BackSide : THREE.FrontSide,
    }));
    X.earth = (parent, o) => {
      o = Object.assign({ r: 100, base: "assets/tex/" }, o || {});
      const grp = new THREE.Group(); parent.add(grp);
      const day = loadTex(o.base + "earth_atmos_2048.jpg"), nrm = loadTex(o.base + "earth_normal_2048.jpg", false), spec = loadTex(o.base + "earth_specular_2048.jpg", false);
      const lights = loadTex(o.base + "earth_lights_2048.png"), cl = loadTex(o.base + "earth_clouds_1024.png");
      const mat = new THREE.MeshStandardMaterial({ map: day, normalMap: nrm, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 0.75, metalness: 0, emissiveMap: lights, emissive: new THREE.Color("#ffcf8a"), emissiveIntensity: 0.0 });
      mat.onBeforeCompile = (sh) => { // ocean glint from the specular mask; city lights only on the night side
        sh.uniforms.specMap = { value: spec };
        sh.fragmentShader = sh.fragmentShader.replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n roughnessFactor = mix(0.85, 0.32, texture2D(specMap, vUv).r);")
          .replace("uniform float opacity;", "uniform float opacity; uniform sampler2D specMap;");
      };
      if (o.brick) { // BRICK PLANET: glossy 3D studded LEGO plates + beveled trans-blue ocean tiles + raised continents
        const N = o.cells || [240, 120];
        mat.color.set("#ffffff"); mat.emissiveIntensity = o.lights || 0;
        mat.onBeforeCompile = (sh) => {
          sh.uniforms.specMap = { value: spec }; sh.uniforms.uN = { value: new THREE.Vector2(N[0], N[1]) };
          sh.fragmentShader = sh.fragmentShader
            .replace("uniform float opacity;", "uniform float opacity; uniform sampler2D specMap; uniform vec2 uN; float bh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }")
            .replace("#include <map_fragment>", `
              vec2 cellI = floor(vUv * uN); vec2 cellC = (cellI + 0.5) / uN; vec2 cf = fract(vUv * uN) - 0.5;
              float isSea = step(0.5, texture2D(specMap, cellC).r);
              vec3 src = texture2D(map, cellC).rgb; float lum = dot(src, vec3(0.3, 0.55, 0.15)); float hv = bh(cellI);
              vec3 brickC;
              if (isSea > 0.5) brickC = mix(vec3(0.035, 0.20, 0.52), vec3(0.075, 0.34, 0.68), hv);                  // vibrant trans-blue LEGO tiles
              else if (lum > 0.42) brickC = vec3(0.88, 0.90, 0.93);                                                 // ice / snow: white bricks
              else if (src.r > src.g * 1.05) brickC = mix(vec3(0.62, 0.47, 0.26), vec3(0.72, 0.56, 0.33), hv);     // desert: tan LEGO plates
              else brickC = mix(vec3(0.14, 0.36, 0.10), vec3(0.24, 0.48, 0.15), hv);                                // lush green LEGO plates
              vec2 ga0 = abs(cf); float seam0 = smoothstep(0.41, 0.5, max(ga0.x, ga0.y));
              float studTop = 1.0 - smoothstep(0.25, 0.31, length(cf));
              brickC *= (1.0 - (isSea > 0.5 ? 0.24 : 0.30) * seam0) * (1.0 + (isSea > 0.5 ? 0.05 : 0.12) * studTop);
              diffuseColor.rgb *= brickC;`)
            .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n roughnessFactor = isSea > 0.5 ? 0.14 : 0.28;")
            .replace("#include <normal_fragment_maps>", `
              float d = length(cf); vec2 dir = d > 0.001 ? cf / d : vec2(0.0);
              vec3 mN = vec3(0.0, 0.0, 1.0);
              float studRim = smoothstep(0.21, 0.27, d) * (1.0 - smoothstep(0.27, 0.34, d));
              mN.xy += dir * studRim * (isSea < 0.5 ? 2.1 : 0.85);                                                  // crisp 3D stud rim on land + subtle ocean stud relief
              vec2 ga = abs(cf); float gb = smoothstep(0.40, 0.5, max(ga.x, ga.y));
              mN.xy += sign(cf) * step(ga.yx, ga.xy) * gb * 1.45;                                                   // deep LEGO tile/plate bevel groove
              normal = perturbNormal2Arb(-vViewPosition, normal, normalize(mN), faceDirection);`)
            .replace("#include <emissivemap_fragment>", "totalEmissiveRadiance *= texture2D(emissiveMap, cellC).rgb * (1.0 - isSea);");
        };
        mat.customProgramCacheKey = () => "brick-earth-v3-" + N[0];
      }
      const globe = new THREE.Mesh(new THREE.SphereGeometry(o.r, 256, 128), mat);
      globe.frustumCulled = false;
      grp.add(globe);
      // the cloud PNG carries its shape in the ALPHA channel (RGB is white everywhere): use it as map, not alphaMap
      const rCloud = o.r + Math.min(o.r * 0.008, 1.4);
      const clouds = new THREE.Mesh(new THREE.SphereGeometry(rCloud, 192, 96), new THREE.MeshStandardMaterial({ map: cl, color: "#e9eef4", transparent: true, opacity: 0.7, depthWrite: false, roughness: 1 }));
      clouds.frustumCulled = false;
      if (o.brick) { // clouds become 3D studded white LEGO plates one layer above the ground
        const NC = (o.cells || [240, 120]).map((v) => v / 2);
        const cCut = o.cloudCut || 0.46;
        clouds.material.normalMap = nrm; clouds.material.transparent = false; clouds.material.depthWrite = true; clouds.material.alphaTest = 0.5; clouds.material.opacity = 1; clouds.material.color.set("#f6f8fb"); clouds.material.roughness = 0.34;
        clouds.material.onBeforeCompile = (sh) => {
          sh.uniforms.uN = { value: new THREE.Vector2(NC[0], NC[1]) };
          sh.fragmentShader = sh.fragmentShader
            .replace("uniform float opacity;", "uniform float opacity; uniform vec2 uN;")
            .replace("#include <map_fragment>", "vec2 cc = (floor(vUv * uN) + 0.5) / uN; vec4 ct = texture2D(map, cc); diffuseColor.a = step(" + cCut.toFixed(3) + ", ct.a); vec2 cf2 = fract(vUv * uN) - 0.5; float cSeam = smoothstep(0.40, 0.5, max(abs(cf2.x), abs(cf2.y))); float cStud = 1.0 - smoothstep(0.24, 0.30, length(cf2)); diffuseColor.rgb *= (1.0 - 0.24 * cSeam) * (1.0 + 0.08 * cStud);")
            .replace("#include <normal_fragment_maps>", `
              vec2 cf3 = fract(vUv * uN) - 0.5; float cd = length(cf3); vec2 cdir = cd > 0.001 ? cf3 / cd : vec2(0.0);
              vec3 cmN = vec3(0.0, 0.0, 1.0);
              cmN.xy += cdir * (smoothstep(0.20, 0.27, cd) * (1.0 - smoothstep(0.27, 0.34, cd))) * 1.6;
              vec2 cga = abs(cf3); cmN.xy += sign(cf3) * step(cga.yx, cga.xy) * smoothstep(0.40, 0.5, max(cga.x, cga.y)) * 1.2;
              normal = perturbNormal2Arb(-vViewPosition, normal, normalize(cmN), faceDirection);`);
        };
        clouds.material.customProgramCacheKey = () => "brick-clouds-v3-" + NC[0] + "-" + cCut.toFixed(2);
      }
      grp.add(clouds);
      // Single continuous Rayleigh Fresnel limb atmosphere anchored FLUSH to Earth's horizon (zero detached royal-blue ring!)
      const kAtmo = o.r > 500 ? 1.016 : 1.024, muH = Math.sqrt(1 - 1 / (kAtmo * kAtmo));
      const atmo = new THREE.Mesh(
        new THREE.SphereGeometry(o.r * kAtmo, 192, 96),
        new THREE.ShaderMaterial({
          uniforms: { uC1: { value: new THREE.Color("#7ac4ff") }, uC2: { value: new THREE.Color("#2b6ee8") }, uMuH: { value: muH }, uI: { value: 1.0 } },
          vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
          fragmentShader: `
            uniform vec3 uC1, uC2; uniform float uMuH, uI; varying vec3 vN; varying vec3 vV;
            void main(){
              float mu = clamp(dot(-normalize(vN), normalize(vV)), 0.0, 1.0);
              float outer = pow(smoothstep(0.0, uMuH, mu), 2.2);
              float inner = exp(-max(0.0, mu - uMuH) * 6.5);
              float limb = outer * inner;
              vec3 col = mix(uC2, uC1, smoothstep(0.0, uMuH * 1.15, mu));
              gl_FragColor = vec4(col * limb * 1.15 * uI, 1.0);
            }`,
          transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide,
        })
      );
      atmo.frustumCulled = false;
      grp.add(atmo); fxLayer(atmo);
      return { group: grp, globe, clouds, atmo, atmo2: atmo };
    };

    return X;
  }

  window.FXKIT = { setup };
})();
