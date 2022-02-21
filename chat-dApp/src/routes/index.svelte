<script lang="ts">

  import Login from './Login.svelte';
  import Rooms from './Rooms.svelte';

  import { db, user, username } from './user';

  console.log(user);


</script>

<svelte:head>
  <title>Chat dApp</title>
</svelte:head>
<div class="app-window">
  <Rooms />
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
