const guessesBox = document.querySelector(".guesses");

let guesses = ["haha", "oooh", "", "", "bleh", ""];

function populate() {
  guesses.forEach((text) => {
    const tryBox = document.createElement("div");
    tryBox.className = "try-box";

    const p = document.createElement("p");
    p.innerText = text;

    tryBox.append(p);
    guessesBox.append(tryBox);
  });
}

populate();
