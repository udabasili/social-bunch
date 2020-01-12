import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {Login, SignUp } from "../../redux/action/user.action";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import { removeError } from '../../redux/action/errors.action';


class Auth extends Component {
    state={
        loggedIn:false,
        auth:"register",
        error:null,
        userData: {
          username:"",
          email:"",
          password:"",
          confirmPassword:"",
          },
        imageFile:""

    }

    componentWillMount(){
      this.props.removeError()
    }

    //update state based on name to input
    onChangeHandler = (e) =>{
      let name = e.target.name
      let value = e.target.value
      this.setState((prevState)=>({
        ...prevState,
        userData:{
          ...prevState.userData,
          [name]:value
          }
        })
      )
    }

    onSubmitHandler = (e) =>{
      e.preventDefault()
      const header = {
        headers: {
            'content-type': 'multipart/form-data'
          }
      };

      switch (this.state.auth) {
        case "register":
          this.props.SignUp(header, this.state.imageFile, this.state.userData)
            .then((response) =>{
                  this.setState({auth: "login"})
                })
          break;
        case "login":
          this.props.Login(this.state.auth, this.state.userData).then(()=>{
            this.props.history.push("/")
          })
            
          break;
        default:
          break;
      }
      
    }

    onImageUploadHandler = () =>{
      let fileUpload = document.querySelector(".image-upload__input");
      let filePath = document.querySelector(".image-upload__message");
      fileUpload.click()
      fileUpload.onchange =  () => {
        let fileName = fileUpload.value.split('\\')[fileUpload.value.split('\\').length - 1];
        filePath.value = fileName
        this.setState((prevState, props) => ({
          ...prevState,
            imageFile:fileUpload.files[0]
          })
        )  
      };
    }

    changeAuthState = (value)=>{
      this.props.removeError()
      this.setState({auth:value})
    }

  render() {
    const { errors,history, removeError } = this.props;
    
    
    const{auth, userData } = this.state;
    //if there is any change in route remove previous error
    history.listen(() =>{
       removeError()
    })

    return (
      <div className="auth-container">
        <form className="form" onSubmit={this.onSubmitHandler} >

        <div className="primary-header form__header">{auth}</div>
        <div className="alert-error">{
          errors.message === "Email doesn't exist. Please Register" ? 
          <div>
          <span>Email doesn't exist. Please </span>
          <span 
            className="switch-auth" 
            style={{color:"blue", cursor:"pointer"}} 
            onClick={()=>this.changeAuthState("register")}> Register </span>
          </div>
           :
          errors.message
          }</div>
        {(auth === "register") &&
        <div className="form__component">
            <i className="form__group__icon"><FontAwesomeIcon icon={faUser}/></i>
            <div className="form__group">
              <input 
                type="text" 
                name="username" 
                onChange={this.onChangeHandler} 
                value={userData.username}
                className="form__input" required/>
              <label htmlFor="username" className="form__label">
                Username
              </label>
            </div>
          </div>
        }
          
          <div className="form__component">
            <i className="form__group__icon">
              <FontAwesomeIcon icon={faEnvelope}/>
            </i>
            <div className="form__group">
              <input 
                type="email"  
                onChange={this.onChangeHandler}
                value={userData.email}
                name="email" 
                className="form__input" required/>
              <label htmlFor="email" className="form__label">Email</label>
            </div>
          </div>
          <div className="form__component">
          <i className="form__group__icon"><FontAwesomeIcon icon={faKey}/></i>
            <div className="form__group">
              <input 
                type="password" 
                name="password" 
                onChange={this.onChangeHandler}
                value={userData.password}
                className="form__input" required/>
              <label htmlFor="password" className="form__label">Password</label>
            </div>
          </div>
          {(auth === "register") &&(
            <div>
              <div className="form__component">
                <i className="form__group__icon">
                  <FontAwesomeIcon icon={faKey}/>
                </i>
              <div className="form__group">
                <input 
                  type="password" 
                  name="confirmPassword" 
                  onChange={this.onChangeHandler}
                  value={userData.confirmPassword}
                  className="form__input" required/>
                <label htmlFor="confirm-password" className="form__label">Confirm Password</label>
              </div>
            </div>
            <div className="form__group-image">
              <input type="file" 
                className="image-upload__input" 
                name="image" 
                onChange={this.url}  accept="image/*"/>
              <input type="text" 
                className="image-upload__message" 
                disabled placeholder="Upload Profile Image"/>
              <button 
                className="image-upload__button" 
                onClick={this.onImageUploadHandler}
                type="button"> Browse</button>
            </div>
          </div>
            )
          }
          <input type="submit" className="form-submit-button" value="Submit"/>
        </form>
        {(auth === "register") &&
        <div className="login-signup">
            <span>Registered Already? </span>
            <span className="switch-auth" onClick={() => this.changeAuthState("login")}>Log In</span>
          </div>
        }
        
      </div>
        
    )
  }
}

const mapStateToProp = state =>({
  errors : state.errors
})

export default withRouter(connect(mapStateToProp, {Login, removeError, SignUp})(Auth))