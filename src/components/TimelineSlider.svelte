<script>
  import { fade } from "svelte/transition"
  import { tweened, spring } from "svelte/motion"
  import { cubicOut } from "svelte/easing"
  import { MAX_WEEK, MIN_WEEK, ALL_WEEKS } from "../lib/games.js"

  let currentWeek
  export { currentWeek as week }

  // Basic dimensions
  const height = 68
  let width = 0
  const marginTop = 20

  // Dimensions for the ticks area
  const ticksHeight = height - marginTop
  const tickInterval = 100
  const ticksWidth = (MAX_WEEK - 1) * tickInterval

  // Controls the horizontal offset of the ticks as the user
  // scrubs through the timeline
  let ticksX = spring(-1 * ticksWidth, {
    stiffness: 0.05,
    damping: 0.4
  })

  let closestTick = MAX_WEEK - 1

  // Calculate the closest tick as the user scrubs through
  $: {
    if ($ticksX > 0) {
      closestTick = MIN_WEEK - 1
    } else if ($ticksX < -ticksWidth) {
      closestTick = MAX_WEEK - 1
    } else {
      closestTick = Math.round(Math.abs($ticksX) / tickInterval)
    }
  }

  $: closestWeek = closestTick + 1

  // Sync the ticks position with the week if an external
  // source updates the week
  $: {
    ticksX.set(($currentWeek - 1) * -tickInterval)
  }

  let isScrubbing = false

  // Dimensions and other properties for the slider's cursor
  // while at rest (i.e. not scrubbing)
  const cursorInit = {
    top: marginTop,
    pillWidth: 10,
    pillHeight: 10,
    fontSize: 0,
    fontOpacity: 0
  }

  let cursor = tweened(cursorInit, {
    duration: 300,
    delay: 50,
    easing: cubicOut
  })

  // When the user scrubs, expand the cursor
  $: {
    if (isScrubbing) {
      cursor.set({
        top: 10,
        pillWidth: 80,
        pillHeight: 20,
        fontSize: 14,
        fontOpacity: 1
      })
    } else {
      cursor.set(cursorInit)
    }
  }

  // Handle user events to start, update, and stop scrubbing
  let prevScrubX

  function startScrubbing(e) {
    isScrubbing = true
    prevScrubX = e.clientX
  }

  function scrub(e) {
    if (isScrubbing) {
      let delta = e.clientX - prevScrubX

      ticksX.update(t => clamp(-ticksWidth - 120, t + delta, 120))
      prevScrubX = e.clientX
    }
  }

  function stopScrubbing() {
    if (isScrubbing) {
      isScrubbing = false

      if ($ticksX > 0) {
        // Overshot to the left
        ticksX.set(0)
      } else if ($ticksX < -ticksWidth) {
        // Overshot to the right
        ticksX.set(-ticksWidth)
      } else {
        ticksX.set(closestTick * -tickInterval)
      }

      $currentWeek = closestWeek
    }
  }

  // Utilities
  function clamp(min, value, max) {
    return Math.max(min, Math.min(value, max))
  }
</script>

<style>
  .wrapper {
    overflow: hidden;
    width: 100%;
  }

  .slider {
    display: block;
    max-width: 100%;
  }

  .ticks {
    cursor: grab;
  }

  .ticks.is-scrubbing {
    cursor: grabbing;
  }

  .label {
    font-size: 10px;
    user-select: none;
  }

  .cursor,
  .fade {
    pointer-events: none;
  }

  .cursor text {
    user-select: none;
    font-weight: 700;
    letter-spacing: 0.025em;
    text-transform: uppercase;
    fill: white;
    stroke-width: 0;
  }
</style>

<svelte:window
  on:mousemove={scrub}
  on:mouseup={stopScrubbing}
  on:touchmove={e => scrub(e.touches[0])}
  on:touchend={stopScrubbing} />

<div class="wrapper" bind:clientWidth={width}>
  <svg class="slider" {height} {width} aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="fade-to-white-left">
        <stop offset="10%" stop-color="white" />
        <stop offset="100%" stop-color="white" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="fade-to-white-right">
        <stop offset="0%" stop-color="white" stop-opacity="0" />
        <stop offset="90%" stop-color="white" />
      </linearGradient>
    </defs>
    <g
      class="ticks"
      class:is-scrubbing={isScrubbing}
      transform="translate({$ticksX + width / 2}
      {marginTop})"
      on:mousedown|preventDefault={startScrubbing}
      on:touchstart|passive={e => startScrubbing(e.touches[0])}>
      <!-- Full-area background rect for capturing pointer events -->
      <rect
        x="0"
        y="0"
        height={ticksHeight}
        width={ticksWidth}
        fill-opacity="0" />
      {#each ALL_WEEKS as week}
        <g class="week" transform="translate({(week - 1) * tickInterval} 0)">
          {#if week !== $currentWeek}
            <text
              class="label"
              x="0"
              y="-4"
              text-anchor="middle"
              fill="gray"
              stroke-width="0"
              transition:fade={{ duration: 300 }}>
              {week}
            </text>
          {/if}
          <line
            class="tick major"
            x1="0"
            x2="0"
            y1="6"
            y2={ticksHeight - 12}
            stroke="gray"
            stroke-width="2" />
          {#if week !== MAX_WEEK}
            {#each [1, 2, 3, 4, 5] as tick}
              <line
                class="tick minor"
                y1="20"
                y2={ticksHeight - 20}
                x1={(tick * tickInterval) / 6}
                x2={(tick * tickInterval) / 6}
                stroke="gray"
                stroke-opacity="0.5"
                stroke-width="1" />
            {/each}
          {/if}
        </g>
      {/each}
    </g>
    <g
      class="cursor"
      transform="translate({width / 2} 0)"
      fill="red"
      stroke="red">
      <line x1="0" x2="0" y1={$cursor.top} y2={height} stroke-width="4" />
      <rect
        x={-$cursor.pillWidth / 2}
        y={$cursor.top - $cursor.pillHeight / 2}
        width={$cursor.pillWidth}
        height={$cursor.pillHeight}
        rx={$cursor.pillHeight / 2} />
      {#if isScrubbing}
        <text
          x="0"
          y={$cursor.top + $cursor.fontSize / 2 - 1}
          text-anchor="middle"
          font-size={$cursor.fontSize}
          fill-opacity={$cursor.fontOpacity}>
          Week {closestWeek}
        </text>
      {/if}
    </g>
    <rect
      class="fade"
      x="0"
      y="0"
      {height}
      width="80"
      fill="url(#fade-to-white-left)" />
    <rect
      class="fade"
      x={width - 80}
      y="0"
      {height}
      width="80"
      fill="url(#fade-to-white-right)" />
  </svg>
</div>
