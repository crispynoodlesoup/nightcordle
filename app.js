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

const speeds = [15, 8, 5, 3, 2, 1];
let stage = 0;

skip.addEventListener("click", () => {
  stage++;
  if (stage >= speeds.length) stage = 0;
});

const play = document.querySelector(".play");
const audio1 = document.querySelector(".aud");

const bopNum = Math.floor(Math.random() * 201) + 1;

let playing = false;

play.addEventListener("click", () => {
  if (playing === false) {
    audio1.src = `bops/(${bopNum}).mp3`;
    audio1.volume = 0.1;
    audio1.playbackRate = speeds[stage];
    audio1.play();
  } else {
    audio1.pause();
  }
  playing = !playing;
});

audio1.addEventListener("ended", () => {
  playing = false;
});

const mutag = window.jsmediatags;
jsmediatags.read(`bops/(${bopNum}).mp3`, {
  onSuccess: function (tag) {
    console.log(tag);
  },
  onError: function (error) {
    console.log(error);
  },
});
