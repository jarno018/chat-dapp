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
  let chatRoom: IRoom;

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
      user.get('joinedPrivateRooms').get(id).once((data: IJoinedRoom) => {
          console.log(data);
          if(!data) reject('You don\'t have the key for this chat');
          resolve(data.key);
      })
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

    //Createding the message
    let theMessage: IMessage = {
      message: enteredMessage, 
      createdBy: $username, 
      createdAt: Date.now()
    }

    //Adding the message
    gun.get('rooms').get(chatId).get('messages').set(theMessage);

    //Resetting the field
    enteredMessage = "";
  }

  const getMessages = async () => {

    //Iterate over all the messages and subscribe to changes
    gun.get('rooms').get(chatId).get('messages').map((data: IMessage) => {
      messages.push(data);

      //Make sure the UI react by assignment
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


  (async () => {
    try {

      //Get the current room
      chatRoom = await getRoom();

      console.log(chatRoom);

      //Get all the messages (if any)
      if(chatRoom) await getMessages();

    } catch(e: any) {
      errMsg = e;
    }
  })();


</script>

<div class="chat">
  <div class="header">
    <span class="close" on:click={closeChat}><Fa icon={faClose}/></span>
    <h3 class="chat-name">{chatRoom ? chatRoom.name : errMsg ? errMsg : 'getting info...'}</h3>
    <span class="info" on:click={toggleInfoWindow} style="color:{infoWindowActive ? 'lightblue' : 'black'}"><Fa icon={faInfo}/></span>
  </div>
  {#if infoWindowActive}
    <div class="info-window">
      <div>
        <b>name:</b>
        <p>{chatRoom.name}</p>
      </div>
      <div>
        <b>id:</b>
        <p>{chatRoom.id}</p>
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
      {#each messages as message}
        <div class="message-container">
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
  }

  
  .chat .chat-messages .message-container {
    margin-bottom: 20px;
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


  
</style>