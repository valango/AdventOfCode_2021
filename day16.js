'use strict'

const { assert, loadData, parseInt } = require('./core/utils')
const rawInput = [loadData(module.filename), 0, 0, 0]

/** @typedef {string} TInput */
/** @typedef {{next:number, value:number, versionSum:number}} TParsed */

const hexBits = {}

for (let i = 0; i < 16; ++i) {
  hexBits[i.toString(16)] = i.toString(2).padStart(4, '0')
}

/** @return {string} */
const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data[0]
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

/** @return {TParsed} */
let parsePacket = (bits, start, length) => start

/** @return {TParsed} */
const parseLiteral = (bits, start, length) => {
  let dbg = bits.slice(start), n = 0
  let value = 0, next

  for (let a = start, first; first !== '0'; first = bits[a++], a = next) {
    dbg = bits.slice(a)
    ++n
    assert(a < length)
    value = (value << 4) + Number.parseInt(bits.slice(a + 1, next = a + 5), 2)
  }
  dbg = bits.slice(start) // DEBUG
  // next += (next - start) % 5

  return { next, value, versionSum: 0 }
}

/** @return {TParsed} */
const parseOther = (bits, start, length) => {
  let dbg = bits.slice(start)
  let lengthTypeID = bits[start++], next, value = 0, v, res, versionSum = 0
  if (start >= length) {
    start = length
  }

  if (lengthTypeID === '0') {
    //  lengthOfSubPackets
    v = Number.parseInt(bits.slice(start, next = start + 15), 2)

    for (v += next; ;) {
      dbg = bits.slice(next)
      res = parsePacket(bits, next, length)
      versionSum += res.versionSum
      value += res.value
      if ((next = res.next) >= v) {
        break
      }
    }
  } else {
    // numberOfSubPackets
    v = Number.parseInt(bits.slice(start, next = start + 11), 2)
    for (; v > 0; --v, next = res.next) {
      res = parsePacket(bits, next, length)
      value += res.value
      versionSum += res.versionSum
    }
  }
  return { next, value, versionSum }
}

parsePacket = (bits, start, length) => {
  let dbg = bits.slice(start)
  let a = start, b, res
  const version = Number.parseInt(bits.slice(a, b = a + 3), 2)
  const typeId = Number.parseInt(bits.slice(b, a = b + 3), 2)

  dbg = bits.slice(a)
  if (typeId === 4) {
    res = parseLiteral(bits, a, length)
  } else {
    res = parseOther(bits, a, length)
  }
  return { ...res, versionSum: version + res.versionSum }
}

/**
 * @param {string} input
 * @return {TParsed}
 */
const decode = input => {
  const bits = Array.from(input.toLowerCase()).map(c => hexBits[c]).join(''), { length } = bits
  const res = parsePacket(bits, 0, length)
  // assert(res.next === length)
  return res
}

/**
 * @param {string} input
 * @param {TOptions} options
 */
const puzzle1 = (input, options) => {
  const { value, versionSum } = decode(input)
  return versionSum + ', ' + value
}

/**
 * @param {string} input
 * @param {TOptions} options
 */
const puzzle2 = (input, options) => {
  // return decode(input)
}

//  Example (demo) data.
rawInput[1] = `D2FE28`                          //  6, 2021
rawInput[1] = `38006F45291200`                  //  9, 30
rawInput[1] = `EE00D40C823060`
rawInput[1] = `8A004A801A8002F478`
rawInput[1] = `620080001611562C8802118E34`
rawInput[1] = `C0015000016115A2E0802F182340`
rawInput[1] = `A0016C880162017C3686B18A3D4780`
/* */
//  Uncomment the next line to disable demo for puzzle2 or to define different demo for it.
//  rawInput[2] = ``

module.exports = { parse, puzzles: [puzzle1, puzzle2] }

/*
 */
