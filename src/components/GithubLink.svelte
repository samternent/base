<script>
import { GithubIcon } from 'svelte-feather-icons';
export let repo = 'base';
</script>
<p class="font-thin text-center p-4">
  <a href={`https://github.com/samternent/${repo}`} class="hover:text-primary">
    on <GithubIcon size="1.5x" class="inline font-thin"/> Github
  </a>
</p>
