//  core/dumper.js
'use strict'

module.exports = ({ useBoth, useDemo }, print) => {
  const showDemo = useBoth || useDemo, showMain = !useDemo, headings = [' day']
  let lastColumn, widths, hasNotes = false, cc = 1, drc = 1, dtc = 3, mtc = 3

  const prepare = (records) => {
    if (showMain) {
      headings.push('Main1') && headings.push('Main2')
      cc += 4, drc = 3, dtc = 7
    }
    if (showDemo) {
      headings.push('Demo1') && headings.push('Demo2')
      cc += 4, mtc = 5
    }
    if (showMain) headings.push('M1_µs') && headings.push('M2_µs')
    if (showDemo) headings.push('D1_µs') && headings.push('D2_µs')

    if ((hasNotes = records.some(({ comment }) => Boolean(comment)))) headings.push('Notes')

    widths = headings.map(s => s.length), lastColumn = headings.length - 1
  }

  const checkRow = (row) => {
    for (let i = 0; i <= lastColumn; ++i) widths[i] = Math.max(widths[i], row[i].length)
  }

  const toJSON = (record) => {
    record = JSON.stringify(record)
    record = record.replaceAll('{', '{ ')
    record = record.replaceAll('}', ' }')
    record = record.replaceAll(',"', ', "')
    record = record.replaceAll('":', '": ')
    return record
  }

  const dumpMd = (rows) => {
    print('|' + headings.join('|') + '|\n|')
    widths.forEach((w, i) => print((hasNotes && i === lastColumn) ? ':---|' : '---:|'))
    print('\n')

    for (const row of rows) {
      print('|' + row.join('|') + '|\n')
    }
  }

  const dumpTable = (rows) => {
    rows.forEach(checkRow)

    const horLine = widths.map((w, i) => '-'.padEnd(w + (i ? 2 : 1), '-')).join('+') + '\n'
    print(horLine)
    print(headings.map((s, i) => (hasNotes && i === lastColumn)
      ? s : s.padStart(widths[i])).join(' | ') + '\n')
    print(horLine)

    for (const row of rows) {
      for (let i = 0; i <= lastColumn; ++i) {
        print((i ? ' | ' : '') + ((hasNotes && i === lastColumn)
          ? row[i] : row[i].padStart(widths[i])))
      }
      print('\n')
    }
  }

  const dump = (records, { makeJSON, makeMd }) => {
    const { length } = records

    if (length === 1 && !makeJSON && !makeMd) makeJSON = true

    if (makeJSON) {
      for (let n = 0; n < length;) {
        print(toJSON(records[n++]) + (n < length ? ',\n' : '\n'))
      }
    } else {
      const rows = []

      prepare(records)

      for (const record of records) {
        const row = headings.reduce((acc, txt, i) => acc.push(i ? ' ' : record.day) && acc, [])
        let res, r

        if (showMain && (res = record['main'])) {
          if ((r = res['1'])) row[1] = r.value + '', row[mtc] = r.time + ''
          if ((r = res['2'])) row[2] = r.value + '', row[mtc + 1] = r.time + ''
        }
        if (showDemo && (res = record['demo'])) {
          if ((r = res['1'])) row[drc] = r.value + '', row[dtc] = r.time + ''
          if ((r = res['2'])) row[drc + 1] = r.value + '', row[dtc + 1] = r.time + ''
        }
        if (record.comment) {
          row[cc] = record.comment
        }
        rows.push(row)
      }
      makeMd ? dumpMd(rows) : dumpTable(rows)
    }

    print('\n')
  }

  return dump
}
