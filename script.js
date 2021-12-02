class CubeGame {
    constructor(scoreTextElement, livesTextElement, difficultyTextElement) {
        this.scoreTextElement = scoreTextElement;
        this.livesTextElement = livesTextElement;
        this.difficultyTextElement = difficultyTextElement;
        this.clearGame()
    }

    clearGame() {
        // Clear the intervals
        clearInterval(startTimer);
        clearInterval(startMissTimer);

        // Set display to none for the div with id "game-over" and "lives" so it is not visible
        document.getElementById("game-over").style.display = "none";
        document.getElementById("missed").style.display = "none";

        // Set score and lives to default values
        score = 0;
        lives = 3;

        // Set default innerText for scoreTextElement, livesTextElement and difficultyTextElement
        this.scoreTextElement.innerText = `Score: ${score}`;
        this.livesTextElement.innerText = `Lives: ${lives}`;
        this.difficultyTextElement.innerText = 'Difficulty: None selected';

        // Disable "Reset Game" button
        resetTextElement.setAttribute("disabled", "disabled")

        // Set background for every button and add the disabled attribute for every button
        for (let i = 0; i < 10; i++) {
            document.getElementById("b-" + (i)).style.backgroundColor = "white";
            document.getElementById("b-" + (i)).setAttribute("disabled","disabled");
        }

        // Remove Disabled attribute for every difficulty button
        selectDifficultyButtons.forEach(button => {
            button.removeAttribute("disabled");
        })
    }

    // Check what difficulty the user selected.
    difficulty(difficulty) {
        // Do switch on selected difficulty
        switch (difficulty) {
            case "Easy":
                selectedDifficultyColors = shuffle(cubeColorsEasy);
                break;
            case "Medium":
                selectedDifficultyColors = shuffle(cubeColorsMedium);
                break;
            case "Hard":
                selectedDifficultyColors = shuffle(cubeColorsHard);
                break;
        }

        // Start cubeGame with the given colors and difficulty
        this.start(selectedDifficultyColors, difficulty)
    }

    // Start cubeGame
    start(selectedColors, difficulty) {
        // Add and remove the Disabled attribute
        selectDifficultyButtons.forEach(button => {
            button.setAttribute("disabled", "disabled");
        })
        resetTextElement.removeAttribute("disabled");

        // Set innerText for difficultyTextElement
        this.difficultyTextElement.innerText = `Difficulty: ${difficulty}`;

        // Remove all Disabled attributes for all (Game)buttons
        for (let i = 0; i < 10; i++) {
            document.getElementById("b-" + (i)).removeAttribute("disabled");
        }

        // Set random color for each smaller button
        for (let i = 0; i < selectedColors.length; i++) {
            document.getElementById("b-" + (i + 1)).style.backgroundColor = selectedColors[i];
        }

        // Set random bottom button color
        document.getElementById("b-0").style.backgroundColor = selectedColors[Math.floor(Math.random() * 9)];

        // Set Timer for the first time, get time from the first setting (2000ms)
        this.setTimer(selectedColors, time)
    }

    // Set timer for cubeGame
    setTimer(selectedColors, timeGiven) {
        // Do function changeColors with the given colors
        changeColors(selectedColors)

        // Set the interval for the function changeColors with the given colors and time
        startTimer = setInterval(function() {
            changeColors(selectedColors)
        }, timeGiven);
    }

    // Check if PressedButton is equal to the needed Button
    checkEqual(button, colorToSelect) {
        (button.name === colorToSelect.name) ? this.hit() : this.miss()
    }

    // HIT!
    hit() {
        // Add 1 point to the score
        score = score + 1;

        // Check if the score is divisible in 5 -> Yes? set new Time to Current time in ms - 100ms
        if (score % 5 === 0) time = time - 100;

        // Clear interval
        clearInterval(startTimer);

        // Set innerText for scoreTextElement to the new score
        this.scoreTextElement.innerText = `Score: ${score}`;

        // Do function setTimer (with the new Time (if there is a new time))
        this.setTimer(selectedDifficultyColors, time);
    }

    // MISS!
    miss() {
        // Take of 1 live
        lives = lives - 1;

        // Check amount of lives
        if (lives === 0) {
            clearInterval(startTimer);
            this.gameOver();
        } else {
            clearInterval(startTimer);

            for (let i = 0; i < 10; i++) {
                document.getElementById("b-" + (i)).setAttribute("disabled","disabled");
            }

            // Set innerText for livesTextElement to the amount of lives left
            livesTextElement.innerText = `Lives: ${lives}`;
            missLivesTextElement.innerText = `Lives left: ${lives}`;

            document.getElementById("missed").style.display = "grid";

            changeColorsMiss();
            startMissTimer = setInterval(changeColorsMiss, 500);
        }
    }

    // GAME-OVER!
    gameOver() {
        // For every button, set color to WHITE and Disable the buttons
        for (let i = 0; i < 10; i++) {
            document.getElementById("b-" + (i)).style.backgroundColor = "white";
            document.getElementById("b-" + (i)).setAttribute("disabled","disabled");
        }

        // Set the display for "game-over" to grid
        document.getElementById("game-over").style.display = "grid";

        // Disable the "Reset Game" button
        resetTextElement.setAttribute("disabled", "disabled")

        // Set innerText for endScoreTextElement to the end score
        endScoreTextElement.innerText = `Score: ${score}`;
    }
}

