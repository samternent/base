<template>
  <input bind:value>
  <ul>
    {#each factors as factor}
      <li>{factor}</li>
    {/each}
  </ul>
</template>
<script>
  import { getFactors } from '@core/leetcode/factor-combinations';
  let value = 12;
  let factors = [];
  $: {
    factors = getFactors(value);
  }
</script>
