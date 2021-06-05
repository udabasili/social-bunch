import React, {useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RiAddLine } from 'react-icons/ri';
import { ICON_MAP } from '../icons-map';
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux';

const groupPopulates = [{
        child: 'members',
        root: 'users'
    },
    {
        child: 'createdBy',
        root: 'users'
    }
]

const GroupList = ({
    showModalHandler,
    groups,
    selectGroupHandler
    }) => {

    const [selectedGroup, setSelectedGroup] = useState('')
    const setSelectedGroupHandler = (e) => {
        setSelectedGroup(e.target.value)
        selectGroupHandler(e.target.value)
    }

    useEffect(() => {
        
        if(groups.length > 0){
            let firstElement = groups[0];
            setSelectedGroup(firstElement._id)
            selectGroupHandler(firstElement._id)
        }

    }, [])

    return (
        <div className="event-list">
            <button  
                onClick={() => showModalHandler(true)}
                className="event-list__add button--wide button">
                    <span className='icon'>
                        <RiAddLine/>
                    </span>
                    <span>Add</span>
            </button>
            <div className="event-list__list">
                {
                    groups.map((group) => (
                        <React.Fragment key={group._id}>
                            <input
                                type="radio"
                                name="event-list"
                                className="event-list__input"
                                id={group._id}
                                value={group._id}
                                onChange={setSelectedGroupHandler}
                                checked={ selectedGroup === group._id}
                            />
                            <label 
                                className="event-list__item" 
                                htmlFor={group._id}
                                >
                                <span className='icon'>
                                    {
                                        ICON_MAP[group.category]
                                    }
                                </span>
                                <span className='event-name'>
                                    {group.groupName}
                                </span>
                            </label>
                        </React.Fragment>
                        
                    ))
                }
            </div>
        </div>
    )
}

GroupList.propTypes = {
    showModalHandler: PropTypes.object,
    groups: PropTypes.array,
    selectGroupHandler: PropTypes.any
}

const mapStateToProps = (state) => {
    let data = state.firestore.data.groups
    let groups = [];
    if (data) {
        for (let key in data) {
            groups.push({
                _id: key,
                ...data[key]
            })
        }
    }

    return {
        groups
    }
}


export default compose(
    firestoreConnect((props) => [{
            collection: 'groups',
            populates: groupPopulates        
        }
    ]),
    connect(mapStateToProps, null)
)(GroupList);
