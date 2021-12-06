'use strict'
/* eslint-env jest */

const { parseCLI, prepareDays, runPuzzles } = require('../index')
const nil = undefined

let data, dsns, prints, puzzles

const print = (string) => prints.push(string)

const run = (data, options) => {

  dsns = [], prints = [], puzzles = []

  runPuzzles(['01'], { ...options, print }, {
    '01': {
      parse: dsn => dsns.push(dsn) && data[dsn],
      puzzles: [
        d => puzzles.push('1:' + d) && (d || undefined),
        d => puzzles.push('2:' + d) && (d || undefined)
      ]
    }
  })

  return { dsns, puzzles }
}

it('should parse CLI', () => {
  let r
  expect(parseCLI([])).toMatchObject({ allDays: false, useBoth: false, useDemo: false })
  expect(parseCLI(['a', 'b'])).toMatchObject({ allDays: true, useBoth: true, useDemo: false })
  expect(r = parseCLI(['ab'])).toMatchObject({ allDays: true, useBoth: true, useDemo: false })
  expect(r.days.size).toBe(0)
  expect(r.code).toBeUndefined()
  expect(r = parseCLI(['3', '5', 'd'])).toMatchObject({ useBoth: false, useDemo: true })
  expect(r.days.size).toBe(2)
  expect(r.code).toBeUndefined()
  expect(parseCLI(['3', '5', 'h']).code).toBe(0)
  expect(parseCLI(['3', '5', 'y']).code).toBe(1)
  expect(parseCLI(['3', '5', 'bd']).code).toBe(1)
  // expect(parseCLI(['3', '5', 'ba']).code).toBe(1)
})

it('should prepare days', () => {
  const modules = '05 06 01'.split(' ')

  expect(prepareDays(parseCLI([]).days, modules, false).join('')).toBe('06')
  expect(prepareDays(parseCLI([]).days, modules, true).join('')).toBe('010506')
  expect(prepareDays(parseCLI(['3']).days, modules, false)).toMatch('No modules for given day(s)')
})

it('should run w/o data', () => {
  expect(run([], { useBoth: true })).toEqual({ dsns: [1, 0, 2, 1, 0], puzzles: [] })
})

it('should run [demo]', () => {
  expect(run([nil, 'D'], {})).toEqual({ dsns: [0, 0], puzzles: [] })
})

it('should run [demo] d', () => {
  expect(run([nil, 'D'], { useDemo: true })).toEqual({ dsns: [1, 2], puzzles: ['1:D', '2:D'] })
})

it('should run [demo, aux] d', () => {
  expect(run([nil, 'D', 'X'], { useDemo: true })).toEqual({ dsns: [1, 2], puzzles: ['1:D', '2:X'] })
})

it(`should run [demo, aux=''] d`, () => {
  expect(run([nil, 'D', ''], { useDemo: true })).toEqual({ dsns: [1, 2], puzzles: ['1:D'] })
})

it(`should run [main] d`, () => {
  expect(run(['M'], { useDemo: true })).toEqual({ dsns: [1, 0, 2], puzzles: ['1:M', '2:M'] })
})

it(`should run and convert bigint result`, () => {
  expect(run([5n], { useDemo: true })).toEqual({ dsns: [1, 0, 2], puzzles: ['1:5', '2:5'] })
})
