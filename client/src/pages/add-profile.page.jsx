import React, { Component } from "react"; 
import FormInput from "../components/form-input.component";
import Modal from "../components/modal-window.component";
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import { editUser, getLocation } from '../redux/action/user.action';
import { toast } from "react-toastify";
import { newUserAlert } from "../services/socketIo";

class AddProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: isMobile,
            isLoading: false,
            user: {
                phoneNumber: '',
                bio: '',
                occupation: '',
                location: '',
                dateOfBirth: Date.now()
            },
            success: null
        }
    }

    onChangeHandler = (e) => {
        let { name, value } = e.target;
        this.setState((prevState) => ({
            ...prevState,
            user: {
                ...prevState.user,
                [name]: value
            }
        }))
    }

    componentDidMount() {
        // this.getUserLocation()
        window.addEventListener('resize', this.setIsMobile)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setIsMobile)
    }

    setIsMobile = () => {
        this.setState((prevState) => ({
            ...prevState,
            isMobile: window.innerWidth <= 600
        }))
    }

    getUserLocation = () => {
        if (!navigator.geolocation) {
            return alert("Sorry this browser doesn't support geolocation")
        }

        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude
            let long = position.coords.longitude
            let coords = { lat, long }
            this.props.getLocation(coords)
                .then((res) => {
                    this.setState((prevState) => ({
                        ...prevState,
                        user:{
                            ...prevState.user,
                            location: res
                        } 
                    })
                    )
                })
        })
    }


    onSubmitHandler = (e) =>{
        e.preventDefault()
        this.props.editUser(this.state.user)
            .then(() =>{
                newUserAlert()
                this.props.history.push('/')
            }).catch((error) =>{
                toast.error(error)
            })
    }

    render() {
        const {user} = this.state
        return (
            <Modal setCloseButton={false}>
            <h2 className='secondary-header'>Add your Information</h2>
            <form className='form' onSubmit={this.onSubmitHandler} >
                <FormInput 
                    label='Telephone'
                    name='phoneNumber'
                    type='tel'
                    handleChange={this.onChangeHandler}
                    isMobile={isMobile}
                    value={user.phoneNumber}
                    required />
                <FormInput 
                    label='Occupation'
                    name='occupation'
                    handleChange={this.onChangeHandler}
                    type='text'
                    isMobile={isMobile}
                    value={user.occupation}
                    required />
                <FormInput 
                    label='Location'
                    name='location'
                    handleChange={this.onChangeHandler}
                    type='text'
                    isMobile={isMobile}
                    value={user.location}
                    required />
                <div className='form__component'>
                    <div className='form__group'>
                        <input
                            name='dateOfBirth'
                            type='date'
                            onChange={this.onChangeHandler}
                            className='form__input' />
                        <label htmlFor='dateOfBirth' className='form__label'>
                            Date of Birth
                        </label>
                    </div>
                </div>
                <div className='form__group'>
                    <textarea
                        cols='3'
                        name='bio'
                        rows='10'
                        value={user.bio}
                        onChange={this.onChangeHandler}
                        placeholder='Write your bio here'
                        required
                        className='form__textarea' />
                </div>
                <input type='submit' 
                    className='form-submit-button' 
                    value='Submit' 
					/>
            </form>
        </Modal>
        );
    }
}



const mapDispatchToProps = dispatch => ({
    getLocation: (coords) => dispatch(getLocation(coords)),
    editUser: (userData) => dispatch(editUser(userData))
})


export default connect(null, mapDispatchToProps)(AddProfile);