import { global } from './global.js';
import { Ball } from '../gameObjects/ball.js';
import { Paddle } from '../gameObjects/paddle.js';
import { Obstacle } from '../gameObjects/obstacle.js';
import { movePaddle } from './input.js'; 

// Create a new Ball instance with specified parameters
const ball = new Ball(
    global.canvas.width / 2, // Initial x-position at half the canvas width
    global.canvas.height / 1.5, // Initial y-position at two-thirds the canvas height
    global.BALL_RADIUS, // Radius of the ball
    global.BALL_VX, // Initial velocity in the x-direction
    global.BALL_VY, // Initial velocity in the y-direction
    global.CANVAS_WIDTH, // Width of the canvas
    global.CANVAS_HEIGHT, // Height of the canvas
    global.ctx, // Canvas rendering context
    './images/ballSprite.png', // Path to the ball sprite image
    5, //sprite row count
    4 // sprice col. count
);

// Create a new Paddle instance with specified parameters
const paddle = new Paddle(
    global.CANVAS_WIDTH, // Width of the canvas
    global.CANVAS_HEIGHT, // Height of the canvas
    global.PADDLE_WIDTH, // Width of the paddle
    global.PADDLE_HEIGHT // Height of the paddle
);

// Create a new Obstacle instance with specified parameters
const obstacle = new Obstacle(
    global.ctx, // Canvas rendering context
    global.CANVAS_WIDTH, // Width of the canvas
    global.CANVAS_HEIGHT, // Height of the canvas
    global.OBSTACLE_ROW_COUNT, // Number of rows of obstacles
    global.OBSTACLE_COL_COUNT, // Number of columns of obstacles
    global.OBSTACLE_START_X, // Starting x-position for obstacles
    global.OBSTACLE_START_Y, // Starting y-position for obstacles
    global.OBSTACLE_PADDING, // Padding between obstacles
    global.OBSTACLE_WIDTH, // Width of each obstacle
    global.OBSTACLE_HEIGHT, // Height of each obstacle
    './images/obstacles.png' // Path to the obstacle sprite image
);

// Game loop function that updates and renders the game state
function draw_on_canvas(timestamp) {
    let deltaTime = (timestamp - global.lastTime) / 1000;// Calculate the time difference since the last frame in seconds
    global.lastTime = timestamp; // Update the last timestamp

    if (obstacle.obstacles.flat().every(o => o.status === 0)) {// Check if all obstacles have been cleared (status === 0)
        showWinScreen(); // Display the win screen if all obstacles are cleared
    } 
    else if (global.FLAG === 1) {// Check if the game over flag is set
        showGameOverScreen(); // Display the game over screen
    } 
    else {
        global.clear(); // Clear the canvas for the new frame
        paddle.draw(global.ctx, deltaTime); // Draw the paddle
        ball.draw(deltaTime); // Draw the ball
        obstacle.draw(timestamp, deltaTime); // Draw the obstacles

        if (obstacle.checkCollision(ball, paddle)) {// Check for collisions between obstacles and the ball or paddle
            global.updateScore(); // Update the score if a collision is detected
        }

        // Move the ball and handle potential game over scenarios
        ball.move(
            deltaTime, // Time difference
            paddle.x, // Current x-position of the paddle
            global.PADDLE_WIDTH, // Width of the paddle
            global.PADDLE_HEIGHT, // Height of the paddle
            gameOver, // Callback function to handle game over
            paddle // Reference to the paddle object
        );

        // Request the next animation frame to continue the game loop
        global.PLAYGAME = requestAnimationFrame(draw_on_canvas);
    }
}

let firstLoad = true;// Flag to check if it's the first time loading the game

// Game initialization function to set up the initial state
function init() {
    global.clear(); // Clear the canvas
    global.FLAG = 0; // Reset the game over flag
    global.GAME_OVER_SCREEN = false; // Hide the game over screen
    global.GAME_WON_SCREEN = false; // Hide the game won screen
    global.CURRENT_SCORE = 0; // Reset the current score

    playSound('backgroundMusic', false);// Play the background music without resetting its current position

    if (!firstLoad) {// If it's not the first load, draw the start screen message
        global.Text.draw(); // Draws a message "Once you are ready..."
    }

    global.canvas.removeEventListener('click', init);// Remove the click event listener for initialization to prevent multiple bindings
    global.canvas.addEventListener('click', startGame);// Add a click event listener to start the game when the canvas is clicked

    // Update the score display elements in the UI
    document.getElementById("curr_score").innerText = `YOUR SCORE : ${global.CURRENT_SCORE}`;
    document.getElementById("high_score").innerText = `HIGH SCORE : ${global.HIGH_SCORE}`;

    // Reset the ball's position and velocity to the initial state
    ball.x = global.CANVAS_WIDTH / 2; // Center the ball horizontally
    ball.y = global.CANVAS_HEIGHT / 1.8; // Position the ball vertically
    ball.vx = global.BALL_VX; // Reset x-velocity
    ball.vy = global.BALL_VY; // Reset y-velocity
    ball.reset(); // Additional reset logic for the ball

    // Reset the number of obstacle rows and their state
    obstacle.rowCount = global.OBSTACLE_ROW_COUNT;
    obstacle.reset();

    firstLoad = false; // Mark that the first load has occurred
}

