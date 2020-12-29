import React, { Component } from "react"; 
import Events from "../components/events.components";
import HomeAside from "../components/home-aside.component";

class EventPage extends Component {
  render() {
    return (
        <React.Fragment>
            <HomeAside>
                <h1 className='secondary-header'>Events</h1>
                <Events/>
            </HomeAside>
        </React.Fragment>
    );
  }
}

export default EventPage;