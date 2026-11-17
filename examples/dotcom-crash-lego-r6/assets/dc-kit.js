/* ============================================================================
   DC-KIT (dotcom-crash-lego, project-local): set-building helpers + story props for the late-90s dot-com sets.
   Loaded in index.html after props-kit.js and before scene.js.
   DCKIT.setup(ctx, K, X, PK) -> D. Everything is brick-built (real LDraw parts through PK.brick / PK.face, or bevelled
   boxes with stud fields); every static prop mesh is made with PK.mesh so PK.bake(set) can instance it. No Math.random.
   Floors: top surface at K.FL (0.08). Walls: brick courses (instanced bevelled bricks with seams + studs on top).
   ============================================================================ */
(function () {
  const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  function setup(ctx, K, X, PK) {
    const THREE = ctx.THREE, FL = K.FL, D = { rnd };
    const M = (c, e) => K.plastic(c, e);
    const GLC = {};
    const glowM = (c, k) => { const key = c + "|" + (k == null ? 2 : k); return GLC[key] || (GLC[key] = new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k == null ? 2 : k), toneMapped: false })); };
    const tex = (w, h, draw) => K.canvasTex(w, h, draw);
    const grp = (p, x, y, z, ry) => { const g = new THREE.Group(); g.position.set(x || 0, y || 0, z || 0); g.rotation.y = ry || 0; (p || ctx.scene).add(g); return g; };
    const put = (p, geo, mat, x, y, z, ry) => { const m = new THREE.Mesh(geo, typeof mat === "string" ? M(mat) : mat); m.position.set(x || 0, y || 0, z || 0); if (ry) m.rotation.y = ry; m.castShadow = m.receiveShadow = true; p.add(m); return m; };
    const GB = {};
    const boxG = (w, h, d) => { const k = w + "," + h + "," + d; return GB[k] || (GB[k] = new THREE.BoxGeometry(w, h, d)); };
    const bx = (p, w, h, d, mat, x, y, z, ry) => put(p, boxG(w, h, d), mat, x, y, z, ry);
    const rbx = (p, w, h, d, mat, x, y, z, ry, r) => put(p, X.roundBox(w, h, d, r == null ? Math.min(0.03, w / 4, h / 4, d / 4) : r, 2), mat, x, y, z, ry);
    const cyl = (p, rt, rb, h, mat, x, y, z, n) => put(p, new THREE.CylinderGeometry(rt, rb, h, n || 20), mat, x, y, z);
    const noShadow = (m) => { m.castShadow = false; return m; };
    Object.assign(D, { M, glowM, tex, grp, put, bx, rbx, cyl, noShadow, boxG });

    // real-scale studs (pitch 0.346) as one InstancedMesh; skip(x, z) leaves gaps
    const SP = 0.346, studGeo = new THREE.CylinderGeometry(0.104, 0.104, 0.06, 16).translate(0, 0.03, 0);
    D.studs = (p, col, x0, z0, w, d, y, skip) => {
      const nx = Math.floor(w / SP + 1e-6), nz = Math.floor(d / SP + 1e-6), ox = x0 + (w - nx * SP) / 2, oz = z0 + (d - nz * SP) / 2, L = [];
      for (let a = 0; a < nx; a++) for (let b = 0; b < nz; b++) { const x = ox + (a + 0.5) * SP, z = oz + (b + 0.5) * SP; if (!skip || !skip(x, z)) L.push([x, z]); }
      const im = new THREE.InstancedMesh(studGeo, typeof col === "string" ? M(col) : col, Math.max(1, L.length)), mm = new THREE.Matrix4();
      L.forEach(([x, z], i) => im.setMatrixAt(i, mm.makeTranslation(x, y, z))); im.count = L.length; im.castShadow = im.receiveShadow = true; im.frustumCulled = false; p.add(im); return im;
    };
    // floors (top at FL): tile grid with grout + bevel bump
    D.tileFloor = (p, w, d, a, b, tile, gloss, z0) => {
      const t = tex(512, 512, (g, Wd, H) => { const n = 4, s = Wd / n;
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const c = new THREE.Color((i + j) % 2 ? a : b).multiplyScalar(0.94 + rnd(i * 7 + j) * 0.1); g.fillStyle = "#" + c.getHexString(); g.fillRect(i * s, j * s, s, s); }
        g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 4; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, H); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(Wd, i * s); g.stroke(); } });
      const ext = 14; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(w / (tile * 4), (d + ext) / (tile * 4));
      return bx(p, w + 6, FL, d + ext, new THREE.MeshPhysicalMaterial({ map: t, bumpMap: t, bumpScale: 0.8, roughness: gloss ? 0.4 : 0.6, clearcoat: gloss ? 0.35 : 0.1, clearcoatRoughness: 0.25 }), 0, FL / 2, ext / 2 + (z0 || 0));
    };
    // carpet-tile floor (office): small squares in two tones, matte
    D.carpet = (p, w, d, a, b, z0) => {
      const t = tex(256, 256, (g, Wd, H) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { const c = new THREE.Color((i + j) % 2 ? a : b).multiplyScalar(0.92 + rnd(i * 9 + j * 3) * 0.14); g.fillStyle = "#" + c.getHexString(); g.fillRect(i * 32, j * 32, 32, 32); }
        g.strokeStyle = "rgba(0,0,0,0.18)"; g.lineWidth = 2; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, H); g.stroke(); g.beginPath(); g.moveTo(0, i * 32); g.lineTo(Wd, i * 32); g.stroke(); } });
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(w / 2.8, (d + 14) / 2.8);
      return bx(p, w + 6, FL, d + 14, new THREE.MeshPhysicalMaterial({ map: t, bumpMap: t, bumpScale: 0.5, roughness: 0.85, clearcoat: 0 }), 0, FL / 2, 7 + (z0 || 0));
    };
    // brick walls: instanced bevel bricks (0.48 x 0.24 courses, running bond) + studs on the top course
    D.fineWall = (g, cols, x0, z, n, rows, skip) => {
      const Lw = n * 0.8, Hw = rows * 0.48, bl = 0.48, bh = 0.24, nr = Math.round(Hw / bh), lists = cols.map(() => []);
      for (let r = 0; r < nr; r++) { let i = 0;
        for (let x = x0 - (r % 2 ? bl / 2 : 0); x < x0 + Lw - 1e-6; x += bl, i++) {
          const a = Math.max(x, x0), b = Math.min(x + bl, x0 + Lw); if (b - a < 0.05) continue;
          const orow = Math.floor((r + 0.5) * bh / 0.48), cx = (a + b) / 2;
          if (skip && (skip(orow, cx - x0) || skip(orow, a + 0.04 - x0) || skip(orow, b - 0.04 - x0))) continue;
          lists[(r * 7 + i * 3) % cols.length].push([cx, (r + 0.5) * bh, b - a]); } }
      const mm = new THREE.Matrix4(), q0 = new THREE.Quaternion(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), bg = X.roundBox(1, 1, 1, 0.04, 1);
      lists.forEach((L, ci) => { if (!L.length) return; const im = new THREE.InstancedMesh(bg, M(cols[ci], { roughness: 0.5, clearcoat: 0.15 }), L.length);
        L.forEach((bk, k) => im.setMatrixAt(k, mm.compose(v1.set(bk[0], bk[1], z), q0, v2.set(bk[2] - 0.014, bh - 0.014, 0.396)))); im.receiveShadow = true; im.frustumCulled = false; g.add(im); });
      if (!skip) { const back = new THREE.Mesh(boxG(Lw, Hw, 0.02), M("#2a2622")); back.position.set(x0 + Lw / 2, Hw / 2, z - 0.19); g.add(back); }
      D.studs(g, cols[0], x0, z - 0.2, Lw, 0.4, Hw);
      return g;
    };
    D.wallBack = (p, cols, x0, x1, z, rows, skip) => { const g = grp(p, 0, FL, 0); D.fineWall(g, cols, x0, z, Math.round((x1 - x0) / 0.8), rows, skip); g.traverse((o) => { if (o.isMesh) o.castShadow = false; }); return g; };
    D.wallSide = (p, cols, x, z0, z1, rows, side, skip) => { const g = grp(p, x, FL, 0, side < 0 ? Math.PI / 2 : -Math.PI / 2); const a = side < 0 ? -z1 : z0, b = side < 0 ? -z0 : z1;
      D.fineWall(g, cols, a, 0, Math.round((b - a) / 0.8), rows, skip); g.traverse((o) => { if (o.isMesh) o.castShadow = false; }); return g; };
    D.ceiling = (p, w, d, y, col, panels) => { const c = bx(p, w + 0.8, 0.12, d + 0.8, col || "#e8e4dc", 0, y + 0.06, 0); c.castShadow = false;
      (panels || []).forEach(([x, z, pw, pd]) => noShadow(bx(p, pw, 0.02, pd, glowM("#fff4dc", 1.6), x, y - 0.01, z))); return c; };
    D.windowFrame = (p0, x0, y0, z0, w, h, frameCol, nV, ry) => {
      const p = grp(p0, x0, y0, z0, ry || 0), fm = M(frameCol || "#2d3036"), trim = M(frameCol || "#3a3d42", { roughness: 0.5, clearcoat: 0.2 });
      bx(p, w + 1.3, 0.5, 0.46, trim, 0, h / 2 + 0.2, 0); bx(p, w + 1.3, 0.3, 0.52, trim, 0, -h / 2 - 0.1, 0);
      bx(p, 0.62, h + 0.7, 0.46, trim, -w / 2 - 0.31, 0, 0); bx(p, 0.62, h + 0.7, 0.46, trim, w / 2 + 0.31, 0, 0);
      bx(p, w + 0.16, 0.08, 0.3, fm, 0, h / 2 - 0.04, 0); bx(p, w + 0.16, 0.08, 0.3, fm, 0, -h / 2 + 0.04, 0);
      for (let i = 1; i < (nV || 3); i++) bx(p, 0.06, h, 0.12, fm, -w / 2 + (w * i) / (nV || 3), 0, 0);
      bx(p, w, 0.06, 0.12, fm, 0, h * 0.18, 0);
      const gl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshPhysicalMaterial({ color: "#d8ecff", roughness: 0.04, transparent: true, opacity: 0.1, clearcoat: 1, depthWrite: false })); gl.position.set(0, 0, 0.02); p.add(gl);
      return p;
    };
    D.SP = SP;
    window.DCKIT.parts.forEach((fn) => fn(D, ctx, K, X, PK));
    return D;
  }
  window.DCKIT = { setup, parts: [] };
})();

