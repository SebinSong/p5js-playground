function setup () {
  createCanvas(640, 320)
}

function draw () {
  background(255)

  const mousePos = createVector(mouseX, mouseY)
  const centerPos = createVector(width / 2, height / 2)

  const v = p5.Vector.sub(mousePos, centerPos) // A vector that points from the center to the mouse position
  v.normalize().mult(100)

  const xAxis = createVector(100, 0)
  drawVector(v, centerPos)
  drawVector(xAxis, centerPos)

  let theta = p5.Vector.angleBetween(v, xAxis)

  fill(0)
  textSize(32)
  textFont("courier")
  text(int(degrees(theta)) + " degrees\n" + nf(theta,1,2) + " radians", 10, 160)
}

function drawVector (v, pos) {
  push()
  const arrowSize = 6
  translate(pos.x, pos.y)
  stroke(0)
  strokeWeight(2)
  rotate(v.heading())
  let len = v.mag()

  line(0, 0, len, 0)
  line(len, 0, len - arrowSize, arrowSize / 2)
  line(len, 0, len - arrowSize, -arrowSize / 2)
  pop()
}
