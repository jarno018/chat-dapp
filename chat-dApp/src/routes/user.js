import GUN from 'gun';
import 'gun/sea';
import { writable } from 'svelte/store';

// Init the DB with relay/signaling server
export const gun = GUN({peers: ['http://10.129.36.97:8765/gun']});

// Make the user
export const user = gun.user().recall({sessionStorage: true});

// Export writable we can listen to
export const username = writable('');

// If the username changes, set it for the listeners
gun.get('alias').on((name) => username.set(name));

// If data changes
gun.on(async (event) => {
  const username = await user.get('alias');
  username.set(username);

  console.log(`signed in as ${username}`);
});