import React from "react"
import VideoComponent from "./video-component"

const Main = () => {
    return (
      <div className="video-call">
        <header>
          <h1>Incall with ...</h1>
        </header>
        <main className="video-call__main">
          <p><VideoComponent/></p>
        </main>
        <footer>
        </footer>
      </div>
    );
  };
  
export default Main