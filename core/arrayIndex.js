//  core/arrayIndex.js
'use strict'

/**
 * Compute maximum number of unipolar binary relations between points.
 * @param {number} pointsCount
 * @return {number}
 */
const pairsCountOf = (pointsCount) => {
  let count = 0

  for (let i = 1; i < Math.floor(pointsCount); ++i) {
    count += i
  }
  return count
}

/**
 * Compute actual relation index for two points.
 * @param {number} indexOfA
 * @param {number} indexOfB
 * @return {number}
 */
const pairIndexFor = (indexOfA, indexOfB) => {
  if (indexOfA > indexOfB) [indexOfA, indexOfB] = [indexOfB, indexOfA]

  if (indexOfA >= 0 && indexOfB > indexOfA) {
    return pairsCountOf(indexOfB + 1) - (indexOfB - indexOfA)
  }
}

/**
 * Compute original pair indexes. Opposite to pairIndexFor().
 * @param {number} relationIndex
 * @return {[number, number]}
 */
const pairOfRelation = (relationIndex) => {
  for (let count = 0, i = 1, iA, iB; ; ++i) {
    if ((count += i) > relationIndex) {
      iB = i
      iA = relationIndex - count + i
      return [iA, iB]
    }
  }
}

/**
 * Create array of indexes for original array.
 * @param {*[]|string|number} arrayLikeOrSize
 * @param {number} start
 * @param {number} step
 * @return {number[]}
 */
const indexesFor = (arrayLikeOrSize, start = 0, step = 1) => {
  const size = typeof arrayLikeOrSize === 'number' ? arrayLikeOrSize : arrayLikeOrSize.length
  const indexes = new Array(size)

  for (let i = 0, value = start; i < size; ++i, value += step) {
    indexes[i] = value
  }

  return indexes
}

module.exports = { indexesFor, pairIndexFor, pairsCountOf, pairOfRelation }
