let center
let mouse

function setup () {
  createCanvas(640, 320)
  center = createVector(width / 2, height / 2)
}

function draw () {
  background(255)
  mouse = createVector(mouseX, mouseY)

  if (mouse.x < 0 ||
    mouse.x > width ||
    mouse.y < 0 ||
    mouse.y > height
  ) { return }

  mouse.sub(center)

  // draw mouse and center
  stroke(180)
  strokeWeight(3)
  line(0, 0, center.x, center.y)
  line(0, 0, mouse.x, mouse.y)

  // draw the vector subtraction
  stroke(0)
  line(center.x, center.y, mouse.x, mouse.y)
}
