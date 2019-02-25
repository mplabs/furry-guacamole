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
    this.state = GAME_STATE.SPLASH_SCREEN
  }

  start() {
    // Setup all the objects
    this.player = new Player()

    // Set the game state to playing
    this.state = GAME_STATE.GAME_SCREEN

    // Start the game loop
    this.loop()
  }

  handleClick() {
    if (this.state === GAME_STATE.SPLASH_SCREEN) {
      this.start()
    } else {
      this.player.jump()
    }
  }

  loop() {
    // Update all the objects
    this.player.update()

    // Every new frame, we need to clear the canvas
    ctx.clearRect(0, 0, width, height)

    // Draw all the objects to the canvas
    this.player.draw()

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
    // Update the frame counter
    this.nthFrame = this.nthFrame + 1

    ctx.save() // We need to create a 'sub-canvas' that we can move around without effecting the other objects

    // Pick the n-th sprite from our bird picture and increment every 5-th drawn frame
    let spriteNumber = Math.floor(this.nthFrame/5) % 4

    // Move the sub-canvas to the position where we want to draw the bird
    ctx.translate(
      60,                     // The bird is always 60px from the left
      ( 200 + this.position)  // The y-position of the bird is offset by 200px from the top
    )

    // Rotate the sub-canvas
    ctx.rotate(
      this.rotation * Math.PI/180  // Convert angle to radiant
    )
    
    // Draw the sprite to the sub-canvas
    ctx.drawImage(
      this.image,           // 'assets/bird.png'
      0,                    // Start to draw from the top left corner of the image
      24 * spriteNumber,    // we slice four 24px parts of the image and show one of them depending on the position of the birds wings
      34,                   // We want the bird to be drawn with a width of 34px
      24,                   // and a height of 24px
      -17,                  // Since we 'moved' the canvas, draw the center of the sprite
      -12,                  // ...by shifting the image to the left and top by half it's size
      34,                   // We need to tell the canvas what whidth to draw again
      24,                   // ...also what height
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
    this.velocity = JUMP
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
