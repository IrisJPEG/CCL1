class BaseGameObject {
    constructor(ctx) {
        this.ctx = ctx;// Keep a reference to the rendering context for drawing operations.

        // Initialize common animation data
        this.animationData = {
            animationSprites: [],      // Array to hold individual animation frames.
            timePerSprite: 0,          // Duration each frame will be displayed (in seconds).
            currentSpriteElapsedTime: 0, // Time elapsed for the current frame.
            currentSpriteIndex: 0,     // Index of the currently displayed frame.
            allSpritesLoaded: false,  // Flag to indicate if all frames have been loaded.
        };
    }
    /**
      * Loads the spritesheet and extracts individual frames for animation.
      * @param {string} spritesheetPath - Path to the spritesheet image.
      * @param {number} rowCount        - Number of rows in the spritesheet.
      * @param {number} colCount        - Number of columns in the spritesheet.
      * @param {number} timePerSprite   - Duration (in seconds) each frame will be displayed.
      */
    loadSprites(spritesheetPath, rowCount, colCount, timePerSprite) {
        this.animationData.timePerSprite = timePerSprite;// Set the time duration for each sprite frame.

        const spritesheet = new Image();// Create a new image for the spritesheet and set its source.
        spritesheet.src = spritesheetPath;

        spritesheet.onload = () => {        //once the spritesheet has fully loaded:
            const spriteWidth = spritesheet.width / colCount; // Calculate width of each frame.
            const spriteHeight = spritesheet.height / rowCount; // Calculate height of each frame.

            const tempCanvas = document.createElement("canvas");// Create a temporary canvas to extract and store individual frames.
            const tempCtx = tempCanvas.getContext("2d");
            tempCanvas.width = spriteWidth;  // Set canvas width to the frame width.
            tempCanvas.height = spriteHeight; // Set canvas height to the frame height.

            // Loop through each row and column of the spritesheet to extract frames.
            for (let row = 0; row < rowCount; row++) {
                for (let col = 0; col < colCount; col++) {
                    // Clear the temporary canvas before drawing a new frame.
                    tempCtx.clearRect(0, 0, spriteWidth, spriteHeight);

                    // Draw the frame onto the temporary canvas.
                    tempCtx.drawImage(
                        spritesheet,             // The full spritesheet image.
                        col * spriteWidth,       // X-coordinate of the frame on the spritesheet.
                        row * spriteHeight,      // Y-coordinate of the frame on the spritesheet.
                        spriteWidth,             // Width of the frame.
                        spriteHeight,            // Height of the frame.
                        0,                       // X-coordinate on the temporary canvas.
                        0,                       // Y-coordinate on the temporary canvas.
                        spriteWidth,             // Width of the frame on the canvas.
                        spriteHeight             // Height of the frame on the canvas.
                    );

                    // Convert the frame to a new image and store it in the animationSprites array.
                    const frame = new Image();
                    frame.src = tempCanvas.toDataURL();
                    this.animationData.animationSprites.push(frame);
                }
            }

            // Set the flag to indicate all frames are loaded.
            this.animationData.allSpritesLoaded = true;
        };
    }
   
    updateAnimation(deltaTime) {
        const anim = this.animationData; // Alias for cleaner access to animation data.
        anim.currentSpriteElapsedTime += deltaTime; // Increment elapsed time by deltaTime.

        // Check if enough time has passed to switch to the next frame.
        if (anim.currentSpriteElapsedTime >= anim.timePerSprite) {
            anim.currentSpriteIndex++; // Advance to the next frame.

            // Loop back to the first frame if we've reached the end of the animation.
            if (anim.currentSpriteIndex >= anim.animationSprites.length) {
                anim.currentSpriteIndex = 0;
            }

            // Reset the elapsed time for the current frame.
            anim.currentSpriteElapsedTime = 0;
        }
    }

    // Resets the animation to the first frame and clears the elapsed time.
    resetAnimation() {
        this.animationData.currentSpriteElapsedTime = 0; // Reset elapsed time.
        this.animationData.currentSpriteIndex = 0;       // Reset frame index to the first frame.
    }
}
export { BaseGameObject };
