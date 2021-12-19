//  core/utils.js
'use strict'

const assert = require('assert-fine')
const { basename, resolve } = require('path')
const { readFileSync } = require('fs')

const say = msg => process.stderr.write(msg)

const readFile = (path) => {
  try {
    return readFileSync(path) + ''
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }
}

//  The `name` should be module.filename or exact name of file in data directory.
const loadData = (moduleName, suffix = '') => {
  let path = basename(moduleName, '.js')

  assert(path, 'Bad moduleName loadData(%s)', moduleName)

  return readFile(path = resolve('data', path + suffix + '.txt'))
}

/**
 * @type {{
 * parseInt: (function(string): number),
 * print: (function(string): boolean),
 * assert: ((function(...[*]=): void) & {beforeThrow: function(*=): ((function(*))|undefined)}),
 * readFile: (function(string): (string|undefined)),
 * usecsFrom: (function(number): number),
 * loadData: (function(string,[string]): (string|undefined)),
 * say: (function(string): boolean)
 * }}
 */
module.exports = {
  assert,
  loadData,
  parseInt: (v) => Number.parseInt(v.trim()),  //  To be used as .map() argument.
  print: msg => process.stdout.write(msg),
  readFile,
  say,
  usecsFrom: t0 => {
    const t1 = process.hrtime(t0)
    return (t1[0] * 1e9 + t1[1]) / 1000
  }
}

/**
 * Type for the puzzle function <options> argument.
 *
 * @typedef {{
 *   allDays: boolean,
 *   makeJSON: boolean,
 *   makeMd: boolean,
 *   [isDemo]: boolean,
 *   useBoth: boolean,
 *   useDemo: boolean
 * }} TOptions
 */
