const global = {}; 

// Canvas setup
global.canvas = document.querySelector("#canvas"); // Get the canvas element by its ID "canvas".
global.ctx = global.canvas.getContext("2d"); // Get the 2D rendering context for drawing on the canvas.
global.canvas.width = 1260; // Set the width of the canvas to 1260 pixels.
global.canvas.height = 770; // Set the height of the canvas to 770 pixels.

// Game constants
global.BALL_RADIUS = 35; // Radius of the ball in pixels.
global.BALL_VX = 750; // Initial horizontal velocity of the ball in pixels per second.
global.BALL_VY = 750; // Initial vertical velocity of the ball in pixels per second.
global.V_INCREMENT = 1.2; // Multiplier for velocity increases during the game.

global.PADDLE_WIDTH = 275; // Width of the paddle in pixels.
global.PADDLE_HEIGHT = 55; // Height of the paddle in pixels.

global.CANVAS_WIDTH = 1260; // Width of the canvas (same as `canvas.width`).
global.CANVAS_HEIGHT = 770; // Height of the canvas (same as `canvas.height`).

global.OBSTACLE_ROW_COUNT = 1; // Initial number of rows of obstacles.
global.MAX_ROW_COUNT = 4; // Maximum number of rows of obstacles.

global.HEART_RADIUS = 40; // Radius of "heart" objects (if any are part of the game mechanics).
global.OBSTACLE_COL_COUNT = 10; // Number of obstacle columns.
global.OBSTACLE_START_X = 2; // Starting x-coordinate for obstacles.
global.OBSTACLE_START_Y = 2; // Starting y-coordinate for obstacles.
global.OBSTACLE_PADDING = 5; // Padding between obstacles in pixels.
global.OBSTACLE_HEIGHT = 70; // Height of each obstacle in pixels.
global.OBSTACLE_WIDTH = Math.floor(
    (global.CANVAS_WIDTH - (global.OBSTACLE_COL_COUNT * 6)) / global.OBSTACLE_COL_COUNT); // Dynamically calculate the width of obstacles based on the canvas width, column count, and padding.

// Game state
global.CURRENT_SCORE = 0; // Tracks the current score during the game.
global.HIGH_SCORE = 0; // Tracks the highest score achieved in the game.
global.FLAG = 0; // A flag used for custom logic (e.g., gameplay states or conditions).
global.PLAYGAME = 0; // Indicates whether the game is active or paused.
global.GAME_OVER_SCREEN = false; // Boolean to track if the game-over screen is active.
global.GAME_WON_SCREEN = false; // Boolean to track if the game-won screen is active.

global.FAIL_COUNT = 4; // The number of allowed failures before the game ends.

global.lastTime = 0; // Time of the last frame update (used for deltaTime calculations).
global.velocityBoosts = 0; // Counter to track how many times the ball's velocity has been increased.

// Background image
global.backgroundImage = new Image(); // Create a new image object for the background.
global.backgroundImage.src = './images/bckg.png'; // Set the source of the background image to the specified file path.

// Utility: Clear the canvas
global.clear = function () {// Clear the entire canvas.
    this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    // Redraw the background image if it's already loaded.
    if (this.backgroundImage.complete) {
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    } else {
        // If the background image is not yet loaded, wait until it loads to draw it.
        this.backgroundImage.onload = () => {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        };
    }
};

// Utility: Draw centered text on the canvas
global.drawText = function (text, fontSize, color, yOffset = 0) {
    this.ctx.font = `bold ${fontSize}px 'Courier New', monospace`; 
    this.ctx.fillStyle = color; 
    const textMetrics = this.ctx.measureText(text); // Measure the width of the text.
    const textWidth = textMetrics.width; // Extract the width from the measurement.
    const x = (this.CANVAS_WIDTH - textWidth) / 2; // Calculate the x-coordinate to center the text.
    const y = (this.CANVAS_HEIGHT / 2) + yOffset; // Calculate the y-coordinate,adding an offset.
    this.ctx.fillText(text, x, y); // Draw the text at the calculated position.
};

// UI Text display
global.Text = {
    text: "Once you are ready, click...not like we got all day.", // Default message to display.
    draw: function (str = "") {// Ensure the canvas context is available.
        if (!global.ctx) {
            console.error("Canvas context (ctx) is not initialized.");
            return;
        }

        // Clear the canvas before drawing text.
        global.clear();

        // Use the provided string or default text.
        const textToDraw = str === "" ? this.text : str;

        // Draw the text with default size and color.
        global.drawText(textToDraw, 35, "#000000");
    },
};

// Utility: Update the player's score
global.updateScore = function () {
    this.CURRENT_SCORE += 1; // Increment the current score by 1.
    if (this.CURRENT_SCORE > this.HIGH_SCORE) {
        this.HIGH_SCORE = this.CURRENT_SCORE; // Update the high score if the current score exceeds it.
    }

    // Update the displayed score in the HTML.
    document.getElementById("curr_score").innerText = `YOUR SCORE : ${this.CURRENT_SCORE}`;
    document.getElementById("high_score").innerText = `HIGH SCORE : ${this.HIGH_SCORE}`;
};

// Utility: Play a sound
global.playSound = function (soundId, reset = true) {
    const sound = document.getElementById(soundId); // Get the audio element by its ID.
    if (sound) {
        if (reset) {
            sound.currentTime = 0; // Reset the audio playback to the start if reset is true.
        }
        sound.play().catch((err) => {
            console.warn(`${soundId} autoplay failed: `, err);
        });
    }
};

export { global }; 

