//  /index.js
'use strict'

const { assert, parseInt, print, usecsFrom } = require('./utils')
const { opendirSync } = require('fs')
const maxN = BigInt(Number.MAX_SAFE_INTEGER)
const argv = process.argv.slice(2)

assert.beforeThrow((assertionError, args) => {
  console.error('Assertion FAILED with args:', args)
})

const dir = opendirSync('.')
let days = new Set(), entry, modules = [], sets = new Set()

while ((entry = dir.readSync())) {
  if (entry.isFile() && /^day\d\d\.js$/.test(entry.name)) {
    modules.push(entry.name.slice(3, 5))
  }
}

assert(modules.length, 'No dayNN.js modules found!')

for (const arg of argv) {
  if (/^\d+$/.test(arg)) {
    days.add(arg.padStart(2, '0'))
  } else if (/^-\d$/.test(arg)) {
    sets.add(parseInt(arg.slice(1)))
  } else if (arg !== 'a') {
    print(`Illegal argument: ${arg}\n`)
    return 1
  }
}

if (argv.includes('a')) {
  days = modules.sort()
} else {
  if (days.size) {
    days = Array.from(days).filter(day => modules.includes(day))
    assert(days.length, 'Mo modules for given day(s)')
  } else {
    days = [modules.sort().reverse()[0]]
  }
}

sets = sets.size ? Array.from(sets).sort().reverse() : [2, 1, 0]

const execute = (puzzle, data) => {
  const t0 = process.hrtime()
  let result = puzzle(data)
  const usecs = Math.floor(usecsFrom(t0)) + ''

  if (result !== undefined) {
    if (typeof result === 'bigint' && result < maxN) {
      result = Number(result)
    }
    return { result, usecs }
  }
}

for (const day of days) {
  const loadable = require('./day' + day)
  let count = 0, ds, res

  for (const dsn of sets) {
    if ((ds = loadable.parse(dsn))) {
      print(`day${day}, set #${dsn}\n`)
      for (let n = 0; n <= 1; ++n) {
        print(`\tpuzzle-${n + 1} `)
        if ((res = execute(loadable.puzzles[n], ds))) {
          print(`(${res.usecs.padStart(15)} µsecs): ${res.result}\n`)
        } else {
          print(': n/a\n')
        }
      }
      ++count
    }
  }
  if (count === 0) {
    print('day' + day + ': no matching datasets\n')
  }
}
