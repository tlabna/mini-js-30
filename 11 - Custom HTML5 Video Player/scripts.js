/* Get our elements */
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");
const fullscreenButton = player.querySelector(".fullscreen");

/* Build out functions */
function togglePlay() {
  video.paused ? video.play() : video.pause();
}

function updateButton() {
  const icon = this.paused ? "►" : "▌▌";
  toggle.textContent = icon;
}

function skip() {
  console.log(this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
  console.log(this.name, this.value);
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
  console.log(e);
}

// Setup fullscreen function
// requestFullscreen() may not work on all browsers...
const browserReq = [
  ["mozRequestFullScreen", "mozCancelFullScreen"],
  ["msRequestFullscreen", "msExitFullscreen"],
  ["webkitRequestFullScreen", "webkitExitFullscreen"]
];

let fullscreenFunc = player.requestFullscreen;
let exitFullscreenFunc = document.exitFullscreen;

// if fullscreen function not available try the others
if (!fullscreenFunc) {
  browserReq.forEach(
    req => (fullscreenFunc = fullscreenFunc || player[req[0]])
  );
}

// Do the same for exitFullscreen
if (!exitFullscreenFunc) {
  browserReq.forEach(
    req => (exitFullscreenFunc = exitFullscreenFunc || document[req[1]])
  );
}

let isFullscreen = false;

function toggleFullScreen() {
  if (isFullscreen === false) {
    // call function on player element
    fullscreenFunc.call(player);
    isFullscreen = true;
    console.log("fullscreen");
  } else {
    exitFullscreenFunc.call(document);
    isFullscreen = false;
    console.log("exit fullscreen");
  }
}

/* Hook up event listeners */
video.addEventListener("click", togglePlay);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("timeupdate", handleProgress);

toggle.addEventListener("click", togglePlay);

skipButtons.forEach(button => button.addEventListener("click", skip));

let mousedown = false;

ranges.forEach(range => range.addEventListener("change", handleRangeUpdate));
ranges.forEach(range =>
  range.addEventListener(
    "mousemove",
    () => mousedown === false && handleRangeUpdate
  )
);
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));

progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", e => mousedown && scrub(e));
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));

fullscreenButton.addEventListener("click", toggleFullScreen);
