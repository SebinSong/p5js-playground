let TARGET_PHRASE = 'to be or not to be'
const POPULATION_SIZE = 150
const MUTATION_RATE = 0.01
let manager = null
let population = []

// helper function

function randomCharacter () {
  const c = floor(random(32, 127))
  return String.fromCharCode(c)
}

function generateNormalizedFitness () {
  const totalFitnessScore = population.reduce((sum, element) => sum + element.fitness, 0)

  return population.map(element => element.fitness / totalFitnessScore)
}

// class

class DNA {
  constructor ({noInit = false} = {}) {
    this.genes = []
    this.fitness = 0

    if (!noInit) {
      this.initGenes()
    }
  }

  initGenes () {
    while (this.fitness === 0) {
      for (let i = 0; i < TARGET_PHRASE.length; i++) {
        this.genes[i] = randomCharacter()
      }

      this.calculateFitness()
    }
  }

  getPhrase () {
    return this.genes.join('')
  }

  calculateFitness () {
    let score = 0

    for (let i = 0; i < this.genes.length; i++) {
      if (this.genes[i] === TARGET_PHRASE.charAt(i)) {
        score++
      }
    }

    this.fitness = score
  }

  crossover (partner) {
    const targetLen = TARGET_PHRASE.length
    const child = new DNA({ noInit: true })
    const midPoint = floor(random(targetLen))

    for (let i = 0; i < targetLen; i++) {
      child.genes[i] = i < midPoint
        ? this.genes[i]
        : partner.genes[i]
    }

    return child
  }

  mutate (mutationRate = 0.025) {
    for (let i = 0; i < TARGET_PHRASE.length; i++) {
      if (random(1) < mutationRate) {
        this.genes[i] = randomCharacter()
      }
    }
  }
}

class Population {
  constructor () {
    this.population = []
    this.generations = 0
    this.finished = false
    this.target = TARGET_PHRASE
    this.mutationRate = MUTATION_RATE
    this.best = ''
  }

  init () {
    for (let i = 0; i < POPULATION_SIZE; i++) {
      this.population.push(new DNA())
    }
  }

  generateNormalizedFitness () {
    const totalFitnessScore = this.population.reduce((sum, element) => sum + element.fitness, 0)
    return this.population.map(element => element.fitness / totalFitnessScore)
  }

  calculateFitness () {
    for (const phrase of this.population) {
      phrase.calculateFitness()
    }
  }

  generate () {
    const getRandomParent = () => {
      let randomVal = Math.random()
      let index = 0
      while (randomVal > normalizedFitnessArr[index]) {
        randomVal -= normalizedFitnessArr[index]
        index++
      }

      return index
    }
  
    const newPopulation = []
    const normalizedFitnessArr = this.generateNormalizedFitness()
    
    for (let i = 0; i < POPULATION_SIZE; i++) {
      let parentA, parentB, child

      parentA = getRandomParent()
      do {
        parentB = getRandomParent()
      } while (parentA === parentB)
      child = parentA.crossover(parentB)
      child.mutate()

      newPopulation.push(child)
    }

    this.generation++
    this.population = newPopulation
  }

  evaluate () {
    let worldRecord = 0
    
  }
}

function setup () {
  createCanvas(640, 240)

  manager = new Population()
  manager.init()

  for (let i = 0; i < POPULATION_SIZE; i++) {
    population.push(new DNA())
  }
}

function draw () {
  for (const phrase of population) {
    phrase.calculateFitness()
  }

  const newPopulation = []
  const normalizedFitnessArr = generateNormalizedFitness()
  const getRandomIndex = () => {
    let randomVal = Math.random()
    let index = 0
    while (randomVal > normalizedFitnessArr[index]) {
      randomVal -= normalizedFitnessArr[index]
      index++
    }

    return index
  }
  
  for (let i = 0; i < POPULATION_SIZE; i++) {
    let indexA, indexB
    let parentA, parentB
    indexA = getRandomIndex()
    do {
      indexB = getRandomIndex()
    } while (indexB === indexA)

    parentA = population[indexA]
    parentB = population[indexB]

    const child = parentA.crossover(parentB)
    child.mutate(MUTATION_RATE)
    newPopulation.push(child)
  }

  
  const everyPhrase = newPopulation.reduce((sum, phrase) => sum + phrase.getPhrase() + '    ', '')
  background(255)
  textFont('Courier')
  textSize(12)
  text(everyPhrase, 12, 0, width, height)

  population = newPopulation
}
