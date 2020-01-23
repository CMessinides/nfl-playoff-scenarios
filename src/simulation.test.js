import { Simulation } from "./simulation"
import { HomeWin, Game, Result } from "./games"

describe("all", () => {
  it("should return all possible seeding scenarios for the given schedule", () => {
    const simulation = Simulation(simpleSeed)

    for (const [schedule, scenarios] of testCases) {
      expect(Array.from(simulation.all(schedule))).toEqual(scenarios)
    }
  })
})

describe("sample", () => {
  it("should return a possible seeding scenario for the given schedule", () => {
    const simulation = Simulation(simpleSeed)

    for (const [schedule, scenarios] of testCases) {
      expect(scenarios).toContainEqual(simulation.sample(schedule))
    }
  })
})

// Our seeding procedure will be dead simple - the team with more wins
// has the higher seed. Ties are resolved by sorting by team name.
function simpleSeed(schedule) {
  const wins = { A: 0, B: 0, C: 0 }

  for (const { home, away, result } of schedule) {
    switch (result) {
      case Result.HOME:
        wins[home]++
        break
      case Result.AWAY:
        wins[away]++
        break
      case Result.TIE:
        wins[home] += 0.5
        wins[away] += 0.5
        break
      default:
        throw new Error(
          `"${result}" is not a valid result value -- it must be one of: ${Object.values(
            Result
          ).join(", ")}.`
        )
    }
  }

  return Object.keys(wins)
    .sort()
    .sort((t1, t2) => wins[t2] - wins[t1])
}

const testCases = [
  [
    [
      HomeWin(Game({ home: "A", away: "C" })),
      HomeWin(Game({ home: "B", away: "A" })),
      Game({ home: "C", away: "B" })
    ],
    [
      ["A", "B", "C"], // Home win in last game
      ["B", "A", "C"], // Away win in last game
      ["B", "A", "C"] // Tie in last game
    ]
  ]
]
