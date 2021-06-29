import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { GrFormLocation } from 'react-icons/gr';
import { connect } from 'react-redux'
import Loading from './loader.component';
import { populate } from 'react-redux-firebase'

const populates = [
	{
		child: 'friends',
		root: 'users'
	},
]
const UserSummary = ({
    showAllUsers,
    userRecord,
    }) => {

    const [user, setUser] = useState(null)
    useEffect(() => {
        if (userRecord) {
                setUser({
                    ...userRecord
                })
            
        }
    }, [userRecord])

    return (
        <div className="user-summary">
            <div className="user-summary__button">
                <IoCloseCircleSharp onClick={() => showAllUsers(true)}/>
            </div>
            {
                user ? 
                    <div className="user-summary__user">
                        <img 
                            src = {
                                user.image || "https://img.icons8.com/ios/50/000000/user-male-circle.png"
                            }
                            className="user-photo"
                            alt={user.username}/>
                        <span className="username">
                            {user.username}
                        </span>
                        <span className="location">
                            <GrFormLocation/>
                            {user.location}
                        </span>
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


const mapStateToProps = (state, ownProps) => {
    let userRecord;
    const data = state.firestore.data.allUsers;
    const selectedUser = ownProps.selectedUser;
    if (selectedUser && data[selectedUser]) {
        userRecord = populate(state.firestore, 'allUsers', populates)
        userRecord = userRecord[selectedUser]
    } else {
        userRecord = null;
    }
    return {
        userRecord,
        currentUser: state.user.currentUser

}}

export default connect(mapStateToProps, null)(UserSummary)
