'use strict'

const { assert, loadData, parseInt } = require('./core/utils')
const permute = require('./core/permute')
const rawInput = [loadData(module.filename, 'main'), loadData(module.filename, 'demo-tiny')]
const { abs, cos, sin, PI } = Math

/** @typedef {number[]} TPoint */
/**
 * @typedef {{distances: number[][], points: TPoint[]}} TBlock
 *
 * distances entry: (distance, coordinateIndex0, indexA0, indexB0, coordinateIndex1, ...)
 */

/** @return {TBlock[]} */
const parse = (dsn) => {
  let input = rawInput[dsn]
  const data = []

  if (input && (input = input.split('\n'))) {
    for (let distances, line, iLine = 0, iBlock = -1, point, points, r;
         (line = input[iLine++]) !== undefined;) {
      if (line) {
        if ((r = /^---\sscanner\s(\d+)\s---$/i.exec(line))) {
          ++iBlock
          distances = [], points = []
          data.push({ distances, points })
        } else {
          point = line.split(',').map(parseInt)

          for (let iR = 0, row; (row = points[iR]); ++iR) {
            for (let iC = 0, distance, entry; iC < 3; ++iC) {
              distance = abs(point[iC] - row[iC])

              if (!(entry = distances.find(row => row[0] === distance))) {
                distances.push(entry = [distance])
              }
              entry.push(iC, iR, points.length)
            }
          }
          points.push(point)
        }
      }
    }
    for (const { distances } of data) {
      distances.sort((a, b) => b.length - a.length)
    }
    return data
  }
}

/*
  Every scanner has 6 possible sight directions with 4 possible rotation angles each.
 */

/**
 * @param {TBlock[]} input
 * @param {TOptions} options
 */
const puzzle1 = (input, options) => {
  const { length } = input

  for (let blockA, blockB, iB = 0; (blockA = input[iB]); ++iB) {
    const distsA = blockA.distances, pointsA = blockA.points

    for (let iNext = iB; ++iNext < length;) {
      let iCs = [0, 1, 2], entry
      const { distances, points } = input[iB]

      distsA.forEach((entryA, distA) => {
        if ((entry = distances.get(distA))) {}
      })
    }
  }

  /* let m, r
  m = createRotationMatrix([0, 0, 1])
  r = rotate([1, 2, 3], m) */
  return undefined
}

/**
 * @param {TPoint[][]} input
 * @param {TOptions} options
 */
const puzzle2 = (input, options) => {
  return undefined
}

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */

/** @type Map<number,number[]> */
const rotationMatrixCache = new Map()

const createRotationMatrix = ([rx, ry, rz]) => {
  assert(rx >= 0 && rx >= 0 && rx >= 0, 'createRotationMatrix')
  //  https://en.wikipedia.org/wiki/Rotation_matrix
  let result
  const key = rx + ry << 2 + rz << 4

  if ((result = rotationMatrixCache.get(key)) === undefined) {
    const ax = Math.PI * rx / 2, ay = Math.PI * ry / 2, az = Math.PI * rz / 2
    const cx = cos(ax), cy = cos(ay), cz = cos(az), sx = sin(ax), sy = sin(ay), sz = sin(az)

    rotationMatrixCache.set(key, result = [
      cx * cy, cx * sy * sz - sx * cz, cx * sy * cz + sx * sz,
      sx * cy, sx * sy * sz + cx * cz, sx * sy * cz - cx * sz,
      -sy, cy * sz, cy * cz
    ])
  }
  return result
}

const rotate = (xyz, matrix) => {
  const dim = 3, result = new Array(dim).fill(0)

  for (let i = 0; i < dim; ++i) {
    for (let ij, j = 0; j < dim; ++j) {
      try {
        result[i] += matrix[ij = i * dim + j] * xyz[j]
      } catch (err) {
        throw err
      }
    }
  }
  return result
}
