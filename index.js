//  /index.js
'use strict'

const { assert, print, usecsFrom } = require('./utils')
const { opendirSync } = require('fs')
const maxN = BigInt(Number.MAX_SAFE_INTEGER)
const argv = process.argv.slice(2)

const helpText = `Command line parameters:
  integer - day number(s), (default: most recent day only)
  a: all days
  b: both datasets (default: main data only)
  d: example data only (mutually exclusive with 'b' option
  h: print this information and terminate\n\n`

assert.beforeThrow((assertionError, args) => {
  console.error('Assertion FAILED with args:', args)
})

const dir = opendirSync('.')
let days = new Set(), entry, modules = [], cliFlags = ''

while ((entry = dir.readSync())) {
  if (entry.isFile() && /^day\d\d\.js$/.test(entry.name)) {
    modules.push(entry.name.slice(3, 5))
  }
}

assert(modules.length, 'No dayNN.js modules found!')

for (const arg of argv) {
  if (/^\d+$/.test(arg)) {
    days.add(arg.padStart(2, '0'))
  } else {
    if (arg.includes('h')) {
      print(helpText)
      return 0
    }
    if (Array.from(arg).some(c => !'abd'.includes(c))) {
      print(`Illegal parameter '${arg}' - use -h option for help!\n`)
      return 1
    }
    cliFlags += arg
  }
}

const useBoth = cliFlags.includes('b'), useDemo = cliFlags.includes('d')

if (useBoth && useDemo) {
  print(`Can not use both 'b' and 'd' options!\n`)
  return 1
}

if (cliFlags.includes('a')) {
  days = modules.sort()
} else {
  if (days.size) {
    days = Array.from(days).filter(day => modules.includes(day))
    assert(days.length, 'Mo modules for given day(s)')
  } else {
    days = [modules.sort().reverse()[0]]
  }
}

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

const runReport = (puzzle, ds, label) => {
  const res = ds && execute(puzzle, ds)

  res ? print(`\t${label}(${res.usecs.padStart(15)} µs): ${res.result} `)
    : print(`\t${label}: n/a\t\t`)
}

for (const day of days) {
  const loadable = require('./day' + day)

  for (let d, d0, d1, n = 0; n <= 1; ++n) {
    print(`day${day}, puzzle #${n + 1} `)

    if (useBoth || useDemo) {
      if (n && (d = loadable.parse(2)) !== undefined) {
        d1 = d
      } else {
        d1 = loadable.parse(1)
      }
      runReport(loadable.puzzles[n], d1, 'DEMO')
    }

    if (!useDemo) {
      if (d0 === undefined) d0 = loadable.parse(0)
      runReport(loadable.puzzles[n], d0, 'REAL')
    }
    print('\n')
  }
}
