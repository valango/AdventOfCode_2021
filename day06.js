'use strict'
const rawInput = [require('./data/day06')]  //  Lanternfish
const { parseInt } = require('./runner/utils')

//  Simple simulation, but slow, and runs out of memory for puzzle2.
const simulate1 = (initialPopulation, dayCount) => {
  const population = initialPopulation.slice()

  for (let day = 0; day < dayCount; ++day) {
    for (let i = 0, daysLeft, limit = population.length; i < limit; population[i++] = daysLeft) {
      if ((daysLeft = population[i] - 1) < 0) {
        population.push(8)
        daysLeft = 6
      }
    }
  }
  return population.length
}

//  A functional equivalent for simulate1, but O(n) to dayCount.
const simulate2 = (initialPopulation, dayCount) => {
  let countsByDaysLeft = new Uint32Array(9)

  for (const daysLeft of initialPopulation) {
    countsByDaysLeft[daysLeft] += 1
  }
  for (let day = 0; day < dayCount; ++day) {
    const old = countsByDaysLeft

    countsByDaysLeft = new Array(9)   //  Note: Uint32Array is unsafe here!

    for (let i = 0; i < 8; ++i) {
      countsByDaysLeft[i] = old[i + 1]
    }
    countsByDaysLeft[6] += (countsByDaysLeft[8] = old[0])
  }
  return countsByDaysLeft.reduce((acc, v) => acc + v, 0)
}

const puzzle1 = (data) => {
  return simulate1(data, 80)
}

const puzzle2 = (data) => {
  return simulate2(data, 256)
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  return data && data.split(',').map(parseInt)
}

rawInput[1] = `3,4,3,1,2`

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
day06, puzzle #1 	REAL(          18930 µs): 362346
day06, puzzle #2 	REAL(            284 µs): 1639643057051
 */
