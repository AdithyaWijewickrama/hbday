/* =========================================================
   🎂  3D CAKE: spin it, make a wish, blow the candles
   (tap, swipe or really blow into the mic), then cut it
   with two swipes and feed the friends.
   ========================================================= */
(() => {
  const stage = $("#cake"), spinEl = $("#cake-spin"), cv = $("#cut-canvas"), knife = $("#knife");
  const NAME = CONFIG.name.toUpperCase(), AGE = String(CONFIG.age || 21);
  const TILT = -24;                         // camera looks down at the cake
  let spin = 20, vel = 0.35, phase = "idle"; // idle → blow → cut → done
  let dragging = false, lastX = 0, lastT = 0, visible = false, trickUsed = false, wished = false;
  window.cakePhase = () => phase;

  // ---------- build the cake out of panels ----------
  const N = document.documentElement.classList.contains("lite") ? 20 : 28; // fewer panels on budget phones
  function tier({ r, h, y, side, top, text = {} }) {
    const t = document.createElement("div");
    t.className = "t3d";
    t.style.transform = `translateY(${y}px)`;
    const w = (2 * Math.PI * r) / N + 0.9;
    let html = "";
    for (let i = 0; i < N; i++) {
      const ch = text[i] || "";
      html += `<div class="p3d" style="width:${w.toFixed(1)}px;height:${h}px;margin:${-h / 2}px 0 0 ${(-w / 2).toFixed(1)}px;background:${side};transform:rotateY(${(i * 360) / N}deg) translateZ(${r}px)">${ch ? `<b>${ch}</b>` : ""}</div>`;
    }
    html += `<div class="top3d" style="width:${2 * r}px;height:${2 * r}px;margin:${-r}px 0 0 ${-r}px;background:${top};transform:rotateX(90deg) translateZ(${h / 2}px)"></div>`;
    t.innerHTML = html;
    spinEl.appendChild(t);
  }
  // letters on panels: centred on panel `at`, one per panel
  let nameAngle = 0;
  const spell = (word, at) => {
    const o = {}, start = at - Math.floor(word.length / 2);
    [...word].forEach((c, k) => { if (c !== " ") o[(start + k + N) % N] = c; });
    if (at === 0) nameAngle = ((start + (word.length - 1) / 2) * 360) / N;
    return o;
  };
  const PLATE = "radial-gradient(circle, #ffffff 58%, #dfe9f7 60%, #ffffff 64%, #e8f0fb)";
  const plate = document.createElement("div");
  plate.className = "t3d";
  plate.innerHTML = `<div class="top3d plate3d" style="width:310px;height:310px;margin:-155px 0 0 -155px;background:${PLATE};transform:rotateX(90deg) translateZ(-90px)"></div>`;
  spinEl.appendChild(plate);
  tier({
    r: 122, h: 96, y: 40,
    side: "linear-gradient(#ffffff 0 13%, #dbeafe 13% 16%, #60a5fa 16% 84%, #3b82f6 84%)",
    top: "radial-gradient(circle at 50% 50%, #ffffff 0 58%, #bfdbfe 60%, #ffffff 63%)",
    text: { ...spell(`HAPPY ${AGE}`, N / 2), ...spell(NAME, 0) },
  });
  tier({
    r: 86, h: 74, y: -45,
    side: "linear-gradient(#ffffff 0 15%, #e0f2fe 15% 18%, #bae6fd 18% 82%, #7dd3fc 82%)",
    top: "radial-gradient(circle, #ffffff 0 30%, #e0f2fe 31% 34%, #ffffff 35%)",
  });

  // ---------- candles (billboards that always face her) ----------
  const TOP = -45 - 37;
  const candles = [];
  function addCandle(label, x, z, big) {
    const c = document.createElement("button");
    c.type = "button";
    c.className = `c3 ${big ? "num" : "mini"}`;
    c.setAttribute("aria-label", big ? `Candle ${label}` : "Candle");
    c.innerHTML = `<span class="flame3"></span>${big ? `<span class="digit">${label}</span>` : `<span class="stick"></span>`}`;
    spinEl.appendChild(c);
    const o = { el: c, x, z, lit: true, trick: big && label === AGE.slice(-1) };
    c.addEventListener("click", (e) => { e.stopPropagation(); blowOut(o); });
    candles.push(o);
  }
  [...AGE].forEach((d, i) => addCandle(d, (i - (AGE.length - 1) / 2) * 46, 6, true));
  [45, 135, 225, 315].forEach((a) => {
    const rad = (a * Math.PI) / 180;
    addCandle("", Math.cos(rad) * 62, Math.sin(rad) * 62, false);
  });

  function place() {
    spinEl.style.transform = `rotateX(${TILT}deg) rotateY(${spin}deg)`;
    for (const o of candles) o.el.style.transform = `translate3d(${o.x}px, ${TOP}px, ${o.z}px) rotateY(${-spin}deg) rotateX(${-TILT}deg)`;
  }

  // ---------- spinning ----------
  function frame() {
    if (!visible) return;
    if (!dragging) {
      if (phase === "idle") { vel += (0.35 - vel) * 0.02; spin += vel; }
      else { const d = ((((-nameAngle - spin) % 360) + 540) % 360) - 180; spin += d * 0.08; } // settle facing her
    }
    place();
    requestAnimationFrame(frame);
  }
  new IntersectionObserver(([e]) => {
    const was = visible;
    visible = e.isIntersecting;
    if (visible && !was) requestAnimationFrame(frame);
  }).observe(stage);
  place();

  // ---------- pointer: spin (idle) / wind (blow) / knife (cut) ----------
  let path = [], wind = { x: 0, t: 0 };
  stage.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".c3")) return;
    lastX = e.clientX; lastT = performance.now();
    if (phase === "idle") { dragging = true; stage.setPointerCapture(e.pointerId); }
    if (phase === "cut") { stage.setPointerCapture(e.pointerId); path = [pt(e)]; Sound.fx.swish(); knife.classList.add("on"); moveKnife(e); }
  });
  stage.addEventListener("pointermove", (e) => {
    const now = performance.now(), dx = e.clientX - lastX, dt = Math.max(1, now - lastT);
    lastX = e.clientX; lastT = now;
    if (phase === "idle" && dragging) { spin += dx * 0.6; vel = (dx * 0.6) / (dt / 16); }
    else if (phase === "blow") fan(e, dx / dt);
    else if (phase === "cut") {
      if (e.pointerType === "mouse") { knife.classList.add("on"); moveKnife(e); }
      if (path.length) { path.push(pt(e)); moveKnife(e); drawTrail(); }
    }
  });
  const up = () => {
    dragging = false;
    if (phase === "cut" && path.length) finishSwipe();
  };
  stage.addEventListener("pointerup", up);
  stage.addEventListener("pointercancel", up);
  stage.addEventListener("pointerleave", () => { if (phase === "cut" && !path.length) knife.classList.remove("on"); });

  // ---------- wish ----------
  $("#wish-btn").addEventListener("click", () => {
    const ov = $("#wish-overlay"), count = $("#wish-count");
    ov.classList.add("show");
    buddyReact("Shh… eyes closed 🤫");
    let n = 3;
    count.textContent = n;
    Sound.fx.sparkle();
    const tick = setInterval(() => {
      n--;
      if (n > 0) { count.textContent = n; Sound.fx.sparkle(); return; }
      clearInterval(tick);
      count.textContent = "✨";
      setTimeout(() => {
        ov.classList.remove("show");
        wished = true;
        startBlow();
        buddyReact("Wish made! Now BLOW 🌬️", true);
      }, 700);
    }, 900);
  });

  function startBlow() {
    if (phase !== "idle") return;
    phase = "blow";
    $("#wish-btn").hidden = true;
    $("#mic-btn").hidden = false;
    $("#cake-sub").textContent = "Blow them out! Swipe over the flames, tap them, or blow into your mic 🌬️";
  }

  // ---------- blowing ----------
  function lean(px) {
    for (const o of candles) o.el.style.setProperty("--lean", `${Math.max(-40, Math.min(40, px)).toFixed(0)}deg`);
    clearTimeout(lean.t);
    lean.t = setTimeout(() => candles.forEach((o) => o.el.style.setProperty("--lean", "0deg")), 260);
  }
  function fan(e, speed) {
    lean(speed * 30);
    if (Math.abs(speed) < 0.6) return;
    for (const o of candles) {
      if (!o.lit) continue;
      const r = o.el.getBoundingClientRect();
      const fx = r.left + r.width / 2, fy = r.top + 8;
      if (Math.abs(e.clientX - fx) < 50 && Math.abs(e.clientY - fy) < 70 && Math.random() < 0.5) blowOut(o);
    }
  }
  function blowOut(o) {
    if (!o.lit || phase === "cut" || phase === "done") return;
    if (phase === "idle") {
      if (!wished) buddyReact("Hey! Did you make a wish first? 🤫");
      startBlow();
    }
    o.lit = false;
    o.el.classList.add("out");
    Sound.fx.puff();
    const left = candles.filter((c) => c.lit).length;
    if (left === Math.floor(candles.length / 2)) buddyReact("Halfway! Keep blowing 😤");
    if (left > 0) return;
    if (!trickUsed) { // one cheeky candle lights itself again
      trickUsed = true;
      const t = candles.find((c) => c.trick) || candles[0];
      setTimeout(() => {
        t.lit = true;
        t.el.classList.remove("out");
        t.el.classList.add("relit");
        Sound.fx.sparkle();
        buddyReact("Hehe, trick candle! 😈 Blow again 😂");
      }, 900);
      return;
    }
    allOut();
  }
  function allOut() {
    stopMic();
    phase = "cut";
    $("#mic-btn").hidden = true;
    const r = stage.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.3, 220, 1.1);
    setTimeout(rain, 300);
    Sound.fx.yay();
    buddyReact("Yaaay! 🎂 Now cut it yourself!", true);
    $("#wish-msg").classList.add("show");
    $("#cake-sub").textContent = "Now cut it yourself! 🔪";
    setTimeout(() => {
      $("#cut-hint").textContent = "Swipe across the cake to cut it 🔪 (two cuts make a slice)";
      $("#cut-hint").classList.add("show");
      stage.classList.add("cutting");
      sizeCanvas();
    }, 900);
  }

  // ---------- really blowing into the mic ----------
  let mic = null;
  $("#mic-btn").addEventListener("click", async () => {
    if (mic) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC(), src = ctx.createMediaStreamSource(stream), an = ctx.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      const buf = new Uint8Array(an.fftSize);
      mic = { stream, ctx, loud: 0, last: 0 };
      $("#mic-btn").textContent = "🎤 Listening… blow!";
      buddyReact("I'm listening… BLOW! 🌬️");
      const loop = () => {
        if (!mic) return;
        an.getByteTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += ((v - 128) / 128) ** 2;
        const rms = Math.sqrt(sum / buf.length);
        if (rms > 0.06) lean((rms - 0.06) * 260 * (Math.random() < 0.5 ? -1 : 1));
        mic.loud = rms > 0.16 ? mic.loud + 1 : 0;
        const now = performance.now();
        if (mic.loud > 6 && now - mic.last > 220) {
          mic.last = now;
          const lit = candles.filter((c) => c.lit);
          if (lit.length) blowOut(lit[(Math.random() * lit.length) | 0]);
        }
        requestAnimationFrame(loop);
      };
      loop();
    } catch (err) {
      toast("No mic? Swipe over the flames instead 🌬️");
      $("#mic-btn").hidden = true;
    }
  });
  function stopMic() {
    if (!mic) return;
    mic.stream.getTracks().forEach((t) => t.stop());
    mic.ctx.close();
    mic = null;
  }

  // ---------- cutting with swipes ----------
  let cuts = 0;
  const ctx2 = cv.getContext("2d");
  const marks = [];
  function sizeCanvas() {
    const r = stage.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    cv.width = r.width * d; cv.height = r.height * d;
    ctx2.setTransform(d, 0, 0, d, 0, 0);
    redraw();
  }
  const pt = (e) => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  function moveKnife(e) {
    const [x, y] = pt(e);
    let ang = 0;
    if (path.length > 1) { const [ax, ay] = path[Math.max(0, path.length - 4)]; ang = (Math.atan2(y - ay, x - ax) * 180) / Math.PI; }
    knife.style.transform = `translate(${x - 30}px, ${y - 30}px) rotate(${ang + 45}deg)`;
  }
  function redraw(trail) {
    const r = stage.getBoundingClientRect();
    ctx2.clearRect(0, 0, r.width, r.height);
    ctx2.lineCap = "round";
    ctx2.save();
    ctx2.beginPath(); // only draw on the cake itself
    ctx2.ellipse(r.width / 2, r.height * 0.62, r.width * 0.4, r.height * 0.34, 0, 0, Math.PI * 2);
    ctx2.clip();
    for (const m of marks) { // the cut grooves in the cake
      ctx2.strokeStyle = "rgba(30,58,110,.45)"; ctx2.lineWidth = 5;
      ctx2.beginPath(); ctx2.moveTo(m[0][0], m[0][1]); ctx2.lineTo(m[1][0], m[1][1]); ctx2.stroke();
      ctx2.strokeStyle = "#fff"; ctx2.lineWidth = 2;
      ctx2.beginPath(); ctx2.moveTo(m[0][0] - 1, m[0][1] - 1); ctx2.lineTo(m[1][0] - 1, m[1][1] - 1); ctx2.stroke();
    }
    ctx2.restore();
    if (trail && trail.length > 1) { // glowing knife trail
      ctx2.shadowColor = "#60a5fa"; ctx2.shadowBlur = 14;
      ctx2.strokeStyle = "rgba(255,255,255,.95)"; ctx2.lineWidth = 6;
      ctx2.beginPath(); ctx2.moveTo(trail[0][0], trail[0][1]);
      trail.forEach(([x, y]) => ctx2.lineTo(x, y));
      ctx2.stroke();
      ctx2.shadowBlur = 0;
    }
  }
  function drawTrail() {
    redraw(path.slice(-14));
  }
  function finishSwipe() {
    const a = path[0], b = path[path.length - 1];
    path = [];
    knife.classList.remove("on");
    const r = stage.getBoundingClientRect();
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    // must be long and pass near the middle of the cake
    const cx = r.width / 2, cy = r.height * 0.52;
    const t = Math.max(0, Math.min(1, ((cx - a[0]) * (b[0] - a[0]) + (cy - a[1]) * (b[1] - a[1])) / (len * len || 1)));
    const dist = Math.hypot(a[0] + t * (b[0] - a[0]) - cx, a[1] + t * (b[1] - a[1]) - cy);
    if (len < r.width * 0.35 || dist > r.width * 0.3) {
      redraw();
      buddyReact(len < r.width * 0.35 ? "Almost! Swipe all the way across 💪" : "Aim for the cake 😂");
      return;
    }
    marks.push([a, b]);
    redraw();
    cuts++;
    Sound.fx.slice();
    stage.classList.remove("wobble"); void stage.offsetWidth; stage.classList.add("wobble");
    burst(r.left + (a[0] + b[0]) / 2, r.top + (a[1] + b[1]) / 2, 40, 0.4);
    if (cuts === 1) { buddyReact("Ooh clean cut! 👏 One more ✂️"); return; }
    phase = "done";
    stage.classList.remove("cutting");
    $("#cut-hint").classList.remove("show");
    buddyReact("Perfect slice! 👏 Now feed everyone 🍰", true);
    setTimeout(() => {
      serveSlice();
      $("#feed").classList.add("show");
      $("#feed").scrollIntoView({ behavior: "smooth", block: "center" });
    }, 800);
  }
  addEventListener("resize", () => { if (phase === "cut") sizeCanvas(); });
})();
