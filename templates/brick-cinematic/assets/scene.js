/* ============================================================================
   brick-cinematic DEMO scene. Shows the three things this template adds on top of brick-story:
   1. full environments (FX sky + matching reflection map + ground/ocean), set per shot with `look`
   2. effects: flames, smoke, brick debris, Earth from orbit
   3. the cinematic look: bloom, depth of field, colour grade (all in `look`)
   Replace this file for a real video. Keep build()/update(t) pure functions of time.
   ============================================================================ */
(function () {
  const F = window.FILM;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  let K, X, S = {};

  function build(ctx) {
    K = BRICK.setup(ctx); X = FXKIT.setup(ctx); LDRAW_KIT.setup(ctx, K, X); // K.mfig = real LDraw-part minifigs
    const { scene, THREE } = ctx;
    // environments: one sky dome per world, one reflection map per sky
    X.skyEnv("golden", "golden"); X.skyEnv("space", "space");
    S.BEACH = new THREE.Group(); scene.add(S.BEACH);
    S.skyG = X.sky(S.BEACH, "golden");
    X.ground(S.BEACH, { size: 300, colors: ["#d8c39a", "#c6ad80", "#e6d6b2"], kind: "sand", seed: 4 }).position.z = 20;
    S.sea = X.ocean(S.BEACH, { y: -0.05, color: "#1f5a66" }); S.sea.position.z = -150;
    S.fig = K.mfig({ kind: "polo", top: "#1d2733", legs: "#2b2f38", hair: "#3b2a1a", hairStyle: "short", skin: K.SKIN.toy, headset: true });
    S.fig2 = K.mfig({ kind: "blouse", top: "#b8202a", legs: "#2b3346", hair: "#c9a26b", hairStyle: "ponytail", lashes: true, lips: "#a0404a" });
    S.fig3 = K.fig({ kind: "polo", top: "#1d2733", legs: "#2b2f38", hair: "#3b2a1a", hairStyle: "short" }); // procedural figure for comparison
    S.BEACH.add(S.fig.root); S.BEACH.add(S.fig2.root); S.BEACH.add(S.fig3.root);
    S.smoke = X.particles(S.BEACH, { max: 500, blend: "smoke" });
    S.fire = X.particles(S.BEACH, { max: 300, blend: "add" });
    S.flame = X.flame(S.BEACH, { r: 0.5, len: 6 }); S.flame.position.set(4, 6, -6);
    S.deb = X.debris(S.BEACH, { n: 120 });
    S.SPACE = new THREE.Group(); scene.add(S.SPACE);
    X.stars(S.SPACE, {}); S.earth = X.earth(S.SPACE, { r: 100 }); S.earth.group.position.set(0, -104, 0);
  }

  function update(t, ctx) {
    const space = t >= 14;
    S.BEACH.visible = !space; S.SPACE.visible = space;
    X.tickOcean(S.sea, t); S.skyG.material.uniforms.uTime.value = t;
    if (!space) {
      K.P(S.fig, { x: -0.6, z: 2, ry: 0.2, face: "smile", gesture: t > 3 ? "point" : null }); K.P(S.fig2, { x: 0.6, z: 2, ry: -0.3, face: "grin", gesture: t > 3 ? "wave" : null }); K.P(S.fig3, { x: 1.8, z: 1.6, ry: -0.3, face: "smile" });
      X.setFlame(S.flame, t, { power: t > 6 ? 1 : 0, len: 6 });
      S.smoke.begin();
      X.emit(S.smoke, t, { t0: 6, rate: 40, life: 4, seed: 1, origin: () => [4, 0.5, -6], vel: (tb, i, r) => [(r(1) - 0.5) * 14, 2 + r(2) * 3, (r(3) - 0.5) * 6], drag: 0.9, size: [1.5, 6], color: (k) => [0.92, 0.9, 0.88, 0.85 * (1 - k)] });
      S.smoke.end();
      S.fire.begin(); X.emit(S.fire, t, { t0: 6, rate: 60, life: 0.6, seed: 2, origin: () => [4, 1, -6], vel: (tb, i, r) => [(r(1) - 0.5) * 6, r(2) * 3, (r(3) - 0.5) * 3], size: [1.2, 2.5], color: (k) => [4, 2, 0.6, 1 - k] }); S.fire.end();
      X.burst(S.deb, t, 9, [4, 4, -6], { speed: 14, floor: 0.1 });
      const look = { env: "golden", bg: "#f3c890", fog: ["#e9c79c", 30, 260], sun: { color: "#ffd2a0", intensity: 3.2, dir: [-0.75, 0.3, -0.62], shadow: 12 },
        hemi: { sky: "#9cc0ff", ground: "#8a6a40", intensity: 0.7 }, rim: { color: "#ffd8b0", intensity: 1.6 }, bloom: 0.7, dof: 0.8, vignette: 0.4,
        grade: { sat: 1.12, contrast: 1.08, lift: [0.01, 0, 0.03], gain: [1.04, 1.0, 0.95] } };
      return t < 6 ? { target: [0.4, 0.95, 2], dist: 5.2, az: 10, el: 6, look } : { target: [3, 4, -5], dist: 22, az: 10, el: 6, look: Object.assign({}, look, { dof: 0.3 }) };
    }
    S.earth.globe.rotation.y = t * 0.01; S.earth.clouds.rotation.y = t * 0.012;
    return { target: [0, 0, 0], dist: 30, az: 0, el: 4, far: 3000, look: { env: "space", bg: "#000000", fog: null, sun: { color: "#ffffff", intensity: 3.5, dir: [-0.8, 0.2, 0.4], shadow: 20 },
      hemi: { sky: "#223", ground: "#000", intensity: 0.05 }, rim: { intensity: 0 }, bloom: 0.8, dof: 0 } };
  }

  window.SCENE = { build, update, labels: [], pixelRatio: 1.5 };
})();
