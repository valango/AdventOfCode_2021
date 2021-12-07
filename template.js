'use strict'
const rawInput = [require('./data/day?')]
const { assert, parseInt } = require('./runner/utils')

const puzzle1 = (data) => {
}

const puzzle2 = (data) => {
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

//  Example data. If rawInput[2] is defined too, then 1 and 2 are for different puzzles.
rawInput[1] = ``
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */
