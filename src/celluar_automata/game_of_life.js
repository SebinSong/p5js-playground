const CELL_SIDE = 10
let cols, rows, board
let frameCount = 0

class Cell {
  constructor (state, x, y) {
    this.state = state
    this.previous = state
    this.x = x
    this.y = y
  }

  setState (state) {
    this.previous = this.state
    this.state = state
  }

  show () {
    stroke(0)
    fill(255)

    if (this.previous === 0 && this.state === 1) {
      fill(0, 0, 255)
    } else if (this.state === 1) {
      fill(0)
    } else if (this.previous === 1 && this.state === 0) {
      fill(255, 0, 0)
    }

    square(this.x, this.y, CELL_SIDE)
  }
}

function create2DArray (rows, cols) {
  const arr = new Array(rows)
  for (let i = 0; i < rows; i++) {
    arr[i] = new Array(cols)

    for (let j = 0; j < cols; j++) {
      arr[i][j] = new Cell(0, j * CELL_SIDE, i * CELL_SIDE)
    }
  }

  // Create rows * cols matrix
  return arr
}

function randomDeadAlive () {
  // randomly  returns 0 or 1
  return Math.random() < 0.725 ? 0 : 1
}

function getSumOfNeighbor (r, c, board) {
  let sum = 0
  for (let i = r - 1; i <= r + 1; i++) {
    for (let j = c - 1; j <= c + 1; j++) {
      sum += board[i][j].previous
    }
  }

  sum -= board[r][c].previous
  return sum
}

function decideDeadAlive (current, neighborSum) {

  if (current === 1 && neighborSum < 2) return 0
  else if (current === 1 && neighborSum > 3) return 0
  else if (current === 0 && neighborSum === 3) return 1
  else return current
}

function displayBoard (board) {
  background(255)

  for (const row of board) {
    for (const cell of row) {
      cell.show()
    }
  }
}

function setup () {
  createCanvas(720, 460)
  stroke(0)

  cols = Math.ceil(width / CELL_SIDE)
  rows = Math.ceil(height / CELL_SIDE)
  board = create2DArray(rows, cols)

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      board[i][j].setState(randomDeadAlive())
    }
  }
}

function run () {
  for (let i = 1; i < rows - 1; i++) {
    for (let j = 1; j < cols - 1; j++) {
      board[i][j].setState(
        decideDeadAlive(
          board[i][j].state,
          getSumOfNeighbor(i, j, board)
        )
      )
    }
  }

  displayBoard(board)
}

function draw () {
  frameCount++

  if (frameCount % 2 === 0) {
    run()
  }
}