/* ---------------------------------------------------------------- part 2: lights, screens, signs, skyline, FX helpers */
DCKIT.parts.push(function (D, ctx, K, X, PK) {
  const THREE = ctx.THREE, FL = K.FL, { M, glowM, tex, grp, bx, rbx, cyl, noShadow, rnd } = D;
  D.pendant = (p, x, y, z, col, power) => { const g = grp(p, x, y, z);
    cyl(g, 0.01, 0.01, 0.7, M("#1b1b1b"), 0, -0.35, 0, 6);
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.3, 0.28, 24, 1, true), M("#23262b", { side: THREE.DoubleSide, metalness: 0.4 })); sh.position.y = -0.82; g.add(sh);
    const b = new THREE.Mesh(new THREE.CircleGeometry(0.27, 24), glowM(col || "#ffd9a0", 3)); b.rotation.x = Math.PI / 2; b.position.y = -0.95; g.add(b);
    const l = new THREE.PointLight(col || "#ffcf8a", power == null ? 2.2 : power, 7, 1.6); l.position.y = -1.1; g.add(l); return g; };
  D.fluoro = (p, x, y, z, len, power) => { const g = grp(p, x, y, z); rbx(g, len + 0.1, 0.08, 0.36, "#d8dbdf", 0, 0, 0); noShadow(bx(g, len, 0.02, 0.26, glowM("#f4f8ff", 1.5), 0, -0.05, 0));
    if (power) { const l = new THREE.PointLight("#eef4ff", power, 6, 1.6); l.position.y = -0.4; g.add(l); } return g; };
  D.deskLamp = (p, x, y, z, ry, shade) => { const g = grp(p, x, y, z, ry || 0), dk = M("#2b2d31", { metalness: 0.4, roughness: 0.4 });
    cyl(g, 0.09, 0.1, 0.03, dk, 0, 0.015, 0, 16); const arm = cyl(g, 0.012, 0.012, 0.36, dk, 0, 0.2, -0.02, 8); arm.rotation.x = 0.25;
    const sh = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.12, 18, 1, true), M(shade || "#2f6a4a", { side: THREE.DoubleSide })); sh.position.set(0, 0.38, 0.05); sh.rotation.x = -0.5; g.add(sh);
    const b = new THREE.Mesh(new THREE.CircleGeometry(0.075, 16), glowM("#ffe2a8", 2.4)); b.position.set(0, 0.34, 0.08); b.rotation.x = Math.PI / 2 + 0.5; g.add(b);
    const l = new THREE.PointLight("#ffcf8a", 0.9, 2.6, 1.8); l.position.set(0, 0.28, 0.12); g.add(l); return g; };
  D.floorLamp = (p, x, z, col, k) => { const g = grp(p, x, FL, z);
    cyl(g, 0.16, 0.18, 0.05, M("#1b1b1b"), 0, 0.03, 0); cyl(g, 0.025, 0.025, 1.5, M("#2b2b2b", { metalness: 0.6 }), 0, 0.78, 0, 8);
    noShadow(cyl(g, 0.17, 0.22, 0.3, glowM(col || "#ffe2b0", k || 1.2), 0, 1.6, 0, 24));
    const l = new THREE.PointLight(col || "#ffcf8a", 1.4, 5, 1.8); l.position.y = 1.5; g.add(l); return g; };
  D.spot = (p, x, y, z, col, power, dist) => { const g = grp(p, x, y, z);
    cyl(g, 0.16, 0.24, 0.42, M("#1c1d20", { metalness: 0.5, roughness: 0.4 }), 0, 0, 0, 16);
    const b = new THREE.Mesh(new THREE.CircleGeometry(0.21, 20), glowM(col || "#fff1d6", 4)); b.rotation.x = Math.PI / 2; b.position.y = -0.215; g.add(b);
    const l = new THREE.PointLight(col || "#ffe8cc", power == null ? 1.6 : power, dist || 9, 1.6); l.position.y = -0.5; g.add(l); g.userData.light = l; return g; };
  // canvas screen (bezel + emissive face); redraw(sc, draw) repaints it
  D.screen = (p, w, h, draw, x, y, z, ry, px, k, bezel) => { const g = grp(p, x, y, z, ry);
    if (bezel !== false) rbx(g, w + 0.1, h + 0.1, 0.08, M(bezel || "#121316", { roughness: 0.25, clearcoat: 0.8 }), 0, 0, -0.045, 0, 0.02);
    const pw = px || 512, ph = Math.round(pw * h / w);
    const mat = new THREE.MeshBasicMaterial({ map: tex(pw, ph, draw), toneMapped: false, color: new THREE.Color(1, 1, 1).multiplyScalar(k || 1.0) });
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); face.position.z = 0.003; g.add(face);
    g.userData.mat = mat; g.userData.px = [pw, ph]; g.userData.face = face; g.userData.draw = draw; return g; };
  D.redraw = (sc, draw) => { const [pw, ph] = sc.userData.px, c = sc.userData.mat.map.image.getContext("2d"); c.clearRect(0, 0, pw, ph); draw(c, pw, ph); sc.userData.mat.map.needsUpdate = true; };
  // brick sign: a bevelled plate (studs on top) with printed letters
  D.brickSign = (p, lines, bg, fg, w, h, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry);
    const front = M("#ffffff", { map: tex(1024, Math.round(1024 * h / w), (c, Wd, H) => { c.fillStyle = bg; c.fillRect(0, 0, Wd, H); c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle";
      const fs = Math.round(Math.min(H * 0.62 / lines.length, Wd * 1.18 / Math.max(...lines.map((l) => l.length)))); c.font = "900 " + fs + "px Arial Black, Arial, sans-serif";
      lines.forEach((l, i) => c.fillText(l, Wd / 2, H / 2 + (i - (lines.length - 1) / 2) * fs * 1.12));
      if (o.border) { c.strokeStyle = o.border; c.lineWidth = H * 0.06; c.strokeRect(H * 0.05, H * 0.05, Wd - H * 0.1, H - H * 0.1); } }), roughness: 0.45, clearcoat: 0.2 });
    if (o.glow != null) { front.emissive = new THREE.Color("#ffffff"); front.emissiveMap = front.map; front.emissiveIntensity = o.glow; }
    const pm = M(bg); const m = new THREE.Mesh(X.roundBox(w, h, 0.12, 0.03, 2), pm); m.castShadow = true; g.add(m);
    front.polygonOffset = true; front.polygonOffsetFactor = -2; front.polygonOffsetUnits = -4; const f = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.04, h - 0.04), front); f.position.z = 0.072; g.add(f);
    if (!o.noStuds) D.studs(g, pm, -w / 2, -0.06, w, 0.12 + 0.01, h / 2);
    g.userData.front = front; return g; };
  // a 2x4-style labelled brick (big readable metaphor brick), origin at bottom centre
  D.labelBrick = (p, text, col, fg, s) => { const g = grp(p); const b = grp(g); b.scale.setScalar(s || 1);
    rbx(b, 1.6, 0.96, 0.8, col, 0, 0.48, 0, 0, 0.04); D.studs(b, col, -0.8, -0.4, 1.6, 0.8, 0.96);
    D.brickSign(b, [text], col, fg || "#ffffff", 1.5, 0.6, 0, 0.48, 0.405, 0, { noStuds: true }); return g; };
  // brick-part burst: real LDraw parts, ballistic arc, one bounce, settle, shrink out late
  D.brickBurst = (p, n, colors, parts, scale) => { parts = parts || ["3004", "3005", "3023", "3024", "3069b", "3003"];
    const geos = parts.map((id) => X.ld(id, scale || 0.0173)).filter(Boolean), ms = [];
    for (let i = 0; i < n; i++) { const m = new THREE.Mesh(geos[i % geos.length], M(colors[i % colors.length], { roughness: 0.42, clearcoat: 0.2 })); m.castShadow = true; m.visible = false; p.add(m); ms.push(m); }
    return { ms }; };
  D.tickBurst = (B, t, t0, at, o) => { o = Object.assign({ speed: 2.2, up: 2.2, gravity: -9, floor: 0, life: 6, spread: 1, dir: null }, o || {});
    const age = t - t0, on = age >= 0 && age < o.life;
    B.ms.forEach((m, i) => { m.visible = on; if (!on) return;
      const r = (k) => rnd(i * 13.7 + k * 5.3 + t0 * 3.1), a = r(1) * Math.PI * 2, sp = o.speed * (0.35 + r(2) * 0.9);
      let vx = Math.cos(a) * sp * o.spread, vz = Math.sin(a) * sp * o.spread, vy = o.up * (0.5 + r(3)); if (o.dir) { vx += o.dir[0]; vy += o.dir[1]; vz += o.dir[2]; }
      const g = o.gravity, h0 = at[1] - o.floor, tHit = (-vy - Math.sqrt(Math.max(0, vy * vy - 2 * g * h0))) / g; let x, y, z, tt = age, spin = 1;
      if (age < tHit) { y = at[1] + vy * age + 0.5 * g * age * age; x = at[0] + vx * age; z = at[2] + vz * age; }
      else { const vb = Math.abs(vy + g * tHit) * 0.3, tb = age - tHit, tB = -2 * vb / g, k = Math.min(tb, tB); y = o.floor + Math.max(0, vb * k + 0.5 * g * k * k); const sl = Math.min(tb, tB + 0.2) * 0.35;
        x = at[0] + vx * (tHit + sl); z = at[2] + vz * (tHit + sl); tt = tHit + Math.min(tb, tB) * 0.5; spin = 0; }
      m.position.set(x, y, z); m.rotation.set(r(4) * 6 + tt * 8 * (r(5) - 0.5), r(6) * 6 + tt * 8 * (r(7) - 0.5), age < tHit ? r(8) * 6 + tt * 6 * (r(9) - 0.5) : 0);
      if (!spin) { m.rotation.x = 0; m.rotation.z = 0; }
      m.scale.setScalar(age > o.life - 0.5 ? Math.max(0.01, (o.life - age) / 0.5) : 1); }); };
  // LEGO confetti: 1x1 round plates (6141) as instanced meshes per colour, falling with flutter (pure function of t)
  D.confetti = (p, n, colors) => { const g = X.ld("6141", 0.0175) || new THREE.CylinderGeometry(0.17, 0.17, 0.14, 12); const per = Math.ceil(n / colors.length);
    const ims = colors.map((c) => { const im = new THREE.InstancedMesh(g, new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.35, clearcoat: 0.6 }), per); im.frustumCulled = false; im.castShadow = false; p.add(im); return im; });
    return { ims, per }; };
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
  D.tickConfetti = (C, t, t0, at, o) => { o = Object.assign({ w: 3, h: 3, d: 2, fall: 1.1, life: 5, floor: FL, scale: 0.9, burst: 0 }, o || {}); const age = t - t0, on = age >= 0;
    C.ims.forEach((im, ci) => { for (let j = 0; j < C.per; j++) { const i = j * C.ims.length + ci, r = (k) => rnd(i * 7.31 + k * 3.7 + 11);
      if (!on) { _m.makeScale(1e-4, 1e-4, 1e-4); im.setMatrixAt(j, _m); continue; }
      const st = r(1) * o.life * 0.7, a = age - st; let x, y, z;
      if (o.burst) { const tt0 = Math.max(0, age - r(1) * 0.15), vx = (r(2) - 0.5) * o.w * 1.6 + (o.vx || 0), vz = (r(3) - 0.5) * o.d + (o.vz || 0), vy = o.burst * (0.6 + r(4) * 0.6), G = 1.188, tl = (vy + Math.sqrt(vy * vy + 4 * G * Math.max(0, at[1] - o.floor))) / (2 * G), tt = Math.min(tt0, tl); x = at[0] + vx * tt; z = at[2] + vz * tt; y = Math.max(o.floor, at[1] + vy * tt - G * tt * tt); }
      else { const a2 = Math.max(0, a); x = at[0] + (r(2) - 0.5) * o.w + 0.15 * Math.sin(a2 * 3 + i); z = at[2] + (r(3) - 0.5) * o.d + 0.1 * Math.cos(a2 * 2.6 + i); y = a < 0 ? at[1] + o.h * 2 : Math.max(o.floor, at[1] + o.h - a2 * o.fall); }
      _e.set(r(5) * 6 + age * 3 * (r(6) - 0.5), r(7) * 6, r(8) * 6 + age * 2); _q.setFromEuler(_e); _s.setScalar(o.scale * (a < 0 && !o.burst ? 1e-4 : 1)); _p.set(x, y, z); _m.compose(_p, _q, _s); im.setMatrixAt(j, _m); }
      im.instanceMatrix.needsUpdate = true; }); };
  // brick dust (small translucent round plates)
  D.dustPuffs = (g, col, op) => { const P2 = X.puffs(g, { max: 140, color: col || "#d9d1c4" }); P2.a.geometry = P2.a.geometry.clone().scale(1, 0.22, 1); for (const m of [P2.a, P2.b]) { m.material.transparent = true; m.material.opacity = op || 0.32; m.material.depthWrite = false; m.castShadow = false; } return P2; };
  D.dustRing = (P2, t, t0, at, w, d, n) => { n = n || 14; X.emitPuffs(P2, t, { t0, t1: t0 + 0.04, rate: n / 0.04, life: 0.5, seed: Math.round(t0 * 37), drag: 3.0,
    origin: (tb, i, r) => { const a = r(1) * Math.PI * 2; return [at[0] + Math.sin(a) * w * 0.55, at[1] + 0.03, at[2] + Math.cos(a) * d * 0.55]; },
    vel: (tb, i, r) => { const a = r(1) * Math.PI * 2, s = 0.8 + r(2) * 0.6; return [Math.sin(a) * s, 0.25 + r(3) * 0.3, Math.cos(a) * s]; }, size: [0.07, 0.03], gravity: -1.2 }); };
  // close hollow LDraw leg soles for seated figures
  D.capLegs = (fg) => { fg.legs.forEach((Lg) => { const lm = Lg.children.find((o) => o.isMesh); if (!lm) return;
    lm.geometry.computeBoundingBox(); const b = lm.geometry.boundingBox, mat = Array.isArray(lm.material) ? lm.material[0] : lm.material, w = b.max.x - b.min.x, d = b.max.z - b.min.z;
    const cap = new THREE.Mesh(new THREE.BoxGeometry(w - 0.012, 0.03, d - 0.012), mat); cap.position.set((b.min.x + b.max.x) / 2, b.min.y + 0.017, (b.min.z + b.max.z) / 2); cap.castShadow = true; Lg.add(cap); }); };
});


