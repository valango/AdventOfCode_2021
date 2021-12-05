'use strict'
const rawInput = [require('./data/day05')]
const { assert, parseInt } = require('./utils')

const addPoint = (field, [x, y]) => {
  let key = x + ',' + y, v = field.get(key)

  /*  if (key === '7,4') {
     key = '7,4'
   } */
  field.set(key, v === undefined ? 1 : v + 1)
}

const addHorVert = (data) => {
  const remaining = []

  for (let d, i = 0, j, line; (line = data[i]); ++i) {
    const start = line.slice(0, 2)

    j = -1
    if (line[0] === line[2]) {
      j = 1
    }
    if (line[1] === line[3]) {
      j = 0
    }
    if (j >= 0) {
      d = line[j] > line[j + 2] ? -1 : 1
      while (true) {
        addPoint(data.field, start)
        if (start[j] === line[j + 2]) {
          break
        }
        start[j] += d
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

//  In how many points the lines overlap?
const puzzle1 = (data) => {
  data.field = new Map()

  data.remaining = addHorVert(data)

  return summarize(data.field)
}

//  Add diagonals too
const puzzle2 = (data) => {
  const { field, remaining } = data
  for (let d, i = 0, j, line, start; (line = remaining[i]); ++i) {
    d = [line[2] - line[0], line[3] - line[1]]

    if (Math.abs(d[0]) === Math.abs(d[1])) {
      start = line.slice(0, 2)
      d[0] /= Math.abs(d[0])
      d[1] /= Math.abs(d[1])
      while (true) {
        addPoint(field, start)
        if (start[0] === line[2] && start[1] === line[3]) {
          break
        }
        start[0] += d[0]
        start[1] += d[1]
      }
    }
  }
  return summarize(data.field)
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    data = data.map(row => row.split(/[^\d]+/).map(parseInt))
    return data
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
	puzzle-1 (            317 µsecs): 5
	puzzle-2 (             98 µsecs): 12
day05, set #0
	puzzle-1 (          52193 µsecs): 8622      73min
	puzzle-2 (          67622 µsecs): 22037
 */
