/* =========================================================
   ✏️  EDIT EVERYTHING PERSONAL HERE
   ========================================================= */
const CONFIG = {
  name: "Ishani",
  from: "your friend 💛",                 // how the note is signed

  subtitle: "Today the brightest smile in the whole world turns a year more awesome 🌟",
  avatar: "photos/black-dress.jpg",

  // Photos live in the photos/ folder.
  photos: [
    { src: "photos/black-dress.jpg",    caption: "That smile though ✨" },
    { src: "photos/group.jpg",          caption: "The whole gang 💛" },
    { src: "photos/lecture-selfie.jpg", caption: "Lecture hall partners in crime 📚" },
    { src: "photos/yellow-flowers.jpg", caption: "Even the flowers are jealous 🌼" },
    { src: "photos/squad.jpg",          caption: "Squad day out 🧸" },
    { src: "photos/tea-time.jpg",       caption: "Tea first, lectures later ☕" },
    { src: "photos/wildflowers.jpg",    caption: "A bouquet for the birthday girl 💐" },
  ],

  reasons: [
    { icon: "😄", text: "Your laugh can rescue even the most boring lecture." },
    { icon: "☕", text: "You make tea breaks the best part of the day." },
    { icon: "🧠", text: "Smart, kind, and the best company." },
    { icon: "📸", text: "Every photo of you looks like a magazine cover." },
    { icon: "🤗", text: "You're the kind of friend people are lucky to have." },
    { icon: "✨", text: "You light up every room you walk into." },
  ],

  message:
`Dear {name},

Happy birthday! 🎉

Of all the good things this year has given me, getting to know you is easily one of the best.

Thank you for the laughs between lectures, the tea breaks, and for simply being you: kind, smart and impossible not to smile around.

I hope this year treats you as well as you treat everyone around you, with lots of laughter, big wins, good results and every little thing that makes you happy. You deserve all of it.

And remember, you admitted it yourself today: you are the most beautiful girl in the world. No take-backs. 😌

Have the best birthday ever!`,

  candles: 5,

  // Friends she feeds cake to (faces from the group photo).
  // eyes/mouth are positions on each face photo in %, skin is used to "close" the eyes while chewing.
  friends: [
    { src: "photos/friend-1.jpg", says: "Yummy! Happy birthday! 🎂", skin: "#d2782f", eyes: [[35, 45], [62, 46]], mouth: [50, 71] },
    { src: "photos/friend-2.jpg", says: "Best cake ever 😋",         skin: "#f08a33", eyes: [[40, 48], [67, 53]], mouth: [50, 73] },
    { src: "photos/friend-3.jpg", says: "Thank you birthday girl! 💖", skin: "#c27c59", eyes: [[35, 56], [64, 58]], mouth: [49, 81] },
    { src: "photos/friend-4.jpg", says: "Happy birthday Ishani! 💛", skin: "#875744", eyes: [[32, 33], [65, 31]], mouth: [48, 62] },
  ],
};
/* ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const palette = ["#ff6fb5", "#ffb38a", "#ffe066", "#7ee8c7", "#7cc6ff", "#b79cff"];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((p) => p[1]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- Confetti engine (no libraries) ---------- */
const canvas = $("#confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", resize); resize();

