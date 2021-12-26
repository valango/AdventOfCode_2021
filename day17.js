'use strict'    //  day17 - Trick Shot: computing launch velocity vectors.

const { parseInt } = require('./core/utils')
const rawInput = [
  'target area: x=150..193, y=-136..-86', // I had mistakenly pasted "136..-8" here! 🤬
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
      //  Simulate falling.
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

const puzzle1 = (area) => {
  return solve1(area).yMax
}

const puzzle2 = (area) => {
  let { vXa, x0, y0, x1, y1 } = solve1(area)
  const set = new Set(), hits = new Set()

  for (let vX0 = vXa; vX0 <= x1; ++vX0) {
    for (let vY0 = y0; vY0 <= -y0 - 1; vY0++) {
      for (let vX = vX0, vY = vY0, x = 0, y = 0; x <= x1 && y >= y0; vY += -1) {
        x += vX, y += vY
        if (x >= x0 && x <= x1 && y >= y0 && y <= y1) {
          hits.add(x + ',' + y)
          set.add(vX0 + ',' + vY0)
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
"demo": { "1": { "value": 45, "time": 327 }, "2": { "value": 112, "time": 6354 } },
"main": { "1": { "value": 9180, "time": 10643 }, "2": { "value": 3767, "time": 7493 } }
*/
