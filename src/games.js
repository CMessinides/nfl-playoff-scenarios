import { identity, sample, curry } from "lodash"

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
export const Game = (game = {}) => identity(game)

/** @type {(game: Game) => boolean} */
export const isUndecided = game => game.result === undefined

/** @type {(result: Result, game: Game) => Game} */
export const decideWith = (result, game) => ({ ...game, result })

/** @type {(game: Game) => Game} */
export const decideRandom = game => decideWith(sample(Result), game)

export const didParticipate = curry(
  /** @type {(game: Game, team: import('./teams').Team) => boolean} */
  (game, team) => game.home === team || game.away === team
)

export const didTie = curry(
  /** @type {(game: Game, team: import('./teams').Team) => boolean} */
  (game, team) => didParticipate(game, team) && game.result === Result.TIE
)

export const didWin = curry(
  /** @type {(game: Game, team: import('./teams').Team) => boolean} */
  (game, team) =>
    (game.result === Result.HOME && game.home === team) ||
    (game.result === Result.AWAY && game.away === team)
)

export const didLose = curry(
  /** @type {(game: Game, team: import('./teams').Team) => boolean} */
  (game, team) =>
    didParticipate(game, team) && !didTie(game, team) && !didWin(game, team)
)

export const getOpponent = curry(
  /** @type {(game: Game, team: import('./teams').Team) => false|import('./teams').Team} */
  (game, team) =>
    didParticipate(game, team) && game.home === team ? game.away : game.home
)

/**
 * @typedef {object} Game
 * @prop {string} id
 * @prop {import('./teams').Team} home
 * @prop {import('./teams').Team} away
 * @prop {Date} date
 * @prop {number} week
 * @prop {Result} [result]
 */
