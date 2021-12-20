'use strict'
/* eslint-env jest */

const t = require('../core/arrayIndex')

it('pairsCountOf', () => {
  expect(t.pairsCountOf(1)).toBe(0)
  expect(t.pairsCountOf(2)).toBe(1)
  expect(t.pairsCountOf(3)).toBe(3)
  expect(t.pairsCountOf(4)).toBe(6)
  expect(t.pairsCountOf(5)).toBe(10)
})

it('combinationIndexFor', () => {
  expect(t.pairIndexFor(3, 1)).toBe(4)
  expect(t.pairIndexFor(2, 0)).toBe(1)
  expect(t.pairIndexFor(2, 3)).toBe(5)
  expect(t.pairIndexFor(3, 3)).toBeUndefined()
})

it('indexesFor', () => {
  expect(t.indexesFor('abc')).toEqual([0, 1, 2])
  expect(t.indexesFor([1, 1, 1], 2, -5)).toEqual([2, -3, -8])
  expect(t.indexesFor(4, 1)).toEqual([1, 2, 3, 4])
})

it('pairOfRelation', () => {
  expect(t.pairOfRelation(0)).toEqual([0, 1])
  expect(t.pairOfRelation(1)).toEqual([0, 2])
  expect(t.pairOfRelation(2)).toEqual([1, 2])
  expect(t.pairOfRelation(3)).toEqual([0, 3])
  expect(t.pairOfRelation(8)).toEqual([2, 4])
})
