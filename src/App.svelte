<script>
  import Tailwindcss from './components/Tailwindcss.svelte';
  import SimonsSweetShop from './components/SimonsSweetShop.svelte';
  import MadeWith from './components/MadeWith.svelte';
  import Markdown from './components/Markdown.svelte';
</script>

 <div class="w-full flex flex-wrap justify-center">
  <div class="w-full flex flex-col">
      <div class="flex flex-col justify-center md:justify-start my-auto pt-4 md:pt-0 md:mt-20">
        <h1 class="mx-auto max-w-2xl text-4xl md:text-5xl font-bold shadow-text text-indigo-700 tracking-tighter">Sweets Shop Challenge.</h1>
        <div class="flex flex-col pt-4 md:pt-8 w-full max-w-2xl mx-auto">
            <SimonsSweetShop/>
        </div>
        <div class="pt-12 pb-12 w-full max-w-6xl mx-auto">
            <Markdown path="Welcome"/>
        </div>
        <div class="text-center pt-12 pb-12">
            <MadeWith/>
        </div>
      </div>
  </div>
</div>
<Tailwindcss />
<style global>

:root {
  --title-shadow-color: rgba(234, 179, 8, 1);
}

.shadow-text {
  text-shadow: var(--title-shadow-color) 1px 1px,
    var(--title-shadow-color) 2px 2px, var(--title-shadow-color) 3px 3px,
    var(--title-shadow-color) 4px 4px, var(--title-shadow-color) 5px 5px,
    var(--title-shadow-color) 6px 6px, var(--title-shadow-color) 7px 7px;
}
</style>
