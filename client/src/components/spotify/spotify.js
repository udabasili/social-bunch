const SpotifyWebApi = require('spotify-web-api-node');

function getSpotify(token){
    /*
        Create the spotify iframe 
    */
   let spotify = new SpotifyWebApi({
      accessToken: localStorage.getItem("token")
    });
    spotify.getMy
    spotify.searchAlbums(`artist:${"usher"}`).then((data)=> {
      data.body.albums.items.forEach((album) =>{
          const iframe = document.createElement("iframe");
          iframe.src=album.external_urls.spotify.replace("/album/","/embed/album/");
          iframe.height = 300;
          iframe.width =300;
          iframe.frameBorder =0;
          iframe.setAttribute("allowtransparency","true");
          iframe.setAttribute("allow","encrypted-media");
          spotifyDiv.appendChild(iframe);          
             
        });
    })
    .catch((error)=>{
        alert(error);    
    });
    result.appendChild(spotifyDiv);
   
}