<script>
  import { ALL_YEARS as years } from "../lib/schedules.js"
</script>

<h1>Rewind the Tape</h1>

<h2>Seasons</h2>

<ul>
  {#each years as year}
    <li>
      <a href="/{year}" rel="prefetch">{year}</a>
    </li>
  {/each}
</ul>
