//  Checks the command line for the dataset number (defaults to 0);
//  runs a puzzle solution, reports the elapsed time.
'use strict'

const { basename } = require('path')
const { format } = require('util')
const assert = require('assert-fine')

const MAXN = BigInt(Number.MAX_SAFE_INTEGER)

const print = msg => process.stdout.write(msg)

const usecsFrom = t0 => {
  const t1 = process.hrtime(t0)
  return (t1[0] * 1e9 + t1[1]) / 1000
}

const execute = (label, compute, ...args) => {
  const t0 = process.hrtime(), n = execute.datasetNumber
  let result = compute(...args)
  const usecs = Math.floor(usecsFrom(t0)) + ''

  if (typeof result === 'bigint' && result < MAXN) {
    result = Number(result)
  }

  print(format('\n%s / dataset %i: %o\n\telapsed: %s µsecs\n',
    label, n, result, usecs.padStart(15)))
}

const assertionHook = (callback) => {
  assert.beforeThrow(callback)
  return assert
}

const appName = basename(require.main.filename)
let datasetNumber = 0

if (process.argv.length > 2) {
  const arg = process.argv[2]
  datasetNumber = 1 * arg

  if (!(datasetNumber >= 0)) {
    const usage = `usage: node ${appName} [<number-of-dataset>]\n`

    if ('-h --help help'.split(' ').includes(arg)) {
      process.stdout.write(usage)
      process.exit(0)
    }
    process.stderr.write('bad argument: ' + arg + '\n')
    process.stdout.write(usage)
    process.exit(1)
  }
}

module.exports = execute

Object.assign(execute, {
  appName, assert, assertionHook, datasetNumber, execute,
  parseInt: (v) => Number.parseInt(v)  //  To be used as .map() argument.
})