/* ---------------------------------------------------------------- part 3: brick towers (skylines), furniture */
DCKIT.parts.push(function (D, ctx, K, X, PK) {
  const THREE = ctx.THREE, FL = K.FL, { M, glowM, tex, grp, bx, rbx, cyl, noShadow, rnd } = D;
  // Brick-built towers: every floor = corner columns of bricks, window panes between mullion bricks, a studded plate ledge.
  // Instances are collected per material and flushed into InstancedMeshes per parent group (D.towersFlush(p)).
  const TW = new Map(), unitBox = X.roundBox(1, 1, 1, 0.03, 1), unitGlass = new THREE.BoxGeometry(1, 1, 1);
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _e = new THREE.Euler();
  const push = (p, geo, mat, x, y, z, sx, sy, sz, ry) => { const key = p.uuid; if (!TW.has(key)) TW.set(key, { p, lists: new Map() }); const L = TW.get(key).lists, k = geo.uuid + "|" + mat.uuid;
    if (!L.has(k)) L.set(k, { geo, mat, m: [] }); _e.set(0, ry || 0, 0); _q.setFromEuler(_e); _p.set(x, y, z); _s.set(sx, sy, sz); L.get(k).m.push(_m.compose(_p, _q, _s).clone()); };
  const WIN = { lit: [glowM("#ffd9a0", 1.25), glowM("#ffe8c0", 1.0), glowM("#bfe0ff", 0.9)], dark: [M("#33465e", { roughness: 0.28, clearcoat: 0.6, metalness: 0.1 }), M("#3d5470", { roughness: 0.28, clearcoat: 0.6, metalness: 0.1 })] };
  D.WIN = WIN;
  const studG = new THREE.CylinderGeometry(0.104, 0.104, 0.08, 10), tankG = new THREE.CylinderGeometry(0.42, 0.42, 0.8, 16), coneG = new THREE.ConeGeometry(0.48, 0.4, 16);
  const SHC = {}; const shade = (c) => SHC[c] || (SHC[c] = M("#" + new THREE.Color(c).multiplyScalar(0.86).getHexString(), { roughness: 0.55, clearcoat: 0.12 }));
  // o: {w, d, floors, col, trim, lit (0..1 share of lit windows), seed, crown: "spire"|"tank"|"flat"|"stepped", fh}
  D.tower = (p, x, z, o) => { o = Object.assign({ w: 3.2, d: 3.2, floors: 10, col: "#b9a089", trim: "#7a756e", lit: 0.5, seed: 1, crown: "flat", fh: 0.96, base: 0 }, o);
    const cm = M(o.col, { roughness: 0.5, clearcoat: 0.15 }), cm2 = shade(o.col), tm = M(o.trim, { roughness: 0.45, clearcoat: 0.2 }), fh = o.fh, y0 = o.base;
    for (let f = 0; f < o.floors; f++) { const yb = y0 + f * fh;
      // ledge plate (studs on the top floor only)
      push(p, unitBox, tm, x, yb + 0.07, z, o.w + 0.12, 0.14, o.d + 0.12);
      for (const [ax, len, off, ry] of [[1, o.w, o.d / 2, 0], [1, o.w, -o.d / 2, 0], [0, o.d, o.w / 2, Math.PI / 2], [0, o.d, -o.w / 2, Math.PI / 2]]) {
        const n = Math.max(1, Math.round(len / 0.8)), mw = len / n;
        for (let i = 0; i < n; i++) { const u = -len / 2 + (i + 0.5) * mw, px = ax ? x + u : x + off, pz = ax ? z + off : z + u;
          const lit = rnd(o.seed * 97 + f * 13 + i * 7 + (ax ? 0 : 50) + off * 3) < o.lit, gm = lit ? WIN.lit[(f + i) % 3] : WIN.dark[(f + i) % 2];
          push(p, unitGlass, gm, px, yb + 0.14 + (fh - 0.14) / 2, pz, ax ? mw - 0.16 : 0.06, fh - 0.3, ax ? 0.06 : mw - 0.16);
          // mullion: two stacked bricks (visible course seam); sill: a running-bond course of short bricks (seams read at distance)
          const mx = ax ? x - len / 2 + i * mw : x + off, mz = ax ? z + off : z - len / 2 + i * mw, hh = (fh - 0.14) / 2;
          for (let s = 0; s < 2; s++) push(p, unitBox, s ? cm : cm2, mx, yb + 0.14 + hh * (s + 0.5), mz, ax ? 0.16 : 0.2, hh - 0.02, ax ? 0.2 : 0.16);
          const nb = Math.max(1, Math.round(mw / 0.4)), bw = mw / nb;
          for (let s = 0; s < nb; s++) { const u2 = -mw / 2 + (s + 0.5) * bw; push(p, unitBox, (s + f) % 3 ? cm : cm2, ax ? px + u2 : px, yb + 0.2, ax ? pz : pz + u2, ax ? bw - 0.025 : 0.22, 0.12, ax ? 0.22 : bw - 0.025); }
        } }
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) for (let s = 0; s < 2; s++) { const hh = (fh - 0.14) / 2; push(p, unitBox, s ? cm2 : cm, x + sx * o.w / 2, yb + 0.14 + hh * (s + 0.5), z + sz * o.d / 2, 0.26, hh - 0.02, 0.26); }
    }
    const top = y0 + o.floors * fh; push(p, unitBox, tm, x, top + 0.08, z, o.w + 0.2, 0.16, o.d + 0.2);
    // roof studs (real pitch, scaled up for distant towers) + rooftop gear
    { const sp = 0.5, nx = Math.max(2, Math.floor(o.w / sp)), nz = Math.max(2, Math.floor(o.d / sp));
      for (let a = 0; a < nx; a++) for (let b = 0; b < nz; b++) push(p, studG, tm, x - (nx - 1) * sp / 2 + a * sp, top + 0.19, z - (nz - 1) * sp / 2 + b * sp, 1.4, 1, 1.4); }
    if (o.crown === "flat" || o.crown === "stepped") { push(p, unitBox, M("#9aa0a6"), x - o.w * 0.22, top + 0.4, z + o.d * 0.15, 0.6, 0.45, 0.45); push(p, unitBox, M("#2b2b2b"), x - o.w * 0.22, top + 0.64, z + o.d * 0.15, 0.4, 0.04, 0.3);
      push(p, unitBox, tm, x + o.w * 0.3, top + 1.2, z - o.d * 0.25, 0.05, 2.0, 0.05); push(p, studG, glowM("#ff3a2a", 2.2), x + o.w * 0.3, top + 2.2, z - o.d * 0.25, 1.2, 1.6, 1.2); }
    // interior block so the windows read against a dark core
    push(p, unitGlass, M("#1a1e26", { roughness: 0.9 }), x, y0 + o.floors * fh / 2, z, o.w - 0.2, o.floors * fh - 0.1, o.d - 0.2);
    if (o.crown === "spire") { push(p, unitBox, tm, x, top + 0.6, z, o.w * 0.5, 1.0, o.d * 0.5); push(p, unitBox, cm, x, top + 1.45, z, o.w * 0.25, 0.7, o.d * 0.25); push(p, unitBox, tm, x, top + 2.6, z, 0.1, 1.8, 0.1); }
    else if (o.crown === "tank") { // wooden water tank on legs (round drum + cone roof) and a stair housing
      for (const [lx, lz] of [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]]) push(p, unitBox, M("#3a3d42"), x + o.w * 0.2 + lx, top + 0.45, z + lz, 0.06, 0.6, 0.06);
      push(p, tankG, M("#7a4e2e", { roughness: 0.7 }), x + o.w * 0.2, top + 1.15, z, 1, 1, 1); push(p, coneG, M("#4a3020"), x + o.w * 0.2, top + 1.75, z, 1, 1, 1);
      push(p, unitBox, tm, x - o.w * 0.25, top + 0.35, z + 0.3, 0.9, 0.5, 0.6); }
    else if (o.crown === "stepped") { push(p, unitBox, cm, x, top + 0.5, z, o.w * 0.7, 0.84, o.d * 0.7); push(p, unitBox, tm, x, top + 1.1, z, o.w * 0.4, 0.4, o.d * 0.4); }
    return top; };
  D.towersFlush = (p, flat) => { const T = TW.get(p.uuid); if (!T) return; T.lists.forEach((L) => { const im = new THREE.InstancedMesh(L.geo, L.mat, L.m.length); L.m.forEach((mm, i) => im.setMatrixAt(i, mm));
    im.frustumCulled = false; im.castShadow = !flat && !L.mat.isMeshBasicMaterial; im.receiveShadow = !flat; p.add(im); }); TW.delete(p.uuid); };
  // a block of towers (window view / skyline): rows behind each other
  D.skyline = (p, o) => { o = Object.assign({ z: -18, x0: -20, x1: 20, n: 9, fMin: 6, fMax: 18, seed: 1, rows: 2, lit: 0.45, street: true }, o);
    const cols = ["#b9a089", "#8f9aa6", "#c9c2b4", "#7d6a5a", "#a7b3bf", "#d1b48c"], crowns = ["flat", "tank", "stepped", "spire", "flat"];
    for (let r = 0; r < o.rows; r++) for (let i = 0; i < o.n; i++) { const k = o.seed * 100 + r * 37 + i, w = 2.4 + rnd(k) * 2.4, d = 2.4 + rnd(k + 5) * 2;
      const x = o.x0 + (i + 0.5) * (o.x1 - o.x0) / o.n + (rnd(k + 7) - 0.5) * 1.5, z = o.z - r * 7 - rnd(k + 9) * 3;
      D.tower(p, x, z, { w, d, floors: Math.round(o.fMin + rnd(k + 3) * (o.fMax - o.fMin)), col: cols[(i + r) % cols.length], lit: o.lit, seed: k, crown: crowns[(i + r * 2) % crowns.length], base: -0.4 }); }
    if (o.street) noShadow(bx(p, (o.x1 - o.x0) + 40, 0.1, 40, M("#2c3036", { roughness: 0.9, clearcoat: 0 }), (o.x0 + o.x1) / 2, -0.45, o.z - 10));
    D.towersFlush(p, true); };

  // ---------------------------------------------------------------- furniture (brick-built)
  let RB = null; const rb = () => RB || (RB = (() => { const g = (X.ld("3062b", 0.0175) || new THREE.CylinderGeometry(0.17, 0.17, 0.42, 16)).clone(); g.computeBoundingBox(); g.translate(0, -g.boundingBox.min.y, 0); return g; })());
  D.RB = rb;
  const leg = (g, x, y, z, sx, sy, mat) => { const m = new THREE.Mesh(rb(), mat); m.scale.set(sx, sy, sx); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
  D.leg = leg;
  const TT = {};
  D.tileTop = (col, rep) => { const key = col + rep; if (TT[key]) return TT[key];
    const t = tex(256, 256, (c, Wd, H) => { c.fillStyle = col; c.fillRect(0, 0, Wd, H); c.strokeStyle = "rgba(0,0,0,0.32)"; c.lineWidth = 3; for (let i = 0; i <= 4; i++) { c.beginPath(); c.moveTo(i * 64, 0); c.lineTo(i * 64, H); c.stroke(); } c.beginPath(); c.moveTo(0, 128); c.lineTo(Wd, 128); c.stroke(); c.fillStyle = "rgba(255,255,255,0.06)"; c.fillRect(0, 0, Wd, 6); });
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep * 0.5); return (TT[key] = M("#ffffff", { map: t, bumpMap: t, bumpScale: 0.6, roughness: 0.5, clearcoat: 0.15 })); };
  // brick chair (1x2-brick stool feel), seat top 0.42 above y
  D.chair = (p, x, y, z, ry, col, noBack) => { const g = grp(p, x, y, z, ry), m = M(col || "#1b1b1b", { roughness: 0.4, clearcoat: 0.25 });
    for (const [a, b] of [[-0.3, -0.22], [0.3, -0.22], [-0.3, 0.22], [0.3, 0.22]]) leg(g, a, 0, b, 0.42, 0.78, m);
    rbx(g, 0.84, 0.1, 0.64, m, 0, 0.37, 0.02); if (!noBack) { rbx(g, 0.84, 0.56, 0.1, m, 0, 0.7, -0.27); D.studs(g, m, -0.42, -0.31, 0.84, 0.08, 0.98); } return g; };
  D.desk = (p, x, y, z, ry, w, d, col) => { const g = grp(p, x, y, z, ry); w = w || 2; d = d || 0.9; const m = M(col || "#8a5a2b", { roughness: 0.42, clearcoat: 0.25 });
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { leg(g, a * (w / 2 - 0.14), 0, b * (d / 2 - 0.14), 0.55, 0.9, m); leg(g, a * (w / 2 - 0.14), 0.378, b * (d / 2 - 0.14), 0.55, 0.9, m); }
    rbx(g, w, 0.06, d, [m, m, D.tileTop(col || "#8a5a2b", Math.max(1, Math.round(w / 0.7))), m, m, m], 0, 0.75, 0, 0, 0.012); g.userData.top = 0.78; return g; };
  D.plant = (p, x, z, s) => { const g = grp(p, x, FL, z); g.scale.setScalar(s || 1); const pot = M("#8a4a2a"); leg(g, 0, 0, 0, 1.6, 0.85, pot);
    const lf = [M("#2f7a30", { roughness: 0.4 }), M("#3f9a3a", { roughness: 0.4 }), M("#4fae44", { roughness: 0.4 })];
    [[0.0, 0.4, 1], [0.17, 0.48, 6], [0.11, 0.7, 5], [0.0, 0.9, 1]].forEach(([rad, yy, n], r) => { for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + r * 0.7; leg(g, Math.sin(a) * rad, yy + (i % 2) * 0.05, Math.cos(a) * rad, 0.62 - r * 0.05, 0.62 - r * 0.05, lf[(i + r) % 3]); } });
    return g; };
  D.lampPost = (p, x, z, h, light) => { const g = grp(p, x, 0, z); h = h || 3.6; const pm = M("#2d323a", { roughness: 0.45, clearcoat: 0.2 }), nB = Math.max(2, Math.round((h - 0.2) / 0.42));
    cyl(g, 0.22, 0.25, 0.1, pm, 0, 0.05, 0, 18); for (let k = 0; k < nB; k++) leg(g, 0, 0.1 + k * (h - 0.2) / nB, 0, 0.5, (h - 0.2) / (nB * 0.42), pm);
    cyl(g, 0.26, 0.18, 0.22, pm, 0, h + 0.05, 0, 14); noShadow(cyl(g, 0.2, 0.2, 0.06, glowM("#ffe2a8", 2.2), 0, h - 0.08, 0, 14));
    if (light) { const l = new THREE.PointLight("#ffcf8a", light === true ? 3.0 : light, 9, 1.6); l.position.y = h - 0.4; g.add(l); } return g; };
  D.tree = (p, x, z, s, leaf) => { const g = grp(p, x, 0, z); g.scale.setScalar(s || 1); const trunk = M("#6b4a2e"), lf = M(leaf || "#3f8f3a", { roughness: 0.4 }), lf2 = M("#2f7a30", { roughness: 0.4 });
    for (let k = 0; k < 3; k++) leg(g, 0, FL + k * 0.42, 0, 1.3, 1, trunk);
    [[0.55, 1.35, 6], [0.45, 1.75, 5], [0.3, 2.15, 4], [0.0, 2.5, 1]].forEach(([r, y, n], i) => { for (let j = 0; j < n; j++) { const a = j / n * Math.PI * 2 + i * 0.6; leg(g, Math.sin(a) * r, y + (j % 2) * 0.08, Math.cos(a) * r, 2.2, 1, (i + j) % 2 ? lf2 : lf); } });
    return g; };
});

