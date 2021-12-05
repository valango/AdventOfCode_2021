'use strict'
const rawInput = [require('./data/day?')]
const { assert, parseInt } = require('./utils')

const puzzle1 = (data) => {
}

const puzzle2 = (data) => {
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data
  }
}

//  Example data. If rawInput[2] is defined too, then 1 and 2 are for different puzzles.
rawInput[1] = `
`

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */
