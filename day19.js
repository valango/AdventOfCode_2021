'use strict'

const { assert, loadData, parseInt } = require('./core/utils')
const rawInput = [loadData(module.filename, 'main'), loadData(module.filename, 'demo-tiny')]

/** @typedef {number[]} TPoint */

/** @return {TPoint} */
const parse = (dsn) => {
  let data = rawInput[dsn], line, lineNum, res, sectionNum, value
  const scans = []

  if (data && (data = data.split('\n'))) {
    for (lineNum = 0, sectionNum = -1; (line = data[lineNum++]) !== undefined;) {
      if (line) {
        if ((res = /^---\sscanner\s(\d+)\s---$/i.exec(line))) {
          ++sectionNum
          // assert((value = parseInt(res[1])) === sectionNum, 'parse line #' + lineNum)
          scans.push([])
        } else {
          scans[sectionNum].push(line.split(',').map(parseInt))
        }
      }
    }
    return scans
  }
  return data
}

/**
 * @param {*[]} input
 * @param {TOptions} options
 */
const puzzle1 = (input, options) => {
  return undefined
}

/**
 * @param {*[]} input
 * @param {TOptions} options
 */
const puzzle2 = (input, options) => {
  return undefined
}

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */
