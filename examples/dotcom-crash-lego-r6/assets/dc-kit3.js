/* ============================================================================
   DC-KIT3 (dotcom-crash-lego, round 6): replacements for the props the round-5 council could not read.
   Loaded after dc-kit2.js (its DCKIT.parts entry runs last, so these override the older builders).
     D.puppet       ONE sock-puppet design for every set: grey knit tube, white ribbed cuff with two red stripes,
                    the foot bends forward into a long head with a rounded toe, two big button eyes on the sides of
                    the head (matte, never bloom), a dark open mouth with red felt lips and a pink tongue
     D.bell         a real bell: wooden yoke between two brick posts, a cast pearl-gold bell (lathe profile), a 2x2
                    round collar and a swinging 1x1 round-brick clapper (userData.swing, userData.clapper)
     D.petBag       a standing pet-food sack: bulging body, crimped top seam, printed paw label front + back
     D.produceCrate minifig-scale produce: 1x1 round plates (apples / oranges), 1x1 round bricks, lettuce plates
     D.cart         shopping cart in matte grey bars (no metallic glints that bloom into wireframes)
     D.sedan        a late-90s brick sedan (no badge, no logo) for street dressing
     D.goldFlat()   flat pearl-gold material for coins (keeps each disc's edge under bloom)
   ============================================================================ */
