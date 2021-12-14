'use strict'  //  Iterative string replacement.
//  For puzzle #2, a simple simulation results in memory explosion,
//  so instead of actual replacements, we just compute resulting character counts.

const { loadData } = require('./core/utils')
const rawInput = [loadData(module.filename)]
const { max, min } = Math

/** @typedef {{insertable:string, match:string, links:number[]}} TRule */
/** @typedef {{rules: TRule[], template: string}} TInput */

/**
 * @param {TRule[]} rules
 * @param {string} string
 * @param {number} iterationsCount
 */
const solve = (rules, string, iterationsCount) => {
  const charCounts = new Map(), { length } = rules
  let minCount = Number.MAX_VALUE, maxCount = 0
  let firingCountsOfRules = new Array(length).fill(0)

  const increaseCountOf = (ch, by) => charCounts.set(ch, (charCounts.get(ch) || 0) + by)

  for (let ir = 0; ir < length; ++ir) {
    for (let i, j = 0, { match } = rules[ir]; (i = string.indexOf(match, j) + 1); j = i) {
      firingCountsOfRules[ir] += 1
    }
  }

  Array.from(string).forEach(ch => increaseCountOf(ch, 1))

  for (let n = 1, next; n <= iterationsCount; ++n, firingCountsOfRules = next) {
    next = new Array(length).fill(0)

    for (let ir = 0, n; ir < length; ++ir) {
      if ((n = firingCountsOfRules[ir]) > 0) {
        const { insertable, links } = rules[ir]
        increaseCountOf(insertable, n)

        for (const link of links) {
          next[link] += n
        }
      }
    }
  }

  charCounts.forEach(n => (maxCount = max(n, maxCount)) && (minCount = min(n, minCount)))

  return maxCount - minCount
}

/**
 * @param {TRule[]} rules
 * @param {string} template
 */
const puzzle1 = ({ rules, template }) => {
  return solve(rules, template, 10)
}

/**
 * @param {TRule[]} rules
 * @param {string} template
 */
const puzzle2 = ({ rules, template }) => {
  return solve(rules, template, 40)
}

/**
 * @param {TRule[]} rules
 * @return {TRule[]}
 */
const fillLinks = rules => {
  for (const rule of rules) {
    let string
    const { insertable, links, match } = rule, [a, b] = match

    string = a + insertable, links[0] = rules.findIndex(({ match }) => match === string)
    string = insertable + b, links[1] = rules.findIndex(({ match }) => match === string)
  }
  return rules
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    const template = data.shift()
    return {
      rules: fillLinks(data.map(line => {
        const [match, insertable] = line.split(' -> ')
        return { insertable, match, links: [-1, -1] }
      })), template
    }
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

//  Example (demo) data.
rawInput[1] = `
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C

`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
"demo": { "1": { "value": 1588, "time": 348 }, "2": { "value": 2188189693529, "time": 301 } },
"main": { "1": { "value": 2988, "time": 287 }, "2": { "value": 3572761917024, "time": 2576 } }
 */
