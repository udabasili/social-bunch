import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeAside from '../components/home-aside.component';
import UserListItem from "../components/user-list-item.component";
import { getAllUsers, addFriend, removeFriend } from '../redux/action/user.action';

class UsersPage extends Component {

    state = {
        searchItem: "",
        filteredUserData: [],
        users: "",
    }
   
    /**
     * show users that have the input typed in as part of their character
     */
    searchUsersHandler = (e) => {
        this.setState({ searchItem: e.target.value }, () => {
            this.setState({
                filteredUserData: this.props.allUsers.filter((user) => {
                    return user.username.toLowerCase().includes(this.state.searchItem.toLowerCase())
                })
            })
        })

    }

    onSubmitHandler = (e) => {
        e.preventDefault()
        const event = this.state
        this.props.addEvent(event)
        this.setState({ showModal: false })
    }

    render() {
        let { filteredUserData, searchItem } = this.state;
        return (
            <HomeAside>
                <h1 className='secondary-header'>Users</h1>
                <div className="users">
                        <input type="search"
                            placeholder="Search for Users....."
                            onChange={this.searchUsersHandler}
                            className="form__input" ></input>
                    <div class="user__list">
                        {(filteredUserData && searchItem) &&
                            filteredUserData.map((user, i) => (
                                <UserListItem key={i}
                                    addFriend={this.props.addFriend}
                                    removeFriend={this.props.removeFriend}
                                    user={user} />
                            ))
                        }
                    </div>
                </div>
            </HomeAside>
            
        );
    }
}
const mapDispatchToProps = (dispatch) => ({
    getAllUsers: () => dispatch(getAllUsers()),
    addFriend: (addedUserId) => dispatch(addFriend(addedUserId)),
    removeFriend: (addedUserId) => dispatch(removeFriend(addedUserId)),


})

const mapStateToProps = (state) => ({
    allUsers: state.user.users,
    currentUser: state.user.currentUser

})

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);