/* ---------------------------------------------------------------- part 4: 1999 office / trading floor / exchange props (PK primitives, bakeable) */
DCKIT.parts.push(function (D, ctx, K, X, PK) {
  const THREE = ctx.THREE, { tex, rnd } = D, { mesh, brick, face, bar, box, rbox, cylG, sph, MET, GOLD, glow, trans, part, live, BH, PH, PT } = PK, M = PK.M;
  const g0 = (p, x, y, z, ry, s) => PK.grp(p, x, y, z, ry, s);
  const plane = (w, h) => new THREE.PlaneGeometry(w, h);
  const canvasMat = (w, h, draw, e) => K.plastic("#ffffff", Object.assign({ map: tex(w, h, draw), roughness: 0.5, clearcoat: 0.15 }, e || {}));
  const scrMat = (w, h, draw, k) => new THREE.MeshBasicMaterial({ map: tex(w, h, draw), toneMapped: false, color: new THREE.Color(1, 1, 1).multiplyScalar(k == null ? 1 : k) });
  D.canvasMat = canvasMat; D.scrMat = scrMat;
  const BEIGE = "#d9cfb4", BEIGE2 = "#c9bf9f";
  // beige CRT: a 2x2 brick body, a 2x2 slope as the tube housing, a dark bezel tile and a lit screen; draw = canvas painter
  D.crt = (p, x, y, z, ry, o) => { o = o || {}; const g = g0(p, x, y, z, ry, o.s || 0.78);
    brick(g, "3003", BEIGE, 0, 0, 0); brick(g, "3039", BEIGE2, 0, BH, -0.02, Math.PI); brick(g, "3023", BEIGE2, 0, 0, PT * 0.5 + 0.12, 0, [1, 0.6, 0.5]);
    mesh(g, rbox(0.62, 0.36, 0.04, 0.02), "#2b2a27", 0, 0.22, PT + 0.012);
    const mat = scrMat(160, 120, o.draw || ((c, W, H) => { c.fillStyle = "#0d3a2a"; c.fillRect(0, 0, W, H); }), o.k || 1.1);
    const sc = new THREE.Mesh(plane(0.54, 0.29), mat); sc.position.set(0, 0.22, PT + 0.046); g.add(sc);
    mesh(g, cylG(0.018, 0.018, 0.01, 8), glow("#40ff80", 2.2), 0.24, 0.035, PT + 0.012, Math.PI / 2);
    g.userData.screen = mat; return g; };
  // beige PC tower: three 1x2 bricks on end, floppy slot, power LED
  D.pcTower = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry, 0.85);
    for (let k = 0; k < 3; k++) brick(g, "3004", BEIGE, 0, k * BH, 0, Math.PI / 2); brick(g, "3069b", BEIGE2, 0, 3 * BH, 0, Math.PI / 2);
    mesh(g, box(0.2, 0.025, 0.01), "#2b2a27", 0, 0.95, PT / 2 + 0.006); mesh(g, box(0.2, 0.025, 0.01), "#2b2a27", 0, 0.82, PT / 2 + 0.006);
    mesh(g, cylG(0.016, 0.016, 0.01, 8), glow("#40ff80", 2.4), 0.09, 0.3, PT / 2 + 0.006, Math.PI / 2); return g; };
  D.keyboard = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry);
    const km = canvasMat(128, 48, (c, W, H) => { c.fillStyle = BEIGE; c.fillRect(0, 0, W, H); c.fillStyle = "#b7ad90"; for (let r = 0; r < 4; r++) for (let k = 0; k < 12; k++) c.fillRect(4 + k * 10, 4 + r * 10, 8, 8); });
    mesh(g, box(0.5, 0.03, 0.18), BEIGE2, 0, 0.015, 0); const t = new THREE.Mesh(plane(0.48, 0.16), km); t.rotation.x = -Math.PI / 2; t.position.y = 0.032; g.add(t);
    mesh(g, rbox(0.07, 0.03, 0.1, 0.015), BEIGE, 0.36, 0.015, 0.02); return g; };
  D.deskPhone = (p, x, y, z, ry, col) => { const g = g0(p, x, y, z, ry); col = col || "#2b2b2b";
    brick(g, "3023", col, 0, 0, 0, Math.PI / 2, [1, 1, 1]); brick(g, "3040", col, 0, PH, 0.02, 0, [0.9, 0.5, 0.9]);
    bar(g, [-0.15, 0.2, -0.04], [0.15, 0.2, -0.04], 0.03, col); mesh(g, sph(0.045, 10), col, -0.16, 0.2, -0.04); mesh(g, sph(0.045, 10), col, 0.16, 0.2, -0.04);
    for (let i = 0; i < 6; i++) mesh(g, box(0.03, 0.01, 0.03), "#d8d8d8", -0.05 + (i % 3) * 0.05, 0.155, 0.05 + Math.floor(i / 3) * 0.04); return g; };
  D.fax = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry);
    brick(g, "3003", "#cfd2d4", -PT / 2, 0, 0, 0, [1, 0.5, 1]); brick(g, "3003", "#cfd2d4", PT / 2, 0, 0, 0, [1, 0.5, 1]); brick(g, "3039", "#b8bbbe", 0, 0.21, -0.05, Math.PI, [1.6, 0.4, 0.8]);
    const ppr = g0(g, 0, 0.26, -0.15); mesh(ppr, box(0.34, 0.01, 0.4), "#f6f4ee", 0, 0, 0, -0.5); g.userData.paper = ppr; return g; };
  // shoe boxes (Bob's shoe stock): 1x2 bricks with a lid plate in a contrasting colour
  D.shoeBoxes = (p, x, y, z, ry, n) => { const g = g0(p, x, y, z, ry), cols = [["#c8102e", "#f4f2ec"], ["#f4f2ec", "#1b1b1b"], ["#2f5fa8", "#f2cd37"], ["#f28c28", "#1b1b1b"]];
    for (let i = 0; i < (n || 5); i++) { const [a, b] = cols[i % 4], yy = i * 0.32; brick(g, "3004", a, (rnd(i) - 0.5) * 0.06, yy, 0, Math.PI / 2, [1.1, 0.62, 1.4]); brick(g, "3023", b, (rnd(i) - 0.5) * 0.06, yy + 0.26, 0, Math.PI / 2, [1.15, 0.45, 1.45]); }
    return g; };
  // a shoe: 1x2 slope + sole plate (sneaker / loafer colours)
  const shoe = (p, x, y, z, ry, c, sole) => { const g = g0(p, x, y, z, ry, 0.42); brick(g, "3024", sole || "#f4f2ec", 0, 0, -0.18); brick(g, "3024", sole || "#f4f2ec", 0, 0, 0.18); brick(g, "3040", c, 0, PH, 0.0, 0); brick(g, "3005", c, 0, PH, -0.17); return g; };
  D.shoeRack = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry), wood = M("#6b4226");
    for (const sx of [-0.7, 0.7]) for (let k = 0; k < 6; k++) brick(g, "3062b", wood, sx, k * BH, 0);
    const sc = ["#c8102e", "#2f5fa8", "#1b1b1b", "#f4f2ec", "#3fa34d", "#7a4e2e", "#f2cd37", "#5a3a7a"];
    for (let s = 0; s < 3; s++) { const yy = 0.5 + s * 0.8; mesh(g, rbox(1.6, 0.06, 0.4, 0.01), "#8a5a32", 0, yy, 0); for (let i = 0; i < 3; i++) shoe(g, -0.45 + i * 0.45, yy + 0.03, 0.02, 0.3 - i * 0.25, sc[(s * 3 + i) % 8], i % 2 ? "#1b1b1b" : "#f4f2ec"); }
    return g; };
  // dot-matrix ticker made of 1x1 LED tiles (canvas mosaic), scrolls via texture offset (D.tickTicker)
  D.ticker = (p, x, y, z, ry, w, h, text, col) => { const g = g0(p, x, y, z, ry); const px = 20;
    const t = tex(2048, 64, (c, W, H) => { c.fillStyle = "#08090b"; c.fillRect(0, 0, W, H); c.font = "900 46px Arial Black, Arial"; c.textBaseline = "middle"; let xx = 8;
      text.forEach((s, i) => { c.fillStyle = s.c || col || "#f2cd37"; c.fillText(s.t, xx, H / 2 + 2); xx += c.measureText(s.t).width + 60; });
      const img = c.getImageData(0, 0, W, H); for (let yy = 0; yy < H; yy += 4) for (let xx2 = 0; xx2 < W; xx2 += 4) { const i = ((yy + 2) * W + xx2 + 2) * 4; const on = img.data[i] + img.data[i + 1] + img.data[i + 2] > 200; c.fillStyle = on ? `rgb(${img.data[i]},${img.data[i + 1]},${img.data[i + 2]})` : "#14161a"; c.fillRect(xx2, yy, 3, 3); } });
    t.wrapS = THREE.RepeatWrapping; t.repeat.set(w / (h * 32 / 1) * 1.0 * 1, 1); t.repeat.x = (w / h) * 64 / 2048;
    mesh(g, rbox(w + 0.14, h + 0.14, 0.12, 0.03), "#1b1b1b", 0, 0, -0.06); PK.studs(g, M("#1b1b1b"), -w / 2, -0.12, Math.floor(w / PT), 1, h / 2 + 0.07);
    const f = new THREE.Mesh(plane(w, h), new THREE.MeshBasicMaterial({ map: t, toneMapped: false, color: new THREE.Color(1.15, 1.15, 1.15) })); f.position.z = 0.014; g.add(f);
    g.userData.tex = t; g.userData.noBake = true; return g; };
  D.tickTicker = (tk, t, speed) => { tk.userData.tex.offset.x = (t * (speed || 0.03)) % 1; };
  // wall clock row (generic city initials)
  D.clockRow = (p, x, y, z, labels) => { const g = g0(p, x, y, z);
    labels.forEach((L, i) => { const cx = (i - (labels.length - 1) / 2) * 0.75; mesh(g, cylG(0.26, 0.26, 0.06, 28), "#1b1b1b", cx, 0, 0, Math.PI / 2); mesh(g, cylG(0.22, 0.22, 0.02, 28), "#f4f2ec", cx, 0, 0.035, Math.PI / 2);
      const hh = mesh(g, box(0.02, 0.12, 0.01), "#1b1b1b", cx, 0.05, 0.05); hh.rotation.z = -(i * 1.3 + 0.4); hh.position.set(cx + Math.sin(i * 1.3 + 0.4) * 0.05, Math.cos(i * 1.3 + 0.4) * 0.05, 0.05);
      const lb = new THREE.Mesh(plane(0.4, 0.12), canvasMat(128, 40, (c, W, H) => { c.fillStyle = "#1b1b1b"; c.fillRect(0, 0, W, H); c.fillStyle = "#f2cd37"; c.font = "900 28px Arial Black, Arial"; c.textAlign = "center"; c.fillText(L, W / 2, 30); })); lb.position.set(cx, -0.36, 0.02); g.add(lb); });
    return g; };
  // the ".COM" money jar: a translucent 2x2 round-brick drum filled with gold studs up to `fill` (set by D.jarFill)
  D.moneyJar = (p, x, y, z) => { const g = g0(p, x, y, z); g.userData.noBake = true; const tm = trans("#cfe8ff", 0.32);
    brick(g, "3941", "#1b1b1b", 0, 0, 0, 0, [1.6, 0.4, 1.6]); const drum = mesh(g, cylG(0.5, 0.5, 1.1, 32), tm, 0, 0.72, 0); drum.castShadow = false;
    g.userData.lid = brick(g, "4073", "#1b1b1b", 0, 1.27, 0, 0, [3.0, 0.8, 3.0]);
    const sg = X.ld("6141", 0.0175) || new THREE.CylinderGeometry(0.17, 0.17, 0.14, 12), im = new THREE.InstancedMesh(sg, GOLD(), 220); im.frustumCulled = false; g.add(im);
    const mm = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < 220; i++) { const a = rnd(i) * 6.283, r = Math.sqrt(rnd(i + 3)) * 0.34; e.set((rnd(i + 5) - 0.5) * 0.3, rnd(i + 7) * 6, (rnd(i + 9) - 0.5) * 0.3); q.setFromEuler(e); v.set(Math.sin(a) * r, 0.2 + Math.floor(i / 22) * 0.1 + rnd(i + 11) * 0.05, Math.cos(a) * r); im.setMatrixAt(i, mm.compose(v, q, s)); }
    im.count = 0; g.userData.coins = im;
    const lbl = new THREE.Mesh(plane(0.62, 0.24), canvasMat(256, 100, (c, W, H) => { c.fillStyle = "#c8ff3e"; c.fillRect(0, 0, W, H); c.fillStyle = "#111"; c.font = "900 70px Arial Black, Arial"; c.textAlign = "center"; c.fillText(".COM", W / 2, 76); }, { side: THREE.DoubleSide }));
    lbl.position.set(0, 1.02, 0.518); g.add(lbl); return g; };
  D.jarFill = (jar, k) => { jar.userData.coins.count = Math.round(220 * Math.max(0, Math.min(1, k))); };
  // brass exchange bell on a brick post, with a pull rope
  D.bell = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry), br = GOLD();
    brick(g, "3941", "#3b2414", 0, 0, 0); for (let k = 1; k < 4; k++) brick(g, "3062b", "#3b2414", 0, k * BH, 0);
    bar(g, [0, 4 * BH, 0], [0, 4 * BH + 0.25, 0], 0.03, br); const pts = []; for (let i = 0; i <= 10; i++) { const k = i / 10; pts.push(new THREE.Vector2(0.06 + 0.24 * Math.pow(k, 1.6), -k * 0.4)); }
    const bl = new THREE.Mesh(new THREE.LatheGeometry(pts, 28), br); bl.position.y = 4 * BH + 0.25; bl.castShadow = true; bl.material.side = THREE.DoubleSide;
    const sw = g0(g, 0, 4 * BH + 0.25, 0); sw.userData.noBake = true; bl.position.y = 0; sw.add(bl); g.userData.swing = sw;
    mesh(sw, sph(0.05, 10), br, 0, -0.42, 0); return g; };
  // lectern with a printed front plate
  D.lectern = (p, x, y, z, ry, word, col) => { const g = g0(p, x, y, z, ry), c = col || "#1d2b44";
    for (let k = 0; k < 3; k++) brick(g, "3003", c, 0, k * BH, 0, 0, [1.3, 1, 1]); brick(g, "3039", c, 0, 3 * BH, 0, Math.PI, [1.4, 0.6, 1.1]);
    if (word) { const f = new THREE.Mesh(plane(0.86, 0.3), canvasMat(256, 90, (cc, W, H) => { cc.fillStyle = c; cc.fillRect(0, 0, W, H); cc.fillStyle = "#f2cd37"; cc.font = "900 50px Arial Black, Arial"; cc.textAlign = "center"; cc.textBaseline = "middle"; cc.fillText(word, W / 2, H / 2 + 2); })); f.position.set(0, 0.7, PT * 1.3 / 2 + 0.2); g.add(f); }
    PK.studs(g, M(c), -0.45, -0.35, 2, 2, 3 * BH + 0.3); return g; };
});

