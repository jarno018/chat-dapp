<script lang="ts">
  /**
   * This page shows the user the results of the entered query
  */

  import { afterUpdate, beforeUpdate, createEventDispatcher } from "svelte";
  import { gun, user } from "./gun";

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

  //The searchquery from the parent
  export let query:string;

  //The results
  let results:IRoom[] = [];

  //Get the chatroom based on supplied id
  const getRoomFromId = async (id:  string): Promise<IRoom> => {
    return new Promise((resolve, reject) => {
      gun.get('rooms').get(id).once((targetRoom: IRoom) => {
        resolve(targetRoom);
      })
    })
  }

  //Getting rooms based on the query
  const getRoomsBasedOnQuery = async () => {

    //First the public rooms
    user.get('joinedPublicRooms').map(async (data: IJoinedRoom) => {

      //invalid
      if(!data) return;

      //Get the room from the chain
      let room: IRoom = await getRoomFromId(data.id);

      //invalid
      if(!room) return;

      //Check if the name matches the quert
      if(room.name.indexOf(query) >= 0) {
        results.push(room);

        //Assignment to reload UI
        results = results;
      }

    });

    //Then the private rooms
    user.get('joinedPrivateRooms').map(async (data: IJoinedRoom) => {

      //invalid
      if(!data) return;

      //Get the room from the chain
      let room: IRoom = await getRoomFromId(data.id);

      //invalid
      if(!room) return;

      //Check if the name matches the quert
      if(room.name.indexOf(query) >= 0) {
        results.push(room);
            
        //Assignment to reload UI
        results = results;
      }

    })

  };

  //Getting chats when the searchquery changes
  $: {
    //Setting
    query = query;

    //Empty previous results
    results = [];

    //Getting matching chats again
    getRoomsBasedOnQuery();
  }

  //Letting parent know the user clicked a chat
  const dispatch = createEventDispatcher();

  const chatClicked = (id: number) => {
    dispatch('clickChain', {id: id});
  }


</script>

{#if !results.length}
  <p>No results</p>
{:else}
  {#each results as room}
    <div class="room" on:click={() => chatClicked(parseInt(room.id))}>
      <div class="left chat-color" style="background-color: {room.color};">
      </div>
      <h3 class="right chat-description">{room.name}</h3>
    </div>
  {/each}
{/if}

<style>
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
</style>