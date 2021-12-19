'use strict'    //  day19 - interpreting scanner data.

const { findRotation, getOffset, reverse, rotate, shift } = require('./day19rotations')
const { assert, loadData, parseInt } = require('./core/utils')
const { intersection } = require('lodash')
const rawInput = [loadData(module.filename), loadData(module.filename, 'demo')]

const parse = (dsn) => {
  let input = rawInput[dsn]
  const data = []

  if (input && (input = input.split('\n'))) {
    for (let line, iLine = 0, readings; (line = input[iLine++]) !== undefined;) {
      if (line) {
        if (/^---\sscanner\s\d+\s---$/i.exec(line)) {
          data.push(readings = [])
        } else {
          readings.push(line.split(',').map(parseInt))
        }
      }
    }
    return data
  }
}

/** @typedef {[number,number,number]} TPoint */

/**
 * @typedef {{
 * diffs: TPoint[],
 * pairs: [number, number][]
 * scans: TPoint[]
 * }} TBlock
 */

/**
 * @param {number}  x
 * @param {number}  y
 * @param {number}  z
 * @param {TPoint}  pointB
 * @return {TPoint} squared distances by all 3 projections
 */
const getDistances = ([x, y, z], pointB) => {
  x -= pointB[0], y -= pointB[1], z -= pointB[2]
  x *= x, y *= y, z *= z

  return [y + z, x + z, x + y]
}

const pointsDiff = ([a, b, c], [d, e, f]) => [a - d, b - e, c - f]

/**
 * @param {[number, number, number][]} pointReadings
 * @return {TBlock}
 */
const composeBlock = (pointReadings) => {
  const diffs = [], pairs = [], scans = pointReadings.slice()

  for (let i = 0; i < scans.length; ++i) {
    for (let j = 0; j < i; ++j) {
      diffs.push(getDistances(pointReadings[i], pointReadings[j]))
      pairs.push([j, i])
    }
  }

  return { diffs, pairs, scans }
}

const doSetsMatch = (a, b) => {
  let b1 = b.slice(0, 3), n = b1.length

  for (let iA = 0, iB, vA; iA < 3; ++iA) {
    if ((iB = b1.indexOf(a[iA])) >= 0 && iB < 3) {
      b1[iB] = undefined, --n
    }
  }
  return n === 0
}

/**
 * @param {number} value
 * @param {number[]} pairs
 * @param {number} start
 */
const indexesOfPairsContaining = (value, pairs, start) => {
  const result = []

  for (let i = start; (i = pairs.indexOf(value, i)) >= 0; ++i) {
    result.push(i >> 1)
  }

  return result
}

/**
 * @param {TBlock} blockA
 * @param {TBlock} blockB
 */
const findSimilarPairs = (blockA, blockB) => {
  const indexesA = [], indexesB = [], idxA = [], idxB = []

  for (let i = 0, dA; (dA = blockA.diffs[i]); i += 1) {
    for (let j = 0, dB, v; (dB = blockB.diffs[j]); j += 1) {
      if (doSetsMatch(dA, dB)) {
        indexesA.push(...blockA.pairs[i])
        indexesB.push(...blockB.pairs[j])
      }
    }
  }
  //  The best transform must have at least 12 fits.
  for (let i = 0, indexA, indexB, a, b, c; (indexA = indexesA[i]) !== undefined; ++i) {
    if (!idxA.includes(indexA)) {
      if ((a = indexesOfPairsContaining(indexA, indexesA, i)).length > 1) {
        b = c = undefined
        if (!idxB.includes(indexB = indexesB[i])) {
          if ((b = indexesOfPairsContaining(indexB, indexesB, 0)).length > 1) {
            if (intersection(a, b).length > 1) {
              idxA.push(indexA)
              idxB.push(indexB)
            }
          }
        }
        if (!idxB.includes(indexB = indexesB[i ^ 1])) {
          if ((b = indexesOfPairsContaining(indexB, indexesB, 0)).length > 1) {
            if (intersection(a, b).length > 1) {
              assert(!idxA.includes(indexA), 'inc')
              idxA.push(indexA)
              idxB.push(indexB)
            }
          }
        }
      }
    }
  }

  if (idxA.length >= 12) {
    let r = findRotation(blockA.scans[idxA[0]], blockA.scans[idxA[1]],
      blockB.scans[idxB[0]], blockB.scans[idxB[1]])
    let q = findRotation(blockA.scans[idxA[1]], blockA.scans[idxA[2]],
      blockB.scans[idxB[1]], blockB.scans[idxB[2]])
    assert(r !== undefined)
    assert(r === q)
    let points = blockB.scans.map(p => rotate(p, r))
    const offs = getOffset(points[idxB[0]], blockA.scans[idxA[0]])
    points = points.map(p => shift(p, offs))
    blockB.scans = points
  }
  return 0
}

/**
 * @param {TPoint[][]} input - a block contains scans from one scanner.
 */
const solve1 = (input) => {
  const blocks = input.map(composeBlock)

  for (let i = 0; i < blocks.length; ++i) {
    for (let j = 0; j < i; ++j) {
      findSimilarPairs(blocks[i], blocks[j])
    }
  }
  return 0
}

/**
 * @param {TPoint[][]} input
 * @param {TOptions} options
 */
const puzzle1 = (input, options) => {
  return options && solve1(input)
}

const puzzle2 = () => {
  return undefined
}

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */

/** @type Map<number,number[]> */
