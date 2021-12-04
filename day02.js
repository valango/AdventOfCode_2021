'use strict'

const rawInput = [require('./data/day02')]
const { assert } = require('./utils')

//  Submarine simulation.
const puzzle1 = (commands) => {
  let x = 0, depth = 0

  for (const [command, value] of commands) {
    if (command === 'forward') {
      x += value
    } else if (command === 'down') {
      depth += value
    } else if (command === 'up') {
      if ((depth -= value) < 0) {
        console.log('underrun')
        depth = 0
      }
    } else {
      assert(false, 'bad command', command)
    }
  }
  return x * depth
}

//  Modified command set.
const puzzle2 = (commands) => {
  let aim = 0, x = 0, depth = 0

  for (const [command, value] of commands) {
    if (command === 'forward') {
      x += value
      depth += aim * value
    } else if (command === 'down') {
      aim += value
    } else if (command === 'up') {
      aim -= value
    } else {
      assert(false, 'bad command', command)
    }
  }
  return x * depth
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map(str => {
      const pair = str.split(' ')

      pair[1] = Number.parseInt(pair[1], 10)
      return pair
    }) // .sort((a, b) => a - b)
  }
}

rawInput[1] = `
forward 5
down 5
forward 8
up 3
down 8
forward 2`

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
day02, set #1
	puzzle-1 (            123 µsecs): 150         @15min
	puzzle-2 (             70 µsecs): 900         @23min
day02, set #0
	puzzle-1 (            384 µsecs): 2073315
	puzzle-2 (            391 µsecs): 1840311528
 */
