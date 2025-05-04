let wind, gravity
let mover1, mover2, liquid

class Liquid {
  constructor (x, y, w, h, c) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.c = c
  }

  show () {
    noStroke()
    fill(175)
    rect(this.x, this.y, this.w, this.h)
  }

  contains (mover) {
    let pos  = mover.position

    return (pos.x > this.x && pos.x < this.x + this.w &&
      pos.y > this.y && pos.y < this.y + this.h)
  }

  calculateDrag (mover) {
    const speed = mover.velocity.mag()
    const dragMagnitude = this.c * speed * speed
    const dragForce = mover.velocity.copy()

    dragForce.mult(-1)
    dragForce.setMag(dragMagnitude)
    return dragForce
  }
}

function setup () {
  createCanvas(640, 320)

  liquid = new Liquid(0, height / 2, width, height / 2, 0.1)
  mover1 = new Mover({ x: random(40, width - 40), y: height / 4, mass: 1.25 })
  mover2 = new Mover({ x: random(40, width - 40), y: height / 4, mass: 2.5 })

  wind = createVector(0.075, 0)
  gravitational_accel = createVector(0, 0.325)
}

function draw () {
  background(255)
  const movers = [mover1, mover2]

  liquid.show()
  movers.forEach(mover => {
    // 1. Apply gravity
    const gravity = gravitational_accel.copy().mult(mover.mass)
    mover.applyForce(gravity)

    // 2. Apply wind
    if (mouseIsPressed) {
      mover.applyForce(wind)
    }

    // 3. Apply bottom friction if the object touches the bottom surface
    if (mover.contactBottom()) {
      // calculate the bottom friction
      const c = 0.125
      const friction = mover.velocity.copy().mult(-1).setMag(c)
      mover.applyForce(friction)
    }

    // 4. Apply viscous force of liquid if the object is crossing through it.
    if (liquid.contains(mover)) {
      mover.applyForce(liquid.calculateDrag(mover))
    }
  
    mover.update()
  })
}
