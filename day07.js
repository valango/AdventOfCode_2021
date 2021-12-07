'use strict'
const rawInput = [require('./data/day07')]
const { parseInt } = require('./utils')

const computeCost1 = (pos, points) => {
  let cost = 0

  for (const x of points) {
    cost += Math.abs(x - pos)
  }
  return cost
}

const computeCost2 = (pos, points) => {
  let cost = 0, d, v

  for (const x of points) {
    v = d = Math.abs(x - pos)
    while (--d > 0) {
      v += d
    }
    cost += v
  }
  return cost
}

const solve = (data, fn) => {
  let cost, dir = undefined
  let mids = [], bestCost = Number.MAX_SAFE_INTEGER, bestPos
  let pos = Math.round(data.reduce((acc, v) => acc + v, 0) / data.length)

  do {
    if ((cost = fn(pos, data)) < bestCost) {
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
day07, puzzle #1 	DEMO(            214 µs): 37 	  MAIN(           5603 µs): 345035
day07, puzzle #2 	DEMO(            111 µs): 168 	MAIN(           4730 µs): 97038163
 */
