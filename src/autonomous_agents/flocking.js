class Vehicle {
  constructor(x, y) {
    this.position = createVector(x, y)
    this.velocity = createVector(random(-1, 1), random(-1, 1))
    this.acceleration = createVector()
    this.r = 6
    this.maxSpeed = 4
    this.maxForce = 0.15
  }

  applyForce(force) {
    this.acceleration.add(force)
  }

  update () {
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxSpeed)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
  }

  show () {
    const angle = this.velocity.heading()
  
    push()
    stroke(0)
    fill(175)
    translate(this.position.x, this.position.y)
    rotate(angle)
    beginShape();
    vertex(this.r * 2, 0);
    vertex(-this.r * 2, -this.r);
    vertex(-this.r * 2, this.r);
    endShape(CLOSE);
    pop()
  }

  separate (vehicles) {
    const desiredSeparation = this.r * 6
    const sum = createVector()
    let wantsToSeparate = false

    for (const other of vehicles) {
      if (other === this) continue

      // repulsion force is applied from other to this
      const dVector = p5.Vector.sub(this.position, other.position)
      const distance = dVector.mag()
      if (distance < desiredSeparation) {
        dVector.setMag(1 / distance)
        sum.add(dVector)

        if (!wantsToSeparate) {
          wantsToSeparate = true
        }
      }
    }

    if (wantsToSeparate) {
      sum.setMag(this.maxSpeed)

      const steer = p5.Vector.sub(sum, this.velocity)
      steer.limit(this.maxForce)

      return steer
    } else {
      return createVector(0, 0)
    }
  }

  align (vehicles) {
    const neighborDistance = 100
    const sum = createVector(0, 0)
    let count = 0

    for (const other of vehicles) {
      if (other === this) continue

      const distance = p5.Vector.dist(this.position, other.position)
      if (distance < neighborDistance) {
        sum.add(other.velocity)
        count++
      }
    }
    
    if (count > 0) {
      sum.div(count)
      const steer = p5.Vector.sub(sum, this.velocity)
      steer.limit(this.maxForce)

      return steer
    } else {
      return createVector(0, 0)
    }
  }

  cohesion (vehicles) {
    const neighborDistance = 100
    const sum = createVector(0, 0)
    let count = 0

    for (const other of vehicles) {
      if (other === this) continue

      const distance = p5.Vector.dist(this.position, other.position)
      if (distance < neighborDistance) {
        sum.add(other.position)
        count++
      }
    }

    if (count > 0) {
      sum.div(count)
      return this.seek(sum)
    } else {
      return createVector(0, 0)
    }
  }

  borders () {
    if (this.position.x < -this.r) this.position.x = width + this.r
    if (this.position.x > width + this.r) this.position.x = -this.r
    if (this.position.y < -this.r) this.position.y = height + this.r
    if (this.position.y > height + this.r) this.position.y = -this.r
  }

  seek (target) {
    const desired = p5.Vector.sub(target, this.position)
    desired.setMag(this.maxSpeed)

    desired.sub(this.velocity)
    desired.limit(this.maxForce)

    return desired
  }

  applyBehaviour (target, vehicles) {
    const repelForce = this.separate(vehicles).mult(1.25)
    const attracted = this.seek(target).mult(0.75)

    this.applyForce(repelForce)
    this.applyForce(attracted)
  }

  run (target, vehicles) {
    this.applyBehaviour(target, vehicles)
    this.update()
    this.show()
  }

  flock (vehicles) {
    const separate = this.separate(vehicles).mult(1.75)
    const alignment = this.align(vehicles).mult(1)
    const cohesion = this.cohesion(vehicles).mult(1)

    this.applyForce(separate)
    this.applyForce(alignment)
    this.applyForce(cohesion)

    this.update()
    this.borders()
    this.show()
  }
}

class Flock {
  constructor() {
    const INITIAL_FLOCK_SIZE = 70
    this.vehicles = []

    for (let i = 0; i < INITIAL_FLOCK_SIZE; i++) {
      this.vehicles.push(
        new Vehicle(random(width), random(height))
      )
    }
  }

  run () {
    this.vehicles.forEach(vehicle => vehicle.flock(this.vehicles))
  }

  addVehicle (x, y) {
    this.vehicles.push(new Vehicle(x, y))
  }
}

let flock 
function setup() {
  createCanvas(640, 360)

  flock = new Flock()
}

function draw () {
  background(255)

  flock.run()
}

function mousePressed () {
  flock.addVehicle(mouseX, mouseY)
}
