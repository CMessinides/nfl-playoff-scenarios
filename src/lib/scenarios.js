/**
 * @param {Partial<Scenario>} scenario
 * @returns {Scenario}
 */
export const Scenario = ({ seeded = [], remaining = [] }) => ({
  seeded,
  remaining,
})

/**
 * @typedef Scenario
 * @prop {import('./records').Record} seeded
 * @prop {import('./records').Record} remaining
 */
