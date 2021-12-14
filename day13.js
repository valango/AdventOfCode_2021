'use strict'

const { loadData, parseInt, print } = require('./core/utils')
const rawInput = [loadData(module.filename)]
const { max } = Math

/**
 * @param {number[][]} coords
 * @return {number[]}
 */
const getSize = coords => {
  const [w, h] = coords.reduce(([w, h], [x, y]) => [max(w, x), max(h, y)], [0, 0])
  return [w + 1, h + 1]
}

/**
 *
 * @param {number[][]} coords
 * @param {number} x0
 * @param {number} y0
 * @return {number[][]}
 */
const fold = (coords, x0, y0) => {
  const folded = []

  for (let [x, y] of coords) {
    if (x > x0) x = 2 * x0 - x
    if (y > y0) y = 2 * y0 - y
    folded.push([x, y])
  }
  return folded
}

/**
 * @param {number[][]} coords
 * @return {number}
 */
const countDots = (coords) => {
  const set = new Set()

  for (const [x, y] of coords) set.add(x + ',' + y)

  return set.size
}

/**
 * @param {number[][]} coords
 */
const showDots = (coords) => {
  const maxes = coords.reduce(([w, h], [x, y]) => [max(w, x), max(h, y)], [0, 0])
  const bits = []

  for (let ir = 0; ir <= maxes[1]; ++ir) {
    bits.push(new Array(maxes[0] + 1).fill('.'))
  }
  for (const [x, y] of coords) {
    bits[y][x] = '#'
  }
  for (let ir = 0; ir <= maxes[1]; ++ir) {
    print('\n' + bits[ir].join(''))
  }
  print('\n')
}

/**
 * @param {{coords: number[][], folds: number[][]}[]} data
 * @param {boolean} justFirstCount
 * @return {number|number[][]}
 */
const doFolding = (data, justFirstCount) => {
  let { coords, folds } = data, [x1, y1] = getSize(coords)

  for (let i = 0, fld; (fld = folds[i]); ++i) {
    coords = fold(coords, fld[0], fld[1])
    if (x1 > fld[0]) x1 = fld[0]
    if (y1 > fld[1]) y1 = fld[1]
    if (justFirstCount) {
      return countDots(coords)
    }
  }
  return coords
}

/**
 * @param {*[]} input
 */
const puzzle1 = (input) => {
  return doFolding(input, true)
}

/**
 * @param {*[]} input
 * @param {TOptions} options
 */
const puzzle2 = (input, options) => {
  const coords = doFolding(input, false)

  if (!(options.allDays || options.makeMd || options.makeJSON)) {
    showDots(coords)
  }
  return options.isDemo ? 'O' : 'EAHKRECP'   //  Parsed from the screen output.
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    let coords = [], folds = [], r
    for (const line of data) {
      if ((r = /(x|y)=(\d+)$/.exec(line))) {
        folds.push(r[1] === 'x' ? [parseInt(r[2]), undefined] : [undefined, parseInt(r[2])])
      } else {
        coords.push(line.split(',').map(parseInt))
      }
    }
    return { coords, folds }
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

//  Example (demo) data.
rawInput[1] = `
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */
