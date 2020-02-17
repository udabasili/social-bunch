/**
  * @desc spotify configurations
  

*/
export const authEndpoint = "https://accounts.spotify.com/authorize";
export const clientId = process.env.REACT_APP_SPOTIFY_CLIENT;
export const redirectUri = "http://localhost:3000";
export const scopes = [
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
];