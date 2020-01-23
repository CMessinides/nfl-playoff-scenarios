//@ts-check
import { Outcomes, RandomOutcome, isUndecided } from "./games"

/**
 * @param {Schedule} schedule
 * @returns {Generator<Schedule, void>}
 */
function* allPermutations(schedule) {
  const cursor = schedule.findIndex(isUndecided)

  // If there are no more undecided games, return the permutation
  if (cursor === -1) {
    yield schedule
    return
  }

  // Otherwise, follow all three outcomes of the next game
  for (const Outcome of Outcomes) {
    yield* allPermutations(advanceOneGame(schedule, cursor, Outcome))
  }
}

/**
 * @type {(schedule: Schedule) => Schedule}
 */
function onePermutation(schedule) {
  const cursor = schedule.findIndex(isUndecided)

  // If there are no more undecided games, return the permutation
  if (cursor === -1) return schedule

  return onePermutation(advanceOneGame(schedule, cursor, RandomOutcome))
}

/**
 * @param {Schedule} schedule
 * @param {number} cursor
 * @param {(game: import('./games').Game) => game} Outcome
 * @returns {Schedule}
 */
function advanceOneGame(schedule, cursor, Outcome) {
  return [
    ...schedule.slice(0, cursor),
    Outcome(schedule[cursor]),
    ...schedule.slice(cursor + 1)
  ]
}

/**
 * @param {SeedingProcedure} seedingFn
 */
export function Simulation(seedingFn) {
  return {
    /**
     * @param {Schedule} schedule
     */
    *all(schedule) {
      for (const permutation of allPermutations(schedule)) {
        yield seedingFn(permutation)
      }
    },
    /**
     * @param {Schedule} schedule
     */
    sample(schedule) {
      return seedingFn(onePermutation(schedule))
    }
  }
}

/** @typedef {import('./games').Game[]} Schedule */
/** @typedef {import('./teams').Team['id'][]} SeedingScenario */
/** @typedef {(schedule: Schedule) => SeedingScenario} SeedingProcedure */
