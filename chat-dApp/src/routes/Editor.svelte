<script lang="ts">

  import ColorPicker from './ColorPicker.svelte'

  let chatName: string;
  let description: string;

</script>

<div class="editor-window">
  <div class="color-picker">
    <ColorPicker />

  </div>
  <div class="chat-info">
    <input type="text" placeholder="Chatname" bind:value={chatName}>
    <input type="text" placeholder="Description of the chat" bind:value={description}>
  </div>
</div>

<style>

</style>