import path from "path"
import { readFileSync } from "fs"
import { csvParse } from "d3-dsv"
import { keyBy, map, pipe } from "lodash/fp"
import { Team } from "./src/lib/teams"
import { Schedule } from "./src/lib/schedules"
import { Game, Result, decideWith } from "./src/lib/games"

let teams = null
let teamPatches = null

const ingestTeamData = pipe(
  readFileSync,
  (buffer) => buffer.toString(),
  csvParse,
  map(Team)
)

const ingestTeamPatches = pipe(
  readFileSync,
  (buffer) => buffer.toString(),
  JSON.parse
)

export function loadDataset(year) {
  if (!teams) {
    teams = ingestTeamData(path.join(__dirname, "./static/data/teams.csv"))
  }

  if (!teamPatches) {
    teamPatches = ingestTeamPatches(
      path.join(__dirname, "./static/data/patches/teams.csv.json")
    )
  }

  const relevantPatches = teamPatches.filter((patch) => patch.start <= year)
  const patchedTeams = keyBy(
    "id",
    teams.map((team) => {
      const patches = relevantPatches.filter((patch) => patch.team === team.id)
      if (patches.length) {
        return Team(Object.assign({}, team, ...map("data", patches)))
      } else {
        return team
      }
    })
  )

  const games = csvParse(
    readFileSync(
      path.join(__dirname, "./static/data/games", `${year}.csv`)
    ).toString()
  )
    .map((row) =>
      Game({
        ...row,
        home: patchedTeams[row.home],
        away: patchedTeams[row.away],
        date: new Date(row.date),
      })
    )
    .map((game) => {
      if (game.homePts > game.awayPts) {
        return decideWith(Result.HOME, game)
      } else if (game.awayPts > game.homePts) {
        return decideWith(Result.AWAY, game)
      } else {
        return decideWith(Result.TIE, game)
      }
    })

  return [patchedTeams, Schedule({ year, games })]
}
