<script>
  import Tailwindcss from './components/Tailwindcss.svelte';
  import SimonsSweetShop from './components/SimonsSweetShop.svelte';
  import MadeWith from './components/MadeWith.svelte';
  import Markdown from './components/Markdown.svelte';
</script>

<main class="flex flex max-h-screen flex-col md:flex-row overflow-x-hidden max-w-screen h-screen w-screen md:overflow-hidden">
  <section class="bg-white rounded shadow-lg flex-col flex justify-between">
    <SimonsSweetShop/>
    <MadeWith/>
  </section>
  <section class="flex-1">
    <Markdown path="Welcome"/>
  </section>
  <Tailwindcss />
</main>
