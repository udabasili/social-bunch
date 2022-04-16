import { useAuth } from '@/lib/auth'
import useGetPosts from '@/features/posts/api/getPosts'
import { Loader } from '@/components/Elements'
import ProfileCard from '../components/profileCard'
import { MainLayout } from '@/components/Layout/MainLayout'




export const UserProfile = () => {

    const { currentUser} = useAuth()
    const {isLoading} = useGetPosts()

    if(isLoading) return <Loader/>

    
    return (
        <MainLayout>
            <div className="profile-page">
            <aside className="profile-page__aside">
                <ProfileCard
                />
            </aside>
            <div className="profile-page__main">
                <div className="profile-page__bio">
                    <span className="header">
                        Hello, this is {currentUser.username}
                    </span>
                    <p className="description">
                        {currentUser.bio}
                    </p>
                </div>
              
               
            </div>
        </div>
        </MainLayout>
        
    )
}

