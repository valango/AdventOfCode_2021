'use strict'

const { assert, loadData, parseInt } = require('./core/utils')
const rawInput = [loadData(module.filename)]

const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]], nDirs = dirs.length

/** @param {number[][]} risksOfXY */
const solve = (risksOfXY) => {
  const height = risksOfXY.length, width = height && risksOfXY[0].length
  let route = [], bestRoute = [], bestScore = Number.MAX_VALUE
  const cumulativeRisks = []

  for (let y = 0; y < height; ++y) {
    cumulativeRisks.push(new Array(width).fill(Number.MAX_SAFE_INTEGER))
  }

  const notWalkedYetTo = (x1, y1) => {
    const next = bestRoute[route.length]

    return !(next && next[0] === x1 && next[1] === y1)
  }

  /**
   * @param {number} x0
   * @param {number} y0
   * @param {number} riskSoFar
   */
  const walkFrom = (x0, y0, riskSoFar) => {
    let leastRisk = 10 + riskSoFar, bestX, bestY

    /* if (riskSoFar > cumulativeRisks[y0][x0]) {
      return Number.MAX_VALUE
    } */
    cumulativeRisks[y0][x0] = riskSoFar
    // route.push([x0, y0, riskSoFar])
    //  Try all possible directions, best first.
    for (let i = 0, risk; i < nDirs; ++i) {
      let [x, y] = dirs[i]

      x += x0, y += y0
      if (x >= 0 && y >= 0 && x < width && y < height) {
        if ((risk = risksOfXY[y][x] + riskSoFar) < leastRisk) {
          if (cumulativeRisks[y][x] > risk) {
            leastRisk = risk, bestX = x, bestY = y
          }
        }
      }
    }
    if (leastRisk < (10 + riskSoFar)) {
      riskSoFar = walkFrom(bestX, bestY, leastRisk)
      return riskSoFar
    }
    // assert(route.pop())

    return riskSoFar
  }

  for (let score; (score = walkFrom(0, 0, 0)) < Number.MAX_VALUE; route = []) {
    if (score < bestScore) {
      bestScore = score
    }
  }

  return bestScore
}

/**
 * @param {*[]} input
 * @param {TOptions} options
 */
const puzzle1 = (input, options) => {
  return solve(input)
}

/**
 * @param {*[]} input
 * @param {TOptions} options
 */
const puzzle2 = (input, options) => {
  return undefined
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map(row => Array.from(row).map(parseInt))
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

//  Example (demo) data.
rawInput[1] = `
1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */
