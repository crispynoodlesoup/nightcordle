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

//determine random song to play
const bopNum = Math.floor(Math.random() * 201) + 1;
audio1.src = `bops/(${bopNum}).mp3`;
audio1.volume = 0.1;

let playing = false;

const durationLabel = document.querySelector(".duration");
audio1.onloadedmetadata = function () {
  const duration = String(Math.floor(audio1.duration)).padStart(2, "0");
  durationLabel.innerText = `0:${duration}`;
};

// function for animation progress bar
let start;
let prevElapsed = 0;
function progressBarStep(timestamp) {
  if (start === undefined) {
    start = timestamp;
    prevElapsed = audio1.currentTime / speeds[stage];
  }

  let elapsed = (timestamp - start) / 1000 + prevElapsed; // in seconds
  const totalTime = audio1.duration / speeds[stage];

  const percentDone = (elapsed / totalTime) * 100;
  progress.style.setProperty(
    "--progress",
    `max(-${100 - percentDone}%, -100%)`
  );

  const currentTime = Math.floor(Math.min(elapsed, totalTime) * speeds[stage]);

  const duration = Math.floor(audio1.duration);
  durationLabel.innerText = `${String(currentTime).padStart(2, "0")}:${String(
    duration
  ).padStart(2, "0")}`;

  if (percentDone < 100 && playing) {
    requestAnimationFrame(progressBarStep);
  } else {
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

  start = undefined;
  requestAnimationFrame(progressBarStep);
});

// back and forward animations + implementation
const rings = document.getElementsByClassName("forward-ring");
const ringArr = [...rings];

ringArr.map((ring) => {
  ring.addEventListener("mousedown", () => {
    ring.classList.add("forward-spin");

    if (!ring.classList.contains("back")) {
      // skip time
      audio1.currentTime = audio1.currentTime + 5;

      // update animation
      start = undefined;
      requestAnimationFrame(progressBarStep);
    } else {
      // back time
      audio1.currentTime = audio1.currentTime - 5;

      // update animation
      start = undefined;
      requestAnimationFrame(progressBarStep);
    }
  });

  ring.addEventListener("animationend", () => {
    ring.classList.remove("forward-spin");
  });
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
