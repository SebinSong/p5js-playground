let wind, gravity
let mover1, mover2

function setup () {
  createCanvas(640, 320)

  mover1 = new Mover({ x: random(40, width - 40), y: height / 4, mass: 1.25 })
  mover2 = new Mover({ x: random(40, width - 40), y: height / 4, mass: 2.5 })

  wind = createVector(0.075, 0)
  gravity = createVector(0, 0.325)
}

function draw () {
  background(255)
  const movers = [mover1, mover2]

  movers.forEach(mover => {
    mover.applyForce(gravity.copy().mult(mover.mass))
    if (mouseIsPressed) {
      mover.applyForce(wind)
    }
  
    mover.update()
  })
}
