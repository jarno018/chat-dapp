<script lang="ts">
  /*
   * Displays a page where user can input details of the rooms he/she wants to create
  */

  import ColorPicker from './ColorPicker.svelte';
  import { SEA } from "gun";
  import { gun, user, username } from './gun';
  import { generateRandomString, generateRandomNumber } from '../util/random';

  //Structure of a room object
  interface IRoom {
    name: string,
    id: string,
    color: string,
    isPrivate: boolean,
    salt: EpochTimeStamp,
    hash: string,
  }

  //Creating new chat every time page loads
  let newChat: IRoom = {
    name: "",
    id: generateRandomString(),
    color: '#7bd148',
    isPrivate: false,
    salt: Date.now(),
    hash: "",
  };

  let errMsg: string;
  let disabled: boolean = true;
  let creationSuccessFull = false;
  let createdKey: string;

  const handleSubmit = async () => {
    //Check if submitting is possible
    if(disabled) return;

    //If the chat is private, prepare the hash
    if(newChat.isPrivate) {
      let salt = Date.now();
      let preHash = parseInt(newChat.id) ^ salt;
      createdKey = generateRandomNumber().toString();
      newChat.hash = await SEA.encrypt(preHash, createdKey);
      newChat.salt = salt;
    }

    //Add room to the chain and save the id in the user graph -> makes sure all joined rooms are in memory when app loads
    let ref = gun.get('rooms').get(newChat.id).put(newChat);
    console.log(ref);

    //Add the room to the users joinedRooms
    if(newChat.isPrivate) {
      user.get('joinedPrivateRooms').set({id: newChat.id, key: createdKey});

    }
    else {
      user.get('joinedPublicRooms').set({id: newChat.id});
    }

    //For the UI
    creationSuccessFull = true;

    //DEBUG
    console.log(newChat);

  }

  const validateInput = (e:any) => {
    if(!e.target.value) {
      errMsg = 'All fields must be filled';
      return;
    }
    disabled = false;
  }

</script>

<div class="editor-window">
  <div class="color-picker">
    <ColorPicker bind:selectedColor={newChat.color} />
  </div>

  <form action="#" on:submit|preventDefault={handleSubmit}>
    <div class="chat-info">
    
      <input type="text" placeholder="Chatname" bind:value={newChat.name} on:blur={validateInput}>
    </div>
    <div class="type-selector">
      <select name="type" bind:value={newChat.isPrivate}>
        <option value={false}>Public</option>
        <option value={true}>Private</option>
      </select>
      <label for="type">{newChat.isPrivate ? 'Every member needs a key' : 'Everyone can be a member'}</label>
    </div>
    <button type="submit" disabled={disabled}>Create!</button>
    {#if creationSuccessFull}
      <span class="success">Creation successfull</span>
    {:else if errMsg}
    <span class="error">{errMsg}</span>
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

  .type-selector {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: auto;
    margin-top: 20px;
  }

  span.error {
    color: red;
  }

  span.success {
    color: green;
  }

</style>