/* ---------------------------------------------------------------- part 5: warehouse / street / stadium props */
DCKIT.parts.push(function (D, ctx, K, X, PK) {
  const THREE = ctx.THREE, { tex, rnd, canvasMat } = D, { mesh, brick, face, bar, box, rbox, cylG, sph, MET, GOLD, glow, trans, part, live, BH, PH, PT } = PK, M = PK.M;
  const g0 = (p, x, y, z, ry, s) => PK.grp(p, x, y, z, ry, s);
  const plane = (w, h) => new THREE.PlaneGeometry(w, h);
  const wheel = (g, x, y, z, r, w) => { const o = g0(g, x, y, z); mesh(o, cylG(r, r, w || 0.12, 20), "#1b1b1b", 0, 0, 0, Math.PI / 2); mesh(o, cylG(r * 0.55, r * 0.55, (w || 0.12) + 0.02, 14), MET(), 0, 0, 0, Math.PI / 2); return o; };
  D.wheel = wheel;
  // generic pet-food bag (no brand): a squashed 2x2 brick body, folded top plate, printed paw label
  let BAGM = null;
  const bagMat = () => BAGM || (BAGM = canvasMat(128, 128, (c, W, H) => { c.fillStyle = "#c98a3a"; c.fillRect(0, 0, W, H); c.fillStyle = "#f4ead2"; c.fillRect(14, 30, W - 28, 70); c.fillStyle = "#7a3a1a";
    c.beginPath(); c.arc(W / 2, 72, 14, 0, 7); c.fill(); for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(W / 2 - 21 + i * 14, 50 - (i % 3 ? 4 : 0), 6, 0, 7); c.fill(); } c.fillStyle = "#3a6a2a"; c.font = "900 18px Arial Black, Arial"; c.textAlign = "center"; c.fillText("PET FOOD", W / 2, 118); }));
  D.petBag = (p, x, y, z, ry, s) => { const g = g0(p, x, y, z, ry, s || 1); brick(g, "3001", "#c98a3a", 0, 0, 0, 0, [0.44, 1.5, 0.5]); for (const sd of [-1, 1]) brick(g, "3040", "#b87a32", sd * 0.155, 0.63, 0, sd > 0 ? -Math.PI / 2 : Math.PI / 2, [0.5, 0.42, 0.88]);
    const f = new THREE.Mesh(plane(0.5, 0.48), bagMat()); f.position.set(0, 0.34, 0.185); g.add(f); return g; };
  // wooden pallet of 1x4 tiles on 1x2 blocks, loaded with bags
  D.pallet = (p, x, y, z, ry, rows, cols) => { const g = g0(p, x, y, z, ry), wood = M("#a87a48", { roughness: 0.6, clearcoat: 0.05 });
    for (const sx of [-0.55, 0, 0.55]) brick(g, "3004", "#8a5f36", sx, 0, 0, Math.PI / 2, [1, 0.35, 1.5]);
    for (let i = 0; i < 5; i++) mesh(g, box(1.4, 0.05, 0.2), wood, 0, 0.17, -0.48 + i * 0.24);
    let n = 0; for (let r = 0; r < (rows || 2); r++) for (let c = 0; c < (cols || 2); c++) { const b = D.petBag(g, -0.34 + c * 0.68, 0.2 + 0.18 + r * 0.35, 0.39, (rnd(n++) - 0.5) * 0.08, 1); b.rotation.x = Math.PI / 2; b.position.z = 0.02; }
    return g; };
  // warehouse racking: orange uprights (round bricks) + blue beams, plates as shelves
  D.rack = (p, x, y, z, ry, levels, fill) => { const g = g0(p, x, y, z, ry), up = M("#e36a1b"), bm = M("#2f5fa8"); levels = levels || 3;
    for (const sx of [-1.2, 1.2]) for (const sz of [-0.35, 0.35]) for (let k = 0; k < levels * 3 + 1; k++) brick(g, "3062b", up, sx, k * BH, sz);
    for (let l = 1; l <= levels; l++) { const yy = l * 3 * BH * 0.95; for (const sz of [-0.35, 0.35]) mesh(g, box(2.4, 0.1, 0.08), bm, 0, yy, sz); mesh(g, box(2.4, 0.04, 0.75), "#9aa0a6", 0, yy + 0.06, 0);
      if (fill !== false) for (let i = 0; i < 3; i++) if (rnd(l * 7 + i + x) > 0.15) D.petBag(g, -0.75 + i * 0.75, yy + 0.08, 0, (rnd(i + l) - 0.5) * 0.3, 0.8); }
    return g; };
  D.forklift = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry), yl = M("#f2c21b", { roughness: 0.35, clearcoat: 0.6 });
    brick(g, "3001", yl, 0, 0.15, 0, Math.PI / 2, [1, 1, 0.9]); brick(g, "3003", "#1b1b1b", 0.0, 0.15 + BH, -0.35); brick(g, "3039", yl, 0, 0.15 + BH, 0.3, 0, [1, 0.8, 0.9]);
    for (const sx of [-0.4, 0.4]) { bar(g, [sx, 0.62, 0], [sx, 1.95, 0], 0.025, "#2b2b2b"); bar(g, [sx, 1.95, 0], [sx, 1.95, -0.6], 0.025, "#2b2b2b"); }
    mesh(g, box(0.9, 0.04, 0.7), "#2b2b2b", 0, 1.97, -0.3);
    const mast = g0(g, 0, 0, 0.9); mast.userData.noBake = true; for (const sx of [-0.3, 0.3]) { mesh(mast, box(0.08, 2.0, 0.08), "#3a3d42", sx, 1.1, 0); }
    const fk = g0(mast, 0, 0.12, 0.12); fk.userData.noBake = true; for (const sx of [-0.22, 0.22]) mesh(fk, box(0.1, 0.04, 0.8), MET(), sx, 0, 0.36); mesh(fk, box(0.7, 0.5, 0.05), "#3a3d42", 0, 0.25, 0);
    g.userData.forks = fk; for (const [wx, wz] of [[0.48, 0.55], [-0.48, 0.55], [0.48, -0.55], [-0.48, -0.55]]) wheel(g, wx, 0.2, wz, 0.2, 0.16);
    mesh(g, sph(0.05, 10), glow("#ff8a1a", 2.4), 0, 2.02, -0.55); return g; };
  // balance beam: pivot on a brick tower; pans hang from each end; set tilt with D.setScale(s, ang)
  D.scale = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry), dk = M("#3a3d42"), br = GOLD();
    brick(g, "3001", dk, 0, 0, 0); for (let k = 1; k < 3; k++) brick(g, "3003", dk, 0, k * BH, 0); brick(g, "3039", "#2b2d31", 0, 3 * BH, 0);
    const bm = g0(g, 0, 3 * BH + 0.4, 0); bm.userData.noBake = true; mesh(bm, box(2.6, 0.12, 0.16), br, 0, 0, 0); mesh(bm, sph(0.1, 12), br, 0, 0, 0.1);
    const pans = [-1.25, 1.25].map((sx) => { const pg = g0(g, sx, 3 * BH + 0.4, 0); pg.userData.noBake = true; for (const a of [0, 2.1, 4.2]) bar(pg, [0, 0, 0], [Math.sin(a) * 0.36, -0.9, Math.cos(a) * 0.36], 0.012, br); mesh(pg, cylG(0.46, 0.4, 0.08, 24), br, 0, -0.94, 0); return pg; });
    g.userData.beam = bm; g.userData.pans = pans; return g; };
  D.setScale = (s, ang) => { const bm = s.userData.beam; bm.rotation.z = ang; const y0 = bm.position.y; s.userData.pans.forEach((pg, i) => { const sx = i ? 1.25 : -1.25; pg.position.set(sx * Math.cos(ang), y0 + sx * Math.sin(ang), 0); }); };
  // price tag on a string: white tag, red price-down arrow + "LOSS" (generic)
  D.priceTag = (p, x, y, z, ry, txt) => { const g = g0(p, x, y, z, ry); bar(g, [0, 0, 0], [0, 0.35, 0], 0.006, "#d8d8d8");
    const tm = canvasMat(160, 96, (c, W, H) => { c.fillStyle = "#f4f2ec"; c.fillRect(0, 0, W, H); c.fillStyle = "#c8102e"; c.font = "900 44px Arial Black, Arial"; c.textAlign = "center"; c.fillText(txt || "LOSS", W / 2, 60); c.beginPath(); c.arc(16, H / 2, 7, 0, 7); c.fillStyle = "#555"; c.fill(); }, { side: THREE.DoubleSide });
    const t2 = new THREE.Mesh(plane(0.42, 0.25), tm); t2.position.set(0.2, -0.1, 0); t2.castShadow = true; g.add(t2); return g; };
  // corrugated roller door: 1x8-ish tiles stacked; open = 0..1 (rolls up into the drum)
  D.rollerDoor = (p, x, y, z, w, h, col) => { const g = g0(p, x, y, z); g.userData.noBake = true; const slats = [], c = M(col || "#8a9098", { roughness: 0.4, metalness: 0.3 });
    for (let k = 0; k < Math.round(h / 0.16); k++) slats.push(mesh(g, rbox(w, 0.15, 0.08, 0.02), c, 0, 0.08 + k * 0.16, 0));
    mesh(g, cylG(0.25, 0.25, w + 0.2, 20), "#5a5f66", 0, h + 0.25, -0.05, 0, 0, Math.PI / 2); g.userData.slats = slats; g.userData.h = h; return g; };
  D.setDoor = (d, open) => { const h = d.userData.h; d.userData.slats.forEach((s, k) => { const y = 0.08 + k * 0.16 + open * h; s.visible = y < h + 0.05; s.position.y = Math.min(y, h); }); };
  // conveyor with rollers; bags ride on it (D.tickConveyor)
  D.conveyor = (p, x, y, z, ry, len) => { const g = g0(p, x, y, z, ry); for (const sz of [-0.42, 0.42]) { mesh(g, box(len, 0.12, 0.06), "#3a3d42", 0, 0.62, sz); for (let i = 0; i <= Math.round(len / 1.2); i++) brick(g, "3062b", "#3a3d42", -len / 2 + i * 1.2, 0, sz, 0, [0.8, 1.4, 0.8]); }
    for (let i = 0; i < Math.round(len / 0.2); i++) mesh(g, cylG(0.05, 0.05, 0.84, 10), MET(), -len / 2 + 0.1 + i * 0.2, 0.62, 0, Math.PI / 2, 0, 0);
    const bags = g0(g, 0, 0, 0); bags.userData.noBake = true; const B = []; for (let i = 0; i < 4; i++) B.push(D.petBag(bags, 0, 0.67, 0, Math.PI / 2, 0.8)); g.userData.bags = B; g.userData.len = len; return g; };
  D.tickConveyor = (cv, t) => { const L = cv.userData.len; cv.userData.bags.forEach((b, i) => { const u = ((t * 0.45 + i / 4) % 1); b.position.x = -L / 2 + 0.3 + u * (L - 0.6); b.visible = true; }); };
  // two-wheel hand truck with a stack of bags
  D.handTruck = (p, x, y, z, ry, n) => { const g = g0(p, x, y, z, ry); for (const sx of [-0.22, 0.22]) bar(g, [sx, 0.1, 0], [sx, 1.35, -0.25], 0.025, "#c8102e"); bar(g, [-0.22, 1.35, -0.25], [0.22, 1.35, -0.25], 0.025, "#c8102e");
    mesh(g, box(0.5, 0.03, 0.3), MET(), 0, 0.05, 0.15); wheel(g, -0.3, 0.12, -0.05, 0.12, 0.08); wheel(g, 0.3, 0.12, -0.05, 0.12, 0.08);
    for (let i = 0; i < (n || 2); i++) { const b = D.petBag(g, 0, 0.08 + i * 0.37, 0.12, 0, 0.75); b.rotation.x = -Math.PI / 2 + 0.12; b.position.set(0, 0.25 + i * 0.3, 0.05); } return g; };
  D.mailbox = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry), c = M("#2f5fa8"); for (const sx of [-0.2, 0.2]) brick(g, "3005", "#1b1b1b", sx, 0, 0, 0, [0.6, 0.6, 0.6]);
    brick(g, "3003", c, 0, 0.25, 0); brick(g, "3003", c, 0, 0.25 + BH, 0); mesh(g, cylG(0.35, 0.35, 0.7, 20, true), c, 0, 0.25 + 2 * BH, 0, 0, 0, Math.PI / 2); mesh(g, box(0.36, 0.03, 0.02), "#1b1b1b", 0, 0.25 + 2 * BH, 0.36); return g; };
  D.bagPile = (p, x, y, z, n, seed) => { const g = g0(p, x, y, z); for (let i = 0; i < n; i++) { const r = (k) => rnd(i * 5.1 + k + (seed || 0) * 13), lay = Math.floor(i / 5);
    const b = D.petBag(g, (r(1) - 0.5) * (1.6 - lay * 0.4), lay * 0.34, (r(2) - 0.5) * (1.0 - lay * 0.2), r(3) * 3, 0.9); b.rotation.x = Math.PI / 2; b.position.y = lay * 0.34 + 0.18; } return g; };
  // ---- stadium
  D.bleachers = (p, x, y, z, w, rows, col) => { const g = g0(p, x, y, z); for (let r = 0; r < rows; r++) { mesh(g, rbox(w, 0.42 + r * 0.42, 0.9, 0.03), r % 2 ? "#4a4f57" : "#3a3f47", 0, (0.42 + r * 0.42) / 2, -r * 0.9);
      for (let i = 0; i < Math.round(w / 0.8); i++) brick(g, "3004", col[(r + i) % col.length], -w / 2 + 0.4 + i * 0.8, 0.42 + r * 0.42, -r * 0.9 + 0.12, 0, [1, 0.5, 1]); } return g; };
  D.floodTower = (p, x, y, z, ry, h) => { const g = g0(p, x, y, z, ry), st = MET("#8a9098"); h = h || 9;
    for (const sx of [-0.3, 0.3]) for (const sz of [-0.3, 0.3]) bar(g, [sx * 1.6, 0, sz * 1.6], [sx, h, sz], 0.05, st);
    for (let k = 1; k < 8; k++) { const yy = k * h / 8, s = 1.6 - 0.6 * k / 8; bar(g, [-0.3 * s, yy, -0.3 * s], [0.3 * s, yy, 0.3 * s], 0.03, st); bar(g, [0.3 * s, yy, -0.3 * s], [-0.3 * s, yy, 0.3 * s], 0.03, st); }
    mesh(g, box(2.2, 1.2, 0.2), "#2b2d31", 0, h + 0.5, 0); for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) mesh(g, cylG(0.2, 0.2, 0.06, 16), glow("#fff4dc", 3.2), -0.75 + i * 0.5, h + 0.25 + j * 0.5, 0.12, Math.PI / 2);
    return g; };
  D.goalpost = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry), yl = M("#f2cd37"); for (let k = 0; k < 7; k++) brick(g, "3062b", yl, 0, k * BH, 0); bar(g, [0, 3, 0], [0, 3, 0.6], 0.06, yl);
    bar(g, [-1.6, 3, 0.6], [1.6, 3, 0.6], 0.06, yl); for (const sx of [-1.6, 1.6]) bar(g, [sx, 3, 0.6], [sx, 6.2, 0.6], 0.05, yl); return g; };
});

