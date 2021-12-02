'use strict'
const THIS = 'day01'

const rawInput = []
//  The actual input
rawInput[0] = require('./data/' + THIS)
//  The 1-st example
rawInput[1] = `199
200
208
210
200
207
240
269
260
263`
//  The 2-nd example
rawInput[2] = ``

const { assert, datasetNumber, execute } = require('./execute')

assert.beforeThrow(() => {
  console.log('--- BREAKPOINT ---') //  Yeah, sometimes I have to use this!
})
//  --- End of boilerplate ---

const parseInput = s => {
  // let v = s.replace(/a/g, '0').replace(/b/g, '1')
  return Number.parseInt(s, 10)
}

//  Count the values bigger than previous.
const algorithm1 = (readings) => {
  let prev = undefined

  return readings.reduce((result, value) => {
    result += value > prev ? 1 : 0
    prev = value
    return result
  }, 0)
}

//  Count the averages of 3 bigger the previous.
const algorithm2 = (readings) => {
  const sums = new Array(readings.length - 2)

  for (let i = 0; i < readings.length - 2; ++i) {
    sums[i] = readings[i] + readings[i + 1] + readings[i + 2]
  }
  return algorithm1(sums)
}

const compute = (algorithm, dataSet = rawInput[datasetNumber]) => {
  if (!dataSet) return 'no data'

  dataSet = dataSet.split('\n')

  dataSet = dataSet.map(v => parseInput(v)) // .sort((a, b) => a - b)

  return algorithm(dataSet)
}

execute('puzzle #1', compute, algorithm1)
execute('puzzle #2', compute, algorithm2)

/*
puzzle #1 / dataset 0: 1759
	elapsed:             613 µsecs

puzzle #2 / dataset 0: 1805
	elapsed:             547 µsecs
 */
