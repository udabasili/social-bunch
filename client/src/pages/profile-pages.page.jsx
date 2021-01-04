import React from 'react';
import {getUser } from '../redux/action/user.action';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { toast } from 'react-toastify';
import GrowLoader from '../components/grow-loader.component';

class ProfilePage extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
		currentUser: props.currentUser,
		isLoading: true,
		user:{
			_id:'',
			username: '',
			userImage:'',
			telephone: '',
			bio: '',
			occupation: '',
			location: '',
			joined:''
		},
		success:null
		}
	}
	
	closeHandler = () => {
		document.querySelector(".alert").style.display = 'none';
	}

	componentDidMount(){
		getUser(this.props.match.params.userId)
			.then((userData) =>{
				
				this.setState((prevState) => ({
					...prevState,
					user: {
						...prevState.user,
						_id: userData._id,
						username: userData.username || "",
						bio: userData.bio || "",
						location: userData.location  || "",
						telephone: userData.phoneNumber || "",
						userImage: userData.userImage,
						occupation: userData.occupation || "" ,
						isAdmin: userData.isAdmin.toString() ,
						joined: userData.createdAt.split('T')[0]
					},
					isLoading: false
				})
				)
			})
			.catch((error) =>{
				toast.error(error)
			})
			
	}



	render(){
		const{
		_id,
		userImage,
		username,
		location,
		isAdmin,
		joined,
		bio,
		telephone,
		occupation} = this.state.user;


	return (
		this.state.isLoading ? 
		<GrowLoader/> :
		<div className="profile-page" key={_id}>
			<div className="profile__third">
				<LazyLoadImage
					alt={userImage}
					src={userImage}
					className="profile__display--image"
				/>
				<h4 className="profile__display--user">
					{username}
				</h4>
				<ul className="profile__list">
					<li className='profile__item'>
						<span className='label'>Location: </span>
						<span className='value'>{location ? location.split(',')[0] : ""}</span>
					</li>
					<li className='profile__item'>
						<span className='label'>Telephone: </span>
						<span className='value'>{telephone}</span>
					</li>
					<li className='profile__item'>
						<span className='label'>isAdmin: </span>
						<span className='value'>{isAdmin}</span>
					</li>
					<li className='profile__item'>
						<span className='label'>Occupation:</span>
						<span className='value'>{occupation}</span>
					</li>
					<li className='profile__item'>
						<span className='label'>Joined: </span>
						<span className='value'>{joined}</span>
					</li>
				</ul>
			</div>
			<div className="profile__two-third">
			<div className="profile__bio">
				{bio}
			</div>
		</div>
	</div>
	) 
	}
}



export default ProfilePage