/* ---------------------------------------------------------------- part 6: sock puppet, Fed, bust office, grocery lot, skyline props */
DCKIT.parts.push(function (D, ctx, K, X, PK) {
  const THREE = ctx.THREE, { tex, rnd, canvasMat, wheel } = D, { mesh, brick, face, bar, box, rbox, cylG, sph, MET, GOLD, glow, trans, part, live, BH, PH, PT } = PK, M = PK.M;
  const g0 = (p, x, y, z, ry, s) => PK.grp(p, x, y, z, ry, s);
  const plane = (w, h) => new THREE.PlaneGeometry(w, h);
  // generic brick sock puppet: a curved column of round bricks (grey sock, red heel band), a 2x2 round-brick head,
  // button eyes, a hinged red mouth (D.setPuppet(pp, open, tilt)). Origin at the cuff; height about s * 1.6.
  D.puppet = (p, x, y, z, ry, s) => { const g = g0(p, x, y, z, ry, s || 1); g.userData.noBake = true; const sock = M("#b9b5ad", { roughness: 0.8, clearcoat: 0.04 }), band = M("#c8102e", { roughness: 0.75, clearcoat: 0.04 });
    // cuff (two round bricks, red band), a short neck, then the toe of the sock bends forward as a long head
    brick(g, "3941", band, 0, 0, 0, 0, [0.66, 0.6, 0.66]); brick(g, "3941", sock, 0, BH * 0.6, 0, 0, [0.62, 1, 0.62]);
    const nk = g0(g, 0, BH * 1.6, 0); g.userData.neck = nk; brick(nk, "3941", sock, 0, 0, 0, 0, [0.6, 0.7, 0.6]);
    const hd = g0(nk, 0, BH * 0.7, 0.02); g.userData.head = hd; mesh(hd, sph(0.3, 24), sock, 0, 0.14, 0.12, 0, 0, 0, [0.92, 0.72, 1.45]);
    for (const sx of [-0.13, 0.13]) { const e = g0(hd, sx, 0.33, 0.2); e.rotation.x = -0.5; mesh(e, cylG(0.075, 0.075, 0.05, 20), "#f4f4f4", 0, 0, 0); mesh(e, cylG(0.04, 0.04, 0.06, 16), "#111111", 0, 0.01, 0.015); }
    mesh(hd, rbox(0.4, 0.05, 0.1, 0.02), M("#7a1018", { roughness: 0.85, clearcoat: 0 }), 0, 0.12, 0.54); // mouth line at the toe
    const jaw = g0(hd, 0, 0.06, 0.12); g.userData.jaw = jaw; mesh(jaw, rbox(0.42, 0.07, 0.44, 0.03), "#b9b5ad", 0, 0, 0.2); mesh(jaw, rbox(0.36, 0.02, 0.36, 0.01), M("#b8283a", { roughness: 0.85, clearcoat: 0 }), 0, 0.04, 0.22);
    for (let i = 0; i < 5; i++) mesh(g, box(0.03, 0.03, 0.02), "#7a766e", -0.14 + i * 0.07, BH * 1.2, 0.235); // cuff stitches
    return g; };
  D.setPuppet = (pp, open, tilt, turn) => { pp.userData.jaw.rotation.x = 0.5 * Math.max(0, open); pp.userData.head.rotation.x = -0.12 * Math.max(0, open) + (tilt || 0); pp.userData.neck.rotation.y = turn || 0; pp.userData.neck.rotation.z = 0.12 * (tilt || 0); };
  // marble column: round-brick drum stack with a plate capital and base
  D.column = (p, x, y, z, h, s) => { const g = g0(p, x, y, z, 0, s || 1), mb = M("#ece8df", { roughness: 0.35, clearcoat: 0.4 }), mb2 = M("#dcd6ca", { roughness: 0.35, clearcoat: 0.4 });
    brick(g, "3003", mb2, 0, 0, 0, 0, [1.4, 0.5, 1.4]); const n = Math.round(h / BH); for (let k = 0; k < n; k++) brick(g, "3941", k % 2 ? mb : mb2, 0, 0.21 + k * BH, 0);
    brick(g, "3003", mb2, 0, 0.21 + n * BH, 0, 0, [1.3, 0.35, 1.3]); brick(g, "3068b", mb, 0, 0.36 + n * BH, 0, 0, [1.6, 1, 1.6]); return g; };
  // flip-digit rate board: 6 slots that light up one by one (D.setRates(b, n))
  D.rateBoard = (p, x, y, z, w, h) => { const g = g0(p, x, y, z); g.userData.noBake = true;
    mesh(g, rbox(w + 0.2, h + 0.2, 0.14, 0.03), "#1b1b1b", 0, 0, -0.07); PK.studs(g, M("#1b1b1b"), -w / 2, -0.14, Math.floor(w / PT), 1, h / 2 + 0.1);
    const draw = (n) => (c, W, H) => { c.fillStyle = "#0b0d10"; c.fillRect(0, 0, W, H); c.fillStyle = "#f2cd37"; c.font = "900 " + Math.round(H * 0.17) + "px Arial Black, Arial"; c.textAlign = "center"; c.fillText("INTEREST RATE", W / 2, H * 0.2);
      for (let i = 0; i < 6; i++) { const cx = W * (0.1 + i * 0.16), on = i < n, hh = H * (0.18 + i * 0.07); c.fillStyle = on ? "#ff5a3a" : "#3a2a14"; c.fillRect(cx - W * 0.055, H * 0.92 - hh, W * 0.11, hh); c.strokeStyle = on ? "#ffd27a" : "#8a6a2a"; c.lineWidth = 4; c.strokeRect(cx - W * 0.055, H * 0.92 - hh, W * 0.11, hh);
        c.fillStyle = on ? "#ffffff" : "#8a6a2a"; c.font = "900 " + Math.round(H * 0.13) + "px Arial Black, Arial"; c.fillText("▲", cx, H * 0.92 - hh - H * 0.03); } };
    const sc = D.screen(g, w, h, draw(0), 0, 0, 0.01, 0, 512, 1.0, false); g.userData.sc = sc; g.userData.draw = draw; g.userData.n = 0; return g; };
  D.setRates = (b, n) => { if (b.userData.n === n) return; b.userData.n = n; D.redraw(b.userData.sc, b.userData.draw(n)); };
  // coin fountain: brick basin; gold 1x1 round plates arc from the spout while flow > 0 (D.tickFountain)
  D.coinFountain = (p, x, y, z, r) => { const g = g0(p, x, y, z), st = M("#dcd6ca", { roughness: 0.45, clearcoat: 0.2 }); r = r || 1.1; const n = Math.round(2 * Math.PI * r / 0.64);
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; brick(g, "3004", st, Math.sin(a) * r, 0, Math.cos(a) * r, a, [r * 2 * Math.PI / n / 0.7 + 0.02, 1, 1]); brick(g, "3069b", "#c9c2b4", Math.sin(a) * r, BH, Math.cos(a) * r, a, [r * 2 * Math.PI / n / 0.7 + 0.04, 1, 1.15]); }
    for (let k = 0; k < 4; k++) brick(g, "3941", st, 0, k * BH, 0, 0, [0.8, 1, 0.8]); mesh(g, cylG(0.45, 0.25, 0.14, 24), st, 0, 4 * BH + 0.07, 0);
    const pool = mesh(g, cylG(r - 0.12, r - 0.12, 0.04, 36), GOLD(), 0, BH - 0.1, 0); g.userData.pool = pool;
    const cg = (X.ld("6141", 0.0175) || new THREE.CylinderGeometry(0.17, 0.17, 0.14, 12)).clone().scale(0.55, 0.55, 0.55), im = new THREE.InstancedMesh(cg, GOLD(), 60); im.frustumCulled = false; g.add(im); g.userData.coins = im; g.userData.noBake = false; g.userData.r = r; return g; };
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
  D.tickFountain = (f, t, flowEnd) => { const im = f.userData.coins, top = 4 * BH + 0.2, r = f.userData.r; let n = 0;
    for (let i = 0; i < 60; i++) { const ph = (t * 0.8 + i / 60) % 1, born = t - ph / 0.8; if (born > flowEnd) continue; const a = i * 2.39996, rr = 0.1 + (r - 0.35) * ph;
      _v.set(Math.sin(a) * rr, top + 0.9 * 4 * ph * (1 - ph) - (top - BH + 0.1) * ph * ph, Math.cos(a) * rr); _e.set(t * 4 + i, i, t * 3); _q.setFromEuler(_e); _s.setScalar(1); im.setMatrixAt(n++, _m.compose(_v, _q, _s)); }
    im.count = n; im.instanceMatrix.needsUpdate = true; const dry = Math.max(0, Math.min(1, (t - flowEnd) / 1.2)); f.userData.pool.scale.set(1 - 0.85 * dry, 1, 1 - 0.85 * dry); };
  // ---- bust office
  D.beanBag = (p, x, y, z, ry, col) => { const g = g0(p, x, y, z, ry); mesh(g, sph(0.55, 20), M(col || "#c8102e", { roughness: 0.55, clearcoat: 0.1 }), 0, 0.3, 0, 0, 0, 0, [1, 0.55, 1]); mesh(g, sph(0.4, 18), M(col || "#c8102e", { roughness: 0.55, clearcoat: 0.1 }), 0, 0.55, -0.22, 0, 0, 0, [1, 0.7, 0.6]);
    PK.studs(g, M(col || "#c8102e"), -0.17, -0.17, 1, 1, 0.58); return g; };
  D.kickScooter = (p, x, y, z, ry, lean) => { const g = g0(p, x, y, z, ry); const tilt = g0(g, 0, 0, 0); tilt.rotation.x = lean || 0; mesh(tilt, rbox(0.75, 0.04, 0.14, 0.015), "#c3c8ce", 0, 0.08, 0); wheel(tilt, 0.38, 0.06, 0, 0.06, 0.05); wheel(tilt, -0.38, 0.06, 0, 0.06, 0.05);
    bar(tilt, [0.38, 0.08, 0], [0.32, 0.95, 0], 0.02, "#c3c8ce"); bar(tilt, [0.32, 0.95, -0.18], [0.32, 0.95, 0.18], 0.018, "#1b1b1b"); return g; };
  D.foosball = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry), wd = M("#5c3a1e");
    for (const sx of [-0.6, 0.6]) for (const sz of [-0.35, 0.35]) brick(g, "3062b", wd, sx, 0, sz, 0, [0.8, 1.6, 0.8]); mesh(g, rbox(1.5, 0.3, 0.9, 0.03), wd, 0, 0.82, 0); mesh(g, box(1.36, 0.02, 0.76), "#2f8a3a", 0, 0.98, 0);
    for (let i = 0; i < 4; i++) { const xx = -0.5 + i * 0.33; bar(g, [xx, 0.92, -0.62], [xx, 0.92, 0.62], 0.012, MET()); for (let k = 0; k < 3; k++) brick(g, "3005", i % 2 ? "#c8102e" : "#2f5fa8", xx, 0.82, -0.25 + k * 0.25, 0, [0.3, 0.45, 0.3]); } return g; };
  D.lavaLamp = (p, x, y, z) => { const g = g0(p, x, y, z); g.userData.noBake = true; brick(g, "3062b", "#c3c8ce", 0, 0, 0, 0, [0.8, 0.5, 0.8]); mesh(g, cylG(0.07, 0.11, 0.42, 16), trans("#ff6a3a", 0.55), 0, 0.42, 0); brick(g, "4073", "#c3c8ce", 0, 0.63, 0, 0, 0.8);
    const B = [0, 1, 2].map((i) => mesh(g, sph(0.04 + i * 0.008, 10), glow("#ff4a2a", 1.6), 0, 0.3, 0)); live(g, (t) => B.forEach((b, i) => { b.position.y = 0.3 + 0.12 * (1 + Math.sin(t * 0.7 + i * 2.1)); })); return g; };
  D.closedSign = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry); bar(g, [-0.2, 0.4, 0], [0, 0.6, 0], 0.008, "#d8d8d8"); bar(g, [0.2, 0.4, 0], [0, 0.6, 0], 0.008, "#d8d8d8");
    mesh(g, rbox(0.8, 0.36, 0.04, 0.02), "#c8102e", 0, 0.22, 0); const f = new THREE.Mesh(plane(0.74, 0.3), canvasMat(256, 104, (c, W, H) => { c.fillStyle = "#c8102e"; c.fillRect(0, 0, W, H); c.fillStyle = "#fff"; c.font = "900 50px Arial Black, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("CLOSED", W / 2, H / 2 + 3); })); f.position.set(0, 0.22, 0.036); g.add(f); return g; };
  D.movingBox = (p, x, y, z, ry, s, open) => { const g = g0(p, x, y, z, ry, s || 1); brick(g, "3003", "#b88a52", 0, 0, 0, 0, [1.1, 1, 1.1]); mesh(g, box(0.78, 0.02, 0.1), "#d9c18a", 0, 0.43, 0);
    if (open) { mesh(g, box(0.38, 0.02, 0.76), "#a87a48", 0.38, 0.5, 0, 0, 0, -0.6); mesh(g, box(0.38, 0.02, 0.76), "#a87a48", -0.38, 0.5, 0, 0, 0, 0.6); } return g; };
  // ---- grocery lot
  D.chainGate = (p, x, y, z, w, h) => { const g = g0(p, x, y, z), st = MET("#9aa0a6"); for (const sx of [-w / 2, 0, w / 2]) { brick(g, "3941", "#5a5f66", sx, 0, 0, 0, [0.5, 0.6, 0.5]); bar(g, [sx, 0, 0], [sx, h, 0], 0.04, st); }
    bar(g, [-w / 2, h, 0], [w / 2, h, 0], 0.03, st); bar(g, [-w / 2, 0.2, 0], [w / 2, 0.2, 0], 0.03, st);
    const mt = tex(128, 128, (c, W, H) => { c.clearRect(0, 0, W, H); c.strokeStyle = "#5c6168"; c.lineWidth = 6; for (let i = -8; i < 16; i += 2) { c.beginPath(); c.moveTo(i * 16, 0); c.lineTo(i * 16 + 128, 128); c.stroke(); c.beginPath(); c.moveTo(i * 16 + 128, 0); c.lineTo(i * 16, 128); c.stroke(); } });
    mt.wrapS = mt.wrapT = THREE.RepeatWrapping; mt.repeat.set(w / 0.6, h / 0.6); mt.anisotropy = 8; const ms = new THREE.Mesh(plane(w, h - 0.2), new THREE.MeshStandardMaterial({ map: mt, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, metalness: 0.5, roughness: 0.4 })); ms.position.set(0, 0.2 + (h - 0.2) / 2, 0); g.add(ms);
    // chain loop + padlock at the middle post
    for (let i = 0; i < 7; i++) mesh(g, PK.box(0.08, 0.04, 0.04), st, -0.24 + i * 0.08, h * 0.55 + Math.abs(i - 3) * -0.03, 0.06); mesh(g, rbox(0.16, 0.2, 0.08, 0.02), GOLD(), 0, h * 0.42, 0.08); g.userData.lock = h * 0.42; return g; };
  D.produceCrate = (p, x, y, z, ry, col) => { const g = g0(p, x, y, z, ry), wd = M("#a87a48"); for (const sz of [-0.3, 0.3]) mesh(g, box(0.9, 0.36, 0.05), wd, 0, 0.18, sz); for (const sx of [-0.43, 0.43]) mesh(g, box(0.05, 0.36, 0.6), wd, sx, 0.18, 0);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) brick(g, "3062b", col || "#f28c28", -0.32 + i * 0.13, 0.22, -0.2 + j * 0.13, 0, [0.4, 0.3, 0.4]); return g; };
  D.cart = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry), st = MET("#b8bdc3"); for (const [a, b] of [[-0.3, -0.25], [0.3, -0.25], [-0.3, 0.25], [0.3, 0.25]]) wheel(g, a, 0.06, b, 0.06, 0.04);
    for (const sx of [-0.32, 0.32]) bar(g, [sx, 0.1, -0.3], [sx, 0.55, -0.3], 0.015, st); for (const [a, b] of [[-0.35, -0.3], [0.35, -0.3], [-0.35, 0.3], [0.35, 0.3]]) bar(g, [a, 0.52, b], [a, 0.92, b], 0.016, st);
    for (const yy of [0.52, 0.92]) { bar(g, [-0.35, yy, -0.3], [0.35, yy, -0.3], 0.016, st); bar(g, [-0.35, yy, 0.3], [0.35, yy, 0.3], 0.016, st); bar(g, [-0.35, yy, -0.3], [-0.35, yy, 0.3], 0.016, st); bar(g, [0.35, yy, -0.3], [0.35, yy, 0.3], 0.016, st); }
    for (let i = 1; i < 5; i++) { const xx = -0.35 + i * 0.14; bar(g, [xx, 0.52, 0.3], [xx, 0.92, 0.3], 0.01, st); bar(g, [xx, 0.52, -0.3], [xx, 0.92, -0.3], 0.01, st); }
    mesh(g, box(0.7, 0.03, 0.6), "#8a9098", 0, 0.52, 0); bar(g, [-0.35, 0.96, 0.4], [0.35, 0.96, 0.4], 0.025, "#c8102e"); for (const sx of [-0.35, 0.35]) bar(g, [sx, 0.92, 0.3], [sx, 0.96, 0.4], 0.016, st); return g; };
  // a tower crane (lattice of bars)
  D.crane = (p, x, y, z, ry, h) => { const g = g0(p, x, y, z, ry), yl = M("#f2c21b"); h = h || 10;
    for (let k = 0; k < Math.round(h / 0.8); k++) { const yy = k * 0.8; for (const [a, b] of [[-0.25, -0.25], [0.25, -0.25], [0.25, 0.25], [-0.25, 0.25]]) bar(g, [a, yy, b], [a, yy + 0.8, b], 0.03, yl); bar(g, [-0.25, yy, 0.25], [0.25, yy + 0.8, 0.25], 0.02, yl); bar(g, [0.25, yy, -0.25], [-0.25, yy + 0.8, -0.25], 0.02, yl); }
    bar(g, [-2, h, 0], [5, h, 0], 0.08, yl); bar(g, [0, h + 1.2, 0], [5, h, 0], 0.02, yl); bar(g, [0, h + 1.2, 0], [-2, h, 0], 0.02, yl); mesh(g, box(0.8, 0.6, 0.6), "#3a3d42", -1.6, h - 0.35, 0); bar(g, [3.5, h, 0], [3.5, h - 3, 0], 0.035, "#1b1b1b");
    mesh(g, sph(0.1, 10), glow("#ff3030", 2.6), 0, h + 1.3, 0);
    // hook block + a hanging load of bricks on the cable
    mesh(g, box(0.3, 0.22, 0.2), "#2b2b2b", 3.5, h - 3.1, 0); mesh(g, box(0.06, 0.2, 0.06), MET(), 3.5, h - 3.3, 0); for (const sx of [-0.25, 0.25]) bar(g, [3.5, h - 3.38, 0], [3.5 + sx * 2.4, h - 3.85, 0], 0.03, "#1b1b1b");
    for (let k = 0; k < 2; k++) brick(g, "3001", ["#c8102e", "#f2cd37"][k], 3.5, h - 4.1 + k * BH * 1.2, 0, 0, [1.3, 1.2, 1.3]); return g; };
});
