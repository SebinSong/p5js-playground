let obj

function degreeToRadian (deg) {
  return deg /180 * Math.PI
}

class Rotor {
  constructor (radius) {
    this.radius =  radius || height * 0.4
    this.theta = 0
    this.angleVel = degreeToRadian(2)
  }

  draw () {
    const center = { x: width / 2, y: height / 2 }
    const x = this.radius * Math.cos(this.theta)
    const y = this.radius * Math.sin(this.theta)

    push()
    fill(127)
    stroke(0)
    translate(center.x, center.y)
    line(0, 0, x, y)
    circle(x, y, 24)
    pop()
  }

  update () {
    this.theta += this.angleVel
    this.draw()
  }
}

function setup () {
  createCanvas(640, 320)
  obj = new Rotor()
}

function draw () {
  background(255)
  obj.update()
}