const selectButtons = document.querySelectorAll('[data-select]');
const colorToSelectButton = document.getElementById('b-0');
const selectDifficultyButtons = document.querySelectorAll('[data-select-difficulty]');
const scoreTextElement = document.querySelector('[data-score]');
const livesTextElement = document.querySelector('[data-lives]');
const difficultyTextElement = document.querySelector('[data-difficulty]');
const resetTextElement = document.querySelector('[data-reset]');
const endScoreTextElement = document.querySelector('[data-end-score]');
const missLivesTextElement = document.querySelector('[data-lives-miss]');

let selectedDifficultyColors;
let startTimer;
let startMissTimer;
let score = 0;
let lives = 3;
let time = 2000;
let counts = 0;
let cubeColorsEasy = ["#2e157b", "#1b0427", "#3ce10a", "#f16c87", "#17a8a8", "#daae88", "#f3dea5", "#9a1b7b", "#42cef8"];
let cubeColorsMedium = ["#cb1e7d", "#f04295", "#f316a9", "#4fc83a", "#54cf2b", "#66db8c", "#283032", "#14121f", "#110628"];
let cubeColorsHard = ["#E5E8E8", "#CCD1D1", "#B2BABB", "#99A3A4", "#7F8C8D", "#707B7C", "#616A6B", "#515A5A", "#424949"];
let cubeColorsMiss = ["#dc143c", "#b22222", "#8b0000", "#800000", "#c80815", "#dc143c", "#b22222", "#8b0000", "#800000"];

const cubeGame = new CubeGame(scoreTextElement, livesTextElement, difficultyTextElement);

function shuffle(cubeColorsArray) {
    let i, j, temp;

    for (i = cubeColorsArray.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = cubeColorsArray[i]
        cubeColorsArray[i] = cubeColorsArray[j]
        cubeColorsArray[j] = temp
    }

    return cubeColorsArray;
}

// When pressed the wrong color
function changeColorsMiss() {
    counts += 1;
    // cubeColorsMiss
    selectedColors = shuffle(cubeColorsMiss);
    for (let i = 0; i < selectedColors.length; i++) {
        document.getElementById("b-" + (i + 1)).style.backgroundColor = selectedColors[i];
        document.getElementById("b-" + (i + 1)).name = selectedColors[i];
    }
    let randomNumber = Math.floor(Math.random() * 9);
    document.getElementById("b-0").style.backgroundColor = selectedColors[randomNumber];
    document.getElementById("b-0").name = selectedColors[randomNumber];

    if (counts === 7) {
        counts = 0;
        clearInterval(startMissTimer);
        document.getElementById("missed").style.display = "none";
        for (let i = 0; i < 10; i++) {
            document.getElementById("b-" + (i)).removeAttribute("disabled");
        }
        cubeGame.setTimer(selectedDifficultyColors, time);
    }
}

// Just change colors on the board
function changeColors(selectedColors) {
    selectedColors = shuffle(selectedColors);
    for (let i = 0; i < selectedColors.length; i++) {
        document.getElementById("b-" + (i + 1)).style.backgroundColor = selectedColors[i];
        document.getElementById("b-" + (i + 1)).name = selectedColors[i];
    }
    let randomNumber = Math.floor(Math.random() * 9);
    document.getElementById("b-0").style.backgroundColor = selectedColors[randomNumber];
    document.getElementById("b-0").name = selectedColors[randomNumber];
}

// Add eventListener for every selectButton
selectButtons.forEach(button => {
    button.addEventListener('click', () => {
        let colorToSelect = colorToSelectButton;
        cubeGame.checkEqual(button, colorToSelect);
    })
})

// Add eventListener for every difficultyButton
selectDifficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        cubeGame.difficulty(button.innerText);
    })
})

// Add eventListener for resetGameButton
resetTextElement.addEventListener('click', () => {
    cubeGame.clearGame();
})

