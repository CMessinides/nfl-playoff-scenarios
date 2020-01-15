import { createSimulation } from './simulation'

it('should return all possible seeding scenarios for the given schedule', () => {
	const simulation = createSimulation(simpleSeed)

	for (const [schedule, scenarios] of testCases) {
		expect(Array.from(simulation.run(schedule))).toEqual(scenarios)
	}
})

// Our seeding procedure will be dead simple - the team with more wins
// has the higher seed. Ties are resolved by sorting by team name.
function simpleSeed(schedule) {
	const wins = { A: 0, B: 0, C: 0 }

	for (const { home, away, winner } of schedule) {
		switch (winner) {
			case 'HOME':
				wins[home]++
				break;
			case 'AWAY':
				wins[away]++
				break;
			case 'TIE':
				wins[home] += 0.5
				wins[away] += 0.5
				break;
			default:
				throw new Error(winner + ' is not a valid winner value -- it must be one of HOME, AWAY, or TIE.')
		}
	}

	return Object
		.keys(wins)
		.sort()
		.sort((t1, t2) => wins[t2] - wins[t1])
}

const testCases = [
	[
		[
			{ home: 'A', away: 'C', winner: 'HOME' },
			{ home: 'B', away: 'A', winner: 'HOME' },
			{ home: 'C', away: 'B' },
		],
		[
			['A', 'B', 'C'], // HOME in last game
			['B', 'A', 'C'], // AWAY in last game
			['B', 'A', 'C'] // TIE in last game
		]
	]
]
