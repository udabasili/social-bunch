import React, { Component } from 'react'
import Login from '../components/login.component';
import Register from '../components/register.component';
import { ReactComponent as AppIcon } from '../assets/icons/instagram.svg';
import ImageUpload from '../components/image-upload.component';
import UserInfo from '../components/users-info.component';
import PropTypes from 'prop-types';


export class AuthPage extends Component {

    constructor(props){
        super(props);
        this.state={
            authType: 'login',
            authenticationStep: Object.keys(props.currentUser).length > 0 ?
                props.currentUser.nextRoute : 
                'start'
        }
    }

    componentDidUpdate(prevProps, prevState){
        const { currentUser } = this.props;
        console.log(currentUser)
        if(prevProps.currentUser !== currentUser){
            this.setState({
                authType: 'login',
                authenticationStep: Object.keys(currentUser).length > 0 ? 
                    currentUser.nextRoute : 
                    'start'
            })
        }
    }

    authChangeHandler = (type) => {
        const authCover = document.querySelector('.auth__cover');
        const login = document.querySelector('.login');
        const register = document.querySelector('.register');
        if (type === 'register') {
            authCover.style.left = 0
            authCover.style.right = 'unset'
            login.style.display = 'none'
            register.style.display = 'flex'
        } else {
            authCover.style.right = 0
            authCover.style.left = 'unset'
            register.style.display = 'none'
            login.style.display = 'flex'
        }

        this.setState({
            authType: type
        })
    }

    handleAuthenticationStep = (type) => {
        this.setState({
            authenticationStep: type
        })
    }

    render() {
        const { authenticationStep } = this.state;
        
        return (
            <div className="auth-page">
                <div className="app-title-mobile">
                    <AppIcon className="app-icon"/>
                    <span className="primary-header">
                        Social Brunch
                    </span>
                </div>
                <div className="auth">
                    <div className="auth__cover">
                        <AppIcon className="app-icon"/>
                        <span className="primary-header">Social Brunch</span>
                        <span className="secondary-header">..... Join the crowd</span>
                    </div>
                    {
                        authenticationStep === "start" &&
                        <React.Fragment>
                            <Login 
                                authChangeHandler={this.authChangeHandler}
                                handleAuthenticationStep={this.handleAuthenticationStep}
                                
                                />
                            <Register 
                                authChangeHandler={this.authChangeHandler}
                                handleAuthenticationStep={this.handleAuthenticationStep}
                                />
                        </React.Fragment>
                    }
                    {
                        authenticationStep === "image" &&
                            <ImageUpload
                                handleAuthenticationStep={this.handleAuthenticationStep}
                            />
                    }
                    {
                        authenticationStep === "user-info" &&
                        <UserInfo/>
                    }
                </div>
            </div>
        )
    }
}

AuthPage.propTypes = {
    currentUser: PropTypes.object,

}

export default AuthPage
