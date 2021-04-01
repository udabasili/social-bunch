import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GroupDetails from '../components/groups/group-details.component'
import GroupList from '../components/groups/group-list.component'
import Modal from '../components/modal.component'
import GroupForm from '../components/groups/group-form.component'
import { getAllGroups, setGroups } from '../redux/groups/group.action'
import Socket from '../services/chat-client';

class GroupPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            currentSelected: null
        }
    }

    socket = new Socket()

    static propTypes = {
        setGroups: PropTypes.func
    }

    componentDidMount() {
         this.socket.groupsListener(this.groupListenerFunction)
    }

     componentWillUnmount() {
        this.socket.UnregisterGroupsListener(this.groupListenerFunction)
    }

    groupListenerFunction = (response) => {
        this.props.setGroups(response.payload)
    }

    showModalHandler = (show) => {
        this.setState((prevState) => ({
            ...prevState,
            showModal: show
        }))
    }

    selectGroupHandler = (groupId) =>{
        this.setState((prevState) => ({
            ...prevState,
            currentSelected: groupId
        }))
    }

    render() {
        const { showModal, currentSelected } = this.state;
        return (
            <div className='events-page'>
                {
                    showModal && (
                        <Modal>
                            <GroupForm
                                showModalHandler={this.showModalHandler}
                            />
                        </Modal>
                    )
                }
                <GroupList
                    showModalHandler={this.showModalHandler}
                    selectGroupHandler={this.selectGroupHandler}
                    />
                <GroupDetails
                    groupId={currentSelected}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    getAllGroups,
    setGroups
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupPage)

