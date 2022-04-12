<script lang="ts">

  import Login from './Login.svelte';
  import Home from './Home.svelte'
  import Rooms from './ChatRooms.svelte';

  import { gun, user, username } from './user';


</script>

<svelte:head>
  <title>Chat dApp</title>
</svelte:head>
<div class="app-window">
  {#if $username}
    <Home />
  {:else}
    <Login />
  {/if}
</div>


<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :global(body) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }

  .app-window {
    width: 45%;
    height: 65%;
    background-color: blueviolet;
    border: 1px solid black;
    position: relative;
  }

</style>
