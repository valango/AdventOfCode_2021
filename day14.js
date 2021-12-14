'use strict'

const { loadData } = require('./core/utils')
const rawInput = [loadData(module.filename)]

/** @typedef {{rules: string[][], template: string}} TInput */

/***
 * @param {string[][]} rules
 * @param {string} template
 * @return {string}
 */
const insert = (rules, template) => {

  for (const rule of rules) {
    for (let i, i0 = 0; (i = template.indexOf(rule[0], i0) + 1) > 0; i0 = i) {
      template = template.slice(0, i) + rule[1] + template.slice(i)
    }
  }
  return template.toUpperCase()
}

const evaluate = string => {
  const counts = new Map()
  let min = Number.MAX_SAFE_INTEGER, max = -1, cMax, cMin

  for (let c, i = 0; (c = string[i]); i += 1) {
    counts.set(c, (counts.get(c) || 0) + 1)
  }
  counts.forEach((v) => {
    min = Math.min(min, v)
    max = Math.max(max, v)
  })
  return max - min
}

/**
 * @param {TInput[]} input
 * @param {number} count
 */
const solve = (input, count) => {
  let { rules, template } = input

  for (let i = 0; i < count; ++i) {
    template = insert(rules, template)
  }
  return evaluate(template)
}

/**
 * @param {*[]} input
 * @param {TOptions} options
 */
const puzzle1 = (input, options) => {
  return solve(input, 10)
}

/**
 * @param {*[]} input
 * @param {TOptions} options
 */
const puzzle2 = (input, options) => {
  // return solve(input, 40)
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    const template = data.shift()
    return {
      rules: data.map(line => {
        const [a, b] = line.split(' -> ')
        return [a, b.toLowerCase()]
      }), template
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
 */
