const movers = []
const NUM_MOVERS = 20
let attractor

class Attractor {
  constructor() {
    this.position = createVector(width / 2, height / 2)
    this.mass = 25
    this.G = 1
  }

  attract (mover) {
    const force = p5.Vector.sub(this.position, mover.position)
    let distance = force.mag()
    distance = constrain(distance, 5, 25)

    let strength = (this.G * this.mass * this.mass) / (distance * distance)
    force.setMag(strength)

    return force
  }

  display () {
    ellipseMode(CENTER)
    stroke(0)
    fill(175, 200)
    ellipse(this.position.x, this.position.y, this.mass * 2)
  }
}

function setup () {
  createCanvas(640, 240)

  for (let i=0; i<NUM_MOVERS; i++) {
    movers.push(
      new Mover({
        x: random(width),
        y: random(height),
        mass: 3 + random(5),
        maxSpeed: 10
      })
    )
  }

  attractor = new Attractor()
}

function draw () {
  background(255)

  attractor.display()
  movers.forEach(mover => {
    const attraction = attractor.attract(mover)
    mover.applyForce(attraction)
    mover.update()
  })
}