const PHONE = innerWidth < 600;
const MAX_PIECES = PHONE ? 260 : 600;
function burst(x = innerWidth / 2, y = innerHeight / 2, count = 160, spread = 1) {
  count = Math.max(1, Math.round(count * (PHONE ? 0.45 : 1)));
  count = Math.min(count, MAX_PIECES - pieces.length);
  const shapes = ["rect", "circle", "heart", "star"];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 9 + 4) * spread;
    pieces.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      size: Math.random() * 8 + 6,
      color: palette[(Math.random() * palette.length) | 0],
      shape: shapes[(Math.random() * shapes.length) | 0],
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 12,
      life: 0,
      wobble: Math.random() * 10,
    });
  }
}
function rain(count = 200) {
  // drop in small batches instead of hundreds of separate timers
  let left = Math.round(count * (PHONE ? 0.5 : 1));
  const tick = () => {
    for (let k = 0; k < 6 && left > 0; k++, left--) {
      if (pieces.length < MAX_PIECES) pieces.push(makePiece(Math.random() * innerWidth, -20, 0.3));
    }
    if (left > 0) setTimeout(tick, 60);
  };
  tick();
}
function makePiece(x, y, spread) {
  const angle = Math.random() * Math.PI * 2;
  const speed = (Math.random() * 9 + 4) * spread;
  return {
    x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 6,
    size: Math.random() * 8 + 6,
    color: palette[(Math.random() * palette.length) | 0],
    shape: ["rect", "circle", "heart", "star"][(Math.random() * 4) | 0],
    rot: Math.random() * 360, vr: (Math.random() - 0.5) * 12, life: 0, wobble: Math.random() * 10,
  };
}
function burstAt(el, count = 80, spread = 0.8) {
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, count, spread);
}
function drawHeart(s) {
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.4, -s, 0, -s * 0.4);
  ctx.bezierCurveTo(s * 0.4, -s, s, -s * 0.4, 0, s * 0.3);
  ctx.fill();
}
function drawStar(s) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * s, -Math.sin((18 + i * 72) * Math.PI / 180) * s);
    ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * s / 2, -Math.sin((54 + i * 72) * Math.PI / 180) * s / 2);
  }
  ctx.closePath(); ctx.fill();
}
let wasDrawing = false;
function loop() {
  if (pieces.length || wasDrawing) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    wasDrawing = pieces.length > 0;
  }
  pieces = pieces.filter((p) => p.y < canvas.height + 40 && p.life < 600);
  for (const p of pieces) {
    p.life++;
    p.vy += 0.22; p.vx *= 0.985; p.vy *= 0.985;
    p.x += p.vx + Math.sin((p.life + p.wobble) / 10) * 0.6; p.y += p.vy;
    p.rot += p.vr;
    const a = p.rot * Math.PI / 180, cs = Math.cos(a), sn = Math.sin(a);
    ctx.setTransform(cs, sn, -sn, cs, p.x, p.y);
    ctx.fillStyle = p.color;
    if (p.shape === "rect") ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    else if (p.shape === "circle") { ctx.beginPath(); ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2); ctx.fill(); }
    else if (p.shape === "heart") drawHeart(p.size * 0.7);
    else drawStar(p.size * 0.7);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  requestAnimationFrame(loop);
}
loop();

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg, ms = 2200) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), ms);
}

/* ---------- Balloons ---------- */
function makeBalloons() {
  const wrap = $(".balloons");
  const n = PHONE ? 5 : 10;
  for (let i = 0; i < n; i++) {
    const b = document.createElement("div");
    b.className = "balloon";
    const c = palette[i % palette.length];
    const s = 0.6 + Math.random() * 0.6;
    b.style.background = `radial-gradient(circle at 35% 30%, #fff8 0 8%, ${c} 40%)`;
    b.style.left = `${Math.random() * 95}%`;
    b.style.width = `${60 * s}px`;
    b.style.height = `${76 * s}px`;
    b.style.animationDuration = `${12 + Math.random() * 10}s`;
    b.style.animationDelay = `${-Math.random() * 20}s`;
    wrap.appendChild(b);
  }
}

/* =========================================================
   🧠  THE BIRTHDAY QUIZ (with a few tricks 😏)
   ========================================================= */
const N = CONFIG.name;
const TARGET = "I am the most beautiful girl in the world 💖";
const QUIZ = [
  { type: "name" },
  {
    type: "choice",
    text: "What's the best day of the whole year? 📅",
    options: shuffle([
      { label: "My birthday 🎂", correct: true },
      { label: "Avurudu 🪔" },
      { label: "Christmas 🎄" },
      { label: "Monday 😴" },
    ]),
    wrong: "❌ Wrong answer. Try again 😤",
    right: "✅ Obviously. Today is the best day 🎂",
  },
  {
    type: "choice",
    text: "Warm-up logic question. Are flowers pretty? 🌸",
    options: [
      { label: "Yes 🌸", reply: "✅ Correct!" },
      { label: "No", reply: "🥀 The flowers are offended… we'll count that as a yes." },
    ],
  },
  {
    type: "choice",
    text: "Is the moon pretty? 🌙",
    options: [
      { label: "Yes 🌙", reply: "✅ Glad we agree." },
      { label: "Also yes ✨", reply: "✅ Glad we agree." },
    ],
  },
  { type: "runaway", text: `Is ${N} prettier than flowers AND the moon? 🌸🌙` },
  {
    type: "choice",
    text: "Maths question 📐 Solve for x:",
    formula: "x = the most beautiful girl in the world",
    options: [
      { label: `x = ${N}` },
      { label: `x = ${N} 💖` },
      { label: `x = definitely ${N}` },
      { label: "All of the above" },
    ],
    right: "💯 Full marks! See, you already know the answer.",
  },
  { type: "autotype", text: "Last written question ✍️ In your own words: who is the most beautiful girl in the world?" },
  { type: "aloud" },
];
const TOTAL = QUIZ.length;
let qIndex = -1;
let flow = 0; // bumps on retake so old timers are ignored
let advancing = false;

