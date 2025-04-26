let randomCounts
const total = 20

function pickRandomInt(from, to, includesTo = false) {
  const diff = (to - from) + (includesTo ? 1 : 0)
  return from + Math.floor(Math.random() * diff)
}

function setup () {
  createCanvas(600, 600)

  randomCounts = Array(total).fill(0)
}

// function draw () {
//   const unitW = width / total
//   const randomIndex = pickRandomInt(0, total)

//   randomCounts[randomIndex]++

//   background(255)
//   stroke(0)
//   fill(127)

//   for (let i =0; i<total; i++) {
//     rect(i * unitW, height - randomCounts[i], unitW - 1, randomCounts[i])
//   }
// }
