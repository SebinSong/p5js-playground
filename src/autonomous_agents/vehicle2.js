function radToDegree (rad) {
  return rad * 180 / Math.PI
}

function degToRadian (degree) {
  return degree / 180 * Math.PI
}

class Vehicle {
  constructor (x, y) {
    this.acceleration = createVector(0, 0)
    this.velocity = createVector(3, 4)
    this.position = createVector(x, y)
    this.r = 6
    this.maxSpeed = 3
    this.maxForce = 0.15
  }

  update () {
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxSpeed)

    this.position.add(this.velocity)
    this.acceleration.mult(0)
  }

  applyForce(force) {
    this.acceleration.add(force)
  }

  boundaries (offset) {
    let desired = null

    if (this.position.x < offset) {
      desired = createVector(this.maxSpeed, this.velocity.y)
    } else if (this.position.x > width - offset) {
      desired = createVector(-this.maxSpeed, this.velocity.y)
    }

    if (this.position.y < offset) {
      desired = createVector(this.velocity.x, this.maxSpeed)
    } else if (this.position.y > height - offset) {
      desired = createVector(this.velocity.x, -this.maxSpeed)
    }

    if (desired !=- null) {
      desired.normalize()
      desired.mult(this.maxSpeed)
      const steer = p5.Vector.sub(desired, this.velocity)
      steer.limit(this.maxForce)
      this.applyForce(steer)
    }

    return Boolean(desired)
  }
}
