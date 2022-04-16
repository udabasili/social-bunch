import { database } from "@/lib/fuego";
import { getAuth } from "firebase/auth";
import { onDisconnect, onValue, ref, serverTimestamp, set  } from "firebase/database"

export function checkOnlineStatus() {
    // [START checkOnlineStatus]
    // Fetch the current user's ID from Firebase Authentication.
    const auth = getAuth()
    var uid = auth.currentUser?.uid;

    if (uid) {
        // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
    const userStatusDatabaseRef = ref(database, 'status/' + uid);


    // We'll create two constants which we will write to 
    // the Realtime database when this device is offline
    // or online.
    var isOfflineForDatabase = {
        state: 'offline',
    };

    var isOnlineForDatabase = {
        state: 'online',
    };

    // Create a reference to the special '.info/connected' path in 
    // Realtime Database. This path returns `true` when connected
    // and `false` when disconnected.
    onValue(userStatusDatabaseRef, (snapshot) => {

        // If we're not currently connected, don't do anything.
        // eslint-disable-next-line eqeqeq
        if (snapshot.val() == false) {
            return;
        };
        

        // If we are currently connected, then use the 'onDisconnect()' 
        // method to add a set which will only trigger once this 
        // client has disconnected by closing the app, 
        // losing internet, or any other means.
        onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(function() {
            // The promise returned from .onDisconnect().set() will
            // resolve as soon as the server acknowledges the onDisconnect() 
            // request, NOT once we've actually disconnected:
            // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

            // We can now safely set ourselves as 'online' knowing that the
            // server will mark us as offline once we lose connection.
            set(userStatusDatabaseRef, isOnlineForDatabase)
              
        });
    });
    // [END checkOnlineStatus]
    }

    
}
