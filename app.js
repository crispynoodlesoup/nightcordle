const guessesBox = document.querySelector(".guesses");

let guesses = ["haha", "oooh", "", "", "bleh", ""];

function populate() {
  guesses.forEach((text) => {
    const tryBox = document.createElement("div");
    tryBox.className = "try-box";
    tryBox.innerText = text;
    guessesBox.append(tryBox);
  });
}

populate();
