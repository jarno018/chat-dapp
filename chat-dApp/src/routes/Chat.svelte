<script lang="ts">

  /**
   * This window shows the last 20 messages that were send, along with some additional info
   * If the chat is private, we get the key from the users graph first
   * Messages sent from other users are on the left, own messages are on the right
  */

  import { gun, user, username } from './user';
  import Fa from 'svelte-fa'
  import { faClose, faInfo } from '@fortawesome/free-solid-svg-icons'
  import { createEventDispatcher } from 'svelte';
import { SEA } from 'gun';
import { afterUpdate, compute_slots, onMount } from 'svelte/internal';

  //Structure of a room object
  interface IRoom {
    name: string,
    id: string,
    color: string,
    isPrivate: boolean,
    salt: EpochTimeStamp,
    hash: string,
  }

  //Structure of a joined room
  interface IJoinedRoom {
    id: string
    key?: string
  }

  //Structure of a message
  interface IMessage {
    createdBy: string,
    createdAt: EpochTimeStamp,
    message: string
  }

  //Value set from parent
  export let chatId: string;

  //The current room
  let currentChat: IRoom;

  //All the messages
  let messages: IMessage[] = [];

  let enteredMessage: string;

  let isPrivate: boolean = false;
  let errMsg: string;
  let key: string = undefined;
  let infoWindowActive: boolean = false;

  const dispatch = createEventDispatcher();

  const retrieveKey = async (id: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      user.get('joinedPrivateRooms').map((data: IJoinedRoom) => {

        //Found the chat we were looking for
        if(data.id == chatId) {
          
          return resolve(data.key);
        }

      })
      return reject('You don\'t have the key for this chat');
    })
  }

  const getRoom = async (): Promise<IRoom> => {
    return new Promise((resolve, reject) => {
      gun.get('rooms').get(chatId).once(async (data: IRoom) => {
        
        if(!data) reject('You are not a member of this room');

        //If the room is private, retrieve the key from the user graph
        if(data.isPrivate) {
          isPrivate = true;
          key = await retrieveKey(data.id);
        }

        resolve(data);
      })
    })
  }

  const sendMessage = async () => {

    //Make sure we have a chat active
    if(!currentChat) return;

    //Creating the message
    let theMessage: IMessage|string = {
      message: enteredMessage, 
      createdBy: $username, 
      createdAt: Date.now()
    }

    //If the chat is private, make sure we encrypt before adding
    if(currentChat.isPrivate) {
      for(let [key, value] of Object.entries(theMessage)) {
        theMessage[key] = await SEA.encrypt(value, key);
      }
    }

    //Adding the message, must be in object format
    gun.get('rooms').get(chatId).get('messages').set(theMessage);
    

    //Resetting the field
    enteredMessage = "";
  }

  const getMessages = async () => {

    //Iterate over all the messages and subscribe to changes
    gun.get('rooms').get(chatId).get('messages').map(async (data: IMessage) => {

      //If the current room is private, decryption is needed
      if(currentChat.isPrivate) {
        let t: IMessage = {} as IMessage;

        for(let [key, value] of Object.entries(data)) {
          t[key] = await SEA.decrypt(value, key);
        }

        messages.push(t);
      }
      else {
        messages.push(data);
      }      

      //Make sure the UI reacts by assignment
      messages = messages;
    })
  }

  const toggleInfoWindow = () => {
    infoWindowActive = !infoWindowActive;
  }

  //Let the parent know that the user wants to close the window
  const closeChat = () => {
    dispatch('closeChat');
  }


  //Run when DOM is loaded
  onMount(() => {
    (async () => {

      //Get the current room
      currentChat = await getRoom().catch((err) => errMsg = err);

      //Get all the messages (if any)
      if(currentChat) await getMessages().catch((err) => errMsg = err);

    })();
  })

  afterUpdate(() => {

    //Grab the last message and scroll down to it after every update
    let target = document.querySelector('.message-container:last-child');

    if(target) target.scrollIntoView({behavior: 'smooth'});
  })



</script>

<div class="chat">
  <div class="header">
    <span class="close" on:click={closeChat}><Fa icon={faClose}/></span>
    <h3 class="chat-name">{currentChat ? currentChat.name : errMsg ? errMsg : 'getting info...'}</h3>
    <span class="info" on:click={toggleInfoWindow} style="color:{infoWindowActive ? 'lightblue' : 'black'}"><Fa icon={faInfo}/></span>
  </div>
  {#if infoWindowActive}
    <div class="info-window">
      <div>
        <b>name:</b>
        <p>{currentChat.name}</p>
      </div>
      <div>
        <b>id:</b>
        <p>{currentChat.id}</p>
      </div>
      {#if isPrivate}
        <div>
          <b>key:</b>
          <p>{key}</p>
        </div>
      {/if}

    </div>
  {:else}
    <div class="chat-messages">
      {#each messages as message, i}
        <div class="message-container" style="align-self: {message.createdBy === $username ? 'end' : 'start'};">
          <p class="before">{message.createdBy}</p>
          <div class="message">
            <p>{message.message}</p>
          </div>
          <p class="after">{new Date(message.createdAt).toLocaleDateString('en-us', {weekday: 'short', hour: 'numeric', minute: 'numeric'})}</p>
        </div>
      {/each}
    </div>
    <div class="send-message">
      <form on:submit|preventDefault={sendMessage}>
        <input type="text" name="message-text" placeholder="Say something" bind:value={enteredMessage}>
        <button type="submit">Send</button>
      </form>
    </div>
  {/if}
</div>

<div class="align-box">
  <div class="message">
    <p class="message-text"></p>
  </div>
  <p class="meta"></p>
</div>

<style>
  .chat {
    width: 95%;
    height: 100%;
    margin: auto;
  }

  .chat .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 50px;
  }

  .chat .header .info:hover {
    cursor: pointer;
  }

  .chat .header .close:hover {
    cursor: pointer;
  }

  .chat .info-window {
    height: calc(100% - 50px);
    width: 100%;
  }

  .chat .chat-messages {
    height: calc(100% - 50px - 50px);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow-y: auto;
  }

  
  .chat .chat-messages .message-container {
    margin-bottom: 20px;
    padding-right: 5px;
  }

  .chat .chat-messages .message-container p.before {
    color: #373737;
  }

  .chat .chat-messages .message-container div.message {
    border: 1px solid black;
    border-radius: 10px;
    background-color: rgb(230, 152, 28);
  }

  .chat .chat-messages .message-container div.message p {
    margin: 5px 10px 5px 10px;
  }

  .chat .chat-messages .message-container p.after {
    color: #373737;
  }

  .chat .send-message form {
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .chat .send-message form input {
    padding: 5px 5px 5px 5px;
    height: 90%;
    width: 80%;
  }

  .chat .send-message form button {
    padding: 5px 5px 5px 5px;
    width: 18%;
    height: 90%;
    background-color: rgb(230, 152, 28);;
    border: 1px solid black;
    
  }

  /**
    Scrollbar styling
    From https://www.w3schools.com/howto/howto_css_custom_scrollbar.asp
  */
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #7e1bda;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-thumb {
    background: #7208d4;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #6c00d1;
  }


  
</style>