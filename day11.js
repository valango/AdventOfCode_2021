'use strict'  //  Dumbo octopuses flashing simulation.

const { assert, loadData, parseInt } = require('./core/utils')
const rawInput = [loadData(module.filename)]

const shifts = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
const trigger = 10
let sideSize

const simulationStep = (field) => {
  let totalFlashes = 0, flashCount, v

  const flash = (x0, y0) => {
    field[y0][x0] = 0
    flashCount += 1

    for (let i = 0, x, y, v; i < 8; ++i) {
      if ((x = x0 + shifts[i][0]) >= 0 && x < sideSize &&
        (y = y0 + shifts[i][1]) >= 0 && y < sideSize &&
        (v = field[y][x]) > 0 && v < trigger) {
        field[y][x] += 1
      }
    }
  }

  for (let y = 0; y < sideSize; ++y) {
    for (let x = 0; x < sideSize; ++x) {
      assert(field[y][x] < trigger)
      field[y][x] += 1
    }
  }

  do {
    flashCount = 0

    for (let y = 0; y < sideSize; ++y) {
      for (let x = 0; x < sideSize; ++x) {
        if (field[y][x] === trigger) {
          flash(x, y)
        }
      }
    }
    totalFlashes += flashCount
  } while (flashCount)

  return totalFlashes
}

//  Compute number of flashes after 100 steps.
const puzzle1 = (data) => {
  let flashCount = 0, field = data.map(row => row.slice())

  for (let i = 0; i < 100; ++i) {
    flashCount += simulationStep(field)
  }
  return flashCount
}

//  Compute step whe all flash together.
const puzzle2 = (data) => {
  let all = sideSize * sideSize, step = 1, field = data.map(row => row.slice())

  while (simulationStep(field) < all) {
    ++step
  }
  return step
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    sideSize = data.length
    return data.map(d => Array.from(d).map(parseInt))
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

//  Example (demo) data.
rawInput[1] = `
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
"demo": { "1": { "value": 1656, "time": 7161 }, "2": { "value": 195, "time": 675 } },
"main": { "1": { "value": 1719, "time": 600 }, "2": { "value": 232, "time": 785 } }
 */
