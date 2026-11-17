/* ============================================================================
   DC-SETS (dotcom-crash-lego): the 11 brick-built sets. DCSETS.build(ctx, K, X, PK, D) -> { W, O }
   Every set is a group around the origin (exactly one visible per shot); camera usually on +z looking -z.
   Each set: >= 6 prop types, >= 3 unique to it, foreground + midground + background, extras holding props, live props.
     OFFICE  1999 shoe-shop office: BOB'S SHOES sign gets .COM, beige CRTs, stock CRT, shoe boxes, fax, ceiling fan
     TRADE   trading floor: LED ticker, desks of CRTs + phones, the ".COM" money jar, PROFITS? brick, wall clocks
     BELL    exchange podium: brass bell, lectern, brick bar (+606%), confetti, flags, balloons, press camera
     MOUNT   the index "mountain": brick bars 1996..2015 on a baseplate at dusk, ghost peak, summit flag, boombox
     WARE    pet-food warehouse: racks, pallets, forklift, conveyor, balance scale (cost vs price), LOSS tags, roller door
     STREET  delivery street: FREE SHIPPING van, bag pile, hand truck, mailbox, newspaper box, pigeons
     STADIUM night stadium: bleachers + crowd, jumbotron ad, flood towers, goalpost, brick sock puppet on a stage
     FED     marble reserve-bank facade: columns, steps, rate board, coin fountain (cheap money) that dries up
     BUST    shut-down startup loft: bean bags, kick scooters, foosball, lava lamp, CLOSED sign, moving boxes, puppet
     LOT     grocery-van lot: GROCERIES vans, produce crates, carts, chain gate + padlock
     SKY     survivors skyline from a rooftop terrace: brick towers, one tower that falls 90% then grows, cranes, price tag
   ============================================================================ */
(function () {
  function build(ctx, K, X, PK, D) {
    const THREE = ctx.THREE, FL = K.FL, W = {}, O = {}, rnd = D.rnd;
    const { M, glowM, grp, bx, rbx, cyl, noShadow } = D;
    const ex = (sp) => Object.assign({ skin: K.SKIN.light }, sp);
    O.extras = []; // { f, set, base pose, anim(t) -> pose overrides } so no extra stays frozen
    const extra = (set, sp, pose, acc, anim) => { const f = PK.extra(W[set], ex(sp), pose, acc); O.extras.push({ f, set, pose, anim }); return f; };
    const crtDraw = (title, col) => (c, Wd, H) => { c.fillStyle = "#06221a"; c.fillRect(0, 0, Wd, H); c.fillStyle = col || "#40ff80"; c.font = "700 16px monospace"; c.fillText(title || "> READY_", 8, 20); for (let i = 0; i < 5; i++) c.fillRect(8, 34 + i * 14, 40 + rnd(i + Wd) * 90, 6); };

    // ================================================================ OFFICE (1999)
    { const g = W.OFFICE = grp(); X.sky(g, "golden");
      D.carpet(g, 9, 8, "#4f5d6e", "#45525f", -0.6);
      const cols = ["#b5a687", "#aa9b7d", "#bfb091"];
      D.wallBack(g, cols, -4.5, 4.5, -3.4, 9, (r, x) => r >= 2 && r <= 6 && x > 5.9 && x < 8.7);
      D.windowFrame(g, 2.8, FL + 2.0, -3.4, 2.4, 2.3, "#5a4632", 3);
      for (let i = 0; i < 9; i++) noShadow(bx(g, 2.36, 0.05, 0.03, M("#e8dcc0", { roughness: 0.6 }), 2.8, FL + 1.05 + i * 0.24, -3.28)); // venetian blinds
      { const sp = new THREE.SpotLight("#a8c8ff", 5, 12, 0.5, 0.6, 1.4); sp.position.set(3.4, FL + 2.6, -2.6); sp.target.position.set(0, FL + 1.3, -1.6); g.add(sp); g.add(sp.target); }
      { const cal = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.72), D.canvasMat(160, 206, (c, Wd, H) => { c.fillStyle = "#f4f2ec"; c.fillRect(0, 0, Wd, H); c.fillStyle = "#c8102e"; c.fillRect(0, 0, Wd, 56); c.fillStyle = "#fff"; c.font = "900 44px Arial Black, Arial"; c.textAlign = "center"; c.fillText("1999", Wd / 2, 44);
          c.fillStyle = "#555"; for (let r = 0; r < 5; r++) for (let k = 0; k < 7; k++) c.fillRect(10 + k * 21, 70 + r * 26, 14, 16); })); cal.position.set(-1.75, FL + 2.45, -3.17); g.add(cal); }
      D.skyline(g, { z: -15, x0: -6, x1: 16, n: 7, fMin: 6, fMax: 16, seed: 3, rows: 2, lit: 0.6 });
      D.wallSide(g, cols, -4.5, -3.4, 4, 9, -1); D.wallSide(g, cols, 4.5, -3.4, 4, 9, 1);
      D.ceiling(g, 9, 7.4, FL + 4.0, "#e8e2d4", [[-1.6, -1.2, 1.4, 0.3], [1.6, -1.2, 1.4, 0.3]]);
      O.signBob = D.brickSign(g, ["BOB'S SHOES"], "#7a1f2a", "#f2e6c8", 1.72, 0.56, -0.42, FL + 1.98, -3.1, 0, { border: "#c9a24a" });
      O.signCom = D.brickSign(g, [".COM"], "#7a1f2a", "#c8ff3e", 0.8, 0.56, 0.84, FL + 1.98, -3.1, 0, { border: "#c9a24a" }); O.signCom.userData.noBake = true;
      O.offPuff = D.dustPuffs(g, "#e8dcc0", 0.35);
      // the desk (foreground) + the stock CRT between the two figures
      const dk = D.desk(g, 0, FL, -0.95, 0, 2.7, 1.0, "#8a6a48"), top = FL + 0.81;
      O.stockCrt = D.crt(g, 0.02, top, -1.1, 0, { s: 0.95, draw: crtDraw("BOBS.COM"), k: 1.15 });
      D.keyboard(g, -0.72, top, -0.75, 0.25); D.deskPhone(g, 0.95, top, -0.8, -0.4, "#d9cfb4"); D.deskLamp(g, -1.12, top, -1.15, 0.5, "#2f6a4a");
      O.deskBoxes = D.shoeBoxes(g, 1.15, top, -1.2, 0.2, 3);
      D.pcTower(g, -1.05, FL, -0.55, 0.1);
      // back wall dressing (visible between the figures), side tables
      PK.filingCabinet(g, 1.75, FL, -2.95, 0, { n: 3, col: "#8a8f96" });
      { const sc = D.crt(g, 1.75, FL + 3 * (PK.BH + PK.PH) + PK.PH, -2.95, -0.2, { s: 0.7, draw: crtDraw("ORDERS"), k: 0.9 }); O.sideCrt = sc; }
      D.shoeRack(g, -2.55, FL, -2.95, 0.15);
      PK.waterCooler(g, -2.75, FL, -2.95, 0.2);
      PK.coatRack(g, 3.4, FL, -2.5, -0.6, { coat: "#3a4a6a" });
      PK.corkBoard(g, -3.1, FL + 2.2, -3.17, 0, { w: 0.9, h: 0.6 });
      PK.ceilingFan(g, 0.1, FL + 4.0, -1.6, { speed: 2.6 });
      { const st = D.desk(g, -2.3, FL, -1.8, 0.4, 1.0, 0.7, "#6b4a2e"); O.fax = D.fax(g, -2.3, FL + 0.81, -1.8, 0.4); }
      O.stackL = D.shoeBoxes(g, -1.6, FL, -0.7, 0.3, 4); O.stackR = D.shoeBoxes(g, 1.55, FL, -0.75, -0.2, 4); O.stackR.userData.noBake = true; O.fax.userData.paper.userData.noBake = true;
      O.offFall = D.brickBurst(g, 18, ["#c8102e", "#f4f2ec", "#2f5fa8", "#f28c28", "#1b1b1b"], ["3004", "3023", "3004"], 0.0173 * 1.1);
      D.plant(g, 3.6, -2.9, 1.3); D.floorLamp(g, 3.3, 0.6, "#ffe0b0", 1.0);
      D.fluoro(g, 0, FL + 3.96, -0.4, 2.4, 1.2);
      // the floor patch in front of the desk that drops out on "fell out" (tiles + a black hole + a burst of floor tiles)
      O.floorTiles = []; for (let a = 0; a < 3; a++) for (let b = 0; b < 2; b++) { const t2 = PK.grp(g, -0.6 + a * 0.6, FL - 0.06, -0.1 + b * 0.6); t2.userData.noBake = true; PK.brick(t2, "3068b", ["#4f5d6e", "#45525f"][(a + b) % 2], 0, 0, 0, 0, [0.84, 0.5, 0.84]); O.floorTiles.push(t2); }
      { const pit = D.tex(360, 240, (c, Wd, H) => { c.fillStyle = "#2a2d33"; c.fillRect(0, 0, Wd, H); for (let i = 0; i < 18; i++) for (let j = 0; j < 12; j++) { c.fillStyle = "#3a3e46"; c.beginPath(); c.arc(10 + i * 20, 10 + j * 20, 6, 0, 7); c.fill(); c.fillStyle = "#1c1e22"; c.fillRect(13 + i * 20, 13 + j * 20, 3, 3); }
          for (let k = 0; k < 4; k++) { const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#6b4a2e"); gr.addColorStop(1, "#3a2818"); c.fillStyle = gr; c.fillRect(30 + k * 95, 0, 26, H); }
          const rg = c.createRadialGradient(Wd / 2, H / 2, 10, Wd / 2, H / 2, Wd * 0.6); rg.addColorStop(0, "rgba(255,170,90,0.35)"); rg.addColorStop(1, "rgba(0,0,0,0.55)"); c.fillStyle = rg; c.fillRect(0, 0, Wd, H); c.strokeStyle = "#11131a"; c.lineWidth = 10; c.strokeRect(0, 0, Wd, H); });
        O.floorHole = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2), new THREE.MeshBasicMaterial({ map: pit, toneMapped: true })); O.floorHole.rotation.x = -Math.PI / 2; O.floorHole.position.set(0, FL + 0.004, 0.2); O.floorHole.visible = false; g.add(O.floorHole);
        O.holeLight = new THREE.PointLight("#ffaa5a", 0, 3, 1.6); O.holeLight.position.set(0, FL + 0.15, 0.2); g.add(O.holeLight); }
      O.floorBurst = D.brickBurst(g, 16, ["#3e5a86", "#4f5d6e", "#2f4a70"], ["3068b", "3023", "3024", "3069b"], 0.0175 * 0.8);
      { const l = new THREE.PointLight("#ffd8a8", 1.2, 6, 1.6); l.position.set(-0.4, FL + 2.2, 0.6); g.add(l); O.offKey = l; }
      extra("OFFICE", { kind: "shirt", top: "#9ec1e0", legs: "#3a3f47", tie: "#7a1f2a", hair: "#2a1a10", hairStyle: "bob", lips: "#a8434a", lashes: true, skin: K.SKIN.medium },
        { x: -2.75, z: -1.35, ry: 0.75, face: "neutral", gesture: "hold" }, [["R", PK.acc.paper(), 0, 0, 0.02]], (t) => ({ hy: 0.3 * Math.sin(t * 0.9), nod: 0.05 * Math.sin(t * 1.7) }));
      PK.bake(g); }

    // ================================================================ TRADE (trading floor)
    { const g = W.TRADE = grp();
      D.tileFloor(g, 10, 8, "#2a2f3a", "#323846", 0.7, true);
      const cols = ["#1d2b44", "#22324f", "#1a2740"];
      D.wallBack(g, cols, -5, 5, -3.6, 10); D.wallSide(g, cols, -5, -3.6, 4.4, 10, -1); D.wallSide(g, cols, 5, -3.6, 4.4, 10, 1);
      D.ceiling(g, 10, 8, FL + 4.8, "#11151c");
      O.tradeTicker = D.ticker(g, 0, FL + 3.35, -3.33, 0, 6.4, 0.44, [{ t: ".COM UP" }, { t: "TECH UP", c: "#c8ff3e" }, { t: "BUY BUY" }, { t: "WEB UP", c: "#c8ff3e" }, { t: "IPO UP" }]);
      O.tradeTickerRed = D.ticker(g, 0, FL + 3.35, -3.32, 0, 6.4, 0.44, [{ t: ".COM DOWN", c: "#ff4a3a" }, { t: "SELL", c: "#ff8a3a" }, { t: "TECH DOWN", c: "#ff4a3a" }, { t: "SELL", c: "#ff8a3a" }]);
      D.clockRow(g, 0, FL + 4.25, -3.3, ["NY", "LDN", "TKY", "HK"]);
      // TECH INDEX painter: crash = 0 rising lime line; crash 0..1 = the line rolls over and falls off a cliff in red
      const idx = (crash) => (c, Wd, H) => { c.fillStyle = crash > 0 ? "#1a0b10" : "#0b1424"; c.fillRect(0, 0, Wd, H); c.strokeStyle = "rgba(120,180,255,0.15)"; c.lineWidth = 2; for (let x = 0; x < Wd; x += 32) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
        const pts = []; for (let i = 0; i <= 20; i++) pts.push([20 + i * (Wd - 40) / 20, H - 30 - Math.pow(i / 20, 2.2) * (H - 70) - 10 * Math.sin(i * 1.7)]);
        if (crash > 0) { for (let i = 14; i <= 20; i++) { const u = (i - 14) / 6; pts[i][1] = pts[14][1] + (H - 40 - pts[14][1]) * Math.min(1, crash * 1.4) * u * u * (3 - 2 * u); } }
        c.strokeStyle = crash > 0 ? "#ff4a3a" : "#c8ff3e"; c.lineWidth = 6; c.beginPath(); pts.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.stroke();
        c.fillStyle = "#fff"; c.font = "900 30px Arial Black, Arial"; c.fillText("TECH INDEX", 20, 40); if (crash > 0.3) { c.fillStyle = "#ff4a3a"; c.font = "900 44px Arial Black, Arial"; c.fillText("\u25BC", Wd - 70, 46); } };
      O.idxDraw = idx; O.tradeScr = D.screen(g, 2.2, 1.0, idx(0), 0, FL + 2.25, -3.3, 0, 512, 0.95); O.idxKey = "0";
      for (const sx of [-1, 1]) D.screen(g, 1.0, 0.7, (c, Wd, H) => { c.fillStyle = "#0b1424"; c.fillRect(0, 0, Wd, H); for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? "#c8ff3e" : "#5fd0ff"; c.fillRect(16, 16 + i * 30, 60 + rnd(i * 3 + sx) * 140, 14); } }, sx * 2.3, FL + 2.3, -3.3, 0, 256, 0.85);
      // trading desks (CRT backs to camera, traders face us)
      O.tradeDesks = [];
      for (const [x, z] of [[-1.5, -2.25], [0.0, -2.35], [1.5, -2.25]]) { D.desk(g, x, FL, z, 0, 1.4, 0.8, "#3a3d42"); const top = FL + 0.81;
        D.crt(g, x - 0.35, top, z - 0.1, Math.PI + 0.15, { s: 0.68, draw: crtDraw("BUY") }); D.crt(g, x + 0.35, top, z - 0.1, Math.PI - 0.15, { s: 0.68, draw: crtDraw("SELL") }); D.deskPhone(g, x, top, z + 0.2, 0, "#1b1b1b"); }
      O.jar = D.moneyJar(g, 0, FL, -0.35);
      O.profitB = D.labelBrick(g, "PROFITS?", "#f2cd37", "#111316", 0.42); O.profitB.position.set(-0.95, FL, 0.55); O.profitB.rotation.y = 0.35;
      for (let i = 0; i < 8; i++) { const a = rnd(i * 3) * 6.28, r = 1.2 + rnd(i * 5) * 1.6; PK.brick(g, i % 3 ? "3070b" : "3069b", i % 4 ? "#f4f2ec" : "#f2cd37", Math.sin(a) * r * 1.4, FL, -1.2 + Math.cos(a) * r * 0.4, a, [1, 0.35, 1]); }
      PK.tvCart(g, -2.6, FL, -1.2, 0.5); PK.vendingMachine(g, 3.2, FL, -2.9, -0.3, { col: "#1d5a9a" });
      PK.floorCables(g, [["#1b1b1b", [[-2.6, -1.0], [-1.6, -1.6], [-0.4, -1.8], [1.0, -1.7], [2.4, -1.9]]]], FL);
      PK.pottedPalm(g, -3.4, FL, -2.9, 0.4, { s: 0.85 });
      for (const x of [-2.4, 0, 2.4]) D.fluoro(g, x, FL + 4.76, -1.2, 1.8, 0.9);
      { const l = new THREE.PointLight("#ffd8a8", 1.4, 7, 1.6); l.position.set(0, FL + 2.6, 1.2); g.add(l); }
      PK.bake(g); }

    D.__W = W; D.__O = O;
    const api = { W, O, extra, crtDraw };
    window.DCSETS.more.forEach((fn) => fn(ctx, K, X, PK, D, api));
    return api;
  }
  window.DCSETS = { build, more: [] };
})();

