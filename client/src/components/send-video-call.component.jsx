import React, { Component } from "react"; 
import {  AiFillPhone } from "react-icons/ai";
var myHostname = window.location.hostname;
if (!myHostname) {
  myHostname = "localhost";
}


class SendVideoCall extends Component {
	

	render() {
		const {recipient,  makeVideoCall} = this.props;
		const {callAccepted} = this.state
		return (
		 	<React.Fragment> 
				 <div className="video-container">
						 {callAccepted ?
						 	<React.Fragment>
								<video ref={this.recipientVideo} autoPlay className="remote-video" id="remote-video"></video> 
								<div className='video-container__buttons'>
									<div className='video-container__button reject'>
										<AiFillPhone/>
									</div>
								</div>
								<div className='video-container__time'>
									<span>2:00</span>
								</div>
							 </React.Fragment> :
							<div className='video-calling'>
								<img className='video-calling__receiver' src={recipient.image} alt='user-being-called'/>
								<div className='video-calling__buttons'>
									<div className='video-calling__button reject' onClick={() => makeVideoCall(null, false)}>
										<AiFillPhone/>
									</div>
								</div>
							</div>
							 

						 }
						<video ref={this.ourVideo} autoPlay muted className="local-video" id="local-video"></video>
						
				</div>
				 {/* {
					 callAccepted ?
					 <div></div> :
					 <div className='video-calling'>
						<img className='video-calling__receiver' src={recipient.image} alt='user-being-called'/>
						<div className='video-calling__sender'>
							<img className='video-calling__receiver' src={currentUser.userImage} alt='user-being-called'/>
						</div>
						<div className='video-calling__buttons'>
							<div className='video-calling__button reject' onClick={() => makeVideoCall(null, false)}>
								<AiFillPhone/>
							</div>
						</div>
					</div>

				 } */}
				 
		 </React.Fragment>
		);
	}
}

export default SendVideoCall;