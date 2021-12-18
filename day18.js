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

    for (let i = 0; i < 2; ++i) {
      if (pair[i][0] === '@') {
        pair[i] = stack[parseInt(pair[i].slice(1))]
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
  return data
}

/**
 * @param {TNode} node
 * @param {number} depth
 * @return {string}
 */
const stringify = (node, depth = 0) => {
  if (!node) return ''
  const parts = node.children.map(
    child => typeof child === 'object' ? stringify(child, depth + 1) : child)
  const ends = depth >= 4 ? '<>' : '[]'
  return ends[0] + parts.join(', ') + ends[1]
}

/**
 * @param {TNode|nil} node
 * @param {number} index
 * @param {TNode|nil} previous
 * @return {TNode|void}
 */
const siblingWithNumberAt = (node, index, previous) => {
  if (node) {
    let next = node.children[index]

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

  for (let affected, i = 0, j; i < length; ++i) {
    if ((affected = siblingWithNumberAt(parent, i, node)) !== nil) {
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
    let wentDown = 0, r, result = undefined

    for (let i = 0; i < node.children.length; ++i) {
      if (typeof node.children[i] !== 'object') {
        if (mode !== 'explode' && splitIfNeeded(node, i)) {
          if (depth >= 3) {
            explode(node.children[i])
          }
          return 'split'
        }
      } else {
        if ((r = dive(node.children[i], wentDown = depth + 1)) ) {
          return r
        }
      }
      if (r) result = r
    }

    if (!wentDown) {
      if (depth >= 4 ) {
        return explode(node) || 'explode'
      }
    }

    return result
  }

  return dive(object, 0)
}

const reduceAll = (node) => {
  let isChanged = false

  for (let m, mode = undefined; (m = reduce(node, mode)) || mode; mode = m) {
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
 */
const puzzle1 = (input) => {
  let result = nil

  for (let i = 0, entry; (entry = cloneDeep(input[i])); ++i) {
    result = result ? add(result, entry) : entry
  }
  return getMagnitude(result)
}

/**
 * @param {TNode[]} input
 */
const puzzle2 = (input) => {
  const { length } = input
  let set = new Set(), pairs = [], largest = 0

  for (let i = 0; i < length; ++i) {
    for (let j = 0, k; j < length; ++j) {
      if (j !== i) {
        if (!set.has(k = i + ',' + j)) set.add(k), pairs.push([i, j])
        if (!set.has(k = j + ',' + i)) set.add(k), pairs.push([j, i])
      }
    }
  }

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
[[[[4,3],4],4],[7,[[8,4],9]]]
[1,1]
`  /* finding the reduced result */

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
"demo": { "1": { "value": 4140, "time": 7855 }, "2": { "value": 3993, "time": 9030 } },
"main": { "1": { "value": 4469, "time": 16452 }, "2": { "value": 4770, "time": 379418 } }
 */
