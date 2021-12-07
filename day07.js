'use strict'
const rawInput = [require('./data/day07')]
const { parseInt } = require('./utils')
const { abs, round } = Math

const computeCost1 = (pos, points) => {
  return points.reduce((cost, x) => cost + abs(x - pos), 0)
}

const computeCost2 = (pos, points) => {
  let cost = 0

  for (let i = 0, d, v, x; (x = points[i]) !== undefined; i += 1, cost += v) {
    for (v = d = abs(x - pos); --d > 0; v += d) {}
  }
  return cost
}

const solve = (data, costFn) => {
  let cost, dir = undefined
  let mids = [], bestCost = Number.MAX_SAFE_INTEGER, bestPos
  let pos = round(data.reduce((acc, v) => acc + v, 0) / data.length)

  do {
    if ((cost = costFn(pos, data)) < bestCost) {
      bestCost = cost, bestPos = pos
      if (dir === undefined) {
        dir = -1
      }
    } else {
      if (dir === 1) {
        break
      }
      dir = 1
    }
    mids.push(pos)
  } while (!mids.includes(pos = bestPos + dir))

  return bestCost
}

const puzzle1 = (data) => {
  return solve(data, computeCost1)
}

const puzzle2 = (data) => {
  return solve(data, computeCost2)
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data[0].split(',').map(parseInt)
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

//  Example data. If rawInput[2] is defined too, then 1 and 2 are for different puzzles.
rawInput[1] = `16,1,2,0,4,2,7,1,2,14`

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
day07, puzzle #1 	DEMO(138 µs):  37 	MAIN(3705 µs): 345035
day07, puzzle #2 	DEMO( 84 µs): 168 	MAIN(3852 µs): 97038163
 */
