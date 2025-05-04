const AMPLITUDE = 150
const ANGULAR_VEL = 0.75 / 180 * Math.PI
const DIAMETER = 12
const circles = []

function angleToY (angle) {
  const n = noise(angle)
  return map(n, 0, 1, -AMPLITUDE, AMPLITUDE)
}

class OscilCircle {
  constructor (x, initAngle) {
    this.x = x
    this.currAngle = initAngle
    this.y = angleToY(initAngle)
  }

  update () {
    this.currAngle += ANGULAR_VEL
    this.y = angleToY(this.currAngle)

    this.show()
  }

  show () {
    circle(this.x, this.y, DIAMETER)
  }
}

function setup () {
  createCanvas(640, 320)

  let xPos = 0
  let initAngle = 0
  while (xPos < width) {
    circles.push(
      new OscilCircle(xPos, initAngle)
    )

    initAngle += (ANGULAR_VEL * 2)
    xPos += DIAMETER / 3 * 2
  }
}

function draw () {
  background(255)
  stroke(0)
  fill(127, 127)
  translate(0, height / 2)
  circles.forEach(c => c.update())
}
