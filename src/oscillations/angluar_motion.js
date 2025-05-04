// helpers
function degreeToRadian (deg) {
  return deg / 360 * Math.PI
}

const MAX_ANGLE_VEL = degreeToRadian(40)

class Bar {
  constructor ({ length = 50, radius = 5, barWidth = 4 } = {}) {
    this.position = createVector(width / 2, height / 2)
    this.length = length
    this.radius = radius
    this.width = barWidth
    this.angle = 0
    this.velAngle = degreeToRadian(2) // 2 degree per frame
    this.angleAccel = degreeToRadian(0.175)
  }

  show () {
    stroke(0)
    fill(127)

    const barHalf = this.length / 2
    translate(this.position.x, this.position.y)
    rotate(this.angle)

    // draw a bar
    strokeWeight(this.width)
    line(-barHalf, 0, barHalf, 0)

    // draw circles attached to both ends of the bar
    strokeWeight(1)
    circle(-barHalf, 0, this.radius * 2)
    circle(barHalf, 0, this.radius * 2)
  }

  accelerate () {
    this.velAngle += this.angleAccel

    if (this.velAngle > MAX_ANGLE_VEL) {
      this.velAngle = MAX_ANGLE_VEL
    }

    console.log('!@# vel angle: ', this.velAngle)
  }

  update () {
    this.accelerate()
    this.angle += this.velAngle
    this.show()
  }
}

let bar
function setup () {
  createCanvas(640, 240)
  bar = new Bar()
}

function draw () {
  background(255)
  bar.update()
}
