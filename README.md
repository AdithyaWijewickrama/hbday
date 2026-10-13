# Happy Birthday, Ishani 🎂💙

A little birthday surprise website: a gift box intro, a trick quiz, a 3D cake she blows out and cuts herself,
friends who eat the cake, a photo gallery where the boy doodles on her face, flip cards, a typed-out note, and a tiny
party boy who follows her around, asks silly questions and gets up to mischief.

Plain HTML, CSS and JavaScript. No build step, nothing to install.

## Files

| File | What it does |
| --- | --- |
| `index.html` | the page |
| `css/style.css` | page styles (blue theme, phone layout, the boy's doodles) |
| `css/buddy.css` | the little boy's looks and moves |
| `js/main.js` | **`CONFIG` block at the top (edit this)**, quiz, gallery, balloons, confetti, letter, friends eating cake |
| `js/cake.js` | the 3D cake: wish, blow the candles, cut it |
| `js/buddy.js` | the little boy: moving around, questions, tilt, shake, tickles, boredom tricks |
| `js/doodle.js` | the boy drawing doodles and emojis on her photos |
| `js/extras.js` | small extras: double-tap hearts, falling crown, hold-the-boy, dog rain |
| `js/sound.js` | soft sounds made in the browser (no audio files) |
| `photos/` | all the pictures |

---

## 1. Put it online (needed for tilt, shake and the mic)

Phones only give the motion sensors and the microphone to websites served over **https**.
If you open `index.html` straight from a folder, everything works **except** tilt, shake and the mic.

**GitHub Pages (free, https):**

1. Push this folder to your GitHub repo.
2. On GitHub open the repo, then **Settings → Pages**.
3. Under *Build and deployment* pick **Deploy from a branch**, branch **`main`**, folder **`/ (root)`**, and press **Save**.
4. Wait a minute or two. The link appears at the top of that page, like
   `https://<your-username>.github.io/hbday/`.
5. Open that link on the phone and send it to her.

After pushing a change, GitHub updates the site within a minute or two. If the phone still shows the old
version, pull down to refresh, or open the link in a private/incognito tab.

**Testing on your computer:** opening the file directly is fine for everything except the items above.
To test those too, run a tiny server in the folder, `python -m http.server 8000`, and open `http://localhost:8000`.

## 2. Turning on each feature

| Feature | Android (Chrome) | iPhone (Safari) |
| --- | --- | --- |
| **Sound** | Starts after the first tap anywhere. Turn the **media volume** up. The 🔊 button at the bottom left mutes and unmutes. | Same, and the **ring/silent switch** must be off (no orange showing). |
| **Tilt** (the boy feels gravity) | Works by itself on the https link. If not, open Chrome **⋮ → Settings → Site settings → Motion sensors** and make sure it's allowed. | The first tap on the page asks **"Allow access to motion and orientation"**. Tap **Allow**. If she pressed *Don't allow*, close the tab completely and open the link again. |
| **Shake for confetti** | Same as tilt. | Same as tilt. |
| **Blow into the mic** | On the cake press **🎤 Blow into the mic** and tap **Allow**. | Same. |

Hold the phone upright and tilt it left or right like a steering wheel; that's what the boy reacts to.
Lying the phone flat on a table does nothing, on purpose.

If tilt doesn't react in Samsung Internet or another browser, open the link in **Chrome**.

**Phones like the Honor X6b or Samsung M13:** the site detects phones and lower-power devices and switches to a
lighter mode automatically (fewer balloons and confetti, simpler shadows, fewer sounds at once, and animations
pause while they're scrolled off screen). Nothing to turn on. If it still feels slow, close other apps and tabs,
and turn off *Power saving mode*, which slows the browser down.

## 3. All the things she can do

**Top of the page**
- 🎁 Tap the gift box to open the site.
- 👀 **Tap her photo** to open it big, and the boy runs in to doodle on her (see Gallery).
- 👑 **Tap the crown**: it falls off, bounces, and pops back on.
- ✨ **Tap her name** for sparkles.
- 🎈 **Tap the balloons** to pop them (the boy keeps count). There are 9 on phones and 18 on computers, and a new one floats up for every one she pops.
- 💙 **Double-tap any empty spot** for floating hearts.

**The quiz**
- 8 trick questions. The *No* button runs away. In the "type the truth" question, whatever she types turns into
  *"I am the most beautiful girl in the world 💖"*. She can't delete, paste, or submit until the whole sentence is typed.

**The cake**
- Make a wish (eyes-closed countdown), then blow the candles out: **swipe over the flames**, **tap them**, or **blow into the mic**. One candle may relight. 😏
- Cut it with **two swipes** across the cake, then feed slices to her friends and watch them eat.

**Gallery**
- Tap a photo to open it big. Swipe or use the arrows.
- ✏️ **Whenever she opens a photo with her in it, the boy runs in with a giant pencil**, the photo zooms in on her face,
  and he draws silly things on her (mustache, glasses, crown, devil horns, cat whiskers, unibrow, beard, clown nose, blush…)
  and sticks emojis on (👑 🕶️ 🌸 🎀 🐶 🦋…). It's different every time.
- **Tap the photo** and he adds one more. **🧽 Clean her face** wipes it (he's not happy about it).

**The little boy**
- He comes in from different sides: hanging from a rope by one hand, by parachute, climbing the wall, running or jumping in.
- He asks funny questions (some about **Tobby and Bobby**). She taps an answer.
- **Tap him** to tickle him. Tap him 5 times quickly and he gets dizzy.
- **Press and hold him** and he sends her a 💙.
- **go away 👋** sends him off sulking. Later he sneaks back from behind a photo and asks *"may I come out?"*.
- **Tilt the phone** and he holds on for dear life. Keep it tilted and he falls off.
- **Shake the phone** for a confetti earthquake (he gets dizzy).
- Leave him alone and he gets bored: pops balloons with a pin, blows bubble gum, takes selfies, dances, yawns.
- **Turn the phone sideways** and he notices.

**Secret**
- 🐶 **Tap "Made with lots of 💖" at the very bottom 3 times** for a Tobby and Bobby rain.

## 4. Changing things

Everything personal is in the `CONFIG` block at the top of `js/main.js`:

- `name`, `from`, `subtitle`, `message`: the text.
- `age`: shown on the cake and candles.
- `dogs`: her dogs' names, used in the boy's questions and the secret dog rain.
- `photos`: gallery photos and captions (files go in `photos/`).
- `avatar`: the round photo at the top.
- `photos[].face`: where Ishani's face is in each photo, so the boy knows where to draw: `eyes` and `mouth` in % of the
  picture (x from the left, y from the top). Leave `face` out and he won't draw on that photo. For side-on photos add
  `profile: true` and he skips glasses and whiskers.
- `friends`: the friends who eat cake: photo, skin colour, and where their eyes and mouth are (in % of the photo).

The boy's questions are the `QUESTIONS` list in `js/buddy.js`.
