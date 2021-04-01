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
import Socket from '../services/chat-client';
import { loadPosts } from '../redux/posts/post.actions';
import { toast } from 'react-toastify';
import { getCurrentUserMessages } from '../redux/message/message.action';
import {
	getAllEvents
} from '../redux/events/event.action';
import { getAllGroups } from '../redux/groups/group.action'

/**
 *
 * 
 * @class HomePage
 * @extends {Component}
 * @returns {JSX}
 */
class HomePage extends Component {

	componentDidMount(){
		this.socket = new Socket()
		this.props.getAllGroups()
		this.props.getAllEvents()
		this.socket.changePostListener(this.updatePosts)
		this.socket.MessagesListener(this.updateMessages)
	}

	componentWillUnmount(){
	}

	updateMessages = () => {
		this.props.getCurrentUserMessages()
	}

	updatePosts = (props) =>{
		this.props.loadPosts(props.payload)
	}

	render() {

		const currentUser = this.props.currentUser
		const isAuthenticated = this.props.isAuthenticated
		return (
			<div className="home-page">
				<div className="home-page__aside left" >
					<Movie/>
					<SuggestedPeople/>
					<NewBirthday/>
				</div>
				<div className="home-page__center" >
					<AddPost currentUser={currentUser}/>
					<Posts 
						isAuthenticated={isAuthenticated}
						currentUser={currentUser}
						posts={this.props.posts}
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
	loadPosts: PropTypes.func,
	getAllEvents: PropTypes.func,
	getAllGroups: PropTypes.func
}

const mapStateToProps = (state) => ({
	currentUser: state.user.currentUser,
	posts: state.posts,
	isAuthenticated: state.user.authenticated
})

const mapDispatchToProps = {
	loadPosts,
	getCurrentUserMessages,
	getAllEvents,
	getAllGroups

}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);