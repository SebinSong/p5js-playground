function randomCharacter () {
  const c = Math.floor(random(32, 127))
  return String.fromCharCode(c)
}

function calcNormalizedFitness (population) {
  const sumFitness = population.reduce((accu, element) => accu + element.fitness, 0)
  return population.map(element => element.fitness / sumFitness)
}

class DNA {
  constructor (len = 10) {
    this.genes = []
    this.fitness = 0

    for (let i = 0; i < len; i++) {
      this.genes[i] = randomCharacter()
    }
  }

  calculateFitness (target) {
    let score = 0

    for (let i = 0; i < this.genes.length; i++) {
      if (this.genes[i] === target.charAt(i)) {
        score++
      }
    }

    this.fitness = score / target.length
  }

  print () {
    console.log(`${this.genes.join('')} : ${this.fitness}`)
  }
}

const TARGET_PHRASE = 'to be or not to be'
const POPULATION_COUNT = 20
const population = []

function setup () {
  const charLen = TARGET_PHRASE.length

  for (let i = 0; i < POPULATION_COUNT; i++) {
    population.push(new DNA(charLen))
  }

  population.forEach(phrase => {
    phrase.calculateFitness(TARGET_PHRASE)
    phrase.print()
  })


  const normalizedFitnessArr = calcNormalizedFitness(population)
  console.log('!@# normalizedFitnessArr: ', normalizedFitnessArr)
  let randomVal = Math.random()
  let index = 0

  while(randomVal > normalizedFitnessArr[index]) {
    randomVal -= normalizedFitnessArr[index]
    index++
  }

  console.log('!@# randomVal, index: ', randomVal, index)
}

function draw () {
  // population.forEach(phrase => phrase.calculateFitness(TARGET_PHRASE))

  // const normalizedFitnessArr = calcNormalizedFitness(population)
  // let randomVal = Math.random()
  // let index = 0

  // while(randomVal > normalizedFitnessArr[index]) {
  //   randomVal -= normalizedFitnessArr[index]
  //   index++
  // }
}