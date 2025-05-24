function getNormalPoint (p, a, b) {
  const ap = p5.Vector.sub(p, a)
  const ab = p5.Vector.sub(b, a)
  ab.normalize()
  ab.mult(ap.dot(ab))

  const normalPoint = p5.Vector.add(a, ab)
  return normalPoint
}

class Path {
  constructor() {
    this.radius = 20
    this.points = []
  }

  addPoint(x, y) {
    this.points.push(createVector(x, y))
  }

  display () {
    strokeJoin(ROUND)
    stroke(175)
    strokeWeight(this.radius * 2)
    noFill()
    beginShape()
    this.points.forEach(p => {
      vertex(p.x, p.y)
    })
    endShape(CLOSE)
  }
}

class Vehicle {
  constructor(x, y, maxspeed, maxforce) {
    this.position = createVector(x, y)
    this.r = 12
    this.maxspeed = maxspeed
    this.maxforce = maxforce
    this.acceleration = createVector()
    this.velocity = createVector(this.maxspeed, 0)
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

  render() {
    fill(75)
    stroke(0)
    ellipse(this.position.x, this.position.y, this.r, this.r)
  }
  
  run () {
    this.update()
    this.render()
  }

  seek (target) {
    const desired = p5.Vector.sub(target, this.position)
    desired.setMag(this.maxspeed)
    const steer = p5.Vector.sub(desired, this.velocity)
    steer.limit(this.maxforce)
    
    return steer
  }

  follow (path) {
    const predict = this.velocity.copy()
    predict.setMag(20)
    const futurePos = p5.Vector.add(this.position, predict)

    let normal, target, shortestDist = Infinity

    for (let i = 0; i < path.points.length - 1; i++) {
      const a = path.points[i]
      const b = path.points[i + 1]
      let normalPoint = getNormalPoint(futurePos, a, b)
      const dir = p5.Vector.sub(b, a)

      if (normalPoint.x < min(a.x, b.x) ||
        normalPoint.x > max(a.x, b.x) ||
        normalPoint.y < min(a.y, b.y) ||
        normalPoint.y > max(a.y, b.y)) {
        normalPoint = b.copy()
      }
    }
  }

  separate (vehicles) {

  }

  applyBehavior (path, vehicles) {

  }
}