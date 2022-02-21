<script lang="ts">
import { user } from "./user";



  let username: string;
  let password: string;

  const handler = () => {
    console.log(username + " " + password);
  }

</script>

<div class="login">
  <h2>Welcome to the future</h2>
  <div class="icon">
    <img src="/static/img/dab.png" alt="dab icon">
  </div>
  <form id="form" on:submit|preventDefault={handler}>
    <input type="text" id="username" placeholder="Username" bind:value={username} />
    <input type="password" id="password" placeholder="Password" bind:value={password} />
    <input type="submit" value="Let's chat">
  </form>
</div>

<style>
  * {
    padding: 0;
    margin: 0;
  }
  .login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: white;
  }
  .login h2 {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon img{
    width: 75%;
    height: 75%;
  }
  form {
    margin: auto;
    width: 90%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  form input {
    width: 90%;
    margin-top: 20px;
    height: 40px;
    font-size: large;
  }
  form input[type="submit"] {
    background-color: rgb(230, 152, 28);
    border-radius: 10px;
    width: 90%;
    border: 0;
    box-shadow: -7px 10px 6px -1px rgba(0,0,0,0.34);
  }
  form input[type="submit"]:hover {
    background-color: rgb(185, 134, 52);
  }
</style>