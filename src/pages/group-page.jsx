import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GroupDetails from '../components/groups/group-details.component'
import GroupList from '../components/groups/group-list.component'
import Modal from '../components/modal.component'
import GroupForm from '../components/groups/group-form.component'


class GroupPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            currentSelected: null
        }
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


export default GroupPage


