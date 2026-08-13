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

document.getElementById("surpriseVideo").src = VIDEO_FILE;
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
let userName = "";
document.getElementById("btn-name").addEventListener("click", nameSubmit);
document.getElementById("nameInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") nameSubmit();
});

function nameSubmit() {
  const val = document.getElementById("nameInput").value.trim();
  if (!val) {
    alert("Pేరు type చెయ్యండి 🙂");
    return;
  }
  userName = val;
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
    wishText.textContent = `Happy Raksha Bandhan ${userName} 💐`;
    wishText.classList.add("show");
  }, 4400);

  // 4) move to last surprise video
  setTimeout(() => {
    goToScreen("screen4");
    playLastSurpriseVideo();
  }, 7500);
}


/* ---------- Screen 4: Last surprise video ---------- */
function playLastSurpriseVideo() {
  const video = document.getElementById("surpriseVideo");
  video.currentTime = 0;
  video.muted = false;

  // Stop background music when video plays
  bgm.pause();
  bgm.currentTime = 0;

  video.play().catch(() => {
    video.muted = true;
    video.play();
  });

  // Try fullscreen
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
    goToScreen("screen5");
    fadeOutMusic();
  };
}

/* ---------- Screen 5: goodbye with video ---------- */
function fadeOutMusic() {
  const byeVideo = document.getElementById("byeVideo");
  // Unmute the goodbye video
  byeVideo.muted = false;
  
  const fade = setInterval(() => {
    if (bgm.volume > 0.05) {
      bgm.volume -= 0.05;
    } else {
      bgm.pause();
      clearInterval(fade);
    }
  }, 200);
}