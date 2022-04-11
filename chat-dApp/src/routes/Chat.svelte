<script lang="ts">
  /**
   * This window shows the last 20 messages that were send, along with some additional info
   * If the chat is private, we get the key from the users graph first
   * Messages sent from other users are on the left, own messages are on the right
  */

  import { gun, user } from './user';

  export let chatId: number;

  // Find all last 20 messages and dispkay in the UI

</script>

<div class="align-box">
  <div class="message">
    <p class="message-text"></p>
  </div>
  <p class="meta"></p>
</div>

<style>
  
</style>