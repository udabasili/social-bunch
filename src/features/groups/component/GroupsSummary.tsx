import { NavLink } from 'react-router-dom'
import { ICON_MAP } from '@/data/iconMap';
import { UseGetGroups } from '../api/getGroup';
import { Loader } from '@/components/Elements';


function GroupsSummary() {
    
    const { groups, isLoading } = UseGetGroups()

    if (isLoading) return <Loader/>

    return (
        <div className="pages-summary home-card">
            <div className="home-card__header">
                Suggested Groups
            </div>
            <ul className="home-card__list">
                {
                    
                        groups?.filter((group, i) => i < 3).map((group) => (
                            <li className="home-card__item" key={group.id}>
                                <span className='icon'>
                                    {
                                        ICON_MAP[group.category]
                                    }
                                </span>
                                <span className="username">
                                    {group.groupName}
                                </span>
                            </li>
                        ))
                    
                }
            </ul>
            <NavLink className="notification-dropdown__footer" to='/groups' >
                View All
            </NavLink>
        </div>
    )
}

export default GroupsSummary
