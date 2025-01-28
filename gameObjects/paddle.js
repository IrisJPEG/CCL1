import { global } from "../modules/global.js"; 
import { BaseGameObject } from './baseGameObject.js'; 

class Paddle extends BaseGameObject {
    constructor(canvasWidth, canvasHeight, paddleWidth, paddleHeight) {
        super(global.ctx); // Call the parent class constructor with the canvas context.

        // Initialize the paddle's position and size.
        this.x = (canvasWidth / 2) - (paddleWidth / 2); // Position the paddle at the horizontal center of the canvas.
        this.y = canvasHeight - paddleHeight; // Place the paddle near the bottom of the canvas.
        this.width = paddleWidth; // Set the paddle's width.
        this.height = paddleHeight; // Set the paddle's height.

        this.spritesheet = new Image(); 
        this.spritesheet.src = './images/paddlesprite.png'; // Set the source path for the spritesheet image.

        this.spriteWidth = 0; // Width of a single sprite frame (calculated once the image loads).
        this.spriteHeight = 0; // Height of the spritesheet (calculated once the image loads).
        this.currentSpriteIndex = 0; // Index of the current sprite frame (0 = normal, 1 = hit).

        this.hitAnimationTimer = 0; // Timer to control how long the "hit" animation plays.
        this.hitAnimationDuration = 0.2; // Duration (in seconds) for the "hit" animation.

        // Wait until the spritesheet loads to calculate frame dimensions.
        this.spritesheet.onload = () => {
            this.spriteWidth = this.spritesheet.width / 2;  // Divide the image width by 2 to get the width of one sprite frame.
            this.spriteHeight = this.spritesheet.height; // The height of the spritesheet is the height of one frame.
        };

        this.hitSound = document.getElementById('hitSound'); // Get the audio element for the hit sound by its ID.
        if (hitSound) {
            this.hitSound.currentTime = 0; // Reset the sound's playback position to the beginning.
        }
    }

    draw(ctx, deltaTime) {// If the paddle is in "hit" mode, update the animation timer.
        if (this.hitAnimationTimer > 0) {
            this.hitAnimationTimer -= deltaTime; // Subtract the elapsed time from the timer.
            if (this.hitAnimationTimer <= 0) {// If the timer expires, revert to the normal sprite frame.
                this.hitAnimationTimer = 0;
                this.currentSpriteIndex = 0; // Switch back to the normal paddle sprite.
            }
        }

        // Draw the current sprite frame based on the animation state.
        ctx.drawImage(
            this.spritesheet, 
            this.currentSpriteIndex * this.spriteWidth, // The x-coordinate of the frame to draw (depends on the current sprite index).
            0, // The y-coordinate is always 0 since frames are in a single row.
            this.spriteWidth, // Width of the frame to draw.
            this.spriteHeight, // Height of the frame to draw.
            this.x, // X position to draw the paddle on the canvas.
            this.y, // Y position to draw the paddle on the canvas.
            this.width, // Scaled width of the paddle.
            this.height // Scaled height of the paddle.
        );
    }

    triggerHitAnimation() {// Trigger the "hit" animation when the paddle collides with the ball.
        this.currentSpriteIndex = 1; // Switch to the "hit" sprite frame.
        this.hitAnimationTimer = this.hitAnimationDuration; // Set the timer to the duration of the hit animation.
        global.playSound('hitSound'); // Play the paddle hit sound effect.
    }
}

export { Paddle }; 