function setProgress(i) { $("#quiz-bar").style.width = `${Math.max(0, Math.min(1, i / TOTAL)) * 100}%`; }

function stage(html) {
  const s = $("#quiz-stage");
  s.innerHTML = html;
  [...s.children].forEach((c, k) => { c.classList.add("q-anim"); c.style.animationDelay = `${k * 70}ms`; });
  $("#quiz-card").querySelectorAll(".q-btn.runaway").forEach((b) => b.remove());
  return s;
}
const stepLabel = (i) => `<p class="q-step">Question ${i + 1} of ${TOTAL}</p>`;

async function next(delay = 1100) {
  if (advancing) return; // one answer, one step forward
  advancing = true;
  const myFlow = flow;
  await wait(delay);
  advancing = false;
  if (myFlow !== flow) return;
  qIndex++;
  setProgress(qIndex);
  if (qIndex >= TOTAL) return showResult();
  const q = QUIZ[qIndex];
  keepQuizInView();
  ({ name: renderName, choice: renderChoice, runaway: renderRunaway, autotype: renderAutotype, aloud: renderAloud })[q.type](q, qIndex);
}

function renderStart() {
  flow++;
  advancing = false;
  qIndex = -1;
  setProgress(0);
  const s = stage(`
    <div class="q-big-emoji">🎂</div>
    <p class="q-text">Ready, birthday girl?</p>
    <p class="q-note">${TOTAL} quick questions to unlock your official birthday result.</p>
    <button class="btn" id="q-start">Let's go! 🚀</button>`);
  $("#q-start", s).addEventListener("click", () => next(0));
}

function renderName(q, i) {
  const s = stage(`
    ${stepLabel(i)}
    <p class="q-text">Identity check 🕵️‍♀️ What's your name?</p>
    <input class="q-input" id="q-name" type="text" placeholder="Type your name…" autocomplete="off" maxlength="40" />
    <button class="btn small" id="q-go">Next ➜</button>
    <p class="q-feedback" id="q-fb"></p>`);
  const input = $("#q-name", s), fb = $("#q-fb", s), go = $("#q-go", s);
  const submit = () => {
    if (go.disabled) return;
    const v = input.value.trim();
    if (!v) { input.classList.remove("wrong"); void input.offsetWidth; input.classList.add("wrong"); fb.textContent = "Type something 🙂"; return; }
    go.disabled = true; input.readOnly = true;
    const isHer = /ishani|ඉශානි|இஷானி/i.test(v);
    fb.textContent = isHer
      ? `✅ Identity confirmed. Welcome, birthday girl!`
      : `🤖 Hmm… my database says you're ${N}. Let's go with that.`;
    buddyReact(isHer ? "Hehe, I knew it was you 😄" : "Haha nice try 😂 We know it's you", isHer);
    burstAt(go, 50, 0.6);
    next(isHer ? 1400 : 2200);
  };
  go.addEventListener("click", submit);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
}

function renderChoice(q, i) {
  const s = stage(`
    ${stepLabel(i)}
    <p class="q-text">${esc(q.text)}</p>
    ${q.formula ? `<p class="q-text" style="font-family:'Caveat',cursive;font-size:1.9rem;color:#e2468f">${esc(q.formula)}</p>` : ""}
    <div class="q-options">${q.options.map((o, k) => `<button class="q-btn" data-k="${k}">${esc(o.label)}</button>`).join("")}</div>
    <p class="q-feedback" id="q-fb"></p>`);
  const fb = $("#q-fb", s);
  const hasCorrect = q.options.some((o) => o.correct);
  let done = false;
  s.querySelectorAll(".q-btn").forEach((b) => b.addEventListener("click", () => {
    if (done) return;
    const o = q.options[+b.dataset.k];
    if (hasCorrect && !o.correct) {
      b.classList.remove("wrong"); void b.offsetWidth; b.classList.add("wrong");
      b.disabled = true;
      fb.textContent = q.wrong;
      buddyReact(["Wrong 🙈", "Nope! Try again 😂", "Seriously? 😅"][(Math.random() * 3) | 0]);
      return;
    }
    done = true;
    s.querySelectorAll(".q-btn").forEach((x) => (x.disabled = x !== b));
    b.classList.add("primary");
    fb.textContent = o.reply || q.right || "✅ Correct!";
    buddyReact(["Correct! 👏", "Smart girl 😎", "Yesss 🙌", "Easy one 😌"][qIndex % 4], true);
    burstAt(b, 60, 0.6);
    next(1500);
  }));
}

