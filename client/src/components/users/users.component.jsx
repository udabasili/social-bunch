import React, { Component } from 'react';
import {connect} from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserListItem from "../../components/user-list-item/user-list-item.component";
import { getAllUsers, sendFriendRequest} from '../../redux/action/user.action';


class Users extends Component {
    state={
        searchItem:"",
        filteredData:[],
        users:"",
    }

    componentDidMount(){
      this.props.getAllUsers()
    }

  

    searchUsersHandler = (e) =>{
        this.setState({searchItem:e.target.value },()=>{
            this.setState({filteredData: this.props.allUsers.filter((user)=>{
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
    let {filteredData, searchItem} = this.state
    const {allUsers, currentUser} = this.props
    return (
      <div className="users">
        <div className="search-box">
            <input type="search" 
                placeholder="Search for Users....." 
                onChange={this.searchUsersHandler}
                className="search-box__input" ></input>
            <FontAwesomeIcon  className="search-box__icon" icon={faSearch}/>
        </div> 
        {(filteredData && searchItem)  &&
          <ul className="item-list">
            {filteredData.map((data, i)=>(
              <UserListItem key={i} 
                sendFriendRequest={this.props.sendFriendRequest} 
                userData={data} />
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