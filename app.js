const guessesBox = document.querySelector(".guesses");

let guesses = ["", "", "", "", "", ""];

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

const speeds = [10, 5, 3, 2, 1];
let stage = 0;

skip.addEventListener("click", () => {
  stage++;

  if (stage >= speeds.length) stage = 0;
  speedText.innerText = `${speeds[stage]}x`;
});

const play = document.querySelector(".play");
const audio1 = document.querySelector(".aud");
const progress = document.querySelector(".song-progress");

//determine random song to play
const bopNum = Math.floor(Math.random() * 201) + 1;
audio1.src = `bops/(${bopNum}).mp3`;

audio1.volume = 0.1;

let playing = false;

// function for animation progress bar
let start;
function progressBarStep(timestamp) {
  if (start === undefined) {
    start = timestamp;
  }
  const elapsed = (timestamp - start) / 1000; // in seconds
  const totalTime = 30 / speeds[stage];
  const percentDone = (elapsed / totalTime) * 100;

  progress.style.setProperty(
    "--progress",
    `max(-${100 - percentDone}%, -100%)`
  );

  if (percentDone <= 100 && playing) {
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

const mutag = window.jsmediatags;
jsmediatags.read(`http://127.0.0.1:5500/bops/(${bopNum}).mp3`, {
  onSuccess: function (tag) {
    console.log(`THE SONG IS: ${tag.tags.title} by ${tag.tags.artist}`);
  },
  onError: function (error) {
    console.log(error);
  },
});
