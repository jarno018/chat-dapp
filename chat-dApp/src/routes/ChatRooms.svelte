<script lang="ts">

  import 'gun/lib/then'
  import { gun, user } from './user';
  import Editor from './Editor.svelte';
import { dataset_dev } from 'svelte/internal';

  //Structure of a room object
  interface IRoom {
    name: string,
    id: string,
    color: string,
    isPrivate: boolean,
    salt: EpochTimeStamp,
    hash: string
  }

  //Binding the input of the query
  let searchTerm: string;

  //Holding the rooms in memory
  let joinedPublicRooms: IRoom[];
  let joinedPrivateRooms: IRoom[];

  //Get the public chatrooms a user has already joined
  //Searching the user -> joinedPublicRooms
  //Return array of objects containing all public joined rooms
  const getJoinedPublicRooms = async (): Promise<IRoom[]> => {
    return new Promise(resolve => {
      user.get('joinedPublicRooms').once((data: IRoom[]) => {
        resolve(data);
      });
    })
  }


  (async() => {
    user.get('joinedPublicRooms').once((data, key) => {
      console.log(data);
      // gun.get(data).once((result) => {
      //   console.log(result);
      // })
    });

  })();

  //Get the private chatrooms a user has joined
  //Searching the user -> joinedPrivateRooms graph
  //Return array of objects containing private joined rooms
  const getJoinedPrivateRooms = async (): Promise<IRoom[]> => {
    return new Promise(resolve => {
      user.get('joinedPrivateRooms').once((data: IRoom[]) => {
        resolve(data);
      })
    })
  }
  

  (async() => {

    joinedPublicRooms = await getJoinedPublicRooms();
    joinedPrivateRooms = await getJoinedPrivateRooms();

  })();


</script>

<div class="top-content">
  <input class="top-content searchbar" type="text" bind:value={searchTerm} placeholder="Search for chats">
</div>
<div class="all-rooms">
  <div class="participated-rooms">
    <h2 class="font-semibold text-black text-lg">Public rooms</h2>
    {#if !joinedPublicRooms}
      <p>You have not joined any public rooms yet. Maybe search for one.</p>
    {:else}
      {#each joinedPublicRooms as room}
        <div class="room">
          <div class="left chat-color">
          </div>
          <h3 class="right chat-description">{room.name}</h3>
        </div>
      {/each}
    {/if}
  </div>
  <div class="other-rooms">
    <h2 class="font-semibold text-black text-lg">Private rooms</h2>
    {#if !joinedPrivateRooms}
      <p>There are no rooms available</p>
    {:else}
      {#each joinedPrivateRooms as room}
        <div class="room">
          <div class="left chat-color">
          </div>
          <h3 class="right chat-description">{room}</h3>
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
    width: 90%;
    height: 40px;
    background-color: antiquewhite;
    border-bottom: 1px solid grey;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s;
  }
  .room:hover {
    background-color: rgb(216, 213, 209);
    transform: scale(1.1);
  }
  .all-rooms {
    width: 95%;
    margin: 10px auto auto auto;
  }
  .participated-rooms {
    margin-top: 20px;
  }
  .room.chat-color {
    display: block;
    background-color: lightcoral;
    width: 20px;
    height: 20px;
    border-radius: 5px;
  }

</style>