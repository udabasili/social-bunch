import React, {useState} from 'react'
import {Redirect} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faPhone, faIndustry, faInfo } from '@fortawesome/free-solid-svg-icons'
import ContentEditable from "react-contenteditable";
import { editUser } from '../../redux/action/user.action';
import {connect} from "react-redux";



class ProfilePage extends React.Component {


  state = {
    user:{
    _id:"",
    username:"",
    userImage:"",
    telephone:"Add phone",
    bio:"Add bio  here",
    occupation:"Add Occupation",
    location:"add location",
    joined:""
    },
    success:null

  }

    componentDidMount(){
      if (this.props.history.location.state){ 
        let userData = this.props.history.location.state.userData.friend;
        this.setState({
          _id: userData._id,
          username: userData.username,
          userImage: userData.userImage,
          joined: userData.createdAt.split("T")[0]
        })

      }
      else{
        this.props.history.push("/")
      }
     
    }

  onSubmitHandler = () =>{
    let userData = {}
    for (let x in this.state.user){      
      if(x !== "joined" && x !== "_id"){
        userData[x]  = this.state[x]

      }
    }

    this.props.editUser(userData)
      .then((response)=>this.setState({
        success: response.success})
      )

    
  }
  onChangeBioHandler = (e) =>{
    this.setState({bio:e.target.value})
   
   
 }
   onChangeTelephoneHandler = (e) =>{
     this.setState({telephone:e.target.value})
    
    
  }
  onChangeLocationHandler = (e) =>{
    this.setState({location:e.target.value})

    
  }

  onChangeOccupationHandler = (e) =>{
    this.setState({occupation:e.target.value})

    
  }

  

  render(){
    const{
      _id,
      userImage,
      username,
      location,
      joined,
      bio,
      telephone,
      occupation,
      
    } = this.state;   
  return (
    this.props.history.location.state.userData ?
      <div className="user-profile">
        <div className="user-profile__row">
          <div className="user-profile__third">
            <div className="user-profile__card">
              <div className="user-profile__display">
                <img 
                  src={userImage} 
                  className="user-profile__display__image"
                  alt="Avatar"/>
                <div className="user-profile__display__user" >
                  <input type="hidden" name="id" value={_id}/>
                  <h2>{username}</h2>
                </div>
              </div>
              <div className="user-profile__information">
              <div>Joined: {joined} </div>
                <div><FontAwesomeIcon icon={faHome}/>
                <ContentEditable
                    html={location}
                    disabled={false} // use true to disable edition
                    onChange={this.onChangeLocationHandler} // handle innerHTML change
                  /></div>
                <div><FontAwesomeIcon icon={faPhone}/><ContentEditable
                    
                    html={telephone}
                    disabled={false} // use true to disable edition
                    onChange={this.onChangeTelephoneHandler} // handle innerHTML change
                  /></div>
                <div><FontAwesomeIcon icon={faIndustry}/><ContentEditable
                    html={occupation}
                    disabled={false} // use true to disable edition
                    onChange={this.onChangeOccupationHandler} // handle innerHTML change
                  /></div>
              </div>
            </div>
          </div>
          <div className="user-profile__two-third">
            <div className="user-profile__bio">
              <h2 className=""> <FontAwesomeIcon icon={faInfo}/> Bio</h2>
              <ContentEditable
                className="user-profile__bio__content" 
                html={bio}
                disabled={false} // use true to disable edition
                onChange={this.onChangeBioHandler} // handle innerHTML change
              />
              <div className="form-button" onClick={this.onSubmitHandler} >Submit</div> 
            </div>   
          </div>
        </div>
      </div> :
      <Redirect to="/"/>

      )
  }
    }


  const mapStateToProps = (dispatch) =>({
    editUser: userData => dispatch(editUser(userData))
 })
 


export default connect(null , mapStateToProps)(ProfilePage);