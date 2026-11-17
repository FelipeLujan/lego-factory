/* ============================================================================
   DISNEY-IGER (brick-cinematic, round 1)
   "He picked his successor. Less than three years later, he was back."
   Sets (all built around the origin; exactly one visible per shot):
     STAGE    theatre stage: red curtains, footlights, the CEO chair on a riser (hook, move one, recap, takeaway)
     PARK     castle-themed theme park at golden hour: generic brick castle, plaza, trees, visitors (no logos)
     OFFICE   executive corner office: EXEC CHAIRMAN plate, wall calendar 2020 -> 2021, city window
     BOARD    the boardroom on a Sunday night: skyline window, table, board, wall screen, CEO plate flip
     NEWS     TV news studio: anchor desk, video wall, studio cameras, brick bar charts (cuts + savings)
     TRIAN    activist investor's office: proxy-fight board, "CUT COSTS" demand sign that breaks into bricks
     STREET   dusk city street in 2024: Peltz walks back, lamp posts, cars, marquee
     HALL     shareholder meeting hall: stage, voting screen, seated shareholders, share-brick stacks, confetti
     STUDIO   polished DealCalm studio: giant brick phone app, dealcalm.com + App Store signs, Iger
   Everything is a pure function of t (no Math.random). Camera steady on captions (the stage adds chapter push/whip only).
   ============================================================================ */
