import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormInput from './form-input.component';
import { connect } from 'react-redux';
import { editUser } from '../redux/user/user.action';
import Loading from './loader.component';
import { useHistory } from "react-router-dom";

function UserInfo({
    editUser,
    currentUser
    }) {
    
    const history = useHistory();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUserData] = useState({
        bio: '',
        occupation: '',
        location: '',
        dateOfBirth: Date.now()
    })

    useEffect(() => {
        window.addEventListener('resize', setIsMobileHandler)
        return () => {
            window.removeEventListener('resize', setIsMobileHandler)
        }
    }, [])

    function setIsMobileHandler() {
        setIsMobile(window.innerWidth <= 600)
    }

    function onSubmitHandler(e) {
        setSubmitting(true)
        e.preventDefault()
        const userId = currentUser._id
        editUser(user, userId)
        .then(() => {
            setSubmitting(false)
            history.push("/");
        })
        .catch((e) => {
            setSubmitting(false)
        })
    }

    function onChangeHandler(e){
        const {name, value} = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    return (
        <div className="register user-info">
            {submitting && <Loading/>}
            <form className='form' onSubmit={onSubmitHandler} >
                <div className='form__group'>
                    <textarea
                        cols='3'
                        name='bio'
                        rows='10'
                        value={user.bio}
                        onChange={onChangeHandler}
                        placeholder='Write your bio here'
                        required
                        className='form__textarea' />
                </div>
                <FormInput 
                    label='Occupation'
                    name='occupation'
                    handleChange={onChangeHandler}
                    type='text'
                    isMobile={isMobile}
                    value={user.occupation}
                    required />
                <FormInput 
                    label='Location'
                    name='location'
                    handleChange={onChangeHandler}
                    type='text'
                    isMobile={isMobile}
                    value={user.location}
                    required />
                <div className='form__component'>
                    <div className='form__group'>
                        <input
                            name='dateOfBirth'
                            type='date'
                            onChange={onChangeHandler}
                            className='form__input' 
                            required
                            />
                        <label htmlFor='dateOfBirth' className='form__label'>
                            Date of Birth
                        </label>
                    </div>
                </div>
                <input type='submit' 
                    className="button button--submit"
                    value='Submit' 
				/>
            </form>
        </div>
    )
}

UserInfo.propTypes = {
    editUser: PropTypes.func,
    currentUser: PropTypes.object
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

const mapDispatchToProps = {
    editUser
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo)


