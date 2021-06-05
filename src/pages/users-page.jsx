import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Users from '../components/users.component';
import { firestoreConnect, populate } from 'react-redux-firebase'
import { compose } from 'redux';

const populates = [
	{
		child: 'friends',
		root: 'users'
	},
]
class UserPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            users: [],
            currentTab: 'tab1'
        }
    }

    static propTypes = {
        prop: PropTypes
    }

    switchTab = (e) => {
        const value = e.target.value
        this.setState((prevState) => ({
            ...prevState,
            currentTab: value
        }))
    }

    getUserFriends = () => {
        const currentUserFriends = this.props.currentUser.friends
        const result = this.props.users.filter(user => currentUserFriends.includes(user._id))
        return result;
    }

    render() {

        const { currentTab } = this.state;
        const { users, currentUser } = this.props;
        return (
            <div className="users-page">
                <section  className="users--left-section">
                    <div className="users__tabset">
                        <input 
                            type="radio" 
                            name="tabset" 
                            id="tab1" 
                            value="tab1"
                            onChange={this.switchTab}
                            checked={currentTab === "tab1"}
                            aria-controls="people"
                        />
                        <label for="tab1">People</label>
                        <input 
                            type="radio" 
                            name="tabset" 
                            id="tab2" 
                            value="tab2"
                            onChange={this.switchTab}
                            checked={currentTab === "tab2"}
                            aria-controls="friends" 
                        />
                        <label for="tab2">Friends</label>
                    </div>
                    <div className="users__tab-panels">
                        {
                            currentTab === 'tab1' && (
                                <div id="people" class="users__tab-panel">
                                    <Users 
                                        filteredUsers={users}
                                        currentUser={currentUser}
                                        type="Users"/>
                                </div>
                            )
                        }
                        {
                            currentTab === 'tab2' && (
                                <div id="friends" class="users__tab-panel">
                                    <Users 
                                        type="Friends"
                                        currentUser={currentUser}
                                        filteredUsers={this.getUserFriends()}
                                    />
                                </div>
                            )
                        }
                    </div>
                </section>
                <section  className="users--right-section">

                </section>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    let data = populate(state.firestore, 'allUsers', populates);
    let users = [];    
    if (data) {
        for (let key in data) {
            users.push({
                _id: key,
                ...data[key]
            })
        }
    }
    return {
        users,
        currentUser: state.firebase.profile
    }

}

export default compose(
	firestoreConnect((props) => [
		{
			collection: 'users',
            storeAs: 'allUsers'
		}
	 ]),
	connect(mapStateToProps, null)
)(UserPage);