(function () {
  const F = window.FILM;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const mix = (a, b, k) => a + (b - a) * k;
  const ss = (a, b, x) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  const DEG = Math.PI / 180;
  const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  let K, X, THREE, FL = 0.08;
  const W = {}, O = {}, C = {};
  const FIGS = [];

  // ---------------------------------------------------------------- looks (warm key + cool rim everywhere)
  const GRADE = { sat: 1.12, contrast: 1.07, lift: [0.01, 0.004, 0.02], gain: [1.03, 1.0, 0.97] };
  const LOOK = {
    room: { env: "studio", bg: "#2b241e", fog: ["#3b3129", 20, 70], exposure: 1.0,
      sun: { color: "#ffd8a6", intensity: 2.3, dir: [0.35, 0.85, 0.55], shadow: 7 },
      hemi: { sky: "#fff0dc", ground: "#4a3a2c", intensity: 0.66 },
      rim: { color: "#9cc6ff", intensity: 1.25, dir: [-0.5, 0.45, -0.75] },
      fill: { color: "#ffe2cc", intensity: 0.38 },
      bloom: 0.45, threshold: 2.3, dof: 0.45, vignette: 0.38, grade: GRADE },
    night: { env: "night", bg: "#0d1322", fog: ["#121a2c", 24, 90], exposure: 0.98,
      sun: { color: "#ffc684", intensity: 1.35, dir: [0.15, 0.95, 0.3], shadow: 8 },
      hemi: { sky: "#7f93d0", ground: "#1c1822", intensity: 0.42 },
      rim: { color: "#6fa8ff", intensity: 1.5, dir: [-0.5, 0.4, -0.8] },
      fill: { color: "#ffd9b8", intensity: 0.3 },
      bloom: 0.5, threshold: 2.3, dof: 0.45, vignette: 0.42,
      grade: { sat: 1.12, contrast: 1.08, lift: [0.0, 0.01, 0.04], gain: [1.02, 1.0, 1.02] } },
    stage: { env: "studio", bg: "#140c0c", fog: ["#1c1212", 18, 60], exposure: 0.92,
      sun: { color: "#ffe0b0", intensity: 2.2, dir: [0.25, 0.9, 0.45], shadow: 7 },
      hemi: { sky: "#ffe6cc", ground: "#3a1c1c", intensity: 0.55 },
      rim: { color: "#8fc0ff", intensity: 1.45, dir: [-0.45, 0.5, -0.75] },
      fill: { color: "#ffd9c0", intensity: 0.42 },
      bloom: 0.5, threshold: 2.3, dof: 0.45, vignette: 0.45,
      grade: { sat: 1.14, contrast: 1.09, lift: [0.012, 0.004, 0.01], gain: [1.04, 1.0, 0.96] } },
    golden: { env: "golden", bg: "#8fb8ea", fog: ["#c9d6e6", 70, 480], exposure: 0.8,
      sun: { color: "#ffc98a", intensity: 2.7, dir: [-0.62, 0.42, 0.66], shadow: 14 },
      hemi: { sky: "#8fb4f0", ground: "#5a4a36", intensity: 0.62 },
      rim: { color: "#bcd8ff", intensity: 1.6, dir: [0.55, 0.4, -0.75] },
      fill: { color: "#ffe2cc", intensity: 0.26 },
      bloom: 0.45, threshold: 2.3, dof: 0.4, vignette: 0.38,
      grade: { sat: 1.14, contrast: 1.08, lift: [0.01, 0.0, 0.03], gain: [1.04, 1.0, 0.95] } },
    day: { env: "day", bg: "#79aee6", fog: ["#c9def2", 50, 480], exposure: 0.98,
      sun: { color: "#fff0d8", intensity: 2.9, dir: [-0.45, 0.62, 0.62], shadow: 12 },
      hemi: { sky: "#b2d2ff", ground: "#6a7a50", intensity: 0.8 },
      rim: { color: "#d6eaff", intensity: 1.35, dir: [0.6, 0.4, -0.7] },
      fill: { color: "#ffe6d2", intensity: 0.32 },
      bloom: 0.45, threshold: 2.3, dof: 0.4, vignette: 0.36, grade: GRADE },
    studio: { env: "studio", bg: "#0f1a24", fog: ["#13202c", 22, 70], exposure: 0.96,
      sun: { color: "#ffd9b0", intensity: 2.2, dir: [-0.5, 0.55, 0.75], shadow: 7 },
      hemi: { sky: "#d8ecff", ground: "#24323a", intensity: 0.7 },
      rim: { color: "#40e0c8", intensity: 0.9, dir: [-0.55, 0.45, -0.7] },
      fill: { color: "#ffe6d4", intensity: 0.55 },
      bloom: 0.4, threshold: 2.3, dof: 0.35, vignette: 0.4,
      grade: { sat: 1.12, contrast: 1.08, lift: [0.0, 0.01, 0.03], gain: [1.02, 1.0, 1.0] } },
  };
  const L = (n, e) => Object.assign({}, LOOK[n], e || {});

  // ---------------------------------------------------------------- small builders (set in build)
  let M, glowM, bx, rbx, cyl, tex, grp, RB, BR22, SLOPE;
  function helpers(ctx) {
    M = (c, e) => K.plastic(c, e);
    glowM = (c, k) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k == null ? 2 : k), toneMapped: false });
    const put = (p, geo, mat, x, y, z, ry) => { const m = new THREE.Mesh(geo, typeof mat === "string" ? M(mat) : mat); m.position.set(x || 0, y || 0, z || 0); if (ry) m.rotation.y = ry; m.castShadow = m.receiveShadow = true; p.add(m); return m; };
    bx = (p, w, h, d, mat, x, y, z, ry) => put(p, new THREE.BoxGeometry(w, h, d), mat, x, y, z, ry);
    rbx = (p, w, h, d, mat, x, y, z, ry, r) => put(p, X.roundBox(w, h, d, r == null ? Math.min(0.03, w / 4, h / 4, d / 4) : r, 2), mat, x, y, z, ry);
    cyl = (p, rt, rb, h, mat, x, y, z, n) => put(p, new THREE.CylinderGeometry(rt, rb, h, n || 20), mat, x, y, z);
    tex = (w, h, draw) => K.canvasTex(w, h, draw);
    grp = (parent, x, y, z, ry) => { const g = new THREE.Group(); g.position.set(x || 0, y || 0, z || 0); g.rotation.y = ry || 0; (parent || ctx.scene).add(g); return g; };
  }
  const noShadow = (m) => { m.castShadow = false; return m; };
  // close the hollow LDraw leg soles (seated figures show them to the camera): a leg-coloured plate inside each foot
  function capLegs(fg) {
    fg.legs.forEach((Lg) => { const lm = Lg.children.find((o) => o.isMesh); if (!lm) return;
      lm.geometry.computeBoundingBox(); const b = lm.geometry.boundingBox, mat = Array.isArray(lm.material) ? lm.material[0] : lm.material;
      const w = b.max.x - b.min.x, d = b.max.z - b.min.z, th = 0.03;
      const cap = new THREE.Mesh(new THREE.BoxGeometry(w - 0.012, th, d - 0.012), mat); cap.position.set((b.min.x + b.max.x) / 2, b.min.y + 0.002 + th / 2, (b.min.z + b.max.z) / 2); cap.castShadow = true; Lg.add(cap);
      const fill = new THREE.Mesh(new THREE.BoxGeometry(w - 0.03, 0.2, d - 0.03), mat); fill.position.set((b.min.x + b.max.x) / 2, b.min.y + 0.11, (b.min.z + b.max.z) / 2); Lg.add(fill); });
  }
  // brick-part burst: real LDraw bricks/plates/tiles (uniform scale), ballistic arc, one floor bounce, settle, shrink out late
  function brickBurst(p, n, colors, parts, scale) {
    parts = parts || ["3004", "3005", "3023", "3024", "3069b", "3003"];
    const geos = parts.map((id) => X.ld(id, scale || 0.0173)).filter(Boolean), ms = [];
    for (let i = 0; i < n; i++) { const m = new THREE.Mesh(geos[i % geos.length], M(colors[i % colors.length], { roughness: 0.42, clearcoat: 0.2 })); m.castShadow = true; m.visible = false; p.add(m); ms.push(m); }
    return { ms };
  }
  function tickBurst(B, t, t0, at, o) {
    o = Object.assign({ speed: 2.2, up: 2.2, gravity: -9, floor: 0, life: 6, spread: 1, dir: null }, o || {});
    const age = t - t0, on = age >= 0 && age < o.life;
    B.ms.forEach((m, i) => { m.visible = on; if (!on) return;
      const r = (k) => rnd(i * 13.7 + k * 5.3 + t0 * 3.1), a = r(1) * Math.PI * 2, sp = o.speed * (0.35 + r(2) * 0.9);
      let vx = Math.cos(a) * sp * o.spread, vz = Math.sin(a) * sp * o.spread, vy = o.up * (0.5 + r(3));
      if (o.dir) { vx += o.dir[0]; vy += o.dir[1]; vz += o.dir[2]; }
      const fl = typeof o.floor === "function" ? o.floor(at[0] + vx * age, at[2] + vz * age) : o.floor;
      // time of first floor hit, then a damped bounce, then rest
      const g = o.gravity, h0 = at[1] - fl, tHit = (-vy - Math.sqrt(Math.max(0, vy * vy - 2 * g * h0))) / g;
      let x, y, z, tt = age, spin = 1;
      if (age < tHit) { y = at[1] + vy * age + 0.5 * g * age * age; x = at[0] + vx * age; z = at[2] + vz * age; }
      else { const vb = Math.abs(vy + g * tHit) * 0.3, tb = age - tHit, tB = -2 * vb / g, k = Math.min(tb, tB); y = fl + Math.max(0, vb * k + 0.5 * g * k * k); const slide = Math.min(tb, tB + 0.2) * 0.35;
        x = at[0] + vx * (tHit + slide); z = at[2] + vz * (tHit + slide); tt = tHit + Math.min(tb, tB) * 0.5; spin = 0; }
      m.position.set(x, y, z);
      m.rotation.set(r(4) * 6 + tt * 8 * (r(5) - 0.5), r(6) * 6 + tt * 8 * (r(7) - 0.5), age < tHit ? r(8) * 6 + tt * 6 * (r(9) - 0.5) : 0);
      if (!spin) { m.rotation.x = 0; m.rotation.z = 0; }
      m.scale.setScalar(age > o.life - 0.5 ? Math.max(0.01, (o.life - age) / 0.5) : 1); });
  }
  // real-scale studs (LDraw pitch 20 LDU, stud 12 LDU) for surfaces next to minifigs; skip(x, z) leaves gaps
  const SP = 0.346, studGeo2 = () => (studGeo2.g || (studGeo2.g = new THREE.CylinderGeometry(0.104, 0.104, 0.06, 18).translate(0, 0.03, 0)));
  function studs2(p, col, x0, z0, w, d, y, skip) {
    const nx = Math.floor(w / SP + 1e-6), nz = Math.floor(d / SP + 1e-6), ox = x0 + (w - nx * SP) / 2, oz = z0 + (d - nz * SP) / 2, L2 = [];
    for (let a = 0; a < nx; a++) for (let b = 0; b < nz; b++) { const x = ox + (a + 0.5) * SP, z = oz + (b + 0.5) * SP; if (!skip || !skip(x, z)) L2.push([x, z]); }
    const im = new THREE.InstancedMesh(studGeo2(), typeof col === "string" ? M(col) : col, Math.max(1, L2.length)), mm = new THREE.Matrix4();
    L2.forEach(([x, z], i) => im.setMatrixAt(i, mm.makeTranslation(x, y, z))); im.count = L2.length; im.castShadow = im.receiveShadow = true; im.frustumCulled = false; p.add(im); return im;
  }

  // floors: top surface at FL
  function tileFloor(p, w, d, a, b, tile, gloss, z0) {
    const t = tex(512, 512, (g, Wd, H) => {
      const n = 4, s = Wd / n;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const c = new THREE.Color((i + j) % 2 ? a : b).multiplyScalar(0.94 + rnd(i * 7 + j) * 0.1);
        g.fillStyle = "#" + c.getHexString(); g.fillRect(i * s, j * s, s, s);
      }
      g.strokeStyle = "rgba(0,0,0,0.28)"; g.lineWidth = 4;
      for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, H); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(Wd, i * s); g.stroke(); }
    });
    const ext = 14; d += ext;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(w / (tile * 4), d / (tile * 4));
    return bx(p, w + 6, FL, d, new THREE.MeshPhysicalMaterial({ map: t, bumpMap: t, bumpScale: 0.8, roughness: gloss ? 0.42 : 0.6, clearcoat: gloss ? 0.35 : 0.1, clearcoatRoughness: 0.25 }), 0, FL / 2, ext / 2 + (z0 || 0));
  }
  function plankFloor(p, w, d, col, z0) { // stage floor: staggered 1x4 / 1x6 tiles with real gaps and a top bevel
    const t = tex(512, 512, (g, Wd, H) => {
      g.fillStyle = "#1e130c"; g.fillRect(0, 0, Wd, H); const rh = 64;
      for (let r = 0; r < 8; r++) { let x = -((r * 37) % 3) * 42; let k = 0; while (x < Wd) { const len = (rnd(r * 17 + k) > 0.5 ? 4 : 6) * 32; const c = new THREE.Color(col).multiplyScalar(0.84 + rnd(r * 7 + k * 3) * 0.22);
        g.fillStyle = "#" + c.getHexString(); g.fillRect(x + 3, r * rh + 3, len - 6, rh - 6); g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(x + 3, r * rh + 3, len - 6, 5); g.fillStyle = "rgba(0,0,0,0.18)"; g.fillRect(x + 3, r * rh + rh - 8, len - 6, 5); x += len; k++; } }
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(w / 2.8, d / 2.8);
    return bx(p, w, FL, d, new THREE.MeshPhysicalMaterial({ map: t, bumpMap: t, bumpScale: 1.0, roughness: 0.45, clearcoat: 0.2, clearcoatRoughness: 0.3 }), 0, FL / 2, z0 || 0);
  }
  // brick walls (castShadow off so the sun still reaches the room)
  function fineWall(g, cols, x0, z, n, rows, skip) {
    const Lw = n * 0.8, Hw = rows * 0.48, bl = 0.48, bh = 0.24, nr = Math.round(Hw / bh), lists = cols.map(() => []);
    for (let r = 0; r < nr; r++) {
      let i = 0;
      for (let x = x0 - (r % 2 ? bl / 2 : 0); x < x0 + Lw - 1e-6; x += bl, i++) {
        const a = Math.max(x, x0), b = Math.min(x + bl, x0 + Lw); if (b - a < 0.05) continue;
        const orow = Math.floor((r + 0.5) * bh / 0.48), cx = (a + b) / 2;
        if (skip && (skip(orow, cx - x0) || skip(orow, a + 0.04 - x0) || skip(orow, b - 0.04 - x0))) continue;
        lists[(r * 7 + i * 3) % cols.length].push([cx, (r + 0.5) * bh, b - a]);
      }
    }
    const mm = new THREE.Matrix4(), q0 = new THREE.Quaternion(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
    lists.forEach((L2, ci) => { if (!L2.length) return; const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), K.plastic(cols[ci], { roughness: 0.5, clearcoat: 0.15 }), L2.length);
      L2.forEach((bk, k) => im.setMatrixAt(k, mm.compose(v1.set(bk[0], bk[1], z), q0, v2.set(bk[2] - 0.014, bh - 0.014, 0.396)))); im.receiveShadow = true; im.frustumCulled = false; g.add(im); });
    const back = new THREE.Mesh(new THREE.BoxGeometry(Lw, Hw, 0.02), M("#2a2622")); back.position.set(x0 + Lw / 2, Hw / 2, z - 0.19); g.add(back);
    if (skip) back.visible = false;
    K.studField(g, cols[0], x0, z - 0.2, 2 * n, 1, Hw);
    return g;
  }
  function wallBack(p, cols, x0, x1, z, rows, skip) {
    const g = grp(p, 0, FL, 0); fineWall(g, cols, x0, z, Math.round((x1 - x0) / 0.8), rows, skip);
    g.traverse((o) => { if (o.isMesh) o.castShadow = false; }); return g;
  }
  function wallSide(p, cols, x, z0, z1, rows, side, skip) { // side -1: left wall (faces +x), +1: right wall (faces -x)
    const g = grp(p, x, FL, 0, side < 0 ? Math.PI / 2 : -Math.PI / 2);
    const a = side < 0 ? -z1 : z0, b = side < 0 ? -z0 : z1;
    fineWall(g, cols, a, 0, Math.round((b - a) / 0.8), rows, skip);
    g.traverse((o) => { if (o.isMesh) o.castShadow = false; }); return g;
  }
  function ceiling(p, w, d, y, col, panels) {
    const c = bx(p, w + 0.8, 0.12, d + 0.8, col || "#e8e4dc", 0, y + 0.06, 0); c.castShadow = false;
    (panels || []).forEach(([x, z, pw, pd]) => { const m = bx(p, pw, 0.02, pd, glowM("#fff4dc", 2.2), x, y - 0.01, z); m.castShadow = false; });
    return c;
  }
  function windowFrame(p0, x0, y0, z0, w, h, frameCol, nV, ry) {
    const p = grp(p0, x0, y0, z0, ry || 0);
    const fm = M(frameCol || "#2d3036"), trim = M(frameCol || "#3a3d42", { roughness: 0.5, clearcoat: 0.2 });
    bx(p, w + 1.3, 0.5, 0.46, trim, 0, h / 2 + 0.2, 0); bx(p, w + 1.3, 0.3, 0.52, trim, 0, -h / 2 - 0.1, 0);
    bx(p, 0.62, h + 0.7, 0.46, trim, -w / 2 - 0.31, 0, 0); bx(p, 0.62, h + 0.7, 0.46, trim, w / 2 + 0.31, 0, 0);
    bx(p, w + 0.16, 0.08, 0.3, fm, 0, h / 2 - 0.04, 0); bx(p, w + 0.16, 0.08, 0.3, fm, 0, -h / 2 + 0.04, 0);
    for (let i = 1; i < (nV || 3); i++) bx(p, 0.06, h, 0.12, fm, -w / 2 + (w * i) / (nV || 3), 0, 0);
    bx(p, w, 0.06, 0.12, fm, 0, h * 0.18, 0);
    const gl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshPhysicalMaterial({ color: "#d8ecff", roughness: 0.04, transparent: true, opacity: 0.12, clearcoat: 1, depthWrite: false }));
    gl.position.set(0, 0, 0.02); p.add(gl);
    return p;
  }

  // brick skyline seen through windows: facades with window grids; night = lit windows (emissive)
  const SKYMATS = [];
  function facadeMat(seed, base) {
    const t = tex(256, 512, (g, Wd, H) => {
      g.fillStyle = base; g.fillRect(0, 0, Wd, H);
      g.strokeStyle = "rgba(0,0,0,0.18)"; g.lineWidth = 2;
      for (let y = 0; y < H; y += 12) { g.beginPath(); g.moveTo(0, y); g.lineTo(Wd, y); g.stroke(); }
      for (let y = 18; y < H - 10; y += 40) for (let x = 14; x < Wd - 20; x += 34) {
        const lit = rnd(seed * 31 + x * 3 + y) > 0.45;
        g.fillStyle = lit ? "#ffd9a0" : "#2b3a52"; g.fillRect(x, y, 22, 26);
        g.fillStyle = "rgba(255,255,255,0.25)"; g.fillRect(x, y, 22, 4);
      }
    });
    const e = tex(256, 512, (g, Wd, H) => {
      g.fillStyle = "#000"; g.fillRect(0, 0, Wd, H);
      for (let y = 18; y < H - 10; y += 40) for (let x = 14; x < Wd - 20; x += 34) if (rnd(seed * 31 + x * 3 + y) > 0.45) { g.fillStyle = "#ffcf8a"; g.fillRect(x, y, 22, 26); }
    });
    const m = new THREE.MeshStandardMaterial({ map: t, emissiveMap: e, emissive: new THREE.Color("#ffffff"), emissiveIntensity: 0.0, roughness: 0.7 });
    SKYMATS.push(m); return m;
  }
  function skyline(p, o) { // o: {z, x0, x1, n, hMin, hMax, seed, rows, street}
    o = Object.assign({ z: -18, x0: -30, x1: 30, n: 12, hMin: 8, hMax: 26, seed: 1, rows: 2 }, o);
    const cols = ["#b9a089", "#8f9aa6", "#c9c2b4", "#7d6a5a", "#a7b3bf", "#d1b48c"], RL = [];
    for (let r = 0; r < o.rows; r++) for (let i = 0; i < o.n; i++) {
      const k = o.seed * 100 + r * 37 + i, w = 3 + rnd(k) * 5, h = o.hMin + rnd(k + 3) * (o.hMax - o.hMin), d = 4 + rnd(k + 5) * 4;
      const x = o.x0 + (i + 0.5) * (o.x1 - o.x0) / o.n + (rnd(k + 7) - 0.5) * 2, z = o.z - r * 12 - rnd(k + 9) * 5;
      const mat = facadeMat(k, cols[(i + r) % cols.length]);
      mat.map.repeat.set(Math.max(1, Math.round(w / 3)), Math.max(1, Math.round(h / 6))); mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
      mat.emissiveMap.repeat.copy(mat.map.repeat); mat.emissiveMap.wrapS = mat.emissiveMap.wrapT = THREE.RepeatWrapping;
      noShadow(bx(p, w, h, d, mat, x, h / 2 - 0.5, z));
      noShadow(bx(p, w + 0.3, 0.4, d + 0.3, M("#5b5f66"), x, h - 0.3, z));
      if (rnd(k + 11) > 0.6) noShadow(cyl(p, 0.05, 0.05, 2.5, M("#9aa0a6"), x, h + 1.0, z));
      for (let yy = 0.94; yy < h - 0.8; yy += 0.94) RL.push([x, yy - 0.5, z + d / 2 + 0.06, w + 0.1, 0.1, 0.16]);
      const nP = Math.max(2, Math.round(w / 1.5)); for (let q = 0; q <= nP; q++) RL.push([x - w / 2 + q * w / nP, h / 2 - 0.5, z + d / 2 + 0.08, 0.16, h, 0.18]);
    }
    if (o.street !== false) {
      const cx = (o.x0 + o.x1) / 2, wd = (o.x1 - o.x0) + 40;
      noShadow(bx(p, wd, 0.1, 60, M("#2c3036", { roughness: 0.9, clearcoat: 0 }), cx, -0.56, o.z - 18));
      noShadow(bx(p, wd, 0.02, 1.8, M("#3c4048", { roughness: 0.8, clearcoat: 0 }), cx, -0.5, o.z + 8.6));
      const nL = o.n * 2;
      for (let i = 0; i < nL; i++) { const k = o.seed * 50 + i + 900, w = (o.x1 - o.x0) / nL * (0.75 + rnd(k) * 0.2), h = 1.6 + rnd(k + 1) * 2.8, x = o.x0 + (i + 0.5) * (o.x1 - o.x0) / nL;
        noShadow(bx(p, w, h, 2.4, M(cols[(i + 2) % cols.length], { roughness: 0.75, clearcoat: 0 }), x, h / 2 - 0.5, o.z + 6.2));
        noShadow(bx(p, w + 0.2, 0.25, 2.6, M("#4b4f56"), x, h - 0.5, o.z + 6.2));
        noShadow(bx(p, w * 0.72, 0.7, 0.04, glowM(rnd(k + 2) > 0.5 ? "#ffd9a0" : "#bfe0ff", 0.9 + rnd(k + 3) * 0.6), x, 0.05, o.z + 7.43)); }
      for (let i = 0; i < nL; i++) noShadow(bx(p, 0.12, 0.12, 0.12, glowM("#ffd08a", 2.2), o.x0 + (i + 0.5) * (o.x1 - o.x0) / nL, 1.2, o.z + 8.0));
    }
    if (RL.length) { const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), M("#7a756e", { roughness: 0.6, clearcoat: 0.1 }), RL.length); const mm = new THREE.Matrix4(), q0 = new THREE.Quaternion(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
      RL.forEach((r, i) => im.setMatrixAt(i, mm.compose(v1.set(r[0], r[1], r[2]), q0, v2.set(r[3], r[4], r[5])))); im.frustumCulled = false; p.add(im); }
  }
  function setNight(on) { SKYMATS.forEach((m) => { m.emissiveIntensity = on ? 1.5 : 0.0; m.color.setScalar(on ? 0.16 : 1.0); }); }

  // practical lights
  function pendant(p, x, y, z, col, power) {
    const g = grp(p, x, y, z);
    cyl(g, 0.01, 0.01, 0.7, M("#1b1b1b"), 0, -0.35, 0, 6);
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.3, 0.28, 24, 1, true), M("#23262b", { side: THREE.DoubleSide, metalness: 0.4 }));
    sh.position.y = -0.82; g.add(sh);
    const b = new THREE.Mesh(new THREE.CircleGeometry(0.27, 24), glowM(col || "#ffd9a0", 4)); b.rotation.x = Math.PI / 2; b.position.y = -0.95; g.add(b);
    const l = new THREE.PointLight(col || "#ffcf8a", power == null ? 2.2 : power, 7, 1.6); l.position.y = -1.1; g.add(l);
    return g;
  }
  function deskLamp(p, x, y, z, ry) {
    const g = grp(p, x, y, z, ry || 0), dk = M("#2b2d31", { metalness: 0.4, roughness: 0.4 });
    cyl(g, 0.09, 0.1, 0.03, dk, 0, 0.015, 0, 16); const arm = cyl(g, 0.012, 0.012, 0.36, dk, 0, 0.2, -0.02, 8); arm.rotation.x = 0.25;
    const sh = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.12, 18, 1, true), M("#2f6a4a", { side: THREE.DoubleSide })); sh.position.set(0, 0.38, 0.05); sh.rotation.x = -0.5; g.add(sh);
    const b = new THREE.Mesh(new THREE.CircleGeometry(0.075, 16), glowM("#ffe2a8", 3)); b.position.set(0, 0.34, 0.08); b.rotation.x = Math.PI / 2 + 0.5; g.add(b);
    const l = new THREE.PointLight("#ffcf8a", 0.9, 2.6, 1.8); l.position.set(0, 0.28, 0.12); g.add(l);
    return g;
  }
  function floorLamp(p, x, z, col) {
    const g = grp(p, x, FL, z);
    cyl(g, 0.16, 0.18, 0.05, M("#1b1b1b"), 0, 0.03, 0); cyl(g, 0.025, 0.025, 1.5, M("#2b2b2b", { metalness: 0.6 }), 0, 0.78, 0, 8);
    noShadow(cyl(g, 0.17, 0.22, 0.3, glowM(col || "#ffe2b0", 1.4), 0, 1.6, 0, 24));
    const l = new THREE.PointLight(col || "#ffcf8a", 1.4, 5, 1.8); l.position.y = 1.5; g.add(l);
    return g;
  }
  function spot(p, x, y, z, col, power, aimY) { // theatre / studio can light, hung from a truss
    const g = grp(p, x, y, z);
    cyl(g, 0.16, 0.24, 0.42, M("#1c1d20", { metalness: 0.5, roughness: 0.4 }), 0, 0, 0, 16);
    const b = new THREE.Mesh(new THREE.CircleGeometry(0.21, 20), glowM(col || "#fff1d6", 5)); b.rotation.x = Math.PI / 2; b.position.y = -0.215; g.add(b);
    const l = new THREE.PointLight(col || "#ffe8cc", power == null ? 1.6 : power, 9, 1.6); l.position.y = -0.5; g.add(l);
    return g;
  }
  // brick trees + street furniture (LDraw round bricks)
  function tree(p, x, z, s, leaf) {
    const g = grp(p, x, 0, z); g.scale.setScalar(s || 1);
    const trunk = M("#6b4a2e"), lf = M(leaf || "#3f8f3a", { roughness: 0.4 }), lf2 = M("#2f7a30", { roughness: 0.4 });
    for (let k = 0; k < 3; k++) { const m = new THREE.Mesh(RB, trunk); m.scale.setScalar(1.3); m.position.y = FL + k * 0.42; m.castShadow = true; g.add(m); }
    [[0.55, 1.35, 5], [0.45, 1.75, 5], [0.32, 2.15, 4], [0.0, 2.5, 1]].forEach(([r, y, n], i) => { for (let j = 0; j < n; j++) { const a = j / n * Math.PI * 2 + i * 0.6, m = new THREE.Mesh(BR22, (i + j) % 2 ? lf2 : lf); m.scale.set(0.95, 1.0, 0.95); m.position.set(Math.sin(a) * r, y + ((j % 2) * 0.08), Math.cos(a) * r); m.castShadow = true; g.add(m); } });
    return g;
  }
  function lampPost(p, x, z, h, light) {
    const g = grp(p, x, 0, z); h = h || 3.6;
    const pm = M("#2d323a", { roughness: 0.45, clearcoat: 0.2 }), nB = Math.max(2, Math.round((h - 0.2) / 0.42));
    { const base = new THREE.Mesh(BR22, pm); base.scale.set(0.42, 0.5, 0.42); g.add(base); }
    for (let k = 0; k < nB; k++) { const m = new THREE.Mesh(RB, pm); m.scale.set(0.5, (h - 0.2) / (nB * 0.42), 0.5); m.position.y = 0.2 + k * (h - 0.2) / nB; m.castShadow = true; g.add(m); }
    cyl(g, 0.26, 0.18, 0.22, pm, 0, h + 0.05, 0, 14);
    noShadow(cyl(g, 0.2, 0.2, 0.06, glowM("#ffe2a8", 2.6), 0, h - 0.08, 0, 14));
    if (light) { const l = new THREE.PointLight("#ffcf8a", 3.0, 9, 1.6); l.position.y = h - 0.4; g.add(l); }
    return g;
  }
  function bench(p, x, z, ry) {
    const g = grp(p, x, FL, z, ry);
    rbx(g, 1.4, 0.08, 0.42, "#7a4e2e", 0, 0.42, 0); rbx(g, 1.4, 0.36, 0.06, "#7a4e2e", 0, 0.66, -0.2);
    for (const s of [-1, 1]) bx(g, 0.08, 0.42, 0.38, "#2d323a", s * 0.6, 0.21, 0);
    return g;
  }
  // screen / sign planes with canvas content
  function screen(p, w, h, draw, x, y, z, ry, px, k) {
    const g = grp(p, x, y, z, ry);
    rbx(g, w + 0.1, h + 0.1, 0.08, M("#121316", { roughness: 0.25, clearcoat: 0.8 }), 0, 0, -0.045, 0, 0.02);
    const pw = px || 768, ph = Math.round(pw * h / w);
    const mat = new THREE.MeshBasicMaterial({ map: tex(pw, ph, draw), toneMapped: false, color: new THREE.Color(1, 1, 1).multiplyScalar(k || 1.0) });
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); face.position.z = 0.002; g.add(face);
    g.userData.mat = mat; g.userData.px = [pw, ph]; g.userData.face = face; return g;
  }
  function redraw(sc, draw) { const [pw, ph] = sc.userData.px, c = sc.userData.mat.map.image.getContext("2d"); draw(c, pw, ph); sc.userData.mat.map.needsUpdate = true; }
  function brickSign(p, lines, bg, fg, w, h, x, y, z, ry, font, noStuds) {
    const g = grp(p, x, y, z, ry);
    const front = M("#ffffff", { map: tex(1024, Math.round(1024 * h / w), (c, Wd, H) => {
      c.fillStyle = bg; c.fillRect(0, 0, Wd, H); c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle";
      const fs = Math.round(Math.min(H * 0.62 / lines.length, Wd * 1.22 / Math.max(...lines.map((l) => l.length)))); c.font = (font || "900 ") + fs + "px Arial Black, Arial, sans-serif";
      lines.forEach((l, i) => c.fillText(l, Wd / 2, H / 2 + (i - (lines.length - 1) / 2) * fs * 1.12));
    }), roughness: 0.45, clearcoat: 0.2 });
    const pm = M(bg);
    const m = new THREE.Mesh(X.roundBox(w, h, 0.12, 0.03, 2), [pm]); m.castShadow = true; g.add(m);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.04, h - 0.04), front); f.position.z = 0.062; g.add(f);
    if (!noStuds) for (let i = 0; i < Math.floor(w / 0.4); i++) noShadow(cyl(g, 0.1, 0.1, 0.06, pm, -w / 2 + 0.2 + i * 0.4, h / 2 + 0.035, 0, 14));
    g.userData.front = front; return g;
  }
  // a minifig portrait drawn in 2D (TV screens, posters)
  function drawFig(g, cx, cy, s, o) {
    g.fillStyle = o.top || "#444"; g.beginPath(); g.moveTo(cx - 0.9 * s, cy + 1.6 * s); g.lineTo(cx - 0.55 * s, cy + 0.62 * s); g.lineTo(cx + 0.55 * s, cy + 0.62 * s); g.lineTo(cx + 0.9 * s, cy + 1.6 * s); g.fill();
    if (o.tie) { g.fillStyle = "#f4f4f4"; g.beginPath(); g.moveTo(cx - 0.2 * s, cy + 0.62 * s); g.lineTo(cx + 0.2 * s, cy + 0.62 * s); g.lineTo(cx, cy + 1.1 * s); g.fill(); g.fillStyle = o.tie; g.fillRect(cx - 0.05 * s, cy + 0.66 * s, 0.1 * s, 0.6 * s); }
    g.fillStyle = o.skin || "#f2cd37"; g.beginPath(); g.roundRect(cx - 0.42 * s, cy - 0.5 * s, 0.84 * s, 1.05 * s, 0.22 * s); g.fill();
    g.fillRect(cx - 0.18 * s, cy + 0.5 * s, 0.36 * s, 0.16 * s);
    if (o.hair) { g.fillStyle = o.hair; g.beginPath(); g.ellipse(cx, cy - 0.42 * s, 0.5 * s, 0.32 * s, 0, Math.PI, 0); g.fill(); g.fillRect(cx - 0.5 * s, cy - 0.45 * s, 0.14 * s, 0.42 * s); g.fillRect(cx + 0.36 * s, cy - 0.45 * s, 0.14 * s, 0.42 * s); }
    g.fillStyle = "#1a1410"; for (const k of [-1, 1]) { g.beginPath(); g.ellipse(cx + k * 0.16 * s, cy + 0.02 * s, 0.05 * s, 0.07 * s, 0, 0, 7); g.fill(); }
    g.strokeStyle = "#1a1410"; g.lineWidth = Math.max(2, 0.05 * s); g.lineCap = "round";
    for (const k of [-1, 1]) { g.beginPath(); g.moveTo(cx + k * 0.08 * s, cy - 0.14 * s); g.lineTo(cx + k * 0.26 * s, cy - 0.13 * s); g.stroke(); }
    g.beginPath(); if (o.smile) g.arc(cx, cy + 0.2 * s, 0.17 * s, 0.2 * Math.PI, 0.8 * Math.PI); else { g.moveTo(cx - 0.13 * s, cy + 0.3 * s); g.lineTo(cx + 0.13 * s, cy + 0.3 * s); } g.stroke();
    if (o.glasses) { g.lineWidth = Math.max(2, 0.035 * s); for (const k of [-1, 1]) { g.beginPath(); g.arc(cx + k * 0.16 * s, cy + 0.02 * s, 0.12 * s, 0, 7); g.stroke(); } }
  }
  function nameplate(p, text, x, y, z, ry, w) {
    w = w || 0.6;
    const g = grp(p, x, y, z, ry), pm = M("#1b1b1b");
    const geo = new THREE.BoxGeometry(w, 0.13, 0.08); geo.rotateX(-0.35);
    const mk = (tx) => { const fs = Math.min(62, Math.floor(460 / (tx.length * 0.72))); return new THREE.MeshBasicMaterial({ map: K.textTex([tx], "#1b1b1b", "#f2e6c8", 512, 110, "900 " + fs + "px Arial Black, Arial"), toneMapped: false, color: new THREE.Color(0.8, 0.8, 0.8) }); };
    const lit = mk(text);
    const m = new THREE.Mesh(geo, [pm, pm, pm, pm, lit, pm]);
    m.position.y = 0.07; m.castShadow = true; g.add(m); g.userData.lit = lit; g.userData.mesh = m; g.userData.mk = mk;
    return g;
  }
  function brickCar(p, x, z, ry, col) {
    const g = grp(p, x, 0, z, ry), pm = M(col, { roughness: 0.35, clearcoat: 0.5 }), dk = M("#1b1b1b");
    rbx(g, 3.0, 0.22, 1.4, dk, 0, 0.32, 0); rbx(g, 3.0, 0.42, 1.36, pm, 0, 0.64, 0);
    rbx(g, 1.5, 0.5, 1.3, pm, -0.25, 1.1, 0); rbx(g, 1.4, 0.08, 1.26, M("#d8dbdf"), -0.25, 1.39, 0);
    const ws = new THREE.Mesh(SLOPE || new THREE.BoxGeometry(0.4, 0.4, 1.2), M("#2a3a50", { roughness: 0.1, clearcoat: 1 })); ws.rotation.y = -Math.PI / 2; ws.position.set(0.7, 1.35, 0); ws.scale.set(2, 2, 3.7); g.add(ws);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) cyl(g, 0.08, 0.08, 0.06, pm, 0.65 + i * 0.16, 0.88, -0.45 + j * 0.9, 12);
    for (const s2 of [-1, 1]) { cyl(g, 0.09, 0.09, 0.05, glowM("#fff6d0", 1.6), 1.52, 0.68, s2 * 0.45, 12).rotation.z = Math.PI / 2; cyl(g, 0.08, 0.08, 0.05, glowM("#ff3030", 1.2), -1.52, 0.68, s2 * 0.45, 12).rotation.z = Math.PI / 2; }
    for (const [wx, wz] of [[0.95, 0.72], [0.95, -0.72], [-0.95, 0.72], [-0.95, -0.72]]) { const w = grp(g, wx, 0.3, wz); cyl(w, 0.3, 0.3, 0.24, dk, 0, 0, 0, 24).rotation.x = Math.PI / 2; cyl(w, 0.17, 0.17, 0.26, M("#c9ced3", { metalness: 0.6 }), 0, 0, 0, 16).rotation.x = Math.PI / 2; }
    return g;
  }

  // ---------------------------------------------------------------- brick-built furniture (overrides the kit's smooth props)
  const TT = {};
  function tileTop(col, rep) {
    const key = col + rep; if (TT[key]) return TT[key];
    const t = tex(256, 256, (c, Wd, H) => { c.fillStyle = col; c.fillRect(0, 0, Wd, H); c.strokeStyle = "rgba(0,0,0,0.32)"; c.lineWidth = 3; for (let i = 0; i <= 4; i++) { c.beginPath(); c.moveTo(i * 64, 0); c.lineTo(i * 64, H); c.stroke(); } c.beginPath(); c.moveTo(0, 128); c.lineTo(Wd, 128); c.stroke(); c.fillStyle = "rgba(255,255,255,0.06)"; c.fillRect(0, 0, Wd, 6); });
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep * 0.5);
    return (TT[key] = M("#ffffff", { map: t, bumpMap: t, bumpScale: 0.6, roughness: 0.5, clearcoat: 0.15 }));
  }
  const leg = (g, x, y, z, sx, sy, mat) => { const m = new THREE.Mesh(RB, mat); m.scale.set(sx, sy, sx); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
  function brickProps() {
    K.chair = (p, x, y, z, ry, col) => { // brick chair (wider than the minifig hips so the seat reads), seat top 0.42
      const g = grp(p, x, y, z, ry), m = M(col || "#1b1b1b", { roughness: 0.4, clearcoat: 0.25 }), tr = M("#c9cdd2", { metalness: 0.5, roughness: 0.35 });
      for (const [a, b] of [[-0.3, -0.22], [0.3, -0.22], [-0.3, 0.22], [0.3, 0.22]]) leg(g, a, 0, b, 0.42, 0.78, m);
      rbx(g, 0.84, 0.1, 0.64, m, 0, 0.37, 0.02); rbx(g, 0.84, 0.04, 0.05, M("#3a3d42"), 0, 0.33, 0.33);
      rbx(g, 0.84, 0.56, 0.1, m, 0, 0.7, -0.27); studs2(g, m, -0.42, -0.31, 0.84, 0.08, 0.98);
      return g;
    };
    K.desk = (p, x, y, z, ry, w, d, col) => { // tile top on round-brick legs, top at 0.78
      const g = grp(p, x, y, z, ry); w = w || 2; d = d || 0.9; const m = M(col || "#8a5a2b", { roughness: 0.42, clearcoat: 0.25 });
      for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { leg(g, a * (w / 2 - 0.14), 0, b * (d / 2 - 0.14), 0.55, 0.9, m); leg(g, a * (w / 2 - 0.14), 0.378, b * (d / 2 - 0.14), 0.55, 0.9, m); }
      rbx(g, w, 0.06, d, [m, m, tileTop(col || "#8a5a2b", Math.max(1, Math.round(w / 0.7))), m, m, m], 0, 0.75, 0, 0, 0.012);
      return g;
    };
    K.table = (p, x, y, z, ry, w, d, col) => { // boardroom table: tile top on round-brick columns, top at 0.87
      const g = grp(p, x, y, z, ry); w = w || 4.4; d = d || 1.3; const m = M(col || "#5c2c14", { roughness: 0.45, clearcoat: 0.25 });
      for (const s of [-1, 1]) for (let k = 0; k < 2; k++) { const c = new THREE.Mesh(BR22, M("#2b2b2b")); c.position.set(s * w * 0.3, k * 0.42, 0); c.castShadow = true; g.add(c); }
      rbx(g, w, 0.07, d, [m, m, tileTop(col || "#5c2c14", Math.round(w / 0.7)), m, m, m], 0, 0.835, 0, 0, 0.012);
      return g;
    };
    K.mug = (p, x, y, z, col) => { const g = grp(p, x, y, z); const mm = M(col || "#f2f3f2"); leg(g, 0, 0, 0, 0.36, 0.38, mm); const h = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 8, 16), mm); h.position.set(0.075, 0.08, 0); g.add(h); return g; };
    K.laptop = (p, x, y, z, ry, screenCol) => {
      const g = grp(p, x, y, z, ry), dk = M("#3a3d42", { roughness: 0.4 });
      const keys = M("#ffffff", { map: tex(128, 96, (c, Wd, H) => { c.fillStyle = "#3a3d42"; c.fillRect(0, 0, Wd, H); c.fillStyle = "#1b1d20"; for (let r = 0; r < 4; r++) for (let k = 0; k < 10; k++) c.fillRect(6 + k * 12, 8 + r * 14, 9, 10); c.fillRect(30, 66, 66, 18); }) });
      rbx(g, 0.42, 0.025, 0.3, [dk, dk, keys, dk, dk, dk], 0, 0.0125, 0, 0, 0.006);
      const lid = new THREE.Group(); lid.position.set(0, 0.025, -0.15); lid.rotation.x = -0.25; g.add(lid);
      rbx(lid, 0.42, 0.28, 0.018, dk, 0, 0.14, 0, 0, 0.006);
      const s = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.24), new THREE.MeshBasicMaterial({ color: screenCol || "#7fb2ff", toneMapped: false })); s.position.set(0, 0.14, 0.01); lid.add(s);
      return g;
    };
    K.plant = (p, x, y, z, s) => { // brick pot + a bush of 1x1 round plant elements (stacked studded rounds)
      const g = grp(p, x, y, z); g.scale.setScalar(s || 1);
      const pot = new THREE.Mesh(BR22, M("#8a4a2a")); pot.scale.set(0.6, 0.85, 0.6); pot.castShadow = true; g.add(pot);
      studs2(g, "#5b3a22", -0.18, -0.18, 0.36, 0.36, 0.36);
      const lf = [M("#2f7a30", { roughness: 0.4 }), M("#3f9a3a", { roughness: 0.4 }), M("#4fae44", { roughness: 0.4 })];
      [[0.0, 0.4, 1], [0.17, 0.48, 6], [0.11, 0.7, 5], [0.0, 0.9, 1]].forEach(([rad, yy, n], r) => { for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2 + r * 0.7, m = new THREE.Mesh(RB, lf[(i + r) % 3]); m.scale.setScalar(0.62 - r * 0.05); m.position.set(Math.sin(a) * rad, yy + (i % 2) * 0.05, Math.cos(a) * rad); m.castShadow = true; g.add(m); } });
      return g;
    };
  }
  function plant(p, x, z, s) { return K.plant(p, x, FL, z, s || 1); }
  // the CEO chair: high-back executive chair on a round-brick pedestal (seat top 0.42), group origin at floor
  function execChair(p, x, z, ry, col) {
    const g = grp(p, x, FL, z, ry), m = M(col || "#8a1f2f", { roughness: 0.42, clearcoat: 0.2 }), dk = M("#1b1b1b", { roughness: 0.4 });
    cyl(g, 0.34, 0.34, 0.08, dk, 0, 0.04, 0, 28); studs2(g, dk, -0.25, -0.25, 0.5, 0.5, 0.08, (x, z) => Math.hypot(x, z) < 0.12 || Math.hypot(x, z) > 0.3);
    leg(g, 0, 0.08, 0, 0.5, 0.62, dk);
    rbx(g, 0.84, 0.12, 0.62, m, 0, 0.36, 0.02); rbx(g, 0.84, 0.95, 0.12, m, 0, 0.88, -0.28);
    for (const s of [-1, 1]) { rbx(g, 0.08, 0.06, 0.44, dk, s * 0.46, 0.64, -0.02); bx(g, 0.05, 0.22, 0.05, dk, s * 0.46, 0.52, 0.12); }
    studs2(g, m, -0.42, -0.34, 0.84, 0.12, 1.355);
    return g;
  }
  // a labelled 2x4 brick (recap / argument bricks): origin at its bottom centre
  function labelBrick(p, text, col, fg, s) {
    const g = grp(p); s = s || 1;
    const b = grp(g); b.scale.setScalar(s);
    rbx(b, 1.6, 0.96, 0.8, col, 0, 0.48, 0, 0, 0.04);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) cyl(b, 0.12, 0.12, 0.1, M(col), -0.6 + i * 0.4, 1.01, -0.2 + j * 0.4, 16);
    brickSign(b, [text], col, fg || "#ffffff", 1.5, 0.6, 0, 0.48, 0.405, 0, null, true);
    return g;
  }
  // a stack of share bricks (n 1x2 bricks) for the vote
  function shareStack(p, x, z, n, col) { // n real 1x2 bricks (LDraw 3004, studs + seams), one mesh per brick
    const g = grp(p, x, FL, z), m = M(col || "#f2cd37", { roughness: 0.35, clearcoat: 0.3 }), geo = X.ld("3004", 0.0155), h = 24 * 0.0155;
    for (let i = 0; i < n; i++) { const b = new THREE.Mesh(geo, m); b.position.set(0, (i + 1) * h, 0); b.rotation.y = (i % 2) * 0.06; b.castShadow = b.receiveShadow = true; b.userData.i = i; g.add(b); }
    return g;
  }

  // ---------------------------------------------------------------- set: STAGE (theatre stage; the CEO chair on a riser)
  const RISER_Y = 0.24, BENCH_X = [-1.65, -0.55, 0.55, 1.65], BENCH_H = 0.72;
  // brick dust: small translucent 1x1 round plates (never opaque white totems)
  function dustPuffs(g, col, op, tall) { const P2 = X.puffs(g, { max: 120, color: col || "#d9d1c4" }); if (!tall) P2.a.geometry = P2.a.geometry.clone().scale(1, 0.22, 1); for (const m of [P2.a, P2.b]) { m.material.transparent = true; m.material.opacity = op || 0.3; m.material.depthWrite = false; m.castShadow = false; } return P2; }
  // a ring of dust kicked out from the base of a landing brick (w x d footprint), outward + down, gone in 0.5 s
  function dustRing(P2, t, t0, at, w, d, n) {
    n = n || 14;
    X.emitPuffs(P2, t, { t0, t1: t0 + 0.04, rate: n / 0.04, life: 0.5, seed: Math.round(t0 * 37), drag: 3.0,
      origin: (tb, i, r) => { const a = r(1) * Math.PI * 2; return [at[0] + Math.sin(a) * w * 0.55, at[1] + 0.03, at[2] + Math.cos(a) * d * 0.55]; },
      vel: (tb, i, r) => { const a = r(1) * Math.PI * 2, s = 0.8 + r(2) * 0.6; return [Math.sin(a) * s, 0.25 + r(3) * 0.3, Math.cos(a) * s]; }, size: [0.07, 0.03], gravity: -1.2 });
  }
  function buildStage(ctx) {
    const g = W.STAGE = grp();
    plankFloor(g, 14, 9, "#8a5a32", -0.6);
    // raised stage front: red skirt + gold lip, audience floor and seat rows below (no void in wide shots)
    bx(g, 14, 1.3, 0.12, M("#5a0f16", { roughness: 0.75, clearcoat: 0 }), 0, FL - 0.65, 3.9);
    bx(g, 14, 0.08, 0.2, M("#c9a24a", { metalness: 0.5, roughness: 0.35 }), 0, FL - 0.02, 3.92);
    bx(g, 30, 0.1, 16, M("#2a1416", { roughness: 0.9, clearcoat: 0 }), 0, -1.25, 11.8);
    for (let r = 0; r < 5; r++) for (let i = 0; i < 16; i++) { const sg = grp(g, -7.5 + i * 1.0, -1.2, 5.2 + r * 1.3); rbx(sg, 0.8, 0.5, 0.12, "#7a1420", 0, 0.75 + r * 0.0, 0.32); rbx(sg, 0.8, 0.1, 0.5, "#7a1420", 0, 0.42, 0.05); }
    // footlights
    for (let i = 0; i < 18; i++) { const x = -6.4 + i * 0.75; noShadow(cyl(g, 0.09, 0.11, 0.08, M("#2b2b2b"), x, FL + 0.04, 3.6, 12)); noShadow(cyl(g, 0.06, 0.06, 0.03, glowM("#ffd9a0", 2.4), x, FL + 0.095, 3.6, 12)); }
    // back curtain (velvet folds) + side legs + valance with gold trim
    const velvet = M("#7a0f1c", { roughness: 0.72, clearcoat: 0, specularIntensity: 0.3 });
    // curtain = columns of stacked 1x1 round bricks (dark red, two tones), studs showing at every joint
    { const sc2 = 0.2 / 0.175, hB = 0.42 * sc2, nB = Math.ceil(7 / hB), cols2 = [], mm = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sv = new THREE.Vector3(sc2, sc2, sc2);
      for (let i = 0; i < 40; i++) cols2.push([-7.8 + i * 0.4, -4.6 + (i % 2) * 0.12]);
      for (const s2 of [-1, 1]) for (let i = 0; i < 8; i++) cols2.push([s2 * (5.3 + i * 0.32), -1.0 + (i % 2) * 0.1]);
      for (let tone = 0; tone < 2; tone++) { const list = []; cols2.forEach(([x, z], ci) => { for (let k = 0; k < nB; k++) if ((ci + k) % 2 === tone) list.push([x, FL + k * hB, z]); });
        const im = new THREE.InstancedMesh(RB, M(tone ? "#4e0911" : "#5e0c17", { roughness: 0.6, clearcoat: 0.1 }), list.length);
        list.forEach(([x, y, z], k) => im.setMatrixAt(k, mm.compose(v.set(x, y, z), q, sv))); im.frustumCulled = false; im.receiveShadow = true; g.add(im); } }
    bx(g, 16, 1.0, 0.4, velvet, 0, FL + 6.4, -0.9); bx(g, 16, 0.12, 0.44, M("#c9a24a", { metalness: 0.5, roughness: 0.35 }), 0, FL + 5.9, -0.88);
    for (let i = 0; i < 20; i++) noShadow(cyl(g, 0.06, 0.06, 0.25, M("#c9a24a", { metalness: 0.5, roughness: 0.35 }), -7.6 + i * 0.8, FL + 5.72, -0.7, 8));
    // proscenium brick columns
    const pc = ["#e2cfa4", "#d6c193", "#ead9b2"];
    wallSide(g, pc, -7.0, -1.5, 3.4, 13, -1); wallSide(g, pc, 7.0, -1.5, 3.4, 13, 1);
    // riser + CEO chair + hanging sign
    const ris = grp(g, 0, 0, -0.6); O.riser = ris;
    cyl(ris, 1.25, 1.3, 0.12, M("#2b2b33", { roughness: 0.4, clearcoat: 0.3 }), 0, FL + 0.06, 0, 40); cyl(ris, 1.0, 1.0, 0.12, M("#c9a24a", { metalness: 0.4, roughness: 0.35 }), 0, FL + 0.18, 0, 40);
    for (let i = 0; i < 30; i++) { const a = i / 30 * Math.PI * 2; cyl(ris, 0.05, 0.05, 0.04, glowM(i % 2 ? "#ffb05a" : "#ffd28a", 1.6), Math.sin(a) * 1.15, FL + 0.14, Math.cos(a) * 1.12, 12); }
    O.ceoChair = execChair(g, 0, -0.6, 0, "#8a1f2f"); O.ceoChair.position.y = FL + RISER_Y;
    O.signFlip = grp(g, 0, FL + 3.35, -1.2);
    O.ceoSign = brickSign(O.signFlip, ["CEO"], "#5a0f16", "#f2cd37", 1.6, 0.62, 0, 0, 0, 0);
    O.qSign = brickSign(O.signFlip, ["?"], "#c8102e", "#ffffff", 1.6, 0.62, 0, 0, -0.13, Math.PI, null, true);
    for (const s of [-1, 1]) cyl(g, 0.015, 0.015, 2.7, M("#1b1b1b"), s * 0.6, FL + 5.0, -1.2, 6);
    // truss towers + top truss with spots, light shafts (haze), side flats with wall sconces
    const trM = M("#3a3d42", { metalness: 0.6, roughness: 0.4 });
    for (const s of [-1, 1]) { const tw = grp(g, s * 5.4, FL, 1.2); for (const [a, b] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) bx(tw, 0.05, 5.5, 0.05, trM, a, 2.75, b); for (let k = 0; k < 11; k++) { const r = bx(tw, 0.03, 0.56, 0.03, trM, 0, 0.25 + k * 0.5, 0.2); r.rotation.z = 0.78 * (k % 2 ? 1 : -1); } }
    O.shafts = [];
    // soft follow-spot haze cone on the CEO chair: additive, fades at its silhouette edges and toward the floor (never a hard plane)
    { const hz = new THREE.ShaderMaterial({ uniforms: { uC: { value: new THREE.Color("#ffd9a8") }, uK: { value: 0.0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        vertexShader: "varying vec3 vN; varying vec3 vV; varying float vY; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); vY = uv.y; gl_Position = projectionMatrix * mv; }",
        fragmentShader: "uniform vec3 uC; uniform float uK; varying vec3 vN; varying vec3 vV; varying float vY; void main(){ float f = pow(abs(dot(normalize(vN), normalize(vV))), 2.5); float h = smoothstep(0.0, 0.35, vY) * (1.0 - smoothstep(0.75, 1.0, vY)); gl_FragColor = vec4(uC * f * h * uK, 1.0); }" });
      const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 1.25, 5.2, 40, 1, true), hz); cone.position.set(0, FL + 2.6, -0.6); cone.layers.set(2); cone.renderOrder = 7; g.add(cone); O.haze = cone; }
    for (const s of [-1, 1]) { const fl2 = grp(g, s * 6.3, 0, -2.6); wallBack(fl2, ["#3b2a2a", "#432f2f", "#352525"], -0.8, 0.8, 0, 9); const sc = grp(fl2, 0, FL + 2.6, 0.25); noShadow(cyl(sc, 0.12, 0.08, 0.3, glowM("#ffe2a8", 1.8), 0, 0, 0, 12)); }
    // podium with a mic on the stage-left side, a stack of crates and a gold award on a plinth
    { const pd = grp(g, -3.6, 0, 0.6, 0.35); rbx(pd, 0.9, 1.1, 0.6, "#2b2b33", 0, FL + 0.55, 0); studs2(pd, "#2b2b33", -0.45, -0.3, 0.9, 0.6, FL + 1.1); brickSign(pd, ["BOARD"], "#5a0f16", "#f2cd37", 0.7, 0.26, 0, FL + 0.75, 0.31, 0, null, true);
      const mic = cyl(pd, 0.012, 0.012, 0.42, M("#1b1b1b"), 0, FL + 1.32, 0.12, 6); mic.rotation.x = 0.4; cyl(pd, 0.035, 0.03, 0.08, M("#2b2b2b"), 0, FL + 1.52, 0.2, 10); }
    for (let k = 0; k < 3; k++) rbx(g, 0.7, 0.5, 0.5, ["#6b4a2e", "#7a5534", "#5c3f26"][k], 5.3 - (k === 2 ? 0.35 : 0), FL + 0.25 + (k === 2 ? 0.5 : 0), -2.0 + (k === 1 ? 0.6 : 0), k * 0.2);
    // truss + spots (+ real spot pools)
    bx(g, 13, 0.16, 0.16, M("#3a3d42", { metalness: 0.6, roughness: 0.4 }), 0, FL + 5.5, 1.2);
    for (const x of [-4.5, -1.5, 1.5, 4.5]) spot(g, x, FL + 5.2, 1.2, "#fff1d6", 0.9);
    O.spotChair = new THREE.SpotLight("#ffe8c8", 14, 16, 0.32, 0.5, 1.4); O.spotChair.position.set(0, FL + 7, 3.0); O.spotChair.target.position.set(0, FL + 0.6, -0.6); g.add(O.spotChair); g.add(O.spotChair.target);
    O.spotWing = new THREE.SpotLight("#cfe2ff", 0, 16, 0.22, 0.5, 1.4); O.spotWing.position.set(-1.9, FL + 7, 3.0); O.spotWing.target.position.set(-1.9, FL + 0.6, -0.2); g.add(O.spotWing); g.add(O.spotWing.target);
    O.spotPeltz = new THREE.SpotLight("#ffd0b0", 0, 16, 0.22, 0.5, 1.4); O.spotPeltz.position.set(2.5, FL + 7, 3.6); O.spotPeltz.target.position.set(2.5, FL + 0.6, 1.0); g.add(O.spotPeltz); g.add(O.spotPeltz.target);
    // the board's bench (stakes shot): a raised studded platform with four brick chairs behind the riser
    O.stageBench = grp(g, 0, 0, -2.9);
    rbx(O.stageBench, 4.6, BENCH_H, 1.1, "#2b2b33", 0, FL + BENCH_H / 2, 0); studs2(O.stageBench, "#2b2b33", -2.3, -0.55, 4.6, 1.1, FL + BENCH_H, (x, z) => Math.abs(z + 0.05) < 0.4);
    for (let k = 1; k < 3; k++) bx(O.stageBench, 4.62, 0.012, 1.12, M("#1b1b22"), 0, FL + k * 0.24, 0);
    O.benchChairs = BENCH_X.map((x) => K.chair(O.stageBench, x, FL + BENCH_H, -0.05, 0, "#1b1b1b"));
    // a lectern stage-right
    { const lec = grp(g, 3.9, 0, -1.4, -0.4); rbx(lec, 0.8, 1.1, 0.6, "#4a2a16", 0, FL + 0.55, 0); rbx(lec, 0.9, 0.06, 0.7, "#5c3a1e", 0, FL + 1.12, 0.03); cyl(lec, 0.012, 0.012, 0.35, M("#1b1b1b"), 0, FL + 1.3, 0.2, 6); }
    plant(g, -5.6, -3.4, 1.5); plant(g, 5.6, -3.4, 1.5);
    // three move bricks (stakes stack)
    O.moveB = [["REPLACEMENT", "#e8382b"], ["NO ARGUMENT", "#f2cd37"], ["BIG HOLDERS", "#2f8fd0"]].map(([t, c]) => labelBrick(g, t, c, c === "#f2cd37" ? "#111316" : "#ffffff", 0.9));
    O.stagePuff = dustPuffs(g);
    O.crate = grp(g, -1.25, 0, 1.3, 0.2); rbx(O.crate, 1.3, 0.48, 0.8, "#2b2b33", 0, FL + 0.24, 0, 0, 0.02); studs2(O.crate, "#2b2b33", -0.65, -0.4, 1.3, 0.8, FL + 0.48, (x, z) => Math.abs(x) < 0.55 && Math.abs(z) < 0.28); for (let k = 1; k < 2; k++) bx(O.crate, 1.31, 0.012, 0.81, M("#1b1b22"), 0, FL + k * 0.24, 0);
    // audience in the stalls (seen from behind in wide shots): seat rows with real seats
    O.stallSeats = [];
    for (let r = 0; r < 2; r++) for (let i = 5; i <= 10; i++) O.stallSeats.push([-7.5 + i * 1.0, 5.2 + r * 1.3 + 0.03]);
  }

  // ---------------------------------------------------------------- set: PARK (castle-themed theme park, golden hour; no logos, no characters)
  // a round tower built from real brick courses (instanced 1x2 bricks around the ring, running bond, three tones)
  function tower(p, x, z, r, h, roof, wallCol) {
    const g = grp(p, x, 0, z), nr = Math.round(h / 0.24), base = new THREE.Color(wallCol), L2 = [];
    for (let row = 0; row < nr; row++) { const n = Math.max(8, Math.round(2 * Math.PI * r / 0.5)), off = (row % 2) * 0.5;
      for (let i = 0; i < n; i++) { const a = (i + off) / n * Math.PI * 2; L2.push([a, row, n]); } }
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), M("#ffffff", { roughness: 0.5, clearcoat: 0.15 }), L2.length), mm = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), cc = new THREE.Color();
    L2.forEach(([a, row, n], k) => { e.set(0, a, 0); q.setFromEuler(e); const chord = 2 * r * Math.sin(Math.PI / n);
      im.setMatrixAt(k, mm.compose(v1.set(Math.sin(a) * (r - 0.2), FL + (row + 0.5) * 0.24, Math.cos(a) * (r - 0.2)), q, v2.set(chord - 0.016, 0.228, 0.4)));
      im.setColorAt(k, cc.copy(base).multiplyScalar(0.86 + rnd(row * 31 + k) * 0.2)); });
    im.castShadow = im.receiveShadow = true; im.frustumCulled = false; g.add(im);
    const core = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.36, r - 0.36, h, 24), M("#5b5048")); core.position.y = FL + h / 2; g.add(core);
    // merlons: 1x2 bricks with studs on a ledge
    cyl(g, r + 0.12, r + 0.12, 0.2, M(wallCol), 0, FL + h + 0.1, 0, 32);
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, mg = grp(g, Math.sin(a) * (r - 0.05), FL + h + 0.2, Math.cos(a) * (r - 0.05), a); rbx(mg, 0.42, 0.4, 0.36, wallCol, 0, 0.2, 0, 0, 0.02); studs2(mg, wallCol, -0.2, -0.17, 0.4, 0.34, 0.4); }
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r + 0.35, r * 2.6, 8), M(roof, { roughness: 0.35, clearcoat: 0.4, flatShading: true })); cone.position.y = FL + h + 0.3 + r * 1.3; cone.castShadow = true; g.add(cone);
    cyl(g, 0.04, 0.04, 1.2, M("#c9a24a", { metalness: 0.5 }), 0, FL + h + 0.3 + r * 2.6 + 0.5, 0, 8);
    const pen = grp(g, 0.04, FL + h + 0.3 + r * 2.6 + 0.85, 0); pen.userData.pennant = true; rbx(pen, 0.7, 0.42, 0.04, roof === "#2f5fa8" ? "#f2cd37" : "#e8382b", 0.37, 0, 0);
    for (let k = 0; k < 2; k++) { const wy = FL + h * (0.45 + k * 0.28); const win = bx(g, 0.34, 0.6, 0.05, glowM("#ffcf8a", 1.1), 0, wy, r - 0.02); noShadow(win); rbx(g, 0.56, 0.1, 0.16, "#5b5048", 0, wy + 0.36, r - 0.02); rbx(g, 0.56, 0.08, 0.2, "#5b5048", 0, wy - 0.34, r - 0.02); }
    g.userData.pen = pen; return g;
  }
  function popcornStand(p, x, z, ry) {
    const g = grp(p, x, 0, z, ry);
    for (let k = 0; k < 5; k++) rbx(g, 1.2, 0.2, 0.8, k % 2 ? "#f4f2ec" : "#c8102e", 0, FL + 0.1 + k * 0.2, 0, 0, 0.015);
    studs2(g, "#f4f2ec", -0.6, -0.4, 1.2, 0.8, FL + 1.0, (xx, zz) => zz < 0.05);
    const gl = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.5), new THREE.MeshPhysicalMaterial({ color: "#fff8e0", roughness: 0.05, transmission: 0, transparent: true, opacity: 0.35, depthWrite: false })); gl.position.set(0, FL + 1.3, -0.1); g.add(gl);
    for (let i = 0; i < 18; i++) { const m = new THREE.Mesh(RB, M("#f6e7b0", { roughness: 0.6 })); m.scale.setScalar(0.28); m.position.set(-0.35 + (i % 6) * 0.14, FL + 1.04 + Math.floor(i / 6) * 0.1, -0.2 + (i % 3) * 0.08); g.add(m); }
    for (const s of [-1, 1]) cyl(g, 0.03, 0.03, 1.1, M("#c9cdd2", { metalness: 0.5 }), s * 0.56, FL + 1.55, 0.36, 8);
    for (let i = 0; i < 6; i++) { const aw = rbx(g, 0.22, 0.05, 0.9, i % 2 ? "#f4f2ec" : "#c8102e", -0.55 + i * 0.22, FL + 2.12, 0.05, 0, 0.01); aw.rotation.x = 0.22; }
    brickSign(g, ["POPCORN"], "#f2cd37", "#c8102e", 1.1, 0.26, 0, FL + 2.42, 0.1, 0, null, true);
    return g;
  }
  function carousel(p, x, z) {
    const g = grp(p, x, 0, z); O.carousel = grp(g);
    cyl(g, 2.2, 2.3, 0.3, M("#7a1420"), 0, FL + 0.15, 0, 40); studs2(g, "#c9a24a", -0.4, -0.4, 0.8, 0.8, FL + 0.3);
    cyl(g, 0.18, 0.18, 3.0, M("#c9a24a", { metalness: 0.5, roughness: 0.3 }), 0, FL + 1.8, 0, 16);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(2.5, 1.1, 16), M("#f4f2ec", { flatShading: true })); cone.position.y = FL + 3.75; g.add(cone);
    for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2, s = rbx(g, 0.95, 0.06, 0.1, k % 2 ? "#c8102e" : "#f4f2ec", Math.sin(a) * 1.25, FL + 3.76, Math.cos(a) * 1.25, a + Math.PI / 2, 0.01); s.rotation.z = 0.42; s.castShadow = false; }
    for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; noShadow(cyl(g, 0.06, 0.06, 0.06, glowM(k % 2 ? "#ffd9a0" : "#ffb070", 2.2), Math.sin(a) * 2.42, FL + 3.18, Math.cos(a) * 2.42, 8)); }
    const hc = ["#f4f2ec", "#f2cd37", "#2f8fd0", "#e8382b", "#3fa34d", "#d64fa0"];
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2, hg = grp(O.carousel, Math.sin(a) * 1.6, 0, Math.cos(a) * 1.6, a + Math.PI / 2); cyl(hg, 0.025, 0.025, 2.9, M("#c9a24a", { metalness: 0.5 }), 0, FL + 1.75, 0, 8);
      rbx(hg, 0.7, 0.32, 0.26, hc[k], 0, FL + 1.25, 0, 0, 0.03); rbx(hg, 0.22, 0.36, 0.2, hc[k], 0.34, FL + 1.5, 0, 0, 0.03); for (const s of [-1, 1]) for (const f of [-1, 1]) cyl(hg, 0.035, 0.035, 0.36, M(hc[k]), s * 0.24, FL + 0.95, f * 0.08, 8); }
    return g;
  }
  function bunting(p, a, b, sag, n, night) { // a string of pennant slopes + bulbs between two posts
    const cols = ["#e8382b", "#f2cd37", "#2f8fd0", "#3fa34d", "#f4f2ec"];
    cyl(p, 0.008, 0.008, Math.hypot(b[0] - a[0], b[2] - a[2]), M("#2b2b2b"), (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - sag * 0.6, (a[2] + b[2]) / 2, 4).rotation.z = Math.PI / 2;
    for (let i = 1; i < n; i++) { const k = i / n, x = mix(a[0], b[0], k), y = mix(a[1], b[1], k) - sag * 4 * k * (1 - k), z = mix(a[2], b[2], k);
      const fl = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.24, 3), M(cols[i % 5])); fl.rotation.x = Math.PI; fl.position.set(x, y - 0.13, z); fl.castShadow = false; p.add(fl);
      if (i % 2) { const bu = noShadow(cyl(p, 0.045, 0.045, 0.06, glowM("#ffd9a0", 2.0), x + 0.06, y - 0.05, z, 8)); bu.userData.bulb = true; } }
  }
  const PARK_SUN = [-0.8, 0.38, 0.32];
  function buildPark(ctx) {
    const g = W.PARK = grp();
    O.parkSkyG = X.sky(g, { zenith: "#2a64be", mid: "#6fa6e6", horizon: "#f0d6b8", ground: "#8a7a66", sunDir: PARK_SUN, sunColor: "#ffd7a0", sunSize: 1.0, haze: 0.55, clouds: 0.3, cloudColor: "#fff4e4", cloudShade: "#9aa8c4" });
    O.parkSkyD = X.sky(g, { zenith: "#070b1e", mid: "#1c2148", horizon: "#4a3a66", ground: "#141020", sunDir: [-0.55, -0.1, 0.7], sunColor: "#ffb070", sunSize: 0.0, haze: 0.5, clouds: 0.15, cloudColor: "#3a3a5a", cloudShade: "#141428", stars: 0.8 });
    X.ground(g, { size: 400, studs: false, colors: ["#4f8a3a", "#5e9a44", "#3f7a32"], kind: "grass", seed: 7, repeat: 24 });
    // plaza: grey-brown 2x2 tiles with real gaps (darker than the walls so the figures read)
    { const t = tex(256, 256, (c, Wd, H) => { c.fillStyle = "#4a4038"; c.fillRect(0, 0, Wd, H); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const cc = new THREE.Color(["#8f8475", "#9a8e7c", "#857a6c"][(i * 3 + j * 5) % 3]).multiplyScalar(0.94 + rnd(i * 4 + j) * 0.1); c.fillStyle = "#" + cc.getHexString(); c.fillRect(i * 64 + 3, j * 64 + 3, 58, 58); c.fillStyle = "rgba(255,255,255,0.08)"; c.fillRect(i * 64 + 3, j * 64 + 3, 58, 4); } });
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(26 / 1.4, 15.4 / 1.4); bx(g, 26, FL, 15.4, M("#ffffff", { map: t, bumpMap: t, bumpScale: 1.2, roughness: 0.62, clearcoat: 0.08 }), 0, FL / 2, 0.3);
      bx(g, 26, 0.16, 0.4, M("#6f665a", { roughness: 0.6 }), 0, 0.08, -7.5); }
    for (const [x, z, c] of [[-5.5, 1.5, "#e8382b"], [5.5, 1.5, "#f2cd37"], [-8.5, -4.5, "#d64fa0"], [8.5, -4.5, "#ffffff"]]) { const fb = grp(g, x, 0, z); rbx(fb, 2.4, 0.3, 1.2, "#5b5048", 0, FL + 0.15, 0); studs2(fb, "#3f7a32", -1.1, -0.5, 2.2, 1.0, FL + 0.3); for (let i = 0; i < 10; i++) { const f = new THREE.Mesh(RB, M(i % 3 ? c : "#ffffff", { roughness: 0.35 })); f.scale.setScalar(0.4); f.position.set(-0.95 + (i % 5) * 0.48, FL + 0.3, -0.3 + Math.floor(i / 5) * 0.55); f.castShadow = true; fb.add(f); } }
    // castle: front curtain wall with gate, studded merlons, brick towers, central keep (generic; no logos, no characters)
    const wc = ["#c9b897", "#b9a886", "#d3c4a6"];
    const cg = grp(g, 0, 0, 0); O.castle = cg;
    wallBack(cg, wc, -6, 6, -10, 12, (r, x) => r <= 6 && x > 4.6 && x < 7.4);
    for (let i = 0; i < 15; i++) if (i % 2 === 0) { const mg = grp(cg, -5.6 + i * 0.8, FL + 5.76, -10); rbx(mg, 0.76, 0.48, 0.4, wc[i % 3], 0, 0.24, 0, 0, 0.02); studs2(mg, wc[i % 3], -0.38, -0.2, 0.76, 0.4, 0.48); }
    for (let i = 0; i < 4; i++) { const ar = rbx(cg, 0.5, 0.9, 0.1, glowM("#ffcf8a", 0.9), -4.4 + i * 2.9 + (i > 1 ? 0.3 : -0.3), FL + 3.9, -9.78); noShadow(ar); rbx(cg, 0.7, 0.12, 0.2, "#7a6a58", -4.4 + i * 2.9 + (i > 1 ? 0.3 : -0.3), FL + 4.4, -9.75); }
    O.gateBack = bx(cg, 2.8, 3.2, 0.3, M("#241a14", { roughness: 0.9, clearcoat: 0 }), 0, FL + 1.6, -10.25); O.gateGlow = noShadow(bx(cg, 2.6, 3.0, 0.02, glowM("#ff9a48", 0.55), 0, FL + 1.6, -10.09));
    for (let i = 0; i < 6; i++) bx(cg, 0.06, 2.6, 0.08, M("#3a3d42", { metalness: 0.6 }), -1.1 + i * 0.44, FL + 2.1, -10.0);
    for (let j = 0; j < 4; j++) bx(cg, 2.6, 0.06, 0.08, M("#3a3d42", { metalness: 0.6 }), 0, FL + 1.2 + j * 0.62, -10.0);
    O.towers = [tower(cg, -6.6, -10, 1.3, 7.2, "#2f5fa8", "#c9b897"), tower(cg, 6.6, -10, 1.3, 7.2, "#2f5fa8", "#c9b897"),
      tower(cg, -3.2, -14.5, 1.5, 10.5, "#c8102e", "#d3c4a6"), tower(cg, 3.2, -14.5, 1.5, 10.5, "#c8102e", "#d3c4a6"), tower(cg, 0, -16, 2.0, 13.5, "#2f5fa8", "#ddd0b6")];
    { const kg = grp(cg, 0, FL, -13.5); fineWall(kg, wc, -4.4, 2.0, 11, 16); noShadow(bx(cg, 8.8, 7.6, 3.6, M("#b9a886", { roughness: 0.6 }), 0, 3.8, -13.75)); }
    O.parkBanner = brickSign(cg, ["NEW CEO"], "#2f5fa8", "#f2cd37", 2.6, 0.7, 0, FL + 4.6, -9.75, 0);
    O.moat = X.brickWater(g, { nx: 34, nz: 3, tile: 0.8, x: 0, z: -8.6, y: FL - 0.05, color: "#2f8fd0", opacity: 0.86, amp: 0.25 });
    bx(g, 3.0, 0.12, 2.6, M("#7a4e2e", { roughness: 0.6 }), 0, FL + 0.06, -8.6);
    // theme-park dressing: trees, lamp posts with bunting + bulbs, benches, balloon cart, popcorn stand, carousel
    for (const [x, z, s] of [[-10, -6, 1.3], [-12, -1, 1.4], [10, -6, 1.3], [12, -1, 1.4], [-9, 4, 1.2], [9, 4, 1.2], [-15, -9, 1.6], [15, -9, 1.6]]) tree(g, x, z, s);
    O.parkLamps = [];
    for (const x of [-7.2, -3.6, 3.6, 7.2]) lampPost(g, x, -6.4, 3.4, true).traverse((o) => { if (o.isPointLight) O.parkLamps.push(o); });
    lampPost(g, -2.9, 2.9, 3.2, true).traverse((o) => { if (o.isPointLight) O.parkLamps.push(o); });
    // night key on the hero (a lamp practical camera-left) + firework flash lights
    O.parkKey = new THREE.PointLight("#fff0dc", 0, 9, 1.4); O.parkKey.position.set(-2.4, 2.9, 4.2); g.add(O.parkKey);
    O.fwLights = [0, 1, 2, 3].map(() => { const l = new THREE.PointLight("#ffd9a8", 0, 9, 2); g.add(l); return l; });
    O.fightLight = new THREE.PointLight("#ffc890", 0, 4, 2); g.add(O.fightLight);
    O.gateLight = new THREE.PointLight("#ffa050", 0, 7, 1.6); O.gateLight.position.set(0, FL + 1.4, -10.7); g.add(O.gateLight);
    // foreground railing (round-brick posts + rail), park signs on posts, extra guests by the stands
    // (no foreground railing: it crossed the figures)
    for (const [x, z, txt, ry] of [[-5.6, -2.2, "CASTLE", 0.5], [5.4, -2.4, "RIDES", -0.5]]) { const sg = grp(g, x, 0, z, ry); for (let k = 0; k < 6; k++) leg(sg, 0, FL + k * 0.42, 0, 0.42, 1, M("#4a2a16")); brickSign(sg, [txt], "#2f5fa8", "#f2cd37", 1.2, 0.36, 0.0, FL + 2.45, 0.1, 0); }
    bunting(g, [-7.2, FL + 3.3, -6.4], [-3.6, FL + 3.3, -6.4], 0.5, 9); bunting(g, [3.6, FL + 3.3, -6.4], [7.2, FL + 3.3, -6.4], 0.5, 9); bunting(g, [-3.6, FL + 3.3, -6.4], [3.6, FL + 3.3, -6.4], 0.7, 15);
    bench(g, -7.6, -1.8, Math.PI / 2); bench(g, 7.6, -1.8, -Math.PI / 2);
    popcornStand(g, -2.9, -3.9, 0.45); carousel(g, 4.6, -7.2);
    // (the small flower bed at (-1.7, -1.6) is now the brick fountain from props-kit)
    lampPost(g, 2.7, 3.2, 3.2, true).traverse((o) => { if (o.isPointLight) O.parkLamps && O.parkLamps.push(o); });
    { const cart = grp(g, 2.3, 0, -3.3, -0.3); rbx(cart, 1.0, 0.7, 0.6, "#e8382b", 0, FL + 0.55, 0); for (const s2 of [-1, 1]) cyl(cart, 0.2, 0.2, 0.08, M("#1b1b1b"), s2 * 0.35, FL + 0.2, 0.32, 16).rotation.x = Math.PI / 2;
      const bc = ["#e8382b", "#f2cd37", "#2f8fd0", "#3fa34d", "#d64fa0"]; O.balloons = [];
      for (let i = 0; i < 5; i++) { const bl = grp(cart, -0.3 + i * 0.15, FL + 2.1 + (i % 2) * 0.3, 0); cyl(bl, 0.006, 0.006, 1.2, M("#eeeeee"), 0, -0.6, 0, 4); const s3 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), M(bc[i], { roughness: 0.25, clearcoat: 0.8 })); s3.scale.set(1, 1.15, 1); bl.add(s3); O.balloons.push(bl); } }
    X.brickClouds(g, { n: 10, area: 320, y: 60, size: 3.0, center: [0, 0, -160], seed: 6 });
    O.parkClouds = X.brickClouds(g, { n: 5, area: 70, y: 24, size: 1.4, center: [0, 0, -55], seed: 12 });
    // recap plinth + move bricks + the takeaway pair (night)
    O.recap = grp(g, 0.6, 0, 1.25);
    rbx(O.recap, 1.9, 0.7, 1.0, "#5a5f66", 0, FL + 0.35, 0, 0, 0.02); for (let k = 1; k < 3; k++) bx(O.recap, 1.91, 0.012, 1.01, M("#3a3d42"), 0, FL + k * 0.24, 0); for (let r = 0; r < 3; r++) for (let k2 = 0; k2 < 5; k2++) { const bw = 0.46, x2 = -0.95 + (r % 2) * 0.23 + k2 * bw + bw / 2; const a2 = Math.max(x2 - bw / 2, -0.95), b2 = Math.min(x2 + bw / 2, 0.95); if (b2 - a2 < 0.08) continue; rbx(O.recap, b2 - a2 - 0.012, 0.222, 0.03, ["#8a7354", "#7d684c", "#96805e"][(r + k2) % 3], (a2 + b2) / 2, FL + 0.115 + r * 0.233, 0.51, 0, 0.008); }
    for (const sx of [-1, 1]) for (let r = 0; r < 3; r++) for (let k2 = 0; k2 < 2; k2++) rbx(O.recap, 0.03, 0.222, 0.46, ["#8a7354", "#7d684c", "#96805e"][(r + k2) % 3], sx * 0.965, FL + 0.115 + r * 0.233, -0.25 + k2 * 0.5 + (r % 2 ? 0.05 : -0.05), 0, 0.008);
    for (let k2 = 0; k2 < 4; k2++) rbx(O.recap, 0.47, 0.03, 0.12, "#f2cd37", -0.71 + k2 * 0.473, FL + 0.715, 0.44, 0, 0.008);
    studs2(O.recap, "#5a5f66", -0.95, -0.5, 1.9, 1.0, FL + 0.7, (x, z) => Math.abs(x) < 0.72 && Math.abs(z) < 0.36); { const tl2 = new THREE.SpotLight("#ffe2b8", 3.5, 6, 0.5, 0.6, 1.5); tl2.position.set(-0.4, FL + 4.2, 1.2); tl2.target.position.set(0, FL + 1.3, 0); O.recap.add(tl2); O.recap.add(tl2.target); O.recapSpot = tl2; }
    O.parkMoveB = [["REPLACEMENT", "#e8382b"], ["NO ARGUMENT", "#f2cd37"], ["BIG HOLDERS", "#2f8fd0"]].map(([t, c]) => labelBrick(O.recap, t, c, c === "#f2cd37" ? "#111316" : "#ffffff", 0.84));
    O.reasonB = labelBrick(O.recap, " ", "#2f8fd0", "#ffffff", 0.84);
    O.fightB = labelBrick(O.recap, "FIGHT", "#c8102e", "#ffffff", 0.84);
    O.parkPuff = dustPuffs(g);
    O.fightDeb = brickBurst(g, 26, ["#c8102e", "#a00d24", "#e8382b"], null, 0.0173 * 0.8);
    O.ceoBrick = labelBrick(g, "CEO", "#f2cd37", "#111316", 0.3);
    // fireworks: brick rockets with glowing round-plate trails; bursts of glowing round plates above the towers
    O.fwTrail = X.puffs(g, { max: 200, color: "#ffc070", emissiveIntensity: 3.0 }); O.fwTrail.a.castShadow = false;
    // fireworks: sprays of glowing translucent 1x1 round plates (LDraw 6141), radial + gravity, shrink-fade (no flat squares)
    { const geo = X.ld("6141", 0.016) || new THREE.CylinderGeometry(0.16, 0.16, 0.07, 12);
      O.fireworks = [["#ffd24a", "#ff8a4a"], ["#7fd8ff", "#ffffff"], ["#ff5aa8", "#ffd24a"], ["#ffe08a", "#ff6b4a"]].map((cols2) => cols2.map((c2) => {
        const im = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: new THREE.Color(c2).multiplyScalar(1.7), toneMapped: false, transparent: true, opacity: 0.8, depthWrite: false }), 36);
        im.frustumCulled = false; im.castShadow = false; im.count = 0; g.add(im); return im; })); }
  }

  // ---------------------------------------------------------------- set: OFFICE (executive corner office, day)
  function drawCal(c, Wd, H, year) {
    c.fillStyle = "#f4f2ec"; c.fillRect(0, 0, Wd, H); c.fillStyle = "#c8102e"; c.fillRect(0, 0, Wd, H * 0.26);
    c.fillStyle = "#fff"; c.textAlign = "center"; c.font = "900 " + Math.round(H * 0.17) + "px Arial Black, Arial"; c.fillText("YEAR", Wd / 2, H * 0.19);
    c.fillStyle = "#1b1b1b"; c.font = "900 " + Math.round(H * 0.36) + "px Arial Black, Arial"; c.fillText(String(year), Wd / 2, H * 0.66);
    c.fillStyle = "#9a9a9a"; for (let i = 0; i < 7; i++) c.fillRect(Wd * 0.1 + i * Wd * 0.115, H * 0.78, Wd * 0.08, H * 0.1);
  }
  function buildOffice(ctx) {
    const g = W.OFFICE = grp();
    X.sky(g, "day");
    tileFloor(g, 9, 8, "#6b4a2e", "#5e4028", 0.5);
    const cols = ["#e6dcc6", "#ddd2ba", "#ece4d2"];
    wallBack(g, cols, -4.5, 4.5, -3.4, 10, (r, x) => r >= 2 && r <= 7 && x > 4.2 && x < 8.2);
    windowFrame(g, 1.7, FL + 2.4, -3.4, 3.4, 2.9, "#3b2a1e", 3);
    skyline(g, { z: -16, x0: -8, x1: 18, n: 9, hMin: 6, hMax: 20, seed: 12 });
    wallSide(g, cols, -4.5, -3.4, 4, 10, -1, (r, x) => r <= 4 && x > 3.7 && x < 5.1);
    { const dr = grp(g, -4.48, 0, -0.4, Math.PI / 2); rbx(dr, 1.4, 2.3, 0.08, "#5c3a1e", 0, FL + 1.15, 0); cyl(dr, 0.04, 0.04, 0.12, M("#c9a24a", { metalness: 0.6 }), 0.5, FL + 1.1, 0.08, 10).rotation.x = Math.PI / 2; O.officeDoor = dr; }
    wallSide(g, cols, 4.5, -3.4, 4, 10, 1);
    ceiling(g, 9, 7.4, FL + 4.8, "#efe8dc", [[0, -0.5, 3.0, 0.3]]);
    // rug, desk, CEO-style chair, props
    { const rt = tex(256, 160, (c, Wd, H) => { c.fillStyle = "#6a1f2a"; c.fillRect(0, 0, Wd, H); c.strokeStyle = "#c9a24a"; c.lineWidth = 8; c.strokeRect(14, 14, Wd - 28, H - 28); c.strokeStyle = "rgba(255,255,255,0.15)"; c.lineWidth = 3; c.strokeRect(30, 30, Wd - 60, H - 60); });
      bx(g, 4.2, 0.02, 2.6, M("#ffffff", { map: rt, roughness: 0.85, clearcoat: 0 }), 0, FL + 0.01, 0.2); }
    K.desk(g, 0, FL, -0.4, 0, 2.4, 1.0, "#5c3a1e");
    O.offChair = execChair(g, 0, -1.25, 0, "#2b2b2b");
    O.offPlate = nameplate(g, "EXEC CHAIRMAN", 0.0, FL + 0.81, 0.0, 0, 0.9);
    K.laptop(g, -0.55, FL + 0.81, -0.45, 0.25, "#9fd0ff"); deskLamp(g, 0.95, FL + 0.81, -0.6, -0.4);
    O.offMug = K.mug(g, 0.9, FL + 0.81, -0.15, "#f2f3f2"); O.offSteam = dustPuffs(g, "#f4f2ee", 0.26);
    O.cal = screen(g, 0.9, 1.0, (c, Wd, H) => drawCal(c, Wd, H, 2020), -0.8, FL + 2.5, -3.15, 0, 256, 0.95); O.calY = 2020;
    K.bookshelf(g, -3.4, FL, -3.0, 0); K.bookshelf(g, 3.5, FL, -3.0, 0);
    plant(g, -3.9, 1.6, 1.4); plant(g, 3.9, 1.0, 1.3); floorLamp(g, 3.6, -1.6, "#ffe2b0");
    { const fr = screen(g, 0.9, 0.62, (c, Wd, H) => { const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#ffb37a"); gr.addColorStop(1, "#6a4a8a"); c.fillStyle = gr; c.fillRect(0, 0, Wd, H); c.fillStyle = "#2a2440"; c.beginPath(); c.moveTo(0, H); c.lineTo(Wd * 0.3, H * 0.45); c.lineTo(Wd * 0.55, H * 0.7); c.lineTo(Wd * 0.8, H * 0.4); c.lineTo(Wd, H); c.fill(); }, 3.0, FL + 2.7, -3.15, 0, 256, 0.9); fr.userData.face.material.color.setScalar(0.85); }
    pendant(g, 0, FL + 4.8, -0.4, "#ffd9a0", 1.6);
    O.offGlow = new THREE.PointLight("#ffe2b8", 0.8, 4, 1.6); O.offGlow.position.set(0, FL + 1.6, 0.8); g.add(O.offGlow);
  }

  // ---------------------------------------------------------------- set: BOARD (the boardroom on a Sunday night)
  function drawAnn(c, Wd, H, stage) { // wall screen: SUNDAY card -> CEO announcement
    const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#0e1726"); gr.addColorStop(1, "#1d2f4a"); c.fillStyle = gr; c.fillRect(0, 0, Wd, H);
    c.textAlign = "center";
    if (stage < 0) { c.fillStyle = "#05070b"; c.fillRect(0, 0, Wd, H); c.fillStyle = "rgba(120,160,220,0.25)"; c.font = "700 " + Math.round(H * 0.07) + "px Arial"; c.fillText("STANDBY", Wd / 2, H * 0.55); return; }
    if (stage === 0) { c.fillStyle = "#ff6b4a"; c.fillRect(0, 0, Wd, H * 0.2); c.fillStyle = "#fff"; c.font = "900 " + Math.round(H * 0.13) + "px Arial Black, Arial"; c.fillText("SUNDAY", Wd / 2, H * 0.15);
      c.font = "900 " + Math.round(H * 0.24) + "px Arial Black, Arial"; c.fillText("NOV 20", Wd / 2, H * 0.55); c.fillStyle = "#9fd8ff"; c.font = "900 " + Math.round(H * 0.15) + "px Arial Black, Arial"; c.fillText("2022", Wd / 2, H * 0.8); return; }
    c.fillStyle = "#e8382b"; c.fillRect(0, 0, Wd, H * 0.2); c.fillStyle = "#fff"; c.font = "900 " + Math.round(H * 0.12) + "px Arial Black, Arial"; c.fillText("BOARD ANNOUNCEMENT", Wd / 2, H * 0.145);
    drawFig(c, Wd * 0.25, H * 0.5, H * 0.17, { top: "#3a3d44", tie: "#7a1f2a", skin: "#f1c9a5", glasses: true, hair: "#4a4038" });
    drawFig(c, Wd * 0.75, H * 0.5, H * 0.17, { top: "#1f2a44", tie: "#2f5fa8", hair: "#b9b9b9", skin: "#f1c9a5", smile: stage >= 2 });
    c.font = "900 " + Math.round(H * 0.085) + "px Arial Black, Arial"; c.fillStyle = "#fff"; c.fillText("CHAPEK", Wd * 0.25, H * 0.9); c.fillText("IGER", Wd * 0.75, H * 0.9);
    c.fillStyle = "#ff6b4a"; c.fillText("OUT", Wd * 0.25, H * 0.29);
    if (stage >= 2) { c.fillStyle = "#c8ff3e"; c.fillText("CEO", Wd * 0.75, H * 0.29); }
    c.strokeStyle = "#ff6b4a"; c.lineWidth = H * 0.025; c.beginPath(); c.moveTo(Wd * 0.1, H * 0.36); c.lineTo(Wd * 0.4, H * 0.82); c.moveTo(Wd * 0.4, H * 0.36); c.lineTo(Wd * 0.1, H * 0.82); c.stroke();
  }
  function buildBoard(ctx) {
    const g = W.BOARD = grp();
    X.sky(g, "night");
    tileFloor(g, 10, 8, "#3a3f47", "#33373e", 0.6, false);
    const cols = ["#5b4636", "#4e3b2d", "#64503f"];
    wallBack(g, cols, -5, 5, -3.6, 10, (r, x) => r >= 1 && r <= 8 && x > 0.6 && x < 6.2);
    windowFrame(g, -1.6, FL + 2.4, -3.6, 5.4, 3.7, "#1f2226", 4);
    skyline(g, { z: -14, x0: -22, x1: 16, n: 11, hMin: 8, hMax: 30, seed: 5, rows: 3 });
    wallSide(g, cols, -5, -3.6, 4, 10, -1); wallSide(g, cols, 5, -3.6, 4, 10, 1);
    ceiling(g, 10, 8, FL + 4.8, "#2a2622");
    K.table(g, 0, FL, 0, 0, 4.8, 1.4, "#4a2a16");
    O.boardChairs = [-1.9, -0.95, 0, 0.95].map((x) => K.chair(g, x, FL, -1.15, 0, "#2b2b2b")); O.ceoSeat = execChair(g, 1.9, -1.2, 0, "#5a0f16");
    O.headChair = execChair(g, -3.0, 0.0, Math.PI / 2, "#5a0f16");
    O.annScr = screen(g, 1.8, 1.08, (c, Wd, H) => drawAnn(c, Wd, H, 0), 2.25, FL + 2.45, -3.3, 0, 768, 1.0); O.annStage = 0;
    O.boardPlate = nameplate(g, "CEO · CHAPEK", 1.9, FL + 0.9, -0.45, 0, 1.25); O.bpText = "CEO · CHAPEK";
    pendant(g, -1.2, FL + 4.8, -0.2, "#ffcf8a", 3.4); pendant(g, 1.2, FL + 4.8, -0.2, "#ffcf8a", 3.4);
    for (const x of [-1.1, 1.1]) { const lg = new THREE.PointLight("#8fc0ff", 0.6, 1.6, 1.8); lg.position.set(x, FL + 1.25, -0.55); g.add(lg); }
    deskLamp(g, -2.2, FL + 0.9, -0.35, 0.4); deskLamp(g, 2.45, FL + 0.9, -0.35, -0.4);
    O.ceoSpot = new THREE.SpotLight("#ffe2b8", 3.0, 7, 0.32, 0.6, 1.5); O.ceoSpot.position.set(1.9, FL + 4.6, 0.4); O.ceoSpot.target.position.set(1.9, FL + 0.6, -1.2); g.add(O.ceoSpot); g.add(O.ceoSpot.target);
    plant(g, -4.4, -3.0, 1.4); plant(g, 4.4, 1.8, 1.3);
    for (const x of [-1.1, 1.1]) K.laptop(g, x, FL + 0.9, -0.3, 0, "#6fa8ff");
    K.mug(g, 0.4, FL + 0.9, -0.2); K.papers(g, 1.6, FL + 0.9, 0.1, 2, -0.2);
    { const ck = grp(g, 3.95, FL + 3.0, -3.32); const face = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.06, 36), new THREE.MeshStandardMaterial({ color: "#efe6d0", roughness: 0.8 })); face.rotation.x = Math.PI / 2; ck.add(face);
      for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, rb = new THREE.Mesh(RB, M("#1b1b1b")); rb.scale.set(0.3, 0.16, 0.3); rb.rotation.x = Math.PI / 2; rb.position.set(Math.sin(a) * 0.37, Math.cos(a) * 0.37, -0.04); ck.add(rb); }
      const hh = bx(ck, 0.035, 0.2, 0.02, "#1b1b1b", 0.0, 0.08, 0.05); hh.rotation.z = -0.5; hh.position.set(0.05, 0.08, 0.05); const mh = bx(ck, 0.025, 0.28, 0.02, "#1b1b1b", 0, 0.12, 0.06); mh.rotation.z = 0.1; } // a little before ten
    floorLamp(g, -4.3, 1.6, "#ffd9a0");
    O.folder = grp(g, -1.55, FL + 0.905, -0.15); rbx(O.folder, 0.36, 0.03, 0.46, "#d9b46a", 0, 0.015, 0, 0, 0.006); rbx(O.folder, 0.3, 0.012, 0.4, "#f6f6f2", 0.01, 0.035, 0.01, 0, 0.004);
    O.boardGlow = new THREE.PointLight("#9fc8ff", 0.0, 4, 1.6); O.boardGlow.position.set(3.2, FL + 2.4, -2.4); g.add(O.boardGlow);
  }

  // ---------------------------------------------------------------- set: NEWS (TV news studio)
  function drawWall(c, Wd, H, mode) {
    const gr = c.createLinearGradient(0, 0, Wd, H); gr.addColorStop(0, "#0b1a33"); gr.addColorStop(1, "#1a3a66"); c.fillStyle = gr; c.fillRect(0, 0, Wd, H);
    c.strokeStyle = "rgba(120,180,255,0.12)"; c.lineWidth = 2; for (let x = 0; x < Wd; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    c.textAlign = "center";
    const fit = (txt, px, maxW) => { c.font = "900 " + px + "px Arial Black, Arial"; const w = c.measureText(txt).width; if (w > maxW) c.font = "900 " + Math.floor(px * maxW / w) + "px Arial Black, Arial"; };
    const band = (txt, col) => { c.fillStyle = col; c.fillRect(0, H * 0.06, Wd, H * 0.17); c.fillStyle = "#fff"; fit(txt, Math.round(H * 0.11), Wd * 0.7); c.fillText(txt, Wd / 2, H * 0.185); };
    if (mode === "proxy") {
      band("JAN 2023 · PROXY FIGHT", "#e8382b");
      drawFig(c, Wd * 0.25, H * 0.48, H * 0.15, { top: "#2a2a30", tie: "#b81d24", hair: "#f0f0f0", skin: "#f1c9a5" });
      c.fillStyle = "#fff"; fit("ACTIVIST INVESTOR", Math.round(H * 0.085), Wd * 0.46); c.fillText("ACTIVIST INVESTOR", Wd * 0.64, H * 0.45);
      c.fillStyle = "#9fd8ff"; fit("WANTS A SEAT ON", Math.round(H * 0.075), Wd * 0.46); c.fillText("WANTS A SEAT ON", Wd * 0.64, H * 0.58); c.fillText("DISNEY'S BOARD", Wd * 0.64, H * 0.68);
    } else if (mode.startsWith("restr")) {
      const lvl = +mode.slice(5) || 0;
      band("FEB 2023 · RESTRUCTURING", "#2f8fd0");
      if (lvl === 0) { c.fillStyle = "#fff"; fit("DEMAND: CUT COSTS", Math.round(H * 0.1), Wd * 0.62); c.fillText("DEMAND: CUT COSTS", Wd / 2, H * 0.52); }
      if (lvl >= 1) { c.fillStyle = "#c8ff3e"; fit("DELIVERED", Math.round(H * 0.14), Wd * 0.62); c.fillText("DELIVERED", Wd / 2, H * 0.5); }
      if (lvl >= 2) { c.fillStyle = "#fff"; fit("~7,000 JOB CUTS", Math.round(H * 0.1), Wd * 0.62); c.fillText("~7,000 JOB CUTS", Wd / 2, H * 0.7); }
      if (lvl >= 3) { c.fillStyle = "#c8ff3e"; fit("$5.5B SAVINGS", Math.round(H * 0.1), Wd * 0.62); c.fillText("$5.5B SAVINGS", Wd / 2, H * 0.86); }
    } else { band("BUSINESS NEWS", "#2f8fd0"); }
  }
  function buildNews(ctx) {
    const g = W.NEWS = grp();
    tileFloor(g, 11, 8, "#1c2230", "#222a3a", 0.7, true);
    const cols = ["#1d2b44", "#22324f", "#1a2740"];
    wallBack(g, cols, -5.6, 5.6, -3.6, 11); wallSide(g, cols, -5.6, -3.6, 4.4, 11, -1); wallSide(g, cols, 5.6, -3.6, 4.4, 11, 1);
    ceiling(g, 11.2, 8, FL + 5.28, "#11151c");
    for (const y of [FL + 0.4, FL + 4.9]) noShadow(bx(g, 11, 0.06, 0.06, glowM("#5fd0ff", 2.4), 0, y, -3.35));
    O.newsWall = screen(g, 2.7, 1.52, (c, Wd, H) => drawWall(c, Wd, H, "idle"), 0.05, FL + 2.5, -3.3, 0, 1024, 1.0);
    // monitor bank (6 small screens) and an ON AIR sign
    for (let i = 0; i < 6; i++) screen(g, 0.62, 0.4, (c, Wd, H) => { const gr = c.createLinearGradient(0, 0, Wd, H); gr.addColorStop(0, ["#173a66", "#3a1a3a", "#1a3a2a"][i % 3]); gr.addColorStop(1, "#0b1424"); c.fillStyle = gr; c.fillRect(0, 0, Wd, H); c.fillStyle = "rgba(255,255,255,0.5)"; for (let k = 0; k < 3; k++) c.fillRect(14, 20 + k * 26, (Wd - 28) * (0.4 + rnd(i * 5 + k) * 0.6), 10); }, -2.75 + (i % 2) * 0.7, FL + 2.0 + Math.floor(i / 2) * 0.48, -3.28, 0, 128, 0.85);
    brickSign(g, ["ON AIR"], "#c8102e", "#ffffff", 0.9, 0.3, -2.4, FL + 3.75, -3.15, 0, null, true); O.newsMode = "idle";
    for (const s of [-1, 1]) screen(g, 1.4, 2.4, (c, Wd, H) => { const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#132a4a"); gr.addColorStop(1, "#0b1424"); c.fillStyle = gr; c.fillRect(0, 0, Wd, H); c.fillStyle = "rgba(95,208,255,0.6)"; for (let i = 0; i < 8; i++) c.fillRect(30, 60 + i * 52, (Wd - 60) * (0.3 + rnd(i * 3 + s) * 0.7), 18); }, s * 4.2, FL + 2.6, -3.0, -s * 0.35, 256, 0.9);
    // curved anchor desk on a studded riser
    rbx(g, 7, 0.24, 2.4, "#2b3448", 0, FL + 0.12, -0.9); studs2(g, "#2b3448", -3.5, -2.1, 7, 2.4, FL + 0.24, (x, z) => z > -1.0 || Math.abs(x + 0.4) < 1.6);
    // ticker crawl under the video wall (texture offset is a pure function of t)
    { const tt = tex(1024, 64, (c, Wd, H) => { c.fillStyle = "#0b1424"; c.fillRect(0, 0, Wd, H); c.fillStyle = "#f2cd37"; c.font = "900 40px Arial Black, Arial"; c.textBaseline = "middle"; c.font = "900 30px Arial Black, Arial"; c.fillText("MARKETS · MEDIA · BOARDROOMS · ", 8, H / 2 + 2); });
      tt.wrapS = THREE.RepeatWrapping; tt.repeat.set(1.6, 1); O.ticker = tt; const tk = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.2), new THREE.MeshBasicMaterial({ map: tt, toneMapped: false, color: new THREE.Color(0.9, 0.9, 0.9) })); tk.position.set(0.05, FL + 1.57, -3.26); g.add(tk); }
    { const dk = grp(g, -0.3, FL + 0.24, -0.6); rbx(dk, 2.72, 0.8, 0.62, "#d9dee4", 0, 0.4, -0.02);
      for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) { const w2 = 0.56, x2 = -1.4 + (r % 2) * 0.28 + k * w2 + w2 / 2; if (x2 - w2 / 2 < -1.42 || x2 + w2 / 2 > 1.42) continue; rbx(dk, w2 - 0.012, 0.255, 0.05, "#eef1f4", x2, 0.13 + r * 0.265, 0.31, 0, 0.012); }
      for (const xe of [-1.26, 1.26]) for (let r = 0; r < 3; r++) rbx(dk, 0.28 - 0.012, 0.255, 0.05, "#eef1f4", xe, 0.13 + r * 0.265, 0.31, 0, 0.012);
      rbx(dk, 3.0, 0.07, 0.86, [M("#1d2b44"), M("#1d2b44"), tileTop("#1d2b44", 4), M("#1d2b44"), M("#1d2b44"), M("#1d2b44")], 0, 0.855, -0.02, 0, 0.01);
      for (let k = 0; k < 6; k++) noShadow(cyl(dk, 0.05, 0.05, 0.04, glowM("#5fd0ff", 2), -1.1 + k * 0.44, 0.7, 0.345, 12)).rotation.x = Math.PI / 2; 
      brickSign(dk, ["NEWS"], "#c8102e", "#ffffff", 0.5, 0.17, 1.15, 0.98, 0.25, 0, null, false); }
    O.anchorChair = K.chair(g, -0.85, FL + 0.24, -1.4, 0, "#1b1b1b");
    K.laptop(g, -1.45, FL + 1.12, -0.75, 0.3, "#9fd0ff"); K.mug(g, 0.2, FL + 1.12, -0.7, "#c8102e");
    // studio camera (foreground depth) + lights
    const camRig = (x, z, ry) => { const cg2 = grp(g, x, 0, z, ry); for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2, l2 = cyl(cg2, 0.03, 0.03, 1.5, M("#2b2b2b", { metalness: 0.5 }), Math.sin(a) * 0.3, FL + 0.7, Math.cos(a) * 0.3, 8); l2.rotation.set(Math.cos(a) * 0.22, 0, -Math.sin(a) * 0.22); }
      rbx(cg2, 0.42, 0.42, 0.8, "#2b2d31", 0, FL + 1.55, 0); const lens = cyl(cg2, 0.15, 0.17, 0.3, M("#111214", { roughness: 0.2, clearcoat: 1 }), 0, FL + 1.55, -0.52, 20); lens.rotation.x = Math.PI / 2; noShadow(cyl(cg2, 0.03, 0.03, 0.02, glowM("#ff3030", 3), 0.15, FL + 1.8, 0.2, 8)); return cg2; };
    camRig(-3.6, 2.6, -0.5); camRig(3.8, 2.4, 0.55); camRig(-2.2, 1.2, -0.35);
    bx(g, 11, 0.14, 0.14, M("#3a3d42", { metalness: 0.6 }), 0, FL + 3.95, -0.4); bx(g, 11, 0.14, 0.14, M("#3a3d42", { metalness: 0.6 }), 0, FL + 3.95, 0.4);
    for (const x of [-3.2, -1.6, 0, 1.6, 3.2]) spot(g, x, FL + 3.7, 0.0, "#fff1d6", 1.0);
    // brick bar charts (cuts + savings) on the riser, right of the desk
    O.barCuts = shareStack(g, 1.6, -1.1, 7, "#e8382b"); O.barSave = shareStack(g, 2.75, -1.1, 7, "#3fa34d"); O.barCuts.scale.setScalar(0.78); O.barSave.scale.setScalar(0.78);
    O.barCuts.position.y = FL + 0.24; O.barSave.position.y = FL + 0.24;
    O.barLblC = brickSign(g, ["~7,000 JOB CUTS"], "#1b1b1b", "#ffffff", 1.05, 0.32, 1.6, FL + 2.5, -2.0, 0, null, false);
    for (const x of [1.6, 2.75]) { cyl(g, 0.03, 0.03, 2.2, M("#3a3d42", { metalness: 0.5 }), x, FL + 1.3, -2.08, 8); const bs = new THREE.Mesh(BR22, M("#1b1b1b")); bs.scale.set(0.5, 0.4, 0.5); bs.position.set(x, FL + 0.24, -2.08); g.add(bs); }
    O.barLblS = brickSign(g, ["$5.5B SAVINGS"], "#1b1b1b", "#c8ff3e", 1.05, 0.32, 2.75, FL + 2.5, -2.0, 0, null, false);
    O.cutChips = brickBurst(g, 12, ["#e8382b", "#c8102e"], ["3024", "3005", "3004"], 0.0173 * 0.8);
    plant(g, -5.0, 1.8, 1.3); plant(g, 5.0, 1.2, 1.3);
  }

  // ---------------------------------------------------------------- set: TRIAN (the activist investor's office, warm afternoon)
  function drawSeats(c, Wd, H, hi) { // whiteboard: the proxy-fight plan (one highlighted board seat)
    c.fillStyle = "#f4f6f6"; c.fillRect(0, 0, Wd, H); c.fillStyle = "#1b1b1b"; c.textAlign = "center"; c.font = "900 " + Math.round(H * 0.13) + "px Arial Black, Arial"; c.fillText("PROXY FIGHT", Wd / 2, H * 0.18);
    c.fillStyle = "#2f5fa8"; c.font = "900 " + Math.round(H * 0.08) + "px Arial Black, Arial"; c.fillText("DISNEY BOARD", Wd / 2, H * 0.34);
    for (let i = 0; i < 7; i++) { const x = Wd * (0.14 + i * 0.12), on = i === 6 && hi; c.fillStyle = on ? "#e8382b" : "#7a828c"; c.fillRect(x - 22, H * 0.48, 44, 40); c.fillRect(x - 22, H * 0.4, 10, 50); }
    if (hi) { c.strokeStyle = "#e8382b"; c.lineWidth = 7; c.beginPath(); c.arc(Wd * 0.86, H * 0.55, 46, 0, Math.PI * 2); c.stroke(); c.fillStyle = "#e8382b"; c.font = "900 " + Math.round(H * 0.075) + "px Arial Black, Arial"; c.fillText("ONE SEAT", Wd * 0.8, H * 0.8); }
  }
  function buildTrian(ctx) {
    const g = W.TRIAN = grp();
    X.sky(g, DUSK);
    tileFloor(g, 9, 8, "#6e5640", "#7a604a", 0.55);
    const cols = ["#7a4e2e", "#6b4226", "#83563a"];
    wallBack(g, cols, -4.5, 4.5, -3.4, 10, (r, x) => r >= 2 && r <= 7 && x > 0.8 && x < 4.4);
    windowFrame(g, -2.1, FL + 2.4, -3.4, 3.0, 2.9, "#2a1c12", 3);
    skyline(g, { z: -15, x0: -20, x1: 8, n: 8, hMin: 8, hMax: 26, seed: 31 });
    wallSide(g, cols, -4.5, -3.4, 4, 10, -1); wallSide(g, cols, 4.5, -3.4, 4, 10, 1);
    ceiling(g, 9, 7.4, FL + 4.8, "#3a2a1e", [[0, -0.6, 2.6, 0.3]]);
    K.desk(g, -0.6, FL, -0.7, 0, 2.2, 0.95, "#3b2414");
    O.trChair = execChair(g, -0.6, -1.5, 0, "#1b1b1b");
    K.laptop(g, -1.1, FL + 0.81, -0.75, 0.3, "#9fd0ff"); deskLamp(g, -1.5, FL + 0.81, -0.95, 0.3); K.papers(g, -0.2, FL + 0.81, -0.6, 3, 0.2);
    O.trBoard = screen(g, 2.3, 1.4, (c, Wd, H) => drawSeats(c, Wd, H, false), 2.2, FL + 2.3, -3.15, 0, 768, 0.95); O.trHi = false;
    // the demand sign on an easel: "CUT COSTS" (his argument), later stamped DONE, then breaks into bricks
    const es = grp(g, 2.6, 0, 0.2, -0.45); O.easel = es;
    for (const s of [-1, 1]) { const lg = cyl(es, 0.03, 0.03, 1.9, M("#6b4a2e"), s * 0.38, FL + 0.9, 0, 8); lg.rotation.z = s * 0.12; }
    const bl = cyl(es, 0.03, 0.03, 1.8, M("#6b4a2e"), 0, FL + 0.85, -0.3, 8); bl.rotation.x = -0.2;
    O.demand = grp(es, 0, FL + 1.35, 0.05); rbx(O.demand, 1.3, 0.9, 0.1, "#f4f2ec", 0, 0, 0);
    O.demandSign = brickSign(O.demand, ["CUT", "COSTS"], "#f4f2ec", "#c8102e", 1.2, 0.8, 0, 0, 0.03, 0, null, false);
    O.doneStamp = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.5), new THREE.MeshBasicMaterial({ map: tex(512, 232, (c, Wd, H) => { c.clearRect(0, 0, Wd, H); c.save(); c.translate(Wd / 2, H / 2); c.rotate(-0.12); c.strokeStyle = "#2f9e44"; c.lineWidth = 14; c.strokeRect(-220, -80, 440, 160); c.fillStyle = "#2f9e44"; c.textAlign = "center"; c.textBaseline = "middle"; c.font = "900 110px Arial Black, Arial"; c.fillText("DONE", 0, 6); c.restore(); }), transparent: true, toneMapped: false, color: new THREE.Color(1.1, 1.1, 1.1), depthWrite: false }));
    O.stampG = grp(O.demand, 0, -0.02, 0.14); O.stampG.rotation.z = -0.2;
    rbx(O.stampG, 1.28, 0.86, 0.03, "#f8f8f4", 0, 0.02, -0.02, 0, 0.01); O.doneStamp.position.set(0, 0, 0.0); O.stampG.add(O.doneStamp);
    O.strike = grp(O.demand, 0, -0.17, 0.11); O.strike.rotation.z = 0.07; rbx(O.strike, 1.25, 0.09, 0.04, "#c8102e", 0, 0, 0, 0, 0.01);
    O.demandDeb = brickBurst(g, 28, ["#f4f2ec", "#c8102e", "#e4e0d6"], ["3069b", "3023", "3024", "3004", "3070b"], 0.0173 * 0.9);
    O.trPuff = dustPuffs(g);
    // his floor-standing placard: PROXY FIGHT on a pole in a studded brick base (never in his hand, never over his face)
    O.placardF = grp(g, 0.35, 0, 0.55, 0.25);
    { const pr = grp(O.placardF); O.placardPivot = pr; rbx(pr, 0.7, 0.2, 0.36, "#2b2b2b", 0, FL + 0.1, 0, 0, 0.02); studs2(pr, "#2b2b2b", -0.35, -0.18, 0.7, 0.36, FL + 0.2);
      cyl(pr, 0.03, 0.03, 1.5, M("#8a5a2b"), 0, FL + 0.95, 0, 8); brickSign(pr, ["PROXY", "FIGHT"], "#c8102e", "#ffffff", 0.9, 0.6, 0, FL + 1.75, 0.04, 0, null, false); }
    // a second set of dressing: filing cabinet, wall clock, framed chart
    { const fc = grp(g, -3.9, 0, -0.6, Math.PI / 2); for (let k = 0; k < 3; k++) { rbx(fc, 0.7, 0.42, 0.6, "#5b6066", 0, FL + 0.21 + k * 0.43, 0, 0, 0.02); rbx(fc, 0.2, 0.04, 0.03, "#c9cdd2", 0, FL + 0.3 + k * 0.43, 0.31, 0, 0.01); } studs2(fc, "#5b6066", -0.35, -0.3, 0.7, 0.6, FL + 1.29); }
    screen(g, 0.9, 0.62, (c, Wd, H) => { c.fillStyle = "#f4f2ec"; c.fillRect(0, 0, Wd, H); c.strokeStyle = "#2f5fa8"; c.lineWidth = 8; c.beginPath(); c.moveTo(20, H - 30); for (let i = 1; i <= 6; i++) c.lineTo(20 + i * (Wd - 40) / 6, H - 30 - (rnd(i * 7) * 0.6 + i * 0.07) * (H - 60)); c.stroke(); }, -3.0, FL + 2.6, -3.15, 0, 256, 0.9);
    K.bookshelf(g, -3.6, FL, -3.0, 0); plant(g, -3.9, 1.5, 1.4); floorLamp(g, 3.9, 1.6, "#ffd9a0");
    { const ph = grp(g, 0.1, FL + 0.81, -0.95); rbx(ph, 0.22, 0.08, 0.18, "#1b1b1b", 0, 0.04, 0); rbx(ph, 0.24, 0.05, 0.06, "#1b1b1b", 0, 0.11, 0); }
    pendant(g, 0.6, FL + 4.8, 0.2, "#ffcf8a", 3.2);
    { const wf = new THREE.PointLight("#8fb0ff", 1.2, 6, 1.6); wf.position.set(-2.1, FL + 2.4, -2.6); g.add(wf); }
    // dressing: trophy shelf, wall clock, coffee cup with steam, brick plant on the desk
    { const sh = grp(g, -3.0, FL + 1.9, -3.2); rbx(sh, 1.6, 0.08, 0.3, "#4a2a16", 0, 0, 0); for (let k = 0; k < 3; k++) { const tr = grp(sh, -0.5 + k * 0.5, 0.04, 0); cyl(tr, 0.08, 0.1, 0.06, M("#c9a24a", { metalness: 0.6, roughness: 0.3 }), 0, 0.03, 0, 14); cyl(tr, 0.03, 0.03, 0.14, M("#c9a24a", { metalness: 0.6, roughness: 0.3 }), 0, 0.13, 0, 10); cyl(tr, 0.09, 0.05, 0.12, M("#c9a24a", { metalness: 0.6, roughness: 0.3 }), 0, 0.26, 0, 14); } }
    { const ck = grp(g, 0.2, FL + 3.4, -3.18); const face = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32), new THREE.MeshStandardMaterial({ color: "#efe6d0", roughness: 0.8 })); face.rotation.x = Math.PI / 2; ck.add(face); const hh = bx(ck, 0.03, 0.17, 0.02, "#1b1b1b", 0.04, 0.06, 0.04); hh.rotation.z = -0.7; const mh = bx(ck, 0.02, 0.24, 0.02, "#1b1b1b", 0, 0.1, 0.05); }
    O.trCup = K.mug(g, 0.2, FL + 0.81, -0.55, "#2f5fa8"); O.trSteam = dustPuffs(g, "#f4f2ee", 0.24);
  }

  // ---------------------------------------------------------------- set: STREET (dusk, 2024)
  const DUSK = { zenith: "#1c2a5a", mid: "#6a5a8e", horizon: "#ffae78", ground: "#3a3040", sunDir: [-0.7, 0.14, -0.7], sunColor: "#ffb070", sunSize: 0.9, haze: 0.8, clouds: 0.3, cloudColor: "#ffd2b0", cloudShade: "#5a4a6a" };
  function buildStreet(ctx) {
    const g = W.STREET = grp();
    X.sky(g, DUSK);
    X.ground(g, { size: 400, studs: false, colors: ["#6f6c66", "#5f5c57", "#7a766e"], kind: "concrete", seed: 4, repeat: 30 });
    { const st = tex(256, 256, (c, Wd, H) => { c.fillStyle = "#9ea3a8"; c.fillRect(0, 0, Wd, H); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { c.fillStyle = "rgba(" + (rnd(i * 4 + j) > 0.5 ? "255,255,255,0.05" : "0,0,0,0.05") + ")"; c.fillRect(i * 64, j * 64, 64, 64); } c.strokeStyle = "rgba(0,0,0,0.3)"; c.lineWidth = 3; for (let i = 0; i <= 4; i++) { c.beginPath(); c.moveTo(i * 64, 0); c.lineTo(i * 64, H); c.stroke(); c.beginPath(); c.moveTo(0, i * 64); c.lineTo(Wd, i * 64); c.stroke(); } });
      st.wrapS = st.wrapT = THREE.RepeatWrapping; st.repeat.set(5.6 / 1.4, 60 / 1.4);
      bx(g, 5.6, FL, 60, M("#ffffff", { map: st, roughness: 0.55, clearcoat: 0.12 }), 0, FL / 2, -14); }
    K.plate(g, "#7d8287", 1, 150, 2.85, FL + 0.08, -14, 0.08, true);
    bx(g, 9, 0.05, 60, M("#33353a", { roughness: 0.7, clearcoat: 0 }), 7.4, 0.025, -14).receiveShadow = true;
    for (let i = 0; i < 16; i++) bx(g, 0.16, 0.012, 1.2, M("#f2f0e6"), 7.4, 0.056, 10 - i * 3.2);
    // building row on the left (shopfronts lit), far skyline, the hall marquee ahead
    for (let i = 0; i < 7; i++) { const z = 6 - i * 6.2, h = 9 + rnd(i * 3) * 9, fac = facadeMat(60 + i, ["#b9a089", "#8f9aa6", "#c9c2b4", "#7d6a5a"][i % 4]);
      fac.map.repeat.set(2, Math.round(h / 6)); fac.map.wrapS = fac.map.wrapT = THREE.RepeatWrapping; fac.emissiveMap.repeat.copy(fac.map.repeat); fac.emissiveMap.wrapS = fac.emissiveMap.wrapT = THREE.RepeatWrapping;
      noShadow(bx(g, 6, h, 6, fac, -6.1, h / 2, z)); noShadow(bx(g, 0.1, 1.9, 4.4, glowM(["#ffd9a0", "#bfe0ff", "#ffcf8a"][i % 3], 1.0), -3.04, 1.15, z)); rbx(g, 0.9, 0.1, 4.8, ["#c8102e", "#2f5fa8", "#3fa34d"][i % 3], -2.75, 2.45, z); }
    skyline(g, { z: -50, x0: -30, x1: 40, n: 10, hMin: 10, hMax: 30, seed: 44, rows: 1, street: false });
    skyline(g, { z: 0, x0: 14, x1: 30, n: 3, hMin: 10, hMax: 22, seed: 46, rows: 1, street: false });
    O.marquee = brickSign(g, ["SHAREHOLDER VOTE"], "#1d2b44", "#f2cd37", 4.4, 0.8, 0.6, 4.3, -18, 0);
    for (const x of [-1.75, 2.95]) lampPost(g, x, -18.1, 3.9, false);
    for (const z of [4, -4, -12, -20]) lampPost(g, 2.4, z, 3.8, true);
    for (const z of [-9, -17]) { const pl = grp(g, 2.1, 0, z); rbx(pl, 1.1, 0.45, 1.1, "#8d8a84", 0, FL + 0.22, 0); K.studField(pl, "#5d3a1e", -0.5, -0.5, 2, 2, FL + 0.45); tree(pl, 0, 0, 1.0).position.y = 0.42; }
    bench(g, -2.3, -2.4, Math.PI / 2);
    { const nb = grp(g, -2.4, 0, 2.2, Math.PI / 2); rbx(nb, 0.5, 0.9, 0.45, "#2b5596", 0, FL + 0.45, 0); noShadow(bx(nb, 0.42, 0.28, 0.02, glowM("#fff4dc", 0.8), 0, FL + 0.72, 0.23)); }
    brickCar(g, 5.2, -6, Math.PI / 2, "#2b5596"); brickCar(g, 5.2, 3, Math.PI / 2, "#eeeae0");
    O.streetCars = [0, 1, 2].map((i) => ({ c: brickCar(g, 9.0, 0, -Math.PI / 2, ["#c91a09", "#f2cd37", "#388e3c"][i]), z0: 30 - i * 22 }));
    X.brickClouds(g, { n: 10, area: 300, y: 60, size: 3.0, center: [0, 0, -160], seed: 9 });
    // briefcase: handle in the C-hand, the case hangs below the fist (rotated to hang plumb)
    O.briefcase = new THREE.Group(); { const bc = grp(O.briefcase, 0, 0, 0); bc.rotation.x = -0.22; O.bcInner = bc; const h = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.011, 8, 16, Math.PI), M("#1b1b1b")); h.position.y = -0.045; bc.add(h);
      rbx(bc, 0.34, 0.24, 0.085, "#4a2a16", 0, -0.165, 0, 0, 0.02); rbx(bc, 0.35, 0.02, 0.09, "#2b1a0e", 0, -0.115, 0); for (const sx of [-1, 1]) rbx(bc, 0.04, 0.03, 0.095, "#c9a24a", sx * 0.1, -0.075, 0, 0, 0.005); }
    // street furniture: traffic light, hydrant, trash can, mailbox
    { const tl = grp(g, 2.55, 0, -7.5); for (let k = 0; k < 8; k++) leg(tl, 0, FL + k * 0.42, 0, 0.42, 1, M("#2d323a")); rbx(tl, 0.3, 0.8, 0.26, "#1b1b1b", 0, FL + 3.75, 0.1); [["#ff3030", 0.25], ["#ffb020", 0], ["#30ff70", -0.25]].forEach(([c2, dy], i) => noShadow(cyl(tl, 0.08, 0.08, 0.04, i === 2 ? glowM(c2, 2.2) : M("#2a2a2a"), 0, FL + 3.75 + dy, 0.24, 14)).rotation.x = Math.PI / 2); }
    { const hy = grp(g, 2.5, 0, 1.2); leg(hy, 0, FL, 0, 0.6, 1.2, M("#c8102e")); cyl(hy, 0.13, 0.13, 0.08, M("#c8102e"), 0, FL + 0.52, 0, 14); studs2(hy, "#c8102e", -0.1, -0.1, 0.2, 0.2, FL + 0.56); }
    { const tc = grp(g, -2.55, 0, -0.4); const b2 = new THREE.Mesh(BR22, M("#3a5a40")); b2.scale.set(0.8, 1.6, 0.8); tc.add(b2); b2.position.y = FL; cyl(tc, 0.3, 0.3, 0.06, M("#2b2b2b"), 0, FL + 0.7, 0, 20); }
    { const mb = grp(g, -2.5, 0, -5.2, Math.PI / 2); rbx(mb, 0.5, 0.75, 0.42, "#2f5fa8", 0, FL + 0.6, 0); cyl(mb, 0.21, 0.21, 0.5, M("#2f5fa8"), 0, FL + 0.98, 0, 16).rotation.z = Math.PI / 2; for (const sx of [-1, 1]) bx(mb, 0.06, 0.25, 0.06, "#1b1b1b", sx * 0.15, FL + 0.12, 0); }
    // window ledges + pilasters on the shopfront buildings (relief, not flat textures)
    { const RL2 = []; for (let i = 0; i < 7; i++) { const z = 6 - i * 6.2, h = 9 + rnd(i * 3) * 9; for (let yy = 3.3; yy < h - 0.5; yy += 1.5) RL2.push([-3.04, yy, z, 0.16, 0.12, 5.9]); for (let q = -2; q <= 2; q++) RL2.push([-3.04, h / 2 + 1.4, z + q * 1.45, 0.18, h - 2.8, 0.18]); }
      const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), M("#6d665e", { roughness: 0.6 }), RL2.length), mm = new THREE.Matrix4(), q0 = new THREE.Quaternion(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
      RL2.forEach((r, i) => im.setMatrixAt(i, mm.compose(v1.set(r[0], r[1], r[2]), q0, v2.set(r[3], r[4], r[5])))); im.frustumCulled = false; im.castShadow = true; g.add(im); }
  }

  // ---------------------------------------------------------------- set: HALL (shareholder meeting hall with a voting screen)
  function drawVote(c, Wd, H, k, done) { // voting screen: bars without invented numbers; result card at the end
    const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#0e1726"); gr.addColorStop(1, "#16263f"); c.fillStyle = gr; c.fillRect(0, 0, Wd, H);
    c.textAlign = "center"; c.fillStyle = "#2f8fd0"; c.fillRect(0, 0, Wd, H * 0.2); c.fillStyle = "#fff"; c.font = "900 " + Math.round(H * 0.12) + "px Arial Black, Arial"; c.fillText(done ? "RESULT" : k < 0.999 ? "VOTING OPEN" : "SHAREHOLDER VOTE", Wd / 2, H * 0.145);
    if (done) {
      c.fillStyle = "#c8ff3e"; c.font = "900 " + Math.round(H * 0.15) + "px Arial Black, Arial"; c.fillText("WHOLE BOARD", Wd / 2, H * 0.44); c.fillText("RE-ELECTED", Wd / 2, H * 0.62);
      c.fillStyle = "#ff6b4a"; c.font = "900 " + Math.round(H * 0.1) + "px Arial Black, Arial"; c.fillText("PELTZ REJECTED", Wd / 2, H * 0.84); return;
    }
    const bar = (y, lbl, col, f) => { c.fillStyle = "#fff"; c.font = "900 " + Math.round(H * 0.075) + "px Arial Black, Arial"; c.textAlign = "left"; c.fillText(lbl, Wd * 0.06, y + H * 0.085); c.fillStyle = "#26384c"; c.fillRect(Wd * 0.36, y, Wd * 0.58, H * 0.12); c.fillStyle = col; c.fillRect(Wd * 0.36, y, Wd * 0.58 * f, H * 0.12); };
    bar(H * 0.34, "BOARD", "#c8ff3e", 0.82 * k); bar(H * 0.6, "PELTZ", "#ff6b4a", 0.3 * k);
    if (k < 0.999) { c.textAlign = "center"; c.fillStyle = "rgba(200,255,62," + (0.5 + 0.5 * Math.sin(k * 60)) + ")"; c.font = "700 " + Math.round(H * 0.07) + "px Arial"; c.fillText("COUNTING SHARES ...", Wd / 2, H * 0.92); }
  }
  function buildHall(ctx) {
    const g = W.HALL = grp();
    X.sky(g, "night");
    tileFloor(g, 12, 13, "#5a2a2a", "#4e2424", 0.6, false, -0.2);
    const cols = ["#8a6a4e", "#7d5f45", "#957558"];
    wallBack(g, cols, -6, 6, -6.6, 13);
    wallSide(g, cols, -6, -6.6, 10.4, 13, -1, (r, x) => r >= 2 && r <= 8 && ((x > 7.4 && x < 9.8) || (x > 12.2 && x < 14.6)));
    windowFrame(g, -6, FL + 2.64, -3.0, 2.4, 3.36, "#2a1c12", 2, Math.PI / 2); windowFrame(g, -6, FL + 2.64, 1.8, 2.4, 3.36, "#2a1c12", 2, Math.PI / 2);
    skyline(grp(g, 0, 0, 0, Math.PI / 2), { z: -18, x0: -16, x1: 16, n: 7, hMin: 10, hMax: 26, seed: 51, rows: 1, street: false });
    wallSide(g, cols, 6, -6.6, 10.4, 13, 1);
    { const bw = grp(g, 0, 0, 0, Math.PI); wallBack(bw, cols, -6, 6, -10.4, 13, (r, x) => r <= 4 && ((x > 1.6 && x < 3.6) || (x > 8.4 && x < 10.4)));
      bx(bw, 12, 6.6, 0.05, M("#6a5040", { roughness: 0.7 }), 0, FL + 3.2, -10.68);
      for (const x of [-3.4, 3.4]) { rbx(bw, 1.9, 2.3, 0.08, "#4a2a16", x, FL + 1.15, -10.5, 0, 0.02); noShadow(bx(bw, 0.6, 0.5, 0.02, glowM("#ffcf8a", 1.0), x, FL + 1.75, -10.45)); cyl(bw, 0.04, 0.04, 0.12, M("#c9a24a", { metalness: 0.6 }), x + 0.7, FL + 1.1, -10.44, 10).rotation.x = Math.PI / 2; brickSign(bw, ["EXIT"], "#1b5e20", "#ffffff", 0.7, 0.25, x, FL + 2.75, -10.15, 0, null, true); } }
    for (const x of [-3.6, 3.6]) pendant(g, x, FL + 6.24, 7.0, "#ffd9a0", 1.2);
    for (const s2 of [-1, 1]) plant(g, s2 * 5.3, 9.6, 1.5);
    ceiling(grp(g, 0, 0, 1.9), 12, 17.0, FL + 6.24, "#3a2a22", [[-3, 0, 0.3, 14], [3, 0, 0.3, 14]]);
    // stage + board table + voting screen
    rbx(g, 11.6, 0.48, 3.2, "#2b2b33", 0, FL + 0.24, -4.95, 0, 0.03); studs2(g, "#2b2b33", -5.8, -6.5, 11.6, 3.2, FL + 0.48, (x, z) => Math.abs(x) < 2.75 && z > -5.75 && z < -4.05);
    noShadow(bx(g, 11.6, 0.05, 0.05, glowM("#ffd9a0", 2.0), 0, FL + 0.46, -3.34));
    K.table(g, 0, FL + 0.48, -4.6, 0, 5.2, 1.0, "#4a2a16");
    O.hallChairs = [-2.0, -1.0, 0, 1.0, 2.0].map((x) => K.chair(g, x, FL + 0.48, -5.35, 0, "#1b1b1b"));
    O.hallPlate = nameplate(g, "THE BOARD", 0, FL + 0.48 + 0.87, -4.12, 0, 1.1);
    O.voteScr = screen(g, 3.8, 1.75, (c, Wd, H) => drawVote(c, Wd, H, 0, false), 0, FL + 3.55, -6.3, 0, 1024, 1.0); O.voteK = -1;
    { const lec = grp(g, 4.4, FL + 0.48, -4.2, -0.3); rbx(lec, 0.8, 1.1, 0.6, "#4a2a16", 0, 0.55, 0); rbx(lec, 0.9, 0.06, 0.7, "#5c3a1e", 0, 1.12, 0.03); }
    for (const x of [-5.2, 5.2]) plant(g, x, -5.6, 1.5);
    for (const x of [-3.6, 0, 3.6]) pendant(g, x, FL + 6.24, -1.0, "#ffd9a0", 1.6);
    for (const x of [-3.6, 3.6]) pendant(g, x, FL + 6.24, 3.0, "#ffd9a0", 1.3);
    for (const z of [-4.5, 0.5, 4.5]) for (const s of [-1, 1]) { const sc = grp(g, s * 5.75, FL + 3.0, z); noShadow(cyl(sc, 0.12, 0.08, 0.3, glowM("#ffe2a8", 1.8), 0, 0, 0, 12)); const l = new THREE.PointLight("#ffcf8a", 0.8, 4, 1.8); sc.add(l); }
    // audience rows (chairs face the stage, -z)
    O.audChairs = []; for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) O.audChairs.push(K.chair(g, -3.3 + i * 1.32 + (r % 2) * 0.3, FL, 1.1 + r * 1.35, Math.PI, ["#7a1420", "#6a121c"][r % 2]));
    // aisle carpet, two aisle mics, a ballot box on a brick table
    bx(g, 1.0, 0.012, 9.0, M("#8a1424", { roughness: 0.9, clearcoat: 0 }), 4.35, FL + 0.006, 3.0).receiveShadow = true;
    for (const [x, z] of [[4.35, 0.2], [-4.6, 0.2]]) { const mg = grp(g, x, 0, z); cyl(mg, 0.14, 0.16, 0.04, M("#1b1b1b"), 0, FL + 0.02, 0, 16); cyl(mg, 0.015, 0.015, 1.4, M("#9aa0a6", { metalness: 0.6 }), 0, FL + 0.72, 0, 8); cyl(mg, 0.04, 0.035, 0.1, M("#1b1b1b"), 0, FL + 1.45, 0.03, 10); }
    { const bb = grp(g, -4.2, 0, -2.2, 0.4); K.desk(bb, 0, FL, 0, 0, 1.0, 0.6, "#4a2a16"); rbx(bb, 0.5, 0.4, 0.4, "#f4f2ec", 0, FL + 0.98, 0, 0, 0.02); bx(bb, 0.24, 0.02, 0.03, "#1b1b1b", 0, FL + 1.19, 0); brickSign(bb, ["BALLOTS"], "#2f5fa8", "#ffffff", 0.46, 0.14, 0, FL + 0.95, 0.205, 0, null, true); }
    // share-brick stacks on the floor (holders' area)
    O.bigStacks = [-1.55, -0.55, 0.45].map((x) => shareStack(g, x, -2.0, 8, "#f2cd37")); O.bigStacks.forEach((s2) => s2.scale.setScalar(0.62));
    O.smallStacks = [-2.7, -2.2, 2.3, 2.8].map((x, i) => shareStack(g, x, -1.7 + (i % 2) * 0.3, 1 + (i % 2), "#9aa0a6")); O.smallStacks.forEach((s2) => s2.scale.setScalar(0.62));
    O.peltzStack = shareStack(g, 3.45, -1.4, 2, "#c8102e"); O.peltzStack.scale.setScalar(0.62);
    O.megaphone = new THREE.Group(); { const cn = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.13, 0.32, 16, 1, true), M("#f4f4f4", { side: THREE.DoubleSide })); cn.rotation.x = Math.PI / 2; cn.position.z = 0.18; O.megaphone.add(cn); cyl(O.megaphone, 0.03, 0.03, 0.14, M("#1b1b1b"), 0, -0.06, 0.04, 8); }
    O.hallConf = [0, 1, 2].map(() => X.debris(g, { n: 80, colors: ["#e8382b", "#f2cd37", "#2f8fd0", "#3fa34d", "#ffffff", "#ff6b4a"], size: 0.09 }));
    O.paddles = [];
    O.headlines = brickBurst(g, 24, ["#f4f2ec", "#e4e0d6", "#d0ccc2"], ["3069b", "3070b"], 0.0173 * 0.45);
  }

  // ---------------------------------------------------------------- set: STUDIO (polished DealCalm studio for the CTA)
  function buildStudio(ctx) {
    const g = W.STUDIO = grp();
    X.sky(g, "night");
    tileFloor(g, 9.6, 7.6, "#16323a", "#1b3a44", 0.6, true);
    const cols = ["#5a3e2b", "#4e3424", "#654630"];
    wallBack(g, cols, -4.8, 4.8, -3.4, 10, (r, x) => r >= 6 && r <= 9 && x > 2.9 && x < 6.7);
    windowFrame(g, 0, FL + 3.75, -3.4, 3.4, 1.5, "#2a1c12", 4);
    skyline(g, { z: -15, x0: -14, x1: 14, n: 8, hMin: 8, hMax: 24, seed: 41, rows: 2 });
    wallSide(g, cols, -4.8, -3.4, 4.2, 10, -1); wallSide(g, cols, 4.8, -3.4, 4.2, 10, 1);
    ceiling(g, 9.6, 7.8, FL + 4.8, "#6a7a88", [[-2.4, -0.5, 0.25, 5], [2.4, -0.5, 0.25, 5]]);
    for (const y of [FL + 0.35, FL + 4.4]) noShadow(bx(g, 9.4, 0.06, 0.06, glowM("#40e0c8", 2.2), 0, y, -3.15));
    const ph = O.dcPhone = grp(g, 0.05, 0, -1.9);
    rbx(ph, 3.0, 1.1, 1.3, "#1d2b44", 0.3, FL + 0.55, 0.1); for (let k = 1; k < 4; k++) bx(ph, 3.01, 0.012, 1.31, M("#141f33"), 0.3, FL + k * 0.27, 0.1);
    studs2(ph, "#1d2b44", -1.2, -0.55, 3.0, 1.3, FL + 1.1, (x, z) => (Math.abs(x) < 0.66 && Math.abs(z) < 0.2) || (Math.abs(x - 0.95) < 0.42 && Math.abs(z - 0.2) < 0.3) || (Math.abs(x + 0.95) < 0.36 && Math.abs(z - 0.22) < 0.24) || (Math.abs(x - 1.5) < 0.2 && Math.abs(z - 0.2) < 0.2));
    rbx(ph, 0.76, 0.024, 0.52, "#2b3a58", 0.95, FL + 1.112, 0.2, 0, 0.008); rbx(ph, 0.64, 0.024, 0.4, "#2b3a58", -0.95, FL + 1.112, 0.22, 0, 0.008);
    // confetti cannon: a 1x1 round-brick tube on the plinth corner (fires once on "pull an Iger")
    O.ctaChair = execChair(ph, 0.95, 0.05, 0, "#8a1f2f"); O.ctaChair.position.y = FL + 1.12; O.stPuff = dustPuffs(ph);
    // printed bezel: 1x1 brick strip down both phone sides
    for (const sx of [-1, 1]) for (let k = 0; k < 6; k++) rbx(ph, 0.1, 0.32, 0.2, "#16181c", sx * 0.62, FL + 1.28 + k * 0.33, 0, 0, 0.012);
    rbx(ph, 1.14, 2.0, 0.18, M("#0c0d10", { roughness: 0.3, clearcoat: 0.5 }), 0, FL + 2.12, 0, 0, 0.13);
    for (let i = 0; i < 3; i++) cyl(ph, 0.08, 0.08, 0.06, M("#0c0d10"), -0.3 + i * 0.3, FL + 3.15, 0, 14);
    O.dcGlow = new THREE.PointLight("#40e0c8", 0.5, 5, 1.6); O.dcGlow.position.set(0, FL + 2.1, 0.9); ph.add(O.dcGlow);
    const app = (c, Wd, H) => {
      const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#0f6f78"); gr.addColorStop(1, "#0b2f45"); c.fillStyle = gr; c.fillRect(0, 0, Wd, H);
      c.fillStyle = "rgba(255,255,255,0.92)"; c.beginPath(); c.roundRect(Wd / 2 - 80, 110, 160, 160, 40); c.fill();
      c.fillStyle = "#0f6f78"; c.font = "900 108px Arial Black, Arial"; c.textAlign = "center"; c.fillText("D", Wd / 2, 230);
      c.fillStyle = "#ffffff"; c.font = "900 96px Arial Black, Arial"; c.fillText("DealCalm", Wd / 2, 560); if (app.hi) { c.fillStyle = "rgba(64,224,200,0.55)"; c.beginPath(); c.roundRect(96, 1016, Wd - 192, 112, 56); c.fill(); }
      c.fillStyle = "#bff3ea"; c.font = "700 36px Arial"; c.fillText("communication &", Wd / 2, 625); c.fillText("negotiation skills", Wd / 2, 670);
      const bub = (y, w, right, col) => { c.fillStyle = col; c.beginPath(); c.roundRect(right ? Wd - 60 - w : 60, y, w, 74, 28); c.fill(); };
      const nb = app.n == null ? 3 : app.n; if (nb >= 1) bub(730, 380, false, "rgba(255,255,255,0.22)"); if (nb >= 2) bub(825, 330, true, "#40e0c8"); if (nb >= 3) bub(920, 360, false, "rgba(255,255,255,0.22)");
      c.fillStyle = "#ffffff"; c.beginPath(); c.roundRect(110, 1030, Wd - 220, 84, 42); c.fill(); c.fillStyle = "#0f6f78"; c.font = "900 44px Arial Black, Arial"; c.fillText("START", Wd / 2, 1087);
    };
    O.dcApp = app; O.dcScreen = screen(ph, 1.02, 1.86, app, 0, FL + 2.12, 0.095, 0, 600, 1.15); O.dcScreen.children[0].visible = false;
    O.signWeb = brickSign(g, ["dealcalm.com"], "#40e0c8", "#0b2f45", 1.5, 0.34, -0.3, FL + 0.88, -1.12, 0, null, true);
    O.signApp = brickSign(g, ["App Store"], "#111316", "#ffffff", 1.0, 0.34, 1.0, FL + 0.88, -1.12, 0, null, true);
    K.bookshelf(g, -3.6, FL, -3.0, 0); K.bookshelf(g, 3.6, FL, -3.0, 0);
    for (const x of [-1.9, 1.9]) pendant(g, x, FL + 4.8, -1.2, "#ffcf8a", 1.0);
    O.dcConf = brickBurst(g, 22, ["#e8382b", "#f2cd37", "#2f8fd0", "#40e0c8", "#ffffff"], ["3024", "3069b", "3070b", "3023"], 0.0173 * 0.8);
    for (const x of [-3, 0, 3]) spot(g, x, FL + 4.6, 0.8, "#ffe8cc", 1.0);
    plant(g, -4.2, -2.8, 1.4); plant(g, 4.2, -2.8, 1.4); plant(g, 4.1, 1.8, 1.2);
    K.sofa(g, -3.7, FL, -0.2, Math.PI / 2, "#e9ecef");
    O.ctaB = [["REPLACEMENT", "#e8382b"], ["NO ARGUMENT", "#f2cd37"], ["BIG HOLDERS", "#2f8fd0"]].map(([t, c]) => labelBrick(g, t, c, c === "#f2cd37" ? "#111316" : "#ffffff", 0.36));
  }

  // ---------------------------------------------------------------- set dressing (assets/props-kit.js): a distinct brick prop palette per set
  // Props sit to the sides, behind and in the front corners (never over faces or the caption band); each set is baked into
  // InstancedMeshes afterwards (one per geometry + material). Live props (fan, steam, fountain, pigeons, dog) tick in update().
  let PK = null;
  function dressSets() {
    const ex = (sp) => Object.assign({ skin: K.SKIN.light }, sp);
    // STAGE: backstage kit in the wings: speaker stacks, road cases, a cable spool, a ladder, barrels, a stagehand on headset
    { const g = W.STAGE;
      PK.speakerStack(g, -2.75, FL, -3.85, 0.35);
      PK.speakerStack(g, 2.5, FL, -3.95, -0.35, { single: true });
      PK.roadCase(g, -3.6, FL, -2.85, 0.3, { n: 2 });
      PK.cableSpool(g, -2.3, FL, -2.5, 0.6);
      PK.stageLadder(g, -4.0, FL, -3.95, 0.12, { n: 5 });
      PK.barrel(g, -1.85, FL, -3.95); PK.barrel(g, -1.35, FL, -4.05, 0, { col: "#5c3f26" }); PK.barrel(g, 1.75, FL, -4.0, 0, { col: "#2f5fa8" });
      PK.extra(g, ex({ kind: "tee", top: "#1b1b1b", legs: "#2a2a30", hair: "#3b2a1a", hairStyle: "short", headset: true, skin: K.SKIN.medium, brows: "#3b2a1a" }),
        { x: -3.35, z: -3.2, ry: 0.4, face: "neutral", aL: -0.55, eL: -1.1, look: [0, -0.6] }, [["L", PK.acc.clipboard(), 0, 0, 0.02]]);
      PK.bake(g); }
    // PARK: a fountain (replaces the small flower bed), a hot-dog cart + vendor, double-globe lanterns at the bridge,
    // a ticket booth, conifers, a dog walker with a dog on a leash
    { const g = W.PARK;
      PK.waterFountain(g, -1.7, FL, -1.75, { r: 0.85 });
      PK.hotdogCart(g, 1.3, FL, -2.15, -0.5);
      PK.cap(PK.extra(g, ex({ kind: "shirt", top: "#f4f2ec", legs: "#2a2a30", hair: "#2a1a10", hairStyle: "short", skin: K.SKIN.tan }), { x: 1.62, z: -2.72, ry: -0.45, face: "smile", gesture: "present" }), "#c8102e", "#f4f2ec");
      PK.lanternPost(g, -1.6, FL, -6.85, 0); PK.lanternPost(g, 1.6, FL, -6.85, 0);
      PK.ticketBooth(g, -3.15, FL, -6.7, 0.3);
      PK.conifer(g, 3.0, FL, -6.8, 1.0); PK.conifer(g, -4.75, FL, -6.6, 1.15); PK.conifer(g, 4.4, FL, -6.5, 1.2);
      const w = PK.extra(g, ex({ kind: "sweater", top: "#237841", legs: "#3a3f47", hair: "#8a3a1a", hairStyle: "ponytail", lips: "#a8434a", lashes: true, skin: K.SKIN.light }), { x: 0.05, z: -5.95, ry: 1.25, face: "smile", aR: -0.55, eR: -0.5, hy: -0.4 });
      const dg = PK.dog(g, 0.85, FL, -5.75, 0.25); dg.userData.noBake = true; O.walker = w.root; O.dog = dg; // day only (hidden on the night recap)
      g.updateMatrixWorld(true); const hp = new THREE.Vector3(); w.hands[1].getWorldPosition(hp); dg.worldToLocal(hp);
      PK.bar(dg, [hp.x, hp.y, hp.z], [0.3, 0.45, 0], 0.008, "#c8102e", 5);
      PK.bake(g); }
    // OFFICE: filing cabinet with a desk globe, umbrella stand, coat rack with trench coat + fedora, desk books + pen cup, a framed print
    { const g = W.OFFICE;
      const fc = PK.filingCabinet(g, -1.42, FL, -2.83, 0, { n: 2, col: "#5b6066" }); PK.globe(fc, 0, fc.userData.top, 0.02, 0.4, { desk: true });
      PK.umbrellaStand(g, -0.8, FL, -2.8, 0.3);
      PK.coatRack(g, 1.0, FL, -2.8, Math.PI / 2, { coat: "#7a5a3a" });
      PK.bookStack(g, -0.95, FL + 0.81, -0.62, 0.2, { n: 3, seed: 2 }); PK.penCup(g, 0.62, FL + 0.81, -0.42);
      PK.framedPicture(g, -1.55, FL + 3.05, -3.17, 0, { w: 0.5, h: 0.62, style: "mountain", frame: "#3b2414" });
      PK.bake(g); }
    // BOARD: credenza under the screen (pitcher, glasses, books), a draped indoor flag, coffee service cart, planter, water glasses
    { const g = W.BOARD;
      const cr = PK.credenza(g, 2.3, FL, -3.02, 0, { n: 2 }), ct = cr.userData.top;
      PK.pitcher(cr, -1.0, ct, 0.0); PK.glass(cr, -0.72, ct, 0.12); PK.glass(cr, -0.58, ct, -0.06);
      PK.bookStack(cr, 0.95, ct, 0.0, -0.2, { n: 3, seed: 5, cols: ["#1f3a5f", "#c9a24a", "#8a1f2f"] });
      PK.flagStand(g, 3.55, FL, -3.0, 0, { h: 2.4, ncol: 2, nrow: 4, cols: ["#1f3a6f", "#f4f2ec", "#c9a24a", "#1f3a6f"] });
      PK.serviceCart(g, 0.4, FL, -2.75, 0.1);
      PK.hedge(g, -1.0, FL, -3.0, 0, { n: 1, rows: 1, box: "#3a3d42", flowers: ["#f4f2ec", "#f6b8c8"] });
      [[-1.55, -0.5], [-0.62, -0.5], [0.22, -0.52], [1.32, -0.55]].forEach(([x, z]) => PK.glass(g, x, FL + 0.87, z));
      PK.bake(g); }
    // NEWS: softbox, rolling monitor cart, water cooler, floor cable runs, a teleprompter on the near camera, a floor manager
    { const g = W.NEWS;
      PK.softbox(g, -1.62, FL, -2.55, 0.75, { h: 2.35, tilt: 0.38, k: 0.85, col: "#ffe8cc" });
      PK.tvCart(g, -2.2, FL, -2.95, 0.45);
      PK.waterCooler(g, 3.65, FL, -3.02, -0.1);
      PK.floorCables(g, [["#1b1b1b", [[-2.2, 1.0], [-1.6, 0.72], [0.2, 0.62], [1.5, 0.78], [2.6, 0.56], [3.6, 0.9], [3.8, 2.0]]], ["#f28c28", [[-3.6, 2.3], [-3.0, 1.4], [-1.0, 0.92], [1.0, 1.08], [3.0, 1.25], [3.7, 2.2]]]], FL);
      { const tg = PK.grp(g, -2.2, 0, 1.2, -0.35); PK.teleprompter(tg, 0, FL + 1.55, -0.95, Math.PI); }
      PK.extra(g, ex({ kind: "shirt", top: "#3a3f47", legs: "#1f2a44", hair: "#1c1c1c", hairStyle: "buzz", headset: true, skin: K.SKIN.dark }), { x: 4.0, z: -2.65, ry: -1.0, face: "neutral", aL: -0.6, eL: -1.15, look: [1.6, -1.2] }, [["L", PK.acc.clipboard(), 0, 0, 0.02]]);
      PK.bake(g); }
    // TRIAN: ceiling fan, cork board with pinned notes + string, copier, bar cart, safe, potted palm, a city print
    { const g = W.TRIAN;
      PK.ceilingFan(g, 0.9, FL + 4.8, 0.2);
      PK.corkBoard(g, 0.52, FL + 2.55, -3.17, 0, { w: 0.85, h: 0.66 });
      PK.copier(g, 3.5, FL, -2.72, -0.15);
      PK.serviceCart(g, -2.45, FL, -2.7, 0.15, { kind: "bar" });
      PK.safe(g, -1.6, FL, -2.78, 0.1);
      PK.pottedPalm(g, -3.3, FL, -1.9, 0.4, { s: 0.85 });
      PK.framedPicture(g, 3.98, FL + 2.45, -3.17, 0, { w: 0.6, h: 0.8, style: "city" });
      PK.bake(g); }
    // STREET: newspaper box + reader, scooter, bicycle, pigeons, recycling bins, traffic cones, flower hedge, parked taxi + van, courier
    { const g = W.STREET;
      PK.newspaperBox(g, -2.05, FL, -9.1, 0.9);
      PK.extra(g, ex({ kind: "jacket", top: "#5a3a7a", under: "#f4f4f4", legs: "#1f2a44", hair: "#7a5a3a", hairStyle: "bob", lips: "#a8434a", lashes: true, skin: K.SKIN.light }), { x: -1.5, z: -9.8, ry: 0.55, face: "neutral", gesture: "hold", hy: -0.2 }, [["R", PK.acc.paper(), 0, 0, 0.02]]);
      PK.scooter(g, 1.75, FL, -6.2, Math.PI / 2 + 0.25);
      PK.bicycle(g, -2.3, FL, -12.4, Math.PI / 2 - 0.15);
      PK.pigeons(g, [[-0.65, FL, -9.4, 0.4], [-0.35, FL, -9.8, 2.2], [1.05, FL, -11.4, -0.8], [1.35, FL, -11.05, 1.5], [0.2, FL, -13.2, 3.0]]);
      PK.recyclingBins(g, -2.35, FL, -14.4, Math.PI / 2);
      for (const [cx, cz] of [[1.45, -14.6], [1.85, -15.4], [1.4, -16.1]]) PK.trafficCone(g, cx, FL, cz, cx);
      PK.hedge(g, -2.4, FL, -17.4, Math.PI / 2, { n: 3, rows: 1, box: "#8d8a84", flowers: ["#e8382b", "#f2cd37", "#f4f2ec"] });
      PK.taxi(g, 3.55, 0, -21.5, Math.PI / 2);
      PK.van(g, 3.6, 0, -27.5, Math.PI / 2);
      PK.cap(PK.extra(g, ex({ kind: "polo", top: "#8a5a2b", legs: "#3a2e26", hair: "#1c1c1c", hairStyle: "buzz", skin: K.SKIN.dark }), { x: 1.5, z: -23.0, ry: -1.4, face: "smile", gesture: "hold" }, [["R", PK.acc.parcel(), 0, 0, 0.02]]), "#8a5a2b");
      PK.bake(g); }
    // HALL: security desk + guard, rope barriers, vending machine, press camera + photographer (all at the back, seen on the vote),
    // balloon bunches by the screen, flower planters at the stage corners
    { const g = W.HALL;
      PK.securityDesk(g, -0.75, FL, 9.35, Math.PI);
      PK.extra(g, ex({ kind: "vest", top: "#1d2b44", under: "#e9eef5", label: "SECURITY", labelColor: "#f2cd37", legs: "#1b1b1b", hair: "#2a1a10", hairStyle: "short", skin: K.SKIN.medium }), { x: -0.45, z: 9.95, ry: Math.PI, face: "neutral" });
      PK.vendingMachine(g, 1.4, FL, 9.82, Math.PI);
      PK.ropeBarrier(g, [[-3.0, 8.45], [-2.1, 8.45], [-1.2, 8.45]], FL); PK.ropeBarrier(g, [[0.6, 8.45], [1.5, 8.45], [2.4, 8.45]], FL);
      PK.pressCamera(g, -1.7, FL, 7.35, Math.PI + 0.1);
      PK.extra(g, ex({ kind: "jacket", top: "#3d3a35", under: "#f2efe6", legs: "#2e4a7a", hair: "#c9a26b", hairStyle: "ponytail", lips: "#b0303a", lashes: true, skin: K.SKIN.light }), { x: 1.6, z: 7.45, ry: Math.PI - 0.15, face: "determined", aR: -1.45, eR: -0.9, aL: -1.3, eL: -1.0 }, [["R", PK.acc.camera(), 0, 0, 0.02]]);
      PK.balloonBunch(g, -2.5, FL + 0.48, -5.95); PK.balloonBunch(g, 2.5, FL + 0.48, -5.95, { cols: ["#2f8fd0", "#f4f2ec", "#c8ff3e", "#f2cd37", "#e8382b"] });
      for (const s of [-1, 1]) PK.hedge(g, s * 2.75, FL, -2.95, 0, { n: 1, rows: 1, box: "#4a2a16", flowers: ["#e8382b", "#f4f2ec", "#f2cd37"] });
      PK.bake(g); }
    // STUDIO (CTA): coffee station with a steaming cup, ring light, podcast boom mic on the plinth, teal tile rug, lounge armchair
    { const g = W.STUDIO;
      const ct = PK.counter(g, -1.95, FL, -2.55, 0.3, { col: "#e9ecef", top: "#2b3a58" }); PK.coffeeMachine(ct, 0.15, ct.userData.top, -0.05, 0, { s: 0.62 }); PK.bookStack(ct, -0.4, ct.userData.top, 0.05, 0.4, { n: 3, seed: 9 });
      PK.ringLight(g, 1.98, FL, -2.75, -0.45);
      PK.boomMic(O.dcPhone, 1.62, FL + 1.1, 0.5, -0.8);
      PK.tileRug(g, 0.3, FL, -0.12, 0, { nx: 12, nz: 6, small: true, cols: ["#0f6f78", "#16323a", "#23897f", "#1b3a44"] });
      PK.armchair(g, -1.8, FL, -0.55, 0.7);
      PK.bake(g); }
  }

  // ---------------------------------------------------------------- cast
  const SK = () => K.SKIN;
  let SCN;
  function cast() {
    const f = (sp) => { const g = K.mfig(sp); FIGS.push(g); g.hands.forEach((h) => h.scale.setScalar(0.82)); capLegs(g); g.sitLift = 0.155; return g; };
    C.iger = f({ kind: "suit", top: "#1f2a44", shirt: "#f4f4f4", tie: "#2f5fa8", legs: "#1f2a44", hair: "#a3a3a3", hairStyle: "side", age: true, skin: SK().light, pocketSquare: "#f4f4f4", watch: true, brows: "#8a8a8a", eyes: "#3a4a5a" });
    C.chapek = f({ kind: "suit", top: "#3a3d44", shirt: "#f4f4f4", tie: "#7a1f2a", legs: "#3a3d44", glasses: true, hair: "#4a4038", hairStyle: "buzz", skin: SK().light, brows: "#6a5a4a" });
    C.peltz = f({ kind: "suit", top: "#2a2a30", shirt: "#e8eef6", tie: "#b81d24", legs: "#2a2a30", hair: "#cfcfcf", hairStyle: "slick", age: true, skin: SK().light, pocketSquare: "#f4f4f4", brows: "#d8d8d8" });
    C.b1 = f({ kind: "blazer", top: "#8a1f2f", under: "#f4f4f4", legs: "#2a2a30", hair: "#c9a26b", hairStyle: "bob", lips: "#b0303a", lashes: true, skin: SK().light, necklace: "#d8b44a" });
    C.b2 = f({ kind: "suit", top: "#4a4f57", shirt: "#f4f4f4", tie: "#c9a24a", legs: "#2a2a30", hair: "#2a1a10", hairStyle: "short", skin: SK().dark });
    C.b3 = f({ kind: "blouse", top: "#2f5f4a", legs: "#2a2a30", hair: "#1c1410", hairStyle: "ponytail", lips: "#a8434a", lashes: true, skin: SK().tan });
    C.b4 = f({ kind: "suit", top: "#4a3a30", shirt: "#f4efe6", tie: "#7a3a8a", legs: "#3a2e26", hair: "#8a3a1e", hairStyle: "curly", skin: SK().light });
    C.host = f({ kind: "blazer", top: "#0f6f78", under: "#f4f4f4", tie: "#40e0c8", pocketSquare: "#f4f4f4", legs: "#2b3a58", hair: "#3a2a1a", hairStyle: "short", skin: SK().medium, watch: true, brows: "#3a2a1a" });
    C.anchor = f({ kind: "blazer", top: "#c8102e", under: "#f4f4f4", legs: "#1b1b1b", hair: "#5a3a20", hairStyle: "long", lips: "#a8434a", lashes: true, skin: SK().medium });
    C.h = [
      f({ kind: "suit", top: "#33363b", shirt: "#f4f4f4", tie: "#f2cd37", legs: "#33363b", hair: "#2a1a10", hairStyle: "short", skin: SK().dark }),
      f({ kind: "blazer", top: "#2b4a7a", under: "#f4f4f4", legs: "#2a2a30", hair: "#c9a26b", hairStyle: "bun", lips: "#b0303a", lashes: true, skin: SK().light }),
      f({ kind: "suit", top: "#4a3b2c", shirt: "#f4f4f4", tie: "#2f5fa8", legs: "#4a3b2c", hair: "#6a6a6a", hairStyle: "side", glasses: true, skin: SK().tan }),
    ];
    const skins = [SK().light, SK().medium, SK().tan, SK().dark, SK().light, SK().medium];
    const crowdSpec = (n, seed) => K.randomSpecs(n, seed, ["sweater", "shirt", "jacket", "blazer", "suit"]).map((sp, i) => f(Object.assign(sp, { hairStyle: sp.hairStyle === "bald" ? "short" : sp.hairStyle, skin: skins[i % 6], hair: sp.hair && new THREE.Color(sp.hair).getHSL({}).l > 0.7 ? "#6a4a2a" : sp.hair })));
    C.aud = crowdSpec(18, 11);
    C.vis = crowdSpec(8, 23);
    C.staff = crowdSpec(3, 37);
    C.vis2 = crowdSpec(6, 51);
    // vote paddles for the audience
    O.paddles = C.aud.map((fg, i) => { const pg = new THREE.Group(); cyl(pg, 0.014, 0.014, 0.4, M("#8a5a2b"), 0, 0.12, 0, 6); rbx(pg, 0.32, 0.28, 0.03, i % 5 === 3 ? "#f2f2f2" : "#c8ff3e", 0, 0.42, 0, 0, 0.01); return K.attach(fg, "R", pg, 0, 0, 0.02); });
    // matte skin + plastic so hands/faces never glow
    Object.values(SK()).forEach((col) => { const m = K.plastic(col); m.clearcoat = 0.0; m.roughness = 0.62; m.specularIntensity = 0.3; });
    const HM = {};
    FIGS.forEach(rectGlasses);
    FIGS.forEach((fg) => {
      fg.headMat.clearcoat = 0.0; fg.headMat.roughness = 0.6; fg.headMat.specularIntensity = 0.22; fg.headMat.envMapIntensity = 0.5;
      fg.hands.forEach((h) => h.traverse((o) => { if (!o.isMesh || Array.isArray(o.material)) return; const key = o.material.uuid;
        if (!HM[key]) { const m = o.material.clone(); m.color.multiplyScalar(0.86); m.roughness = 0.68; m.clearcoat = 0; m.specularIntensity = 0.12; m.envMapIntensity = 0.3; HM[key] = m; } o.material = HM[key]; }));
      fg.root.traverse((o) => { if (!o.isMesh || o.material === fg.headMat) return; (Array.isArray(o.material) ? o.material : [o.material]).forEach((mm) => { if (!mm.isMeshPhysicalMaterial) return; mm.clearcoat = Math.min(mm.clearcoat || 0, 0.12); mm.roughness = Math.max(mm.roughness || 0, 0.5); mm.specularIntensity = Math.min(mm.specularIntensity == null ? 1 : mm.specularIntensity, 0.45); }); });
    });
    O.box = (() => { const b = new THREE.Group(); SCN.add(b); rbx(b, 0.56, 0.3, 0.34, "#b88a52", 0, 0, 0); for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) cyl(b, 0.04, 0.04, 0.03, M("#b88a52"), -0.165 + i * 0.11, 0.165, -0.055 + j * 0.11, 12); return b; })();
    K.attach(C.vis2[0], "R", PK.acc.icecream(), 0, 0, 0.02); K.attach(C.vis2[5], "R", PK.acc.camera(), 0, 0, 0.02); K.attach(C.vis2[1], "L", PK.acc.cup("#c8102e"), 0, 0, 0.02);
    O.caseH = K.attach(C.peltz, "L", O.briefcase, 0, 0.026, 0.169);
    O.megaH = K.attach(C.peltz, "R", O.megaphone, 0, 0, 0.03);
  }
  // printed-look rectangular glasses (thin frames) instead of the kit's round rings
  function rectGlasses(fg) {
    const S = 1.73 / 100, fm = M("#1b1b1b");
    fg.head.traverse((o) => { if (!o.isMesh || o.geometry.type !== "TorusGeometry") return; o.visible = false; const gp = o.parent;
      const fr = new THREE.Group(); fr.position.copy(o.position); gp.add(fr);
      for (const [w, h, x, y] of [[6.2, 0.55, 0, 2.0], [6.2, 0.55, 0, -2.0], [0.55, 4.5, -2.9, 0], [0.55, 4.5, 2.9, 0]]) { const b = new THREE.Mesh(new THREE.BoxGeometry(w * S, h * S, 0.5 * S), fm); b.position.set(x * S, y * S, 0.2 * S); fr.add(b); } });
  }
  const hideFigs = () => FIGS.forEach((f) => { f.root.visible = false; f.root.rotation.set(0, 0, 0); f.head.rotation.set(0, 0, 0); });
  const P = (f, o) => K.P(f, o);

  // ---------------------------------------------------------------- build
  function build(ctx) {
    THREE = ctx.THREE; SCN = ctx.scene;
    K = BRICK.setup(ctx); X = FXKIT.setup(ctx); LDRAW_KIT.setup(ctx, K, X);
    FL = K.FL;
    helpers(ctx);
    X.skyEnv("day", "day"); X.skyEnv("night", "night");
    X.skyEnv("golden", Object.assign({}, X.SKIES.golden, { sunDir: PARK_SUN })); X.skyEnv("dusk", DUSK);
    RB = X.ld("3062b", 0.0175) || new THREE.CylinderGeometry(0.17, 0.17, 0.42, 16); RB.translate(0, 0.42, 0);
    BR22 = X.ld("3941", 0.0175) || new THREE.CylinderGeometry(0.35, 0.35, 0.42, 20); BR22.translate(0, 0.42, 0);
    SLOPE = X.ld("3040", 0.0175);
    brickProps();
    buildStage(ctx); buildPark(ctx); buildOffice(ctx); buildBoard(ctx); buildNews(ctx);
    buildTrian(ctx); buildStreet(ctx); buildHall(ctx); buildStudio(ctx);
    PK = PROPS.setup(ctx, K, X); dressSets();
    cast();
    ctx.scene.traverse((o) => { if (o.isInstancedMesh) o.frustumCulled = false; });
    for (const sg of [O.ceoSign, O.marquee]) { const fm = sg.userData.front; fm.emissive = new THREE.Color("#ffffff"); fm.emissiveMap = fm.map; fm.emissiveIntensity = 0; fm.needsUpdate = true; }
    LOOK.dusk = Object.assign({}, LOOK.golden, { env: "dusk", bg: "#3a3458", fog: ["#6a5a7a", 40, 260], exposure: 1.0,
      sun: { color: "#ffb47a", intensity: 2.1, dir: [-0.7, 0.32, 0.62], shadow: 14 }, hemi: { sky: "#8a9ad8", ground: "#3a3030", intensity: 0.75 },
      rim: { color: "#9cc0ff", intensity: 2.0, dir: [0.3, 0.45, -0.85] }, fill: { color: "#ffd9c0", intensity: 0.45 } });
    LOOK.trian = Object.assign({}, LOOK.room, { env: "dusk", bg: "#2a2030", fog: ["#2a2230", 20, 70], exposure: 0.82, sun: { color: "#ffc98e", intensity: 1.5, dir: [0.35, 0.8, 0.5], shadow: 7 }, hemi: { sky: "#9aa6d8", ground: "#2a2018", intensity: 0.32 }, rim: { color: "#9cc0ff", intensity: 2.4, dir: [0.55, 0.6, -0.6] }, fill: { color: "#ffd2a8", intensity: 0.28 }, grade: { sat: 1.1, contrast: 1.12, lift: [0.0, 0.0, 0.02], gain: [1.03, 1.0, 0.97] } });
    LOOK.news = Object.assign({}, LOOK.room, { bg: "#0b1220", fog: ["#0e1626", 20, 70], sun: { color: "#ffe6c8", intensity: 2.4, dir: [0.3, 0.85, 0.6], shadow: 7 }, hemi: { sky: "#cfe0ff", ground: "#1c2230", intensity: 0.6 }, rim: { color: "#5fc8ff", intensity: 1.9, dir: [-0.5, 0.45, -0.75] } });
    LOOK.hall = Object.assign({}, LOOK.room, { bg: "#1a1010", fog: ["#22160f", 22, 70], sun: { color: "#ffd8a6", intensity: 2.4, dir: [0.25, 0.9, 0.5], shadow: 9 }, hemi: { sky: "#ffe6cc", ground: "#3a2020", intensity: 0.62 } });
  }
  function show(name) { for (const k in W) W[k].visible = k === name; }

  // ---------------------------------------------------------------- cue times
  const T = {};
  function times() {
    if (T.ok) return T;
    const a = (p, n) => { const v = F.at(p, n); return v == null ? 0 : v; };
    Object.assign(T, {
      ok: true, less: a("less than three"), back: a("he was back"), stakes: a("then an activist"), came: a("came for a seat"), three0: a("three moves kept"), zero1: a("in control"),
      feb20: a("february 2020"), names: a("iger hands"), chapekN: a("bob chapek"), newceo: a("the ceo job"), stays: a("iger stays on"), end21: a("until the end of 2021"),
      sunday: a("less than a year"), nov20: a("november 20 2022"), makes: a("makes its move"), ann: a("it announces"), out: a("chapek is out"), ret: a("returning as ceo"),
      how: a("so how does"), sw: a("a switch like that"), one: a("move number one"), known: a("proven replacement waiting"), repl: a("pushing out a ceo"), nobody: a("unless the replacement"),
      butAlt: a("has done the job"), hadRun: a("iger had"), jan: a("then in january 2023"), jan23: a("in january 2023"), threat: a("a new threat"), peltzN: a("nelson peltz"), launch: a("he launches a proxy"), seat: a("a seat on disney's board"),
      two: a("move number two"), otherArg: a("the other side's argument"), needs: a("an activist needs"), refuses: a("the company refuses"), noRef: a("no refusal"), feb23: a("february 2023"), beats: a("doesn't fight"), delivers: a("it delivers it"), restr: a("a restructuring"),
      cuts: a("about seven thousand"), savings: a("in cost savings"), deliv: a("peltz demanded cuts"), demanded: a("disney made them"), gone: a("his argument is gone"), drops: a("and peltz drops"), closed: a("case closed"), quite: a("not quite"),
      y24: a("in 2024 peltz comes"), comes: a("peltz comes back"), thisT: a("this time"), svote: a("shareholder vote"), three: a("move number three"), bigSh: a("big shareholders"),
      inProxy: a("in a proxy fight"), noise: a("headlines make noise"), counts: a("share counts decide"), winOver: a("win the biggest"), cant: a("nowhere to go"),
      apr: a("april 3 2024"), cast: a("cast their votes"), voteIn: a("they vote disney's"), whole: a("whole board"), reject: a("reject peltz"), zero2: a("never gets his seat"),
      m1: a("a replacement waiting"), m1cut: a("three moves a replacement"), m2: a("an argument removed"), m3: a("the big holders won"), risky: a("a gamble"), headl: a("headlines"),
      take: a("remove their reason"), ends: a("fight ends"), cta: a("someone coming"), pull: a("pull an iger"), practice: a("practice that move"), dc: a("deal calm"), store: a("app store"), dotcom: a("dot com"),
      vEnd: (F.cues && F.cues.voiceEnd) || F.total - 2.4, end: F.total,
    });
    T.sharpen = T.practice;
    return T;
  }
  const walkTo = (t, t0, t1, p0, p1) => { const k = clamp01((t - t0) / Math.max(0.01, t1 - t0)); return [mix(p0[0], p1[0], k), mix(p0[1], p1[1], k), k]; };
  const _v = () => new THREE.Vector3();

  // brand spelling in the captions + a one-line end title (DOM of the generated overlays; the TTS text stays "Deal Calm")
  let domDone = false;
  function domFix() {
    if (domDone || typeof document === "undefined") return;
    const caps = document.querySelectorAll(".cap-in"); if (!caps.length) return;
    caps.forEach((el) => { const tx = el.textContent.trim();
      if (/Deal\s+Calm/.test(tx)) el.innerHTML = el.innerHTML.replace(/Deal\s*(<span class="acc2?">)?\s*Calm(<\/span>)?/, '<span class="acc">DealCalm</span>');
      else if (/^deal\s+calm\s+dot$/i.test(tx) || /^com\.?$/i.test(tx)) el.innerHTML = '<span class="acc">dealcalm.com</span>';
      else if (/^on the App$/.test(tx)) el.innerHTML = 'on the App Store';
      else if (/^Store and at$/.test(tx)) el.innerHTML = 'and at'; });
    const st = document.createElement("style"); st.textContent = "#hud-end .hud-line:nth-child(2) > span { font-size: 54px; white-space: nowrap; }"; document.head.appendChild(st);
    domDone = true;
  }

  // ---------------------------------------------------------------- update
  function resetProps() {
    O.briefcase.visible = false; O.megaphone.visible = false; O.box.visible = false;
    O.paddles.forEach((p) => (p.visible = false));
  }
  function update(t, ctx) { const cam = route(t, ctx); if (PK) PK.tick(t); return cam; }
  function route(t, ctx) {
    const c = times(); domFix();
    hideFigs(); resetProps();
    if (t < c.stakes) return shotStage(t, c, "hook");
    if (t < c.feb20) return shotStage(t, c, "stakes");
    if (t < c.stays) return shotPark(t, c, "names");
    if (t < c.sunday) return shotOffice(t, c);
    if (t < c.one - 0.15) return shotBoard(t, c, t < c.ann ? "sunday" : t < c.how ? "ann" : "how");
    if (t < c.jan) return shotStage(t, c, t < c.repl ? "one" : t < c.butAlt ? "nobody" : "alt");
    if (t < c.peltzN) return shotNews(t, c, "proxy");
    if (t < c.feb23) return shotTrian(t, c, t < c.two ? "launch" : t < c.needs ? "two" : "needs");
    if (t < c.deliv) return shotNews(t, c, t < c.cuts ? "restr" : "cuts");
    if (t < c.y24) return shotTrian(t, c, t < c.drops ? "deliver" : "drops");
    if (t < c.three - 0.15) return shotStreet(t, c);
    if (t < c.m1cut) return shotHall(t, c, t < c.inProxy ? "three" : t < c.winOver ? "noise" : t < c.apr ? "wall" : t < c.voteIn ? "cast" : "result");
    if (t < c.cta) return shotPark(t, c, t < c.take ? "recap" : "take");
    return shotStudio(t, c);
  }
  // falling brick: lands at y at time t0 (+ fall), returns current y
  const drop = (t, t0, y, h) => { const k = clamp01((t - t0) / 0.32); return y + (h || 3.5) * (1 - k * k); };
  function puffAt(P2, t, t0, at, n, spd) { X.emitPuffs(P2, t, { t0, t1: t0 + 0.12, rate: n || 70, life: 0.9, seed: Math.round(t0 * 10), drag: 2.2, origin: () => at, vel: (tb, i, r) => [(r(1) - 0.5) * (spd || 2.4), 0.3 + r(2) * 0.9, (r(3) - 0.5) * (spd || 2.4)], size: [0.05, 0.12], gravity: -0.6 }); }

  // ---------------------------------------------------------------- STAGE
  function shotStage(t, c, mode) {
    show("STAGE"); setNight(false);
    O.moveB.forEach((b) => (b.visible = false)); O.crate.visible = false;
    O.stageBench.visible = false; O.ceoChair.rotation.y = 0; O.ceoChair.position.z = -0.6; O.ceoSign.userData.front.emissiveIntensity = 0;
    O.signFlip.rotation.set(0, 0, 0); O.signFlip.visible = true; O.haze.material.uniforms.uK.value = mode === "hook" || mode === "one" || mode === "nobody" ? 0.16 : 0.08;
    O.spotChair.intensity = 5; O.spotWing.intensity = 0; O.spotPeltz.intensity = 0;
    const seat = (f, o) => P(f, Object.assign({ x: 0, z: -0.56, y: FL + RISER_Y, ry: 0, sit: 1, aL: -0.35, aR: -0.35 }, o));
    const bench = (face, look, k) => [C.b1, C.b2, C.b3, C.b4].forEach((f, i) => P(f, { x: BENCH_X[i], z: -2.92, y: FL + BENCH_H, ry: 0, sit: 1, face: typeof face === "function" ? face(i) : face, look: typeof look === "function" ? look(i) : look,
      aL: -0.3 - 0.25 * Math.max(0, Math.sin(t * 2.1 + i * 1.7)) * (k || 0), aR: -0.3, nod: 0.06 * Math.sin(t * 1.6 + i) * (k || 0) }));
    const PF = O.stagePuff; PF.begin();
    let cam;
    if (mode === "hook") { // the chair spins: the heir in it becomes the man who picked him
      const sp = ss(0.3, 1.0, t), ang = sp * Math.PI * 2, sw = sp > 0.5;
      O.spotChair.intensity = 3.4; O.ceoChair.rotation.y = ang; O.signFlip.visible = t > 3.0; O.ceoChair.position.y = FL + RISER_Y + 0.03 * Math.max(0, 1 - Math.abs(t - c.back) / 0.15);
      const sx = Math.sin(ang) * 0.04, sz = -0.6 + Math.cos(ang) * 0.04;
      if (!sw) {
        seat(C.chapek, { x: sx, z: sz, ry: ang, face: t < c.less ? "smile" : "shock", gesture: t < c.less ? "present" : null, hy: 0.35 });
        P(C.iger, { x: -1.15, z: 0.25, ry: 0.75, face: "smile", gesture: t > 0.3 ? "present" : null, look: [0, -0.6] });
      } else seat(C.iger, { x: sx, z: sz, ry: ang, face: t > c.back - 0.1 ? "smirk" : "smile", gesture: t > c.back + 0.15 ? "present" : null, hy: 0.35 });
      dustRing(PF, t, c.back, [0, FL + RISER_Y + 0.1, -0.6], 1.0, 1.0, 16);
      const k = clamp01(t / Math.max(0.5, c.stakes));
      cam = { target: [-0.45, 1.95, -0.3], dist: mix(9.0, 8.2, F.E.o3(k)), az: 22, el: 5, fov: 34, look: L("stage", { dof: 0.5, focus: mix(8.4, 7.6, F.E.o3(k)) }) };
    } else if (mode === "stakes") { // the activist walks on; three move bricks land; the board holds every seat
      O.stageBench.visible = true;
      seat(C.iger, { face: t > c.zero1 ? "smile" : "neutral", look: [1.45, 1.35], hy: 0.2 });
      bench((i) => t > c.came ? (t > c.zero1 + 0.2 ? "smile" : "worried") : "neutral", [1.45, 1.35], 1);
      const w = walkTo(t, c.stakes, c.stakes + 1.7, [3.3, 1.5], [1.05, 1.35]);
      O.spotPeltz.intensity = 4.5 * ss(c.stakes, c.stakes + 0.4, t); O.spotPeltz.position.x = O.spotPeltz.target.position.x = w[0];
      const hit = t > c.zero1;
      P(C.peltz, { x: w[0], z: w[1], ry: w[2] < 1 ? -1.35 : -0.55, walk: w[2] < 1 ? K.walkPh(t, 9) : null, face: hit ? "frown" : "determined", gesture: hit ? "shrug" : null, aR: w[2] >= 1 && !hit ? -1.15 : 0, eR: -0.1, aRy: w[2] >= 1 && !hit ? 0.2 : 0, look: [0, -1.5] });
      O.crate.visible = true; O.moveB.forEach((b, i) => { const t0 = c.three0 + i * 0.22; b.visible = t > t0 - 0.02; b.scale.setScalar(0.62); b.position.set(-1.25, drop(t, t0, FL + 0.48 + i * 0.595, 4), 1.3); b.rotation.set(0, 0.2, 0); dustRing(PF, t, t0 + 0.32, [-1.25, FL + 0.48 + i * 0.595, 1.3], 1.0, 0.5, 12); });
      const k = clamp01((t - c.stakes) / (c.feb20 - c.stakes));
      cam = { target: [0.0, 1.85, -0.4], dist: mix(11.6, 10.9, k), az: 0, el: 8, fov: 34, look: L("stage", { dof: 0.32, focus: 11.4 }) };
    } else {
      // move one: a known alternative waiting in the wings (Iger), the heir in the chair (Chapek)
      O.stageBench.visible = mode !== "one";
      const bf = mode === "nobody" ? "worried" : mode === "alt" && t > c.hadRun ? "smile" : "neutral";
      if (O.stageBench.visible) bench(bf, mode === "alt" ? [-1.0, -0.2] : mode === "nobody" ? (i) => (t > c.nobody + i * 0.18 ? [0, -0.95] : [BENCH_X[i] * 2, 6]) : [0, -0.6], 0.6);
      if (mode === "one") {
        seat(C.chapek, { face: t > c.known ? "worried" : "neutral", look: [-1.9, 0], aR: -0.35 - 0.5 * ss(c.one + 1.6, c.one + 2.0, t) });
        O.signFlip.visible = t > c.one + 1.2;
        const on = ss(c.known - 0.2, c.known + 0.3, t); O.spotWing.intensity = 0.8 + 2.0 * on; O.spotChair.intensity = 4.5;
        P(C.iger, { x: -1.9, z: -0.2, ry: 0.5, face: on > 0.5 ? "smile" : "neutral", look: [0, -0.6], gesture: on > 0.5 ? "hips" : null, hy: on > 0.5 ? 0.25 : 0 });
        const k = ss(c.one + 1.25, c.one + 2.4, t);
        cam = { target: [-0.95, mix(2.75, 1.8, k), -0.4], dist: mix(10.0, 8.6, k), az: 8, el: 6, fov: 34, look: L("stage", { dof: 0.4, focus: mix(10.0, 8.6, k) }) };
      } else if (mode === "nobody") { // the heir is gone; the CEO sign flips to "?"; the empty chair drifts back
        const fk = ss(c.repl + 0.1, c.repl + 0.6, t); O.signFlip.rotation.y = Math.PI * fk;
        const nb = ss(c.nobody, c.nobody + 0.8, t), rk = Math.max(0, 1 - Math.abs(t - c.risky - 0.25) / 0.5); O.ceoChair.position.z = -0.6 - 0.35 * nb; O.ceoChair.rotation.y = 0.5 * nb + 0.25 * Math.sin((t - c.risky) * 9) * rk; O.signFlip.rotation.z = 0.12 * Math.sin((t - c.repl) * 3.2) * fk;
        O.spotChair.intensity = 4.5 + 1.8 * Math.sin(t * 7) * (t > c.nobody ? 1 : 0);
        const k = clamp01((t - c.repl) / (c.butAlt - c.repl));
        cam = { target: [0.2, 2.45, -1.5], dist: mix(7.8, 7.2, k), az: 6, el: 5, fov: 34, look: L("stage", { dof: 0.42, focus: 6.8 }) };
      } else { // alt: Iger walks to the chair; the sign flips back to CEO and lights up
        O.signFlip.rotation.y = Math.PI * (1 + ss(c.butAlt + 0.3, c.butAlt + 0.8, t));
        O.ceoChair.position.z = -0.95 + 0.35 * ss(c.hadRun, c.hadRun + 0.6, t); O.ceoChair.rotation.y = 0.5 * (1 - ss(c.hadRun, c.hadRun + 0.6, t));
        const w = walkTo(t, c.butAlt + 0.1, c.butAlt + 1.4, [-1.9, -0.2], [-0.95, -0.05]);
        O.spotWing.intensity = 2.4 * (1 - w[2]); O.spotWing.position.x = w[0]; O.spotWing.target.position.x = w[0];
        P(C.iger, { x: w[0], z: w[1], ry: w[2] < 1 ? 1.3 : 0.45, walk: w[2] < 1 ? K.walkPh(t, 9) : null, face: "smile", gesture: w[2] >= 1 && t > c.hadRun - 0.2 ? "present" : null, look: [0, 4] });
        O.ceoSign.userData.front.emissiveIntensity = 0.55 * ss(c.hadRun, c.hadRun + 0.4, t);
        const k = clamp01((t - c.butAlt) / (c.jan - c.butAlt));
        cam = { target: [mix(-0.6, -0.3, k), 2.3, -1.2], dist: mix(8.0, 7.4, k), az: 10, el: 5, fov: 34, look: L("stage", { dof: 0.42, focus: 7.4 }) };
      }
    }
    PF.end();
    return cam;
  }

  // ---------------------------------------------------------------- PARK
  let _fm, _fq, _fe, _fp, _fs;
  function fwBurst(D, age, at, seed) { // D: [instancedMesh per colour]
    if (!_fm) { _fm = new THREE.Matrix4(); _fq = new THREE.Quaternion(); _fe = new THREE.Euler(); _fp = new THREE.Vector3(); _fs = new THREE.Vector3(); }
    const life = 1.1;
    D.forEach((im, ci) => { if (age < 0 || age > life) { im.count = 0; return; } let k = 0;
      for (let j = 0; j < 36; j++) { const r = (q) => rnd(seed * 91 + ci * 37 + j * 7.3 + q * 1.7), th = r(1) * 6.283, ph = Math.acos(1 - 2 * r(2)), sp = 3.2 * (0.6 + r(3) * 0.5), dd = (1 - Math.exp(-1.6 * age)) / 1.6;
        _fp.set(at[0] + Math.sin(ph) * Math.cos(th) * sp * dd, at[1] + Math.cos(ph) * sp * dd - 0.9 * age * age, at[2] + Math.sin(ph) * Math.sin(th) * sp * dd * 0.6);
        const sc = age < 0.05 ? age / 0.05 : Math.max(0.01, 1 - Math.max(0, age - 0.5) / 0.6); _fs.setScalar(sc); _fe.set(r(4) * 6, r(5) * 6, 0); _fq.setFromEuler(_fe);
        im.setMatrixAt(k++, _fm.compose(_fp, _fq, _fs)); }
      im.count = k; im.instanceMatrix.needsUpdate = true; });
  }
  function shotPark(t, c, mode) {
    show("PARK"); const night = mode !== "names"; setNight(night);
    O.parkSkyG.visible = !night; O.parkSkyD.visible = night; O.parkClouds.visible = !night;
    X.tickBrickWater(O.moat, t);
    O.carousel.rotation.y = t * 0.45;
    O.towers.forEach((tw, i) => { tw.userData.pen.rotation.y = 0.25 * Math.sin(t * 2.2 + i); });
    O.balloons.forEach((b, i) => { b.rotation.z = 0.08 * Math.sin(t * 1.3 + i); b.rotation.x = 0.05 * Math.sin(t * 1.1 + i * 2); });
    O.parkBanner.visible = !night && t > c.chapekN - 0.1;
    if (!night) { const pk = clamp01((t - c.chapekN + 0.1) / 0.3); O.parkBanner.scale.set(1, Math.max(0.01, F.E.back(pk)), 1); } else O.parkBanner.scale.set(1, 1, 1);
    O.recap.visible = night; O.walker.visible = O.dog.visible = !night;
    // visitors stroll in the background; two pass close to camera (soft foreground)
    if (!night) C.vis.forEach((f, i) => { const fg = i >= 6, dir = i % 2 ? 1 : -1, sp = fg ? 0.7 : 0.55 + rnd(i) * 0.25, lane = fg ? 3.4 + (i - 6) * 0.5 : -4.6 - (i % 2) * 0.85, span = fg ? 16 : 22, x = ((((t * sp * dir + i * 3.7) % span) + span) % span) - span / 2;
      P(f, { x, z: lane, ry: dir * Math.PI / 2, walk: K.walkPh(t + i, 7), face: "smile" }); });
    const PF = O.parkPuff; PF.begin(); O.fwTrail.begin();
    const fwT = night ? [c.m1 - 0.75, c.m2 - 0.75, c.m3 - 0.75, c.ends - 0.6] : [-100, -100, -100, -100];
    const FWP = [[-2.4, 8.2, -11.4], [2.6, 8.5, -11.4], [0.2, 8.8, -11.6], [-1.0, 8.0, -11.4]];
    O.fireworks.forEach((D, i) => { const tl = fwT[i], up = 0.65, p1 = FWP[i], p0 = [p1[0] * 0.8, 5.4, p1[2]];
      const fa = t - tl - up; fwBurst(D, fa, p1, i); O.fwLights[i].position.copy(new THREE.Vector3(p1[0], p1[1], p1[2])); O.fwLights[i].intensity = fa > 0 && fa < 0.6 ? 2.5 * Math.exp(-fa * 5) : 0;
      X.emitPuffs(O.fwTrail, t, { t0: tl, t1: tl + up, rate: 60, life: 0.45, seed: i * 7 + 3, drag: 1.0, origin: (tb) => { const k = clamp01((tb - tl) / up), e = 1 - (1 - k) * (1 - k); return [mix(p0[0], p1[0], e), mix(p0[1], p1[1], e), mix(p0[2], p1[2], e)]; },
        vel: (tb, j, r) => [(r(1) - 0.5) * 0.3, -0.4, (r(2) - 0.5) * 0.3], size: [0.13, 0.04], gravity: -0.8 }); });
    O.parkLamps.forEach((l) => (l.intensity = night ? 1.4 : 3.0)); O.parkKey.intensity = night ? 2.1 : 0; O.gateGlow.visible = night; O.gateLight.intensity = night ? 3.0 : 0; O.recapSpot.intensity = night ? 3.5 : 0;
    let cam;
    if (mode === "names") {
      // the handoff: Iger passes a CEO brick to Chapek on "hands the CEO job"
      const hk = ss(c.feb20 + 0.35, c.chapekN, t);
      O.ceoBrick.position.set(mix(-0.38, 0.42, hk), FL + 0.86 + 0.28 * Math.sin(hk * Math.PI), mix(1.42, 1.45, hk)); O.ceoBrick.rotation.set(0, mix(0.5, -0.4, hk), 0.15 * Math.sin(hk * Math.PI * 2));
      P(C.iger, { x: -0.72, z: 1.0, ry: 0.55, face: "smile", gesture: hk < 0.6 ? "hold" : t > c.chapekN + 0.4 ? "present" : null, hy: 0.15 });
      P(C.chapek, { x: 0.78, z: 1.05, ry: -0.45, face: t > c.chapekN ? "grin" : "smile", gesture: hk > 0.5 && t < c.newceo + 0.6 ? "hold" : t > c.newceo + 0.6 && t < c.newceo + 1.8 ? "wave" : null, hy: -0.3 });
      C.vis2.forEach((f, i) => P(f, { x: [-2.3, -3.4, 2.45, 3.0, -1.1, 0.8][i], z: [-3.2, -3.6, -2.45, -3.8, -4.6, -5.0][i], ry: [0.9, 0.4, -0.7, -0.3, 0.2, -0.2][i], face: "smile", gesture: i === 2 ? "wave" : i === 4 ? "point" : null, hy: 0.3 * Math.sin(t * 1.3 + i), nod: 0.05 * Math.sin(t * 2 + i) }));
      const k = clamp01((t - c.feb20) / (c.stays - c.feb20));
      cam = { target: [0.0, 1.9, 1.0], dist: mix(7.8, 7.0, k), az: 6, el: -6, fov: 38, look: L("golden", { dof: 0.45, focus: mix(7.8, 7.0, k), sun: { color: "#ffc98a", intensity: 2.7, dir: PARK_SUN, shadow: 12 } }) };
    } else {
      // recap + takeaway at the castle by night: three move bricks stack on the plinth; the reason is pulled; the fight breaks
      const ts = [c.m1, c.m2, c.m3];
      const take = mode === "take";
      P(C.iger, { x: -1.0, z: 1.15, ry: 0.45, face: take ? (t > c.ends ? "grin" : "determined") : t > c.m3 ? "grin" : "smile", look: [0.6, 1.25],
        gesture: take ? (t < c.take + 0.6 ? "reach" : t > c.ends ? "present" : null) : t > c.m1 + 0.1 ? "point" : null, aRy: take ? 0 : -0.35 });
      O.parkMoveB.forEach((b, i) => { b.visible = !take && t > ts[i] - 0.02; b.position.set(0, drop(t, ts[i], FL + 0.7 + i * 0.806, 3), 0); b.rotation.set(0, -0.12, 0); if (!take) dustRing(PF, t, ts[i] + 0.32, [0.6, FL + 0.7 + i * 0.806, 1.25], 1.4, 0.7, 12); });
      const out = take ? ss(c.take + 0.15, c.take + 0.5, t) : 0, tum = take ? clamp01((t - c.take - 0.5) / 0.35) : 0;
      O.reasonB.visible = take; O.reasonB.position.set(1.25 * out + 0.35 * tum, FL + 0.7 - 0.7 * tum * tum, 0.1 * tum); O.reasonB.rotation.set(0, -0.12, -1.2 * tum);
      const fallK = clamp01((t - c.take - 0.38) / 0.28), broke = t > c.ends;
      O.fightB.visible = take && !broke; O.fightB.position.set(0, FL + 0.7 + 0.806 * (1 - fallK * fallK), 0); O.fightB.rotation.set(0, -0.12, 0.06 * fallK);
      O.fightLight.position.set(0.6, FL + 1.3, 1.6); O.fightLight.intensity = take && t > c.ends && t < c.ends + 0.6 ? 1.2 * Math.exp(-(t - c.ends) * 6) : 0;
      tickBurst(O.fightDeb, t, take ? c.ends : -100, [0.6, FL + 1.1, 1.25], { speed: 1.6, up: 2.2, gravity: -9, life: 4, floor: (x, z) => (Math.abs(x - 0.6) < 0.95 && Math.abs(z - 1.25) < 0.5 ? FL + 0.7 : FL) });
      if (take) { dustRing(PF, t, c.take + 0.75, [0.6, FL + 0.7, 1.25], 1.4, 0.7, 12); dustRing(PF, t, c.ends, [0.6, FL + 0.8, 1.25], 1.6, 0.9, 20); }
      const k = clamp01((t - c.m1) / (c.cta - c.m1));
      cam = { target: [-0.15, 2.5, 1.0], dist: mix(9.0, 8.4, k), az: -4, el: -7, fov: 38, look: L("dusk", { dof: 0.3, focus: 8.6, exposure: 0.7, bg: "#0a0d1e", fog: ["#121833", 12, 46],
        sun: { color: "#9fb8ff", intensity: 0.7, dir: [0.4, 0.7, -0.6], shadow: 12 }, hemi: { sky: "#33407a", ground: "#100c14", intensity: 0.22 }, fill: { color: "#ffd2a0", intensity: 0.18 },
        rim: { color: "#8fb0ff", intensity: 3.0, dir: [-0.55, 0.5, -0.7] }, bloom: 0.5, threshold: 2.2 }) };
    }
    if (!night) tickBurst(O.fightDeb, t, -100, [0, 0, 0], {});
    O.ceoBrick.visible = !night;
    PF.end(); O.fwTrail.end();
    return cam;
  }

  // ---------------------------------------------------------------- OFFICE (executive chairman until the end of 2021)
  function shotOffice(t, c) {
    show("OFFICE"); setNight(false);
    const yr = t > c.end21 + 0.5 ? 2021 : 2020;
    if (yr !== O.calY) { redraw(O.cal, (cc, Wd, H) => drawCal(cc, Wd, H, yr)); O.calY = yr; }
    const flip = 1 - Math.min(1, Math.abs(t - c.end21 - 0.5) / 0.12); O.cal.rotation.x = -0.6 * flip;
    O.offSteam.begin(); X.emitPuffs(O.offSteam, t, { rate: 5, life: 1.2, seed: 3, drag: 0.4, origin: (tb, i, r) => [0.9 + (r(7) - 0.5) * 0.05, FL + 0.97, -0.15 + (r(8) - 0.5) * 0.05], vel: (tb, i, r) => [(r(1) - 0.5) * 0.12 + 0.05 * Math.sin(tb * 3), 0.28 + r(2) * 0.08, (r(3) - 0.5) * 0.12], size: [0.018, 0.045] }); O.offSteam.end();
    const lv = ss(c.end21 + 1.1, c.sunday - 0.05, t);
    P(C.iger, { x: mix(0, 0.9, lv), z: mix(-1.2, -0.75, lv), ry: mix(0, 0.6, lv), sit: 1 - ss(c.end21 + 0.9, c.end21 + 1.3, t), walk: lv > 0.05 && lv < 0.98 ? K.walkPh(t, 8) : null, face: t > c.end21 ? "smile" : "neutral", aR: lv < 0.05 && t < c.end21 ? -0.8 : 0, aRy: lv < 0.05 && t < c.end21 ? 0.25 : 0, eR: lv < 0.05 && t < c.end21 ? -0.55 : -0.3, look: [-1.05, -3.0] });
    O.offChair.rotation.y = 0.4 * ss(c.end21 + 0.9, c.end21 + 1.4, t);
    const k = clamp01((t - c.stays) / (c.sunday - c.stays));
    return { target: [-0.2, 1.95, -1.4], dist: mix(6.4, 5.9, k), az: 8, el: 4, fov: 32, look: L("room", { dof: 0.45, focus: 6.0 }) };
  }

  // ---------------------------------------------------------------- BOARD (Sunday night)
  function shotBoard(t, c, mode) {
    show("BOARD"); setNight(true);
    const st = t < c.sunday + 0.45 ? -1 : t < c.ann + 0.2 ? 0 : t < c.ret ? 1 : 2;
    if (st !== O.annStage) { redraw(O.annScr, (cc, Wd, H) => drawAnn(cc, Wd, H, st)); O.annStage = st; }
    O.boardGlow.intensity = st > 0 ? 0.9 : 0.4;
    // Chapek sits behind CEO · CHAPEK; on "Chapek is out" he stands and walks off; Iger walks in, sits, and only then the plate flips
    const flipT = c.ret + 0.95, fl = clamp01((t - flipT) / 0.35), txt = t > flipT + 0.17 ? "CEO · IGER" : "CEO · CHAPEK";
    if (txt !== O.bpText) { const m = O.boardPlate.userData.mesh; m.material[4] = O.boardPlate.userData.mk(txt); O.bpText = txt; }
    O.boardPlate.rotation.x = Math.sin(fl * Math.PI) * 1.4;
    const B = [C.b1, C.b2, C.b3, C.b4], xs = [-1.9, -0.95, 0, 0.95], SCR = [2.25, -3.3], CX = 1.9;
    const turn = mode === "sunday" ? ss(c.makes - 0.2, c.makes + 0.4, t) : 1;
    O.folder.position.x = mix(-1.75, -0.45, ss(c.sunday + 0.8, c.sunday + 1.5, t)); O.folder.rotation.y = mix(0.3, -0.1, ss(c.sunday + 0.8, c.sunday + 1.5, t));
    O.boardPlate.position.z = -0.45 + (mode === "how" ? 0.3 * ss(c.how + 0.6, c.how + 1.0, t) : 0); O.boardPlate.position.x = 1.9 - (mode === "how" ? 0.25 * ss(c.how + 0.6, c.how + 1.0, t) : 0);
    // Iger
    const ie = mode === "sunday" ? 0 : clamp01((t - c.ret + 0.45) / 1.1), isit = mode === "how" ? 1 : ss(c.ret + 0.7, c.ret + 1.15, t);
    if (ie > 0) P(C.iger, { x: mix(4.6, CX, ie), z: mix(-1.85, -1.12, Math.max(0, ie * 2 - 1)), ry: ie < 1 ? -1.4 : mix(-0.6, 0, isit), sit: isit, walk: ie < 0.99 ? K.walkPh(t, 9) : null, face: "smile",
      aL: isit > 0.5 ? -0.35 : 0, aR: mode === "how" && t > c.how + 0.5 && t < c.how + 1.1 ? -0.9 : isit > 0.5 ? -0.35 : 0, eR: mode === "how" && t > c.how + 0.5 && t < c.how + 1.1 ? -0.5 : -0.3, hy: isit > 0.9 ? 0.15 : 0.5, face: mode === "how" && t > c.how + 1.0 ? "smirk" : "smile" });
    B.forEach((f, i) => {
      const sp = { x: xs[i], z: -1.15, ry: 0, sit: 1, aL: -0.35, aR: -0.35 };
      if (mode === "sunday") Object.assign(sp, { face: ["neutral", "worried", "determined", "neutral"][i], hy: mix([0.5, -0.4, 0.4, -0.5][i], 0.55, turn), gesture: i === 1 && turn < 0.5 ? "type" : i === 2 && turn < 0.5 ? "type" : null });
      else if (mode === "ann") Object.assign(sp, { face: st === 2 ? "smile" : "neutral", look: t > c.out && t < c.ret ? [CX + 1.5, -1.5] : t >= c.ret ? [CX, -1.1] : SCR });
      else Object.assign(sp, { face: ["worried", "determined", "smirk", "smile"][i], hy: [0.2, 0.6 * ss(c.how + 0.3, c.how + 0.7, t), -0.45, 0.6][i], gesture: i === 2 ? "think" : null });
      P(f, sp);
    });
    if (mode === "sunday") { const k = clamp01((t - c.sunday) / (c.ann - c.sunday)); return { target: [1.0, 1.8, -1.3], dist: mix(9.6, 8.9, k), az: -14, el: 8, fov: 34, look: L("night", { dof: 0.38, focus: 9.0 }) }; }
    if (mode === "ann") { const k = clamp01((t - c.ann) / (c.how - c.ann)); return { target: [1.7, 1.75, -1.8], dist: mix(8.2, 7.6, k), az: -10, el: 4, fov: 34, look: L("night", { dof: 0.4, focus: 7.6 }) }; }
    const k = clamp01((t - c.how) / (c.one - c.how));
    return { target: [1.25, 1.5, -0.5], dist: mix(5.6, 5.2, k), az: -6, el: 11, fov: 34, look: L("night", { dof: 0.55, focus: 4.4 }) };
  }

  // ---------------------------------------------------------------- NEWS
  function stackShow(stk, n) { stk.children.forEach((ch, j) => { ch.visible = j < n; }); }
  function shotNews(t, c, mode) {
    show("NEWS"); setNight(false);
    O.ticker.offset.x = (t * 0.12) % 1;
    const wm = mode === "proxy" ? (t > c.jan + 0.45 ? "proxy" : "idle") : mode === "restr" ? (t > c.delivers ? "restr1" : "restr0") : (t > c.savings - 0.1 ? "restr3" : "restr2");
    if (wm !== O.newsMode) { redraw(O.newsWall, (cc, Wd, H) => drawWall(cc, Wd, H, wm)); O.newsMode = wm; }
    // 7,000 job cuts: the red stack loses its bricks one by one (studded bricks tumble onto the riser, chips bounce); savings stack builds
    const nS = mode === "cuts" ? Math.min(7, Math.max(0, Math.floor((t - c.savings + 0.3) / 0.13) + 1)) : 0;
    stackShow(O.barSave, nS);
    const h = 24 * 0.0155;
    O.barCuts.children.forEach((ch, j) => { const base = ch.userData.p0 || (ch.userData.p0 = ch.position.clone()); ch.visible = true; ch.position.copy(base); ch.rotation.set(0, (j % 2) * 0.06, 0); ch.scale.setScalar(1);
      if (mode !== "cuts") return; const tk = c.cuts + 0.35 + (6 - j) * 0.16, dt = t - tk; if (dt <= 0) return;
      const dir = j % 2 ? 1 : -0.6, tl = Math.min(dt, 0.75), y = Math.max(-(base.y - h), 1.6 * tl - 4.9 * 1.6 * tl * tl);
      ch.position.set(base.x + 1.3 * tl * dir, base.y + y, base.z - 0.5 * tl); ch.rotation.set(-2.2 * tl, 0, -dir * 2.6 * tl);
      if (dt > 0.75) { ch.rotation.set(0, 0.4 * j, 0); ch.position.y = h; } });
    tickBurst(O.cutChips, t, mode === "cuts" ? c.cuts + 0.7 : -100, [1.6, FL + 0.6, -1.3], { speed: 1.0, up: 1.6, gravity: -9, floor: FL + 0.24, life: 5 });
    O.barLblC.visible = mode === "cuts"; O.barLblS.visible = nS > 0;
    const pres = mode === "proxy" ? t > c.jan23 + 0.5 : mode === "restr" ? t > c.beats - 0.1 : t > c.cuts + 0.2;
    P(C.anchor, { x: -0.85, z: -1.36, y: FL + 0.24, ry: mode === "cuts" ? -0.35 : 0.15, sit: 1, face: mode === "proxy" && t > c.threat ? "determined" : "smile",
      gesture: pres ? (mode === "cuts" ? "point" : "present") : "type", aRy: mode === "cuts" ? -0.9 : 0, hy: mode === "cuts" ? -0.4 : pres ? -0.5 : 0.15, nod: pres ? 0 : 0.08 * Math.sin(t * 2.3) });
    P(C.staff[0], { x: -2.55, z: 1.75, ry: Math.PI - 0.35, gesture: "hold", face: "neutral" });
    P(C.staff[1], { x: -3.4, z: -2.3, ry: 0.6, gesture: "write", face: "neutral", hy: 0.3 });
    if (mode === "proxy") { const k = ss(c.threat - 0.2, c.peltzN, t); return { target: [mix(-0.45, -0.1, k), mix(2.4, 2.55, k), mix(-1.6, -2.4, k)], dist: mix(7.6, 5.9, k), az: -4, el: 2, fov: 34, look: L("news", { dof: 0.45, focus: mix(7.0, 6.6, k) }) }; }
    if (mode === "restr") { const k = clamp01((t - c.feb23) / (c.cuts - c.feb23)); return { target: [-0.35, mix(2.5, 2.4, k), -2.0], dist: mix(7.4, 6.9, k), az: 4, el: 2, fov: 34, look: L("news", { dof: 0.42, focus: 6.4 }) }; }
    const k = clamp01((t - c.cuts) / (c.deliv - c.cuts));
    return { target: [2.15, 1.7, -1.1], dist: mix(6.6, 6.2, k), az: -8, el: 9, fov: 36, look: L("news", { dof: 0.45, focus: 6.0 }) };
  }

  // ---------------------------------------------------------------- TRIAN (activist office)
  function shotTrian(t, c, mode) {
    show("TRIAN"); setNight(true);
    O.trSteam.begin(); X.emitPuffs(O.trSteam, t, { rate: 4, life: 1.2, seed: 9, drag: 0.4, origin: (tb, i, r) => [0.2 + (r(7) - 0.5) * 0.04, FL + 0.97, -0.55], vel: (tb, i, r) => [(r(1) - 0.5) * 0.12, 0.28, (r(3) - 0.5) * 0.1], size: [0.018, 0.045] }); O.trSteam.end();
    const hi = t > c.seat - 0.1 || mode !== "launch";
    if (hi !== O.trHi) { redraw(O.trBoard, (cc, Wd, H) => drawSeats(cc, Wd, H, hi)); O.trHi = hi; }
    const deliver = mode === "deliver", drops = mode === "drops";
    // the demand sign: strike-through slides in, DONE stamp drops (squash), then the sign breaks into bricks and the easel topples
    const strikeK = 0;
    O.strike.visible = strikeK > 0.01; O.strike.scale.set(Math.max(0.01, strikeK), 1, 1); O.strike.position.x = -0.62 * (1 - strikeK);
    const sk = deliver ? clamp01((t - c.demanded + 0.12) / 0.12) : drops ? 1 : 0;
    O.stampG.visible = sk > 0; O.stampG.position.z = 0.14 + 0.7 * (1 - sk); const sq = deliver ? Math.max(0, 1 - Math.abs(t - c.demanded) / 0.08) : 0; O.stampG.scale.set(1 + 0.12 * sq, 1 - 0.1 * sq, 1);
    const gone = (deliver && t > c.gone) || drops;
    O.demand.visible = !gone;
    const topple = deliver ? ss(c.gone + 0.05, c.gone + 0.55, t) : drops ? 1 : 0; O.easel.rotation.x = -1.45 * topple * topple;
    const sp = O.easel.localToWorld(new THREE.Vector3(0, FL + 1.35, 0.1));
    tickBurst(O.demandDeb, t, deliver || drops ? c.gone : -100, [sp.x, sp.y, sp.z], { speed: 1.8, up: 2.0, gravity: -9, floor: FL, life: 8 });
    const PF = O.trPuff; PF.begin();
    if (deliver) { dustRing(PF, t, c.demanded, [sp.x, sp.y - 0.25, sp.z + 0.25], 1.0, 0.2, 10); dustRing(PF, t, c.gone, [sp.x, FL + 0.05, sp.z], 1.6, 1.2, 18); }
    // placard: pops up on "launches a proxy fight"; falls over when he drops the fight
    const pl = clamp01((t - c.peltzN - 0.35) / 0.3); O.placardF.scale.setScalar(1); O.placardF.visible = mode !== "launch" || pl > 0; O.placardF.position.y = mode === "launch" ? 2.5 * (1 - pl * pl) : 0;
    if (mode === "launch") dustRing(PF, t, c.peltzN + 0.65, [0.35, FL + 0.03, 0.55], 0.9, 0.5, 14);
    const fk = drops ? clamp01((t - c.drops - 0.05) / 0.5) : 0, bo = drops ? Math.max(0, Math.sin(clamp01((t - c.drops - 0.55) / 0.25) * Math.PI)) * 0.12 : 0; O.placardPivot.rotation.set(0, 0, 1.3 * fk * fk - bo);
    if (drops) dustRing(PF, t, c.drops + 0.55, [0.35 - 1.6, FL + 0.05, 0.55 - 0.4], 1.4, 0.5, 12);
    let cam;
    if (mode === "launch") {
      const st2 = ss(c.peltzN + 0.9, c.peltzN + 1.4, t);
      P(C.peltz, { x: 1.2, z: mix(-0.3, 0.15, st2), ry: -0.2, walk: st2 > 0.05 && st2 < 0.95 ? K.walkPh(t, 9) : null, face: "determined", gesture: t > c.launch + 0.2 ? "fist" : null, aR: t < c.peltzN + 0.7 ? -0.9 : undefined, aRy: t < c.peltzN + 0.7 ? -0.35 : 0, aRz: 0.15, hy: 0.25 });
      const k = clamp01((t - c.peltzN) / (c.two - c.peltzN));
      cam = { target: [0.95, 1.8, -0.5], dist: mix(7.0, 6.4, k), az: -6, el: 4, fov: 34, look: L("trian", { dof: 0.42, focus: 6.4 }) };
    } else if (mode === "two" || mode === "needs") {
      const pt = mode === "needs" && t > c.needs + 0.4;
      P(C.peltz, { x: mode === "needs" ? 1.3 : 1.55, z: 0.45, ry: mode === "needs" ? 0.15 : 0.5, face: t > c.noRef ? "frown" : "determined", gesture: pt ? "point" : null, aRy: pt ? -0.75 : 0, hy: pt ? 0.35 : 0.2 });
      if (mode === "two") { const k = ss(c.two + 1.25, c.two + 2.2, t); cam = { target: [mix(0.5, 1.3, k), mix(2.4, 1.9, k), -0.2], dist: mix(9.2, 7.4, k), az: 30, el: 5, fov: 34, look: L("trian", { dof: 0.38, focus: mix(9.0, 7.2, k) }) }; }
      else { const k = clamp01((t - c.needs) / (c.feb23 - c.needs)); O.demand.rotation.z = t > c.noRef ? 0.05 * Math.sin((t - c.noRef) * 18) * Math.max(0, 1 - (t - c.noRef) * 2) : 0; cam = { target: [2.1, 1.8, 0.1], dist: mix(6.4, 5.8, k), az: -10, el: 4, fov: 34, look: L("trian", { dof: 0.45, focus: 5.6 }) }; }
    } else if (deliver) {
      P(C.peltz, { x: 1.55, z: 0.45, ry: -0.15, face: t > c.gone ? "shock" : t > c.demanded ? "frown" : "neutral", gesture: t > c.gone + 0.4 ? "shrug" : null, hy: t > c.gone ? 0 : 0.35 });
      const k = clamp01((t - c.deliv) / (c.drops - c.deliv));
      cam = { target: [2.1, 1.75, 0.15], dist: mix(6.6, 6.0, k), az: 16, el: 4, fov: 34, look: L("trian", { dof: 0.42, focus: 5.8 }) };
    } else { // drops: the placard falls; "case closed? not quite" -> he looks up again
      const up = ss(c.quite - 0.1, c.quite + 0.3, t);
      P(C.peltz, { x: 1.35, z: 0.55, ry: mix(-0.35, 0.1, up), face: up > 0.5 ? "smirk" : "sad", aR: -0.1, eR: -0.25, nod: 0.25 * fk * (1 - up), hy: mix(-0.5, 0.15, up), gesture: up > 0.6 ? "fist" : null });
      const k = clamp01((t - c.drops) / (c.y24 - c.drops));
      cam = { target: [1.0, 1.6, 0.5], dist: mix(6.4, 5.6, k * k), az: -22, el: 6, fov: 34, look: L("trian", { dof: 0.45, focus: mix(6.0, 5.4, k * k) }) };
    }
    PF.end();
    return cam;
  }

  // ---------------------------------------------------------------- STREET (2024: he comes back)
  function shotStreet(t, c) {
    show("STREET"); setNight(true);
    O.briefcase.visible = true;
    const k = clamp01((t - c.y24) / (c.svote - 0.2 - c.y24)), pz = mix(-6.8, -1.6, k), walking = k < 1, look = ss(c.svote - 0.1, c.svote + 0.35, t);
    P(C.peltz, { x: 0.35, z: pz, ry: 0.15 + 0.35 * look, walk: walking ? K.walkPh(t, 8.5) : null, face: look > 0.5 ? "smirk" : "determined", aL: -0.1, hy: 0.75 * look, gesture: look > 0.6 ? "point" : null, aRy: look > 0.6 ? -1.3 : 0, aRz: look > 0.6 ? 0.6 : 0 });
    O.streetCars.forEach((o, i) => { const z = ((o.z0 - t * (5 + i)) % 60 + 60) % 60 - 40; o.c.position.z = z; });
    C.vis.slice(0, 3).forEach((f, i) => P(f, { x: -2.1 + i * 0.35, z: ((((-8 + i * 5 - t * 0.9 * (i % 2 ? 1 : -1)) % 16) + 16) % 16) - 26, ry: i % 2 ? Math.PI : 0, walk: K.walkPh(t + i, 7), face: "neutral" }));
    const lit = ss(c.svote - 0.1, c.svote + 0.25, t); O.marquee.userData.front.emissiveIntensity = 0.9 * lit; O.marquee.scale.setScalar(1 + 0.08 * Math.max(0, 1 - Math.abs(t - c.svote - 0.15) / 0.15));
    return { target: [0.45, 2.0, pz - 0.6], dist: 7.0, az: 4, el: 1, fov: 34, look: L("dusk", { dof: 0.4, focus: 6.4, sun: { color: "#ffb47a", intensity: 1.8, dir: [-0.7, 0.32, 0.62], shadow: 12, center: [0, 0, pz] }, rim: { color: "#9cc0ff", intensity: 1.6, dir: [0.3, 0.45, -0.85] } }) };
  }

  // ---------------------------------------------------------------- HALL (the vote)
  function shotHall(t, c, mode) {
    show("HALL"); setNight(true);
    const vk = mode === "result" ? mix(0.7, 1, clamp01((t - c.voteIn - 0.1) / 0.8)) : 0.7 * clamp01((t - c.three) / (c.voteIn - c.three)), vd = mode === "result" && t > c.whole - 0.05;
    const key = vd ? 999 : Math.round(vk * 120);
    if (key !== O.voteK) { redraw(O.voteScr, (cc, Wd, H) => drawVote(cc, Wd, H, vk, vd)); O.voteK = key; }
    O.voteScr.userData.mat.color.setScalar(mode === "three" && t < c.three + 1.2 ? 0.1 : 1.0);
    O.hallConf.forEach((D, i) => X.burst(D, t, mode === "result" ? c.whole + i * 0.3 : -100, [[-2.7, FL + 1.45, -3.95], [2.7, FL + 1.45, -3.95], [-2.7, FL + 1.45, -3.9]][i], { speed: 1.5, up: 1.1, gravity: -2.4, spin: 6, floor: FL + 0.5, life: 3.0, spread: 0.45 }));
    tickBurst(O.headlines, t, mode === "noise" ? c.headl - 0.05 : -100, [0.4, FL + 2.75, -5.9], { dir: [0.2, 0, 1.6], speed: 1.0, up: 1.4, gravity: -3.0, floor: FL, life: 6 });
    const board = [C.b1, C.b2, C.b3, C.iger, C.b4], bx2 = [-2.0, -1.0, 0, 1.0, 2.0];
    const standK = mode === "result" ? ss(c.whole - 0.1, c.whole + 0.4, t) : 0;
    board.forEach((f, i) => { const bp = { x: bx2[i], z: mix(-5.3, -5.0, standK), y: FL + 0.48, ry: 0, sit: 1 - standK, face: vd ? "grin" : mode === "cast" || mode === "result" ? "smile" : "neutral" };
      if (standK > 0.9) bp.gesture = "cheer"; else if (standK < 0.5) Object.assign(bp, { aL: -0.35, aR: -0.35 }); P(f, bp); });
    const big = mode === "noise" || mode === "wall" || mode === "three";
    O.audChairs.forEach((ch) => (ch.visible = !(mode === "noise" || mode === "wall")));
    // the share stacks: grow on "share counts decide", slide into a wall on "win over the biggest"
    const grow = mode === "noise" ? Math.round(mix(3, 8, ss(c.counts, c.counts + 0.9, t))) : 8;
    const slide = mode === "wall" ? ss(c.winOver + 0.2, c.winOver + 1.0, t) : 0;
    O.bigStacks.forEach((s, i) => { s.visible = big; stackShow(s, grow); s.position.set(mix([-1.55, -0.55, 0.45][i], [0.95, 1.4, 1.85][i], slide), FL, mix(-2.0, -2.45, slide)); });
    O.smallStacks.forEach((s) => (s.visible = false)); O.peltzStack.visible = big;
    if (big) {
      C.h.forEach((f, i) => P(f, { x: mix([-2.05, -1.05, -0.05][i], [-0.75, -0.05, 0.65][i], slide), z: mix(-1.45, -1.75, slide), ry: slide > 0.5 ? 0.4 : 0.15, walk: slide > 0.05 && slide < 0.95 ? K.walkPh(t, 8) : null, face: slide > 0.9 ? "smirk" : "neutral", gesture: slide > 0.98 ? "cross" : null }));
      // Peltz: megaphone on "headlines make noise", then marches at the wall and bounces off
      const mg = mode === "noise" && t > c.noise - 0.1;
      O.megaphone.visible = mg;
      // Peltz stays alone on the far side (by his small red stack); on "can't break through" he walks into the yellow wall and recoils
      let px = 2.95, pz = -1.0, walk = null, pry = -0.35;
      if (mode === "wall") { const go = ss(c.winOver + 1.1, c.cant + 0.05, t), bounce = ss(c.cant + 0.05, c.cant + 0.35, t); px = mix(2.95, 2.2, go) + 0.35 * bounce; pz = mix(-1.0, -2.0, go); walk = go > 0.02 && go < 0.98 ? K.walkPh(t, 9) : null; pry = go > 0.02 && bounce < 0.5 ? -1.1 : -0.45; }
      const pp = { x: px, z: pz, ry: pry, walk, face: mode === "wall" && t > c.cant ? "frown" : "determined" };
      if (mg) Object.assign(pp, { aR: -1.45, eR: -1.5, aRy: 0.55 }); else if (mode === "wall" && t > c.cant + 0.3) pp.gesture = "shrug";
      P(C.peltz, pp);
    }
    // audience (seated) for the wide and the vote; paddles up on "cast their votes"
    if (mode === "three" || mode === "cast" || mode === "result") {
      C.aud.forEach((f, i) => { if (big && i < 4) { if (mode === "three") O.audChairs[i].visible = false; return; } if ((mode === "result" && i >= 0) || (mode === "three")) { O.audChairs[i].visible = false; return; } const ch = O.audChairs[i]; const up = mode === "cast" ? ss(c.apr + 0.35 + (i % 6) * 0.07 + Math.floor(i / 6) * 0.12, c.apr + 0.7 + (i % 6) * 0.07 + Math.floor(i / 6) * 0.12, t) : mode === "result" ? 1 - ss(c.voteIn, c.voteIn + 0.5, t) : 0;
        O.paddles[i].visible = mode === "cast" || up > 0.02;
        P(f, { x: ch.position.x, z: ch.position.z + 0.04, ry: Math.PI, sit: 1, face: mode === "result" && t > c.whole ? "smile" : "neutral", aR: mix(-0.35, -2.7, up), eR: mix(-0.3, -0.15, up), aL: -0.35, hy: (rnd(i) - 0.5) * 0.4 }); });
    }
    if (mode === "three") { const k = ss(c.three + 1.2, c.three + 2.2, t); return { target: [0, mix(3.55, 2.3, k), -2.6], dist: mix(11.5, 10.6, k), az: 4, el: 13, fov: 34, look: L("hall", { dof: 0.3, focus: 11 }) }; }
    if (mode === "noise") { const k = clamp01((t - c.inProxy) / (c.winOver - c.inProxy)); return { target: [0.95, 1.9, -2.7], dist: mix(9.8, 9.2, k), az: -4, el: 4, fov: 38, look: L("hall", { dof: 0.36, focus: 9.8 }) }; }
    if (mode === "wall") { const k = clamp01((t - c.winOver) / (c.apr - c.winOver)); return { target: [1.35, 1.7, -2.3], dist: mix(7.6, 7.0, k), az: -14, el: 4, fov: 36, look: L("hall", { dof: 0.4, focus: 8.0 }) }; }
    if (mode === "cast") { const k = clamp01((t - c.apr) / (c.voteIn - c.apr)); return { target: [0, 1.75, 2.2], dist: mix(8.4, 7.6, k), az: 180, el: 9, fov: 32, look: L("hall", { dof: 0.42, focus: 7.8, sun: { color: "#ffe2b8", intensity: 2.5, dir: [0.25, 0.7, -0.65], shadow: 9 }, rim: { color: "#7fb4ff", intensity: 1.8, dir: [-0.3, 0.5, 0.8] } }) }; }
    const k = clamp01((t - c.voteIn) / (c.m1cut - c.voteIn));
    return { target: [0, 2.65, -4.6], dist: mix(10.6, 10.1, k), az: 0, el: 3, fov: 32, look: L("hall", { dof: 0.3, focus: 10.2 }) };
  }

  // ---------------------------------------------------------------- STUDIO (DealCalm CTA)
  function shotStudio(t, c) {
    show("STUDIO"); setNight(true);
    if (t > c.vEnd - 0.2) SKYMATS.forEach((m) => (m.emissiveIntensity = 0.35)); // calmer window behind the end title
    // one confetti burst from the cannon on the right plinth corner on "pull an Iger"; it fires back and up, away from the URL plates
    tickBurst(O.dcConf, t, -100, [0, 0, 0], {});
    const nb = t < c.practice + 0.35 ? 0 : t < c.practice + 0.8 ? 1 : t < c.practice + 1.25 ? 2 : 3; if (O.dcApp.n !== nb) { O.dcApp.n = nb; redraw(O.dcScreen, O.dcApp); }
    O.stPuff.begin();
    const lit = ss(c.practice - 0.2, c.practice + 0.3, t), hi = t > c.practice + 0.3 && t < c.dotcom;
    if (O.appHi !== hi) { O.appHi = hi; O.dcApp.hi = hi; redraw(O.dcScreen, O.dcApp); }
    O.dcScreen.userData.mat.color.setScalar(0.35 + 0.8 * lit); O.dcGlow.intensity = 0.2 + 0.45 * lit;
    // a generic DealCalm host (not a real person): points at the tactic stack on "pull an Iger", presents the phone on "practice it"
    const pose = t < c.pull ? { aR: -0.5, aRz: 0.6, eR: -0.4, aL: -0.2, eL: -0.3 } : t < c.practice ? { aL: -0.3, aLz: 0.35, eL: -0.2, aR: -0.3 } : t < c.store ? { aL: -0.15, aLz: 0.05, eL: -0.25, aR: -0.45, aRz: 0.4 } : { aR: -0.6, aRz: 0.6, eR: -0.3, aL: -0.25, aLz: 0.05, eL: -0.3 };
    const stand = ss(c.pull - 0.1, c.pull + 0.35, t);
    P(C.host, Object.assign({ x: 1.0, z: mix(-1.81, -1.3, stand), y: FL + 1.12, sit: 1 - stand, ry: t < c.pull ? -0.1 : t < c.practice ? -0.35 : -0.25, face: t > c.pull && t < c.pull + 1.2 ? "smirk" : t > c.dc - 0.3 ? "grin" : "smile", hy: t < c.pull ? 0 : t < c.practice ? -0.4 : -0.3 }, pose));
    O.ctaB.forEach((b, i) => { const tb = c.cta + 0.35 + i * 0.22; b.visible = t > tb - 0.02; const hop = i === 1 ? 0.1 * Math.max(0, Math.sin(clamp01((t - c.pull - 0.9) / 0.35) * Math.PI)) : 0;
      b.position.set(-0.9, drop(t, tb, FL + 1.124 + i * 0.3456, 1.4) + hop, -1.68); b.rotation.set(0, 0.2, 0); dustRing(O.stPuff, t, tb + 0.32, [-0.95, FL + 1.124 + i * 0.3456, 0.22], 0.6, 0.35, 10); });
    O.stPuff.end();
    const k = clamp01((t - c.cta) / (c.vEnd - c.cta)), push = ss(c.dc - 0.4, c.dc + 0.4, t) * (1 - ss(c.dotcom - 0.5, c.dotcom + 0.1, t));
    if (t < c.vEnd - 0.1) return { target: [mix(0.35, 0.25, push), mix(2.45, 2.2, push), -1.6], dist: mix(9.8, 9.4, k) - 0.9 * push, az: mix(-3, -1, k), el: 3, fov: 34, look: L("studio", { dof: 0.3, focus: 9.0 - push }) };
    const k2 = clamp01((t - c.vEnd) / 2.4);
    return { target: [0.35, 2.5, -1.6], dist: mix(10.0, 9.7, k2), az: -1, el: 3, fov: 34, look: L("studio", { dof: 0.25, focus: 9.6 }) };
  }

  // name chips: lower third above the subtitle band, killed at the cut
  const callouts = [
    { at: "iger hands", text: "BOB IGER", sub: "outgoing CEO", kind: "chip", screen: [250, 1290], until: "iger stays on", untilOffset: -0.1 },
    { at: "bob chapek", text: "BOB CHAPEK", sub: "new CEO", kind: "chip", screen: [800, 1290], until: "iger stays on", untilOffset: -0.1 },
    { at: "he launches a proxy", text: "NELSON PELTZ", sub: "Trian", kind: "chip", screen: [300, 1200], until: "move number two", untilOffset: -0.1 },
  ];
  window.SCENE = { labels: [], callouts, build, update };
})();
