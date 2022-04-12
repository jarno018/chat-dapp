<script lang="ts">
  import { gun, user } from "./gun";
  import dab from '../includes/img/dab.png';

  // Username: Mathis
  // Password: delbeke123

  // Keep track if the user tried to login
  let attemptedLogin: boolean = false;

  let username: string;
  let password: string;
  let buttonValue: string;

  let errorMsg: string;

  const userExists = async (): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      gun.get(username).once((result) => {
        resolve(result ? true : false);
      })
    })
  }

  const login = async () => {
    return new Promise<void>((resolve, reject) => {
      //Check if the user exists
      if(!userExists()) return reject('User not found. Register instead ?');

      //If the user exists, authenticate
      user.auth(username, password, (ack: any) => {
        if(ack.err) return reject(ack.err);
        else resolve();
      })
    })

    
  }

  const register = async () => {
    return new Promise<void>(async (resolve, reject) => {
      //Check if username is not taken
      if(await userExists()) return reject('Username is already taken');

      //Create the user
      user.create(username, password, (ack: any) => {
        if(ack.err) {
          return reject(ack.err);
        }
        else resolve();
      });
    })

  }



  const handler = (event: SubmitEvent) => {

    //Check the submitbutton used
    let buttonValue: string = (<HTMLInputElement>event.submitter).value;

    //The user tried logging in
    attemptedLogin = true;

    (async() => {
      try {
        //User tries logging in
        if(buttonValue == "Let's chat") await login();
        if(buttonValue == "Try again") await login();
        if(buttonValue == "Register instead") await register();
      }
      catch(err) {
        errorMsg = err;
      }
    })();


  }

</script>

<div class="login">
  <h2>Welcome to the future</h2>
  <div class="icon">
    <img src={dab} alt="dab icon">
  </div>
  <form id="form" on:submit|preventDefault={handler}>
    <input type="text" id="username" placeholder="Username" bind:value={username} />
    <input type="password" id="password" placeholder="Password" bind:value={password} />
    {#if errorMsg}
      <p style="color: red;">{errorMsg}</p>
    {/if}
    {#if !attemptedLogin}
      <input type="submit" value="Let's chat">
    {:else}
      <input type="submit" value="Try again">
      <input type="submit" value="Register instead">
    {/if}
    
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
    max-width: 280px;
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