class Vehicle {
  constructor(x, y) {
    this.position = createVector(x, y)
    this.velocity = createVector()
    this.acceleration = createVector()
    this.r = 6
    this.maxSpeed = 6
    this.maxForce = 0.3
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
    fill(127)
    stroke(0)
    // cx, cy, diameter
    circle(this.position.x, this.position.y, this.r * 2)
  }

  separate (vehicles) {
    const desiredSeparation = this.r * 3
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
}

const VEHICLES_COUNT = 30
const vehicles = []
let mouse

function setup() {
  createCanvas(640, 360)

  mouse = createVector(width / 2, height / 2)
  for (let i = 0; i < VEHICLES_COUNT; i++) {
    vehicles.push(
      new Vehicle(random(width), random(height))
    )
  }
}

function draw () {
  background(255)

  vehicles.forEach(vehicle => vehicle.run(mouse, vehicles))
}

function mousePressed () {
  mouse = createVector(mouseX, mouseY)
}
