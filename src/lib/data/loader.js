import { ALL_YEARS } from "../schedules"
import { csvParse } from "d3-dsv"

/** @type {DataCache} */
let cache = {
  teams: null,
  patches: null,
  schedules: new Map(ALL_YEARS.map((year) => [year, null])),
}

/**
 * @param {number} year
 * @param {Window['fetch']} fetch
 * @returns {DataMaps}
 */
export async function loadData(year, fetch) {
  /** @type {Promise<any>[]} */
  let fetches = []

  if (cache.teams === null) {
    fetches.push(loadTeams(fetch))
  }

  if (cache.patches === null) {
    fetches.push(loadPatches(fetch))
  }

  if (cache.schedules.get(year) === null) {
    fetches.push(loadSchedule(year, fetch))
  }

  if (fetches.length) {
    await Promise.all(fetches)
  }

  let teams = patchTeams(cache.teams, cache.patches, year)
  let schedule = joinTeams(cache.schedules.get(year), teams)

  return {
    teams,
    schedule,
  }
}

/**
 * @param {Window['fetch']} fetch
 * @returns {Promise<TeamMap>}
 */
async function loadTeams(fetch) {
  let rows = await loadCsv("/data/teams.csv", fetch)

  cache.teams = new Map(rows.map((row) => [row.id, row]))

  return cache.teams
}

/**
 * @param {Window['fetch']} fetch
 * @returns {Promise<PatchSet>}
 */
async function loadPatches(fetch) {
  let res = await fetch("/data/patches/teams.csv.json")
  let json = await res.json()

  cache.patches = new Set(json)

  return cache.patches
}

/**
 * @param {number} year
 * @param {Window['fetch']} fetch
 * @returns {Promise<ScheduleWithReferences>}
 */
async function loadSchedule(year, fetch) {
  let rows = await loadCsv(`/data/games/${year}.csv`, fetch)

  let schedule = {
    year,
    games: rows.map((row) => ({ ...row, date: new Date(row.date) })),
  }

  cache.schedules.set(year, schedule)

  return schedule
}

/**
 * @param {string} url
 * @param {Window['fetch']} fetch
 */
async function loadCsv(url, fetch) {
  let res = await fetch(url)
  let body = await res.text()
  return csvParse(body)
}

/**
 * @param {TeamMap} teams
 * @param {PatchSet} patches
 * @param {number} year
 * @returns {TeamMap}
 */
function patchTeams(teams, patches, year) {
  let patchedTeams = new Map(teams)

  for (const { start, team, data } of patches) {
    if (start > year) continue

    patchedTeams.set(team, {
      ...patchedTeams.get(team),
      ...data,
    })
  }

  return patchedTeams
}

/**
 * @param {ScheduleWithReferences} schedule
 * @param {TeamMap} teams
 * @returns {Schedule}
 */
function joinTeams(schedule, teams) {
  return {
    ...schedule,
    games: schedule.games.map((game) => ({
      ...game,
      home: teams.get(game.home),
      away: teams.get(game.away),
    })),
  }
}

/**
 * @typedef {object} DataMaps
 * @prop {TeamMap} teams
 * @prop {Schedule} schedule
 */

/**
 * @typedef {object} DataCache
 * @prop {TeamMap} teams
 * @prop {PatchSet} patches
 * @prop {ScheduleMap} schedules
 */

/**
 * @typedef {Map<string, import('../teams').Team>} TeamMap
 */

/**
 * @typedef {object} Patch
 * @prop {number} start
 * @prop {string} team
 * @prop {Partial<import('../teams').Team>} data
 */

/**
 * @typedef {Set<Patch>} PatchSet
 */

/**
 * @typedef {Map<number, ScheduleWithReferences>} ScheduleMap
 */

/**
 * @typedef {import('../schedules').Schedule} Schedule
 */

/**
 * @typedef {{ [K in keyof Schedule]: Schedule[K] extends Game[] ? GameWithReferences[] : Schedule[K] }} ScheduleWithReferences
 */

/**
 * @typedef {import('../games').Game} Game
 */

/**
 * @typedef {{ [K in keyof Game]: Game[K] extends import('../teams').Team ? string : Game[K] }} GameWithReferences
 */
