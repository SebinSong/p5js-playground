class FlowField {
  constructor (r) {
    this.resolution = r
    this.cols = Math.ceil(width / r)
    this.rows = Math.ceil(height / r)

    this.field = new Array(this.rows)
    for (let i = 0; i < this.rows; i++) {
      this.field[i] = new Array(this.cols)
    }

    this.init()
  }

  init () {
    const OFFSET_INC = 0.075
    noiseSeed(random(10000))
    let yoff = 0 // for row
    for (let r = 0; r < this.rows; r++) {
      let xoff = 0 // for column
      for (let c = 0; c < this.cols; c++) {
        const angle = map(noise(yoff, xoff), 0, 1, 0, TWO_PI)
        this.field[r][c] = p5.Vector.fromAngle(angle)
        xoff += OFFSET_INC
      }
      yoff += OFFSET_INC
    }
  }

  drawGrid () {
    const w = width / this.cols;
    const h = height / this.rows;

    push()
    stroke(210)
    for (let r = 0; r < this.rows; r++) {
      line(0, r*h, width, r*h)
    }

    for (let c = 0; c < this.cols; c++) {
      line(c*w, 0, c*w, height) 
    }
    pop()
  }

  show () {
    this.drawGrid()

    const w = width / this.cols;
    const h = height / this.rows;

    push()
    strokeWeight(1)
    stroke(110)

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const v = this.field[r][c].copy()
        v.setMag(w * 0.5)

        const gridCenter = {
          x: c*w + w/2, y: r*h + h/2
        }
        const startP = {
          x: gridCenter.x - v.x / 2,
          y: gridCenter.y - v.y / 2
        }
        strokeWeight(1)
        line(startP.x, startP.y, startP.x + v.x, startP.y + v.y)
      }
    }

    pop()
  }

  lookupFlowVector (position) {
    const col = constrain(Math.floor(position.x / this.resolution), 0, this.cols - 1)
    const row = constrain(Math.floor(position.y / this.resolution), 0, this.rows - 1)


    return this.field[row][col].copy()
  }
}

class Vehicle {
  constructor ({
    x, y, // start position
    ms, // max-spped
    mf // max-force
  }) {
    this.position = createVector(x, y)
    this.velocity = createVector(0, 0)
    this.acceleration = createVector(0, 0)
    this.r = 4
    this.maxSpeed = ms
    this.maxForce = mf
  }

  run () {
    this.update()
    this.borders()
    this.show()
  }

  applyForce (force) {
    this.acceleration.add(force)
  }

  follow (field) {
    const desiredVel = field.lookupFlowVector(this.position)
    desiredVel.setMag(this.maxSpeed)

    const steer = p5.Vector.sub(desiredVel, this.velocity)
    steer.limit(this.maxForce)
    this.applyForce(steer)
  }

  update () {
    // Update & limit velocity
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxSpeed)
    this.position.add(this.velocity)

    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0)
  }

  borders () {
    const { x: px, y: py } = this.position
    if (px < -this.r) { this.position.x = width + this.r }
    else if (px > width + this.r) { this.position.x = -this.r }

    if (py < -this.r) { this.position.y = height + this.r }
    else if (py > height + this.r) { this.position.y = -this.r }
  }

  show () {
    const theta = this.velocity.heading()

    push()
    fill(127)
    stroke(0)
    strokeWeight(2)
    translate(this.position.x, this.position.y)
    rotate(theta)
    beginShape()
    vertex(this.r * 2, 0)
    vertex(-this.r * 2, -this.r)
    vertex(-this.r * 2, this.r)
    endShape(CLOSE)
    pop()
  }
}

const VEHICLE_NUM = 150
let field
const vehicles = []

function setup () {
  createCanvas(640, 320)
  field = new FlowField(20)
  field.show()

  for (let n = 0; n < VEHICLE_NUM; n++) {
    vehicles.push(
      new Vehicle({
        x: random(width),
        y: random(height),
        ms: random(2, 6),
        mf: random(0.1, 0.5)
      })
    )
  }
}

function draw () {
  background(255)
  field.show()
  vehicles.forEach(vehicle => {
    vehicle.follow(field)
    vehicle.run()
  })
}

function mousePressed () {
  field.init()
}
