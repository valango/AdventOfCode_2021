'use strict'
const rawInput = [require('./data/day06')]  //  Lanternfish
const { parseInt } = require('./utils')

//  Simple simulation, but runs out of memory for puzzle2.
const simulate1 = (initialAges, dayCount) => {
  const ages = initialAges.slice()

  for (let day = 0; day < dayCount; ++day) {
    for (let i = 0, age, limit = ages.length; i < limit; ages[i++] = age) {
      if ((age = ages[i] - 1) < 0) {
        ages.push(8)
        age = 6
      }
    }
  }
  return ages.length
}

//  A functional equivalent for simulation1, but much quicker and insensitive to parameters.
const simulate2 = (initialAges, dayCount) => {
  let countsByDaysLeft = [0,0,0,0,0,0,0,0,0]

  for (const age of initialAges) {
    countsByDaysLeft[age] += 1
  }
  for (let day = 0; day < dayCount; ++day) {
    const old = countsByDaysLeft
    countsByDaysLeft = [0,0,0,0,0,0,0,0,0]

    for (let i = 0; i < 8; ++i) {
      countsByDaysLeft[i] = old[i+1]
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
