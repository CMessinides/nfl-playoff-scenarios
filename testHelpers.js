import path from "path"
import { readFileSync } from "fs"
import { csvParse } from "d3-dsv"
import { keyBy, map, pipe } from "lodash/fp"
import { Team } from "./src/teams"
import { Schedule } from "./src/schedules"
import { HomeWin, AwayWin, Tie } from "./src/games"

let teams = null
let teamPatches = null

const ingestTeamData = pipe(
  readFileSync,
  buffer => buffer.toString(),
  csvParse,
  map(Team)
)

const ingestTeamPatches = pipe(
  readFileSync,
  buffer => buffer.toString(),
  JSON.parse
)

export function loadDataset(year) {
  if (!teams) {
    teams = ingestTeamData(path.join(__dirname, "./public/data/teams.csv"))
  }

  if (!teamPatches) {
    teamPatches = ingestTeamPatches(
      path.join(__dirname, "./public/data/patches/teams.csv.json")
    )
  }

  const relevantPatches = teamPatches.filter(patch => patch.start <= year)
  const patchedTeams = keyBy(
    "id",
    teams.map(team => {
      const patches = relevantPatches.filter(patch => patch.team === team.id)
      if (patches.length) {
        return Team(Object.assign({}, team, ...map("data", patches)))
      } else {
        return team
      }
    })
  )

  const games = csvParse(
    readFileSync(
      path.join(__dirname, "./public/data/games", `${year}.csv`)
    ).toString()
  )
    .map(row => ({
      ...row,
      home: patchedTeams[row.home],
      away: patchedTeams[row.away],
      date: new Date(row.date)
    }))
    .map(row => {
      if (row.homePts > row.awayPts) {
        return HomeWin(row)
      } else if (row.awayPts > row.homePts) {
        return AwayWin(row)
      } else {
        return Tie(row)
      }
    })

  return [patchedTeams, Schedule({ year, games })]
}
