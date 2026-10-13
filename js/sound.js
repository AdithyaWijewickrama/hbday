/* =========================================================
   🔊  Soft, natural sounds made on the fly (no audio files):
   kalimba-like notes for his voice, breath for the candles,
   wind for travelling, all through a little room reverb.
   ========================================================= */
const Sound = (() => {
  let ctx = null, out = null, verb = null;
  let muted = false;
  try { muted = localStorage.getItem("bday-muted") === "1"; } catch (e) {}

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      // master: gentle lowpass so nothing sounds harsh, plus a small reverb send
      out = ctx.createGain(); out.gain.value = 0.9;
      const soft = ctx.createBiquadFilter(); soft.type = "lowpass"; soft.frequency.value = 7000;
      out.connect(soft).connect(ctx.destination);
      verb = ctx.createConvolver();
      verb.buffer = roomImpulse(1.8);
      const wet = ctx.createGain(); wet.gain.value = 0.28;
      verb.connect(wet).connect(soft);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function roomImpulse(sec) {
    const len = Math.floor(ctx.sampleRate * sec), buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    return buf;
  }
  // route a node to the dry output and the reverb
  function send(node, reverb = 0.6) {
    node.connect(out);
    if (reverb) { const g = ctx.createGain(); g.gain.value = reverb; node.connect(g).connect(verb); }
  }

  // a soft plucked note (kalimba / music box): sine + a quiet overtone, smooth attack, long natural decay
  function note(f, { dur = 1.1, vol = 0.07, delay = 0, bright = 0.25, reverb = 0.7 } = {}) {
    if (muted) return;
    const a = ac(); if (!a) return;
    const t = a.currentTime + delay;
    const g = a.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.006);
    g.gain.setTargetAtTime(0, t + 0.01, dur / 4);
    [[1, 1], [2.01, bright], [3.98, bright * 0.35]].forEach(([mult, amp]) => {
      const o = a.createOscillator(), og = a.createGain();
      o.type = "sine";
      o.frequency.value = f * mult;
      og.gain.value = amp;
      o.connect(og).connect(g);
      o.start(t); o.stop(t + dur + 0.3);
    });
    send(g, reverb);
  }

  // filtered noise with a smooth envelope: breath, wind, crumbs, claps
  function air(dur, { vol = 0.1, type = "bandpass", freq = 1200, to = null, q = 0.7, attack = 0.01, delay = 0, reverb = 0.3 } = {}) {
    if (muted) return;
    const a = ac(); if (!a) return;
    const t = a.currentTime + delay;
    const buf = a.createBuffer(1, Math.max(1, Math.floor(a.sampleRate * (dur + 0.1))), a.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) { last = last * 0.4 + (Math.random() * 2 - 1) * 0.6; d[i] = last; } // slightly warm noise
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = a.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.setTargetAtTime(0, t + attack, Math.max(0.01, (dur - attack) / 3));
    src.connect(f).connect(g);
    send(g, reverb);
    src.start(t); src.stop(t + dur + 0.1);
  }

  // a round, soft bubble "plop"
  function bubble(f = 500, { vol = 0.08, delay = 0 } = {}) {
    if (muted) return;
    const a = ac(); if (!a) return;
    const t = a.currentTime + delay;
    const o = a.createOscillator(), g = a.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 2.4, t + 0.07);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.setTargetAtTime(0, t + 0.03, 0.03);
    o.connect(g);
    send(g, 0.5);
    o.start(t); o.stop(t + 0.25);
  }

  // a tiny cute "voice" (anime style): buzzy source shaped by vowel formants,
  // with a lowpass that closes for the nasal n / m sounds
  function voice(f0, dur, { delay = 0, vol = 0.05, to = null, nasal = [0.25, 0.25], open = 3200, vib = 0.025 } = {}) {
    if (muted) return;
    const a = ac(); if (!a) return;
    const t = a.currentTime + delay;
    const o = a.createOscillator(); o.type = "sawtooth";
    o.frequency.setValueAtTime(f0, t);
    if (to) o.frequency.linearRampToValueAtTime(to, t + dur);
    const lfo = a.createOscillator(), lg = a.createGain();
    lfo.frequency.value = 6.5; lg.gain.value = f0 * vib;
    lfo.connect(lg).connect(o.frequency);
    const mouth = a.createBiquadFilter(); mouth.type = "lowpass"; mouth.Q.value = 0.8;
    const [inT, outT] = nasal; // share of the syllable spent on n... and ...m
    mouth.frequency.setValueAtTime(380, t);
    mouth.frequency.linearRampToValueAtTime(open, t + dur * inT);
    mouth.frequency.setValueAtTime(open, t + dur * (1 - outT));
    mouth.frequency.linearRampToValueAtTime(380, t + dur);
    const g = a.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.setValueAtTime(vol, t + dur - 0.04);
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(mouth);
    [[650, 1, 5], [1150, 0.55, 6], [3000, 0.18, 7]].forEach(([f, amp, q]) => { // "o" vowel, child-sized
      const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = f; bp.Q.value = q;
      const bg = a.createGain(); bg.gain.value = amp * 3;
      mouth.connect(bp).connect(bg).connect(g);
    });
    send(g, 0.35);
    o.start(t); lfo.start(t); o.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
  }

  // C major pentatonic, two octaves up: always sounds sweet together
  const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5];
  const nth = (i) => SCALE[Math.max(0, Math.min(SCALE.length - 1, i))];

  const fx = {
    // his "voice": a couple of soft kalimba notes, rising for questions
    babble(text = "") {
      const n = Math.min(4, Math.max(2, Math.round(text.length / 14)));
      const asking = /\?/.test(text);
      let i = 1 + ((Math.random() * 3) | 0);
      for (let k = 0; k < n; k++) {
        note(nth(i), { dur: 0.7, vol: 0.045, delay: k * 0.11, bright: 0.15 });
        i += asking ? 1 : (Math.random() < 0.5 ? 1 : -1);
      }
    },
    pop() { bubble(420); },
    boing() { note(392, { dur: 0.9, vol: 0.06 }); note(587.33, { dur: 0.9, vol: 0.05, delay: 0.09 }); },
    yay() { [0, 2, 4, 5, 7].forEach((s, k) => note(nth(s), { dur: 1.4, vol: 0.06, delay: k * 0.09 })); },
    uhoh() { note(659.25, { dur: 0.9, vol: 0.055 }); note(523.25, { dur: 1.2, vol: 0.055, delay: 0.2 }); },
    giggle() { [5, 4, 5, 4, 3].forEach((s, k) => note(nth(s), { dur: 0.4, vol: 0.035, delay: k * 0.07, bright: 0.1 })); },
    clap(times = 3) {
      for (let k = 0; k < times; k++) // each clap = a few tiny bursts close together, like real hands
        [0, 0.008, 0.019].forEach((o, j) => air(0.09, { vol: 0.12 - j * 0.03, freq: 1100 + j * 250, q: 1.1, attack: 0.002, delay: k * 0.24 + o, reverb: 0.5 }));
    },
    whoosh() { air(0.9, { vol: 0.06, freq: 350, to: 1500, q: 0.9, attack: 0.3, reverb: 0.2 }); },
    zip() { air(0.6, { vol: 0.05, freq: 600, to: 2200, q: 1.2, attack: 0.15, reverb: 0.2 }); },
    swish() { air(0.35, { vol: 0.07, freq: 2600, to: 900, q: 0.8, attack: 0.05, reverb: 0.2 }); },
    step() { air(0.08, { vol: 0.05, type: "lowpass", freq: 260, attack: 0.004, reverb: 0 }); },
    munch() { for (let k = 0; k < 4; k++) air(0.07, { vol: 0.09, type: "lowpass", freq: 1500 + Math.random() * 800, attack: 0.004, delay: k * 0.17 + Math.random() * 0.04, reverb: 0.1 }); },
    slice() { air(0.45, { vol: 0.09, freq: 3200, to: 1100, q: 0.9, attack: 0.03, reverb: 0.25 }); },
    puff() { air(0.55, { vol: 0.14, type: "lowpass", freq: 900, to: 400, attack: 0.05, reverb: 0.2 }); },
    yawn() { air(0.9, { vol: 0.05, type: "lowpass", freq: 700, to: 300, attack: 0.2, reverb: 0.3 }); note(392, { dur: 1.2, vol: 0.03, delay: 0.1 }); },
    // anime eating: "nom nom nom" then a happy "mmm~♪"
    nom() {
      [0, 0.24, 0.48].forEach((d, k) => voice(760 + k * 45 + Math.random() * 20, 0.19, { delay: d, vol: 0.05 }));
    },
    mmm() {
      voice(760, 0.85, { vol: 0.045, to: 980, nasal: [0, 0], open: 520, vib: 0.04 });
      [6, 7].forEach((s2, k) => note(nth(s2), { dur: 1.2, vol: 0.03, delay: 0.55 + k * 0.08, bright: 0.4 }));
    },
    // a real-sounding balloon pop: sharp crack plus a little low thump
    balloon() {
      air(0.12, { vol: 0.32, type: "highpass", freq: 900, attack: 0.001, reverb: 0.6 });
      air(0.1, { vol: 0.2, type: "lowpass", freq: 220, attack: 0.002, reverb: 0 });
    },
    shutter() { air(0.05, { vol: 0.12, freq: 3500, q: 2, attack: 0.001, reverb: 0.1 }); air(0.06, { vol: 0.1, freq: 2500, q: 2, attack: 0.001, delay: 0.09, reverb: 0.1 }); },
    sparkle() { [5, 6, 7].forEach((s, k) => note(nth(s), { dur: 1.2, vol: 0.035, delay: k * 0.07, bright: 0.4 })); },
  };

  function setMuted(m) {
    muted = m;
    try { localStorage.setItem("bday-muted", m ? "1" : "0"); } catch (e) {}
  }

  return { fx, unlock: ac, isMuted: () => muted, setMuted };
})();
