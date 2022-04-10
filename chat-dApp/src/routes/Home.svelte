<script lang="ts">
  /*
   * Displays all chats and a searchbar for searchin joined rooms of the logged in user
   * If a user wants to add a room, a button on the bottom of the page switches from
   * a view of all rooms to an editor where rooms can be created or public/private rooms can be added with the public (and private key)
  */

  import 'gun/lib/then'
  import { gun, user } from './user';
  import Editor from './Editor.svelte';
  import ChatRooms from './ChatRooms.svelte';

  let editorActive: boolean = false;

  //Toggle add-chat window
  const addChat = () => {
    editorActive = !editorActive;
  }

</script>

<button class="add-button" on:click={addChat}>+</button>
{#if editorActive}
  <Editor />
{:else}
  <ChatRooms />
{/if}


<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  .add-button {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 40px;
    height: 40px;
    background-color: aqua;
    border: none;
    border-radius: 40px;
    transform: translate(-20px, -20px);
  }

  .add-button:hover {
    background-color: rgb(166, 204, 204);
  }

</style>