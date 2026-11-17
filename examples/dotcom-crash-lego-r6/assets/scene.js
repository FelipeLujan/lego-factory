/* ============================================================================
   DOTCOM-CRASH-LEGO (brick-cinematic, round 1): "Add .com, get rich?"
   The sets live in assets/dc-sets.js (11 brick-built environments), the helpers + story props in assets/dc-kit.js,
   the shared prop library in assets/props-kit.js. This file: looks, cast, cue times and one shot function per set.
   Everything is a pure function of t (no Math.random). Camera steady on captions (the stage adds chapter push/whip only).
   ============================================================================ */
(function () {
  const F = window.FILM;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const mix = (a, b, k) => a + (b - a) * k;
  const ss = (a, b, x) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  let K, X, PK, D, THREE, W, O, FL = 0.08;
  const C = {}, FIGS = [];

  // ---------------------------------------------------------------- looks: warm practical key + cool rim everywhere
  const GRADE = { sat: 1.12, contrast: 1.07, lift: [0.01, 0.004, 0.02], gain: [1.03, 1.0, 0.97] };
  const LOOK = {
    office: { env: "golden", bg: "#3a2e24", fog: ["#4a3a2c", 18, 60], exposure: 0.98, sun: { color: "#ffcf96", intensity: 2.2, dir: [0.55, 0.6, 0.55], shadow: 7 },
      hemi: { sky: "#ffe8cc", ground: "#4a3a2c", intensity: 0.62 }, rim: { color: "#9cc6ff", intensity: 1.3, dir: [-0.5, 0.45, -0.75] }, fill: { color: "#ffe2cc", intensity: 0.35 },
      bloom: 0.5, threshold: 2.2, dof: 0.45, vignette: 0.38, grade: GRADE },
    trade: { env: "studio", bg: "#0b1220", fog: ["#0e1626", 18, 60], exposure: 1.0, sun: { color: "#ffe2c0", intensity: 2.3, dir: [0.3, 0.85, 0.6], shadow: 7 },
      hemi: { sky: "#cfe0ff", ground: "#1c2230", intensity: 0.6 }, rim: { color: "#5fc8ff", intensity: 1.8, dir: [-0.5, 0.45, -0.75] }, fill: { color: "#ffd9b8", intensity: 0.35 },
      bloom: 0.5, threshold: 2.2, dof: 0.45, vignette: 0.4, grade: GRADE },
    bell: { env: "studio", bg: "#0d1322", fog: ["#121a2c", 18, 60], exposure: 1.0, sun: { color: "#ffe0b0", intensity: 2.4, dir: [0.25, 0.9, 0.5], shadow: 8 },
      hemi: { sky: "#ffeedd", ground: "#2a2230", intensity: 0.6 }, rim: { color: "#8fc0ff", intensity: 1.5, dir: [-0.45, 0.5, -0.75] }, fill: { color: "#ffd9c0", intensity: 0.4 },
      bloom: 0.55, threshold: 2.2, dof: 0.45, vignette: 0.4, grade: { sat: 1.14, contrast: 1.08, lift: [0.01, 0.004, 0.02], gain: [1.04, 1.0, 0.96] } },
    dusk: { env: "dusk", bg: "#3a3458", fog: ["#7a6a8a", 16, 70], exposure: 0.95, sun: { color: "#ffb47a", intensity: 2.3, dir: [-0.6, 0.35, 0.65], shadow: 14 },
      hemi: { sky: "#8a9ad8", ground: "#3a3030", intensity: 0.72 }, rim: { color: "#9cc0ff", intensity: 1.9, dir: [0.3, 0.45, -0.85] }, fill: { color: "#ffd9c0", intensity: 0.4 },
      bloom: 0.5, threshold: 2.2, dof: 0.38, vignette: 0.4, grade: { sat: 1.14, contrast: 1.08, lift: [0.01, 0.0, 0.03], gain: [1.04, 1.0, 0.96] } },
    ware: { env: "studio", bg: "#2a2420", fog: ["#3a3028", 20, 70], exposure: 0.98, sun: { color: "#ffd8a6", intensity: 2.2, dir: [0.4, 0.85, 0.5], shadow: 8 },
      hemi: { sky: "#ffe6cc", ground: "#3a3028", intensity: 0.6 }, rim: { color: "#9cc6ff", intensity: 1.4, dir: [-0.5, 0.45, -0.75] }, fill: { color: "#ffe2cc", intensity: 0.35 },
      bloom: 0.48, threshold: 2.2, dof: 0.42, vignette: 0.38, grade: GRADE },
    golden: { env: "golden", bg: "#8fb8ea", fog: ["#d6c8b8", 40, 220], exposure: 0.86, sun: { color: "#ffc98a", intensity: 2.7, dir: [-0.62, 0.42, 0.66], shadow: 12 },
      hemi: { sky: "#8fb4f0", ground: "#5a4a36", intensity: 0.62 }, rim: { color: "#bcd8ff", intensity: 1.6, dir: [0.55, 0.4, -0.75] }, fill: { color: "#ffe2cc", intensity: 0.28 },
      bloom: 0.45, threshold: 2.3, dof: 0.4, vignette: 0.36, grade: { sat: 1.14, contrast: 1.08, lift: [0.01, 0.0, 0.03], gain: [1.04, 1.0, 0.95] } },
    night: { env: "night", bg: "#0d1322", fog: ["#121a2c", 30, 140], exposure: 1.0, sun: { color: "#ffd6a0", intensity: 1.6, dir: [0.2, 0.9, 0.45], shadow: 12 },
      hemi: { sky: "#7f93d0", ground: "#1c1822", intensity: 0.5 }, rim: { color: "#8fc0ff", intensity: 2.8, dir: [-0.5, 0.5, -0.8] }, fill: { color: "#ffd9b8", intensity: 0.38 },
      bloom: 0.55, threshold: 2.2, dof: 0.4, vignette: 0.42, grade: { sat: 1.12, contrast: 1.08, lift: [0.0, 0.01, 0.04], gain: [1.02, 1.0, 1.02] } },
    fed: { env: "dusk", bg: "#4a5262", fog: ["#5a6272", 40, 200], exposure: 0.72, sun: { color: "#ffc88a", intensity: 2.9, dir: [-0.75, 0.32, 0.58], shadow: 12 },
      hemi: { sky: "#9aa8c8", ground: "#4a4038", intensity: 0.42 }, rim: { color: "#8fb8ff", intensity: 2.1, dir: [0.6, 0.4, -0.7] }, fill: { color: "#ffd9b8", intensity: 0.22 },
      bloom: 0.4, threshold: 2.5, dof: 0.4, vignette: 0.42, grade: { sat: 1.1, contrast: 1.16, lift: [0.0, 0.005, 0.02], gain: [1.03, 1.0, 0.98] } },
    lot: { env: "dusk", bg: "#2a3048", fog: ["#3a3a54", 26, 120], exposure: 0.92, sun: { color: "#ffb07a", intensity: 1.9, dir: [0.55, 0.35, 0.7], shadow: 12 },
      hemi: { sky: "#7a86b8", ground: "#2a2630", intensity: 0.5 }, rim: { color: "#7fb0ff", intensity: 2.2, dir: [-0.5, 0.45, -0.75] }, fill: { color: "#ffc890", intensity: 0.3 },
      bloom: 0.55, threshold: 2.2, dof: 0.4, vignette: 0.42, grade: { sat: 1.14, contrast: 1.1, lift: [0.0, 0.004, 0.03], gain: [1.05, 1.0, 0.95] } },
    sunset: { env: "golden", bg: "#d88a60", fog: ["#d8a07a", 80, 360], exposure: 0.88, sun: { color: "#ffb36a", intensity: 3.0, dir: [-0.55, 0.22, -0.8], shadow: 12 },
      hemi: { sky: "#7a94d8", ground: "#5a4030", intensity: 0.45 }, rim: { color: "#9cc0ff", intensity: 2.8, dir: [0.3, 0.45, -0.85] }, fill: { color: "#ffe0c0", intensity: 0.45 },
      bloom: 0.5, threshold: 2.3, dof: 0.35, vignette: 0.38, grade: { sat: 1.18, contrast: 1.1, lift: [0.01, 0.0, 0.02], gain: [1.06, 1.0, 0.92] } },
    loft: { env: "golden", bg: "#3a2a20", fog: ["#4a3426", 18, 60], exposure: 0.95, sun: { color: "#ffc68a", intensity: 2.0, dir: [0.45, 0.55, -0.6], shadow: 8 },
      hemi: { sky: "#ffd8b0", ground: "#3a281c", intensity: 0.5 }, rim: { color: "#9cc0ff", intensity: 1.4, dir: [-0.5, 0.45, -0.75] }, fill: { color: "#ffd2a8", intensity: 0.4 },
      bloom: 0.55, threshold: 2.2, dof: 0.5, vignette: 0.42, grade: { sat: 1.12, contrast: 1.08, lift: [0.012, 0.004, 0.01], gain: [1.05, 1.0, 0.94] } },
  };
  const L = (n, e) => Object.assign({}, LOOK[n], e || {});

  // ---------------------------------------------------------------- cast (generic people; nobody is a real person)
  const SK = () => K.SKIN;
  function cast() {
    const f = (sp) => { const g = K.mfig(sp); FIGS.push(g); g.hands.forEach((h) => h.scale.setScalar(0.82)); D.capLegs(g); g.sitLift = 0.155; return g; };
    C.bob = f({ kind: "polo", top: "#2f5fa8", legs: "#b89a6a", hair: "#5a3a20", hairStyle: "side", glasses: true, skin: SK().light, watch: true, brows: "#5a3a20" });
    C.inv1 = f({ kind: "suit", top: "#1f2a44", shirt: "#f4f4f4", tie: "#c8102e", legs: "#1f2a44", hair: "#1c1410", hairStyle: "slick", skin: SK().light, pocketSquare: "#f4f4f4", brows: "#1c1410" });
    C.inv2 = f({ kind: "blazer", top: "#7a1f3a", under: "#f4f4f4", legs: "#2a2a30", hair: "#c9a26b", hairStyle: "bob", lips: "#b0303a", lashes: true, skin: SK().medium, necklace: "#d8b44a" });
    C.trd = [
      f({ kind: "jacket", top: "#c8102e", under: "#f4f4f4", tie: "#1f2a44", legs: "#2a2a30", hair: "#3b2a1a", hairStyle: "short", skin: SK().tan, badge: true }),
      f({ kind: "jacket", top: "#2f8fd0", under: "#f4f4f4", legs: "#2a2a30", hair: "#1c1c1c", hairStyle: "ponytail", lips: "#a8434a", lashes: true, skin: SK().dark, badge: true }),
      f({ kind: "jacket", top: "#3fa34d", under: "#f4f4f4", tie: "#f2cd37", legs: "#3a3f47", hair: "#8a3a1a", hairStyle: "curly", skin: SK().light, badge: true }),
    ];
    C.exec = f({ kind: "suit", top: "#4a4f57", shirt: "#f4f4f4", tie: "#f2cd37", legs: "#33363b", hair: "#1c1c1c", hairStyle: "buzz", skin: SK().dark });
    C.exec2 = f({ kind: "blazer", top: "#0f6f78", under: "#f4f4f4", legs: "#1f2a44", hair: "#2a1a10", hairStyle: "bun", lips: "#a8434a", lashes: true, skin: SK().tan });
    C.worker = f({ kind: "vest", top: "#f28c28", under: "#4a4f57", label: "PETS", labelColor: "#1b1b1b", legs: "#2e4a7a", hair: "#c9a26b", hairStyle: "short", beard: "#a8743a", skin: SK().light, hat: "hardhat", hatColor: "#f2cd37" });
    C.driver = f({ kind: "polo", top: "#e36a1b", legs: "#3a3f47", hair: "#1c1c1c", hairStyle: "short", skin: SK().dark, hat: "cap", hatColor: "#e36a1b" });
    C.fed = f({ kind: "blazer", top: "#5a5f66", under: "#f4f4f4", legs: "#33363b", hair: "#cfcfcf", hairStyle: "bun", lips: "#9a4a4a", skin: SK().light, age: true });
    const skins = [SK().light, SK().medium, SK().tan, SK().dark];
    const fanCols = ["#c8102e", "#f4f2ec", "#2f5fa8", "#f2cd37", "#3fa34d", "#7a1f3a"];
    C.fans = K.randomSpecs(16, 7, ["sweater", "hoodie", "jacket", "tee", "polo"]).map((sp, i) => f(Object.assign(sp, { top: fanCols[i % 6], skin: skins[i % 4], hairStyle: sp.hairStyle === "bald" ? "short" : sp.hairStyle, hat: i % 5 === 2 ? "cap" : undefined, hatColor: fanCols[(i + 2) % 6] })));
    // matte skin/plastic so faces and hands never glow
    Object.values(SK()).forEach((col) => { const m = K.plastic(col); m.clearcoat = 0.0; m.roughness = 0.62; m.specularIntensity = 0.3; });
    const HM = {};
    FIGS.forEach((fg) => { fg.headMat.clearcoat = 0.0; fg.headMat.roughness = 0.6; fg.headMat.specularIntensity = 0.22; fg.headMat.envMapIntensity = 0.5;
      fg.hands.forEach((h) => h.traverse((o) => { if (!o.isMesh || Array.isArray(o.material)) return; const key = o.material.uuid;
        if (!HM[key]) { const m = o.material.clone(); m.color.multiplyScalar(0.86); m.roughness = 0.68; m.clearcoat = 0; m.specularIntensity = 0.12; m.envMapIntensity = 0.3; HM[key] = m; } o.material = HM[key]; }));
      fg.root.traverse((o) => { if (!o.isMesh || o.material === fg.headMat) return; (Array.isArray(o.material) ? o.material : [o.material]).forEach((mm) => { if (!mm.isMeshPhysicalMaterial) return; mm.clearcoat = Math.min(mm.clearcoat || 0, 0.12); mm.roughness = Math.max(mm.roughness || 0, 0.5); mm.specularIntensity = Math.min(mm.specularIntensity == null ? 1 : mm.specularIntensity, 0.45); }); }); });
    // hand props
    const bucket = () => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.22, 18, 1, true), K.plastic("#9aa0a6", { metalness: 0.6, roughness: 0.35, side: THREE.DoubleSide })); b.position.set(0, -0.06, 0.12); g.add(b);
      const gold = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 16), PK.GOLD()); gold.position.set(0, 0.03, 0.12); g.add(gold); const h = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.008, 6, 16, Math.PI), K.plastic("#5a5f66")); h.position.set(0, 0.04, 0.12); g.add(h); g.rotation.x = 0.5; return g; };
    O.bk1 = K.attach(C.inv1, "R", bucket(), 0, 0, 0.02); O.bk2 = K.attach(C.inv2, "L", bucket(), 0, 0, 0.02);
    const placard = (txt, col) => { const g = new THREE.Group(); const st = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.5, 6), K.plastic("#8a5a2b")); st.position.y = 0.18; g.add(st);
      const pl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.03), [K.plastic(col), K.plastic(col), K.plastic(col), K.plastic(col), new THREE.MeshBasicMaterial({ map: K.canvasTex(256, 144, (c, Wd, H) => { c.fillStyle = col; c.fillRect(0, 0, Wd, H); c.fillStyle = "#111"; c.font = "900 46px Arial Black, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(txt, Wd / 2, H / 2 + 2); }), toneMapped: false, color: new THREE.Color(0.85, 0.85, 0.85) }), K.plastic(col)]);
      pl.position.y = 0.5; g.add(pl); return g; };
    O.plac = C.trd.map((fg, i) => K.attach(fg, "R", placard("PROFITS?", ["#f2cd37", "#f4f2ec", "#c8ff3e"][i]), 0, 0, 0.02));
    O.phoneT = C.trd.map((fg) => K.attach(fg, "L", PK.acc.phone(), 0, 0, 0.02));
    O.inv1Phone = K.attach(C.inv1, "L", PK.acc.phone(), 0, 0, 0.02);
    O.foam = C.fans.map((fg, i) => i % 3 === 0 ? K.attach(fg, "R", (() => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.36, 0.05), K.plastic(["#f2cd37", "#c8102e", "#2f5fa8"][i % 3])); m.position.y = 0.2; g.add(m); return g; })(), 0, 0, 0.02) : null);
    O.truckHand = null;
    { const sk = new THREE.Group(); D.petBag(sk, 0, -0.32, 0.2, 0, 0.62); O.driverSack = K.attach(C.driver, "R", sk, 0, 0, 0.02); }
  }
  const hideFigs = () => { FIGS.forEach((f) => { f.root.visible = false; f.root.rotation.set(0, 0, 0); f.head.rotation.set(0, 0, 0); }); if (O.driverSack) O.driverSack.visible = false; };
  // "cheer" is rebuilt with straight raised arms (the kit's bent-elbow cheer read as four arms on suits)
  let TT = 0;
  const fixCheer = (o, seed) => { if (!o || o.gesture !== "cheer") return o; const w = Math.sin(TT * 7 + (seed || 0)) * 0.12;
    return Object.assign({}, o, { gesture: null, aR: o.aR != null ? o.aR : -2.7 + w, aL: o.aL != null ? o.aL : -2.7 - w, eR: o.eR != null ? o.eR : -0.25, eL: o.eL != null ? o.eL : -0.25, aRy: 0, aLy: 0 }); };
  const P = (f, o) => K.P(f, fixCheer(o, f.root.id));

  // ---------------------------------------------------------------- build
  function build(ctx) {
    THREE = ctx.THREE;
    K = BRICK.setup(ctx); X = FXKIT.setup(ctx); LDRAW_KIT.setup(ctx, K, X);
    FL = K.FL;
    X.skyEnv("golden", "golden"); X.skyEnv("night", "night"); X.skyEnv("overcast", "overcast");
    X.skyEnv("dusk", { zenith: "#22305e", mid: "#7a6a9e", horizon: "#ffb27a", ground: "#3a3040", sunDir: [-0.6, 0.12, -0.8], sunColor: "#ffb070", sunSize: 0.9, haze: 0.8, clouds: 0.3, cloudColor: "#ffd2b0", cloudShade: "#5a4a6a" });
    PK = PROPS.setup(ctx, K, X); D = DCKIT.setup(ctx, K, X, PK);
    const S = DCSETS.build(ctx, K, X, PK, D); W = S.W; O = S.O;
    cast();
    ctx.scene.traverse((o) => { if (o.isInstancedMesh) o.frustumCulled = false; });
    sceneTweaks();
    if (typeof document !== "undefined") { const st = document.createElement("style"); st.textContent = [
        "#hud-end { left: 40px !important; right: 40px !important; top: 300px !important; }", "#hud-hook { left: 60px !important; right: 60px !important; top: 250px !important; }", "#hud-hook .hud-line > span { font-size: 92px !important; white-space: nowrap; }",
        "#hud-end .hud-line > span { font-size: 58px !important; white-space: nowrap; }", "#hud-end-b { font-size: 58px !important; }",
        "#hud-end::before { content: ''; position: absolute; left: 14px; right: 14px; top: -16px; bottom: -22px; background: #1d2b44; border-radius: 14px; border: 5px solid #0b111c; box-shadow: inset 0 -10px 0 rgba(0,0,0,0.28), 0 8px 0 rgba(0,0,0,0.45); z-index: -1; }",
        "#hud-end::after { content: ''; position: absolute; left: 60px; right: 60px; top: -40px; height: 26px; background: radial-gradient(circle at 50% 60%, #2c4166 0 15px, #22344f 16px 18px, transparent 19px) 0 0 / 68px 26px repeat-x; z-index: -1; }",
        ".hud-tag { background: #1d2b44 !important; color: #fff !important; font-family: 'Archivo Black', sans-serif !important; font-size: 40px !important; border-radius: 12px !important; border: 4px solid #0b111c !important; border-left: 18px solid #f2cd37 !important; box-shadow: 0 6px 0 rgba(0,0,0,0.45) !important; padding: 10px 22px 8px 18px !important; }",
        "#hud-tag-0-in { top: 540px !important; }", "#hud-tag-3-in { top: 300px !important; right: auto !important; left: 80px !important; }",
        ".hud-slam { top: 150px !important; }", "#hud-slam-1-in { top: 560px !important; right: 54% !important; }", "#hud-slam-2-in { top: 96px !important; }", ".hud-slam-letter { font-size: 320px !important; }", ".hud-slam-word { font-size: 62px !important; margin-top: -4px !important; }"].join("\n"); document.head.appendChild(st); }
  }
  function show(name) { for (const k in W) W[k].visible = k === name; }

  // ---------------------------------------------------------------- cue times (spoken words -> seconds)
  const T = {};
  function times() {
    if (T.ok) return T;
    const a = (p, n) => { const v = F.at(p, n); return v == null ? 0 : v; };
    Object.assign(T, { ok: true,
      dotcom: a("dot-com"), jump: a("stock jump"), letters: a("three letters"), floor: a("then the floor"), fell: a("fell out"), warnSign: a("the warning sign"), warn: a("a sock puppet"),
      inv: a("investors threw"), internet: a("internet companies"), profitsQ: a("profits not the"), nobody: a("not the question"), yetW: a("yet"),
      nov98: a("proof november 1998"), globe: a("the globe dot-com rose"), six: a("606 percent"), firstDay: a("on day one"), novWord: a("november 1998"),
      y99: a("and in 1999 alone"), climbed: a("nasdaq climbed"), eighty: a("about 85"),
      one: a("now about that"), meet: a("meet pets"), sold: a("it sold pet"), less: a("less than it paid"),
      ship: a("then shipped"), heavy: a("heavy bags"), free: a("for free"), lost: a("lose money on"), repeat: a("repeat"),
      puppet: a("but it had"), sock: a("famous sock puppet"), bowl: a("super bowl"),
      feb: a("february 2000 it"), pub: a("went public at"), eleven: a("11 a share"),
      march: a("weeks later"), peaked: a("peaked above"), music: a("then the music"), stopped: a("music stopped"),
      june: a("in under a") - 0.12, why: a("why in under"), fedN: a("the fed raised"), raised: a("raised interest"), sixT: a("six times"), cheap: a("cheap money"), dried: a("dried up"),
      asking: a("and then came"), where: a("where are the"),
      petsShut: a("pets dot-com shut"), shut: a("shut down that"), nine: a("nine months"),
      webvan: a("webvan the grocery"), bankrupt: a("bankrupt in july"),
      amazon: a("even amazon's"), ninety: a("more than 90"),
      oct: a("in october 2002"), bottomed: a("hit bottom"), down78: a("down about 78"),
      climb: a("how long to"), close: a("above the old"), april: a("april 2015"), fifteen: a("fifteen years"),
      hype: a("but the internet"), hypeDid: a("the hype did"), giants: a("and amazon the one"), giant: a("became a giant"),
      end: a("so when everyone"), different: a("this time is different"), remember: a("remember the sock"), follow: a("follow and you'll"), bubble: a("next bubble"), pops: a("bubble"),
      vEnd: (F.cues && F.cues.voiceEnd) || F.total - 2.4, total: F.total });
    return T;
  }
  const drop = (t, t0, y, h) => { const k = clamp01((t - t0) / 0.3); return y + (h || 1.5) * (1 - k * k); };
  const walkTo = (t, t0, t1, p0, p1) => { const k = ss(t0, t1, t); return [mix(p0[0], p1[0], k), mix(p0[1], p1[1], k), k]; };

  // ---------------------------------------------------------------- one-time tweaks after build
  function sceneTweaks() {
    O.bellScr.position.y = FL + 3.3; O.jumbo.position.y = 4.4; O.jumbo.scale.setScalar(0.8); O.tag.scale.setScalar(1.8);
    // CRT stock chart painter: k = progress 0..1 of the climb, crash = 0..1
    O.drawStock = (k, crash, com) => (c, Wd, H) => { c.fillStyle = crash > 0 ? "#2a0a0a" : "#06221a"; c.fillRect(0, 0, Wd, H);
      c.fillStyle = crash > 0 ? "#ff5a4a" : "#40ff80"; c.font = "700 17px monospace"; c.fillText(com ? "BOBS.COM" : "BOBS", 8, 20);
      c.strokeStyle = "rgba(64,255,128,0.18)"; c.lineWidth = 1; for (let x = 0; x < Wd; x += 20) { c.beginPath(); c.moveTo(x, 26); c.lineTo(x, H); c.stroke(); }
      c.strokeStyle = crash > 0 ? "#ff5a4a" : "#40ff80"; c.lineWidth = 4; c.beginPath(); const n = 24;
      for (let i = 0; i <= n; i++) { const u = i / n, x = 8 + u * (Wd - 16); let y = H - 18 - 10 * u - 6 * Math.sin(i * 1.9);
        if (u > 0.62) y -= (u - 0.62) / 0.38 * (H - 60) * k; if (crash > 0 && u > 0.8) y += (u - 0.8) / 0.2 * (H - 30) * crash; y = Math.max(28, Math.min(H - 6, y)); i ? c.lineTo(x, y) : c.moveTo(x, y); }
      c.stroke(); c.font = "900 22px monospace"; c.fillText(crash > 0 ? "▼" : k > 0.5 ? "▲ +" : "", Wd - 54, 46); };
    O.stockKey = "";
    O.jarFillK = 0;
    O.stream = D.confetti(W.TRADE, 36, ["#f2cd37", "#e2b827"]);
    // the payoff bubble: a trans-pink brick dome bubble (round-plate base) that swells beside the puppet, then pops into trans-pink plates + a flash
    O.bubble = D.brickBubble(W.BUST);
    O.bubFlash = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(3.0, 2.2, 2.6), toneMapped: false, transparent: true, opacity: 0.8, depthWrite: false })); W.BUST.add(O.bubFlash);
    O.bubPop = D.confetti(W.BUST, 24, ["#ff8fc8", "#f4f8ff", "#ffb0d8"]);
    O.mtNoteK = 0;
    // sock-puppet ad frames on the jumbotron (mouth open / closed)
    O.adK = -1;
    // guard (LOT) + mover (BUST) extras get scripted motion below
    O.extras.forEach((e) => { if (e.f === O.mover) e.scripted = "mover"; if (e.f === O.guard) e.scripted = "guard"; });
    // hero tower floors: remember each floor's lit-window meshes so the floors can black out top to bottom
    O.heroF.forEach((fg) => { fg.userData.lit = []; fg.traverse((o) => { if (o.isInstancedMesh && D.WIN.lit.includes(o.material)) fg.userData.lit.push([o, o.material]); }); });
    O.darkWin = D.WIN.dark[0];
    O.craneRY = [O.crane1.rotation.y, O.crane2.rotation.y];
    O.bustDust.a.visible = O.bustDust.b.visible = false;
    { D.setPuppet(O.bustPuppet, 0.38, -0.12, 0.45); W.BUST.updateMatrixWorld(true); const jw = O.bustPuppet.userData.jaw; const mp = new THREE.Vector3(0, 0.0, 0.7).applyMatrix4(jw.matrixWorld); W.BUST.worldToLocal(mp); O.mouthP = mp; }
    { const pm = K.plastic("#3a3d42"), h = O.MY + O.barN[4] * BHs + 0.05; for (const x of [O.barX[4] - 0.55, O.barX[19] + 0.55]) { const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, h, 10), pm); p2.position.set(x, -h / 2, 0); p2.castShadow = true; O.peakLine.add(p2); }
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.06), [pm, pm, pm, pm, new THREE.MeshBasicMaterial({ map: K.canvasTex(256, 86, (c2, Wd, H) => { c2.fillStyle = "#f2cd37"; c2.fillRect(0, 0, Wd, H); c2.fillStyle = "#111"; c2.font = "900 40px Arial Black, Arial"; c2.textAlign = "center"; c2.textBaseline = "middle"; c2.fillText("2000 PEAK", Wd / 2, H / 2 + 2); }), toneMapped: false, color: new THREE.Color(0.9, 0.9, 0.9) }), pm]);
      tl.position.set(O.barX[17], 0.28, 0.05); O.peakLine.add(tl);
      O.peakLine.traverse((o) => { if (!o.isInstancedMesh) return; const mm = new THREE.Matrix4(), v = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3(); for (let i = 0; i < o.count; i++) { o.getMatrixAt(i, mm); mm.decompose(v, q, sc); sc.setScalar(i % 3 ? 1e-4 : 0.8); o.setMatrixAt(i, mm.compose(v, q, sc)); } o.instanceMatrix.needsUpdate = true; }); }
    round6();
  }
  // ---------------------------------------------------------------- round-6 additions (council r5 fixes)
  function round6() {
    // hook: the three letter bricks (C, O, M) that drop in on "three letters"
    O.letters = ["C", "O", "M"].map((ch) => { const s = D.brickSign(W.OFFICE, [ch], "#7a1f2a", "#c8ff3e", 0.24, 0.42, 0, 0, 0, 0, { border: "#c9a24a" }); s.visible = false; return s; });
    // coins: flat pearl gold everywhere (jar, pour stream, buckets, fountain) so each disc keeps its edge under bloom
    const gf = D.goldFlat(); O.jar.userData.coins.material = gf; O.stream.ims.forEach((im) => (im.material = gf));
    O.fountain.traverse((o) => { if (o.isMesh && o.material && o.material.metalness > 0.6) o.material = gf; });
    // jar label: a curved decal hugging the drum (no flat card floating in front of the glass)
    O.jar.traverse((o) => { if (o.isMesh && o.geometry && o.geometry.type === "PlaneGeometry" && Math.abs(o.position.z - 0.518) < 0.01) { o.geometry = new THREE.CylinderGeometry(0.508, 0.508, 0.24, 24, 1, true, -0.61, 1.22); o.position.set(0, 1.02, 0); o.material.side = THREE.FrontSide; } });
    // trading floor: a foreground trader desk corner (CRT back, phone, coffee, ticker tape) so wide shots never show bare floor
    { const g = O.trFg = PK.grp(W.TRADE, 0, 0, 0); g.userData.noBake = true; for (let i = 0; i < 6; i++) PK.brick(g, "3069b", i % 2 ? "#f4f2ec" : "#f2cd37", -0.6 + i * 0.28, FL, 1.55 + (i % 3) * 0.18, i * 0.9, [1, 0.35, 1]); PK.barrel(g, -1.9, FL, 1.4, 0, { col: "#3a3d42" }); }
    // exchange: photographer extra fully in frame
    O.extras.forEach((e) => { if (e.set === "BELL") { e.pose = Object.assign({}, e.pose, { x: -3.6, z: 0.85 }); } if (e.set === "WARE") e.pose = Object.assign({}, e.pose, { x: -3.1, z: -2.3 }); });
    // stadium: softer spots so the grey sock stays grey (no white blow-out on the eyes)
    W.STADIUM.traverse((o) => { if (o.isSpotLight) o.intensity *= 0.45; });
    // street: foreground dressing (hand truck of sacks, sack pile, parked sedan on the road)
    { const g = W.STREET; D.handTruck(g, 2.2, FL, 1.5, -0.5, 3); D.bagPile(g, -1.4, FL, 1.9, 6, 5); D.sedan(g, -5.6, 0, -2.85, 0, "#7a1f3a"); D.sedan(g, 5.4, 0, -2.9, Math.PI, "#2f5f8a");
      PK.trafficCone(g, 0.9, FL, 2.3, 0.2); D.priceTag(g, 2.35, FL + 1.2, 1.75, -0.4, "LOSS"); }
    // skyline: a lower layer of brick clouds so the dusk sky is never an empty gradient
    O.skyClouds2 = X.brickClouds(W.SKY, { n: 7, area: 34, y: 7.5, size: 0.75, center: [0, 0, -24], seed: 23, color: "#ffe2c8" });
    // grocery lot: (round 6) the original crates are now minifig-scale produce; nothing extra near the lens
    O.deskBoxes.position.x += 0.4;
    O.profitB.position.set(-0.12, FL, 0.8); O.profitB.rotation.y = 0.2;
    W.STADIUM.updateMatrixWorld(true);
    for (const k in W) W[k].traverse((o) => { if (o.isInstancedMesh) o.frustumCulled = false; });
  }
  function redrawCrt(mat, draw) { const c = mat.map.image.getContext("2d"); draw(c, mat.map.image.width, mat.map.image.height); mat.map.needsUpdate = true; }

  // ---------------------------------------------------------------- update
  function update(t, ctx) { TT = t; const c = times(); hideFigs(); O.bk1.visible = O.bk2.visible = O.inv1Phone.visible = false; O.plac.forEach((m) => (m.visible = false)); O.phoneT.forEach((m) => (m.visible = false)); D.WIN.lit.forEach((m) => m.color.copy(m.userData.base || (m.userData.base = m.color.clone()))); const cam = route(t, c); tickExtras(t, c); PK.tick(t); return cam; }
  function route(t, c) {
    if (t < c.floor) return shotOffice(t, c, "hook");
    if (t < c.warn - 0.12) return shotOffice(t, c, "stakes");
    if (t < c.inv - 0.02) return shotStadium(t, c, "tease");
    if (t < c.nov98) return shotTrade(t, c, t < c.profitsQ ? "pour" : "profits");
    if (t < c.y99) return shotBell(t, c, "a");
    if (t < c.one) return shotMount(t, c, "rise");
    if (t < c.ship) return shotWare(t, c);
    if (t < c.puppet) return shotStreet(t, c);
    if (t < c.feb) return shotStadium(t, c, "ad");
    if (t < c.march) return shotBell(t, c, "b");
    if (t < c.june) return shotMount(t, c, "peak");
    if (t < c.asking) return shotFed(t, c, t < c.cheap ? "rates" : "dry");
    if (t < c.petsShut) return shotTrade(t, c, "ask");
    if (t < c.webvan) return shotBust(t, c, "shut");
    if (t < c.amazon) return shotLot(t, c);
    if (t < c.oct) return shotSky(t, c, "fall");
    if (t < c.hype) return shotMount(t, c, t < c.climb ? "crash" : "climb");
    if (t < c.end) return shotSky(t, c, "rise");
    if (t < c.remember - 0.1) return shotTrade(t, c, "again");
    return shotBust(t, c, "end");
  }
  // extras: base pose + a small idle performance (head turns, nods, arm shifts) so nobody is frozen
  function tickExtras(t, c) {
    O.extras.forEach((e, i) => { if (!W[e.set].visible) return;
      let o = Object.assign({}, e.pose, { hy: (e.pose.hy || 0) + 0.25 * Math.sin(t * 0.8 + i * 1.7), nod: (e.pose.nod || 0) + 0.05 * Math.sin(t * 1.9 + i) }, e.anim ? e.anim(t) : {});
      if (e.scripted === "guard") { const w = walkTo(t, c.webvan - 0.4, c.bankrupt - 0.05, [3.4, -1.35], [1.0, -1.35]), done = w[2] >= 0.99, slap = done && t > c.bankrupt + 0.2;
        o = { x: w[0], z: w[1], ry: done ? -0.5 : -Math.PI / 2 + 0.3, walk: w[2] > 0.01 && !done ? K.walkPh(t, 8) : null, face: t > c.bankrupt ? "determined" : "neutral", aL: done ? (slap ? -2.3 - 0.15 * Math.sin(t * 3) : -0.4) : -1.2, eL: -0.4, aLz: slap ? -0.3 : 0, hy: done ? 0.2 * Math.sin(t * 1.4) : 0, nod: slap ? -0.15 : 0.05 }; }
      if (e.scripted === "mover") { const w = walkTo(t, c.petsShut + 0.1, c.nine - 0.2, [2.1, -2.3], [-0.9, -2.75]); o = Object.assign({}, e.pose, { x: w[0], z: w[1], ry: -Math.PI / 2 - 0.05, walk: w[2] < 1 ? K.walkPh(t, 9) : null, s: t > c.nine + 0.05 ? 1e-4 : 1, face: "neutral" }); }
      K.P(e.f, fixCheer(o, i)); });
  }

  // ================================================================ OFFICE (hook + stakes)
  function shotOffice(t, c, mode) {
    show("OFFICE");
    const top = FL + 0.81, sy = FL + 1.98, tc = c.jump + 0.2;
    // .COM slams onto the right end of the BOB'S SHOES sign on "dot com" (slides in, overshoots, dust ring)
    O.signCom.visible = t > tc; O.signCom.position.set(0.84, sy, -3.1); O.signCom.scale.setScalar(t > tc ? 1 + 0.28 * Math.exp(-(t - tc) * 9) * Math.cos((t - tc) * 18) : 1);
    // the three letters: C, O, M bricks drop one per woodblock note on "three letters", hop on "stock jump", then the .COM panel takes their place
    O.letters.forEach((lb, i) => { const t0 = c.letters + i * 0.2, k = clamp01((t - t0) / 0.28), land = t0 + 0.28;
      lb.visible = t > t0 && t < tc + 0.05; const bounce = t > land ? 0.08 * Math.abs(Math.sin((t - land) * 12)) * Math.exp(-(t - land) * 6) : 0, hopJ = 0.12 * Math.max(0, Math.sin(clamp01((t - c.jump - i * 0.06) / 0.3) * Math.PI));
      lb.position.set(0.6 + i * 0.25, sy - 0.18 + 1.6 * (1 - k * k) + bounce + hopJ, -2.98); lb.rotation.set(0, 0, (1 - k) * (i - 1) * 0.6); });
    O.offPuff.begin(); D.dustRing(O.offPuff, t, tc + 0.18, [0.84, sy - 0.3, -3.0], 0.9, 0.3, 14); O.offPuff.end();
    { const fr = O.signCom.userData.front; if (!fr.emissiveMap) { fr.emissive = new THREE.Color("#ffffff"); fr.emissiveMap = fr.map; fr.needsUpdate = true; } fr.emissiveIntensity = 1.4 * Math.exp(-Math.max(0, t - tc - 0.18) * 7) * (t > tc + 0.15 ? 1 : 0); }
    // stock CRT: jitters on "three letters", climbs on "stock jump", spikes when .COM lands, crashes red on "fell out"
    const k = Math.max(0.12 * ss(c.letters, c.jump, t) + 0.25 * ss(c.jump - 0.1, c.jump + 0.4, t), ss(tc + 0.1, tc + 0.6, t)), cr = ss(c.fell - 0.15, c.fell + 0.5, t), com = t > tc + 0.1, key = (Math.round(k * 12) + "|" + Math.round(cr * 8) + "|" + com);
    if (key !== O.stockKey) { O.stockKey = key; redrawCrt(O.stockCrt.userData.screen, O.drawStock(k, cr, com)); }
    // fax paper slides out; desk shoe boxes topple when the floor falls out
    O.fax.userData.paper.position.z = -0.15 + 0.12 * ((t * 0.35) % 1);
    O.stackR.visible = t < c.fell; D.tickBurst(O.offFall, t, c.fell, [1.55, FL + 0.9, -0.75], { speed: 1.4, up: 1.4, floor: FL, life: 4 });
    O.floorHole.visible = t > c.fell + 0.05; O.holeLight.intensity = t > c.fell + 0.05 ? 1.6 : 0;
    O.floorTiles.forEach((tl, i) => { const dt = Math.max(0, t - c.fell - 0.04 * i); tl.position.y = FL - 0.06 - 4.5 * dt * dt; tl.rotation.set((i % 2 ? 1 : -1) * 2.2 * dt, 0, (i % 3 - 1) * 1.4 * dt); tl.visible = tl.position.y > FL - 0.5; });
    D.tickBurst(O.floorBurst, t, c.fell + 0.05, [0, FL + 0.05, 0.2], { speed: 0.8, up: 1.6, floor: FL, life: 30, spread: 1 });
    const crash = t > c.fell, cheer = t > tc + 0.15 && !crash, typing = t < c.jump - 0.1;
    // hook: Bob types (arms tap) and leans to the screen, the investor leans in; both whip round to the sign when .COM lands
    P(C.bob, { x: -0.62, z: -1.75, ry: 0.35, face: crash ? "shock" : cheer ? "grin" : t > c.jump - 0.1 ? "smile" : "neutral",
      gesture: cheer ? "cheer" : crash ? "cover" : typing ? null : "present", aR: typing ? -0.95 + 0.18 * Math.abs(Math.sin(t * 11)) : undefined, aL: typing ? -0.95 + 0.18 * Math.abs(Math.sin(t * 11 + 1.6)) : undefined, eR: typing ? -1.0 : undefined, eL: typing ? -1.0 : undefined,
      look: cheer && t < tc + 1.2 ? [0.8, -3.1] : null, hy: typing ? -0.1 + 0.1 * Math.sin(t * 2.4) : (crash ? 0.15 : 0.35), nod: typing ? 0.12 : crash ? 0.05 : -0.06 });
    const wi = walkTo(t, 0.0, 1.2, [2.3, -1.25], [0.8, -1.78]), walking = wi[2] < 0.99;
    P(C.inv1, { x: wi[0], z: wi[1], ry: walking ? -Math.PI / 2 + 0.3 : -0.45, walk: walking ? K.walkPh(t, 9) : null, face: crash ? "worried" : cheer ? "laugh" : t > c.jump - 0.2 ? "grin" : "smile",
      gesture: cheer ? "point" : crash ? "shrug" : t > c.letters ? "think" : "hold", aRy: 0.5, hy: crash ? -0.35 : cheer ? 0.2 : -0.35 + 0.12 * Math.sin(t * 1.8), nod: t < c.letters ? 0.12 : 0.04 });
    if (mode === "hook") { const kk = clamp01(t / c.floor), k0 = F.E.o3(clamp01(t / 1.5)); return { target: [0.05, mix(2.35, 2.05, k0), -1.7], dist: mix(10.4, 8.6, k0) - 0.5 * kk, az: mix(-6, 3, kk), el: mix(9, 5, k0), fov: 32, look: L("office", { dof: 0.22, focus: 8.4 }) }; }
    const kk = clamp01((t - c.floor) / (c.inv - c.floor));
    return { target: [-0.12, 1.75, -1.4], dist: mix(8.5, 8.1, kk), az: mix(-3, -6, kk), el: 7, fov: 32, look: L("office", { dof: 0.4, focus: 7.4 }) };
  }

  // ================================================================ TRADE (pouring money / profits? / where are the profits)
  function shotTrade(t, c, mode) {
    show("TRADE");
    const ask = mode === "ask";
    O.tradeTicker.visible = !ask; O.tradeTickerRed.visible = ask; if (O.trFg) O.trFg.visible = mode !== "again"; D.tickTicker(ask ? O.tradeTickerRed : O.tradeTicker, t, 0.035);
    // jar fills while they pour, drains while everyone asks
    const again = mode === "again", fill = ask ? mix(0.85, 0.25, ss(c.asking, c.petsShut, t)) : again ? mix(0.08, 0.6, ss(c.end, c.remember, t)) : mix(0.12, 0.85, ss(c.inv, c.nov98, t)); D.jarFill(O.jar, fill);
    const hop = (t0) => 0.25 * Math.max(0, Math.sin(clamp01((t - t0) / 0.35) * Math.PI));
    O.profitB.visible = !again && (ask || t > c.profitsQ - 0.1); if (ask) O.profitB.position.set(-1.0, FL, 0.6); else O.profitB.position.set(-0.12, FL, 0.8); O.profitB.position.y = ask ? FL + hop(c.where) : drop(t, c.profitsQ - 0.1, FL, 1.6) + hop(c.nobody + 0.3) * 0.6 + hop(c.yetW) * 1.3; O.profitB.rotation.z = ask ? 0 : 0.25 * Math.sin(clamp01((t - c.yetW) / 0.35) * Math.PI);
    // TECH INDEX: rising lime line while money pours in; on the return visit the line rolls over and falls off a cliff in red
    { const cr = ask ? 0.05 + 0.95 * ss(c.asking - 0.1, c.where + 0.4, t) : 0, key = String(Math.round(cr * 16)); if (key !== O.idxKey) { O.idxKey = key; D.redraw(O.tradeScr, O.idxDraw(cr)); } }
    // traders: phones while buying, placards when asking
    const tx = [-1.5, 0.0, 1.5];
    C.trd.forEach((f, i) => { const raise = ask && t > c.where - 0.1, head = ask && !raise && i !== 1; O.plac[i].visible = ask && (raise || i === 1); O.phoneT[i].visible = !ask;
      P(f, { x: tx[i] + (i === 1 ? 0 : 0.0), z: -2.85, ry: (i - 1) * -0.25, face: ask ? (raise ? "angry" : "worried") : ["grin", "smile", "laugh"][i],
        gesture: ask ? (head ? "facepalm" : null) : "phone", aR: ask && !head ? (raise ? -2.6 : -1.7) + 0.1 * Math.sin(t * 3 + i) : undefined, eR: ask && !head ? -0.3 : undefined, nod: ask ? 0.05 * Math.sin(t * 2 + i) : 0.06 * Math.sin(t * 2.2 + i * 1.3), hy: ask ? 0.25 * Math.sin(t * 1.4 + i) : 0.3 * Math.sin(t * 0.9 + i * 2) }); });
    // investors pour gold studs from buckets into the jar (pour), then stand by it (profits/ask)
    const pour = mode === "pour" || mode === "profits" || again;
    O.bk1.visible = pour; O.bk2.visible = pour; O.jar.userData.lid.visible = !(mode === "pour" || again);
    const prof = mode === "profits", tap = prof ? Math.abs(Math.sin((t - c.profitsQ) * 5.5)) : 0;
    P(C.inv1, { x: -0.95, z: -0.5, ry: pour ? 1.05 : 0.55, face: ask ? "worried" : "grin", aR: pour && !prof ? -1.55 + 0.12 * Math.sin(t * 2.6) : prof ? -0.7 : -0.3, aL: prof ? -0.45 - 0.3 * tap : undefined, eL: prof ? -0.9 : undefined, eR: pour ? -0.35 : -0.3, aRy: pour ? -0.3 : 0, hy: pour ? -0.6 + (prof ? 0.25 * Math.sin(t * 1.7) : 0) : 0.2, nod: prof ? 0.08 * tap : 0, gesture: ask ? "shrug" : null });
    P(C.inv2, { x: 0.98, z: -0.55, ry: pour ? -1.05 : -0.55, face: ask ? "frown" : prof && t > c.yetW ? "smirk" : "smile", aL: pour ? (again ? -1.2 : -1.5) + 0.12 * Math.sin(t * 2.4 + 1) : -0.3, eL: pour ? -0.35 : -0.3, aLy: pour ? -0.3 : 0, hy: pour ? 0.6 + (prof ? 0.3 * Math.sin(t * 2.1) : 0) : -0.2, gesture: ask ? "think" : null });
    // the stream of gold coins (pure function of t): 8 spaced coins per bucket from the lip into the jar mouth
    const st = O.stream; st.ims.forEach((im, ci) => { const hand = ci ? C.inv2.hands[0] : C.inv1.hands[1]; hand.updateMatrixWorld(true); const hp = new THREE.Vector3(0, -0.02, 0.2).applyMatrix4(hand.matrixWorld); W.TRADE.worldToLocal(hp);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3();
      for (let j = 0; j < st.per; j++) { const ph = (t * 1.3 + (j % 6) / 6) % 1, on = j < 6 && (mode === "pour" || again) && t > (again ? c.end + 0.15 : c.inv + 0.2); const tx2 = mix(hp.x, (ci ? 0.12 : -0.12), ph), tz = mix(hp.z, -0.35, ph), ty = mix(hp.y, FL + 0.95, ph) + 0.55 * Math.sin(ph * Math.PI);
        e.set(t * 5 + j, j, t * 3); q.setFromEuler(e); p3.set(tx2, ty, tz); s3.setScalar(on ? 1.0 : 1e-4); im.setMatrixAt(j, m4.compose(p3, q, s3)); } im.instanceMatrix.needsUpdate = true; });
    if (mode === "pour") { const k = clamp01((t - c.inv) / (c.profitsQ - c.inv)); return { target: [0, 1.5, -1.0], dist: mix(8.6, 8.0, k), az: mix(2, -4, k), el: 7, fov: 32, look: L("trade", { dof: 0.4, focus: 7.8, bloom: 0.36, threshold: 2.8 }) }; }
    if (mode === "profits") { const k = clamp01((t - c.profitsQ) / (c.nov98 - c.profitsQ)); return { target: [-0.4, 0.78, 0.0], dist: mix(6.3, 5.9, k), az: 14, el: 6, fov: 32, look: L("trade", { dof: 0.55, focus: 5.4, bloom: 0.36, threshold: 2.8 }) }; }
    if (again) { const k = clamp01((t - c.end) / (c.remember - c.end)); return { target: [0, 1.55, -1.1], dist: mix(9.6, 9.0, k), az: mix(24, 20, k), el: 9, fov: 32, look: L("trade", { dof: 0.4, focus: 8.6, bloom: 0.28, threshold: 3.0, exposure: 0.9, rim: { color: "#ffcf9a", intensity: 1.2, dir: [-0.5, 0.6, -0.7] } }) }; }
    const k = clamp01((t - c.asking) / (c.petsShut - c.asking));
    return { target: [0.1, 1.55, -1.6], dist: mix(9.0, 8.5, k), az: mix(-14, -18, k), el: 9, fov: 32, look: L("trade", { dof: 0.42, focus: 7.6, exposure: 0.92, rim: { color: "#ff6a5a", intensity: 1.8, dir: [-0.5, 0.45, -0.75] } }) };
  }

  // ================================================================ BELL (first day +606% / IPO at $11)
  function shotBell(t, c, mode) {
    show("BELL");
    const RY = O.bellRY, a = mode === "a", ring = a ? c.six : c.pub;
    const bm = a ? (t > c.six - 0.1 ? "a1" : "a0") : (t > c.eleven - 0.1 ? "b" : "b0_" + (1 + Math.floor(Math.max(0, t - c.feb) / 0.25) % 3)); if (bm !== O.bellMode) { O.bellMode = bm; D.redraw(O.bellScr, O.bellBrd(bm)); }
    const sw = t > ring ? Math.sin((t - ring) * 9) * 0.22 * Math.exp(-(t - ring) * 1.1) : 0; O.bell.userData.swing.rotation.z = sw; if (O.bell.userData.clapper) O.bell.userData.clapper.rotation.z = t > ring ? -Math.sin((t - ring) * 9 - 0.9) * 0.3 * Math.exp(-(t - ring) * 1.1) : 0;
    // first-day bar: bricks stack on "six hundred percent"; IPO: a single $11 brick
    const nB = a ? Math.min(9, Math.max(1, 1 + Math.floor((t - c.six + 0.1) / 0.11))) : 0;
    O.jumpB.forEach((b, i) => { b.visible = a && i < nB; b.position.set(0, i * 0.42 + Math.max(0, drop(t, c.six - 0.1 + (i - 1) * 0.11, 0, 0.6) - 0) * (i > 0 ? 1 : 0), 0); });
    O.jumpSign.visible = false; O.jumpBar.visible = false; O.jumpSign.position.y = RY + nB * 0.42 + 0.3; O.priceBrick.visible = !a;
    O.bellPuff.begin(); if (a) for (let i = 1; i < 9; i++) D.dustRing(O.bellPuff, t, c.six - 0.1 + (i - 1) * 0.11 + 0.3, [1.05, RY + i * 0.42, -1.9], 0.7, 0.7, 6); else D.dustRing(O.bellPuff, t, c.eleven, [1.05, RY, -1.9], 0.8, 0.5, 12); O.bellPuff.end();
    // confetti fires from the two brick cannons on the riser corners when the bell rings
    O.cannons.forEach((cn, i) => { const mz = cn.userData.mouth; mz.updateMatrixWorld(true); const wp = new THREE.Vector3().setFromMatrixPosition(mz.matrixWorld); W.BELL.worldToLocal(wp);
      D.tickConfetti(i ? O.bellConf2 : O.bellConf, t, a ? ring + 0.05 : (i ? c.eleven + 0.8 : 1e9), [wp.x, wp.y, wp.z], { w: 0.5, d: 0.6, burst: 1.9, vx: a ? (i ? -0.55 : 0.55) : 1.0, vz: a ? 0.45 : -0.5, floor: RY + 0.02, scale: 0.6 });
    });
    const cheer = t > ring, reach = ss(a ? c.nov98 + 0.2 : c.feb, ring - 0.1, t);
    const ringer = a ? C.exec : C.exec2, other = a ? C.exec2 : C.exec;
    // the ringer reaches for the rope during the date line, yanks it on the cue, then cheers; the others clap along
    P(ringer, { x: -0.22, y: RY, z: -1.5, ry: -0.75, face: cheer ? "laugh" : "smile", gesture: cheer ? (t - ring > 0.6 ? "cheer" : null) : reach > 0.05 ? null : "present", aRz: !cheer && reach > 0.05 ? -0.3 : undefined,
      aR: cheer && t - ring < 0.6 ? -2.2 + 0.9 * Math.sin(clamp01((t - ring) / 0.6) * Math.PI) : !cheer && reach > 0.05 ? -0.4 - 1.85 * reach : undefined, eR: !cheer && reach > 0.05 ? -0.2 : undefined, hy: cheer ? 0.35 : -0.25 + 0.1 * Math.sin(t * 2), nod: cheer ? -0.05 : 0.06 });
    const clap = Math.abs(Math.sin(t * 7));
    P(other, { x: 1.75, y: RY, z: -1.5, ry: -0.5, face: cheer ? "grin" : "smile", gesture: cheer ? "cheer" : null, aR: cheer ? undefined : -1.25, aL: cheer ? undefined : -1.25, eR: cheer ? undefined : -1.2 + 0.35 * clap, eL: cheer ? undefined : -1.2 + 0.35 * clap, aRy: 0.3, aLy: -0.3, hy: -0.3 + 0.15 * Math.sin(t * 1.3) });
    P(C.inv2, { x: a ? 1.4 : -1.95, y: RY, z: a ? -1.0 : -1.15, ry: a ? -0.3 : 0.4, face: cheer ? "grin" : "smile", gesture: cheer ? "wave" : "point", hy: (a ? -0.4 : 0.3) + 0.12 * Math.sin(t * 1.6), look: cheer ? null : [-1.05, -1.75] });
    if (a) { const k = clamp01((t - c.nov98) / (c.y99 - c.nov98)), k2 = ss(c.six - 0.6, c.six + 0.6, t);
      return { target: [mix(-0.12, 0.02, k2), RY + 1.75, -1.6], dist: mix(10.6, 10.1, k), az: mix(4, 1, k2), el: 6, fov: 32, look: L("bell", { dof: 0.35, focus: mix(8.4, 7.8, k) }) }; }
    const k = clamp01((t - c.feb) / (c.march - c.feb));
    return { target: [-0.2, RY + 1.7, -1.8], dist: mix(9.4, 8.9, k), az: mix(5, 2, k), el: 6, fov: 32, look: L("bell", { dof: 0.35, focus: 8.0 }) };
  }

  // ================================================================ MOUNT (the index as brick bars)
  const BS = 0.8, BHs = 0.42 * BS;
  function setBars(t, c, mode) {
    const IM = O.barIM, cnt = { up: 0, peak: 0, down: 0, back: 0, gold: 0 }, m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(BS * 0.985, BS * 0.92, BS * 0.985);
    const wob = mode === "crash" ? ss(c.oct, c.bottomed - 0.05, t) : 0, eW = new THREE.Euler();
    const put = (cls, i, j, dy) => { const im = IM[cls]; p.set(O.barX[i], O.MY + j * BHs + (dy || 0), O.barZ); if (i === 4 && wob > 0) { eW.set(0.03 * wob * Math.sin(t * 31 + j), 0, 0.06 * wob * Math.sin(t * 23 + j * 1.7) * (j / 12)); q.setFromEuler(eW); p.x += 0.04 * wob * Math.sin(t * 19 + j); } else q.identity(); im.setMatrixAt(cnt[cls]++, m4.compose(p, q, s)); };
    const N = O.barN, cT = c.bottomed - 0.05, collapsed = mode === "crash" ? t > cT : mode === "climb";
    for (let i = 0; i < 20; i++) {
      let n = 0, cls = i <= 3 ? "up" : i === 4 ? "peak" : i <= 6 ? "down" : "back", t0 = -1, step = 0.1, base = 0;
      if (mode === "rise") { if (i < 3) n = N[i]; else if (i === 3) { base = 4; n = N[3]; t0 = c.y99 + 0.25; step = 0.32; } }
      else if (mode === "peak") { if (i < 4) n = N[i]; else if (i === 4) { n = t > c.stopped + 0.05 ? N[4] - 4 : N[4]; base = 0; t0 = c.march + 0.1; step = 0.14; } }
      else { if (i < 4) n = N[i]; else if (i === 4) n = collapsed ? 3 : N[4] - 4; else if (i === 5) { n = N[5]; t0 = mode === "crash" ? cT + 0.45 : -1; step = 0.1; } else if (i === 6) { n = N[6]; t0 = mode === "crash" ? cT + 0.8 : -1; step = 0.1; }
        else if (mode === "climb") { n = N[i]; t0 = c.climb + 0.2 + (i - 7) * ((c.fifteen - c.climb - 0.6) / 12); step = 0.05; if (t < t0) n = 0; if (i === 19 && t > c.fifteen - 0.1) cls = "gold"; } }
      for (let j = 0; j < n; j++) { let dy = 0; if (t0 > 0 && j >= base) { const tj = mode === "peak" ? peakT(j, c) : t0 + (j - base) * step; if (t < tj) continue; dy = drop(t, tj, 0, 0.25); }
        put(cls, i, j, dy); }
    }
    for (const k in IM) { IM[k].count = cnt[k]; IM[k].instanceMatrix.needsUpdate = true; }
  }
  const peakT = (j, c) => j < 10 ? c.march + 0.1 + j * 0.14 : j === 10 ? c.peaked - 0.55 : c.peaked - 0.3;
  function barTop(i, n) { return O.MY + n * BHs; }
  // the peak bar's top bricks topple left (away from the investor) as separate solid bricks, bounce once and stay as rubble
  function collapseBricks(t, c, mode, collapsed) {
    const H = BHs, Wd = 0.56, stopK = mode === "peak" && t > c.stopped + 0.05;
    O.collapse.forEach((b, i) => { let j = 3 + i, t0 = c.bottomed - 0.05;
      const pk = i >= 8; if (pk) { b.visible = mode !== "peak" || stopK; j = i; t0 = c.stopped + 0.05; } else b.visible = mode !== "peak" && collapsed && j < O.barN[4] - 4;
      if (!b.visible) return;
      const r = (k) => D.rnd(i * 9.1 + k * 2.3 + 5), d = pk ? (11 - j) * 0.06 : (11 - j) * 0.035, age = (mode === "climb" || (pk && mode !== "peak")) ? 30 : Math.max(0, t - t0 - d);
      const vx = pk ? 0.25 + 0.3 * r(1) : -(0.35 + 0.45 * r(1)) - 0.03 * j, vz = pk ? 0.8 + 0.45 * r(2) + 0.1 * (j - 8) : 0.3 + (r(2) - 0.5) * 0.7, vy = 0.3 + 0.5 * r(3), wz = 3.0 + 2.5 * r(4), g = -9;
      const c0 = O.MY + j * H + H / 2, floorC = O.MY + 0.2, tHit = (vy + Math.sqrt(vy * vy + 2 * -g * (c0 - floorC))) / -g;
      let cx, cy, cz, rz;
      if (age < tHit) { cx = O.barX[4] + vx * age; cz = O.barZ + vz * age; cy = c0 + vy * age + 0.5 * g * age * age; rz = wz * age; }
      else { const tb = age - tHit, vb = Math.abs(vy + g * tHit) * 0.28, tB = 2 * vb / -g, kb = Math.min(tb, tB), sl = Math.min(tb, tB + 0.25) * 0.4;
        const rL = wz * tHit, rest = Math.round(rL / (Math.PI / 2)) * (Math.PI / 2), side = Math.abs(Math.round(rL / (Math.PI / 2))) % 2 === 1;
        rz = mix(rL, rest, ss(0, 0.25, tb)); cx = O.barX[4] + vx * (tHit + sl); cz = O.barZ + vz * (tHit + sl); cy = mix(floorC, O.MY + (side ? Wd / 2 : H / 2), ss(0, 0.25, tb)) + Math.max(0, vb * kb + 0.5 * g * kb * kb); }
      b.rotation.set(0, (r(5) - 0.5) * 1.2, rz); const off = new THREE.Vector3(0, -H / 2, 0).applyEuler(b.rotation); b.position.set(cx + off.x, cy + off.y, cz + off.z); });
  }
  function shotMount(t, c, mode) {
    show("MOUNT"); setBars(t, c, mode);
    const collapsed = mode === "crash" ? t > c.bottomed - 0.05 : mode === "climb";
    collapseBricks(t, c, mode, collapsed); O.peakLine.position.z = O.barZ - 0.6; O.peakLine.visible = mode === "climb" && t > c.fifteen - 0.3; O.peakLine.position.y = barTop(4, O.barN[4]) + 0.05;
    D.tickBurst(O.chips, t, mode === "crash" ? c.oct + 0.6 : -100, [O.barX[4], barTop(4, O.barN[4] - 4) + 0.05, O.barZ + 0.1], { speed: 0.55, up: 0.9, floor: O.MY, life: 30, dir: [0.25, 0, 0.55] });
    O.mtFall.ms.forEach((m) => (m.visible = false));
    O.mtPuff.begin(); O.mtPuff.end();
    // summit flag + boombox + note plates (peak only)
    const peak = mode === "peak"; let h4 = 0; if (peak) for (let j = 0; j < 12; j++) if (t >= peakT(j, c)) h4 = j + 1;
    O.flag.visible = peak && t > c.peaked; { const t1 = c.stopped + 0.05, dt = Math.max(0, t - t1), fk = ss(t1, t1 + 0.3, t), y0 = drop(t, c.peaked, barTop(4, 12), 1.0);
      // the flag tips over with its pole as one rigid piece, falls off the broken top and lies on the baseplate (stays until the cut)
      O.flag.position.set(O.barX[4] + 0.05 + 0.25 * Math.min(dt, 0.5), t > t1 ? Math.max(O.MY + 0.06, y0 - 4.9 * dt * dt) : y0, O.barZ + 0.1 + 0.5 * Math.min(dt, 0.6)); O.flag.rotation.set(1.5 * fk, 0, 0); }
    O.boom.visible = peak; O.boom.position.set(O.barX[2], barTop(2, O.barN[2]), O.barZ); O.boom.rotation.y = 0.4;
    const playing = peak && t < c.stopped; D.tickConfetti(O.notes, t, peak ? c.march : 1e9, [O.barX[2], barTop(2, O.barN[2]) + 0.3, O.barZ], { w: 0.5, h: 0, d: 0.3, fall: -0.7, life: 3.0, floor: -50, scale: 1e-4 });
    if (mode === "rise") {
      const k = clamp01((t - c.y99) / (c.one - c.y99)), done = t > c.eighty;
      P(C.inv2, { x: O.barX[3] + 0.7, y: O.MY, z: O.barZ + 1.15, ry: 0.2, face: done ? "grin" : "smile", gesture: done ? "cheer" : "point", nod: -0.1, hy: -0.5 + 0.15 * Math.sin(t * 1.5) });
      P(C.bob, { x: O.barX[2] - 0.35, y: O.MY, z: O.barZ + 1.3, ry: 0.5, face: done ? "laugh" : "smile", gesture: done ? "wave" : "hold", nod: -0.2, hy: 0.3 });
      return { target: [O.barX[3] - 0.2, 1.95, O.barZ + 0.4], dist: mix(9.6, 9.0, k), az: mix(14, 9, k), el: 3, fov: 32, look: L("dusk", { fog: ["#b8907e", 12, 46],  dof: 0.35, focus: 9.4 }) };
    }
    if (peak) {
      const up = clamp01(h4 / 12), stopped = t > c.stopped;
      P(C.inv1, { x: O.barX[3], y: barTop(3, 10), z: O.barZ + 0.05, ry: 0.3, face: stopped ? "shock" : "laugh", gesture: stopped ? null : t > c.peaked ? "cheer" : "wave", aL: stopped ? -0.5 : undefined, aR: stopped ? -0.5 : undefined, nod: stopped ? 0.1 : -0.05 * Math.abs(Math.sin(t * 6)), hy: stopped ? 0.4 : 0.15 * Math.sin(t * 3) });
      const k = clamp01((t - c.march) / (c.june - c.march));
      const dn = ss(c.stopped + 0.1, c.stopped + 0.9, t); return { target: [O.barX[3] + 0.4 + 0.5 * dn, mix(mix(3.5, 4.75, ss(0, 1, up)), 3.3, dn), O.barZ + 0.3 * dn], dist: mix(9.8, 9.2, k) + 1.2 * dn, az: mix(12, 7, k), el: mix(mix(2, 4, up), 9, dn), fov: 32,
        look: L("dusk", { fog: ["#b8907e", 12, 46],  dof: 0.4, focus: 7.8, exposure: stopped ? 0.82 : 0.92, bloom: stopped ? 0.38 : 0.42, threshold: 2.7 }) };
    }
    if (mode === "crash") {
      const hit = t > c.bottomed - 0.05;
      P(C.inv1, { x: O.barX[5] + 0.25 + 0.35 * ss(c.oct + 0.2, c.oct + 0.9, t), y: O.MY, z: O.barZ + 1.0 + 0.2 * ss(c.oct + 0.2, c.oct + 0.9, t), walk: t > c.oct + 0.2 && t < c.oct + 0.9 ? K.walkPh(t, 7) : null, ry: -0.35, face: hit ? "shock" : "worried", gesture: hit ? "shrug" : t > c.oct + 0.3 ? "point" : null, aL: hit && t < c.bottomed + 0.9 ? -1.9 : undefined, aR: hit && t < c.bottomed + 0.9 ? -1.9 : undefined, look: [O.barX[4], O.barZ], nod: hit && t < c.bottomed + 0.9 ? 0.2 : -0.2, hy: 0.15 * Math.sin(t * 1.7) });
      const k = clamp01((t - c.oct) / (c.climb - c.oct));
      return { target: [O.barX[5] - 0.2, 1.75, O.barZ + 0.4], dist: mix(10.8, 10.2, k), az: mix(4, 10, k), el: 6, fov: 32, look: L("dusk", { fog: ["#b8907e", 12, 46],  dof: 0.35, focus: 9.6 }) };
    }
    const k = ss(c.climb, c.fifteen + 0.2, t), xi = mix(O.barX[7], O.barX[19], k);
    P(C.inv1, { x: xi - 0.6, y: O.MY + 0.03, z: O.barZ + 1.1, ry: mix(Math.PI / 2 - 0.5, -0.3, ss(0.96, 1.0, k)), walk: k > 0.02 && k < 0.985 ? K.walkPh(t, 8) : null, face: t > c.fifteen ? "smile" : "determined", gesture: t > c.fifteen ? "cheer" : null, look: k >= 0.98 ? [O.barX[19], O.barZ] : null, nod: -0.15 });
    // three beats so the climb never sits on one framing: tracking walk, a high crane view of the bars filling in, a low hero angle at the 2015 bar
    if (t < c.close) return { target: [xi - 0.5, 1.75, O.barZ + 0.4], dist: 10.6, az: 8, el: 6, fov: 32, look: L("dusk", { fog: ["#b8907e", 12, 46],  dof: 0.3, focus: 10.0 }) };
    if (t < c.fifteen - 0.1) { const k2 = clamp01((t - c.close) / (c.fifteen - c.close)); return { target: [xi - 0.3, 1.3, O.barZ + 0.3], dist: mix(12.5, 11.8, k2), az: mix(24, 18, k2), el: 30, fov: 34, look: L("dusk", { fog: ["#b8907e", 12, 46],  dof: 0.25, focus: 12.0, bloom: 0.3, threshold: 2.8 }) }; }
    const k3 = clamp01((t - c.fifteen) / (c.hype - c.fifteen));
    return { target: [O.barX[19] - 1.3, mix(2.5, 2.9, k3), O.barZ + 0.4], dist: mix(11.2, 10.6, k3), az: -12, el: 4, fov: 34, look: L("dusk", { fog: ["#b8907e", 12, 46],  dof: 0.3, focus: 9.0 }) };
  }

  // ================================================================ WARE (Pets.com: sold below cost)
  function shotWare(t, c) {
    show("WARE");
    D.setDoor(O.door, ss(c.meet - 0.7, c.meet + 1.2, t));
    O.petsSign.userData.front.emissiveIntensity = t > c.meet ? 0.9 : 0.0;
    // the beam tips hard toward PAID (cost > price) on "less than it paid", with a bounce as it settles
    const tip = t < c.less - 0.1 ? 0.03 * Math.sin(t * 2.2) : 0.3 + 0.07 * Math.exp(-(t - c.less) * 3) * Math.sin((t - c.less) * 14); D.setScale(O.scale, t < c.less - 0.1 ? tip : tip * ss(c.less - 0.1, c.less + 0.2, t));
    O.fork.userData.forks.position.y = 0.12 + 0.55 * (0.5 - 0.5 * Math.cos(t * 0.7));
    D.tickConveyor(O.cv, t); O.panBag.position.y = drop(t, c.sold - 0.5, -0.88, 0.7); O.panBag.visible = t > c.sold - 0.5;
    const ww = walkTo(t, c.one, c.meet - 0.2, [-1.7, 0.2], [-0.3, -0.35]), wWalk = ww[2] > 0.01 && ww[2] < 0.99;
    P(C.worker, { x: ww[0], z: ww[1], ry: wWalk ? Math.PI / 2 - 0.3 : 0.55, walk: wWalk ? K.walkPh(t, 8) : null, face: t > c.less ? "worried" : "smile", gesture: t > c.less + 0.3 ? "facepalm" : t > c.sold ? "point" : t > c.meet ? "present" : "wave", aRy: 0.35, hy: t > c.sold ? 0.3 + 0.1 * Math.sin(t * 2) : 0.5 * Math.sin(t * 1.3), nod: 0.08 * Math.sin(t * 2.6) });
    P(C.driver, { x: 2.6, z: -2.2, ry: -0.45, face: t > c.less ? "worried" : "neutral", gesture: t > c.less ? "shrug" : "hold", hy: 0.4 * Math.sin(t * 1.1 + 1) });
    if (t < c.meet - 0.45) { const k = clamp01((t - c.one) / (c.meet - 0.45 - c.one)); return { target: [mix(-5.05, -4.95, k), 2.0, -3.2], dist: mix(5.6, 5.2, k), az: mix(2, -2, k), el: 4, fov: 32, look: L("ware", { dof: 0.45, focus: 5.4 }) }; }
    if (t < c.sold - 0.1) { const k = clamp01((t - c.meet) / (c.sold - c.meet)); return { target: [0.45, 1.45, -1.6], dist: mix(9.6, 9.2, k), az: mix(-2, -4, k), el: 5, fov: 32, look: L("ware", { dof: 0.36, focus: 8.6 }) }; }
    const k = clamp01((t - c.sold) / (c.ship - c.sold));
    return { target: [0.45, 1.15, -1.0], dist: mix(6.9, 6.5, k), az: mix(-10, -13, k), el: 6, fov: 32, look: L("ware", { dof: 0.5, focus: 6.0 }) };
  }

  // ================================================================ STREET (free shipping)
  function shotStreet(t, c) {
    show("STREET");
    // sacks arc out of the van's rear door and stack on a stud grid beside it (no two sacks intersect)
    let nb = 0; const door = [0.95, 0.92, -0.75];
    O.pileBags.forEach((b, i) => { const t0 = c.ship + 0.1 + i * 0.27, h = b.userData.home, u = clamp01((t - t0) / 0.38); b.visible = t > t0; if (b.visible) nb++;
      const bounce = u >= 1 ? 0.05 * Math.max(0, Math.sin((t - t0 - 0.38) * 18)) * Math.exp(-(t - t0 - 0.38) * 9) : 0;
      b.position.set(mix(door[0], h[0], u), mix(door[1], h[1], u) + 0.55 * Math.sin(Math.PI * u) + bounce, mix(door[2], h[2], u)); b.rotation.set(0, h[3] * u, 0.6 * (1 - u)); });
    O.van.position.y = -0.04 * nb / 12; O.van.rotation.x = -0.008 * nb / 12;
    const w = walkTo(t, c.ship - 0.1, c.ship + 1.5, [-1.6, -0.6], [1.3, -0.75]), arrived = w[2] >= 0.99;
    O.driverSack.visible = !arrived;
    P(C.driver, { x: w[0], z: w[1], ry: arrived ? 0.35 : Math.PI / 2 - 0.55, walk: w[2] > 0.01 && w[2] < 0.99 ? K.walkPh(t, 7) : null, face: t > c.lost ? "worried" : "determined", gesture: t > c.lost ? "shrug" : null,
      aR: O.driverSack.visible ? -0.8 : undefined, aL: O.driverSack.visible ? -0.8 : undefined, eR: O.driverSack.visible ? -0.55 : undefined, eL: O.driverSack.visible ? -0.55 : undefined, aRy: 0.25, aLy: -0.25, hy: arrived ? 0.3 * Math.sin(t * 1.5) : -0.2, nod: 0.1 });
    O.truck.visible = false;
    D.tickBurst(O.leak, t, c.lost + 0.1, [0.75, 0.38, -2.2], { speed: 1.0, up: 0.6, floor: 0.02, life: 4, spread: 1 });
    if (t < c.lost) { const k = clamp01((t - c.ship) / (c.lost - c.ship)); return { target: [0.1, 1.55, -1.2], dist: mix(10.8, 10.4, k), az: 3, el: 4, fov: 32, look: L("golden", { dof: 0.32, focus: 10.2, sun: { color: "#ffc98a", intensity: 2.7, dir: [-0.75, 0.26, 0.6], shadow: 12 } }) }; }
    const k = clamp01((t - c.lost) / (c.puppet - c.lost));
    return { target: [0.55, 1.5, -1.3], dist: mix(9.8, 9.4, k), az: -4, el: 4, fov: 32, look: L("golden", { dof: 0.4, focus: 8.6, sun: { color: "#ffc98a", intensity: 2.7, dir: [-0.75, 0.26, 0.6], shadow: 12 } }) };
  }

  // ================================================================ STADIUM (sock puppet + the big-game ad)
  function shotStadium(t, c, mode) {
    show("STADIUM");
    const tease = mode === "tease", t0 = tease ? c.warn - 0.12 : c.puppet;
    // the puppet talks (mouth hinges open) out of the ON AIR booth; big mouth-open beat on "sock puppet"
    const big = tease ? Math.exp(-Math.pow((t - c.warn - 0.2) / 0.25, 2)) : Math.exp(-Math.pow((t - c.sock - 0.2) / 0.3, 2));
    const talk = Math.max(big, t > t0 + 0.25 ? 0.6 * Math.max(0, Math.sin(t * 9)) : 0), ak = talk > 0.45 ? 1 : 0;
    if (ak !== O.adK) { O.adK = ak; D.redraw(O.jumbo, O.adDraw(ak)); }
    O.puppet.position.y = FL + (tease ? 1.32 : mix(0.6, 1.32, ss(c.puppet - 0.2, c.puppet + 0.25, t))); D.setPuppet(O.puppet, Math.max(0.25, talk), 0.05 * Math.sin(t * 2) - 0.1 * big, (tease ? -0.05 : 0.3) + 0.12 * Math.sin(t * 1.3));
    D.tickConfetti(O.stadConf, t, tease ? 1e9 : c.bowl, [-0.2, 0.2, -2.6], { w: 5, h: 4.2, d: 3, fall: 1.2, life: 6, floor: FL, scale: 0.9 });
    const cheer = !tease && t > c.bowl - 0.1;
    C.fans.forEach((f, i) => { const r = Math.floor(i / 4), x = -2.6 + (i % 4) * 1.6 + (r % 2) * 0.6, top = 0.42 + r * 0.42;
      const up = cheer ? Math.max(0, Math.sin(t * 6 + i * 1.3)) : 0;
      P(f, { x, y: top - 0.42, z: -6.15 - r * 0.9, ry: (x > 0 ? -0.15 : 0.15), sit: 1, face: cheer ? (i % 2 ? "laugh" : "grin") : "smile", aL: cheer ? -2.4 - 0.4 * up : -0.6 - 0.25 * Math.max(0, Math.sin(t * 5 + i)), aR: cheer ? -2.4 - 0.4 * (1 - up) : -0.6 - 0.25 * Math.max(0, Math.sin(t * 5 + i + 1)), eL: -0.2, eR: -0.2, hy: 0.2 * Math.sin(t + i) }); });
    if (tease) { const k = clamp01((t - t0) / (c.inv - t0)); return { target: [-0.3, 2.5, -1.35], dist: mix(6.6, 6.1, k), az: -28, el: 6, fov: 32, look: L("night", { dof: 0.55, focus: 6.0, bloom: 0.4, threshold: 2.8 }) }; }
    const k = clamp01((t - c.puppet) / (c.feb - c.puppet));
    return { target: [-0.15, 2.75, -2.8], dist: mix(9.8, 9.2, k), az: mix(-10, -13, k), el: 2, fov: 34, look: L("night", { dof: 0.35, focus: 7.6, bloom: 0.42, threshold: 2.8 }) };
  }

  // ================================================================ FED (six rate hikes; cheap money dries up)
  function shotFed(t, c, mode) {
    show("FED");
    // the official ticks the board up one lit bar at a time from "the Federal Reserve" to "six times" (tap on every tick)
    const t0 = c.fedN, dt = Math.max(0.2, (c.sixT + 0.15 - c.fedN) / 6); let n = 0; for (let i = 0; i < 6; i++) if (t > t0 + i * dt) n = i + 1; D.setRates(O.rates, n);
    D.tickFountain(O.fountain, t, c.dried - 0.35, c.cheap - 1.3);
    const ph = (t - t0) / dt, pulse = n > 0 && n < 6 ? Math.max(0, Math.sin((ph % 1) * Math.PI)) : 0, pre = t < t0;
    P(C.fed, { x: -0.2, z: -2.3, ry: 0.45, face: n >= 6 ? "determined" : pre ? "neutral" : "smirk", aR: pre ? -0.6 - 0.5 * ss(c.june, t0, t) : -1.25 - 0.55 * pulse, eR: -0.4, aRy: 0.3, gesture: pre ? null : undefined, hy: pre ? 0.25 * Math.sin(t * 2.2) : 0.55, nod: 0.05 + 0.06 * pulse, look: pre ? null : [1.05, -2.45] });
    P(C.bob, { x: mode === "dry" ? -0.3 : -1.05, z: -0.95, ry: 0.15, face: n >= 3 ? "worried" : "neutral", gesture: n >= 3 ? "think" : "hold", look: [1.05, -2.45], nod: 0.06 * Math.sin(t * 1.9) });
    if (mode === "dry") P(C.inv2, { x: 0.55, z: 0.15, ry: -0.9, face: t > c.dried ? "sad" : "smile", gesture: t > c.dried ? "shrug" : "reach", aRy: 0.2, look: [-1.35, 0.6], nod: 0.2, hy: 0.15 * Math.sin(t * 1.5) });
    if (mode === "rates") { const k = clamp01((t - c.june) / (c.cheap - c.june)); return { target: [0.25, 2.45, -2.3], dist: mix(11.8, 11.2, k), az: mix(-6, -2, k), el: 3, fov: 32, look: L("fed", { dof: 0.32, focus: 11.0 }) }; }
    const k = clamp01((t - c.cheap) / (c.asking - c.cheap));
    return { target: [-0.5, 1.55, -0.4], dist: mix(9.8, 9.4, k), az: mix(9, 6, k), el: 7, fov: 32, look: L("fed", { dof: 0.42, focus: 8.4 }) };
  }

  // ================================================================ BUST (Pets.com shuts down) + the ending
  function shotBust(t, c, mode) {
    show("BUST");
    const end = mode === "end";
    O.signFlip.rotation.y = end ? 0 : Math.PI * (1 - ss(c.nine - 0.05, c.nine + 0.3, t));
    O.signFlip.rotation.z = end ? 0.06 * Math.sin((t - c.end) * 2.4) * Math.exp(-(t - c.end) * 0.15) : t > c.nine ? 0.12 * Math.sin((t - c.nine) * 7) * Math.exp(-(t - c.nine) * 1.5) : 0;
    O.bustLights.forEach((lg, i) => { const off = end || t > c.shut + i * 0.35 + (Math.sin(t * 40) > 0.6 ? -0.2 : 0); lg.visible = !off; });
    const popT = c.pops + 0.05;
    O.bustSun.intensity = end ? mix(9, 7, ss(popT, popT + 1.0, t)) : 7;
    { const f0 = end ? c.remember - 0.1 : c.shut, on = t < f0 + 0.9 && (t < f0 || Math.sin(t * 47) + Math.sin(t * 23) > 0.3); O.flickTube.visible = on; }
    // ending: the puppet slumps on "remember the sock puppet", then blows a brick bubble out of its mouth that pops on "pops"; it droops under the end card
    const slump = end ? ss(c.remember + 0.2, c.remember + 0.7, t) * (1 - ss(c.follow - 0.1, c.follow + 0.3, t)) : 0, blow = end && t > c.follow && t < popT, droop = end ? ss(popT + 0.2, popT + 0.9, t) : 0;
    D.setPuppet(O.bustPuppet, end ? (blow ? 0.38 : 0.2 * Math.max(0, Math.sin((t - c.remember) * 9)) * (t < c.remember + 0.6 ? 1 : 0)) : 0, end ? mix(0.45 * slump - 0.12 * (blow ? 1 : 0), 0.5, droop) : 0.45, end ? 0.45 : 0.4);
    const mp = O.mouthP;
    const bt = clamp01((t - c.follow) / (popT - c.follow)), bs = 0.25 + 0.9 * bt * bt * (3 - 2 * bt);
    O.bubble.visible = blow; O.bubble.position.set(mp.x + 0.2 * bs, mp.y + 0.04 * bs, mp.z + 0.26 * bs); O.bubble.scale.setScalar(bs);
    const pa = [mp.x + 0.23, mp.y + 0.05, mp.z + 0.3];
    O.bubFlash.visible = end && t > popT && t < popT + 0.1; O.bubFlash.position.set(pa[0], pa[1], pa[2]); O.bubFlash.scale.setScalar(1 + 6 * (t - popT));
    D.tickConfetti(O.bubPop, t, end ? popT : 1e9, pa, { w: 1.0, d: 0.8, burst: 1.7, floor: FL, scale: 0.6 });
    if (!end) { const k = clamp01((t - c.petsShut) / (c.webvan - c.petsShut));
      return { target: [-0.55, 1.55, -1.9], dist: mix(8.8, 8.3, k), az: mix(-14, -10, k), el: 6, fov: 32, look: L("loft", { dof: 0.4, focus: 7.6 }) }; }
    const k = clamp01((t - c.end) / (c.total - c.end));
    const k2 = clamp01((t - c.remember) / (c.total - c.remember));
    return { target: [-0.15, 1.6, -1.45], dist: mix(7.8, 6.7, F.E.o3(k2)), az: mix(-14, -19, k2), el: 4, fov: 32, look: L("loft", { dof: 0.5, focus: mix(6.4, 5.8, k), rim: { color: "#ffb36a", intensity: 2.4, dir: [0.4, 0.5, -0.8] } }) };
  }

  // ================================================================ LOT (Webvan goes bankrupt)
  function shotLot(t, c) {
    show("LOT");
    O.gate.position.x = mix(4.4, 0, ss(c.webvan - 0.4, c.bankrupt - 0.05, t));
    const bk = t > c.bankrupt + 0.25; O.bankrupt.visible = bk; O.bankrupt.scale.setScalar(bk ? 1 + 0.25 * Math.exp(-(t - c.bankrupt - 0.25) * 8) : 1);
    P(C.driver, { x: -0.3, z: -0.95, ry: 0.45, face: t > c.bankrupt ? "sad" : "worried", gesture: t > c.bankrupt + 0.3 ? "facepalm" : t > c.webvan + 0.6 ? "shrug" : "point", look: t < c.bankrupt ? [0.5, -5] : null, hy: 0.35 * Math.sin(t * 1.3), nod: 0.08 * Math.sin(t * 2.1) });
    const k = clamp01((t - c.webvan) / (c.amazon - c.webvan));
    return { target: [0.25, 1.7, -1.9], dist: mix(9.4, 8.9, k), az: mix(-3, 2, k), el: 2.5, fov: 32, look: L("lot", { dof: 0.4, focus: 8.4 }) };
  }

  // ================================================================ SKY (Amazon -90%; the internet didn't die; giants; price tag)
  function shotSky(t, c, mode) {
    show("SKY");
    const rise = mode === "rise"; O.skyNight.visible = !rise; O.skyDawn.visible = rise; if (O.skyClouds) O.skyClouds.visible = rise; if (O.skyClouds2) O.skyClouds2.visible = rise; O.blimp.visible = false;
    if (rise) D.WIN.lit.forEach((m) => m.color.multiplyScalar(0.55));
    O.crane1.rotation.y = O.craneRY[0] + (rise ? 0.3 * Math.sin(t * 0.35) : 0); O.crane2.rotation.y = O.craneRY[1] + (rise ? 0.25 * Math.sin(t * 0.3 + 1) : 0);
    // fall: the windows black out top to bottom and the floors break off one slab at a time, tumbling off to alternate sides
    let top = 0;
    O.heroF.forEach((fg, f) => {
      let vis = false, y = f * 0.96, s = 1, x = 0, rz = 0, dark = false;
      if (!rise) { const ts = c.ninety - 0.05 + (15 - f) * 0.07; vis = f < 16; dark = t > ts - 0.3 || (f < 1 && t > c.ninety + 1.6);
        if (f >= 1 && t > ts) { const dt = t - ts, sd = f % 2 ? 1 : -1; y = f * 0.96 + 1.2 * dt - 7 * dt * dt; x = sd * 2.6 * dt; rz = -sd * 1.8 * dt; if (y < -3) vis = false; } }
      else { const tf = c.hype + 0.2 + Math.max(0, f - 11) * Math.max(0.12, (c.giant - c.hype - 0.5) / 11); vis = f < 22 && (f < 11 || t > tf); s = f < 11 ? 1 : clamp01((t - tf) / 0.12); }
      fg.visible = vis; fg.position.set(x, y, 0); fg.rotation.z = rz; fg.scale.set(1, Math.max(1e-3, s), 1); fg.userData.lit.forEach(([im, m]) => (im.material = dark ? O.darkWin : m));
      if (vis && rz === 0) top = Math.max(top, y + 0.96 * s); });
    O.heroCrown.position.y = top; O.heroCrown.visible = rise ? top > 2.5 : t < c.ninety - 0.05;
    O.skyDust.begin(); if (!rise) for (let i = 0; i < 8; i++) D.dustRing(O.skyDust, t, c.ninety + 0.1 + i * 0.2, [O.hero.position.x, 1.2, O.hero.position.z], 3.4, 3.4, 14); O.skyDust.end();
    D.tickBurst(O.heroFall, t, rise ? -100 : c.ninety + 0.15, [O.hero.position.x, 9.0, O.hero.position.z], { speed: 3.0, up: 1.5, floor: 0.05, life: 3 });
    O.tag.visible = false; O.tagStamp.visible = false;
    if (!rise) {
      const hit = t > c.ninety; O.inv1Phone.visible = !hit || t < c.ninety + 0.5;
      P(C.inv1, { x: -0.25, z: -0.9, ry: 0.35, face: hit ? "shock" : "worried", gesture: hit && t > c.ninety + 0.5 ? "shrug" : "phone", hy: hit ? 0.45 : 0.15 * Math.sin(t * 1.4), nod: hit ? -0.12 : 0.08 });
      const k = clamp01((t - c.amazon) / (c.oct - c.amazon));
      return { target: [0.3, 2.3, -3.5], dist: mix(10.4, 10.0, k), az: 3, el: 3, fov: 40, look: L("night", { dof: 0.25, focus: 8.0 }) };
    }
    const giants = t > c.giants;
    P(C.bob, { x: -0.6, z: -0.95, ry: 0.4, face: giants ? "grin" : "smile", gesture: giants ? "cheer" : t > c.hypeDid ? "point" : "present", aRy: -0.4, hy: 0.3 + 0.12 * Math.sin(t * 1.3), look: t > c.hypeDid && !giants ? [1.6, -14] : null });
    P(C.inv2, { x: 0.45, z: -0.8, ry: -0.35, face: "grin", gesture: giants ? "point" : t < c.hypeDid ? "present" : null, look: t > c.giant - 0.3 ? [1.6, -14] : null, hy: -0.35 + 0.12 * Math.sin(t * 1.1 + 1) });
    // on "giants" the camera tilts up the growing survivor tower (low angle), faces stay above the subtitle band
    if (giants) { const k = clamp01((t - c.giants) / (c.end - c.giants)); return { target: [0.2, mix(2.5, 2.8, F.E.o3(k)), -3.2], dist: mix(10.8, 11.6, k), az: mix(-12, -8, k), el: mix(-2, -5, k), fov: 40, look: L("sunset", { dof: 0.3, focus: 6.8 }) }; }
    const k = clamp01((t - c.hype) / (c.giants - c.hype));
    return { target: [0.1, 2.75, -4.0], dist: mix(11.2, 11.8, k), az: 2, el: 3, fov: 40, look: L("sunset", { dof: 0.25, focus: 8.8 }) };
  }

  // name chips + numbers (lower third above the subtitle band; never on faces)
  // fact chips are anchored to the object they describe (leader line from the bar / tower) or parked in the upper third; never on a figure
  const barTopW = (i, n) => [O.barX[i], O.MY + n * BHs + 0.05, O.barZ];
  const heroTop = () => { const v = new THREE.Vector3(0, 6.5, 0); O.hero.localToWorld(v); return [v.x, v.y, v.z]; };
  const callouts = [
    { at: "and in 1999 alone", offset: 0.3, text: "NASDAQ", sub: "+85.6% IN 1999", kind: "chip", pos: () => barTopW(3, O.barN[3]), dx: -150, dy: -190, until: "now about that", untilOffset: -0.1 },
    { at: "peaked above", offset: 1.3, text: "5,048.62", sub: "MARCH 10, 2000", kind: "chip", pos: () => barTopW(4, O.barN[4]), dx: 190, dy: -150, until: "music stopped", untilOffset: 0.1 },
    { at: "in under a", offset: 0.3, text: "JUNE 1999 → MAY 2000", kind: "chip", screen: [540, 470], until: "six times", untilOffset: -0.2 },
    { at: "nine months", text: "FEB → NOV 2000", kind: "warn", screen: [540, 470], until: "webvan the grocery", untilOffset: -0.1 },
    { at: "more than 90", offset: 0.45, text: "MORE THAN 90%", sub: "OFF ITS PEAK", kind: "warn", screen: [620, 560], until: "in october 2002", untilOffset: -0.1 },
    { at: "hit bottom", offset: 0.15, text: "ABOUT 1,114", sub: "OCT 9, 2002", kind: "chip", screen: [560, 520], until: "down about 78", untilOffset: -0.12 },
    { at: "april 2015", text: "APRIL 23, 2015", sub: "BACK ABOVE THE 2000 PEAK", kind: "ok", screen: [520, 400], until: "but the internet", untilOffset: -0.1 },
  ];
  window.SCENE = { labels: [], callouts, build, update, pixelRatio: 1.5 };
})();
