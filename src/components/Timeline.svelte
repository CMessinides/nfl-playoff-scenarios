<script>
  import { tweened, spring } from "svelte/motion"
  import { cubicOut } from "svelte/easing"
  import { MIN_WEEK, MAX_WEEK, ALL_WEEKS } from "../lib/games.js"
  import ChevronLeft from "./icons/ChevronLeft.js"
  import ChevronRight from "./icons/ChevronRight.js"

  export let week = MAX_WEEK

  function decrement() {
    if (week > MIN_WEEK) {
      week = week - 1
    }
  }

  function increment() {
    if (week < MAX_WEEK) {
      week = week + 1
    }
  }

  const marginTop = 20
  const sliderHeight = 48
  const sliderInterval = 100
  const sliderWidth = (MAX_WEEK - 1) * sliderInterval

  let translate = spring(-1 * sliderWidth, {
    stiffness: 0.05,
    damping: 0.4
  })

  let closestTick = MAX_WEEK - 1
  $: {
    if ($translate > 0) {
      closestTick = MIN_WEEK - 1
    } else if ($translate < -sliderWidth) {
      closestTick = MAX_WEEK - 1
    } else {
      closestTick = Math.round(Math.abs($translate) / sliderInterval)
    }
  }
  $: closestWeek = closestTick + 1

  // Sync the slider position with the current week
  $: {
    translate.set((week - 1) * -sliderInterval)
  }

  const height = marginTop + sliderHeight
  let width = 0

  let isDragging = false

  const initialCursorDimensions = {
    top: marginTop,
    pillWidth: 10,
    pillHeight: 10,
    fontSize: 0,
    fontOpacity: 0
  }

  let cursorDimensions = tweened(initialCursorDimensions, {
    duration: 300,
    delay: 50,
    easing: cubicOut
  })

  $: {
    if (isDragging) {
      cursorDimensions.set({
        top: 10,
        pillWidth: 80,
        pillHeight: 20,
        fontSize: 14,
        fontOpacity: 1
      })
    } else {
      cursorDimensions.set(initialCursorDimensions)
    }
  }

  function clamp(min, value, max) {
    return Math.max(min, Math.min(value, max))
  }

  // Ah, if only Safari supported MouseEvent.movementX...
  let lastPointerX

  function handleDragStart(e) {
    isDragging = true
    lastPointerX = e.clientX
  }

  function handleDragMove(e) {
    if (isDragging) {
      translate.update(t =>
        clamp(-sliderWidth - 120, t + (e.clientX - lastPointerX), 120)
      )
      lastPointerX = e.clientX
    }
  }

  function handleDragEnd() {
    if (isDragging) {
      isDragging = false

      if ($translate > 0) {
        // Overshot to the left
        translate.set(0)
      } else if ($translate < -sliderWidth) {
        // Overshot to the right
        translate.set(-sliderWidth)
      } else {
        translate.set(closestTick * -sliderInterval)
      }

      week = closestWeek
    }
  }
</script>

<style>
  .wrapper {
    overflow: hidden;
    width: 100%;
  }

  h2,
  .toggles {
    padding: 8px 32px;
  }

  .toggles {
    display: flex;
    align-items: center;
  }

  .toggles .week {
    display: block;
    padding-left: 16px;
  }

  .toggles button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 4px;
    color: inherit;
    background: none;
    border: none;
    border-radius: 4px;
    transition: 120ms background-color linear;
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

  .slider {
    display: block;
    max-width: 100%;
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
  on:pointermove|preventDefault={handleDragMove}
  on:pointerup|preventDefault={handleDragEnd} />

<div class="wrapper" bind:clientWidth={width}>
  <h2>Rewind the Tape</h2>
  <div class="toggles">
    <button
      type="button"
      on:click={decrement}
      disabled={week === MIN_WEEK}
      aria-label="Back 1 week">
      {@html ChevronLeft()}
    </button>
    <button
      type="button"
      on:click={increment}
      disabled={week === MAX_WEEK}
      aria-label="Forward 1 week">
      {@html ChevronRight()}
    </button>
    <span class="week">Week {week}</span>
  </div>
  <svg class="slider" {height} {width}>
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
      transform="translate({$translate + width / 2}
      {marginTop})"
      on:pointerdown={handleDragStart}>
      <rect
        x="0"
        y="0"
        height={sliderHeight}
        width={sliderWidth}
        fill-opacity="0" />
      {#each ALL_WEEKS as week}
        <g transform="translate({(week - 1) * sliderInterval} 0)">
          <line
            x1="0"
            x2="0"
            y1="6"
            y2={sliderHeight - 12}
            stroke="gray"
            stroke-width="2" />
          {#if week !== MAX_WEEK}
            {#each [1, 2, 3, 4, 5] as tick}
              <line
                y1="20"
                y2={sliderHeight - 20}
                x1={(tick * sliderInterval) / 6}
                x2={(tick * sliderInterval) / 6}
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
      <line
        x1="0"
        x2="0"
        y1={$cursorDimensions.top}
        y2={height}
        stroke-width="4" />
      <rect
        x={-$cursorDimensions.pillWidth / 2}
        y={$cursorDimensions.top - $cursorDimensions.pillHeight / 2}
        width={$cursorDimensions.pillWidth}
        height={$cursorDimensions.pillHeight}
        rx={$cursorDimensions.pillHeight / 2} />
      {#if isDragging}
        <text
          x="0"
          y={$cursorDimensions.top + $cursorDimensions.fontSize / 2 - 1}
          text-anchor="middle"
          font-size={$cursorDimensions.fontSize}
          fill-opacity={$cursorDimensions.fontOpacity}>
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
