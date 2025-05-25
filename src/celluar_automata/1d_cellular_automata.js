let cells
let generation = 0
let frameCount = 0
let finished = false

const CELL_LENGTH = 5
const ruleset = {
  '111': 0,
  '110': 1,
  '101': 0,
  '100': 1,
  '011': 1,
  '010': 0,
  '001': 1,
  '000': 0
}

function setup () {
  createCanvas(800, 500)
  background(255)
  fill(0)

  // Create cells array and initialize it
  cells = new Array(Math.ceil(width / CELL_LENGTH)).fill(0)
  
  // cells[Math.floor(cells.length // 2)] = 1
  for (let i = 0; i < cells.length; i++) {
    cells[i] = i % 2 === 0 ? 0 : 1
  }
}

function draw () {
  if (!finished && frameCount % 3 === 0) {
    drawCellsAndGenerate()
  }

  frameCount++
}

function drawCellsAndGenerate () {
  if (generation * CELL_LENGTH > height) {
    finished = true
    return
  }

  for (let i = 1; i < cells.length - 1; i++) {
    if (cells[i] === 1) {
      square(i * CELL_LENGTH, generation * CELL_LENGTH, CELL_LENGTH)
    }
  }

  const nextGen = cells.slice()
  for (let i = 1; i < cells.length - 1; i++) {
    nextGen[i] = rules(cells[i-1], cells[i], cells[i+1])
  }
  cells = nextGen

  generation++
}

function rules (a, b, c) {
  return ruleset[`${a}${b}${c}`]
}
