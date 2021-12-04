'use strict'
const rawInput = [require('./data/day04')]
const { parseInt } = require('./utils')

const score = (board, marks, number) => {
  let sum = 0
  for (let i = 0; i < 25; ++i) {
    if (marks[i] === 0) sum += board[i]
  }
  return number * sum
}

//  Find the winning board, mark it and return the score or just the winning number.
const puzzle1 = ({ numbers, boards, marks, won }, justBoard = false) => {
  for (const n of numbers) {
    for (let ib = 0, board; (board = boards[ib]); ++ib) {
      if (!won.includes(ib)) {
        let i = board.indexOf(n), j

        if (i >= 0 && marks[ib][i] === 0) {
          ++marks[ib][i]
          //  Check if we won: by column, than by row.
          for (j = i % 5; j < 25 && marks[ib][j]; j += 5) {}

          if (j >= 25) {
            won.push(ib)
            return justBoard ? n : score(board, marks[ib], n)
          }

          for (j = Math.floor(i / 5) * 5, i = 0; i < 5 && marks[ib][i + j]; ++i) {}

          if (i === 5) {
            won.push(ib)
            return justBoard ? n : score(board, marks[ib], n)
          }
        }
      }
    }
  }
  return 'nope'
}

//  Find out which board wins last and return its score.
const puzzle2 = (data) => {
  let lastNumber, res

  while ((res = puzzle1(data, true)) !== 'nope') {
    lastNumber = res
  }

  const ib = data.won.pop()

  return score(data.boards[ib], data.marks[ib], lastNumber)
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n\n').filter(v => Boolean(v))).length) {
    const boards = [], marks = []
    const numbers = data[0].split(',').map(parseInt)

    for (let i = 1, row; (row = data[i]); ++i) {
      row = row.split(/[^0123456789]+/).filter(v => Boolean(v)).map(parseInt)
      boards.push(row)
      marks.push(new Uint16Array(row.length))
    }

    return { numbers, boards, marks, won: [] }
  }
}

rawInput[1] = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
day04, set #1
	puzzle-1 (            281 µsecs): 4512
	puzzle-2 (             66 µsecs): 1924
day04, set #0
	puzzle-1 (            324 µsecs): 82440
	puzzle-2 (          50836 µsecs): 20774
 */
