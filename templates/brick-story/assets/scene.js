/* ============================================================================
   brick-story DEMO scene: shows how to use the brick kit (assets/brick-kit.js).
   Replace this file for a real video. Keep the structure: build() makes the sets and the cast,
   update(t) poses everything from scratch every frame and returns the camera.
   ============================================================================ */
(function () {
  const F = window.FILM;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const mix = (a, b, k) => a + (b - a) * k;
  const sstep = (a, b, x) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  const labels = [];
  let K, S = {};

  function build(ctx) {
    K = BRICK.setup(ctx);
    const { scene, THREE } = ctx;
    // ---- set: an office corner with a city window, a conference table and chairs ----
    S.OFFICE = new THREE.Group(); scene.add(S.OFFICE);
    K.room(S.OFFICE, { nx: 18, nz: 12, window: K.cityTex, windowX: 1.6, door: true, doorX: -2.2 });
    K.table(S.OFFICE, 0, K.FL, 0.2, 0, 3.6, 1.2);
    S.seats = [];
    for (const side of [-1, 1]) for (const x of [-1.1, 0, 1.1]) { K.chair(S.OFFICE, x, K.FL, 0.2 + side * 0.95, side < 0 ? 0 : Math.PI); S.seats.push({ x, z: 0.2 + side * 0.95, ry: side < 0 ? 0 : Math.PI }); }
    K.papers(S.OFFICE, -0.3, K.FL + 0.87, 0.4, 3); K.mug(S.OFFICE, 0.5, K.FL + 0.87, 0.0); K.laptop(S.OFFICE, 1.0, K.FL + 0.87, 0.35, Math.PI);
    K.plant(S.OFFICE, 3.0, K.FL, -1.6); K.bookshelf(S.OFFICE, -3.0, K.FL, -2.0);
    K.whiteboard(S.OFFICE, 3.2, K.FL + 1.5, -2.1, 0, ["OFFER: $40K"]);
    // ---- cast: one of each clothing kind ----
    S.cast = [
      K.fig({ kind: "suit", top: "#2a2a30", legs: "#2a2a30", tie: "#b81d24", pocketSquare: "#ffffff", hair: "#3b2a1a", hairStyle: "side", watch: true }),
      K.fig({ kind: "blazer", top: "#1f2f4f", legs: "#1f2f4f", under: "#f4f4f4", skirt: "#1f2f4f", hair: "#c9a26b", hairStyle: "bob", lips: "#b0303a", lashes: true, necklace: "#d8b44a", skin: K.SKIN.light }),
      K.fig({ kind: "turtleneck", top: "#151515", legs: "#2e4a7a", jeans: true, hair: "#2a1a10", hairStyle: "short", glasses: true, stubble: true }),
      K.fig({ kind: "hoodie", top: "#5b616b", legs: "#1f2a44", hair: "#7a5a3a", hairStyle: "curly", skin: K.SKIN.medium }),
      K.fig({ kind: "uniform", top: "#4b5a3a", legs: "#4b5a3a", hat: "officer", hatColor: "#4b5a3a", age: true, mustache: "#5a5a5a", hair: "#9a9a9a" }),
      K.fig({ kind: "labcoat", top: "#f4f4f4", legs: "#2c2c2c", under: "#7a8fa8", tie: "#2d63b0", hair: "#e0e0e0", hairStyle: "receding", age: true, glasses: true }),
      K.fig({ kind: "dress", top: "#8a1f2f", hair: "#1c1c1c", hairStyle: "ponytail", lips: "#8a1f2f", lashes: true, skin: K.SKIN.tan, shoes: "#1b1b1b" }),
      K.fig({ kind: "racing", top: "#c91a09", legs: "#c91a09", stripe: "#ffffff", hat: "helmet", hatColor: "#f4f4f4", hatBand: "#c91a09", beard: "#4a4038", skin: K.SKIN.light }),
    ];
  }

  const FACES = ["smile", "grin", "smirk", "neutral", "determined", "worried", "laugh", "angry"];
  const GESTS = ["point", "cross", "hips", "phone", "think", "shrug", "cover", "facepalm"];

  function update(t, ctx) {
    K.hideAll(S.cast);
    if (t < 8) { // lineup: 8 figures, one of each kind
      S.cast.forEach((f, i) => K.P(f, { x: -2.45 + i * 0.7, z: 1.4, face: FACES[(i + Math.floor(t / 2)) % 8], gesture: t > 4 ? GESTS[i] : null }));
      return { target: [0, 0.95, 1.4], dist: 15.5, az: 0, el: 6 };
    }
    if (t < 14) { // close-up of three
      [0, 1, 2].forEach((k) => K.P(S.cast[k], { x: -0.7 + k * 0.7, z: 1.5, ry: (k - 1) * -0.3, face: FACES[k], gesture: ["hold", "present", "write"][k] }));
      return { target: [0, 1.2, 1.5], dist: 4.4, az: 10, el: 6 };
    }
    // meeting: four seated, one walking in through the door
    [0, 1, 4, 5].forEach((k, i) => { const s = S.seats[[0, 2, 3, 5][i]]; K.P(S.cast[k], { x: s.x, z: s.z, ry: s.ry, sit: 1, look: [mix(-2.2, 0, sstep(14, 18, t)), 1.6], face: "frown" }); });
    const w = sstep(14, 18, t);
    K.P(S.cast[2], { x: mix(-2.2, 0, w), z: 1.6, ry: w < 1 ? Math.PI / 2 : 0, walk: w > 0 && w < 1 ? K.walkPh(t) : null, face: "determined", gesture: w >= 1 ? "slam" : null });
    return { target: [0, 1.1, 0.4], dist: 9.0, az: 24, el: 18 };
  }

  window.SCENE = { build, update, labels, pixelRatio: 1.5 };
})();