const music = document.getElementById('backgroundMusic'); // Audio element for background music
const musicToggleButton = document.getElementById('musicToggleButton'); // Button to toggle music

// Add a click event listener to the music toggle button to play/pause music
musicToggleButton.addEventListener('click', () => {
    if (music.paused) { // If music is currently paused
        music.play(); // Play the music
        musicToggleButton.textContent = 'Music ON/OFF'; // Update button text
    } else {
        music.pause(); // Pause the music
        musicToggleButton.textContent = 'Music ON/OFF'; // Update button text
    }
});

// Function to start the game with a countdown
function startGame() {
    let countdown = 3; 
    // Set up an interval to update the countdown every second
    const intervalId = setInterval(() => {
        global.clear(); // Clear the canvas
        const countdownText = `Game starts in ${countdown}`; 

        global.ctx.font = "bold 40px 'Courier New', monospace";
        global.ctx.fillStyle = '#000000'; 
        const textMetrics = global.ctx.measureText(countdownText); // Measure text width
        const textWidth = textMetrics.width;
        const x = (global.CANVAS_WIDTH - textWidth) / 2; // Center text horizontally
        const y = global.CANVAS_HEIGHT / 2; // Position text vertically in the middle

        // Draw the countdown text on the canvas
        global.ctx.fillText(countdownText, x, y);

        countdown--; // Decrement the countdown

        if (countdown < 0) { // If countdown is finished
            clearInterval(intervalId); // Clear the interval
            global.lastTime = performance.now(); // Record the current time
            global.PLAYGAME = requestAnimationFrame(draw_on_canvas); // Start the game loop
        }
    }, 1000); // Interval set to 1000 milliseconds (1 second)

    global.canvas.removeEventListener('click', startGame); // Remove the click listener to prevent multiple starts
}

// Function to reset the game to its initial state
function resetGame() {
    document.getElementById("startScreen").style.display = "flex";
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("winScreen").style.display = "none";

    global.CURRENT_SCORE = 0; // Reset current score
    global.FLAG = 0; // Reset game over flag
    global.GAME_OVER_SCREEN = false; // Hide game over screen
    global.GAME_WON_SCREEN = false; // Hide game won screen
    global.velocityBoosts = 0; // Reset velocity boost count
    global.OBSTACLE_ROW_COUNT = 1; // Reset obstacle row count

    // Reset ball velocity to initial values
    global.BALL_VX = 750;
    global.BALL_VY = 750;

    // Cancel any ongoing animation frames to stop the current game loop
    if (global.PLAYGAME) {
        cancelAnimationFrame(global.PLAYGAME);
    }

    global.FAIL_COUNT = 4; // Reset the number of tries left
    // Update the fail count display in the UI
    document.getElementById("fail_count").innerText = `NUMBER OF TRIES LEFT: 4`;

    // Reset UI elements related to scores
    document.getElementById("curr_score").innerText = "YOUR SCORE: 0";
    document.getElementById("high_score").innerText = `HIGH SCORE: ${global.HIGH_SCORE}`;

    // Remove existing event listeners to prevent duplicate bindings
    global.canvas.removeEventListener("click", init); // Remove init listener
    global.canvas.removeEventListener("click", startGame); // Remove startGame listener
    global.canvas.removeEventListener("mousemove", movePaddle); // Remove paddle movement listener

    // Re-initialize the game to reset obstacles, ball, and paddle
    init(); 
}

// Add a click event listener to the reset button to allow the player to reset the game
document.getElementById("resetButton").addEventListener("click", resetGame);

// Function to display the game over screen
function showGameOverScreen() {
    global.FAIL_COUNT--;// Decrement the number of fails left
    document.getElementById("fail_count").innerText = `NUMBER OF TRIES LEFT: ${global.FAIL_COUNT}`;// Update the fail count display in the UI

    global.GAME_OVER_SCREEN = true; // Set the game over screen flag
    cancelAnimationFrame(global.PLAYGAME); // Stop the game loop
    global.clear(); // Clear the canvas

    const gameOverText = global.FAIL_COUNT > 0 ? 'YOU FAILED' : 'YOU HAVE FAILED CCL';// Determine the game over message based on remaining fails
    global.ctx.font = "bold 40px 'Courier New', monospace";
    global.ctx.fillStyle = global.FAIL_COUNT > 0 ? 'red' : 'darkred'; 
    const gameOverTextMetrics = global.ctx.measureText(gameOverText);
    const gameOverTextWidth = gameOverTextMetrics.width;
    global.ctx.fillText(gameOverText, (global.CANVAS_WIDTH - gameOverTextWidth) / 2, global.CANVAS_HEIGHT / 2);

    if (global.FAIL_COUNT > 0) { // If there are remaining fails
        const restartText = 'Click to try again'; // Message to prompt player to retry
        global.ctx.font = "bold 30px 'Courier New', monospace";
        global.ctx.fillStyle = 'black';
        const restartTextMetrics = global.ctx.measureText(restartText); 
        const restartTextWidth = restartTextMetrics.width;
        global.ctx.fillText(restartText, (global.CANVAS_WIDTH - restartTextWidth) / 2, global.CANVAS_HEIGHT / 2 + 50);
        playSound('failSound'); // Play the fail sound effect

        global.canvas.addEventListener('click', init);// Add a click event listener to the canvas to re-initialize the game
    } else { // If no fails are left
        const resetText = 'No more attempts left. Click reset to try again.'; // Message to prompt player to reset
        global.ctx.font = "bold 30px 'Courier New', monospace";
        const resetTextMetrics = global.ctx.measureText(resetText);
        const resetTextWidth = resetTextMetrics.width;
        global.ctx.fillText(resetText, (global.CANVAS_WIDTH - resetTextWidth) / 2, global.CANVAS_HEIGHT / 2 + 50);
        playSound('loseSound'); // Play the lose sound effect
        global.canvas.removeEventListener('click', init); // Disable the restart on canvas click
    }
}

