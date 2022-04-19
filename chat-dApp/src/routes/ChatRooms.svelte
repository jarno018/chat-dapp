<script lang="ts">

  import { gun, user } from './gun';
  import { createEventDispatcher, onMount } from 'svelte/internal';
  import Search from './Search.svelte';
import Chat from './Chat.svelte';

  //Structure of a room object
  interface IRoom {
    name: string,
    id: string,
    color: string,
    isPrivate: boolean,
    salt: EpochTimeStamp,
    hash: string
  }

  //Structure of a joined room
  interface IJoinedRoom {
    id: string
    key?: string
  }

  //Binding the input of the query
  let searchTerm: string;

  //Holding the rooms in memory
  let joinedPublicRooms: IRoom[] = <IRoom[]>[];
  let joinedPrivateRooms: IRoom[] = <IRoom[]>[];

  //Pass an event to the parent (home) when a chat is clicked
  const dispatch = createEventDispatcher();

  const chatClicked = (id: number) => {
    dispatch('chatClicked', {
      id: id,
    });
  }

  //Get the chatroom based on supplied id
  const getRoomFromId = async (id:  string): Promise<IRoom> => {
    return new Promise((resolve, reject) => {
      gun.get('rooms').get(id).once((targetRoom: IRoom) => {
        resolve(targetRoom);
      })
    })
  }

  //Get the public chats a user has already joined
  //Searching the user -> joinedPublicRooms
  //Return array of objects containing all ids of joined chats
  const getJoinedPublicRooms = async (): Promise<void> => {
    return new Promise((resolve) => {
      user.get('joinedPublicRooms').map(async (data: IJoinedRoom) => {
        //After getting the ID, retreive the chat itself
        let room = await getRoomFromId(data.id);

        //Only add if the chat is not already present
        if(!joinedPublicRooms.includes(room)) joinedPublicRooms.push(room);

        //To trigger UI update, we need assignment istead of mutation
        joinedPublicRooms = joinedPublicRooms;
      });
      
      resolve();
    });
  }

  //Get the private chatrooms a user has joined
  //Searching the user -> joinedPrivateRooms graph
  //Return array of objects containing all ids of private joined rooms
  const getJoinedPrivateRooms = async (): Promise<void> => {
    return new Promise(resolve => {
      user.get('joinedPrivateRooms').map(async (data: IJoinedRoom) => {
        //After getting the ID, retreive the chat itself
        let room = await getRoomFromId(data.id);

        if(!data) return;

        //Only add if the chat is not already present
        if(!joinedPrivateRooms.includes(room)) joinedPrivateRooms.push(room);

        //To trigger UI update, we need assignment istead of mutation
        joinedPrivateRooms = joinedPrivateRooms;
      });
      resolve();
    });
  }

  //When a user enters a query, we display the found chats
  //When a user then clicks on a room, we display this chat
  const chainClick = (event: any) => {

    //Pass the clicked id to the parent
    chatClicked(event.detail.id);
  }
  

  //Run when UI is loaded
  onMount(async () => {

    //Await the filling of the arrays
    await getJoinedPublicRooms();

    await getJoinedPrivateRooms();

  });

</script>

<div class="top-content">
  <input class="top-content searchbar" type="text" bind:value={searchTerm} placeholder="Search for chats">
</div>
<div class="all-rooms">
  {#if searchTerm}
    <h2 class="search-results">Search results</h2>
    <Search bind:query={searchTerm} on:clickChain={chainClick}/>
  {:else}
  <div class="participated-rooms">
    <h2 class="font-semibold text-black text-lg">Public rooms</h2>
    {#if !joinedPublicRooms.length}
      <p>You have not joined any public rooms yet.</p>
    {:else}
      {#each joinedPublicRooms as room}
        <div class="room" on:click={() => chatClicked(parseInt(room.id))}>
          <div class="left chat-color" style="background-color: {room.color};">
          </div>
          <h3 class="right chat-description">{room.name}</h3>
        </div>
      {/each}
    {/if}
  </div>
  <div class="other-rooms">
    <h2 class="font-semibold text-black text-lg">Private rooms</h2>
    {#if !joinedPrivateRooms.length}
      <p>You have not joined any private rooms yet.</p>
    {:else}
      {#each joinedPrivateRooms as room}
        <div class="room" on:click={() => chatClicked(parseInt(room.id))}>
          <div class="left chat-color" style="background-color: {room.color};">
          </div>
          <h3 class="right chat-description">{room.name}</h3>
        </div>
      {/each}
    {/if}
  </div>
  {/if}
</div>


<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  .top-content {
    margin-top: 10px;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

  }
  .top-content .searchbar {
    width: 95%;
    font-size: large;
    padding: 5px 5px 5px 5px;
  }
  .all-rooms .search-results {
    margin-top: 20px;
    font-weight: 500;;
  }
  .room {
    width: 100%;
    height: 40px;
    
    border-bottom: 1px solid black;
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    transition: all 0.3s;
    margin-bottom: 3px;
  }
  .room:hover {
    transform: scale(1.01);
    cursor: pointer;
  }
  .all-rooms {
    width: 95%;
    margin: 10px auto auto auto;
  }
  .left.chat-color {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    display: block;
    margin-left: 10px;
  }
  .chat-description {
    margin-left: 30px;
    font-weight: 500;
  }
  .participated-rooms {
    margin-top: 20px;
  }
  .other-rooms {
    margin-top: 20px;
  }

</style>