function renderRunaway(q, i) {
  const s = stage(`
    ${stepLabel(i)}
    <p class="q-text">${esc(q.text)}</p>
    <div class="q-options" id="q-opts">
      <button class="q-btn primary" id="q-yes">Yes 💖</button>
      <button class="q-btn" id="q-no">No</button>
    </div>
    <p class="q-feedback" id="q-fb"></p>`);
  const card = $("#quiz-card"), yes = $("#q-yes", s), no = $("#q-no", s), fb = $("#q-fb", s);
  const lines = ["Nope 🙅‍♀️", "Too slow 😜", "Not happening 😂", "Try again 🙈", "The No button is shy 🫣", "Almost… 😏"];
  let dodges = 0, last = 0, gaveUp = false, done = false;

  const finish = (msg) => {
    if (done) return;
    done = true;
    yes.disabled = true; no.disabled = true;
    fb.textContent = msg;
    buddyReact("I KNEW you'd say yes 😎", true);
    burstAt(yes, 120, 0.9);
    next(1800);
  };

  const dodge = (e) => {
    if (gaveUp || done) return;
    if (e) e.preventDefault();
    const now = performance.now();
    if (now - last < 250) return;
    last = now;
    dodges++;

    const cr = card.getBoundingClientRect();
    const br = no.getBoundingClientRect();
    if (!no.classList.contains("runaway")) {
      // lift it out of the row at its current spot so it can glide away
      // leave an invisible twin behind so the Yes button doesn't slide under her finger
      const ghost = no.cloneNode(true);
      ghost.removeAttribute("id");
      ghost.style.visibility = "hidden";
      ghost.setAttribute("aria-hidden", "true");
      no.after(ghost);
      no.classList.add("runaway");
      no.style.left = `${br.left - cr.left}px`;
      no.style.top = `${br.top - cr.top}px`;
      card.appendChild(no);
      void no.offsetWidth;
    }
    const yr = yes.getBoundingClientRect();
    const px = e && e.clientX != null ? e.clientX : br.left + br.width / 2;
    const py = e && e.clientY != null ? e.clientY : br.top + br.height / 2;
    // only jump to spots inside the part of the card that is on screen
    const minX = Math.max(cr.left, 0) - cr.left + 10;
    const maxX = Math.min(cr.right, innerWidth) - cr.left - br.width - 10;
    const minY = Math.max(cr.top, 0) - cr.top + 16;
    const maxY = Math.min(cr.bottom, innerHeight) - cr.top - br.height - 16;
    const fullCard = maxY - minY < 30 || maxX - minX < 30;
    const loX = fullCard ? 10 : minX, hiX = fullCard ? cr.width - br.width - 10 : maxX;
    const loY = fullCard ? 16 : minY, hiY = fullCard ? cr.height - br.height - 16 : maxY;
    const avoid = [...$("#quiz-stage").querySelectorAll(".q-step, .q-text, .q-feedback")].map((el) => el.getBoundingClientRect());
    const overlaps = (ax, ay, r, pad) => ax < r.right + pad && ax + br.width > r.left - pad && ay < r.bottom + pad && ay + br.height > r.top - pad;
    let x = 0, y = 0;
    for (let t = 0; t < 80; t++) {
      x = loX + Math.random() * Math.max(0, hiX - loX);
      y = loY + Math.random() * Math.max(0, hiY - loY);
      const ax = cr.left + x, ay = cr.top + y;
      const hitsYes = ax < yr.right + 16 && ax + br.width > yr.left - 16 && ay < yr.bottom + 16 && ay + br.height > yr.top - 16;
      const nearFinger = Math.hypot(ax + br.width / 2 - px, ay + br.height / 2 - py) < 120;
      const coversText = t < 60 && avoid.some((r) => overlaps(ax, ay, r, 6));
      if (!hitsYes && !nearFinger && !coversText) break;
    }
    no.style.left = `${x}px`;
    no.style.top = `${y}px`;
    if (fullCard) keepQuizInView();
    yes.style.fontSize = `${1.05 + Math.min(dodges, 6) * 0.12}rem`;
    fb.textContent = lines[(dodges - 1) % lines.length];
    Sound.fx.boing();
    buddyReact(["Hahaha 😂", "It won't let you 🤭", "Just press Yes 🙄", "Keep trying 😂", "Give up already 😆"][(dodges - 1) % 5]);

    if (dodges >= 6) {
      gaveUp = true;
      no.textContent = "Yes 💖";
      no.classList.add("primary");
      fb.textContent = "Okay fine, the No button quit 😂 Both say Yes now.";
    }
  };

  no.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") dodge(e); });
  no.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") dodge(e); }); // mouse already resting on it
  no.addEventListener("pointerdown", (e) => dodge(e));
  no.addEventListener("click", (e) => {
    if (gaveUp) {
      if (performance.now() - last < 450) return; // same tap that made it give up
      return finish("😂 Even the No button agrees. Correct!");
    }
    dodge(e);
  });
  yes.addEventListener("click", () => {
    if (performance.now() - last < 450) return; // ignore a stray tap right after a dodge
    finish("✅ Correct! Science agrees.");
  });
}

