/* ============================================================================
   SCENE.JS: THE ONLY VISUALS FILE YOU WRITE FOR A NEW VIDEO.
   The example below is the demo "Why bees build hexagons". Replace it with your topic.

   RULES (break them and the render breaks):
   1. Everything must be a pure function of time t. No Math.random(), Date.now(), timers or fetch.
      If you need randomness, use rand(i) below; it always returns the same number for the same i.
   2. Build every object ONCE in build(ctx). In update(t, ctx) only move, scale, rotate, recolour or show/hide.
   3. Time things to the voice with F.at("spoken words"): it returns the second that phrase starts.
      Never type raw seconds. When the script changes, the times move with it.
   4. update() returns the camera: { target: [x, y, z], dist, az, el }.
      target is the point the camera looks at; the floor is y = 0 and a subject usually sits at y ~ 1.2.
      dist is the distance (6-20). az and el are degrees (left/right orbit and height above the floor).
      The stage adds punches, whips and drift on top. Do not add shake yourself.
   5. Keep the subject large: it should fill 40-70% of the frame width. Things keep moving: spin subjects slowly.
   6. REALISTIC, NOT CARTOONY: real materials + real colours (MeshPhysicalMaterial; recipes in PLAYBOOK.md section 5).
      Coral #FF6B4A and lime #C8FF3E only for diagram elements (arrows, glows). The background is black.
      Full realistic example: deice-boot/assets/scene.js (brushed metal, rubber, ice, canvas-texture detail).

   ctx gives you: THREE (three.js r149), scene, camera, F (helpers: F.at, F.sample, F.win, F.kick,
   F.E eases, F.cues), DEG (degrees to radians) and tag(id, position, amount) for the labels in SCENE.labels.
   ============================================================================ */
(function () {
  const F = window.FILM;
  const at = (p, n) => F.at(p, n);
  function rand(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

  // Labels with a leader line pointing at a 3D point. Show them in update() with ctx.tag(id, pos, amount).
  // style "ink" = white tag; default = coral tag. dx/dy = where the tag sits relative to the point, in px.
  const labels = [
    { id: "edges", text: "More edges = more wax", dx: 0, dy: -260, style: "ink" },
    { id: "gap", text: "Zero gaps", dx: 0, dy: -300 },
  ];

  let S = {}; // everything build() makes, used by update()

  function build(ctx) {
    const { THREE, scene } = ctx;
    const ivory = new THREE.MeshPhysicalMaterial({ color: "#e9c46a", roughness: 0.38, clearcoat: 0.4, clearcoatRoughness: 0.3, sheen: 0.5, sheenColor: new THREE.Color("#fff1c4") }); // beeswax
    const coral = new THREE.MeshPhysicalMaterial({ color: "#ffb347", roughness: 0.05, transmission: 0.7, thickness: 0.6, ior: 1.5, attenuationColor: new THREE.Color("#c46a00"), attenuationDistance: 0.4, clearcoat: 1 }); // honey

    // HERO: one prism whose number of sides changes (6 -> 3 -> 4 -> 6). Build all three shapes once.
    const hero = new THREE.Group();
    const shapes = {};
    for (const sides of [3, 4, 6]) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.45, sides), ivory);
      m.castShadow = true;
      m.visible = false;
      hero.add(m);
      shapes[sides] = m;
    }
    scene.add(hero);

    // HONEYCOMB: 19 hex cells laid out on a hexagon grid (axial coordinates), popping in around the hero.
    const cells = [];
    const R = 1.0, GAP = 1.04;
    for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) {
      const s = -q - r;
      if (Math.abs(s) > 2) continue;
      const ring = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
      const cell = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.45, 6), ivory);
      cell.position.set(Math.sqrt(3) * R * GAP * (q + r / 2), 0.4, 1.5 * R * GAP * r);
      cell.castShadow = true;
      // honey: a coral fill that rises inside each cell
      const honey = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.82, R * 0.82, 1, 6), coral);
      honey.position.copy(cell.position);
      scene.add(cell); scene.add(honey);
      cells.push({ cell, honey, ring, delay: ring * 0.12 + rand(q * 7 + r) * 0.1 });
    }
    S = { hero, shapes, cells };
  }

  function update(t, ctx) {
    const { DEG } = ctx;
    // ---- times of the beats, read from the voice ----
    const tTri = at("triangles"), tSq = at("squares"), tOne = at("number one"), tTwo = at("number two"), tProof = at("in 1999"), tEnd = at("bees solved");

    // ---- hero: which shape, with a squash-pop each time it changes ----
    const sides = t < tTri ? 6 : t < tSq ? 3 : 6 - (t < tOne ? 2 : 0);
    for (const k in S.shapes) S.shapes[k].visible = Number(k) === sides;
    const pop = 1 - 0.35 * F.kick(t, [tTri, tSq, tOne], 0.35);
    const heroGone = F.sample([[0, 1], [tOne + 0.2, 1], [tOne + 0.6, 0, "io3"], [tEnd, 0], [tEnd + 0.5, 1, "back"]], t);
    S.hero.scale.set(pop * heroGone + 1e-4, (2 - pop) * heroGone + 1e-4, pop * heroGone + 1e-4);
    S.hero.position.set(0, 1.3, 0);
    S.hero.rotation.set(0.5, t * 0.6, 0); // tilted so the top face reads, always turning

    // ---- honeycomb: cells pop in from the centre outwards on "number one" ----
    const honeyRise = F.sample([[0, 0], [tTwo, 0], [tTwo + 1.4, 1, "io3"]], t);
    const outer = F.sample([[0, 0], [tProof, 0], [tProof + 0.8, 1, "o3"]], t);
    for (const c of S.cells) {
      const show = c.ring <= 1 ? F.win(t, tOne + c.delay, tEnd, 0.3, 0.3) : F.win(t, tProof + c.delay, tEnd, 0.3, 0.3) * outer;
      const k = F.E.back(Math.min(1, show));
      c.cell.scale.set(k + 1e-4, k + 1e-4, k + 1e-4);
      c.honey.scale.set(k + 1e-4, Math.max(1e-4, 0.42 * honeyRise * k), k + 1e-4);
      c.honey.position.y = 0.2 + 0.21 * honeyRise * k;
    }

    // ---- labels ----
    ctx.tag("edges", S.hero.position, F.win(t, tTri + 0.3, tSq, 0.25, 0.2));
    ctx.tag("gap", S.cells[0].cell.position, F.win(t, tOne + 0.9, tTwo, 0.25, 0.2));

    // ---- camera: one move per beat, eased; values held between beats ----
    const el = F.sample([[0, 18], [tOne, 18], [tOne + 0.8, 58, "io3"], [tEnd, 58], [tEnd + 0.8, 18, "io3"]], t);
    const dist = F.sample([[0, 9], [tOne, 9], [tOne + 0.8, 14, "io3"], [tProof, 14], [tProof + 0.8, 21, "io3"], [tEnd, 21], [tEnd + 0.8, 9, "io3"]], t);
    const ty = F.sample([[0, 1.3], [tOne, 1.3], [tOne + 0.8, 0.4, "io3"], [tEnd, 0.4], [tEnd + 0.8, 1.3, "io3"]], t);
    return { target: [0, ty, 0], dist, az: t * 4, el };
  }

  window.SCENE = { build, update, labels };
})();
