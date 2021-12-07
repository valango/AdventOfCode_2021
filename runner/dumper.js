//  /dumper.js
'use strict'

module.exports = ({ useBoth, useDemo }, print) => {
  let headingText = 'main#1 main#2 µs1 µs2', demoColumn = 5

  if (useDemo) {
    headingText = 'demo#1 demo#2 µs1 µs2', demoColumn = 1
  } else if (useBoth) headingText += ' demo#1 demo#2 µs1 µs2'

  const headings = [' day'].concat(headingText.split(' '))
  const widths = headings.map(s => s.length), limit = headings.length

  const checkRow = (row) => {
    for (let i = 0; i < headings.length; ++i) widths[i] = Math.max(widths[i], row[i].length)
  }

  const dump = (lines) => {
    const horLine = widths.map((w, i) => '-'.padEnd(w + (i ? 2 : 1), '-')).join('+') + '\n'
    print(horLine)
    print(headings.map((s, i) => s.padStart(widths[i])).join(' | ') + '\n')
    print(horLine)

    for (const line of lines) {
      for (let i = 0; i < limit; ++i) {
        print((i ? ' | ' : '') + line[i].padStart(widths[i]))
      }
      print('\n')
    }
    print('\n')
  }

  const dumpMdHeader = () => {
    print('|' + headings.join('|') + '|\n|')
    widths.forEach(() => print('---:|'))
    print('\n')
  }

  const getRow = (day) => {
    return headings.reduce((acc, txt, i) => acc.push(i ? '' : day) && acc, [])
  }

  return { checkRow, demoColumn, dump, dumpMdHeader, getRow }
}
