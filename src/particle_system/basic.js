\class Particle {
  constructor(x, y) {
    this.position = createVector(x, y)
    this.acceleration = createVector()
    this.velocity = createVector(
      randomGaussian(0, 1),
      randomGaussian(-2.5, 0.5)
    )
    this.mass = 1
    this.lifespan = 255
  }

  update() {
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
    this.acceleration.mult(0)

    if (this.lifespan > 0) {
      this.lifespan -= 2
    }
  }

  applyForce (force) {
    const a  = force.copy().div(this.mass)
    this.acceleration.add(a)
  }

  isDead () {
    return this.lifespan <= 0 || !this.isInScreen()
  }

  isInScreen () {
    const { x, y } = this.position
    return x > 0 && x < width && y > 0 && y < height
  }

  show() {
    stroke(0, this.lifespan)
    fill(175, this.lifespan)
    circle(this.position.x, this.position.y, 8)
  }

  run () {
    this.update()
    this.show()
  }
}

class Confetti extends Particle {
  constructor (x, y) {
    super(x, y)
  }

  show () {
    const angle = map(this.position.x, 0, width, 0, TWO_PI * 2)
    push()
    fill(0, this.lifespan)
    stroke(0, this.lifespan)
    translate(this.position.x, this.position.y)
    rotate(angle)
    rectMode(CENTER)
    square(0, 0, 12)
    pop()
  }
}

class Emitter {
  constructor(x, y) {
    this.origin = createVector(x, y)
    this.particles = []
  }

  addParticle () {
    if (this.particles.length > 30) { return }

    const ParticleObject = Math.random() > 0.5 ? Particle : Confetti
    this.particles.push(new ParticleObject(this.origin.x, this.origin.y))
  }

  applyForce (force) {
    this.particles.forEach(p => p.applyForce(force))
  }

  applyRepeller (repeller) {
    for (const p of this.particles) {
      const force = repeller.repel(p)
      p.applyForce(force)
    }
  }

  run () {
    const len = this.particles.length
    for (let i=len - 1; i>=0; i--) {
      const p = this.particles[i]
      p.run()

      if (p.isDead()) {
        this.particles.splice(i, 1)
      }
    }
  }
}

class Repeller {
  constructor (x, y) {
    this.position = createVector(x, y)
    this.power = 350
  }

  repel (particle) {
    const force = p5.Vector.sub(this.position, particle.position)
    let dist = force.mag()
    if (dist > 150) { return createVector(0, 0) }

    dist = constrain(dist, 5, 50)

    const strength = -1 * this.power / (dist * dist)
    
    force.setMag(strength)
    return force
  }

  show () {
    stroke(0)
    fill(127)
    circle(this.position.x, this.position.y, 32)
  }
}

const TOTAL_NUM = 50
const emitters = []
let repeller
let gravity

function setup () {
  createCanvas(640, 320)

  repeller = new Repeller(width / 2, height)
  gravity = createVector(0, 0.1)
}

function draw () {
  background(255, 50)
  // const wind = createVector(
  //   map(mouseX, 0, width, -0.075, 0.075),
  //   0
  // )

  for (emitter of emitters) {
    emitter.addParticle()
    emitter.applyForce(gravity)
    emitter.applyRepeller(repeller)
    emitter.run()
  }

  repeller.show()
}

function mousePressed () {
  emitters.push(new Emitter(mouseX, mouseY))

  if (emitters.length > 3) {
    emitters.shift()
  }
}
