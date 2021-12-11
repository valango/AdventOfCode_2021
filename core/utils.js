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
const loadData = (name) => {
  const path = resolve('data', /\.js$/.test(name) ? basename(name, '.js') + '.txt' : name)
  const data = readFile(path)

  if (data === undefined) {
    say(`\n***** ENOENT: ${path}\n`)
  }
  return data
}

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
