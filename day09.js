'use strict'  //  Finding local minimums and their basins.

const { loadData, parseInt } = require('./core/utils')
const rawInput = [loadData(module.filename)]

const shifts = [[0, -1], [0, 1], [-1, 0], [1, 0]]

/**
 * @param {number[][]} data
 * @return {{ lastC:number, lastR:number, lows:number[][] }}
 */
const findLowPoints = (data) => {
  let lastR = data.length - 1, lastC = data[0].length - 1, lows = []

  for (let ri = 0; ri <= lastR; ++ri) {
    for (let ci = 0, h; ci <= lastC; ci++) {
      let lowestNeighbor = (h = data[ri][ci]) + 1

      for (let i = 0; i < 4; i++) {
        let [r, c] = shifts[i]

        r += ri, c += ci

        if (!(r < 0 || r > lastR || c < 0 || c > lastC)) {
          lowestNeighbor = Math.min(lowestNeighbor, data[r][c])
        }
      }
      if (h < lowestNeighbor) {
        lows.push([ri, ci])
      }
    }
  }

  return { lastC, lastR, lows }
}

const puzzle1 = (data) => {
  let { lows } = findLowPoints(data), sum = 0

  for (let i = 0, rc; (rc = lows[i]) !== undefined; ++i) {
    sum += data[rc[0]][rc[1]] + 1
  }
  return sum
}

const puzzle2 = (data) => {
  let { lastC, lastR, lows } = findLowPoints(data), sizes = [], visited

  /**
   * @param {number} ri
   * @param {number} ci
   * @param {number} previousHeight
   */
  const computeBasin = (ri, ci, previousHeight) => {
    let key, h = data[ri][ci]

    if (h < 9 && h > previousHeight && !visited.has[key = ri + ',' + ci]) {
      visited.add(key)

      for (let i = 0; i < 4; i++) {
        let [r, c] = shifts[i]

        r += ri, c += ci

        if (!(r < 0 || r > lastR || c < 0 || c > lastC)) {
          computeBasin(r, c, h)
        }
      }
    }
  }

  for (const [r, c] of lows) {
    visited = new Set()
    computeBasin(r, c, -1)
    sizes.push(visited.size)
  }
  sizes = sizes.sort((a, b) => b - a).slice(0, 3)

  return sizes.reduce((res, v) => res * v, 1)
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map(line => Array.from(line).map(parseInt))
  }

  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

//  Example (demo) data.
rawInput[1] = `
2199943210
3987894921
9856789892
8767896789
9899965678`

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
"demo": { "1": { "value": 15, "time": 261 }, "2": { "value": 1134, "time": 4652 } },
"main": { "1": { "value": 417, "time": 9618 }, "2": { "value": 1148965, "time": 16850 } }
*/
