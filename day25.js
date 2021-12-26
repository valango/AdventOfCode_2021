'use strict'

const { loadData, print } = require('./core/utils')
const { cloneDeep } = require('lodash')
const rawInput = [loadData(module.filename), 0, 0, 0]

const symbols = '.>v'
const empty = 0
const dE = 1
const dS = 2

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map(line => Array.from(line).map(c => symbols.indexOf(c)))
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

/** @typedef {number[][]} TBoard */

/**
 * @param {TBoard} board
 * @param {number} direction
 * @return {number} moveCount
 */
const halfStep = (board, direction) => {
  /** @type {number[]} */   //  Sequence of (x, y)
  const toMove = []
  const height = board.length, width = board[0].length

  for (let y = 0, row; (row = board[y]) !== undefined; ++y) {
    for (let x = 0, x0 = 0; (x = row.indexOf(empty, x0)) >= 0; x0 = x + 1) {
      if (direction === dE) {
        if (x === 0) {
          if (row[width - 1] === dE) toMove.push(width - 1, y)
        } else if (row[x - 1] === dE) toMove.push(x - 1, y)
      } else {
        if (y === 0) {
          if (board[height - 1][x] === dS) toMove.push(x, height - 1)
        } else if (board[y - 1][x] === dS) toMove.push(x, y - 1)
      }
    }
  }

  for (let i = 0, x, y; (x = toMove[i++]) !== undefined && (y = toMove[i++]) !== undefined;) {
    board[y][x] = empty

    if (direction === dE) {
      if (++x === width) x = 0
    } else {
      if (++y === height) y = 0
    }
    board[y][x] = direction
  }

  return toMove.length >> 1
}

/**
 * @param {TBoard} board
 * @return {number} moveCount
 */
const step = (board) => {
  return halfStep(board, dE) + halfStep(board, dS)
}

const verbose = false

/** @param {TBoard} board */
const dump = verbose
  ? (board) => {
    for (const row of board) {
      print('\n' + row.map(v => symbols[v]).join(''))
    }
    print('\n')
  }
  : () => undefined

const puzzle1 = (input) => {
  const board = cloneDeep(input), limit = 10000000
  let stepCount = 0

  dump(board)
  while (step(board) !== 0) {
    if (++stepCount >= limit) {
      print('\n===== Limit exceeded!')
      break
    }
    if ([1, 2, 58].includes(stepCount)) {
      verbose && print('\nAfter ' + stepCount)
      dump(board)
    }
  }
  verbose && print('\nAfter ' + stepCount)
  dump(board)

  return stepCount + 1
}

/**
 * @param {*[]} input
 * @param {TOptions} options
 */
const puzzle2 = (input, options) => {
  return undefined
}

//  Example (demo) data.
rawInput[1] = `
v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
"demo": { "1": { "value": 58, "time": 4319 } }, "main": { "1": { "value": 568, "time": 196318 } }
 */
