import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ProfileCard from '../components/profile/profile-card.component'
import Posts from '../components/posts.component'
import { populate } from 'react-redux-firebase'

const populates = [
	{
		child: 'user',
		root: 'users'
	}
]

class ProfilePage extends Component {
    static propTypes = {
        currentUser: PropTypes.object
    }

    render() {
        const { currentUser } = this.props;
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
                        currentUser={currentUser}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const postsRecord = populate(state.firestore, 'posts', populates);
    let posts = []
    if (postsRecord) {
        for (let key in postsRecord) {
            if (postsRecord[key]) {
                posts.push({
                    _id: key,
                    ...postsRecord[key]
                })
            }

        }
        posts.sort(function (a, b) {
            return b.createdAt.seconds - a.createdAt.seconds
        })
    }
    return {
        posts
    }
}

export default connect(mapStateToProps, null)(ProfilePage)
