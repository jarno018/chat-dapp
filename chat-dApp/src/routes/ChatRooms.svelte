<script lang="ts">

  import 'gun/lib/then'
  import { gun, user } from './user';
  import Editor from './Editor.svelte';
import { dataset_dev, onMount } from 'svelte/internal';

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
    id: number
  }

  //Binding the input of the query
  let searchTerm: string;

  //Holding the rooms in memory
  let joinedPublicRooms: IRoom[] = <IRoom[]>[];
  let joinedPrivateRooms: IRoom[] = <IRoom[]>[];

  //Get the chatroom based on supplied id
  const getRoomFromId = async (id:  number): Promise<IRoom> => {
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


  // (async() => {
  //   user.get('joinedPublicRooms').map((result) => {
  //     console.log(result);
  //     // gun.get(data).once((result) => {
  //     //   console.log(result);
  //     // })
  //   });

  // })();

  //Get the private chatrooms a user has joined
  //Searching the user -> joinedPrivateRooms graph
  //Return array of objects containing all ids of private joined rooms
  const getJoinedPrivateRooms = async (): Promise<void> => {
    return new Promise(resolve => {
      user.get('joinedPrivateRooms').map(async (data: IJoinedRoom) => {
        //After getting the ID, retreive the chat itself
        let room = await getRoomFromId(data.id);

        //Only add if the chat is not already present
        if(!joinedPrivateRooms.includes(room)) joinedPrivateRooms.push(room);

        //To trigger UI update, we need assignment istead of mutation
        joinedPrivateRooms = joinedPrivateRooms;
      });
      
      resolve();
    });
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
  <div class="participated-rooms">
    <h2 class="font-semibold text-black text-lg">Public rooms</h2>
    {#if !joinedPublicRooms.length}
      <p>You have not joined any public rooms yet.</p>
    {:else}
      {#each joinedPublicRooms as room}
        <div class="room">
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
        <div class="room">
          <div class="left chat-color" style="background-color: {room.color};">
          </div>
          <h3 class="right chat-description">{room.name}</h3>
        </div>
      {/each}
    {/if}
  </div>
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
  .room .chat-color {
    display: block;
    background-color: lightcoral;
    width: 20px;
    height: 20px;
    border-radius: 5px;
  }
  .other-rooms {
    margin-top: 20px;
  }

</style>