<script lang="ts">

  import AddRoom from './AddRoom.svelte';
  import CreateRoom from './CreateRoom.svelte'

  let action: string = 'add';


</script>


<div class="editor-window">
  <div class="action-selector">
    <label for="action">Choose an action: </label>
    <select name="action" bind:value={action}>
      <option value="create">Create chat</option>
      <option value="add">Become a member</option>
    </select>
  </div>
</div>
{#if action === 'add'}
<AddRoom />
{:else}
<CreateRoom />
{/if}




<style>
  .editor-window {
    width: 95%;
    margin: auto;
  }

  .action-selector {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: auto;
    margin-top: 20px;
  }
</style>