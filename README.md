# Advent Of Code '2021

My [adventofcode.com](https://adventofcode.com) adventures.<br />
Older ones: [2020](https://github.com/valango/adventOfCode),
[2015](https://github.com/valango/AdventOfCode_2015).

## Diary

* `day 01:` Joined the races, with just 16 hrs of delay 🐌🐌🐌
* `day 02:` So far, its all trivial. Joined by afternoon 🐌, actual time 23min.
* `day 03:` Actually simple stuff, but it really took some focussing (101min).
* `day 04:` A nice one. Some time was lost for misreading the input format.
* `day 05:` Simple, but... man, I hate numbers - I just can't _see_ them!.
* `day 06:` Now, this was a good lesson - I lost at least 30mins implementing
  _an illustration of example_, rather than the actual logic of the process. 🤬
* `day 07:` This seemingly trivial puzzle left me clueless - I just could not 👁👁 visualize the
  problem!<br>Only when I figured out it is like finding a balance point for a bar with suspended
  weights⚖️, everything became clear, finally.
* `day 08:` Wasted too much time working on description details. Succeeded debugging of code #2 only
  after using simplified datasets.
* `day 09:` Made _a lot_ of mistakes. 🤡
* `day 10:` A recipe for immediate failure: _"Oh, I know how to do that!"_.
* `day 11:` Simulations are fun! Some code from day09 was reusable today.
* `day 12:` Seemingly simple 🤓.
* `day 13:` That was fun!
* `day 14:` Damn, I was barely able to steal some time for AOC today! The puzzle was fun,
simple simulation resulted in 💥 explosion on part 2 and the correct solution was of less code
  than the initial part 1 😎!
* `day 15:` This was a clever one - at first, I fell into trap of best-route-search 💀;
  the working solution was to just flood the whole field with cumulative risk values.
  I bet the algorithm can still be improved.
* `day 16:` That was fun!
* `day 17:` Part #2 still pending...
* `day 18:` Lost insane amount of time because of stupid mistake: the puzzle hung up, so I
was sure it is because of complexity, but the real reason was I had chosen a wrong way
  for data preparation, so the actual puzzle did not even start... doh.
* `day 19:` This was horrible - I am so hopelessly bad with spatial algebra.

## Track record

My ranking placements and final times for puzzle 1 and 2 by days.<br >
**Others** is number of solvers of both puzzles and **Just 1** of those who had solved only the
first one, taken from
[global stats](https://adventofcode.com/2021/stats) when I completed.

| day | Rank 1 | Time 1 | Rank 2 | Time 2 | Others | Just 1|
| ---: | ---: | :---: | ---: | :---: |---: |---: |
| 1 | 87733 | 16:09:30 | 77832 | 16:26:49 |127445|14909|
| 2 | 58863 | 08:21:25 | 55421 | 08:26:51 |106584|4125|
| 3 | 8808 | 00:25:36 | 10369 | 01:41:35 |45825|23066|
| 4 | 4087 | 00:41:37 | 4896 | 01:06:05 |6191|1630|
| 5 | 8539 | 01:18:17 | 7974 | 01:44:41 |8093|1972|
| 6 | 8567 |00:30:44 | 7349 | 01:06:45 |7484|4379|
| 7 | 16732 | 01:54:24 | 15841 | 02:05:48 |15930|1773|
| 8 | 9645 | 00:41:25 | 17577 | 07:04:10 |15930|1773|
| 9 | 9219 | 00:51:40 | 8295 | 01:55:16 |8308|5105|
| 10 | 9915 | 01:12:20  | 10966 | 02:00:54 |10982|1716|
| 11 | 6808 | 01:22:26  | 6819 | 01:30:05 |6882|331|
| 12 | 8918 | 02:55:40  | 8762 | 03:45:21 |8771|1601|
| 13 | 8031 | 01:28:30  | 4321 | 01:35:31 |7324|1034|
| 14 | 11437 | 02:07:05  | 16267 | 08:17:38 |18245|9021|
| 15 | 11538 | 04:58:08  | 9372 | 06:00:22 |9388|3618|
| 16 | 6503 | 03:47:12  | 6251 | 04:41:06 |6270|1290|
| 17 | 13740 |  07:57:44 |   |  | | |
| 18 | 8060 | 11:51:28  | 11314 | 17:57:49 |11326|281|

![](quote.png)

## Code

The project codebase consists of daily puzzle files named like `day01.js`, universal runner code and
module tests for runner code.

### Performance report

The following report was generated using command `./run abm`.

| day|Main1|Main2|Demo1|Demo2|M1_µs|M2_µs|D1_µs|D2_µs|
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
|01|1759|1805|7|5|92|252|76|51|
|02|2073315|1840311528|150|900|1074|408|68|81|
|03|3309596|2981085|198|230|698|2872|120|962|
|04|82440|20774|4512|1924|318|51360|172|61|
|05|98486|163135|5|12|90402|62993|239|81|
|06|362346|1639643057051|5934|26984457539|19083|263|3021|348|
|07|345035|97038163|37|168|3100|4398|125|87|
|08|344|1048410|26|61229|106|457651|140|36204|
|09|417|1148965|15|1134|6902|14368|248|5247|
|10|341823|2801302861|26397|288957|4142|18103|222|576|
|11|1719|232|1656|195|1245|629|4499|558|
|12|4167|98441|10|36|9184|216149|357|277|
|13|827|EAHKRECP|17|O|2800|7831|455|1658|
|14|2988|3572761917024|1588|2188189693529|306|2730|374|328|
|15|613|2899|40|315|30914|1553300|1044|10114|
|16|923|258888628940|6,9,14,16,12,23,31|3,54,7,9,1,0,0,1|588|475|630|95|
|17|
|18|4469|4770|4140|3993|15882|393053|8026|9140|
|19|332|8507|79|3621|2230650|215|141873|224|

### Usage

After installing with npm or yarn, just type `./run` and the puzzles from the most recent puzzle
file will be executed.

The following command line parameters apply:

* integer - day number(s), (default: most recent day only);
* a: all days;
* b: both datasets (default: main data only);
* d: example data only (mutually exclusive with 'b' option;
* h: print help information and terminate;
* j: generate output as JSON-formatted rows;
* m: generate markdown output (default: text table for multiple, JSON for single puzzle).

If neither 'b' nor 'd' is present, only the main dataset is used. If 'd' is present, and demo data
is not defined, it falls back to main dataset.

### Coding

To start with a new puzzle for, say, _day 14_, do:
1. copy the contents of [template.js](./template.js) to `day14.js`;
1. create `day14.txt` in `./data` directory and populate it with data from the website;
1. have fun!

It is recommended to copy the puzzle data into a text file in `data` folder.

### Debugging

**To trap failed assertions** when debugging, set a breakpoint to
[runner/index.js](./runner/index.js) line #20.
