'use strict'
const THIS = 'day02'

const rawInput = []
//  The actual input
rawInput[0] = require('./data/' + THIS)
//  The 1-st example
rawInput[1] = `
forward 5
down 5
forward 8
up 3
down 8
forward 2`
//  The 2-nd example
rawInput[2] = ``

const { assert, datasetNumber, execute } = require('./execute')

assert.beforeThrow(() => {
  console.log('--- BREAKPOINT ---') //  Yeah, sometimes I have to use this!
})
//  --- End of boilerplate ---

const parseInput = s => {
  const pair = s.split(' ')
  // let v = s.replace(/a/g, '0').replace(/b/g, '1')
  pair[1] = Number.parseInt(pair[1], 10)
  return pair
}

//  Submarine simulation.
const algorithm1 = (commands) => {
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
const algorithm2 = (commands) => {
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

const compute = (algorithm, dataSet = rawInput[datasetNumber]) => {
  if (!dataSet) return 'no data'

  dataSet = dataSet.split('\n').filter(v => Boolean(v))

  dataSet = dataSet.map(v => parseInput(v)) // .sort((a, b) => a - b)

  return algorithm(dataSet)
}

console.log(require.main.filename)
execute('puzzle #1', compute, algorithm1)
execute('puzzle #2', compute, algorithm2)

/*
puzzle #1 / dataset 0: 2073315
	elapsed:            1211 µsecs   @15min

puzzle #2 / dataset 0: 1840311528  @23min
	elapsed:            1056 µsecs
 */
