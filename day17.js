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

const computeChangeForSteps = steps => {
  let dist = 0, v = 0

  for (let n = 0; ++n <= steps;) {
    dist += ++v
  }
  return { dist, v }
}

/**
 * Compute the smallest initial speed to hit the distance interval with max number of steps.
 * @param {number} dist0
 * @param {number} dist1
 * @return {{ speed:number, steps:number }}
 */
const computeForInterval = (dist0, dist1) => {
  let d = 0, v = 0, n = 0, speed = 0, steps = 0

  for (; d < dist0; ++n) {
    d += ++v
  }
  if (d <= dist1) {
    speed = v, steps = n
    /* for (speed = v, steps = n, n = 0; d <= dist1; ++n) {
      speed = v
      d += ++v
    }
    steps -= n */
  }
  return { speed, steps }
}

/**
 * @param {number[]} position
 * @param {number[]} velocity
 */
const simulateStep = (position, velocity) => {
  position[0] += velocity[0], position[1] += velocity[1]
  if (velocity[0]) velocity[0] -= 1
  velocity[1] -= 1
}

/**
 * @param {TArea} area
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
const getDeviation = (area, [x, y]) => {
  if (x > area.x1 || y < area.y0) return 1
  if (x < area.x0 || y > area.y1) return -1
  return 0
}

const computeMaxDrop = (area) => {
  let v = area.y1 - area.y0, y = 0
  while (v > 0) {
    y += v
    v -= 1
  }
  return y
}

const computeVxMax = (area) => {
  return area.x1
}

/**
 * @param {TArea} area
 * @return {{v: number, n: number}}
 */
const computeMinX = (area) => {
  let v = 1, x = area.x0, n = 1
  while (x > 0) {
    v += 1
    x -= v
    ++n
  }
  return { v, n }
}

const computeV = (distance) => {
  let v = 0

  for (; distance > 0; v += 1) {
    distance -= v
  }
  return { distance, v }
}

/**
 * @param {TArea} area
 * @param {TOptions} options
 */
const puzzle1 = (area, options) => {
  let d, xMin, xMax, a, b
  const position = [0, 0], velocity = [6, 10], track = []

  a = computeForInterval(area.x0, area.x1)
  // b = computeForInterval()
  d = computeChangeForSteps(3)
  xMin = computeChangeForSteps(area.x0)
  xMax = computeChangeForSteps(area.x1)
  // const maxDrop = computeMaxDrop(area)
  // const xNin = // computeMinX(area)
  // const hMin = maxDrop + area.y0, hMax = maxDrop + area.y1
  // const a = computeV(hMin), b = computeV(hMax)

  for (; (d = getDeviation(area, position)) < 0;) {
    track.push(position.slice())
    simulateStep(position, velocity)
  }
  return track.length
}

/**
 * @param {*[]} area
 * @param {TOptions} options
 */
const puzzle2 = (area, options) => {
  return undefined
}

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */
