class Path {
  constructor () {
    // A path has a radius which is how wide it is.
    this.radius = 20
    this.start = createVector(0, height / 3)
    this.end = createVector(width, height / 3 * 2)
  }

  show () {
    strokeWeight(this.radius * 2)
    stroke(0, 100)
    line(this.start.x, this.start.y, this.end.x, this.end.y)
    strokeWeight(1)
    stroke(0)
    line(this.start.x, this.start.y, this.end.x, this.end.y)
  }
}


class Vehicle {
  constructor(x, y, maxspeed, maxforce) {
    this.position = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(5, 0);
    this.r = 4;
    this.maxspeed = maxspeed;
    this.maxforce = maxforce;
  }

  run () {
    this.update()
    this.show()
  }

  follow (path) {
    // step-1. Predict the vehicle's future position.
    const future = this.velocity.copy()
    future.setMag(25)
    future.add(this.position)

    // step-2. Find the normal point along the path.
    const normalPoint = getNormalPoint(future, path.start, path.end)

    // step-3. Move a little further along the path and set the target.
    const b = p5.Vector.sub(path.end, path.start)
    b.setMag(25)
    const target = p5.Vector.add(normalPoint, b)

    // step-4. If we are off the path, seek that target in order to stay on the path.
    const distance = p5.Vector.dist(normalPoint, future)
    if (distance > path.radius) {
      this.seek(target)
    }

    // Draw the debugging stuff.

    // future position
    fill(127)
    stroke(0)
    line(this.position.x, this.position.y, future.x, future.y)
    ellipse(future.x, future.y, 4, 4)

    line(future.x, future.y, normalPoint.x, normalPoint.y)
    ellipse(normalPoint.x, normalPoint.y, 4, 4)

    if (distance > path.radius) {
      fill(255, 0, 0)
    }
    noStroke()
    ellipse(target.x, target.y, 8, 8)
  }

  applyForce(force) {
    this.acceleration.add(force)
  }

  seek (target) {
    const desired = p5.Vector.sub(target, this.position)

    if (desired.mag() === 0) return

    desired.normalize()
    desired.mult(this.maxspeed)

    const steer = p5.Vector.sub(desired, this.velocity)
    steer.limit(this.maxforce)

    this.applyForce(steer)
  }

  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  // Wraparound
  borders(p) {
    if (this.position.x > p.end.x + this.r) {
      this.position.x = p.start.x - this.r;
      this.position.y = p.start.y + (this.position.y - p.end.y);
    }
  }

  show() {
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading();
    fill(127);
    stroke(0);
    strokeWeight(2);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(this.r * 2, 0);
    vertex(-this.r * 2, -this.r);
    vertex(-this.r * 2, this.r);
    endShape(CLOSE);
    pop();
  }
}

function getNormalPoint (position, start, end) {
  // vector that points from start to position
  const vectorA = p5.Vector.sub(position, start)
  // vector that points from start to end
  const vectorB = p5.Vector.sub(end, start)

  // Use dot product to get a scalar projection on the vectorB
  const vectorC = vectorB.copy().normalize()
  vectorC.mult(vectorA.dot(vectorC))

  // get the normal point
  const normalPoint = p5.Vector.add(start, vectorC)
  return normalPoint
}

let path
let vehicle1, vehicle2

function setup () {
  createCanvas(640, 320)
  path = new Path()

  vehicle1 = new Vehicle(0, height / 2, 3, 0.1)
  vehicle2 = new Vehicle(0, height / 2, 5, 0.15)
}

function draw () {
  background(255)

  path.show()

  vehicle1.follow(path)
  vehicle2.follow(path)

  vehicle1.run()
  vehicle2.run()

  vehicle1.borders(path)
  vehicle2.borders(path)
}
