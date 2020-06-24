<script>
  import Tailwindcss from './components/Tailwindcss.svelte';
  import SimonsSweetShop from './components/SimonsSweetShop.svelte';
  import MadeWith from './components/MadeWith.svelte';
  import Markdown from './components/Markdown.svelte';
</script>

 <div class="w-full flex flex-wrap justify-center">

  <!-- Login Section -->
  <div class="w-full lg:w-1/2 flex flex-col">

      <div class="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-24">
          <h2 class="font-extrabold text-white text-xl bg-purple-900 p-6 mb-4">Simons Sweet Shop</h2>
      </div>

      <div class="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32 md:mt-20">
        <div class="flex flex-col pt-4 md:pt-8">
            <SimonsSweetShop/>
        </div>
        <div class="text-center pt-12 pb-12">
            <MadeWith/>
        </div>
      </div>
  </div>
</div>
<Tailwindcss />