// Function to display the win screen
function showWinScreen() {
    global.GAME_WON_SCREEN = true; // Set the game won screen flag
    cancelAnimationFrame(global.PLAYGAME); // Stop the game loop
    global.clear(); // Clear the canvas

    let message; // Variable to hold the win message

    // Determine if the player has met the final win condition
    const finalWinCondition =
        global.velocityBoosts >= 1 && // Check if velocity has been boosted at least once
        global.OBSTACLE_ROW_COUNT >= global.MAX_ROW_COUNT && // Check if obstacle rows have reached the maximum
        obstacle.obstacles.flat().every(o => o.status === 0); // Ensure all obstacles are cleared

    if (finalWinCondition) { // If final win condition is met
        message = 'Good job you have passed CCL. Press reset to play again'; // Final win message
        playSound('winSound'); // Play the win sound effect
    } else if (global.OBSTACLE_ROW_COUNT < global.MAX_ROW_COUNT) { // If obstacle rows can still increase
        message = 'Thought you fixed it? You made it even WORSE!'; // Intermediate win message
        playSound('passSound'); // Play the pass sound effect
    } else { // If obstacle rows have reached max but final condition not met
        message = 'You did it! NOW FASTER!'; // Speed boost message
        playSound('fasterSound'); // Play the faster sound effect
    }

    global.ctx.font = "bold 35px 'Courier New', monospace";
    global.ctx.fillStyle = finalWinCondition ? '#003200' : 'black';
    const winTextMetrics = global.ctx.measureText(message);
    const winTextWidth = winTextMetrics.width;
    global.ctx.fillText(
        message,
        (global.CANVAS_WIDTH - winTextWidth) / 2,
        global.CANVAS_HEIGHT / 2
    );

    if (!finalWinCondition) { // If it's not the final win condition
        const continueText = 'Click to Continue'; // Message to prompt player to continue
        global.ctx.font = "bold 30px 'Courier New', monospace";
        const continueTextMetrics = global.ctx.measureText(continueText); 
        const continueTextWidth = continueTextMetrics.width;
        global.ctx.fillText(
            continueText,
            (global.CANVAS_WIDTH - continueTextWidth) / 2,
            global.CANVAS_HEIGHT / 2 + 50
        );

        // Add a click event listener to handle continuing the game
        global.canvas.addEventListener('click', function handleClick() {
            global.canvas.removeEventListener('click', handleClick); // Remove this listener to prevent multiple triggers

            if (global.OBSTACLE_ROW_COUNT < global.MAX_ROW_COUNT) { // If obstacle rows can still increase
                global.OBSTACLE_ROW_COUNT++; // Increment the number of obstacle rows
            } else { // If maximum obstacle rows are reached
                global.OBSTACLE_ROW_COUNT = 1; // Reset obstacle rows to 1

                // Increase the ball's velocity by a predefined increment
                global.BALL_VX *= global.V_INCREMENT;
                global.BALL_VY *= global.V_INCREMENT;
                global.velocityBoosts++; // Increment the velocity boost count
            }
            init(); // Re-initialize the game for the next level or speed increase

        });
    } else { // If it's the final win condition
        global.canvas.removeEventListener('click', startGame); // Remove the startGame listener
    }
}

// Callback function to set the game over flag
function gameOver() {
    global.FLAG = 1; // Set the game over flag to trigger the game over screen
}

// Add an event listener to the canvas to handle paddle movement based on mouse movement
global.canvas.addEventListener('mousemove', e => {
    movePaddle(e, paddle, global.CANVAS_WIDTH); // Call movePaddle with the event, paddle object, and canvas width
});

// Function to play a sound based on the provided sound element ID
function playSound(soundId, reset = true) {
    const sound = document.getElementById(soundId); // Get the audio element by ID
    if (sound) { // If the audio element exists
        if (reset) { // If reset is true
            sound.currentTime = 0; // Reset the audio playback to the start
        }
        // Attempt to play the sound, handling any autoplay restrictions
        sound.play().catch((err) => {
            console.warn(`${soundId} autoplay failed: `, err); // Log a warning if playback fails
        });
    }
}

init();
