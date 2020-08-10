<script>
  import { onMount } from 'svelte';
  import Tailwindcss from './components/Tailwindcss.svelte';
  import SimonsSweetShop from './components/SimonsSweetShop.svelte';
  import GithubLink from './components/GithubLink.svelte';
  import MadeWith from './components/MadeWith.svelte';
  import Markdown from './components/Markdown.svelte';
  import ProfileCard from './components/ProfileCard.svelte';
  import FactorCombinations from './components/FactorCombinations.svelte';
  import RangeSumQuery from './components/RangeSumQuery.svelte';
  import UnionFind from './components/UnionFind.svelte';
  import Nav from './components/Nav.svelte';

  let welcome;
  onMount(() => {
    if (localStorage.getItem('hey')) {
      welcome = 'WelcomeBack';
    } else {
      welcome = 'Welcome';
      localStorage.setItem('hey', 'hey yourself');
    }
  });
</script>

 <div class="w-full flex flex-wrap justify-center">
  <div class="w-full lg:w-1/2 flex flex-col justify-center md:justify-start my-auto pt-4 md:pt-0 md:px-18 lg:px-18 xl:px-24 md:mt-20">
    <div class="text-center pt-6 pb-6">
      <span class="text-2xl font-extrabold block">@samternent</span>
      <GithubLink/>
    </div>
<!--
    <div class="text-center pt-6 pb-6">
      <Nav/>
    </div> -->

    <div class="flex flex-col pt-4 md:pt-8 text-center">
      <FactorCombinations/>
    </div>
    <div class="flex flex-col pt-4 md:pt-8 text-center">
      <RangeSumQuery/>
    </div>
    <div class="flex flex-col pt-4 md:pt-8 text-center">
      <UnionFind/>
    </div>

    <div class="flex flex-col pt-4 md:pt-8 text-center">
      {#if welcome}
        <Markdown path={welcome}/>
      {/if}
    </div>

    <div class="text-center pt-12 pb-12">
      <MadeWith/>
    </div>
  </div>
</div>
<Tailwindcss />
