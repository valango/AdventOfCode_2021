//  runner/index.js
'use strict'

const dumper = require('./dumper')
const { assert, print, say, usecsFrom } = require('./utils')
const { opendirSync } = require('fs')
const maxN = BigInt(Number.MAX_SAFE_INTEGER)

const helpText = `Command line parameters:
  integer - day number(s), (default: most recent day only)
  a: all days
  b: both datasets (default: main data only)
  d: example data only (mutually exclusive with 'b' option
  h: print this information and terminate
  m: generate output as markdown table\n\n`

/* istanbul ignore next */
assert.beforeThrow((assertionError, args) => {
  console.error('Assertion FAILED with args:', args)
})

/**
 * @param {string[]} argv
 * @returns {Object}
 */
const parseCLI = (argv) => {
  let days = new Set(), flags = ''

  for (const arg of argv) {
    if (/^\d+$/.test(arg)) {
      days.add(arg.padStart(2, '0'))
    } else {
      if (arg.includes('h')) {
        return { code: 0, message: helpText }
      }
      if (Array.from(arg).some(c => !'abdm'.includes(c))) {
        return { code: 1, message: `Illegal parameter '${arg}' - use -h option for help!\n` }
      }
      flags += arg
    }
  }

  const useBoth = flags.includes('b'), useDemo = flags.includes('d')

  return (useBoth && useDemo)
    ? { code: 1, message: `Can not use both 'b' and 'd' simultaneously!\n` }
    : { allDays: flags.includes('a'), days, makeMarkdown: flags.includes('m'), useBoth, useDemo }
}

/**
 * @param {Set<string>} requiredDays  - ['01', '02']
 * @param {Array<string>} modules     - ['day01.js', 'day25.js']
 * @param {boolean} allDays
 * @returns {Array<string>}           - ['01']
 */
const prepareDays = (requiredDays, modules, allDays) => {
  let days

  if (allDays) {
    days = modules.sort()
  } else {
    if (requiredDays.size) {
      days = Array.from(requiredDays).filter(day => modules.includes(day))
      if (days.length !== requiredDays.size) {
        return 'No modules for given day(s)!\n'
      }
    } else {
      days = [modules.sort().reverse()[0]]
    }
  }
  return days
}

/**
 * @param {function(*):*} puzzle
 * @param {*} data
 * @returns {{result: number, usecs: number}}
 */
const execute = (puzzle, data) => {
  const t0 = process.hrtime()
  let result = puzzle(data)
  const usecs = Math.floor(usecsFrom(t0))

  if (result !== undefined) {
    if (typeof result === 'bigint' && result < maxN) {
      result = Number(result)
    }
    return { result, usecs }
  }
}

/* istanbul ignore next */
/**
 * @param {function(*):*} puzzle
 * @param {*} data
 * @param {string} tag
 * @param {function(string)} say
 * @returns {{usecs:number, result:*}|undefined}
 */
const runAndReport = (puzzle, data, tag, say) => {
  say(` ${tag}...`)
  const res = data && execute(puzzle, data)
  say(`\b\b\b ok`)

  return res
}

/**
 * @param {Array<string>} days
 * @param {boolean} useBoth
 * @param {boolean} useDemo
 * @param {function(string)} say
 * @param {Array<Object>} [modules]     - for testing only.
 * @returns {Array<*>}
 */
const runPuzzles = (days, { useBoth, useDemo }, say, cb = undefined, modules = undefined) => {
  const longLine = '\r'.padEnd(70) + '\r', output = []

  for (const day of days) {
    /* istanbul ignore next */
    const loadable = modules ? modules[day] : require('../day' + day), record = {}

    say(`day${day}:`)

    for (let d, d0, d1, n = 0, tag = 'DEMO'; n <= 1; ++n) {
      say(`\tpuzzle #${n + 1} `)
      // print(`day${day}, puzzle #${n + 1} `)

      if (useBoth || useDemo) {
        if (n && (d = loadable.parse(2)) !== undefined) {
          d1 = d, tag = 'DEMO'
        }
        if (d1 === undefined) {
          d1 = loadable.parse(1)

          if (!d1 && !useBoth && (d1 = loadable.parse(0))) {
            tag = 'MAIN'    //  Todo: clarify the logic!
          }
        }
        record[n + tag] = runAndReport(loadable.puzzles[n], d1, tag, say)
      }

      if (!useDemo) {
        if (d0 === undefined) d0 = loadable.parse(0)
        record[n + 'MAIN'] = runAndReport(loadable.puzzles[n], d0, 'MAIN', say)
      }
      say(longLine)
    }
    output.push(cb ? cb(record, day) : record)
  }
  return output
}

/* istanbul ignore next */
exports = module.exports = (argv) => {
  const modules = []

  for (let dir = opendirSync('.'), entry; (entry = dir.readSync());) {
    if (entry.isFile() && /^day\d\d\.js$/.test(entry.name)) {
      modules.push(entry.name.slice(3, 5))
    }
  }

  const { allDays, code, days, makeMarkdown, message, useBoth, useDemo } = parseCLI(argv)

  if (message) {
    print(message)
    return code
  }

  assert(modules.length, 'No dayNN.js modules found!')

  const selectedDays = prepareDays(days, modules, allDays)

  if (typeof selectedDays === 'string') {
    print(message)
    return 1
  }

  const { checkRow, demoColumn, dump, dumpMdHeader, getRow } = dumper({ useBoth, useDemo }, print)

  const callBack = (record, day) => {
    let res
    const row = getRow(day)

    if ((res = record['0MAIN'])) row[1] = res.result + '', row[3] = res.usecs + ''
    if ((res = record['1MAIN'])) row[2] = res.result + '', row[4] = res.usecs + ''
    if ((res = record['0DEMO'])) row[demoColumn] = res.result + '', row[demoColumn + 2] = res.usecs + ''
    if ((res = record['1DEMO'])) row[demoColumn + 1] = res.result + '', row[demoColumn + 3] = res.usecs + ''

    if (makeMarkdown) {
      print('|' + row.join('|') + '|\n')
    } else {
      checkRow(row)
    }
    return row
  }

  if (makeMarkdown) {
    dumpMdHeader()
  }

  const lines = runPuzzles(selectedDays, { useBoth, useDemo }, say, callBack)

  if (!makeMarkdown) dump(lines)

  return 0
}

//  Expose internals for module testing.
Object.assign(exports, { execute, parseCLI, prepareDays, runAndReport, runPuzzles })