function renderAutotype(q, i) {
  const s = stage(`
    ${stepLabel(i)}
    <p class="q-text">${esc(q.text)}</p>
    <input class="q-input" id="q-type" type="text" placeholder="Type your answer…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
    <p class="q-note" id="q-hint">&nbsp;</p>
    <button class="btn small" id="q-sub" disabled>Submit ✅</button>
    <p class="q-feedback" id="q-fb"></p>`);
  const input = $("#q-type", s), hint = $("#q-hint", s), sub = $("#q-sub", s), fb = $("#q-fb", s);
  let n = 0;
  const sync = (e) => {
    const deleting = e && e.inputType && e.inputType.startsWith("delete");
    if (deleting) { toast("No deleting allowed 😤"); }
    else {
      const added = Math.max(1, input.value.length - n);
      n = Math.min(TARGET.length, n + added);
    }
    input.value = TARGET.slice(0, n);
    if (n > 0) hint.textContent = "(autocorrect is on 😇)";
    if (n >= TARGET.length) {
      input.readOnly = true;
      sub.disabled = false;
      hint.textContent = "Wow. Honest answer 😌";
      buddyReact("Autocorrect knows the truth 😇");
    }
  };
  input.addEventListener("input", sync);
  input.addEventListener("compositionend", () => sync());
  sub.addEventListener("click", () => {
    sub.disabled = true;
    fb.textContent = "📢 You said it yourself! It's in writing now.";
    buddyReact("Screenshot! It's official now 📸", true);
    burstAt(sub, 120, 0.9);
    next(2000);
  });
}

function renderAloud(q, i) {
  const s = stage(`
    ${stepLabel(i)}
    <p class="q-text">One last thing. Read this out loud, just once 🎤</p>
    <p class="q-text" style="font-family:'Caveat',cursive;font-size:2rem;color:#e2468f">“I am the most beautiful girl in the world.”</p>
    <button class="btn" id="q-said">Okay, I said it 🙈</button>
    <p class="q-feedback" id="q-fb"></p>`);
  $("#q-said", s).addEventListener("click", (e) => {
    e.currentTarget.disabled = true;
    $("#q-fb", s).textContent = "We believe you 😌";
    buddyReact("I heard that 👂😄");
    burstAt(e.currentTarget, 80, 0.8);
    next(1300);
  });
}

