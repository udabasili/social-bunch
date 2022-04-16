import { IoCloseCircleSharp } from 'react-icons/io5';
import { GrFormLocation } from 'react-icons/gr';
import { UseGetUserById } from '../api/getUserById';
import { Loader } from '@/components/Elements';

interface UserSummaryProps {
    selectedUser: string
    showAllUsers: (e: boolean) => void
}
const UserSummary = ({
    showAllUsers,
    selectedUser,
    }: UserSummaryProps) => {

    const { user, isLoading } = UseGetUserById(selectedUser)

    if (isLoading) return <Loader/>
  

    return (
        <div className="user-summary">
            <div className="user-summary__button">
                <IoCloseCircleSharp onClick={() => showAllUsers(true)}/>
            </div>
            {
                user ? 
                    <div className="user-summary__user">
                        <img 
                            src = {
                                user.image || "https://img.icons8.com/ios/50/000000/user-male-circle.png"
                            }
                            className="user-photo"
                            alt={user.username}/>
                        <span className="username">
                            {user.username}
                        </span>
                        <span className="location">
                            <GrFormLocation/>
                            {user.location}
                        </span>
                    </div>
                :
                <Loader/>
            }
        </div>
    )
}


export default UserSummary
