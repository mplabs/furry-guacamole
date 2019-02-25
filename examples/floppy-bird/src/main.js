require('./style.css')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

window.addEventListener('load', resizeCanvas.bind(null, canvas), false)
window.addEventListener('resize', resizeCanvas.bind(null, canvas), false)

function resizeCanvas(canvas) {
  const { width, height } = canvas.getBoundingClientRect()

  canvas.setAttribute('width', width)
  canvas.setAttribute('height', height)

  return { width, height }
}
