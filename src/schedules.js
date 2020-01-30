import uniq from "lodash/uniq"
import intersection from "lodash/intersection"
import { didParticipate, getOpponent } from "./games"

/**
 * @param {Partial<Schedule>} schedule
 * @returns {Schedule}
 */
export const Schedule = ({ year, games = [] }) => ({ year, games })

/**
 * @param {Schedule} schedule
 */
export const ScheduleFilters = ({ games }) => {
  /** @type {ScheduleFilter} */
  function headToHeadGames(...teams) {
    return games.filter(
      game => teams.includes(game.home) && teams.includes(game.away)
    )
  }

  /** @type {ScheduleFilter} */
  function commonGames(...teams) {
    if (teams.length < 2) return []

    const commonOpponents = intersection(
      ...teams.map(team =>
        uniq(
          games
            .filter(game => didParticipate(game, team))
            .map(game => getOpponent(game, team))
        )
      )
    )

    return allGames(...teams).filter(game =>
      commonOpponents.some(didParticipate(game))
    )
  }

  /** @type {ScheduleFilter} */
  function conferenceGames(...teams) {
    return allGames(...teams).filter(
      game => game.home.conference === game.away.conference
    )
  }

  /** @type {ScheduleFilter} */
  function divisionGames(...teams) {
    return conferenceGames(...teams).filter(
      game => game.home.division === game.away.division
    )
  }

  /** @type {ScheduleFilter} */
  function allGames(...teams) {
    return games.filter(game => teams.some(didParticipate(game)))
  }

  return {
    headToHeadGames,
    commonGames,
    conferenceGames,
    divisionGames,
    allGames
  }
}

/**
 * @typedef {object} Schedule
 * @prop {number} year
 * @prop {import('./games').Game[]} games
 */

/**
 * @typedef {(...teams: import('./teams').Team[]) => import('./games').Game[]} ScheduleFilter
 */
