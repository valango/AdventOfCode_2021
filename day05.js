'use strict'
/* eslint no-constant-condition: "off" */

const rawInput = [require('./data/day05')]
const { parseInt } = require('./utils')

const addPoint = (field, x, y) => {
  let key = x + ',' + y, v = field.get(key)

  field.set(key, v === undefined ? 1 : v + 1)
}

const processLines = (lines, field, justDiagonals) => {
  const remaining = []

  for (const line of lines) {
    let [x, y, x1, y1] = line
    let dx = x1 - x, lx = Math.abs(dx), dy = y1 - y, ly = Math.abs(dy)

    if (((lx || ly) && lx === ly) === justDiagonals) {
      for (lx && (dx /= lx), ly && (dy /= ly); true; x += dx, y += dy) {
        addPoint(field, x, y)
        if (x === x1 && y === y1) {
          break
        }
      }
    } else {
      remaining.push(line)
    }
  }
  return remaining
}

const summarize = (field) => {
  let n = 0

  field.forEach((v) => {
    if (v > 1) {
      ++n
    }
  })
  return n
}

//  In how many points from rectangular lines overlap?
const puzzle1 = (data) => {
  data.remaining = processLines(data.lines, data.field, false)

  return summarize(data.field)
}

//  Noe, take the diagonals into account, too.
const puzzle2 = (data) => {
  processLines(data.remaining, data.field, true)

  return summarize(data.field)
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return {
      field: new Map(),
      lines: data.map(row => row.split(/[^\d]+/).map(parseInt)),
      remaining: undefined
    }
  }
}

rawInput[1] = `
0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
day05, set #1
	puzzle-1 (            206 µsecs): 5
	puzzle-2 (            137 µsecs): 12
day05, set #0
	puzzle-1 (          49572 µsecs): 8622
	puzzle-2 (          50632 µsecs): 22037
 */
