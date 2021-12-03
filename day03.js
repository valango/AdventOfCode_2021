'use strict'
const THIS = 'day03'    //  Submarine simulation.

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

//  Compute domination for every column.
const computeDominants = (rows) => {
  const rowCount = rows.length, half = rowCount / 2, width = rows[0].length
  const mostOnes = new Array(width), mostZeros = new Array(width)

  for (let position = 0; position < width; position += 1) {
    let onesCount = 0

    for (let i = 0; i < rowCount; ++i) {
      if (rows[i][position] === '1') onesCount += 1
    }
    mostOnes[position] = onesCount > half ? '1' : '0'   //  '1' means 1 is dominating.
    mostZeros[position] = onesCount < half ? '1' : '0'  //  '1' means 0 is dominating.
  }

  return { mostOnes, mostZeros }
}

const algorithm1 = (rows) => {
  const { mostOnes, mostZeros } = computeDominants(rows)
  return Number.parseInt(mostOnes.join(''), 2) * Number.parseInt(mostZeros.join(''), 2)
}

const computeReadings = (rows, value1, value0) => {
  for (let pos = 0; rows.length > 1 && pos < rows[0].length; ++pos) {
    const { mostOnes, mostZeros } = computeDominants(rows), fits = []

    for (const word of rows) {
      const dominant = mostOnes[pos] === '1' ? value1
        : (mostZeros[pos] === '1' ? value0 : value1)

      if (word[pos] === dominant) fits.push(word)
    }
    rows = fits
  }
  return rows[0]
}

//  Advanced readings interpretation.
const algorithm2 = (rows) => {
  const oxy = computeReadings(rows, '1', '0')
  const co2 = computeReadings(rows, '0', '1')

  return Number.parseInt(oxy, 2) * Number.parseInt(co2, 2)
}

const compute = (algorithm, dataSet = rawInput[datasetNumber]) => {
  if (!dataSet) return 'no data'

  dataSet = dataSet.split('\n').filter(v => Boolean(v))

  return algorithm(dataSet)
}

execute('puzzle #1', compute, algorithm1)
execute('puzzle #2', compute, algorithm2)

/*
puzzle #1 / dataset 0: 3309596 1: 198
	elapsed:            1095 µsecs

puzzle #2 / dataset 0: 2981085  1: 175
	elapsed:            4102 µsecs
 */
