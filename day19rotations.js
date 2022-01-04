'use strict'
const { assert } = require('./core/utils')

const { cos, sin } = Math

const rotationMatrixCache = new Map()

const codeToAngles = (code) => {
  return [code & 3, (code >> 2) & 3, code >> 4 & 3]
}

const getRotationMatrix = (code) => {
  assert(code >= 0 && code < 0b1000000 && code === Math.floor(code), 'getRotationMatrix')
  //  https://en.wikipedia.org/wiki/Rotation_matrix
  let result
  const [rx, ry, rz] = codeToAngles(code)

  if ((result = rotationMatrixCache.get(code)) === undefined) {
    const ax = Math.PI * rx / 2, ay = Math.PI * ry / 2, az = Math.PI * rz / 2
    const cx = cos(ax), cy = cos(ay), cz = cos(az), sx = sin(ax), sy = sin(ay), sz = sin(az)

    rotationMatrixCache.set(code, result = [
      cx * cy, cx * sy * sz - sx * cz, cx * sy * cz + sx * sz,
      sx * cy, sx * sy * sz + cx * cz, sx * sy * cz - cx * sz,
      -sy, cy * sz, cy * cz
    ])
  }
  return result
}

const rotate = (xyz, matrix) => {
  const dim = 3, result = new Array(dim).fill(0)

  if (typeof matrix === 'number') matrix = getRotationMatrix(matrix)

  for (let i = 0; i < dim; ++i) {
    for (let j = 0; j < dim; ++j) {
      result[i] += Math.round(matrix[i * dim + j] * xyz[j])
    }
  }
  return result
}

const findRotation = (a, b, c, d) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2]
  for (let code = 0, e, f; code < 0b1000000; ++code) {
    e = rotate(c, getRotationMatrix(code))
    f = rotate(d, getRotationMatrix(code))
    if ((f[0] - e[0]) === dx && (f[1] - e[1]) === dy && (f[2] - e[2]) === dz) {
      return code
    }
  }
}

const getOffset = ([x0, y0, z0], [x1, y1, z1]) => [x1 - x0, y1 - y0, z1 - z0]

const shift = ([x, y, z], [dx, dy, dz]) => [x + dx, y + dy, z + dz]

const reverse = ([x, y, z]) => [-x, -y, -z]

for (let code = 0; code < 0b1000000; ++code) {
  getRotationMatrix(code)
}

module.exports = { findRotation, getOffset, reverse, rotate, shift }
