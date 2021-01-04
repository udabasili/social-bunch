import React, { Component } from 'react'
import { connect } from 'react-redux'
import {  getPosts,loadPosts } from '../redux/action/post.actions';
import PostForm from '../components/post-form.component';
import Post from '../components/post.component';
import { changePostListener , UnregisterChangePostListener } from '../services/socketIo';

class FeedPage extends Component {
  state = {
    showModal: false,
    editMode: false,
    posts: null,
  };

  componentDidMount() {
    changePostListener(this.changePostHandler)

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.posts !== this.props.posts) {
      this.setState((prevState, props) => ({
        ...prevState,
        posts: props.posts,
      }));
    }
  }

  componentWillUnmount() {
    UnregisterChangePostListener()
  }

  onChangeText = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      post: e.target.value,
    }));
  };

  changePostHandler = (data) => {
    if (data.action === "updatedPosts") {
      this.props.loadPosts(data.updatedPost);
      return;
    }
  }

  editPostHandler = (value) => {
    this.setState((prevState) => ({
      ...prevState,
      showModal: true,
      editMode: true,
      currentPost: value,
    }));
  };


  modalShowHandler = (value) => {
    this.setState((prevState) => ({
      ...prevState,
      showModal: value,
    }));
  };

  render() {
    const {
      showModal,
      editMode,
      currentPost,
	} = this.state;
	
	const { currentUser, posts } = this.props
    return (
		<section className="feed-section">
			{showModal && (
				<PostForm
				editMode={editMode}
				currentPost={currentPost}
				showModalHandler={this.modalShowHandler}
				/>
			)}
			<div
			className="post-box"
			>
			<textarea
				placeholder="Add Post"
				maxLength={0}
				onClick={() => this.modalShowHandler(true)}
				className="post-box__inner"
				required
			/>
			</div>
			<div className='posts'>
			{posts ? (
				posts.map((p, index) => {
				return (
				<Post
					key={index}
					post={p}
					showSnack={this.showSnackHandler}
					editPostHandler={this.editPostHandler}
					currentUser={currentUser}
				/>
				)
			})
			) : (
			<div></div>
			)}
			</div>          
		</section>
    );
  }
}

const mapStateToProps = (state) => ({
    posts: state.posts
})

const mapDispatchToProps = (dispatch) => ({
    getPosts : () => dispatch(getPosts()),
    loadPosts: (posts) => dispatch(loadPosts(posts)),
})
 
export default connect(mapStateToProps, mapDispatchToProps)(FeedPage)