class Mover {
  constructor ({x = null, y = null, mass = null, maxSpeed = 5 } = {}) {

    this.position = createVector(
      x === null ? random(width) : x,
      y === null ? random(height) : y
    )
    this.velocity = createVector(0, 0)
    this.acceleration = createVector()
    this.mass = mass === null ? 1.5 : mass

    // constants
    this.maxSpeed = maxSpeed
    this.radius = mass * 2
  }

  applyForce (force) {
    const f = force.copy()

    f.div(this.mass)
    this.acceleration.add(f)
  }

  update () {
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxSpeed)

    this.position.add(this.velocity)
    // this.checkEdges()
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
      // mover is contacting the bottom edge.
      this.position.y = height - this.radius
      this.velocity.y *= -1
    }
  }

  contactBottom () {
    return this.position.y > height - this.radius - 1
  }
}
