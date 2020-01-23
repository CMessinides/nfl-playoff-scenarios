import { identity } from "lodash"

/** @enum {string} */
export const Result = {
  HOME: "HOME",
  AWAY: "AWAY",
  TIE: "TIE"
}

/**
 * @param {Game} game
 * @returns {Game}
 */
export const Game = game => identity(game)

/** @type {(game: Game) => boolean} */
export const isUndecided = game => game.result === undefined

/** @type {(game: Game) => Game} */
export const HomeWin = game => ({ ...game, result: Result.HOME })

/** @type {(game: Game) => Game} */
export const AwayWin = game => ({ ...game, result: Result.AWAY })

/** @type {(game: Game) => Game} */
export const Tie = game => ({ ...game, result: Result.TIE })

export const Outcomes = [HomeWin, AwayWin, Tie]

/** @type {(game: Game) => Game} */
export const RandomOutcome = game => {
  const Outcome = Outcomes[Math.floor(Math.random() * Outcomes.length)]
  return Outcome(game)
}

/**
 * @typedef {object} Game
 * @prop {import('./teams').Team} home
 * @prop {import('./teams').Team} away
 * @prop {Date} date
 * @prop {number} week
 * @prop {Result} [result]
 */
