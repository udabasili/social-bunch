import { PostActionTypes } from "../actionType/post.actionType";
import { addError, removeError } from "./errors.action";
import { setCurrentUser } from "./user.action";
// import { addError, removeError } from "../error/error.actions";
const { restApi } = require("../../services/api")

export const loadPosts = (posts) =>({
    type: PostActionTypes.GET_POSTS,
    payload: posts
})

export const addPost = (text) => (dispatch, getState) => {
  const { user } = getState();
  const id = user.currentUser._id
    return restApi("post", `/user/${id}/posts/create-post`, {text})
      .then((response) => {
            dispatch(removeError())
            dispatch(loadPosts(response));
          })
      .catch((err) => dispatch(addError(err.message)));
};

export const editPost = (updatedPost, postId) => (dispatch, getState) => {
  const { user } = getState();
  const id = user.currentUser._id
  return restApi("put", `/user/${id}/posts/${postId}/edit`, {
      updatedPost
    })
    .then((response) => {
      dispatch(removeError())
      dispatch(loadPosts(response));
    })
    .catch((err) => dispatch(addError(err.message)));
};

export const deletePost = (postId) => (dispatch, getState) => {
  const {user} = getState();
  const id = user.currentUser._id
  return restApi("delete", `/user/${id}/posts/${postId}/delete`)
    .then((response) => {
      dispatch(removeError())
      dispatch(loadPosts(response));
    })
    .catch((err) => dispatch(addError(err.message)));
};


export const getPosts = () => (dispatch, getState) => {
   const {
     user
   } = getState();
   const id = user.currentUser._id
        return restApi("get", `/user/${id}/posts`)
          .then((response) => {
            dispatch(removeError())
            dispatch(loadPosts(response));
            return response
          })
          .catch((err) => {
              console.log(err)
          });
      
};


export const addCommentToPost = (commentContent, postId) => (dispatch, getState) => {
  const {
    user
  } = getState();
  const id = user.currentUser._id
    return restApi('post', `/user/${id}/posts/${postId}/comment/add`, commentContent)
      .then((response) => {
          dispatch(removeError())
          return (response);
        })
        .catch((err) => {
          dispatch(addError(err.message))
          console.log(err)
        });
  
}

export const addLikeToPost = (likedBy, postId) => (dispatch, getState) => {
  const {
    user
  } = getState();
  const id = user.currentUser._id
    dispatch(removeError())
    return restApi('post', `/user/${id}/posts/${postId}/like`, {
      likedBy
    })
      .then((response) => {
        return (response);
      })
      .catch((err) => {
        console.log(err)
      });
  
}

export const editComment = (comment, postId, commentId) => (dispatch, getState) => {
  const {
    user
  } = getState();
  const id = user.currentUser._id
  console.log(postId, commentId, comment)
  return restApi("post", `/user/${id}/posts/${postId}/comment/${commentId}/edit`, {
      comment
    })
    .then((response) => {
      dispatch(removeError())
      dispatch(loadPosts(response.posts));
    })
    .catch((err) => dispatch(addError(err.message)));
};

export const deleteComment = (postId, commentId) => (dispatch, getState) => {
  const {
    user
  } = getState();
  const id = user.currentUser._id
  console.log(id)
  return restApi("delete", `/user/${id}/posts/${postId}/comment/${commentId}/remove`)
    .then((response) => {
      dispatch(removeError())
      dispatch(loadPosts(response.posts));
    })
    .catch((err) => dispatch(addError(err.message)));
};

export const addReplyToComment = (reply, postId, commentId) => (dispatch, getState) => {
  const {
    user
  } = getState();
  const id = user.currentUser._id
  return restApi("post", `/user/${id}/posts/${postId}/comment/${commentId}/add-reply`, {
      reply
    })
    .then((response) => {
      dispatch(removeError())
      dispatch(loadPosts(response.posts));
    })
    .catch((err) => dispatch(addError(err.message)));
};


export const addLikeToComment = (likedBy, postId, commentId) => (dispatch, getState) => {
  const {
    user
  } = getState();
  const id = user.currentUser._id
  return restApi("put", `/user/${id}/posts/${postId}/comment/${commentId}/like`, {
      likedBy
    })
    .then((response) => {
      dispatch(removeError())
      dispatch(loadPosts(response.posts));
    })
    .catch((err) => dispatch(addError(err.message)));
};

export const removeLikeFromComment = (likedBy, postId, commentId) => (dispatch, getState) => {
  const {
    user
  } = getState();
  const id = user.currentUser._id
  return restApi("put", `/user/${id}/posts/${postId}/comment/${commentId}/unlike`, {
      likedBy
    })
    .then((response) => {
      dispatch(removeError())
      dispatch(loadPosts(response.posts));
    })
    .catch((err) => dispatch(addError(err.message)));
};