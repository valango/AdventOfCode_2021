//  core/permute.js
'use strict'

/**
 * @param {(BigInt|number|string)[] | string} array
 * @return {string[]  |null}
 */
const permute = (array) => {
  //  NB: Our strings contain unique chars only and are lexicographically ordered initially.
  array = Array.from(array)

  for (let i, k = array.length - 1, v; --k >= 0;) {
    if ((v = array[k]) < array[k + 1]) {
      for (i = array.length; --i > k;) {
        if (array[k] < array[i]) {
          array[k] = array[i], array[i] = v
          v = array.slice(k + 1).reverse()
          array = array.slice(0, k + 1)
          array = array.concat(v)
          return array
        }
      }
    }
  }
  return null
}

module.exports = permute
