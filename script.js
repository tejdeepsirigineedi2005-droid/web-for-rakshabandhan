/* ============================================================
   RAKSHA BANDHAN SURPRISE WEBSITE - LOGIC
   ============================================================
   1) Photos: mee photos ni assets/photos/ folder lo pettandi,
      taruvata ee kinda "photoList" array lo filenames add cheyandi.
   2) Audio: assets/audio/bg-music.mp3 file pettandi (idే name tho,
      leda kinda AUDIO_FILE variable marchandi).
   3) Video: assets/video/surprise-video.mp4 file pettandi (leda
      VIDEO_FILE variable marchandi).
   ============================================================ */

// ---- EDIT THESE ----
const photoList = [
  "assets/photos/pic1.png",
  "assets/photos/pic2.png",
  "assets/photos/pic3.png",
  "assets/photos/pic4.png",
  "assets/photos/pic5.png",
  "assets/photos/pic6.png",
  "assets/photos/pic7.png",
];
const AUDIO_FILE = "assets/audio/bg-music.mp3";
const VIDEO_FILE = "assets/vedio/surprise-video.mp4";
// ---------------------

let selectedReaction = "Loved it ❤️";
let userName = "";


document.getElementById("secondSurpriseVideo").src = VIDEO_FILE;
document.getElementById("bgm").src = AUDIO_FILE;

/* ---------- Background slideshow ---------- */
const bgSlides = document.getElementById("bg-slides");
let slideIndex = 0;

function showNextSlide() {
  if (photoList.length === 0) {
    bgSlides.style.background =
      "radial-gradient(circle at center, #3a0011, #000)";
    return;
  }
  bgSlides.style.backgroundImage = `url('${photoList[slideIndex]}')`;
  slideIndex = (slideIndex + 1) % photoList.length;
}
showNextSlide();
setInterval(showNextSlide, 4000);

/* ---------- Screen switching helper ---------- */
function goToScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ---------- Screen 1 -> 2 ---------- */
const bgm = document.getElementById("bgm");
document.getElementById("btn-surprise").addEventListener("click", () => {
  bgm.volume = 0.6;
  bgm.play().catch(() => {}); // user gesture happened, so play should work
  goToScreen("screen2");
});

/* ---------- Screen 2 -> 3 ---------- */
document.getElementById("btn-name").addEventListener("click", nameSubmit);
document.getElementById("nameInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") nameSubmit();
});

function nameSubmit() {
  const nameValue = document.getElementById("nameInput").value.trim();

  if (!nameValue) {
    alert("Pేరు type చెయ్యండి 🙂");
    return;
  }

  userName = nameValue;
  goToScreen("screen3");
  runHeroSequence();
}

/* ---------- Screen 3: hero walk + rose + wish text ---------- */
function runHeroSequence() {
  const hero = document.getElementById("hero");
  const rose = document.getElementById("rose");
  const wishText = document.getElementById("wishText");

  // reset state
  hero.classList.remove("walk-in");
  rose.classList.remove("bloom");
  wishText.classList.remove("show");
  wishText.textContent = "";

  // 1) hero walks to center
  setTimeout(() => hero.classList.add("walk-in"), 200);

  // 2) rose blooms
  setTimeout(() => rose.classList.add("bloom"), 3400);

  // 3) wish text appears
  setTimeout(() => {
    wishText.textContent = `Happy Raksha Bandhan ${userName} garu ❤️`;
    wishText.classList.add("show");
  }, 4400);

  // 4) move to gift intro page (after 12.5 seconds - giving 5 extra seconds for hero+rose+wish to show)
  setTimeout(() => {
    goToScreen("screen4");
  }, 12500);
}

document.getElementById("btn-open-gift").addEventListener("click", () => {
  goToScreen("screen5");
  playSecondSurpriseVideo();
});

function playSecondSurpriseVideo() {
  const video = document.getElementById("secondSurpriseVideo");
  const giftBox = document.querySelector(".gift-box-wrap");
  const giftText = document.querySelector(".gift-overlay");

  bgm.pause();
  bgm.currentTime = 0;
  video.currentTime = 0;
  video.muted = false;
  spawnHearts();
  spawnSparkles();

  if (giftBox) giftBox.classList.add("show");
  if (giftText) giftText.classList.add("show");

  setTimeout(() => {
    if (giftBox) giftBox.classList.remove("show");
    if (giftText) giftText.classList.remove("show");
    video.play().catch(() => {
      video.muted = true;
      video.play();
    });
  }, 1800);

  const el = video;
  const requestFS =
    el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.webkitEnterFullscreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen;
  if (requestFS) {
    requestFS.call(el).catch(() => {});
  }

  video.onended = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setTimeout(() => {
      goToScreen("screen7");
    }, 1000);
  };
}

function spawnHearts() {
  const heartContainer = document.getElementById("heartContainer");
  if (!heartContainer) return;

  heartContainer.innerHTML = "";
  for (let i = 0; i < 26; i++) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = i % 2 === 0 ? "💖" : "💗";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${(Math.random() * 2).toFixed(2)}s`;
    heart.style.animationDuration = `${4 + Math.random() * 4}s`;
    heartContainer.appendChild(heart);
  }
}

function spawnSparkles() {
  const sparkleContainer = document.getElementById("sparkleContainer");
  if (!sparkleContainer) return;

  sparkleContainer.innerHTML = "";
  for (let i = 0; i < 30; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.textContent = i % 2 === 0 ? "✦" : "✧";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${(Math.random() * 2).toFixed(2)}s`;
    sparkle.style.animationDuration = `${2 + Math.random() * 3}s`;
    sparkleContainer.appendChild(sparkle);
  }
}

/* ---------- Screen 7: final reaction ---------- */
document.querySelectorAll(".reaction-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedReaction = btn.dataset.reaction;
    document.querySelectorAll(".reaction-btn").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
  });
});

document.getElementById("btn-feedback-page").addEventListener("click", () => {
  goToScreen("screen8");
  fadeOutMusic();
});

/* ---------- Screen 8 -> Screen 9 (Flower & Spider) ---------- */
document.getElementById("btn-flower-spider").addEventListener("click", () => {
  goToScreen("screen9");
});

/* ---------- Music fadeout ---------- */
function fadeOutMusic() {
  const fade = setInterval(() => {
    if (bgm.volume > 0.05) {
      bgm.volume -= 0.05;
    } else {
      bgm.pause();
      clearInterval(fade);
    }
  }, 200);
}