class Walker {
  constructor () {
    this.tx = 0
    this.ty = 10000
    this.x = null
    this.y = null
  }

  step () {
    this.x = map(noise(this.tx), 0, 1, 0, width)
    this.y = map(noise(this.ty), 0, 1, 0, height)

    this.tx += 0.005
    this.ty += 0.005
  }

  show () {
    background(255)
    strokeWeight(2)
    fill(127)
    stroke(0)
    circle(this.x, this.y, 48)
  }
}

let walker

function setup () {
  createCanvas(600, 600)
  walker = new Walker()
}

function draw () {
  walker.step()
  walker.show()
}
