'use strict'

const { assert, loadData, parseInt } = require('./core/utils')
const rawInput = [loadData(module.filename)]

const addLink = (counters, a, b) => {
  const v = counters.get(a) || []

  v.push(b)
  counters.set(a, v)
}

const makeLinks = (data) => {
  const counters = new Map()

  for (const [a, b] of data) {
    if (a !== 'end' && b !== 'start') addLink(counters, a, b)
    if (b !== 'end' && a !== 'start') addLink(counters, b, a)
  }

  /* for (let i, isDone = false; !isDone;) {
    try {
      counters.forEach((links, key) => {
        if (links.length === 1 && links[0] !== 'end') {
          counters.delete(key)
          counters.forEach((l) => {
            if ((i = l.indexOf(key)) >= 0) {
              throw l.splice(i, 1)
            }
          })
        }
      })
    } catch (e) {
      if (e instanceof Error) throw e
      continue
    }
    isDone = true
  } */

  return counters
}

/* const makeCounters = (linksMap) => {
  const counters = new Map(), keys = []

  for (const key of linksMap.keys()) {
    if (key[0] >= 'a' && key !== 'start') {
      counters.set(key, 0)
      keys.push(key)
    }
  }
  counters.set('end', 0)

  return { counters, keys }
} */

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

const puzzle1 = (data) => {
  const links = makeLinks(data), route = [], routes = []

  const walk = (from) => {
    const destinations = links.get(from)

    route.push(from)
    if (from === 'd') {
      assert(destinations)
    }
    for (const dst of destinations) {
      if (dst === 'end') {
        routes.push(route.slice())
        continue
      }
      if ((dst[0] >= 'a' && route.includes(dst)) || wouldCycle(route, dst)) {
        continue // route.pop()
      }
      walk(dst) // , visited)
    }
    route.pop()
  }

  walk('start', new Set())

  return routes.length
}

const puzzle2 = (data) => {
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map(row => row.split('-'))
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

//  Example (demo) data.
/*
rawInput[1] = `
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`
*/ /*
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
kj-dc
` */
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
start-RW`

//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */
