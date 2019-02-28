import { GAME_STATE } from './constants'

export class Game {
  _state = GAME_STATE.SPLASH_SCREEN
  _lastState = null

  set state (value) {
    if (value !== this._state && typeof this.stateChanged !== 'undefined') {
      this.stateChanged(this._state, value)
    }

    this._lastState = this._state
    this._state = value
  }

  get state () {
    return this._state
  }

  get numberOfPipes () {
    return Math.floor(this.canvasWidth / 237)
  }

  constructor (canvas) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error(`Must supply valid canvas, got ${canvas}`)
    }
  }

  start () {
    // Setup all the objects
    this.player = new Player()

    // Setup as many pipes as will fit on the screen
    this.pipes = []
    for (let i = 0; i < this.numberOfPipes; i++) {
      this.pipes.push(new Pipe(i * 237, 0))
    }

    // Set the game state to playing
    this.state = GAME_STATE.GAME_SCREEN

    // Start the game loop
    this.loop()
  }

  loop () {
    // Update all the objects
    this.player.update()
    this.pipes.forEach(
      pipe => pipe.update()
    )

    // Calculate collisions
    
  }

  _collision (a, b) {
    return (
      b.x < a.x + a.width &&
      b.y < a.y + a.heigth &&
      b.x + b.width > a.x &&
      b.y + b.heigth > a.y
    )
  }
}
