//  /runner/dumper.js
'use strict'

module.exports = ({ useBoth, useDemo }, print) => {
  let demoColumn = 5, headings, lastColumn, widths, hasNotes = false

  const prepare = (records) => {
    let headingText = 'main#1 main#2 µs1 µs2'

    if (useDemo) {
      headingText = 'demo#1 demo#2 µs1 µs2', demoColumn = 1
    } else if (useBoth) headingText += ' demo#1 demo#2 µs1 µs2'

    if ((hasNotes = records.some(({ comment }) => Boolean(comment)))) headingText += ' notes'

    headings = [' day'].concat(headingText.split(' '))
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
        const row = headings.reduce((acc, txt, i) => acc.push(i ? '' : record.day) && acc, [])
        let res, r

        if ((res = record['main'])) {
          if ((r = res['1'])) row[1] = r.value + '', row[3] = r.time + ''
          if ((r = res['2'])) row[2] = r.value + '', row[4] = r.time + ''
        }
        if ((res = record['demo'])) {
          if ((r = res['1'])) row[demoColumn] = r.value + '', row[demoColumn + 2] = r.time + ''
          if ((r = res['2'])) row[demoColumn + 1] = r.value + '', row[demoColumn + 3] = r.time + ''
        }
        if (record.comment) {
          row[demoColumn + 4] = record.comment
        }
        rows.push(row)
      }
      makeMd ? dumpMd(rows) : dumpTable(rows)
    }

    print('\n')
  }

  return dump
}
