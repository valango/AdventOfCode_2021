'use strict'
const { assert, readFile } = require('./runner/utils')
const rawInput = [readFile('data/day08.txt')]
const nil = undefined
const allSegments = 'abcdefg'

//    a
//  b   c
//    d
//  e   f
//    g
//                          0      1   2     3     4    5      6    7     8      9
const segmentsForValues = 'abcefg cf acdeg acdfg bcdf abdfg abdefg acf abcdefg abcdfg'.split(' ')

const codeMap = segmentsForValues.reduce((m, c, i) => {
  m[c] = i
  return m
}, {})

//  NB: our strings contain unique values only ant start up lexicographically ordered.
const permute = (array) => {
  array = Array.from(array)

  for (let i, k = array.length - 1, v; --k >= 0;) {
    if ((v = array[k]) < array[k + 1]) {
      for (i = array.length; --i > k;) {
        if (array[k] < array[i]) {
          array[k] = array[i], array[i] = v
          v = array.slice(k + 1).reverse()
          array = array.slice(0, k + 1)
          array = array.concat(v)
          return array
        }
      }
    }
  }
  return null
}

const valueToSegment = (mapping, value) => {
  const i = mapping[0].indexOf(value)

  return i < 0 ? nil : mapping[1][i]
}

const signalToNumber = (mapping, signal) => {
  let code = [], s

  for (const v of signal) {
    if ((s = valueToSegment(mapping, v)) === nil) {
      return nil
    }
    code.push(s)
  }
  return codeMap[code.sort().join('')]
}

const guessInputMapping = (input) => {
  let number = nil, vocabulary
  const mapping = [Array.from(allSegments), Array.from(allSegments)]

  while (number === nil && mapping[0]) {
    vocabulary = {}

    for (const signal of input) {
      if ((number = signalToNumber(mapping, Array.from(signal))) === undefined) {
        vocabulary = undefined
        mapping[0] = permute(mapping[0])
        break
      }
      vocabulary[signal] = number
    }
  }
  return vocabulary
}

//  This was really just a warm-up here... ;)
const puzzle1 = (data) => {
  let n1 = 0, n4 = 0, n7 = 0, n8 = 0

  for (let i = 0, line; (line = data[i]); ++i) {
    for (let j = 0, code, l; (code = line.outputs[j]) && (l = code.length); ++j) {
      if (l === 2) {
        ++n1
      } else if (l === 4) {
        ++n4
      } else if (l === 3) {
        ++n7
      } else if (l === 7) {
        ++n8
      }
    }
  }
  return n1 + n4 + n7 + n8
}

const puzzle2 = (data) => {
  let sum = 0, v, number, vocabulary

  for (const { inputs, outputs } of data) {
    //  Comment the following line and see what happens to execution times.
    inputs.sort((a, b) => a.length - b.length)
    assert(vocabulary = guessInputMapping(inputs))
    number = 0

    for (const signal of outputs) {
      assert((v = vocabulary[signal]) !== nil)
      number = 10 * number + v
    }
    sum += number
  }
  return sum
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map((line, n) => {
      let items = line.split(' ')

      assert(items.length === 15, 'wrong input line %i', n)
      assert(items[10] === '|', 'no bar %i', n)
      items = items.map(item => Array.from(item).sort().join(''))
      return {
        inputs: items.slice(0, 10), outputs: items.slice(11)
      }
    })
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

//  Example data. If rawInput[2] is defined too, then 1 and 2 are for different puzzles.
rawInput[1] = `
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`

//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
/*
rawInput[2] = `
acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`
*/
module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
{ "day": "08",
  "demo": { "1": { "value": 26, "time": 166 }, "2": { "value": 61229, "time": 33410 } },
  "main": { "1": { "value": 344, "time": 56 }, "2": { "value": 1048410, "time": 498764 } }
}
 */
