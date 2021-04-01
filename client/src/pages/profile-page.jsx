import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ProfileCard from '../components/profile/profile-card.component'
import Posts from '../components/posts.component'

class ProfilePage extends Component {
    static propTypes = {
        currentUser: PropTypes.object
    }

    

    render() {
        const { currentUser } = this.props;
        console.log(currentUser.posts)

        const filteredPosts = this.props.posts.filter((post) => {
            if (currentUser.posts.includes(post._id)) {
                return post
            }else{
                return false
            }
        })

        return (
            <div className="profile-page">
                <aside className="profile-page__aside">
                    <ProfileCard
                        currentUser={currentUser}
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
                    <span className="header post-header">
                        Your Posts
                    </span>
                    <Posts
                        posts={filteredPosts}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
    posts: state.posts
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