/* ---------------------------------------------------------------- BELL (exchange podium) + MOUNT (index mountain) */
DCSETS.more.push(function (ctx, K, X, PK, D, A) {
  const THREE = ctx.THREE, FL = K.FL, { W, O, extra } = A, rnd = D.rnd, { M, glowM, grp, bx, rbx, cyl, noShadow } = D;
  // ================================================================ BELL
  { const g = W.BELL = grp();
    D.tileFloor(g, 10, 8, "#d8d2c4", "#c9c2b2", 0.9, true);
    const cols = ["#1f2f52", "#24365c", "#1b2a49"];
    D.wallBack(g, cols, -5, 5, -3.4, 10); D.wallSide(g, cols, -5, -3.4, 4, 10, -1); D.wallSide(g, cols, 5, -3.4, 4, 10, 1);
    D.ceiling(g, 10, 7.4, FL + 5.0, "#141c2c");
    D.brickSign(g, ["EXCHANGE"], "#1b2a49", "#e2c26a", 3.0, 0.62, 0, FL + 4.05, -3.15, 0, { border: "#c9a24a" });
    for (const y of [FL + 0.5, FL + 3.55]) noShadow(bx(g, 9.6, 0.08, 0.06, M("#c9a24a", { metalness: 0.7, roughness: 0.3 }), 0, y, -3.18));
    const RY = FL + 0.36; O.bellRY = RY;
    rbx(g, 5.2, 0.36, 2.6, "#3a2414", 0, FL + 0.18, -1.75, 0, 0.03); D.studs(g, "#3a2414", -2.6, -3.05, 5.2, 2.6, RY, (x, z) => z > -1.1 && Math.abs(x) < 2.4);
    D.rbx(g, 5.0, 0.03, 1.5, "#7a1420", 0, RY + 0.015, -1.55, 0, 0.01); // red carpet on the riser
    for (let i = 0; i <= 8; i++) { const x = -2.5 + i * 0.625; if (Math.abs(x) < 1.3) continue; PK.brick(g, "3062b", "#c9a24a", x, RY, -0.5); PK.brick(g, "3062b", "#c9a24a", x, RY + PK.BH, -0.5); }
    PK.bar(g, [-2.5, RY + 0.86, -0.5], [-1.25, RY + 0.86, -0.5], 0.035, PK.GOLD()); PK.bar(g, [1.25, RY + 0.86, -0.5], [2.5, RY + 0.86, -0.5], 0.035, PK.GOLD());
    O.bell = D.bell(g, -1.05, RY, -1.75, 0.3);
    D.lectern(g, 0.45, RY, -1.55, 0, "LISTED", "#1b2a49");
    const brd = (mode) => (c, Wd, H) => { const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#0e1726"); gr.addColorStop(1, "#1d2f4a"); c.fillStyle = gr; c.fillRect(0, 0, Wd, H); c.textAlign = "center";
      c.fillStyle = "#2f8fd0"; c.fillRect(0, 0, Wd, H * 0.2); c.fillStyle = "#fff"; c.font = "900 " + Math.round(H * 0.12) + "px Arial Black, Arial";
      if (mode.indexOf("b0") === 0) { c.fillText("FEB 2000 · NEW LISTING", Wd / 2, H * 0.15); c.fillStyle = "#9fd8ff"; c.font = "900 " + Math.round(H * 0.17) + "px Arial Black, Arial"; c.textAlign = "left"; c.fillText("PRICING" + ".".repeat(+mode.slice(3) || 3), Wd * 0.2, H * 0.6); return; }
      if (mode === "b") { c.fillText("FEB 2000 · NEW LISTING", Wd / 2, H * 0.15); c.fillStyle = "#c8ff3e"; c.font = "900 " + Math.round(H * 0.42) + "px Arial Black, Arial"; c.fillText("$11", Wd / 2, H * 0.66); c.fillStyle = "#9fd8ff"; c.font = "900 " + Math.round(H * 0.11) + "px Arial Black, Arial"; c.fillText("A SHARE", Wd / 2, H * 0.86); return; }
      c.fillText("NOV 1998 · FIRST DAY", Wd / 2, H * 0.15); if (mode === "a0") { c.fillStyle = "#9fd8ff"; c.font = "900 " + Math.round(H * 0.16) + "px Arial Black, Arial"; c.fillText("TRADING OPENS", Wd / 2, H * 0.55); return; }
      c.fillStyle = "#c8ff3e"; c.font = "900 " + Math.round(H * 0.36) + "px Arial Black, Arial"; c.fillText("+606%", Wd / 2, H * 0.62); c.fillStyle = "#fff"; c.font = "900 " + Math.round(H * 0.1) + "px Arial Black, Arial"; c.fillText("ON DAY ONE", Wd / 2, H * 0.84); };
    O.bellBrd = brd; O.bellScr = D.screen(g, 1.5, 0.75, brd("a0"), -1.05, FL + 2.9, -3.12, 0, 768, 1.0); O.bellMode = "a0";
    // brick bar for the first-day jump: up to 9 real 2x2 bricks
    O.jumpBar = grp(g, 1.05, RY, -1.9); { const geo = PK.part("3003"), m = M("#3fa34d", { roughness: 0.35, clearcoat: 0.4 }); O.jumpB = []; for (let i = 0; i < 9; i++) { const b = new THREE.Mesh(geo, m); b.castShadow = b.receiveShadow = true; O.jumpBar.add(b); O.jumpB.push(b); } }
    O.jumpSign = D.brickSign(g, ["+606%"], "#1b1b1b", "#c8ff3e", 0.9, 0.34, 1.05, 0, -1.9, -0.15);
    O.priceBrick = D.labelBrick(g, "$11", "#c8ff3e", "#111316", 0.5); O.priceBrick.position.set(1.05, RY, -1.9); O.priceBrick.rotation.y = -0.25;
    O.bellConf = D.confetti(g, 90, ["#e8382b", "#f2cd37", "#2f8fd0", "#3fa34d", "#ffffff", "#ff6b4a"]); O.bellConf2 = D.confetti(g, 90, ["#f2cd37", "#2f8fd0", "#ffffff", "#e8382b", "#3fa34d", "#c8ff3e"]);
    O.cannons = [D.cannon(g, -2.15, RY, -1.0, -1.17, 0.5, "#c8102e"), D.cannon(g, 2.25, RY, -1.0, 1.17, 0.5, "#2f5fa8")];
    O.bellPuff = D.dustPuffs(g, "#d8d0c0", 0.3);
    PK.flagStand(g, -2.25, RY, -2.6, 0, { h: 2.6, ncol: 3, nrow: 3, cols: ["#1f3a6f", "#f4f2ec", "#c8102e"] });
    PK.flagStand(g, 2.25, RY, -2.6, 0, { h: 2.6, ncol: 3, nrow: 3, cols: ["#c9a24a", "#1f3a6f", "#c9a24a"] });
    PK.balloonBunch(g, -1.85, RY, -2.75); PK.balloonBunch(g, 2.0, RY, -2.8, { cols: ["#2f8fd0", "#f4f2ec", "#c8ff3e", "#f2cd37", "#e8382b"] });
    PK.pressCamera(g, 1.9, FL, 0.9, Math.PI - 0.35);
    PK.ropeBarrier(g, [[-2.8, 0.15], [-1.9, 0.15], [-1.0, 0.15]], FL);
    PK.speakerStack(g, -3.6, FL, -2.0, 0.4, { single: true });
    for (const x of [-1.6, 0, 1.6]) { const s = D.spot(g, x, FL + 4.7, -0.6, "#fff1d6", 1.3); }
    extra("BELL", { kind: "jacket", top: "#3d3a35", under: "#f2efe6", legs: "#2e4a7a", hair: "#c9a26b", hairStyle: "ponytail", lips: "#b0303a", lashes: true },
      { x: -1.75, z: 0.55, ry: Math.PI * 0.82, face: "smile", aR: -1.45, eR: -0.9, aL: -1.3, eL: -1.0 }, [["R", PK.acc.camera(), 0, 0, 0.02]], (t) => ({ hy: 0.15 * Math.sin(t * 1.3) }));
    PK.bake(g); }

  // ================================================================ MOUNT (the index mountain: brick bars on a baseplate at dusk)
  { const g = W.MOUNT = grp(); X.sky(g, { zenith: "#22305e", mid: "#7a6a9e", horizon: "#ffb27a", ground: "#3a3040", sunDir: [-0.6, 0.12, -0.8], sunColor: "#ffb070", sunSize: 0.9, haze: 0.8, clouds: 0.3, cloudColor: "#ffd2b0", cloudShade: "#5a4a6a" });
    { const pt = D.tex(256, 256, (c, Wd, H) => { c.fillStyle = "#5e554a"; c.fillRect(0, 0, Wd, H); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { c.fillStyle = ["#b8a888", "#ad9d7e", "#c2b394"][(i * 3 + j * 5) % 3]; c.fillRect(i * 64 + 3, j * 64 + 3, 58, 58); c.fillStyle = "rgba(255,255,255,0.08)"; c.fillRect(i * 64 + 3, j * 64 + 3, 58, 5); } });
      pt.wrapS = pt.wrapT = THREE.RepeatWrapping; pt.repeat.set(60, 45); const pl = new THREE.Mesh(new THREE.PlaneGeometry(160, 120), new THREE.MeshStandardMaterial({ map: pt, roughness: 0.85 })); pl.rotation.x = -Math.PI / 2; pl.position.set(0, 0.0, -30); pl.receiveShadow = true; g.add(pl); }
    rbx(g, 18.6, 0.16, 9.0, "#3a7a3e", 0.4, 0.08, 0.5, 0, 0.03); D.studs(g, "#3a7a3e", -8.9, -4.0, 18.6, 9.0, 0.16, (x, z) => (z > -2.0 && z < -1.0 && x > -8.0 && x < 8.0) || (z > -0.95 && z < -0.55 && x > -8.0 && x < 8.0));
    O.MY = 0.16; const YEARS = []; for (let y = 1996; y <= 2015; y++) YEARS.push(y);
    const LV = [1.29, 1.57, 2.19, 4.07, 5.05, 1.95, 1.11, 2.0, 2.18, 2.2, 2.42, 2.65, 1.58, 2.27, 2.65, 2.6, 3.02, 4.18, 4.74, 5.05];
    O.years = YEARS; O.levels = LV; O.barN = LV.map((v) => Math.max(1, Math.round(v * 2.4))); O.barX = YEARS.map((y, i) => -7.6 + i * 0.8); O.barZ = -1.5;
    const geo = PK.part("3003");
    const mats = { up: M("#3fa34d", { roughness: 0.35, clearcoat: 0.4 }), peak: M("#f2cd37", { roughness: 0.3, clearcoat: 0.5 }), down: M("#c8102e", { roughness: 0.35, clearcoat: 0.4 }), back: M("#2f8fd0", { roughness: 0.35, clearcoat: 0.4 }), gold: M("#f2cd37", { roughness: 0.3, clearcoat: 0.5, emissive: new THREE.Color("#f2cd37"), emissiveIntensity: 0.15 }) };
    O.barIM = {}; for (const k in mats) { const im = new THREE.InstancedMesh(geo, mats[k], 260); im.castShadow = im.receiveShadow = true; im.frustumCulled = false; im.count = 0; g.add(im); O.barIM[k] = im; }
    // the peak bar's top bricks become separate solid bricks when it collapses (scene.js animates them)
    O.collapse = []; for (let i = 0; i < 12; i++) { const b = new THREE.Mesh(geo, mats.peak); b.castShadow = b.receiveShadow = true; b.visible = false; b.scale.setScalar(0.8); g.add(b); O.collapse.push(b); }
    O.chips = D.brickBurst(g, 18, ["#f2cd37", "#e2b827", "#f4f2ec"], ["6141", "6141", "3024"], 0.0175);
    // the old-peak line: a glowing rope of 1x1 round plates from 2000 to 2015 at the peak height
    O.peakLine = grp(g, 0, O.MY + O.barN[4] * 0.42 + 0.05, O.barZ); { const pg = X.ld("6141", 0.0175) || new THREE.CylinderGeometry(0.17, 0.17, 0.14, 12), pm = glowM("#ffd86a", 1.6), n = 76, im = new THREE.InstancedMesh(pg, pm, n), mm = new THREE.Matrix4();
      for (let i = 0; i < n; i++) im.setMatrixAt(i, mm.makeTranslation(O.barX[4] + i * (O.barX[19] - O.barX[4]) / (n - 1), 0, 0)); im.frustumCulled = false; O.peakLine.add(im); }
    // year tiles in front of each bar
    YEARS.forEach((y, i) => { const tm = D.canvasMat(128, 64, (c, Wd, H) => { c.fillStyle = "#f4f2ec"; c.fillRect(0, 0, Wd, H); c.fillStyle = y === 2000 ? "#c8102e" : "#1b1b1b"; c.font = "900 40px Arial Black, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(String(y), Wd / 2, H / 2 + 2); });
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.06, 0.33), [M("#f4f2ec"), M("#f4f2ec"), tm, M("#f4f2ec"), M("#f4f2ec"), M("#f4f2ec")]); t.position.set(O.barX[i], O.MY + 0.03, O.barZ + 0.75); t.castShadow = true; g.add(t); });
    // summit flag (planted on the 2000 bar) + boombox with rising note plates
    O.flag = grp(g, 0, 0, 0); O.flag.userData.noBake = true; { PK.bar(O.flag, [0, 0, 0], [0, 1.3, 0], 0.025, PK.MET()); for (let c = 0; c < 3; c++) for (let r = 0; r < 2; r++) PK.brick(O.flag, "3024", (c + r) % 2 ? "#c8102e" : "#f4f2ec", 0.18 + c * 0.35, 1.05 - r * 0.35, 0, Math.PI / 2, [1, 0.4, 1]).rotation.set(Math.PI / 2, 0, 0); }
    O.boom = grp(g, 0, 0, 0); O.boom.userData.noBake = true; { const bb = O.boom; rbx(bb, 0.52, 0.28, 0.18, "#2b2b2b", 0, 0.14, 0, 0, 0.03); for (const sx of [-0.15, 0.15]) { cyl(bb, 0.09, 0.09, 0.03, M("#5a5f66"), sx, 0.14, 0.09, 16).rotation.x = Math.PI / 2; } bx(bb, 0.4, 0.03, 0.03, M("#c3c8ce"), 0, 0.31, 0); }
    O.notes = D.confetti(g, 24, ["#c8ff3e", "#f2cd37", "#ff6b4a"]);
    O.mtPuff = D.dustPuffs(g, "#d9d1c4", 0.35); O.mtFall = D.brickBurst(g, 22, ["#f2cd37", "#e2b827"], ["3003", "3003", "3004"], 0.0175);
    // background + dressing: skyline, flood poles, trees, cones, ladder, cable spool
    D.skyline(g, { z: -26, x0: -28, x1: 28, n: 12, fMin: 5, fMax: 16, seed: 9, rows: 2, lit: 0.72, street: false });
    for (const x of [-11.5, -9.6, 4.6, 9.5]) D.lampPost(g, x, -4.6, 4.2, 1.5);
    PK.taxi(g, -11.6, 0, 1.5, 0.3); PK.taxi(g, 12.2, 0, 0.6, -0.4); PK.newspaperBox(g, -9.4, 0, 2.6, 0.4, { col: "#2f5fa8", title: "DAILY", head: "NASDAQ!" }); PK.newspaperBox(g, 9.6, 0, 2.4, -0.3, { col: "#c8102e", title: "DAILY", head: "DOT-COMS" });
    PK.ticketBooth(g, 11.0, 0, -2.6, -0.5);
    for (const x of [-10.5, -8.6, 8.8, 10.6, -6.2, 6.4]) D.tree(g, x, -6.5 - (x > 0 ? 0.4 : 0), 1.1);
    PK.stageLadder(g, O.barX[0] - 0.7, O.MY, O.barZ + 0.1, -Math.PI / 2 + 0.2, { n: 7, lean: 0.28 });
    PK.cableSpool(g, O.barX[1] - 0.2, O.MY, O.barZ + 1.3, 0.5, { col: "#f2cd37" });
    for (const [x, z] of [[-6.8, 1.4], [9.0, 1.5], [9.6, 1.1]]) PK.trafficCone(g, x, O.MY, z, x);
    for (const [x, z] of [[-5.2, 2.6], [1.2, 3.0], [6.4, 2.7]]) PK.hedge(g, x, O.MY, z, 0, { n: 2, rows: 1, box: "#5a5f66", flowers: ["#f2cd37", "#f4f2ec", "#e8382b"] });
    PK.ropeBarrier(g, [[-8.0, 1.9], [-4.0, 1.9], [0.0, 1.9], [4.0, 1.9], [8.0, 1.9]], O.MY);
    for (const [x, z, ry, top, gs, acc] of [[-9.6, 0.9, 0.5, "#2f5fa8", "cheer", "paper"], [-9.0, 1.4, 0.2, "#c8102e", "point", null], [9.9, 0.9, -0.4, "#3fa34d", "cheer", "phone"], [10.6, 1.6, -0.6, "#f2cd37", "wave", "paper"]])
      extra("MOUNT", { kind: "jacket", top, under: "#f4f4f4", legs: "#2a2a30", hair: ["#1c1410", "#7a4e2e", "#c9a26b", "#2a1a10"][Math.round(Math.abs(x)) % 4], hairStyle: ["short", "bob", "curly", "slick"][Math.round(Math.abs(x)) % 4], skin: [K.SKIN.light, K.SKIN.tan, K.SKIN.dark, K.SKIN.medium][Math.round(Math.abs(x)) % 4], badge: true },
        { x, y: O.MY, z, ry, face: "grin", gesture: gs }, acc ? [["R", PK.acc[acc](), 0, 0, 0.02]] : [], (t) => ({ hy: 0.4 * Math.sin(t * 1.1 + x), nod: 0.06 * Math.sin(t * 2.3 + x) }));
    PK.hedge(g, -3.6, O.MY, 0.95, 0, { n: 2, rows: 1, flowers: ["#f2cd37", "#f4f2ec"] }); PK.hedge(g, 4.6, O.MY, 0.95, 0, { n: 2, rows: 1, flowers: ["#e8382b", "#f4f2ec"] });
    PK.roadCase(g, 9.8, O.MY, -0.2, -0.3, { n: 1 }); PK.barrel(g, -8.4, O.MY, -0.4);
    extra("MOUNT", { kind: "jacket", top: "#7a4e2e", under: "#f4f2ec", legs: "#2a2a30", hair: "#1c1410", hairStyle: "curly", skin: K.SKIN.tan, hat: "hardhat", hatColor: "#f2cd37" },
      { x: O.barX[0] + 0.1, y: O.MY, z: O.barZ + 1.0, ry: 0.4, face: "smile", gesture: "point" }, [], (t) => ({ hy: 0.25 * Math.sin(t * 0.8), aR: -1.5 + 0.2 * Math.sin(t * 1.4) }));
    PK.bake(g); }
});

