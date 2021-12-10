'use strict'  //  Analyzing braced syntax.

const { assert, loadData } = require('./core/utils')
const rawInput = [loadData(module.filename)]

const bracesA = '([{<', bracesB = ')]}>'
const costs = [3, 57, 1197, 25137]

/**
 * @param {string | string[]} line
 * @return {{cost: number, missing: string}}
 */
const analyze = (line) => {
  for (let row = Array.from(line), iB; ; row.splice(iB - 1, 2)) {
    let i, cB, last, missing

    if ((iB = row.findIndex(c => !bracesA.includes(cB = c))) < 0) {
      if ((last = row.pop())) {
        missing = bracesB[bracesA.indexOf(last)]
      }
      return { cost: 0, missing }
    }
    assert((i = bracesB.indexOf(cB)) >= 0)

    if (row[iB - 1] !== (missing = bracesA[i])) {
      return { cost: costs[i], missing }
    }
  }
}

const puzzle1 = (data) => {
  let sum = 0

  for (const line of data) {
    sum += analyze(line).cost
  }

  return sum
}

const puzzle2 = (data) => {
  let scores = []

  for (const line of data) {
    let cost, missing, row = Array.from(line), score = 0

    while (({ cost, missing } = analyze(row)) && !cost && missing) {
      score = 5 * score + bracesB.indexOf(missing) + 1
      row.push(missing)
    }

    score && scores.push(score)
  }

  return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)]
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

//  Example (demo) data.
rawInput[1] = `
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
"demo": { "1": { "value": 26397, "time": 341 }, "2": { "value": 288957, "time": 1279 } },
"main": { "1": { "value": 341823, "time": 5313 }, "2": { "value": 2801302861, "time": 20117 } }
 */
