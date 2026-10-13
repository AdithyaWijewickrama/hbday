/* =========================================================
   👦  BUDDY: a little party boy who follows her down the page
   (rope, parachute, wall), sits on the page's own elements,
   uses his arms and legs, looks around, talks and makes sounds.
   ========================================================= */
(() => {
  const q = (s, el = document) => el.querySelector(s);
  const qa = (s, el = document) => [...el.querySelectorAll(s)];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const SKIN = "#ffd7b5", HAIR = "#6b4430", SHIRT = "#2f7bf0", PANTS = "#4a5b8c";
  const SVG = `
  <svg class="buddy-svg" viewBox="0 -70 100 220" overflow="visible">
    <line class="b-rope" x1="81" y1="-3000" x2="81" y2="44" stroke="#a9773f" stroke-width="3" />
    <g class="b-chute">
      <path d="M2 -24 Q50 -96 98 -24 Q86 -32 74 -24 Q62 -32 50 -24 Q38 -32 26 -24 Q14 -32 2 -24Z" fill="#38bdf8" />
      <path d="M26 -24 Q38 -32 50 -24 Q50 -78 50 -86 Q30 -78 26 -24Z" fill="#ffe066" />
      <path d="M74 -24 Q62 -32 50 -24 Q50 -78 50 -86 Q70 -78 74 -24Z" fill="#7ee8c7" />
      <g stroke="#9a8aa8" stroke-width="1"><line x1="3" y1="-24" x2="45" y2="88" /><line x1="50" y1="-24" x2="46" y2="88" /><line x1="50" y1="-24" x2="54" y2="88" /><line x1="97" y1="-24" x2="55" y2="88" /></g>
    </g>
    <g class="buddy-legs">
      <g class="b-leg-l"><rect x="40" y="95" width="8.5" height="19" rx="4.2" fill="${PANTS}" /><ellipse cx="44" cy="116" rx="7" ry="4.2" fill="#38bdf8" /><ellipse cx="42" cy="114.6" rx="2.2" ry="1.1" fill="#fff" opacity=".7" /></g>
      <g class="b-leg-r"><rect x="51.5" y="95" width="8.5" height="19" rx="4.2" fill="${PANTS}" /><ellipse cx="56" cy="116" rx="7" ry="4.2" fill="#38bdf8" /><ellipse cx="54" cy="114.6" rx="2.2" ry="1.1" fill="#fff" opacity=".7" /></g>
    </g>
    <path d="M34 80 Q34 66 50 66 Q66 66 66 80 L66 95 Q66 101 58 101 L42 101 Q34 101 34 95Z" fill="${SHIRT}" />
    <path d="M42 66 Q50 73 58 66" fill="#fff" opacity=".85" />
    <path d="M50 79 l2.2 4.6 5 .6 -3.7 3.4 1 5 -4.5 -2.5 -4.5 2.5 1 -5 -3.7 -3.4 5 -.6Z" fill="#ffe066" />
    <g class="b-head">
      <circle cx="22.5" cy="46" r="5" fill="${SKIN}" /><circle cx="77.5" cy="46" r="5" fill="${SKIN}" />
      <circle cx="50" cy="42" r="28" fill="${SKIN}" />
      <path d="M22 41 Q21 12 50 12 Q79 12 78 41 Q74 28 63 29 Q58 21 49 27 Q41 21 35 30 Q26 29 22 41Z" fill="${HAIR}" />
      <path d="M49 13 Q44 3 52 0 Q49 6 55 10" fill="none" stroke="${HAIR}" stroke-width="3" stroke-linecap="round" />
      <g class="b-hat">
        <path d="M55 15 L70 13 L60 -12Z" fill="#ffe066" />
        <path d="M57.5 9 L67 7.8 M59.5 2 L65 1.4" stroke="#38bdf8" stroke-width="2.4" stroke-linecap="round" />
        <circle cx="60" cy="-13" r="3.6" fill="#38bdf8" />
      </g>
      <g class="b-eyes">
        <g class="b-eyes-open"><g class="b-blink">
          <ellipse cx="40" cy="46" rx="4.4" ry="5.5" fill="#2b1d2a" /><ellipse cx="60" cy="46" rx="4.4" ry="5.5" fill="#2b1d2a" />
          <circle cx="41.8" cy="43.6" r="1.7" fill="#fff" /><circle cx="61.8" cy="43.6" r="1.7" fill="#fff" />
          <circle cx="38.7" cy="48.6" r=".8" fill="#fff" /><circle cx="58.7" cy="48.6" r=".8" fill="#fff" />
        </g></g>
        <g class="b-eyes-shut" fill="none" stroke="#2b1d2a" stroke-width="2.2" stroke-linecap="round">
          <path d="M35.5 46 Q40 50.5 44.5 46" /><path d="M55.5 46 Q60 50.5 64.5 46" />
        </g>
      </g>
      <ellipse cx="32.5" cy="54" rx="4.6" ry="3" fill="#ff9bb8" opacity=".75" /><ellipse cx="67.5" cy="54" rx="4.6" ry="3" fill="#ff9bb8" opacity=".75" />
      <path class="m-smile" d="M45 55 Q50 60 55 55" fill="none" stroke="#7a3b3b" stroke-width="2" stroke-linecap="round" />
      <ellipse class="m-o" cx="50" cy="57" rx="2.8" ry="3.3" fill="#7a3b3b" />
      <g class="m-open"><path d="M43 54 Q50 66 57 54Z" fill="#7a3b3b" /><path d="M46.5 59.5 Q50 63 53.5 59.5 Q50 58 46.5 59.5Z" fill="#ff7b9c" /></g>
      <path class="m-sad" d="M45 59 Q50 54.5 55 59" fill="none" stroke="#7a3b3b" stroke-width="2" stroke-linecap="round" />
      <circle class="b-gum" cx="50" cy="60" r="8" fill="#bfdbfe" fill-opacity=".85" stroke="#60a5fa" stroke-width="1" />
      <g class="b-dizzy" fill="none" stroke="#2b1d2a" stroke-width="1.7" stroke-linecap="round">
        <path class="dz" d="M40 46 m0 -1 a1 1 0 1 1 -1 1 a2.2 2.2 0 1 1 2.2 2.2 a3.4 3.4 0 1 1 -3.4 -3.4" />
        <path class="dz" d="M60 46 m0 -1 a1 1 0 1 1 -1 1 a2.2 2.2 0 1 1 2.2 2.2 a3.4 3.4 0 1 1 -3.4 -3.4" />
      </g>
      <g class="b-zz" fill="#7a6a9a" font-family="Quicksand, sans-serif" font-weight="700"><text x="74" y="16" font-size="10">z</text><text x="82" y="6" font-size="13">Z</text></g>
    </g>
    <g class="b-arm-l"><rect x="28" y="70" width="8" height="21" rx="4" fill="${SHIRT}" /><circle cx="32" cy="92.5" r="4.8" fill="${SKIN}" /></g>
    <g class="b-arm-r"><rect x="64" y="70" width="8" height="21" rx="4" fill="${SHIRT}" /><circle cx="68" cy="92.5" r="4.8" fill="${SKIN}" /></g>
  </svg>`;

  // ---------- build ----------
  const wall = document.createElement("div");
  wall.className = "buddy-wall";
  wall.setAttribute("aria-hidden", "true");
  const el = document.createElement("div");
  el.className = "buddy";
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = `<div class="buddy-bubble"><span class="bb-text"></span><span class="bb-ask"><button type="button" data-a="yes">Yes, come 💛</button><button type="button" data-a="no">Not now</button></span></div>
    <div class="buddy-prop" aria-hidden="true">🤳</div><button class="buddy-shoo" type="button" aria-label="Tell him to go away">go away 👋</button><div class="buddy-body">${SVG}</div>`;
  const bubble = q(".buddy-bubble", el), bubbleText = q(".bb-text", el);
  const soundBtn = document.createElement("button");
  soundBtn.className = "sound-btn";
  soundBtn.setAttribute("aria-label", "Sound on or off");
  const paintSoundBtn = () => (soundBtn.textContent = Sound.isMuted() ? "🔇" : "🔊");
  paintSoundBtn();
  soundBtn.addEventListener("click", () => { Sound.setMuted(!Sound.isMuted()); paintSoundBtn(); if (!Sound.isMuted()) Sound.fx.pop(); });
  document.body.append(wall, el, soundBtn);
  addEventListener("pointerdown", () => Sound.unlock(), { once: true, capture: true });

  // ---------- state ----------
  let active = false, mode = "", action = "", actionTimer, bubbleTimer, talkTimer, gazeTimer, stopTimer;
  let bx = innerWidth - 100, by = innerHeight * 0.6, perch = null, lastSection = "", lastY = 0, downCount = 0;
  let lastInteraction = performance.now(), lastSound = 0, followUntil = 0, lastFollow = 0;
  let entering = false, lastQ = 0, qGap = 25000, qCb = null, qTimer, asked = [];
  let gone = false, peeking = false, sneakDist = 0, lastGone = 0, fellLast = false, peekTimer, askTimer;
  let tiltRaw = 0, tiltS = 0, hasTilt = false, holding = false, holdSince = 0, hardSince = 0;
  const W = () => el.offsetWidth, H = () => el.offsetHeight;
  const SEAT = 170 / 220;  // seat (y=100 in the viewBox) as a fraction of his height
  const HEAD = 112 / 220;  // eyes level

  function moveTo(x, y, fast = false) {
    bx = clamp(x, 4, innerWidth - W() - 4);
    by = y;
    el.classList.toggle("fast", fast);
    el.style.setProperty("--bx", `${Math.round(bx)}px`);
    el.style.setProperty("--by", `${Math.round(by)}px`);
    el.classList.toggle("bubble-right", bx + W() / 2 < innerWidth / 2);
  }

  function setMode(m) {
    if (m === mode) return;
    el.classList.remove(`m-${mode}`);
    el.classList.add(`m-${m}`);
    document.body.classList.toggle("climbing", m === "climb");
    mode = m;
    if (m === "hang") { moveTo(bx, innerHeight * 0.06); sfx("zip"); }
    if (m === "para") { moveTo(bx, innerHeight * 0.1); sfx("whoosh"); }
    if (m === "climb") { moveTo(innerWidth - W() - 12, innerHeight * 0.3); sfx("step"); setTimeout(() => sfx("step"), 220); }
  }

  function sfx(name, ...args) {
    const now = performance.now();
    if (now - lastSound < 120) return;
    lastSound = now;
    Sound.fx[name] && Sound.fx[name](...args);
  }

  // ---------- where to sit ----------
  const SECTIONS = [
    { key: "hero", sel: ".hero", perch: [".avatar-wrap", "#celebrate", ".title"] },
    { key: "quiz", sel: "#quiz", perch: ["#quiz-card", "#quiz h2"] },
    { key: "cake", sel: ".cake-section", perch: [".cake-actions .btn:not([hidden])", ".feed-title", ".cake-section h2"] },
    { key: "gallery", sel: ".gallery-section", perch: [".polaroid", ".gallery-section h2"] },
    { key: "reasons", sel: ".reasons-section", perch: [".card", ".reasons-section h2"] },
    { key: "message", sel: ".message-section", perch: [".letter", ".message-section h2"] },
    { key: "footer", sel: "footer", perch: ["#again"] },
  ];
  function currentSection() {
    const mid = innerHeight / 2;
    for (const s of SECTIONS) {
      const r = q(s.sel).getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) return s;
    }
    return SECTIONS.find((s) => s.key === lastSection) || SECTIONS[0];
  }
  function perchSpot(target) {
    const r = target.getBoundingClientRect();
    const w = W(), h = H();
    const right = r.right - w * 0.85;
    const x = right + w <= innerWidth - 4 ? right : r.left - w * 0.15;
    return { x, y: r.top - h * SEAT };
  }
  function choosePerch(sec) {
    const h = H(), minTop = h * (SEAT - 0.36) + 8, maxTop = innerHeight - 30;
    let best = null, bestScore = Infinity;
    sec.perch.forEach((sel, order) => {
      qa(sel).forEach((t) => {
        const r = t.getBoundingClientRect();
        if (!r.width || r.top < minTop || r.top > maxTop || r.right < 40 || r.left > innerWidth - 40) return;
        const score = Math.abs(r.top - innerHeight * 0.5) + order * 140;
        if (score < bestScore) { bestScore = score; best = t; }
      });
    });
    return best;
  }

  function land(arrive = false) {
    if (gone) return;
    setMode("sit");
    const sec = currentSection();
    perch = choosePerch(sec);
    const p = perch ? perchSpot(perch) : { x: innerWidth - W() - 8, y: innerHeight - H() * 0.97 };
    if (arrive && Math.random() < 0.65) enter(p, pick(["left", "right", "bottom"]));
    else moveTo(p.x, p.y);
    setTimeout(() => sfx("pop"), 700);
    if (sec.key !== lastSection) {
      lastSection = sec.key;
      setTimeout(() => instruct(sec.key), 900);
    }
  }

  // keep sitting on the element if the page shifts under him
  setInterval(() => {
    if (!active || gone || holding || entering || mode !== "sit" || !perch || !perch.isConnected) return;
    const p = perchSpot(perch);
    if (Math.abs(p.y - by) > 6 || Math.abs(clamp(p.x, 4, innerWidth - W() - 4) - bx) > 6) {
      const r = perch.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) land(); else moveTo(p.x, p.y, true);
    }
  }, 900);

  // ---------- what he tells her in each part ----------
  const LINES = {
    hero: () => ["Hi Ishani! 👋 Press Celebrate!", "#celebrate", "wave"],
    quiz: () => [q("#q-start") ? "Quiz time! Press Let's go 👀" : "Answer honestly… I'm watching 👀", "#q-start, #quiz-stage .q-btn:not(:disabled), #quiz-stage .q-input, #quiz-stage .btn", "think"],
    cake: () => q("#feed.show") ? ["Feed everyone! Tap their faces 🍰", ".friend:not(.fed) .face", "rub"]
      : cakePhase() === "cut" ? ["Swipe across the cake to cut it 🔪", "#cake", "point"]
      : cakePhase() === "blow" ? ["Blow! Swipe over the flames 🌬️", ".c3:not(.out)", "point"]
      : ["Spin the cake 👆 then make a wish 🙏", "#wish-btn", "point"],
    gallery: () => ["Look at these! 😍 Tap one", ".polaroid", "point"],
    reasons: () => ["Flip every card, they're all true 🃏", ".card:not(.flipped)", "point"],
    message: () => ["Read this one slowly 💌", ".letter", "point"],
    footer: () => ["One more party? 🎊", "#again", "dance"],
  };
  function instruct(key) {
    const [text, targetSel, act] = LINES[key]();
    say(text, 4200);
    const t = targetSel && qa(targetSel).find((n) => { const r = n.getBoundingClientRect(); return r.width && r.bottom > 0 && r.top < innerHeight; });
    if (act === "point" || (t && act !== "peek" && act !== "think")) pointAt(t, 2600);
    else doAction(act, 2600);
  }

  // ---------- body language ----------
  function clearAction() {
    if (action) el.classList.remove(`a-${action}`);
    action = "";
    el.classList.remove("f-o", "f-open", "f-sad");
    ["--al", "--ar", "--tilt", "--gx", "--gy"].forEach((v) => el.style.removeProperty(v));
  }
  function doAction(name, ms = 1800, face = "") {
    if (!active || !name || (gone && !peeking)) return;
    clearAction();
    clearTimeout(actionTimer);
    action = name;
    el.classList.add(`a-${name}`);
    if (face) el.classList.add(`f-${face}`);
    actionTimer = setTimeout(clearAction, ms);
  }
  function pointAt(target, ms = 2400) {
    if (!target) return doAction("wave", ms);
    clearAction();
    clearTimeout(actionTimer);
    const r = target.getBoundingClientRect();
    const tx = r.left + r.width / 2, ty = r.top + r.height / 2;
    const w = W(), h = H();
    const useRight = tx > bx + w / 2;
    const sx = bx + (useRight ? 0.68 : 0.32) * w, sy = by + (142 / 220) * h;
    const ang = Math.atan2(ty - sy, tx - sx) * 180 / Math.PI - 90;
    el.style.setProperty(useRight ? "--ar" : "--al", `${ang}deg`);
    lookAt(tx, ty);
    el.classList.add("f-o");
    action = "point";
    actionTimer = setTimeout(clearAction, ms);
  }
  function lookAt(tx, ty) {
    const cx = bx + W() / 2, cy = by + HEAD * H();
    const dx = tx - cx, dy = ty - cy, len = Math.hypot(dx, dy) || 1;
    el.style.setProperty("--gx", `${(dx / len * 3.2).toFixed(2)}px`);
    el.style.setProperty("--gy", `${(dy / len * 2.6).toFixed(2)}px`);
    el.style.setProperty("--tilt", `${clamp(dx / len * 10, -10, 10).toFixed(1)}deg`);
  }

  // head and eyes wander around on their own
  function gaze() {
    clearTimeout(gazeTimer);
    gazeTimer = setTimeout(gaze, rnd(1300, 3400));
    if (gone && !peeking && performance.now() - lastGone > 25000) { sneak(); return; }
    if (!active || gone || holding || action || performance.now() < followUntil) return;
    if (mode === "sit" && !entering && !bubble.classList.contains("show") && performance.now() - lastQ > qGap) { askQuestion(); return; }
    const idle = performance.now() - lastInteraction;
    if (mode === "sit" && !entering && idle > 15000 && Math.random() < 0.4) {
      lastInteraction = performance.now();
      bored();
      return;
    }
    const roll = Math.random();
    if (roll > 0.9) { // eyes roll around in a little circle
      [[-3.2, 0], [-2.4, -2.4], [0, -3.2], [2.4, -2.4], [3.2, 0], [0, 0]].forEach(([x, y], i) => setTimeout(() => {
        if (action || holding) return;
        el.style.setProperty("--gx", `${x}px`); el.style.setProperty("--gy", `${y}px`);
      }, i * 150));
      return;
    }
    if (roll > 0.8) { // quick side-eye, then back
      const side = Math.random() < 0.5 ? -3.4 : 3.4;
      el.style.setProperty("--gx", `${side}px`); el.style.setProperty("--gy", "0.6px");
      setTimeout(() => { if (!action && !holding) el.style.setProperty("--gx", "0px"); }, 650);
      setTimeout(() => { if (!action && !holding) el.style.setProperty("--gx", `${side}px`); }, 1100);
      return;
    }
    if (roll < 0.35) {
      const things = qa("img, .btn, .q-btn, .card, .c3, h2").filter((n) => { const r = n.getBoundingClientRect(); return r.width && r.top > 0 && r.bottom < innerHeight; });
      const t = pick(things);
      if (t) { const r = t.getBoundingClientRect(); lookAt(r.left + r.width / 2, r.top + r.height / 2); return; }
    }
    if (roll < 0.55) { // look at her (the screen)
      el.style.setProperty("--gx", "0px"); el.style.setProperty("--gy", "0px"); el.style.setProperty("--tilt", `${rnd(-4, 4).toFixed(1)}deg`);
    } else if (roll < 0.7) { // look up at the sky
      el.style.setProperty("--gx", `${rnd(-1.5, 1.5).toFixed(1)}px`); el.style.setProperty("--gy", "-2.8px"); el.style.setProperty("--tilt", `${rnd(-8, 8).toFixed(1)}deg`);
    } else { // look around
      el.style.setProperty("--gx", `${rnd(-3.2, 3.2).toFixed(1)}px`); el.style.setProperty("--gy", `${rnd(-2, 2.4).toFixed(1)}px`); el.style.setProperty("--tilt", `${rnd(-12, 12).toFixed(1)}deg`);
    }
    if (mode === "sit" && Math.random() < 0.12) doAction(pick(["wave", "dance", "rub"]), 1600);
  }

  // ---------- talking ----------
  function say(text, ms = 3200) {
    if (!active || !text || (gone && !peeking)) return;
    sayRaw(text, ms);
  }
  function sayRaw(text, ms = 3200) {
    bubbleText.textContent = text;
    el.classList.remove("asking");
    qCb = null;
    clearTimeout(qTimer);
    fitBubble();
    bubble.classList.add("show");
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove("show"), ms);
    el.classList.add("talking");
    clearTimeout(talkTimer);
    talkTimer = setTimeout(() => el.classList.remove("talking"), Math.min(1100, 160 + text.length * 22));
    Sound.fx.babble(text);
  }

  // keep the speech bubble on screen
  function fitBubble() {
    bubble.style.translate = "";
    const left = bx + bubble.offsetLeft, right = left + bubble.offsetWidth;
    let dx = 0;
    if (right > innerWidth - 6) dx = innerWidth - 6 - right;
    if (left + dx < 6) dx = 6 - left;
    if (dx) bubble.style.translate = `${Math.round(dx)}px 0`;
  }

  // reactions from the rest of the page pick a gesture + sound from the mood of the line
  function react(text, big = false) {
    if (!active || gone) return;
    lastInteraction = performance.now();
    say(text);
    if (holding) return;
    const t = text || "";
    setTimeout(() => {
      if (/😂|🤭|😆|Haha|Hehe|giggle/i.test(t)) { doAction("laugh", 1500, "open"); sfx("giggle"); }
      else if (/🙈|Wrong|Nope|Seriously|😅/i.test(t)) { doAction("facepalm", 1600, "sad"); sfx("uhoh"); }
      else if (/👏|Correct|Smart|Easy|Perfect/i.test(t)) { doAction("clap", 1300, "open"); sfx("clap", 3); }
      else if (/Nom|Delicious|chew|Me next/i.test(t)) { doAction("rub", 1800, "open"); }
      else if (/😍|🤩|Gorgeous|smile|favourite/i.test(t)) { doAction("cheer", 1200, "o"); sfx("sparkle"); }
      else if (/wish|🤫|heard/i.test(t)) { doAction("peek", 1800); sfx("pop"); }
      else if (/Almost|💪/i.test(t)) { doAction("think", 1500); sfx("pop"); }
      else if (big) { doAction("cheer", 1300, "open"); sfx("yay"); }
      else { doAction("wave", 1200); sfx("pop"); }
    }, 60);
  }

  // ---------- scrolling = travelling ----------
  function onScroll() {
    if (!active) return;
    const y = scrollY, d = y - lastY;
    if (Math.abs(d) < 6) return;
    lastY = y;
    lastInteraction = performance.now();
    if (gone) { sneakWatch(Math.abs(d)); return; }
    if (holding) letGo();
    clearAction();
    perch = null;
    if (d > 0) { if (mode !== "hang" && mode !== "para") setMode(++downCount % 2 ? "hang" : "para"); }
    else setMode("climb");
    clearTimeout(stopTimer);
    stopTimer = setTimeout(() => land(true), 650);
  }

  function start() {
    if (active) return;
    active = true;
    Sound.unlock();
    soundBtn.classList.add("show");
    lastY = scrollY;
    moveTo(innerWidth - W() - 20, -H());
    el.classList.add("on");
    requestAnimationFrame(() => { setMode("para"); });
    lastSection = "hero";
    setTimeout(() => {
      land();
      setTimeout(() => react("Surprise!! 🎉 Happy birthday!", true), 700);
      setTimeout(() => { if (!gone && currentSection().key === "hero") instruct("hero"); }, 4200);
    }, 1500);
    addEventListener("scroll", onScroll, { passive: true });
    // phones fire "resize" whenever the address bar slides; only re-perch when the width really changes
    let lastW = innerWidth;
    addEventListener("resize", () => { if (innerWidth === lastW) return; lastW = innerWidth; if (mode === "sit" && !gone) land(); });
    addEventListener("pointerdown", () => (lastInteraction = performance.now()), { passive: true });
    gaze();
    saccade();
  }

  // ---------- tiny eye darts + following her finger ----------
  function saccade() {
    setTimeout(saccade, rnd(260, 1100));
    if (!active || holding) return;
    if (Math.random() < 0.12) {
      el.classList.remove("blink2"); void el.offsetWidth; el.classList.add("blink2");
      setTimeout(() => el.classList.remove("blink2"), 600);
      return;
    }
    el.style.setProperty("--sx", `${rnd(-1.1, 1.1).toFixed(2)}px`);
    el.style.setProperty("--sy", `${rnd(-0.8, 0.8).toFixed(2)}px`);
  }
  function follow(e) {
    const now = performance.now();
    if (!active || gone || holding || action || mode !== "sit" || now - lastFollow < 90) return;
    lastFollow = now;
    followUntil = now + 1500;
    lookAt(e.clientX, e.clientY);
  }
  addEventListener("pointermove", follow, { passive: true });
  addEventListener("pointerdown", follow, { passive: true });

  // ---------- "go away" → sulks off, then sneaks back from behind things ----------
  const shoo = q(".buddy-shoo", el), askBox = q(".bb-ask", el);
  shoo.addEventListener("click", (e) => { e.stopPropagation(); fellLast = false; goAway(); });
  askBox.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    e.stopPropagation();
    if (peeking) answer(b.dataset.a === "yes");
    else if (qCb) qCb(b.dataset.a === "yes");
  });

  function hideNow() {
    peeking = false;
    el.classList.remove("on", "asking");
    setTimeout(() => { if (!peeking) { el.style.clipPath = ""; setMode("sit"); clearAction(); } }, 450);
  }
  function goAway(fell = false) {
    if (gone || !active) return;
    gone = true;
    clearTimeout(stopTimer);
    clearTimeout(actionTimer);
    perch = null;
    lastGone = performance.now();
    sneakDist = 0;
    if (fell) { hideNow(); return; }
    clearAction();
    action = "sulk";
    el.classList.add("a-sulk", "f-sad");
    sayRaw(pick(["Okay… 🥺", "Fine… I'll go 😔", "Hmph. Bye then 😢"]), 1500);
    sfx("uhoh");
    setTimeout(() => {
      el.classList.add("leaving");
      moveTo(bx, innerHeight + 40);
      setTimeout(() => { el.classList.remove("leaving"); hideNow(); }, 1100);
    }, 1300);
  }

  // she scrolled past something while he was away → maybe sneak back in
  function sneakWatch(dist) {
    sneakDist += dist;
    if (peeking) { // the thing he was hiding behind moved: duck out of sight
      clearTimeout(askTimer); clearTimeout(peekTimer);
      hideNow();
      sneakDist = innerHeight * 0.3;
    }
    clearTimeout(stopTimer);
    stopTimer = setTimeout(function check() {
      if (!gone || peeking || sneakDist < innerHeight * 0.6) return;
      const wait = 5000 - (performance.now() - lastGone);
      if (wait > 0) stopTimer = setTimeout(check, wait);
      else sneak();
    }, 900);
  }

  const CUT = 0.62; // he is visible above this fraction of his height (the top edge of the thing he hides behind)
  function sneak() {
    if (!gone || peeking) return;
    const w = W(), h = H();
    const spots = qa(".polaroid, .avatar-wrap, .friend .face, .card, #quiz-card, .letter")
      .map((n) => [n, n.getBoundingClientRect()])
      .filter(([, r]) => r.width >= w * 0.8 && r.left > -10 && r.right < innerWidth + 10 && r.top > Math.max(140, h * 0.45) && r.top < innerHeight * 0.75 && r.bottom - r.top > 60);
    if (!spots.length) return;
    const photos = spots.filter(([n]) => n.matches(".polaroid, .avatar-wrap, .face"));
    const [, r] = pick(photos.length ? photos : spots);
    peeking = true;
    lastGone = performance.now();
    clearAction();
    setMode("peek");
    el.classList.add("no-move");
    moveTo(r.left + rnd(0.1, 0.9) * Math.max(0, r.width - w), r.top - h * CUT);
    el.style.clipPath = `polygon(-400px -400px, calc(100% + 400px) -400px, calc(100% + 400px) ${Math.round(h * CUT)}px, -400px ${Math.round(h * CUT)}px)`;
    el.style.setProperty("--sink", `${Math.round(h * 0.5)}px`);
    void el.offsetWidth;
    el.classList.remove("no-move");
    el.classList.add("on");
    // 1) slowly, just the eyes come up over the edge
    setTimeout(() => { if (peeking) { el.style.setProperty("--sink", `${Math.round(h * 0.075)}px`); sfx("step"); } }, 150);
    // 2) eyes dart left and right, checking if it's safe
    let darts = 0;
    const dart = () => {
      if (!peeking || darts >= 4) return;
      el.style.setProperty("--gx", `${darts++ % 2 ? 3.4 : -3.4}px`);
      el.style.setProperty("--gy", "-0.5px");
      peekTimer = setTimeout(dart, 420);
    };
    peekTimer = setTimeout(dart, 1100);
    // 3) hands on the edge, whole face up, and he asks
    askTimer = setTimeout(() => {
      if (!peeking) return;
      el.style.setProperty("--sink", "0px");
      el.style.setProperty("--gx", "0px");
      el.style.setProperty("--gy", "0px");
      el.classList.add("a-peek");
      action = "peek";
      setAsk("Yes, come 💛", "Not now");
      sayRaw(fellLast ? "Ouch… that hurt 🤕 May I come out?" : pick(["Psst… may I come out? 👉👈", "Can I come out now? I'll be good 😇", "Is it safe? May I come out? 🥺"]), 12000);
      el.classList.add("asking");
      fitBubble();
      sfx("pop");
      askTimer = setTimeout(() => answer(false, true), 11000);
    }, 3100);
  }

  function answer(yes, timedOut = false) {
    if (!peeking) return;
    clearTimeout(askTimer); clearTimeout(peekTimer);
    el.classList.remove("asking");
    clearAction();
    if (yes) {
      gone = false;
      peeking = false;
      fellLast = false;
      el.style.clipPath = "";
      setMode("sit");
      sayRaw(pick(["Yaaay! Thank you!! 💛", "Yesss! I missed you 🥹", "Hehe, I'm back! 🎉"]), 2400);
      doAction("cheer", 1400, "open");
      sfx("yay");
      lastSection = currentSection().key; // don't repeat the instructions
      setTimeout(land, 1300);
      return;
    }
    el.classList.add("f-sad");
    sayRaw(timedOut ? "I'll be right here… 👀" : pick(["Okay… 😔", "Aww… later then 🥺"]), 1500);
    sfx("uhoh");
    setTimeout(() => {
      if (!peeking) return;
      el.style.setProperty("--sink", `${Math.round(H() * 0.5)}px`);
      lastGone = performance.now();
      sneakDist = 0;
      setTimeout(() => { if (gone && peeking) hideNow(); }, 800);
    }, 1000);
  }

  // ---------- phone tilt: he feels gravity, holds on, and falls off if it lasts ----------
  // Real gravity: which way is "down" on the screen, from the accelerometer.
  // Works however she holds the phone (upright, leaning back…), on Android and iPhone.
  const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  let gravSeen = 0;
  function onGravity(e) {
    const g = e.accelerationIncludingGravity;
    if (!g || g.x == null || g.y == null) return;
    gravSeen = performance.now();
    hasTilt = true;
    const sign = IOS ? -1 : 1; // iPhones report gravity the other way round
    const x = g.x * sign, y = g.y * sign;
    const ang = (((screen.orientation && screen.orientation.angle) || window.orientation || 0) * Math.PI) / 180;
    const sx = x * Math.cos(ang) + y * Math.sin(ang), sy = -x * Math.sin(ang) + y * Math.cos(ang);
    if (Math.hypot(sx, sy) < 3.5) { tiltRaw = 0; return; } // lying flat on a table: no "down" on the screen
    tiltRaw = (Math.atan2(-sx, sy) * 180) / Math.PI;
  }
  function onOrient(e) { // fallback for phones without a usable accelerometer
    if (e.gamma == null || performance.now() - gravSeen < 1500) return;
    hasTilt = true;
    const ang = (screen.orientation && screen.orientation.angle) || window.orientation || 0;
    tiltRaw = ang === 90 ? e.beta : (ang === -90 || ang === 270) ? -e.beta : ang === 180 ? -e.gamma : e.gamma;
  }
  // Sensors only work on https (GitHub Pages is fine). iPhones also need a tap to ask permission.
  const onDeviceMotion = (e) => { onGravity(e); onMotion(e); };
  function enableSensors() {
    addEventListener("devicemotion", onDeviceMotion);
    addEventListener("deviceorientation", onOrient);
  }
  const DME = window.DeviceMotionEvent;
  if (DME && typeof DME.requestPermission === "function") {
    addEventListener("click", function askSensors() {
      removeEventListener("click", askSensors, true);
      DME.requestPermission().then((s) => { if (s === "granted") enableSensors(); }).catch(() => {});
      const DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === "function") DOE.requestPermission().catch(() => {});
    }, true);
  } else enableSensors();

  function letGo(relieved = false) {
    const held = performance.now() - holdSince;
    holding = false;
    hardSince = 0;
    el.classList.remove("holding", "slipping", "f-o");
    el.style.removeProperty("--lean");
    ["--gx", "--gy", "--tilt"].forEach((v) => el.style.removeProperty(v));
    if (relieved && held > 700 && active && !gone) { say(pick(["Phew! 😮‍💨", "Thanks for saving me 😅", "Don't do that again 😵‍💫"]), 1800); sfx("pop"); }
  }
  function fall(dir) {
    holding = false;
    el.classList.remove("holding", "slipping", "f-o");
    el.classList.add("falling", "f-open");
    sayRaw("Aaaaaah!! 😭", 1300);
    sfx("whoosh");
    setTimeout(() => sfx("uhoh"), 500);
    moveTo(bx + dir * 140, innerHeight + 80);
    setTimeout(() => {
      el.classList.remove("falling", "f-open");
      el.style.removeProperty("--lean");
      fellLast = true;
      goAway(true);
    }, 1200);
  }
  setInterval(() => {
    if (!hasTilt) return;
    tiltS += (clamp(tiltRaw, -60, 60) - tiltS) * 0.35;
    if (!active || gone || mode !== "sit" || el.classList.contains("falling")) { if (holding) letGo(); return; }
    const a = tiltS, abs = Math.abs(a), now = performance.now();
    if (abs < 12) { if (holding) letGo(true); return; }
    if (!holding) {
      holding = true; holdSince = now; hardSince = 0;
      clearTimeout(actionTimer); clearAction();
      el.classList.add("holding", "f-o");
      say(pick(["Whoa! 😱 Hold it straight!", "I'm slipping!! 😵", "Gravity!! 🙀 Help!"]), 2200);
      sfx("uhoh");
    }
    el.style.setProperty("--lean", `${clamp(a * 1.2, -60, 60).toFixed(1)}deg`);
    lookAt(bx + W() / 2 + Math.sign(a) * 220, by + H());
    // slide toward the low side, but only along what he is sitting on
    const r = perch && perch.isConnected ? perch.getBoundingClientRect() : { left: 4, right: innerWidth - 4 };
    const nx = clamp(bx + Math.sign(a) * Math.min(7, (abs - 10) * 0.35), r.left - W() * 0.25, r.right - W() * 0.75);
    if (Math.abs(nx - bx) > 0.5) moveTo(nx, by);
    hardSince = abs >= 25 ? hardSince || now : 0;
    if ((hardSince && now - hardSince > 2200) || now - holdSince > 4800) fall(Math.sign(a));
    else if (now - holdSince > 2600 && !el.classList.contains("slipping")) { el.classList.add("slipping"); say("Can't… hold… on… 😫", 1800); }
  }, 100);

  // ---------- coming in from a different side each time, waving ----------
  function setPos(x, y) {
    bx = x; by = y;
    el.style.setProperty("--bx", `${Math.round(x)}px`);
    el.style.setProperty("--by", `${Math.round(y)}px`);
  }
  function enter(p, side) {
    entering = true;
    clearAction();
    el.classList.add("no-move");
    if (side === "left") setPos(-W() - 20, p.y);
    else if (side === "right") setPos(innerWidth + 20, p.y);
    else setPos(clamp(p.x, 4, innerWidth - W() - 4), innerHeight + 20);
    void el.offsetWidth;
    el.classList.remove("no-move");
    el.classList.add(side === "bottom" ? "jump-in" : "run-in");
    el.classList.toggle("face-left", side === "right");
    sfx(side === "bottom" ? "boing" : "step");
    if (side !== "bottom") setTimeout(() => sfx("step"), 450);
    moveTo(p.x, p.y);
    setTimeout(() => {
      el.classList.remove("run-in", "jump-in", "face-left");
      entering = false;
      if (!gone && !holding) {
        doAction("wave", 1500, "open");
        if (!bubble.classList.contains("show")) say(pick(["Hiii 👋", "I'm back! 👋", "Did you miss me? 😁", "Wheee! 👋", "Ta-da! 🎉"]), 1600);
      }
    }, side === "bottom" ? 750 : 1050);
  }

  // ---------- funny questions ----------
  const [DOG1, DOG2] = (typeof CONFIG !== "undefined" && CONFIG.dogs) || ["Tobby", "Bobby"];
  const QUESTIONS = [
    ["Quick question: is cake breakfast today? 🎂", "Obviously", "Hmm, no", "Correct! Cake o'clock 😋", "Wrong! Birthday rules 😤"],
    ["Do you think I'm cute? 🥺", "Yes 💙", "A little", "Hehe, I knew it 😳", "A little is still cute 😌"],
    ["Can I have the biggest slice? 🍰", "Okay fine", "No way", "Yesss! 🤤", "Rude 😭 …fair though"],
    ["Is 21 old? 👵", "No!", "A bit 😂", "Right! Still a baby 🍼", "Hey! Respect your elders 😂"],
    [`Who's cuter: ${DOG1} or ${DOG2}? 🐶`, DOG1, DOG2, `${DOG1} is going to brag all day 😂`, `${DOG2} is doing a happy dance 🐕`],
    [`Did ${DOG1} and ${DOG2} get cake too? 🎂🐾`, "Of course", "Not yet", "Best dog mom ever 🥹", `${DOG2} is giving you puppy eyes 🥺`],
    [`If ${DOG1} and ${DOG2} could talk, would they say happy birthday? 🐶`, "Yes!", "They'd ask for food", "Woof woof means happy birthday 💙", "Hahaha so true 😂"],
    [`Who do you love more: me or ${DOG1} and ${DOG2}? 🥺`, "Them 😂", "You", "Fair. I can't wag my tail 😔", "Really?! Don't tell them 🤫"],
    [`Can ${DOG1} and ${DOG2} be my friends too? 🐕`, "Yes", "Maybe", "Yay! New best friends 🐾", "I'll bring treats to convince them 🦴"],
    [`Who's cuter: ${DOG1}, ${DOG2} or you? 🐶`, "The dogs", "Me 😌", "Wrong. It's you 😤", "Correct ✅ obviously"],
    ["Should I sing happy birthday? 🎤", "Yes!", "Please don't", "La la laaa 🎶 Happy birthday!", "Too late, I'm singing 🎶"],
    ["Am I the best decoration on this page? 🎈", "Yes", "The balloons", "Thank you, thank you 🙇", "The balloons?! 😤 I'll pop them"],
    ["Blue is the best colour, right? 💙", "Of course", "Nope", "Same! That's why it's all blue 💙", "Then why is everything blue? 😂"],
    ["If I sit here all day, do I pay rent? 🏠", "Pay up 💸", "Free for you", "I only have one sprinkle 🥲", "Best landlord ever 🥹"],
    ["Can I come to the party too? 🥳", "Of course", "Hmm…", "Yay! I'll bring my hat 🎉", "I'm coming anyway 😎"],
    [`Does ${DOG1} steal food from the table? 🍗`, "All the time 😂", "Never", `${DOG1}, you little thief 😂`, `Sure… and I'm a giraffe 🦒`],
    [`Who wakes you up first: ${DOG1} or ${DOG2}? ⏰`, DOG1, DOG2, `${DOG1} the alarm clock 🐶⏰`, `${DOG2} has zero chill 😂`],
    [`Should ${DOG1} and ${DOG2} get birthday hats too? 🎉`, "Yes!", "They'd eat them", "Party dogs! 🐶🥳", "Fair, hats are delicious 😂"],
    [`If ${DOG2} could text you, what would they send? 📱`, "🦴🦴🦴", "I love you", "Bones. Only bones 😂", "Okay that's too cute 🥹"],
    ["Pizza or kottu for the birthday dinner? 🍕", "Pizza", "Kottu", "Extra cheese for the queen 🧀", "Kottu gang 🔥 good choice"],
    ["Do you sing in the shower? 🚿🎤", "Yes 😂", "Never", "Concert every morning 🎶", "I don't believe you 😏"],
    ["On a scale of 1 to 10, how awesome are you today? 🌟", "10", "11", "Correct ✅", "Even more correct 😎"],
    ["Is it okay if I eat all the sprinkles? 🍩", "Okay", "Hands off!", "Sprinkle party 🌈", "Fine… just one 🥺"],
    ["Should we play hide and seek? 🙈", "Yes!", "You'll lose", "Okay! …I'm behind the photo 👀", "Rude 😤 but probably true"],
    ["Do you snore? 😴", "No!", "A little 🙈", `Hmm, ${DOG1} says otherwise 😂`, "Cutest snore ever, I bet 😆"],
    ["Mountains or beach for a birthday trip? 🏔️🏖️", "Mountains", "Beach", "Cold air and hot tea ☕", "Sun, sea and ice cream 🍦"],
    ["Coffee or tea? ☕", "Tea", "Coffee", "I saw that tea photo, I knew it 🍵", "Coffee queen ☕👑"],
    ["Should I learn to dance properly? 💃", "Yes please", "You're perfect", "Lessons start tomorrow 🕺", "Aww 🥹 I'll keep my wiggle"],
    ["Want to hear a joke? 🤡", "Yes", "No", "Why did the cake go to the doctor? It felt crummy 😂", "Okay… but it was a good one 😔"],
    ["Is chocolate a food group? 🍫", "Obviously", "No", "Science agrees 🧪😌", "Then why is it in my lunchbox? 😂"],
    ["How many candles should I add next year? 🕯️", "22", "None!", "22 it is 🎂", "Forever 21 then 😎"],
    ["Do you like surprises? 🎁", "Love them", "Not really", "Good, because this whole page is one 😁", "Oops… too late 🙈"],
    ["Would you share your cake with me? 🍰", "Of course", "Nope", "Best friend ever 🥹", "I'll just sniff it then 👃"],
    ["Should I stop asking questions? 🤐", "Never", "Please 😂", "Yay! More questions coming 😁", "Okay okay… for now 🤐"],
    ["Who's the birthday queen today? 👑", "Me 😌", DOG1, "Correct! All hail the queen 👑", `${DOG1} says thank you but no 😂`],
  ];
  function setAsk(yes, no) {
    q('.bb-ask [data-a="yes"]', el).textContent = yes;
    q('.bb-ask [data-a="no"]', el).textContent = no;
  }
  function askQuestion() {
    lastQ = performance.now();
    qGap = rnd(35000, 60000);
    if (asked.length >= QUESTIONS.length) asked = [];
    let left = QUESTIONS.filter((x) => !asked.includes(x));
    const dogQs = left.filter((x) => x[0].includes(DOG1));
    if (dogQs.length && (asked.length < 2 || Math.random() < 0.5)) left = dogQs; // her dogs come up a lot
    const item = pick(left);
    asked.push(item);
    const [text, yes, no, onYes, onNo] = item;
    setAsk(yes, no);
    sayRaw(text, 12000);
    el.classList.add("asking");
    fitBubble();
    doAction("think", 12000);
    sfx("pop");
    qCb = (isYes) => {
      clearAction();
      const reply = isYes ? onYes : onNo;
      react(reply, isYes);
      if (/🎶/.test(reply)) [300, 900].forEach((t) => setTimeout(() => Sound.fx.yay(), t));
    };
    qTimer = setTimeout(() => { clearAction(); say("Too shy to answer? 🙈", 2200); }, 11500);
  }

  // ---------- when he's bored he finds something to do ----------
  function bored() {
    const options = ["dart", "dart", "gum", "selfie", "dance", "yawn"];
    const choice = pick(options);
    if (choice === "dart" && throwDart()) return;
    if (choice === "gum") return blowGum();
    if (choice === "selfie") return selfie();
    if (choice === "dance") { doAction("dance", 2600); sfx("yay"); say(pick(["*bored dancing* 💃", "No one's watching… 🕺", "Dance break! 🎶"]), 2200); return; }
    doAction("yawn", 2600); sfx("yawn"); say("*yawn* … still there? 🥱", 2400);
  }
  function throwDart() {
    const bs = qa(".balloon:not(.pop)").filter((b) => { const r = b.getBoundingClientRect(); return r.top > 60 && r.bottom < innerHeight - 40 && r.left > 0 && r.right < innerWidth; });
    if (!bs.length) return false;
    const b = pick(bs);
    say(pick(["I'm bored… 😏", "Bored. Balloon time 😈", "Watch this 🎯"]), 1500);
    setTimeout(() => {
      if (!active || gone || holding || !b.isConnected || b.classList.contains("pop")) return;
      pointAt(b, 900);
      const r = b.getBoundingClientRect();
      const sx = bx + W() * 0.6, sy = by + H() * 0.55;
      const tx = r.left + r.width / 2 - 12, ty = r.top + r.height / 2 - 34; // it keeps floating up, aim ahead
      const d = document.createElement("div");
      d.className = "buddy-dart";
      d.textContent = "📌";
      document.body.appendChild(d);
      sfx("swish");
      d.animate([{ transform: `translate(${sx}px, ${sy}px) rotate(0deg)` }, { transform: `translate(${tx}px, ${ty}px) rotate(540deg)` }], { duration: 420, easing: "ease-in" }).onfinish = () => {
        d.remove();
        if (window.popBalloon && !b.classList.contains("pop")) popBalloon(b, true);
        setTimeout(() => { doAction("laugh", 1400, "open"); sfx("giggle"); say(pick(["Hehe, got it 😈", "Bullseye! 🎯", "Oops 🙊 it slipped"]), 1600); }, 200);
      };
    }, 1000);
    return true;
  }
  function blowGum() {
    clearAction(); clearTimeout(actionTimer);
    action = "gum";
    el.classList.add("gum");
    say("*chews gum* 😗", 1400);
    setTimeout(() => el.classList.add("gum-big"), 900);
    setTimeout(() => {
      el.classList.remove("gum", "gum-big");
      action = "";
      Sound.fx.pop();
      doAction("facepalm", 1300, "o");
      say(pick(["Pop! 😳 It's in my hair", "Oops 😳", "That was bigger than me 😂"]), 1600);
    }, 3000);
  }
  function selfie() {
    clearAction(); clearTimeout(actionTimer);
    action = "selfie";
    el.classList.add("a-selfie");
    say("Selfie with the birthday girl! 📸", 1800);
    setTimeout(() => {
      el.classList.add("f-open");
      const f = document.createElement("div");
      f.className = "buddy-flash";
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 600);
      Sound.fx.shutter();
    }, 1400);
    setTimeout(() => { el.classList.remove("a-selfie", "f-open"); action = ""; say(pick(["Nice! 10/10 😎", "We look great 🤩", "Posting this everywhere 😂"]), 1600); }, 2400);
  }

  // ---------- tickle him: tap him a few times… or too many times ----------
  let tickles = [], dizzy = false;
  el.addEventListener("click", (e) => {
    if (!e.target.closest(".buddy-svg") || !active || gone || holding || peeking) return;
    e.stopPropagation();
    lastInteraction = performance.now();
    const now = performance.now();
    tickles = tickles.filter((t) => now - t < 2500);
    tickles.push(now);
    if (dizzy) return;
    if (tickles.length >= 5) { tickles = []; return getDizzy(); }
    doAction("laugh", 1200, "open");
    sfx("giggle");
    say(pick(["Hehe, that tickles 😆", "Stoppp 🤭", "Hahaha not there 😂", "Okay okay I give up 🤣"]), 1500);
  });
  function getDizzy(msg = "Too much… I'm dizzy 😵‍💫") {
    if (dizzy || !active || gone) return;
    dizzy = true;
    clearAction(); clearTimeout(actionTimer);
    action = "dizzy";
    el.classList.add("dizzy");
    sayRaw(msg, 2400);
    sfx("uhoh");
    setTimeout(() => { el.classList.remove("dizzy"); action = ""; dizzy = false; }, 2800);
  }

  // ---------- shake the phone: confetti earthquake ----------
  let lastMag = null, spikes = [], lastShake = 0;
  function onMotion(e) {
    const a = e.accelerationIncludingGravity;
    if (!a || a.x == null) return;
    const m = Math.hypot(a.x, a.y, a.z), now = performance.now();
    if (lastMag != null && Math.abs(m - lastMag) > 14) spikes.push(now);
    lastMag = m;
    spikes = spikes.filter((t) => now - t < 900);
    if (spikes.length >= 3 && now - lastShake > 3500) {
      lastShake = now; spikes = [];
      if (typeof burst === "function") { burst(innerWidth / 2, innerHeight * 0.4, 160, 1.2); burst(innerWidth * 0.2, innerHeight * 0.6, 80); burst(innerWidth * 0.8, innerHeight * 0.6, 80); }
      Sound.fx.yay();
      if (active && !gone && mode === "sit" && !holding) getDizzy("Earthquake!! 😵‍💫 Stop shaking me!");
    }
  }

  // ---------- tap her name for sparkles ----------
  let nameTaps = 0;
  const nameEl = document.getElementById("name-text");
  if (nameEl) nameEl.addEventListener("click", (e) => {
    nameTaps++;
    if (typeof burst === "function") burst(e.clientX, e.clientY, 40, 0.6);
    Sound.fx.sparkle();
    if (nameTaps % 3 === 1) react(pick(["Yes, that's the birthday girl 👑", "Ishani! The one and only ✨", "Best name ever 💙"]), true);
  });

  // ---------- reacting when she pops balloons ----------
  window.buddyBalloon = (n) => {
    const lines = { 1: "Pop! 😂 Do it again", 3: "Balloon hunter 🎯", 5: "Hey! Leave some for me 😤", 8: "Balloon champion 🏆", 12: "Okay, you're a pro now 😂" };
    if (lines[n]) react(lines[n], n >= 5);
  };

  // public hooks used by main.js
  window.buddyStart = start;
  window.buddyReact = react;
  window.buddySay = say;
  window.buddyDo = doAction;
  window.buddyGoAway = goAway;
})();
