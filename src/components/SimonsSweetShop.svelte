<script>
  import { order } from '@core';
  import { DeleteIcon } from 'svelte-feather-icons'

  let value = 12001;
  let bags = [250, 500, 1000, 2000, 5000];
  let results;
  let sortedBags = bags;
  let combinations = {};
  let newBag = null;

  const remove = (value) => {
    bags = bags.filter(item => item !== value);
  }
  const add = () => {
    if (newBag && !bags.includes(parseInt(newBag, 10))) {
      bags = [
        ...bags,
        parseInt(newBag, 10),
      ].sort((a, b) => a - b);
      newBag = null;
    }
  }

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

<div class="bg-white pb-6 border rounded shadow-lg max-w-screen-sm text-align-center container">
  <div class="px-6 py-4">
      <h2 class="font-extrabold text-purple-700 text-3xl mb-4">Simons Sweet Shop</h2>
      <input class="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white" bind:value type="number" min="1" max="50000" >
      <input type="range" min="1" max="50000" bind:value class="my-4 w-full"/>
      <p class="text-gray-700 text-base pt-2 text-right">
        <strong>Total Order:</strong> {results.total}
      </p>

      <section class="flex flex-wrap justify-start pt-6">
        {#each Object.keys(combinations) as packet}
          <p class="bg-gray-100 font-normal flex rounded-full px-3 text-xs text-gray-700 m-1 py-1">
            <span class="mr-4">{packet}</span>
            <span class="font-thin"><span class="text-l mr-2">🛍️ </span> x{combinations[packet] || 0}</span>
          </p>
        {/each}
      </section>
  </div>
  <div class="px-6 py-4 w-100">
      <section class="flex flex-wrap justify-between">
      {#each bags as bag}
        <p on:click={() => remove(bag)} class="bg-purple-100 text-gray-800 font-normal cursor-pointer flex rounded-full px-3 text-xs m-1 py-1">
          <span class="mr-4">{bag}</span> <DeleteIcon size="1.5x"/>
      {/each}
      </section>
      <p class="font-normal flex justify-between m-2 py-4">
        <input class="bg-gray-100 p-2 border-solid rounded border border-gray-400" bind:value={newBag}/>
        <button on:click={add} class="bg-purple-600 hover:bg-purple-700 text-gray-200 font-bold py-2 px-4 rounded inline-flex items-center">
          <span>Add</span>
        </button>
      </p>
  </div>
</div>
<style>
.container {
  max-width: 620px;
  width: 100%;
}
</style>
