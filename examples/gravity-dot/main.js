const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let würfelzustand = {
  x: 450-50,
  y: 150-50, 
  w: 100,
  h: 100
}

const g = 9.81
let speed = 0

ctx.fillStyle = '#FF0000'

function gameLoop() {
  let { x, y, w, h } = würfelzustand
  
  // Physiksimulation
  speed = speed + 0.981
  y = y + speed
  
  if(Math.round(y + würfelzustand.h) > 900) {
    y = 800
    speed = -speed
  }
  
  // Render
  ctx.clearRect(0,0,900,900)
  
  ctx.fillRect(x, y, w, h)
  
  // Schreibe Änderungen zurück in den Gamestate
  würfelzustand = { x, y, w, h }
  
  window.requestAnimationFrame(gameLoop)
}

  window.requestAnimationFrame(gameLoop)
  