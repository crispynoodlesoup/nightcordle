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

// button events
play.addEventListener("click", () => {
  if (playing === false) {
    // play music
    audio1.playbackRate = speeds[stage];
    audio1.play();

    play.innerText = "Pause";

    // start progress bar animation
    requestAnimationFrame(progressBarStep);
  } else {
    play.innerText = "Play";
    audio1.pause();
  }
  playing = !playing;
});

audio1.addEventListener("ended", () => {
  play.innerText = "Play";
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

fetch("./songs.json")
  .then((res) => res.json())
  .then((data) => enableSearch(data));

let searchSuggestions = document.querySelector(".search-suggestions");
let search = document.querySelector(".search input");
let songArr;

function enableSearch(data) {
  search.disabled = false;
  search.placeholder = "Guess a song here...";

  songArr = data.map((song) => `${song.artist} - ${song.title}`);
}

// setup suggestions to fill in input
function fillSuggestion(e) {
  search.value = e.target.innerText;
  searchSuggestions.textContent = "";
}

// perform search suggestions on type
search.addEventListener("keyup", () => {
  let results = [];
  let input = search.value;

  // search for results with filter
  if (input.length) {
    results = songArr.filter((keyword) => {
      return keyword.toLowerCase().includes(input.toLowerCase());
    });
  }

  // clear any previous results
  searchSuggestions.textContent = "";

  // display first 6 results
  results = results.slice(0, 6);
  results.forEach((song) => {
    const suggestedKeyword = document.createElement("li");
    suggestedKeyword.innerText = song;

    suggestedKeyword.addEventListener("click", fillSuggestion);

    searchSuggestions.append(suggestedKeyword);
  });
});

// get the correct answer
let correctSong;

const mutag = window.jsmediatags;
jsmediatags.read(`http://127.0.0.1:5500/bops/(${bopNum}).mp3`, {
  onSuccess: function (tag) {
    correctSong = `${tag.tags.artist} - ${tag.tags.title}`;
  },
  onError: function (error) {
    console.log(error);
  },
});

const enter = document.querySelector(".enter");

enter.addEventListener("click", () => {
  const guess = search.value;
  if (guess.localeCompare(correctSong) === 0) {
    console.log("wow!");
  } else {
    console.log("you suck!");
  }
  console.log(`${guess} and ${correctSong}`);
});

/* tool for getting mp3 tags from all mp3 files
let songArr = [];

for (let i = 1; i < 202; i++) {
  jsmediatags.read(`http://127.0.0.1:5500/bops/(${i}).mp3`, {
    onSuccess: function (tag) {
      songObj = {
        title: tag.tags.title,
        artist: tag.tags.artist,
      };

      songArr.push(songObj);
    },
    onError: function (error) {
      console.log(error);
    },
  });
}

console.log(songArr);
 */
