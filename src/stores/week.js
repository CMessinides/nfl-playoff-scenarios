import { writable } from "svelte/store"
import { MAX_WEEK, MIN_WEEK } from "../lib/games"

export function createWeekStore() {
  let week = writable(MAX_WEEK)

  week.decrement = function () {
    week.update((w) => (w > MIN_WEEK ? w - 1 : w))
  }

  week.increment = function () {
    week.update((w) => (w < MAX_WEEK ? w + 1 : w))
  }

  return week
}

let week = writable(MAX_WEEK)

week.decrement = function () {
  week.update((w) => (w > MIN_WEEK ? w - 1 : w))
}

week.increment = function () {
  week.update((w) => (w < MAX_WEEK ? w + 1 : w))
}

export default week
