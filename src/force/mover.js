let mover

function setup () {
  createCanvas(640, 320)
  mover = new Mover()
}

function draw() {
  background(255)
  mover.update()
}
