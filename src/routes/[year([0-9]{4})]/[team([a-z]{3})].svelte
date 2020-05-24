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
  import Timeline from "../../components/Timeline.svelte"

  export let team
  export let schedule

  let week
</script>

<style>
  .layout {
    --inner-column-count: 8;
    --inner-area-max-width: 96rem;
    --outer-column-width: 50vw - var(--inner-area-max-width) / 2;
    display: grid;
    grid-template-columns:
      calc(var(--outer-column-width))
      repeat(var(--inner-column-count), 1fr)
      calc(var(--outer-column-width));
    padding: 4rem 0;
    background-color: #eee;
  }

  .layout > * {
    grid-column: 2 / -2;
    background-color: white;
  }

  header {
    padding: 4rem 32px 2rem;
  }

  h1 {
    font-size: var(--step-4);
    line-height: calc(2ex + 4px);
    font-weight: 300;
  }
</style>

<div class="layout">
  <header>
    <h1>Can the {team.location} {team.name} make the playoffs?</h1>
  </header>
  <section class="games">
    <Timeline bind:week />
    <div class="game-strip" />
  </section>
</div>
