let period = 100
let amplitude = 150
let frameCount = 0

function setup () {
  createCanvas(640, 320)
}

function draw () {
  frameCount++
  const x = amplitude  * Math.sin(frameCount / period * 2 * Math.PI)

  background(255)
  stroke(0)
  fill(127)
  translate(width / 2, height / 2)
  line(0, 0, x, 0)
  circle(x, 0, 35)
}
