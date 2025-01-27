Development Log

January 13

Developed a functional prototype featuring:
-Movement mechanics for the ball.
-A paddle controllable via the mouse.
-Collision detection between the ball and bricks.
-Implementation of both high score and current score tracking.

January 14

Began working on win and lose scenarios alongside a start screen.
-Resolved several bugs, though issues like the ball getting stuck on canvas edges remain.
-Ensured the game resets appropriately when the ball misses the paddle and hits the bottom, displaying a lose screen.

January 15

Finalized the game theme: transforming the brick breaker into a game about destroying bugs in your code.
-Overcame significant bugs to align the theme with gameplay mechanics.
January 16

Initiated work on animations.
-Encountered challenges with detailed animations due to the small size of game objects.
-Decided to temporarily remove the intricate animation to streamline development and start fresh.

January 17

-Reused the highly detailed image as the canvas background because of its visual appeal.
-Modified the ball's reflection mechanics on the paddle:
-Instead of simply reversing direction and angle, the reflection angle now varies based on where the ball strikes the paddle.
-Dedicated most of the day to implementing and refining this new reflection behavior.

January 18

-Added a functional reset button.
-Addressed issues with overlapping text when the start button is pressed.

Over the weekend:

-Implemented an animation for the brick, depicting a laughing bug.
-Added an on-hit animation for the keyboard, causing it to light up upon collision with the ball.
-Created a new spritesheet for the ball, featuring a simpler rotating face.

January 21

-Enhanced game progression by introducing levels:
-Players start by clearing one row of bricks.
-Each subsequent win adds an additional row, up to four rows.
-After completing all levels, the number of rows resets to one, but the ball's speed increases, maintaining the challenge.

January 22

-Developed multiple win scenarios:
-Clearing all rows.
-Completing maximum rows with increased ball speed.
-Achieving a final win condition.
-Introduced a life system to add challenge:
-Players have a limited number of lives.
-Losing all lives requires the player to restart from the beginning, preventing endless attempts.

January 23

-Reduced the number of initial attempts available to the player.
-Introduced special bricks that occasionally drop hearts:
-Hearts slowly descend, and players can catch them with the paddle to gain extra lives.
-Added an additional lose scenario for when all lives are depleted.

January 24

-Focused on audio and game effects to enhance the gaming experience:
-Added background music and various sound effects for hits, losses, and wins.
-Aimed to infuse humor and character into the game, aligning with its simple yet engaging premise.
-Adjusted game mechanics to balance difficulty:
-Tweaked velocities, maximum rows, and ball speed to ensure the game is neither too easy nor too hard.
