'use strict'  //  Bit string interpreter.

const { assert, loadData } = require('./core/utils')
const rawInput = [loadData(module.filename), 0]

/** @typedef {string} TInput */
/** @typedef {{next:number, value:BigInt, versionSum:number}} TParsed */

/** @type {Object<string, string>} */
const hexBits = {}

for (let i = 0; i < 16; ++i) {
  hexBits[i.toString(16)] = i.toString(2).padStart(4, '0')
}

/** @return {string[]} */
const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data
  }
  return data   //  The runner will distinguish between undefined and falsy!
}

/** @return {TParsed} */
const parseLiteral = (bits, start) => {
  let value = 0n, next

  for (let a = start, first; first !== '0'; first = bits[a++], a = next) {
    value = (value * 16n) + BigInt('0b' + bits.slice(a + 1, next = a + 5))
  }

  return { next, value, versionSum: 0 }
}

/**
 * @param {BigInt[]} values
 * @param {number} typeId
 * @return {BigInt}
 */
const computeResult = (values, typeId) => {
  if (typeId === 0) return values.reduce((res, v) => res + v, 0n)
  if (typeId === 1) return values.reduce((res, v) => res * v, 1n)
  if (typeId === 2) return values.reduce((res, v) => (res === '' || v < res) ? v : res, '')
  if (typeId === 3) return values.reduce((res, v) => (res === '' || v > res) ? v : res, '')
  if (typeId === 5) return assert(values.length === 2) || (values[0] > values[1] ? 1n : 0n)
  if (typeId === 6) return assert(values.length === 2) || (values[0] < values[1] ? 1n : 0n)
  if (typeId === 7) return assert(values.length === 2) || (values[0] === values[1] ? 1n : 0n)
  assert(false, 'bad typeId')
}

/** @return {TParsed} */
const parseOther = (bits, start, typeId) => {
  let lengthTypeID = bits[start++], next, v, res, versionSum = 0, values = []

  if (lengthTypeID === '0') {         //  Parse sub-packets zone length.
    v = Number.parseInt(bits.slice(start, next = start + 15), 2) + next

    do {
      values.push((res = parsePacket(bits, next)).value)
      versionSum += res.versionSum
    } while ((next = res.next) < v)

  } else if (lengthTypeID === '1') {  //  Parse sub-packets count.
    v = Number.parseInt(bits.slice(start, next = start + 11), 2)

    for (; v > 0; --v, next = res.next) {
      values.push((res = parsePacket(bits, next)).value)
      versionSum += res.versionSum
    }
  } else {
    assert(false, 'bad lengthTypeID', lengthTypeID)
  }

  return { next, value: computeResult(values, typeId), versionSum }
}

/** @return {TParsed} */
function parsePacket (bits, start) {
  let tmp
  const version = Number.parseInt(bits.slice(start, tmp = start + 3), 2)
  const typeId = Number.parseInt(bits.slice(tmp, start = tmp + 3), 2)
  const res = typeId === 4 ? parseLiteral(bits, start) : parseOther(bits, start, typeId)

  return { ...res, versionSum: version + res.versionSum }
}

/**
 * @param {string} input
 * @return {TParsed}
 */
const decode = input =>
  parsePacket(Array.from(input.toLowerCase()).map(c => hexBits[c]).join(''), 0)

const runDemo = (input, key, skip, length) => {
  return input.slice(skip, skip + length).map(line => decode(line)[key]).join(',')
}

/**
 * @param {string} input
 * @param {boolean} isDemo
 */
const puzzle1 = (input, { isDemo }) => {
  return isDemo ? runDemo(input, 'versionSum', 0, 7) : decode(input[0]).versionSum
}

/**
 * @param {string} input
 * @param {boolean} isDemo
 */
const puzzle2 = (input, { isDemo }) => {
  return isDemo ? runDemo(input, 'value', 7, 8) : decode(input[0]).value
}

//  Example (demo) data.
rawInput[1] = `
D2FE28
38006F45291200
EE00D40C823060
8A004A801A8002F478
620080001611562C8802118E34
C0015000016115A2E0802F182340
A0016C880162017C3686B18A3D4780

C200B40A82
04005AC33890
880086C3E88112
CE00C43D881120
D8005AC2A8F0
F600BC2D8F
9C005AC2F8F0
9C0141080250320F1802104A08`

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
"demo": { "1": { "value": "6 9 14 16 12 23 31", "time": 747 },
          "2": { "value": "3 54 7 9 1 0 0 1", "time": 129 } },
"main": { "1": { "value": 923, "time": 752 }, "2": { "value": 258888628940, "time": 1279 } } }
 */
