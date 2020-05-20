<script context="module">
  import { loadData } from "../../lib/data/loader.js"

  export async function preload(page) {
    let { year, team } = page.params

    let { teams, schedule } = await loadData(parseInt(year), this.fetch)

    return {
      team: teams.get(team),
      schedule
    }
  }
</script>

<script>
  export let team
  export let schedule
</script>

<header>
  <h1>{team.location} {team.name}</h1>
  <a href="/{schedule.year}" rel="prefetch">Back to {schedule.year}</a>
</header>
<h2>Games</h2>
<ul>
  {#each schedule.games as game}
    <li>
      <h3>
        {game.away.location} {game.away.name}
        <code>{game.awayPts}</code>
        @ {game.home.location} {game.home.name}
        <code>{game.homePts}</code>
      </h3>
      <p>{game.date}</p>
    </li>
  {/each}
</ul>
