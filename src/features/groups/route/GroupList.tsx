import React, {useState, useEffect } from 'react'
import { RiAddLine } from 'react-icons/ri';
import { UseGetGroups } from '../api/getGroup';
import { ICON_MAP } from '@/data/iconMap';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { GroupAttributes } from '../type';

interface Props {
    showModalHandler:  (show: boolean) => void
    selectGroupHandler: (e: GroupAttributes) => void
}

const GroupList = ({
    showModalHandler,
    selectGroupHandler
    }: Props) => {

    const [selectedGroup, setSelectedGroup] = useState('')
    const { groups, isLoading } = UseGetGroups()

    const setSelectedGroupHandler = (group: GroupAttributes) => {
        setSelectedGroup(group.id)
        selectGroupHandler(group)
    }


    useEffect(() => {
        if(groups && groups.length > 0){
            let firstElement = groups[0];
            setSelectedGroup(firstElement.id)
            selectGroupHandler(firstElement)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (isLoading) return <FullScreenLoader/>


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
                    groups?.map((group) => (
                        <React.Fragment key={group.id}>
                            <input
                                type="radio"
                                name="event-list"
                                className="event-list__input"
                                id={group.id}
                                value={group.id}
                                onChange={() => setSelectedGroupHandler(group)}
                                checked={ selectedGroup === group.id}
                            />
                            <label 
                                className="event-list__item" 
                                htmlFor={group.id}
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

export default GroupList
