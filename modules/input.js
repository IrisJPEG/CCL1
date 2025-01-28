function movePaddle(e, paddle, canvasWidth) {
    // Calculate half the width of the paddle for centering it around the mouse.
    const halfWidth = paddle.width / 2;

    // Check if the paddle is moving too far to the left.
    if (e.offsetX - halfWidth <= 0) {
        paddle.x = 0; 
        // Set the paddle's position to the left edge of the canvas.
    } 
    // Check if the paddle is moving too far to the right.
    else if (e.offsetX + halfWidth >= canvasWidth) {
        paddle.x = canvasWidth - paddle.width; 
        // Set the paddle's position to the right edge of the canvas.
    } 
    // If the paddle is within bounds, center it at the mouse's X position.
    else {
        paddle.x = e.offsetX - halfWidth; 
        // Position the paddle so its center matches the mouse's X position.
    }
}

export { movePaddle }; 

