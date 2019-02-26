require('./style.css')

const GRAVITY = 0.25
const JUMP = -4.6
const GAME_STATE = Object.freeze({
  GAME_SCREEN: Symbol('Game Screen'),
  SPLASH_SCREEN: Symbol('Splash Screen'),
  SCORE_SCREEN: Symbol('Score Screen')
})

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let width = 0, height = 0


class Game {
  constructor() {
    // We start the game on the splash screen
  }

  start() {
    // Setup all the objects
        
    // Set the game state to playing
    
    // Start the game loop
  }

  handleClick() {
    // If the game is in the splash screen state, start the game
    // else, make the player jump

  }

  loop() {
    // Update all the objects
    
    // Every new frame, we need to clear the canvas
    
    // Draw all the objects to the canvas
    
    // When done and player alive, wait for the next frame and start over
    if (this.state === GAME_STATE.GAME_SCREEN) {
      window.requestAnimationFrame(this.loop.bind(this))
    }
  }
}

class Player {
  constructor() {
    // Load the bird spritesheet
    this.image = new Image(34, 96)
    this.image.src = 'assets/bird.png'

    // Set initial values
    this.position = 180
    this.velocity = 0
    this.rotation = 0
    this.nthFrame = 0
  }

  draw() {
    // Inrement the frame counter
    
    ctx.save() // We need to create a 'sub-canvas' that we can move around without effecting the other objects

    // Pick the n-th sprite from our bird picture and increment every 5-th drawn frame
    let spriteNumber = 

    // Move the sub-canvas to the position where we want to draw the bird
    ctx.translate(
      // x - The bird is always 60px from the left
      // y - the bird is offset by 200px from the top
    )

    // Rotate the sub-canvas
    ctx.rotate(
      this.rotation * Math.PI/180  // Convert angle to radiant
    )
    
    // Draw the sprite to the sub-canvas
    ctx.drawImage(
      image,    // The image we created above
      sx,       // The x-axis coordinate of the top left corner of the sub-rectangle of the source image
      sy,       // The y-axis coordinate of the top left corner of the sub-rectangle of the source image
      sWidth,   // The width of the sub-rectangle of the source image
      sHeight,  // The height of the sub-rectangle of the source image
      dx,       // The x-axis coordinate in the destination canvas at which to place the top-left corner of the image
      dy,       // The y-axis coordinate in the destination canvas at which to place the top-left corner of the source image
      dWidth,   // The width to draw the image in the destination canvas.
      dHeight   // The height to draw the image in the destination canvas.
    )
      
    ctx.restore() // Restoring the canvas will reset the canvas to the top left corner of the frame and nulligate the rotation
  }

  // Update player position and velocity
  update() {
    this.velocity = this.velocity + GRAVITY
    this.position = this.position + this.velocity
    this.rotation = Math.min(this.velocity / 10 * 90, 90)
  }

  // Player jump
  jump() {
    // Make the player jump
    
  }
}

// Setup the game and start the loop
const game = new Game()

// Handle key events
window.addEventListener('keyup', evt => {
  if (evt.code === 'Space') {
    if (gameState === GAME_STATE.SCORE_SCREEN) {
      // Replay the game...
    }
    game.handleClick()
  }
})

// Resize canvas to full screen
window.addEventListener('load', resizeCanvas.bind(null, canvas), false)
window.addEventListener('resize', resizeCanvas.bind(null, canvas), false)

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect()

  // Update the width and height variables for drawing
  width = rect.width
  height = rect.height

  canvas.setAttribute('width', width)
  canvas.setAttribute('height', height)

  return { width, height }
}
