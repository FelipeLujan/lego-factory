/* ============================================================================
   PROPS-KIT (shared library, brick-cinematic template; first built for disney-iger r7, the props quality bar): brick-built set dressing.
   Load it in index.html after ldraw-kit.js. Copy-and-extend per project is fine; add new GENERIC assets back here so the library grows.
   PROPS.setup(ctx, K, X) -> PK. Every builder is (parent, x, y, z, ry, opts) -> THREE.Group with its origin on the
   support surface (y = K.FL for the floor). Real LDraw parts at 0.0175 m per LDU (true minifig scale: brick 0.42,
   plate 0.14, stud pitch 0.35): bricks 3001 3003 3004 3005 3010, plates 3023 3024, slopes 3039 3040, tiles 3068b
   3069b 3070b, round bricks 3062b 3941, round plates 4073 6141, round tile 98138; everything else is a shared cached
   box / cylinder / cone in glossy ABS (K.plastic) or metallic-silver plastic.
   PK.bake(setGroup) merges every static prop mesh of a set into InstancedMeshes (one per geometry + material).
   PK.tick(t) drives the few live props (fan, steam, fountain, pigeons, dog, globe, balloons). No Math.random.
   ============================================================================ */
(function () {
  const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  function setup(ctx, K, X) {
    const THREE = ctx.THREE;
    const S = 0.0175, BH = 24 * S, PH = 8 * S, PT = 20 * S; // 0.42 / 0.14 / 0.35
    const PK = { S, BH, PH, PT };
    const LIVE = [];
    // ------------------------------------------------------------------ materials (all cached)
    const M = (c, e) => K.plastic(c, e);
    const MET = (c) => K.plastic(c || "#c3c8ce", { metalness: 0.85, roughness: 0.3, clearcoat: 0.35 });
    const GOLD = () => K.plastic("#c9a24a", { metalness: 0.75, roughness: 0.32, clearcoat: 0.3 });
    const MATTE = (c) => K.plastic(c, { roughness: 0.62, clearcoat: 0.05 });
    const GL = {};
    const glow = (c, k) => { const key = c + "|" + (k == null ? 2 : k); return GL[key] || (GL[key] = new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k == null ? 2 : k), toneMapped: false })); };
    const TRM = {};
    const trans = (c, op) => { const key = c + "|" + (op || 0.5); return TRM[key] || (TRM[key] = new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.06, metalness: 0, transparent: true, opacity: op || 0.5, clearcoat: 1, clearcoatRoughness: 0.05, depthWrite: false })); };
    const GLASS = () => K.plastic("#1e2a38", { roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.04 });
    const mat = (m) => (typeof m === "string" ? M(m) : m);
    const tex = (w, h, draw) => K.canvasTex(w, h, draw);
    const canvasMat = (w, h, draw, extra) => K.plastic("#ffffff", Object.assign({ map: tex(w, h, draw), roughness: 0.5, clearcoat: 0.15 }, extra || {}));
    const screenMat = (w, h, draw, k) => new THREE.MeshBasicMaterial({ map: tex(w, h, draw), toneMapped: false, color: new THREE.Color(1, 1, 1).multiplyScalar(k == null ? 1 : k) });
    // ------------------------------------------------------------------ geometry (all cached)
    const DIMS = { "3001": [4, 24, 2], "3003": [2, 24, 2], "3004": [2, 24, 1], "3005": [1, 24, 1], "3010": [4, 24, 1], "3023": [2, 8, 1], "3024": [1, 8, 1], "3039": [2, 24, 2], "3040": [1, 24, 2], "3062b": [1, 24, 1], "3941": [2, 24, 2], "4073": [1, 8, 1], "6141": [1, 8, 1], "3068b": [2, 8, 2], "3069b": [2, 8, 1], "3070b": [1, 8, 1], "98138": [1, 8, 1] };
    const GC = {};
    function part(id) { // LDraw part, origin moved to the bottom centre of its footprint
      if (GC[id]) return GC[id];
      let g = X.ld(id, S);
      if (!g) { const d = DIMS[id] || [1, 24, 1]; g = new THREE.BoxGeometry(d[0] * PT - 0.004, d[1] * S, d[2] * PT - 0.004); }
      g.computeBoundingBox(); const b = g.boundingBox;
      g.translate(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2);
      return (GC[id] = g);
    }
    const GG = {};
    const geo = (key, make) => GG[key] || (GG[key] = make());
    const box = (w, h, d) => geo("b" + w + "," + h + "," + d, () => new THREE.BoxGeometry(w, h, d));
    const rbox = (w, h, d, r) => geo("r" + w + "," + h + "," + d + "," + r, () => X.roundBox(w, h, d, r == null ? Math.min(0.025, w / 4, h / 4, d / 4) : r, 2));
    const cylG = (rt, rb, h, n) => geo("c" + rt + "," + rb + "," + h + "," + (n || 18), () => new THREE.CylinderGeometry(rt, rb, h, n || 18));
    const sph = (r, n) => geo("s" + r + "," + (n || 20), () => new THREE.SphereGeometry(r, n || 20, Math.max(8, Math.round((n || 20) * 0.7))));
    const tor = (R, r, arc) => geo("t" + R + "," + r + "," + (arc || 0), () => new THREE.TorusGeometry(R, r, 8, 28, arc || Math.PI * 2));
    const cone = (r, h, n, open) => geo("k" + r + "," + h + "," + (n || 20) + (open ? "o" : ""), () => new THREE.ConeGeometry(r, h, n || 20, 1, !!open));
    const plane = (w, h) => geo("p" + w + "," + h, () => new THREE.PlaneGeometry(w, h));
    const STUD = () => cylG(0.104, 0.104, 0.07, 16);
    // ------------------------------------------------------------------ mesh helpers
    function mesh(p, g, m, x, y, z, rx, ry, rz, s) {
      const o = new THREE.Mesh(g, mat(m)); o.position.set(x || 0, y || 0, z || 0);
      if (rx || ry || rz) o.rotation.set(rx || 0, ry || 0, rz || 0);
      if (s != null) { if (Array.isArray(s)) o.scale.set(s[0], s[1], s[2]); else o.scale.setScalar(s); }
      const mm = o.material, lit = !(mm.isMeshBasicMaterial || mm.transparent);
      o.castShadow = lit; o.receiveShadow = !mm.isMeshBasicMaterial; o.userData.pk = 1; p.add(o); return o;
    }
    const brick = (p, id, m, x, y, z, ry, s) => mesh(p, part(id), m, x, y, z, 0, ry || 0, 0, s);
    // a part laid on its side so its studs face +z (front) / -z / +x: rx = +90 deg turns the part's +y to +z
    const face = (p, id, m, x, y, z, dir, s) => { dir = dir || "z"; const o = mesh(p, part(id), m, x, y, z, 0, 0, 0, s); if (dir === "z") o.rotation.set(Math.PI / 2, 0, 0); else if (dir === "-z") o.rotation.set(-Math.PI / 2, 0, 0); else if (dir === "x") o.rotation.set(0, 0, -Math.PI / 2); else if (dir === "-x") o.rotation.set(0, 0, Math.PI / 2); return o; };
    const grp = (p, x, y, z, ry, s) => { const g = new THREE.Group(); g.position.set(x || 0, y || 0, z || 0); g.rotation.y = ry || 0; if (s) g.scale.setScalar(s); p.add(g); return g; };
    const studs = (p, m, x0, z0, nx, nz, y) => { for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) mesh(p, STUD(), m, x0 + (i + 0.5) * PT, y + 0.035, z0 + (j + 0.5) * PT); };
    const _up = new THREE.Vector3(0, 1, 0), _d = new THREE.Vector3();
    function bar(p, a, b, r, m, n) { // a cylinder from point a to point b (shared unit geometry, scaled)
      _d.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]); const L = _d.length();
      const o = mesh(p, cylG(r, r, 1, n || 8), m, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
      o.scale.set(1, L, 1); o.quaternion.setFromUnitVectors(_up, _d.normalize()); return o;
    }
    const live = (g, fn) => { g.userData.live = true; LIVE.push({ g, fn }); return g; };
    function wheel(g, x, y, z, r, w, hub) { const o = grp(g, x, y, z); mesh(o, cylG(r, r, w || 0.22, 24), "#1b1b1b", 0, 0, 0, Math.PI / 2); mesh(o, cylG(r * 0.55, r * 0.55, (w || 0.22) + 0.02, 16), hub || MET(), 0, 0, 0, Math.PI / 2); return o; }
    function tube(p, pts, r, m) { const c = new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(q[0], q[1], q[2]))); const o = new THREE.Mesh(new THREE.TubeGeometry(c, Math.max(8, pts.length * 8), r, 8, false), mat(m)); o.castShadow = o.receiveShadow = true; p.add(o); return o; }
    Object.assign(PK, { M, MET, GOLD, glow, trans, part, brick, face, grp, studs, bar, mesh, box, rbox, cylG, sph, live });

    // ------------------------------------------------------------------ bake + tick
    PK.bake = (root) => {
      root.updateMatrixWorld(true);
      const inv = new THREE.Matrix4().copy(root.matrixWorld).invert(), groups = new Map(), tmp = new THREE.Matrix4();
      root.traverse((o) => {
        if (!o.isMesh || o.isInstancedMesh || !o.userData.pk || Array.isArray(o.material)) return;
        for (let a = o.parent; a && a !== root; a = a.parent) if (a.userData.live || a.userData.noBake) return;
        const k = o.geometry.uuid + "|" + o.material.uuid; let L = groups.get(k); if (!L) groups.set(k, (L = [])); L.push(o);
      });
      let n = 0;
      groups.forEach((L) => { if (L.length < 2) return;
        const im = new THREE.InstancedMesh(L[0].geometry, L[0].material, L.length);
        L.forEach((o, i) => { im.setMatrixAt(i, tmp.multiplyMatrices(inv, o.matrixWorld)); o.parent.remove(o); });
        im.castShadow = L[0].castShadow; im.receiveShadow = L[0].receiveShadow; im.frustumCulled = false; root.add(im); n += L.length; });
      return n;
    };
    const shown = (o) => { for (let a = o; a; a = a.parent) if (!a.visible) return false; return true; };
    PK.tick = (t) => LIVE.forEach((L) => { if (shown(L.g)) L.fn(t); });

    // ------------------------------------------------------------------ minifig extras (static poses, matte like the cast)
    const HM = {};
    function matte(fg) {
      fg.headMat.clearcoat = 0.0; fg.headMat.roughness = 0.6; fg.headMat.specularIntensity = 0.22; fg.headMat.envMapIntensity = 0.5;
      fg.hands.forEach((h) => h.traverse((o) => { if (!o.isMesh || Array.isArray(o.material)) return; const key = o.material.uuid;
        if (!HM[key]) { const m = o.material.clone(); m.color.multiplyScalar(0.86); m.roughness = 0.68; m.clearcoat = 0; m.specularIntensity = 0.12; m.envMapIntensity = 0.3; HM[key] = m; } o.material = HM[key]; }));
      fg.root.traverse((o) => { if (!o.isMesh || o.material === fg.headMat || o.userData.pk) return; (Array.isArray(o.material) ? o.material : [o.material]).forEach((mm) => { if (!mm.isMeshPhysicalMaterial || Object.values(HM).includes(mm)) return; mm.clearcoat = Math.min(mm.clearcoat || 0, 0.12); mm.roughness = Math.max(mm.roughness || 0, 0.5); mm.specularIntensity = Math.min(mm.specularIntensity == null ? 1 : mm.specularIntensity, 0.45); }); });
    }
    PK.extra = (p, spec, pose, acc) => {
      const f = K.mfig(spec); p.add(f.root); f.hands.forEach((h) => h.scale.setScalar(0.82));
      K.P(f, pose || {}); matte(f); f.root.userData.noBake = true;
      (acc || []).forEach((a) => K.attach(f, a[0], a[1], a[2] || 0, a[3] || 0, a[4] || 0)); // after matte: props keep their own plastic
      return f;
    };
    PK.cap = (f, col, brim) => { const c = M(col || "#c8102e"); const s = new THREE.Mesh(new THREE.SphereGeometry(0.205, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2), c); s.position.y = 0.33; s.scale.set(1, 0.72, 1); s.castShadow = true; f.head.add(s);
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 24, 1, false, -0.9, 1.8), M(brim || col || "#c8102e")); b.position.set(0, 0.34, 0.12); b.scale.z = 1.25; f.head.add(b); return f; };
    // hand accessories (the grip is at the origin; long axis along the hand's +y)
    PK.acc = {
      clipboard: () => { const g = new THREE.Group(); mesh(g, rbox(0.24, 0.32, 0.02, 0.006), "#8a5a2b", 0, 0.12, 0.05); mesh(g, plane(0.2, 0.26), M("#f6f4ee"), 0, 0.11, 0.062); mesh(g, rbox(0.08, 0.03, 0.03, 0.006), MET(), 0, 0.27, 0.06); return g; },
      cup: (c) => { const g = new THREE.Group(); mesh(g, part("3062b"), c || "#f2f3f2", 0, -0.08, 0.03, 0, 0, 0, 0.62); mesh(g, part("4073"), "#5a3a22", 0, 0.18, 0.03, 0, 0, 0, [0.5, 0.2, 0.5]); return g; },
      icecream: () => { const g = new THREE.Group(); mesh(g, cone(0.06, 0.18, 14), "#d8a25a", 0, 0.05, 0.03, Math.PI); mesh(g, sph(0.07, 14), "#f6b8c8", 0, 0.17, 0.03); mesh(g, sph(0.05, 12), "#6b3a1f", 0.01, 0.24, 0.03); return g; },
      paper: () => { const g = new THREE.Group(); const m = canvasMat(256, 160, (c, W, H) => { c.fillStyle = "#efece2"; c.fillRect(0, 0, W, H); c.fillStyle = "#1b1b1b"; c.font = "900 30px Arial Black, Arial"; c.textAlign = "center"; c.fillText("THE DAILY", W / 2, 34); c.fillStyle = "#8a8a8a"; for (let i = 0; i < 6; i++) c.fillRect(16 + (i % 2) * 124, 52 + Math.floor(i / 2) * 32, 108, 20); }, { side: THREE.DoubleSide });
        const pl = new THREE.Mesh(plane(0.42, 0.28), m); pl.position.set(0.12, 0.16, 0.08); pl.rotation.x = -0.2; g.add(pl); return g; },
      parcel: () => { const g = new THREE.Group(); mesh(g, rbox(0.38, 0.28, 0.3, 0.02), "#b88a52", 0.12, 0.1, 0.14); mesh(g, box(0.39, 0.29, 0.06), "#d9c18a", 0.12, 0.1, 0.14); return g; },
      camera: () => { const g = new THREE.Group(); mesh(g, rbox(0.22, 0.14, 0.11, 0.02), "#1b1b1b", 0, 0.1, 0.06); mesh(g, cylG(0.05, 0.055, 0.12, 16), "#2b2b2b", 0, 0.1, 0.16, Math.PI / 2); mesh(g, cylG(0.04, 0.04, 0.01, 16), GLASS(), 0, 0.1, 0.225, Math.PI / 2); mesh(g, rbox(0.07, 0.05, 0.04, 0.01), "#f2f3f2", -0.06, 0.2, 0.06); return g; },
      phone: () => { const g = new THREE.Group(); mesh(g, rbox(0.08, 0.15, 0.015, 0.006), "#1b1b1b", 0, 0.08, 0.05); return g; },
    };

    // ================================================================== OFFICE FURNITURE
    PK.filingCabinet = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), c = o.col || "#6b7178", n = o.n || 3, fr = M(o.front || "#8a9098");
      for (let k = 0; k < n; k++) { const y0 = k * (BH + PH); brick(g, "3003", c, 0, y0, 0); brick(g, "3023", c, 0, y0 + BH, -PT / 2); brick(g, "3023", c, 0, y0 + BH, PT / 2);
        face(g, "3069b", fr, 0, y0 + 0.28, PT); bar(g, [-0.14, y0 + 0.36, PT + 0.17], [0.14, y0 + 0.36, PT + 0.17], 0.016, MET()); mesh(g, box(0.16, 0.06, 0.01), "#f4f2ec", 0, y0 + 0.24, PT + 0.145); }
      const top = n * (BH + PH); brick(g, "3068b", o.top || "#3a3d42", 0, top, 0); g.userData.top = top + PH; return g; };
    PK.globe = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), wood = M("#5c3a1e"), desk = !!o.desk, r = desk ? 0.16 : 0.27;
      let hy;
      if (desk) { brick(g, "4073", GOLD(), 0, 0, 0, 0, 1.3); bar(g, [0, 0.14, 0], [0, 0.22, 0], 0.03, GOLD()); hy = 0.22 + r + 0.02; }
      else { brick(g, "3941", wood, 0, 0, 0); brick(g, "3062b", wood, 0, BH, 0); brick(g, "3062b", wood, 0, 2 * BH, 0); brick(g, "4073", GOLD(), 0, 3 * BH, 0); hy = 3 * BH + PH + r + 0.05; }
      const arc = mesh(g, tor(r + 0.04, 0.012, Math.PI * 1.25), GOLD(), 0, hy, 0, 0, Math.PI / 2, -Math.PI * 0.12); arc.rotation.order = "YXZ";
      const sp = live(grp(g, 0, hy, 0), (t) => { sp.children[0].rotation.y = t * 0.35; }); sp.rotation.z = 0.41;
      const gm = K.plastic("#ffffff", { map: tex(512, 256, (c, W, H) => { c.fillStyle = "#2f6fb0"; c.fillRect(0, 0, W, H);
        for (let i = 0; i < 9; i++) { const cx = rnd(i * 3 + 1) * W, cy = H * (0.2 + rnd(i * 3 + 2) * 0.6), rx = 25 + rnd(i * 5) * 55, ry2 = 15 + rnd(i * 7) * 35; c.fillStyle = i % 3 ? "#5a9a4a" : "#c9b07a"; c.beginPath(); c.ellipse(cx, cy, rx, ry2, rnd(i) * 3, 0, 7); c.fill(); c.beginPath(); c.ellipse(cx + rx * 0.6, cy + ry2 * 0.5, rx * 0.5, ry2 * 0.6, 0, 0, 7); c.fill(); }
        c.strokeStyle = "rgba(255,255,255,0.18)"; c.lineWidth = 2; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(0, i * H / 6); c.lineTo(W, i * H / 6); c.stroke(); } for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo(i * W / 12, 0); c.lineTo(i * W / 12, H); c.stroke(); } }), roughness: 0.35, clearcoat: 0.6 });
      const s = new THREE.Mesh(sph(r, 32), gm); s.castShadow = true; sp.add(s); return g; };
    PK.coatRack = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), wood = M("#4a2a16"), coat = o.coat || "#8a6a48";
      brick(g, "3941", wood, 0, 0, 0); for (let k = 0; k < 6; k++) brick(g, "3062b", wood, 0, BH + k * BH, 0); brick(g, "98138", GOLD(), 0, 7 * BH, 0);
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; bar(g, [0, 2.75, 0], [Math.sin(a) * 0.24, 2.92, Math.cos(a) * 0.24], 0.022, wood); mesh(g, sph(0.035, 10), GOLD(), Math.sin(a) * 0.24, 2.93, Math.cos(a) * 0.24); }
      // a trench coat hanging on the front hook (1x2 bricks + slope shoulders), a fedora on the back hook
      const cg = grp(g, 0, 0, 0.27); brick(cg, "3040", coat, -0.175, 2.38, 0, -Math.PI / 2); brick(cg, "3040", coat, 0.175, 2.38, 0, Math.PI / 2);
      for (let k = 0; k < 3; k++) brick(cg, "3004", coat, 0, 2.38 - (k + 1) * BH, 0); mesh(cg, box(0.04, 1.2, 0.02), M("#6b4f34"), 0, 1.75, 0.18); bar(cg, [-0.36, 1.85, 0.18], [0.36, 1.85, 0.18], 0.02, "#6b4f34");
      const hg = grp(g, -0.05, 2.9, -0.22); mesh(hg, cylG(0.26, 0.26, 0.02, 28), "#2a2622", 0, 0, 0); mesh(hg, cylG(0.14, 0.17, 0.16, 24), "#2a2622", 0, 0.09, 0); mesh(hg, cylG(0.172, 0.172, 0.04, 24), "#7a1f2a", 0, 0.03, 0); hg.rotation.z = 0.25;
      return g; };
    PK.umbrellaStand = (p, x, y, z, ry, o) => { const g = grp(p, x, y, z, ry), br = K.plastic("#9a7a3a", { metalness: 0.8, roughness: 0.3, clearcoat: 0.3 });
      brick(g, "3941", br, 0, 0, 0); brick(g, "3941", br, 0, BH, 0); mesh(g, tor(0.33, 0.025), br, 0, 2 * BH, 0, Math.PI / 2);
      [["#1b1b1b", 0.08, 0.06, 0.12], ["#c8102e", -0.1, 0.05, -0.15], ["#1f2f4f", 0.02, -0.12, 0.05]].forEach(([c, dx, dz, tl], i) => { const u = grp(g, dx, 0.1, dz); u.rotation.set(tl, 0, -tl * 0.8);
        mesh(u, cone(0.075, 0.75, 10), c, 0, 0.55, 0, Math.PI); bar(u, [0, 0.1, 0], [0, 1.18, 0], 0.012, "#2b2b2b"); mesh(u, tor(0.05, 0.014, Math.PI), i === 1 ? "#5c3a1e" : "#2b2b2b", 0.05, 1.18, 0, 0, 0, 0); });
      return g; };
    PK.bookStack = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), cols = o.cols || ["#8a1f2f", "#1f3a5f", "#2f5f4a", "#c9a24a", "#3a3d42"], n = o.n || 4;
      for (let i = 0; i < n; i++) mesh(g, rbox(0.46 - (i % 2) * 0.06, 0.07, 0.32, 0.01), cols[i % cols.length], (rnd(i * 3 + (o.seed || 0)) - 0.5) * 0.06, 0.035 + i * 0.072, 0, 0, (rnd(i * 7 + (o.seed || 0)) - 0.5) * 0.4);
      return g; };
    PK.penCup = (p, x, y, z) => { const g = grp(p, x, y, z); brick(g, "3062b", "#1b1b1b", 0, 0, 0, 0, [0.75, 0.55, 0.75]); [["#c8102e", 0.03, 0.02], ["#2f5fa8", -0.03, 0.01], ["#f2cd37", 0.0, -0.03]].forEach(([c, dx, dz], i) => bar(g, [dx, 0.08, dz], [dx * 2.4, 0.38 + i * 0.02, dz * 2.4], 0.01, c, 6)); return g; };
    PK.framedPicture = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), w = o.w || 0.8, h = o.h || 0.6, fc = M(o.frame || "#c9a24a", o.frame ? undefined : { metalness: 0.6, roughness: 0.35 });
      const art = canvasMat(256, Math.round(256 * h / w), (c, W, H) => drawArt(c, W, H, o.style || "sea", o.seed || 1), { roughness: 0.6, clearcoat: 0.05 });
      mesh(g, plane(w - 0.04, h - 0.04), art, 0, 0, 0.012);
      const t = 0.06; mesh(g, rbox(w + t, t, 0.05, 0.01), fc, 0, h / 2, 0); mesh(g, rbox(w + t, t, 0.05, 0.01), fc, 0, -h / 2, 0); mesh(g, rbox(t, h, 0.05, 0.01), fc, -w / 2, 0, 0); mesh(g, rbox(t, h, 0.05, 0.01), fc, w / 2, 0, 0);
      mesh(g, box(w, h, 0.01), "#2a2622", 0, 0, -0.015); return g; };
    function drawArt(c, W, H, style, seed) {
      const sky = c.createLinearGradient(0, 0, 0, H);
      if (style === "sea") { sky.addColorStop(0, "#f6c38a"); sky.addColorStop(0.55, "#f39a6a"); sky.addColorStop(0.56, "#2f6f9a"); sky.addColorStop(1, "#1d4566"); c.fillStyle = sky; c.fillRect(0, 0, W, H); c.fillStyle = "#ffe6a8"; c.beginPath(); c.arc(W * 0.66, H * 0.5, H * 0.12, Math.PI, 0); c.fill(); c.fillStyle = "rgba(255,230,170,0.45)"; for (let i = 0; i < 5; i++) c.fillRect(W * 0.58, H * (0.6 + i * 0.07), W * 0.16 - i * 6, 3); c.fillStyle = "#f4f2ec"; c.beginPath(); c.moveTo(W * 0.25, H * 0.56); c.lineTo(W * 0.3, H * 0.32); c.lineTo(W * 0.34, H * 0.56); c.fill(); c.fillStyle = "#4a2a16"; c.fillRect(W * 0.22, H * 0.56, W * 0.14, H * 0.03); }
      else if (style === "mountain") { sky.addColorStop(0, "#7fb2e6"); sky.addColorStop(1, "#d8e8f4"); c.fillStyle = sky; c.fillRect(0, 0, W, H); c.fillStyle = "#5a6a7a"; c.beginPath(); c.moveTo(0, H); c.lineTo(W * 0.35, H * 0.25); c.lineTo(W * 0.6, H * 0.7); c.lineTo(W * 0.8, H * 0.4); c.lineTo(W, H); c.fill(); c.fillStyle = "#f4f6f8"; c.beginPath(); c.moveTo(W * 0.27, H * 0.37); c.lineTo(W * 0.35, H * 0.25); c.lineTo(W * 0.43, H * 0.39); c.fill(); c.fillStyle = "#3f7a40"; c.fillRect(0, H * 0.84, W, H * 0.16); }
      else if (style === "abstract") { c.fillStyle = "#f4f2ec"; c.fillRect(0, 0, W, H); const cols = ["#e8382b", "#f2cd37", "#2f5fa8", "#1b1b1b", "#f4f2ec"]; for (let i = 0; i < 7; i++) { c.fillStyle = cols[(i + seed) % cols.length]; c.fillRect(rnd(seed * 9 + i) * W * 0.7, rnd(seed * 5 + i * 3) * H * 0.7, W * (0.15 + rnd(i + seed) * 0.3), H * (0.15 + rnd(i * 2 + seed) * 0.3)); } c.strokeStyle = "#1b1b1b"; c.lineWidth = 6; c.strokeRect(3, 3, W - 6, H - 6); }
      else if (style === "city") { sky.addColorStop(0, "#141c3a"); sky.addColorStop(1, "#4a3a66"); c.fillStyle = sky; c.fillRect(0, 0, W, H); for (let i = 0; i < 9; i++) { const bw = W / 9, bh = H * (0.25 + rnd(seed + i) * 0.5); c.fillStyle = "#1c2238"; c.fillRect(i * bw, H - bh, bw - 2, bh); c.fillStyle = "#ffd58a"; for (let k = 0; k < 6; k++) if (rnd(i * 13 + k + seed) > 0.5) c.fillRect(i * bw + 4 + (k % 2) * 10, H - bh + 8 + Math.floor(k / 2) * 16, 6, 8); } }
      else if (style === "flowers") { c.fillStyle = "#2a3a4a"; c.fillRect(0, 0, W, H); c.fillStyle = "#c9a24a"; c.fillRect(W * 0.38, H * 0.6, W * 0.24, H * 0.32); for (let i = 0; i < 9; i++) { c.fillStyle = ["#e8382b", "#f2cd37", "#f6b8c8", "#f4f2ec"][i % 4]; c.beginPath(); c.arc(W * (0.3 + rnd(i + seed) * 0.4), H * (0.2 + rnd(i * 3 + seed) * 0.35), H * 0.06, 0, 7); c.fill(); } }
      else if (style === "portrait") { c.fillStyle = "#3a2a22"; c.fillRect(0, 0, W, H); c.fillStyle = "#1f2a44"; c.beginPath(); c.moveTo(W * 0.15, H); c.lineTo(W * 0.3, H * 0.62); c.lineTo(W * 0.7, H * 0.62); c.lineTo(W * 0.85, H); c.fill(); c.fillStyle = "#e8c8a4"; c.beginPath(); c.roundRect(W * 0.36, H * 0.25, W * 0.28, H * 0.36, 14); c.fill(); c.fillStyle = "#9a9a9a"; c.beginPath(); c.ellipse(W * 0.5, H * 0.27, W * 0.16, H * 0.07, 0, Math.PI, 0); c.fill(); }
      else { c.fillStyle = "#f4f2ec"; c.fillRect(0, 0, W, H); c.strokeStyle = "#2f5fa8"; c.lineWidth = 6; c.beginPath(); c.moveTo(12, H - 16); for (let i = 1; i <= 6; i++) c.lineTo(12 + i * (W - 24) / 6, H - 16 - (rnd(i * 7 + seed) * 0.5 + i * 0.08) * (H - 30)); c.stroke(); }
    }

    // ================================================================== BOARDROOM
    PK.credenza = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), c = o.col || "#3b2414", n = o.n || 2, fr = M(o.front || "#4e3020"), w = n * 1.4;
      for (let i = 0; i < n; i++) for (let k = 0; k < 2; k++) brick(g, "3001", c, -w / 2 + 0.7 + i * 1.4, k * BH, 0);
      for (let i = 0; i < n * 2; i++) { face(g, "3069b", fr, -w / 2 + 0.35 + i * 0.7, 0.24, PT); face(g, "3069b", fr, -w / 2 + 0.35 + i * 0.7, 0.6, PT); mesh(g, sph(0.025, 8), GOLD(), -w / 2 + 0.35 + i * 0.7 + (i % 2 ? -0.24 : 0.24), 0.6, PT + 0.17); }
      for (let i = 0; i < n * 2; i++) brick(g, "3068b", o.top || "#2a1a10", -w / 2 + 0.35 + i * 0.7, 2 * BH, 0);
      g.userData.top = 2 * BH + PH; return g; };
    PK.pitcher = (p, x, y, z) => { const g = grp(p, x, y, z), tm = trans("#bfe6ff", 0.45); mesh(g, part("3062b"), tm, 0, 0, 0, 0, 0, 0, [1.1, 0.9, 1.1]); mesh(g, part("4073"), tm, 0, 0.38, 0); mesh(g, tor(0.07, 0.012, Math.PI), tm, 0.11, 0.2, 0, 0, 0, -Math.PI / 2); mesh(g, cylG(0.08, 0.08, 0.2, 14), trans("#7fc4ff", 0.35), 0, 0.12, 0); return g; };
    PK.glass = (p, x, y, z) => { const g = grp(p, x, y, z); mesh(g, part("3062b"), trans("#dff2ff", 0.4), 0, 0, 0, 0, 0, 0, [0.6, 0.45, 0.6]); mesh(g, cylG(0.05, 0.05, 0.1, 12), trans("#9fd4ff", 0.3), 0, 0.06, 0); return g; };
    PK.flagStand = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), h = o.h || 2.5, cols = o.cols || ["#1f3a6f", "#f4f2ec", "#1f3a6f"];
      brick(g, "3941", GOLD(), 0, 0, 0); bar(g, [0, BH, 0], [0, h, 0], 0.03, GOLD(), 12); mesh(g, sph(0.06, 14), GOLD(), 0, h + 0.05, 0);
      // flag of 1x1 plates on edge (4 columns x 3 rows), hanging with a gentle drape
      const fg = grp(g, 0.04, h - 0.12, 0);
      for (let col = 0; col < (o.ncol || 4); col++) { const cg = grp(fg, 0.18 + col * 0.35, 0, 0.06 * Math.sin(col * 1.3)); cg.rotation.y = 0.2 * Math.sin(col * 1.1 + 0.4);
        for (let r = 0; r < (o.nrow || 3); r++) { const m = mesh(cg, part("3024"), cols[r % cols.length], 0, -0.175 - r * 0.35, 0, Math.PI / 2, 0, 0, [1, 0.4, 1]); m.position.y = -r * 0.35 - 0.35; m.position.z = -0.028; } }
      return g; };
    PK.serviceCart = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), sil = MET(), top = M("#2a1a10"), w = 1.05, d = 0.6;
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) { bar(g, [sx * w / 2, 0.08, sz * d / 2], [sx * w / 2, 0.95, sz * d / 2], 0.02, sil); wheel(g, sx * w / 2, 0.05, sz * d / 2, 0.05, 0.04, "#2b2b2b"); }
      for (const yy of [0.3, 0.9]) brick(g, "3068b", top, 0, yy, 0, 0, [1.5, 1, 0.86]);
      bar(g, [-w / 2 - 0.1, 0.95, -0.25], [-w / 2 - 0.1, 0.95, 0.25], 0.018, sil); bar(g, [-w / 2, 0.95, -0.25], [-w / 2 - 0.1, 0.95, -0.25], 0.018, sil); bar(g, [-w / 2, 0.95, 0.25], [-w / 2 - 0.1, 0.95, 0.25], 0.018, sil);
      if (o.kind === "bar") { // bar cart: two decanters + glasses + ice bucket
        const am = trans("#d08a2a", 0.6); [[-0.3, -0.05], [-0.05, 0.1]].forEach(([dx, dz]) => { mesh(g, part("3941"), am, dx, 1.04, dz, 0, 0, 0, [0.42, 0.7, 0.42]); mesh(g, part("3062b"), am, dx, 1.33, dz, 0, 0, 0, [0.5, 0.45, 0.5]); mesh(g, sph(0.05, 10), trans("#f4f2ec", 0.7), dx, 1.56, dz); });
        for (let i = 0; i < 3; i++) PK.glass(g, 0.2 + i * 0.12, 1.04, -0.12 + (i % 2) * 0.16); brick(g, "3062b", sil, 0.25, 0.44, 0.0, 0, [1.1, 0.7, 1.1]);
        mesh(g, part("3069b"), "#c9a24a", 0.25, 0.44, 0.15, 0, 0.3, 0, 0.5);
      } else { // coffee service: a silver urn with a tap, cups on saucers
        brick(g, "3941", sil, -0.25, 1.04, 0); brick(g, "3941", sil, -0.25, 1.04 + BH, 0); brick(g, "4073", "#1b1b1b", -0.25, 1.04 + 2 * BH, 0); bar(g, [-0.25, 1.2, 0.35], [-0.25, 1.2, 0.42], 0.02, "#1b1b1b");
        for (let i = 0; i < 4; i++) { const cx = 0.15 + (i % 2) * 0.2, cz = -0.12 + Math.floor(i / 2) * 0.24; brick(g, "4073", "#f2f3f2", cx, 1.04, cz, 0, [1.2, 0.5, 1.2]); brick(g, "3062b", "#f2f3f2", cx, 1.11, cz, 0, [0.6, 0.35, 0.6]); }
        for (let i = 0; i < 6; i++) brick(g, "3062b", "#f2f3f2", -0.3 + i * 0.12, 0.44, 0, 0, [0.55, 0.32, 0.55]);
      }
      return g; };

    // ================================================================== NEWS STUDIO
    PK.softbox = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), dk = M("#1b1b1b"), sil = MET("#8a9098"), h = o.h || 1.9;
      for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2; bar(g, [0, 0.7, 0], [Math.sin(a) * 0.38, 0.02, Math.cos(a) * 0.38], 0.018, sil); }
      bar(g, [0, 0.7, 0], [0, h, 0], 0.025, sil);
      const hd = grp(g, 0, h + 0.05, 0.05); hd.rotation.x = o.tilt == null ? 0.18 : o.tilt;
      const sb = mesh(hd, cylG(0.46, 0.14, 0.34, 4), dk, 0, 0, 0.17); sb.rotation.set(Math.PI / 2, Math.PI / 4, 0, "XYZ");
      mesh(hd, plane(0.62, 0.62), glow(o.col || "#fff4e2", o.k || 1.5), 0, 0, 0.345);
      mesh(hd, rbox(0.66, 0.04, 0.04, 0.01), dk, 0, 0.32, 0.345); mesh(hd, rbox(0.66, 0.04, 0.04, 0.01), dk, 0, -0.32, 0.345);
      return g; };
    PK.tvCart = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), dk = M("#2b2d31"), sil = MET("#9aa0a6");
      for (const sx of [-1, 1]) { bar(g, [sx * 0.35, 0.08, -0.3], [sx * 0.35, 0.08, 0.3], 0.025, dk); for (const sz of [-1, 1]) wheel(g, sx * 0.35, 0.05, sz * 0.3, 0.05, 0.04, "#1b1b1b"); }
      bar(g, [-0.35, 0.08, 0], [0.35, 0.08, 0], 0.025, dk); bar(g, [0, 0.08, 0], [0, 1.3, 0], 0.035, sil);
      mesh(g, rbox(1.06, 0.64, 0.06, 0.02), M("#121316", { roughness: 0.25, clearcoat: 0.8 }), 0, 1.45, 0.04);
      mesh(g, plane(1.0, 0.58), screenMat(256, 148, (c, W, H) => { const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#132a4a"); gr.addColorStop(1, "#0b1424"); c.fillStyle = gr; c.fillRect(0, 0, W, H); c.fillStyle = "#e8382b"; c.fillRect(0, 0, W, 26); c.fillStyle = "#fff"; c.font = "900 20px Arial Black, Arial"; c.fillText("LIVE", 10, 20); for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? "#5fd0ff" : "#c8ff3e"; const bh = 20 + rnd(i * 5 + 3) * 80; c.fillRect(24 + i * 36, H - 12 - bh, 22, bh); } }, 0.9), 0, 1.45, 0.075);
      return g; };
    PK.waterCooler = (p, x, y, z, ry) => { const g = grp(p, x, y, z, ry), wht = M("#e9ecef");
      for (let k = 0; k < 3; k++) brick(g, "3003", wht, 0, k * BH, 0); brick(g, "3068b", "#cfd4da", 0, 3 * BH, 0);
      face(g, "4073", "#c8102e", -0.12, 2.3 * BH, PT); face(g, "4073", "#2f5fa8", 0.12, 2.3 * BH, PT); brick(g, "3069b", "#5a5f66", 0, 1.5 * BH, PT + 0.175);
      const tb = trans("#6fb8ff", 0.55); brick(g, "3941", tb, 0, 3 * BH + PH, 0); brick(g, "3941", tb, 0, 4 * BH + PH, 0); brick(g, "3062b", tb, 0, 5 * BH + PH, 0, 0, [1, 0.5, 1]);
      mesh(g, cylG(0.31, 0.31, 0.7, 20), trans("#3a8ee8", 0.35), 0, 4 * BH + PH + 0.36, 0);
      brick(g, "3062b", "#f2f3f2", PT + 0.2, 1.8 * BH, 0); return g; };
    PK.teleprompter = (p, x, y, z, ry) => { const g = grp(p, x, y, z, ry), dk = M("#1b1b1b");
      mesh(g, rbox(0.62, 0.5, 0.12, 0.02), dk, 0, 0.0, 0.0); const gl = mesh(g, plane(0.6, 0.55), trans("#a8c8e8", 0.32), 0, 0.12, 0.28, -Math.PI / 4); gl.material.side = THREE.DoubleSide;
      mesh(g, plane(0.5, 0.36), screenMat(128, 92, (c, W, H) => { c.fillStyle = "#05070b"; c.fillRect(0, 0, W, H); c.fillStyle = "#e8eef6"; for (let i = 0; i < 6; i++) c.fillRect(10, 10 + i * 13, W - 20 - (i % 3) * 18, 6); }, 0.8), 0, -0.24, 0.3, -Math.PI / 2);
      for (const sx of [-1, 1]) bar(g, [sx * 0.3, -0.25, 0.0], [sx * 0.3, 0.4, 0.5], 0.012, dk); return g; };
    PK.floorCables = (p, paths, y) => { const g = grp(p, 0, 0, 0); g.userData.noBake = true; paths.forEach(([col, pts]) => tube(g, pts.map((q) => [q[0], y + 0.03, q[1]]), 0.03, M(col, { roughness: 0.55, clearcoat: 0.1 }))); return g; };

    // ================================================================== ACTIVIST OFFICE
    PK.ceilingFan = (p, x, y, z, o) => { o = o || {}; const g = grp(p, x, y, z), br = K.plastic("#5a4632", { metalness: 0.6, roughness: 0.35 });
      bar(g, [0, 0, 0], [0, -0.55, 0], 0.025, br); brick(g, "3941", br, 0, -0.78, 0, 0, [0.8, 0.55, 0.8]); mesh(g, sph(0.15, 16), glow("#ffe2b0", 1.4), 0, -0.82, 0, 0, 0, 0, [1, 0.6, 1]);
      const bl = live(grp(g, 0, -0.62, 0), (t) => { bl.rotation.y = t * (o.speed || 2.4); });
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2, b = grp(bl, 0, 0, 0, a); mesh(b, rbox(0.95, 0.025, 0.22, 0.01), "#6b4226", 0.62, 0, 0, 0.08, 0, 0); bar(b, [0.1, 0, 0], [0.2, 0, 0], 0.02, br); }
      return g; };
    PK.corkBoard = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), w = o.w || 1.0, h = o.h || 0.75;
      mesh(g, rbox(w + 0.08, h + 0.08, 0.05, 0.015), "#5c3a1e", 0, 0, 0);
      mesh(g, plane(w, h), canvasMat(256, Math.round(256 * h / w), (c, W, H) => { c.fillStyle = "#b08a5a"; c.fillRect(0, 0, W, H); for (let i = 0; i < 400; i++) { c.fillStyle = rnd(i) > 0.5 ? "rgba(90,60,30,0.25)" : "rgba(255,230,190,0.18)"; c.fillRect(rnd(i * 3) * W, rnd(i * 7) * H, 2, 2); } }, { roughness: 0.9, clearcoat: 0 }), 0, 0, 0.027);
      const notes = ["#f2cd37", "#f6b8c8", "#9fd8ff", "#f4f2ec", "#c8ff3e", "#f2cd37", "#f4f2ec"], P2 = [];
      for (let i = 0; i < notes.length; i++) { const nx = (-0.38 + (i % 4) * 0.25 + (rnd(i * 5) - 0.5) * 0.05) * w, ny = (i < 4 ? 0.2 : -0.1) * h + (rnd(i * 9) - 0.5) * 0.05; const n2 = face(g, i === 3 ? "3069b" : "3070b", notes[i], nx, ny - 0.08, 0.03, "z", [0.66, 0.2, 0.66]); n2.rotation.z = (rnd(i * 11) - 0.5) * 0.3; mesh(g, sph(0.018, 8), i % 2 ? "#c8102e" : "#2f5fa8", nx, ny + 0.0, 0.06); P2.push([nx, ny + 0.0]); }
      [[0, 5], [5, 2], [2, 6]].forEach(([a, b]) => bar(g, [P2[a][0], P2[a][1], 0.065], [P2[b][0], P2[b][1], 0.065], 0.005, "#c8102e", 5));
      return g; };
    PK.copier = (p, x, y, z, ry) => { const g = grp(p, x, y, z, ry), c = M("#d9dcdf"), dk = M("#4a4f57");
      for (let k = 0; k < 2; k++) { brick(g, "3001", c, 0, k * BH, 0); for (const sx of [-0.35, 0.35]) face(g, "3069b", "#c3c7cc", sx, k * BH + 0.21, PT); bar(g, [-0.25, k * BH + 0.33, PT + 0.17], [0.25, k * BH + 0.33, PT + 0.17], 0.014, dk); }
      brick(g, "3001", c, 0, 2 * BH, 0); brick(g, "3068b", dk, -0.35, 3 * BH, 0); brick(g, "3068b", dk, 0.35, 3 * BH, 0);
      mesh(g, rbox(1.42, 0.06, 0.72, 0.015), c, 0, 3 * BH + PH + 0.03, 0); brick(g, "3040", "#5a5f66", 0.525, 2 * BH, 0.42, 0, [1, 0.5, 0.5]);
      mesh(g, cylG(0.04, 0.04, 0.02, 12), glow("#40ff80", 2.2), 0.6, 2 * BH + 0.16, 0.6, 1.1, 0, 0);
      for (let k = 0; k < 4; k++) brick(g, "3069b", "#f6f4ee", -0.95, 2 * BH + k * 0.02 + 0.02, 0, 0, [0.8, 0.15, 1.6]); mesh(g, rbox(0.5, 0.04, 0.6, 0.01), "#9aa0a6", -0.95, 2 * BH, 0);
      return g; };
    PK.safe = (p, x, y, z, ry) => { const g = grp(p, x, y, z, ry), c = M("#3a3d42");
      for (let k = 0; k < 3; k++) { brick(g, "3003", c, -PT, k * BH, 0); brick(g, "3003", c, PT, k * BH, 0); }
      brick(g, "3068b", "#2b2d31", -PT, 3 * BH, 0); brick(g, "3068b", "#2b2d31", PT, 3 * BH, 0);
      mesh(g, rbox(1.2, 1.1, 0.06, 0.02), "#4a4f57", 0, 0.65, PT + 0.03); face(g, "98138", MET(), 0.15, 0.7, PT + 0.06, "z", 1.4);
      for (let i = 0; i < 3; i++) { const a = i * Math.PI * 2 / 3; bar(g, [-0.28, 0.65, PT + 0.08], [-0.28 + Math.sin(a) * 0.14, 0.65 + Math.cos(a) * 0.14, PT + 0.08], 0.018, MET()); }
      mesh(g, box(0.3, 0.07, 0.01), GOLD(), 0, 1.08, PT + 0.065); return g; };
    PK.pottedPalm = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry, o.s), n = o.n || 4, lf = [M("#2f7a30", { roughness: 0.4 }), M("#4fae44", { roughness: 0.4 })];
      let y0 = 0;
      if (!o.noPot) { brick(g, "3941", o.pot || "#f2f3f2", 0, 0, 0); brick(g, "3941", o.pot || "#f2f3f2", 0, BH, 0); y0 = 2 * BH; for (let i = 0; i < 4; i++) brick(g, "4073", "#4a3020", Math.sin(i * 1.57 + 0.78) * 0.17, y0, Math.cos(i * 1.57 + 0.78) * 0.17); }
      const tr = [M("#7a5534"), M("#5c3f26")]; let tx = 0;
      for (let k = 0; k < n; k++) { tx = (o.lean || 0.035) * k * k; brick(g, "3062b", tr[k % 2], tx, y0 + k * BH, 0); }
      const cy = y0 + n * BH, nf = o.fronds || 7;
      for (let i = 0; i < nf; i++) { const fr = grp(g, tx, cy, 0, i / nf * Math.PI * 2 + 0.3); for (let j = 0; j < 3; j++) { const sg = mesh(fr, part("3023"), lf[(i + j) % 2], 0.28 + j * 0.6, -j * j * 0.07 - j * 0.04, 0, 0, 0, -(0.18 + j * 0.32)); sg.rotation.x = 0; } }
      brick(g, "3062b", "#4fae44", tx, cy - 0.1, 0, 0, [0.9, 0.5, 0.9]);
      if (o.coconuts) for (let i = 0; i < 3; i++) mesh(g, sph(0.07, 12), "#6b4226", tx + Math.sin(i * 2.1) * 0.12, cy - 0.06, Math.cos(i * 2.1) * 0.12);
      return g; };

    // ================================================================== STAGE / THEATRE
    PK.speakerStack = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), blk = M("#1b1b1d", { roughness: 0.5, clearcoat: 0.2 }), cone2 = M("#3a3d42", { roughness: 0.4 });
      for (let k = 0; k < 2; k++) brick(g, "3001", blk, 0, k * BH, 0); brick(g, "3001", blk, 0, 2 * BH, 0);
      for (const sx of [-0.35, 0.35]) { face(g, "3941", cone2, sx, 0.42, PT, "z", [0.95, 0.28, 0.95]); mesh(g, tor(0.34, 0.025), "#2b2b2b", sx, 0.42, PT + 0.02); }
      face(g, "3062b", cone2, 0, 2 * BH + 0.21, PT, "z", [1.0, 0.25, 1.0]); for (const sx of [-0.45, 0.45]) face(g, "4073", MET(), sx, 2 * BH + 0.21, PT, "z");
      if (!o.single) { brick(g, "3003", blk, 0, 3 * BH, 0); brick(g, "3003", blk, 0, 4 * BH, 0); face(g, "3941", cone2, 0, 3 * BH + 0.3, PT, "z", [0.7, 0.26, 0.7]); face(g, "98138", MET(), 0, 4 * BH + 0.26, PT, "z", 0.6); }
      mesh(g, cylG(0.025, 0.025, 0.02, 10), glow("#40ff80", 2.2), 0.55, 0.1, PT + 0.01, Math.PI / 2);
      return g; };
    PK.roadCase = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), blk = M("#1f2023", { roughness: 0.45, clearcoat: 0.3 }), sil = MET(), n = o.n || 2;
      for (let k = 0; k < n; k++) { const yy = k * (2 * BH + 0.06), cg = grp(g, (k % 2) * 0.12, yy, 0, (k % 2) * 0.12); brick(cg, "3001", blk, 0, 0.06, 0); brick(cg, "3001", blk, 0, 0.06 + BH, 0);
        for (const sx of [-0.66, 0.66]) for (const yy2 of [0.1, 0.84]) for (const sz of [-1, 1]) mesh(cg, box(0.1, 0.1, 0.1), sil, sx, yy2, sz * 0.33);
        bar(cg, [-0.2, 0.62, PT + 0.03], [0.2, 0.62, PT + 0.03], 0.016, sil); mesh(cg, box(0.5, 0.02, 0.01), sil, 0, 0.46, PT + 0.005);
        mesh(cg, box(0.3, 0.12, 0.01), M("#f2cd37"), -0.35, 0.3, PT + 0.006);
        if (k === 0) for (const sx of [-0.55, 0.55]) for (const sz of [-0.25, 0.25]) wheel(cg, sx, 0.04, sz, 0.04, 0.04, "#2b2b2b"); }
      return g; };
    PK.cableSpool = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), wood = M("#8a5a32", { roughness: 0.6, clearcoat: 0.1 }), r = 0.42;
      for (const s of [-1, 1]) { mesh(g, cylG(r, r, 0.06, 28), wood, s * 0.28, r, 0, 0, 0, Math.PI / 2); }
      mesh(g, part("3941"), "#6b4a2e", -0.21, r, 0, 0, 0, -Math.PI / 2);
      for (let i = 0; i < 6; i++) mesh(g, tor(0.24 + (i % 2) * 0.03, 0.045), o.col || "#f28c28", -0.2 + i * 0.08, r, 0, 0, Math.PI / 2, 0);
      tube(g, [[0.15, r + 0.27, 0.05], [0.3, r + 0.1, 0.4], [0.55, 0.06, 0.6], [0.95, 0.04, 0.5]], 0.04, M(o.col || "#f28c28"));
      return g; };
    PK.stageLadder = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), al = MET("#a8adb3"), n = o.n || 7;
      const ld = grp(g, 0, 0, 0); ld.rotation.x = o.lean == null ? -0.2 : -o.lean;
      for (const sx of [-0.3, 0.3]) for (let k = 0; k < n; k++) brick(ld, "3062b", al, sx, k * BH, 0);
      for (let k = 1; k < n; k++) mesh(ld, rbox(0.62, 0.05, 0.1, 0.01), al, 0, k * BH, 0);
      return g; };
    PK.barrel = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), c = M(o.col || "#7a4e2e");
      brick(g, "3941", c, 0, 0, 0); brick(g, "3941", c, 0, BH, 0); for (const yy of [0.1, 0.42, 0.74]) mesh(g, tor(0.355, 0.018), "#3a3d42", 0, yy, 0, Math.PI / 2);
      return g; };

    // ================================================================== THEME PARK
    PK.hotdogCart = (p, x, y, z, ry) => { const g = grp(p, x, y, z, ry), wht = M("#f4f2ec"), red = M("#c8102e"), sil = MET();
      brick(g, "3001", wht, 0, 0.2, 0); brick(g, "3001", red, 0, 0.2 + BH, 0); brick(g, "3001", wht, 0, 0.2 + 2 * BH, 0);
      for (const sx of [-0.35, 0.35]) brick(g, "3068b", sil, sx, 0.2 + 3 * BH, 0);
      wheel(g, -0.35, 0.26, 0.44, 0.26, 0.08); wheel(g, -0.35, 0.26, -0.44, 0.26, 0.08); brick(g, "3062b", "#2b2b2b", 0.55, 0, 0, 0, [0.6, 0.5, 0.6]);
      bar(g, [0.7, 0.9, 0], [1.0, 0.95, 0], 0.025, sil);
      const top = 0.2 + 3 * BH + PH;
      for (let i = 0; i < 2; i++) { brick(g, "3069b", "#d8a25a", -0.2 + i * 0.42, top, 0.12, 0, [0.6, 0.6, 0.8]); mesh(g, cylG(0.04, 0.04, 0.4, 10), "#a8442a", -0.2 + i * 0.42, top + 0.1, 0.12, 0, 0, Math.PI / 2); }
      brick(g, "3062b", "#c8102e", 0.45, top, -0.15, 0, [0.6, 0.8, 0.6]); brick(g, "3062b", "#f2cd37", 0.6, top, -0.15, 0, [0.6, 0.8, 0.6]);
      bar(g, [-0.55, top, -0.2], [-0.55, top + 1.35, -0.2], 0.025, sil);
      const um = canvasMat(256, 64, (c, W, H) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#f4f2ec" : "#c8102e"; c.fillRect(i * W / 8, 0, W / 8, H); } }, { side: THREE.DoubleSide });
      const cn = new THREE.Mesh(cone(0.85, 0.32, 16, true), um); cn.position.set(-0.55, top + 1.42, -0.2); cn.castShadow = true; g.add(cn);
      const sg = new THREE.Mesh(plane(0.9, 0.26), canvasMat(256, 74, (c, W, H) => { c.fillStyle = "#f2cd37"; c.fillRect(0, 0, W, H); c.fillStyle = "#c8102e"; c.font = "900 46px Arial Black, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("HOT DOGS", W / 2, H / 2 + 2); }));
      sg.position.set(0, 0.2 + 1.5 * BH, PT + 0.01); g.add(sg);
      return g; };
    PK.waterFountain = (p, x, y, z, o) => { o = o || {}; const g = grp(p, x, y, z), stone = M("#b8b2a8", { roughness: 0.5, clearcoat: 0.15 }), st2 = M("#a8a296", { roughness: 0.5, clearcoat: 0.15 }), R = o.r || 1.0, n = o.n || Math.round(2 * Math.PI * (o.r || 1.0) / 0.64);
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; brick(g, "3004", i % 2 ? stone : st2, Math.sin(a) * R, 0, Math.cos(a) * R, a, [R * 2 * Math.PI / n / 0.7 + 0.02, 1, 1]); brick(g, "3069b", "#d8d2c6", Math.sin(a) * R, BH, Math.cos(a) * R, a, [R * 2 * Math.PI / n / 0.7 + 0.04, 1, 1.15]); }
      const wm = new THREE.MeshPhysicalMaterial({ color: "#3a8ee8", roughness: 0.05, transparent: true, opacity: 0.78, clearcoat: 1 });
      const wt = new THREE.Mesh(cylG(R - 0.12, R - 0.12, 0.04, 40), wm); wt.position.y = BH - 0.08; wt.receiveShadow = true; g.add(wt);
      brick(g, "3941", stone, 0, 0, 0); brick(g, "3941", stone, 0, BH, 0); brick(g, "3062b", st2, 0, 2 * BH, 0); brick(g, "3062b", st2, 0, 3 * BH, 0);
      mesh(g, cylG(0.5, 0.22, 0.16, 28), stone, 0, 4 * BH + 0.02, 0); const w2 = new THREE.Mesh(cylG(0.44, 0.44, 0.02, 28), wm); w2.position.y = 4 * BH + 0.09; g.add(w2);
      brick(g, "3062b", st2, 0, 4 * BH + 0.1, 0, 0, [0.8, 0.8, 0.8]); brick(g, "98138", "#d8d2c6", 0, 4 * BH + 0.1 + 0.34, 0);
      const dm = new THREE.MeshBasicMaterial({ color: new THREE.Color("#a8dcff").multiplyScalar(0.95), toneMapped: false, transparent: true, opacity: 0.6, depthWrite: false });
      const dg = grp(g, 0, 0, 0), D = [], dgeo = part("4073");
      for (let i = 0; i < 24; i++) { const m = new THREE.Mesh(dgeo, dm); m.scale.setScalar(0.55); dg.add(m); D.push(m); }
      const top = 4 * BH + 0.55;
      live(dg, (t) => D.forEach((m, i) => { const big = i < 12, ph = ((t * (big ? 0.9 : 1.2) + rnd(i) * 1.0) % 1), a = i / (big ? 12 : 12) * Math.PI * 2 + (big ? 0 : 0.26);
        const r0 = big ? 0.05 : 0.46, r1 = big ? 0.42 : R - 0.25, h0 = big ? top : 4 * BH + 0.1, up = big ? 0.35 : 0.18, hEnd = big ? 4 * BH + 0.1 : BH - 0.06;
        const rr = r0 + (r1 - r0) * ph, yy = h0 + up * 4 * ph * (1 - ph) - (h0 - hEnd) * ph * ph; m.position.set(Math.sin(a) * rr, yy, Math.cos(a) * rr); m.scale.setScalar(0.42 * (1 - 0.5 * ph)); }));
      return g; };
    PK.lanternPost = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), blk = M("#22262c", { roughness: 0.4, clearcoat: 0.3 }), n = o.n || 7;
      brick(g, "3941", blk, 0, 0, 0); for (let k = 0; k < n; k++) brick(g, "3062b", blk, 0, BH + k * BH, 0);
      const h = BH + n * BH; brick(g, "3023", blk, -PT / 2, h, 0); brick(g, "3023", blk, PT / 2, h, 0); bar(g, [-0.62, h + 0.07, 0], [0.62, h + 0.07, 0], 0.03, blk);
      brick(g, "4073", GOLD(), 0, h + PH, 0); mesh(g, sph(0.05, 10), GOLD(), 0, h + PH + 0.18, 0);
      for (const s of [-1, 1]) { bar(g, [s * 0.6, h + 0.07, 0], [s * 0.6, h - 0.08, 0], 0.015, blk); brick(g, "4073", blk, s * 0.6, h - 0.14, 0); mesh(g, sph(0.15, 18), glow(o.col || "#ffe2a8", o.k || 1.6), s * 0.6, h - 0.3, 0); brick(g, "4073", blk, s * 0.6, h - 0.5, 0, 0, [0.8, 1, 0.8]); }
      if (o.light) { const l = new THREE.PointLight("#ffcf8a", o.light, 7, 1.7); l.position.set(0, h - 0.4, 0.3); g.add(l); }
      return g; };
    PK.conifer = (p, x, y, z, s, o) => { o = o || {}; const g = grp(p, x, y, z, rnd(x * 3 + z) * 6, s || 1), d1 = M(o.c1 || "#1f5a32", { roughness: 0.4 }), d2 = M(o.c2 || "#2a6a3a", { roughness: 0.4 });
      brick(g, "3062b", "#5c3f26", 0, 0, 0); brick(g, "3062b", "#5c3f26", 0, BH, 0);
      [[8, 0.62, 0], [7, 0.5, 1], [6, 0.38, 2], [5, 0.25, 3]].forEach(([n, r, k]) => { const yy = 2 * BH + k * BH * 0.92; brick(g, "3941", d1, 0, yy, 0, 0, [Math.max(0.5, r * 1.6), 1, Math.max(0.5, r * 1.6)]);
        for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + k * 0.35; brick(g, "3039", (i + k) % 2 ? d1 : d2, Math.sin(a) * r, yy, Math.cos(a) * r, a); } });
      brick(g, "3062b", d2, 0, 2 * BH + 4 * BH * 0.92, 0); brick(g, "4073", d1, 0, 3 * BH + 4 * BH * 0.92, 0);
      return g; };
    PK.ticketBooth = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), red = M("#c8102e"), cream = M("#f2e6c8"), w = 1.4, d = 1.4;
      for (let r = 0; r < 6; r++) { const c = r % 2 ? red : cream; for (const sx of [-1, 1]) brick(g, "3004", c, sx * (w / 2 - PT / 2), r * BH, 0, Math.PI / 2); brick(g, "3010", c, 0, r * BH, -d / 2 + PT / 2);
        if (r < 2 || r > 4) brick(g, "3010", c, 0, r * BH, d / 2 - PT / 2); }
      mesh(g, box(w - 0.5, BH * 3 - 0.02, 0.02), glow("#ffcf8a", 0.9), 0, 3.5 * BH, d / 2 - 0.4); brick(g, "3069b", "#5c3a1e", 0, 2 * BH, d / 2 - PT / 2, 0, [1.4, 1, 1.3]);
      for (let i = 0; i < 4; i++) { brick(g, "3039", i % 2 ? red : cream, -w / 2 + 0.175 + i * 0.35, 6 * BH, -0.35, Math.PI, [0.5, 1, 1]); brick(g, "3039", i % 2 ? cream : red, -w / 2 + 0.175 + i * 0.35, 6 * BH, 0.35, 0, [0.5, 1, 1]); }
      const sg = new THREE.Mesh(plane(1.1, 0.28), canvasMat(256, 66, (c, W, H) => { c.fillStyle = "#2f5fa8"; c.fillRect(0, 0, W, H); c.fillStyle = "#f2cd37"; c.font = "900 44px Arial Black, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TICKETS", W / 2, H / 2 + 2); }));
      sg.position.set(0, 6 * BH + 0.55, d / 2 + 0.05); g.add(sg); mesh(g, rbox(1.16, 0.34, 0.06, 0.015), "#2f5fa8", 0, 6 * BH + 0.55, d / 2 + 0.01); for (const sx of [-0.4, 0.4]) bar(g, [sx, 6 * BH, d / 2 - 0.02], [sx, 6 * BH + 0.4, d / 2 - 0.02], 0.02, "#2b2b2b");
      return g; };
    PK.dog = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry, o.s || 1), c = M(o.col || "#a8743a"), dk = M("#3a2a1e");
      brick(g, "3004", c, 0, 0.2, 0, 0, [0.75, 0.6, 0.8]);
      for (const sx of [-0.2, 0.2]) for (const sz of [-0.08, 0.08]) brick(g, "3005", c, sx, 0, sz, 0, [0.42, 0.85, 0.42]);
      const hd = live(grp(g, 0.3, 0.42, 0), (t) => { hd.rotation.z = 0.08 * Math.sin(t * 1.7 + x); });
      brick(hd, "3005", c, 0.02, 0, 0, 0, [0.75, 0.8, 0.8]); brick(hd, "3024", c, 0.17, 0.02, 0, 0, [0.5, 0.9, 0.6]); mesh(hd, sph(0.025, 8), "#111", 0.27, 0.12, 0);
      for (const sz of [-0.1, 0.1]) { mesh(hd, box(0.08, 0.14, 0.03), dk, -0.02, 0.28, sz, 0.3 * Math.sign(sz)); mesh(hd, sph(0.018, 8), "#111", 0.12, 0.25, sz * 0.7); }
      const tl = live(grp(g, -0.27, 0.42, 0), (t) => { tl.rotation.y = 0.55 * Math.sin(t * 9 + z); });
      bar(tl, [0, 0, 0], [-0.12, 0.16, 0], 0.025, c); mesh(g, tor(0.1, 0.012), M("#c8102e"), 0.3, 0.45, 0, 0, Math.PI / 2, 0, [1, 1, 1]);
      return g; };

    // ================================================================== STREET
    PK.newspaperBox = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), c = M(o.col || "#2f5fa8");
      brick(g, "3003", c, 0, 0.14, 0); brick(g, "3003", c, 0, 0.14 + BH, 0); brick(g, "3039", c, 0, 0.14 + 2 * BH, 0); for (const sx of [-0.25, 0.25]) for (const sz of [-0.25, 0.25]) brick(g, "3005", "#2b2b2b", sx, 0, sz, 0, [0.5, 0.33, 0.5]);
      mesh(g, rbox(0.62, 0.36, 0.03, 0.01), "#1b1b1b", 0, 0.14 + 1.5 * BH, PT + 0.01);
      mesh(g, plane(0.54, 0.3), canvasMat(160, 90, (cc, W, H) => { cc.fillStyle = "#efece2"; cc.fillRect(0, 0, W, H); cc.fillStyle = "#1b1b1b"; cc.font = "900 24px Arial Black, Arial"; cc.textAlign = "center"; cc.fillText(o.title || "DAILY", W / 2, 26); cc.fillStyle = "#c8102e"; cc.font = "900 16px Arial Black, Arial"; cc.fillText(o.head || "MARKETS", W / 2, 48); cc.fillStyle = "#8a8a8a"; for (let i = 0; i < 3; i++) cc.fillRect(12, 58 + i * 10, W - 24, 5); }), 0, 0.14 + 1.5 * BH, PT + 0.03);
      mesh(g, box(0.12, 0.03, 0.02), MET(), 0.22, 0.14 + 0.15, PT + 0.01); return g; };
    PK.recyclingBins = (p, x, y, z, ry) => { const g = grp(p, x, y, z, ry);
      [["#3a7a3e", -PT - 0.02], ["#2f5fa8", PT + 0.02]].forEach(([c, sx]) => { brick(g, "3003", c, sx, 0, 0); brick(g, "3003", c, sx, BH, 0); brick(g, "3039", c, sx, 2 * BH, 0); face(g, "98138", "#f4f2ec", sx, 1.3 * BH, PT, "z", 1.2); mesh(g, box(0.4, 0.04, 0.02), "#1b1b1b", sx, 2 * BH + 0.2, 0.1); });
      return g; };
    PK.bicycle = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), fc = M(o.col || "#c8102e"), sil = MET(), r = 0.3;
      for (const sx of [-0.45, 0.45]) { mesh(g, tor(r, 0.035), "#1b1b1b", sx, r + 0.035, 0); mesh(g, cylG(0.04, 0.04, 0.1, 10), sil, sx, r + 0.035, 0, Math.PI / 2); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; bar(g, [sx, r + 0.035, 0], [sx + Math.cos(a) * r, r + 0.035 + Math.sin(a) * r, 0], 0.006, sil, 4); } }
      const B = [-0.45, r + 0.035, 0], F = [0.45, r + 0.035, 0], P = [-0.02, r + 0.035, 0], Sx = [-0.15, 0.72, 0], H = [0.32, 0.78, 0];
      bar(g, B, P, 0.022, fc); bar(g, B, Sx, 0.022, fc); bar(g, P, Sx, 0.026, fc); bar(g, P, H, 0.026, fc); bar(g, Sx, H, 0.024, fc); bar(g, H, F, 0.022, fc);
      bar(g, Sx, [-0.18, 0.82, 0], 0.016, sil); mesh(g, rbox(0.2, 0.05, 0.09, 0.02), "#1b1b1b", -0.19, 0.85, 0); bar(g, H, [0.3, 0.95, 0], 0.018, sil); bar(g, [0.3, 0.95, -0.22], [0.3, 0.95, 0.22], 0.016, sil);
      for (const s of [-1, 1]) mesh(g, cylG(0.024, 0.024, 0.08, 8), "#1b1b1b", 0.3, 0.95, s * 0.24, Math.PI / 2); mesh(g, tor(0.07, 0.014), sil, -0.02, r + 0.035, 0.04);
            return g; };
    PK.trafficCone = (p, x, y, z, ry) => { const g = grp(p, x, y, z, ry); brick(g, "3068b", "#1b1b1b", 0, 0, 0, 0, [0.85, 0.5, 0.85]); mesh(g, cone(0.2, 0.6, 18), "#f26a1b", 0, 0.07 + 0.3, 0); mesh(g, cylG(0.105, 0.135, 0.11, 18), "#f4f2ec", 0, 0.38, 0); brick(g, "4073", "#f26a1b", 0, 0.62, 0, 0, 0.5); return g; };
    PK.hedge = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), n = o.n || 3, rows = o.rows || 2, gr = [M("#2f6a34", { roughness: 0.45 }), M("#3a7a3c", { roughness: 0.45 }), M("#28602e", { roughness: 0.45 })], L = n * 1.4;
      if (o.box) { for (let i = 0; i < n; i++) brick(g, "3001", o.box, -L / 2 + 0.7 + i * 1.4, 0, 0); }
      const y0 = o.box ? BH : 0;
      for (let r = 0; r < rows; r++) { if (r % 2 === 0) for (let i = 0; i < n; i++) brick(g, "3001", gr[(i + r) % 3], -L / 2 + 0.7 + i * 1.4, y0 + r * BH, 0); else { brick(g, "3003", gr[r % 3], -L / 2 + 0.35, y0 + r * BH, 0); for (let i = 0; i < n - 1; i++) brick(g, "3001", gr[(i + r + 1) % 3], -L / 2 + 1.4 + i * 1.4, y0 + r * BH, 0); brick(g, "3003", gr[(r + 2) % 3], L / 2 - 0.35, y0 + r * BH, 0); } }
      const yt = y0 + rows * BH; let k = 0;
      for (let i = 0; i < n * 4; i++) for (let j = 0; j < 2; j++) { k++; if (rnd(k * 3.3 + n) < 0.45) continue; const fl = o.flowers && rnd(k * 7.1) > 0.8; brick(g, fl ? "4073" : rnd(k) > 0.5 ? "4073" : "3062b", fl ? o.flowers[k % o.flowers.length] : gr[k % 3], -L / 2 + 0.175 + i * 0.35, yt, -0.175 + j * 0.35, 0, fl ? 1 : rnd(k) > 0.5 ? 1 : [1, 0.45, 1]); }
      return g; };
    PK.pigeons = (p, list) => { const g = grp(p, 0, 0, 0), body = M("#6f767e", { roughness: 0.45 }), dk = M("#3f454c", { roughness: 0.45 }), neck = M("#4a6a5a", { roughness: 0.3, metalness: 0.3 }), H = [];
      list.forEach(([x, y, z, ry], i) => { const b = grp(g, x, y, z, ry); brick(b, "3040", body, 0, 0.02, -0.02, Math.PI, [0.42, 0.42, 0.42]); mesh(b, sph(0.075, 12), body, 0, 0.11, 0.02, 0, 0, 0, [0.85, 0.8, 1.25]);
        mesh(b, box(0.012, 0.06, 0.012), "#c86a5a", -0.03, 0.03, 0.03); mesh(b, box(0.012, 0.06, 0.012), "#c86a5a", 0.03, 0.03, 0.03);
        const hd = grp(b, 0, 0.16, 0.08); mesh(hd, sph(0.05, 10), neck, 0, -0.02, 0); mesh(hd, sph(0.045, 10), dk, 0, 0.04, 0.03); mesh(hd, cone(0.012, 0.04, 6), "#e8b04a", 0, 0.035, 0.085, Math.PI / 2); H.push([hd, i]); });
      live(g, (t) => H.forEach(([hd, i]) => { const k = Math.max(0, Math.sin(t * 3.1 + i * 2.3)); hd.rotation.x = 0.9 * k * k * k; }));
      return g; };
    function carBody(g, len, col, h) { const pm = M(col, { roughness: 0.32, clearcoat: 0.55 }); mesh(g, rbox(len, 0.2, 1.36), "#1b1b1b", 0, 0.32, 0); mesh(g, rbox(len, h || 0.42, 1.34), pm, 0, 0.42 + (h || 0.42) / 2, 0); return pm; }
    PK.taxi = (p, x, y, z, ry) => { const g = grp(p, x, y, z, ry), Y = "#f2c21b", pm = carBody(g, 3.1, Y), gl = GLASS();
      studs(g, pm, 0.95, -0.525, 2, 3, 0.84);
      mesh(g, rbox(1.5, 0.5, 1.28), pm, -0.3, 1.09, 0); for (const s of [-1, 1]) { mesh(g, box(1.24, 0.32, 0.02), gl, -0.3, 1.12, s * 0.645); brick(g, "3039", gl, 0.6, 0.84, s * 0.35, Math.PI / 2); brick(g, "3039", gl, -1.25, 0.84, s * 0.35, -Math.PI / 2); }
      for (const s of [-1, 1]) brick(g, "3068b", "#f4f2ec", -0.3, 1.34, s * 0.35, 0, [1, 0.6, 1]);
      mesh(g, rbox(0.62, 0.2, 0.3, 0.03), "#f4f2ec", -0.3, 1.52, 0); for (const s of [-1, 1]) { const tp = new THREE.Mesh(plane(0.56, 0.16), screenMat(128, 36, (c, W, H) => { c.fillStyle = "#fff8e0"; c.fillRect(0, 0, W, H); c.fillStyle = "#1b1b1b"; c.font = "900 30px Arial Black, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TAXI", W / 2, H / 2 + 2); }, 1.2)); tp.position.set(-0.3, 1.52, s * 0.152); tp.rotation.y = s > 0 ? 0 : Math.PI; g.add(tp); }
      for (let i = 0; i < 8; i++) for (const s of [-1, 1]) face(g, "3070b", i % 2 ? "#1b1b1b" : "#f4f2ec", -1.225 + i * 0.35, 0.53, s * 0.67, s > 0 ? "z" : "-z", [1, 0.35, 0.5]);
      for (const s of [-1, 1]) { mesh(g, cylG(0.09, 0.09, 0.05, 12), glow("#fff6d0", 1.6), 1.56, 0.68, s * 0.45, 0, 0, Math.PI / 2); mesh(g, cylG(0.08, 0.08, 0.05, 12), glow("#ff3030", 1.2), -1.56, 0.68, s * 0.45, 0, 0, Math.PI / 2); }
      for (const [wx, wz] of [[0.95, 0.72], [0.95, -0.72], [-0.95, 0.72], [-0.95, -0.72]]) wheel(g, wx, 0.3, wz, 0.3, 0.24);
      return g; };
    PK.van = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), wht = M(o.col || "#eeeae0", { roughness: 0.32, clearcoat: 0.55 }), gl = GLASS(), stripe = o.stripe || "#2f8fd0";
      mesh(g, rbox(3.6, 0.2, 1.4), "#1b1b1b", 0, 0.32, 0); mesh(g, rbox(2.6, 1.5, 1.4, 0.04), wht, -0.5, 1.17, 0); mesh(g, rbox(1.0, 0.62, 1.38), wht, 1.3, 0.73, 0);
      for (const s of [-1, 1]) { brick(g, "3039", gl, 1.0, 1.04, s * 0.35, Math.PI / 2, [1, 1.2, 1]); mesh(g, box(0.5, 0.36, 0.02), gl, 0.55, 1.42, s * 0.71); }
      for (let i = 0; i < 6; i++) for (const s of [-1, 1]) face(g, "3069b", stripe, -1.55 + i * 0.4, 0.98, s * 0.71, s > 0 ? "z" : "-z", [0.57, 0.3, 0.7]);
      for (const s of [-1, 1]) { const tp = new THREE.Mesh(plane(1.5, 0.3), canvasMat(256, 52, (c, W, H) => { c.fillStyle = "#eeeae0"; c.fillRect(0, 0, W, H); c.fillStyle = stripe; c.font = "900 38px Arial Black, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(o.text || "PARCELS", W / 2, H / 2 + 2); })); tp.position.set(-0.6, 1.4, s * 0.712); tp.rotation.y = s > 0 ? 0 : Math.PI; g.add(tp); }
      for (const s of [-1, 1]) { mesh(g, cylG(0.09, 0.09, 0.05, 12), glow("#fff6d0", 1.6), 1.81, 0.68, s * 0.48, 0, 0, Math.PI / 2); mesh(g, box(0.05, 0.22, 0.12), glow("#ff3030", 1.2), -1.82, 0.9, s * 0.55); }
      mesh(g, box(0.02, 1.3, 0.02), "#9aa0a6", -1.81, 1.17, 0);
      for (const [wx, wz] of [[1.15, 0.72], [1.15, -0.72], [-1.15, 0.72], [-1.15, -0.72]]) wheel(g, wx, 0.3, wz, 0.3, 0.24);
      return g; };
    PK.scooter = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), c = M(o.col || "#7fd0c0", { roughness: 0.3, clearcoat: 0.6 }), sil = MET();
      wheel(g, 0.42, 0.17, 0, 0.17, 0.09, "#9aa0a6"); wheel(g, -0.4, 0.17, 0, 0.17, 0.09, "#9aa0a6");
      mesh(g, rbox(0.7, 0.08, 0.3, 0.02), c, 0.02, 0.26, 0); mesh(g, rbox(0.42, 0.32, 0.34, 0.06), c, -0.32, 0.42, 0); mesh(g, rbox(0.36, 0.08, 0.26, 0.03), "#5c3a1e", -0.3, 0.62, 0);
      const fs = mesh(g, rbox(0.1, 0.5, 0.3, 0.04), c, 0.38, 0.5, 0); fs.rotation.z = -0.25; bar(g, [0.42, 0.3, 0], [0.34, 0.95, 0], 0.025, sil); bar(g, [0.34, 0.95, -0.24], [0.34, 0.95, 0.24], 0.02, sil);
      mesh(g, sph(0.06, 12), glow("#fff6d0", 1.4), 0.4, 0.88, 0); for (const s of [-1, 1]) { mesh(g, cylG(0.024, 0.024, 0.08, 8), "#1b1b1b", 0.34, 0.95, s * 0.26, Math.PI / 2); bar(g, [0.34, 0.95, s * 0.18], [0.3, 1.1, s * 0.22], 0.008, sil); mesh(g, sph(0.03, 8), sil, 0.3, 1.11, s * 0.22); }
      bar(g, [-0.1, 0.22, 0.12], [-0.05, 0.02, 0.22], 0.012, sil);
      g.rotation.x = -0.04; return g; };

    // ================================================================== HALL
    PK.ropeBarrier = (p, pts, y, o) => { o = o || {}; const g = grp(p, 0, y, 0), gold = GOLD(), rope = M(o.rope || "#8a1424", { roughness: 0.7, clearcoat: 0.0 });
      pts.forEach(([x, z]) => { brick(g, "3941", gold, x, 0, z, 0, [0.62, 0.22, 0.62]); brick(g, "3062b", gold, x, 0.09, z); brick(g, "3062b", gold, x, 0.09 + BH, z, 0, [0.8, 1, 0.8]); mesh(g, sph(0.07, 12), gold, x, 0.09 + 2 * BH + 0.04, z); });
      for (let i = 0; i < pts.length - 1; i++) { if (o.gaps && o.gaps.includes(i)) continue; const [x0, z0] = pts[i], [x1, z1] = pts[i + 1], hy = 0.09 + 2 * BH - 0.06;
        tube(g, [[x0, hy, z0], [(x0 * 3 + x1) / 4, hy - 0.14, (z0 * 3 + z1) / 4], [(x0 + x1) / 2, hy - 0.2, (z0 + z1) / 2], [(x0 + x1 * 3) / 4, hy - 0.14, (z0 + z1 * 3) / 4], [x1, hy, z1]], 0.028, rope); }
      g.userData.noBake = false; return g; };
    PK.securityDesk = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), c = M("#3a3d42"), c2 = M("#4a4f57"), w = 2.8;
      for (let r = 0; r < 2; r++) for (let i = 0; i < 2; i++) brick(g, "3001", r % 2 ? c2 : c, -0.7 + i * 1.4 + (r % 2 ? 0 : 0), r * BH, 0);
      for (let i = 0; i < 4; i++) brick(g, "3068b", "#1b1b1b", -1.05 + i * 0.7, 2 * BH, 0, 0, [1, 1, 1.15]);
      mesh(g, rbox(1.6, 0.3, 0.04, 0.01), "#1d2b44", 0, 0.5, PT + 0.03); mesh(g, plane(1.5, 0.24), canvasMat(320, 48, (cc, W, H) => { cc.fillStyle = "#1d2b44"; cc.fillRect(0, 0, W, H); cc.fillStyle = "#f4f2ec"; cc.font = "900 34px Arial Black, Arial"; cc.textAlign = "center"; cc.textBaseline = "middle"; cc.fillText(o.text || "SECURITY", W / 2, H / 2 + 2); }), 0, 0.5, PT + 0.052);
      const top = 2 * BH + PH; const mon = grp(g, -0.6, top, -0.05, 0.3); mesh(mon, rbox(0.12, 0.02, 0.1, 0.005), "#2b2b2b", 0, 0.01, 0); bar(mon, [0, 0.02, 0], [0, 0.18, 0], 0.015, "#2b2b2b"); mesh(mon, rbox(0.5, 0.32, 0.04, 0.01), "#121316", 0, 0.34, 0);
      mesh(mon, plane(0.46, 0.28), screenMat(128, 78, (cc, W, H) => { cc.fillStyle = "#0b1424"; cc.fillRect(0, 0, W, H); for (let i = 0; i < 4; i++) { cc.fillStyle = ["#1d3a5a", "#2a3a2a", "#3a2a3a", "#2a3a4a"][i]; cc.fillRect((i % 2) * W / 2 + 2, Math.floor(i / 2) * H / 2 + 2, W / 2 - 4, H / 2 - 4); } }, 0.8), 0, 0.34, -0.022).rotation.y = Math.PI;
      mesh(g, rbox(0.34, 0.03, 0.24, 0.006), "#f6f4ee", 0.5, top + 0.015, 0.05); bar(g, [0.45, top + 0.04, 0.0], [0.62, top + 0.04, 0.1], 0.008, "#2f5fa8", 5);
      brick(g, "3062b", "#2b2b2b", 0.95, top, 0.0, 0, [0.6, 0.6, 0.6]); mesh(g, rbox(0.14, 0.05, 0.08, 0.01), "#1b1b1b", 0.95, top + 0.28, 0.0);
      return g; };
    PK.pressCamera = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), dk = M("#2b2b2b", { metalness: 0.4 }), h = o.h || 1.45;
      for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2 + 0.5; bar(g, [0, h, 0], [Math.sin(a) * 0.42, 0.02, Math.cos(a) * 0.42], 0.018, dk); }
      const hd = grp(g, 0, h + 0.02, 0); brick(hd, "3004", "#1b1b1b", 0, 0, 0, Math.PI / 2, [0.9, 0.7, 1.0]); face(hd, "3062b", "#1b1b1b", 0, 0.15, 0.35, "z", [1.1, 0.8, 1.1]); face(hd, "98138", GLASS(), 0, 0.15, 0.68, "z", 0.9);
      mesh(hd, rbox(0.06, 0.08, 0.22, 0.01), "#1b1b1b", 0.0, 0.34, -0.05); mesh(hd, cylG(0.02, 0.02, 0.02, 8), glow("#ff3030", 3), 0.14, 0.24, 0.2, Math.PI / 2);
      return g; };
    PK.vendingMachine = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), c = M(o.col || "#b0202a");
      for (let k = 0; k < 5; k++) brick(g, "3001", c, 0, k * BH, 0); brick(g, "3068b", "#7a1018", -0.35, 5 * BH, 0); brick(g, "3068b", "#7a1018", 0.35, 5 * BH, 0);
      mesh(g, rbox(0.98, 1.4, 0.04, 0.01), "#1b1b1b", -0.16, 1.3, PT + 0.02);
      mesh(g, plane(0.92, 1.34), screenMat(160, 232, (cc, W, H) => { cc.fillStyle = "#e9f2f8"; cc.fillRect(0, 0, W, H); cc.fillStyle = "#1d2b44"; cc.fillRect(0, 0, W, 30); cc.fillStyle = "#fff"; cc.font = "900 18px Arial Black, Arial"; cc.textAlign = "center"; cc.fillText("COLD DRINKS", W / 2, 21);
        const cs = ["#e8382b", "#2f8fd0", "#3fa34d", "#f2cd37", "#f4f2ec", "#d64fa0"]; for (let r = 0; r < 5; r++) { cc.fillStyle = "#c9d2da"; cc.fillRect(4, 74 + r * 38, W - 8, 4); for (let i = 0; i < 5; i++) { cc.fillStyle = cs[(r * 2 + i) % cs.length]; cc.beginPath(); cc.roundRect(10 + i * 29, 44 + r * 38, 20, 30, 5); cc.fill(); cc.fillStyle = "rgba(255,255,255,0.35)"; cc.fillRect(13 + i * 29, 47 + r * 38, 4, 22); } } }, 1.05), -0.16, 1.3, PT + 0.045);
      mesh(g, rbox(0.3, 0.9, 0.04, 0.01), "#2b2d31", 0.52, 1.35, PT + 0.02); for (let i = 0; i < 6; i++) face(g, "98138", MET(), 0.52, 1.0 + i * 0.12, PT + 0.03, "z", 0.6); mesh(g, box(0.14, 0.04, 0.02), "#111", 0.52, 1.72, PT + 0.045);
      mesh(g, rbox(0.8, 0.22, 0.04, 0.02), "#111214", -0.16, 0.32, PT + 0.02); return g; };
    PK.balloonBunch = (p, x, y, z, o) => { o = o || {}; const g = grp(p, x, y, z), cols = o.cols || ["#e8382b", "#f2cd37", "#2f8fd0", "#f4f2ec", "#3fa34d"];
      brick(g, "3005", MET(), 0, 0, 0); const bg = live(grp(g, 0, BH, 0), (t) => { bg.rotation.z = 0.05 * Math.sin(t * 1.1 + x); bg.rotation.x = 0.04 * Math.sin(t * 0.9 + z * 2); });
      cols.forEach((c, i) => { const a = i / cols.length * Math.PI * 2, r = 0.22 + (i % 2) * 0.08, hy = (o.h || 1.7) + (i % 3) * 0.22, px = Math.sin(a) * r, pz = Math.cos(a) * r;
        bar(bg, [0, 0, 0], [px, hy - 0.2, pz], 0.005, "#e8e8e8", 4); const b = mesh(bg, sph(0.18, 20), M(c, { roughness: 0.2, clearcoat: 0.9 }), px, hy, pz, 0, 0, 0, [1, 1.15, 1]); mesh(bg, cone(0.03, 0.05, 8), c, px, hy - 0.22, pz); });
      return g; };

    // ================================================================== STUDIO (CTA)
    PK.ringLight = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), dk = M("#1b1b1b"), h = o.h || 1.7;
      for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2; bar(g, [0, 0.6, 0], [Math.sin(a) * 0.32, 0.02, Math.cos(a) * 0.32], 0.016, dk); }
      bar(g, [0, 0.6, 0], [0, h - 0.36, 0], 0.022, dk); mesh(g, tor(0.36, 0.05), dk, 0, h, -0.02); mesh(g, tor(0.36, 0.035), glow(o.col || "#fff4e6", o.k || 1.8), 0, h, 0.02);
      mesh(g, rbox(0.1, 0.18, 0.02, 0.01), "#1b1b1b", 0, h, 0.0); bar(g, [0, h - 0.36, 0], [0, h - 0.09, 0], 0.015, dk); return g; };
    PK.boomMic = (p, x, y, z, ry) => { const g = grp(p, x, y, z, ry), dk = M("#1b1b1b"), sil = MET("#8a9098");
      brick(g, "4073", dk, 0, 0, 0, 0, 1.3); bar(g, [0, 0.1, 0], [0, 0.42, 0], 0.016, sil); bar(g, [0, 0.42, 0], [0.12, 0.64, 0.25], 0.014, sil);
      const mc = grp(g, 0.12, 0.62, 0.25); brick(mc, "3062b", "#2b2d31", 0, -0.1, 0, 0, [0.65, 0.5, 0.65]); mesh(mc, sph(0.06, 12), MET("#5a5f66"), 0, 0.14, 0); mesh(mc, tor(0.08, 0.008), "#1b1b1b", 0, 0.12, 0.12); return g; };
    PK.coffeeMachine = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry, o.s), blk = M("#1f2023"), sil = MET();
      brick(g, "3023", blk, 0, 0, -PT / 2); brick(g, "3023", blk, 0, 0, PT / 2); brick(g, "3069b", sil, 0, PH, PT / 2, 0, [0.8, 0.5, 1]);
      brick(g, "3004", blk, 0, PH, -PT / 2); brick(g, "3003", blk, 0, PH + BH, 0); brick(g, "3039", "#2b2d31", 0, PH + 2 * BH, 0, Math.PI);
      face(g, "3069b", sil, 0, PH + BH + 0.21, PT, "z"); face(g, "98138", glow("#ff4a3a", 2.2), 0.24, PH + BH + 0.3, PT + 0.14, "z", 0.5);
      brick(g, "4073", sil, 0, BH, PT / 2, 0, 0.7); brick(g, "3062b", "#f2f3f2", 0, PH + 0.02, PT / 2, 0, [0.55, 0.42, 0.55]);
      // a finished cup beside the machine, steaming (translucent round plates rising, pure function of t)
      const cx = 0.55, cz = 0.15; brick(g, "4073", "#f2f3f2", cx, 0, cz, 0, [1.2, 0.5, 1.2]); brick(g, "3062b", "#f2f3f2", cx, 0.07, cz, 0, [0.6, 0.4, 0.6]); mesh(g, cylG(0.05, 0.05, 0.01, 12), "#4a2a16", cx, 0.24, cz);
      const sm = new THREE.MeshBasicMaterial({ color: "#f4f2ee", transparent: true, opacity: 0.28, depthWrite: false }), sg = grp(g, cx, 0.26, cz), SM = [];
      for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(part("4073"), sm); sg.add(m); SM.push(m); }
      live(sg, (t) => SM.forEach((m, i) => { const ph = (t * 0.45 + i / SM.length) % 1; m.position.set(0.03 * Math.sin(t * 2.3 + i * 1.7), ph * 0.55, 0.02 * Math.cos(t * 1.9 + i)); m.scale.setScalar(0.5 * (1 - ph * 0.7)); m.rotation.y = i; }));
      return g; };
    PK.counter = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), c = M(o.col || "#e9ecef"), n = o.n || 1;
      for (let i = 0; i < n; i++) { for (let k = 0; k < 2; k++) brick(g, "3001", c, -0.7 * (n - 1) + i * 1.4, k * BH, 0); face(g, "3069b", o.front || "#cfd4da", -0.7 * (n - 1) + i * 1.4 - 0.35, 0.42, PT); face(g, "3069b", o.front || "#cfd4da", -0.7 * (n - 1) + i * 1.4 + 0.35, 0.42, PT); }
      for (let i = 0; i < n * 2; i++) brick(g, "3068b", o.top || "#3a3d42", -0.7 * n + 0.35 + i * 0.7, 2 * BH, 0);
      g.userData.top = 2 * BH + PH; return g; };
    PK.tileRug = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), nx = o.nx || 6, nz = o.nz || 4, cols = o.cols || ["#0f6f78", "#f4f2ec", "#40e0c8"];
      const id = o.small ? "3070b" : "3068b", st = o.small ? PT : 2 * PT, cx = (nx - 1) / 2, cz = (nz - 1) / 2;
      for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) { const edge = i === 0 || j === 0 || i === nx - 1 || j === nz - 1, dia = Math.abs(i - cx) / (nx / 2) + Math.abs(j - cz) / (nz / 2) < 0.42, mid = (i + j) % 2;
        brick(g, id, edge ? cols[0] : dia ? cols[2] : mid ? cols[1] : (cols[3] || cols[1]), (i - cx) * st, 0, (j - cz) * st, 0, [1, 0.5, 1]); }
      return g; };
    PK.armchair = (p, x, y, z, ry, o) => { o = o || {}; const g = grp(p, x, y, z, ry), c = M(o.col || "#0f6f78", { roughness: 0.45, clearcoat: 0.2 }), c2 = M(o.col2 || "#f4f2ec", { roughness: 0.45, clearcoat: 0.2 });
      brick(g, "3001", c, 0, 0, 0, Math.PI / 2); brick(g, "3001", c2, 0, BH, 0.0, Math.PI / 2, [1, 0.5, 1]); brick(g, "3010", c, 0, BH, -0.525, 0, [0.75, 1, 1]); brick(g, "3010", c, 0, 2 * BH, -0.525, 0, [0.75, 1, 1]);
      for (const sx of [-0.5, 0.5]) { brick(g, "3004", c, sx, BH, 0.0, Math.PI / 2, [1, 0.8, 1.2]); }
      return g; };

    PK.draw = drawArt;
    return PK;
  }
  window.PROPS = { setup };
})();
