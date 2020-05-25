<script>
  import TimelineSlider from "./TimelineSlider.svelte"
  import { MIN_WEEK, MAX_WEEK } from "../lib/games.js"
  import ChevronLeft from "./icons/ChevronLeft.js"
  import ChevronRight from "./icons/ChevronRight.js"

  export let week
</script>

<style>
  h2,
  .toggles {
    padding: 8px 32px;
  }

  h2 {
    font-weight: 300;
    font-size: var(--step-2);
  }

  h2 strong {
    font-weight: 700;
    color: red;
  }

  .toggles {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .toggles button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 4px 8px;
    color: inherit;
    background: none;
    border: 1px #eee solid;
    border-radius: 4px;
    transition: 120ms background-color linear;
    cursor: pointer;
    display: flex;
    font-size: 0.875rem;
    align-items: center;
    line-height: 1;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .toggles button:first-child {
    padding-right: 16px;
  }

  .toggles button:last-child {
    padding-left: 16px;
  }

  .toggles button:disabled {
    color: #999;
  }

  .toggles button:not(:disabled):hover,
  .toggles button:not(:disabled):focus {
    background-color: #eee;
  }

  .toggles button :global(svg) {
    display: block;
  }
</style>

<div class="wrapper">
  <h2>
    Rewind the Tape to
    <strong>Week {$week}</strong>
  </h2>
  <div class="toggles">
    <button
      type="button"
      on:click={week.decrement}
      disabled={$week === MIN_WEEK}
      aria-label="Previous week">
      {@html ChevronLeft()}
      Previous
    </button>
    <button
      type="button"
      on:click={week.increment}
      disabled={$week === MAX_WEEK}
      aria-label="Next week">
      Next
      {@html ChevronRight()}
    </button>
  </div>
  <TimelineSlider {week} />
</div>
