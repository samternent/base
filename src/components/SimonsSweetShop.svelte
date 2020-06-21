<script>
  import { order } from '@core';

  let value = 250;
  let bags = [250, 500, 1000, 2000, 5000];
  let results;
  let combinations = {};

  $: {
    results = order(parseInt(value, 10), bags);
    if (results.group) {
      combinations = results.group.reduce((acc, curr) => ({
        ...acc,
        [curr]: acc[curr] ? acc[curr] + 1 : 1,
      }),{});
    }
  }

</script>

<svelte:head>
	<title>🛍️ Simons Sweet Shop</title>
</svelte:head>

<div class="max-w-sm bg-white rounded shadow-lg mx-auto my-4 h-auto">
  <div class="px-6 py-4">
      <h2 class="font-extrabold text-primary text-3xl mb-4">Simons Sweet Shop</h2>
      <input class="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white" bind:value type="number" min="1" max="50000" >
      <input type="range" min="1" max="50000" bind:value class="my-4 w-full"/>
      <p class="text-gray-700 text-base pt-2 text-right">
        <strong>Total Order:</strong> {results.total}
      </p>
  </div>
  <div class="px-6 py-2">
    {#each bags.reverse() as packet}
      <p class="bg-gray-200 font-normal flex justify-between rounded-full px-3 py-1 text-sm text-gray-700 m-2">
        <span>{packet}</span>
        <span class="font-thin"><span class="text-l mr-2">🛍️ </span> x{combinations[packet] || 0}</span>
      </p>
    {/each}
  </div>
</div>
