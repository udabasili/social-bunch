import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {Login, SignUp } from "../../nodeserver/node.utils"
import {setCurrentUser, setAllUsers } from "../../redux/action/user.action";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
class Auth extends Component {
    state={
        loggedIn:false,
        auth:"signUp",
        error:null,
        userData: {
          username:"",
          email:"",
          password:"",
          confirmPassword:"",
          },
        imageFile:""

    }

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
        case "signUp":
          SignUp(header, this.state.imageFile, this.state.userData)
            .then((response) =>{
                if(response.data.status === 200){
                  this.setState({auth: "login"})
                }
              }
            )

          break;
        case "login":
            Login(this.state.userData)
              .then((response)=>{                                
                if (response.status !== 404 && response.status !== 500){
                  this.props.setCurrentUser(response)
                  this.props.history.push("/")
                  return;
                }
                this.setState({error: response.data.error.message})
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
        console.log()
        this.setState((prevState, props) => ({
          ...prevState,
            imageFile:fileUpload.files[0]
          })
        )  
      };
    }

    changeAuthState = ()=>{
      this.setState({auth:"login"})
    }

  render() {
    return (
      <div className="auth-container">
        <form className="form" onSubmit={this.onSubmitHandler} >

        <div className="primary-header form__header">{this.state.auth}</div>
        <div>{this.state.error}</div>
        {(this.state.auth === "signUp") &&
        <div className="form__component">
            <i className="form__group__icon"><FontAwesomeIcon icon={faUser}/></i>
            <div className="form__group">
              <input 
                type="text" 
                name="username" 
                onChange={this.onChangeHandler} 
                value={this.state.userData.username}
                className="form__input"/>
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
                value={this.state.userData.email}
                name="email" 
                className="form__input"/>
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
                value={this.state.userData.password}
                className="form__input"/>
              <label htmlFor="password" className="form__label">Password</label>
            </div>
          </div>
          {(this.state.auth === "signUp") &&(
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
                  value={this.state.userData.confirmPassword}
                  className="form__input"/>
                <label htmlFor="confirm-password" className="form__label">Confirm Password</label>
              </div>
            </div>
            <div className="form__group-image">
              <input type="file" className="image-upload__input" name="image" onChange={this.url}  accept="image/*"/>
              <input type="text" className="image-upload__message" disabled placeholder="Upload Profile Image"/>
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
        {(this.state.auth === "signUp") &&
        <div className="login-signup">
            <span>Registered Already? </span>
            <span className="switch-auth" onClick={this.changeAuthState}>Log In</span>
          </div>
        }
        
      </div>
        
    )
  }
}

const mapDispatchToProps = (dispatch) =>({
  setCurrentUser: user => dispatch(setCurrentUser(user)),

})
export default withRouter(connect(null, mapDispatchToProps)(Auth))