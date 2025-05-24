class Vehicle {
  constructor (x, y) {
    this.position = createVector(x, y)
    this.r = 12
    this.maxspeed = 3
    this.maxforce = 0.275
    this.acceleration = createVector()
    this.velocity = createVector()
  }

  applyForce(force) {
    this.acceleration.add(force)
  }

  update() {
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxspeed)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
  }

  show() {
    fill(127)
    stroke(0)
    strokeWeight(2)
    circle(this.position.x, this.position.y, this.r)
  }

  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r
    else if (this.position.x > width + this.r) this.position.x = -this.r

    if (this.position.y < -this.r) this.position.y = height + this.r
    else if (this.position.y > height + this.r) this.position.y = -this.r
  }
  
  separate (vehicles) {
    const desiredseparation = this.r + 3
    const sum = createVector()
    let count = 0

    for (const other of vehicles) {
      if (other === this) continue

      const dist = p5.Vector.dist(this.position, other.position)
      if (dist < desiredseparation) {
        const repel = p5.Vector.sub(this.position, other.position)
        repel.setMag(1/dist)
        sum.add(repel)
        count++
      }
    }

    if (count > 0) {
      sum.setMag(this.maxspeed)
      const steer = p5.Vector.sub(sum, this.velocity) // NOTE: steer = desired velocity - current velocity
      steer.limit(this.maxforce)
      this.applyForce(steer)
    }
  }
}

const vehicles = []

function setup() {
  createCanvas(640, 320)
  
  for (let i = 0; i < 30; i++) {
    vehicles.push(new Vehicle(random(width), random(height)))
  }
}

function draw() {
  background(255)

  vehicles.forEach(v => {
    v.separate(vehicles)
    v.update()
    v.borders()
    v.show()
  })
}

function mousePressed() {
  const newVehicle = new Vehicle(mouseX, mouseY)
  newVehicle.velocity = createVector(random(-2, 2), random(-2, 2))
  vehicles.push(newVehicle)
}
