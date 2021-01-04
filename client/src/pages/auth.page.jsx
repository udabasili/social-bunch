import React, { PureComponent } from 'react';
import {Login, SignUp, setAllUsers } from '../redux/action/user.action';
import {withRouter, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import { removeError } from '../redux/action/errors.action';
import validator from '../components/validator';
import { getOnlineUsers, setSocket, getAllUsers } from '../services/socketIo';
import {isMobile} from 'react-device-detect';
import AuthImage from '../assets/images/alexander-andrews-JYGnB9gTCls-unsplash.jpg'
import Loader from '../components/loader.component';
import FormInput from '../components/form-input.component';
import { toast } from 'react-toastify';

/**
 * Class representing authentication form for user
 */
class Auth extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
		loggedIn:false,
		isLoading: false,
		disableSubmitButton: true,
        auth: props.auth || 'register',
        error:null,
        isMobile:isMobile,
        loginData: {
          email: '',
          password: '',
        },
        registerData: {
          username: {
			value: '',
			focused: false,
			validated: false
          },
          email: {
            validated: false,
            value: '',
            focused:false
          },
          password: {
            validated: false,
            value: '',
            focused:false

          },
          confirmPassword: {
            validated: false,
            value: '',
            focused:false
            },
          },
		imageFile:'',
		imageUploaded: false
      }

    }
	componentDidMount(){
		window.addEventListener('resize', this.setIsMobile)
	}

	componentDidUpdate(prevProps){
		if(this.props.auth !== prevProps.auth){
		this.setState((prevState) =>({
			...prevState,
			auth: this.props.auth
		})
		)
		}
	}

	componentWillUnmount(){
		window.removeEventListener('resize', this.setIsMobile)
	}
	
	/**
	 * Changes state as user types based in the login component tag name and value 
	 * @param {*} e 
	 */
	onChangeHandlerLogin =(e) =>{
		let {name, value} = e.target;
		this.setState((prevState)=>({
		...prevState,
		loginData:{
			...prevState.loginData,
			[name]:value
		}
		}))
	}

	setIsMobile = () =>{
		this.setState((prevState) => ({
		...prevState,
		isMobile: window.innerWidth <= 600
		}))
	}

	/**
	 * Changes state as user types based in the register component tag name and value 
	 * @param {*} e 
	 */
	onChangeHandlerRegister = (e) =>{
		const {name, value} = e.target;
		const updatedControls = {
			...this.state.registerData
		};
		const updatedFormElement = {
			...updatedControls[name]
		};
		updatedFormElement.value = value;
		updatedFormElement.touched = true;
		updatedFormElement.validated = validator(name,
			name === 'confirmPassword' ?  {
				password:this.state.registerData.password.value,
				confirm: value
				} : value)

		updatedControls[name] = updatedFormElement;
		let formIsValid = true;
		for (let inputIdentifier in updatedControls) {
			formIsValid = updatedControls[inputIdentifier].validated;
		}

		this.setState({
			registerData: updatedControls,
			disableSubmitButton: !formIsValid
		});
	}
	
	/**
	 * Submits either through the login link or the register link 
	 * based on the current auth state value
	 * @param {*} e 
	 */
	onSubmitHandler = (e) =>{
		e.preventDefault()
		this.setState(prevState =>({
			...prevState,
			isLoading: true
		}))
		let userData = {
			username:this.state.registerData.username.value,
			email:this.state.registerData.email.value,
			password: this.state.registerData.password.value,
			confirmPassword: this.state.registerData.confirmPassword.value,
		}
		const header = {
		headers: {
			'content-type': 'multipart/form-data'
			}
		};
		switch (this.state.auth) {
		case 'register':
			if(!this.state.imageFile){
				toast.error('Please Upload Image')
				return;
			}
			this.props.SignUp(header, this.state.imageFile, userData)
			.then((response) =>{
				getOnlineUsers()
				setSocket(response.username)
				getAllUsers()
				this.setState(prevState => ({
					...prevState,
					isLoading: false
				}))
				this.props.history.push(`/profile/${response._id}/add`)
			})
			.catch((error) =>{
				this.setState(prevState => ({
					...prevState,
					isLoading: false
				}))
			})
			break;
		case 'login':
			this.props.Login(this.state.auth, this.state.loginData).then((response)=>{
			getOnlineUsers()
			setSocket(response)
				.catch((error) => {
					this.setState(prevState => ({
						...prevState,
						isLoading: false
					}))
				})
			this.props.history.push('/')
			}).catch((error) => {
				this.setState(prevState => ({
					...prevState,
					isLoading: false
				}))
			})
			
			break;
		default:
			break;
		}
	}

	/**
	 * Handles the uploading and reading of the image file
	 * @param {*} 
	 */
	onImageUploadHandler = () =>{
		let fileUpload = document.querySelector('.image-upload__input');
		let filePath = document.querySelector('.image-upload__message');
		fileUpload.click()
		fileUpload.onchange =  () => {
		let fileName = fileUpload.value.split('\\')[fileUpload.value.split('\\').length - 1];
		filePath.value = fileName
		this.setState((prevState, props) => ({
			...prevState,
			imageFile:fileUpload.files[0],
			imageUploaded: true
			})
		)  
		};
	}

	
	changeAuthState = (value)=>{
		this.props.removeError()
		this.setState({auth:value})
	}

	render() {
		const { errors } = this.props;
		const {auth, registerData, loginData, isMobile, disableSubmitButton, isLoading } = this.state;

		return (
			<div className='auth-page'>
				{isLoading && <Loader/>}
				<div className="auth-page__left-section">
					<div className="auth-page__header">
						<span className='primary-header'>Simply Chat</span>
					</div>
					<nav className='form-nav'>
						<ul className="form-nav__list">
							<li className="form-nav__item">
								<NavLink className="form-nav__link" activeClassName='active-auth' to='/auth/login'>login </NavLink>
							</li>
							<li className="form-nav__item">
								<NavLink className="form-nav__link" activeClassName='active-auth' to='/auth/register'>signUp </NavLink>
							</li>

						</ul>
					</nav>
					<form className='form' onSubmit={this.onSubmitHandler} >
						{(auth === 'register') ?
							<div className='form__inner'>
								<div className='alert-error'>{
									errors.message === "Email doesn't exist. Please Register" ?
										<div>
											<span>Email doesn't exist. Please </span>
											<span
												className='switch-auth'
												style={{ color: 'blue', cursor: 'pointer' }}
												onClick={() => this.changeAuthState('register')}> Register </span>
										</div> : errors.message
									}
								</div>
								<FormInput 
									handleChange={this.onChangeHandlerRegister}
									label='Username'
									name='username'
									type='text'
									isMobile={isMobile}
									value={registerData.username.value}
									validated={registerData.username.validated}
									required />
								<FormInput 
									handleChange={this.onChangeHandlerRegister}
									label='Email'
									name='email'
									type='email'
									isMobile={isMobile}
									value={registerData.email.value}
									validated={registerData.email.validated}
									required />
								<FormInput 
									handleChange={this.onChangeHandlerRegister}
									label='Password (Must be at least 8 characters)'
									name='password'
									type='password'
									isMobile={isMobile}
									value={registerData.password.value}
									validated={registerData.password.validated}
									required />
								<FormInput
									handleChange={this.onChangeHandlerRegister}
									label='Confirm password'
									name='confirmPassword'
									type='password'
									isMobile={isMobile}
									value={registerData.confirmPassword.value}
									validated={registerData.confirmPassword.validated}
									required />
								<div className='form__group-image'>
									<input type='file'
										className='image-upload__input'
										name='image'
										onChange={this.url} accept='image/*'  />
									<input type='text'
										className='image-upload__message'
										disabled placeholder='Upload Profile Image' />
									<button
										className='image-upload__button'
										onClick={this.onImageUploadHandler}
										type='button'> Browse
									</button>
								</div>
							</div> :
							<div className='form__inner'>
								<div className='alert-error'>{
									errors.message === "Email doesn't exist. Please Register" ?
										<div>
											<span>Email doesn't exist. Please </span>
											<span
												className='switch-auth'
												style={{ color: 'blue', cursor: 'pointer' }}
												onClick={() => this.changeAuthState('register')}> Register </span>
										</div>
										:
										errors.message
								}
								</div>
								<FormInput
									handleChange={this.onChangeHandlerLogin}
									label='Email'
									name='email'
									type='email'
									isMobile={isMobile}
									value={loginData.email}
									required />
								<FormInput
									handleChange={this.onChangeHandlerLogin}
									label='Password'
									name='password'
									type='password'
									isMobile={isMobile}
									value={loginData.password}
									required />
								
							</div>
						}
						<input type='submit' 
							className='form-submit-button' 
							value='Submit' 
							disabled={disableSubmitButton && auth === 'register' } />
					</form>
				</div>
				<div className="auth-page__right-section" style={{backgroundImage: `url(${AuthImage})`}}>
			</div>	
		</div>   
		)
	}
}

const mapStateToProp = state =>({
  errors : state.errors
})


const mapDispatchToProps = (dispatch) => ({
	Login: (auth, loginData) => dispatch(Login(auth, loginData)),
	removeError: () =>dispatch(removeError()),
	SignUp: (header, imageFile, userData) => dispatch(SignUp(header, imageFile, userData)),
	setAllUsers: (users) => dispatch(setAllUsers(users))

})

export default withRouter(connect(mapStateToProp,mapDispatchToProps)(Auth))