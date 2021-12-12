'use strict'

const { assert, loadData, parseInt } = require('./core/utils')
const rawInput = [loadData(module.filename)]

/**
 * @param {string[]} data
 */
const puzzle1 = (data) => {
}

/**
 * @param {string[]} data
 */
const puzzle2 = (data) => {
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

//  Example (demo) data.
rawInput[1] = ``
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */
