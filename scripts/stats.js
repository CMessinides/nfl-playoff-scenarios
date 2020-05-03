const { readdirSync, readFile: _readFile } = require("fs")
const { promisify } = require("util")
const { csvParse } = require("d3-dsv")

const readFile = promisify(_readFile)

const DIVIDER = "-".repeat(Math.min(80, process.stdout.columns))

;(async function () {
  const filenames = readdirSync("public/data/games")

  const files = await Promise.all(
    filenames.map((filename) => readFile("public/data/games/" + filename))
  )

  const games = []
  for (const file of files) {
    const rows = csvParse(file.toString())
    games.push(...rows)
  }

  function prop(predicate) {
    return games.filter(predicate).length / games.length
  }

  const proportionTied = prop((game) => game.homePts === game.awayPts)
  const propotionHomeWin = prop((game) => game.homePts > game.awayPts)
  const propotionAwayWin = prop((game) => game.homePts < game.awayPts)

  console.log(DIVIDER)
  console.log("STATS")
  console.log(DIVIDER)
  console.log(`Prop. Tie:\t ${proportionTied.toFixed(3)}`)
  console.log(`Prop. Home Win:\t ${propotionHomeWin.toFixed(3)}`)
  console.log(`Prop. Away Win:\t ${propotionAwayWin.toFixed(3)}`)
  console.log(DIVIDER)
})()
