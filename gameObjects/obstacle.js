import { global } from "../modules/global.js";
import { BaseGameObject } from './baseGameObject.js';

class Obstacle extends BaseGameObject {
    constructor(
        ctx,
        CANVAS_WIDTH, CANVAS_HEIGHT,
        rowCount, colCount,
        startX, startY,
        padding,
        width, height,
        spritesheetPath
    ) {
        super(ctx); // Call the parent class constructor and pass the canvas context.

        // Store canvas dimensions
        this.CANVAS_WIDTH = CANVAS_WIDTH;
        this.CANVAS_HEIGHT = CANVAS_HEIGHT;

        // Obstacle grid configuration
        this.rowCount = rowCount; // Number of rows of obstacles.
        this.colCount = colCount; // Number of columns of obstacles.
        this.startX = startX; // Starting x-coordinate for the obstacle grid.
        this.startY = startY; // Starting y-coordinate for the obstacle grid.
        this.padding = padding; // Space between obstacles.
        this.width = width; // Width of each obstacle.
        this.height = height; // Height of each obstacle.

        // Heart object
        this.heart = null; 
        this.heartRadius = global.HEART_RADIUS; // Radius of the heart object.

        this.heartImage = new Image();// Load heart image
        this.heartImage.src = './images/heart.png'; // Set the source of the heart image.

        this.specialObstacle = null; // Randomly chosen obstacle that gives a special reward when destroyed.

        this.loadSprites(spritesheetPath, 1, 3, 0.1); // Load sprites for obstacle animations from the specified spritesheet.

        this.obstacles = [];  // Array to store all obstacle objects in a grid.

        this.createGrid(); // Initialize the obstacle grid.
    }

    createGrid() {// Create a 2D array of obstacles and randomly assign a special obstacle.
        this.obstacles = [];

        // Randomly select one obstacle to be special.
        const randomRow = Math.floor(Math.random() * this.rowCount);
        const randomCol = Math.floor(Math.random() * this.colCount);
        this.specialObstacle = { row: randomRow, col: randomCol };

        // Generate obstacle grid.
        for (let r = 0; r < this.rowCount; r++) {
            this.obstacles[r] = [];
            for (let c = 0; c < this.colCount; c++) {
                const x = this.startX + c * (this.width + this.padding); // Calculate the x-coordinate of the obstacle.
                const y = this.startY + r * (this.height + this.padding); // Calculate the y-coordinate of the obstacle.

                this.obstacles[r][c] = {
                    x,
                    y,
                    status: 1, // Status 1 indicates the obstacle is active.
                    isSpecial: r === randomRow && c === randomCol, // Mark this obstacle as special if it matches the randomly selected one.
                };
            }
        }
    }

    updateAnimation(deltaTime) {// Update the animation frames and move the heart object (if it exists).
        super.updateAnimation(deltaTime);

        if (this.heart) {
            this.heart.y += 200 * deltaTime; // Move the heart downward at a constant speed.

            if (this.heart.y > this.CANVAS_HEIGHT + this.heartRadius) {
                this.heart = null; // Remove the heart if it goes out of bounds.
            }
        }
    }

    draw(timestamp, deltaTime) {
        if (!this.animationData.allSpritesLoaded) return; // Skip drawing if the animation sprites are not fully loaded.

        this.updateAnimation(deltaTime); // Update the animation frames.

        for (let r = 0; r < this.rowCount; r++) {
            for (let c = 0; c < this.colCount; c++) {
                const obstacle = this.obstacles[r][c];
                if (obstacle.status === 1) { // Only draw active obstacles.
                    const sprite = this.animationData.animationSprites[this.animationData.currentSpriteIndex];
                    if (sprite) {
                        this.ctx.drawImage(sprite, obstacle.x, obstacle.y, this.width, this.height); // Draw the current frame of the obstacle sprite.
                    }
                }
            }
        }

        if (this.heart) {// Draw the heart if it exists.
            this.ctx.drawImage(
                this.heartImage,
                this.heart.x - this.heartRadius,
                this.heart.y - this.heartRadius,
                this.heartRadius * 2,
                this.heartRadius * 2
            );
        }
    }

    reset() {// Reset the obstacle grid and heart object.
        super.resetAnimation();
        this.createGrid(); // Reinitialize the grid.
        this.heart = null; // Remove the heart.
    }

    checkCollision(ball, paddle) {
        const collisionSound = document.getElementById('collisionSound'); // Get the collision sound element.

        for (let r = 0; r < this.rowCount; r++) {
            for (let c = 0; c < this.colCount; c++) {
                const obstacle = this.obstacles[r][c];
                if (obstacle.status === 1) { // Only check collision for active obstacles.
                    const closestX = Math.max(obstacle.x, Math.min(ball.x, obstacle.x + this.width));
                    const closestY = Math.max(obstacle.y, Math.min(ball.y, obstacle.y + this.height));
                    const distanceX = ball.x - closestX;
                    const distanceY = ball.y - closestY;

                    if ((distanceX ** 2 + distanceY ** 2) <= ball.radius ** 2) { // Check if the ball collides with the obstacle.
                        if (Math.abs(distanceX) > Math.abs(distanceY)) {
                            ball.vx = -ball.vx; // Reverse horizontal velocity if the collision is horizontal.
                        } else {
                            ball.vy = -ball.vy; // Reverse vertical velocity if the collision is vertical.
                        }

                        obstacle.status = 0; // Mark the obstacle as destroyed.

                        if (obstacle.isSpecial) {
                            this.heart = { // Create a heart at the center of the destroyed special obstacle.
                                x: obstacle.x + this.width / 2,
                                y: obstacle.y + this.height / 2,
                            };
                        }

                        global.playSound('collisionSound'); // Play the collision sound.

                        return true; // Return true to indicate a collision occurred.
                    }
                }
            }
        }

        if (this.heart) {// Check if the heart collides with the paddle.
            const paddleTop = paddle.y;
            const paddleBottom = paddle.y + paddle.height;
            const paddleLeft = paddle.x;
            const paddleRight = paddle.x + paddle.width;

            if (
                this.heart.x > paddleLeft &&
                this.heart.x < paddleRight &&
                this.heart.y + this.heartRadius > paddleTop &&
                this.heart.y - this.heartRadius < paddleBottom
            ) {
                global.playSound('heartSound'); // Play the heart collection sound.

                this.heart = null; // Remove the heart.
                global.FAIL_COUNT += 1; // Add one to the player's attempts.
                document.getElementById("fail_count").innerText = `Attempts left: ${global.FAIL_COUNT}`; // Update the displayed attempt count.
            }
        }

        return false; // Return false if no collision occurred.
    }
}

export { Obstacle }; 

