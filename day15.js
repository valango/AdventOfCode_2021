'use strict'  //  Finding the least risky path thru labyrinth.

const { assert, loadData, parseInt } = require('./core/utils')
const rawInput = [loadData(module.filename), 0, 0, 0]

rawInput[3] = loadData('day15d.txt')

/** @param {number} dsn */
const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map(row => Array.from(row).map(parseInt))
  }
  return data
}

const dirs = [[0, -1], [-1, 0], [0, 1], [1, 0]], nDirs = dirs.length

/** @param {number[][]} risksOfXY */
const solve = (risksOfXY) => {
  const cumulativeRisks = []
  const height = risksOfXY.length, width = height && risksOfXY[0].length
  let wasChanged

  for (let y = 0; y < height; ++y) {
    cumulativeRisks.push(new Array(width).fill(Number.MAX_SAFE_INTEGER))
  }

  const findBestPreviousScoreFor = (x0, y0) => {
    let lesser = Number.MAX_SAFE_INTEGER
    for (let i = 0, x, y, value; i < nDirs && ([x, y] = dirs[i]); ++i) {
      if ((x += x0) >= 0 && (y += y0) >= 0 && x < width && y < height) {
        if ((value = cumulativeRisks[y][x]) < lesser) {
          lesser = value
        }
      }
    }
    return lesser
  }

  const borderCoordsFor = (x1, y1) => {
    const coords = []

    for (let i = 0; i < x1; ++i) coords.push([i, y1])
    for (let i = 0; i < y1; ++i) coords.push([x1, i])
    coords.push([x1, y1])
    return coords
  }

  const expandRisksMapTo = (x1, y1) => {
    let coords = borderCoordsFor(x1, y1), v
    for (const [x, y] of coords) {
      v = findBestPreviousScoreFor(x, y) + risksOfXY[y][x]
      if (cumulativeRisks[y][x] > v) {
        cumulativeRisks[y][x] = v
        wasChanged = true
      }
    }
  }

  cumulativeRisks[0][0] = 0

  do {
    wasChanged = false
    for (let i = 1; i < height; ++i) {
      expandRisksMapTo(i, i)
    }
  } while (wasChanged)

  return cumulativeRisks[height - 1][width - 1]
}

/**
 * @param {*[]} input
 */
const puzzle1 = (input) => solve(input)

/**
 * @param {*[]} input
 * @param {TOptions} options
 */
const puzzle2 = (input, options) => {
  const data = [], testData = options.isDemo && parse(3)
  const height = input.length, width = height && input[0].length

  for (let y = 0; y < 5 * height; ++y) {
    const row = new Array(5 * width)

    for (let r, src, x = 0; x < 5 * width; ++x) {
      if (y < height) {
        if (x < width) {
          row[x] = input[y][x]
        } else {
          row[x] = (r = row[x - width] + 1) > 9 ? r = r - 9 : r
        }
      } else {
        src = data[y - height]
        row[x] = (r = src[x] + 1) > 9 ? r = r - 9 : r
      }
    }
    if (testData) {
      for (let i = 0; i < width; ++i) assert(row[i] === testData[y][i], 'bad data')
    }
    data.push(row)
  }
  return solve(data)
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

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */
