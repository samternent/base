<script>
  import { order } from '@core';

  let value = 250;
  let bags = [250, 500, 1000, 2000, 5000];
  $: results = order(parseInt(value, 10), bags);

</script>

<input bind:value/>
{#if results}
  <p>
    You can do this with {results.group.length} bag{results.group.length > 1 ? 's' : ''} and a total of {results.total} sweets.
  </p>
  <ul>
  {#each results.group as packet}
    <li>{packet}</li>
  {/each}
  </ul>
{/if}
