import { global } from "./global.js"; 

let playerName = ""; // Variable to store the player's name, initialized as an empty string.

function getPlayerName() {// Fetch the player's name from an input field.
    playerName = document
        .getElementById("playerName") // Get the input element with the id "playerName".
        .value; // Retrieve the value entered by the player.

    if (playerName.trim() === "") {// Check if the player's name is empty or contains only whitespace.
        playerName = "Anonymous"; // Default to "Anonymous" if no valid name is provided.
    }
}

function startGame() {
    getPlayerName(); // Retrieve the player's name before starting the game.

    document.getElementById("startScreen")
        .style.display = "none"; // Hide the start screen by setting its display property to "none".

    document.getElementById("gameScreen")
        .style.display = "block"; // Show the game screen by setting its display property to "block".

    global.Text.draw(`Hello, ${playerName}! Click to play!`); // Use the global object to draw a welcome message on the canvas.

    global.canvas.removeEventListener('click', startGame); // Remove the click event listener for starting the game, preventing it from triggering multiple times.
}

document.getElementById("startButton")
    .addEventListener("click", startGame); // Attach a click event listener to the "startButton" element, calling the startGame function when clicked.
