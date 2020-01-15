const Winner = {
	HOME: 'HOME',
	AWAY: 'AWAY',
	TIE: 'TIE'
}
const WinnerValues = Object.values(Winner)

/**
 * @param {Array} schedule
 */
function *allPermutations(schedule) {
	const cursor = schedule.findIndex(game => game.winner === undefined)

	// If there are no more unresolved games, signal the end of the permutation
	if (cursor === -1) {
		yield schedule
		return
	}

	// Otherwise, follow all three outcomes of the next game
	for (const winner of WinnerValues) {
		yield* allPermutations([
			...schedule.slice(0, cursor),
			{
				...schedule[cursor],
				winner
			},
			...schedule.slice(cursor + 1)
		])
	}
}

export function createSimulation(seedTeams) {
	return {
		*run(schedule) {
			for (const permutation of allPermutations(schedule)) {
				yield seedTeams(permutation)
			}
		}
	}
}
