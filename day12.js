'use strict'  //  Finding different routes in cave system.

const { loadData } = require('./core/utils')
const rawInput = [loadData(module.filename)]

/**
 * @param {string[]} data
 * @return {{smallCaves: string[], links: Map<string, string[]>}}
 */
const prepare = (data) => {
  const links = new Map(), smallCaves = ['']

  const addLink = (links, a, b) => {
    const v = links.get(a) || []

    v.push(b)
    links.set(a, v)
    if (b !== 'end' && b[0] >= 'a' && !smallCaves.includes(b)) smallCaves.push(b)
  }

  for (const [a, b] of data) {
    if (a !== 'end' && b !== 'start') addLink(links, a, b)
    if (b !== 'end' && a !== 'start') addLink(links, b, a)
  }

  return { links, smallCaves }
}

/**
 * @param {*[]} array
 * @param {*} value
 * @return {boolean}
 */
const wouldCycle = (array, value) => {
  for (let i, last = array.length - 1, start = -1;
       (i = array.indexOf(value, start + 1)) >= 0; start = i) {

    if (i === last) {
      return true
    }
    if (i > 0 && array[i - 1] === array[last]) {
      return true
    }
  }
  return false
}

/**
 * @param {Map<string[]>} links
 * @param {string} [specialCave]  - small cave that may be visited twice.
 * @return {string[][]}           - routes generated.
 */
const computeRoutes = (links, specialCave = undefined) => {
  const route = [], routes = []

  const walk = (from, special) => {
    const destinations = links.get(from)

    for (const dst of destinations) {
      let spec = special

      if (dst === 'end') {
        routes.push(route.slice())
        continue
      }
      if (dst[0] >= 'a') {
        if (route.includes(dst)) {
          if (dst !== special) {
            continue
          }
          spec = undefined
        } else if (wouldCycle(route, dst)) {
          continue
        }
      }
      route.push(dst)
      walk(dst, spec)
      route.pop()
    }
  }

  walk('start', specialCave)

  return routes
}

/** @param {string[]} data */
const puzzle1 = (data) => {
  return computeRoutes(prepare(data).links).length
}

/** @param {string[]} data */
const puzzle2 = (data) => {
  const passed = new Set()

  for (let { links, smallCaves } = prepare(data), routes; smallCaves.length > 0;) {
    routes = computeRoutes(links, smallCaves.pop())

    for (const route of routes) {
      passed.add(route.join(' '))
    }
  }
  return passed.size
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map(row => row.split('-'))
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

//  Example (demo) data.

rawInput[1] = `
start-A
start-b
A-c
A-b
b-d
A-end
b-end
` /* */
/*
rawInput[1] = `
dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc` /* */
/*
rawInput[1] = `
fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW` /* */

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
"demo": { "1": { "value": 10, "time": 343 }, "2": { "value": 36, "time": 293 } },
"main": { "1": { "value": 4167, "time": 9199 }, "2": { "value": 98441, "time": 237054 } }
 */
