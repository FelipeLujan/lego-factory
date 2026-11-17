/* ============================================================================
   BRICK KIT v2: shared brick-toy toolkit for story videos (DealCalm series).
   Loaded by index.html BEFORE scene.js. Do not edit it for one video. Copy useful
   pieces into scene.js if you need a variant.

   In scene.js:   const K = BRICK.setup(ctx);   // inside build(ctx)
   K gives you:
     materials   K.plastic(color, extra)  K.metal(color)  K.glass()  K.glowCoral / K.glowLime
     textures    K.canvasTex(w, h, draw)  K.textTex(lines, bg, fg, w, h, font)
     bricks      K.plate(parent, color, nx, nz, x, yTop, z, thick, studs)  K.studField(...)  K.brickWall(parent, colors, x0, z, n, rows, skip)
     figures     K.fig(spec)  -> fig;   K.P(fig, pose)  (call every frame)   K.walkPh(t, speed)
     furniture   K.chair  K.desk  K.table  K.sofa  K.plant  K.lamp  K.door  K.windowPane  K.bookshelf  K.whiteboard
     tech        K.laptop  K.monitor  K.phone  K.tv  K.oldPhone
     props       K.mug  K.papers  K.briefcase  K.cash  K.contract  K.sign  K.podium  K.car  K.trophy
     scenery     K.room(...)  K.cityTex / K.dayTex / K.sunsetTex
   Units: 1 stud = 0.4. A figure is 1.73 tall (head top 1.70) (feet at its root, y = 0). Everything casts shadows.
   ============================================================================ */
