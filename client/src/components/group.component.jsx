import React, { Component } from 'react';
import {createGroup, 
    getAllGroups, 
    joinGroup, 
    leaveGroup, 
    deleteGroup, 
    getGroupMembersById} from '../redux/action/group.action';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import ModalWindow from './modal-window.component';
import HomeAside from './home-aside.component';
import FormInput from './form-input.component';
import { isMobile } from 'react-device-detect';


/**
  * @desc handles showing the adding of group by user, leaving, joining and deleting groups 
  * @author Udendu Abasili

*/

class Group extends Component {
    state={
        name:'',
        category:'',
        showModal: false
    }

    componentDidMount(){
      this.props.getAllGroups()
    }

    getGroupMembersById = (groupId) =>{
      this.props.getGroupMembersById(groupId)
  
    }

    getDate = (e) =>{
        let date = new Date(e)     
        this.setState({date: date})
    }

    /**
     * show or hide modal component
     * @param {string} showModal 
     */
    toggleModal = (showModal) =>{
      this.setState({showModal: showModal})
    }


    onChangeHandle = (e) =>{
        this.setState({[e.target.name]:e.target.value })
    }


    onSubmitHandler = (e) =>{
      e.preventDefault()
      const group = this.state
      this.props.createGroup(group)
      this.setState({
        showModal:false,
        name:'',
        category:'',
      })
    }
    

  	render() {
		const {
		allGroups, 
		currentUser,
		joinGroup,
		leaveGroup } = this.props
    const {name, category} = this.state;
    
    return (
		<HomeAside>
			<div className='group'>  
				<h1 className='secondary-header'>Groups</h1>
				<button className='add-button' onClick={()=> this.toggleModal(true) } >Add</button>
				{ allGroups && 
					<React.Fragment>
						<hr />
						<p className='list-group-item-info'> Click on title after joining to enter Room</p>
						<ul className='group__list'>
							{allGroups.map((group, i)=>(
							<div key={i} className='card'>
									{
									group.members.includes(currentUser.username) ?
										<Link  
											to={{
													pathname: `/groups/${group._id}`,
													state:{groupName: group.name}
												}}
											
										onClick={this.getGroupMembersById(group._id)}>
											<h1 className='card__header'>{group.name}</h1>
										</Link>:
										<h1 className='card__header'>{group.name}</h1>
									}
									<div className="card__details">
										<div className="card__item group-card">
											<span className="label">Category: </span>
											<span className="data"> {group.category} </span>
										</div>
										{group.members.includes(currentUser.username) ?
											<button className='form-submit-button' onClick={() => leaveGroup(group._id)}>
												Leave
											</button> :
											<button className='form-submit-button' onClick={() => joinGroup(group._id)}>
												<span >Join</span>
											</button>
										}
									</div>
								</div>
							))}
						</ul>
					</React.Fragment>
				}
				{this.state.showModal && 
					<ModalWindow closeHandler={this.toggleModal} >
					<form onSubmit={this.onSubmitHandler}>
						<FormInput
							label='Group Name'
							name='name'
							handleChange={this.onChangeHandle}
							type='text'
							isMobile={isMobile}
							value={name}
							placeholder='Group name...'
							required />
						<FormInput
							label='Category'
							name='category'
							handleChange={this.onChangeHandle}
							type='text'
							isMobile={isMobile}
							value={category}
							placeholder='Group Category'
							required />  
						<input 
						type='submit' 
						className='form-submit-button'
						placeholder='Group category...' 
						value='Submit'/>
					</form>
				</ModalWindow>
				}
			</div>
		</HomeAside>
    );
  }
}

const mapDispatchToProps = (dispatch) =>({
  createGroup: group => dispatch(createGroup(group)),
  joinGroup: group => dispatch(joinGroup(group)),
  leaveGroup: group => dispatch(leaveGroup(group)),
  getAllGroups: () => dispatch(getAllGroups()),
  deleteGroup: () => dispatch(deleteGroup()),
  getGroupMembersById: (groupId) => dispatch(getGroupMembersById(groupId))
})


const mapStateToProps = state =>({
  allGroups: state.groups.groups,
  currentUser:state.user.currentUser

})
export default connect(mapStateToProps, mapDispatchToProps)(Group)
