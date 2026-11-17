/* ============================================================================
   DC-KIT2 (dotcom-crash-lego, round 2): brick-built replacements + new story props.
   Loaded after dc-kit.js (its DCKIT.parts run after dc-kit's, so these override D.puppet / D.beanBag / D.bell /
   D.coinFountain). Every piece is built from real LDraw parts (PK.brick) or bevelled brick boxes; no smooth blobs.
     D.brickVan      City-style van: brick-course cargo box, studded roof, trans windscreen, grille + headlight tiles,
                     wheel arches, wheels on axles, big side livery sticker (text only, brick seams show through)
     D.puppet        generic knit sock puppet: ribbed cuff, knit rows, heel seam, button eyes, felt mitten mouth
     D.beanBag       stacked round bricks in matte fabric colours with a stud cap
     D.bell          brick bell (stepped pearl-gold round bricks) hanging from a gantry, pull rope
     D.coinFountain  stacked round-brick fountain; the pool is a layer of flat gold 1x1 round plates that drains
     D.cannon        brick confetti cannon (userData.mouth = local muzzle point)
     D.micStand, D.stringLights, D.roadPlate (studded road plates + lane tiles), D.spill (loose fruit bricks)
   ============================================================================ */
DCKIT.parts.push(function (D, ctx, K, X, PK) {
  const THREE = ctx.THREE, FL = K.FL, { rnd, canvasMat, glowM } = D, { mesh, brick, face, bar, box, rbox, cylG, sph, MET, GOLD, glow, trans, live, BH, PH, PT } = PK, M = PK.M;
  const g0 = (p, x, y, z, ry, s) => PK.grp(p, x, y, z, ry, s);
  const plane = (w, h) => new THREE.PlaneGeometry(w, h);
  const GLS = () => K.plastic("#1e2a38", { roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.04 });
  const torG = {}; const tor = (R, r, arc) => { const k = R + "," + r + "," + arc; return torG[k] || (torG[k] = new THREE.TorusGeometry(R, r, 8, 28, arc || Math.PI * 2)); };

  // ---------------------------------------------------------------- brick van
  // local +x = front. o: { col, text, stripe, textCol, lights, tilt }
  D.brickVan = (p, x, y, z, ry, o) => { o = o || {}; const g = g0(p, x, y, z, ry), body = M(o.col || "#eeeae0", { roughness: 0.38, clearcoat: 0.35 }), str = M(o.stripe || "#e36a1b", { roughness: 0.38, clearcoat: 0.35 }), dk = M("#3a3d42");
    const L0 = -1.8, L1 = 0.75, W2 = 0.69, cy0 = 0.52, ch = 0.24;
    mesh(g, rbox(3.5, 0.16, 1.3, 0.03), dk, 0, 0.44, 0);                                    // chassis plate
    for (const wx of [-1.15, 1.15]) { bar(g, [wx, 0.3, -0.62], [wx, 0.3, 0.62], 0.035, MET());   // axle
      for (const s of [-1, 1]) { const w = g0(g, wx, 0.3, s * 0.62); mesh(w, cylG(0.3, 0.3, 0.24, 24), "#1b1b1b", 0, 0, 0, Math.PI / 2); mesh(w, cylG(0.17, 0.17, 0.26, 16), MET("#d8dbdf"), 0, 0, 0, Math.PI / 2);
        mesh(w, cylG(0.07, 0.07, 0.28, 10), dk, 0, 0, 0, Math.PI / 2);
        mesh(g, tor(0.38, 0.05, Math.PI), dk, wx, 0.36, s * 0.735); } }                       // wheel arch (mudguard)
    // cargo box: running-bond brick courses on both sides + the rear
    for (let c = 0; c < 6; c++) { const yy = cy0 + ch * (c + 0.5), off = c % 2 ? 0.32 : 0, m = c === 0 ? str : body;
      for (let xx = L0 - off; xx < L1 - 0.01; xx += 0.64) { const a = Math.max(xx, L0), b = Math.min(xx + 0.64, L1); if (b - a < 0.08) continue;
        for (const s of [-1, 1]) mesh(g, rbox(b - a - 0.018, ch - 0.016, 0.12, 0.02), m, (a + b) / 2, yy, s * W2); }
      for (let zz = -0.75 - off * 0.5; zz < 0.75 - 0.01; zz += 0.5) { const a = Math.max(zz, -0.75), b = Math.min(zz + 0.5, 0.75); if (b - a < 0.08) continue; mesh(g, rbox(0.12, ch - 0.016, b - a - 0.018, 0.02), m, L0, yy, (a + b) / 2); } }
    mesh(g, box(L1 - L0 - 0.1, 6 * ch, 1.26), "#2a2622", (L0 + L1) / 2, cy0 + 3 * ch, 0);       // core
    for (const s of [-1, 1]) { mesh(g, rbox(0.05, 0.05, 0.3, 0.01), MET(), L0 - 0.08, cy0 + 3 * ch, s * 0.2); mesh(g, box(0.02, 6 * ch - 0.1, 0.02), dk, L0 - 0.065, cy0 + 3 * ch, 0); }
    mesh(g, rbox(L1 - L0 + 0.06, 0.12, 1.5, 0.03), body, (L0 + L1) / 2, cy0 + 6 * ch + 0.06, 0);   // roof plate + studs
    PK.studs(g, body, L0 + 0.08, -0.7, 7, 4, cy0 + 6 * ch + 0.12);
    // cab: brick block, windscreen slopes, side windows, roof tile, grille tiles, headlights, bumpers
    mesh(g, rbox(1.05, 0.56, 1.46, 0.03), body, 1.27, 0.8, 0);
    for (const s of [-1, 1]) brick(g, "3039", GLS(), 1.22, 1.08, s * 0.35, Math.PI / 2, [1, 1.15, 1]);
    mesh(g, rbox(0.5, 0.52, 1.46, 0.03), body, 0.98, 1.34, 0); for (const s of [-1, 1]) mesh(g, box(0.36, 0.3, 0.02), GLS(), 0.98, 1.36, s * 0.735);
    mesh(g, rbox(0.56, 0.08, 1.48, 0.02), str, 0.98, 1.64, 0); PK.studs(g, body, 0.8, -0.35, 1, 2, 1.68);
    mesh(g, rbox(0.05, 0.26, 0.74, 0.015), "#2b2d31", 1.8, 0.66, 0); for (let i = 0; i < 4; i++) mesh(g, rbox(0.03, 0.03, 0.7, 0.01), "#8a9098", 1.83, 0.56 + i * 0.065, 0);
    for (const s of [-1, 1]) { face(g, "3070b", glow(o.lights ? "#fff4c8" : "#f4efe0", o.lights ? 2.4 : 1.1), 1.81, 0.86, s * 0.5, "x", [1.2, 1, 1.2]); face(g, "3070b", glow("#ff3a2a", o.lights ? 1.8 : 0.9), L0 - 0.075, 0.7, s * 0.55, "-x", [1, 1, 1]); }
    mesh(g, rbox(0.14, 0.14, 1.52, 0.03), dk, 1.84, 0.46, 0); mesh(g, rbox(0.14, 0.14, 1.52, 0.03), dk, L0 - 0.06, 0.46, 0);
    for (const s of [-1, 1]) mesh(g, rbox(0.06, 0.1, 0.16, 0.02), dk, 1.22, 1.2, s * 0.8);       // mirrors
    if (o.lights) { const l = new THREE.SpotLight("#ffd9a0", 4, 9, 0.6, 0.6, 1.4); l.position.set(1.9, 0.86, 0); l.target.position.set(5, 0, 0); g.add(l); g.add(l.target); }
    // livery: text-only sticker on both sides (transparent, so the brick seams read through)
    if (o.text) { const lm = new THREE.MeshPhysicalMaterial({ map: K.canvasTex(1024, 256, (c, Wd, H) => { c.clearRect(0, 0, Wd, H); c.textAlign = "center"; c.textBaseline = "middle";
        const fs = Math.min(150, Math.round(Wd * 1.55 / o.text.length)); c.font = "900 " + fs + "px Arial Black, Arial"; c.lineWidth = fs * 0.14; c.strokeStyle = o.textEdge || "#ffffff"; c.strokeText(o.text, Wd / 2, H / 2 + 6);
        c.fillStyle = o.textCol || o.stripe || "#e36a1b"; c.fillText(o.text, Wd / 2, H / 2 + 6); }), transparent: true, roughness: 0.45, clearcoat: 0.3, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 });
      for (const s of [-1, 1]) { const tp = new THREE.Mesh(plane(2.4, o.textH || 0.6), lm); tp.position.set((L0 + L1) / 2, cy0 + (o.textY || 3.4) * ch, s * (W2 + 0.065)); tp.rotation.y = s > 0 ? 0 : Math.PI; g.add(tp); } }
    if (o.tilt) g.rotation.z = o.tilt;
    return g; };

  // ---------------------------------------------------------------- knit sock puppet (generic; no real mascot design)
  D.puppet = (p, x, y, z, ry, s) => { const g = g0(p, x, y, z, ry, s || 1); g.userData.noBake = true;
    // reads as a sock at a glance: grey tube, white ribbed cuff with red stripes, the foot bends forward into a soft head,
    // big googly eyes on top, a red felt mouth that hinges open, red heel patch at the bend
    const sock = M("#a8a39a", { roughness: 0.95, clearcoat: 0, specularIntensity: 0.12 }), cuffM = M("#f2efe8", { roughness: 0.95, clearcoat: 0, specularIntensity: 0.12 }), rib = M("#dcd7cc", { roughness: 0.95, clearcoat: 0 }),
      red = M("#c8102e", { roughness: 0.9, clearcoat: 0 }), felt = M("#b0142a", { roughness: 0.95, clearcoat: 0 }), dark = M("#5a0a14", { roughness: 0.95, clearcoat: 0 });
    brick(g, "3941", cuffM, 0, 0, 0, 0, [0.7, 0.72, 0.7]);
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; mesh(g, box(0.03, 0.27, 0.02), rib, Math.sin(a) * 0.245, 0.15, Math.cos(a) * 0.245, 0, a, 0); }
    mesh(g, tor(0.247, 0.022), red, 0, 0.09, 0, Math.PI / 2); mesh(g, tor(0.247, 0.022), red, 0, 0.21, 0, Math.PI / 2);
    brick(g, "3941", sock, 0, BH * 0.72, 0, 0, [0.64, 1.0, 0.64]);
    mesh(g, tor(0.225, 0.012), dark, 0, BH * 0.72, 0, Math.PI / 2); mesh(g, tor(0.225, 0.012), dark, 0, BH * 1.2, 0, Math.PI / 2);
    const nk = g0(g, 0, BH * 1.72, 0); g.userData.neck = nk; brick(nk, "3941", sock, 0, 0, 0, 0, [0.62, 0.62, 0.62]); mesh(nk, tor(0.218, 0.012), dark, 0, 0.0, 0, Math.PI / 2);
    const hd = g0(nk, 0, BH * 0.62, 0.0); g.userData.head = hd;
    // head = the foot of the sock, brick-built: a 2x4 brick on its side (studs up), a 2x2 slope snout, a red 1x1 round heel
    brick(hd, "3001", sock, 0, -0.06, 0.16, Math.PI / 2, [0.5, 0.78, 0.64]);
    brick(hd, "3039", sock, 0, 0.27, 0.4, 0, [0.62, 0.42, 0.42]);
    brick(hd, "3062b", red, 0, -0.04, -0.2, 0, [1.4, 0.75, 0.6]);
    // printed-tile googly eyes standing on the studs
    for (const sx of [-0.13, 0.13]) { const e = g0(hd, sx, 0.36, 0.3); e.rotation.x = 1.25; brick(e, "6141", "#f8f8f6", 0, 0, 0, 0, 1.0); brick(e, "6141", "#111111", 0, PH * 0.42, 0.03, 0, 0.5); mesh(e, cylG(0.014, 0.014, 0.01, 8), "#ffffff", 0.03, PH * 0.42 + 0.075, 0.05); }
    // hinged mouth: red 1x4 tile on a grey plate jaw, felt roof under the head
    brick(hd, "3069b", felt, 0, -0.085, 0.22, Math.PI / 2, [0.88, 0.5, 1.25]);
    const jaw = g0(hd, 0, -0.07, -0.06); g.userData.jaw = jaw; brick(jaw, "3023", sock, 0, -0.1, 0.3, Math.PI / 2, [1.0, 0.75, 1.3]); brick(jaw, "3069b", felt, 0, 0.0, 0.3, Math.PI / 2, [0.95, 0.4, 1.15]);
    brick(jaw, "3070b", M("#e8707a", { roughness: 0.9, clearcoat: 0 }), 0, 0.01, 0.32, 0, [1.0, 0.6, 1.2]);
    return g; };
  D.setPuppet = (pp, open, tilt, turn) => { pp.userData.jaw.rotation.x = 0.55 * Math.max(0, open); pp.userData.head.rotation.x = -0.14 * Math.max(0, open) + (tilt || 0); pp.userData.neck.rotation.y = turn || 0; pp.userData.neck.rotation.z = 0.12 * (tilt || 0); };

  // ---------------------------------------------------------------- brick bean bag (stacked round bricks, fabric matte)
  D.beanBag = (p, x, y, z, ry, col) => { const g = g0(p, x, y, z, ry), m = M(col || "#c8102e", { roughness: 0.82, clearcoat: 0.02 }), m2 = M("#" + new THREE.Color(col || "#c8102e").multiplyScalar(0.78).getHexString(), { roughness: 0.85, clearcoat: 0.02 });
    // a 4x4 round brick base with a slightly squashed 4x4 dome on top (one colour), seam ring and a single top stud
    mesh(g, cylG(0.56, 0.6, 0.3, 32), m, 0, 0.15, 0); mesh(g, tor(0.565, 0.02), m2, 0, 0.3, 0, Math.PI / 2);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.565, 32, 14, 0, Math.PI * 2, 0, Math.PI / 2), m); dome.scale.set(1, 0.6, 1); dome.position.y = 0.3; dome.castShadow = dome.receiveShadow = true; g.add(dome);
    brick(g, "4073", m2, 0, 0.62, 0, 0, 1.4); return g; };

  // ---------------------------------------------------------------- pet bowl (stacked red round bricks, round-plate rim, a few kibble plates)
  D.petBowl = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry), m = M("#c8102e", { roughness: 0.4, clearcoat: 0.35 });
    const m2 = M("#9a0c22", { roughness: 0.45, clearcoat: 0.3 }); brick(g, "3941", m2, 0, 0, 0, 0, [1.7, 0.25, 1.7]); brick(g, "3941", m, 0, 0.105, 0, 0, [1.82, 0.25, 1.82]); brick(g, "3941", m2, 0, 0.21, 0, 0, [1.95, 0.28, 1.95]); brick(g, "3941", m, 0, 0.327, 0, 0, [1.98, 0.27, 1.98]);
    for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; brick(g, "6141", "#a00d24", Math.sin(a) * 0.62, 0.44, Math.cos(a) * 0.62, 0, 0.6); }
    brick(g, "3941", "#7a4a22", 0, 0.21, 0, 0, [1.55, 0.52, 1.55]); for (let i = 0; i < 7; i++) { const a = i * 2.4; brick(g, "6141", "#8a5a2a", Math.sin(a) * 0.3, 0.43, Math.cos(a) * 0.3, a, 0.8); }
    return g; };
  // brick bubble: two trans-pink dome halves joined by a stud ring
  D.brickBubble = (p) => { const g = g0(p, 0, 0, 0); const bm = new THREE.MeshPhysicalMaterial({ color: "#ff9ad0", roughness: 0.05, transparent: true, opacity: 0.5, clearcoat: 1, depthWrite: false, emissive: new THREE.Color("#ff5aa8"), emissiveIntensity: 0.25 });
    for (const sgn of [1, -1]) { const h = new THREE.Mesh(new THREE.SphereGeometry(0.28, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), bm); h.scale.y = sgn; h.position.y = sgn * 0.02; g.add(h); }
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.04, 28, 1, true), bm); g.add(ring);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const st = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 10), bm); st.position.set(Math.sin(a) * 0.12, 0.3, Math.cos(a) * 0.12); g.add(st); }
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.2, 2.2), toneMapped: false })); hl.position.set(-0.11, 0.15, 0.2); g.add(hl); return g; };

  // ---------------------------------------------------------------- brick bell on a gantry
  D.bell = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry), wood = M("#3b2414"), br = GOLD();
    for (const sx of [-0.42, 0.42]) { brick(g, "3941", wood, sx, 0, 0, 0, [0.7, 1, 0.7]); for (let k = 1; k < 5; k++) brick(g, "3062b", wood, sx, k * BH, 0); brick(g, "4073", br, sx, 5 * BH, 0, 0, 1.3); }
    bar(g, [-0.5, 5 * BH + 0.05, 0], [0.5, 5 * BH + 0.05, 0], 0.035, br);
    const sw = g0(g, 0, 5 * BH + 0.05, 0); sw.userData.noBake = true; g.userData.swing = sw;
    bar(sw, [0, 0, 0], [0, -0.1, 0], 0.025, br);
    const stack = [["4073", 0.9, 1, -0.16], ["3062b", 0.85, 0.45, -0.34], ["3941", 0.5, 0.45, -0.53], ["3941", 0.78, 0.4, -0.7], ["3941", 1.15, 0.3, -0.83], ["4073", 3.0, 1, -0.86]];
    stack.forEach(([id, s, sy, yy]) => brick(sw, id, br, 0, yy, 0, 0, [s, sy, s]));
    bar(sw, [0, -0.6, 0], [0, -0.92, 0], 0.012, "#2b2b2b"); brick(sw, "6141", br, 0, -0.98, 0, 0, 1.2);
    bar(sw, [0.18, -0.86, 0], [0.32, -1.6, 0.1], 0.012, "#c9b48a");                            // pull rope
    return g; };

  // ---------------------------------------------------------------- brick coin fountain + draining pool of round plates
  D.coinFountain = (p, x, y, z, r) => { const g = g0(p, x, y, z), st = M("#e6dfcf", { roughness: 0.4, clearcoat: 0.3 }), st2 = M("#cfc6b4", { roughness: 0.45, clearcoat: 0.2 }); r = r || 1.1; const n = Math.round(2 * Math.PI * r / 0.64);
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; brick(g, "3004", i % 2 ? st : st2, Math.sin(a) * r, 0, Math.cos(a) * r, a, [r * 2 * Math.PI / n / 0.7 + 0.02, 1, 1]); brick(g, "3023", "#bfb6a2", Math.sin(a) * r, BH, Math.cos(a) * r, a, [r * 2 * Math.PI / n / 0.7 + 0.04, 1, 1.15]); }
    for (let k = 0; k < 4; k++) { brick(g, "3941", k % 2 ? st : st2, 0, k * BH, 0, 0, [0.8, 1, 0.8]); brick(g, "4073", "#bfb6a2", 0, (k + 1) * BH - 0.01, 0, 0, [2.0, 0.4, 2.0]); }
    brick(g, "3941", st, 0, 4 * BH, 0, 0, [1.6, 0.35, 1.6]); brick(g, "3062b", "#c9a24a", 0, 4 * BH + 0.147, 0, 0, [0.8, 0.5, 0.8]);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; brick(g, "6141", st2, Math.sin(a) * 0.46, 4 * BH + 0.147, Math.cos(a) * 0.46); }
    const cg = PK.part("6141"), N = 110, pool = new THREE.InstancedMesh(cg, GOLD(), N), mm = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3(1.05, 1, 1.05);
    for (let i = 0; i < N; i++) { const a = rnd(i * 3 + 1) * 6.283, rr = 0.42 + Math.sqrt(rnd(i * 5 + 2)) * (r - 0.62); e.set((rnd(i + 7) - 0.5) * 0.25, rnd(i + 9) * 6, (rnd(i + 11) - 0.5) * 0.25); q.setFromEuler(e); v.set(Math.sin(a) * rr, 0.27 + rnd(i + 13) * 0.05, Math.cos(a) * rr); pool.setMatrixAt(i, mm.compose(v, q, sc)); }
    pool.frustumCulled = false; pool.castShadow = true; g.add(pool); g.userData.pool = pool; g.userData.poolN = N;
    mesh(g, cylG(r - 0.08, r - 0.08, 0.02, 32), trans("#6fb8e8", 0.45), 0, 0.25, 0);
    const im = new THREE.InstancedMesh(cg.clone().scale(0.8, 0.8, 0.8), GOLD(), 60); im.frustumCulled = false; g.add(im); g.userData.coins = im; g.userData.r = r; return g; };
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
  D.tickFountain = (f, t, flowEnd, flowStart) => { const im = f.userData.coins, top = 4 * BH + 0.25, r = f.userData.r; let n = 0;
    for (let i = 0; i < 60; i++) { const ph = (t * 0.8 + i / 60) % 1, born = t - ph / 0.8; if (born > (flowStart != null ? flowStart + ((i * 37) % 60) / 60 * (flowEnd - flowStart) : flowEnd)) continue; const a = i * 2.39996, rr = 0.15 + (r - 0.5) * ph;
      _v.set(Math.sin(a) * rr, top + 0.8 * 4 * ph * (1 - ph) - (top - 0.15) * ph * ph, Math.cos(a) * rr); _e.set(t * 4 + i, i, t * 3); _q.setFromEuler(_e); _s.setScalar(1); im.setMatrixAt(n++, _m.compose(_v, _q, _s)); }
    im.count = n; im.instanceMatrix.needsUpdate = true; const dry = Math.max(0, Math.min(1, (t - flowEnd) / 1.2)); f.userData.pool.count = Math.round(f.userData.poolN * (1 - 0.88 * dry)); };

  // ---------------------------------------------------------------- confetti cannon, mic stand, string lights
  D.cannon = (p, x, y, z, ry, tilt, col) => { const g = g0(p, x, y, z, ry); brick(g, "3003", "#2b2b2b", 0, 0, 0); brick(g, "3023", "#c9a24a", 0, BH, 0, 0, [1.1, 1, 2.1]);
    const b = g0(g, 0, BH + PH, 0); b.rotation.x = -(tilt == null ? 0.5 : tilt); brick(b, "3941", col || "#c8102e", 0, 0, 0, 0, [0.7, 1, 0.7]); brick(b, "3941", "#f4f2ec", 0, BH, 0, 0, [0.62, 0.6, 0.62]); brick(b, "4073", "#c9a24a", 0, BH * 1.6, 0, 0, [1.6, 1, 1.6]);
    const mz = g0(b, 0, BH * 1.6 + 0.15, 0); g.userData.mouth = mz; return g; };
  D.micStand = (p, x, y, z, ry, h) => { const g = g0(p, x, y, z, ry); h = h || 1.1; brick(g, "4073", "#1b1b1b", 0, 0, 0, 0, 1.1); bar(g, [0, 0.1, 0], [0, h, 0], 0.02, MET("#9aa0a6"));
    bar(g, [0, h, 0], [0, h + 0.12, 0.12], 0.016, MET("#9aa0a6")); const hd = g0(g, 0, h + 0.12, 0.14); hd.rotation.x = 0.9; brick(hd, "3062b", "#2b2b2b", 0, 0, 0, 0, [0.55, 0.5, 0.55]); brick(hd, "6141", "#5a5f66", 0, 0.2, 0, 0, 0.8); return g; };
  D.stringLights = (p, pts, sag) => { const g = g0(p, 0, 0, 0); for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; const n = 7;
      for (let k = 0; k < n; k++) { const u0 = k / n, u1 = (k + 1) / n, y0 = (q) => a[1] + (b[1] - a[1]) * q - (sag || 0.18) * 4 * q * (1 - q);
        bar(g, [a[0] + (b[0] - a[0]) * u0, y0(u0), a[2] + (b[2] - a[2]) * u0], [a[0] + (b[0] - a[0]) * u1, y0(u1), a[2] + (b[2] - a[2]) * u1], 0.008, "#1b1b1b");
        const um = (u0 + u1) / 2; mesh(g, sph(0.045, 10), glow(k % 3 ? "#ffd27a" : "#ffb35a", 2.2), a[0] + (b[0] - a[0]) * um, y0(um) - 0.06, a[2] + (b[2] - a[2]) * um); } } return g; };
  // studded road plates: dark grey plate (top at FL) + stud field, lane tiles left smooth
  D.roadPlate = (p, x0, z0, w, d, col, lane) => { const g = g0(p, 0, 0, 0); mesh(g, box(w, FL, d), M(col || "#4a4d53", { roughness: 0.7, clearcoat: 0.05 }), x0 + w / 2, FL / 2, z0 + d / 2);
    D.studs(g, M(col || "#4a4d53", { roughness: 0.7, clearcoat: 0.05 }), x0, z0, w, d, FL, lane || null); return g; };
  D.spill = (p, x, z, n, cols, seed) => { const g = g0(p, x, FL, z); for (let i = 0; i < n; i++) { const r = (k) => rnd(i * 7.7 + k + (seed || 0) * 3.1); brick(g, r(1) > 0.5 ? "3062b" : "6141", cols[i % cols.length], (r(2) - 0.5) * 1.4, 0, (r(3) - 0.5) * 0.8, r(4) * 6, r(1) > 0.5 ? [1, 0.7, 1] : 1.4); } return g; };
});
