'use strict'
const rawInput = [require('./data/day01')]  //  Sonar Sweep
const { parseInt } = require('./runner/utils')

//  Count the values bigger than previous.
const puzzle1 = (readings) => {
  let prev = undefined

  return readings.reduce((result, value) => {
    result += value > prev ? 1 : 0
    prev = value
    return result
  }, 0)
}

//  Count the averages of 3 bigger than previous.
const puzzle2 = (readings) => {
  const sums = new Array(readings.length - 2)

  for (let i = 0; i < readings.length - 2; ++i) {
    sums[i] = readings[i] + readings[i + 1] + readings[i + 2]
  }
  return puzzle1(sums)
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map(parseInt) // .sort((a, b) => a - b)
  }
}

rawInput[1] = `199
200
208
210
200
207
240
269
260
263`

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
day01, set #1
	puzzle-1 (             73 µsecs): 7
	puzzle-2 (             43 µsecs): 5
day01, set #0
	puzzle-1 (             51 µsecs): 1759
	puzzle-2 (            252 µsecs): 1805
 */
