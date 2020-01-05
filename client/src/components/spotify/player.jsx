import React,{useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMinimize, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";

const Player = props => {
  const [minimize, setMinimized] = useState(true)

  const minimizeWindow = () =>{
    let spotify =  document.querySelector('.spotify');
    setMinimized(!minimize)
    if(spotify){
      console.log(minimize);
      
      spotify.style.height = minimize ? "10vh" : "35vh"
      }
  
  }
  return (
      <div className="spotify">
        <div className="spotify__row">
          <div className="column middle">
            <input type="search" placeholder="Search Music....."/>
          </div>
          <div className="spotify__column">
            <span onClick={minimizeWindow} className="dot minimize">
              { minimize ? 
                <FontAwesomeIcon icon={faWindowMinimize}/>  :
                <FontAwesomeIcon icon={faPlus}/>
              }
            </span>
            <span className="dot close">
              <FontAwesomeIcon icon={faTimes}/>
            </span>
          </div>
        </div>
        <div className="content">
          <iframe className="spotify__iframe" allowTransparency="true" allow="encrypted-media" src={props.albums.external_urls.spotify.replace("/album/","/embed/album/")} frameborder="0" width="300" height="300"></iframe>
        </div>
      </div>
      );
}
export default Player;