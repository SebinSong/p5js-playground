const LIFESPAN = 250
const MUTATION_RATE = 0.01
const POPULATION_SIZE = 70

class DNA {
  constructor () {
    this.genes = []
    this.maxForce = 0.2

    for (let i = 0; i < LIFESPAN; i++) {
      this.genes[i] = p5.Vector.random2D()
      this.genes[i].mult(random(0, this.maxForce))
    }
  }

  crossover (partner) {
    const child = new DNA()
    const midPoint = Math.floor(Math.random() * LIFESPAN)

    for (let i = 0; i < LIFESPAN; i++) {
      child.genes[i] = i < midPoint
        ? this.genes[i]
        : partner[i]
    }

    return child
  }

  mutate (rate) {
    for (let i = 0; i < this.genes.length; i++) {
      if (Math.random() < rate) {
        this.genes[i] = p5.Vector.random2D()
        this.genes[i].mult(random(0, this.maxForce)) 
      }
    }
  }
}

class Obstacle {
  constructor (x, y, w, h) {
    this.position = createVector(x, y)
    this.w = w
    this.h = h
  }

  contains (spot) {
    return (
      spot.x > this.position.x &&
      spot.x < this.position.x + this.w &&
      spot.y > this.position.y &&
      spot.y < this.position.y + this.h
    )
  }

  show () {
    push()
    fill(150)
    stroke(0)
    rect(this.position.x, this.position.y, this.w, this.h)
    pop()
  }
}

class Target {
  constructor (x, y) {
    this.position = createVector(x, y)
    this.radius = 14
  }

  setPosition (x, y) {
    this.position = createVector(x, y)
  }

  show () {
    push()
    fill(127)
    stroke(0)
    strokeWeight(2)
    circle(this.position.x, this.position.y, this.radius * 2)
    pop()
  }

  contains (point) {
    const dist = p5.Vector.dist(this.position, point)
    return dist < this.radius
  }
}

class Rocket {
  constructor (x, y, dna) {
    this.position = createVector(x, y)
    this.velocity = createVector()
    this.acceleration = createVector()
    this.maxForce = 0.1
    this.r = 6

    this.dna = dna
    this.fitness = 0
    this.normalizedFitness = 0
    this.geneCounter = 0

    this.hitTarget = false
    this.hitObstacle = false
  }

  applyForce (force) {
    this.acceleration.add(force)
  }

  update () {
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
  }

  calculateFitness (target) {
    const distance = p5.Vector.dist(this.position, target.position)
    this.fitness = 1 / (distance * distance)

    if (this.hitObstacle) {
      this.fitness *= 0.01
    } else if (this.hitTarget) {
      this.fitness *= 2
    }
  }

  checkObstacle (obstacle) {
    if (obstacle.contains(this.position)) {
      this.hitObstacle = true

      for (let i = this.geneCounter; i < LIFESPAN; i++) {
        this.dna.genes[i] = createVector(0, 0)
      }
    }
  }

  checkReachedTarget (target) {
    if (target.contains(this.position)) {
      console.log('!@# true !!')
      this.hitTarget = true
    }
  }

  run ({ obstacle = null, target = null }) {
    if (this.geneCounter < LIFESPAN) {
      if (!this.hitObstacle && !this.hitTarget) {
        this.applyForce(this.dna.genes[this.geneCounter])
        this.geneCounter++
        this.update()

        obstacle && this.checkObstacle(obstacle)
        target && this.checkReachedTarget(target)
      }

      this.show()
    }
  }

  show () {
    const angle = this.velocity.heading()
    const r = this.r

    push()
    fill(200)
    stroke(0)
    strokeWeight(1)
    translate(this.position.x, this.position.y)
    rotate(angle)
    beginShape(TRIANGLES)
    vertex(-r/2, -r)
    vertex(-r/2, r)
    vertex(r*2, 0)
    endShape(CLOSE)
    pop()
  }
}

class Population {
  constructor (mutationRate, size, target) {
    this.mutationRate = mutationRate
    this.population = []
    this.lifeCounter = 0
    this.generations = 0
    this.target = target

    for (let i = 0; i < size; i++) {
      this.population.push(
        new Rocket(width / 2, 10 + height, new DNA())
      )
    }
  }

  fitness () {
    this.population.forEach(rocket => rocket.calculateFitness(this.target))
  }

  selection () {
    let totalFitness = 0
    for (const rocket of this.population) {
      totalFitness += rocket.fitness
    }

    this.population.forEach(rocket => {
      rocket.normalizedFitness = rocket.fitness / totalFitness
    })

    const allNormalizedFitness = this.population.reduce((accu, rocket) => accu + rocket.normalizedFitness, 0)
  }

  weightedSelection () {
    let index = 0
    let randomVal = random(1)

    while (randomVal > this.population[index].normalizedFitness) {
      randomVal -= this.population[index].normalizedFitness
      index++
    }

    return this.population[index].dna
  }

  reproduction () {
    const newPopulation = []

    for (let i = 0; i < this.population.length; i++) {
      const parentA = this.weightedSelection()
      const parentB = this.weightedSelection()
      const child = parentA.crossover(parentB)
      child.mutate(this.mutationRate)

      newPopulation.push(new Rocket(width / 2, 10 + height, child))
    }

    this.population = newPopulation
    this.generations++
  }

  run ({ obstacle = null, target = null } = {}) {
    if (this.lifeCounter < LIFESPAN) {
      this.population.forEach(rocket => rocket.run({ obstacle, target }))
      this.lifeCounter++
    } else {
      this.fitness()
      this.selection()
      this.reproduction()

      this.lifeCounter = 0
      console.log(`Generation # ${this.generations}`)
    }
  }

  showInfo () {
    fill(0)
    noStroke()
    text(
      `Generation #: ${this.generations}\nCycles left: ${(LIFESPAN - this.lifeCounter)}`,
      10, 20
    )
  }
}

let target, obstacle
let populationManager

function setup () {
  createCanvas(640, 320)

  target = new Target(width / 2, 25)
  obstacle = new Obstacle(width / 2 - 50, height - 100, 100, 20)
  populationManager = new Population(MUTATION_RATE, POPULATION_SIZE, target)
}

function draw () {
  background(255)

  populationManager.run({ obstacle, target })
  populationManager.showInfo()
  target.show()
  obstacle.show()
}

function mousePressed () {
  target.setPosition(mouseX, mouseY)
}