function keepQuizInView() {
  requestAnimationFrame(() => {
    const r = $("#quiz-card").getBoundingClientRect();
    if (r.top < 0 || r.bottom > innerHeight) $("#quiz-card").scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function showResult() {
  setProgress(TOTAL);
  setTimeout(() => buddyReact("The most beautiful girl in the world 👑 Told you!", true), 400);
  keepQuizInView();
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const s = stage(`
    <div class="trophy">🏆</div>
    <div class="certificate">
      <h3>Official Quiz Result</h3>
      <p>This certifies that</p>
      <p class="cert-name">${esc(N)}</p>
      <p>has confirmed, in her own words, that she is</p>
      <p class="cert-title">The Most Beautiful Girl in the World 👑</p>
      <small>Score: 100% · No take-backs · ${esc(date)}<br />Witnessed by this website, a lot of confetti, and everyone who adores her.</small>
    </div>
    <button class="q-btn" id="q-retry">Retake the quiz (the answer won't change 😌)</button>`);
  rain(220);
  setTimeout(() => burst(innerWidth / 2, innerHeight / 2, 200, 1.1), 300);
  $("#q-retry", s).addEventListener("click", renderStart);
}

/* ---------- Fill content from CONFIG ---------- */
function fill() {
  document.title = `Happy Birthday, ${N}! 🎂`;
  $("#intro-hint").textContent = `${N}, someone left a little something for you…`;
  $("#name-text").textContent = N;
  $("#subtitle").textContent = CONFIG.subtitle;
  $("#avatar").src = CONFIG.avatar;
  $("#avatar").alt = N;
  $("#footer-text").textContent = `Made with lots of 💖 for ${N}`;

  const hb = $("#hb-text");
  hb.innerHTML = [...hb.textContent].map((ch, i) =>
    ch === " " ? " " : `<span style="animation-delay:${i * 0.08}s">${ch}</span>`).join("");

  // Gallery
  const g = $("#gallery");
  CONFIG.photos.forEach((p, i) => {
    const fig = document.createElement("figure");
    fig.className = "polaroid";
    fig.tabIndex = 0;
    fig.style.setProperty("--r", `${(i % 2 ? 1 : -1) * (1.5 + Math.random() * 2.5)}deg`);
    fig.innerHTML = `<div class="ph" style="background:linear-gradient(135deg, ${palette[i % 6]}55, ${palette[(i + 2) % 6]}55)"><img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy" /></div><figcaption>${esc(p.caption)}</figcaption>`;
    const open = () => openLightbox(i);
    fig.addEventListener("click", open);
    fig.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    g.appendChild(fig);
  });

  // Reasons
  const r = $("#reasons");
  CONFIG.reasons.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<div class="card-inner">
      <div class="card-face card-front" style="background:linear-gradient(135deg, ${palette[i % 6]}, ${palette[(i + 1) % 6]})">${item.icon}<small>#${i + 1}</small></div>
      <div class="card-face card-back">${esc(item.text)}</div></div>`;
    card.addEventListener("click", (e) => {
      card.classList.toggle("flipped");
      if (card.classList.contains("flipped")) { burst(e.clientX, e.clientY, 30, 0.5); buddyReact(["True! 💯", "100% facts ✅", "So true ✨", "Exactly 😌"][i % 4]); }
    });
    r.appendChild(card);
  });

  // Candles
  const cWrap = $("#candles");
  let lit = CONFIG.candles;
  for (let i = 0; i < CONFIG.candles; i++) {
    const c = document.createElement("div");
    c.className = "candle";
    c.innerHTML = `<span class="flame"></span>`;
    c.addEventListener("click", () => {
      if (c.classList.contains("out")) return;
      c.classList.add("out");
      Sound.fx.puff();
      if (lit === CONFIG.candles) buddyReact("Did you make a wish first? 🤫");
      if (--lit === 0) {
        buddyReact("Yaaay! 🎂 Now cut it yourself!", true);
        const rect = $("#cake").getBoundingClientRect();
        burst(rect.left + rect.width / 2, rect.top + 40, 220, 1.1);
        setTimeout(rain, 300);
        $("#wish-msg").classList.add("show");
        setTimeout(() => { $("#knife").classList.add("ready"); $("#cut-hint").classList.add("show"); }, 900);
      }
    });
    cWrap.appendChild(c);
  }

  $("#signature").textContent = `— ${CONFIG.from}`;
  buildFriends();
  renderStart();
}

/* ---------- Cake cutting & feeding friends ---------- */
let sliceReady = false;
function serveSlice() {
  const s = $("#slice");
  s.classList.remove("show"); void s.offsetWidth; s.classList.add("show");
  sliceReady = true;
}
// She cuts it herself: drag the knife down through the cake
(function knifeDrag() {
  const knife = $("#knife"), line = $("#cut-line");
  const MAX = 250, CUT_AT = 200;
  let startY = null, dy = 0, moved = false, cut = false;
  const setKnife = (v) => {
    knife.style.transform = `translateY(${v}px) rotate(45deg)`;
    line.style.height = `${Math.max(0, Math.min(172, v - 70))}px`;
  };
  const finishCut = () => {
    cut = true;
    Sound.fx.slice();
    knife.classList.remove("dragging", "ready");
    knife.classList.add("done");
    line.classList.remove("live");
    line.classList.add("show");
    line.style.height = "";
    $("#cut-hint").classList.remove("show");
    burstAt($("#cake"), 80, 0.7);
    buddyReact("Perfect cut! 👏 Now feed everyone 🍰", true);
    setTimeout(() => {
      serveSlice();
      $("#feed").classList.add("show");
      $("#feed").scrollIntoView({ behavior: "smooth", block: "center" });
    }, 700);
  };
  knife.addEventListener("pointerdown", (e) => {
    if (cut || !knife.classList.contains("ready")) return;
    e.preventDefault();
    knife.setPointerCapture(e.pointerId);
    startY = e.clientY; dy = 0; moved = false;
    knife.classList.remove("returning");
    knife.classList.add("dragging");
    line.classList.add("live");
  });
  knife.addEventListener("pointermove", (e) => {
    if (startY == null || cut) return;
    const scale = $("#cake").getBoundingClientRect().height / $("#cake").offsetHeight || 1;
    dy = Math.max(0, Math.min(MAX, (e.clientY - startY) / scale));
    if (dy > 6) moved = true;
    setKnife(dy);
    if (dy >= CUT_AT) { startY = null; finishCut(); }
  });
  const release = () => {
    if (startY == null || cut) return;
    startY = null;
    knife.classList.remove("dragging");
    knife.classList.add("returning");
    setKnife(0);
    if (!moved) toast("Hold the knife and drag it down 👇");
    else buddyReact("Almost! Go all the way down 💪");
  };
  knife.addEventListener("pointerup", release);
  knife.addEventListener("pointercancel", release);
  knife.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && !cut && knife.classList.contains("ready")) finishCut(); });
})();
function buildFriends() {
  const wrap = $("#friends");
  let fedCount = 0;
  CONFIG.friends.forEach((f) => {
    const b = document.createElement("button");
    b.className = "friend";
    const pos = (p) => `left:${p[0]}%;top:${p[1]}%`;
    const crumbs = [-14, 10, -4].map((dx, k) => `<span class="crumb" style="left:${f.mouth[0] + (k - 1) * 6}%;top:${f.mouth[1] + 8}%;--dx:${dx}px;animation-delay:${k * 0.3}s"></span>`).join("");
    b.innerHTML = `<span class="face" style="--skin:${esc(f.skin || "#a86b4c")}">
        <img src="${esc(f.src)}" alt="${esc(f.name || "Friend")}" />
        ${(f.eyes || []).map((e) => `<span class="eye-cover" style="${pos(e)}"></span>`).join("")}
        <span class="big-mouth" style="${pos(f.mouth || [50, 70])}"></span>${crumbs}
      </span>
      ${f.name ? `<strong>${esc(f.name)}</strong>` : ""}<span class="bubble"></span><span class="tap">tap to feed 🍰</span>`;
    b.addEventListener("click", () => {
      if (!sliceReady || b.classList.contains("fed")) {
        if (b.classList.contains("fed")) toast("Already fed! Try someone else 😄");
        return;
      }
      sliceReady = false;
      b.classList.add("open"); // say "aaa"
      const from = $("#slice").getBoundingClientRect();
      const to = $(".big-mouth", b).getBoundingClientRect();
      $("#slice").classList.remove("show");
      const fly = document.createElement("div");
      fly.className = "flying-slice";
      fly.textContent = "🍰";
      document.body.appendChild(fly);
      const sx = from.left, sy = from.top;
      const ex = to.left + to.width / 2 - 24, ey = to.top + to.height / 2 - 28;
      const mx = (sx + ex) / 2, my = Math.min(sy, ey) - 120;
      const anim = fly.animate([
        { transform: `translate(${sx}px, ${sy}px) scale(1) rotate(0deg)` },
        { transform: `translate(${mx}px, ${my}px) scale(1.25) rotate(180deg)`, offset: 0.5 },
        { transform: `translate(${ex}px, ${ey}px) scale(.5) rotate(360deg)` },
      ], { duration: 900, easing: "ease-in-out" });
      anim.onfinish = () => {
        fly.remove();
        b.classList.remove("open");
        b.classList.add("chewing");
        [0, 650, 1300, 1950].forEach((t) => setTimeout(() => Sound.fx.munch(), t));
        buddyReact(["Nom nom nom 😋", "Look at them chew 😂", "Delicious! 🍰", "Me next? 🥺"][fedCount % 4]);
        setTimeout(() => {
          b.classList.remove("chewing");
          b.classList.add("fed");
          $(".bubble", b).textContent = f.says;
          burstAt($(".face", b), 40, 0.5);
        }, 2600);
        fedCount++;
        if (fedCount >= CONFIG.friends.length) {
          setTimeout(() => {
            $("#feed-done").textContent = "Everyone's full and happy. Best birthday host ever! 🎉";
            rain(200);
            buddyReact("Best birthday host ever! 🎉", true);
          }, 2700);
        } else {
          setTimeout(serveSlice, 350);
        }
      };
    });
    wrap.appendChild(b);
  });
}

/* ---------- Lightbox ---------- */
let lbIndex = 0;
function openLightbox(i) {
  buddyReact(["Gorgeous 😍", "This one's my favourite 📸", "Wow 🤩", "Look at that smile ✨"][(i + 1) % 4]);
  lbIndex = (i + CONFIG.photos.length) % CONFIG.photos.length;
  const p = CONFIG.photos[lbIndex];
  $("#lb-img").src = p.src; $("#lb-img").alt = p.caption;
  $("#lb-cap").textContent = p.caption;
  $("#lightbox").classList.add("open");
  $("#lightbox").setAttribute("aria-hidden", "false");
}
function closeLightbox() {
  $("#lightbox").classList.remove("open");
  $("#lightbox").setAttribute("aria-hidden", "true");
}
$("#lb-close").addEventListener("click", closeLightbox);
$("#lb-prev").addEventListener("click", (e) => { e.stopPropagation(); openLightbox(lbIndex - 1); });
$("#lb-next").addEventListener("click", (e) => { e.stopPropagation(); openLightbox(lbIndex + 1); });
$("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });
addEventListener("keydown", (e) => {
  if (!$("#lightbox").classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
  if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
});
let touchX = null;
$("#lightbox").addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
$("#lightbox").addEventListener("touchend", (e) => {
  if (touchX == null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) openLightbox(lbIndex + (dx < 0 ? 1 : -1));
  touchX = null;
});

/* ---------- Typewriter letter ---------- */
let typed = false;
function typeLetter() {
  if (typed) return; typed = true;
  const el = $("#letter");
  const text = CONFIG.message.replaceAll("{name}", N);
  let i = 0;
  const cursor = document.createElement("span"); cursor.className = "cursor";
  const node = document.createTextNode("");
  el.append(node, cursor);
  (function step() {
    node.data = text.slice(0, ++i);
    if (i < text.length) setTimeout(step, text[i - 1] === "\n" ? 180 : 26);
    else { cursor.remove(); $("#signature").classList.add("show"); burst(innerWidth / 2, innerHeight * 0.6, 80, 0.7); buddyReact("Happy birthday, Ishani 💛", true); }
  })();
}

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("visible");
    if (en.target.classList.contains("message-section")) setTimeout(typeLetter, 600);
  });
}, { threshold: 0.2 });
document.querySelectorAll(".reveal").forEach((s) => io.observe(s));

/* ---------- Intro gift ---------- */
let opened = false;
$("#gift").addEventListener("click", () => {
  if (opened) return;
  opened = true;
  Sound.unlock(); Sound.fx.yay();
  $("#gift").classList.add("open");
  const rect = $("#gift").getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + 20, 220, 1.2);
  setTimeout(() => {
    $("#intro").classList.add("gone");
    $("#site").classList.remove("hidden");
    makeBalloons();
    rain(160);
    buddyStart();
  }, 700);
  setTimeout(() => $("#intro").remove(), 1600);
});

$("#celebrate").addEventListener("click", (e) => {
  buddyReact("Woohoo! 🥳 Now scroll down 👇", true);
  burst(e.clientX, e.clientY, 200, 1.1);
  setTimeout(() => burst(innerWidth * 0.2, innerHeight * 0.4, 120), 250);
  setTimeout(() => burst(innerWidth * 0.8, innerHeight * 0.4, 120), 500);
});
$("#again").addEventListener("click", () => { buddyReact("Again!? Okay 😆🎊", true); rain(250); burst(innerWidth / 2, innerHeight * 0.7, 200, 1.2); });

fill();
