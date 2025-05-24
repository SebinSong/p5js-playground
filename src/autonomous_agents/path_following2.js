class Path {
  constructor () {
    this.radius = 20
    this.points = []
  }

  addPoint(x, y) {
    this.points.push(createVector(x, y))
  }

  show () {
    stroke(200)
    strokeWeight(this.radius * 2)
    noFill()
    beginShape()
    for (const p of this.points) {
      vertex(p.x, p.y)
    }
    endShape()
    stroke(0)
    strokeWeight(1)
    beginShape()
    for (const p of this.points) {
      vertex(p.x, p.y)
    }
    endShape()
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
    this.borders(path)
    this.update()
    this.show()
  }

  follow (path) {
    // step-1. Predict the vehicle's future position.
    const future = this.velocity.copy()
    future.setMag(30)
    future.add(this.position)

    // Loop through all points of the path
    let shortest = Infinity
    let finalNormalPoint, target
    for (let i = 0; i < path.points.length - 1; i++) {
      const [pa, pb] = [path.points[i], path.points[i+1]]
      let normalPoint = getNormalPoint(future, pa, pb)

      if (normalPoint.x < pa.x || normalPoint.x > pb.x) {
        normalPoint = pb.copy()
      }

      const distance = p5.Vector.dist(future, normalPoint)
      if (distance < shortest) {
        shortest = distance
        finalNormalPoint = normalPoint
        target = normalPoint.copy()
        const dir = p5.Vector.sub(pb, pa)
        dir.setMag(50)
        target.add(dir)
      }
    }

    if (shortest > path.radius && target) {
      this.seek(target)
    }
  
    // future position
    fill(127)
    stroke(0)
    line(this.position.x, this.position.y, future.x, future.y)
    ellipse(future.x, future.y, 4, 4)

    line(future.x, future.y, finalNormalPoint.x, finalNormalPoint.y)
    ellipse(finalNormalPoint.x, finalNormalPoint.y, 4, 4)

    if (shortest > path.radius) {
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
  borders(path) {
    const pStart = path.points[0]
    const pEnd = path.points[path.points.length - 1]
    if (this.position.x > pEnd.x + this.r) {
      this.position.x = pStart.x - this.r
      this.position.y = pStart.y + (this.position.y - pEnd.y)
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

let path
const CAR_NUM = 5
const cars = []

function setup () {
  createCanvas(640, 320)
  newPath()

  for (let i = 0; i < CAR_NUM; i++) {
    cars.push(
      new Vehicle(0, height / 2, random(1.25, 4.5), random(0.0125, 0.15))
    )
  }
}

function draw () {
  background(255)
  path.show()

  cars.forEach(car => {
    car.follow(path)
    car.run()
  })
}

function newPath () {
  path = new Path()

  path.addPoint(-20, height / 2)
  path.addPoint(random(0, width/2), random(20, height - 20))
  path.addPoint(random(width / 2, width), random(20, height - 20))
  path.addPoint(width + 20, height / 2)
}

function mousePressed () {
  newPath()
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
