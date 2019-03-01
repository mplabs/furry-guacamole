// Import stylesheed
require('./style.scss')

// Import asset graphics
const birdImage = require('./assets/bird.png')
const pipeUpImage = require('./assets/pipe-up.png')
const pipeDownImage = require('./assets/pipe-down.png')
const pipeImage = require('./assets/pipe.png')

const GRAVITY = 0.25
const JUMP = -4.6
const GAME_STATE = Object.freeze({
  GAME_SCREEN: Symbol('Game Screen'),
  SPLASH_SCREEN: Symbol('Splash Screen'),
  SCORE_SCREEN: Symbol('Score Screen')
})

const app = document.getElementById('app')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let width = 0
let height = 0

function collision(a, b) {
  return (
    b.x < a.x + a.width &&
    b.y < a.y + a.height &&
    b.x + b.width > a.x &&
    b.y + b.height > a.y
  )
}

class Game {
  _state = GAME_STATE.SPLASH_SCREEN
  _lastState = null
  set state(value) {
    this._lastState = this._state
    this._state = value

    if (this._lastState !== value && typeof this.stateChanged !== 'undefined') {
      this.stateChanged(this._lastState, value)
    }
  }

  get state() {
    return this._state
  }

  constructor() {
    // We start the game on the splash screen
    this.state = GAME_STATE.SPLASH_SCREEN
  }

  start() {
    // Setup all the objects
    this.player = new Player()
    this.pipe = new Pipe()
    // Set the game state to playing
    this.state = GAME_STATE.GAME_SCREEN
    // Start the game loop
    this.loop()
  }

  handleClick() {
    // If the game is in the splash screen state, start the game
    // else, make the player jump
    if (this.state == GAME_STATE.SPLASH_SCREEN) {
      this.start()
    } else {
      this.player.jump()
    }
  }

  loop() {
    // Update all the objects
    this.player.update()
    this.pipe.update()

    // Collision with pipe
    const playerBoundingBox = this.player.box
    const upperPipeBoundingBox = this.pipe.upperBox
    const lowerPipeBoundingBox = this.pipe.lowerBox
    if (
      collision(playerBoundingBox, upperPipeBoundingBox) ||
      collision(playerBoundingBox, lowerPipeBoundingBox)
    ) {
      this.player.dead = true
    }

    if (this.player.dead == true) {
      this.state = GAME_STATE.SCORE_SCREEN
    }
    // Every new frame, we need to clear the canvas
    ctx.clearRect(0, 0, width, height)

    // Draw all the objects to the canvas
    this.player.draw()
    this.pipe.draw()
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
    this.image.src = birdImage

    // Set initial values
    this.position = 180
    this.velocity = 0
    this.rotation = 0
    this.nthFrame = 0
    this.dead = false
    this.width = 34
    this.height = 24
    this.x = 60
  }

  // Calculate the bounding box
  get box() {
    return {
      x: 60 - 17,
      y: this.position - 12,
      height: this.height - Math.cos(Math.abs(this.position) / 90) * 8,
      width: this.width - Math.sin(Math.abs(this.rotation) / 90) * 8
    }
  }

  draw() {
    // Inrement the frame counter
    this.nthFrame = this.nthFrame + 1

    ctx.save() // We need to create a 'sub-canvas' that we can move around without effecting the other objects

    // Pick the n-th sprite from our bird picture and increment every 5-th drawn frame
    let spriteNumber = Math.floor(this.nthFrame / 5) % 4 // 0, 1, 2, 3

    // Move the sub-canvas to the position where we want to draw the bird
    ctx.translate(
      60, // x - The bird is always 60px from the left
      this.position // y - The height of the bird is calculated with every update
    )

    // Rotate the sub-canvas
    ctx.rotate(
      (this.rotation * Math.PI) / 180 // Convert angle to radiant
    )

    // Draw the sprite to the sub-canvas
    ctx.drawImage(
      this.image, // The image we created above
      0, // The x-axis coordinate of the top left corner of the sub-rectangle of the source image
      spriteNumber * 24, // The y-axis coordinate of the top left corner of the sub-rectangle of the source image
      34, // The width of the sub-rectangle of the source image
      24, // The height of the sub-rectangle of the source image
      -17, // The x-axis coordinate in the destination canvas at which to place the top-left corner of the image
      -12, // The y-axis coordinate in the destination canvas at which to place the top-left corner of the source image
      34, // The width to draw the image in the destination canvas.
      24 // The height to draw the image in the destination canvas.
    )

    ctx.restore() // Restoring the canvas will reset the canvas to the top left corner of the frame and nulligate the rotation
  }

  // Update player position and velocity
  update() {
    if (this.dead == false) {
      this.velocity = this.velocity + GRAVITY
      this.position = this.position + this.velocity
      this.rotation = Math.min((this.velocity / 10) * 90, 90)
      if (this.position >= height - 24 || this.position < 0) {
        this.dead = true
      }
    }
  }

  // Player jump
  jump() {
    // Make the player jump
    this.velocity = JUMP
  }
}

// Setup the game and start the loop
let game = new Game()

// Handle key events
window.addEventListener('keyup', evt => {
  if (evt.code === 'Space') {
    if (game.state === GAME_STATE.SCORE_SCREEN) {
      // Replay the game...
      game = new Game()
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

class Pipe {
  constructor() {
    this.pipeDown = new Image(52, 26)
    this.pipeDown.src = pipeDownImage
    this.pipe = new Image(52, 1)
    this.pipe.src = pipeImage
    this.pipeUp = new Image(52, 26)
    this.pipeUp.src = pipeUpImage

    this.velocity = -2.25
    this.distance = 60
    this.y = (Math.random() * height) / 2
    this.x = width / 2
    this.width = 52
  }

  get upperBox() {
    return {
      x: this.x,
      y: 0,
      width: this.width,
      height: this.y + 26
    }
  }

  get lowerBox() {
    return {
      x: this.x,
      y: this.y + 126,
      width: this.width,
      height: height - this.y + 126
    }
  }

  get upperHeight() {
    return this.y + 26
  }

  get lowerHeight() {
    return height - this.upperHeight() + 100
  }

  update() {
    this.x = this.x + this.velocity
  }
  draw() {
    ctx.drawImage(this.pipeDown, this.x, this.y)
    ctx.drawImage(this.pipe, this.x, 0, 52, this.y)
    ctx.drawImage(this.pipeUp, this.x, this.y + 26 + 100)
    ctx.drawImage(this.pipe, this.x, this.y + 152, 52, height - this.y + 152)
  }
}
