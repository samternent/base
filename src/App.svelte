<script>
  import { order } from '@core';

  let value = 251;
  let bags = [250, 500, 1000, 2000, 5000];
  $: results = order(parseInt(value, 10), bags);

</script>

<input bind:value/>
{#if results}
  <p>
    You can do this with {results} bags
  </p>
{/if}
