<script context="module">
  import { loadData } from "../../lib/data/loader.js"

  export async function preload(page) {
    let { year } = page.params

    return loadData(parseInt(year), this.fetch)
  }
</script>

<script>
  export let teams
  export let schedule
</script>

<h1>{schedule.year}</h1>

<a href="/" rel="prefetch">Back to home</a>

<ul>
  {#each Array.from(teams.values()) as team}
    <li>
      <a href="/{schedule.year}/{team.id}" rel="prefetch">
        {team.location} {team.name}
      </a>
    </li>
  {/each}
</ul>
