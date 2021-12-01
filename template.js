'use strict'
const THIS = 'day_'

const rawInput = []
//  The actual input
rawInput[0] = require('./data/' + THIS)
//  The 1-st example
rawInput[1] = ``
//  The 2-nd example
rawInput[2] = ``

const { assert, datasetNumber, execute } = require('./execute')

assert.beforeThrow(() => {
  console.log('--- BREAKPOINT ---') //  Yeah, sometimes I have to use this!
})
//  --- End of boilerplate ---

const parseInput = s => {
  let v = s.replace(/a/g, '0').replace(/b/g, '1')
  return Number.parseInt(v, 2)
}

const algorithm1 = () => {
  return
}

const algorithm2 = () => {
  return
}

const compute = (algorithm, dataSet = datasetNumber) => {
  let input = rawInput[dataSet].split('\n\n')

  input = input.map(v => parseInput(v)).sort((a, b) => a - b)

  return algorithm(input)
}

execute('puzzle #1', compute, algorithm1)
execute('puzzle #2', compute, algorithm2)

/*
**PROJECT TITLE:** $project_title

**DESCRIPTION:** $short_desc_here_(max_140_characters)

**SUBMITTED BY:** /u/$your_username{, $submitter2, $submitter3...}

**MEGATHREADS:** [$day1]($link1) [$day2]($link2) [$day3]($link3) [$day4]($link4) [$day5]($link5) {...}

***

**SUBMISSION:**

{$your_text_submission_here}

***

**ADDITIONAL COMMENTS:**

{$include_more_details_if_necessary}
*/
