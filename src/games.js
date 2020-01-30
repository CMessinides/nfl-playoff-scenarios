import { identity, sample } from "lodash"

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

/** @type {(result: Result) => (game: Game) => Game} */
export const decideWith = result => game => ({ ...game, result })

/** @type {(game: Game) => Game} */
export const decideRandom = game => decide(sample(Result))(game)

/** @type {(game: Game, team: import('./teams').Team) => boolean} */
export const didParticipate = (game, team) =>
  game.home === team || game.away === team

/** @type {(game: Game, team: import('./teams').Team) => boolean} */
export const didTie = (game, team) =>
  didParticipate(game, team) && game.result === Result.TIE

/** @type {(game: Game, team: import('./teams').Team) => boolean} */
export const didWin = (game, team) =>
  (game.result === Result.HOME && game.home === team) ||
  (game.result === Result.AWAY && game.away === team)

/** @type {(game: Game, team: import('./teams').Team) => boolean} */
export const didLose = (game, team) =>
  didParticipate(game, team) && !didTie(game, team) && !didWin(game, team)

/** @type {(game: Game, team: import('./teams').Team) => false|import('./teams').Team} */
export const getOpponent = (game, team) =>
  didParticipate(game, team) && game.home === team ? game.away : game.home

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
 * @prop {string} id
 * @prop {import('./teams').Team} home
 * @prop {import('./teams').Team} away
 * @prop {Date} date
 * @prop {number} week
 * @prop {Result} [result]
 */
