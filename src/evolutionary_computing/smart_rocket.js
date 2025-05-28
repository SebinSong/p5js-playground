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

class Target {
  constructor (x, y) {
    this.position = createVector(x, y)
  }

  setPosition (x, y) {
    this.position = createVector(x, y)
  }

  show () {
    push()
    fill(127)
    stroke(0)
    strokeWeight(2)
    circle(this.position.x, this.position.y, 28)
    pop()
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
  }

  run () {
    if (this.geneCounter < LIFESPAN) {
      this.applyForce(this.dna.genes[this.geneCounter])
      this.geneCounter++
      this.update()
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
    console.log('!@# allNormalizedFitness: ', allNormalizedFitness)
  }

  weightedSelection () {
    let index = 0
    let randomVal = random(1)

    while (randomVal > this.population[index].normalizedFitness) {
      randomVal -=  this.population[index].normalizedFitness
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

  run () {
    if (this.lifeCounter < LIFESPAN) {
      this.population.forEach(rocket => rocket.run())
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

let target
let populationManager

function setup () {
  createCanvas(640, 320)

  target = new Target(width / 2, 25)
  populationManager = new Population(MUTATION_RATE, POPULATION_SIZE, target)
}

function draw () {
  background(255)

  target.show()
  populationManager.run()
  populationManager.showInfo()
}

function mousePressed () {
  target.setPosition(mouseX, mouseY)
}