/* ---------------------------------------------------------------- WARE (pet-food warehouse) + STREET (free shipping) + STADIUM */
DCSETS.more.push(function (ctx, K, X, PK, D, A) {
  const THREE = ctx.THREE, FL = K.FL, { W, O, extra } = A, rnd = D.rnd, { M, glowM, grp, bx, rbx, cyl, noShadow } = D;
  // ================================================================ WARE
  { const g = W.WARE = grp();
    D.tileFloor(g, 12, 9, "#8d8a84", "#83807a", 1.4, false);
    const cols = ["#8a5a48", "#7d5040", "#94634f"];
    D.wallBack(g, cols, -6, 6, -4.2, 11, (r, x) => r <= 5 && x > 5.8 && x < 8.6);
    D.wallSide(g, cols, -6, -4.2, 4.5, 11, -1); D.wallSide(g, cols, 6, -4.2, 4.5, 11, 1);
    D.ceiling(g, 12, 9, FL + 5.3, "#3a3d42");
    for (let i = 0; i < 6; i++) noShadow(bx(g, 12, 0.14, 0.14, M("#5a5f66", { metalness: 0.6 }), 0, FL + 5.1, -3.6 + i * 1.4));
    O.door = D.rollerDoor(g, 1.2, FL, -4.05, 2.3, 2.4, "#9aa0a6"); D.setDoor(O.door, 0);
    { const lot = grp(g, 1.2, 0, -6); D.bx(lot, 6, 0.05, 4, M("#55585e"), 0, 0.02, 0); D.lampPost(lot, -1.2, -1.0, 3.2, 1.6); D.brickVan(lot, 0.42, 0, -0.6, 0, { text: "FREE SHIPPING", stripe: "#e36a1b", col: "#f4f2ec", textY: 5.0, textH: 0.42 }).scale.setScalar(0.8); }
    O.petsSign = D.brickSign(g, ["PETS"], "#1d3a6a", "#f2cd37", 1.4, 0.5, -0.35, FL + 3.0, -3.9, 0, { glow: 0.0, border: "#f2cd37" });
    O.rackL = D.rack(g, -2.75, FL, -3.3, 0, 3); D.rack(g, 3.9, FL, -3.3, 0, 3);
    O.cv = D.conveyor(g, -3.4, FL, -0.8, Math.PI / 2, 4.4);
    O.pal1 = D.pallet(g, -1.15, FL, -2.1, 0.2, 2, 2); D.priceTag(g, -1.15 + 0.5, FL + 1.25, -1.7, 0.2, "LOSS");
    O.pal2 = D.pallet(g, 1.0, FL, -2.6, -0.25, 3, 2); D.priceTag(g, 0.35, FL + 1.15, -2.3, -0.25, "LOSS");
    O.fork = D.forklift(g, -2.1, FL, -2.4, Math.PI / 2 + 0.55); O.fork.userData.noBake = true; O.forkPal = D.pallet(O.fork.userData.forks, 0, 0.04, 0.4, 0, 1, 2);
    O.scale = D.scale(g, 0.85, FL, -1.0, -0.3); O.scale.scale.setScalar(0.56); D.setScale(O.scale, 0);
    { const [pa, pb] = O.scale.userData.pans, gm = PK.GOLD(), cg = X.ld("6141", 0.0175);
      for (let i = 0; i < 12; i++) { const m = new THREE.Mesh(cg, gm); m.position.set(-0.1 + (i % 2) * 0.2, -0.88 + Math.floor(i / 2) * 0.06, (i % 3 - 1) * 0.12); pa.add(m); }
      O.panBag = D.petBag(pa, 0.1, -0.88, -0.08, 0.3, 0.7); O.panBag.userData.noBake = true; for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(cg, gm); m.position.set(0, -0.88 + i * 0.06, 0); pb.add(m); }
      O.signPaid = D.brickSign(pa, ["PAID"], "#1b1b1b", "#ffffff", 0.84, 0.3, 0, -1.02, 0.5, 0, { noStuds: true });
      O.signSold = D.brickSign(pb, ["SOLD FOR"], "#1b1b1b", "#ff6b4a", 0.96, 0.3, 0, -1.02, 0.5, 0, { noStuds: true }); }
    PK.barrel(g, -3.4, FL, -3.4); PK.barrel(g, -2.95, FL, -3.7, 0, { col: "#2f5fa8" });
    PK.trafficCone(g, -3.0, FL, 1.2, 0.4);
    for (let i = 0; i < 14; i++) PK.brick(g, "3069b", i % 2 ? "#1b1b1b" : "#f2cd37", -4.2 + i * 0.7, FL, 0.35, 0, [1, 0.4, 0.6]);
    { const sw = D.pallet(g, 2.6, FL, 1.3, -0.4, 2, 2); const wrap = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.95, 0.9), new THREE.MeshPhysicalMaterial({ color: "#e8f2ff", roughness: 0.15, transparent: true, opacity: 0.22, clearcoat: 1, depthWrite: false })); wrap.position.set(0, 0.68, 0.39); sw.add(wrap); }
    { const pm = D.canvasMat(256, 340, (c, Wd, H) => { c.fillStyle = "#1d3a6a"; c.fillRect(0, 0, Wd, H); c.fillStyle = "#f2cd37"; c.font = "900 40px Arial Black, Arial"; c.textAlign = "center"; c.fillText("PETS", Wd / 2, 50);
        const u = 2.2, cx = 110; c.fillStyle = "#f2efe8"; c.fillRect(cx - 24 * u / 2, 270, 24 * u, 40); c.fillStyle = "#c8102e"; c.fillRect(cx - 24 * u / 2, 280, 24 * u, 7); c.fillRect(cx - 24 * u / 2, 295, 24 * u, 7);
        c.fillStyle = "#a8a39a"; c.fillRect(cx - 22, 150, 44, 122); c.beginPath(); c.ellipse(cx + 30, 140, 64, 34, 0, 0, 7); c.fill(); c.fillStyle = "#b0142a"; c.beginPath(); c.moveTo(cx, 158); c.lineTo(cx + 92, 150); c.lineTo(cx + 88, 178); c.lineTo(cx + 4, 168); c.fill();
        for (const ex of [18, 52]) { c.fillStyle = "#fff"; c.beginPath(); c.arc(cx + ex, 118, 13, 0, 7); c.fill(); c.fillStyle = "#111"; c.beginPath(); c.arc(cx + ex + 2, 118, 7, 0, 7); c.fill(); } });
      const pst = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.2), pm); pst.position.set(-5.2, FL + 2.2, -3.9); g.add(pst); }
    O.warePile = D.bagPile(g, -1.9, FL, 0.45, 7, 3);
    for (let i = 0; i < 4; i++) D.pendant(g, -3 + i * 2, FL + 5.3, -1.0, "#ffd9a0", 1.4);
    { const l = new THREE.PointLight("#ffe0b8", 1.5, 7, 1.6); l.position.set(0.5, FL + 2.6, 1.4); g.add(l); }
    extra("WARE", { kind: "vest", top: "#f28c28", under: "#3a3f47", label: "PETS", labelColor: "#1b1b1b", legs: "#2a2a30", hair: "#5a3a20", hairStyle: "short", skin: K.SKIN.dark, hat: "hardhat", hatColor: "#f2cd37" },
      { x: -2.6, z: -2.0, ry: 0.65, face: "neutral", gesture: "hold" }, [["R", PK.acc.clipboard(), 0, 0, 0.02]], (t) => ({ hy: 0.35 * Math.sin(t * 0.7), nod: 0.06 + 0.04 * Math.sin(t * 2.1) }));
    PK.bake(g); }

  // ================================================================ STREET (golden hour, the FREE SHIPPING van)
  { const g = W.STREET = grp(); X.sky(g, "golden");
    X.ground(g, { size: 300, studs: false, colors: ["#55585e", "#4c4f55", "#5e6168"], kind: "concrete", seed: 4, repeat: 30 });
    { const st = D.tex(256, 256, (c, Wd, H) => { c.fillStyle = "#a6a39c"; c.fillRect(0, 0, Wd, H); c.strokeStyle = "rgba(0,0,0,0.3)"; c.lineWidth = 3; for (let i = 0; i <= 4; i++) { c.beginPath(); c.moveTo(i * 64, 0); c.lineTo(i * 64, H); c.stroke(); c.beginPath(); c.moveTo(0, i * 64); c.lineTo(Wd, i * 64); c.stroke(); } });
      st.wrapS = st.wrapT = THREE.RepeatWrapping; st.repeat.set(30 / 1.4, 7.4 / 1.4); bx(g, 30, FL, 7.4, M("#ffffff", { map: st, roughness: 0.6, clearcoat: 0.1 }), 0, FL / 2, 2.2); }
    { const sb = PK.grp(g, -1.3, FL, 1.2, 0.35); const sm = D.canvasMat(200, 260, (c, Wd, H) => { c.fillStyle = "#1b1b1b"; c.fillRect(0, 0, Wd, H); c.fillStyle = "#f2cd37"; c.font = "900 38px Arial Black, Arial"; c.textAlign = "center"; c.fillText("FREE", Wd / 2, 90); c.fillText("SHIPPING", Wd / 2, 140); c.fillStyle = "#e36a1b"; c.fillRect(30, 170, Wd - 60, 12); });
      for (const sg of [1, -1]) { const pnl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.66, 0.03), [M("#3a2a1a"), M("#3a2a1a"), M("#3a2a1a"), M("#3a2a1a"), sg > 0 ? sm : M("#3a2a1a"), sg < 0 ? sm : M("#3a2a1a")]); pnl.position.set(0, 0.33, sg * 0.12); pnl.rotation.x = sg * 0.2; pnl.castShadow = true; sb.add(pnl); } }
    D.bagPile(g, 2.1, FL, 1.9, 3, 7); D.lampPost(g, -2.7, 2.6, 3.6, 1.6); PK.newspaperBox(g, 2.9, FL, 2.4, -0.4, { col: "#2f5fa8", title: "DAILY", head: "FREE SHIP!" }); PK.bicycle(g, -1.9, FL, 2.9, 0.3, { col: "#c8102e" });
    bx(g, 30, 0.14, 0.2, M("#b8b4ac"), 0, 0.07, -1.5);
    for (let i = 0; i < 10; i++) bx(g, 1.2, 0.012, 0.16, M("#f2f0e6"), -12 + i * 2.8, 0.01, -4.6);
    O.van = D.brickVan(g, -0.9, 0, -2.75, Math.PI, { text: "FREE SHIPPING", stripe: "#e36a1b", col: "#f4f2ec", textY: 4.75, textH: 0.42, lights: true }); O.van.userData.noBake = true;
    // across the road: low brick shopfronts with lit windows and awnings (brick towers), far skyline
    for (let i = 0; i < 6; i++) { const x = -9 + i * 3.6; D.tower(g, x, -10.5, { w: 3.2, d: 3, floors: 2 + (i % 3), col: ["#b9a089", "#8a5a48", "#c9c2b4", "#7d6a5a"][i % 4], lit: 0.7, seed: 40 + i, fh: 1.1, crown: i % 2 ? "tank" : "flat" }); rbx(g, 3.0, 0.1, 0.9, ["#c8102e", "#2f5fa8", "#3fa34d"][i % 3], x, 1.35, -8.6, 0, 0.02); }
    D.towersFlush(g); D.skyline(g, { z: -26, x0: -24, x1: 24, n: 10, fMin: 6, fMax: 16, seed: 21, rows: 1, lit: 0.4, street: false });
    O.streetPile = grp(g, 0.05, FL, -1.55); O.pileBags = []; for (let i = 0; i < 12; i++) { const lay = i < 6 ? 0 : 1, idx = i < 6 ? i : i - 6, nl = 6, b = D.petBag(O.streetPile, 0, 0, 0, 0, 0.9); b.rotation.x = -Math.PI / 2; b.userData.home = [(idx - (nl - 1) / 2) * 0.62 + lay * 0.2, 0, 0.12 + lay * 0.48, (rnd(i + 9) - 0.5) * 0.12]; O.pileBags.push(b); }
    O.truck = D.handTruck(g, -0.3, FL, -1.05, -Math.PI / 2 + 0.25, 2); O.truck.userData.noBake = true;
    O.leak = D.brickBurst(g, 16, ["#f2cd37", "#e2b827"], ["6141", "4073", "6141"], 0.0175);
    D.mailbox(g, 2.6, FL, 0.35, -0.2); { const hy = PK.grp(g, -1.9, FL, 0.6); PK.brick(hy, "3941", "#c8102e", 0, 0, 0, 0, [0.6, 1, 0.6]); PK.brick(hy, "3062b", "#c8102e", 0, PK.BH, 0, 0, [1.1, 0.6, 1.1]); PK.brick(hy, "4073", "#f2cd37", 0, PK.BH * 1.6, 0, 0, 1.3); for (const sx of [-1, 1]) PK.mesh(hy, PK.cylG(0.05, 0.05, 0.12, 10), "#f2cd37", sx * 0.24, 0.26, 0, 0, 0, Math.PI / 2); } PK.newspaperBox(g, -2.35, FL, 0.1, 0.3, { col: "#c8102e", title: "DAILY", head: "WEB BOOM" });
    D.lampPost(g, 2.7, -1.0, 3.6, 2.0); D.lampPost(g, -3.6, -1.0, 3.6, false);
    PK.pigeons(g, [[-1.3, FL, 0.6, 0.4], [-1.0, FL, 0.95, 2.2], [-1.6, FL, 1.1, -0.8]]);
    PK.hedge(g, 3.6, FL, 0.6, 0, { n: 2, rows: 1, box: "#8d8a84", flowers: ["#e8382b", "#f2cd37"] });
    PK.bicycle(g, -3.2, FL, -0.6, 0.2, { col: "#2f5fa8" }); PK.trafficCone(g, 2.3, FL, -1.2, 0.3);
    D.tree(g, -5.0, -0.4, 1.15); D.tree(g, 5.2, -0.5, 1.1);
    extra("STREET", { kind: "jacket", top: "#5a3a7a", under: "#f4f4f4", legs: "#1f2a44", hair: "#7a5a3a", hairStyle: "bob", lips: "#a8434a", lashes: true },
      { x: -2.85, z: 0.75, ry: 0.5, face: "neutral", gesture: "hold" }, [["R", PK.acc.paper(), 0, 0, 0.02]], (t) => ({ hy: 0.5 + 0.2 * Math.sin(t * 0.8), nod: 0.08 }));
    PK.bake(g); }

  // ================================================================ STADIUM (night game, the sock-puppet ad)
  { const g = W.STADIUM = grp(); X.sky(g, { zenith: "#070d1e", horizon: "#24345a", ground: "#05070b", sunDir: [0.2, -0.3, -1], sunColor: "#9fb8ff", sunSize: 0.0, haze: 0.35, clouds: 0.2, cloudColor: "#2a3550", cloudShade: "#0d1220", stars: 0 });
    const ft = D.tex(512, 512, (c, Wd, H) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#2f7a34" : "#357f3a"; c.fillRect(0, i * 64, Wd, 64); } c.fillStyle = "#f4f2ec"; c.fillRect(0, 0, Wd, 6); c.fillRect(0, 256, Wd, 6); });
    ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(4, 4); bx(g, 40, FL, 40, M("#ffffff", { map: ft, roughness: 0.7, clearcoat: 0 }), 0, FL / 2, -6);
    D.studs(g, "#357f3a", -3, -2.5, 6, 4, FL);
    for (let r = 0; r < 3; r++) { const z = -6.4 - r * 0.9, y = 0.42 * r; }
    O.bleach = D.bleachers(g, 0, 0, -6.2, 18, 7, ["#c8102e", "#f4f2ec", "#2f5fa8"]);
    const ad = (k) => (c, Wd, H) => { c.fillStyle = "#101828"; c.fillRect(0, 0, Wd, H); c.fillStyle = "#f2cd37"; c.fillRect(0, 0, Wd, H * 0.16); c.fillStyle = "#111"; c.textAlign = "center"; c.font = "900 " + Math.round(H * 0.11) + "px Arial Black, Arial"; c.fillText("AD BREAK", Wd / 2, H * 0.12);
      // a generic sock puppet: grey tube with a white striped cuff, bending into the foot (head), red toe, button eyes, hinged mouth
      const u = H / 100, cx = Wd * 0.44; c.fillStyle = "#ece8df"; c.fillRect(cx - 11 * u, 78 * u, 22 * u, 22 * u); c.fillStyle = "#c8102e"; c.fillRect(cx - 11 * u, 83 * u, 22 * u, 3 * u); c.fillRect(cx - 11 * u, 90 * u, 22 * u, 3 * u);
      c.fillStyle = "#9c978e"; c.fillRect(cx - 10 * u, 40 * u, 20 * u, 39 * u); c.beginPath(); c.ellipse(cx + 10 * u, 38 * u, 22 * u, 13 * u, 0, 0, 7); c.fill(); c.beginPath(); c.arc(cx - 6 * u, 40 * u, 10 * u, 0, 7); c.fill();
      c.fillStyle = "#c8102e"; c.beginPath(); c.ellipse(cx + 28 * u, 38 * u, 7 * u, 11 * u, 0, 0, 7); c.fill(); c.beginPath(); c.arc(cx - 10 * u, 44 * u, 7 * u, 0, 7); c.fill();
      c.fillStyle = "#7a0f1c"; c.beginPath(); c.moveTo(cx - 4 * u, 46 * u); c.lineTo(cx + 34 * u, 44 * u); c.lineTo(cx + 32 * u, 46 * u + 9 * u * k); c.lineTo(cx - 2 * u, 48 * u); c.fill();
      for (const ex of [4, 14]) { c.fillStyle = "#f4f4f4"; c.beginPath(); c.arc(cx + ex * u, 29 * u, 4 * u, 0, 7); c.fill(); c.fillStyle = "#111"; c.beginPath(); c.arc(cx + ex * u, 29 * u, 2.4 * u, 0, 7); c.fill(); } };
    O.adDraw = ad; O.jumbo = D.screen(g, 6.4, 3.6, ad(0), 0, 7.6, -13.5, 0, 768, 1.05);
    for (const sx of [-1, 1]) { D.bx(g, 0.5, 6, 0.5, M("#3a3d42"), sx * 2.9, 3, -13.6); }
    for (const sx of [-1, 1]) D.floodTower(g, sx * 7.5, 0, -11, sx * 0.4, 10);
    D.goalpost(g, 4.6, FL, -4.4, 0); { const fb = grp(g, 1.1, FL, -2.6); D.cyl(fb, 0.06, 0.08, 0.1, M("#f28c28"), 0, 0.05, 0, 12); const ball = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), M("#7a3a1a", { roughness: 0.5 })); ball.scale.set(1, 1.55, 1); ball.position.y = 0.32; ball.rotation.z = 0.3; ball.castShadow = true; fb.add(ball); }
    // puppet booth: brick box with a curtain front; the sock puppet rises out of it
    { const bt = grp(g, -0.35, FL, -1.3); for (let k = 0; k < 3; k++) PK.brick(bt, "3001", "#1b2a49", 0, k * PK.BH, 0, 0, [1.1, 1, 1.2]); PK.brick(bt, "3001", "#c9a24a", 0, 3 * PK.BH, 0, 0, [1.15, 0.35, 1.25]);
      const cm = D.canvasMat(128, 128, (c, Wd, H) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#9a1424" : "#b81d2c"; c.fillRect(i * 16, 0, 16, H); } }); const cu = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.1), cm); cu.position.set(0, 0.62, 0.43); bt.add(cu);
      D.brickSign(bt, ["ON AIR"], "#c8102e", "#ffffff", 0.9, 0.26, 0, 1.55, 0.25, 0, { glow: 0.6 }); O.booth = bt; }
    O.puppet = D.puppet(g, -0.35, FL + 1.32, -1.35, 0.25, 1.15);
    { const rimL = new THREE.SpotLight("#dfe8ff", 5, 10, 0.5, 0.5, 1.4); rimL.position.set(0.8, 4.2, -4.2); rimL.target.position.set(-0.35, 2.2, -1.35); g.add(rimL); g.add(rimL.target); }
    O.stSpot = new THREE.SpotLight("#fff2d8", 3.2, 12, 0.35, 0.6, 1.4); O.stSpot.position.set(-0.4, 6.5, 2.4); O.stSpot.target.position.set(-0.35, 1.6, -1.35); g.add(O.stSpot); g.add(O.stSpot.target);
    PK.pressCamera(g, 1.45, FL, -0.2, -2.3, { h: 1.25 });
    PK.speakerStack(g, -2.4, FL, -2.4, 0.5, { single: true });
    PK.balloonBunch(g, 2.4, FL, -3.0, { cols: ["#f2cd37", "#c8102e", "#f4f2ec", "#2f5fa8", "#f2cd37"] });
    O.stadConf = D.confetti(g, 150, ["#f2cd37", "#c8102e", "#f4f2ec", "#2f5fa8"]);
    extra("STADIUM", { kind: "hoodie", top: "#3a3f47", legs: "#1f2a44", hair: "#1c1c1c", hairStyle: "buzz", headset: true, skin: K.SKIN.medium, hat: "cap", hatColor: "#c8102e" },
      { x: 1.95, z: 0.15, ry: -2.0, face: "determined", aR: -1.2, eR: -0.8, aL: -1.0, eL: -0.9 }, [], (t) => ({ hy: -0.3 + 0.15 * Math.sin(t * 1.1) }));
    PK.bake(g); }
});

