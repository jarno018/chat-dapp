import GUN from 'gun';
import 'gun/sea';
import { writable } from 'svelte/store';

// Init the DB with relay/signaling server
export const gun = GUN({peers: ['http://10.129.36.97:8765/gun']}); //TODO fix the server

// Make the user
export let user = gun.user().recall({sessionStorage: true});

// Export writable we can listen to
export const username = writable('');

//If auth state changes
gun.on('auth', async () => {

  //User is logged in
  if(user.is) {
    username.set(await user.get('alias'));
  }
  else {
    username.set('');
  }

});