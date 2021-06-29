import React, { Component } from 'react'; 
import AddPost from '../components/add-post-box.component';
import NewBirthday from '../components/new-birthday.component';
import PagesSummary from '../components/pages-summary.component';
import Posts from '../components/posts.component';
import StoriesSummary from '../components/stories-summary.component';
import SuggestedPeople from '../components/suggested-people.component';
import Movie from '../components/movie.component';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { firestoreConnect, populate } from 'react-redux-firebase'
import { compose } from 'redux';


const populates = [
	{
		child: 'user',
		root: 'allUsers'
	}
]

/**
 *
 * 
 * @class HomePage
 * @extends {Component}
 * @returns {JSX}
 */
class HomePage extends Component {

	render() {
        const { currentUser, isAuthenticated, users} = this.props;
		let posts = []
		if (Object.keys(this.props.posts).length > 0) { 
			for (let key in this.props.posts) {
				if (this.props.posts[key]){
					posts.push({
						_id: key,
						...this.props.posts[key]
					})
				}
				
			}
			posts.sort(function (a, b){
				return b.createdAt.seconds - a.createdAt.seconds
			})
		}
		return (
			<div className="home-page">
				<div className="home-page__aside left" >
					<Movie/>
					<SuggestedPeople users={users}/>
					<NewBirthday/>
				</div>
				<div className="home-page__center" >
					<AddPost currentUser={currentUser}/>
					<Posts 
						isAuthenticated={isAuthenticated}
						currentUser={currentUser}
						posts={posts}
					/>
				</div>
				<div className="home-page__aside" >
					<StoriesSummary/>
					<PagesSummary/>
				</div>
			</div>
		);
	}
}

HomePage.propTypes = {
	currentUser: PropTypes.object,
	isAuthenticated: PropTypes.bool,
	posts: PropTypes.object,
}

const mapStateToProps = (state) => {
    const usersRecord = state.firestore.data.allUsers;
    let users = [];
    if (usersRecord) {
        
        for (let key in usersRecord) {
            users.push({
                _id: key,
                ...usersRecord[key]
            })
        }
    }
	return {
		posts: populate(state.firestore, 'posts', populates) || {},
        users
	}
	
}

export default compose(
	firestoreConnect((props) => [
		{
			collection: 'users',
            storeAs: 'allUsers'
		}
	 ]),
	connect(mapStateToProps, null)
)(HomePage);