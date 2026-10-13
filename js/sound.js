/* =========================================================
   🔊  Tiny synthesized sounds (no audio files needed)
   ========================================================= */
const Sound = (() => {
  let ctx = null;
  let muted = false;
  try { muted = localStorage.getItem("bday-muted") === "1"; } catch (e) {}

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // one note with a quick envelope; f2 = pitch to slide to
  function tone(f, dur = 0.12, { type = "sine", vol = 0.12, f2 = null, delay = 0 } = {}) {
    if (muted) return;
    const a = ac(); if (!a) return;
    const t = a.currentTime + delay;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function noise(dur = 0.08, { vol = 0.12, freq = 1800, q = 0.8, delay = 0, sweepTo = null } = {}) {
    if (muted) return;
    const a = ac(); if (!a) return;
    const t = a.currentTime + delay;
    const buf = a.createBuffer(1, Math.max(1, Math.floor(a.sampleRate * dur)), a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = a.createBufferSource(); src.buffer = buf;
    const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = q;
    bp.frequency.setValueAtTime(freq, t);
    if (sweepTo) bp.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    const g = a.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp).connect(g).connect(a.destination);
    src.start(t); src.stop(t + dur + 0.02);
  }

  const fx = {
    // cute "animal-crossing" style babble while he talks
    babble(text = "") {
      const n = Math.min(9, Math.max(3, Math.round(text.length / 6)));
      const base = 520 + Math.random() * 80;
      for (let i = 0; i < n; i++) tone(base * (0.85 + Math.random() * 0.5), 0.06, { type: "square", vol: 0.035, delay: i * 0.075 });
    },
    pop() { tone(380, 0.09, { f2: 900, vol: 0.12 }); },
    boing() { tone(220, 0.35, { type: "triangle", f2: 660, vol: 0.1 }); tone(660, 0.2, { type: "sine", f2: 330, vol: 0.05, delay: 0.25 }); },
    yay() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, { type: "triangle", vol: 0.09, delay: i * 0.08 })); },
    uhoh() { tone(494, 0.16, { type: "triangle", vol: 0.1 }); tone(392, 0.28, { type: "triangle", vol: 0.1, delay: 0.17 }); },
    giggle() { for (let i = 0; i < 6; i++) tone(i % 2 ? 900 : 1150, 0.06, { type: "triangle", vol: 0.06, delay: i * 0.07 }); },
    clap(times = 3) { for (let i = 0; i < times; i++) noise(0.06, { vol: 0.25, freq: 1400, q: 0.6, delay: i * 0.22 }); },
    whoosh() { noise(0.6, { vol: 0.08, freq: 400, sweepTo: 2400, q: 1.2 }); },
    zip() { tone(1200, 0.4, { type: "sine", f2: 300, vol: 0.05 }); },
    step() { tone(160, 0.05, { type: "square", vol: 0.03 }); },
    munch() { for (let i = 0; i < 4; i++) noise(0.05, { vol: 0.14, freq: 600, q: 2, delay: i * 0.16 }); },
    slice() { noise(0.25, { vol: 0.12, freq: 3000, sweepTo: 6000, q: 3 }); },
    puff() { noise(0.3, { vol: 0.08, freq: 900, sweepTo: 300, q: 0.7 }); },
    yawn() { tone(420, 0.7, { type: "sine", f2: 260, vol: 0.05 }); },
    sparkle() { [1568, 2093, 2637].forEach((f, i) => tone(f, 0.12, { vol: 0.04, delay: i * 0.06 })); },
  };

  function setMuted(m) {
    muted = m;
    try { localStorage.setItem("bday-muted", m ? "1" : "0"); } catch (e) {}
  }

  return { fx, unlock: ac, isMuted: () => muted, setMuted };
})();
