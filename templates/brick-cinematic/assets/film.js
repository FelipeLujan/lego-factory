/* Shared helpers for every composition. DO NOT EDIT for a new video.
   Everything visible must be a pure function of time t (seconds).
   Cue times come from assets/cues.js, which tools/build.py generates from cues.json + the voice. */
(function () {
  const E = {
    lin: (x) => x,
    io: (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
    io3: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    o3: (x) => 1 - Math.pow(1 - x, 3),
    o4: (x) => 1 - Math.pow(1 - x, 4),
    i3: (x) => x * x * x,
    back: (x) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    step: (x) => (x < 1 ? 0 : 1),
  };

  // A track is a list of keys [time, value, ease]; the ease shapes the move that ARRIVES at that key.
  // sample([[0, 1], [2, 5, "io3"]], t) -> 1 until t=0, eases to 5 by t=2, holds after.
  function sample(track, t, log) {
    if (t <= track[0][0]) return track[0][1];
    for (let i = 1; i < track.length; i++) {
      const [t1, v1, ez] = track[i];
      if (t < t1) {
        const [t0, v0] = track[i - 1];
        if (t1 === t0) return v1;
        const k = (E[ez || "io3"] || E.io3)((t - t0) / (t1 - t0));
        if (log) return Math.exp(Math.log(v0) + (Math.log(v1) - Math.log(v0)) * k);
        return v0 + (v1 - v0) * k;
      }
    }
    return track[track.length - 1][1];
  }

  // 0 before a, eases to 1 over fi seconds, holds, eases back to 0 over the last fo seconds before b.
  function win(t, a, b, fi = 0.25, fo = 0.2) {
    if (t < a || t >= b) return 0;
    const i = fi > 0 ? Math.min(1, (t - a) / fi) : 1;
    const o = fo > 0 ? Math.min(1, (b - t) / fo) : 1;
    return E.o3(Math.max(0, Math.min(i, o)));
  }

  // 0..1 kick right after each hit time (fast attack, quick decay). Used for camera punches.
  function kick(t, hits, len = 0.32) {
    let k = 0;
    for (let i = 0; i < hits.length; i++) {
      const x = t - hits[i];
      if (x >= 0 && x < len) k = Math.max(k, Math.exp(-x / (len * 0.28)) * Math.min(1, x / 0.03 + 0.25));
    }
    return k;
  }

  const C = window.FILM_CUES || { total: 10, voiceEnd: 8, words: [], beats: [], acc: [], chapters: [], slams: [], tags: [], named: {} };
  const norm = (w) => String(w).toLowerCase().replace(/[^a-z0-9']/g, "");

  // Time (seconds) when a spoken phrase starts. at("number one") or at("one", 2) for the 2nd "one".
  function at(phrase, nth = 1) {
    if (C.named && C.named[phrase] !== undefined && nth === 1) return C.named[phrase];
    const want = String(phrase).split(/\s+/).map(norm).filter(Boolean);
    let seen = 0;
    for (let i = 0; i + want.length <= C.words.length; i++) {
      let ok = true;
      for (let j = 0; j < want.length; j++) if (norm(C.words[i + j].w) !== want[j]) { ok = false; break; }
      if (ok && ++seen === nth) return C.words[i].s;
    }
    console.warn("FILM.at: phrase not found:", phrase);
    return null;
  }

  // Index of the chapter we are in at time t (-1 before the first chapter).
  function chapter(t) {
    let n = -1;
    C.chapters.forEach((c, i) => { if (t >= c) n = i; });
    return n;
  }

  window.FILM = { E, sample, win, kick, at, chapter, cues: C, total: C.total };
})();
