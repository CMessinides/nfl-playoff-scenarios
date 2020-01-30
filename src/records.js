import { didWin, didLose, didTie } from "./games"

/**
 * @param {Partial<Record>} record
 * @returns {Record}
 */
export const Record = ({ team, wins = 0, losses = 0, ties = 0 }) => ({
  team,
  wins,
  losses,
  ties
})

/** @type {(game: import('./games').Game) => (...records: Record[]) => Record[]} */
export const updateWith = (game, ...records) => {
  return records.map(record => {
    if (didWin(game, record.team)) {
      record.wins++
    } else if (didLose(game, record.team)) {
      record.losses++
    } else if (didTie(game, record.team)) {
      record.ties++
    }

    return record
  })
}

/**
 * @param {Record} record
 * @returns {number}
 */
export const toPercentage = ({ wins, losses, ties }) =>
  (1 * wins + 0.5 * ties) / (wins + losses + ties)

/**
 * @typedef {object} Record
 * @prop {import('./teams').Team} team
 * @prop {number} wins
 * @prop {number} losses
 * @prop {number} ties
 */
