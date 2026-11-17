/* ============================================================================
   LDRAW KIT: minifigures built from REAL LDraw part geometry (assets/ldraw-parts.js, exported by
   tools-ldraw/export_parts.mjs from the LDraw library, CC BY). Studs are plain (no logo).
   In scene.js build():   const K = BRICK.setup(ctx), X = FXKIT.setup(ctx); LDRAW_KIT.setup(ctx, K, X);
     K.mfig(spec) -> a figure that works with K.P (all poses, gestures, walk, sit) exactly like K.fig.
       spec: same as K.fig (top, legs, kind, skin, hair, hairStyle, glasses, beard, face options ...) plus
             hairPart: LDraw hair id to override the style (see HAIR below), hips: hip colour (default legs)
     Real minifigs have no knees or elbows: legs swing from the hip, hands turn at the wrist.
   Parts used: head 3626c, torso 973, arms 3818/3819, hands 3820, hips 3815b, legs 3816c/3817c, hair (HAIR).
   ============================================================================ */
(function () {
  function setup(ctx, K, X) {
    const { THREE } = ctx;
    if (!window.LDRAW_PARTS) { K.mfig = K.fig; return K; } // no parts file: fall back to the procedural figure
    const S = 1.73 / 100;            // LDraw units -> world (a minifig is ~100 LDU tall; world figure 1.73)
    const HAIR = { short: "62810", side: "3901", slick: "64798", buzz: "21788", curly: "87995", bob: "62711", long: "85974", ponytail: "87990", bun: "92756", receding: "21788", bowl: "40240" };
    const G = {};
    const geo = (n) => G[n] || (G[n] = X.ld(n, S));

    // cylindrical UVs for the head (front = +z = u 0.5), v from neck (0) to top of the face (1)
    function headGeo() {
      if (G.__head) return G.__head;
      const g = geo("3626c").clone().toNonIndexed(); const p = g.attributes.position, uv = new Float32Array(p.count * 2);
      const y0 = -24 * S, h = 24 * S;
      for (let i = 0; i < p.count; i += 3) {
        const us = [];
        for (let k = 0; k < 3; k++) { const x = p.getX(i + k), z = p.getZ(i + k); us.push((Math.atan2(x, z) + Math.PI) / (Math.PI * 2)); }
        const mx = Math.max(...us), mn = Math.min(...us);
        for (let k = 0; k < 3; k++) { let u = us[k]; if (mx - mn > 0.5 && us[k] < 0.5) u += 1; /* back seam: keep the triangle continuous */ uv[(i + k) * 2] = u; uv[(i + k) * 2 + 1] = Math.min(1, Math.max(0, (p.getY(i + k) - y0) / h)); }
      }
      g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      return (G.__head = g);
    }
    // torso: planar UVs; faces split into groups 0 = sides/top (plain), 1 = front print, 2 = back print
    function torsoGeo() {
      if (G.__torso) return G.__torso;
      const g0 = geo("973").clone().toNonIndexed(); g0.computeBoundingBox();
      const bb = g0.boundingBox, p = g0.attributes.position, n = g0.attributes.normal;
      const yTop = 0, yBot = -32 * S; // shoulders .. waist (the neck stud is above 0)
      const tris = [[], [], []];
      for (let i = 0; i < p.count; i += 3) {
        const nz = (n.getZ(i) + n.getZ(i + 1) + n.getZ(i + 2)) / 3;
        tris[nz > 0.35 ? 1 : nz < -0.35 ? 2 : 0].push(i);
      }
      const out = new THREE.BufferGeometry(), P = [], N = [], U = [];
      let start = 0;
      tris.forEach((list, gi) => {
        list.forEach((i) => { for (let k = 0; k < 3; k++) { const x = p.getX(i + k), y = p.getY(i + k), z = p.getZ(i + k); P.push(x, y, z); N.push(n.getX(i + k), n.getY(i + k), n.getZ(i + k));
          const u = (x - bb.min.x) / (bb.max.x - bb.min.x); U.push(gi === 2 ? 1 - u : u, Math.min(1, Math.max(0, (y - yBot) / (yTop - yBot)))); } });
        out.addGroup(start, list.length * 3, gi); start += list.length * 3;
      });
      out.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); out.setAttribute("normal", new THREE.Float32BufferAttribute(N, 3)); out.setAttribute("uv", new THREE.Float32BufferAttribute(U, 2));
      return (G.__torso = out);
    }

    function mfig(sp) {
      sp = Object.assign({ skin: K.SKIN.toy }, sp);
      const pl = K.plastic, skinM = pl(sp.skin), legsM = pl(sp.legs || "#2b2b2b"), hipM = pl(sp.hips || sp.legs || "#2b2b2b"), topM = pl(sp.top || "#888888");
      const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
      const ds = (m) => { (Array.isArray(m) ? m : [m]).forEach((q) => (q.side = THREE.DoubleSide)); return m; }; // LDraw winding is not always consistent
      const mesh = (g, m, parent, x, y, z) => { const o = new THREE.Mesh(g, ds(m)); o.position.set(x || 0, y || 0, z || 0); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; };
      // legs pivot at the hip axle (28 LDU above the ground); legs[0] = -x side (LDraw right leg 3816c)
      const legs = [], knees = [];
      [["3816c", -1], ["3817c", 1]].forEach(([id]) => {
        const L = new THREE.Group(); L.position.set(0, 28 * S, 0); body.add(L);
        mesh(geo(id), legsM, L);
        const knee = new THREE.Group(); knee.position.y = -14 * S; L.add(knee); // no visible knee on a real minifig (kept for K.P)
        legs.push(L); knees.push(knee);
      });
      mesh(geo("3815b"), hipM, body, 0, 40 * S, 0);
      // upper body pivots at the waist (top of the hips)
      const upper = new THREE.Group(); upper.position.y = 40 * S; body.add(upper);
      const front = sp.print === false ? topM : pl("#ffffff", { map: K.torsoTex(sp) }), back = sp.print === false ? topM : pl("#ffffff", { map: K.backTex(sp) });
      mesh(torsoGeo(), [topM, front, back], upper, 0, 32 * S, 0);
      // arms at the shoulders (LDraw: x ±15.552, 9 LDU below the torso top); hands at the arm ends
      const arms = [], elbows = [], hands = [];
      const sleeveM = pl(sp.arms || sp.top || "#888888");
      [["3818", -1], ["3819", 1]].forEach(([id, s]) => {
        const A = new THREE.Group(); A.position.set(s * 15.552 * S, (32 - 9) * S, 0); A.rotation.order = "ZXY"; upper.add(A);
        mesh(geo(id), sp.shortSleeves ? skinM : sleeveM, A);
        const wrist = new THREE.Group(); wrist.position.set(s * 4.2 * S, -17.5 * S, 9.5 * S); wrist.rotation.x = -0.3; A.add(wrist); // K.P's "elbow" = the wrist here
        const hand = new THREE.Group(); hand.rotation.x = 0.6; wrist.add(hand);
        mesh(geo("3820"), skinM, hand, 0, 0, 2 * S);
        arms.push(A); elbows.push(wrist); hands.push(hand);
      });
      // head on the neck stud; face texture from the procedural kit (same expressions)
      const head = new THREE.Group(); head.position.y = 32 * S; upper.add(head);
      const headMat = new THREE.MeshPhysicalMaterial({ color: "#ffffff", map: K.faceTex("neutral", sp), roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.15 });
      mesh(headGeo(), headMat, head, 0, 24 * S, 0);
      const hairId = sp.hairPart || (sp.hair ? HAIR[sp.hairStyle || "short"] : null);
      if (hairId && geo(hairId)) mesh(geo(hairId), pl(sp.hair, { roughness: 0.35, clearcoat: 0.4 }), head, 0, 24 * S, 0);
      if (sp.glasses || sp.sunglasses) { // thin frames printed in 3D on the face
        const fm = pl("#1b1b1b"); const gl = new THREE.Group(); gl.position.set(0, 13.5 * S, 12.3 * S); head.add(gl);
        for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(2.6 * S, 0.45 * S, 8, 24), fm); r.position.x = s * 3.6 * S; gl.add(r); }
      }
      if (sp.headset) {
        const m = pl("#1b1c1e"); const band = new THREE.Mesh(new THREE.TorusGeometry(13.5 * S, 1.1 * S, 8, 24, Math.PI), m); band.position.y = 22 * S; head.add(band);
        for (const s of [-1, 1]) { const cup = new THREE.Mesh(new THREE.CylinderGeometry(4.5 * S, 4.5 * S, 3 * S, 16), m); cup.rotation.z = Math.PI / 2; cup.position.set(s * 13.5 * S, 12 * S, 0); head.add(cup); }
        const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.6 * S, 0.6 * S, 12 * S, 6), m); boom.rotation.set(Math.PI / 2.3, 0, 0.35); boom.position.set(10 * S, 7 * S, 6 * S); head.add(boom);
      }
      const fig = { root, body, upper, legs, knees, arms, elbows, hands, head, headMat, spec: sp, face: "neutral", hipY: 28 * S, sitLift: 0.1, real: true };
      fig.setFace = (e) => { if (fig.face !== e) { fig.face = e; headMat.map = K.faceTex(e, sp); } };
      ctx.scene.add(root);
      return fig;
    }
    K.mfig = mfig;
    K.MF_HAIR = HAIR;
    return K;
  }
  window.LDRAW_KIT = { setup };
})();
