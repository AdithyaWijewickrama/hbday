/* =========================================================
   🎈 LITTLE EXTRAS (all optional, all harmless)
   - double-tap any empty spot: blue hearts
   - tap the crown: it falls off, then pops back
   - press and hold the boy: he sends her a 💙
   - tap "Made with lots of 💖" at the bottom 3 times: Tobby & Bobby rain
   - turn the phone sideways: the boy notices
   ========================================================= */
(() => {
  const lite = document.documentElement.classList.contains("lite");
  const say = (t, big) => { if (window.buddyReact) buddyReact(t, big); };

  // ---------- floating emoji helper ----------
  function float(x, y, emoji, n = 5) {
    for (let i = 0; i < n; i++) {
      const h = document.createElement("span");
      h.className = "heart-pop";
      h.textContent = Array.isArray(emoji) ? pick(emoji) : emoji;
      h.style.left = `${x + (Math.random() - 0.5) * 30}px`;
      h.style.top = `${y + (Math.random() - 0.5) * 20}px`;
      h.style.setProperty("--dx", `${(Math.random() - 0.5) * 90}px`);
      h.style.setProperty("--rot", `${(Math.random() - 0.5) * 50}deg`);
      h.style.animationDelay = `${i * 70}ms`;
      h.style.fontSize = `${20 + Math.random() * 14}px`;
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1300 + i * 70);
    }
  }

  // ---------- 1) double-tap an empty spot: hearts ----------
  const BUSY = "button, a, input, textarea, select, label, canvas, img, .buddy, .balloon, .cake-stage, .doodle, .lightbox, .polaroid, .card, #name-text, .avatar-wrap";
  let lastTap = 0, lx = 0, ly = 0, hearts = 0;
  addEventListener("pointerup", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.target.closest && e.target.closest(BUSY)) { lastTap = 0; return; }
    const now = performance.now();
    if (now - lastTap < 320 && Math.hypot(e.clientX - lx, e.clientY - ly) < 40) {
      lastTap = 0;
      float(e.clientX, e.clientY, ["💙", "💙", "🩵", "💖"], lite ? 4 : 7);
      Sound.fx.sparkle();
      hearts++;
      if (hearts === 1) say("Aww, hearts everywhere 💙");
      if (hearts === 6) say("Okay we get it, you love this website 😂", true);
      return;
    }
    lastTap = now; lx = e.clientX; ly = e.clientY;
  }, { passive: true });

  // ---------- 2) tap the crown: it falls off ----------
  const crown = document.querySelector(".avatar-crown");
  let crownBusy = false, crownFalls = 0;
  if (crown) crown.addEventListener("click", (e) => {
    e.stopPropagation(); // don't open the doodle
    if (crownBusy) return;
    crownBusy = true; crownFalls++;
    crown.classList.remove("back");
    crown.classList.add("fall");
    Sound.fx.whoosh();
    setTimeout(() => Sound.fx.boing(), 520);
    say(crownFalls === 1 ? "Oops! The crown fell 😱 Quick, put it back!" : pick(["Again?? 😂 Hold your crown!", "Queens don't drop crowns 👑😂", "I'll glue it this time 😅"]));
    setTimeout(() => {
      crown.classList.remove("fall");
      crown.classList.add("back");
      Sound.fx.sparkle();
      burstAt(crown, 30, 0.5);
      crownBusy = false;
    }, 1700);
  });

  // ---------- 3) press and hold the boy: he sends a heart ----------
  let holdTimer = 0, held = false, sx = 0, sy = 0, sent = 0;
  const buddyEl = () => document.querySelector(".buddy");
  addEventListener("pointerdown", (e) => {
    const b = e.target.closest && e.target.closest(".buddy-svg");
    if (!b) return;
    held = false; sx = e.clientX; sy = e.clientY;
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      held = true;
      const r = b.getBoundingClientRect();
      float(r.left + r.width / 2, r.top + r.height * 0.3, ["💙", "💌", "💙"], lite ? 3 : 5);
      Sound.fx.balloon();
      sent++;
      say(sent === 1 ? "This one's for you 💙" : pick(["Another one 💌", "Infinite hearts unlocked 💙", "Okay I'm shy now 🙈"]), true);
      if (navigator.vibrate) try { navigator.vibrate(30); } catch (err) {}
    }, 650);
  }, { passive: true });
  const cancelHold = (e) => {
    if (e.type === "pointermove" && Math.hypot(e.clientX - sx, e.clientY - sy) < 12) return;
    clearTimeout(holdTimer);
  };
  addEventListener("pointermove", cancelHold, { passive: true });
  addEventListener("pointerup", cancelHold, { passive: true });
  addEventListener("pointercancel", cancelHold, { passive: true });
  // the click after a long press should not also count as a tickle
  addEventListener("click", (e) => {
    if (held && e.target.closest && e.target.closest(".buddy")) { e.stopPropagation(); held = false; }
  }, true);
  addEventListener("contextmenu", (e) => { if (e.target.closest && e.target.closest(".buddy")) e.preventDefault(); });

  // ---------- 4) footer secret: Tobby & Bobby rain ----------
  const foot = document.getElementById("footer-text");
  let footTaps = 0, footTimer = 0;
  if (foot) foot.addEventListener("click", () => {
    footTaps++;
    clearTimeout(footTimer);
    footTimer = setTimeout(() => (footTaps = 0), 1500);
    if (footTaps < 3) { Sound.fx.pop(); return; }
    footTaps = 0;
    dogRain();
  });
  function dogRain() {
    const n = lite ? 12 : 24;
    for (let i = 0; i < n; i++) {
      const d = document.createElement("span");
      d.className = "rain-emoji";
      d.textContent = pick(["🐶", "🐕", "🐾", "🦴", "🐶"]);
      d.style.left = `${Math.random() * 94}vw`;
      d.style.setProperty("--t", `${2.2 + Math.random() * 1.6}s`);
      d.style.setProperty("--rot", `${(Math.random() - 0.5) * 360}deg`);
      d.style.animationDelay = `${Math.random() * 1.2}s`;
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 5200);
    }
    const [a, b] = CONFIG.dogs || ["Tobby", "Bobby"];
    toast(`🐶 ${a} and ${b} say happy birthday! Woof woof 🐶`, 3000);
    Sound.fx.yay();
    say(`${a} and ${b} found the secret! 🐾😂`, true);
  }
  window.dogRain = dogRain;

  // ---------- 5) turn the phone sideways ----------
  let lastLand = innerWidth > innerHeight;
  const onTurn = () => {
    const land = innerWidth > innerHeight;
    if (land === lastLand || innerWidth > 1000) return;
    lastLand = land;
    say(land ? "Whoa, sideways world 🙃 my head is spinning" : "Phew, back to normal 😮‍💨");
  };
  if (screen.orientation && screen.orientation.addEventListener) screen.orientation.addEventListener("change", () => setTimeout(onTurn, 300));
  else addEventListener("orientationchange", () => setTimeout(onTurn, 300));
})();