DCKIT.parts.push(function (D, ctx, K, X, PK) {
  const THREE = ctx.THREE, { rnd, canvasMat } = D, { mesh, brick, face, bar, box, rbox, cylG, sph, BH, PH, PT } = PK, M = PK.M;
  const g0 = (p, x, y, z, ry, s) => PK.grp(p, x, y, z, ry, s);
  const plane = (w, h) => new THREE.PlaneGeometry(w, h);
  const torG = {}; const tor = (R, r) => { const k = R + "," + r; return torG[k] || (torG[k] = new THREE.TorusGeometry(R, r, 8, 32)); };
  const matte = (c, o) => M(c, Object.assign({ roughness: 0.92, clearcoat: 0, specularIntensity: 0.12, envMapIntensity: 0.35 }, o || {}));
  let GF = null; D.goldFlat = () => GF || (GF = new THREE.MeshPhysicalMaterial({ color: "#d9a93a", metalness: 0.55, roughness: 0.42, clearcoat: 0.2, envMapIntensity: 0.6 }));

  // ---------------------------------------------------------------- sock puppet (generic; no real mascot design)
  D.puppet = (p, x, y, z, ry, s) => { const g = g0(p, x, y, z, ry, s || 1); g.userData.noBake = true;
    const sock = matte("#8f8a83"), sock2 = matte("#7f7a73"), cuffM = matte("#e4e0d6"), red = matte("#c8102e"), felt = matte("#b0142a"), dark = matte("#2a0608"), tongue = matte("#e0707c");
    // cuff: white ribbed round brick + two thick red stripes; knit tube above with course seams
    brick(g, "3941", cuffM, 0, 0, 0, 0, [0.72, 0.8, 0.72]);
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; mesh(g, box(0.03, 0.3, 0.02), matte("#cfcac0"), Math.sin(a) * 0.252, 0.155, Math.cos(a) * 0.252, 0, a, 0); }
    mesh(g, tor(0.256, 0.03), red, 0, 0.1, 0, Math.PI / 2); mesh(g, tor(0.256, 0.03), red, 0, 0.22, 0, Math.PI / 2);
    brick(g, "3941", sock, 0, BH * 0.8, 0, 0, [0.64, 1.0, 0.64]);
    mesh(g, tor(0.226, 0.012), sock2, 0, BH * 0.8, 0, Math.PI / 2); mesh(g, tor(0.226, 0.012), sock2, 0, BH * 1.3, 0, Math.PI / 2);
    const nk = g0(g, 0, BH * 1.8, 0); g.userData.neck = nk; brick(nk, "3941", sock, 0, 0, 0, 0, [0.62, 0.55, 0.62]); mesh(nk, tor(0.218, 0.012), sock2, 0, 0, 0, Math.PI / 2);
    // head = the foot of the sock, bending forward: long rounded upper head, rounded toe, red heel patch at the back
    const hd = g0(nk, 0, BH * 0.55, -0.06); g.userData.head = hd;
    mesh(hd, rbox(0.46, 0.24, 0.66, 0.1), sock, 0, 0.17, 0.2);
    mesh(hd, cylG(0.12, 0.12, 0.46, 20), sock, 0, 0.17, 0.53, 0, 0, Math.PI / 2);
    mesh(hd, rbox(0.4, 0.2, 0.05, 0.02), red, 0, 0.18, -0.135);                                          // red heel patch (flat, on the back)
    PK.studs(hd, sock2, -0.07, 0.02, 1, 1, 0.29);
    // button eyes on the upper sides of the head, looking forward + out (matte so bloom never eats them)
    for (const sx of [-1, 1]) { const e = g0(hd, sx * 0.17, 0.27, 0.24); e.rotation.set(Math.PI / 2 - 0.35, 0, -sx * 0.55);
      mesh(e, cylG(0.105, 0.105, 0.05, 24), matte("#e6e4de"), 0, 0, 0); mesh(e, cylG(0.055, 0.055, 0.03, 18), matte("#111111"), 0, 0.03, 0.02);
      mesh(e, cylG(0.016, 0.016, 0.01, 8), matte("#ffffff"), 0.02, 0.046, 0.04); }
    // mouth: dark interior + red felt upper lip under the head; hinged lower jaw with felt + tongue
    mesh(hd, rbox(0.4, 0.05, 0.56, 0.02), dark, 0, 0.045, 0.24);
    mesh(hd, rbox(0.44, 0.035, 0.62, 0.015), felt, 0, 0.03, 0.26);
    const jaw = g0(hd, 0, 0.03, -0.06); g.userData.jaw = jaw;
    mesh(jaw, rbox(0.44, 0.09, 0.66, 0.04), sock, 0, -0.05, 0.31); mesh(jaw, cylG(0.05, 0.05, 0.44, 14), sock, 0, -0.05, 0.63, 0, 0, Math.PI / 2);
    mesh(jaw, rbox(0.38, 0.02, 0.56, 0.01), felt, 0, 0.0, 0.32); mesh(jaw, sph(0.1, 14), tongue, 0, 0.005, 0.34, 0, 0, 0, [1.2, 0.25, 1.6]);
    return g; };
  D.setPuppet = (pp, open, tilt, turn) => { pp.userData.jaw.rotation.x = 0.62 * Math.max(0, open); pp.userData.head.rotation.x = -0.1 * Math.max(0, open) + (tilt || 0); pp.userData.neck.rotation.y = turn || 0; pp.userData.neck.rotation.z = 0.12 * (tilt || 0); };

  // ---------------------------------------------------------------- a real bell on a brick gantry
  D.bell = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry), wood = M("#3b2414"), br = D.goldFlat();
    for (const sx of [-0.5, 0.5]) { brick(g, "3941", wood, sx, 0, 0, 0, [0.7, 1, 0.7]); for (let k = 1; k < 5; k++) brick(g, "3062b", wood, sx, k * BH, 0); brick(g, "4073", PK.GOLD(), sx, 5 * BH, 0, 0, 1.3); }
    mesh(g, rbox(1.12, 0.12, 0.16, 0.03), wood, 0, 5 * BH + 0.1, 0);                                   // wooden yoke beam
    const sw = g0(g, 0, 5 * BH + 0.02, 0); sw.userData.noBake = true; g.userData.swing = sw;
    brick(sw, "3941", br, 0, -0.16, 0, 0, [0.6, 0.42, 0.6]);                                            // 2x2 round collar
    const pts = [[0.001, 0], [0.11, 0], [0.135, -0.04], [0.145, -0.16], [0.17, -0.3], [0.22, -0.42], [0.29, -0.5], [0.31, -0.53], [0.3, -0.55], [0.27, -0.545]].map(([r, yy]) => new THREE.Vector2(r, yy));
    const bl = new THREE.Mesh(new THREE.LatheGeometry(pts, 32), new THREE.MeshPhysicalMaterial({ color: "#d9a93a", metalness: 0.6, roughness: 0.38, clearcoat: 0.25, side: THREE.DoubleSide, envMapIntensity: 0.7 }));
    bl.position.y = -0.17; bl.castShadow = true; sw.add(bl);
    mesh(sw, tor(0.3, 0.018), br, 0, -0.68, 0, Math.PI / 2);                                             // lip ring
    const cl = g0(sw, 0, -0.3, 0); g.userData.clapper = cl; bar(cl, [0, 0, 0], [0, -0.36, 0], 0.012, "#2b2b2b"); brick(cl, "3062b", "#3a3d42", 0, -0.46, 0, 0, [0.7, 0.55, 0.7]);
    // pull rope from a lever on the yoke down to hand height
    bar(sw, [0.12, -0.08, 0], [0.42, -0.08, 0], 0.016, wood); bar(sw, [0.42, -0.08, 0], [0.44, -0.95, 0.04], 0.012, "#c9b48a"); brick(sw, "3062b", "#c9b48a", 0.44, -1.05, 0.04, 0, [0.45, 0.4, 0.45]);
    return g; };

  // ---------------------------------------------------------------- standing pet-food sack
  let SM = null;
  const sackMat = () => SM || (SM = canvasMat(160, 160, (c, W, H) => { c.fillStyle = "#c98a3a"; c.fillRect(0, 0, W, H); c.fillStyle = "#f4ead2"; c.beginPath(); c.roundRect ? c.roundRect(14, 22, W - 28, 92, 10) : c.rect(14, 22, W - 28, 92); c.fill();
    c.fillStyle = "#7a3a1a"; c.beginPath(); c.arc(W / 2, 80, 17, 0, 7); c.fill(); for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(W / 2 - 26 + i * 17, 54 - (i % 3 ? 5 : 0), 7.5, 0, 7); c.fill(); }
    c.fillStyle = "#2f6a2a"; c.font = "900 22px Arial Black, Arial"; c.textAlign = "center"; c.fillText("PET FOOD", W / 2, 142); c.fillStyle = "#b07428"; c.fillRect(0, 0, W, 8); }));
  D.petBag = (p, x, y, z, ry, s) => { const g = g0(p, x, y, z, ry, s || 1), body = M("#c98a3a", { roughness: 0.78, clearcoat: 0.05 }), dk = M("#a8702c", { roughness: 0.8, clearcoat: 0.04 });
    mesh(g, rbox(0.58, 0.44, 0.38, 0.1), body, 0, 0.23, 0);                                               // bulging lower body
    mesh(g, rbox(0.5, 0.2, 0.3, 0.07), body, 0, 0.5, 0);                                                  // tapering shoulders
    mesh(g, rbox(0.54, 0.07, 0.14, 0.03), dk, 0, 0.63, 0); for (let i = 0; i < 5; i++) mesh(g, box(0.02, 0.065, 0.15), "#8a5a22", -0.22 + i * 0.11, 0.63, 0);   // crimped top seam
    mesh(g, rbox(0.52, 0.05, 0.34, 0.02), dk, 0, 0.025, 0);                                               // flat base
    for (const sd of [1, -1]) { const f = new THREE.Mesh(plane(0.36, 0.34), sackMat()); f.position.set(0, 0.25, sd * 0.192); f.rotation.y = sd > 0 ? 0 : Math.PI; g.add(f); }
    return g; };

  // ---------------------------------------------------------------- coin fountain flow (low arcs, gravity, lands in the pool)
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
  D.tickFountain = (f, t, flowEnd, flowStart) => { const im = f.userData.coins, top = 4 * BH + 0.22, r = f.userData.r, N = Math.min(60, im.count || 60); let n = 0;
    for (let i = 0; i < 60; i++) { const ph = (t * 0.9 + i / 60) % 1, born = t - ph / 0.9; if (born > flowEnd) continue; const a = i * 2.39996, rr = 0.12 + (r - 0.3) * ph;
      _v.set(Math.sin(a) * rr, top + 0.35 * ph - (top + 0.1) * ph * ph, Math.cos(a) * rr); if (_v.y < 0.27) _v.y = 0.27; _e.set(t * 3 + i, i, t * 2.4 + i); _q.setFromEuler(_e); _s.setScalar(0.72); im.setMatrixAt(n++, _m.compose(_v, _q, _s)); }
    im.count = n; im.instanceMatrix.needsUpdate = true; const dry = Math.max(0, Math.min(1, (t - flowEnd) / 1.2)); f.userData.pool.count = Math.round(f.userData.poolN * (1 - 0.88 * dry)); };

  // ---------------------------------------------------------------- produce crate with minifig-scale produce
  D.produceCrate = (p, x, y, z, ry, col) => { const g = g0(p, x, y, z, ry), wd = M("#a87a48", { roughness: 0.7 }), wd2 = M("#8a5f36", { roughness: 0.7 });
    for (const sz of [-0.2, 0.2]) for (const yy of [0.06, 0.18]) mesh(g, rbox(0.62, 0.09, 0.03, 0.01), yy > 0.1 ? wd : wd2, 0, yy, sz);
    for (const sx of [-0.3, 0.3]) mesh(g, rbox(0.03, 0.24, 0.42, 0.01), wd, sx, 0.12, 0); mesh(g, box(0.58, 0.02, 0.38), wd2, 0, 0.03, 0);
    const c = col || "#c8102e", lettuce = c === "#3fa34d";
    for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { const r = rnd(i * 3.7 + j * 1.3 + x * 5); const hx = -0.22 + i * 0.11, hz = -0.12 + j * 0.12;
      if (lettuce) brick(g, "4073", ["#3fa34d", "#5ab84a", "#2f8a3a"][(i + j) % 3], hx, 0.15 + r * 0.04, hz, r * 6, 1.25);
      else brick(g, r > 0.25 ? "6141" : "3062b", r > 0.85 ? "#f2cd37" : c, hx, 0.15 + (r > 0.5 ? 0.03 : 0), hz, r * 6, r > 0.25 ? 1.15 : [0.75, 0.55, 0.75]); }
    return g; };

  // ---------------------------------------------------------------- matte shopping cart
  D.cart = (p, x, y, z, ry) => { const g = g0(p, x, y, z, ry), st = M("#8e949b", { roughness: 0.6, metalness: 0.25, clearcoat: 0.05, envMapIntensity: 0.4 }), R = 0.024;
    for (const [a, b] of [[-0.3, -0.25], [0.3, -0.25], [-0.3, 0.25], [0.3, 0.25]]) { D.wheel(g, a, 0.07, b, 0.07, 0.05); bar(g, [a, 0.07, b], [a, 0.5, b], 0.018, st); }
    for (const yy of [0.52, 0.92]) { bar(g, [-0.35, yy, -0.3], [0.35, yy, -0.3], R, st); bar(g, [-0.35, yy, 0.3], [0.35, yy, 0.3], R, st); bar(g, [-0.35, yy, -0.3], [-0.35, yy, 0.3], R, st); bar(g, [0.35, yy, -0.3], [0.35, yy, 0.3], R, st); }
    for (const [a, b] of [[-0.35, -0.3], [0.35, -0.3], [-0.35, 0.3], [0.35, 0.3]]) bar(g, [a, 0.52, b], [a, 0.92, b], R, st);
    for (let i = 1; i < 4; i++) { const xx = -0.35 + i * 0.175; bar(g, [xx, 0.52, 0.3], [xx, 0.92, 0.3], 0.014, st); bar(g, [xx, 0.52, -0.3], [xx, 0.92, -0.3], 0.014, st); }
    mesh(g, box(0.7, 0.03, 0.6), "#6a7078", 0, 0.52, 0); bar(g, [-0.35, 0.98, 0.42], [0.35, 0.98, 0.42], 0.03, "#c8102e"); for (const sx of [-0.35, 0.35]) bar(g, [sx, 0.92, 0.3], [sx, 0.98, 0.42], 0.018, st); return g; };

  // ---------------------------------------------------------------- late-90s brick sedan (generic)
  D.sedan = (p, x, y, z, ry, col) => { const g = g0(p, x, y, z, ry), pm = M(col || "#2f5f8a", { roughness: 0.32, clearcoat: 0.55 }), gl = K.plastic("#1e2a38", { roughness: 0.08, clearcoat: 1 }), dk = M("#1b1b1b");
    mesh(g, rbox(3.0, 0.2, 1.36), dk, 0, 0.32, 0); mesh(g, rbox(3.0, 0.38, 1.34), pm, 0, 0.61, 0); PK.studs(g, pm, 0.85, -0.525, 2, 3, 0.8); PK.studs(g, pm, -1.35, -0.525, 1, 3, 0.8);
    mesh(g, rbox(1.4, 0.44, 1.26), pm, -0.25, 1.02, 0); for (const s of [-1, 1]) { mesh(g, box(1.16, 0.28, 0.02), gl, -0.25, 1.05, s * 0.635); brick(g, "3039", gl, 0.6, 0.8, s * 0.35, Math.PI / 2, [1, 0.95, 1]); brick(g, "3039", gl, -1.1, 0.8, s * 0.35, -Math.PI / 2, [1, 0.95, 1]); }
    mesh(g, rbox(1.3, 0.06, 1.2, 0.02), pm, -0.25, 1.26, 0);
    for (const s of [-1, 1]) { mesh(g, cylG(0.09, 0.09, 0.05, 12), PK.glow("#fff6d0", 1.4), 1.51, 0.62, s * 0.45, 0, 0, Math.PI / 2); mesh(g, cylG(0.08, 0.08, 0.05, 12), PK.glow("#ff3030", 1.1), -1.51, 0.62, s * 0.45, 0, 0, Math.PI / 2); mesh(g, rbox(0.12, 0.12, 0.2, 0.03), dk, 0.5, 0.95, s * 0.72); }
    mesh(g, rbox(0.12, 0.14, 1.4, 0.03), "#9aa0a6", 1.52, 0.4, 0); mesh(g, rbox(0.12, 0.14, 1.4, 0.03), "#9aa0a6", -1.52, 0.4, 0);
    for (const [wx, wz] of [[0.95, 0.68], [0.95, -0.68], [-0.95, 0.68], [-0.95, -0.68]]) D.wheel(g, wx, 0.3, wz, 0.3, 0.24);
    return g; };
});
