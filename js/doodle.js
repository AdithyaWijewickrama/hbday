/* =========================================================
   ✏️  THE BOY DOODLES ON HER PHOTOS
   When she opens a photo that has her face in it (CONFIG.photos[].face),
   the little boy runs in with a giant pencil, draws silly things on her
   face (mustache, glasses, crown, whiskers…) and sticks emojis on.
   Tap the photo: he adds one more. 🧽 cleans her face.
   ========================================================= */
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((v) => v[1]);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const lite = () => document.documentElement.classList.contains("lite");
  const fx = (name) => Sound.fx[name] && Sound.fx[name]();

  // Drawings in "face units": her eyes are at (-0.5, 0) and (0.5, 0), her mouth at (0, 1).
  const INK = ["#1d4ed8", "#e11d48", "#111827", "#db2777", "#7c3aed"];
  const DOODLES = {
    mustache: { say: ["Mustache! 🥸 Very classy", "Gentleman Ishani 🥸😂"], w: 7, paths: [
      "M0 0.66 C-0.12 0.58 -0.42 0.56 -0.55 0.75 C-0.62 0.88 -0.82 0.84 -0.78 0.68",
      "M0 0.66 C0.12 0.58 0.42 0.56 0.55 0.75 C0.62 0.88 0.82 0.84 0.78 0.68"] },
    glasses: { say: ["Now she's a professor 🤓", "Nerd mode on 🤓😂"], w: 4, front: true, paths: [
      "M-0.18 0 A0.32 0.3 0 1 0 -0.82 0 A0.32 0.3 0 1 0 -0.18 0",
      "M0.18 0 A0.32 0.3 0 1 1 0.82 0 A0.32 0.3 0 1 1 0.18 0",
      "M-0.18 -0.03 Q0 -0.16 0.18 -0.03"] },
    unibrow: { say: ["Unibrow 😂 sorry not sorry", "One big eyebrow 🤨😂"], w: 6, front: true, paths: [
      "M-0.85 -0.36 Q-0.5 -0.6 -0.12 -0.42 Q0 -0.36 0.12 -0.42 Q0.5 -0.6 0.85 -0.36"] },
    whiskers: { say: ["Meow 🐱😂", "Kitty Ishani 🐱"], w: 3.5, front: true, paths: [
      "M-0.08 0.5 L0.08 0.5 L0 0.6 Z",
      "M-0.3 0.72 L-1.1 0.56", "M-0.3 0.8 L-1.15 0.8", "M-0.3 0.88 L-1.1 1.04",
      "M0.3 0.72 L1.1 0.56", "M0.3 0.8 L1.15 0.8", "M0.3 0.88 L1.1 1.04"] },
    crown: { say: ["Queen ✅ 👑", "A crown for the queen 👑"], w: 4.5, color: "#f59e0b", paths: [
      "M-0.75 -0.95 L-0.82 -1.55 L-0.4 -1.2 L0 -1.72 L0.4 -1.2 L0.82 -1.55 L0.75 -0.95 Z"] },
    horns: { say: ["Little devil 😈 hehe", "Birthday devil 😈😂"], w: 5, color: "#ef4444", paths: [
      "M-0.75 -0.95 L-0.98 -1.62 L-0.4 -1.08", "M0.75 -0.95 L0.98 -1.62 L0.4 -1.08"] },
    blush: { say: ["Blushing 😳", "Who made her blush? 👀😂"], w: 3.5, color: "#ec4899", front: true, paths: [
      "M-0.88 0.48 L-0.78 0.62 M-0.74 0.46 L-0.64 0.6 M-0.6 0.44 L-0.5 0.58",
      "M0.5 0.44 L0.6 0.58 M0.64 0.46 L0.74 0.6 M0.78 0.48 L0.88 0.62"] },
    beard: { say: ["Beard gang 🧔😂", "Wise old Ishani 🧔"], w: 4, color: "#3f2a1d", paths: [
      "M-0.72 0.95 L-0.6 1.22 L-0.45 1.05 L-0.33 1.38 L-0.15 1.15 L0 1.5 L0.15 1.15 L0.33 1.38 L0.45 1.05 L0.6 1.22 L0.72 0.95"] },
    clown: { say: ["Honk honk 🤡", "Clown nose 🔴😂"], w: 3, color: "#ef4444", fill: true, nose: true, paths: [
      "M-0.14 0 A0.14 0.14 0 1 0 0.14 0 A0.14 0.14 0 1 0 -0.14 0"] },
    heart: { say: ["A little heart 💙", "Cute 💙"], w: 3, color: "#2563eb", fill: true, paths: [
      "M0.78 0.6 C0.78 0.5 0.64 0.48 0.64 0.58 C0.64 0.66 0.78 0.72 0.78 0.78 C0.78 0.72 0.92 0.66 0.92 0.58 C0.92 0.48 0.78 0.5 0.78 0.6 Z"] },
    monocle: { say: ["Fancy monocle 🧐", "Very fancy 🧐😂"], w: 4, eye: true, paths: [
      "M-0.34 0 A0.34 0.32 0 1 0 0.34 0 A0.34 0.32 0 1 0 -0.34 0", "M0 0.32 Q0.1 0.7 -0.05 1.1"] },
  };
  const FRONT_ONLY = Object.keys(DOODLES).filter((k) => DOODLES[k].front);
  const CLASH = { glasses: ["monocle", "🕶️"], crown: ["horns", "👑"], horns: ["crown", "👑"], monocle: ["glasses"], "👑": ["crown", "horns"], "🕶️": ["glasses"] };
  const EMOJIS = [
    { e: "👑", at: [0, -1.4], s: 1.25, say: "Crown sticker 👑" },
    { e: "🕶️", at: [0, 0.03], s: 1.45, front: true, say: "Cool queen 😎" },
    { e: "🌸", at: [-1.0, -0.8], s: 0.6 },
    { e: "💙", at: [1.05, 0.2], s: 0.5 },
    { e: "✨", at: [-1.05, 0.25], s: 0.5 },
    { e: "🎀", at: [0.85, -1.05], s: 0.65 },
    { e: "🐶", at: [1.15, 1.25], s: 0.75, say: () => `${(CONFIG.dogs || ["Tobby"])[0]} says hi 🐶` },
    { e: "⭐", at: [-0.95, -1.25], s: 0.5 },
    { e: "🦋", at: [1.1, -0.65], s: 0.55 },
  ];
  const DONE = ["Masterpiece 😂🎨", "Don't be mad 🙈", "Art. 10/10 🖼️", "Picasso who? 😎", "Perfect. Frame it 😂"];

  // ---------- build: an overlay on the photo, the boy, his bubble, a clean button ----------
  const lb = document.getElementById("lightbox"), img = document.getElementById("lb-img");
  if (!lb || !img) return;
  const art = document.createElementNS(NS, "svg");
  art.setAttribute("class", "lb-art");
  art.setAttribute("aria-hidden", "true");
  const boy = document.createElement("div");
  boy.className = "lb-boy";
  boy.setAttribute("aria-hidden", "true");
  const bub = document.createElement("div");
  bub.className = "lb-bubble";
  const clean = document.createElement("button");
  clean.type = "button";
  clean.className = "lb-clean";
  clean.textContent = "🧽 Clean her face";
  clean.hidden = true;
  lb.append(art, boy, bub, clean);

  // borrow the boy's drawing from the page and give him a giant pencil
  let lead = null;
  function buildBoy() {
    if (boy.firstChild) return true;
    const src = document.querySelector(".buddy .buddy-svg");
    if (!src) return false;
    const svg = src.cloneNode(true);
    const pen = document.createElementNS(NS, "g");
    pen.setAttribute("class", "lb-pencil");
    pen.innerHTML = `<rect x="64.5" y="84" width="7" height="8" rx="1.5" fill="#f9a8d4"/><rect x="64.5" y="91" width="7" height="2.5" fill="#cbd5e1"/>
      <rect x="64.5" y="93.5" width="7" height="40" fill="#fbbf24"/><rect x="67" y="93.5" width="2" height="40" fill="#f59e0b"/>
      <path d="M64.5 133.5 L71.5 133.5 L68 142.5Z" fill="#fde2b8"/><path class="lb-lead" d="M66.6 139 L69.4 139 L68 142.5Z" fill="#1d4ed8"/>`;
    svg.querySelector(".b-arm-r").prepend(pen);
    boy.appendChild(svg);
    lead = boy.querySelector(".lb-lead");
    return true;
  }
  // where the pencil tip is, as a fraction of his box, with the arm raised ARM degrees around the shoulder
  const ARM = -112; // keep in sync with .lb-boy.drawing .b-arm-r in style.css
  const TIP = (() => {
    const a = (ARM * Math.PI) / 180, L = 142.5 - 72;
    return [(68 - L * Math.sin(a)) / 100, (72 + L * Math.cos(a) + 70) / 220];
  })();

  // ---------- geometry ----------
  let face = null, M = null, rect = null, natW = 1, natH = 1, unit = 1, angle = 0, pxPerUnit = 1, bw = 70, bh = 154;
  let Z = 1, wx = 0, wy = 0; // zoom on her face: scale, and the top-left of the zoomed window (photo px on screen)
  function measure() {
    const keep = Z;
    zoom(1, false);
    rect = img.getBoundingClientRect();
    natW = img.naturalWidth || 1; natH = img.naturalHeight || 1;
    Object.assign(art.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    art.setAttribute("viewBox", `0 0 ${natW} ${natH}`);
    bh = Math.max(96, Math.min(160, rect.height * 0.32));
    bw = (bh * 100) / 220;
    boy.style.width = `${bw}px`; boy.style.height = `${bh}px`;
    if (!face) return;
    const P = (p) => [(p[0] / 100) * natW, (p[1] / 100) * natH];
    const [e1, e2] = face.eyes.map(P), m = P(face.mouth);
    const c = [(e1[0] + e2[0]) / 2, (e1[1] + e2[1]) / 2];
    const X = [e2[0] - e1[0], e2[1] - e1[1]], Y = [m[0] - c[0], m[1] - c[1]];
    M = [X[0], X[1], Y[0], Y[1], c[0], c[1]];
    unit = Math.hypot(Y[0], Y[1]);
    angle = (Math.atan2(X[1], X[0]) * 180) / Math.PI;
    pxPerUnit = ((Math.hypot(X[0], X[1]) + unit) / 2) * (rect.width / natW);
    if (keep !== 1) zoom(keep, false);
  }
  // the camera zooms in on her face so the doodles are big enough to see on a phone
  function zoom(z, animate = true) {
    Z = z;
    const W = rect ? rect.width : 0, H = rect ? rect.height : 0;
    if (z === 1 || !face) { wx = wy = 0; Z = 1; }
    else {
      const [fx, fy] = toNat([0, 0.25]).map((v, i) => (v / (i ? natH : natW)) * (i ? H : W));
      wx = Math.max(0, Math.min(W - W / Z, fx - W / (2 * Z)));
      wy = Math.max(0, Math.min(H - H / Z, fy - H / (2 * Z)));
    }
    for (const el of [img, art]) {
      el.style.transition = animate ? "transform .8s ease, clip-path .8s ease" : "none";
      el.style.transformOrigin = "0 0";
      el.style.transform = Z === 1 ? "" : `translate(${-wx * Z}px, ${-wy * Z}px) scale(${Z})`;
      el.style.clipPath = Z === 1 ? "" : `inset(${wy}px ${W - wx - W / Z}px ${H - wy - H / Z}px ${wx}px round ${10 / Z}px)`;
    }
  }
  const toNat = ([x, y]) => [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]];
  const fromNat = ([X, Y]) => { // inverse of the face transform
    const det = M[0] * M[3] - M[1] * M[2], dx = X - M[4], dy = Y - M[5];
    return [(M[3] * dx - M[2] * dy) / det, (-M[1] * dx + M[0] * dy) / det];
  };
  const toScreen = ([x, y]) => [rect.left + ((x / natW) * rect.width - wx) * Z, rect.top + ((y / natH) * rect.height - wy) * Z];
  // where a doodle sits: on her nose, around her one visible eye in side photos, or on the whole face
  function anchor(d) {
    if (d.nose) return face.nose ? fromNat([(face.nose[0] / 100) * natW, (face.nose[1] / 100) * natH]) : [0, 0.5];
    if (d.eye) return face.profile ? [face.eye ? 0.5 : -0.5, 0] : [0.5, 0];
    return [0, 0];
  }

  // ---------- the boy ----------
  function placeBoy(x, y, drawing = true, ms = 0, flip = x < innerWidth * 0.42) {
    boy.classList.toggle("flip", flip); // stand on the side with more room
    boy.classList.toggle("drawing", drawing);
    boy.style.transitionDuration = `${ms}ms`;
    bub.style.transitionDuration = `${ms}ms, 200ms`;
    const tx = flip ? 1 - TIP[0] : TIP[0];
    const left = drawing ? x - tx * bw : x, top = drawing ? y - TIP[1] * bh : y;
    boy.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
    const bx = Math.min(innerWidth - 186, Math.max(6, left + bw / 2 - 90));
    bub.style.transform = `translate(${Math.round(bx)}px, ${Math.round(Math.max(6, top + bh * 0.1 - 48))}px)`;
  }
  let bubTimer = 0;
  function say(t, ms = 2200) {
    bub.textContent = t;
    bub.classList.add("show");
    boy.classList.add("talk");
    clearTimeout(bubTimer);
    bubTimer = setTimeout(() => { bub.classList.remove("show"); boy.classList.remove("talk"); }, ms);
    if (Sound.fx.babble) Sound.fx.babble(t);
  }

  // ---------- drawing ----------
  let run = 0, extras = 0, busy = false;
  const alive = (id) => id === run && lb.classList.contains("open");
  async function drawDoodle(name, id) {
    const d = DOODLES[name], color = d.color || pick(INK);
    if (lead) lead.setAttribute("fill", color);
    const [ax, ay] = anchor(d);
    const g = document.createElementNS(NS, "g");
    g.setAttribute("transform", `matrix(${M.join(" ")}) translate(${ax} ${ay})`);
    g.setAttribute("class", "lb-ink");
    g.dataset.k = name;
    art.appendChild(g);
    if (d.say) say(pick(d.say), 1800);
    const width = Math.max(2, d.w * Math.min(1, rect.width / 340)) / (pxPerUnit * Z); // in face units
    for (const pd of d.paths) {
      if (!alive(id)) return;
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", pd);
      p.setAttribute("fill", "none");
      p.setAttribute("stroke", color);
      p.setAttribute("stroke-width", width);
      p.setAttribute("stroke-linecap", "round");
      p.setAttribute("stroke-linejoin", "round");
      g.appendChild(p);
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len} ${len}`;
      p.style.strokeDashoffset = `${len}`;
      // move the pencil to the start of this line, then draw it
      const s0 = p.getPointAtLength(0), [sx, sy] = toScreen(toNat([s0.x + ax, s0.y + ay]));
      placeBoy(sx, sy, true, 260);
      await wait(280);
      if (!alive(id)) return;
      fx("scribble");
      const dur = Math.max(280, Math.min(900, len * 520));
      await new Promise((res) => {
        const t0 = performance.now();
        const step = (t) => {
          if (!alive(id)) return res();
          const k = Math.min(1, Math.max(0, (t - t0) / dur));
          p.style.strokeDashoffset = `${len * (1 - k)}`;
          const q = p.getPointAtLength(len * k), [x, y] = toScreen(toNat([q.x + ax, q.y + ay]));
          placeBoy(x, y, true, 0);
          if (k < 1) requestAnimationFrame(step); else res();
        };
        requestAnimationFrame(step);
      });
      if (d.fill) p.setAttribute("fill", color);
    }
  }
  async function stick(em, id) {
    const [x, y] = toNat(em.at);
    placeBoy(...toScreen([x, y]), true, 300);
    await wait(320);
    if (!alive(id)) return;
    const t = document.createElementNS(NS, "text");
    t.textContent = em.e;
    t.setAttribute("x", x); t.setAttribute("y", y);
    t.setAttribute("font-size", unit * em.s);
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("dominant-baseline", "central");
    t.setAttribute("class", "lb-sticker");
    const g = document.createElementNS(NS, "g"); // tilt with her head; the sticker itself pops in
    g.setAttribute("transform", `rotate(${angle.toFixed(1)} ${x} ${y})`);
    g.dataset.k = em.e;
    g.appendChild(t);
    art.appendChild(g);
    fx("pop");
    if (em.say) say(typeof em.say === "function" ? em.say() : em.say, 1600);
    await wait(260);
  }
  // pick a few doodles and stickers that don't clash with each other or with what's already on her
  function plan(n, m) {
    const used = new Set([...art.querySelectorAll("[data-k]")].map((e) => e.dataset.k));
    const blocked = new Set();
    const take = (k) => { used.add(k); (CLASH[k] || []).forEach((c) => blocked.add(c)); };
    used.forEach((k) => (CLASH[k] || []).forEach((c) => blocked.add(c)));
    const ds = [], es = [];
    for (const k of shuffle(Object.keys(DOODLES))) {
      if (ds.length >= n) break;
      if (used.has(k) || blocked.has(k) || (face.profile && FRONT_ONLY.includes(k))) continue;
      if (k === "monocle" && !face.profile && Math.random() < 0.6) continue;
      ds.push(k); take(k);
    }
    for (const e of shuffle(EMOJIS)) {
      if (es.length >= m) break;
      if (used.has(e.e) || blocked.has(e.e) || (e.front && face.profile)) continue;
      es.push(e); take(e.e);
    }
    return { ds, es };
  }
  async function perform(n, m, id, intro) {
    const { ds, es } = plan(n, m);
    if (!ds.length && !es.length) { say("She's too pretty to cover any more 😅"); return; }
    busy = true;
    if (intro) say(intro, 1500);
    for (const k of ds) {
      if (!alive(id)) break;
      await drawDoodle(k, id);
      await wait(150);
    }
    for (const e of es) {
      if (!alive(id)) break;
      await stick(e, id);
    }
    busy = false;
    if (!alive(id)) return;
    rest();
    say(pick(DONE), 2600);
    fx("giggle");
    clean.hidden = false;
  }
  // after drawing he steps back to a bottom corner of the photo, away from her face
  function rest() {
    const faceLeft = toScreen(toNat([0, 0]))[0] < rect.left + rect.width / 2;
    const x = faceLeft ? Math.min(innerWidth - bw - 6, rect.right - bw * 0.7) : Math.max(6, rect.left - bw * 0.3);
    const y = Math.min(innerHeight - bh - 6, rect.bottom - bh * 0.8);
    placeBoy(x, y, false, 450, !faceLeft);
  }

  // ---------- start / stop ----------
  function wipe() { art.textContent = ""; clean.hidden = true; }
  function stop() {
    run++;
    busy = false;
    wipe();
    zoom(1, false);
    boy.classList.remove("show", "drawing", "talk");
    bub.classList.remove("show");
    face = null;
  }
  async function start(photo) {
    stop();
    if (!photo || !photo.face || !buildBoy()) return;
    const id = run;
    if (!img.complete || !img.naturalWidth) {
      await new Promise((r) => { img.addEventListener("load", r, { once: true }); setTimeout(r, 3000); });
    }
    await wait(650);
    if (!alive(id) || !img.naturalWidth) return;
    face = photo.face;
    extras = 0;
    measure();
    zoom(Math.max(1, Math.min(3.2, Math.min(60, rect.width * 0.17) / (unit * (rect.width / natW)))));
    // he runs in from the bottom corner on the far side of her face
    const [fx0, fy0] = toScreen(toNat([0, 0]));
    placeBoy(fx0 < innerWidth / 2 ? innerWidth + 20 : -bw - 20, innerHeight, false, 0);
    void boy.offsetWidth;
    boy.classList.add("show");
    fx("whoosh");
    placeBoy(fx0, fy0 + bh * 0.25, true, 800);
    await wait(850);
    if (!alive(id)) return;
    await perform(lite() ? 2 : 3, 2, id, pick(["Hehe, can I draw on this one? 😈", "Ooh a photo of her! ✏️", "Hold still, Ishani 😆", "Art time 🎨😂"]));
  }
  window.boyDoodle = start;
  window.boyDoodleStop = stop;

  // tap the photo: he adds one more thing
  img.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!face || busy) return;
    extras++;
    if (extras > 6) { say("Okay okay, she's too pretty to cover 😅"); return; }
    perform(1, Math.random() < 0.5 ? 1 : 0, run, pick(["One more! 😆", "Wait, I forgot something ✏️", "Hehe more 😈"]));
  });
  clean.addEventListener("click", (e) => {
    e.stopPropagation();
    if (busy) return;
    art.querySelectorAll(".lb-ink, .lb-sticker").forEach((n) => n.classList.add("wipe"));
    fx("puff");
    setTimeout(wipe, 450);
    say(pick(["Noooo my art 😭", "Fine… she's prettier without it anyway 😌", "Hey! That took me forever 😤"]), 2400);
  });
  addEventListener("resize", () => {
    if (!face || !lb.classList.contains("open")) return;
    measure();
    art.querySelectorAll(".lb-ink").forEach((g) => g.setAttribute("transform", g.getAttribute("transform").replace(/^matrix\([^)]*\)/, `matrix(${M.join(" ")})`)));
    if (!busy) rest();
  });

  // her round photo at the top opens her big photo (and he comes to draw on it)
  const av = document.querySelector(".avatar-wrap");
  if (av) {
    av.insertAdjacentHTML("beforeend", `<span class="tap-badge">👀 tap me</span>`);
    av.addEventListener("click", () => {
      const i = Math.max(0, CONFIG.photos.findIndex((p) => p.src === CONFIG.avatar));
      if (window.openLightbox) openLightbox(i);
    });
  }
})();
