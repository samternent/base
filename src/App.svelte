<script>
  import Tailwindcss from './components/Tailwindcss.svelte';
  import SimonsSweetShop from './components/SimonsSweetShop.svelte';
  import MadeWith from './components/MadeWith.svelte';
  import Markdown from './components/Markdown.svelte';
</script>

 <div class="w-full flex flex-wrap justify-center">
  <div class="w-full lg:w-1/2 flex flex-col">
      <div class="flex flex-col justify-center md:justify-start my-auto pt-4 md:pt-0 md:px-18 lg:px-18 xl:px-24 md:mt-20">
        <div class="flex flex-col pt-4 md:pt-8">
            <SimonsSweetShop/>
        </div>
        <!-- <div class="pt-12 pb-12">
            <Markdown path="Welcome"/>
        </div> -->
        <div class="text-center pt-12 pb-12">
            <MadeWith/>
        </div>
      </div>
  </div>
</div>
<Tailwindcss />
