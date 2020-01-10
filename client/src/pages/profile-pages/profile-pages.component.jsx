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
    bio:"Add bio here",
    occupation:"Add Occupation",
    location:"Add location",
    joined:""
    },
    success:null

  }

    componentDidMount(){
      if (this.props.history.location.state){ 
        let userData = this.props.history.location.state.userData;
        this.setState((prevState) => ({
          ...prevState,
          user:{
            ...prevState.user,
            _id: userData._id,
            username: userData.username,
            bio: userData.bio || "Add bio here",
            location: userData.location || "Add location",
            telephone: userData.telephone|| "Add phone",
            userImage: userData.userImage,
            occupation:userData.location || "Add Occupation",
            joined: userData.createdAt.split("T")[0]
            }
          })
        )
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
    this.setState((prevState) => ({
      ...prevState,
      user:{
        ...prevState.user, 
        bio:e.target.value
        }
      })
    )
  }


   onChangeTelephoneHandler = (e) =>{
    this.setState((prevState) => ({
      ...prevState,
      user:{
        ...prevState.user, 
        telephone:e.target.value
        }
      })
    )
  }
    
  

  onChangeLocationHandler = (e) =>{
    this.setState((prevState) => ({
      ...prevState,
      user:{
        ...prevState.user, 
        location:e.target.value
        }
      })
    )
  }

  onChangeOccupationHandler = (e) =>{
     this.setState((prevState) => ({
      ...prevState,
      user:{
        ...prevState.user, 
        occupation:e.target.value
        }
      })
    )
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
      occupation} = this.state.user

      const {currentUser} = this.props

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
                    disabled={!(currentUser.username === username)} 
                    onChange={this.onChangeLocationHandler} 
                  /></div>
                <div><FontAwesomeIcon icon={faPhone}/><ContentEditable
                    
                    html={telephone}
                    disabled={!(currentUser.username === username)} 
                    onChange={this.onChangeTelephoneHandler} 
                  /></div>
                <div><FontAwesomeIcon icon={faIndustry}/><ContentEditable
                    html={occupation}
                    disabled={!(currentUser.username === username)} 
                    onChange={this.onChangeOccupationHandler} 
                  /></div>
              </div>
            </div>
          </div>
          <div className="user-profile__two-third">
          {this.state.success && 
            <div className="alert-success">{this.state.success}</div>}
            <div className="user-profile__bio">
              <h2 className=""> <FontAwesomeIcon icon={faInfo}/> Bio</h2>
              <ContentEditable
                className="user-profile__bio__content" 
                html={ bio}
                disabled={!(currentUser.username === username)} 
                onChange={this.onChangeBioHandler} 
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


  const mapDispatchToProps = (dispatch) =>({
    editUser: userData => dispatch(editUser(userData))
 })
 
 const mapStateToProps = (state) =>({
  currentUser:state.user.currentUser,
})


export default connect(mapStateToProps , mapDispatchToProps)(ProfilePage);