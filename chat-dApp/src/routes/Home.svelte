<script lang="ts">
  /*
   * Displays all chats and a searchbar for searchin joined rooms of the logged in user
   * If a user wants to add a room, a button on the bottom of the page switches from
   * a view of all rooms to an editor where rooms can be created or public/private rooms can be added with the public (and private key)
  */

  import 'gun/lib/then'
  import { gun, user, username } from './gun';
  import Editor from './Editor.svelte';
  import ChatRooms from './ChatRooms.svelte';
  import Chat from './Chat.svelte';

  let editorActive: boolean = false;

  let selectedChat: string = undefined;

  //Toggle add-chat window
  const toggleEditor = () => {
    editorActive = !editorActive;
  }

  //When the user selects a chat, we get the id and a key if the chat is private
  const showChat = (event: any) => {
    selectedChat = event.detail.id;
  }

  //Close the chat on user request
  const closeChat = () => {
    selectedChat = undefined;
  }

  //Log the user out
  const logOut = async () => {
    user.leave();

    //Reset the username so the UI reacts
    username.set('');
  }

</script>

{#if !selectedChat}
<button class="add-button" on:click={toggleEditor}>+</button>
{/if}

{#if editorActive}
  <Editor />
{:else if selectedChat}
  <Chat chatId={selectedChat} on:closeChat={closeChat} />
{:else}
  <div class="profile">
    <span>Logged in as {$username}</span>
    <span on:click={logOut} class="logout">Log out</span>
  </div>
  <ChatRooms on:chatClicked={showChat} />  
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
    background-color: rgb(230, 152, 28);
    border: none;
    border-radius: 40px;
    transform: translate(-20px, -20px);
    z-index: 100;
  }

  .add-button:hover {
    background-color: rgb(185, 134, 52);
  }

  .profile {
    width: 95%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .profile .logout {
    cursor: pointer;
  }

</style>