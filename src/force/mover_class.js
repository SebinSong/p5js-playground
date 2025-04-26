class Mover {
  constructor ({x = null, y = null, mass = null } = {}) {

    this.position = createVector(
      x || random(width),
      y || random(height)
    )
    this.velocity = createVector(0, 0)
    this.acceleration = createVector()
    this.mass = mass || 1.5

    // constants
    this.maxSpeed = 5
    this.radius = mass * 10

    this.velocity.limit(this.maxSpeed)
  }

  applyForce (force) {
    const f = force.copy()

    f.div(this.mass)
    this.acceleration.add(f)
  }

  update () {
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
    this.checkEdges()
    this.show()

    this.acceleration.mult(0)
  }

  show () {
    stroke(0)
    strokeWeight(2)
    fill(127)
    circle(this.position.x, this.position.y, this.radius * 2)
  }

  checkEdges () {
    if (this.position.x - this.radius <= 0) {
      this.position.x = this.radius
      this.velocity.x *= -1
    } else if (this.position.x + this.radius >= width) {
      this.position.x = width - this.radius
      this.velocity.x *= -1
    }

    if (this.position.y - this.radius <= 0) {
      this.position.y = this.radius
      this.velocity.y *= -1
    } else if (this.position.y + this.radius >= height) {
      const bounce = -0.9

      this.position.y = height - this.radius
      this.velocity.y *= bounce
    }
  }
}
