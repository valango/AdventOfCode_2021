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

rawInput[1] = `
`

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */
