import React, { Component } from 'react';
import {createGroup, 
    getAllGroups, 
    joinGroup, 
    leaveGroup, 
    deleteGroup, 
    getGroupById} from "../../nodeserver/node.utils";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import ModalWindow from "../modal-window/modal-window.component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class Group extends Component {
    state={
        name:"",
        category:"",
        showModal: false

    }
    componentDidMount(){
      this.props.getAllGroups()
    }

    getGroupById = (groupId) =>{
      getGroupById(groupId)
  
    }
    getDate = (e) =>{
        let date = new Date(e)     
        this.setState({date: date})
    }

    toggleModal = (showModal) =>{
      this.setState({showModal: showModal},
        ()=>this.props.getAllGroups())
    }

    onChangeHandle = (e) =>{
        this.setState({[e.target.name]:e.target.value })
    }

    onSubmitHandler = (e) =>{
      e.preventDefault()
      const group = this.state
      this.props.createGroup(group)
      this.setState({showModal:false})
        
    }
    
  render() {
    const{
      allGroups, 
      currentUser,
      deleteGroup,
      joinGroup,
      leaveGroup,
          } = this.props
    const {name, category} = this.state;
    console.log(currentUser.username);
    
    return (
      <div className="event">  
        <button className="add-button" onClick={()=> this.toggleModal(true) } >Add Group</button>
        {allGroups && 
          <ul>
            {allGroups.map((group, i)=>(
              <div key={i} className="card__container">
                <div className="card__content">
                    <div className="card__text-content">
                    {
                      group.members.includes(currentUser.username) ?
                        <Link  
                          to={`/group/${group._id}`} 
                          onClick={this.getGroupById(group._id)}>
                            <h1 className="primary-header">{group.name}</h1>
                        </Link>:
                        <h1 className="primary-header">{group.name}</h1>
                    }
                      <h3 className="card__date-time">
                        <span>Category:{group.category}</span>
                      </h3>
                      <ul>
                        <h3>Attenders</h3>
                        {group.members.map((member)=>(
                          <li>{member}</li>
                        ))}
                      </ul>
                    </div>
                    { group.members.includes(currentUser.username) ?
                    <button className="card__join-button" onClick={() =>leaveGroup(group._id)}>
                          Leave Group
                        </button>                        
                        : <button className="card__join-button" onClick={() =>joinGroup(group._id)}>
                          <span >Join Group</span>
                        </button>
                    }
                </div>
              </div>
            ))
          }
        </ul>
        }
        {this.state.showModal && 
            <ModalWindow closeHandler={this.toggleModal} >
              <form onSubmit={this.onSubmitHandler}>
                <label className="group__label" for="name">Group Name</label>
                <input 
                  type="text" 
                  className="group__input" 
                  onChange={this.onChangeHandle} 
                  value={name} name="name" placeholder="Group name..."/>
                <label className="group__label" for="category">Category</label>
                <input 
                  type="text" 
                  className="group__input" 
                  name="category" 
                  value={category}
                  onChange={this.onChangeHandle} />
                <input 
                  type="submit" 
                  className="form-submit-button"
                  placeholder="Group category..." 
                  value="Submit"/>
              </form>
          </ModalWindow>
        }
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) =>({
  createGroup: group => dispatch(createGroup(group)),
  joinGroup: group => dispatch(joinGroup(group)),
  leaveGroup: group => dispatch(leaveGroup(group)),
  getAllGroups: () => dispatch(getAllGroups()),
  deleteGroup: () => dispatch(deleteGroup()),


})


const mapStateToProps = state =>({
  allGroups: state.groups.groups,
  currentUser:state.user.currentUser

})
export default connect(mapStateToProps, mapDispatchToProps)(Group)
