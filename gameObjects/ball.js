import { BaseGameObject } from './baseGameObject.js'; 

class Ball extends BaseGameObject {
    constructor(
        x, y, radius, vx, vy, 
        canvasWidth, canvasHeight, 
        ctx, 
        spritesheetPath, spriteRowCount, spriteColCount
    ) {
        super(ctx); // Call the constructor of the parent class (BaseGameObject) with the canvas rendering context.

        // Store all ball-specific properties
        this.x = x; // The current x-coordinate of the ball.
        this.y = y; // The current y-coordinate of the ball.
        this.radius = radius; // The radius of the ball.
        this.vx = vx; // The horizontal velocity of the ball.
        this.vy = vy; // The vertical velocity of the ball.
        this.canvasWidth = canvasWidth; // The width of the canvas.
        this.canvasHeight = canvasHeight; // The height of the canvas.

        // Load sprite sheet for animation and store animation data
        this.loadSprites(spritesheetPath, spriteRowCount, spriteColCount, 0.05); 
        // setting a delay between frames of 0.05 seconds.
    }

    // Override the draw method to render the ball's sprite on the canvas.
    draw(deltaTime) {
        if (!this.animationData.allSpritesLoaded) {
            return; 
        }

        this.updateAnimation(deltaTime);// Update the animation frame based on the time elapsed.

        // Get the current frame from the loaded sprites.
        const currentFrame = this.animationData.animationSprites[this.animationData.currentSpriteIndex];
        if (currentFrame) {
            const spriteSize = this.radius * 2; // Determine the size of the sprite to match the ball's dimensions.
            // Draw the current animation frame at the ball's position with the appropriate size.
            this.ctx.drawImage(currentFrame, this.x - this.radius, this.y - this.radius, spriteSize, spriteSize);
        }
    }

    // Reset the animation by calling the parent's resetAnimation method.
    reset() {
        this.resetAnimation();
    }

    // Move the ball, handle collisions, and respond to the paddle and canvas edges.
    move(deltaTime, paddleX, paddleWidth, paddleHeight, gameOverCallback, paddle) {
        // Update ball's position based on its velocity and the time elapsed.
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Handle collision with the right boundary of the canvas.
        if (this.x + this.radius > this.canvasWidth) {
            this.x = this.canvasWidth - this.radius; // Adjust position to prevent overlap.
            this.vx = -this.vx; // Reverse horizontal velocity.
        } else if (this.x - this.radius < 0) { 
            // Handle collision with the left boundary of the canvas.
            this.x = this.radius; // Adjust position to prevent overlap.
            this.vx = -this.vx; // Reverse horizontal velocity.
        }

        // Handle collision with the bottom boundary (game over scenario).
        if (this.y + this.radius >= this.canvasHeight) {
            this.vx = 0; // Stop horizontal movement.
            this.vy = 0; // Stop vertical movement.
            gameOverCallback(); // Trigger the game over callback function.
        }

        // Handle collision with the top boundary.
        if (this.y - this.radius <= 0) {
            this.y = this.radius + 1; // Adjust position with a small padding.
            this.vy = Math.abs(this.vy); // Ensure the ball bounces downward.
        }

        // Check for collision with the paddle.
        if (
            this.x >= paddleX && // Ball is within the paddle's horizontal range.
            this.x <= paddleX + paddleWidth && // Ball is still within paddle's width.
            this.y + this.radius >= this.canvasHeight - paddleHeight && // Ball is at the paddle's height.
            this.y - this.radius <= this.canvasHeight // Ball overlaps the paddle vertically.
        ) {
            const paddleCenter = paddleX + paddleWidth / 2; // Calculate the center of the paddle.
            const distanceFromCenter = this.x - paddleCenter; // Determine the distance from the paddle's center.
            const collisionZone = distanceFromCenter / (paddleWidth / 2); 
            // Normalize the collision zone to a range of -1 (left edge) to 1 (right edge).

            const maxReflectionAngle = Math.PI / 3.5; // Define the maximum reflection angle for the ball upon collision.
            
            const reflectionAngle = collisionZone * maxReflectionAngle; // Calculate the reflection angle based on the collision zone.

            const speed = Math.sqrt(this.vx ** 2 + this.vy ** 2); // Calculate the current speed of the ball to preserve it during reflection.

            this.vx = speed * Math.sin(reflectionAngle); // Set the new horizontal velocity based on the reflection angle.

            this.vy = -Math.abs(speed * Math.cos(reflectionAngle)); // Set the new vertical velocity, ensuring the ball bounces upward.

            paddle.triggerHitAnimation(); // Trigger a visual effect or animation on the paddle upon collision.
        }
    }
}

export { Ball }; 

