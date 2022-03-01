<script lang="ts">

  import Login from './Login.svelte';
  import Rooms from './Rooms.svelte';

  import { gun, user } from './user';

</script>

<svelte:head>
  <title>Chat dApp</title>
</svelte:head>
<div class="app-window">
  {#if !user.is}
    <Login />
  {:else}
    <Rooms />
  {/if}
</div>


<style>

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
  }

</style>
