function radToDegree (rad) {
  return rad * 180 / Math.PI
}

function degToRadian (degree) {
  return degree / 180 * Math.PI
}

class Vehicle {
  constructor (x, y) {
    this.position = createVector(x, y)
    this.velocity = createVector(0, 0)
    this.acceleration = createVector(0, 0)
    this.r = 6
    this.wandertheta = 0.0
    this.maxSpeed = 5
    this.maxForce = 0.15
  }

  update () {
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxSpeed)

    this.position.add(this.velocity)

    this.acceleration.mult(0)

    // const { x: px, y: py } = this.position
    // const edgeOffset = 30
    // if (px < -edgeOffset) {
    //   this.position.x = width + edgeOffset
    // } else if (px > width + edgeOffset) {
    //   this.position.x = -edgeOffset
    // }

    // if (py < -edgeOffset) {
    //   this.position.y = height + edgeOffset
    // } else if (py > height + edgeOffset) {
    //   this.position.y = -edgeOffset
    // }
  }

  applyForce(force) {
    this.acceleration.add(force)
  }

  wander () {
    if (this.boundaries(50)) { return }

    const wanderR = 25
    const wanderD = 80
    const change = degToRadian(10)

    this.wandertheta += random(-change, change)

    const circlePos = this.velocity.copy()
    circlePos.normalize()
    circlePos.mult(wanderD)
    circlePos.add(this.position)

    const h = this.velocity.heading()
    const circleOffset = createVector(
      wanderR * cos(this.wandertheta + h),
      wanderR * sin(this.wandertheta + h)
    )

    const target = p5.Vector.add(circlePos, circleOffset)
    this.arrive(target)

    this.drawWanderStuff(this.position, circlePos, target, wanderR)
  }

  arrive (target) {
    const desiredVel = p5.Vector.sub(target, this.position)
    const dist = desiredVel.mag() // distance between target and the vehicle

    if (dist < 100) {
      const m = map(dist, 0, 100, 0, this.maxSpeed)
      desiredVel.setMag(m)
    } else {
      desiredVel.setMag(this.maxSpeed)
    }

    const steer = p5.Vector.sub(desiredVel, this.velocity)
    steer.limit(this.maxForce)

    this.applyForce(steer)
  }

  drawWanderStuff (location, circlePos, target, radius) {
    stroke(0)
    noFill()
    strokeWeight(1)
    circle(circlePos.x, circlePos.y, radius * 2)
    circle(target.x, target.y, 4)
    line(location.x, location.y, circlePos.x, circlePos.y)
    line(circlePos.x, circlePos.y, target.x, target.y)
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

    if (desired !== null) {
      desired.normalize()
      desired.mult(this.maxSpeed)
      const steer = p5.Vector.sub(desired, this.velocity)
      steer.limit(this.maxForce)
      this.applyForce(steer)
    }

    return Boolean(desired)
  }

  show () {
    const angle = this.velocity.heading()
    push()
    fill(127)
    stroke(0)
    translate(this.position.x, this.position.y)
    rotate(angle)
    beginShape()
    vertex(this.r*2, 0)
    vertex(-this.r*2, -this.r)
    vertex(-this.r*2, this.r)
    endShape(CLOSE)
    pop()
  }
}

let vehicle

function setup () {
  createCanvas(640, 320)
  vehicle = new Vehicle(width / 2, height / 2)
  vehicle.velocity = createVector(0.05, 0.05)
}

function draw () {
  background(255)

  // const mouse = createVector(mouseX, mouseY)

  // fill(127)
  // stroke(0)
  // strokeWeight(2)
  // circle(mouse.x, mouse.y, 32)

  vehicle.wander()
  vehicle.update()
  vehicle.show()
}
