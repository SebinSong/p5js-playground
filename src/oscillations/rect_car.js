class RectCar {
  constructor () {
    this.position = createVector(width / 2, height / 2)
    this.velocity = createVector(0, 0)
    this.acceleration = 0
    this.topSpeed = 4
    this.xoff = 1000
    this.yoff = 0
    this.r = 16
  }

  update() {
    let mouse = createVector(mouseX, mouseY)
    let dir = p5.Vector.sub(mouse, this.position)
    dir.normalize()
    dir.mult(0.5)
    this.acceleration = dir

    this.velocity.add(this.acceleration)
    this.velocity.limit(this.topSpeed)
    this.position.add(this.velocity)

    this.display()
  }

  display () {
    const angle = atan2(this.velocity.y, this.velocity.x)

    push()
    fill(180)
    stroke(75)
    rectMode(CENTER)
    translate(this.position.x, this.position.y)
    rotate(angle)
    rect(0, 0, 30, 10)
    pop()
  }
}

let car

function setup () {
  createCanvas(640, 320)
  car = new RectCar()
}

function draw () {
  background(255)
  mouse = createVector(mouseX, mouseY)

  if (mouseX < 0 ||
    mouseX > width ||
    mouseY < 0 ||
    mouseY > height
  ) { return }

  car.update()
}
