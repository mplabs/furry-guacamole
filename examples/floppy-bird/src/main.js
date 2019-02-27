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
   this.player=new Player()
   this.pipe=new Pipe()
    // Set the game state to playing
   this.state = GAME_STATE.GAME_SCREEN
    // Start the game loop
   this.loop()
  }

  handleClick() {
    // If the game is in the splash screen state, start the game
    // else, make the player jump
    if (this.state == GAME_STATE.SPLASH_SCREEN){
    this.start()
    } else {
    this.player.jump()
    }
  }

  loop() {
    // Update all the objects
    this.player.update()
    this.pipe.update()

    //collision with upper pipe
    if(
        this.pipe.x < this.player.x + this.player.width &&
        0 < this.player.position + this.player.height &&
        this.pipe.x + this.pipe.width > this.player.x &&
        this.pipe.upperHeight > this.player.y
    ) {
        this.player.dead=true
        console.log('upper pipe')
    }

//    if(
//        94>this.pipe.x &&
//        this.player.position+24<this.pipe.y+24
//    ){
//        this.player.dead=true
//        console.log('upper pipe')
//    }
//    if(
//        94>this.pipe.x &&
//        this.player.position+24>this.pipe.y+24+100
//    ) {
//        this.player.dead=true
//        console.log('lower pipe')
//    }

    if(this.player.dead==true){
    this.state= GAME_STATE.SCORE_SCREEN
    }
    // Every new frame, we need to clear the canvas
    ctx.clearRect(0,0, width,height)

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
    this.image.src = 'assets/bird.png'

    // Set initial values
    this.position = 180
    this.velocity = 0
    this.rotation = 0
    this.nthFrame = 0
    this.dead=false
    this.width= 34
    this.height= 24
    this.x=60
  }

  draw() {
    // Inrement the frame counter
    this.nthFrame= this.nthFrame+1;
    
    ctx.save() // We need to create a 'sub-canvas' that we can move around without effecting the other objects

    // Pick the n-th sprite from our bird picture and increment every 5-th drawn frame
    let spriteNumber = Math.floor((this.nthFrame)/5) % 4 // 0, 1, 2, 3


    // Move the sub-canvas to the position where we want to draw the bird
    ctx.translate(
    60, this.position+200
      // x - The bird is always 60px from the left
      // y - the bird is offset by 200px from the top
    )

    // Rotate the sub-canvas
    ctx.rotate(
      this.rotation * Math.PI/180  // Convert angle to radiant
    )

    // Draw the sprite to the sub-canvas
    ctx.drawImage(
      this.image,    // The image we created above
      0,       // The x-axis coordinate of the top left corner of the sub-rectangle of the source image
      spriteNumber*24,       // The y-axis coordinate of the top left corner of the sub-rectangle of the source image
      34,   // The width of the sub-rectangle of the source image
      24,  // The height of the sub-rectangle of the source image
      -17,       // The x-axis coordinate in the destination canvas at which to place the top-left corner of the image
      -12,       // The y-axis coordinate in the destination canvas at which to place the top-left corner of the source image
      34,   // The width to draw the image in the destination canvas.
      24   // The height to draw the image in the destination canvas.
    )
      
    ctx.restore() // Restoring the canvas will reset the canvas to the top left corner of the frame and nulligate the rotation
  }

  // Update player position and velocity
  update() {
  if(this.dead==false){
  this.velocity = this.velocity + GRAVITY
      this.position = this.position + this.velocity
      this.rotation = Math.min(this.velocity / 10 * 90, 90)
      if(this.position+200>=height-24){
        this.dead=true
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

class Pipe{
    constructor(){
        this.pipeDown = new Image(52, 26)
        this.pipeDown.src = 'assets/pipe-down.png'
        this.pipe = new Image(52, 1)
        this.pipe.src = 'assets/pipe.png'
        this.pipeUp = new Image(52, 26)
        this.pipeUp.src = 'assets/pipe-up.png'


        this.velocity=-1
        this.distance=60
        this.y=Math.random()*height/2
        this.x=width
        this.width= 52

    }

    get upperHeight() {
        return this.y + 26
    }

    get lowerHeight() {
        return height - this.upperHeight() + 100
    }

    update(){
    this.x=this.x+this.velocity
    }
    draw(){
    ctx.drawImage(this.pipeDown,this.x,this.y)
    ctx.drawImage(this.pipe, this.x,0, 52, this.y)
    ctx.drawImage(this.pipeUp, this.x, this.y+26+100)
    ctx.drawImage(this.pipe, this.x,this.y+152, 52, height-this.y+152)
    }
}
