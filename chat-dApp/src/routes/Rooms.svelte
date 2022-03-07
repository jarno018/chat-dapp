<script lang="ts">

  import 'gun/lib/then'
  import { gun, user } from './user';

  interface IRooms {
    joinedRooms: string[] | string;
    otherRooms: string[] | string;
  }

  let rooms: IRooms = {
    joinedRooms: [],
    otherRooms: []
  };

  let searchTerm: string;

  //Get the chatrooms a user has already joined
  const getJoinedRooms = async (): Promise<string> => {
    return new Promise(resolve => {
      user.get('joinedRooms').promise((data) => {
        resolve(data.key);
      });
    })
  }

  //Get the chatrooms a user might be interested in
  const getOtherRooms = async (): Promise<string> => {
    return new Promise(resolve => {
      user.get('rooms').promise((data) => {
        resolve(data.key);
      })
    })
  }
  
  (async() => {

    rooms.joinedRooms = await getJoinedRooms();
    rooms.otherRooms = await getOtherRooms();

    console.log(await getJoinedRooms());

  })();



  const addChat = () => {

  }

  // Iterate all the chats the user can join and display in the UI

</script>

<button class="add-button" on:click={addChat}>+</button>
<div class="top-content">
  <input class="searchbar" type="text" bind:value={searchTerm} placeholder="Search for chats">
</div>
<div class="participated-rooms">
  <h2>Participated rooms</h2>
  {#if !rooms.joinedRooms}
    <p>You have not joined any rooms yet</p>
  {:else}
    {#each rooms.joinedRooms as room}
      <div class="room">
        <div class="left chat-color">
        </div>
        <h3 class="right chat-description">{room}</h3>
      </div>
    {/each}
  {/if}
</div>
<div class="other-rooms">
  <h2>Other rooms</h2>
  {#if !rooms.otherRooms}
    <p>There are no rooms available</p>
  {:else}
    {#each rooms.otherRooms as room}
      <div class="room">
        <div class="left chat-color">
        </div>
        <h3 class="right chat-description">{room}</h3>
      </div>
    {/each}
  {/if}
</div>


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
  .top-content {
    margin-top: 10px;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

  }
  .top-content .searchbar {
    width: 80%;
    font-size: large;
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
  .room.chat-color {
    display: block;
    background-color: lightcoral;
    width: 20px;
    height: 20px;
    border-radius: 5px;
  }

</style>