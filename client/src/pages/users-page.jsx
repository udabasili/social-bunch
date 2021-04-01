import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Users from '../components/users.component';
import { setAllUsers } from '../redux/users/users.action'
import Socket from '../services/chat-client';


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

    componentDidMount() {
        this.socket = new Socket()
        this.socket.usersListener(this.usersListenerFunction)
    }

    componentWillUnmount() {
        this.socket.UnregisterUsersListener(this.usersListenerFunction)
    }

    usersListenerFunction = (response) => {
        console.log(response.payload)
        this.props.setAllUsers(response.payload)
    }

    switchTab = (e) => {
        const value = e.target.value
        this.setState((prevState) => ({
            ...prevState,
            currentTab: value
        }))
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
                                        type="Users"/>
                                </div>
                            )
                        }
                        {
                            currentTab === 'tab2' && (
                                <div id="friends" class="users__tab-panel">
                                    <Users 
                                        type="Friends"
                                        filteredUsers={currentUser.friends}
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

const mapStateToProps = (state) => ({
    users: state.users.allUsers,
    currentUser: state.user.currentUser
})

const mapDispatchToProps = {
    setAllUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
