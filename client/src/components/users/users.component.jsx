import React, { Component } from 'react';
import {connect} from "react-redux";
import UserListItem from "../../components/user-list-item/user-list-item.component";
import { getAllUsers, sendFriendRequest} from '../../redux/action/user.action';

 

class Users extends Component {
    state={
        searchItem:"",
        filteredUserData:[],
        users:"",
    }

    componentDidMount(){
      this.props.getAllUsers()
    }
    //filter the search based on input
    searchUsersHandler = (e) =>{
        this.setState({searchItem:e.target.value },()=>{
            this.setState({filteredUserData: this.props.allUsers.filter((user)=>{
                return user.username.toLowerCase().includes(this.state.searchItem.toLowerCase())
                })
            })
        })

    }

    onSubmitHandler = (e) =>{
      e.preventDefault()
      const event = this.state
      this.props.addEvent(event)
      this.setState({showModal:false})
        
    }
    
  render() {
    let {filteredUserData, searchItem} = this.state

    return (
      <div className="users">
        <div className="search-box">
            <input type="search" 
                placeholder="Search for Users....." 
                onChange={this.searchUsersHandler}
                className="search-box__input" ></input>
        </div> 
        {(filteredUserData && searchItem)  &&
          <ul className="item-list">
            {filteredUserData.map((user, i)=>(
              <UserListItem key={i} 
                sendFriendRequest={this.props.sendFriendRequest} 
                user={user} />
            ))
          }
        </ul>
        }
        
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) =>({
  getAllUsers: () => dispatch(getAllUsers()),
  sendFriendRequest: (addedUserId) => dispatch(sendFriendRequest(addedUserId))

})

const mapStateToProps = (state) =>({
    allUsers: state.user.users,
    currentUser:state.user.currentUser,

  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(Users);