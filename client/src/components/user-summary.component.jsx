import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { GrFormLocation } from 'react-icons/gr';
import { connect } from 'react-redux'
import { getUserById } from '../redux/users/users.action';
import Loading from './loader.component';
import { toast } from 'react-toastify';

const UserSummary = ({
    showAllUsers,
    selectedUser,
    currentUser
    }) => {

    const [user, setUser] = useState(null)

    const showAddButton = (userId) => {

        const getFriendsLength = currentUser.friends.filter((friend) => {
            return userId === friend._id
        }).length

        if (currentUser._id !== userId && getFriendsLength === 0) {
            return (
                <span className="button button--wide">
                    Add Friend
                </span>
            )
        }
    }

    useEffect(() => {
        
        getUserById(selectedUser)
            .then((response) => {
                setUser(response)
            })
            .catch((error) =>{
                toast.error('Something went wrong. Try again later')
                setUser([])
            })
    }, [selectedUser])

    return (
        <div className="user-summary">
            <div className="user-summary__button">
                <IoCloseCircleSharp onClick={() => showAllUsers(true)}/>
            </div>
            {
                user ? 
                    <div className="user-summary__user">
                        <img 
                            src={user.userImage} 
                            className="user-photo"
                            alt={user.username}/>
                        <span className="username">
                            {user.username}
                        </span>
                        <span className="location">
                            <GrFormLocation/>
                            {user.location}
                        </span>
                        { showAddButton(user._id)}
                    </div>
                :
                <Loading/>
            }
        </div>
    )
}


UserSummary.propTypes = {
    showAllUsers: PropTypes.func,
    selectedUser: PropTypes.string,
    currentUser: PropTypes.object

};


const mapStateToProps = (state) => ({
    users: state.users.allUsers,
    currentUser: state.user.currentUser

})


export default connect(mapStateToProps, null)(UserSummary)
