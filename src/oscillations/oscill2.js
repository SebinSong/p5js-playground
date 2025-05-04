const oscillators = []

function degreeToRadian (deg) {
  return deg / 180 * Math.PI
}

class Oscillator {
  constructor () {
    const deg5 = degreeToRadian(4.2)

    this.angle = createVector()
    this.angluarVelocity = createVector(
      random(-1 * deg5, deg5),
      random(-1 * deg5, deg5)
    )
    this.amplitude = createVector(
      random(10, width / 3),
      random(10, height / 3)
    )
  }

  update () {
    this.angle.add(this.angluarVelocity)

    this.show()
  }

  show () {
    const x = Math.sin(this.angle.x) * this.amplitude.x
    const y = Math.sin(this.angle.y) * this.amplitude.y

    push()
    translate(width / 2, height / 2)
    stroke(0)
    strokeWeight(2)
    fill(128)
    line(0, 0, x, y)
    circle(x, y, 24)
    pop()
  }
}

function setup () {
  createCanvas(640, 320)
  for (let i=0; i < 30; i++) {
    oscillators.push(new Oscillator())
  }
}

function draw () {
  background(255)
  oscillators.forEach(os => os.update())
}
