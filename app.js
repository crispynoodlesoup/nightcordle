const guessesBox = document.querySelector(".guesses");

let guesses = ["", "", "", "", ""];

guesses.forEach((text) => {
  const tryBox = document.createElement("div");
  tryBox.className = "try-box";

  const p = document.createElement("p");
  p.innerText = text;

  tryBox.append(p);
  guessesBox.append(tryBox);
});

const skip = document.querySelector(".skip");
const speedText = document.querySelector(".speed-multiplier");

const speeds = [16, 8, 4, 2, 1];
let stage = 0;

const play = document.querySelector(".play");
const audio1 = document.querySelector(".aud");
const progress = document.querySelector(".song-progress");
const durationLabel = document.querySelector(".duration");

//determine random song to play
const bopNum = Math.floor(Math.random() * 201) + 1;
audio1.src = `bops/(${bopNum}).mp3`;
audio1.volume = 0.1;

let playing = false;

audio1.onloadedmetadata = function () {
  durationLabel.innerText = `
    0 of ${String((audio1.duration / speeds[stage]).toFixed(1))}
  `;
};

// function for animation progress bar
let start;
let prevElapsed = 0;
function progressBarStep(timestamp) {
  if (start === undefined) {
    start = timestamp;
  }
  const elapsed = (timestamp - start) / 1000 + prevElapsed; // in seconds
  const totalTime = audio1.duration / speeds[stage];
  const percentDone = (elapsed / totalTime) * 100;

  progress.style.setProperty(
    "--progress",
    `max(-${100 - percentDone}%, -100%)`
  );

  durationLabel.innerText = `
    ${String(elapsed.toFixed(1))} of ${String(totalTime.toFixed(1))}
  `;

  if (percentDone <= 100 && playing) {
    requestAnimationFrame(progressBarStep);
  } else {
    prevElapsed = percentDone <= 100 ? elapsed : 0;
    start = undefined;
  }
}

play.addEventListener("click", () => {
  if (playing === false) {
    // play music
    audio1.playbackRate = speeds[stage];
    audio1.play();

    // start progress bar animation
    requestAnimationFrame(progressBarStep);
  } else {
    audio1.pause();
  }
  playing = !playing;
});

audio1.addEventListener("ended", () => {
  playing = false;
});

skip.addEventListener("click", () => {
  stage++;

  // to delete on real game
  if (stage >= speeds.length) stage = 0;

  speedText.innerText = `${speeds[stage]}x`;

  audio1.currentTime = 0;
  audio1.pause();
  playing = false;

  prevElapsed = 0;
  start = undefined;
  requestAnimationFrame(progressBarStep);
});

const mutag = window.jsmediatags;
jsmediatags.read(`http://127.0.0.1:5500/bops/(${bopNum}).mp3`, {
  onSuccess: function (tag) {
    console.log(`THE SONG IS: ${tag.tags.title} by ${tag.tags.artist}`);
  },
  onError: function (error) {
    console.log(error);
  },
});

const forwardRing = document.querySelector(".forward-ring");

forwardRing.addEventListener("mousedown", () => {
  forwardRing.className = "forward-ring forward-spin";
  //idk figure out skipping later
});

forwardRing.addEventListener("animationend", () => {
  forwardRing.className = "forward-ring";
});