/* ---------------------------------------------------------------- FED + BUST + LOT + SKY */
DCSETS.more.push(function (ctx, K, X, PK, D, A) {
  const THREE = ctx.THREE, FL = K.FL, { W, O, extra } = A, rnd = D.rnd, { M, glowM, grp, bx, rbx, cyl, noShadow } = D;
  // ================================================================ FED (marble reserve-bank facade, overcast day)
  { const g = W.FED = grp(); X.sky(g, { zenith: "#26304e", mid: "#56608a", horizon: "#d09a78", ground: "#3a3a44", sunDir: [-0.7, 0.14, 0.6], sunColor: "#ffb080", sunSize: 0.5, haze: 0.7, clouds: 0.6, cloudColor: "#c0b4b8", cloudShade: "#4a4a5a" });
    D.tileFloor(g, 16, 12, "#b8b2a6", "#aaa498", 1.4, false, -1);
    const mb = M("#ece8df", { roughness: 0.35, clearcoat: 0.4 }), mb2 = M("#dcd6ca", { roughness: 0.4, clearcoat: 0.3 });
    for (let s = 0; s < 4; s++) { rbx(g, 9.6 - s * 0.3, 0.14, 0.6, s % 2 ? mb : mb2, 0, FL + 0.07 + s * 0.14, -3.9 - s * 0.45, 0, 0.02); }
    rbx(g, 9.0, 0.6, 3.4, mb2, 0, FL + 0.3, -6.6, 0, 0.03);
    const CY = FL + 0.6; for (let i = 0; i < 6; i++) D.column(g, -3.25 + i * 1.3, CY, -5.4, 3.4, 1.0);
    rbx(g, 8.6, 0.5, 0.9, mb, 0, CY + 3.95, -5.4, 0, 0.03); rbx(g, 8.8, 0.18, 1.0, mb2, 0, CY + 4.28, -5.4, 0, 0.02);
    D.brickSign(g, ["RESERVE"], "#e4dfd4", "#5a5248", 3.2, 0.36, 0, CY + 3.95, -4.93, 0, { noStuds: true });
    for (let r = 0; r < 4; r++) { const n = 11 - r * 3; for (let i = 0; i < n; i++) PK.brick(g, i === 0 ? "3040" : i === n - 1 ? "3040" : "3004", "#e4dfd4", -(n - 1) * 0.35 + i * 0.7, CY + 4.37 + r * PK.BH, -5.4, i === 0 ? Math.PI / 2 : i === n - 1 ? -Math.PI / 2 : 0, [1, 1, 2.6]); }
    D.wallBack(g, ["#a89f90", "#9c9384", "#b3aa9b"], -4.4, 4.4, -6.1, 9);
    { const br = M("#7a5428", { metalness: 0.55, roughness: 0.38, clearcoat: 0.3 }), fr = M("#4a3420", { metalness: 0.4, roughness: 0.45 }); rbx(g, 1.9, 2.9, 0.1, fr, 0, CY + 1.45, -5.74, 0, 0.02);
      for (const sx of [-0.4, 0.4]) { rbx(g, 0.76, 2.6, 0.08, br, sx, CY + 1.3, -5.66, 0, 0.02); for (const yy of [0.7, 1.9]) rbx(g, 0.52, 0.9, 0.04, fr, sx, CY + yy, -5.6, 0, 0.015); D.cyl(g, 0.03, 0.03, 0.4, PK.GOLD(), sx * 0.2, CY + 1.3, -5.58, 10); }
      noShadow(D.bx(g, 1.5, 0.05, 0.05, glowM("#ffd27a", 1.6), 0, CY + 2.85, -5.62)); }
    D.skyline(g, { z: -16, x0: -20, x1: 20, n: 9, fMin: 8, fMax: 18, seed: 31, rows: 1, lit: 0.5, street: false });
    O.rates = D.rateBoard(g, 1.05, FL + 1.65, -2.45, 1.5, 0.9); { const st = grp(g, 1.05, FL, -2.5); for (const sx of [-0.55, 0.55]) { PK.bar(st, [sx, 0, 0], [sx, 1.2, 0], 0.03, "#2b2b2b"); } D.studs(st, "#2b2b2b", -0.7, -0.15, 1.4, 0.3, 0.02); }
    O.fountain = D.coinFountain(g, -1.35, FL, 0.6, 1.05); O.fountain.userData.noBake = true;
    for (const x of [-4.4, 4.4]) PK.flagStand(g, x, FL, -3.4, 0, { h: 4.2, ncol: 4, nrow: 3, cols: ["#1f3a6f", "#f4f2ec", "#c8102e"] });
    for (const x of [-2.6, 2.7]) D.lampPost(g, x, -1.8, 3.4, 1.4);
    for (const x of [-1.9, 1.9]) { const l = new THREE.PointLight("#ffc27a", 1.1, 6, 1.6); l.position.set(x, CY + 0.6, -4.2); g.add(l); PK.lanternPost(g, x * 1.25, FL + 0.14, -3.8, 0); }
    const mic = () => { const m = new THREE.Group(); PK.bar(m, [0, 0, 0.04], [0, 0.22, 0.06], 0.014, "#2b2b2b"); PK.brick(m, "3062b", "#2b2b2b", 0, 0.2, 0.06, 0, [0.5, 0.35, 0.5]); PK.brick(m, "3069b", "#c8102e", 0, 0.12, 0.06, 0, [0.4, 1, 0.5]); return m; };
    extra("FED", { kind: "jacket", top: "#7a1f3a", under: "#f4f4f4", legs: "#2a2a30", hair: "#1c1c1c", hairStyle: "ponytail", lips: "#a8434a", lashes: true, skin: K.SKIN.tan },
      { x: 2.35, z: 0.55, ry: -0.75, face: "determined", aR: -1.3, eR: -1.1 }, [["R", mic(), 0, 0, 0.02]], (t) => ({ hy: -0.4 + 0.2 * Math.sin(t * 0.9), aR: -1.3 - 0.15 * Math.sin(t * 2.3) }));
    extra("FED", { kind: "hoodie", top: "#3a3f47", legs: "#1f2a44", hair: "#5a3a20", hairStyle: "short", skin: K.SKIN.light, hat: "cap", hatColor: "#2f5fa8" },
      { x: -3.05, z: 0.35, ry: 0.85, face: "neutral", aR: -1.45, eR: -0.9, aL: -1.3, eL: -1.0 }, [["R", PK.acc.camera(), 0, 0, 0.02]], (t) => ({ hy: 0.1 * Math.sin(t * 1.2) }));
    PK.conifer(g, -4.8, FL, -2.2, 1.0); PK.conifer(g, 4.9, FL, -2.0, 1.1);
    PK.hedge(g, -3.3, FL, -2.8, 0, { n: 2, rows: 1, box: "#8d8a84", flowers: ["#f4f2ec", "#f6b8c8"] }); PK.hedge(g, 3.5, FL, -2.9, 0, { n: 2, rows: 1, box: "#8d8a84", flowers: ["#f2cd37", "#f4f2ec"] });
    PK.pigeons(g, [[-1.6, FL, -1.2, 0.5], [-1.3, FL, -1.6, 2.4], [1.9, FL, -0.8, -1.0], [2.2, FL, -1.1, 1.2]]);
    PK.newspaperBox(g, 2.6, FL, -0.6, -0.5, { col: "#2f5fa8", title: "DAILY", head: "RATES UP" });
    extra("FED", { kind: "suit", top: "#4a4f57", shirt: "#f4f4f4", tie: "#2f5fa8", legs: "#2a2a30", hair: "#2a1a10", hairStyle: "short", skin: K.SKIN.dark },
      { x: -2.0, z: -0.9, ry: 0.55, face: "neutral", gesture: "hold" }, [["R", PK.acc.paper(), 0, 0, 0.02]], (t) => ({ hy: 0.45 + 0.25 * Math.sin(t * 0.6), nod: 0.1 }));
    PK.bake(g); }

  // ================================================================ BUST (the shut-down startup loft, late afternoon)
  { const g = W.BUST = grp(); X.sky(g, "golden");
    D.tileFloor(g, 9, 8, "#7a5534", "#6b4a2e", 0.7, false);
    const cols = ["#8a3a2a", "#7a3224", "#943f2e"];
    D.wallBack(g, cols, -4.5, 4.5, -3.4, 9, (r, x) => (r >= 1 && r <= 6 && x > 4.4 && x < 8.0) || (r <= 4 && x > 2.75 && x < 4.4));
    D.windowFrame(g, 1.9, FL + 1.9, -3.4, 2.6, 2.6, "#2a2a2a", 4);
    D.skyline(g, { z: -14, x0: -4, x1: 18, n: 7, fMin: 5, fMax: 14, seed: 17, rows: 2, lit: 0.25 });
    D.wallSide(g, cols, -4.5, -3.4, 4, 9, -1); D.wallSide(g, cols, 4.5, -3.4, 4, 9, 1);
    D.ceiling(g, 9, 7.4, FL + 4.3, "#3a3d42");
    for (let i = 0; i < 4; i++) noShadow(bx(g, 9, 0.16, 0.16, M("#5c3a1e"), 0, FL + 4.15, -2.8 + i * 1.6));
    // glass door (left of the window) with the OPEN/CLOSED sign
    { const dr = grp(g, -1.0, FL, -3.32); rbx(dr, 1.3, 2.2, 0.08, "#2a2a2a", 0, 1.1, 0, 0, 0.02);
      // door frame bricks + panelled kick plate + a printed FORECLOSURE notice (generic)
      for (const sx of [-0.72, 0.72]) for (let k = 0; k < 6; k++) PK.brick(dr, "3005", "#3a3d42", sx, k * PK.BH, 0.02, 0, [1, 1, 0.8]); for (let k = -2; k <= 2; k++) PK.brick(dr, "3004", "#3a3d42", k * 0.35, 6 * PK.BH, 0.02, 0, [0.5, 0.6, 0.8]);
      rbx(dr, 1.1, 0.42, 0.04, "#4a4f57", 0, 0.25, 0.06, 0, 0.01); for (const sx of [-0.27, 0.27]) rbx(dr, 0.42, 0.28, 0.02, "#3a3d42", sx, 0.25, 0.09, 0, 0.008); D.cyl(dr, 0.03, 0.03, 0.22, PK.MET(), 0.5, 1.05, 0.1, 10);
      { const nt = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.36), D.canvasMat(200, 144, (c, Wd, H) => { c.fillStyle = "#f6f0d8"; c.fillRect(0, 0, Wd, H); c.fillStyle = "#c8102e"; c.font = "900 24px Arial Black, Arial"; c.textAlign = "center"; c.fillText("FORECLOSURE", Wd / 2, 30); c.fillStyle = "#777"; for (let i = 0; i < 5; i++) c.fillRect(20, 50 + i * 16, Wd - 40, 7); })); nt.position.set(0.25, 0.75, 0.07); nt.rotation.z = 0.06; dr.add(nt); } const gl = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.95), new THREE.MeshPhysicalMaterial({ color: "#cfe6ff", roughness: 0.05, transparent: true, opacity: 0.25, depthWrite: false })); gl.position.set(0, 1.1, 0.05); dr.add(gl);
      O.signFlip = grp(dr, 0, 1.55, 0.16); const sc = D.closedSign(O.signFlip, 0, -0.4, 0, 0); sc.userData.noBake = true; const op = D.canvasMat(256, 104, (c, Wd, H) => { c.fillStyle = "#2f8a3a"; c.fillRect(0, 0, Wd, H); c.fillStyle = "#fff"; c.font = "900 70px Arial Black, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("OPEN", Wd / 2, H / 2 + 3); });
      const ob = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 0.3), op); ob.position.set(0, -0.18, -0.025); ob.rotation.y = Math.PI; O.signFlip.add(ob); O.signFlip.userData.noBake = true; }
    O.bag1 = D.petBowl(g, -0.35, FL, -1.25, 0.3); D.beanBag(g, 2.4, FL, -0.9, -0.4, "#8fc23a"); D.beanBag(g, -2.9, FL, -2.0, 0.8, "#2f5fa8");
    O.bustPuppet = D.puppet(g, -0.35, FL + 0.42, -1.25, 0.35, 0.8);
    // abandoned desk row with dark CRTs, scattered papers, a dust sheet over a chair
    for (const x of [0.35]) { D.desk(g, x, FL, -2.9, 0, 1.3, 0.7, "#c9c2b4"); D.crt(g, x, FL + 0.81, -3.0, 0.1, { s: 0.62, draw: (c, Wd, H) => { c.fillStyle = "#0a0b0c"; c.fillRect(0, 0, Wd, H); }, k: 0.4 }); }
    for (let i = 0; i < 14; i++) { const a = rnd(i * 7 + 2) * 6.28, r = 0.8 + rnd(i * 3 + 1) * 2.2; PK.brick(g, i % 3 ? "3070b" : "3069b", "#f4f2ec", Math.sin(a) * r, FL, -0.6 + Math.cos(a) * r * 0.5, a, [1, 0.35, 1]); }
    { const ch = D.chair(g, 2.9, FL, -1.4, -0.6, "#3a3d42"); rbx(g, 1.0, 0.05, 0.8, "#e8e4da", 2.9, FL + 0.82, -1.4, -0.6, 0.02); }
    D.kickScooter(g, 1.6, FL, -0.3, 0.6, 1.45); D.kickScooter(g, -2.1, FL + 0.05, 0.5, 0.9, 1.5); D.beanBag(g, -2.2, FL, -2.4, 0.4, "#2f5fa8");
    { const bn = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.42), D.canvasMat(512, 120, (c, Wd, H) => { c.fillStyle = "#f2cd37"; c.fillRect(0, 0, Wd, H); c.fillStyle = "#c8102e"; c.font = "900 64px Arial Black, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("LAUNCH PARTY!", Wd / 2, H / 2 + 4); }, { side: THREE.DoubleSide }));
      bn.position.set(0.9, FL + 3.55, -3.2); bn.rotation.z = -0.28; g.add(bn); }
    D.foosball(g, 2.6, FL, -2.4, -0.3);
    D.desk(g, -2.6, FL, -2.3, 0.2, 1.4, 0.8, "#c9c2b4"); D.crt(g, -2.8, FL + 0.81, -2.4, 0.3, { s: 0.7, draw: (c, Wd, H) => { c.fillStyle = "#0a0b0c"; c.fillRect(0, 0, Wd, H); }, k: 0.4 }); D.lavaLamp(g, -2.15, FL + 0.81, -2.2);
    O.boxStack = grp(g, 2.2, FL, 0.6, -0.3); D.movingBox(O.boxStack, 0, 0, 0, 0, 1, false); D.movingBox(O.boxStack, 0.05, 0.43, 0, 0.2, 0.9, true); D.movingBox(g, 3.0, FL, -1.0, 0.5, 0.85, true);
    D.bagPile(g, 1.7, FL, 1.0, 5, 9);
    PK.pottedPalm(g, 3.6, FL, -1.2, 0.3, { s: 0.8, lean: 0.06 });
    D.screen(g, 1.2, 0.8, (c, Wd, H) => { c.fillStyle = "#f4f6f6"; c.fillRect(0, 0, Wd, H); c.strokeStyle = "#2f5fa8"; c.lineWidth = 6; c.beginPath(); c.moveTo(20, 40); for (let i = 1; i <= 6; i++) c.lineTo(20 + i * (Wd - 40) / 6, 40 + Math.pow(i / 6, 2) * (H - 80)); c.stroke(); c.fillStyle = "#c8102e"; c.font = "900 34px Arial Black, Arial"; c.fillText("PLAN B?", 24, H - 20); }, -3.6, FL + 2.0, -3.15, 0, 256, 0.9);
    O.bustSun = new THREE.SpotLight("#ffcf8a", 7, 14, 0.42, 0.7, 1.3); O.bustSun.position.set(2.0, FL + 3.4, -5.4); O.bustSun.target.position.set(-0.4, FL + 0.6, -1.0); g.add(O.bustSun); g.add(O.bustSun.target);
    O.bustLights = [-1.6, 1.6].map((x) => D.fluoro(g, x, FL + 4.26, -1.0, 1.6, 0.8)); O.bustLights.forEach((lg) => (lg.userData.noBake = true));
    O.flickTube = D.fluoro(g, -0.6, FL + 3.4, -0.4, 1.4, 1.4); O.flickTube.userData.noBake = true; O.flickTube.rotation.z = 0.12;
    O.bustDust = D.dustPuffs(g, "#ffe8c0", 0.18);
    O.mover = extra("BUST", { kind: "tee", top: "#2f5f4a", legs: "#3a3f47", hair: "#3b2a1a", hairStyle: "short", skin: K.SKIN.light, hat: "cap", hatColor: "#1b1b1b" },
      { x: 3.0, z: -0.6, ry: -1.4, face: "neutral", gesture: "hold" }, [["R", PK.acc.parcel(), 0, 0, 0.02]], null);
    PK.bake(g); }

  // ================================================================ LOT (grocery-van lot at dusk)
  { const g = W.LOT = grp(); X.sky(g, { zenith: "#2a3350", mid: "#6a6a86", horizon: "#e8a07a", ground: "#3a3a44", sunDir: [0.6, 0.1, -0.8], sunColor: "#ffb080", sunSize: 0.6, haze: 0.7, clouds: 0.55, cloudColor: "#c8b8b8", cloudShade: "#4a4a5a" });
    X.ground(g, { size: 300, studs: true, pitch: 0.8, colors: ["#3e4147", "#36393f", "#45484e"], kind: "concrete", seed: 12, repeat: 26 });
    const LX = (x) => { for (let i = 0; i < 6; i++) if (Math.abs(x - (-5.6 + i * 2.6)) < 0.14) return true; return false; };
    D.roadPlate(g, -10, -9.6, 20, 13.4, "#45484e", (x, z) => LX(x) && z > -7.2 && z < -3.0);
    for (let i = 0; i < 6; i++) bx(g, 0.2, 0.03, 4.0, M("#f2f0e6"), -5.6 + i * 2.6, FL + 0.015, -5.1);
    O.lotVans = [-4.3, -1.7, 0.9, 3.5].map((x, i) => D.brickVan(g, x, 0, -5.3, -0.87, { col: "#f4f2ec", text: i === 0 || i === 3 ? "GROCERIES" : null, stripe: "#3fa34d", textCol: "#2f7a34", lights: i % 2 === 0, tilt: i === 2 ? 0.035 : 0 }));
    D.tower(g, 0, -10.5, { w: 12, d: 3, floors: 3, col: "#8a8f96", trim: "#5a5f66", lit: 0.1, seed: 77, fh: 1.4 }); D.towersFlush(g);
    D.brickSign(g, ["GROCERIES"], "#2f7a34", "#f4f2ec", 3.0, 0.55, -2.5, 3.75, -8.9, 0, { glow: 0.25 });
    D.skyline(g, { z: -22, x0: -24, x1: 24, n: 10, fMin: 6, fMax: 14, seed: 66, rows: 1, lit: 0.3, street: false });
    O.gate = grp(g, 0, 0, -1.7); D.chainGate(O.gate, 0, FL, 0, 4.4, 1.9); O.gate.userData.noBake = true;
    D.chainGate(g, -4.6, FL, -1.7, 4.6, 1.9); D.chainGate(g, 4.6, FL, -1.7, 4.6, 1.9);
    O.bankrupt = D.brickSign(O.gate, ["BANKRUPT"], "#f4f2ec", "#c8102e", 1.6, 0.4, 0.2, FL + 2.12, 0.08, 0, { noStuds: true, border: "#c8102e" });
    for (const [x, z, c] of [[-1.8, -3.0, "#f28c28"], [-1.0, -3.2, "#c8102e"], [2.2, -3.1, "#3fa34d"], [2.95, -2.9, "#f2cd37"], [-2.4, 0.9, "#c8102e"], [2.1, 1.2, "#f28c28"], [-1.5, 1.5, "#3fa34d"]]) D.produceCrate(g, x, FL, z, x * 0.3, c);
    D.cart(g, 0.6, FL, -3.4, 0.6).scale.setScalar(0.72); D.cart(g, 3.8, FL, -3.6, -0.4).scale.setScalar(0.72);
    { const tc = PK.grp(g, 0.6, FL + 0.24, 1.25, 0.5, 0.72); tc.rotation.z = Math.PI / 2 - 0.1; D.cart(tc, 0, 0, 0, 0); }
    for (const x of [-3.2, 3.3]) { D.lampPost(g, x, -3.9, 3.8, 1.2); const l = new THREE.PointLight("#ff9a3a", 4.5, 9, 1.5); l.position.set(x, 3.3, -3.9); g.add(l); }
    for (const [x, z] of [[-2.6, -0.6], [2.8, -0.4]]) PK.trafficCone(g, x, FL, z, x);
    PK.recyclingBins(g, -3.4, FL, -0.4, 0.3);
    O.guard = extra("LOT", { kind: "vest", top: "#1d2b44", under: "#e9eef5", label: "SECURITY", labelColor: "#f2cd37", legs: "#1b1b1b", hair: "#2a1a10", hairStyle: "short", skin: K.SKIN.medium, hat: "cap", hatColor: "#1d2b44" },
      { x: 0.85, z: -1.05, ry: -0.45, face: "neutral", gesture: "hold" }, [["R", PK.acc.clipboard(), 0, 0, 0.02]], (t) => ({ hy: 0.5 + 0.2 * Math.sin(t * 0.9) }));
    PK.bake(g); }

  // ================================================================ SKY (survivors skyline from a rooftop terrace)
  { const g = W.SKY = grp(); O.skyNight = X.sky(g, { zenith: "#070d1e", horizon: "#24345a", ground: "#05070b", sunDir: [0.2, -0.3, -1], sunColor: "#9fb8ff", sunSize: 0.0, haze: 0.35, clouds: 0.2, cloudColor: "#2a3550", cloudShade: "#0d1220", stars: 0 }); O.skyDawn = X.sky(g, "golden");
    D.tileFloor(g, 9, 2.0, "#9a8f80", "#8d8374", 0.7, false, -2.0);
    for (let r = 0; r < 2; r++) for (let i = 0; i < 10; i++) PK.brick(g, "3004", r ? "#8a5a48" : "#7d5040", -3.6 + (i + (r ? 0.5 : 0)) * 0.72, FL + r * PK.BH, -1.75, 0, [1.02, 1, 1]); PK.bar(g, [-3.6, FL + 0.96, -1.75], [3.6, FL + 0.96, -1.75], 0.035, PK.MET());
    { const dish = PK.grp(g, 2.9, FL + 2 * PK.BH, -1.75, -0.6); PK.brick(dish, "3062b", "#9aa0a6", 0, 0, 0); const d2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2.6), K.plastic("#e8e8e8", { side: THREE.DoubleSide })); d2.rotation.x = 1.1; d2.position.set(0, 0.55, 0.05); dish.add(d2); }
    // the railing marks the terrace edge (z -1.75): figures stand in front of it, the city lies below and beyond
    { const ac = grp(g, -2.4, FL, -1.2); for (let k = 0; k < 2; k++) PK.brick(ac, "3001", "#9aa0a6", 0, k * PK.BH, 0); PK.brick(ac, "3068b", "#5a5f66", -0.35, 2 * PK.BH, 0); D.cyl(ac, 0.3, 0.3, 0.05, M("#2b2b2b"), 0.35, 2 * PK.BH + 0.03, 0, 18); }
    D.plant(g, 2.2, -1.25, 1.1); D.plant(g, -1.7, -1.3, 1.0);
    for (const x of [-3.6, 3.6]) for (let k = 0; k < 5; k++) PK.brick(g, "3062b", "#3a3d42", x, FL + k * PK.BH, -1.75);
    D.stringLights(g, [[-3.6, FL + 2.1, -1.75], [0, FL + 2.0, -1.6], [3.6, FL + 2.1, -1.75]], 0.25);
    for (const [x, z, n] of [[-3.1, 0.9, 2], [2.9, 1.0, 2]]) PK.hedge(g, x, FL, z, 0, { n, rows: 1, box: "#7a5a3a", flowers: ["#f2cd37", "#e8382b", "#f4f2ec"] });
    { const fan = PK.grp(g, -2.05, FL + 2 * PK.BH + 0.06, -1.2); for (let i = 0; i < 4; i++) PK.mesh(fan, PK.box(0.5, 0.02, 0.1), "#c3c8ce", 0, 0, 0, 0, i * Math.PI / 4, 0); PK.live(fan, (t) => { fan.rotation.y = t * 9; }); }
    PK.pottedPalm(g, -3.3, FL, -0.4, 0.4, { s: 0.75 }); PK.bookStack && PK.umbrellaStand ? PK.umbrellaStand(g, 3.3, FL, -0.5, 0) : null;
    { const sc = grp(g, 1.4, FL, -1.25, -0.4); D.leg(sc, 0, 0, 0, 1.1, 2.2, M("#5a5f66")); D.cyl(sc, 0.12, 0.12, 0.35, M("#2f5fa8"), 0, 1.05, 0.05, 16).rotation.x = Math.PI / 2 - 0.2; D.cyl(sc, 0.08, 0.08, 0.06, M("#1b1b1b"), 0, 1.08, 0.24, 14).rotation.x = Math.PI / 2 - 0.2; }
    // the city below the terrace (y offset -6: we look out and down over it)
    const city = O.city = grp(g, 0, -2.6, -1.0); city.scale.setScalar(0.45);
    const spots = [[-9, -16, 3.2, 14], [-5.2, -20, 3.4, 18], [-1.8, -24, 3.0, 12], [5.6, -19, 3.4, 16], [9.2, -15, 3.0, 11], [-12, -26, 4, 20], [12, -27, 3.6, 22], [3.2, -30, 3.2, 19], [-3.5, -13, 2.6, 9], [7.8, -24, 3, 9]];
    spots.forEach(([x, z, w, f], i) => D.tower(city, x, z, { w, d: w, floors: Math.round(f * 0.62), col: ["#b9a089", "#8f9aa6", "#c9c2b4", "#7d6a5a", "#a7b3bf"][i % 5], lit: 0.55, seed: 200 + i, crown: ["flat", "tank", "spire", "stepped"][i % 4] }));
    D.towersFlush(city); noShadow(bx(city, 80, 0.1, 60, M("#2c3036", { roughness: 0.9 }), 0, -0.05, -20));
    // hero survivor tower: one group per floor (32) so it can fall and grow
    O.hero = grp(city, 1.6, 0, -14.5); O.heroF = [];
    for (let f = 0; f < 32; f++) { const fg = grp(O.hero, 0, f * 0.96, 0); D.tower(fg, 0, 0, { w: 3.2, d: 3.2, floors: 1, col: f % 8 === 7 ? "#2f5fa8" : "#d8dde3", trim: "#5a6a7a", lit: 0.65, seed: 300 + f }); D.towersFlush(fg); O.heroF.push(fg); }
    O.heroCrown = grp(O.hero, 0, 0, 0); D.cyl(O.heroCrown, 0.9, 1.4, 0.8, M("#2f5fa8"), 0, 0.4, 0, 16); noShadow(D.cyl(O.heroCrown, 0.3, 0.3, 0.3, glowM("#5fd0ff", 2.2), 0, 1.0, 0, 16));
    O.skyDust = D.dustPuffs(city, "#c9c2b4", 0.5); O.heroFall = D.brickBurst(city, 26, ["#d8dde3", "#5a6a7a", "#2f5fa8"], ["3003", "3004", "3001"], 0.05);
    O.crane1 = D.crane(city, -1.4, 0, -14.0, 0.5, 14); O.crane2 = D.crane(city, 4.8, 0, -13.2, Math.PI - 0.4, 12); O.crane1.userData.noBake = O.crane2.userData.noBake = true;
    O.tag = grp(city, 0, 0, 0); O.tag.userData.noBake = true; { const tg = D.priceTag(O.tag, 0, 0, 0, 0, "PRICE"); tg.scale.setScalar(5); O.tagStamp = D.brickSign(O.tag, ["TOO HIGH"], "#c8102e", "#ffffff", 1.9, 0.5, 1.0, -0.5, 0.1, -0.15, { noStuds: true }); }
    X.brickClouds(g, { n: 8, area: 260, y: 55, size: 2.6, center: [0, 0, -140], seed: 5 });
    O.blimp = grp(g, -40, -40, -14); O.blimp.userData.noBake = true; { const bm = K.plastic("#c9ccd2", { roughness: 0.4, clearcoat: 0.4 }); for (let i = 0; i < 5; i++) { const r = [0.55, 0.85, 0.95, 0.85, 0.5][i]; const sgm = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.6, 20), bm); sgm.rotation.z = Math.PI / 2; sgm.position.x = -1.2 + i * 0.6; sgm.castShadow = true; O.blimp.add(sgm); }
      for (const [fy, fz] of [[0.7, 0], [-0.7, 0], [0, 0.7], [0, -0.7]]) { const fin = new THREE.Mesh(new THREE.BoxGeometry(0.5, Math.abs(fy) > 0 ? 0.5 : 0.06, Math.abs(fz) > 0 ? 0.5 : 0.06), K.plastic("#c8102e")); fin.position.set(-1.55, fy * 0.8, fz * 0.8); O.blimp.add(fin); }
      const gon = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.22, 0.3), K.plastic("#2f5fa8")); gon.position.set(0.1, -1.05, 0); O.blimp.add(gon); }
    O.skyClouds = X.brickClouds(g, { n: 9, area: 70, y: 15, size: 0.9, center: [2, 0, -40], seed: 11, color: "#ffe8d0" });
    PK.bake(g); }
});
