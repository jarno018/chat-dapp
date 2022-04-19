<script lang="ts">


  /**
   * Here a user can join a room based on a supplied ID
   * If the rooms where to be private, a key is needed to join, otherwise messages cant be decoded
  */

  import Chat from './Chat.svelte';
  import ColorPicker from './ColorPicker.svelte'
  import { gun, user } from './gun';
  import { SEA } from 'gun';

  //Structure of a room object
  interface IRoom {
    name: string,
    id: string,
    color: string,
    isPrivate: boolean,
    salt: EpochTimeStamp,
    hash: string,
  }

  let chatId: string;
  let resultingChat: IRoom;
  let suppliedKey: string;
  let keyIsValid: boolean = false;
  let submitted: boolean = false;
  let idEntered: boolean = false;

  let findRoomWithId = () => {

    //A valid id must be supplied
    if(!chatId) {
      return;
    }

    idEntered = true;

    gun.get('rooms').get(chatId).once((data: IRoom) => {

      //If the room is not found
      if(!data) {
        resultingChat = {} as IRoom;
        return;
      }

      //Room is found
      resultingChat = data;

      //Make sure we can join if a key is not needed
      if(!resultingChat.isPrivate) keyIsValid = true;
    });    
  }

  let validateKey = async() => {
    //Check if the chat exists
    if(!resultingChat) return;

    //Checking if the supplied key is correct
    keyIsValid = await SEA.decrypt(resultingChat.hash, suppliedKey);
  }

  let handleSubmit = (e) => {

    //Check if we found a room and have a valid key
    if(!resultingChat || !keyIsValid) return;

    //Save the chat in the users graph
    if(resultingChat.isPrivate) {
      user.get('joinedPrivateRooms').set({id: resultingChat.id, key: suppliedKey});
    }
    else {
      user.get('joinedPublicRooms').set({id: resultingChat.id});
    }
  }

</script>

<div class="editor-window">
  <form action="#" on:submit|preventDefault={handleSubmit}>
    <div class="credentials">
      <input type="text" placeholder="ID" bind:value={chatId} on:keyup={findRoomWithId}>
      {#if idEntered && resultingChat && !Object.keys(resultingChat).length}
        <span class="error">No chat found, please check the ID</span>
      {:else if resultingChat && Object.keys(resultingChat)}
        <span class="success">Chat found!</span>
      {/if}
      {#if resultingChat && resultingChat.isPrivate}
        <span class="success">This chat is private, a key is needed</span>
        <input type="text" placeholder="key" bind:value={suppliedKey} on:keyup={validateKey}>
        {#if !keyIsValid}
          <span class="error">Wrong key</span>
        {:else}
          <span class="success">Key correct</span>
        {/if}
      {/if}
    </div>
    <button type="submit" disabled={!keyIsValid}>Become member</button>
    {#if submitted && (!keyIsValid || !resultingChat)}
      <span class="success">Joining failed, please check all fields</span>
    {/if}
  </form>
  

</div>

<style>
  .editor-window {
    width: 95%;
    margin: 20px auto auto auto;
  }

  input {
    margin-top: 10px;
    width: 100%;
    padding: 5px 5px 5px 5px;
  }

  button[type="submit"] {
    color: #000;
    background-color: #2196F3;
    height: 20px;
    width: 100%;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }

  button:disabled:hover {
    cursor:not-allowed
  }

  span.error {
    color: red;

  }
  
  span.success {
    color: green;
  }

</style>