import { didWin, didLose } from "./games"

/**
 * @param {Partial<Record>} record
 * @returns {Record}
 */
export const Record = ({ team, wins = 0, losses = 0, ties = 0 }) => ({
  team,
  wins,
  losses,
  ties,
})

/**
 * @param {Record} record
 * @returns {Record}
 */
export const addWin = (record) => ({ ...record, wins: record.wins + 1 })

/**
 * @param {Record} record
 * @returns {Record}
 */
export const addLoss = (record) => ({ ...record, losses: record.losses + 1 })

/**
 * @param {Record} record
 * @returns {Record}
 */
export const addTie = (record) => ({ ...record, ties: record.ties + 1 })

/**
 * @param {import('./games').Game} game
 * @param {Record[]} records
 * @returns {Record[]}
 */
export const updateWith = (game, ...records) => {
  return records.map((record) => {
    if (didWin(game, record.team)) {
      return addWin(record)
    } else if (didLose(game, record.team)) {
      return addLoss(record)
    } else {
      return addTie(record)
    }
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
