'use strict'

const { assert, loadData, parseInt } = require('./core/utils')
const { cloneDeep } = require('lodash')
const rawInput = [loadData(module.filename), 0, 0, 0]
const nil = undefined

/** @typedef {{children:(TNode|number)[], parent:(TNode|nil)}} TNode */

/**
 * @param {(TNode|number)[]} children
 * @param {TNode} [parent]
 * @return {TNode}
 */
const makePair = (children, parent = nil) => {
  assert(children.every(({ parent }) => parent === nil))
  /** @type {TNode} */
  const result = { children, parent }

  for (const child of children) {
    if (typeof child === 'object') child.parent = result
  }
  return result
}

/** @return {TNode} */
const parseLine = (line) => {
  const stack = []

  for (let r; (r = /\[([^[\]]+)]/.exec(line));) {
    const pair = r[1].split(',')

    for (let i = 0, j; i < 2; ++i) {
      if (pair[i][0] === '@') {
        pair[i] = stack[j = parseInt(pair[i].slice(1))]
      } else {
        pair[i] = parseInt(pair[i])
      }
    }
    line = line.slice(0, r.index) + '@' + stack.length + line.slice(r.index + r[0].length)
    stack.push(makePair(pair))
  }
  assert(/^@\d+$/.test(line))

  return stack[parseInt(line.slice(1))]
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data.map(parseLine)
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

/**
 * @param {TNode} node
 * @return {string}
 */
const stringify = (node, n = 0) => {
  if (!node) return ''
  const parts = node.children.map(
    child => typeof child === 'object' ? stringify(child, n + 1) : child)
  const ends = n >= 4 ? '<>' : '[]'
  return ends[0] + parts.join(', ') + ends[1]
  // return ends[0] + ' ' + parts.join(', ') + ' ' + ends[1]
}

/**
 * @param {TNode|nil} node
 * @param {number} index
 * @param {TNode|nil} previous
 * @return {TNode|void}
 */
const siblingWithNumberAt = (node, index, previous) => {
  if (node) {
    let next = node.children[index] // , s0 = stringify(node), s1 = stringify(previous)

    if (typeof next === 'object') {
      if (node.parent === previous) {
        return siblingWithNumberAt(next, index, node)   //  Descending.
      }
      //  Ascending.
      if (next === previous) {
        return siblingWithNumberAt(node.parent, index, node)  //  Keep climbing
      }
      return siblingWithNumberAt(next, index ^ 1, node)
    }
    return node
  }
}

/**
 * Applied to any pair in depth 4 or more.
 * @param {TNode} node
 */
const explode = (node) => {
  const { parent } = node, { children } = parent, values = node.children, { length } = values
  // let s0 = stringify(parent), s1

  for (let affected, i = 0, j; i < length; ++i) {
    if ((affected = siblingWithNumberAt(parent, i, node)) !== nil) {
      // s1 = s0 && stringify(affected)
      if (typeof affected.children[(j = i) ^ 1] !== 'object') {
        j = i ^ 1
      }
      affected.children[j] += values[i]
    }
  }

  for (let i = 0; i < length; ++i) {
    if (children[i] === node) {
      children[i] = 0
    }
  }
  node.parent = nil
}

/**
 * Applied to a number >= 10.
 * @param {TNode} node
 * @param {number} i
 */
const splitIfNeeded = (node, i) => {
  let v, a

  if ((v = node.children[i] / 2) >= 5) {
    a = Math.floor(v)
    node.children[i] = makePair([a, v > a ? a + 1 : v], node)
    return true
  }
  return false
}

/**
 * @param {TNode} object
 * @param {string} mode
 */
const reduce = (object, mode) => {
  const dive = (node, depth) => {
    let wentDown = 0, r, result = undefined, s = '!' // stringify(node)

    for (let i = 0; i < node.children.length; ++i) {
      if (typeof node.children[i] !== 'object') {
        if (mode !== 'explode' && splitIfNeeded(node, i)) {
          if (depth >= 3) {
            explode(node.children[i])
            // s = stringify(node)
          }
          return s && 'split'
        }
      } else {
        if ((r = dive(node.children[i], wentDown = depth + 1)) /* === 'explode' */) {
          return r
        }
      }
      if (r) result = r
    }

    if (!wentDown) {
      if (depth >= 4 /* && mode !== 'split' */) {
        return explode(node) || 'explode'
      }
    }

    return result
  }

  return dive(object, 0)
}

const reduceAll = (node) => {
  let isChanged = false, s0 = '!', s1 = '!' // stringify(node)

  for (let m, mode = undefined; (s0 = s1) && (m = reduce(node, mode)) || mode; mode = m) {
    /* s1 = stringify(node)
    if (s1 === '[ [ [ [ 5, 11 ], [ 13, 0 ] ], [ [ 15, 14 ], [ 14, 0 ] ] ], [ [ 2, [ 0, < 11, 4 > ] ], [ [ < 6, 7 >, 1 ], [ 7, < 1, 6 > ] ] ] ]') {
      s1 += ''
    } */
    mode = s0 && s1 && m
    isChanged = isChanged || Boolean(m)
  }

  return { isChanged, node }
}

/**
 * @param {TNode} a
 * @param {TNode} b
 * @return {TNode}
 */
const add = (a, b) => {
  return reduceAll(makePair([a, b])).node
}

/** @type {Map<string,number>} */
let magCache = new Map()

/**
 * @param {TNode|number} node
 * @return {number}
 */
const getMagnitude = (node) => {
  if (typeof node !== 'object') {
    return node
  }
  let key = stringify(node), res = magCache.get(key)

  if (res === undefined) {
    res = 3 * getMagnitude(node.children[0]) + 2 * getMagnitude(node.children[1])
    magCache.set(key, res)
  }
  return res
}

/**
 * @param {TNode[]} input
 * @param {TOptions} options
 */
const puzzle1 = (input, options) => {
  let result = nil, s0, s1 = '!'

  for (let i = 0, entry; (entry = cloneDeep(input[i])); ++i) {
    // s0 = stringify(entry)
    result = result ? add(result, entry) : entry
    // result = reduceAll(entry).node
    // s1 = s0 && stringify(result)
    i += 0
  }
  return s1 && getMagnitude(result)
}

/**
 * @param {string[] | string} array
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

/**
 * @param {TNode[]} input
 * @param {boolean} isDemo
 */
const puzzle2 = (input, { isDemo }) => {
  if(!isDemo) return
  const { length } = input
  let numbers = [], set = new Set(), pairs = [], largest = 0

  for (let i = 0; i < length; ++i) {
    numbers.push(i)
  }

  const addPairs = () => {
    for (let i = 0, last = numbers[length - 1], key, v; i < length; ++i, last = v) {
      if (!set.has(key = last + ',' + (v = numbers[i]))) {
        set.add(key)
        pairs.push([last, v])
      }
    }
  }

  do {
    addPairs()
  } while ((numbers = permute(numbers)))

  for (let i = 0, pair, v; (pair = pairs[i]); ++i) {
    if ((v = getMagnitude(add(cloneDeep(input[pair[0]]), cloneDeep(input[pair[1]])))) > largest) {
      largest = v
    }
  }

  return largest
}

//  Example (demo) data.
rawInput[1] = `
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
`  /* homework assignment */

/* rawInput[1] = `
[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]
`  /* Here's a slightly larger example */

/* rawInput[1] = `
[[[[[9,8],1],2],3],4]
[7,[6,[5,[4,[3,2]]]]]
[[6,[5,[4,[3,2]]]],1]
[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]
[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]
`  /* examples of a single explode action */

/* rawInput[1] = `
[[[[4,3],4],4],[7,[[8,4],9]]]
[1,1]
`  /* finding the reduced result */

//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
"demo": { "1": { "value": 4140, "time": 7943 }, "2": { "value": 3993, "time": 4019407 } }
 */
