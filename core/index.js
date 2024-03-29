//  core/index.js
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
  j: generate output as JSON-formatted rows
  m: generate markdown output (default: text table for multiple, JSON for single puzzle)\n\n`

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
      if (Array.from(arg).some(c => !'abdjm'.includes(c))) {
        return { code: 1, message: `Illegal parameter '${arg}' - use -h option for help!\n` }
      }
      flags += arg
    }
  }

  const useBoth = flags.includes('b'), useDemo = flags.includes('d')
  const makeJSON = flags.includes('j'), makeMd = flags.includes('m')

  if (useBoth && useDemo) {
    return { code: 1, message: `Can not use both 'b' and 'd' simultaneously!\n` }
  }
  if (makeJSON && makeMd) {
    return { code: 1, message: `Can not use both 'm' and 'j' simultaneously!\n` }
  }
  return { allDays: flags.includes('a'), days, makeMd, makeJSON, useBoth, useDemo }
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
 * @param {function(*, object=):*} puzzle
 * @param {*} data
 * @param {Object} options
 * @returns {{result: *, time: number}|undefined}
 */
const execute = (puzzle, data, options) => {
  const t0 = process.hrtime()
  let value = puzzle(data, options)
  const time = Math.floor(usecsFrom(t0))

  if (value !== undefined) {
    if (typeof value === 'bigint' && value < maxN) {
      value = Number(value)
    }
    return { value, time }
  }
}

/**
 * @param {Array<string>} days
 * @param {Object} options
 * @param {function(string)} say
 * @param {Array<Object>} [modules]     - for testing only.
 * @returns {Array<Object>}
 */
const runPuzzles = (days, options, say, modules = undefined) => {
  let loadable, record
  const longLine = '\r'.padEnd(30) + '\r', output = []
  const { useBoth, useDemo } = options, opts = { ...options, days: undefined }

  /* istanbul ignore next */
  const runAndReport = (puzzleNumber, data, msg, isDemo) => {
    say(` ${msg}...`)
    const res = data && execute(loadable.puzzles[puzzleNumber], data, { ...opts, isDemo })
    say(`\b\b\b: ok`)

    return res
  }

  for (const day of days) {
    /* istanbul ignore next */
    loadable = modules ? modules[day] : require('../day' + day), record = { day }

    for (let d, d0, d1, n = 0, result; n <= 1; ++n) {
      let msg = (`\rday${day}: puzzle #${n + 1} `)

      if (useBoth || useDemo) {
        if (n && (d = loadable.parse(2))) {
          d1 = d
        }
        if (d1 === undefined) {
          d1 = loadable.parse(1)

          if (!d1 && !useBoth && (d1 = loadable.parse(0))) {
            record.comment = 'main data was used'
          }
        }
        if ((result = runAndReport(
          n, d1, msg + (record.comment ? 'MAIN' : 'demo'), true))) {
          (record.demo || (record.demo = {}))[n + 1 + ''] = result
        }
        say(longLine)
      }

      if (!useDemo) {
        if (d0 === undefined) d0 = loadable.parse(0)

        if ((result = runAndReport(n, d0, msg + 'main', false))) {
          (record.main || (record.main = {}))[n + 1 + ''] = result
        }
        say(longLine)
      }
    }
    output.push(record)
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

  const options = parseCLI(argv)

  if (options.message) {
    print(options.message)
    return options.code
  }

  assert(modules.length, 'No dayNN.js modules found!')

  const selectedDays = prepareDays(options.days, modules, options.allDays)

  if (typeof selectedDays === 'string') {
    print(options.message)
    return 1
  }

  const dump = dumper(options, print)

  const results = runPuzzles(selectedDays, options, say)

  if (results.length) {
    dump(results, options)
  } else {
    say('There is no results to be shown!\n')
  }

  return 0
}

//  Expose internals for module testing.
Object.assign(exports, { execute, parseCLI, prepareDays, runPuzzles })
