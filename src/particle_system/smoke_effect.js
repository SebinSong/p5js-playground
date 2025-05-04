class Particle {
  constructor(x, y) {
    this.position = createVector(x, y)
    this.velocity = createVector(
      randomGaussian(0, 0.45),
      randomGaussian(-1.5, 0.3)
    )
    this.acceleration = createVector()
    this.lifespan = 100
  }

  applyForce (force) {
    this.acceleration.add(force)
  }

  update () {
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
    this.lifespan -= 2
    this.acceleration.mult(0)
  }

  show () {
    fill(255, this.lifespan)
    noStroke()
    circle(this.position.x, this.position.y, 50)
  }

  isDead () {
    return this.lifespan <= 0
  }

  run () {
    if (this.isDead()) { return }

    this.update()
    this.show()
  }
}

class Emitter {
  constructor(x, y) {
    this.particles = []
    this.origin = createVector(x, y)
  }

  run () {
    for (const particle of this.particles) {
      particle.run()
    }

    this.particles = this.particles.filter(p => !p.isDead())
  }

  applyForce (force) {
    this.particles.forEach(p => p.applyForce(force))
  }

  addParticles () {
    this.particles.push(new Particle(this.origin.x, this.origin.y))
  }
}

let emitter

function setup() {
  createCanvas(640, 320)
  emitter = new Emitter(width / 2, height - 40)
}

function draw () {
  background(0)

  const dx = map(mouseX, 0, width, -0.2, 0.2)
  const wind = createVector(dx, 0)
  emitter.applyForce(wind)
  emitter.run()
  emitter.addParticles()
}
