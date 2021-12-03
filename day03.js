'use strict'
const THIS = 'day03'

const rawInput = []
//  The actual input
rawInput[0] = require('./data/' + THIS)
//  The 1-st example
rawInput[1] = `
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`
//  The 2-nd example
rawInput[2] = ``

const { assert, datasetNumber, execute } = require('./execute')

assert.beforeThrow(() => {
  console.log('--- BREAKPOINT ---') //  Yeah, sometimes I have to use this!
})
//  --- End of boilerplate ---

//  Submarine simulation.
const getMostLeast = (rows) => {
  const rowCount = rows.length, width = rows[0].length
  let gamma = new Array(width), epsilon = new Array(width)
  const half = rowCount / 2
  for (let position = 0; position < width; position += 1) {
    let zeroes = 0, ones = 0
    for (let i = 0; i < rowCount; ++i) {
      if (rows[i][position] === '1') ones += 1
    }
    gamma[position] = ones > half ? '1' : '0'   //  '1' means 1 is the most common
    epsilon[position] = ones < half ? '1' : '0' //  '1' means 0 is the most common
  }

  return { gamma, epsilon, width }
}

const algorithm1 = (rows) => {
  const { gamma, epsilon } = getMostLeast(rows)
  return Number.parseInt(gamma.join(''), 2) * Number.parseInt(epsilon.join(''), 2)
}

//  Modified command set.
const algorithm2 = (rows) => {
  let oxy = rows.slice(), co2 = oxy.slice(), width = rows[0].length

  for (let pos = 0; pos < width; ++pos) {
    const { gamma, epsilon } = getMostLeast(oxy)
    const fits = []
    for (const word of oxy) {
      const common = gamma[pos] === '1' ? '1' : (epsilon[pos] === '1' ? '0' : '1')
      if (word[pos] === common) {
        fits.push(word)
      }
    }
    if ((oxy = fits).length <= 1) break
  }
  console.log('oxy', oxy)

  for (let pos = 0; pos < width; ++pos) {
    const { gamma, epsilon } = getMostLeast(co2)
    const fits = []
    for (const word of co2) {
      const common = gamma[pos] === '1' ? '0' : (epsilon[pos] === '1' ? '1' : '0')
      if (word[pos] === common) {
        fits.push(word)
      }
    }
    if ((co2 = fits).length <= 1) break
  }
  console.log('co2', co2)
  return Number.parseInt(oxy[0], 2) * Number.parseInt(co2[0], 2)
}

const compute = (algorithm, dataSet = rawInput[datasetNumber]) => {
  if (!dataSet) return 'no data'

  dataSet = dataSet.split('\n').filter(v => Boolean(v))

  // dataSet = dataSet.map(v => parseInput(v)) // .sort((a, b) => a - b)

  return algorithm(dataSet)
}

console.log(require.main.filename)
execute('puzzle #1', compute, algorithm1)
execute('puzzle #2', compute, algorithm2)

/*
puzzle #1 / dataset 0: 3309596 (198)
	elapsed:            1095 µsecs

puzzle #2 / dataset 0: 1840311528  @23min
	elapsed:            1056 µsecs
 */
