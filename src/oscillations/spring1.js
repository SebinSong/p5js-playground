class Bob {
  constructor (x, y) {
    this.position = createVector(x, y)
    this.velocity = createVector()
    this.acceleration = createVector()
    this.mass = 24
    this.radius = this.mass
    this.damping = 0.98
    this.dragOffset = createVector()
    this.dragging = false
  }

  update () {
    this.velocity.add(this.acceleration)
    this.velocity.mult(this.damping)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
  }

  applyForce (force) {
    let f = force.copy().div(this.mass)
    this.acceleration.add(f)
  }

  show () {
    push()
    stroke(0)
    strokeWeight(2)
    fill(this.dragging ? 200 : 127)
    circle(this.position.x, this.position.y, this.radius * 2)
    pop()
  }

  handleClick (mx, my) {
    const d = dist(mx, my, this.position.x, this.position.y)
    if (d < this.radius) {
      this.dragging = true
      this.dragOffset.x  = this.position.x - mx
      this.dragOffset.y = this.position.y - my
    }
  }

  stopDragging () {
    this.dragging = false
  }

  handleDrag(mx, my) {
    if (this.dragging) {
      this.position.x = mx + this.dragOffset.x
      this.position.y = my + this.dragOffset.y
    }
  }
}

class Spring {
  constructor (x, y, length) {
    this.anchor = createVector(x, y)
    this.restLength = length
    this.k = 0.2
  }

  connect(bob) {
    const force = p5.Vector.sub(bob.position, this.anchor)
    const currLength = force.mag()
    const stretch = currLength - this.restLength
    force.setMag(-1 * this.k * stretch)

    bob.applyForce(force)
  }

  constrainLength (bob, minLen, maxLen) {
    const direction = p5.Vector.sub(bob.position, this.anchor)
    const length = direction.mag()

    if (length < minLen) {
      direction.setMag(minLen)
      bob.position = p5.Vector.add(this.anchor, direction)
      bob.velocity.mult(0)
    } else if (length > maxLen) {
      direction.setMag(maxLen)
      bob.position = p5.Vector.add(this.anchor, direction)
      bob.velocity.mult(0)
    }
  }

  show () {
    fill(127)
    circle(this.anchor.x, this.anchor.y, 10)
  }

  showLine(bob) {
    stroke(0)
    line(bob.position.x, bob.position.y, this.anchor.x, this.anchor.y)
  }
}

let spring, bob

function setup () {
  createCanvas(640, 320)

  spring = new Spring(width / 2, 10, 100)
  bob = new Bob(width / 2, 100)
}

function draw () {
  background(255)

  const gravity = createVector(0, 2)
  bob.applyForce(gravity)

  bob.update()
  bob.handleDrag(mouseX, mouseY)

  spring.connect(bob)
  spring.constrainLength(bob, 60, 270)

  spring.showLine(bob)
  bob.show()
  spring.show()
}

function mousePressed() {
  bob.handleClick(mouseX, mouseY)
}

function mouseReleased() {
  bob.stopDragging()
}
