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

  const SKIN = "#ffd7b5", HAIR = "#6b4430", SHIRT = "#7cc6ff", PANTS = "#4a5b8c";
  const SVG = `
  <svg class="buddy-svg" viewBox="0 -70 100 220" overflow="visible">
    <line class="b-rope" x1="50" y1="-3000" x2="50" y2="80" stroke="#a9773f" stroke-width="3" />
    <g class="b-chute">
      <path d="M2 -24 Q50 -96 98 -24 Q86 -32 74 -24 Q62 -32 50 -24 Q38 -32 26 -24 Q14 -32 2 -24Z" fill="#ff6fb5" />
      <path d="M26 -24 Q38 -32 50 -24 Q50 -78 50 -86 Q30 -78 26 -24Z" fill="#ffe066" />
      <path d="M74 -24 Q62 -32 50 -24 Q50 -78 50 -86 Q70 -78 74 -24Z" fill="#7ee8c7" />
      <g stroke="#9a8aa8" stroke-width="1"><line x1="3" y1="-24" x2="45" y2="88" /><line x1="50" y1="-24" x2="46" y2="88" /><line x1="50" y1="-24" x2="54" y2="88" /><line x1="97" y1="-24" x2="55" y2="88" /></g>
    </g>
    <g class="buddy-legs">
      <g class="b-leg-l"><rect x="40" y="95" width="8.5" height="19" rx="4.2" fill="${PANTS}" /><ellipse cx="44" cy="116" rx="7" ry="4.2" fill="#ff6fb5" /><ellipse cx="42" cy="114.6" rx="2.2" ry="1.1" fill="#fff" opacity=".7" /></g>
      <g class="b-leg-r"><rect x="51.5" y="95" width="8.5" height="19" rx="4.2" fill="${PANTS}" /><ellipse cx="56" cy="116" rx="7" ry="4.2" fill="#ff6fb5" /><ellipse cx="54" cy="114.6" rx="2.2" ry="1.1" fill="#fff" opacity=".7" /></g>
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
        <path d="M57.5 9 L67 7.8 M59.5 2 L65 1.4" stroke="#ff6fb5" stroke-width="2.4" stroke-linecap="round" />
        <circle cx="60" cy="-13" r="3.6" fill="#ff6fb5" />
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
  el.innerHTML = `<div class="buddy-bubble"></div><div class="buddy-body">${SVG}</div>`;
  const bubble = q(".buddy-bubble", el);
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
  let lastInteraction = performance.now(), lastSound = 0;
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
    { key: "cake", sel: ".cake-section", perch: [".tier-top", ".feed-title", ".cake-section h2"] },
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
        if (!r.width || r.top < minTop || r.top > maxTop) return;
        const score = Math.abs(r.top - innerHeight * 0.5) + order * 140;
        if (score < bestScore) { bestScore = score; best = t; }
      });
    });
    return best;
  }

  function land() {
    setMode("sit");
    const sec = currentSection();
    perch = choosePerch(sec);
    if (perch) { const p = perchSpot(perch); moveTo(p.x, p.y); }
    else moveTo(innerWidth - W() - 8, innerHeight - H() * 0.97);
    setTimeout(() => sfx("pop"), 700);
    if (sec.key !== lastSection) {
      lastSection = sec.key;
      setTimeout(() => instruct(sec.key), 900);
    }
  }

  // keep sitting on the element if the page shifts under him
  setInterval(() => {
    if (!active || mode !== "sit" || !perch || !perch.isConnected) return;
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
      : q("#knife.ready") ? ["Your turn! Drag the knife down 🔪", "#knife", "point"]
      : ["Make a wish, then blow the candles 🕯️", ".candle:not(.out)", "peek"],
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
    if (!active || !name) return;
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
    if (!active || action) return;
    const idle = performance.now() - lastInteraction;
    if (mode === "sit" && idle > 18000 && Math.random() < 0.35) {
      doAction("yawn", 2600); sfx("yawn"); say("*yawn* … still there? 🥱", 2400);
      lastInteraction = performance.now();
      return;
    }
    const roll = Math.random();
    if (roll < 0.35) {
      const things = qa("img, .btn, .q-btn, .card, .candle, h2").filter((n) => { const r = n.getBoundingClientRect(); return r.width && r.top > 0 && r.bottom < innerHeight; });
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
    if (!active || !text) return;
    bubble.textContent = text;
    bubble.classList.add("show");
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove("show"), ms);
    el.classList.add("talking");
    clearTimeout(talkTimer);
    talkTimer = setTimeout(() => el.classList.remove("talking"), Math.min(1100, 160 + text.length * 22));
    Sound.fx.babble(text);
  }

  // reactions from the rest of the page pick a gesture + sound from the mood of the line
  function react(text, big = false) {
    if (!active) return;
    lastInteraction = performance.now();
    say(text);
    const t = text || "";
    setTimeout(() => {
      if (/😂|🤭|😆|Haha|Hehe|giggle/i.test(t)) { doAction("laugh", 1500, "open"); sfx("giggle"); }
      else if (/🙈|Wrong|Nope|Seriously|😅/i.test(t)) { doAction("facepalm", 1600, "sad"); sfx("uhoh"); }
      else if (/👏|Correct|Smart|Easy|Perfect/i.test(t)) { doAction("clap", 1300, "open"); sfx("clap", 3); }
      else if (/Nom|Delicious|chew|Me next/i.test(t)) { doAction("rub", 1800, "open"); sfx("munch"); }
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
    clearAction();
    perch = null;
    if (d > 0) { if (mode !== "hang" && mode !== "para") setMode(++downCount % 2 ? "hang" : "para"); }
    else setMode("climb");
    clearTimeout(stopTimer);
    stopTimer = setTimeout(land, 650);
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
      setTimeout(() => instruct("hero"), 4200);
    }, 1500);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", () => { if (mode === "sit") land(); });
    addEventListener("pointerdown", () => (lastInteraction = performance.now()), { passive: true });
    gaze();
  }

  // public hooks used by main.js
  window.buddyStart = start;
  window.buddyReact = react;
  window.buddySay = say;
  window.buddyDo = doAction;
})();
