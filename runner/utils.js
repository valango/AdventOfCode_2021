//  /runner/utils.js
'use strict'

const assert = require('assert-fine')
const { readFileSync } = require('fs')

module.exports = {
  assert,
  readFile: path => {
    try {
      return readFileSync(path) + ''
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
  },
  parseInt: (v) => Number.parseInt(v.trim()),  //  To be used as .map() argument.
  print: msg => process.stdout.write(msg),
  say: msg => process.stderr.write(msg),
  usecsFrom: t0 => {
    const t1 = process.hrtime(t0)
    return (t1[0] * 1e9 + t1[1]) / 1000
  }
}
