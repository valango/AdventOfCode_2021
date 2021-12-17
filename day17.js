'use strict'

const { assert, parseInt } = require('./core/utils')
const rawInput = [
  'target area: x=150..193, y=-136..-8',
  'target area: x=20..30, y=-10..-5`'
]

/** @typedef {{x0:number,x1:number,y0:number,y1:number}} TArea */

/** @return {TArea} */
const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    const res = /x=(.+)\.\.(.+),\s*y=(.+)\.\.(.+)$/.exec(data[0]).slice(1).map(parseInt)
    return { x0: res[0], x1: res[1], y0: res[2], y1: res[3] }
  }
  return data
}

const known = `
23,-10  25,-9   27,-5   29,-6   22,-6   21,-7   9,0     27,-7   24,-5
25,-7   26,-6   25,-5   6,8     11,-2   20,-5   29,-10  6,3     28,-7
8,0     30,-6   29,-8   20,-10  6,7     6,4     6,1     14,-4   21,-6
26,-10  7,-1    7,7     8,-1    21,-9   6,2     20,-7   30,-10  14,-3
20,-8   13,-2   7,3     28,-8   29,-9   15,-3   22,-5   26,-8   25,-8
25,-6   15,-4   9,-2    15,-2   12,-2   28,-9   12,-3   24,-6   23,-7
25,-10  7,8     11,-3   26,-7   7,1     23,-9   6,0     22,-10  27,-6
8,1     22,-8   13,-4   7,6     28,-6   11,-4   12,-4   26,-9   7,4
24,-10  23,-8   30,-8   7,0     9,-1    10,-1   26,-5   22,-9   6,5
7,5     23,-6   28,-10  10,-2   11,-1   20,-9   14,-2   29,-7   13,-3
23,-5   24,-8   27,-9   30,-7   28,-5   21,-10  7,9     6,6     21,-5
27,-10  7,2     30,-9   21,-8   22,-7   24,-9   20,-6   6,9     29,-5
8,-2    27,-8   30,-5   24,-7`

const knownKeys = known.split(/\s+/).filter(Boolean)

/**
 * Compute the smallest initial speed to hit the distance interval with max number of steps.
 * @param {number} dist0
 * @param {number} dist1
 * @return {number[]}
 */
const stepsForInterval = (dist0, dist1) => {
  let stepsOrSpeed = 0, dist = 0, v0 = 0

  do {
    stepsOrSpeed += 1
  } while ((dist += stepsOrSpeed) < dist0)

  if (dist <= dist1) {
    for (v0 = stepsOrSpeed; (dist += (stepsOrSpeed + 1)) <= dist1;) {
      stepsOrSpeed += 1
    }
  } else {
    stepsOrSpeed = 0
  }
  return [v0, stepsOrSpeed]
}

const solve1 = (area) => {
  let yMax = 0, nStarts = 0

  //  Compute interval of Vx able to hit (x0, x1)
  const { x0, y0, x1, y1 } = area, [vXa, vXb] = stepsForInterval(x0, x1)

  //  For each vX0 between (vXa, vXb)
  //    find the highest Vy resulting in hitting the area.
  //  Trick: when falling, the vertical speed at x===0 will be -Vy.

  for (let vX0 = vXa, speeds = []; vX0 < vXb; ++vX0) {
    for (let vY = y0; vY < 0; vY += 1) {
      //  Simulate the falling
      for (let i = 0, y = 0; (y += vY + i) >= y0; --i) {
        if (y <= y1) {
          speeds.push(-vY - 1)
          break
        }
      }
    }
    for (const vY0 of speeds) {
      for (let vX = vX0, vY = vY0, x = 0, y = 0, mY = 0; x <= x1 && y >= y0; vY += -1) {
        x += vX, y += vY
        if (y === 0) {
          y += 0
        }
        if (vX > 0) --vX
        if (mY < y) mY = y
        if (x >= x0 && y <= y1) {
          ++nStarts
          if (yMax < mY) yMax = mY
          break
        }
      }
    }
  }
  return { nStarts, yMax, vXa, vXb, x0, y0, x1, y1 }
}
/**
 * @param {TArea} area
 * @param {TOptions} options
 */
const puzzle1 = (area, options) => {
  return solve1(area).yMax
}

/**
 * @param {*[]} area
 * @param {TOptions} options
 */
const puzzle2 = (area, options) => {
  let { nStarts, yMax, vXa, vXb, x0, y0, x1, y1 } = solve1(area)
  nStarts = 0
  const set = new Set(), hits = new Set() // , known = new Set(knownKeys)

  for (let vX0 = vXa; vX0 <= x1; ++vX0) {
    for (let vY0 = y0; vY0 <= -y0 - 1; vY0++) {
      if (vX0 === 17 && vY0 === -7) {
        nStarts += 0
      }
      for (let vX = vX0, vY = vY0, x = 0, y = 0, k; x <= x1 && y >= y0; vY += -1) {
        x += vX, y += vY
        if (x >= x0 && x <= x1 && y >= y0 && y <= y1) {
          hits.add(x + ',' + y)
          set.add(k = vX0 + ',' + vY0)
          // known.delete(k)
          ++nStarts
          break
        }
        if (vX > 0) --vX
      }
    }
  }
  return set.size
}

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */
