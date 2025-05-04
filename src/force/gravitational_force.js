let attractor, mover

class Attractor extends Mover {
  static G = 1

  constructor (args = {}) {
    super(args)
  }

  attract (mover) {
    const attraction = p5.Vector.sub(this.position, mover.position)
    const distance = constrain(attraction.mag(), 5, 25)
    const attractionMag = Attractor.G * this.mass * mover.mass / (distance * distance)

    attraction.setMag(attractionMag)
    return attraction
  }
}

function setup () {
  createCanvas(720, 420)

  mover = new Mover({ x: 100, y: 250, mass: 1.275, maxSpeed: 10 })
  attractor = new Attractor({ x: width / 2, y: height / 2, mass: 5 })
}

function draw () {
  background(255)

  // calculate the attraction between two and apply it
  const attraction = attractor.attract(mover)
  mover.applyForce(attraction)

  attractor.update()
  mover.update()
}