(function () {
  function rand(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  const clamp01 = (x) => Math.max(0, Math.min(1, x));

  function setup(ctx) {
    const { THREE, scene, renderer } = ctx;
    const ANISO = renderer.capabilities.getMaxAnisotropy();
    const K = { THREE, rand, PITCH: 0.4, BRICK_H: 0.48, FIG_H: 1.73 };
    const PITCH = K.PITCH, BRICK_H = K.BRICK_H;

    // the stage's coral rim light tints yellow/white plastic copper: tame it
    scene.traverse((o) => { if (o.isDirectionalLight && o.color.r > 2 * o.color.g) o.intensity = 0.35; });

    // ---------------- materials + textures ----------------
    function canvasTex(w, h, draw) {
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      draw(c.getContext("2d"), w, h);
      const t = new THREE.CanvasTexture(c);
      t.anisotropy = ANISO; t.encoding = THREE.sRGBEncoding;
      return t;
    }
    const PL = {};
    function plastic(color, extra) { // ABS plastic: glossy, soft highlight, light clearcoat
      const key = color + JSON.stringify(extra || {});
      if (PL[key]) return PL[key];
      const m = new THREE.MeshPhysicalMaterial(Object.assign({
        color, roughness: 0.3, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.18, specularIntensity: 0.7,
      }, extra || {}));
      if (!extra || !extra.map) PL[key] = m;
      return m;
    }
    const metal = (color, rough) => plastic(color || "#c9ced3", { metalness: 0.9, roughness: rough == null ? 0.28 : rough, clearcoat: 0.2 });
    const glass = (tint) => new THREE.MeshPhysicalMaterial({ color: tint || "#cfe6ff", roughness: 0.05, transparent: true, opacity: 0.22, clearcoat: 1 });
    function textTex(lines, bg, fg, w, h, font) {
      return canvasTex(w || 512, h || 128, (g, W, H) => {
        g.fillStyle = bg; g.fillRect(0, 0, W, H); g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle";
        g.font = font || "900 64px Arial Black, Arial, sans-serif";
        lines.forEach((l, i) => g.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * (H / lines.length)));
      });
    }
    Object.assign(K, { canvasTex, plastic, metal, glass, textTex });
    K.glowCoral = new THREE.MeshBasicMaterial({ color: "#FF6B4A", toneMapped: false, transparent: true });
    K.glowLime = new THREE.MeshBasicMaterial({ color: "#C8FF3E", toneMapped: false, transparent: true });
    const shadows = (o) => { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };
    K.shadows = shadows;
    // add(parent, geometry, material, x, y, z, {rx, ry, rz, s}) -> mesh
    function add(parent, geo, mat, x, y, z, r) {
      const m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0);
      if (r) { m.rotation.set(r.rx || 0, r.ry || 0, r.rz || 0); if (r.s) m.scale.setScalar(r.s); }
      m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
    }
    K.add = add;
    K.box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
    K.cyl = (rt, rb, h, n) => new THREE.CylinderGeometry(rt, rb, h, n || 24);

    // ---------------- bricks ----------------
    const studGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.07, 20); studGeo.translate(0, 0.035, 0);
    function studField(parent, color, x0, z0, nx, nz, y) {
      const im = new THREE.InstancedMesh(studGeo, plastic(color), nx * nz);
      const m = new THREE.Matrix4(); let i = 0;
      for (let a = 0; a < nx; a++) for (let b = 0; b < nz; b++) { m.makeTranslation(x0 + (a + 0.5) * PITCH, y, z0 + (b + 0.5) * PITCH); im.setMatrixAt(i++, m); }
      im.castShadow = true; im.receiveShadow = true; parent.add(im); return im;
    }
    function plate(parent, color, nx, nz, x, y, z, th, studs) {
      const w = nx * PITCH, d = nz * PITCH;
      const m = add(parent, new THREE.BoxGeometry(w - 0.01, th, d - 0.01), plastic(color), x, y - th / 2, z);
      if (studs !== false) studField(parent, color, x - w / 2, z - d / 2, nx, nz, y);
      return m;
    }
    // running-bond wall along +x from x0 at depth z; n two-stud bricks per row; skip(row, xFromStart) leaves holes
    function brickWall(parent, colors, x0, z, n, rows, skip) {
      const g = new THREE.Group();
      const geo = new THREE.BoxGeometry(2 * PITCH - 0.012, BRICK_H - 0.012, PITCH - 0.004);
      const half = new THREE.BoxGeometry(PITCH - 0.012, BRICK_H - 0.012, PITCH - 0.004);
      const list = [];
      for (let r = 0; r < rows; r++) {
        const off = r % 2 ? PITCH : 0;
        if (r % 2) list.push({ r, x: x0 + PITCH / 2, half: true });
        for (let c = 0; c < n - (r % 2 ? 1 : 0); c++) list.push({ r, x: x0 + off + c * 2 * PITCH + PITCH, half: false });
        if (r % 2) list.push({ r, x: x0 + (2 * n - 0.5) * PITCH, half: true });
      }
      const keep = list.filter((b) => !(skip && skip(b.r, b.x - x0)));
      const groups = {};
      keep.forEach((b, i) => { const k = (b.half ? "h" : "f") + (i * 7 + b.r * 3) % colors.length; (groups[k] = groups[k] || []).push(b); });
      const m4 = new THREE.Matrix4();
      for (const k in groups) {
        const arr = groups[k];
        const im = new THREE.InstancedMesh(k[0] === "h" ? half : geo, plastic(colors[Number(k.slice(1))]), arr.length);
        arr.forEach((b, i) => { m4.makeTranslation(b.x, (b.r + 0.5) * BRICK_H, z); im.setMatrixAt(i, m4); });
        im.castShadow = true; im.receiveShadow = true; g.add(im);
      }
      studField(g, colors[0], x0, z - PITCH / 2, 2 * n, 1, rows * BRICK_H);
      parent.add(g); return g;
    }
    Object.assign(K, { studField, plate, brickWall });

    // =====================================================================
    // FIGURE v2: slimmer, taller, jointed knees + elbows, detailed prints.
    // =====================================================================
    const YEL = "#f2cd37";
    K.SKIN = { toy: YEL, light: "#f1c9a5", medium: "#c98b5e", tan: "#a8693f", dark: "#6b4329" };
    const darken = (hex, k) => { const c = new THREE.Color(hex); c.multiplyScalar(k); return "#" + c.getHexString(); };

    // ---- face (printed on a lathe head; texture 1024 x 256, front = centre) ----
    const faceCache = {};
    function faceTex(expr, sp) {
      const key = [expr, sp.skin, sp.hair, sp.beard, sp.mustache, sp.stubble, sp.lips, sp.lashes, sp.age, sp.freckles].join("|");
      if (faceCache[key]) return faceCache[key];
      const skin = sp.skin || YEL;
      const t = canvasTex(1024, 256, (g, W, H) => {
        g.fillStyle = skin; g.fillRect(0, 0, W, H);
        const cx = 512, ey = 112, ex = 50, ink = "#1a1410";
        g.lineCap = "round"; g.lineJoin = "round";
        // soft cheek shading (moulded volume)
        const sh = g.createRadialGradient(cx, 130, 30, cx, 140, 200);
        sh.addColorStop(0, "rgba(255,255,255,0.10)"); sh.addColorStop(1, "rgba(0,0,0,0.10)");
        g.fillStyle = sh; g.fillRect(cx - 260, 0, 520, H);
        if (sp.stubble) { g.fillStyle = "rgba(40,30,25,0.22)"; for (let i = 0; i < 420; i++) { const a = rand(i) * Math.PI, r = 62 + rand(i + 3) * 40; const x = cx + Math.cos(a) * r * 1.5, y = 150 + Math.sin(a) * r * 0.85; if (y > 150) g.fillRect(x, y, 2, 2); } }
        if (sp.beard) {
          g.fillStyle = sp.beard;
          g.beginPath(); g.moveTo(cx - 118, 112); g.quadraticCurveTo(cx - 116, 252, cx, 256); g.quadraticCurveTo(cx + 116, 252, cx + 118, 112);
          g.lineTo(cx + 100, 118); g.quadraticCurveTo(cx + 84, 214, cx, 218); g.quadraticCurveTo(cx - 84, 214, cx - 100, 118); g.closePath(); g.fill();
          g.beginPath(); g.ellipse(cx, 238, 60, 18, 0, 0, 7); g.fill();
          g.strokeStyle = "rgba(0,0,0,0.18)"; g.lineWidth = 2; for (let i = 0; i < 26; i++) { const x = cx - 100 + i * 7.7; g.beginPath(); g.moveTo(x, 150 + (i % 3) * 6); g.lineTo(x + 2, 168 + (i % 3) * 6); g.stroke(); }
        }
        if (sp.mustache || sp.beard) {
          g.fillStyle = sp.mustache || sp.beard;
          g.beginPath(); g.moveTo(cx - 46, 170); g.quadraticCurveTo(cx - 22, 148, cx, 157); g.quadraticCurveTo(cx + 22, 148, cx + 46, 170); g.quadraticCurveTo(cx, 162, cx - 46, 170); g.fill();
        }
        if (sp.freckles) { g.fillStyle = "rgba(150,80,40,0.35)"; for (let i = 0; i < 16; i++) { const s = i % 2 ? 1 : -1; g.beginPath(); g.arc(cx + s * (50 + rand(i) * 30), 142 + rand(i + 5) * 14, 2, 0, 7); g.fill(); } }
        if (sp.blush) { for (const s of [-1, 1]) { const b = g.createRadialGradient(cx + s * 80, 150, 2, cx + s * 80, 150, 26); b.addColorStop(0, "rgba(230,90,90,0.35)"); b.addColorStop(1, "rgba(230,90,90,0)"); g.fillStyle = b; g.fillRect(cx + s * 80 - 28, 122, 56, 56); } }
        // eyes: white, iris, pupil, highlight, upper lid
        const eyeOpen = { shock: 1.35, angry: 0.75, smirk: 0.85, sly: 0.6, laugh: 0.25, determined: 0.8, worried: 1.1 }[expr] || 1;
        for (const s of [-1, 1]) {
          const x = cx + s * ex;
          g.save(); g.beginPath(); g.ellipse(x, ey, 14, 11 * eyeOpen, 0, 0, 7); g.clip();
          g.fillStyle = "#ffffff"; g.fillRect(x - 16, ey - 16, 32, 32);
          g.fillStyle = sp.eyes || "#3b2a1c"; g.beginPath(); g.arc(x + (expr === "sly" ? s * 0 + 4 : 1), ey + 1, 8, 0, 7); g.fill();
          g.fillStyle = "#0d0d0d"; g.beginPath(); g.arc(x + (expr === "sly" ? 4 : 1), ey + 1, 4.2, 0, 7); g.fill();
          g.fillStyle = "#ffffff"; g.beginPath(); g.arc(x + 4, ey - 3, 2.6, 0, 7); g.fill();
          g.restore();
          g.strokeStyle = ink; g.lineWidth = 3.4; g.beginPath(); g.ellipse(x, ey, 14, 11 * eyeOpen, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
          if (sp.lashes) { g.lineWidth = 2.6; for (const k of [0, 1, 2]) { const a = Math.PI * (1.12 + k * 0.12) + (s > 0 ? 0.25 : 0); g.beginPath(); g.moveTo(x + Math.cos(a) * 14, ey + Math.sin(a) * 11 * eyeOpen); g.lineTo(x + Math.cos(a) * 20, ey + Math.sin(a) * 15 * eyeOpen - 2); g.stroke(); } }
          if (sp.age) { g.strokeStyle = "rgba(0,0,0,0.22)"; g.lineWidth = 2; for (const k of [-1, 0, 1]) { g.beginPath(); g.moveTo(x + s * 20, ey + k * 6); g.lineTo(x + s * 30, ey + k * 9); g.stroke(); } }
        }
        // brows (hair colour)
        const browCol = sp.brows || (sp.hair ? darken(sp.hair, 0.8) : "#3a2a1a");
        g.strokeStyle = browCol; g.lineWidth = sp.lashes ? 4.5 : 6.5;
        const br = { angry: [12, -6], determined: [7, -3], frown: [6, -2], sad: [-9, 5], worried: [-10, 4], shock: [-8, -12], smirk: [2, -4], sly: [4, -2] }[expr] || [0, 0];
        for (const s of [-1, 1]) {
          const lift = expr === "smirk" && s > 0 ? -8 : 0;
          g.beginPath(); g.moveTo(cx + s * 30, 82 + br[0] + lift); g.quadraticCurveTo(cx + s * 50, 72 + (br[0] + br[1]) / 2 + lift, cx + s * 72, 80 + br[1] + lift); g.stroke();
        }
        if (sp.age) { g.strokeStyle = "rgba(0,0,0,0.16)"; g.lineWidth = 2.2; for (const y of [56, 66]) { g.beginPath(); g.moveTo(cx - 34, y); g.quadraticCurveTo(cx, y - 5, cx + 34, y); g.stroke(); } }
        // nose
        g.strokeStyle = "rgba(0,0,0,0.30)"; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 8, 146); g.quadraticCurveTo(cx, 152, cx + 8, 146); g.stroke();
        // mouth
        const lip = sp.lips || null;
        g.strokeStyle = ink; g.fillStyle = ink; g.lineWidth = 4.5;
        const open = (path, teeth) => { g.fillStyle = "#4a1414"; g.beginPath(); path(); g.closePath(); g.fill(); if (teeth) { g.save(); g.clip(); g.fillStyle = "#fff"; g.fillRect(cx - 40, 160, 80, 12); g.restore(); } g.strokeStyle = lip || ink; g.lineWidth = lip ? 5 : 3.5; g.beginPath(); path(); g.closePath(); g.stroke(); };
        if (expr === "smile") { g.beginPath(); g.arc(cx, 152, 32, 0.2 * Math.PI, 0.8 * Math.PI); g.strokeStyle = lip || ink; g.lineWidth = lip ? 6 : 4.5; g.stroke(); }
        else if (expr === "grin" || expr === "laugh") open(() => { g.moveTo(cx - 38, 162); g.quadraticCurveTo(cx, expr === "laugh" ? 222 : 206, cx + 38, 162); }, true);
        else if (expr === "frown" || expr === "sad") { g.beginPath(); g.arc(cx, 206, 28, 1.24 * Math.PI, 1.76 * Math.PI); g.strokeStyle = lip || ink; g.stroke(); }
        else if (expr === "worried") { g.beginPath(); g.moveTo(cx - 24, 186); g.quadraticCurveTo(cx - 8, 178, cx, 184); g.quadraticCurveTo(cx + 10, 190, cx + 24, 182); g.strokeStyle = lip || ink; g.stroke(); }
        else if (expr === "angry" || expr === "determined") { g.beginPath(); g.moveTo(cx - 26, 184); g.lineTo(cx + 26, 184); g.strokeStyle = lip || ink; g.stroke(); if (expr === "angry") { g.lineWidth = 2.5; g.beginPath(); g.moveTo(cx - 20, 176); g.lineTo(cx + 20, 176); g.stroke(); } }
        else if (expr === "shock") open(() => g.ellipse(cx, 184, 14, 19, 0, 0, Math.PI * 2), false);
        else if (expr === "smirk" || expr === "sly") { g.beginPath(); g.moveTo(cx - 26, 182); g.quadraticCurveTo(cx + 6, 188, cx + 30, 166); g.strokeStyle = lip || ink; g.stroke(); g.lineWidth = 2.5; g.beginPath(); g.moveTo(cx + 26, 162); g.lineTo(cx + 33, 170); g.stroke(); }
        else { g.beginPath(); g.arc(cx, 160, 24, 0.27 * Math.PI, 0.73 * Math.PI); g.strokeStyle = lip || ink; g.lineWidth = lip ? 6 : 4.5; g.stroke(); }
        if (expr === "smile" || expr === "grin" || expr === "laugh") { g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 2.5; for (const s of [-1, 1]) { g.beginPath(); g.arc(cx + s * 50, 166, 8, s > 0 ? 0.9 * Math.PI : -0.1 * Math.PI, s > 0 ? 1.4 * Math.PI : 0.4 * Math.PI); g.stroke(); } }
      });
      faceCache[key] = t; return t;
    }
    K.faceTex = faceTex;

    // ---- printed clothing (front 512x512 for the torso) ----
    const shade = (g, W, H) => { const gr = g.createRadialGradient(W * 0.5, H * 0.35, 10, W * 0.5, H * 0.45, W * 0.78); gr.addColorStop(0, "rgba(255,255,255,0.10)"); gr.addColorStop(1, "rgba(0,0,0,0.18)"); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
    const fold = (g, pts, a) => { g.strokeStyle = "rgba(0,0,0," + (a || 0.12) + ")"; g.lineWidth = 5; g.beginPath(); g.moveTo(pts[0], pts[1]); g.quadraticCurveTo(pts[2], pts[3], pts[4], pts[5]); g.stroke(); };
    function tie(g, sp) {
      g.fillStyle = sp.tie;
      g.beginPath(); g.moveTo(236, 20); g.lineTo(276, 20); g.lineTo(268, 52); g.lineTo(244, 52); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(244, 52); g.lineTo(268, 52); g.lineTo(286, 300); g.lineTo(256, 336); g.lineTo(226, 300); g.closePath(); g.fill();
      g.strokeStyle = "rgba(255,255,255,0.20)"; g.lineWidth = 5; for (let y = 76; y < 300; y += 36) { g.beginPath(); g.moveTo(234, y + 14); g.lineTo(280, y); g.stroke(); }
      g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 2; g.beginPath(); g.moveTo(256, 54); g.lineTo(256, 330); g.stroke();
      if (sp.tieClip) { g.fillStyle = "#d4d8dc"; g.fillRect(228, 190, 56, 8); }
    }
    function collar(g, col, spread) { g.fillStyle = col; g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 3; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(256, 18); g.lineTo(256 + s * (spread || 96), 0); g.lineTo(256 + s * 70, 58); g.closePath(); g.fill(); g.stroke(); } }
    function buttons(g, x, ys, col) { g.fillStyle = col || "rgba(0,0,0,0.45)"; for (const y of ys) { g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); } }
    function torsoTex(sp) {
      return canvasTex(512, 512, (g, W, H) => {
        const k = sp.kind || "shirt", top = sp.top;
        g.fillStyle = top; g.fillRect(0, 0, W, H); g.lineCap = "round"; g.lineJoin = "round";
        const shirt = sp.shirt || "#f4f4f4";
        if (k === "suit" || k === "blazer" || k === "sweater") {
          // what shows under the jacket
          const under = k === "blazer" ? (sp.under || "#f4f4f4") : shirt;
          g.fillStyle = under; g.beginPath(); g.moveTo(160, 0); g.lineTo(352, 0); g.lineTo(256, k === "sweater" ? 200 : 330); g.closePath(); g.fill();
          if (k !== "blazer" || sp.tie) collar(g, under);
          if (sp.tie) tie(g, sp);
          if (k === "blazer" && !sp.tie && sp.under) { g.strokeStyle = "rgba(0,0,0,0.2)"; g.lineWidth = 4; g.beginPath(); g.arc(256, -6, 58, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); }
          if (k === "sweater") { g.strokeStyle = "rgba(255,255,255,0.10)"; g.lineWidth = 3; for (let x = 20; x < W; x += 14) { g.beginPath(); g.moveTo(x, 210); g.lineTo(x, H); g.stroke(); } g.fillStyle = "rgba(0,0,0,0.12)"; g.fillRect(0, H - 40, W, 40); }
          else {
            g.fillStyle = "rgba(0,0,0,0.30)"; // lapels
            for (const s of [-1, 1]) { g.beginPath(); g.moveTo(256 + s * 92, 0); g.lineTo(256 + s * 128, 0); g.lineTo(256 + s * 104, 140); g.lineTo(256 + s * 30, 334); g.lineTo(256 + s * 14, 318); g.closePath(); g.fill(); }
            g.strokeStyle = "rgba(255,255,255,0.12)"; g.lineWidth = 2.5; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(256 + s * 104, 140); g.lineTo(256 + s * 30, 334); g.stroke(); }
            g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 4; g.beginPath(); g.moveTo(256, 334); g.lineTo(256, H); g.stroke();
            buttons(g, 272, [380, 444]);
            g.strokeStyle = "rgba(0,0,0,0.38)"; g.lineWidth = 4; g.beginPath(); g.moveTo(334, 186); g.lineTo(410, 182); g.stroke();
            for (const x of [76, 352]) { g.beginPath(); g.moveTo(x, 420); g.lineTo(x + 86, 420); g.stroke(); }
            if (sp.pocketSquare) { g.fillStyle = sp.pocketSquare; g.beginPath(); g.moveTo(342, 186); g.lineTo(356, 156); g.lineTo(370, 176); g.lineTo(386, 152); g.lineTo(400, 184); g.closePath(); g.fill(); }
            if (sp.pin) { g.fillStyle = sp.pin; g.beginPath(); g.arc(150, 150, 9, 0, 7); g.fill(); }
            fold(g, [120, 250, 150, 320, 130, 400], 0.08); fold(g, [392, 250, 362, 320, 382, 400], 0.08);
          }
        } else if (k === "turtleneck") {
          g.fillStyle = "rgba(255,255,255,0.07)"; g.fillRect(150, 0, 212, 64);
          g.strokeStyle = "rgba(255,255,255,0.09)"; g.lineWidth = 3; for (let x = 158; x < 356; x += 12) { g.beginPath(); g.moveTo(x, 4); g.lineTo(x, 60); g.stroke(); }
          fold(g, [110, 180, 210, 260, 200, 330], 0.06); fold(g, [402, 180, 302, 260, 312, 330], 0.06);
        } else if (k === "tee" || k === "hoodie" || k === "jacket") {
          g.strokeStyle = "rgba(0,0,0,0.28)"; g.lineWidth = 6; g.beginPath(); g.arc(256, -10, 72, 0.12 * Math.PI, 0.88 * Math.PI); g.stroke();
          if (k === "hoodie") {
            g.strokeStyle = sp.strings || "#eeeeee"; g.lineWidth = 5; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(256 + s * 30, 50); g.lineTo(256 + s * 34, 200); g.stroke(); }
            g.strokeStyle = "rgba(0,0,0,0.28)"; g.lineWidth = 4; g.beginPath(); g.moveTo(140, 470); g.lineTo(170, 330); g.lineTo(342, 330); g.lineTo(372, 470); g.stroke();
            g.fillStyle = "rgba(0,0,0,0.15)"; g.fillRect(0, 470, W, 42);
          }
          if (k === "jacket") {
            g.fillStyle = sp.under || "#f4f4f4"; g.beginPath(); g.moveTo(200, 0); g.lineTo(312, 0); g.lineTo(276, H); g.lineTo(236, H); g.closePath(); g.fill();
            g.strokeStyle = "#b8bcc0"; g.lineWidth = 5; for (const x of [232, 280]) { g.beginPath(); g.moveTo(x, 40); g.lineTo(x + (x < 256 ? 4 : -4), H); g.stroke(); }
            g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 4; for (const x of [90, 360]) { g.beginPath(); g.moveTo(x, 300); g.lineTo(x + 50, 380); g.stroke(); }
          }
          if (sp.print) { g.fillStyle = sp.printColor || "#ffffff"; g.font = "900 54px Arial Black, Arial"; g.textAlign = "center"; g.fillText(sp.print, 256, 250); }
          fold(g, [120, 200, 200, 300, 170, 420], 0.07);
        } else if (k === "polo") {
          collar(g, top, 84); g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 3; g.strokeRect(236, 20, 40, 120); buttons(g, 256, [60, 100], "#ffffff");
          fold(g, [120, 220, 200, 300, 170, 420], 0.08);
        } else if (k === "labcoat") {
          g.fillStyle = sp.under || "#7a8fa8"; g.beginPath(); g.moveTo(180, 0); g.lineTo(332, 0); g.lineTo(256, 230); g.closePath(); g.fill();
          if (sp.tie) { g.save(); g.beginPath(); g.rect(0, 0, W, 230); g.clip(); tie(g, sp); g.restore(); }
          g.fillStyle = "rgba(0,0,0,0.14)"; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(256 + s * 76, 0); g.lineTo(256 + s * 120, 0); g.lineTo(256 + s * 26, 240); g.closePath(); g.fill(); }
          g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 3; g.beginPath(); g.moveTo(262, 230); g.lineTo(262, H); g.stroke(); buttons(g, 280, [290, 370, 450]);
          g.strokeRect(330, 160, 80, 70); g.fillStyle = "#1f3f8a"; g.fillRect(350, 140, 8, 46); g.fillStyle = "#c91a09"; g.fillRect(366, 146, 8, 40);
        } else if (k === "uniform") {
          g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 3; collar(g, top, 90);
          g.beginPath(); g.moveTo(256, 50); g.lineTo(256, H); g.stroke(); buttons(g, 256, [110, 200, 290, 380], "#d8b44a");
          for (const x of [96, 330]) { g.strokeRect(x, 150, 86, 80); g.beginPath(); g.moveTo(x, 172); g.lineTo(x + 86, 172); g.stroke(); }
          const rib = ["#c91a09", "#0055bf", "#f2cd37", "#237841", "#ffffff", "#c91a09"]; rib.forEach((c, i) => { g.fillStyle = c; g.fillRect(100 + (i % 3) * 26, 102 + Math.floor(i / 3) * 16, 24, 13); });
          g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(0, 456, W, 38); g.fillStyle = "#d8b44a"; g.fillRect(232, 456, 48, 38);
        } else if (k === "racing") {
          g.fillStyle = sp.stripe || "#ffffff"; g.fillRect(150, 0, 34, H); g.fillRect(328, 0, 34, H);
          g.strokeStyle = "#cfd3d6"; g.lineWidth = 6; g.beginPath(); g.moveTo(256, 30); g.lineTo(256, H); g.stroke();
          g.fillStyle = "#ffffff"; g.fillRect(70, 150, 70, 46); g.fillStyle = sp.stripe || "#0055bf"; g.fillRect(78, 158, 54, 30);
          g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 6; g.beginPath(); g.arc(256, -6, 66, 0.1 * Math.PI, 0.9 * Math.PI); g.stroke();
        } else if (k === "vest") { // tactical vest over a shirt
          g.fillStyle = sp.under || "#2c3440"; g.fillRect(0, 0, W, 90);
          g.fillStyle = "rgba(0,0,0,0.25)"; for (const x of [70, 300]) { g.fillRect(x, 300, 140, 110); g.fillRect(x, 300, 140, 22); }
          g.fillStyle = sp.labelColor || "#f2cd37"; g.font = "900 64px Arial Black, Arial"; g.textAlign = "center"; if (sp.label) g.fillText(sp.label, 256, 230);
        } else if (k === "blouse" || k === "dress") {
          g.fillStyle = "rgba(0,0,0,0.18)"; g.beginPath(); g.moveTo(170, 0); g.quadraticCurveTo(256, 150, 342, 0); g.closePath(); g.fill();
          g.fillStyle = sp.skin || YEL; g.beginPath(); g.moveTo(186, 0); g.quadraticCurveTo(256, 130, 326, 0); g.closePath(); g.fill();
          if (sp.necklace) { g.strokeStyle = sp.necklace; g.lineWidth = 5; g.beginPath(); g.moveTo(196, 0); g.quadraticCurveTo(256, 120, 316, 0); g.stroke(); g.fillStyle = sp.necklace; g.beginPath(); g.arc(256, 62, 9, 0, 7); g.fill(); }
          if (k === "blouse") buttons(g, 256, [180, 260, 340, 420], "rgba(255,255,255,0.7)");
          else { g.fillStyle = "rgba(0,0,0,0.2)"; g.fillRect(0, 430, W, 30); }
          fold(g, [140, 200, 210, 300, 170, 420], 0.08); fold(g, [372, 200, 302, 300, 342, 420], 0.08);
        } else { // "shirt"
          collar(g, top); if (sp.tie) tie(g, sp);
          g.strokeStyle = "rgba(0,0,0,0.18)"; g.lineWidth = 3; g.beginPath(); g.moveTo(256, 60); g.lineTo(256, H); g.stroke();
          if (!sp.tie) buttons(g, 256, [130, 230, 330, 430], "rgba(0,0,0,0.35)");
          g.strokeStyle = "rgba(0,0,0,0.22)"; g.lineWidth = 3; g.strokeRect(310, 160, 80, 80);
          g.fillStyle = "#1f3f8a"; g.fillRect(330, 140, 9, 44); g.fillStyle = "#c8c8c8"; g.fillRect(330, 136, 9, 8);
          fold(g, [110, 330, 170, 370, 200, 470], 0.1);
        }
        if (sp.badge) { g.fillStyle = "#ffffff"; g.fillRect(110, 190, 84, 62); g.fillStyle = sp.badge; g.fillRect(110, 190, 84, 18); g.fillStyle = "#888"; g.fillRect(122, 220, 56, 6); g.fillRect(122, 234, 40, 6); }
        if (sp.lanyard) { g.strokeStyle = sp.lanyard; g.lineWidth = 7; g.beginPath(); g.moveTo(190, 0); g.lineTo(240, 230); g.lineTo(290, 230); g.lineTo(322, 0); g.stroke(); g.fillStyle = "#fff"; g.fillRect(226, 230, 66, 80); g.fillStyle = sp.lanyard; g.fillRect(226, 230, 66, 18); }
        shade(g, W, H);
      });
    }
    function backTex(sp) {
      return canvasTex(256, 256, (g, W, H) => {
        g.fillStyle = sp.top; g.fillRect(0, 0, W, H);
        g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 3;
        if (sp.kind === "suit" || sp.kind === "blazer" || sp.kind === "labcoat") { g.beginPath(); g.moveTo(128, 40); g.lineTo(128, H); g.stroke(); }
        g.beginPath(); g.moveTo(66, 8); g.quadraticCurveTo(128, 26, 190, 8); g.stroke();
        if (sp.kind === "vest" && sp.label) { g.fillStyle = sp.labelColor || "#f2cd37"; g.font = "900 40px Arial Black, Arial"; g.textAlign = "center"; g.fillText(sp.label, 128, 130); }
        shade(g, W, H);
      });
    }
    function beltTex(sp) {
      return canvasTex(256, 48, (g, W, H) => {
        g.fillStyle = sp.legs; g.fillRect(0, 0, W, H);
        if (sp.belt !== false && sp.kind !== "dress" && sp.kind !== "racing") {
          g.fillStyle = sp.belt || "#2a1a10"; g.fillRect(0, 10, W, 26);
          g.fillStyle = sp.buckle || "#c9ced3"; g.fillRect(112, 6, 32, 34); g.fillStyle = sp.belt || "#2a1a10"; g.fillRect(120, 13, 16, 20);
          g.fillStyle = "rgba(0,0,0,0.25)"; for (const x of [40, 210]) g.fillRect(x, 10, 6, 26);
        }
      });
    }
    function thighTex(sp, side) {
      return canvasTex(128, 160, (g, W, H) => {
        g.fillStyle = sp.legs; g.fillRect(0, 0, W, H);
        g.strokeStyle = "rgba(0,0,0,0.28)"; g.lineWidth = 3;
        const ox = side > 0 ? 14 : W - 14, ix = side > 0 ? 40 : W - 40;
        g.beginPath(); g.moveTo(ox, 0); g.quadraticCurveTo(ix, 26, side > 0 ? 4 : W - 4, 44); g.stroke(); // pocket
        g.strokeStyle = "rgba(255,255,255,0.10)"; g.beginPath(); g.moveTo(W / 2, 30); g.lineTo(W / 2, H); g.stroke(); // crease
        if (sp.jeans) { g.strokeStyle = "rgba(230,190,120,0.55)"; g.lineWidth = 2; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(ox + (side > 0 ? 5 : -5), 0); g.quadraticCurveTo(ix + (side > 0 ? 5 : -5), 30, side > 0 ? 6 : W - 6, 50); g.stroke(); g.setLineDash([]); }
        shade(g, W, H);
      });
    }
    function shinTex(sp) {
      return canvasTex(128, 128, (g, W, H) => {
        g.fillStyle = sp.legsLow || sp.legs; g.fillRect(0, 0, W, H);
        g.strokeStyle = "rgba(255,255,255,0.10)"; g.lineWidth = 3; g.beginPath(); g.moveTo(W / 2, 0); g.lineTo(W / 2, H - 10); g.stroke();
        g.strokeStyle = "rgba(0,0,0,0.18)"; g.lineWidth = 3; g.beginPath(); g.moveTo(10, 10); g.quadraticCurveTo(64, 22, 118, 10); g.stroke(); // knee fold
        shade(g, W, H);
      });
    }
    const hairTexCache = {};
    function hairTex(col) {
      if (hairTexCache[col]) return hairTexCache[col];
      const t = canvasTex(256, 128, (g, W, H) => {
        g.fillStyle = col; g.fillRect(0, 0, W, H);
        for (let i = 0; i < 26; i++) {
          const x = rand(i) * W, w = 2 + rand(i + 3) * 3;
          g.strokeStyle = rand(i + 7) > 0.5 ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.04)"; g.lineWidth = w + 2;
          g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + (rand(i + 9) - 0.5) * 30, H * 0.5, x + (rand(i + 11) - 0.5) * 16, H); g.stroke();
        }
      });
      t.wrapS = THREE.RepeatWrapping; hairTexCache[col] = t; return t;
    }
    Object.assign(K, { torsoTex, hairTex });

    // ---- figure geometry (shared) ----
    const HIP_Y = 0.68, WAIST_Y = 0.77;
    const thighGeo = new THREE.BoxGeometry(0.215, 0.34, 0.24); thighGeo.translate(0, -0.17, 0);
    const shinGeo = new THREE.BoxGeometry(0.2, 0.27, 0.22); shinGeo.translate(0, -0.135, 0);
    const shoeGeo = new THREE.BoxGeometry(0.205, 0.07, 0.27); shoeGeo.translate(0, -0.035, 0.02);
    const soleGeo = new THREE.BoxGeometry(0.215, 0.02, 0.31); soleGeo.translate(0, -0.06, 0.03);
    const toeGeo = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
    const hipGeo = new THREE.BoxGeometry(0.46, 0.09, 0.26);
    const torsoGeo = new THREE.BoxGeometry(0.5, 0.56, 0.24, 6, 4, 2);
    { const p = torsoGeo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const y = p.getY(i), k = (y + 0.28) / 0.56; let x = p.getX(i) * (1 - 0.26 * k), z = p.getZ(i) * (1 - 0.1 * k);
        const xn = x / (0.25 * (1 - 0.26 * k));
        if (z > 0) z += 0.02 * (1 - xn * xn);            // chest curve
        let yy = y; if (y > 0.27) yy -= 0.035 * xn * xn;   // sloped shoulders
        p.setXYZ(i, x, yy, z);
      }
      torsoGeo.computeVertexNormals(); }
    const shoulderGeo = new THREE.SphereGeometry(0.06, 18, 12);
    const upperGeo = new THREE.CylinderGeometry(0.058, 0.053, 0.28, 18); upperGeo.translate(0, -0.14, 0);
    const sleeveGeo = new THREE.CylinderGeometry(0.066, 0.062, 0.13, 18); sleeveGeo.translate(0, -0.065, 0);
    const elbowGeo = new THREE.SphereGeometry(0.053, 14, 10);
    const foreGeo = new THREE.CylinderGeometry(0.052, 0.046, 0.23, 18); foreGeo.translate(0, -0.115, 0);
    const cuffGeo = new THREE.CylinderGeometry(0.051, 0.051, 0.035, 18);
    const wristGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.05, 12);
    const handGeo = new THREE.TorusGeometry(0.038, 0.019, 12, 24, Math.PI * 1.6);
    const watchGeo = new THREE.TorusGeometry(0.05, 0.01, 8, 24);
    const neckGeo = new THREE.CylinderGeometry(0.062, 0.066, 0.09, 16);
    const collarGeo = new THREE.CylinderGeometry(0.08, 0.086, 0.06, 24, 1, true);
    const turtleGeo = new THREE.CylinderGeometry(0.086, 0.09, 0.09, 24);
    const hoodGeo = new THREE.TorusGeometry(0.13, 0.05, 10, 24, Math.PI);
    const headGeo = (() => {
      const pts = [[0, 0], [0.11, 0], [0.14, 0.012], [0.152, 0.04], [0.156, 0.08], [0.157, 0.14], [0.156, 0.2], [0.15, 0.24], [0.135, 0.268], [0.1, 0.28], [0, 0.28]].map(([r, y]) => new THREE.Vector2(r, y));
      const g = new THREE.LatheGeometry(pts, 64, Math.PI, Math.PI * 2);
      const p = g.attributes.position, uv = g.attributes.uv;
      for (let i = 0; i < p.count; i++) uv.setY(i, p.getY(i) / 0.28);
      return g;
    })();
    const headStudGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.05, 20);
    // hair pieces (head-local; head top = 0.28, radius 0.157)
    const capHairGeo = new THREE.SphereGeometry(0.176, 48, 20, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const skirt = (r0, r1, h, gap) => new THREE.CylinderGeometry(r0, r1, h, 48, 1, true, gap, Math.PI * 2 - 2 * gap);
    const skirtShort = skirt(0.176, 0.178, 0.14, 1.4); // gap 1.4: sides stop behind the eyes (1.0 hid the eyes at 3/4 angles)
    const skirtBob = skirt(0.178, 0.205, 0.24, 0.85);
    const skirtLong = skirt(0.178, 0.22, 0.42, 0.85);
    const fringeGeo = new THREE.CylinderGeometry(0.179, 0.179, 0.05, 48, 1, true, -1.05, 2.1);
    const bangsGeo = new THREE.CylinderGeometry(0.179, 0.18, 0.06, 48, 1, true, -0.85, 1.7);
    const baldGeo = new THREE.CylinderGeometry(0.16, 0.161, 0.085, 48, 1, true, 1.6, Math.PI * 2 - 3.2);
    const burnGeo = new THREE.BoxGeometry(0.018, 0.07, 0.04);
    const curlGeo = new THREE.SphereGeometry(0.048, 12, 8);
    const lensGeo = new THREE.TorusGeometry(0.04, 0.007, 8, 28);
    const glassFrame = new THREE.MeshPhysicalMaterial({ color: "#2a2a2a", metalness: 0.7, roughness: 0.3 });
    const lensMat = new THREE.MeshPhysicalMaterial({ color: "#e8f2ff", roughness: 0.05, transparent: true, opacity: 0.18, clearcoat: 1 });
    const sunLens = new THREE.MeshPhysicalMaterial({ color: "#0d0d0d", roughness: 0.05, transparent: true, opacity: 0.85, clearcoat: 1 });
    const watchMat = new THREE.MeshPhysicalMaterial({ color: "#d9dde2", metalness: 0.95, roughness: 0.22 });

    /* fig(spec): spec fields (all optional except top/legs)
       top, legs, legsLow, kind: suit|blazer|shirt|turtleneck|tee|hoodie|jacket|polo|sweater|labcoat|uniform|racing|vest|blouse|dress
       shirt (under a suit), under (under blazer/jacket/labcoat/vest), tie, tieClip, pocketSquare, pin, badge, lanyard, necklace, label, print
       arms (sleeve colour), shortSleeves, cuffs, skin (K.SKIN.*; default toy yellow), eyes, lips, lashes, blush, age, freckles, brows
       hair, hairStyle: short|side|slick|buzz|curly|bob|long|ponytail|bun|bald|receding, beard, mustache, stubble
       glasses | sunglasses, watch, belt (false = none), buckle, shoes, skirt (dress/skirt colour; implied by kind dress),
       hat: fedora|cap|officer|helmet|hardhat|beret, hatColor, hatBand                                        */
    function makeFig(sp) {
      sp = Object.assign({ skin: YEL }, sp);
      const skinM = plastic(sp.skin);
      const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
      const isDress = sp.kind === "dress" || !!sp.skirt;
      const legCol = isDress ? (sp.stockings || sp.skin) : sp.legs;
      const legsM = plastic(legCol), lowM = plastic(isDress ? legCol : (sp.legsLow || sp.legs));
      const shoeM = plastic(sp.shoes || "#161616", { roughness: 0.22, clearcoat: 0.85 });
      const soleM = plastic(sp.sole || "#0d0d0d");
      const legSp = Object.assign({}, sp, { legs: legCol, legsLow: isDress ? legCol : sp.legsLow });
      const legs = [], knees = [];
      for (const s of [-1, 1]) {
        const L = new THREE.Group(); L.position.set(s * 0.112, HIP_Y, 0); body.add(L);
        const front = isDress ? legsM : plastic("#ffffff", { map: thighTex(legSp, -s) });
        L.add(new THREE.Mesh(thighGeo, [legsM, legsM, legsM, legsM, front, legsM]));
        const knee = new THREE.Group(); knee.position.y = -0.34; L.add(knee);
        const sf = isDress ? lowM : plastic("#ffffff", { map: shinTex(legSp) });
        knee.add(new THREE.Mesh(shinGeo, [lowM, lowM, lowM, lowM, sf, lowM]));
        const foot = new THREE.Group(); foot.position.y = -0.27; knee.add(foot);
        foot.add(new THREE.Mesh(shoeGeo, shoeM)); foot.add(new THREE.Mesh(soleGeo, soleM));
        const toe = new THREE.Mesh(toeGeo, shoeM); toe.scale.set(0.102, 0.065, 0.065); toe.position.set(0, -0.07, 0.155); foot.add(toe);
        legs.push(L); knees.push(knee);
      }
      { const hp = new THREE.Mesh(hipGeo, [legsM, legsM, legsM, legsM, plastic("#ffffff", { map: beltTex(Object.assign({}, sp, { legs: isDress ? (sp.skirt || sp.top) : sp.legs })) }), legsM]); hp.position.y = 0.725; body.add(hp); }
      if (isDress) { // A-line skirt over the thighs
        const sk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.31, 0.42, 32, 1, true), plastic(sp.skirt || sp.top, { side: THREE.DoubleSide }));
        sk.scale.z = 0.78; sk.position.y = 0.58; body.add(sk);
      }
      if (sp.kind === "labcoat") { // coat tails, open at the front
        const ct = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.38, 32, 1, true, 0.45, Math.PI * 2 - 0.9), plastic(sp.top, { side: THREE.DoubleSide }));
        ct.scale.z = 0.6; ct.position.y = 0.6; body.add(ct);
      }
      // upper body pivots at the waist (lean)
      const upper = new THREE.Group(); upper.position.y = WAIST_Y; body.add(upper);
      const topM = plastic(sp.top);
      const torso = new THREE.Mesh(torsoGeo, [topM, topM, topM, topM, plastic("#ffffff", { map: torsoTex(sp) }), plastic("#ffffff", { map: backTex(sp) })]);
      torso.position.y = 0.28; upper.add(torso);
      const sleeveM = plastic(sp.arms || sp.top);
      const cuffM = plastic(sp.cuffs || ((sp.kind === "suit" || sp.kind === "blazer") ? (sp.shirt || sp.under || "#f4f4f4") : (sp.arms || sp.top)));
      const arms = [], elbows = [], hands = [];
      for (const s of [-1, 1]) {
        const A = new THREE.Group(); A.position.set(s * 0.215, 0.47, 0); A.rotation.order = "ZXY"; upper.add(A);
        const inner = new THREE.Group(); inner.rotation.z = s * 0.1; A.add(inner);
        inner.add(new THREE.Mesh(shoulderGeo, sleeveM));
        if (sp.shortSleeves) { inner.add(new THREE.Mesh(upperGeo, skinM)); inner.add(new THREE.Mesh(sleeveGeo, sleeveM)); }
        else inner.add(new THREE.Mesh(upperGeo, sleeveM));
        const elbow = new THREE.Group(); elbow.position.y = -0.275; elbow.rotation.x = -0.3; inner.add(elbow);
        const armLow = sp.shortSleeves ? skinM : sleeveM;
        elbow.add(new THREE.Mesh(elbowGeo, armLow)); elbow.add(new THREE.Mesh(foreGeo, armLow));
        if (!sp.shortSleeves) { const c = new THREE.Mesh(cuffGeo, cuffM); c.position.y = -0.21; elbow.add(c); }
        if (sp.watch && s < 0) { const w = new THREE.Mesh(watchGeo, watchMat); w.rotation.x = Math.PI / 2; w.position.y = -0.18; elbow.add(w); }
        const wr = new THREE.Mesh(wristGeo, skinM); wr.position.y = -0.245; elbow.add(wr);
        const hand = new THREE.Group(); hand.position.set(0, -0.295, 0); elbow.add(hand);
        const h = new THREE.Mesh(handGeo, skinM); h.rotation.set(Math.PI / 2, 0, Math.PI * 0.7); hand.add(h);
        arms.push(A); elbows.push(elbow); hands.push(hand);
      }
      const neck = new THREE.Mesh(neckGeo, skinM); neck.position.y = 0.6; upper.add(neck);
      if (sp.kind === "turtleneck") { const c = new THREE.Mesh(turtleGeo, topM); c.position.y = 0.595; upper.add(c); }
      else if (["suit", "shirt", "polo", "uniform", "labcoat"].includes(sp.kind) || (sp.kind === "blazer" && sp.tie)) { const c = new THREE.Mesh(collarGeo, plastic(sp.kind === "suit" ? (sp.shirt || "#f4f4f4") : sp.kind === "labcoat" ? (sp.under || "#7a8fa8") : sp.top, { side: THREE.DoubleSide })); c.position.y = 0.59; upper.add(c); }
      if (sp.kind === "hoodie") { const hd = new THREE.Mesh(hoodGeo, topM); hd.rotation.x = -Math.PI / 2; hd.position.set(0, 0.565, -0.04); hd.scale.set(1.2, 1, 1); upper.add(hd); }
      if (sp.kind === "uniform") for (const s of [-1, 1]) { const ep = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.025, 0.12), plastic(sp.epaulette || sp.top)); ep.position.set(s * 0.17, 0.555, 0); ep.rotation.z = -s * 0.25; upper.add(ep); }

      const head = new THREE.Group(); head.position.y = 0.645; upper.add(head);
      const headMat = new THREE.MeshPhysicalMaterial({ color: "#ffffff", map: faceTex("neutral", sp), roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.15 });
      head.add(new THREE.Mesh(headGeo, headMat));
      const st = sp.hairStyle || (sp.hair ? "short" : "bald");
      if (!sp.hair || st === "bald") { const stud = new THREE.Mesh(headStudGeo, skinM); stud.position.y = 0.3; head.add(stud); }
      if (sp.hair) {
        const ht = hairTex(sp.hair);
        const hm = new THREE.MeshPhysicalMaterial({ color: "#ffffff", map: ht, bumpMap: ht, bumpScale: 0.05, roughness: 0.4, clearcoat: 0.35, clearcoatRoughness: 0.3, side: THREE.DoubleSide });
        const put = (geo, x, y, z, rx, ry, rz, sx, sy, sz) => { const m = new THREE.Mesh(geo, hm); m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, rz || 0); if (sx) m.scale.set(sx, sy, sz); head.add(m); return m; };
        if (st === "bald") put(baldGeo, 0, 0.14, 0);
        else {
          const capY = { slick: 0.2, buzz: 0.2, receding: 0.2 }[st] || 0.19;
          const capSY = { slick: 0.8, buzz: 0.85, curly: 0.9 }[st] || 0.86;
          const cap = put(capHairGeo, 0, capY, st === "receding" ? -0.02 : 0, st === "receding" ? -0.28 : st === "short" ? 0.1 : 0, 0, st === "side" ? -0.07 : 0, st === "buzz" ? 0.93 : 1, capSY, st === "buzz" ? 0.93 : 1.02);
          if (st === "long") put(skirtLong, 0, 0.0, 0);
          else if (st === "bob") put(skirtBob, 0, 0.09, 0);
          else if (st === "buzz") put(skirt(0.163, 0.163, 0.1, 1.4), 0, 0.15, 0);
          else put(skirtShort, 0, 0.13, 0);
          if (st === "curly") put(fringeGeo, 0, 0.2, 0);
          if (st === "side") put(fringeGeo, 0, 0.235, 0, 0, 0.35, -0.06);
          if (st === "bob" || st === "long" || st === "ponytail" || st === "bun") put(bangsGeo, 0, 0.215, 0, 0, st === "long" ? 0.3 : 0, 0);
          if (["short", "side", "slick", "buzz", "receding"].includes(st)) for (const s of [-1, 1]) put(burnGeo, s * 0.158, 0.13, -0.01, 0, 0, 0); // behind the cheek (z 0.045 read as a patch on the face)
          if (st === "curly") for (let i = 0; i < 34; i++) { const a = rand(i) * Math.PI * 2, e = 0.15 + rand(i + 4) * 1.2; if (Math.cos(a) > 0.55 && e > 0.9) continue; put(curlGeo, Math.sin(a) * Math.cos(e) * 0.17, 0.2 + Math.sin(e) * 0.1, Math.cos(a) * Math.cos(e) * 0.17); }
          if (st === "ponytail") { put(new THREE.CylinderGeometry(0.05, 0.022, 0.32, 16), 0, 0.06, -0.21, 0.35, 0, 0); put(new THREE.TorusGeometry(0.045, 0.014, 8, 16), 0, 0.2, -0.17, 0.35 + Math.PI / 2, 0, 0); }
          if (st === "bun") put(new THREE.SphereGeometry(0.075, 20, 14), 0, 0.27, -0.13);
        }
      }
      if (sp.glasses || sp.sunglasses) {
        const gl = new THREE.Group(); gl.position.set(0, 0.155, 0.158); head.add(gl);
        for (const s of [-1, 1]) {
          const r = new THREE.Mesh(lensGeo, glassFrame); r.position.x = s * 0.05; gl.add(r);
          const l = new THREE.Mesh(new THREE.CircleGeometry(0.037, 20), sp.sunglasses ? sunLens : lensMat); l.position.set(s * 0.05, 0, 0.002); gl.add(l);
          const arm = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.15), glassFrame); arm.position.set(s * 0.1, 0.004, -0.07); arm.rotation.y = s * -0.3; gl.add(arm);
        }
        gl.add(new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.008, 0.008), glassFrame));
      }
      if (sp.hat) {
        const hc = plastic(sp.hatColor || "#2b2b2b"), H = new THREE.Group(); head.add(H);
        const m = (geo, mat, x, y, z, rx) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.rotation.x = rx || 0; H.add(o); return o; };
        if (sp.hat === "fedora") { m(new THREE.CylinderGeometry(0.29, 0.29, 0.02, 40), hc, 0, 0.25, 0); m(new THREE.CylinderGeometry(0.15, 0.175, 0.17, 32), hc, 0, 0.34, 0); m(new THREE.CylinderGeometry(0.177, 0.177, 0.04, 32), plastic(sp.hatBand || "#111"), 0, 0.28, 0); }
        else if (sp.hat === "cap") { m(new THREE.SphereGeometry(0.18, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), hc, 0, 0.2, 0).scale.set(1, 0.72, 1); const b = m(new THREE.CylinderGeometry(0.15, 0.15, 0.02, 32, 1, false, -0.9, 1.8), hc, 0, 0.21, 0.1); b.scale.z = 1.2; }
        else if (sp.hat === "officer") { m(new THREE.CylinderGeometry(0.21, 0.175, 0.1, 32), hc, 0, 0.32, 0); m(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 32), plastic(sp.hatBand || "#111"), 0, 0.25, 0); const v = m(new THREE.CylinderGeometry(0.17, 0.17, 0.015, 32, 1, false, -0.8, 1.6), plastic("#111"), 0, 0.23, 0.05, 0.12); v.scale.z = 1.1; m(new THREE.SphereGeometry(0.025, 10, 8), plastic("#d8b44a", { metalness: 0.8 }), 0, 0.31, 0.2); }
        else if (sp.hat === "helmet") { const hcD = plastic(sp.hatColor || "#2b2b2b", { side: THREE.DoubleSide }); m(new THREE.SphereGeometry(0.205, 40, 20, Math.PI / 2 + 0.85, Math.PI * 2 - 1.7, 0, Math.PI * 0.62), hcD, 0, 0.12, 0); m(new THREE.SphereGeometry(0.206, 40, 10, 0, Math.PI * 2, 0, Math.PI * 0.3), hcD, 0, 0.12, 0); m(new THREE.BoxGeometry(0.3, 0.02, 0.05), plastic(sp.hatBand || "#ffffff"), 0, 0.31, 0.1); } // open face (a closed shell hid the face)
        else if (sp.hat === "hardhat") { m(new THREE.SphereGeometry(0.19, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), hc, 0, 0.2, 0); m(new THREE.CylinderGeometry(0.23, 0.23, 0.02, 32), hc, 0, 0.21, 0.02); }
        else if (sp.hat === "beret") { const b = m(new THREE.SphereGeometry(0.2, 32, 12), hc, -0.02, 0.27, 0); b.scale.set(1.05, 0.35, 1.05); }
        H.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      }
      root.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      const fig = { root, body, upper, legs, knees, arms, elbows, hands, head, headMat, spec: sp, face: "neutral" };
      fig.setFace = (e) => { if (fig.face !== e) { fig.face = e; headMat.map = faceTex(e, sp); } };
      scene.add(root);
      return fig;
    }
    K.fig = makeFig;
    // attach a prop to a hand (side "L" | "R"); the prop's origin sits in the fist
    K.attach = (fig, side, obj, x, y, z) => { fig.hands[side === "L" ? 0 : 1].add(obj); obj.position.set(x || 0, y || 0, z || 0); return obj; };

    /* ---- pose: call every frame for every visible figure ----
       o: x, z, y (floor height, default K.FL), ry, s (scale; 0 hides), sit (0..1), seat (seat height, default 0.42),
          walk (phase, use K.walkPh(t)), run (true = running stride), lean (forward tilt of the upper body),
          gesture: point|pointUp|cross|hips|phone|think|wave|cheer|shrug|facepalm|handshake|hold|present|fist|slam|write|type|reach|cover
          aL, aR (shoulder pitch, negative = forward/up), aLz, aRz (out to the side), aLy, aRy (twist inward), eL, eR (elbow, negative = bend)
          look: [x, z] world point to face, or hy (head yaw); nod (head pitch, + = down), tilt (head roll); face: expression
       expressions: neutral smile grin laugh frown sad worried angry determined shock smirk sly                          */
    const GEST = {
      point: { aR: -1.5, eR: -0.05, aRy: 0.15 },
      pointUp: { aR: -2.9, eR: -0.05 },
      cross: { aL: -0.3, aR: -0.3, aLy: 1.35, aRy: 1.35, eL: -1.8, eR: -1.8 },
      hips: { aLz: 0.8, aRz: 0.8, aLy: 1.6, aRy: 1.6, eL: -1.4, eR: -1.4 },
      phone: { aR: -2.0, aRy: 0.1, eR: -2.1, tilt: 0.1 },
      think: { aR: -1.6, aRy: 0.9, eR: -1.8, nod: -0.05 },
      wave: { aRz: 2.4, aRy: -0.3, eR: -0.5 },
      cheer: { aLz: 2.6, aRz: 2.6, eL: -0.2, eR: -0.2 },
      shrug: { aLz: 0.45, aRz: 0.45, aLy: -1.2, aRy: -1.2, eL: -1.3, eR: -1.3, tilt: 0.12 },
      facepalm: { aR: -2.0, aRy: 1.0, eR: -1.4, nod: 0.2 },
      handshake: { aR: -0.8, eR: -0.55, aRy: 0.2 },
      hold: { aL: -0.25, aR: -0.25, eL: -1.35, eR: -1.35 },
      present: { aL: -0.7, aR: -0.7, aLz: 0.55, aRz: 0.55, eL: -0.35, eR: -0.35 },
      fist: { aR: -2.5, aRz: 0.3, eR: -1.2 },
      slam: { aR: -0.95, eR: -0.8 },
      write: { aR: -0.45, aRy: 0.6, eR: -1.0 },
      type: { aL: -0.35, aR: -0.35, aLy: 0.25, aRy: 0.25, eL: -1.2, eR: -1.2 },
      reach: { aR: -1.25, eR: -0.25 },
      cover: { aL: -1.7, aR: -1.7, aLy: 0.6, aRy: 0.6, eL: -1.6, eR: -1.6, nod: 0.15 },
    };
    K.GESTURES = Object.keys(GEST);
    function P(f, o) {
      if (o.gesture && GEST[o.gesture]) o = Object.assign({}, GEST[o.gesture], o);
      f.root.visible = true;
      const ry = o.ry || 0, sit = o.sit || 0, seat = o.seat == null ? 0.42 : o.seat;
      const base = o.y != null ? o.y : (K.FL || 0);
      f.root.position.set(o.x || 0, base + (seat + 0.14 - HIP_Y) * sit, o.z || 0);
      f.root.rotation.y = ry;
      const s = o.s == null ? 1 : Math.max(1e-4, o.s); f.root.scale.setScalar(s);
      let swing = 0, armSwing = 0, kL = 0, kR = 0, lean = o.lean || 0, bob = 0;
      if (o.walk != null) {
        const amp = o.run ? 0.95 : 0.55, ph = o.walk;
        swing = amp * Math.sin(ph); armSwing = (o.run ? 0.9 : 0.45) * Math.sin(ph);
        kL = (o.run ? 1.1 : 0.5) * Math.max(0, Math.sin(ph + 1.3)); kR = (o.run ? 1.1 : 0.5) * Math.max(0, -Math.sin(ph + 1.3));
        bob = (o.run ? 0.06 : 0.025) * Math.abs(Math.sin(ph)); if (o.run) lean += 0.22;
      }
      f.body.position.y = bob;
      f.legs[0].rotation.x = -Math.PI / 2 * sit + swing; f.legs[1].rotation.x = -Math.PI / 2 * sit - swing;
      f.knees[0].rotation.x = Math.PI / 2 * sit + kL; f.knees[1].rotation.x = Math.PI / 2 * sit + kR;
      f.upper.rotation.x = lean;
      const runE = o.walk != null && o.run ? -1.3 : null;
      f.arms[0].rotation.set((o.aL || 0) - armSwing, o.aLy || 0, -(o.aLz || 0));
      f.arms[1].rotation.set((o.aR || 0) + armSwing, -(o.aRy || 0), (o.aRz || 0));
      f.elbows[0].rotation.x = o.eL != null ? o.eL : (runE != null ? runE : -0.3);
      f.elbows[1].rotation.x = o.eR != null ? o.eR : (runE != null ? runE : -0.3);
      if (o.look) {
        const a = Math.atan2(o.look[0] - (o.x || 0), o.look[1] - (o.z || 0)) - ry;
        f.head.rotation.y = Math.max(-0.8, Math.min(0.8, Math.atan2(Math.sin(a), Math.cos(a)))); // >0.8 hides the face behind the hair
      } else f.head.rotation.y = Math.max(-0.8, Math.min(0.8, o.hy || 0));
      f.head.rotation.x = o.nod || 0; f.head.rotation.z = o.tilt || 0;
      if (o.face) f.setFace(o.face);
    }
    K.P = P;
    K.walkPh = (t, speed) => t * (speed || 9);
    K.hideAll = (figs) => figs.forEach((f) => { f.root.visible = false; f.setFace("neutral"); });

    // =====================================================================
    // SCENERY + PROPS. Every helper: (parent, x, y, z, ...) -> THREE.Group, y = floor height (usually K.FL).
    // =====================================================================
    K.FL = 0.08;
    const G = (parent, x, y, z, ry) => { const g = new THREE.Group(); g.position.set(x || 0, y || 0, z || 0); g.rotation.y = ry || 0; parent.add(g); return g; };
    K.group = G;
    const skyTex = (top, bot, draw) => canvasTex(512, 384, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, W, H); if (draw) draw(g, W, H); });
    const skyline = (lit, dark, winA, winB) => (g, W, H) => {
      for (let i = 0; i < 16; i++) {
        const w = 24 + rand(i) * 40, h = 80 + rand(i + 40) * 230, x = i * 33 - 10;
        g.fillStyle = i % 2 ? dark : lit; g.fillRect(x, H - h, w, h);
        if (winA) for (let yy = H - h + 10; yy < H - 6; yy += 16) for (let xx = x + 5; xx < x + w - 6; xx += 11) if (rand(xx * 3 + yy) > 0.55) { g.fillStyle = rand(xx + yy * 7) > 0.5 ? winA : winB; g.fillRect(xx, yy, 5, 7); }
      }
    };
    K.cityTex = skyTex("#0b1a33", "#2a3f66", skyline("#1b2a47", "#14213a", "#ffd58a", "#fff1c9"));
    K.dayTex = skyTex("#5aa0e6", "#cfe6fa", skyline("#9fb4c8", "#8aa1b6", "#dfeaf4", "#c3d3e2"));
    K.sunsetTex = skyTex("#3a2a5a", "#f29a5a", skyline("#3a2f45", "#2d2438", "#ffd58a", "#ffb36a"));
    // window with a view (view: K.cityTex | K.dayTex | K.sunsetTex | any texture)
    K.windowPane = (parent, w, h, x, y, z, ry, view, frameCol) => {
      const g = G(parent, x, y, z, ry);
      add(g, new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: view || K.cityTex }), 0, 0, -0.12);
      add(g, new THREE.PlaneGeometry(w, h), glass(), 0, 0, 0);
      const fm = plastic(frameCol || "#f2f3f2");
      for (const [fw, fh, fx, fy] of [[w + 0.12, 0.08, 0, h / 2], [w + 0.12, 0.08, 0, -h / 2], [0.08, h, -w / 2, 0], [0.08, h, w / 2, 0], [0.06, h, 0, 0]]) add(g, new THREE.BoxGeometry(fw, fh, 0.14), fm, fx, fy, 0);
      return g;
    };
    // a room corner: studded floor plate + back wall (+ optional left wall). Returns { g, wallZ, leftX }
    K.room = (parent, o) => {
      o = Object.assign({ nx: 16, nz: 12, floor: "#6c6e68", wall: ["#e4cd9e", "#dcc391", "#e9d6ab"], rows: 7, left: true, leftWall: null, window: null, door: false }, o || {});
      const g = G(parent, 0, 0, 0);
      plate(g, o.floor, o.nx, o.nz, 0, K.FL, 0, K.FL, true);
      const W = o.nx * PITCH, D = o.nz * PITCH, wallZ = -D / 2 + PITCH / 2;
      const nb = Math.floor(o.nx / 2);
      const hole = o.window ? (r, x) => r >= 2 && r <= 5 && Math.abs(x - W / 2 - (o.windowX || 0)) < 1.2 : null;
      const wb = G(g, 0, K.FL, 0); brickWall(wb, o.wall, -W / 2, wallZ, nb, o.rows, hole);
      if (o.window) { K.windowPane(wb, 2.3, 1.85, o.windowX || 0, 1.92, wallZ, 0, o.window); add(wb, new THREE.BoxGeometry(3.4, 2.1, 0.05), plastic(o.wall[0]), o.windowX || 0, 1.92, wallZ - 0.17); } // backing: hides gaps beside the window
      let leftX = null;
      if (o.left) { leftX = -W / 2 + PITCH / 2; const lw = G(g, leftX, K.FL, 0, Math.PI / 2); brickWall(lw, o.leftWall || o.wall, -D / 2 + PITCH, 0, Math.floor(o.nz / 2) - 1, o.rows); }
      if (o.door) K.door(g, o.doorX || W / 2 - 1.4, K.FL, wallZ + 0.22, 0, o.doorColor);
      return { g, wallZ, leftX };
    };
    K.door = (parent, x, y, z, ry, col) => {
      const g = G(parent, x, y, z, ry);
      const pivot = new THREE.Group(); pivot.position.x = -0.58; g.add(pivot);
      add(pivot, new THREE.BoxGeometry(1.16, 2.38, 0.08), plastic(col || "#6b3a1f", { roughness: 0.4 }), 0.58, 1.19, 0);
      for (const yy of [0.6, 1.7]) add(pivot, new THREE.BoxGeometry(0.9, 0.7, 0.02), plastic(darken(col || "#6b3a1f", 0.85)), 0.58, yy, 0.045);
      add(pivot, new THREE.SphereGeometry(0.05, 12, 8), metal("#c8a23a"), 1.02, 1.15, 0.07);
      const fm = plastic("#3b2414");
      for (const [fw, fh, fx, fy] of [[1.36, 0.1, 0, 2.44], [0.1, 2.44, -0.64, 1.22], [0.1, 2.44, 0.64, 1.22]]) add(g, new THREE.BoxGeometry(fw, fh, 0.12), fm, fx, fy, 0);
      g.userData.pivot = pivot; return g; // open: g.userData.pivot.rotation.y = -1.2
    };
    K.chair = (parent, x, y, z, ry, col) => { // office chair, seat top at 0.42
      const g = G(parent, x, y, z, ry), c = plastic(col || "#1b1b1b");
      add(g, new THREE.BoxGeometry(0.56, 0.07, 0.5), c, 0, 0.385, 0);
      add(g, new THREE.BoxGeometry(0.56, 0.6, 0.07), c, 0, 0.74, -0.25, { rx: -0.08 });
      add(g, new THREE.CylinderGeometry(0.04, 0.04, 0.32, 12), metal("#8a8f94"), 0, 0.2, 0);
      for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; add(g, new THREE.BoxGeometry(0.05, 0.04, 0.28), c, Math.sin(a) * 0.13, 0.04, Math.cos(a) * 0.13, { ry: a }); add(g, new THREE.SphereGeometry(0.035, 8, 6), c, Math.sin(a) * 0.26, 0.03, Math.cos(a) * 0.26); }
      return g;
    };
    K.desk = (parent, x, y, z, ry, w, d, col) => { // top at 0.74
      const g = G(parent, x, y, z, ry); w = w || 2.0; d = d || 0.9; const m = plastic(col || "#8a5a2b", { roughness: 0.25, clearcoat: 0.8 });
      add(g, new THREE.BoxGeometry(w, 0.08, d), m, 0, 0.74, 0);
      for (const s of [-1, 1]) add(g, new THREE.BoxGeometry(0.1, 0.7, d - 0.1), m, s * (w / 2 - 0.1), 0.35, 0);
      add(g, new THREE.BoxGeometry(w - 0.2, 0.4, 0.04), m, 0, 0.5, -d / 2 + 0.06);
      return g;
    };
    K.table = (parent, x, y, z, ry, w, d, col) => { // conference table, top at 0.82
      const g = G(parent, x, y, z, ry); w = w || 4.4; d = d || 1.3; const m = plastic(col || "#5c2c14", { roughness: 0.22, clearcoat: 0.9 });
      add(g, new THREE.BoxGeometry(w, 0.1, d), m, 0, 0.82, 0);
      for (const s of [-1, 1]) add(g, new THREE.CylinderGeometry(0.2, 0.24, 0.76, 20), plastic("#2b2b2b"), s * w * 0.32, 0.38, 0);
      return g;
    };
    K.sofa = (parent, x, y, z, ry, col) => {
      const g = G(parent, x, y, z, ry), m = plastic(col || "#7a1e1e", { roughness: 0.5, clearcoat: 0.2 });
      add(g, new THREE.BoxGeometry(1.8, 0.36, 0.8), m, 0, 0.22, 0); add(g, new THREE.BoxGeometry(1.8, 0.5, 0.2), m, 0, 0.6, -0.32);
      for (const s of [-1, 1]) add(g, new THREE.BoxGeometry(0.2, 0.5, 0.8), m, s * 0.9, 0.35, 0);
      return g;
    };
    K.plant = (parent, x, y, z, s) => {
      const g = G(parent, x, y, z); g.scale.setScalar(s || 1);
      add(g, new THREE.CylinderGeometry(0.22, 0.17, 0.36, 20), plastic("#b04a2a"), 0, 0.18, 0);
      const leaf = plastic("#237841");
      for (let i = 0; i < 9; i++) add(g, new THREE.SphereGeometry(0.15 + rand(i) * 0.07, 14, 10), leaf, (rand(i + 2) - 0.5) * 0.4, 0.5 + rand(i + 4) * 0.5, (rand(i + 6) - 0.5) * 0.34);
      return g;
    };
    K.lamp = (parent, x, y, z, on) => { // desk lamp; g.userData.light / bulb
      const g = G(parent, x, y, z), blk = plastic("#1b1b1b");
      add(g, new THREE.CylinderGeometry(0.1, 0.12, 0.03, 20), blk, 0, 0.015, 0);
      add(g, new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), blk, 0.04, 0.2, 0, { rz: -0.25 });
      add(g, new THREE.ConeGeometry(0.12, 0.14, 20, 1, true), plastic("#1b1b1b", { side: THREE.DoubleSide }), 0.1, 0.42, 0);
      const bulbM = new THREE.MeshPhysicalMaterial({ color: "#fff3cf", emissive: "#ffd27a", emissiveIntensity: on === false ? 0 : 2 });
      add(g, new THREE.SphereGeometry(0.045, 12, 8), bulbM, 0.1, 0.37, 0);
      const L = new THREE.PointLight(0xffd27a, on === false ? 0 : 1.2, 3); L.position.set(0.1, 0.3, 0.1); g.add(L);
      g.userData.light = L; g.userData.bulb = bulbM; return g;
    };
    K.bookshelf = (parent, x, y, z, ry) => {
      const g = G(parent, x, y, z, ry), wood = plastic("#6b3a1f", { roughness: 0.35 });
      add(g, new THREE.BoxGeometry(1.4, 2.0, 0.4), wood, 0, 1.0, -0.02);
      const cols = ["#c91a09", "#0055bf", "#237841", "#f2cd37", "#e9e9e9", "#5a3a7a", "#1b1b1b"];
      for (let r = 0; r < 4; r++) { add(g, new THREE.BoxGeometry(1.3, 0.03, 0.36), wood, 0, 0.12 + r * 0.48, 0.03); let xx = -0.6; let i = 0; while (xx < 0.58) { const w = 0.05 + rand(r * 20 + i) * 0.05, h = 0.26 + rand(r * 30 + i) * 0.14; add(g, new THREE.BoxGeometry(w, h, 0.28), plastic(cols[(r * 3 + i) % cols.length]), xx + w / 2, 0.14 + r * 0.48 + h / 2, 0.06); xx += w + 0.008; i++; } }
      return g;
    };
    // flat screen / whiteboard / sign: content is a canvas draw function or lines of text
    function panelTex(content, w, h, bg, fg, font) { return typeof content === "function" ? canvasTex(w, h, content) : textTex(content, bg, fg, w, h, font); }
    K.whiteboard = (parent, x, y, z, ry, content, W, H) => {
      const g = G(parent, x, y, z, ry); W = W || 1.8; H = H || 1.1;
      add(g, new THREE.BoxGeometry(W + 0.08, H + 0.08, 0.04), metal("#b8bcc0", 0.4), 0, 0, -0.02);
      const m = add(g, new THREE.PlaneGeometry(W, H), new THREE.MeshPhysicalMaterial({ map: panelTex(content || [""], 640, Math.round(640 * H / W), "#f7f7f2", "#1f3f8a", "700 70px Kalam, Comic Sans MS, sans-serif"), roughness: 0.25, clearcoat: 0.6 }), 0, 0, 0.002);
      g.userData.face = m; return g;
    };
    K.tv = (parent, x, y, z, ry, content, W, H) => { // wall/standing screen; emissive face
      const g = G(parent, x, y, z, ry); W = W || 1.6; H = H || 0.9;
      add(g, new THREE.BoxGeometry(W + 0.06, H + 0.06, 0.06), plastic("#111111", { roughness: 0.2, clearcoat: 1 }), 0, 0, -0.03);
      const tex = panelTex(content || [""], 640, Math.round(640 * H / W), "#0b1a33", "#ffffff");
      const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
      const face = add(g, new THREE.PlaneGeometry(W, H), mat, 0, 0, 0.002); face.castShadow = false;
      g.userData.mat = mat; return g;
    };
    K.sign = (parent, x, y, z, ry, lines, bg, fg, W, H) => { // brick sign plate with printed text
      const g = G(parent, x, y, z, ry); W = W || 1.6; H = H || 0.45;
      const pm = plastic(bg || "#1b1b1b");
      add(g, new THREE.BoxGeometry(W, H, 0.08), [pm, pm, pm, pm, plastic("#ffffff", { map: textTex(lines, bg || "#1b1b1b", fg || "#ffffff", 1024, Math.round(1024 * H / W), "900 " + Math.round(Math.min(90, 640 * H / W / lines.length)) + "px Arial Black, Arial") }), pm], 0, 0, 0);
      return g;
    };
    K.laptop = (parent, x, y, z, ry, screenCol) => {
      const g = G(parent, x, y, z, ry), al = metal("#c9ced3", 0.35);
      add(g, new THREE.BoxGeometry(0.42, 0.02, 0.3), al, 0, 0.01, 0);
      const lid = new THREE.Group(); lid.position.set(0, 0.02, -0.15); lid.rotation.x = -0.25; g.add(lid);
      add(lid, new THREE.BoxGeometry(0.42, 0.28, 0.012), al, 0, 0.14, 0);
      add(lid, new THREE.PlaneGeometry(0.38, 0.24), new THREE.MeshBasicMaterial({ color: screenCol || "#7fb2ff", toneMapped: false }), 0, 0.14, 0.007);
      return g;
    };
    K.monitor = (parent, x, y, z, ry, content) => {
      const g = G(parent, x, y, z, ry), blk = plastic("#151515", { roughness: 0.25, clearcoat: 0.8 });
      add(g, new THREE.BoxGeometry(0.22, 0.02, 0.16), blk, 0, 0.01, 0); add(g, new THREE.BoxGeometry(0.04, 0.26, 0.03), blk, 0, 0.14, -0.03);
      add(g, new THREE.BoxGeometry(0.64, 0.4, 0.03), blk, 0, 0.42, 0);
      const mat = new THREE.MeshBasicMaterial({ map: panelTex(content || [""], 512, 320, "#10243f", "#ffffff", "900 60px Arial Black, Arial"), toneMapped: false });
      add(g, new THREE.PlaneGeometry(0.6, 0.36), mat, 0, 0.42, 0.016).castShadow = false;
      g.userData.mat = mat; return g;
    };
    K.phone = (col) => { // smartphone prop for K.attach (held upright in the fist)
      const g = new THREE.Group();
      add(g, new THREE.BoxGeometry(0.09, 0.17, 0.014), plastic(col || "#1b1b1b", { roughness: 0.2, clearcoat: 1 }), 0, 0.03, 0.03);
      add(g, new THREE.PlaneGeometry(0.08, 0.155), new THREE.MeshBasicMaterial({ color: "#2b5fa8", toneMapped: false }), 0, 0.03, 0.038);
      return g;
    };
    K.oldPhone = (parent, x, y, z, ry, col) => { // desk phone with handset
      const g = G(parent, x, y, z, ry), m = plastic(col || "#1b1b1b");
      add(g, new THREE.BoxGeometry(0.32, 0.08, 0.26), m, 0, 0.04, 0);
      add(g, new THREE.BoxGeometry(0.34, 0.05, 0.08), m, 0, 0.11, -0.04);
      for (const s of [-1, 1]) add(g, new THREE.SphereGeometry(0.05, 12, 8), m, s * 0.15, 0.12, -0.04);
      return g;
    };
    K.mug = (parent, x, y, z, col) => add(parent, new THREE.CylinderGeometry(0.07, 0.065, 0.16, 16), plastic(col || "#f2f3f2"), x, y + 0.08, z);
    K.papers = (parent, x, y, z, n, ry) => { const g = G(parent, x, y, z, ry); const m = plastic("#f6f6f2", { roughness: 0.6, clearcoat: 0 }); for (let i = 0; i < (n || 3); i++) add(g, new THREE.BoxGeometry(0.34, 0.008, 0.44), m, (rand(i) - 0.5) * 0.04, 0.005 + i * 0.009, (rand(i + 3) - 0.5) * 0.04, { ry: (rand(i + 5) - 0.5) * 0.3 }); return g; };
    K.contract = (title) => { // a printed document (prop): plane-ish box with lines; title optional
      const g = new THREE.Group();
      add(g, new THREE.BoxGeometry(0.3, 0.4, 0.008), plastic("#ffffff", { map: canvasTex(240, 320, (c, W, H) => {
        c.fillStyle = "#fbfbf7"; c.fillRect(0, 0, W, H); c.fillStyle = "#1b1b1b"; c.font = "900 26px Arial Black, Arial"; c.textAlign = "center"; c.fillText(title || "CONTRACT", W / 2, 44);
        c.fillStyle = "#9a9a9a"; for (let y = 76; y < 250; y += 16) c.fillRect(24, y, W - 48 - (y % 48 ? 0 : 50), 5);
        c.strokeStyle = "#1f3f8a"; c.lineWidth = 3; c.beginPath(); c.moveTo(130, 290); c.bezierCurveTo(150, 270, 170, 300, 210, 280); c.stroke();
      }), roughness: 0.6, clearcoat: 0 }), 0, 0, 0);
      return g;
    };
    K.briefcase = (col) => { const g = new THREE.Group(), m = plastic(col || "#3a2414", { roughness: 0.35 }); add(g, new THREE.BoxGeometry(0.42, 0.3, 0.1), m, 0, -0.2, 0); add(g, new THREE.TorusGeometry(0.06, 0.015, 8, 16, Math.PI), m, 0, -0.05, 0); for (const s of [-1, 1]) add(g, new THREE.BoxGeometry(0.04, 0.03, 0.105), metal("#d8b44a"), s * 0.12, -0.08, 0); return g; };
    K.cash = (parent, x, y, z, nx, nz, layers) => { // stacks of bank-note bricks (green, banded)
      const g = G(parent, x, y, z); const note = plastic("#5f8f4e", { roughness: 0.6, clearcoat: 0.1 }), band = plastic("#e9e2c8");
      for (let a = 0; a < (nx || 2); a++) for (let b = 0; b < (nz || 2); b++) for (let l = 0; l < (layers || 3); l++) { const yy = 0.05 + l * 0.1; add(g, new THREE.BoxGeometry(0.4, 0.09, 0.2), note, a * 0.42, yy, b * 0.22); add(g, new THREE.BoxGeometry(0.06, 0.092, 0.202), band, a * 0.42, yy, b * 0.22); }
      return g;
    };
    K.podium = (parent, x, y, z, ry, col) => { const g = G(parent, x, y, z, ry), m = plastic(col || "#6b3a1f", { roughness: 0.3, clearcoat: 0.8 }); add(g, new THREE.BoxGeometry(0.8, 1.0, 0.5), m, 0, 0.5, 0); add(g, new THREE.BoxGeometry(0.9, 0.06, 0.6), m, 0, 1.03, 0.02, { rx: 0.25 }); add(g, new THREE.CylinderGeometry(0.012, 0.012, 0.36, 8), plastic("#1b1b1b"), 0.15, 1.2, 0.15, { rx: -0.6 }); add(g, new THREE.SphereGeometry(0.04, 12, 8), plastic("#1b1b1b"), 0.15, 1.33, 0.27); return g; };
    K.trophy = (parent, x, y, z, col) => { const g = G(parent, x, y, z), m = metal(col || "#d8b44a", 0.2); add(g, new THREE.BoxGeometry(0.3, 0.12, 0.3), plastic("#1b1b1b"), 0, 0.06, 0); add(g, new THREE.CylinderGeometry(0.03, 0.05, 0.2, 12), m, 0, 0.22, 0); add(g, new THREE.CylinderGeometry(0.17, 0.08, 0.26, 24), m, 0, 0.45, 0); for (const s of [-1, 1]) add(g, new THREE.TorusGeometry(0.07, 0.015, 8, 16), m, s * 0.18, 0.46, 0); return g; };
    /* K.car(parent, x, y, z, ry, o): brick car, nose toward +x. o = { color, kind: "sedan"|"racer", number, stripe }
       g.userData.wheels (spin with rotation.z) */
    K.car = (parent, x, y, z, ry, o) => {
      o = o || {}; const g = G(parent, x, y, z, ry), paint = plastic(o.color || "#c91a09", { roughness: 0.15, clearcoat: 1 });
      const racer = o.kind === "racer", blk = plastic("#151515"), wheels = [];
      add(g, new THREE.BoxGeometry(racer ? 2.2 : 1.9, 0.26, 0.86), paint, 0, 0.32, 0);
      if (racer) { add(g, new THREE.BoxGeometry(0.8, 0.16, 0.8), paint, 0.75, 0.45, 0, { rz: -0.15 }); add(g, new THREE.BoxGeometry(0.5, 0.2, 0.6), glass("#1b2a47"), -0.05, 0.52, 0, { rz: 0.35 }); add(g, new THREE.BoxGeometry(0.7, 0.18, 0.84), paint, -0.65, 0.5, 0); }
      else { add(g, new THREE.BoxGeometry(1.0, 0.34, 0.8), paint, -0.1, 0.6, 0); for (const s of [-1, 1]) add(g, new THREE.PlaneGeometry(0.9, 0.24), glass("#1b2a47"), -0.1, 0.62, s * 0.405, { ry: s > 0 ? 0 : Math.PI }); add(g, new THREE.PlaneGeometry(0.76, 0.26), glass("#1b2a47"), 0.41, 0.62, 0, { ry: Math.PI / 2 }); }
      if (o.stripe) add(g, new THREE.BoxGeometry(racer ? 2.21 : 1.91, 0.02, 0.18), plastic(o.stripe), 0, 0.455, 0);
      if (o.number != null) for (const s of [-1, 1]) add(g, new THREE.CircleGeometry(0.14, 24), plastic("#ffffff", { map: textTex([String(o.number)], "#ffffff", "#111111", 128, 128, "900 80px Arial Black, Arial") }), 0, 0.33, s * 0.432, { ry: s > 0 ? 0 : Math.PI });
      for (const [wx, wz] of [[0.65, 0.42], [0.65, -0.42], [-0.65, 0.42], [-0.65, -0.42]]) { const w = new THREE.Group(); w.position.set(wx, 0.17, wz); g.add(w); add(w, new THREE.CylinderGeometry(0.17, 0.17, 0.12, 24), blk, 0, 0, 0, { rx: Math.PI / 2 }); add(w, new THREE.CylinderGeometry(0.09, 0.09, 0.125, 16), metal(), 0, 0, 0, { rx: Math.PI / 2 }); wheels.push(w); }
      for (const s of [-1, 1]) add(g, new THREE.BoxGeometry(0.03, 0.06, 0.14), new THREE.MeshBasicMaterial({ color: "#fff6d0", toneMapped: false }), racer ? 1.1 : 0.96, 0.36, s * 0.3);
      g.userData.wheels = wheels; return g;
    };
    // a crowd of full figures in rows (returns figs; pose them with K.P or leave them standing)
    K.crowd = (specs) => specs.map((sp) => makeFig(sp));
    // varied random-but-deterministic people specs (seed shifts the mix)
    K.randomSpecs = (n, seed, kinds) => {
      const tops = ["#1f2f4f", "#2a2a30", "#5b616b", "#e9eef5", "#cfe0f2", "#8a1f2f", "#237841", "#d9d0b8", "#f2efe6", "#3d3a35", "#5a3a7a", "#b04a2a"];
      const hairs = ["#2a1a10", "#3b2a1a", "#7a5a3a", "#c9a26b", "#1c1c1c", "#9a9a9a", "#dcdcdc", "#8a3a1a"];
      const skins = [K.SKIN.toy, K.SKIN.toy, K.SKIN.light, K.SKIN.medium, K.SKIN.tan, K.SKIN.dark];
      const styles = ["short", "side", "slick", "curly", "bob", "long", "ponytail", "bun", "bald", "buzz", "receding"];
      const ks = kinds || ["suit", "shirt", "blazer", "polo", "sweater", "blouse", "tee"];
      const out = [];
      for (let i = 0; i < n; i++) {
        const r = (k) => rand(seed * 101 + i * 13 + k);
        const kind = ks[Math.floor(r(1) * ks.length)], st = styles[Math.floor(r(2) * styles.length)];
        const fem = ["bob", "long", "ponytail", "bun"].includes(st);
        const top = tops[Math.floor(r(3) * tops.length)];
        out.push({ kind: fem && kind === "suit" ? "blazer" : kind, top, legs: ["#2a2a30", "#1f2a44", "#3a3f47", "#4a3b2c", "#2e4a7a"][Math.floor(r(4) * 5)],
          shirt: "#f4f4f4", under: "#f4f4f4", tie: kind === "suit" || (kind === "shirt" && r(5) > 0.5) ? ["#b81d24", "#2d63b0", "#3f6b3a", "#c7a23a"][Math.floor(r(6) * 4)] : null,
          hair: hairs[Math.floor(r(7) * hairs.length)], hairStyle: st, skin: skins[Math.floor(r(8) * skins.length)],
          lips: fem ? "#b0303a" : null, lashes: fem, glasses: r(9) > 0.75, watch: r(10) > 0.6, age: r(11) > 0.75, beard: !fem && r(12) > 0.85 ? "#4a4038" : null,
          skirt: fem && r(13) > 0.5 ? darken(top, 0.8) : null, shortSleeves: kind === "tee" || kind === "polo" });
      }
      return out;
    };
    return K;
  }
  window.BRICK = { setup, rand, clamp01 };
})();
